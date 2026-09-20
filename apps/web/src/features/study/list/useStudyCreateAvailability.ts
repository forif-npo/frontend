import { getCurrentSemesterSchedules } from "@/features/semester/schedule-api";
import { useEffect, useState } from "react";

export function useStudyCreateAvailability() {
  const [isStudyCreateOpen, setIsStudyCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadAvailability = async () => {
      try {
        const schedules = await getCurrentSemesterSchedules();
        const isOpen = schedules.some(
          (schedule) => schedule.phase === "MENTOR_RECRUIT" && schedule.open,
        );

        if (isMounted) setIsStudyCreateOpen(isOpen);
      } catch {
        if (isMounted) setIsStudyCreateOpen(false);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadAvailability();

    return () => {
      isMounted = false;
    };
  }, []);

  return { isStudyCreateOpen, isLoading };
}
