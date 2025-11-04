"use client";

import { departmentsOptions } from "@/constants/options.constant";
import { SignUpValues } from "@core/schemas";
import { Modal } from "@ui/components/client";
import { Body, Heading } from "@ui/components/server";

interface SignUpConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formValues: SignUpValues;
}

export function SignUpConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  formValues,
}: SignUpConfirmationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title=""
      confirmLabel="가입"
      cancelLabel="취소"
      width="m"
      showFooterBorder={false}
      showHeaderBorder={false}
    >
      <div className="space-y-6">
        <div className="ml-4 mt-1">
          <Heading className="text-text-basic" size="xxs">
            회원가입 확인
          </Heading>
          <Heading size="m" className="text-text-basic mt-2">
            해당 정보로 회원가입 하시겠어요?
          </Heading>
          <Body size="m" className="text-text-subtle mt-2">
            <span className="text-text-primary">이메일</span>과{" "}
            <span className="text-text-primary">학번</span>을 제외한 정보는
            로그인 후 수정 가능해요
          </Body>
        </div>
        <div className="border-border-secondary mx-4 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-secondary-subtler border-divider-gray-light border-b">
                <th className="text-text-bolder w-24 px-4 py-3 text-left text-sm font-semibold">
                  항목
                </th>
                <th className="text-text-bolder px-4 py-3 text-left text-sm font-semibold">
                  가입 정보
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-divider-gray-light border-b">
                <td className="text-text-subtle px-4 py-3 text-sm">이메일</td>
                <td className="text-text-subtle px-4 py-3 text-sm">
                  {formValues.email}
                </td>
              </tr>
              <tr className="bg-surface-secondary border-divider-gray-light border-b">
                <td className="text-text-subtle px-4 py-3 text-sm">학번</td>
                <td className="text-text-subtle px-4 py-3 text-sm">
                  {formValues.id}
                </td>
              </tr>
              <tr className="border-divider-gray-light border-b">
                <td className="text-text-subtle px-4 py-3 text-sm">이름</td>
                <td className="text-text-subtle px-4 py-3 text-sm">
                  {formValues.name}
                </td>
              </tr>
              <tr className="bg-surface-secondary border-divider-gray-light border-b">
                <td className="text-text-subtle px-4 py-3 text-sm">학과</td>
                <td className="text-text-subtle px-4 py-3 text-sm">
                  {departmentsOptions.find(
                    (opt) => opt.value === formValues.department,
                  )?.label || formValues.department}
                </td>
              </tr>
              <tr className="bg-surface-secondary border-divider-gray-light border-b">
                <td className="text-text-subtle px-4 py-3 text-sm">전화번호</td>
                <td className="text-text-subtle px-4 py-3 text-sm">
                  {formValues.phoneNumber}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}
