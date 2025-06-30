import type { LucideIcon } from "lucide-react";

export interface Lesson {
  id: string;
  title: string;
  content: string;
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
  image: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
}
