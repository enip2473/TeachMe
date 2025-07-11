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
import { addSubject } from '@/lib/data'; // We will create this function
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, { message: '科目名稱至少需要2個字元。
' }),
  description: z.string().min(10, { message: '描述至少需要10個字元。
' }),
});

export default function NewSubjectPage() {
  const { user, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (!authLoading) {
      if (user === null) {
        toast({
          title: '需要身份驗證',
          description: '請登入以建立新科目。',
          variant: 'destructive',
        });
      } else if (user.role !== 'Admin') {
        router.push('/'); // Redirect to home if not admin
        toast({
          title: '拒絕存取',
          description: '您沒有權限存取此頁面。',
          variant: 'destructive',
        });
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading, router, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await addSubject(values.name, values.description);
      toast({
        title: '科目已建立',
        description: `科目 "${values.name}" 已成功建立。`,
      });
      form.reset();
    } catch (error) {
      console.error('Error creating subject:', error);
      toast({
        title: '錯誤',
        description: '建立科目失敗。請再試一次。',
        variant: 'destructive',
      });
    }
  }

  if (loading) {
    return <div>載入中...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">建立新科目</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>科目名稱</FormLabel>
                <FormControl>
                  <Input placeholder="例如：數學" {...field} />
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
                  <Textarea placeholder="描述科目" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">建立科目</Button>
        </form>
      </Form>
    </div>
  );
}
