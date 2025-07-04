import type { LucideIcon } from "lucide-react";

export type UserRole = 'Student' | 'Lecturer' | 'Admin';

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  content: string;
  courseId?: string;
  courseTitle?: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
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