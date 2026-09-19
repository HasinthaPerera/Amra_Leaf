import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminApi } from '@/lib/auth';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await verifyAdminApi();
  if (auth.response) return auth.response;
  
  const { id } = await context.params;

  try {
    const policy = await prisma.policy.findUnique({
      where: { id },
      include: {
        acknowledgements: {
          include: {
            user: {
              select: {
                id: true,
                employeeId: true,
                name: true,
                email: true,
                department: true,
                status: true,
              }
            }
          },
          orderBy: { acknowledgedAt: 'desc' }
        }
      }
    });

    if (!policy) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...policy,
      updatedDate: policy.updatedAt.toISOString().split('T')[0],
      publishedDate: policy.publishedAt ? policy.publishedAt.toISOString().split('T')[0] : null
    });
  } catch (error) {
    console.error('Error fetching policy:', error);
    return NextResponse.json({ error: 'Failed to fetch policy' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await verifyAdminApi();
  if (auth.response) return auth.response;
  
  const { id } = await context.params;

  try {
    const existingPolicy = await prisma.policy.findUnique({ where: { id } });
    if (!existingPolicy) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
    }

    const body = await request.json();
    let { policyKey, title, category, version, content, status } = body;

    const isPublished = existingPolicy.status === 'PUBLISHED';

    // If currently PUBLISHED, prevent editing core fields
    if (isPublished) {
      if (
        (policyKey && policyKey !== existingPolicy.policyKey) ||
        (title && title !== existingPolicy.title) ||
        (content && content !== existingPolicy.content) ||
        (version && version !== existingPolicy.version)
      ) {
        return NextResponse.json({ error: 'Cannot modify core fields of a published policy. Create a new version instead.' }, { status: 400 });
      }
    }

    const updateData: any = {};

    if (policyKey !== undefined && !isPublished) {
      if (!policyKey.trim()) return NextResponse.json({ error: 'Policy Key is required' }, { status: 400 });
      updateData.policyKey = policyKey.trim();
    }
    if (title !== undefined && !isPublished) {
      if (!title.trim()) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
      updateData.title = title.trim();
    }
    if (category !== undefined) {
      if (!category.trim()) return NextResponse.json({ error: 'Category is required' }, { status: 400 });
      updateData.category = category.trim();
    }
    if (version !== undefined && !isPublished) {
      version = version.trim();
      if (!/^[vV]?\d+(\.\d+)?$/.test(version)) {
        return NextResponse.json({ error: 'Invalid version format (e.g. 1.0)' }, { status: 400 });
      }
      updateData.version = version;
    }
    if (content !== undefined && !isPublished) {
      if (!content.trim()) return NextResponse.json({ error: 'Content is required' }, { status: 400 });
      updateData.content = content.trim();
    }
    if (status !== undefined) {
      if (status !== 'DRAFT' && status !== 'PUBLISHED' && status !== 'ARCHIVED') {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      updateData.status = status;

      if (status === 'PUBLISHED' && existingPolicy.status !== 'PUBLISHED') {
        updateData.publishedAt = new Date();
      }
    }

    const updatedPolicy = await prisma.policy.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(updatedPolicy);
  } catch (error: any) {
    console.error('Error updating policy:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A policy with this key and version already exists.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update policy' }, { status: 500 });
  }
}
