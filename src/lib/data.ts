import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import type { Subject, Course, Lesson, Module } from '@/lib/types';

export const getSubjects = async (): Promise<Subject[]> => {
  const subjectsCollection = collection(db, 'subjects');
  const snapshot = await getDocs(subjectsCollection);
  return snapshot.docs.map(doc => doc.data() as Subject);
};

export const getSubjectById = async (id: string): Promise<Subject | null> => {
  const q = query(collection(db, 'subjects'), where('id', '==', id));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return null;
  }
  return snapshot.docs[0].data() as Subject;
};

export const getCoursesBySubject = async (subjectId: string): Promise<Course[]> => {
  const q = query(collection(db, 'courses'), where('subject', '==', subjectId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Course);
};

export const getCourseById = async (id: string): Promise<Course | null> => {
  const q = query(collection(db, 'courses'), where('id', '==', id));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return null;
  }
  return snapshot.docs[0].data() as Course;
};

export const getAllCourses = async (): Promise<Course[]> => {
  const coursesCollection = collection(db, 'courses');
  const snapshot = await getDocs(coursesCollection);
  return snapshot.docs.map(doc => doc.data() as Course);
};

export const getLessonById = async (courseId: string, lessonId: string): Promise<(Lesson & { courseTitle: string; courseId: string }) | null> => {
  const course = await getCourseById(courseId);
  if (!course) return null;
  for (const module of course.modules) {
    const lesson = module.lessons.find(l => l.id === lessonId);
    if (lesson) {
      return { ...lesson, courseTitle: course.title, courseId: course.id };
    }
  }
  return null;
};

