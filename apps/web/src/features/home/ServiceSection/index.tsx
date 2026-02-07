"use client";

import { ArrowLeft, ArrowRight } from "@repo/assets/icons/lucide";
import { useState } from "react";
import { serviceData } from "@/mocks/data/home";
import { ServiceCard } from "./ServiceCard";

const ITEMS_PER_PAGE = 3;

export function ServiceSection() {
  const totalPages = Math.ceil(serviceData.length / ITEMS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(0);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const visibleItems = serviceData.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE,
  );

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 lg:px-0">
      <div className="mb-6">
        <h2 className="text-heading-l-mobile tracking-1 text-text-basic sm:text-heading-l font-bold">
          부가 서비스
        </h2>
      </div>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2">
            <div className="border-border-gray-light bg-surface-white flex h-10 items-center gap-1 rounded-full border px-4">
              <span className="text-body-m text-text-secondary font-bold">
                {currentPage + 1}
              </span>
              <span className="text-body-m text-text-basic font-bold">/</span>
              <span className="text-body-m text-text-basic font-bold">
                {totalPages}
              </span>
            </div>
            <button
              onClick={handlePrev}
              className="border-border-gray-light bg-surface-white hover:bg-surface-white-subtler flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border"
              aria-label="이전"
            >
              <ArrowLeft className="text-text-basic" size={20} />
            </button>
            <button
              onClick={handleNext}
              className="border-border-gray-light bg-surface-white hover:bg-surface-white-subtler flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border"
              aria-label="다음"
            >
              <ArrowRight className="text-text-basic" size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
