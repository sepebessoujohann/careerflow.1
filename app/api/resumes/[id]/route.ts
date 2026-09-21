import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const updateResumeSchema = z.object({
  title: z.string().min(2).max(120).optional(),
  summary: z.string().optional(),
  content: z.any().optional(),
  isPublic: z.boolean().optional(),
});

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }

  const resume = await prisma.resume.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!resume) {
    return NextResponse.json({ message: 'CV introuvable' }, { status: 404 });
  }

  return NextResponse.json(resume);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = updateResumeSchema.parse(body);

    const existing = await prisma.resume.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json({ message: 'CV introuvable' }, { status: 404 });
    }

    const updatedResume = await prisma.resume.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(updatedResume);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Erreur lors de la mise à jour du CV' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }

  const deleted = await prisma.resume.deleteMany({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (deleted.count === 0) {
    return NextResponse.json({ message: 'CV introuvable' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
