import { NextResponse } from 'next/server';
import { verifyAdminApi } from '@/lib/auth';

export async function POST() {
  // Independent server-side session authorization check
  const { user, response } = await verifyAdminApi();
  if (response) {
    return response;
  }

  return NextResponse.json({
    success: true,
    message: 'Admin action successfully authorized',
    performedBy: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
}
