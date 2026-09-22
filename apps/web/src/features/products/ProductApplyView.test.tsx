/** @jest-environment jsdom */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { ButtonHTMLAttributes, ReactNode } from "react";

jest.mock("@ui/components/client", () => ({
  AlertModal: ({
    isOpen,
    description,
    onClose,
  }: {
    isOpen: boolean;
    description: ReactNode;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div role="dialog" aria-label="알림">
        <p>{description}</p>
        <button onClick={onClose}>확인</button>
      </div>
    ) : null,
  Button: ({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
  FileUpload: () => null,
  SelectBox: () => null,
  TextArea: () => null,
  TextInput: () => null,
}));

jest.mock("@ui/components/server", () => ({
  HintText: ({ children }: { children: ReactNode }) => <p>{children}</p>,
  Label: ({ children }: { children: ReactNode }) => <label>{children}</label>,
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@core/utils/api-client", () => ({
  handleApiError: jest.fn(),
}));

jest.mock("./api", () => ({
  applyProduct: jest.fn(),
  deleteProductApplication: jest.fn(),
  updateProductApplication: jest.fn(),
}));

jest.mock("@/components/ActionConfirmModal", () => ({
  ActionConfirmModal: ({
    isOpen,
    onClose,
    onConfirm,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }) =>
    isOpen ? (
      <div role="dialog" aria-label="작업 확인">
        <button onClick={onClose}>확인 취소</button>
        <button onClick={onConfirm}>취소 확정</button>
      </div>
    ) : null,
}));

import { handleApiError } from "@core/utils/api-client";
import { deleteProductApplication } from "./api";
import { ProductApplyView } from "./ProductApplyView";

const mockedDeleteProductApplication = deleteProductApplication as unknown as {
  mockReset: () => void;
  mockRejectedValue: (value: unknown) => void;
};
const mockedHandleApiError = handleApiError as unknown as {
  mockReset: () => void;
  mockResolvedValue: (value: string) => void;
};

describe("ProductApplyView", () => {
  beforeEach(() => {
    mockedDeleteProductApplication.mockReset();
    mockedHandleApiError.mockReset();
  });

  it("shows a modal when cancelling an application fails", async () => {
    mockedDeleteProductApplication.mockRejectedValue(new Error("request failed"));
    mockedHandleApiError.mockResolvedValue(
      "검토 대기 상태의 신청만 처리할 수 있습니다.",
    );

    render(
      <ProductApplyView
        application={{
          application_id: 101,
          name: "sample service",
          slug: "sample-service",
          one_liner: "sample description",
          description: "sample detailed description",
          source_type: "SIDE",
          service_url: null,
          github_url: null,
          thumbnail_url: "https://example.test/sample.png",
          tags: [],
          tech_stack: [],
          status: "PENDING",
          operation_status: null,
          reject_reason: null,
          applied_at: "2099-01-01T00:00:00Z",
        }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "신청 취소" }));
    fireEvent.click(screen.getByRole("button", { name: "취소 확정" }));

    await waitFor(() => {
      expect(deleteProductApplication).toHaveBeenCalledWith(101);
    });
    expect(
      (await screen.findByRole("dialog", { name: "알림" })).textContent,
    ).toContain("검토 대기 상태의 신청만 처리할 수 있습니다.");
    expect(screen.queryByText("긴급")).toBeNull();
  });
});
