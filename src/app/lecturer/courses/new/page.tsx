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
import { Course, Subject } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const formSchema = z.object({
  title: z.string().min(2, { message: '課程標題至少需要2個字元。
' }),
  description: z.string().min(10, { message: '描述至少需要10個字元。
' }),
  subject: z.string().min(1, { message: '請選擇一個科目。
' }),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced'], { message: '請選擇一個難度。
' }),
  image: z.string().url().optional().or(z.literal('')),
});

export default function NewCoursePage() {
  const { user, loading: authLoading } = useAuthContext();
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
    if (!authLoading) {
      if (user === null) {
        toast({
          title: '需要身份驗證',
          description: '請登入以建立新課程。',
          variant: 'destructive',
        });
      } else if (user.role !== 'Lecturer' && user.role !== 'Admin') {
        router.push('/'); // Redirect to home if not lecturer or admin
        toast({
          title: '拒絕存取',
          description: '您沒有權限存取此頁面。',
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
    }
  }, [user, authLoading, router, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;

    const courseId = uuidv4();
    const newCourse: Course = {
      id: courseId,
      ...values,
      ownerId: user.uid,
      modules: [],
    };

    try {
      await addCourse(newCourse);
      toast({
        title: '課程已建立',
        description: `課程 "${values.title}" 已成功建立。`,
      });
      router.push(`/courses/${courseId}/edit`);
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: '錯誤',
        description: '建立課程失敗。請再試一次。',
        variant: 'destructive',
      });
    }
  }

  if (loading) {
    return <div>載入科目中...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">建立新課程</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>課程標題</FormLabel>
                <FormControl>
                  <Input placeholder="例如：代數入門" {...field} />
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
                <FormLabel>描述</FormLabel>
                <FormControl>
                  <Textarea placeholder="描述課程" {...field} />
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
                <FormLabel>科目</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇科目" />
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
                <FormLabel>難度</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇難度" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Beginner">初級</SelectItem>
                    <SelectItem value="Intermediate">中級</SelectItem>
                    <SelectItem value="Advanced">高級</SelectItem>
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
                <FormLabel>圖片網址</FormLabel>
                <FormControl>
                  <Input placeholder="例如：https://example.com/course-image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">建立課程</Button>
        </form>
      </Form>
    </div>
  );
}
