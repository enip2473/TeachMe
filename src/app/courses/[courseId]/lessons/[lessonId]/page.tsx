'use client';

import { getLessonById, getCourseById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { LessonView } from '@/components/lesson-view';
import { useAuthContext } from '@/hooks/use-auth-context';
import { useEffect, useState, use } from 'react';
import { Lesson, Course, ModuleContent } from '@/lib/types';

interface LessonPageProps {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
}

export default function LessonPage(props: LessonPageProps) {
  const params = use(props.params);
  const { loading: authLoading } = useAuthContext();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLesson() {
      const lessonData = await getLessonById(params.courseId, params.lessonId);
      const courseData = await getCourseById(params.courseId);
      setLesson(lessonData);
      setCourse(courseData);
      setLoading(false);
    }

    fetchLesson();
  }, [params.courseId, params.lessonId]);

  if (loading || authLoading) {
    return <div>Loading...</div>;
  }

  if (!lesson || !course) {
    notFound();
  }

  return <LessonView lesson={{ ...lesson, courseTitle: course.title, courseId: course.id }} course={course} />;
}
