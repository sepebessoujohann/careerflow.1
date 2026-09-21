import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateResumeSchema } from '@/lib/validators/resume';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
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

  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }

  const existing = await prisma.resume.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!existing) {
    return NextResponse.json({ message: 'CV introuvable' }, { status: 404 });
  }

  try {
    const body: unknown = await request.json();
    const parsed = updateResumeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: 'Données invalides',
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const updatedResume = await prisma.resume.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return NextResponse.json(updatedResume);
  } catch {
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour du CV' },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
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
