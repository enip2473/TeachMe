'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Edit } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuthContext } from '@/hooks/use-auth-context';
import { Lesson, Course } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { useEffect, useState } from 'react';

type LessonViewProps = {
  lesson: (Lesson & { courseTitle: string; courseId: string }) | null;
  course: Course | null;
};

export function LessonView({ lesson, course }: LessonViewProps){
  const { user } = useAuthContext();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lesson?.content) return;
    const fetchContent = async () => {
      try {
        const response = await fetch(lesson.content);
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error('Failed to fetch lesson content:', error);
        setContent('# Error\n\nCould not load lesson content.');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [lesson?.content]);

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

      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">{lesson.title}</h1>
        {lesson.summary && <p className="text-lg text-muted-foreground">{lesson.summary}</p>}
      </div>

      <article className="prose prose-lg dark:prose-invert max-w-none">
        {loading ? <p>Loading...</p> : <MarkdownRenderer content={content} />}
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