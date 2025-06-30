'use server';

/**
 * @fileOverview Summarizes a lesson based on user-specified length.
 *
 * - summarizeLesson - A function that generates a lesson summary.
 * - SummarizeLessonInput - The input type for the summarizeLesson function.
 * - SummarizeLessonOutput - The return type for the summarizeLesson function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLessonInputSchema = z.object({
  lessonContent: z
    .string()
    .describe('The full text content of the lesson to be summarized.'),
  summaryLength: z
    .enum(['short', 'long'])
    .describe('The desired length of the summary: short or long.'),
});
export type SummarizeLessonInput = z.infer<typeof SummarizeLessonInputSchema>;

const SummarizeLessonOutputSchema = z.object({
  summary: z.string().describe('The generated summary of the lesson.'),
});
export type SummarizeLessonOutput = z.infer<typeof SummarizeLessonOutputSchema>;

export async function summarizeLesson(input: SummarizeLessonInput): Promise<SummarizeLessonOutput> {
  return summarizeLessonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeLessonPrompt',
  input: {schema: SummarizeLessonInputSchema},
  output: {schema: SummarizeLessonOutputSchema},
  prompt: `You are an expert educator skilled at summarizing lessons for students.

  Summarize the following lesson content in a way that is easy to understand.

  Lesson Content: {{{lessonContent}}}

  The user has requested a {{{summaryLength}}} summary.

  Please provide a clear and concise summary.`,
});

const summarizeLessonFlow = ai.defineFlow(
  {
    name: 'summarizeLessonFlow',
    inputSchema: SummarizeLessonInputSchema,
    outputSchema: SummarizeLessonOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
