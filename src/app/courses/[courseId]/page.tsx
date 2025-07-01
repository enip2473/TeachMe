'use client';

import { getCourseById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useState, useMemo, useEffect, use } from 'react';
import { ArrowLeft, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import Image from 'next/image';
import { Course } from '@/lib/types';

export default function CoursePage(props: { params: Promise<{ courseId: string }> }) {
  const params = use(props.params);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      const courseData = await getCourseById(params.courseId);
      setCourse(courseData);
      setLoading(false);
    };
    fetchCourse();
  }, [params.courseId]);

  const totalLessons = useMemo(() => course?.modules.reduce((acc, module) => acc + module.lessons.length, 0) || 0, [course]);

  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    notFound();
  }

  const handleLessonCompletion = (lessonId: string, isCompleted: boolean) => {
    setCompletedLessons(prev => {
      const newSet = new Set(prev);
      if (isCompleted) {
        newSet.add(lessonId);
      } else {
        newSet.delete(lessonId);
      }
      return newSet;
    });
  };

  const progressPercentage = totalLessons > 0 ? (completedLessons.size / totalLessons) * 100 : 0;

  return (
    <div className="container py-8">
       <Link href={`/subjects/${course.subject}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" />
        Back to {course.subject.charAt(0).toUpperCase() + course.subject.slice(1)}
      </Link>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="overflow-hidden mb-8">
             <Image
                src={course.image}
                alt={course.title}
                width={800}
                height={450}
                className="w-full object-cover"
                data-ai-hint="education technology"
              />
            <CardHeader>
              <CardTitle className="text-3xl font-headline">{course.title}</CardTitle>
              <CardDescription className="text-base">{course.description}</CardDescription>
            </CardHeader>
          </Card>

          <h2 className="text-2xl font-bold font-headline mb-4">Course Content</h2>
          <Accordion type="single" collapsible defaultValue={`item-${course.modules[0]?.id}`} className="w-full">
            {course.modules.map((module) => (
              <AccordionItem value={`item-${module.id}`} key={module.id}>
                <AccordionTrigger className="text-lg font-semibold">{module.title}</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 p-2">
                    {module.lessons.map((lesson) => (
                      <li key={lesson.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                        <Link href={`/courses/${course.id}/lessons/${lesson.id}`} className="flex items-center gap-3 group">
                           {completedLessons.has(lesson.id) ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <FileText className="w-5 h-5 text-muted-foreground" />
                           )}
                           <span className="group-hover:text-primary transition-colors">{lesson.title}</span>
                        </Link>
                        <div className="flex items-center gap-2">
                          <label htmlFor={`lesson-${lesson.id}`} className="text-sm text-muted-foreground pr-2">Mark as complete</label>
                          <Checkbox
                            id={`lesson-${lesson.id}`}
                            checked={completedLessons.has(lesson.id)}
                            onCheckedChange={(checked) => handleLessonCompletion(lesson.id, !!checked)}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={progressPercentage} className="mb-2" />
              <p className="text-center text-sm text-muted-foreground">
                {completedLessons.size} of {totalLessons} lessons completed ({Math.round(progressPercentage)}%)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
