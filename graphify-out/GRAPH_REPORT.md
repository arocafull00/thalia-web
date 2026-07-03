# Graph Report - thalia-web  (2026-07-03)

## Corpus Check
- 289 files · ~69,297 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1073 nodes · 2290 edges · 70 communities (53 shown, 17 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8b21a953`
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
- [[_COMMUNITY_transactions-columns.tsx|transactions-columns.tsx]]
- [[_COMMUNITY_use-inventory-item-create-dialog.ts|use-inventory-item-create-dialog.ts]]
- [[_COMMUNITY_patient-edit-dialog.tsx|patient-edit-dialog.tsx]]
- [[_COMMUNITY_patient-detail-page-client.tsx|patient-detail-page-client.tsx]]
- [[_COMMUNITY_inventory-columns.tsx|inventory-columns.tsx]]
- [[_COMMUNITY_use-inventory.ts|use-inventory.ts]]
- [[_COMMUNITY_Patient|Patient]]
- [[_COMMUNITY_dashboard-appointment-row.tsx|dashboard-appointment-row.tsx]]
- [[_COMMUNITY_app-dialog-header.tsx|app-dialog-header.tsx]]
- [[_COMMUNITY_patient-timeline.tsx|patient-timeline.tsx]]
- [[_COMMUNITY_format.ts|format.ts]]
- [[_COMMUNITY_employee-profile-header.tsx|employee-profile-header.tsx]]
- [[_COMMUNITY_appointment-create-form.tsx|appointment-create-form.tsx]]
- [[_COMMUNITY_appointment-treatments-section.tsx|appointment-treatments-section.tsx]]
- [[_COMMUNITY_use-patient-edit-dialog.ts|use-patient-edit-dialog.ts]]
- [[_COMMUNITY_profile-timeline.tsx|profile-timeline.tsx]]
- [[_COMMUNITY_dependencies|dependencies]]
- [[_COMMUNITY_page.tsx|page.tsx]]
- [[_COMMUNITY_components.json|components.json]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_app-date-field.tsx|app-date-field.tsx]]
- [[_COMMUNITY_devDependencies|devDependencies]]
- [[_COMMUNITY_scripts|scripts]]
- [[_COMMUNITY_package.json|package.json]]
- [[_COMMUNITY_eslint.config.mjs|eslint.config.mjs]]
- [[_COMMUNITY_next.config.ts|next.config.ts]]
- [[_COMMUNITY_postcss.config.mjs|postcss.config.mjs]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 32 edges
2. `useAuth()` - 28 edges
3. `isInitialLoading()` - 26 edges
4. `ActionButton()` - 22 edges
5. `supabase` - 19 edges
6. `AppointmentWithRelations` - 18 edges
7. `Employee` - 16 edges
8. `compilerOptions` - 16 edges
9. `formatAppointmentTimeRange()` - 14 edges
10. `usePostAuthRedirect()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `proxy()` --calls--> `updateSession()`  [EXTRACTED]
  proxy.ts → src/lib/supabase/proxy.ts
- `proxy()` --calls--> `withSessionCookies()`  [EXTRACTED]
  proxy.ts → src/lib/supabase/proxy.ts
- `AppointmentDetailSidebar()` --calls--> `formatAppointmentTimeRange()`  [EXTRACTED]
  src/components/appointments/components/appointment-detail-sidebar.tsx → src/lib/format.ts
- `AppointmentHeader()` --calls--> `formatAppointmentDuration()`  [EXTRACTED]
  src/components/appointments/components/appointment-header.tsx → src/lib/format.ts
- `AppointmentHeader()` --calls--> `formatAppointmentTimeRange()`  [EXTRACTED]
  src/components/appointments/components/appointment-header.tsx → src/lib/format.ts

## Import Cycles
- 3-file cycle: `src/lib/active-clinic-id.ts -> src/stores/auth-store.ts -> src/stores/employees-store.ts -> src/lib/active-clinic-id.ts`

## Communities (70 total, 17 thin omitted)

### Community 0 - "useAuth"
Cohesion: 0.12
Nodes (21): SettingsProfilePanel(), SettingsProfilePanelProps, SidebarClinicSwitcherProps, SidebarProfileFooter(), SIDEBAR_COPY, normalizeEmail(), PendingClinicRequest, clinicMembershipRoleLabel() (+13 more)

### Community 1 - "appointments-store.ts"
Cohesion: 0.07
Nodes (49): FinancesMonthSelector(), FinancesTabBarProps, FinancesTabValue, getActiveClinicId(), signInWithGoogleFlow(), transactionTypeForTab(), useFinancesPage(), useFinancialSummary() (+41 more)

### Community 2 - "use-schedule-x-calendar.ts"
Cohesion: 0.05
Nodes (44): @schedule-x/calendar, CalendarEmployeeFilter(), CalendarPageClient(), CalendarToolbar(), CalendarToolbarProps, useCalendarPage(), buildScheduleEvents(), getInitialCalendarConfig() (+36 more)

### Community 3 - "format.ts"
Cohesion: 0.18
Nodes (10): AppLayoutClient(), AppLayoutClientProps, AppShell(), AppShellProps, AppSidebar(), NavItem, SidebarItem(), SidebarItemProps (+2 more)

### Community 4 - "cn"
Cohesion: 0.09
Nodes (36): AppSearchableCombobox(), AppSearchableComboboxOption, AppSearchableComboboxProps, AppSearchableComboboxItem(), AppSearchableComboboxItemProps, AppSearchableMultiSelectOption, AppSearchableMultiSelectProps, AppSearchableMultiSelectOption() (+28 more)

### Community 5 - "login-form-panel.tsx"
Cohesion: 0.08
Nodes (25): PatientProfileHeader(), PatientProfileHeaderProps, SettingsAccountPanel(), SettingsAccountPanelProps, SettingsActionRow(), SettingsActionRowProps, SettingsManagementLink(), SettingsManagementLinkProps (+17 more)

### Community 7 - "patients-page-client.tsx"
Cohesion: 0.12
Nodes (19): AppointmentDetailPageClient(), AppointmentDetailPageClientProps, resolveTotalDurationMinutes(), AppointmentDetailCardProps, AppointmentDetailSidebar(), AppointmentDetailSidebarProps, reminderLabel(), AppointmentHeader() (+11 more)

### Community 8 - "employee-detail-page-client.tsx"
Cohesion: 0.20
Nodes (7): AppointmentsPageClient(), PageHeader(), SkeletonListItem(), SkeletonList(), useAppointmentsPage(), TopbarSearchState, useTopbarSearchStore

### Community 9 - "employee-edit-dialog.tsx"
Cohesion: 0.11
Nodes (12): CategoryBreakdownItem, FinancesCategoryBreakdownProps, FinancesCategoryRow(), FinancesCategoryRowProps, FinancesMetricItem(), FinancesMetricItemProps, FinancesMovementsSectionProps, FinancesSummaryMetrics() (+4 more)

### Community 10 - "appointments-page-client.tsx"
Cohesion: 0.13
Nodes (13): employeeColors, employeeRoles, AppointmentTreatment, Clinic, ClinicMembership, ClinicMembershipStatus, Database, InventoryMovement (+5 more)

### Community 11 - "employees-page-client.tsx"
Cohesion: 0.07
Nodes (41): EmployeeInviteFormProps, roleOptions, EmployeeStatusConfirmDialog(), EmployeeStatusConfirmDialogProps, PatientsPageClient(), EMPLOYEE_INVITE_COPY, EMPLOYEE_STATUS_COPY, defaultValues (+33 more)

### Community 12 - "layout.tsx"
Cohesion: 0.10
Nodes (21): geistMono, geistSans, metadata, viewport, AuthProvider(), AuthProviderProps, getClientHydratedSnapshot(), getServerHydratedSnapshot() (+13 more)

### Community 13 - "action-button.tsx"
Cohesion: 0.16
Nodes (8): AppointmentCreateDialogProps, RegisterEmployeeFormCopy, RegisterEmployeeFormProps, DashboardPageClient(), formatTodayTitle(), ActionButton(), Notice(), NoticeProps

### Community 14 - "transactions-columns.tsx"
Cohesion: 0.21
Nodes (9): mapOperationalRoleToEmployeeRole(), OperationalRoleOption, operationalRoleOptions, buildCreateClinicPayload(), buildCreateClinicPayloadFromProfile(), CreateClinicPayload, OwnerClinicFormValues, OwnerClinicOnlyValues (+1 more)

### Community 15 - "owner-clinic-form.ts"
Cohesion: 0.29
Nodes (7): DataTableProps, Table(), TableBody(), TableCell(), TableHead(), TableHeader(), TableRow()

### Community 16 - "proxy.ts"
Cohesion: 0.21
Nodes (7): config, proxy(), publicRoutes, pwaRoutes, SessionUpdateResult, updateSession(), withSessionCookies()

### Community 28 - "appointment-create-dialog.tsx"
Cohesion: 0.07
Nodes (36): TransactionCreateFormProps, TRANSACTION_CREATE_COPY, useCreateTransaction(), createDefaultValues(), transactionFormSchema, TransactionFormValues, useTransactionCreateDialog(), appointmentFieldsSchema (+28 more)

### Community 36 - "patients-page-client.tsx"
Cohesion: 0.15
Nodes (10): LoginAuthTabs(), LoginAuthTabsProps, LoginFormFieldsProps, LoginFormPanel(), LoginFormPanelProps, LoginHeroIllustration(), loginIllustrationSvg, HERO_INDICATORS (+2 more)

### Community 37 - "action-button.tsx"
Cohesion: 0.17
Nodes (10): appointmentsColumns, AppointmentsTable(), AppointmentsTableProps, employeesColumns, EmployeesTable(), EmployeesTableProps, DataTable(), SortableTableHead() (+2 more)

### Community 38 - "inventory-page-client.tsx"
Cohesion: 0.25
Nodes (9): EmployeeEditDialog(), EmployeeEditDialogProps, EmployeeEditFormProps, roleOptions, EMPLOYEE_EDIT_COPY, employeeEditFormSchema, EmployeeEditFormValues, toFormValues() (+1 more)

### Community 39 - "notice.tsx"
Cohesion: 0.07
Nodes (47): useLogin(), RegisterEmployeeSidebar(), RegisterEmployeeSidebarProps, useRegisterEmployee(), RegisterEmployeePageClient(), CreateClinicPageClient(), InviteTeamPageClient(), getRegisterCopy() (+39 more)

### Community 40 - "transactions-columns.tsx"
Cohesion: 0.38
Nodes (4): transactionsColumns, TransactionsTableProps, transactionTypeLabel(), Transaction

### Community 41 - "use-inventory-item-create-dialog.ts"
Cohesion: 0.25
Nodes (8): InventoryItemCreateForm(), InventoryItemCreateFormProps, InventoryPageClient(), INVENTORY_ITEM_CREATE_COPY, defaultValues, inventoryFormSchema, InventoryFormValues, useInventoryItemCreateDialog()

### Community 42 - "patient-edit-dialog.tsx"
Cohesion: 0.12
Nodes (17): EmployeesPageClient(), roles, AppConfirmDialogProps, AppDialog(), AppDialogProps, AppDialogDescription(), AppDialogDescriptionProps, AppDialogFooter() (+9 more)

### Community 43 - "patient-detail-page-client.tsx"
Cohesion: 0.16
Nodes (9): PatientInfoSectionProps, PatientProfileSidebar(), PatientProfileSidebarProps, PatientQuickActionsProps, PatientDetailPageClient(), PatientDetailPageClientProps, ProfileInfoRow(), ProfileInfoRowProps (+1 more)

### Community 44 - "inventory-columns.tsx"
Cohesion: 0.29
Nodes (7): inventoryColumns, InventoryTable(), InventoryTableProps, getInventoryStockLevel(), InventoryStockLevel, inventoryStockLevelLabel(), InventoryItem

### Community 45 - "use-inventory.ts"
Cohesion: 0.24
Nodes (6): AppDialogClose(), AppDialogCloseProps, AppDialogContentProps, AppSheetContent(), AppSheetContentProps, APP_DIALOG_COPY

### Community 46 - "Patient"
Cohesion: 0.47
Nodes (4): patientsColumns, PatientsTable(), PatientsTableProps, Patient

### Community 49 - "app-dialog-header.tsx"
Cohesion: 0.22
Nodes (9): PatientCreateFormProps, PATIENT_CREATE_COPY, useActiveClinic(), useClinicId(), defaultValues, patientFormSchema, PatientFormValues, usePatientCreateDialog() (+1 more)

### Community 50 - "patient-timeline.tsx"
Cohesion: 0.17
Nodes (20): AppointmentStatusBadge(), AppointmentStatusBadgeProps, statusStyles, EmployeeAppointmentRow(), EmployeeAppointmentRowProps, EmployeeTimeline(), EmployeeTimelineProps, mapAppointmentsToTimelineItems() (+12 more)

### Community 51 - "format.ts"
Cohesion: 0.16
Nodes (14): DashboardAppointmentRow(), DashboardAppointmentRowProps, PatientInfoSection(), formatAppointmentDay(), formatAppointmentDuration(), formatAppointmentMonth(), formatBirthDateWithAge(), formatInputDate() (+6 more)

### Community 52 - "employee-profile-header.tsx"
Cohesion: 0.16
Nodes (10): EmployeeProfileHeader(), EmployeeProfileHeaderProps, getAvatarStyle(), EmployeeProfileSidebarProps, EmployeeProfileSummary(), EmployeeProfileSummaryProps, EmployeeQuickActionsProps, EmployeeStatCard() (+2 more)

### Community 53 - "appointment-create-form.tsx"
Cohesion: 0.21
Nodes (9): AppointmentCreateDialog(), AppointmentCreateFormProps, APPOINTMENT_CREATE_COPY, appointmentFormSchema, AppointmentFormValues, createDefaultStartsAt(), createDefaultValues(), useAppointmentCreateDialog() (+1 more)

### Community 54 - "appointment-treatments-section.tsx"
Cohesion: 0.31
Nodes (7): AppointmentDetailTreatmentItem(), AppointmentDetailTreatmentItemProps, AppointmentTreatmentsSection(), AppointmentTreatmentsSectionProps, FinancesWeeklyRow(), FinancesWeeklyRowProps, formatCurrency()

### Community 55 - "use-patient-edit-dialog.ts"
Cohesion: 0.39
Nodes (6): PatientEditDialog(), PatientEditDialogProps, PATIENT_EDIT_COPY, patientFormSchema, toFormValues(), usePatientEditDialog()

### Community 56 - "profile-timeline.tsx"
Cohesion: 0.31
Nodes (7): groupItemsByMonth(), dotClassNames, ProfileTimelineItem, ProfileTimelineItemRow(), ProfileTimelineItemRowProps, ProfileTimeline(), ProfileTimelineProps

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
Cohesion: 0.20
Nodes (13): NewAppointmentDatetimeField(), NewAppointmentDatetimeFieldProps, NewPatientDateField(), NewPatientDateFieldProps, AppDateField(), AppDateFieldProps, AppDatePopoverField(), AppDatePopoverFieldProps (+5 more)

### Community 130 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, husky, lint-staged, prettier, tailwindcss, @tailwindcss/postcss (+4 more)

### Community 186 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, dev:https, lint, lint:staged, prepare, start (+1 more)

### Community 221 - "package.json"
Cohesion: 0.33
Nodes (5): lint-staged, *.{ts,tsx}, name, private, version

## Knowledge Gaps
- **303 isolated node(s):** `EmployeeDetailPageClientProps`, `AppointmentDetailPageClientProps`, `AppointmentCreateDialogProps`, `AppointmentDetailCardProps`, `AppointmentDetailSidebarProps` (+298 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `use-schedule-x-calendar.ts`, `package.json`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Why does `@schedule-x/calendar` connect `use-schedule-x-calendar.ts` to `dependencies`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Why does `ActionButton()` connect `action-button.tsx` to `useAuth`, `use-schedule-x-calendar.ts`, `patients-page-client.tsx`, `login-form-panel.tsx`, `inventory-page-client.tsx`, `patients-page-client.tsx`, `employee-detail-page-client.tsx`, `employee-edit-dialog.tsx`, `patient-edit-dialog.tsx`, `use-inventory-item-create-dialog.ts`, `notice.tsx`, `patient-detail-page-client.tsx`, `employee-profile-header.tsx`, `use-patient-edit-dialog.ts`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **What connects `EmployeeDetailPageClientProps`, `AppointmentDetailPageClientProps`, `AppointmentCreateDialogProps` to the rest of the system?**
  _303 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.11612903225806452 - nodes in this community are weakly interconnected._
- **Should `appointments-store.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06841046277665996 - nodes in this community are weakly interconnected._
- **Should `use-schedule-x-calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05115089514066496 - nodes in this community are weakly interconnected._