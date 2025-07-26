import { z } from 'zod';
import { MultipleChoiceProblemSchema } from '../schemas';
import { ai } from '../genkit';

const GenerateQuizInputSchema = z.object({
  lessonContent: z.string(),
  paragraph: z.number(),
});

export const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuiz',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: MultipleChoiceProblemSchema,
  },
  async ({ lessonContent, paragraph }: z.infer<typeof GenerateQuizInputSchema>) => {
    const chunks = lessonContent.split('\n\n');
    const chunk = chunks[paragraph];

    const generateQuizPrompt = ai.definePrompt({
      name: 'generateQuizPrompt',
      input: { schema: z.object({ chunk: z.string() }) },
      output: { schema: MultipleChoiceProblemSchema },
      prompt: `Generate a multiple-choice question based on the following paragraph:

    {{{chunk}}}

    Provide the question, three options, and the index of the correct answer in the following JSON format: {"id": "quiz-id-placeholder", "question": "...", "options": ["...", "...", "..."], "correctAnswer": ...}.`,
    });

    const { output } = await generateQuizPrompt({ chunk });
    return output!;
  }
);
