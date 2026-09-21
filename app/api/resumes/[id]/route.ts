import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const updateResumeSchema = z.object({
  title: z.string().min(2).max(120).optional(),
  summary: z.string().optional(),
  content: z.unknown().optional(),
  template: z.enum(['classic', 'modern', 'minimal']).optional(),
  isPublic: z.boolean().optional(),
});

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });

  try {
    const existing = await prisma.resume.findFirst({ where: { id: params.id, userId: session.user.id } });
    if (!existing) return NextResponse.json({ message: 'CV introuvable' }, { status: 404 });
    const data = updateResumeSchema.parse(await request.json());
    const updated = await prisma.resume.update({ where: { id: params.id }, data: { ...data, content: data.content as object | undefined } });
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ message: 'Erreur lors de la mise à jour du CV' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  const deleted = await prisma.resume.deleteMany({ where: { id: params.id, userId: session.user.id } });
  if (!deleted.count) return NextResponse.json({ message: 'CV introuvable' }, { status: 404 });
  return NextResponse.json({ success: true });
}
