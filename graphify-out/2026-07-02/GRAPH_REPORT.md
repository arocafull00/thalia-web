# Graph Report - .  (2026-07-02)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 918 nodes · 2175 edges · 44 communities (37 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f7b50974`
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
- [[_COMMUNITY_owner-clinic-form.ts|owner-clinic-form.ts]]
- [[_COMMUNITY_proxy.ts|proxy.ts]]
- [[_COMMUNITY_app-date-picker-popover.tsx|app-date-picker-popover.tsx]]
- [[_COMMUNITY_app-dialog-trigger.tsx|app-dialog-trigger.tsx]]
- [[_COMMUNITY_migration-map.ts|migration-map.ts]]
- [[_COMMUNITY_appointment-create-dialog.tsx|appointment-create-dialog.tsx]]
- [[_COMMUNITY_inventory-page-client.tsx|inventory-page-client.tsx]]
- [[_COMMUNITY_dependencies|dependencies]]
- [[_COMMUNITY_use-appointment-create-dialog.ts|use-appointment-create-dialog.ts]]
- [[_COMMUNITY_finances-page-client.tsx|finances-page-client.tsx]]
- [[_COMMUNITY_components.json|components.json]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_app-date-field.tsx|app-date-field.tsx]]
- [[_COMMUNITY_settings-stat-item.tsx|settings-stat-item.tsx]]
- [[_COMMUNITY_devDependencies|devDependencies]]
- [[_COMMUNITY_use-settings-page.ts|use-settings-page.ts]]
- [[_COMMUNITY_scripts|scripts]]
- [[_COMMUNITY_app-dialog-close.tsx|app-dialog-close.tsx]]
- [[_COMMUNITY_database.types.ts|database.types.ts]]
- [[_COMMUNITY_package.json|package.json]]
- [[_COMMUNITY_eslint.config.mjs|eslint.config.mjs]]
- [[_COMMUNITY_next.config.ts|next.config.ts]]
- [[_COMMUNITY_postcss.config.mjs|postcss.config.mjs]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 41 edges
2. `useAuth()` - 34 edges
3. `isInitialLoading()` - 26 edges
4. `supabase` - 21 edges
5. `ActionButton()` - 20 edges
6. `Notice()` - 18 edges
7. `compilerOptions` - 16 edges
8. `useActiveClinic()` - 14 edges
9. `usePostAuthRedirect()` - 14 edges
10. `useAuthStore` - 13 edges

## Surprising Connections (you probably didn't know these)
- `proxy()` --calls--> `updateSession()`  [EXTRACTED]
  proxy.ts → src/lib/supabase/proxy.ts
- `proxy()` --calls--> `withSessionCookies()`  [EXTRACTED]
  proxy.ts → src/lib/supabase/proxy.ts
- `AppointmentCreateDialog()` --calls--> `useAppointmentCreateDialog()`  [EXTRACTED]
  src/components/appointments/components/appointment-create-dialog.tsx → src/lib/hooks/use-appointment-create-dialog.ts
- `AppointmentDetailPageClient()` --calls--> `useAppointmentDetail()`  [EXTRACTED]
  src/components/appointments/appointment-detail-page-client.tsx → src/lib/hooks/use-appointment-detail.ts
- `AppointmentsPageClient()` --calls--> `useAppointmentsPage()`  [EXTRACTED]
  src/components/appointments/appointments-page-client.tsx → src/lib/hooks/use-appointments-page.ts

## Import Cycles
- 3-file cycle: `src/lib/active-clinic-id.ts -> src/stores/auth-store.ts -> src/stores/employees-store.ts -> src/lib/active-clinic-id.ts`

## Communities (44 total, 7 thin omitted)

### Community 0 - "useAuth"
Cohesion: 0.06
Nodes (58): useLogin(), RegisterEmployeeFormCopy, RegisterEmployeeFormProps, RegisterEmployeeSidebar(), RegisterEmployeeSidebarProps, useRegisterEmployee(), RegisterEmployeePageClient(), CreateClinicPageClient() (+50 more)

### Community 1 - "appointments-store.ts"
Cohesion: 0.07
Nodes (49): getActiveClinicId(), appointmentFieldsSchema, appointmentSchema, AppointmentSchemaInput, appointmentUpdateSchema, AppointmentUpdateSchemaInput, employeeFieldsSchema, employeeRoleSchema (+41 more)

### Community 2 - "use-schedule-x-calendar.ts"
Cohesion: 0.08
Nodes (27): @schedule-x/calendar, CalendarEmployeeFilter(), CalendarPageClient(), CalendarEmptyHeader(), CalendarToolbar(), useCalendarPage(), buildScheduleEvents(), getInitialCalendarConfig() (+19 more)

### Community 3 - "format.ts"
Cohesion: 0.08
Nodes (33): AppointmentDetailPageClient(), AppointmentDetailPageClientProps, AppointmentDetailTreatmentItem(), AppointmentDetailTreatmentItemProps, DashboardAppointmentRow(), DashboardAppointmentRowProps, DashboardPageClient(), formatTodayTitle() (+25 more)

### Community 4 - "cn"
Cohesion: 0.07
Nodes (45): AppSearchableCombobox(), AppSearchableComboboxOption, AppSearchableComboboxProps, AppSearchableComboboxItem(), AppSearchableComboboxItemProps, AppSearchableMultiSelectOption, AppSearchableMultiSelectProps, AppSearchableMultiSelectOption() (+37 more)

### Community 5 - "login-form-panel.tsx"
Cohesion: 0.15
Nodes (10): LoginAuthTabs(), LoginAuthTabsProps, LoginFormFieldsProps, LoginFormPanel(), LoginFormPanelProps, LoginHeroIllustration(), loginIllustrationSvg, HERO_INDICATORS (+2 more)

### Community 6 - "app-layout-client.tsx"
Cohesion: 0.18
Nodes (10): AppLayoutClient(), AppLayoutClientProps, AppShell(), AppShellProps, AppSidebar(), NavItem, SidebarItem(), SidebarItemProps (+2 more)

### Community 7 - "patients-page-client.tsx"
Cohesion: 0.21
Nodes (9): PatientCreateFormProps, PatientsTable(), PatientsPageClient(), PATIENT_CREATE_COPY, defaultValues, patientFormSchema, PatientFormValues, usePatientCreateDialog() (+1 more)

### Community 8 - "employee-detail-page-client.tsx"
Cohesion: 0.16
Nodes (16): EmployeeStatCard(), EmployeeStatCardProps, EmployeeStatusConfirmDialog(), EmployeeStatusConfirmDialogProps, EmployeeDetailPageClient(), EmployeeDetailPageClientProps, EMPLOYEE_DETAIL_COPY, EMPLOYEE_STATUS_COPY (+8 more)

### Community 9 - "employee-edit-dialog.tsx"
Cohesion: 0.24
Nodes (10): EmployeeEditDialog(), EmployeeEditDialogProps, EmployeeEditFormProps, roleOptions, EMPLOYEE_EDIT_COPY, employeeEditFormSchema, EmployeeEditFormValues, toFormValues() (+2 more)

### Community 10 - "appointments-page-client.tsx"
Cohesion: 0.22
Nodes (6): AppointmentsPageClient(), PageHeader(), SkeletonListItem(), SkeletonList(), TopbarSearchState, useTopbarSearchStore

### Community 11 - "employees-page-client.tsx"
Cohesion: 0.15
Nodes (14): EmployeeInviteFormProps, roleOptions, EmployeesPageClient(), roles, EMPLOYEE_INVITE_COPY, useActiveClinic(), useClinicId(), useDebouncedValue() (+6 more)

### Community 12 - "layout.tsx"
Cohesion: 0.11
Nodes (18): geistMono, geistSans, metadata, viewport, AuthProvider(), PwaInstallProvider(), PwaInstallProviderProps, ServiceWorkerProvider() (+10 more)

### Community 13 - "action-button.tsx"
Cohesion: 0.47
Nodes (3): CalendarToolbarProps, ActionButton(), CALENDAR_COPY

### Community 15 - "owner-clinic-form.ts"
Cohesion: 0.21
Nodes (9): mapOperationalRoleToEmployeeRole(), OperationalRoleOption, operationalRoleOptions, buildCreateClinicPayload(), buildCreateClinicPayloadFromProfile(), CreateClinicPayload, OwnerClinicFormValues, OwnerClinicOnlyValues (+1 more)

### Community 16 - "proxy.ts"
Cohesion: 0.27
Nodes (7): config, proxy(), publicRoutes, pwaRoutes, SessionUpdateResult, updateSession(), withSessionCookies()

### Community 28 - "appointment-create-dialog.tsx"
Cohesion: 0.14
Nodes (15): AppointmentCreateDialog(), AppointmentCreateDialogProps, AppConfirmDialogProps, AppDialog(), AppDialogProps, AppDialogDescription(), AppDialogDescriptionProps, AppDialogFooter() (+7 more)

### Community 47 - "inventory-page-client.tsx"
Cohesion: 0.25
Nodes (8): InventoryItemCreateForm(), InventoryItemCreateFormProps, InventoryPageClient(), INVENTORY_ITEM_CREATE_COPY, defaultValues, inventoryFormSchema, InventoryFormValues, useInventoryItemCreateDialog()

### Community 57 - "dependencies"
Cohesion: 0.06
Nodes (32): dependencies, @base-ui/react, class-variance-authority, clsx, date-fns, @hookform/resolvers, lucide-react, match-sorter (+24 more)

### Community 60 - "use-appointment-create-dialog.ts"
Cohesion: 0.07
Nodes (41): AppointmentCreateFormProps, NewAppointmentDatetimeField(), NewAppointmentDatetimeFieldProps, PatientDetailPageClient(), PatientDetailPageClientProps, APPOINTMENT_CREATE_COPY, PATIENT_DETAIL_COPY, appointmentFormSchema (+33 more)

### Community 78 - "finances-page-client.tsx"
Cohesion: 0.11
Nodes (28): TransactionCreateFormProps, FinancesMonthSelector(), FinancesPageClient(), FinancesTabBar(), FinancesTabBarProps, FinancesTabValue, TRANSACTION_CREATE_COPY, transactionTypeForTab() (+20 more)

### Community 82 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 89 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 102 - "app-date-field.tsx"
Cohesion: 0.26
Nodes (11): NewPatientDateField(), NewPatientDateFieldProps, AppDateField(), AppDateFieldProps, AppDatePopoverField(), AppDatePopoverFieldProps, formatLocalDateInputValue(), formatLocalDatetimeInputValue() (+3 more)

### Community 130 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, husky, lint-staged, prettier, tailwindcss, @tailwindcss/postcss (+4 more)

### Community 183 - "use-settings-page.ts"
Cohesion: 0.06
Nodes (37): SettingsAccountPanelProps, SettingsActionRow(), SettingsActionRowProps, MANAGEMENT_LINKS, SettingsManagementTile(), SettingsManagementTileProps, SettingsProfileCard(), SettingsProfileCardProps (+29 more)

### Community 186 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, dev:https, lint, lint:staged, prepare, start (+1 more)

### Community 187 - "app-dialog-close.tsx"
Cohesion: 0.32
Nodes (4): AppDialogClose(), AppDialogCloseProps, AppDialogContentProps, APP_DIALOG_COPY

### Community 208 - "database.types.ts"
Cohesion: 0.05
Nodes (48): appointmentsColumns, AppointmentsTable(), AppointmentsTableProps, employeesColumns, EmployeesTable(), EmployeesTableProps, transactionsColumns, TransactionsTable() (+40 more)

### Community 221 - "package.json"
Cohesion: 0.33
Nodes (5): lint-staged, *.{ts,tsx}, name, private, version

## Knowledge Gaps
- **249 isolated node(s):** `geistSans`, `geistMono`, `metadata`, `viewport`, `$schema` (+244 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `use-schedule-x-calendar.ts`, `package.json`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Why does `@schedule-x/calendar` connect `use-schedule-x-calendar.ts` to `dependencies`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `useAuth` to `format.ts`, `app-layout-client.tsx`, `employee-detail-page-client.tsx`, `employees-page-client.tsx`, `finances-page-client.tsx`, `use-settings-page.ts`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `geistSans`, `geistMono`, `metadata` to the rest of the system?**
  _249 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.05733482642777156 - nodes in this community are weakly interconnected._
- **Should `appointments-store.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06947996589940324 - nodes in this community are weakly interconnected._
- **Should `use-schedule-x-calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08478513356562137 - nodes in this community are weakly interconnected._