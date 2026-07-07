# Graph Report - thalia-web  (2026-07-07)

## Corpus Check
- 368 files · ~92,176 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1373 nodes · 3449 edges · 79 communities (64 shown, 15 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `72193f76`
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
- [[_COMMUNITY_use-settings-page.ts|use-settings-page.ts]]
- [[_COMMUNITY_auth-store.ts|auth-store.ts]]
- [[_COMMUNITY_use-appointment-create-dialog.ts|use-appointment-create-dialog.ts]]
- [[_COMMUNITY_appointments-page-client.tsx|appointments-page-client.tsx]]
- [[_COMMUNITY_pwa-install-panel.tsx|pwa-install-panel.tsx]]
- [[_COMMUNITY_auth-provider.tsx|auth-provider.tsx]]
- [[_COMMUNITY_skeleton-list.tsx|skeleton-list.tsx]]
- [[_COMMUNITY_use-dashboard.ts|use-dashboard.ts]]
- [[_COMMUNITY_components.json|components.json]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_app-date-field.tsx|app-date-field.tsx]]
- [[_COMMUNITY_devDependencies|devDependencies]]
- [[_COMMUNITY_eslint.config.mjs|eslint.config.mjs]]
- [[_COMMUNITY_next.config.ts|next.config.ts]]
- [[_COMMUNITY_postcss.config.mjs|postcss.config.mjs]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 79 edges
2. `useAuth()` - 38 edges
3. `isInitialLoading()` - 29 edges
4. `Notice()` - 28 edges
5. `ActionButton()` - 26 edges
6. `supabase` - 24 edges
7. `AppointmentWithRelations` - 21 edges
8. `Employee` - 19 edges
9. `SkeletonList()` - 17 edges
10. `useAuthStore` - 17 edges

## Surprising Connections (you probably didn't know these)
- `proxy()` --calls--> `updateSession()`  [EXTRACTED]
  proxy.ts → src/lib/supabase/proxy.ts
- `proxy()` --calls--> `withSessionCookies()`  [EXTRACTED]
  proxy.ts → src/lib/supabase/proxy.ts
- `AppSearchableComboboxItem()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/app-searchable-combobox-item.tsx → src/lib/utils.ts
- `AppSearchableCombobox()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/app-searchable-combobox.tsx → src/lib/utils.ts
- `ComboboxClear()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/combobox.tsx → src/lib/utils.ts

## Import Cycles
- 3-file cycle: `src/lib/active-clinic-id.ts -> src/stores/auth-store.ts -> src/stores/employees-store.ts -> src/lib/active-clinic-id.ts`

## Communities (79 total, 15 thin omitted)

### Community 0 - "useAuth"
Cohesion: 0.25
Nodes (6): INVENTORY_FILTER_DEFAULTS, InventoryPageClient(), stockOptions, INVENTORY_COPY, useInventoryItemCreateDialog(), useUrlFilters()

### Community 1 - "appointments-store.ts"
Cohesion: 0.11
Nodes (33): Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent() (+25 more)

### Community 2 - "use-schedule-x-calendar.ts"
Cohesion: 0.07
Nodes (35): @schedule-x/calendar, AppointmentEmployeeFilter(), CalendarEmployeeFilter(), CalendarPageClient(), CalendarEmptyHeader(), CalendarToolbar(), CalendarToolbarProps, CalendarToolbarMobileMenu() (+27 more)

### Community 3 - "format.ts"
Cohesion: 0.07
Nodes (34): EmployeeDetailActionsMenu(), EmployeeDetailActionsMenuProps, EmployeeInviteFormProps, roleOptions, EmployeeProfileSidebar(), EmployeeProfileSidebarProps, EmployeeProfileSummary(), EmployeeProfileSummaryProps (+26 more)

### Community 4 - "cn"
Cohesion: 0.11
Nodes (18): AppSearchableCombobox(), AppSearchableComboboxOption, AppSearchableComboboxProps, AppSearchableComboboxItem(), AppSearchableComboboxItemProps, ComboboxChip(), ComboboxChips(), ComboboxChipsInput() (+10 more)

### Community 5 - "login-form-panel.tsx"
Cohesion: 0.21
Nodes (20): AppointmentCreateDialogProps, AppointmentMaterialsOverrideDialogProps, EmployeeEditDialogProps, FINANCES_FILTER_DEFAULTS, InventoryItemAdjustStockDialogProps, PatientEditDialogProps, TreatmentDialogProps, AppConfirmDialogProps (+12 more)

### Community 7 - "patients-page-client.tsx"
Cohesion: 0.16
Nodes (22): EmployeeAppointmentRow(), EmployeeAppointmentRowProps, EmployeeTimeline(), EmployeeTimelineProps, mapAppointmentsToTimelineItems(), PatientAppointmentRow(), PatientAppointmentRowProps, mapAppointmentsToTimelineItems() (+14 more)

### Community 8 - "employee-detail-page-client.tsx"
Cohesion: 0.25
Nodes (11): useLogin(), useRegisterEmployee(), RegisterEmployeePageClient(), InviteTeamPageClient(), getRegisterCopy(), signInWithGoogleFlow(), useAcceptInvitation(), useAuth() (+3 more)

### Community 9 - "employee-edit-dialog.tsx"
Cohesion: 0.13
Nodes (23): getActiveClinicId(), EffectiveAppointmentMaterial, fetchDefaultMaterialsForTreatments(), unwrapSupabase(), unwrapSupabaseList(), AppointmentFormInput, AppointmentInventoryLinkInput, AppointmentsStore (+15 more)

### Community 10 - "appointments-page-client.tsx"
Cohesion: 0.18
Nodes (9): EMPLOYEE_FILTER_DEFAULTS, EmployeesPageClient(), roleOptions, statusOptions, FilterPillOption, FilterPills(), FilterPillsProps, EMPLOYEES_COPY (+1 more)

### Community 11 - "employees-page-client.tsx"
Cohesion: 0.16
Nodes (13): RegisterEmployeeFormCopy, RegisterEmployeeFormProps, RegisterEmployeeSidebar(), RegisterEmployeeSidebarProps, getSidebarCopy(), REGISTER_COPY, REGISTER_EMPLOYEE_FORM_COPY, REGISTER_EMPLOYEE_SIDEBAR_COPY (+5 more)

### Community 12 - "layout.tsx"
Cohesion: 0.11
Nodes (18): geistMono, geistSans, metadata, viewport, AuthProvider(), PwaInstallProvider(), PwaInstallProviderProps, ServiceWorkerProvider() (+10 more)

### Community 13 - "action-button.tsx"
Cohesion: 0.14
Nodes (9): LoginAuthTabs(), LoginAuthTabsProps, LoginFormFieldsProps, LoginFormPanelProps, LoginHeroIllustration(), loginIllustrationSvg, HERO_INDICATORS, LoginPageClient() (+1 more)

### Community 14 - "transactions-columns.tsx"
Cohesion: 0.07
Nodes (27): Props, EmployeeEditDialog(), EmployeeEditFormProps, roleOptions, EMPLOYEE_ROLE_OPTIONS, InvitePageClient(), MEMBERSHIP_ROLE_LABELS, Props (+19 more)

### Community 15 - "owner-clinic-form.ts"
Cohesion: 0.16
Nodes (14): DashboardAppointmentRow(), DashboardAppointmentRowProps, PatientInfoSection(), formatAppointmentDay(), formatAppointmentDuration(), formatAppointmentMonth(), formatBirthDateWithAge(), formatInputDate() (+6 more)

### Community 16 - "proxy.ts"
Cohesion: 0.27
Nodes (7): config, proxy(), publicRoutes, pwaRoutes, SessionUpdateResult, updateSession(), withSessionCookies()

### Community 28 - "appointment-create-dialog.tsx"
Cohesion: 0.13
Nodes (17): PatientDetailActionsMenu(), PatientDetailActionsMenuProps, PatientInfoSectionProps, PatientProfileSidebar(), PatientProfileSidebarProps, PatientQuickActions(), PatientQuickActionsProps, patientsColumns (+9 more)

### Community 36 - "patients-page-client.tsx"
Cohesion: 0.16
Nodes (12): FinancesPageClient(), TreatmentCategoryFilter(), TreatmentCategoryFilterProps, useTreatmentsPage(), TREATMENT_FILTER_DEFAULTS, TreatmentsPageClient(), AppSearchBarInput(), AppSearchBarInputProps (+4 more)

### Community 37 - "action-button.tsx"
Cohesion: 0.23
Nodes (10): SettingsPageClient(), SettingsProfilePanel(), SettingsProfilePanelProps, normalizeEmail(), PendingClinicRequest, usePendingClinicRequests(), UsePendingClinicRequestsResult, useSettingsPageActions() (+2 more)

### Community 38 - "inventory-page-client.tsx"
Cohesion: 0.05
Nodes (35): AppointmentDetailPageClient(), AppointmentDetailPageClientProps, resolveTotalDurationMinutes(), AppointmentDetailCardProps, AppointmentDetailTreatmentItem(), AppointmentDetailTreatmentItemProps, AppointmentMaterialsOverrideDialog(), AppointmentMaterialsOverrideFormProps (+27 more)

### Community 39 - "app-bottom-nav-more-sheet.tsx"
Cohesion: 0.12
Nodes (17): AppLayoutClient(), AppLayoutClientProps, AppBottomNav(), AppBottomNavItem(), AppBottomNavItemProps, AppBottomNavMoreSheet(), AppBottomNavMoreSheetProps, AppShell() (+9 more)

### Community 40 - "transactions-columns.tsx"
Cohesion: 0.06
Nodes (43): AppointmentPersonAvatar(), AppointmentPersonAvatarProps, getInitials(), EmployeeProfileHeader(), EmployeeProfileHeaderProps, getAvatarStyle(), PatientProfileHeader(), PatientProfileHeaderProps (+35 more)

### Community 41 - "use-inventory-item-create-dialog.ts"
Cohesion: 0.16
Nodes (8): Button(), buttonVariants, SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 42 - "patient-edit-dialog.tsx"
Cohesion: 0.16
Nodes (10): AppointmentMaterialsSection(), AppointmentMaterialsSectionProps, toDialogInitialItems(), DashboardPageClient(), formatTodayTitle(), Notice(), NoticeProps, SkeletonListItem() (+2 more)

### Community 43 - "patient-detail-page-client.tsx"
Cohesion: 0.24
Nodes (12): formatMovementQuantity(), inventoryMovementDotClass(), InventoryMovementRow(), InventoryMovementRowProps, inventoryMovementToneClass(), inventoryMovementTypeLabel(), groupMovementsByMonth(), InventoryMovementsList() (+4 more)

### Community 44 - "inventory-columns.tsx"
Cohesion: 0.21
Nodes (15): PatientDetailPageClient(), PatientDetailPageClientProps, useDashboard(), useCreatePatient(), usePatient(), usePatientAppointments(), usePatients(), useUpcomingPatientAppointments() (+7 more)

### Community 45 - "use-inventory.ts"
Cohesion: 0.31
Nodes (6): createWebPersistStorage(), webStorage, OnboardingStore, useOnboardingHydrated(), useOnboardingStore, PendingInviteStore

### Community 46 - "transactions-table.tsx"
Cohesion: 0.22
Nodes (8): Props, RegisterEmployeeEmail(), Props, RegisterTypePicker(), RegisterPageClient(), REGISTER_COPY, RegisterStep, useRegisterType()

### Community 47 - "calendar-empty-header.tsx"
Cohesion: 0.22
Nodes (9): scripts, build, dev, dev:https, lint, lint:staged, prepare, start (+1 more)

### Community 48 - "dashboard-appointment-row.tsx"
Cohesion: 0.26
Nodes (9): AppointmentDetailSidebar(), AppointmentDetailSidebarProps, reminderLabel(), AppointmentHeader(), AppointmentHeaderProps, AppointmentStatusBadge(), AppointmentStatusBadgeProps, statusStyles (+1 more)

### Community 49 - "app-dialog-header.tsx"
Cohesion: 0.11
Nodes (23): PatientEditDialog(), PATIENT_EDIT_COPY, patientFormSchema, toFormValues(), usePatientEditDialog(), inventoryFieldsSchema, inventorySchema, InventorySchemaInput (+15 more)

### Community 50 - "patient-timeline.tsx"
Cohesion: 0.24
Nodes (6): PATIENT_FILTER_DEFAULTS, PatientsPageClient(), statusOptions, PageHeader(), PATIENTS_COPY, usePatientCreateDialog()

### Community 51 - "format.ts"
Cohesion: 0.33
Nodes (5): lint-staged, *.{ts,tsx}, name, private, version

### Community 52 - "format.ts"
Cohesion: 0.20
Nodes (9): clinicMembershipInvitationRoleSchema, employeeFieldsSchema, employeeInviteSchema, EmployeeInviteSchemaInput, employeeRoleSchema, employeeSchema, EmployeeSchemaInput, employeeUpdateSchema (+1 more)

### Community 53 - "appointment-create-form.tsx"
Cohesion: 0.11
Nodes (18): allStatuses, AppointmentStatusSelectProps, statusColors, buildAppointmentsColumns(), AppointmentsTable(), AppointmentsTableProps, appointmentsMobileColumns, AppointmentInventoryItem (+10 more)

### Community 54 - "use-pending-clinic-requests.ts"
Cohesion: 0.53
Nodes (5): AuthProviderProps, getClientHydratedSnapshot(), getServerHydratedSnapshot(), subscribeToClientHydration(), useAuthHydrated()

### Community 55 - "use-patient-edit-dialog.ts"
Cohesion: 0.16
Nodes (15): inventoryColumns, InventoryItemSidebar(), InventoryItemSidebarProps, inventoryStockLevelToneClass(), InventoryTable(), InventoryTableProps, InventoryPageFilters, resolveStockLevel() (+7 more)

### Community 56 - "profile-timeline.tsx"
Cohesion: 0.06
Nodes (48): TreatmentColorFieldProps, TreatmentDeleteConfirmDialog(), TreatmentDeleteConfirmDialogProps, TreatmentDialog(), TreatmentForm(), TreatmentFormProps, InventoryOption, TreatmentInventoryLinkRowProps (+40 more)

### Community 57 - "dependencies"
Cohesion: 0.06
Nodes (32): dependencies, @base-ui/react, class-variance-authority, clsx, date-fns, @hookform/resolvers, lucide-react, match-sorter (+24 more)

### Community 58 - "AppointmentWithRelations"
Cohesion: 0.26
Nodes (11): navigateAfterAuth(), externalMemberships(), needsClinicSelector(), PostAuthRouteInput, PostAuthRouteResult, resolvePostAuthRoute(), resolveUnauthenticatedRoute(), buildOwnerProfileMetadata() (+3 more)

### Community 59 - "use-settings-page.ts"
Cohesion: 0.33
Nodes (5): PatientCreateFormProps, PATIENT_CREATE_COPY, defaultValues, patientFormSchema, PatientFormValues

### Community 60 - "Employee"
Cohesion: 0.10
Nodes (24): AppointmentMaterialsOverrideForm(), InventoryItemAdjustStockDialog(), InventoryItemCreateForm(), InventoryItemCreateFormProps, InventoryDetailPageClient(), InventoryDetailPageClientProps, TreatmentInventoryLinksField(), INVENTORY_ITEM_CREATE_COPY (+16 more)

### Community 62 - "use-settings-page.ts"
Cohesion: 0.09
Nodes (29): FinancesMovementsSectionProps, TransactionCreateFormProps, FinancesMonthSelector(), FinancesTabBar(), FinancesTabBarProps, FinancesTabValue, TRANSACTION_CREATE_COPY, useClinicId() (+21 more)

### Community 66 - "auth-store.ts"
Cohesion: 0.16
Nodes (13): CreateClinicPageClient(), captureEvent(), waitForAuthSessionReady(), InvitationState, useUpdateProfile(), useUploadProfileAvatar(), normalizeInviteEmails(), validateInviteEmails() (+5 more)

### Community 67 - "use-appointment-create-dialog.ts"
Cohesion: 0.17
Nodes (11): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea() (+3 more)

### Community 68 - "appointments-page-client.tsx"
Cohesion: 0.29
Nodes (6): AppSearchBar(), AppTopbar(), getSearchPlaceholder(), SEARCH_COPY, SEARCHABLE_ROUTES, CategorizedItem

### Community 70 - "pwa-install-panel.tsx"
Cohesion: 0.27
Nodes (5): AppDialogClose(), AppDialogCloseProps, AppDialogContentProps, AppSheetContentProps, APP_DIALOG_COPY

### Community 71 - "auth-provider.tsx"
Cohesion: 0.25
Nodes (8): SidebarClinicSwitcherProps, SidebarProfileFooter(), SIDEBAR_COPY, clinicMembershipRoleLabel(), useActiveClinic(), ClinicMembershipView, ClinicStore, useClinicStore

### Community 72 - "skeleton-list.tsx"
Cohesion: 0.16
Nodes (13): employeesColumns, EmployeesTable(), EmployeesTableProps, transactionsColumns, TransactionsTable(), TransactionsTableProps, SortableTableHead(), SortableTableHeadProps (+5 more)

### Community 78 - "use-dashboard.ts"
Cohesion: 0.12
Nodes (23): AppointmentCreateDialog(), defaultMaterialsKey(), useAppointmentMaterials(), TreatmentCatalogFilters, useTreatmentCatalog(), appointmentFormSchema, createDefaultStartsAt(), createDefaultValues() (+15 more)

### Community 82 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 89 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 102 - "app-date-field.tsx"
Cohesion: 0.06
Nodes (35): APPOINTMENT_FILTER_DEFAULTS, AppointmentsPageClient(), AppointmentCreateFormProps, AppointmentDateRange(), AppointmentDateRangeProps, formatAppointmentDateParam(), getDefaultAppointmentDateRange(), parseAppointmentDateParam() (+27 more)

### Community 130 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, husky, lint-staged, prettier, tailwindcss, @tailwindcss/postcss (+4 more)

## Knowledge Gaps
- **372 isolated node(s):** `Props`, `geistSans`, `geistMono`, `metadata`, `viewport` (+367 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `use-schedule-x-calendar.ts`, `format.ts`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `@schedule-x/calendar` connect `use-schedule-x-calendar.ts` to `dependencies`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `cn()` connect `appointments-store.ts` to `profile-timeline.tsx`, `use-inventory-item-create-dialog.ts`, `use-appointment-create-dialog.ts`, `cn`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **What connects `Props`, `geistSans`, `geistMono` to the rest of the system?**
  _372 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `appointments-store.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11201079622132254 - nodes in this community are weakly interconnected._
- **Should `use-schedule-x-calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07402031930333818 - nodes in this community are weakly interconnected._
- **Should `format.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06848357791754019 - nodes in this community are weakly interconnected._