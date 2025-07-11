import { getAllCourses } from '@/lib/data';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Search } from 'lucide-react';

export default async function SearchPage(
  props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const searchParams = await props.searchParams;
  const query = typeof searchParams?.q === 'string' ? searchParams.q : '';
  const allCourses = await getAllCourses();

  const filteredCourses = allCourses.filter(course => 
    course.title.toLowerCase().includes(query.toLowerCase()) ||
    course.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline flex items-center gap-3">
          <Search className="w-8 h-8" />
          搜尋結果
        </h1>
        {query && (
            <p className="text-muted-foreground text-lg mt-2">
                顯示結果：<span className="text-foreground font-semibold">&quot;{query}&quot;</span>
            </p>
        )}
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <Link href={`/courses/${course.id}`} key={course.id} className="block">
              <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary">
                <CardHeader className="p-0">
                  <Image
                    src={course.image || 'https://placehold.co/600x400'}
                    alt={course.title}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                    data-ai-hint="learning online"
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
          <h2 className="text-2xl font-headline">沒有找到結果</h2>
          <p className="text-muted-foreground mt-2">
            我們找不到符合您搜尋的課程。請嘗試不同的詞彙。
          </p>
        </div>
      )}
    </div>
  );
}
