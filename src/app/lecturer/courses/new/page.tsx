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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addCourse, getSubjects } from '@/lib/data'; // We will create addCourse and use getSubjects
import { useToast } from '@/hooks/use-toast';
import { Subject } from '@/lib/types';

const formSchema = z.object({
  title: z.string().min(2, { message: 'Course title must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  subject: z.string().min(1, { message: 'Please select a subject.' }),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced'], { message: 'Please select a difficulty.' }),
  image: z.string().url().optional().or(z.literal('')),
});

export default function NewCoursePage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      subject: '',
      difficulty: 'Beginner',
      image: '',
    },
  });

  useEffect(() => {
    if (user === null) {
      router.push('/signin');
    } else if (user.role !== 'Lecturer' && user.role !== 'Admin') {
      router.push('/'); // Redirect to home if not lecturer or admin
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access this page.',
        variant: 'destructive',
      });
    } else {
      const fetchSubjects = async () => {
        const fetchedSubjects = await getSubjects();
        setSubjects(fetchedSubjects);
        setLoading(false);
      };
      fetchSubjects();
    }
  }, [user, router, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;
    try {
      await addCourse({ ...values, ownerId: user.uid });
      toast({
        title: 'Course Created',
        description: `Course "${values.title}" has been successfully created.`,
      });
      form.reset();
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: 'Error',
        description: 'Failed to create course. Please try again.',
        variant: 'destructive',
      });
    }
  }

  if (loading) {
    return <div>Loading subjects...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Course</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Introduction to Algebra" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe the course" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., https://example.com/course-image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Create Course</Button>
        </form>
      </Form>
    </div>
  );
}
