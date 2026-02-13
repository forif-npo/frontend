"use client";
import Error from "next/error";

export default function NotFoundPage() {
  return (
    <>
      <Error
        statusCode={404}
        title="해당 페이지 주소를 찾을 수 없습니다. SW팀에게 문의해주세요"
      />
    </>
  );
}
