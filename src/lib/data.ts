import { collection, getDocs, query, where, addDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import type { Subject, Course, Lesson, Module, Homework } from '@/lib/types';
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
    const courseData = docSnap.data() as Course;
    // Ensure modules and content arrays exist
    if (!courseData.modules) {
      courseData.modules = [];
    }
    courseData.modules = courseData.modules.map(module => {
      if (!module.content) {
        module.content = [];
      }
      return module;
    });
    return courseData;
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
    const lesson = module.content.find(item => item.id === lessonId && item.type === 'lesson') as Lesson;
    if (lesson) {
      return { ...lesson, courseTitle: course.title, courseId: course.id };
    }
  }
  return null;
};

export const getHomeworkById = async (courseId: string, homeworkId: string): Promise<Homework | null> => {
    const course = await getCourseById(courseId);
    if (!course) return null;

    for (const module of course.modules) {
        const homework = module.content.find(item => item.id === homeworkId && item.type === 'homework') as Homework;
        if (homework) {
            return homework;
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

export const getLessonContent = async (contentUrl: string): Promise<string> => {
  const response = await fetch(contentUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch lesson content: ${response.statusText}`);
  }
  return response.text();
};

export const updateLesson = async (courseId: string, lessonId: string, updatedLessonData: Lesson): Promise<void> => {
  const course = await getCourseById(courseId);
  if (!course) {
    throw new Error('Course not found');
  }

  // Always upload the content to Firebase Storage, treating it as raw markdown
  const storageRef = ref(storage, `lessons/${courseId}/${lessonId}.md`);
  await uploadString(storageRef, updatedLessonData.content, 'raw');
  const contentUrl = await getDownloadURL(storageRef);

  const updatedModules = course.modules.map(module => {
    const contentIndex = module.content.findIndex(item => item.id === lessonId && item.type === 'lesson');
    if (contentIndex !== -1) {
      const updatedContent = [...module.content];
      updatedContent[contentIndex] = { ...updatedLessonData, content: contentUrl, quizzes: updatedLessonData.quizzes };
      return { ...module, content: updatedContent };
    }
    return module;
  });

  await updateCourse(courseId, { ...course, modules: updatedModules });
};