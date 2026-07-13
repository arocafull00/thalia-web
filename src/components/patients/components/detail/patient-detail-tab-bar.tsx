import { PATIENT_DETAIL_COPY } from "@/copy/patient-detail-copy";
import type { PatientDetailTabId } from "@/lib/hooks/use-patient-detail-tabs";

import PatientDetailTabButton from "./patient-detail-tab-button";

const PATIENT_DETAIL_TAB_ITEMS: ReadonlyArray<{
  id: PatientDetailTabId;
  label: string;
}> = [
  { id: "summary", label: PATIENT_DETAIL_COPY.tabs.summary },
  { id: "clinical-history", label: PATIENT_DETAIL_COPY.tabs.clinicalHistory },
  { id: "treatments", label: PATIENT_DETAIL_COPY.tabs.treatments },
  { id: "appointments", label: PATIENT_DETAIL_COPY.tabs.appointments },
  { id: "gallery", label: PATIENT_DETAIL_COPY.tabs.gallery },
  { id: "files", label: PATIENT_DETAIL_COPY.tabs.files },
];

type PatientDetailTabBarProps = {
  activeTab: PatientDetailTabId;
  onTabChange: (tabId: PatientDetailTabId) => void;
};

export default function PatientDetailTabBar({
  activeTab,
  onTabChange,
}: PatientDetailTabBarProps) {
  return (
    <nav
      role="tablist"
      aria-label={PATIENT_DETAIL_COPY.breadcrumbRoot}
      className="shrink-0 border-b border-border-subtle bg-surface"
    >
      <div className="flex overflow-x-auto gap-2 px-4">
        {PATIENT_DETAIL_TAB_ITEMS.map((tab) => (
          <PatientDetailTabButton
            key={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          />
        ))}
      </div>
    </nav>
  );
}
