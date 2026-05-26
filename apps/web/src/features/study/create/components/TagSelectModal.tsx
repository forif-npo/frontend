"use client";

import { useState } from "react";
import { Modal, Checkbox } from "@ui/components/client";
import { TAG_OPTIONS } from "../constants";

interface TagSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (tags: string[]) => void;
  selectedTags: string[];
}

export function TagSelectModal({
  isOpen,
  onClose,
  onConfirm,
  selectedTags,
}: TagSelectModalProps) {
  const [localTags, setLocalTags] = useState<string[]>(selectedTags);

  const handleToggle = (tag: string, checked: boolean) => {
    if (checked) {
      if (localTags.length >= 4) return;
      setLocalTags([...localTags, tag]);
    } else {
      setLocalTags(localTags.filter((t) => t !== tag));
    }
  };

  const handleConfirm = () => {
    onConfirm(localTags);
  };

  const handleClose = () => {
    setLocalTags(selectedTags);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title="태그 추가"
      confirmLabel="선택"
      cancelLabel="취소"
      width="m"
    >
      <div className="flex flex-col gap-2 pb-4">
        <p className="text-text-subtle mb-1 text-[15px] leading-[1.5]">
          추가하고 싶은 태그를 선택해주세요.
        </p>
        <p className="text-text-subtle mb-3 text-[13px] leading-[1.5]">
          태그는 1개에서 4개까지 선택할 수 있습니다. ({localTags.length}/4)
        </p>
        <div className="grid grid-cols-2 gap-3">
          {TAG_OPTIONS.map((tag) => (
            <Checkbox
              key={tag}
              id={`tag-${tag}`}
              label={tag}
              defaultChecked={localTags.includes(tag)}
              onChange={(checked) => handleToggle(tag, checked)}
              disabled={!localTags.includes(tag) && localTags.length >= 4}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
}
