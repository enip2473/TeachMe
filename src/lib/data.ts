import type { Subject, Course } from '@/lib/types';
import { Atom, BookOpen, Calculator, Code, Dna, Palette } from 'lucide-react';

export const subjects: Subject[] = [
  {
    id: 'science',
    name: 'Science',
    description: 'Explore the wonders of the natural world, from physics to biology.',
    icon: Atom,
  },
  {
    id: 'programming',
    name: 'Programming',
    description: 'Learn to build software, websites, and applications with code.',
    icon: Code,
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    description: 'Master the language of the universe through numbers and logic.',
    icon: Calculator,
  },
  {
    id: 'history',
    name: 'History',
    description: 'Journey through time and uncover the stories of the past.',
    icon: BookOpen,
  },
  {
    id: 'art',
    name: 'Art & Design',
    description: 'Unleash your creativity and learn the principles of visual arts.',
    icon: Palette,
  },
  {
    id: 'biology',
    name: 'Biology',
    description: 'Study living organisms and their vital processes.',
    icon: Dna,
  },
];

export const courses: Course[] = [
  {
    id: 'quantum-physics-101',
    title: 'Quantum Physics 101',
    description: 'An introductory course to the mind-bending world of quantum mechanics.',
    subject: 'science',
    difficulty: 'Advanced',
    image: 'https://placehold.co/600x400.png',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: The Quantum Realm',
        lessons: [
          { id: 'l1', title: 'Wave-Particle Duality', content: 'In quantum mechanics, wave-particle duality is the concept that every particle or quantum entity may be described as either a particle or a wave. It expresses the inability of the classical concepts "particle" or "wave" to fully describe the behavior of quantum-scale objects. As Albert Einstein wrote: "It seems as though we must use sometimes the one theory and sometimes the other, while at times we may use either. We are faced with a new kind of difficulty. We have two contradictory pictures of reality; separately neither of them fully explains the phenomena of light, but together they do".' },
          { id: 'l2', title: 'Quantum Superposition', content: 'Superposition is a fundamental principle of quantum mechanics. It states that, much like waves in classical physics, any two (or more) quantum states can be added together ("superposed") and the result will be another valid quantum state; and conversely, that every quantum state can be represented as a sum of two or more other distinct states. Mathematically, it refers to a property of solutions to the Schrödinger equation; since the Schrödinger equation is linear, any linear combination of solutions will also be a solution.' },
        ],
      },
    ],
  },
  {
    id: 'intro-to-react',
    title: 'Introduction to React',
    description: 'Learn the fundamentals of the most popular JavaScript library for building user interfaces.',
    subject: 'programming',
    difficulty: 'Beginner',
    image: 'https://placehold.co/600x400.png',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Getting Started',
        lessons: [
          { id: 'l1', title: 'What is React?', content: 'React is a free and open-source front-end JavaScript library for building user interfaces based on UI components. It is maintained by Meta and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications. However, React is only concerned with state management and rendering that state to the DOM, so creating React applications usually requires the use of additional libraries for routing, as well as certain client-side functionality.' },
          { id: 'l2', title: 'Components, Props, and State', content: 'React is built around the concept of reusable components. You define small components and then put them together to form bigger components. All components, small or large, are reusable, even across different projects. Props (short for "properties") are read-only attributes that are passed to components. State is a plain JavaScript object used by React to represent an information about the component\'s current situation.' },
        ],
      },
      {
        id: 'm2',
        title: 'Module 2: Hooks',
        lessons: [
          { id: 'l3', title: 'useState Hook', content: 'The useState hook is a special function that lets you add React state to function components. It returns a pair: the current state value and a function that lets you update it. You can call this function from an event handler or somewhere else to update the state.' },
          { id: 'l4', title: 'useEffect Hook', content: 'The Effect Hook, useEffect, lets you perform side effects in function components. Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects. useEffect runs after every render, including the first one.' },
        ],
      },
    ],
  },
   {
    id: 'calculus-i',
    title: 'Calculus I',
    description: 'Explore limits, derivatives, and the fundamentals of calculus.',
    subject: 'mathematics',
    difficulty: 'Intermediate',
    image: 'https://placehold.co/600x400.png',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: Limits and Continuity',
        lessons: [
          { id: 'l1', title: 'Introduction to Limits', content: 'In mathematics, a limit is the value that a function (or sequence) "approaches" as the input "approaches" some value. Limits are essential to calculus and mathematical analysis, and are used to define continuity, derivatives, and integrals.' },
          { id: 'l2', title: 'Continuity', content: 'In mathematics, a continuous function is a function for which, intuitively, "small" changes in the input result in "small" changes in the output. A function that is not continuous is said to be discontinuous.' },
        ],
      },
      {
        id: 'm2',
        title: 'Module 2: Derivatives',
        lessons: [
          { id: 'l3', title: 'The Derivative and the Tangent Line Problem', content: 'The derivative of a function of a real variable measures the sensitivity to change of the function value (output value) with respect to a change in its argument (input value). The derivative is a fundamental tool of calculus.' },
        ],
      },
    ],
  },
];

export const getSubjectById = (id: string) => subjects.find(s => s.id === id);
export const getCoursesBySubject = (subjectId: string) => courses.filter(c => c.subject === subjectId);
export const getCourseById = (id: string) => courses.find(c => c.id === id);
export const getAllCourses = () => courses;
export const getLessonById = (courseId: string, lessonId: string) => {
    const course = getCourseById(courseId);
    if (!course) return null;
    for (const module of course.modules) {
        const lesson = module.lessons.find(l => l.id === lessonId);
        if (lesson) return { ...lesson, courseTitle: course.title, courseId: course.id };
    }
    return null;
}
