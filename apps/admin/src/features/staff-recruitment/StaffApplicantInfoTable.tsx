import type { StaffApplicationDetail } from "@core/types/staff-recruitment";
import { formatStaffRecruitmentDepartment } from "@core/staff-recruitment";
import { formatPhoneNumber } from "@core/utils/phone-number";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

function departmentName(detail: StaffApplicationDetail, priority: 1 | 2) {
  const name = detail.applied_departments.find(
    (department) => department.priority === priority,
  )?.name;
  return name ? formatStaffRecruitmentDepartment(name) : "-";
}

export function StaffApplicantInfoTable({
  detail,
  interviewTime,
}: {
  detail: StaffApplicationDetail;
  interviewTime?: string;
}) {
  const rows: [string, string | number][] = [
    ["이름", detail.applicant_name],
    ["학과", detail.applicant_department ?? "-"],
    ["학번", detail.applicant_user_id ?? "탈퇴 회원"],
    ["이메일", detail.applicant_email],
    ["연락처", formatPhoneNumber(detail.applicant_phone_num) || "-"],
    ["1지망 부서", departmentName(detail, 1)],
    ["2지망 부서", departmentName(detail, 2)],
  ];
  if (interviewTime) rows.push(["면접 일시", interviewTime]);

  return (
    <Table className="text-sm">
      <TableBody>
        {rows.map(([label, value]) => (
          <TableRow key={label} className="hover:bg-transparent">
            <th
              scope="row"
              className="text-muted-foreground w-28 whitespace-nowrap py-3 pr-4 text-left font-normal"
            >
              {label}
            </th>
            <TableCell className="break-all py-3 text-left">{value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
