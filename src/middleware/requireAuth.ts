import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Request, Response, NextFunction } from "express";
import type { AuthenticatedUser } from "../security/projectAccess";

declare global {
  namespace Express {
    interface Request {
      authenticatedUser?: AuthenticatedUser;
    }
  }
}

let authClient: SupabaseClient | undefined;

const getAuthClient = (): SupabaseClient | undefined => {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return undefined;

  if (!authClient) {
    authClient = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }

  return authClient;
};

/** Validate the Supabase access token on every request, failing closed. */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const tokenMatch = /^Bearer\s+([^\s]+)$/i.exec(req.headers.authorization ?? "");

  if (!tokenMatch) {
    res.status(401).json({ success: false, error: "Oturum açmanız gerekiyor." });
    return;
  }

  const supabase = getAuthClient();
  if (!supabase) {
    res.status(503).json({
      success: false,
      error: "Sunucunun kimlik doğrulaması henüz yapılandırılmamış.",
    });
    return;
  }

  try {
    const { data, error } = await supabase.auth.getUser(tokenMatch[1]);

    if (error || !data.user) {
      res.status(401).json({ success: false, error: "Geçersiz veya süresi dolmuş oturum." });
      return;
    }

    req.authenticatedUser = { id: data.user.id, email: data.user.email };
    next();
  } catch {
    res.status(503).json({
      success: false,
      error: "Kimlik doğrulama hizmetine ulaşılamıyor.",
    });
  }
};
