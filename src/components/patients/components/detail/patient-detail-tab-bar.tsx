import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
import type { PatientDetailTabId } from "@/lib/hooks/use-patient-detail-tabs";

const PATIENT_DETAIL_TAB_ITEMS: ReadonlyArray<{
  id: PatientDetailTabId;
  label: string;
}> = [
  { id: "gallery", label: PATIENT_DETAIL_COPY.tabs.gallery },
  { id: "files", label: PATIENT_DETAIL_COPY.tabs.files },
];

export default function PatientDetailTabBar() {
  return (
    <TabsList
      variant="line"
      aria-label={PATIENT_DETAIL_COPY.breadcrumbRoot}
      className="no-scrollbar w-full shrink-0 justify-start overflow-x-auto border-b border-border-subtle"
    >
      {PATIENT_DETAIL_TAB_ITEMS.map((tab) => (
        <TabsTrigger
          key={tab.id}
          value={tab.id}
          className="shrink-0 rounded-none px-4 py-3 text-[0.8rem] font-medium whitespace-nowrap"
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
