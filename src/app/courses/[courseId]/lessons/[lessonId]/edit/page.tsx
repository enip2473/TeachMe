'use client';

import { useAuthContext } from '@/hooks/use-auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getLessonById, getCourseById, updateLesson } from '@/lib/data'; // We will create updateLesson
import { useToast } from '@/hooks/use-toast';
import { Lesson } from '@/lib/types';

const formSchema = z.object({
  title: z.string().min(2, { message: 'Lesson title must be at least 2 characters.' }),
  content: z.string().min(10, { message: 'Content must be at least 10 characters.' }),
});

export default function EditLessonPage({ params }: { params: { courseId: string; lessonId: string } }) {
  const { user } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState<Lesson | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        router.push('/signin');
        return;
      }

      const fetchedLesson = await getLessonById(params.courseId, params.lessonId);
      if (!fetchedLesson) {
        router.push('/'); // Or a 404 page
        toast({
          title: 'Lesson Not Found',
          description: 'The lesson you are trying to edit does not exist.',
          variant: 'destructive',
        });
        return;
      }

      const course = await getCourseById(params.courseId);
      if (!course || (user.uid !== course.ownerId && user.role !== 'Admin')) {
        router.push('/'); // Redirect if not owner or admin
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to edit this lesson.',
          variant: 'destructive',
        });
        return;
      }

      setLesson(fetchedLesson);
      form.reset({ title: fetchedLesson.title, content: fetchedLesson.content });
      setLoading(false);
    };
    fetchData();
  }, [user, router, params.courseId, params.lessonId, toast, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!lesson) return;
    try {
      await updateLesson(params.courseId, params.lessonId, values.title, values.content);
      toast({
        title: 'Lesson Updated',
        description: `Lesson "${values.title}" has been successfully updated.`,
      });
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast({
        title: 'Error',
        description: 'Failed to update lesson. Please try again.',
        variant: 'destructive',
      });
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!lesson) {
    return null; // Should be redirected by useEffect
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Lesson: {lesson.title}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lesson Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea rows={10} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update Lesson</Button>
        </form>
      </Form>
    </div>
  );
}
