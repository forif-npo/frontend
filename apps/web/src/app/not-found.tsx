"use client";
import Error from "next/error";

export default function NotFoundPage() {
  return <Error statusCode={404} title="찾을 수 없습니다." />;
}
