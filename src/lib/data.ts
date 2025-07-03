import { collection, getDocs, query, where, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Subject, Course, Lesson, Module } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

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

export const addSubject = async (name: string, description: string): Promise<void> => {
  const newSubject: Subject = {
    id: uuidv4(),
    name,
    description,
  };
  await addDoc(collection(db, 'subjects'), newSubject);
};

export const addCourse = async (course: Omit<Course, 'id' | 'modules'> & { modules?: Module[] }): Promise<void> => {
  const newCourse: Course = {
    id: uuidv4(),
    modules: [],
    ...course,
  };
  await addDoc(collection(db, 'courses'), newCourse);
};

export const updateLesson = async (courseId: string, lessonId: string, title: string, content: string): Promise<void> => {
  const course = await getCourseById(courseId);
  if (!course) {
    throw new Error('Course not found');
  }

  let lessonFound = false;
  const updatedModules = course.modules.map(module => ({
    ...module,
    lessons: module.lessons.map(lesson => {
      if (lesson.id === lessonId) {
        lessonFound = true;
        return { ...lesson, title, content };
      }
      return lesson;
    }),
  }));

  if (!lessonFound) {
    throw new Error('Lesson not found in course');
  }

  const courseDocRef = doc(db, 'courses', courseId);
  await updateDoc(courseDocRef, { modules: updatedModules });
};