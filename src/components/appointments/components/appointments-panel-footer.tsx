import PageCardFooter from "@/components/ui/page-card-footer";
import { APPOINTMENTS_COPY } from "@/copy/appointments-copy";

type AppointmentsPanelFooterProps = {
  count: number;
};

export default function AppointmentsPanelFooter({
  count,
}: AppointmentsPanelFooterProps) {
  const label =
    count === 1
      ? APPOINTMENTS_COPY.panel.countSingular
      : APPOINTMENTS_COPY.panel.countPlural.replace("{count}", String(count));

  return (
    <PageCardFooter>
      <span className="num">{label}</span>
    </PageCardFooter>
  );
}
