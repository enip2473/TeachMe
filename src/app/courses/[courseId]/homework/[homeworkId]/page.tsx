'use client';

import { getHomeworkById, getCourseById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { useAuthContext } from '@/hooks/use-auth-context';
import { useEffect, useState, use } from 'react';
import { Homework, Course, ModuleContent } from '@/lib/types';
import { HomeworkView } from '@/components/homework-view'; // Will create this component next

interface HomeworkPageProps {
  params: Promise<{
    courseId: string;
    homeworkId: string;
  }>;
}

export default function HomeworkPage(props: HomeworkPageProps) {
  const params = use(props.params);
  const { loading: authLoading } = useAuthContext();
  const [homework, setHomework] = useState<Homework | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomework() {
      const homeworkData = await getHomeworkById(params.courseId, params.homeworkId);
      const courseData = await getCourseById(params.courseId);
      setHomework(homeworkData);
      setCourse(courseData);
      setLoading(false);
    }

    fetchHomework();
  }, [params.courseId, params.homeworkId]);

  if (loading || authLoading) {
    return <div>Loading...</div>;
  }

  if (!homework || !course) {
    notFound();
  }

  return <HomeworkView homework={homework} course={course} />;
}
