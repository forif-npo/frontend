"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Eye, MoreVertical } from "lucide-react";

interface StudyActionsProps {
  studyId: number;
  studyName: string;
}

/**
 * Study action menu component
 * Provides action buttons for each study row in the table
 */
export function StudyActions({ studyId, studyName }: StudyActionsProps) {
  const handleViewDetails = () => {
    // Placeholder until detail page exists
    console.log(`View details: ${studyId} - ${studyName}`);
    alert(`상세 페이지 준비 중\nID: ${studyId}\n이름: ${studyName}`);
  };

  // Future actions to be implemented:
  // const handleEdit = () => { ... }
  // const handleViewApplicants = () => { ... }
  // const handleDelete = () => { ... }

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
            onClick={handleViewDetails}
          >
            <Eye className="h-4 w-4" />
            <span>상세 보기</span>
          </Button>
          {/* Future actions: */}
          {/* <Button variant="ghost" className="..." onClick={handleEdit}>
            <Edit className="h-4 w-4" />
            <span>수정</span>
          </Button> */}
          {/* <Button variant="ghost" className="..." onClick={handleViewApplicants}>
            <Users className="h-4 w-4" />
            <span>지원자 보기</span>
          </Button> */}
          {/* <Button variant="ghost" className="..." onClick={handleDelete}>
            <Trash2 className="h-4 w-4 text-destructive" />
            <span className="text-destructive">삭제</span>
          </Button> */}
        </div>
      </PopoverContent>
    </Popover>
  );
}
