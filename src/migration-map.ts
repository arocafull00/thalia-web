export const WEB_MIGRATION_MAP = {
  routes: {
    "app/(auth)/login.web.tsx": "app/(auth)/login/page.tsx",
    "app/(auth)/register-employee.web.tsx": "app/(auth)/register-employee/page.tsx",
    "app/(onboarding)/create-clinic.web.tsx": "app/(onboarding)/create-clinic/page.tsx",
    "app/(onboarding)/invite-team.web.tsx": "app/(onboarding)/invite-team/page.tsx",
    "app/(app)/_layout.web.tsx": "app/(app)/layout.tsx",
    "app/(app)/dashboard/index.web.tsx": "app/(app)/dashboard/page.tsx",
    "app/(app)/calendar/index.web.tsx": "app/(app)/calendar/page.tsx",
    "app/(app)/appointments/index.web.tsx": "app/(app)/appointments/page.tsx",
    "app/(app)/patients/index.web.tsx": "app/(app)/patients/page.tsx",
    "app/(app)/employees/index.web.tsx": "app/(app)/employees/page.tsx",
    "app/(app)/inventory/index.web.tsx": "app/(app)/inventory/page.tsx",
    "app/(app)/finances/index.web.tsx": "app/(app)/finances/page.tsx",
    "app/(app)/settings/index.web.tsx": "app/(app)/settings/page.tsx",
  },
  components: {
    "src/components/ui/app-date-picker-popover.web.tsx":
      "src/components/ui/app-date-picker-popover.tsx",
    "src/components/calendar/calendar-employee-filter.web.tsx":
      "src/components/calendar/calendar-employee-filter.tsx",
    "src/components/calendar/calendar-employee-picker-dropdown.web.tsx":
      "src/components/calendar/calendar-employee-picker-dropdown.tsx",
    "src/components/finances/finances-month-selector.web.tsx":
      "src/components/finances/finances-month-selector.tsx",
    "src/components/patients/new-patient-date-field.web.tsx":
      "src/components/patients/new-patient-date-field.tsx",
    "src/components/appointments/new-appointment-datetime-field.web.tsx":
      "src/components/appointments/new-appointment-datetime-field.tsx",
    "src/components/dashboard/dashboard-appointment-row.web.tsx":
      "src/components/dashboard/dashboard-appointment-row.tsx",
    "src/components/settings/settings-profile-panel.web.tsx":
      "src/components/settings/settings-profile-panel.tsx",
    "src/components/onboarding/onboarding-intro-pager.web.tsx":
      "src/components/onboarding/onboarding-intro-pager.tsx",
  },
} as const;
