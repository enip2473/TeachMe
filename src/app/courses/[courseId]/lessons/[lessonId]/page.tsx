import { getLessonById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { AiSummary } from '@/components/ai-summary';
import { Separator } from '@/components/ui/separator';

export default function LessonPage({ params }: { params: { courseId: string, lessonId: string } }) {
  const lesson = getLessonById(params.courseId, params.lessonId);

  if (!lesson) {
    notFound();
  }

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
        {lesson.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
        ))}
      </article>

      <Separator className="my-12" />

      <AiSummary lessonContent={lesson.content} />
    </div>
  );
}
