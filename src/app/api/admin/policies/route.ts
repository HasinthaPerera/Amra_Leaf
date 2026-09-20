import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminApi } from '@/lib/auth';
import { logAuditActivity } from '@/lib/audit';

export async function GET() {
  const auth = await verifyAdminApi();
  if (auth.response) return auth.response;

  try {
    const policies = await prisma.policy.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    // To mimic previous mock data structure and sort, return array
    return NextResponse.json(policies.map(p => ({
      ...p,
      updatedDate: p.updatedAt.toISOString().split('T')[0],
      publishedDate: p.publishedAt ? p.publishedAt.toISOString().split('T')[0] : null
    })));
  } catch (error) {
    console.error('Error fetching policies:', error);
    return NextResponse.json({ error: 'Failed to fetch policies' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await verifyAdminApi();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    let { policyKey, title, category, version, content, status } = body;

    // Validation
    if (!policyKey || !policyKey.trim()) return NextResponse.json({ error: 'Policy Key is required' }, { status: 400 });
    if (!title || !title.trim()) return NextResponse.json({ error: 'Policy title is required' }, { status: 400 });
    if (!category || !category.trim()) return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    if (!version || !version.trim()) return NextResponse.json({ error: 'Version is required' }, { status: 400 });
    if (!content || !content.trim()) return NextResponse.json({ error: 'Content is required' }, { status: 400 });

    if (status !== 'DRAFT' && status !== 'PUBLISHED' && status !== 'ARCHIVED') {
      status = 'DRAFT';
    }

    policyKey = policyKey.trim();
    version = version.trim();

    // Check version format broadly, e.g. "1.0", "v1.0"
    if (!/^[vV]?\d+(\.\d+)?$/.test(version)) {
      return NextResponse.json({ error: 'Invalid version format (e.g. 1.0)' }, { status: 400 });
    }

    const newPolicy = await prisma.policy.create({
      data: {
        policyKey,
        title: title.trim(),
        category: category.trim(),
        version,
        content: content.trim(),
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      }
    });

    await logAuditActivity(auth.user.id, 'POLICY_CREATED', 'Policy', newPolicy.id);

    return NextResponse.json(newPolicy, { status: 201 });
  } catch (error: any) {
    console.error('Error creating policy:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A policy with this key and version already exists.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create policy' }, { status: 500 });
  }
}
