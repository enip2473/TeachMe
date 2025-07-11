'use client';

import { getCourseById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useState, useMemo, useEffect, use } from 'react';
import { ArrowLeft, CheckCircle2, ChevronRight, FileText, Edit, ClipboardList } from 'lucide-react';
import Image from 'next/image';
import { Course } from '@/lib/types';
import { useAuthContext } from '@/hooks/use-auth-context';
import { Button } from '@/components/ui/button';

export default function CoursePage(props: { params: Promise<{ courseId: string }> }) {
  const params = use(props.params);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuthContext();

  useEffect(() => {
    const fetchCourse = async () => {
      const courseData = await getCourseById(params.courseId);
      setCourse(courseData);
      setLoading(false);
    };
    fetchCourse();
  }, [params.courseId]);

  const totalContentItems = useMemo(() => course?.modules.reduce((acc, module) => acc + module.content.length, 0) || 0, [course]);

  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  if (loading || authLoading) {
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

  const progressPercentage = totalContentItems > 0 ? (completedLessons.size / totalContentItems) * 100 : 0;
  const isOwner = user?.uid === course.ownerId;

  return (
    <div className="container py-8">
       <Link href={`/subjects/${course.subject}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" />
        Back to {course.subject.charAt(0).toUpperCase() + course.subject.slice(1)}
      </Link>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="overflow-hidden mb-8">
             <div className="max-h-96 overflow-hidden">
               <Image
                  src={course.image || 'https://placehold.co/600x338'}
                  alt={course.title}
                  width={600}
                  height={338}
                  className="w-full object-cover"
                  data-ai-hint="education technology"
                />
              </div>
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
                    {module.content.map((item) => (
                      <li key={item.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                        {item.type === 'lesson' ? (
                          <Link href={`/courses/${course.id}/lessons/${item.id}`} className="flex items-center gap-3 group">
                            {completedLessons.has(item.id) ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <FileText className="w-5 h-5 text-muted-foreground" />
                            )}
                            <span className="group-hover:text-primary transition-colors">{item.title}</span>
                          </Link>
                        ) : (
                          <Link href={`/courses/${course.id}/homework/${item.id}`} className="flex items-center gap-3 group">
                            <ClipboardList className="w-5 h-5 text-muted-foreground" />
                            <span className="group-hover:text-primary transition-colors">{item.title} (Homework)</span>
                          </Link>
                        )}
                        {item.type === 'lesson' && (
                          <div className="flex items-center gap-2">
                            <label htmlFor={`lesson-${item.id}`} className="text-sm text-muted-foreground pr-2">Mark as complete</label>
                            <Checkbox
                              id={`lesson-${item.id}`}
                              checked={completedLessons.has(item.id)}
                              onCheckedChange={(checked) => handleLessonCompletion(item.id, !!checked)}
                            />
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="md:col-span-1 space-y-4">
          {isOwner && (
            <Button asChild className="w-full">
              <Link href={`/courses/${course.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Lessons
              </Link>
            </Button>
          )}
          {!isOwner && (
            <Button asChild className="w-full">
              <Link href={(() => {
                const firstModule = course.modules[0];
                if (firstModule) {
                  if (firstModule.content && firstModule.content.length > 0) {
                    const firstItem = firstModule.content[0];
                    if (firstItem.type === 'lesson') {
                      return `/courses/${course.id}/lessons/${firstItem.id}`;
                    } else if (firstItem.type === 'homework') {
                      return `/courses/${course.id}/homework/${firstItem.id}`;
                    }
                  }
                }
                return `#`; // Fallback if no content is available
              })()}>
                Start Learning
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
