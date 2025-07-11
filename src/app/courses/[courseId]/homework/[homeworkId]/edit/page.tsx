'use client';

import { getHomeworkById, updateCourse, getCourseById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { useAuthContext } from '@/hooks/use-auth-context';
import { useEffect, useState, use } from 'react';
import { Homework, Course, ProblemType, MultipleChoiceProblem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import { ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomework = async () => {
      const homeworkData = await getHomeworkById(params.courseId, params.homeworkId);
      const courseData = await getCourseById(params.courseId);
      setHomework(homeworkData);
      setCourse(courseData);
      setLoading(false);
    };
    fetchHomework();
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
      toast({ title: "Success", description: "Homework updated successfully." });
    } catch (error) {
      console.error("Failed to update homework:", error);
      toast({ title: "Error", description: "Failed to update homework.", variant: "destructive" });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
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
        <h1 className="text-3xl font-bold font-headline">Edit Homework: {homework.title}</h1>
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>

      <div className="space-y-4 mb-8">
        <Input
          value={homework.title}
          onChange={e => handleHomeworkChange('title', e.target.value)}
          className="text-2xl font-bold"
        />
      </div>

      <h2 className="text-2xl font-bold font-headline mb-4">Problems</h2>
      <Button onClick={handleAddProblem} className="mb-4">
        <PlusCircle className="mr-2 h-4 w-4" /> Add Multiple Choice Problem
      </Button>

      <div className="space-y-6">
        {homework.problems.map((problemWrapper, index) => {
          if (problemWrapper.type === ProblemType.MultipleChoice) {
            const problem = problemWrapper.problem as MultipleChoiceProblem;
            return (
              <div key={problem.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Problem {index + 1}</h3>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteProblem(problem.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  value={problem.question}
                  onChange={e => handleProblemChange(problem.id, 'question', e.target.value)}
                  placeholder="Question"
                  rows={3}
                  className="mb-4"
                />
                <h4 className="text-lg font-medium mb-2">Options</h4>
                <div className="space-y-2 mb-4">
                  {problem.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <Input
                        value={option}
                        onChange={e => handleOptionChange(problem.id, optionIndex, e.target.value)}
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteOption(problem.id, optionIndex)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button onClick={() => handleAddOption(problem.id)} size="sm" className="mb-4">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Option
                </Button>
                <div className="flex items-center space-x-2">
                  <Label>Correct Answer:</Label>
                  <Select
                    value={problem.correctAnswer.toString()}
                    onValueChange={value => handleProblemChange(problem.id, 'correctAnswer', parseInt(value))}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select correct option" />
                    </SelectTrigger>
                    <SelectContent>
                      {problem.options.map((option, optionIndex) => (
                        <SelectItem key={optionIndex} value={optionIndex.toString()}>
                          {`Option ${optionIndex + 1}: ${option}`}
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
