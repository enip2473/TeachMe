import { getLessonById, getCourseById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { LessonView } from '@/components/lesson-view';

interface LessonPageProps {
  params: {
    courseId: string;
    lessonId: string;
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseId, lessonId } = await params;
  const lesson = await getLessonById(courseId, lessonId);
  const course = await getCourseById(courseId);

  if (!lesson || !course) {
    notFound();
  }

  return <LessonView lesson={lesson} course={course} />;
}