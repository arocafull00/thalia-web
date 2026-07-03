# Graph Report - thalia-web  (2026-07-03)

## Corpus Check
- 314 files · ~74,672 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1154 nodes · 2835 edges · 73 communities (58 shown, 15 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ddb2df5d`
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
- [[_COMMUNITY_calendar-empty-header.tsx|calendar-empty-header.tsx]]
- [[_COMMUNITY_dashboard-appointment-row.tsx|dashboard-appointment-row.tsx]]
- [[_COMMUNITY_app-dialog-header.tsx|app-dialog-header.tsx]]
- [[_COMMUNITY_patient-timeline.tsx|patient-timeline.tsx]]
- [[_COMMUNITY_format.ts|format.ts]]
- [[_COMMUNITY_format.ts|format.ts]]
- [[_COMMUNITY_appointment-create-form.tsx|appointment-create-form.tsx]]
- [[_COMMUNITY_appointment-header.tsx|appointment-header.tsx]]
- [[_COMMUNITY_use-patient-edit-dialog.ts|use-patient-edit-dialog.ts]]
- [[_COMMUNITY_profile-timeline.tsx|profile-timeline.tsx]]
- [[_COMMUNITY_dependencies|dependencies]]
- [[_COMMUNITY_use-active-clinic.ts|use-active-clinic.ts]]
- [[_COMMUNITY_use-settings-page.ts|use-settings-page.ts]]
- [[_COMMUNITY_employee-schema.ts|employee-schema.ts]]
- [[_COMMUNITY_profile-timeline.tsx|profile-timeline.tsx]]
- [[_COMMUNITY_auth-provider.tsx|auth-provider.tsx]]
- [[_COMMUNITY_use-dashboard.ts|use-dashboard.ts]]
- [[_COMMUNITY_components.json|components.json]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_app-date-field.tsx|app-date-field.tsx]]
- [[_COMMUNITY_devDependencies|devDependencies]]
- [[_COMMUNITY_eslint.config.mjs|eslint.config.mjs]]
- [[_COMMUNITY_next.config.ts|next.config.ts]]
- [[_COMMUNITY_postcss.config.mjs|postcss.config.mjs]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 42 edges
2. `useAuth()` - 34 edges
3. `isInitialLoading()` - 29 edges
4. `ActionButton()` - 25 edges
5. `Notice()` - 24 edges
6. `supabase` - 22 edges
7. `AppointmentWithRelations` - 20 edges
8. `useFileUrl()` - 16 edges
9. `Employee` - 16 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `proxy()` --calls--> `updateSession()`  [EXTRACTED]
  proxy.ts → src/lib/supabase/proxy.ts
- `proxy()` --calls--> `withSessionCookies()`  [EXTRACTED]
  proxy.ts → src/lib/supabase/proxy.ts
- `AppointmentDetailPageClient()` --calls--> `useAppointmentDetail()`  [EXTRACTED]
  src/components/appointments/appointment-detail-page-client.tsx → src/lib/hooks/use-appointment-detail.ts
- `AppointmentCreateDialog()` --calls--> `useAppointmentCreateDialog()`  [EXTRACTED]
  src/components/appointments/components/appointment-create-dialog.tsx → src/lib/hooks/use-appointment-create-dialog.ts
- `AppointmentDetailSidebar()` --calls--> `formatAppointmentTimeRange()`  [EXTRACTED]
  src/components/appointments/components/appointment-detail-sidebar.tsx → src/lib/format.ts

## Import Cycles
- 3-file cycle: `src/lib/active-clinic-id.ts -> src/stores/auth-store.ts -> src/stores/employees-store.ts -> src/lib/active-clinic-id.ts`

## Communities (73 total, 15 thin omitted)

### Community 0 - "useAuth"
Cohesion: 0.20
Nodes (10): InventoryItemCreateForm(), InventoryItemCreateFormProps, INVENTORY_ITEM_CREATE_COPY, defaultValues, inventoryFormSchema, InventoryFormValues, inventoryFieldsSchema, inventorySchema (+2 more)

### Community 1 - "appointments-store.ts"
Cohesion: 0.21
Nodes (8): EmployeesPageClient(), roles, employeeColors, employeeRoles, useEmployeeInviteDialog(), EmployeesUiStore, useEmployeesUiStore, EmployeeRole

### Community 2 - "use-schedule-x-calendar.ts"
Cohesion: 0.08
Nodes (32): @schedule-x/calendar, CalendarEmployeeFilter(), CalendarPageClient(), CalendarEmptyHeader(), CalendarToolbar(), CalendarToolbarProps, useCalendarPage(), buildScheduleEvents() (+24 more)

### Community 3 - "format.ts"
Cohesion: 0.09
Nodes (27): EmployeeInviteFormProps, roleOptions, EmployeeProfileSidebar(), EmployeeProfileSidebarProps, EmployeeProfileSummary(), EmployeeProfileSummaryProps, EmployeeStatCard(), EmployeeStatCardProps (+19 more)

### Community 4 - "cn"
Cohesion: 0.06
Nodes (51): AppointmentMaterialsOverrideForm(), InventoryOption, TreatmentInventoryLinkRowProps, TreatmentInventoryLinksField(), TreatmentInventoryLinksFieldProps, AppSearchableCombobox(), AppSearchableComboboxOption, AppSearchableComboboxProps (+43 more)

### Community 5 - "login-form-panel.tsx"
Cohesion: 0.05
Nodes (51): EmployeeProfileHeader(), EmployeeProfileHeaderProps, getAvatarStyle(), PatientProfileHeader(), PatientProfileHeaderProps, SettingsAccountPanel(), SettingsAccountPanelProps, SettingsActionRow() (+43 more)

### Community 7 - "patients-page-client.tsx"
Cohesion: 0.13
Nodes (25): EmployeeAppointmentRow(), EmployeeAppointmentRowProps, EmployeeTimeline(), EmployeeTimelineProps, mapAppointmentsToTimelineItems(), PatientAppointmentRow(), PatientAppointmentRowProps, mapAppointmentsToTimelineItems() (+17 more)

### Community 8 - "employee-detail-page-client.tsx"
Cohesion: 0.16
Nodes (10): AppointmentsPageClient(), EmployeeQuickActionsProps, InventoryPageClient(), ActionButton(), PageHeader(), useAppointmentsPage(), useInventoryItemCreateDialog(), useInventoryPage() (+2 more)

### Community 9 - "employee-edit-dialog.tsx"
Cohesion: 0.07
Nodes (40): CategoryBreakdownItem, FinancesCategoryBreakdownProps, FinancesCategoryRow(), FinancesCategoryRowProps, FinancesMetricItem(), FinancesMetricItemProps, FinancesMovementsSectionProps, FinancesSummaryMetrics() (+32 more)

### Community 10 - "appointments-page-client.tsx"
Cohesion: 0.09
Nodes (26): employeesColumns, EmployeesTable(), EmployeesTableProps, transactionsColumns, TransactionsTableProps, patientsColumns, PatientsTable(), PatientsTableProps (+18 more)

### Community 11 - "employees-page-client.tsx"
Cohesion: 0.17
Nodes (10): CreateClinicPageClient(), captureEvent(), waitForAuthSessionReady(), normalizeInviteEmails(), validateInviteEmails(), navigateAfterAuth(), assertSupabaseConfigured(), supabase (+2 more)

### Community 12 - "layout.tsx"
Cohesion: 0.11
Nodes (18): geistMono, geistSans, metadata, viewport, AuthProvider(), PwaInstallProvider(), PwaInstallProviderProps, ServiceWorkerProvider() (+10 more)

### Community 13 - "action-button.tsx"
Cohesion: 0.21
Nodes (6): AppointmentDetailCardProps, AppointmentPatientCardProps, AppointmentPersonAvatar(), AppointmentPersonAvatarProps, getInitials(), AppointmentProfessionalCardProps

### Community 14 - "transactions-columns.tsx"
Cohesion: 0.21
Nodes (9): mapOperationalRoleToEmployeeRole(), OperationalRoleOption, operationalRoleOptions, buildCreateClinicPayload(), buildCreateClinicPayloadFromProfile(), CreateClinicPayload, OwnerClinicFormValues, OwnerClinicOnlyValues (+1 more)

### Community 15 - "owner-clinic-form.ts"
Cohesion: 0.16
Nodes (13): RegisterEmployeeFormCopy, RegisterEmployeeFormProps, RegisterEmployeeSidebar(), RegisterEmployeeSidebarProps, getSidebarCopy(), REGISTER_COPY, REGISTER_EMPLOYEE_FORM_COPY, REGISTER_EMPLOYEE_SIDEBAR_COPY (+5 more)

### Community 16 - "proxy.ts"
Cohesion: 0.27
Nodes (7): config, proxy(), publicRoutes, pwaRoutes, SessionUpdateResult, updateSession(), withSessionCookies()

### Community 28 - "appointment-create-dialog.tsx"
Cohesion: 0.26
Nodes (12): getActiveClinicId(), unwrapSupabase(), DashboardData, DashboardStore, EmployeesStore, PatientsStore, emptyQueryEntry(), errorQueryEntry() (+4 more)

### Community 36 - "patients-page-client.tsx"
Cohesion: 0.15
Nodes (10): LoginAuthTabs(), LoginAuthTabsProps, LoginFormFieldsProps, LoginFormPanel(), LoginFormPanelProps, LoginHeroIllustration(), loginIllustrationSvg, HERO_INDICATORS (+2 more)

### Community 37 - "action-button.tsx"
Cohesion: 0.24
Nodes (8): appointmentsColumns, AppointmentsTable(), AppointmentsTableProps, DashboardAppointmentRow(), DashboardAppointmentRowProps, formatAppointmentDuration(), formatTime(), AppointmentWithRelations

### Community 38 - "inventory-page-client.tsx"
Cohesion: 0.25
Nodes (9): EmployeeEditDialog(), EmployeeEditDialogProps, EmployeeEditFormProps, roleOptions, EMPLOYEE_EDIT_COPY, employeeEditFormSchema, EmployeeEditFormValues, toFormValues() (+1 more)

### Community 39 - "notice.tsx"
Cohesion: 0.29
Nodes (10): externalMemberships(), needsClinicSelector(), PostAuthRouteInput, PostAuthRouteResult, resolvePostAuthRoute(), resolveUnauthenticatedRoute(), buildOwnerProfileMetadata(), hasPendingTeamInvites() (+2 more)

### Community 40 - "transactions-columns.tsx"
Cohesion: 0.18
Nodes (10): AppLayoutClient(), AppLayoutClientProps, AppShell(), AppShellProps, AppSidebar(), NavItem, SidebarItem(), SidebarItemProps (+2 more)

### Community 41 - "use-inventory-item-create-dialog.ts"
Cohesion: 0.31
Nodes (7): AppointmentDetailTreatmentItem(), AppointmentDetailTreatmentItemProps, AppointmentTreatmentsSection(), AppointmentTreatmentsSectionProps, FinancesWeeklyRow(), FinancesWeeklyRowProps, formatCurrency()

### Community 42 - "patient-edit-dialog.tsx"
Cohesion: 0.18
Nodes (12): TreatmentDialog(), TreatmentDialogProps, AppConfirmDialogProps, AppDialog(), AppDialogProps, AppDialogDescription(), AppDialogDescriptionProps, AppDialogFooter() (+4 more)

### Community 43 - "patient-detail-page-client.tsx"
Cohesion: 0.24
Nodes (10): useLogin(), useRegisterEmployee(), RegisterEmployeePageClient(), InviteTeamPageClient(), getRegisterCopy(), signInWithGoogleFlow(), useAuth(), usePostAuthRedirect() (+2 more)

### Community 44 - "inventory-columns.tsx"
Cohesion: 0.24
Nodes (8): inventoryColumns, InventoryTable(), InventoryTableProps, getInventoryStockLevel(), InventoryStockLevel, inventoryStockLevelLabel(), inventoryStockSummaryCounts(), InventoryItem

### Community 45 - "use-inventory.ts"
Cohesion: 0.24
Nodes (6): AppDialogClose(), AppDialogCloseProps, AppDialogContentProps, AppSheetContent(), AppSheetContentProps, APP_DIALOG_COPY

### Community 46 - "Patient"
Cohesion: 0.31
Nodes (6): createWebPersistStorage(), webStorage, OnboardingStore, useOnboardingHydrated(), useOnboardingStore, PendingInviteStore

### Community 47 - "calendar-empty-header.tsx"
Cohesion: 0.22
Nodes (9): scripts, build, dev, dev:https, lint, lint:staged, prepare, start (+1 more)

### Community 48 - "dashboard-appointment-row.tsx"
Cohesion: 0.17
Nodes (8): EffectiveAppointmentMaterial, fetchDefaultMaterialsForTreatments(), unwrapSupabaseList(), AppointmentFormInput, AppointmentsStore, AppointmentUpdateInput, getTreatments(), Appointment

### Community 49 - "app-dialog-header.tsx"
Cohesion: 0.10
Nodes (26): appointmentFieldsSchema, appointmentSchema, AppointmentSchemaInput, appointmentUpdateSchema, AppointmentUpdateSchemaInput, clinicMembershipInvitationRoleSchema, employeeFieldsSchema, EmployeeInviteSchemaInput (+18 more)

### Community 50 - "patient-timeline.tsx"
Cohesion: 0.19
Nodes (13): AppointmentMaterialsOverrideDialog(), AppointmentMaterialsOverrideDialogProps, AppointmentMaterialsOverrideFormProps, AppointmentMaterialsSection(), AppointmentMaterialsSectionProps, toDialogInitialItems(), appointmentInventoryLinkSchema, appointmentMaterialsFormSchema (+5 more)

### Community 51 - "format.ts"
Cohesion: 0.33
Nodes (5): lint-staged, *.{ts,tsx}, name, private, version

### Community 52 - "format.ts"
Cohesion: 0.20
Nodes (10): PatientInfoSection(), formatAppointmentDay(), formatAppointmentMonth(), formatBirthDateWithAge(), formatInputDate(), formatInputDateTime(), formatPatientLastVisitLabel(), toLocalDate() (+2 more)

### Community 53 - "appointment-create-form.tsx"
Cohesion: 0.10
Nodes (34): AppointmentCreateDialog(), AppointmentCreateDialogProps, AppointmentCreateFormProps, defaultMaterialsKey(), useAppointmentMaterials(), PatientDetailPageClient(), PatientDetailPageClientProps, APPOINTMENT_CREATE_COPY (+26 more)

### Community 54 - "appointment-header.tsx"
Cohesion: 0.15
Nodes (14): AppointmentDetailPageClient(), AppointmentDetailPageClientProps, resolveTotalDurationMinutes(), AppointmentDetailSidebar(), AppointmentDetailSidebarProps, reminderLabel(), AppointmentHeader(), AppointmentHeaderProps (+6 more)

### Community 55 - "use-patient-edit-dialog.ts"
Cohesion: 0.15
Nodes (14): PatientCreateFormProps, PatientEditDialog(), PatientEditDialogProps, NewPatientDateField(), NewPatientDateFieldProps, PATIENT_CREATE_COPY, PATIENT_EDIT_COPY, defaultValues (+6 more)

### Community 56 - "profile-timeline.tsx"
Cohesion: 0.08
Nodes (34): TreatmentCategoryFilter(), TreatmentCategoryFilterProps, TreatmentColorFieldProps, TreatmentDeleteConfirmDialog(), TreatmentDeleteConfirmDialogProps, TreatmentForm(), TreatmentFormProps, TreatmentRowActions() (+26 more)

### Community 57 - "dependencies"
Cohesion: 0.06
Nodes (32): dependencies, @base-ui/react, class-variance-authority, clsx, date-fns, @hookform/resolvers, lucide-react, match-sorter (+24 more)

### Community 58 - "use-active-clinic.ts"
Cohesion: 0.21
Nodes (11): SidebarClinicSwitcherProps, SidebarProfileFooter(), SIDEBAR_COPY, clinicMembershipRoleLabel(), useActiveClinic(), useClinicId(), useUpdateProfile(), useAuthStore (+3 more)

### Community 59 - "use-settings-page.ts"
Cohesion: 0.21
Nodes (7): PatientInfoSectionProps, PatientProfileSidebar(), PatientProfileSidebarProps, PatientQuickActionsProps, ProfileInfoRow(), ProfileInfoRowProps, PATIENT_DETAIL_COPY

### Community 60 - "employee-schema.ts"
Cohesion: 0.29
Nodes (5): PatientsPageClient(), AppDialogTitle(), AppDialogTitleProps, useDebouncedValue(), usePatientCreateDialog()

### Community 61 - "profile-timeline.tsx"
Cohesion: 0.36
Nodes (8): useCreateInventoryItem(), useInventoryItem(), useInventoryMovements(), useRecordInventoryMovement(), InventoryItemInput, InventoryStore, useInventoryStore, InventoryMovementType

### Community 62 - "auth-provider.tsx"
Cohesion: 0.53
Nodes (5): AuthProviderProps, getClientHydratedSnapshot(), getServerHydratedSnapshot(), subscribeToClientHydration(), useAuthHydrated()

### Community 63 - "use-dashboard.ts"
Cohesion: 0.39
Nodes (4): DashboardPageClient(), formatTodayTitle(), useDashboard(), useDashboardStore

### Community 82 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 89 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 102 - "app-date-field.tsx"
Cohesion: 0.26
Nodes (11): NewAppointmentDatetimeField(), NewAppointmentDatetimeFieldProps, AppDateField(), AppDateFieldProps, AppDatePopoverField(), AppDatePopoverFieldProps, formatLocalDateInputValue(), formatLocalDatetimeInputValue() (+3 more)

### Community 130 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, husky, lint-staged, prettier, tailwindcss, @tailwindcss/postcss (+4 more)

## Knowledge Gaps
- **317 isolated node(s):** `geistSans`, `geistMono`, `metadata`, `viewport`, `$schema` (+312 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `use-schedule-x-calendar.ts`, `format.ts`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `@schedule-x/calendar` connect `use-schedule-x-calendar.ts` to `dependencies`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `profile-timeline.tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `geistSans`, `geistMono`, `metadata` to the rest of the system?**
  _317 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `use-schedule-x-calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07738095238095238 - nodes in this community are weakly interconnected._
- **Should `format.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08658536585365853 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.06277665995975855 - nodes in this community are weakly interconnected._