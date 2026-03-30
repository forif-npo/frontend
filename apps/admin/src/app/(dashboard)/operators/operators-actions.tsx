"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Crown,
  UserRoundPlus,
} from "lucide-react";

interface OperatorActionsProps {
  operatorId: number;
  operatorName: string;
}

export function OperatorsActions({
  operatorId,
  operatorName,
}: OperatorActionsProps) {
  const handleEdit = () => {
    console.log("운영진 정보 수정", operatorId, operatorName);
    alert(`운영진 정보 수정\nID: ${operatorId}\n이름: ${operatorName}`);
  };

  const handleDelete = () => {
    console.log("운영진 삭제", operatorId, operatorName);
    alert(`운영진 삭제\nID: ${operatorId}\n이름: ${operatorName}`);
  };

  const handleDelegatePresident = () => {
    console.log("차기 회장 위임", operatorId, operatorName);
    alert(`차기 회장 위임\nID: ${operatorId}\n이름: ${operatorName}`);
  };

  const handleAssignVicePresident = () => {
    console.log("부회장 임명", operatorId, operatorName);
    alert(`부회장 임명\nID: ${operatorId}\n이름: ${operatorName}`);
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
            onClick={handleEdit}
          >
            <Pencil className="h-4 w-4" />
            <span>운영진 정보 수정</span>
          </Button>

          <Button
            variant="ghost"
            className="h-auto w-full justify-start gap-2 px-2 py-1.5 font-normal"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            <span>운영진 삭제</span>
          </Button>

          <Button
            variant="ghost"
            className="h-auto w-full justify-start gap-2 px-2 py-1.5 font-normal"
            onClick={handleDelegatePresident}
          >
            <Crown className="h-4 w-4" />
            <span>차기 회장 위임</span>
          </Button>

          <Button
            variant="ghost"
            className="h-auto w-full justify-start gap-2 px-2 py-1.5 font-normal"
            onClick={handleAssignVicePresident}
          >
            <UserRoundPlus className="h-4 w-4" />
            <span>부회장 임명</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
