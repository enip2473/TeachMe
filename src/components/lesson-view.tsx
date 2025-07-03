'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Edit } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuthContext } from '@/hooks/use-auth-context';
import { Lesson, Course } from '@/lib/types';
import { Button } from '@/components/ui/button';

type LessonViewProps = {
  lesson: (Lesson & { courseTitle: string; courseId: string }) | null;
  course: Course | null;
};

export function LessonView({ lesson, course }: LessonViewProps) {
  const { user } = useAuthContext();

  if (!user) {
    return <div>Please sign in to view this lesson.</div>;
  }

  if (!lesson || !course) {
    return notFound();
  }

  const canEdit = user.uid === course.ownerId;

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-6">
        <Link href={`/courses/${lesson.courseId}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Back to Course
        </Link>
        <div className="flex items-center text-sm text-muted-foreground mt-2">
          <span>{lesson.courseTitle}</span>
          <ChevronRight className="w-4 h-4" />
          <span>{lesson.title}</span>
        </div>
      </div>

      <article className="prose prose-lg dark:prose-invert max-w-none">
        <h1 className="font-headline">{lesson.title}</h1>
        {lesson.summary && <p className="lead">{lesson.summary}</p>}
        {lesson.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
        ))}
      </article>

      <Separator className="my-12" />

      {canEdit && (
        <div className="flex justify-end">
          <Link href={`/courses/${course.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" /> Edit Course Lessons
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}