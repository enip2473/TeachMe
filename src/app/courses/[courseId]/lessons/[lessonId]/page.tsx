import { getLessonById, getCourseById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { LessonView } from '@/components/lesson-view';

interface LessonPageProps {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
}

export default async function LessonPage(props: LessonPageProps) {
  const params = await props.params;
  const lesson = await getLessonById(params.courseId, params.lessonId);
  const course = await getCourseById(params.courseId);

  if (!lesson || !course) {
    notFound();
  }

  return <LessonView lesson={lesson} course={course} />;
}