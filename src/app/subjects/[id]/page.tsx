'use client';

import { getCoursesBySubject, getSubjectById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import AddLectureButton from '@/components/add-lecture-button';
import { useAuthContext } from '@/hooks/use-auth-context';
import { useEffect, useState, use } from 'react';
import { Course, Subject } from '@/lib/types';

export default function SubjectPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const { loading: authLoading } = useAuthContext();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [coursesInSubject, setCoursesInSubject] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubjectData() {
      const subjectData = await getSubjectById(params.id);
      const coursesData = await getCoursesBySubject(params.id);
      setSubject(subjectData);
      setCoursesInSubject(coursesData);
      setLoading(false);
    }

    fetchSubjectData();
  }, [params.id]);

  if (loading || authLoading) {
    return <div>載入中...</div>;
  }

  if (!subject) {
    notFound();
  }

  return (
    <div className="container py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" />
        返回科目
      </Link>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-4xl font-bold font-headline">{subject.name}</h1>
            <p className="text-muted-foreground">{subject.description}</p>
        </div>
        <AddLectureButton subjectId={params.id} />
      </div>

      {coursesInSubject.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coursesInSubject.map((course) => (
            <Link href={`/courses/${course.id}`} key={course.id} className="block">
              <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary">
                <CardHeader className="p-0">
                  <Image
                    src={course.image || 'https://placehold.co/600x400'}
                    alt={course.title}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                    data-ai-hint="online course learning"
                  />
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="font-headline text-xl mb-2">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Badge variant={course.difficulty === 'Beginner' ? 'default' : course.difficulty === 'Intermediate' ? 'secondary' : 'outline'}>
                    {course.difficulty}
                  </Badge>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border rounded-lg">
          <h2 className="text-2xl font-headline">尚未有課程</h2>
          <p className="text-muted-foreground mt-2">{subject.name} 的課程即將推出。請稍後再回來查看！</p>
        </div>
      )}
    </div>
  );
}

