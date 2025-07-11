'use client';

import { getLessonById, updateLesson } from '@/lib/data';
import { notFound, useRouter } from 'next/navigation';
import { useAuthContext } from '@/hooks/use-auth-context';
import { useEffect, useState, use } from 'react';
import { Lesson, ModuleContent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

import MDEditor from '@uiw/react-md-editor';

export default function EditLessonPage(props: { params: Promise<{ courseId: string, lessonId: string }> }) {
  const params = use(props.params);
  const { user } = useAuthContext();
  const { toast } = useToast();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  const [markdownContent, setMarkdownContent] = useState<string>('');

  useEffect(() => {
    const fetchLesson = async () => {
      const lessonData = await getLessonById(params.courseId, params.lessonId);
      if (lessonData) {
        setLesson(lessonData);
        if (lessonData.content) {
          try {
            const response = await fetch(lessonData.content);
            const text = await response.text();
            setMarkdownContent(text);
          } catch (error) {
            console.error('Failed to fetch markdown content:', error);
            setMarkdownContent('Error loading content.');
          }
        }
      }
      setLoading(false);
    };
    fetchLesson();
  }, [params.courseId, params.lessonId]);

  const handleLessonChange = (field: keyof Lesson, value: string | undefined) => {
    if (!lesson) return;
    if (field === 'content') {
      setMarkdownContent(value || '');
    } else {
      setLesson({ ...lesson, [field]: value });
    }
  };

  const handleSaveChanges = async () => {
    if (!lesson) return;

    try {
      await updateLesson(params.courseId, lesson.id, { ...lesson, content: markdownContent });
      toast({ title: "Success", description: "Lesson updated successfully." });
      router.push(`/courses/${params.courseId}/edit`);
    } catch (error) {
      console.error("Failed to update lesson:", error);
      toast({ title: "Error", description: "Failed to update lesson.", variant: "destructive" });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!lesson) {
    notFound();
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold font-headline">Edit Lesson: {lesson.title}</h1>
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>

      <div className="space-y-4">
        <Input
          value={lesson.title}
          onChange={e => handleLessonChange('title', e.target.value)}
          className="text-2xl font-bold"
        />
        <Textarea
          value={lesson.summary}
          onChange={e => handleLessonChange('summary', e.target.value)}
          placeholder="Lesson Summary"
          rows={4}
        />
        <div data-color-mode="light">
          <MDEditor
            value={markdownContent}
            onChange={handleLessonChange.bind(null, 'content')}
            height={400}
          />
        </div>
      </div>
    </div>
  );
}
