import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ResumeEditor } from '@/components/resume-editor';

export default async function ResumeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const resume = await prisma.resume.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!resume) {
    redirect('/dashboard/cv');
  }

  return (
    <ResumeEditor
      initialResume={{
        id: resume.id,
        title: resume.title,
        summary: resume.summary,
        template: resume.template,
        content:
          resume.content && typeof resume.content === 'object'
            ? (resume.content as Record<string, any>)
            : {},
        updatedAt: resume.updatedAt.toISOString(),
      }}
    />
  );
}
