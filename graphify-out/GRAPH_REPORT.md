# Graph Report - thalia-web  (2026-07-04)

## Corpus Check
- 335 files · ~79,529 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1254 nodes · 3103 edges · 82 communities (66 shown, 16 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fea601da`
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
- [[_COMMUNITY_app-bottom-nav-more-sheet.tsx|app-bottom-nav-more-sheet.tsx]]
- [[_COMMUNITY_transactions-columns.tsx|transactions-columns.tsx]]
- [[_COMMUNITY_use-inventory-item-create-dialog.ts|use-inventory-item-create-dialog.ts]]
- [[_COMMUNITY_patient-edit-dialog.tsx|patient-edit-dialog.tsx]]
- [[_COMMUNITY_patient-detail-page-client.tsx|patient-detail-page-client.tsx]]
- [[_COMMUNITY_inventory-columns.tsx|inventory-columns.tsx]]
- [[_COMMUNITY_use-inventory.ts|use-inventory.ts]]
- [[_COMMUNITY_transactions-table.tsx|transactions-table.tsx]]
- [[_COMMUNITY_calendar-empty-header.tsx|calendar-empty-header.tsx]]
- [[_COMMUNITY_dashboard-appointment-row.tsx|dashboard-appointment-row.tsx]]
- [[_COMMUNITY_app-dialog-header.tsx|app-dialog-header.tsx]]
- [[_COMMUNITY_patient-timeline.tsx|patient-timeline.tsx]]
- [[_COMMUNITY_format.ts|format.ts]]
- [[_COMMUNITY_format.ts|format.ts]]
- [[_COMMUNITY_appointment-create-form.tsx|appointment-create-form.tsx]]
- [[_COMMUNITY_use-pending-clinic-requests.ts|use-pending-clinic-requests.ts]]
- [[_COMMUNITY_use-patient-edit-dialog.ts|use-patient-edit-dialog.ts]]
- [[_COMMUNITY_profile-timeline.tsx|profile-timeline.tsx]]
- [[_COMMUNITY_dependencies|dependencies]]
- [[_COMMUNITY_AppointmentWithRelations|AppointmentWithRelations]]
- [[_COMMUNITY_use-settings-page.ts|use-settings-page.ts]]
- [[_COMMUNITY_Employee|Employee]]
- [[_COMMUNITY_profile-timeline.tsx|profile-timeline.tsx]]
- [[_COMMUNITY_use-settings-page.ts|use-settings-page.ts]]
- [[_COMMUNITY_employee-profile-summary.tsx|employee-profile-summary.tsx]]
- [[_COMMUNITY_appointments-store.ts|appointments-store.ts]]
- [[_COMMUNITY_notice.tsx|notice.tsx]]
- [[_COMMUNITY_auth-store.ts|auth-store.ts]]
- [[_COMMUNITY_use-appointment-create-dialog.ts|use-appointment-create-dialog.ts]]
- [[_COMMUNITY_appointments-page-client.tsx|appointments-page-client.tsx]]
- [[_COMMUNITY_inventory-store.ts|inventory-store.ts]]
- [[_COMMUNITY_pwa-install-panel.tsx|pwa-install-panel.tsx]]
- [[_COMMUNITY_auth-provider.tsx|auth-provider.tsx]]
- [[_COMMUNITY_skeleton-list.tsx|skeleton-list.tsx]]
- [[_COMMUNITY_components.json|components.json]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_app-date-field.tsx|app-date-field.tsx]]
- [[_COMMUNITY_devDependencies|devDependencies]]
- [[_COMMUNITY_eslint.config.mjs|eslint.config.mjs]]
- [[_COMMUNITY_next.config.ts|next.config.ts]]
- [[_COMMUNITY_postcss.config.mjs|postcss.config.mjs]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 79 edges
2. `useAuth()` - 34 edges
3. `isInitialLoading()` - 29 edges
4. `Notice()` - 24 edges
5. `ActionButton()` - 23 edges
6. `supabase` - 22 edges
7. `AppointmentWithRelations` - 21 edges
8. `Employee` - 19 edges
9. `useFileUrl()` - 16 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `proxy()` --calls--> `updateSession()`  [EXTRACTED]
  proxy.ts → src/lib/supabase/proxy.ts
- `proxy()` --calls--> `withSessionCookies()`  [EXTRACTED]
  proxy.ts → src/lib/supabase/proxy.ts
- `TreatmentInventoryLinksField()` --calls--> `useInventoryItems()`  [EXTRACTED]
  src/components/treatments/components/treatment-inventory-links-field.tsx → src/lib/hooks/use-inventory.ts
- `AppSearchableComboboxItem()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/app-searchable-combobox-item.tsx → src/lib/utils.ts
- `AppSearchableCombobox()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/app-searchable-combobox.tsx → src/lib/utils.ts

## Import Cycles
- 3-file cycle: `src/lib/active-clinic-id.ts -> src/stores/auth-store.ts -> src/stores/employees-store.ts -> src/lib/active-clinic-id.ts`

## Communities (82 total, 16 thin omitted)

### Community 0 - "useAuth"
Cohesion: 0.25
Nodes (8): InventoryItemCreateForm(), InventoryItemCreateFormProps, InventoryPageClient(), INVENTORY_ITEM_CREATE_COPY, defaultValues, inventoryFormSchema, InventoryFormValues, useInventoryItemCreateDialog()

### Community 1 - "appointments-store.ts"
Cohesion: 0.11
Nodes (33): Separator(), Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction() (+25 more)

### Community 2 - "use-schedule-x-calendar.ts"
Cohesion: 0.08
Nodes (33): @schedule-x/calendar, CalendarEmployeeFilter(), CalendarPageClient(), CalendarEmptyHeader(), CalendarToolbar(), CalendarToolbarProps, CalendarToolbarMobileMenu(), CalendarToolbarMobileMenuProps (+25 more)

### Community 3 - "format.ts"
Cohesion: 0.11
Nodes (27): EmployeeDetailActionsMenu(), EmployeeDetailActionsMenuProps, EmployeeProfileSidebar(), EmployeeProfileSidebarProps, EmployeeProfileSummary(), EmployeeProfileSummaryProps, EmployeeQuickActions(), EmployeeQuickActionsProps (+19 more)

### Community 4 - "cn"
Cohesion: 0.10
Nodes (19): AppSearchableCombobox(), AppSearchableComboboxOption, AppSearchableComboboxProps, AppSearchableComboboxItem(), AppSearchableComboboxItemProps, ComboboxChip(), ComboboxChips(), ComboboxChipsInput() (+11 more)

### Community 5 - "login-form-panel.tsx"
Cohesion: 0.15
Nodes (17): AppointmentCreateDialog(), AppointmentCreateDialogProps, TreatmentDialog(), TreatmentDialogProps, AppConfirmDialogProps, AppDialog(), AppDialogProps, AppDialogDescription() (+9 more)

### Community 7 - "patients-page-client.tsx"
Cohesion: 0.15
Nodes (22): EmployeeAppointmentRow(), EmployeeAppointmentRowProps, EmployeeTimeline(), EmployeeTimelineProps, mapAppointmentsToTimelineItems(), PatientAppointmentRow(), PatientAppointmentRowProps, mapAppointmentsToTimelineItems() (+14 more)

### Community 8 - "employee-detail-page-client.tsx"
Cohesion: 0.30
Nodes (9): useLogin(), useRegisterEmployee(), RegisterEmployeePageClient(), CreateClinicPageClient(), InviteTeamPageClient(), useAuth(), usePostAuthRedirect(), useClinicStore (+1 more)

### Community 9 - "employee-edit-dialog.tsx"
Cohesion: 0.25
Nodes (14): getActiveClinicId(), unwrapSupabase(), DashboardData, DashboardStore, EmployeesStore, FinancesStore, InventoryStore, PatientsStore (+6 more)

### Community 10 - "appointments-page-client.tsx"
Cohesion: 0.15
Nodes (12): AppLayoutClient(), AppLayoutClientProps, AppShell(), SidebarClinicSwitcherProps, SidebarProfileFooter(), SIDEBAR_COPY, clinicMembershipRoleLabel(), useActiveClinic() (+4 more)

### Community 11 - "employees-page-client.tsx"
Cohesion: 0.15
Nodes (13): RegisterEmployeeFormCopy, RegisterEmployeeFormProps, RegisterEmployeeSidebar(), RegisterEmployeeSidebarProps, getRegisterCopy(), getSidebarCopy(), REGISTER_COPY, REGISTER_EMPLOYEE_FORM_COPY (+5 more)

### Community 12 - "layout.tsx"
Cohesion: 0.12
Nodes (17): geistMono, geistSans, metadata, viewport, AuthProvider(), PwaInstallProvider(), PwaInstallProviderProps, ServiceWorkerProvider() (+9 more)

### Community 13 - "action-button.tsx"
Cohesion: 0.15
Nodes (10): LoginAuthTabs(), LoginAuthTabsProps, LoginFormFieldsProps, LoginFormPanel(), LoginFormPanelProps, LoginHeroIllustration(), loginIllustrationSvg, HERO_INDICATORS (+2 more)

### Community 14 - "transactions-columns.tsx"
Cohesion: 0.21
Nodes (9): mapOperationalRoleToEmployeeRole(), OperationalRoleOption, operationalRoleOptions, buildCreateClinicPayload(), buildCreateClinicPayloadFromProfile(), CreateClinicPayload, OwnerClinicFormValues, OwnerClinicOnlyValues (+1 more)

### Community 15 - "owner-clinic-form.ts"
Cohesion: 0.20
Nodes (11): DashboardAppointmentRow(), DashboardAppointmentRowProps, formatAppointmentDay(), formatAppointmentDuration(), formatAppointmentMonth(), formatBirthDateWithAge(), formatInputDate(), formatInputDateTime() (+3 more)

### Community 16 - "proxy.ts"
Cohesion: 0.27
Nodes (7): config, proxy(), publicRoutes, pwaRoutes, SessionUpdateResult, updateSession(), withSessionCookies()

### Community 28 - "appointment-create-dialog.tsx"
Cohesion: 0.07
Nodes (38): AppointmentMaterialsOverrideForm(), PatientDetailActionsMenu(), PatientDetailActionsMenuProps, PatientInfoSection(), PatientInfoSectionProps, PatientProfileSidebar(), PatientProfileSidebarProps, PatientQuickActions() (+30 more)

### Community 36 - "patients-page-client.tsx"
Cohesion: 0.06
Nodes (47): EmployeeProfileHeader(), EmployeeProfileHeaderProps, getAvatarStyle(), PatientProfileHeader(), PatientProfileHeaderProps, SettingsManagementLink(), SettingsManagementLinkProps, MANAGEMENT_LINKS (+39 more)

### Community 37 - "action-button.tsx"
Cohesion: 0.15
Nodes (11): appointmentsColumns, AppointmentsTable(), AppointmentsTableProps, employeesColumns, EmployeesTable(), EmployeesTableProps, DataTable(), SortableTableHead() (+3 more)

### Community 38 - "inventory-page-client.tsx"
Cohesion: 0.21
Nodes (10): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea() (+2 more)

### Community 39 - "app-bottom-nav-more-sheet.tsx"
Cohesion: 0.17
Nodes (13): AppBottomNav(), AppBottomNavItem(), AppBottomNavItemProps, AppBottomNavMoreSheet(), AppBottomNavMoreSheetProps, AppShellProps, AppSidebar(), SidebarInset() (+5 more)

### Community 40 - "transactions-columns.tsx"
Cohesion: 0.39
Nodes (6): PatientEditDialog(), PatientEditDialogProps, PATIENT_EDIT_COPY, patientFormSchema, toFormValues(), usePatientEditDialog()

### Community 41 - "use-inventory-item-create-dialog.ts"
Cohesion: 0.16
Nodes (8): Button(), buttonVariants, SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 42 - "patient-edit-dialog.tsx"
Cohesion: 0.18
Nodes (11): EmployeeInviteFormProps, roleOptions, EmployeesPageClient(), roles, EMPLOYEE_INVITE_COPY, defaultValues, EmployeeFormValues, useEmployeeInviteDialog() (+3 more)

### Community 43 - "patient-detail-page-client.tsx"
Cohesion: 0.23
Nodes (12): AppointmentDetailSidebar(), AppointmentDetailSidebarProps, reminderLabel(), AppointmentHeader(), AppointmentHeaderProps, AppointmentStatusBadge(), AppointmentStatusBadgeProps, statusStyles (+4 more)

### Community 44 - "inventory-columns.tsx"
Cohesion: 0.15
Nodes (15): transactionsColumns, TransactionsTable(), TransactionsTableProps, inventoryColumns, InventoryTable(), InventoryTableProps, transactionTypeLabel(), getInventoryStockLevel() (+7 more)

### Community 45 - "use-inventory.ts"
Cohesion: 0.20
Nodes (11): signInWithGoogleFlow(), navigateAfterAuth(), resolveUnauthenticatedRoute(), createWebPersistStorage(), webStorage, OnboardingIntentStore, OnboardingStore, useOnboardingHydrated() (+3 more)

### Community 46 - "transactions-table.tsx"
Cohesion: 0.14
Nodes (14): AppointmentCreateFormProps, NewAppointmentDatetimeField(), NewAppointmentDatetimeFieldProps, APPOINTMENT_CREATE_COPY, appointmentFormSchema, AppointmentFormValues, createDefaultStartsAt(), createDefaultValues() (+6 more)

### Community 47 - "calendar-empty-header.tsx"
Cohesion: 0.22
Nodes (9): scripts, build, dev, dev:https, lint, lint:staged, prepare, start (+1 more)

### Community 48 - "dashboard-appointment-row.tsx"
Cohesion: 0.06
Nodes (43): AppointmentDetailPageClient(), AppointmentDetailPageClientProps, resolveTotalDurationMinutes(), AppointmentDetailCardProps, AppointmentDetailTreatmentItem(), AppointmentDetailTreatmentItemProps, AppointmentMaterialsOverrideDialog(), AppointmentMaterialsOverrideDialogProps (+35 more)

### Community 49 - "app-dialog-header.tsx"
Cohesion: 0.13
Nodes (20): defaultValues, patientFormSchema, inventoryFieldsSchema, inventorySchema, InventorySchemaInput, patientFieldsSchema, patientSchema, PatientSchemaInput (+12 more)

### Community 50 - "patient-timeline.tsx"
Cohesion: 0.25
Nodes (9): EmployeeEditDialog(), EmployeeEditDialogProps, EmployeeEditFormProps, roleOptions, EMPLOYEE_EDIT_COPY, employeeEditFormSchema, EmployeeEditFormValues, toFormValues() (+1 more)

### Community 51 - "format.ts"
Cohesion: 0.33
Nodes (5): lint-staged, *.{ts,tsx}, name, private, version

### Community 52 - "format.ts"
Cohesion: 0.24
Nodes (6): AppDialogClose(), AppDialogCloseProps, AppDialogContentProps, AppSheetContent(), AppSheetContentProps, APP_DIALOG_COPY

### Community 53 - "appointment-create-form.tsx"
Cohesion: 0.09
Nodes (21): patientsColumns, PatientsTable(), PatientsTableProps, employeeColors, employeeRoles, patientsMobileColumns, AppointmentInventoryItem, AppointmentTreatment (+13 more)

### Community 54 - "use-pending-clinic-requests.ts"
Cohesion: 0.33
Nodes (5): DashboardPageClient(), formatTodayTitle(), SkeletonList(), useDashboard(), useDashboardStore

### Community 55 - "use-patient-edit-dialog.ts"
Cohesion: 0.29
Nodes (7): TransactionCreateFormProps, TRANSACTION_CREATE_COPY, useCreateTransaction(), createDefaultValues(), transactionFormSchema, TransactionFormValues, useTransactionCreateDialog()

### Community 56 - "profile-timeline.tsx"
Cohesion: 0.05
Nodes (53): TreatmentCategoryFilter(), TreatmentCategoryFilterProps, TreatmentColorFieldProps, TreatmentDeleteConfirmDialog(), TreatmentDeleteConfirmDialogProps, TreatmentForm(), TreatmentFormProps, InventoryOption (+45 more)

### Community 57 - "dependencies"
Cohesion: 0.06
Nodes (32): dependencies, @base-ui/react, class-variance-authority, clsx, date-fns, @hookform/resolvers, lucide-react, match-sorter (+24 more)

### Community 58 - "AppointmentWithRelations"
Cohesion: 0.38
Nodes (8): externalMemberships(), needsClinicSelector(), PostAuthRouteInput, PostAuthRouteResult, resolvePostAuthRoute(), hasPendingTeamInvites(), hasRegistrationProfile(), isOwnerRegistration()

### Community 59 - "use-settings-page.ts"
Cohesion: 0.19
Nodes (8): PatientCreateFormProps, PatientsPageClient(), PATIENT_CREATE_COPY, useDebouncedValue(), PatientFormValues, usePatientCreateDialog(), TopbarSearchState, useTopbarSearchStore

### Community 60 - "Employee"
Cohesion: 0.33
Nodes (4): CategoryBreakdownItem, FinancesCategoryBreakdownProps, FinancesCategoryRow(), FinancesCategoryRowProps

### Community 61 - "profile-timeline.tsx"
Cohesion: 0.17
Nodes (7): EffectiveAppointmentMaterial, fetchDefaultMaterialsForTreatments(), unwrapSupabaseList(), AppointmentsStore, getTreatments(), Appointment, AppointmentWithRelations

### Community 62 - "use-settings-page.ts"
Cohesion: 0.21
Nodes (8): FinancesMetricItem(), FinancesMetricItemProps, FinancesSummaryMetrics(), FinancesSummaryMetricsProps, MetricConfig, FinancesWeeklyBreakdownProps, FINANCES_COPY, FinancialSummary

### Community 63 - "employee-profile-summary.tsx"
Cohesion: 0.32
Nodes (10): transactionTypeForTab(), useFinancesPage(), useFinancialSummary(), useTransactions(), summaryKey(), TransactionInput, transactionsKey(), transactionsToCsv() (+2 more)

### Community 64 - "appointments-store.ts"
Cohesion: 0.33
Nodes (4): AppSearchableMultiSelectOption, AppSearchableMultiSelectProps, AppSearchableMultiSelectOption(), AppSearchableMultiSelectOptionProps

### Community 65 - "notice.tsx"
Cohesion: 0.28
Nodes (6): SettingsAccountPanel(), SettingsAccountPanelProps, SettingsActionRow(), SettingsActionRowProps, Notice(), NoticeProps

### Community 66 - "auth-store.ts"
Cohesion: 0.16
Nodes (11): captureEvent(), waitForAuthSessionReady(), useUpdateProfile(), normalizeInviteEmails(), validateInviteEmails(), buildOwnerProfileMetadata(), assertSupabaseConfigured(), supabase (+3 more)

### Community 67 - "use-appointment-create-dialog.ts"
Cohesion: 0.20
Nodes (9): clinicMembershipInvitationRoleSchema, employeeFieldsSchema, employeeInviteSchema, EmployeeInviteSchemaInput, employeeRoleSchema, employeeSchema, EmployeeSchemaInput, employeeUpdateSchema (+1 more)

### Community 68 - "appointments-page-client.tsx"
Cohesion: 0.22
Nodes (6): AppointmentsPageClient(), ActionButton(), PageHeader(), PWA_INSTALL_COPY, useAppointmentsPage(), useAppointments()

### Community 69 - "inventory-store.ts"
Cohesion: 0.38
Nodes (4): FinancesMovementsSectionProps, FinancesTabBar(), FinancesTabBarProps, FinancesTabValue

### Community 70 - "pwa-install-panel.tsx"
Cohesion: 0.36
Nodes (5): FinancesMonthSelector(), FinancesPageClient(), FinancesUiStore, useFinancesPageState(), useFinancesUiStore

### Community 71 - "auth-provider.tsx"
Cohesion: 0.53
Nodes (5): AuthProviderProps, getClientHydratedSnapshot(), getServerHydratedSnapshot(), subscribeToClientHydration(), useAuthHydrated()

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

## Knowledge Gaps
- **331 isolated node(s):** `geistSans`, `geistMono`, `metadata`, `viewport`, `$schema` (+326 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `use-schedule-x-calendar.ts`, `format.ts`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `@schedule-x/calendar` connect `use-schedule-x-calendar.ts` to `dependencies`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `cn()` connect `appointments-store.ts` to `cn`, `inventory-page-client.tsx`, `app-bottom-nav-more-sheet.tsx`, `use-inventory-item-create-dialog.ts`, `profile-timeline.tsx`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **What connects `geistSans`, `geistMono`, `metadata` to the rest of the system?**
  _331 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `appointments-store.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11025641025641025 - nodes in this community are weakly interconnected._
- **Should `use-schedule-x-calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07686274509803921 - nodes in this community are weakly interconnected._
- **Should `format.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10512820512820513 - nodes in this community are weakly interconnected._