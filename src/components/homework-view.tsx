'use client';

import { Homework, Course, ProblemType, MultipleChoiceProblem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface HomeworkViewProps {
  homework: Homework;
  course: Course;
}

export function HomeworkView({ homework, course }: HomeworkViewProps) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{homework.title}</h1>
      <h2 className="text-xl text-gray-600 mb-6">Course: {course.title}</h2>

      {homework.problems.map((problemWrapper, index) => {
        if (problemWrapper.type === ProblemType.MultipleChoice) {
          const problem = problemWrapper.problem as MultipleChoiceProblem;
          return (
            <Card key={problem.id} className="mb-6">
              <CardHeader>
                <CardTitle>Problem {index + 1}: {problem.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup>
                  {problem.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${problem.id}-${optionIndex}`} />
                      <Label htmlFor={`option-${problem.id}-${optionIndex}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          );
        }
        return null;
      })}
    </div>
  );
}
