"use client";

import { PRIVACY_POLICY, TERMS_OF_SERVICE } from "@/constants/legal";
import { Modal } from "@ui/components/client";
import { Body } from "@ui/components/server";
import { useState } from "react";

type TermsType = "service" | "privacy";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: TermsType;
}

export function TermsModal({ isOpen, onClose, type }: TermsModalProps) {
  const title = type === "service" ? "서비스 이용약관" : "개인정보 처리방침";
  const content = type === "service" ? TERMS_OF_SERVICE : PRIVACY_POLICY;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      width="l"
      showCancelButton={false}
      showCloseIcon={true}
      confirmLabel="확인"
      onConfirm={onClose}
    >
      <Body size="s" className="whitespace-pre-line leading-relaxed">
        {content}
      </Body>
    </Modal>
  );
}

interface TermsButtonProps {
  type: TermsType;
  children: React.ReactNode;
  className?: string;
}

export function TermsButton({ type, children, className }: TermsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        {children}
      </button>
      <TermsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        type={type}
      />
    </>
  );
}
