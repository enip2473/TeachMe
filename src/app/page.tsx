import { subjects } from '@/lib/data';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">Welcome to Your Universe of Learning</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore a wide range of subjects, master new skills, and track your progress. Start your learning journey with EduVerse today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Link href={`/subjects/${subject.id}`} key={subject.id} className="group">
            <Card className="h-full hover:border-primary transition-colors duration-300 transform hover:-translate-y-1 hover:shadow-xl">
              <CardHeader className="flex-row items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <subject.icon className="w-8 h-8 text-primary" />
                </div>
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
