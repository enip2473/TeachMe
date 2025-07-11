'use client';

import { getSubjects } from '@/lib/data';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useAuthContext } from '@/hooks/use-auth-context';
import { useEffect, useState } from 'react';
import { Subject } from '@/lib/types';

export default function Home() {
  const { loading } = useAuthContext();
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    async function fetchSubjects() {
      const subjects = await getSubjects();
      setSubjects(subjects);
    }

    fetchSubjects();
  }, []);

  if (loading) {
    return <div>載入中...</div>;
  }

  return (
    <div className="container py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">歡迎來到你的學習宇宙</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          探索廣泛的學科，掌握新技能，並追蹤你的進度。今天就開始你的 TeachMe 學習之旅。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Link href={`/subjects/${subject.id}`} key={subject.id} className="group">
            <Card className="h-full hover:border-primary transition-colors duration-300 transform hover:-translate-y-1 hover:shadow-xl">
              <CardHeader className="flex-row items-center gap-4">
                <div>
                  <CardTitle className="font-headline text-xl">{subject.name}</CardTitle>
                  <CardDescription className="mt-1">{subject.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
