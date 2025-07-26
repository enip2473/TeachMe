'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Edit } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuthContext } from '@/hooks/use-auth-context';
import { Lesson, Course } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { useEffect, useState, useRef } from 'react';
import { QuizView } from './quiz-view';

type LessonViewProps = {
  lesson: (Lesson & { courseTitle: string; courseId: string }) | null;
  course: Course | null;
};

export function LessonView({ lesson, course }: LessonViewProps){
  const { user } = useAuthContext();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const paragraphs = Array.from(contentRef.current.children);
        const scrollTop = window.scrollY;
        const newCurrentParagraph = paragraphs.findIndex(p => {
          const rect = p.getBoundingClientRect();
          return rect.top <= scrollTop && scrollTop < rect.bottom;
        });
        if (newCurrentParagraph !== -1) {
          setCurrentParagraph(newCurrentParagraph);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [content]);

  if (!user) {
    return <div>請登入以查看此課程。</div>;
  }

  if (!lesson || !course) {
    return notFound();
  }

  const canEdit = user.uid === course.ownerId;
  const quiz = lesson.quizzes?.find(q => q.paragraph === currentParagraph);

  const handleQuizAnswer = (isCorrect: boolean) => {
    // TODO: Handle quiz answer
    console.log(`Quiz answer is ${isCorrect ? 'correct' : 'incorrect'}`);
  };

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-6">
        <Link href={`/courses/${lesson.courseId}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          返回課程
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <article ref={contentRef} className="prose prose-lg dark:prose-invert max-w-none md:col-span-2">
          {loading ? <p>載入中...</p> : <MarkdownRenderer content={content} />}
        </article>
        <div>
          {quiz && <QuizView quiz={quiz} onAnswer={handleQuizAnswer} />}
        </div>
      </div>

      <Separator className="my-12" />

      {canEdit && (
        <div className="flex justify-end">
          <Link href={`/courses/${course.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" /> 編輯課程內容
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}