
'use server';

/**
 * @fileOverview Generates homework questions from a lesson.
 *
 * - generateHomeworkFromLesson - A function that generates homework questions.
 * - GenerateHomeworkInput - The input type for the generateHomeworkFromLesson function.
 * - GenerateHomeworkOutput - The return type for the generateHomeworkFromLesson function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ProblemType, MultipleChoiceProblem } from '@/lib/types';

const GenerateHomeworkInputSchema = z.object({
  lessonContent: z
    .string()
    .describe('The full text content of the lesson to be used for generating homework.'),
  numQuestions: z
    .number()
    .describe('The number of multiple-choice questions to generate.'),
});
export type GenerateHomeworkInput = z.infer<typeof GenerateHomeworkInputSchema>;

const MultipleChoiceProblemSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.number(),
});

const GenerateHomeworkOutputSchema = z.object({
  problems: z.array(z.object({
    type: z.nativeEnum(ProblemType),
    problem: MultipleChoiceProblemSchema,
  })),
});
export type GenerateHomeworkOutput = z.infer<typeof GenerateHomeworkOutputSchema>;

export async function generateHomeworkFromLesson(input: GenerateHomeworkInput): Promise<GenerateHomeworkOutput> {
  return generateHomeworkFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHomeworkPrompt',
  input: {schema: GenerateHomeworkInputSchema},
  output: {schema: GenerateHomeworkOutputSchema},
  prompt: `You are an expert educator creating a multiple-choice quiz.

  Based on the following lesson content, generate {{{numQuestions}}} multiple-choice questions.
  For each question, provide 4 options and indicate the correct answer.
  Ensure the questions cover the key concepts in the lesson.

  Lesson Content:
  {{{lessonContent}}}
  `,
});

const generateHomeworkFlow = ai.defineFlow(
  {
    name: 'generateHomeworkFlow',
    inputSchema: GenerateHomeworkInputSchema,
    outputSchema: GenerateHomeworkOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
