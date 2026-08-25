"use client";

import { useEffect, useRef, useState } from "react";
import { Modal, Checkbox } from "@ui/components/client";
import { STUDY_TAG_OPTIONS_BY_CATEGORY } from "@core/study-form";

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
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      setLocalTags(selectedTags);
    }

    wasOpenRef.current = isOpen;
  }, [isOpen, selectedTags]);

  const handleToggle = (tag: string, checked: boolean) => {
    setLocalTags((prevTags) => {
      if (checked) {
        if (prevTags.includes(tag) || prevTags.length >= 4) return prevTags;
        return [...prevTags, tag];
      }

      return prevTags.filter((t) => t !== tag);
    });
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
      width="l"
    >
      <div className="flex flex-col gap-5 pb-4">
        <p className="text-text-subtle mb-1 text-[15px] leading-[1.5]">
          추가하고 싶은 태그를 선택해주세요.
        </p>
        <p className="text-text-subtle text-[13px] leading-[1.5]">
          태그는 1개에서 4개까지 선택할 수 있습니다. ({localTags.length}/4)
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {STUDY_TAG_OPTIONS_BY_CATEGORY.map(({ category, options }) => (
            <section key={category}>
              <h3 className="text-text-basic text-[17px] font-bold leading-[1.5]">
                {category}
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
                {options.map((tag) => (
                  <Checkbox
                    key={tag.name}
                    id={`tag-${tag.name}`}
                    label={tag.label}
                    checked={localTags.includes(tag.label)}
                    onChange={(checked) => handleToggle(tag.label, checked)}
                    disabled={
                      !localTags.includes(tag.label) && localTags.length >= 4
                    }
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </Modal>
  );
}
