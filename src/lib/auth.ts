import crypto from 'crypto';
import { cookies } from 'next/headers';
import prisma from './prisma';

export const SESSION_COOKIE_NAME = 'session_token';
export const SESSION_EXPIRY_DAYS = 7;

/**
 * Computes SHA-256 hash of a raw session token.
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Creates a new secure session in database and sets HttpOnly cookie.
 */
export async function createSession(userId: string) {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
  });

  return { rawToken, expiresAt };
}

/**
 * Invalidate database session and clear HttpOnly cookie.
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (rawToken) {
    const tokenHash = hashToken(rawToken);
    await prisma.session.deleteMany({
      where: { tokenHash },
    });
  }

  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
    maxAge: 0,
  });
}

export type SafeUser = {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
  department: string;
  status: 'ACTIVE' | 'INACTIVE';
};

/**
 * Retrieves the currently authenticated user based on session cookie.
 * Rejects expired sessions and inactive users.
 * Never includes passwordHash.
 */
export async function getCurrentUser(): Promise<SafeUser | null> {
  try {
    const cookieStore = await cookies();
    const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!rawToken) {
      return null;
    }

    const tokenHash = hashToken(rawToken);

    const session = await prisma.session.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!session) {
      return null;
    }

    // Check expiration
    if (session.expiresAt <= new Date()) {
      await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
      return null;
    }

    // Check user status - inactive users MUST NOT be allowed
    if (session.user.status !== 'ACTIVE') {
      return null;
    }

    const { id, employeeId, name, email, role, department, status } = session.user;
    return {
      id,
      employeeId,
      name,
      email,
      role: role as 'ADMIN' | 'EMPLOYEE',
      department,
      status: status as 'ACTIVE' | 'INACTIVE',
    };
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

/**
 * Helper to enforce authentication.
 */
export async function requireAuthenticatedUser(): Promise<SafeUser | null> {
  const user = await getCurrentUser();
  return user;
}

/**
 * Helper to enforce admin authorization.
 */
export async function requireAdmin(): Promise<SafeUser | null> {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return null;
  }
  return user;
}
