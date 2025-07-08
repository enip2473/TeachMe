'use client';

import { getCourseById, updateCourse } from '@/lib/data';
import { notFound } from 'next/navigation';
import { useAuthContext } from '@/hooks/use-auth-context';
import { useEffect, useState, use } from 'react';
import { Course, Lesson, Module } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import { Pen, ArrowLeft } from 'lucide-react';

export default function EditCoursePage(props: { params: Promise<{ courseId: string }> }) {
  const params = use(props.params);
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      const courseData = await getCourseById(params.courseId);
      setCourse(courseData);
      setLoading(false);
    };
    fetchCourse();
  }, [params.courseId]);

  const handleCourseChange = (field: keyof Course, value: string) => {
    if (!course) return;
    setCourse({ ...course, [field]: value });
  };

  const handleModuleChange = (moduleId: string, value: string) => {
    if (!course) return;
    const updatedModules = course.modules.map(module => {
      if (module.id === moduleId) {
        return { ...module, title: value };
      }
      return module;
    });
    setCourse({ ...course, modules: updatedModules });
  };

  const handleLessonChange = (moduleId: string, lessonId: string, field: keyof Lesson, value: string) => {""
    if (!course) return;
    const updatedModules = course.modules.map(module => {
      if (module.id === moduleId) {
        const updatedLessons = module.lessons.map(lesson => {
          if (lesson.id === lessonId) {
            return { ...lesson, [field]: value };
          }
          return lesson;
        });
        return { ...module, lessons: updatedLessons };
      }
      return module;
    });
    setCourse({ ...course, modules: updatedModules });
  };

  const handleAddModule = () => {
    if (!course) return;
    const newModule: Module = {
      id: uuidv4(),
      title: 'New Module',
      lessons: [],
    };
    setCourse({ ...course, modules: [...course.modules, newModule] });
  };

  const handleDeleteModule = (moduleId: string) => {
    if (!course) return;
    const updatedModules = course.modules.filter(module => module.id !== moduleId);
    setCourse({ ...course, modules: updatedModules });
  };

  const handleAddLesson = async (moduleId: string) => {
    if (!course) return;
    const newLesson: Lesson = {
      id: uuidv4(),
      title: 'New Lesson',
      summary: '',
      content: '',
    };
    const updatedModules = course.modules.map(module => {
      if (module.id === moduleId) {
        return { ...module, lessons: [...module.lessons, newLesson] };
      }
      return module;
    });
    const updatedCourse = { ...course, modules: updatedModules };
    try {
      await updateCourse(course.id, updatedCourse);
      setCourse(updatedCourse);
      toast({ title: "Success", description: "Lesson added successfully." });
    } catch (error) {
      console.error("Failed to add lesson:", error);
      toast({ title: "Error", description: "Failed to add lesson.", variant: "destructive" });
    }
  };

  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    if (!course) return;
    const updatedModules = course.modules.map(module => {
      if (module.id === moduleId) {
        const updatedLessons = module.lessons.filter(lesson => lesson.id !== lessonId);
        return { ...module, lessons: updatedLessons };
      }
      return module;
    });
    setCourse({ ...course, modules: updatedModules });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !course) return;

    const { source, destination } = result;

    // Handle module reordering
    if (source.droppableId === 'modules' && destination.droppableId === 'modules') {
      const newModules = Array.from(course.modules);
      const [removed] = newModules.splice(source.index, 1);
      newModules.splice(destination.index, 0, removed);
      setCourse({ ...course, modules: newModules });
      return;
    }

    // Handle lesson reordering within or between modules
    const sourceModule = course.modules.find(m => m.id === source.droppableId);
    const destModule = course.modules.find(m => m.id === destination.droppableId);

    if (!sourceModule || !destModule) return;

    // Moving within the same module
    if (source.droppableId === destination.droppableId) {
      const newLessons = Array.from(sourceModule.lessons);
      const [removed] = newLessons.splice(source.index, 1);
      newLessons.splice(destination.index, 0, removed);
      const updatedModules = course.modules.map(m =>
        m.id === sourceModule.id ? { ...m, lessons: newLessons } : m
      );
      setCourse({ ...course, modules: updatedModules });
    } else { // Moving between different modules
      const newSourceLessons = Array.from(sourceModule.lessons);
      const [removed] = newSourceLessons.splice(source.index, 1);
      const newDestLessons = Array.from(destModule.lessons);
      newDestLessons.splice(destination.index, 0, removed);

      const updatedModules = course.modules.map(m => {
        if (m.id === sourceModule.id) return { ...m, lessons: newSourceLessons };
        if (m.id === destModule.id) return { ...m, lessons: newDestLessons };
        return m;
      });
      setCourse({ ...course, modules: updatedModules });
    }
  };

  const handleSaveChanges = async () => {
    if (!course) return;

    try {
      await updateCourse(course.id, course);
      toast({ title: "Success", description: "Course updated successfully." });
    } catch (error) {
      console.error("Failed to update course:", error);
      toast({ title: "Error", description: "Failed to update course.", variant: "destructive" });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!course || user?.uid !== course.ownerId) {
    notFound();
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href={`/courses/${course.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold font-headline">Edit: {course.title}</h1>
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>

      <div className="space-y-4 mb-8">
        <Input
          value={course.title}
          onChange={e => handleCourseChange('title', e.target.value)}
          className="text-2xl font-bold"
        />
        <Textarea
          value={course.description}
          onChange={e => handleCourseChange('description', e.target.value)}
          placeholder="Course Description"
          rows={4}
        />
        <Input
          value={course.image}
          onChange={e => handleCourseChange('image', e.target.value)}
          placeholder="Course Image URL"
        />
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="space-y-6">
          <Button onClick={handleAddModule} className="mb-4">Add New Module</Button>
          <Droppable droppableId="modules" type="module">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                {course.modules.length === 0 ? (
                  <div className="text-center py-16 border rounded-lg">
                    <h2 className="text-2xl font-headline mb-4">No Modules Yet</h2>
                    <p className="text-muted-foreground mb-6">Add your first module to start organizing your lessons.</p>
                  </div>
                ) : (
                  course.modules.map((module, moduleIndex) => (
                    <Draggable key={module.id} draggableId={module.id} index={moduleIndex}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-center mb-4">
                            <Input
                              value={module.title}
                              onChange={e => handleModuleChange(module.id, e.target.value)}
                              className="text-2xl font-bold"
                              {...provided.dragHandleProps}
                            />
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteModule(module.id)}>Delete Module</Button>
                          </div>
                          <Droppable droppableId={module.id} type="lesson">
                            {(provided) => (
                              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                {module.lessons.map((lesson, lessonIndex) => (
                                  <Draggable key={lesson.id} draggableId={lesson.id} index={lessonIndex}>
                                    {(provided) => (
                                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="p-4 border rounded-lg bg-background flex justify-between items-center">
                                        <span className="font-semibold">{lesson.title}</span>
                                        <div className="flex items-center space-x-2">
                                          <Link href={`/courses/${course.id}/lessons/${lesson.id}/edit`}>
                                            <Button variant="outline" size="icon">
                                              <Pen className="h-4 w-4" />
                                            </Button>
                                          </Link>
                                          <Button variant="destructive" size="sm" onClick={() => handleDeleteLesson(module.id, lesson.id)}>Delete</Button>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                          <Button onClick={() => handleAddLesson(module.id)} className="mt-4">Add Lesson</Button>
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
}
