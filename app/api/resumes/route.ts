import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const resumeSchema = z.object({
  title: z.string().min(2).max(120).default('Mon CV'),
  summary: z.string().optional().default(''),
  content: z.unknown().optional().default({}),
  template: z.enum(['classic', 'modern', 'minimal']).default('classic'),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });

  try {
    const data = resumeSchema.parse(await request.json());
    const resume = await prisma.resume.create({
      data: { userId: session.user.id, title: data.title, summary: data.summary, content: data.content as object, template: data.template },
    });
    return NextResponse.json(resume, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ message: 'Erreur lors de la création du CV' }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  const resumes = await prisma.resume.findMany({ where: { userId: session.user.id }, orderBy: { updatedAt: 'desc' } });
  return NextResponse.json(resumes);
}
