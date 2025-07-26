import { z } from 'zod';

export const MultipleChoiceProblemSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.number(),
});
