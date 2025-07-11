"use client";

import { useAuthContext } from "@/hooks/use-auth-context";
import Link from "next/link";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";

export default function AddLectureButton({ subjectId }: { subjectId: string }) {
  const { user } = useAuthContext();
  const isLecturer = user?.role === "Lecturer";
  const isAdmin = user?.role === "Admin";

  if (!isLecturer && !isAdmin) {
    return null;
  }

  return (
    <Button asChild>
      <Link href={`/lecturer/courses/new?subjectId=${subjectId}`}>
        <PlusCircle className="w-4 h-4 mr-2" />
        新增課程
      </Link>
    </Button>
  );
}
