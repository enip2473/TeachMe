import { getCoursesBySubject, getSubjectById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import AddLectureButton from '@/components/add-lecture-button';

export default async function SubjectPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const subject = await getSubjectById(params.id);
  const coursesInSubject = await getCoursesBySubject(params.id);

  if (!subject) {
    notFound();
  }

  return (
    <div className="container py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" />
        Back to Subjects
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
          <h2 className="text-2xl font-headline">No Courses Yet</h2>
          <p className="text-muted-foreground mt-2">Courses for {subject.name} are coming soon. Check back later!</p>
        </div>
      )}
    </div>
  );
}
