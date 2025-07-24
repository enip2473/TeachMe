'use client';

import { getHomeworkById, updateCourse, getCourseById, getLessonContent } from '@/lib/data';
import { notFound } from 'next/navigation';
import { useAuthContext } from '@/hooks/use-auth-context';
import { useEffect, useState, use } from 'react';
import { Homework, Course, ProblemType, MultipleChoiceProblem, Lesson } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import { ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { generateHomeworkFromLesson } from '@/ai/flows/generate-homework';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EditHomeworkPageProps {
  params: Promise<{
    courseId: string;
    homeworkId: string;
  }>;
}

export default function EditHomeworkPage(props: EditHomeworkPageProps) {
  const params = use(props.params);
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [homework, setHomework] = useState<Homework | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const homeworkData = await getHomeworkById(params.courseId, params.homeworkId);
      const courseData = await getCourseById(params.courseId);
      setHomework(homeworkData);
      setCourse(courseData);

      if (courseData) {
        const allLessons: Lesson[] = [];
        courseData.modules.forEach(module => {
          module.content.forEach(item => {
            if (item.type === 'lesson') {
              allLessons.push(item as Lesson);
            }
          });
        });
        setLessons(allLessons);
        if (allLessons.length > 0) {
          setSelectedLessonId(allLessons[0].id);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [params.courseId, params.homeworkId]);

  const handleHomeworkChange = (field: keyof Homework, value: string) => {
    if (!homework) return;
    setHomework({ ...homework, [field]: value });
  };

  const handleProblemChange = (problemId: string, field: string, value: any) => {
    if (!homework) return;
    const updatedProblems = homework.problems.map(p => {
      if (p.problem.id === problemId) {
        return {
          ...p,
          problem: {
            ...p.problem,
            [field]: value,
          },
        };
      }
      return p;
    });
    setHomework({ ...homework, problems: updatedProblems });
  };

  const handleOptionChange = (problemId: string, optionIndex: number, value: string) => {
    if (!homework) return;
    const updatedProblems = homework.problems.map(p => {
      if (p.problem.id === problemId && p.type === ProblemType.MultipleChoice) {
        const updatedOptions = [...(p.problem as MultipleChoiceProblem).options];
        updatedOptions[optionIndex] = value;
        return {
          ...p,
          problem: {
            ...p.problem,
            options: updatedOptions,
          },
        };
      }
      return p;
    });
    setHomework({ ...homework, problems: updatedProblems });
  };

  const handleAddOption = (problemId: string) => {
    if (!homework) return;
    const updatedProblems = homework.problems.map(p => {
      if (p.problem.id === problemId && p.type === ProblemType.MultipleChoice) {
        const updatedOptions = [...(p.problem as MultipleChoiceProblem).options, ''];
        return {
          ...p,
          problem: {
            ...p.problem,
            options: updatedOptions,
          },
        };
      }
      return p;
    });
    setHomework({ ...homework, problems: updatedProblems });
  };

  const handleDeleteOption = (problemId: string, optionIndex: number) => {
    if (!homework) return;
    const updatedProblems = homework.problems.map(p => {
      if (p.problem.id === problemId && p.type === ProblemType.MultipleChoice) {
        const updatedOptions = (p.problem as MultipleChoiceProblem).options.filter((_, idx) => idx !== optionIndex);
        return {
          ...p,
          problem: {
            ...p.problem,
            options: updatedOptions,
          },
        };
      }
      return p;
    });
    setHomework({ ...homework, problems: updatedProblems });
  };

  const handleAddProblem = () => {
    if (!homework) return;
    const newProblem: MultipleChoiceProblem = {
      id: uuidv4(),
      question: 'New Multiple Choice Question',
      options: ['Option 1', 'Option 2'],
      correctAnswer: 0,
    };
    setHomework({
      ...homework,
      problems: [...homework.problems, { type: ProblemType.MultipleChoice, problem: newProblem }],
    });
  };

  const handleDeleteProblem = (problemId: string) => {
    if (!homework) return;
    const updatedProblems = homework.problems.filter(p => p.problem.id !== problemId);
    setHomework({ ...homework, problems: updatedProblems });
  };

  const handleSaveChanges = async () => {
    if (!homework || !course) return;

    const updatedModules = course.modules.map(module => {
      const contentIndex = module.content.findIndex(item => item.id === homework.id && item.type === 'homework');
      if (contentIndex !== -1) {
        const updatedContent = [...module.content];
        updatedContent[contentIndex] = homework;
        return { ...module, content: updatedContent };
      }
      return module;
    });

    const updatedCourse = { ...course, modules: updatedModules };

    try {
      await updateCourse(course.id, updatedCourse);
      toast({ title: "成功", description: "作業更新成功。" });
    } catch (error) {
      console.error("Failed to update homework:", error);
      toast({ title: "錯誤", description: "更新作業失敗。請再試一次。", variant: "destructive" });
    }
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateHomework = async () => {
    if (!course || !selectedLessonId) return;

    const lesson = lessons.find(l => l.id === selectedLessonId);

    if (!lesson || !lesson.content) {
      toast({
        title: '錯誤',
        description: '找不到可用的課程內容來生成作業。',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const lessonContent = await getLessonContent(lesson.content);
      const { problems } = await generateHomeworkFromLesson({
        lessonContent: lessonContent,
        numQuestions: numQuestions,
      });
      if (homework) {
        setHomework({ ...homework, problems });
      }
    } catch (error) {
      console.error('Failed to generate homework:', error);
      toast({
        title: '錯誤',
        description: '生成作業失敗。請再試一次。',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return <div>載入中...</div>;
  }

  if (!homework || !course || user?.uid !== course.ownerId) {
    notFound();
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href={`/courses/${course.id}/homework/${homework.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold font-headline">編輯作業：{homework.title}</h1>
        <Button onClick={handleSaveChanges}>儲存變更</Button>
      </div>

      <div className="space-y-4 mb-8">
        <Input
          value={homework.title}
          onChange={e => handleHomeworkChange('title', e.target.value)}
          className="text-2xl font-bold"
        />
      </div>

      <h2 className="text-2xl font-bold font-headline mb-4">問題</h2>
      <div className="flex gap-4 mb-4">
        <Button onClick={handleAddProblem}>
          <PlusCircle className="mr-2 h-4 w-4" /> 新增選擇題
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="lesson-select">選擇課程</Label>
          <Select
            value={selectedLessonId || ''}
            onValueChange={setSelectedLessonId}
          >
            <SelectTrigger id="lesson-select">
              <SelectValue placeholder="選擇一個課程" />
            </SelectTrigger>
            <SelectContent>
              {lessons.map(lesson => (
                <SelectItem key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="num-questions">問題數量</Label>
          <Input
            id="num-questions"
            type="number"
            value={numQuestions}
            onChange={e => setNumQuestions(parseInt(e.target.value, 10))}
            min={1}
            max={10} // Set a reasonable max limit
          />
        </div>
      </div>
      <Button onClick={handleGenerateHomework} disabled={isGenerating || !selectedLessonId}>
        {isGenerating ? '生成中...' : '從課程內容生成'}
      </Button>

      <div className="space-y-6 mt-6">
        {homework.problems.map((problemWrapper, index) => {
          if (problemWrapper.type === ProblemType.MultipleChoice) {
            const problem = problemWrapper.problem as MultipleChoiceProblem;
            return (
              <div key={problem.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">問題 {index + 1}</h3>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteProblem(problem.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  value={problem.question}
                  onChange={e => handleProblemChange(problem.id, 'question', e.target.value)}
                  placeholder="問題"
                  rows={3}
                  className="mb-4"
                />
                <h4 className="text-lg font-medium mb-2">選項</h4>
                <div className="space-y-2 mb-4">
                  {problem.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <Input
                        value={option}
                        onChange={e => handleOptionChange(problem.id, optionIndex, e.target.value)}
                        placeholder={`選項 ${optionIndex + 1}`}
                      />
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteOption(problem.id, optionIndex)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button onClick={() => handleAddOption(problem.id)} size="sm" className="mb-4">
                  <PlusCircle className="mr-2 h-4 w-4" /> 新增選項
                </Button>
                <div className="flex items-center space-x-2">
                  <Label>正確答案：</Label>
                  <Select
                    value={problem.correctAnswer.toString()}
                    onValueChange={value => handleProblemChange(problem.id, 'correctAnswer', parseInt(value))}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="選擇正確選項" />
                    </SelectTrigger>
                    <SelectContent>
                      {problem.options.map((option, optionIndex) => (
                        <SelectItem key={optionIndex} value={optionIndex.toString()}>
                          {`選項 ${optionIndex + 1}: ${option}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
