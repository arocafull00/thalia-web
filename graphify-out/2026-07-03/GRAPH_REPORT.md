# Graph Report - thalia-web  (2026-07-03)

## Corpus Check
- 289 files · ~69,286 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1073 nodes · 2556 edges · 60 communities (45 shown, 15 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b5512b12`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_useAuth|useAuth]]
- [[_COMMUNITY_appointments-store.ts|appointments-store.ts]]
- [[_COMMUNITY_use-schedule-x-calendar.ts|use-schedule-x-calendar.ts]]
- [[_COMMUNITY_format.ts|format.ts]]
- [[_COMMUNITY_cn|cn]]
- [[_COMMUNITY_login-form-panel.tsx|login-form-panel.tsx]]
- [[_COMMUNITY_app-layout-client.tsx|app-layout-client.tsx]]
- [[_COMMUNITY_patients-page-client.tsx|patients-page-client.tsx]]
- [[_COMMUNITY_employee-detail-page-client.tsx|employee-detail-page-client.tsx]]
- [[_COMMUNITY_employee-edit-dialog.tsx|employee-edit-dialog.tsx]]
- [[_COMMUNITY_appointments-page-client.tsx|appointments-page-client.tsx]]
- [[_COMMUNITY_employees-page-client.tsx|employees-page-client.tsx]]
- [[_COMMUNITY_layout.tsx|layout.tsx]]
- [[_COMMUNITY_action-button.tsx|action-button.tsx]]
- [[_COMMUNITY_transactions-columns.tsx|transactions-columns.tsx]]
- [[_COMMUNITY_owner-clinic-form.ts|owner-clinic-form.ts]]
- [[_COMMUNITY_proxy.ts|proxy.ts]]
- [[_COMMUNITY_app-date-picker-popover.tsx|app-date-picker-popover.tsx]]
- [[_COMMUNITY_app-dialog-trigger.tsx|app-dialog-trigger.tsx]]
- [[_COMMUNITY_migration-map.ts|migration-map.ts]]
- [[_COMMUNITY_index.ts|index.ts]]
- [[_COMMUNITY_index.ts|index.ts]]
- [[_COMMUNITY_index.ts|index.ts]]
- [[_COMMUNITY_appointment-create-dialog.tsx|appointment-create-dialog.tsx]]
- [[_COMMUNITY_index.ts|index.ts]]
- [[_COMMUNITY_index.ts|index.ts]]
- [[_COMMUNITY_index.ts|index.ts]]
- [[_COMMUNITY_index.ts|index.ts]]
- [[_COMMUNITY_index.ts|index.ts]]
- [[_COMMUNITY_patients-page-client.tsx|patients-page-client.tsx]]
- [[_COMMUNITY_action-button.tsx|action-button.tsx]]
- [[_COMMUNITY_inventory-page-client.tsx|inventory-page-client.tsx]]
- [[_COMMUNITY_notice.tsx|notice.tsx]]
- [[_COMMUNITY_use-inventory-item-create-dialog.ts|use-inventory-item-create-dialog.ts]]
- [[_COMMUNITY_patient-edit-dialog.tsx|patient-edit-dialog.tsx]]
- [[_COMMUNITY_patient-detail-page-client.tsx|patient-detail-page-client.tsx]]
- [[_COMMUNITY_use-inventory.ts|use-inventory.ts]]
- [[_COMMUNITY_dashboard-appointment-row.tsx|dashboard-appointment-row.tsx]]
- [[_COMMUNITY_app-dialog-header.tsx|app-dialog-header.tsx]]
- [[_COMMUNITY_use-patient-edit-dialog.ts|use-patient-edit-dialog.ts]]
- [[_COMMUNITY_dependencies|dependencies]]
- [[_COMMUNITY_components.json|components.json]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_app-date-field.tsx|app-date-field.tsx]]
- [[_COMMUNITY_devDependencies|devDependencies]]
- [[_COMMUNITY_scripts|scripts]]
- [[_COMMUNITY_database.types.ts|database.types.ts]]
- [[_COMMUNITY_package.json|package.json]]
- [[_COMMUNITY_eslint.config.mjs|eslint.config.mjs]]
- [[_COMMUNITY_next.config.ts|next.config.ts]]
- [[_COMMUNITY_postcss.config.mjs|postcss.config.mjs]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 41 edges
2. `useAuth()` - 34 edges
3. `isInitialLoading()` - 26 edges
4. `ActionButton()` - 22 edges
5. `Notice()` - 22 edges
6. `supabase` - 21 edges
7. `AppointmentWithRelations` - 18 edges
8. `useFileUrl()` - 16 edges
9. `Employee` - 16 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `proxy()` --calls--> `updateSession()`  [EXTRACTED]
  proxy.ts → src/lib/supabase/proxy.ts
- `proxy()` --calls--> `withSessionCookies()`  [EXTRACTED]
  proxy.ts → src/lib/supabase/proxy.ts
- `EmployeeProfileSummary()` --calls--> `formatDate()`  [EXTRACTED]
  src/components/employees/components/employee-profile-summary.tsx → src/lib/format.ts
- `AppointmentDetailPageClient()` --calls--> `useAppointmentDetail()`  [EXTRACTED]
  src/components/appointments/appointment-detail-page-client.tsx → src/lib/hooks/use-appointment-detail.ts
- `AppointmentCreateDialog()` --calls--> `useAppointmentCreateDialog()`  [EXTRACTED]
  src/components/appointments/components/appointment-create-dialog.tsx → src/lib/hooks/use-appointment-create-dialog.ts

## Import Cycles
- 3-file cycle: `src/lib/active-clinic-id.ts -> src/stores/auth-store.ts -> src/stores/employees-store.ts -> src/lib/active-clinic-id.ts`

## Communities (60 total, 15 thin omitted)

### Community 0 - "useAuth"
Cohesion: 0.31
Nodes (7): groupItemsByMonth(), dotClassNames, ProfileTimelineItem, ProfileTimelineItemRow(), ProfileTimelineItemRowProps, ProfileTimeline(), ProfileTimelineProps

### Community 1 - "appointments-store.ts"
Cohesion: 0.06
Nodes (58): getActiveClinicId(), employeeColors, employeeRoles, useCreateInventoryItem(), useInventoryItem(), useInventoryMovements(), useRecordInventoryMovement(), useCreateTreatmentType() (+50 more)

### Community 2 - "use-schedule-x-calendar.ts"
Cohesion: 0.07
Nodes (40): @schedule-x/calendar, CalendarEmployeeFilter(), CalendarPageClient(), CalendarEmptyHeader(), CalendarToolbar(), CalendarToolbarProps, useCalendarPage(), buildScheduleEvents() (+32 more)

### Community 3 - "format.ts"
Cohesion: 0.18
Nodes (10): AppLayoutClient(), AppLayoutClientProps, AppShell(), AppShellProps, AppSidebar(), NavItem, SidebarItem(), SidebarItemProps (+2 more)

### Community 4 - "cn"
Cohesion: 0.07
Nodes (45): AppSearchableCombobox(), AppSearchableComboboxOption, AppSearchableComboboxProps, AppSearchableComboboxItem(), AppSearchableComboboxItemProps, AppSearchableMultiSelectOption, AppSearchableMultiSelectProps, AppSearchableMultiSelectOption() (+37 more)

### Community 5 - "login-form-panel.tsx"
Cohesion: 0.06
Nodes (46): EmployeeProfileHeader(), EmployeeProfileHeaderProps, getAvatarStyle(), PatientProfileHeader(), PatientProfileHeaderProps, SettingsAccountPanel(), SettingsAccountPanelProps, SettingsActionRow() (+38 more)

### Community 7 - "patients-page-client.tsx"
Cohesion: 0.12
Nodes (17): AppointmentDetailPageClient(), AppointmentDetailPageClientProps, resolveTotalDurationMinutes(), AppointmentDetailCardProps, AppointmentDetailSidebar(), AppointmentDetailSidebarProps, reminderLabel(), AppointmentHeader() (+9 more)

### Community 8 - "employee-detail-page-client.tsx"
Cohesion: 0.16
Nodes (8): AppointmentsPageClient(), PatientQuickActionsProps, ActionButton(), SkeletonListItem(), SkeletonList(), useAppointmentsPage(), TopbarSearchState, useTopbarSearchStore

### Community 9 - "employee-edit-dialog.tsx"
Cohesion: 0.31
Nodes (7): AppointmentDetailTreatmentItem(), AppointmentDetailTreatmentItemProps, AppointmentTreatmentsSection(), AppointmentTreatmentsSectionProps, FinancesWeeklyRow(), FinancesWeeklyRowProps, formatCurrency()

### Community 10 - "appointments-page-client.tsx"
Cohesion: 0.23
Nodes (8): EmployeesPageClient(), roles, useActiveClinic(), useClinicId(), useDebouncedValue(), EmployeesUiStore, useEmployeesUiStore, EmployeeRole

### Community 11 - "employees-page-client.tsx"
Cohesion: 0.06
Nodes (44): CategoryBreakdownItem, FinancesCategoryBreakdownProps, FinancesCategoryRow(), FinancesCategoryRowProps, FinancesMetricItem(), FinancesMetricItemProps, FinancesMovementsSectionProps, FinancesSummaryMetrics() (+36 more)

### Community 12 - "layout.tsx"
Cohesion: 0.09
Nodes (23): geistMono, geistSans, metadata, viewport, AuthProvider(), AuthProviderProps, getClientHydratedSnapshot(), getServerHydratedSnapshot() (+15 more)

### Community 13 - "action-button.tsx"
Cohesion: 0.07
Nodes (35): DashboardPageClient(), formatTodayTitle(), EmployeeInviteFormProps, roleOptions, EmployeeProfileSidebar(), EmployeeProfileSidebarProps, EmployeeProfileSummary(), EmployeeProfileSummaryProps (+27 more)

### Community 14 - "transactions-columns.tsx"
Cohesion: 0.21
Nodes (9): mapOperationalRoleToEmployeeRole(), OperationalRoleOption, operationalRoleOptions, buildCreateClinicPayload(), buildCreateClinicPayloadFromProfile(), CreateClinicPayload, OwnerClinicFormValues, OwnerClinicOnlyValues (+1 more)

### Community 15 - "owner-clinic-form.ts"
Cohesion: 0.17
Nodes (20): AppointmentStatusBadge(), AppointmentStatusBadgeProps, statusStyles, EmployeeAppointmentRow(), EmployeeAppointmentRowProps, EmployeeTimeline(), EmployeeTimelineProps, mapAppointmentsToTimelineItems() (+12 more)

### Community 16 - "proxy.ts"
Cohesion: 0.21
Nodes (7): config, proxy(), publicRoutes, pwaRoutes, SessionUpdateResult, updateSession(), withSessionCookies()

### Community 28 - "appointment-create-dialog.tsx"
Cohesion: 0.08
Nodes (31): appointmentFormSchema, createDefaultStartsAt(), createDefaultValues(), appointmentFieldsSchema, appointmentSchema, AppointmentSchemaInput, appointmentUpdateSchema, AppointmentUpdateSchemaInput (+23 more)

### Community 36 - "patients-page-client.tsx"
Cohesion: 0.15
Nodes (10): LoginAuthTabs(), LoginAuthTabsProps, LoginFormFieldsProps, LoginFormPanel(), LoginFormPanelProps, LoginHeroIllustration(), loginIllustrationSvg, HERO_INDICATORS (+2 more)

### Community 37 - "action-button.tsx"
Cohesion: 0.09
Nodes (23): appointmentsColumns, AppointmentsTable(), AppointmentsTableProps, employeesColumns, EmployeesTable(), EmployeesTableProps, inventoryColumns, InventoryTable() (+15 more)

### Community 38 - "inventory-page-client.tsx"
Cohesion: 0.24
Nodes (10): EmployeeEditDialog(), EmployeeEditDialogProps, EmployeeEditFormProps, roleOptions, EMPLOYEE_EDIT_COPY, employeeEditFormSchema, EmployeeEditFormValues, toFormValues() (+2 more)

### Community 39 - "notice.tsx"
Cohesion: 0.06
Nodes (54): useLogin(), RegisterEmployeeFormCopy, RegisterEmployeeFormProps, RegisterEmployeeSidebar(), RegisterEmployeeSidebarProps, useRegisterEmployee(), RegisterEmployeePageClient(), CreateClinicPageClient() (+46 more)

### Community 41 - "use-inventory-item-create-dialog.ts"
Cohesion: 0.22
Nodes (9): InventoryItemCreateForm(), InventoryItemCreateFormProps, InventoryPageClient(), PageHeader(), INVENTORY_ITEM_CREATE_COPY, defaultValues, inventoryFormSchema, InventoryFormValues (+1 more)

### Community 42 - "patient-edit-dialog.tsx"
Cohesion: 0.14
Nodes (15): AppointmentCreateDialog(), AppointmentCreateDialogProps, AppConfirmDialogProps, AppDialog(), AppDialogProps, AppDialogDescription(), AppDialogDescriptionProps, AppDialogFooter() (+7 more)

### Community 43 - "patient-detail-page-client.tsx"
Cohesion: 0.14
Nodes (18): PatientInfoSectionProps, PatientProfileSidebar(), PatientProfileSidebarProps, PatientDetailPageClient(), PatientDetailPageClientProps, ProfileInfoRow(), ProfileInfoRowProps, PATIENT_DETAIL_COPY (+10 more)

### Community 45 - "use-inventory.ts"
Cohesion: 0.32
Nodes (4): AppDialogClose(), AppDialogCloseProps, AppDialogContentProps, APP_DIALOG_COPY

### Community 48 - "dashboard-appointment-row.tsx"
Cohesion: 0.36
Nodes (5): DashboardAppointmentRow(), DashboardAppointmentRowProps, formatAppointmentDuration(), formatTime(), AppointmentWithRelations

### Community 49 - "app-dialog-header.tsx"
Cohesion: 0.24
Nodes (7): PatientCreateFormProps, PatientsPageClient(), PATIENT_CREATE_COPY, defaultValues, patientFormSchema, PatientFormValues, usePatientCreateDialog()

### Community 55 - "use-patient-edit-dialog.ts"
Cohesion: 0.24
Nodes (9): PatientEditDialog(), PatientEditDialogProps, AppSheetContent(), AppSheetContentProps, PATIENT_EDIT_COPY, patientFormSchema, toFormValues(), usePatientEditDialog() (+1 more)

### Community 57 - "dependencies"
Cohesion: 0.06
Nodes (32): dependencies, @base-ui/react, class-variance-authority, clsx, date-fns, @hookform/resolvers, lucide-react, match-sorter (+24 more)

### Community 82 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 89 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 102 - "app-date-field.tsx"
Cohesion: 0.16
Nodes (15): AppointmentCreateFormProps, NewAppointmentDatetimeField(), NewAppointmentDatetimeFieldProps, NewPatientDateField(), NewPatientDateFieldProps, AppDateField(), AppDateFieldProps, AppDatePopoverField() (+7 more)

### Community 130 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, husky, lint-staged, prettier, tailwindcss, @tailwindcss/postcss (+4 more)

### Community 186 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, dev:https, lint, lint:staged, prepare, start (+1 more)

### Community 208 - "database.types.ts"
Cohesion: 0.24
Nodes (8): PatientInfoSection(), formatAppointmentDay(), formatAppointmentMonth(), formatBirthDateWithAge(), formatInputDate(), formatInputDateTime(), formatPatientLastVisitLabel(), toLocalDate()

### Community 221 - "package.json"
Cohesion: 0.33
Nodes (5): lint-staged, *.{ts,tsx}, name, private, version

## Knowledge Gaps
- **298 isolated node(s):** `geistSans`, `geistMono`, `metadata`, `viewport`, `$schema` (+293 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `use-schedule-x-calendar.ts`, `package.json`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `@schedule-x/calendar` connect `use-schedule-x-calendar.ts` to `dependencies`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `ActionButton()` connect `employee-detail-page-client.tsx` to `use-schedule-x-calendar.ts`, `patients-page-client.tsx`, `login-form-panel.tsx`, `inventory-page-client.tsx`, `notice.tsx`, `patients-page-client.tsx`, `use-inventory-item-create-dialog.ts`, `patient-edit-dialog.tsx`, `appointments-page-client.tsx`, `employees-page-client.tsx`, `action-button.tsx`, `layout.tsx`, `app-dialog-header.tsx`, `use-patient-edit-dialog.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `geistSans`, `geistMono`, `metadata` to the rest of the system?**
  _298 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `appointments-store.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06142728093947606 - nodes in this community are weakly interconnected._
- **Should `use-schedule-x-calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06604324956165984 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.07191961924907457 - nodes in this community are weakly interconnected._