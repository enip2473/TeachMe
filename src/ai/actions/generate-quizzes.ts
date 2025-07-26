'use server';

import { generateQuizFlow } from '@/ai/flows/generate-quiz';
import { Quiz } from '@/lib/types';

export async function generateQuizzes(lessonContent: string): Promise<Quiz[]> {
  const paragraphs = lessonContent.split('\n\n');
  const quizzes = await Promise.all(
    paragraphs.map(async (paragraph, index) => {
      const problem = await generateQuizFlow({
        lessonContent,
        paragraph: index,
      });
      return { id: `quiz-${index}`, paragraph: index, problem };
    })
  );
  return quizzes;
}

