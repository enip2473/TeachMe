import { collection, getDocs, query, where, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
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
  const courseDocRef = doc(db, 'courses', id);
  const docSnap = await getDoc(courseDocRef);
  if (docSnap.exists()) {
    return docSnap.data() as Course;
  }
  return null;
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

export const addCourse = async (course: Course): Promise<void> => {
  const courseDocRef = doc(db, 'courses', course.id);
  await setDoc(courseDocRef, course);
};



export const updateCourse = async (courseId: string, course: Course): Promise<void> => {
  const courseDocRef = doc(db, 'courses', courseId);
  await updateDoc(courseDocRef, { ...course });
};

export const updateLesson = async (courseId: string, lessonId: string, lesson: Lesson): Promise<void> => {
  const course = await getCourseById(courseId);
  if (!course) {
    throw new Error('Course not found');
  }

  // Upload content to Firebase Storage
  const storageRef = ref(storage, `lessons/${courseId}/${lessonId}.md`);
  await uploadString(storageRef, lesson.content, 'raw');
  const contentUrl = await getDownloadURL(storageRef);

  const updatedModules = course.modules.map(module => {
    const lessonIndex = module.lessons.findIndex(l => l.id === lessonId);
    if (lessonIndex !== -1) {
      const updatedLessons = [...module.lessons];
      updatedLessons[lessonIndex] = { ...lesson, content: contentUrl };
      return { ...module, lessons: updatedLessons };
    }
    return module;
  });

  await updateCourse(courseId, { ...course, modules: updatedModules });
};