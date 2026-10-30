/**
 * Authorization decisions use only identity verified by Supabase Auth.
 * Never trust a userId, email or admin flag supplied in the request body/query.
 */
export type AuthenticatedUser = {
  id: string;
  email?: string | null;
};

export type ProjectOwner = {
  userId: string;
  userEmail: string;
};

export const isAdmin = (user: AuthenticatedUser): boolean => {
  const configuredAdminId = process.env.ADMIN_USER_ID;
  return Boolean(configuredAdminId && user.id === configuredAdminId);
};

export const canAccessProject = (
  user: AuthenticatedUser,
  project: ProjectOwner
): boolean =>
  isAdmin(user) ||
  project.userId === user.id ||
  (project.userId === "anonim" &&
    Boolean(user.email && project.userEmail === user.email));

/**
 * Supports existing legacy projects where userId was saved as "anonim",
 * but only when the caller's email is verified by Supabase Auth.
 */
export const projectAccessWhere = (user: AuthenticatedUser) => {
  if (isAdmin(user)) return {};

  return {
    OR: [
      { userId: user.id },
      ...(user.email ? [{ userId: "anonim", userEmail: user.email }] : []),
    ],
  };
};
