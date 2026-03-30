"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreVertical, Pencil, Trash2, Eye } from "lucide-react";

interface MentorsActionsProps {
  mentorId: number;
  mentorName: string;
}

export function MentorsActions({ mentorId, mentorName }: MentorsActionsProps) {
  const handleView = () => {
    console.log("멘토 조회", mentorId, mentorName);
    alert(`멘토 조회\nID: ${mentorId}\n이름: ${mentorName}`);
  };

  const handleEdit = () => {
    console.log("멘토 정보 수정", mentorId, mentorName);
    alert(`멘토 정보 수정\nID: ${mentorId}\n이름: ${mentorName}`);
  };

  const handleDelete = () => {
    console.log("멘토 삭제", mentorId, mentorName);
    alert(`멘토 삭제\nID: ${mentorId}\n이름: ${mentorName}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">작업 메뉴 열기</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-48 p-2">
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="h-auto w-full justify-start gap-2 px-2 py-1.5 font-normal"
            onClick={handleView}
          >
            <Eye className="h-4 w-4" />
            <span>멘토 조회</span>
          </Button>

          <Button
            variant="ghost"
            className="h-auto w-full justify-start gap-2 px-2 py-1.5 font-normal"
            onClick={handleEdit}
          >
            <Pencil className="h-4 w-4" />
            <span>멘토 정보 수정</span>
          </Button>

          <Button
            variant="ghost"
            className="h-auto w-full justify-start gap-2 px-2 py-1.5 font-normal"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            <span>멘토 삭제</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
