import { Suspense } from "react";

import CalendarPageClient from "@/components/calendar/calendar-page-client";

export default function CalendarPage() {
  return (
    <Suspense fallback={<div className="p-8 text-zinc-500">Cargando calendario...</div>}>
      <CalendarPageClient />
    </Suspense>
  );
}
