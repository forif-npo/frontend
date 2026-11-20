/** @jest-environment jsdom */
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, jest } from "@jest/globals";
import type { StaffApplicationDetail, StaffRecruitmentRound } from "@core/types/staff-recruitment";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("./api", () => ({ getMyStaffApplication: jest.fn() }));
jest.mock("ky", () => ({ HTTPError: class HTTPError extends Error {} }));
jest.mock("@/components/PageHeader", () => ({
  PageHeader: () => <h1>지원서 수정</h1>,
}));
jest.mock("@ui/components/server", () => ({
  InlineLoadingState: ({ message }: { message: string }) => <p>{message}</p>,
  PageState: ({ title }: { title: string }) => <p>{title}</p>,
}));
jest.mock("./StaffApplicationForm", () => ({
  StaffApplicationForm: ({
    initialApplication,
  }: {
    initialApplication: StaffApplicationDetail;
  }) => <p>지원자 {initialApplication.applicant_name}</p>,
}));

import { getMyStaffApplication } from "./api";
import { StaffApplicationEditFlow } from "./StaffApplicationEditFlow";

const recruitment = (id: number) =>
  ({
    recruitment_id: id,
    act_year: 2027,
    act_semester: 1,
    application_open: true,
  }) as StaffRecruitmentRound;

const application = (id: number, name: string) =>
  ({
    application_id: id,
    recruitment_id: id,
    applicant_name: name,
  }) as StaffApplicationDetail;

describe("StaffApplicationEditFlow", () => {
  it("clears the previous application while a different recruitment loads", async () => {
    let resolveSecond!: (detail: StaffApplicationDetail) => void;
    jest.mocked(getMyStaffApplication).mockImplementation((id) =>
      id === 7
        ? Promise.resolve(application(7, "첫 지원자"))
        : new Promise((resolve) => {
            resolveSecond = resolve;
          }),
    );

    const view = render(
      <StaffApplicationEditFlow recruitment={recruitment(7)} />,
    );
    await waitFor(() =>
      expect(screen.getByText("지원자 첫 지원자")).toBeTruthy(),
    );

    view.rerender(<StaffApplicationEditFlow recruitment={recruitment(8)} />);
    expect(screen.queryByText("지원자 첫 지원자")).toBeNull();
    expect(screen.getByText("지원서를 불러오는 중입니다.")).toBeTruthy();

    resolveSecond(application(8, "다음 지원자"));
    await waitFor(() =>
      expect(screen.getByText("지원자 다음 지원자")).toBeTruthy(),
    );
  });
});
