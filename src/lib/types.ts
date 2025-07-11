import type { LucideIcon } from "lucide-react";

export type UserRole = 'Student' | 'Lecturer' | 'Admin';

export interface Lesson {
  id: string;
  type: 'lesson';
  title: string;
  summary: string;
  content: string;
  courseId?: string;
  courseTitle?: string;
}

export interface Homework {
  id: string;
  type: 'homework';
  title: string;
  problems: {
    type: ProblemType;
    problem: MultipleChoiceProblem;
  }[];
}

export type ModuleContent = Lesson | Homework;

export interface Module {
  id: string;
  title: string;
  content: ModuleContent[];
}

export enum ProblemType {
  MultipleChoice = 'MultipleChoice',
  // Future problem types can be added here
}

export interface MultipleChoiceProblem {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
}

export interface Homework {
  id: string;
  title: string;
  problems: {
    type: ProblemType;
    problem: MultipleChoiceProblem;
  }[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  modules: Module[];
  image?: string;
  ownerId: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
}