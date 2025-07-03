'use client';

import { getCourseById, updateLesson } from '@/lib/data';
import { notFound } from 'next/navigation';
import { useAuthContext } from '@/hooks/use-auth-context';
import { useEffect, useState } from 'react';
import { Course, Lesson } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function EditCoursePage({ params }: { params: { courseId: string } }) {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const fetchCourse = async () => {
      const courseData = await getCourseById(params.courseId);
      setCourse(courseData);
      if (courseData) {
        const allLessons = courseData.modules.flatMap(module => module.lessons);
        setLessons(allLessons);
      }
      setLoading(false);
    };
    fetchCourse();
  }, [params.courseId]);

  const handleLessonChange = (lessonId: string, field: keyof Lesson, value: string) => {
    setLessons(prevLessons =>
      prevLessons.map(lesson =>
        lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
      )
    );
  };

  const handleSaveChanges = async () => {
    if (!course) return;

    try {
      await Promise.all(
        lessons.map(lesson => updateLesson(course.id, lesson.id, lesson.title, lesson.content))
      );
      toast({ title: "Success", description: "Lessons updated successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update lessons.", variant: "destructive" });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!course || user?.uid !== course.ownerId) {
    notFound();
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Edit: {course.title}</h1>
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>

      <div className="space-y-6">
        {lessons.map(lesson => (
          <div key={lesson.id} className="p-4 border rounded-lg">
            <div className="space-y-2">
              <Input
                value={lesson.title}
                onChange={e => handleLessonChange(lesson.id, 'title', e.target.value)}
                className="text-lg font-semibold"
              />
              <Textarea
                value={lesson.content}
                onChange={e => handleLessonChange(lesson.id, 'content', e.target.value)}
                rows={5}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
