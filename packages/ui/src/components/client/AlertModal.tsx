"use client";

import React from "react";
import { Modal } from "./Modal";

export interface AlertModalProps {
  isOpen: boolean;
  description: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  showCancelButton?: boolean;
  descriptionClassName?: string;
}

export function AlertModal({
  isOpen,
  description,
  onClose,
  onConfirm,
  onCancel,
  confirmLabel = "확인",
  cancelLabel = "취소",
  showCancelButton,
  descriptionClassName,
}: AlertModalProps) {
  const isConfirmation = Boolean(onConfirm);
  const shouldShowCancelButton = showCancelButton ?? isConfirmation;

  const handleClose = () => {
    onCancel?.();
    onClose();
  };

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title=""
      showCancelButton={shouldShowCancelButton}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      showHeaderBorder={false}
      showFooterBorder={false}
      showHeader={false}
      showCloseIcon={false}
      closeOnOverlayClick={false}
      ariaLabel="알림"
      layout="compact"
    >
      <div className="flex min-h-[96px] items-center">
        <p
          className={`text-text-basic text-body-m whitespace-pre-line ${descriptionClassName ?? ""}`}
        >
          {description}
        </p>
      </div>
    </Modal>
  );
}
