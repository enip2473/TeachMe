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
  name: z.string().min(2, { message: 'Subject name must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
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
          title: 'Authentication Required',
          description: 'Please sign in to create a new subject.',
          variant: 'destructive',
        });
      } else if (user.role !== 'Admin') {
        router.push('/'); // Redirect to home if not admin
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access this page.',
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
        title: 'Subject Created',
        description: `Subject "${values.name}" has been successfully created.`,
      });
      form.reset();
    } catch (error) {
      console.error('Error creating subject:', error);
      toast({
        title: 'Error',
        description: 'Failed to create subject. Please try again.',
        variant: 'destructive',
      });
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Subject</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Mathematics" {...field} />
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
                  <Textarea placeholder="Describe the subject" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Create Subject</Button>
        </form>
      </Form>
    </div>
  );
}
