import test from "node:test";
import assert from "node:assert/strict";
import {
  canAccessProject,
  isAdmin,
  projectAccessWhere,
} from "./projectAccess";

const owner = { id: "user-1", email: "owner@example.com" };
const stranger = { id: "user-2", email: "stranger@example.com" };

test("a regular user can access only their own project", () => {
  assert.equal(
    canAccessProject(owner, { userId: "user-1", userEmail: "owner@example.com" }),
    true
  );
  assert.equal(
    canAccessProject(stranger, { userId: "user-1", userEmail: "owner@example.com" }),
    false
  );
});

test("unverified email alone does not grant access to a project with an owner id", () => {
  assert.equal(
    canAccessProject(
      { id: "user-2", email: "owner@example.com" },
      { userId: "user-1", userEmail: "owner@example.com" }
    ),
    false
  );
});

test("legacy anonymous projects are accessible only by the verified email", () => {
  assert.equal(
    canAccessProject(owner, { userId: "anonim", userEmail: "owner@example.com" }),
    true
  );
  assert.equal(
    canAccessProject(stranger, { userId: "anonim", userEmail: "owner@example.com" }),
    false
  );
});

test("administrator status requires an explicitly configured user id", () => {
  const previousId = process.env.ADMIN_USER_ID;
  try {
    delete process.env.ADMIN_USER_ID;
    assert.equal(isAdmin(owner), false);
    process.env.ADMIN_USER_ID = "admin-id";
    assert.equal(isAdmin({ id: "admin-id" }), true);
    assert.equal(isAdmin(owner), false);
  } finally {
    if (previousId === undefined) delete process.env.ADMIN_USER_ID;
    else process.env.ADMIN_USER_ID = previousId;
  }
});

test("project database filters exclude other users", () => {
  const previousId = process.env.ADMIN_USER_ID;
  try {
    delete process.env.ADMIN_USER_ID;
    assert.deepEqual(projectAccessWhere(owner), {
      OR: [
        { userId: "user-1" },
        { userId: "anonim", userEmail: "owner@example.com" },
      ],
    });
  } finally {
    if (previousId === undefined) delete process.env.ADMIN_USER_ID;
    else process.env.ADMIN_USER_ID = previousId;
  }
});
