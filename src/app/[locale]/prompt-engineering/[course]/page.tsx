'use client';
import { notFound } from 'next/navigation';
import { useParams } from 'next/navigation';
import { getCourse } from '@/data/courses';
import { CourseProvider, CourseLayout } from '@/components/courses';

export default function CoursePage() {
  const params = useParams();
  const courseSlug = params.course as string;
  
  const course = getCourse(courseSlug);
  
  if (!course) {
    notFound();
  }

  return (
    <CourseProvider course={course} courseId={courseSlug}>
      <CourseLayout />
    </CourseProvider>
  );
}