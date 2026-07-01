# Graph Report - .  (2026-07-01)

## Corpus Check
- 199 files · ~34,073 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 719 nodes · 1827 edges · 25 communities (21 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Auth & Onboarding|Auth & Onboarding]]
- [[_COMMUNITY_Schemas & Validation|Schemas & Validation]]
- [[_COMMUNITY_Entity List Pages|Entity List Pages]]
- [[_COMMUNITY_Appointments & Dashboard|Appointments & Dashboard]]
- [[_COMMUNITY_Searchable Combobox UI|Searchable Combobox UI]]
- [[_COMMUNITY_Login & Settings Auth|Login & Settings Auth]]
- [[_COMMUNITY_Calendar & Scheduling|Calendar & Scheduling]]
- [[_COMMUNITY_Appointment Hooks|Appointment Hooks]]
- [[_COMMUNITY_Employee Detail & Edit|Employee Detail & Edit]]
- [[_COMMUNITY_Inventory Module|Inventory Module]]
- [[_COMMUNITY_Finances Module|Finances Module]]
- [[_COMMUNITY_Settings & Clinic Requests|Settings & Clinic Requests]]
- [[_COMMUNITY_Root Layout & PWA|Root Layout & PWA]]
- [[_COMMUNITY_Appointment & Date Forms|Appointment & Date Forms]]
- [[_COMMUNITY_App Shell & Sidebar|App Shell & Sidebar]]
- [[_COMMUNITY_Clinic Onboarding Forms|Clinic Onboarding Forms]]
- [[_COMMUNITY_Supabase Session|Supabase Session]]
- [[_COMMUNITY_Date Picker Popover|Date Picker Popover]]
- [[_COMMUNITY_Dialog Trigger|Dialog Trigger]]
- [[_COMMUNITY_Migration Map|Migration Map]]

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 32 edges
2. `cn()` - 32 edges
3. `isInitialLoading()` - 26 edges
4. `supabase` - 21 edges
5. `ActionButton()` - 20 edges
6. `Notice()` - 16 edges
7. `useActiveClinic()` - 14 edges
8. `usePostAuthRedirect()` - 14 edges
9. `useAuthStore` - 13 edges
10. `useOnboardingIntentStore` - 12 edges

## Surprising Connections (you probably didn't know these)
- `AppointmentCreateDialog()` --calls--> `useAppointmentCreateDialog()`  [EXTRACTED]
  src/components/appointments/components/appointment-create-dialog.tsx → src/lib/hooks/use-appointment-create-dialog.ts
- `AppointmentDetailPageClient()` --calls--> `useAppointmentDetail()`  [EXTRACTED]
  src/components/appointments/appointment-detail-page-client.tsx → src/lib/hooks/use-appointment-detail.ts
- `AppointmentsPageClient()` --calls--> `useTopbarSearchStore`  [EXTRACTED]
  src/components/appointments/appointments-page-client.tsx → src/stores/topbar-search-store.ts
- `LoginPageClient()` --calls--> `useLogin()`  [EXTRACTED]
  src/components/auth/login/page.client.tsx → src/components/auth/login/hooks/use-login.ts
- `CalendarPageClient()` --calls--> `useCalendarPage()`  [EXTRACTED]
  src/components/calendar/calendar-page-client.tsx → src/components/calendar/hooks/use-calendar-page.ts

## Import Cycles
- 3-file cycle: `src/lib/active-clinic-id.ts -> src/stores/auth-store.ts -> src/stores/employees-store.ts -> src/lib/active-clinic-id.ts`

## Communities (25 total, 4 thin omitted)

### Community 0 - "Auth & Onboarding"
Cohesion: 0.05
Nodes (61): useLogin(), RegisterEmployeeSidebar(), RegisterEmployeeSidebarProps, useRegisterEmployee(), RegisterEmployeePageClient(), CreateClinicPageClient(), InviteTeamPageClient(), AuthProviderProps (+53 more)

### Community 1 - "Schemas & Validation"
Cohesion: 0.06
Nodes (62): getActiveClinicId(), appointmentFieldsSchema, appointmentSchema, AppointmentSchemaInput, appointmentUpdateSchema, AppointmentUpdateSchemaInput, employeeFieldsSchema, employeeRoleSchema (+54 more)

### Community 2 - "Entity List Pages"
Cohesion: 0.05
Nodes (47): AppointmentCreateDialog(), AppointmentCreateDialogProps, EmployeeEditDialogProps, EmployeeInviteFormProps, roleOptions, EmployeesPageClient(), roles, PatientCreateFormProps (+39 more)

### Community 3 - "Appointments & Dashboard"
Cohesion: 0.06
Nodes (36): AppointmentDetailPageClient(), AppointmentDetailPageClientProps, AppointmentsPageClient(), AppointmentDetailTreatmentItem(), AppointmentDetailTreatmentItemProps, DashboardAppointmentRow(), DashboardAppointmentRowProps, DashboardPageClient() (+28 more)

### Community 4 - "Searchable Combobox UI"
Cohesion: 0.09
Nodes (36): AppSearchableCombobox(), AppSearchableComboboxOption, AppSearchableComboboxProps, AppSearchableComboboxItem(), AppSearchableComboboxItemProps, AppSearchableMultiSelectOption, AppSearchableMultiSelectProps, AppSearchableMultiSelectOption() (+28 more)

### Community 5 - "Login & Settings Auth"
Cohesion: 0.08
Nodes (20): LoginAuthTabs(), LoginAuthTabsProps, LoginFormFieldsProps, LoginFormPanel(), LoginFormPanelProps, LoginHeroIllustration(), loginIllustrationSvg, HERO_INDICATORS (+12 more)

### Community 6 - "Calendar & Scheduling"
Cohesion: 0.09
Nodes (26): CalendarEmployeeFilter(), CalendarPageClient(), CalendarEmptyHeader(), CalendarToolbar(), useCalendarPage(), buildScheduleEvents(), getInitialCalendarConfig(), toPlainDate() (+18 more)

### Community 7 - "Appointment Hooks"
Cohesion: 0.11
Nodes (33): useClinicId(), appointmentFormSchema, createDefaultStartsAt(), createDefaultValues(), useAppointmentCreateDialog(), useAppointmentDetail(), useAppointment(), useCreateAppointment() (+25 more)

### Community 8 - "Employee Detail & Edit"
Cohesion: 0.10
Nodes (24): EmployeeEditDialog(), EmployeeEditFormProps, roleOptions, EmployeeStatCard(), EmployeeStatCardProps, EmployeeStatusConfirmDialog(), EmployeeStatusConfirmDialogProps, EmployeeDetailPageClient() (+16 more)

### Community 9 - "Inventory Module"
Cohesion: 0.13
Nodes (21): InventoryItemCreateForm(), InventoryItemCreateFormProps, InventoryPageClient(), INVENTORY_ITEM_CREATE_COPY, defaultValues, inventoryFormSchema, InventoryFormValues, useInventoryItemCreateDialog() (+13 more)

### Community 10 - "Finances Module"
Cohesion: 0.14
Nodes (20): FinancesMonthSelector(), FinancesPageClient(), FinancesTabBar(), FinancesTabBarProps, FinancesTabValue, SkeletonBlock(), transactionTypeForTab(), useFinancesPage() (+12 more)

### Community 11 - "Settings & Clinic Requests"
Cohesion: 0.13
Nodes (21): SettingsProfilePanel(), SettingsProfilePanelProps, normalizeEmail(), PendingClinicRequest, employeeRoleLabel(), useUploadProfileAvatar(), AsyncFileUrl, useFileUrl() (+13 more)

### Community 12 - "Root Layout & PWA"
Cohesion: 0.12
Nodes (17): geistMono, geistSans, metadata, viewport, AuthProvider(), PwaInstallProvider(), PwaInstallProviderProps, ServiceWorkerProvider() (+9 more)

### Community 13 - "Appointment & Date Forms"
Cohesion: 0.14
Nodes (16): AppointmentCreateFormProps, NewAppointmentDatetimeField(), NewAppointmentDatetimeFieldProps, NewPatientDateField(), NewPatientDateFieldProps, AppDateField(), AppDateFieldProps, AppDatePopoverField() (+8 more)

### Community 14 - "App Shell & Sidebar"
Cohesion: 0.18
Nodes (10): AppLayoutClient(), AppLayoutClientProps, AppShell(), AppShellProps, AppSidebar(), NavItem, SidebarItem(), SidebarItemProps (+2 more)

### Community 15 - "Clinic Onboarding Forms"
Cohesion: 0.21
Nodes (9): mapOperationalRoleToEmployeeRole(), OperationalRoleOption, operationalRoleOptions, buildCreateClinicPayload(), buildCreateClinicPayloadFromProfile(), CreateClinicPayload, OwnerClinicFormValues, OwnerClinicOnlyValues (+1 more)

## Knowledge Gaps
- **134 isolated node(s):** `AppointmentDetailPageClientProps`, `AppointmentCreateDialogProps`, `AppointmentCreateFormProps`, `AppointmentDetailTreatmentItemProps`, `NewAppointmentDatetimeFieldProps` (+129 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ActionButton()` connect `Login & Settings Auth` to `Auth & Onboarding`, `Entity List Pages`, `Appointments & Dashboard`, `Employee Detail & Edit`, `Inventory Module`, `Finances Module`, `Settings & Clinic Requests`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `Auth & Onboarding` to `Entity List Pages`, `Appointments & Dashboard`, `Login & Settings Auth`, `Employee Detail & Edit`, `Finances Module`, `Settings & Clinic Requests`, `App Shell & Sidebar`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `supabase` connect `Auth & Onboarding` to `Schemas & Validation`, `Settings & Clinic Requests`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `AppointmentDetailPageClientProps`, `AppointmentCreateDialogProps`, `AppointmentCreateFormProps` to the rest of the system?**
  _134 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Auth & Onboarding` be split into smaller, more focused modules?**
  _Cohesion score 0.05465346534653465 - nodes in this community are weakly interconnected._
- **Should `Schemas & Validation` be split into smaller, more focused modules?**
  _Cohesion score 0.05730238025271819 - nodes in this community are weakly interconnected._
- **Should `Entity List Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.05185185185185185 - nodes in this community are weakly interconnected._