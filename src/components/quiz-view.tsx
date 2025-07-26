'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Quiz } from '@/lib/types';

interface QuizViewProps {
  quiz: Quiz;
  onAnswer: (isCorrect: boolean) => void;
}

export function QuizView({ quiz, onAnswer }: QuizViewProps) {
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);

  const handleSubmit = () => {
    if (selectedOption !== null) {
      onAnswer(selectedOption === quiz.problem.correctAnswer);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{quiz.problem.question}</p>
        <RadioGroup onValueChange={(value) => setSelectedOption(parseInt(value, 10))}>
          {quiz.problem.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
        <Button onClick={handleSubmit} className="mt-4">Submit</Button>
      </CardContent>
    </Card>
  );
}
