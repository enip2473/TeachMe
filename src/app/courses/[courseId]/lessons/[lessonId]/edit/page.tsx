'use client';

import { getLessonById, updateLesson } from '@/lib/data';
import { notFound, useRouter } from 'next/navigation';
import { useAuthContext } from '@/hooks/use-auth-context';
import { useEffect, useState, use } from 'react';
import { Lesson, ModuleContent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Sparkles, MinusCircle, PlusCircle } from 'lucide-react';
import { generateLessonContent } from '@/ai/flows/generate-lesson-content';
import { generateQuizzes } from '@/ai/actions/generate-quizzes';

import MDEditor from '@uiw/react-md-editor';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function EditLessonPage(props: { params: Promise<{ courseId: string, lessonId: string }> }) {
  const params = use(props.params);
  const { user } = useAuthContext();
  const { toast } = useToast();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingQuizzes, setIsGeneratingQuizzes] = useState(false);

  const [markdownContent, setMarkdownContent] = useState<string>('');

  useEffect(() => {
    const fetchLesson = async () => {
      const lessonData = await getLessonById(params.courseId, params.lessonId);
      if (lessonData) {
        setLesson(lessonData);
        if (lessonData.content) {
          try {
            const response = await fetch(lessonData.content);
            const text = await response.text();
            setMarkdownContent(text);
          } catch (error) {
            console.error('Failed to fetch markdown content:', error);
            setMarkdownContent('載入內容錯誤。');
          }
        }
      }
      setLoading(false);
    };
    fetchLesson();
  }, [params.courseId, params.lessonId]);

  const handleLessonChange = (field: keyof Lesson, value: string | undefined) => {
    if (!lesson) return;
    if (field === 'content') {
      setMarkdownContent(value || '');
    } else {
      setLesson({ ...lesson, [field]: value });
    }
  };

  const handleQuizChange = (
    quizId: string,
    field: 'question' | 'correctAnswer' | 'option' | 'addOption' | 'removeOption',
    value: string | number | null,
    optionIndex?: number
  ) => {
    if (!lesson) return;

    setLesson(prevLesson => {
      if (!prevLesson) return null;

      const updatedQuizzes = prevLesson.quizzes?.map(quiz => {
        if (quiz.id === quizId) {
          const updatedProblem = { ...quiz.problem };
          if (field === 'question') {
            updatedProblem.question = value as string;
          } else if (field === 'correctAnswer') {
            updatedProblem.correctAnswer = value as number;
          } else if (field === 'option' && optionIndex !== undefined) {
            const updatedOptions = [...updatedProblem.options];
            updatedOptions[optionIndex] = value as string;
            updatedProblem.options = updatedOptions;
          } else if (field === 'addOption') {
            const updatedOptions = [...updatedProblem.options, ''];
            updatedProblem.options = updatedOptions;
          } else if (field === 'removeOption' && optionIndex !== undefined) {
            const updatedOptions = updatedProblem.options.filter((_, idx) => idx !== optionIndex);
            updatedProblem.options = updatedOptions;
            if (updatedProblem.correctAnswer >= updatedOptions.length) {
              updatedProblem.correctAnswer = Math.max(0, updatedOptions.length - 1);
            }
          }
          return { ...quiz, problem: updatedProblem };
        }
        return quiz;
      });

      return { ...prevLesson, quizzes: updatedQuizzes };
    });
  };

  const handleGenerateContent = async () => {
    if (!lesson || !lesson.title || !lesson.summary) {
      toast({
        title: '錯誤',
        description: '請填寫課程標題和摘要以生成內容。',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { content } = await generateLessonContent({
        title: lesson.title,
        summary: lesson.summary,
      });
      setMarkdownContent(content);
      toast({
        title: '成功',
        description: '課程內容已生成。',
      });
    } catch (error) {
      console.error('Failed to generate lesson content:', error);
      toast({
        title: '錯誤',
        description: '生成課程內容失敗。請再試一次。',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };


  const handleGenerateQuizzes = async () => {
    if (!markdownContent) {
      toast({
        title: '錯誤',
        description: '請先生成課程內容。',
        variant: 'destructive',
      });
      return;
    }

    setIsGeneratingQuizzes(true);
    try {
      const quizzes = await generateQuizzes(markdownContent);
      setLesson(prev => prev ? { ...prev, quizzes } : null);
      toast({
        title: '成功',
        description: '測驗已生成。',
      });
    } catch (error) {
      console.error('Failed to generate quizzes:', error);
      toast({
        title: '錯誤',
        description: '生成測驗失敗。請再試一次。',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingQuizzes(false);
    }
  };

  const handleDeleteQuiz = (quizId: string) => {
    if (!lesson) return;
    setLesson(prev => prev ? { ...prev, quizzes: prev.quizzes?.filter(q => q.id !== quizId) } : null);
    toast({
      title: '成功',
      description: '測驗已從列表中移除。請儲存變更以永久刪除。',
    });
  };

  const handleSaveChanges = async () => {
    if (!lesson) return;

    try {
      await updateLesson(params.courseId, lesson.id, { ...lesson, content: markdownContent });
      toast({ title: "成功", description: "課程更新成功。" });
      router.push(`/courses/${params.courseId}/edit`);
    } catch (error) {
      console.error("Failed to update lesson:", error);
      toast({ title: "錯誤", description: "更新課程失敗。請再試一次。", variant: "destructive" });
    }
  };

  if (loading) {
    return <div>載入中...</div>;
  }

  if (!lesson) {
    notFound();
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold font-headline">編輯課程：{lesson.title}</h1>
        <Button onClick={handleSaveChanges}>儲存變更</Button>
      </div>

      <div className="space-y-4">
        <Input
          value={lesson.title}
          onChange={e => handleLessonChange('title', e.target.value)}
          className="text-2xl font-bold"
        />
        <Textarea
          value={lesson.summary}
          onChange={e => handleLessonChange('summary', e.target.value)}
          placeholder="課程摘要"
          rows={4}
        />
        <div className="flex gap-2">
          <Button
            onClick={handleGenerateContent}
            disabled={isGenerating || !lesson.title || !lesson.summary}
            className="w-full"
          >
            {isGenerating ? '生成中...' : <><Sparkles className="mr-2 h-4 w-4" /> 從標題和摘要生成內容</>}
          </Button>
          <Button
            onClick={handleGenerateQuizzes}
            disabled={isGeneratingQuizzes || !markdownContent}
            className="w-full"
          >
            {isGeneratingQuizzes ? '生成中...' : <><Sparkles className="mr-2 h-4 w-4" /> 生成測驗</>}
          </Button>
        </div>
        <div data-color-mode="light">
          <MDEditor
            value={markdownContent}
            onChange={handleLessonChange.bind(null, 'content')}
            height={400}
          />
        </div>

        {lesson.quizzes && lesson.quizzes.length > 0 && (
          <div className="space-y-4 mt-8">
            <h2 className="text-2xl font-bold">測驗</h2>
            {lesson.quizzes.map((quiz, quizIndex) => (
              <div key={quiz.id} className="border p-4 rounded-md space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">問題 {quizIndex + 1}</h3>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteQuiz(quiz.id)}
                  >
                    刪除測驗
                  </Button>
                </div>
                <div>
                  <Label htmlFor={`question-${quiz.id}`}>問題</Label>
                  <Input
                    id={`question-${quiz.id}`}
                    value={quiz.problem.question}
                    onChange={(e) => handleQuizChange(quiz.id, 'question', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>選項</Label>
                  <RadioGroup
                    value={quiz.problem.correctAnswer.toString()}
                    onValueChange={(value) => handleQuizChange(quiz.id, 'correctAnswer', parseInt(value, 10))}
                  >
                    {quiz.problem.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <RadioGroupItem value={optionIndex.toString()} id={`option-${quiz.id}-${optionIndex}`} />
                        <Input
                          id={`option-${quiz.id}-${optionIndex}`}
                          value={option}
                          onChange={(e) => handleQuizChange(quiz.id, 'option', e.target.value, optionIndex)}
                          className="flex-grow"
                        />
                        {quiz.problem.options.length > 1 && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuizChange(quiz.id, 'removeOption', null, optionIndex)}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuizChange(quiz.id, 'addOption', null)}
                    className="w-full"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> 添加選項
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
