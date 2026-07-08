# Graph Report - thalia-web  (2026-07-08)

## Corpus Check
- 393 files · ~97,379 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1472 nodes · 3709 edges · 85 communities (68 shown, 17 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8b03b898`
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
- [[_COMMUNITY_useAuth|useAuth]]
- [[_COMMUNITY_create-clinic-page-client.tsx|create-clinic-page-client.tsx]]
- [[_COMMUNITY_schema-helpers.ts|schema-helpers.ts]]
- [[_COMMUNITY_use-post-auth-redirect.ts|use-post-auth-redirect.ts]]
- [[_COMMUNITY_profile-timeline.tsx|profile-timeline.tsx]]
- [[_COMMUNITY_dependencies|dependencies]]
- [[_COMMUNITY_use-register-type.ts|use-register-type.ts]]
- [[_COMMUNITY_use-settings-page.ts|use-settings-page.ts]]
- [[_COMMUNITY_Employee|Employee]]
- [[_COMMUNITY_use-employee-invite-dialog.ts|use-employee-invite-dialog.ts]]
- [[_COMMUNITY_use-settings-page.ts|use-settings-page.ts]]
- [[_COMMUNITY_use-appointment-materials-override-dialog.ts|use-appointment-materials-override-dialog.ts]]
- [[_COMMUNITY_owner-clinic-form.ts|owner-clinic-form.ts]]
- [[_COMMUNITY_finances-category-breakdown.tsx|finances-category-breakdown.tsx]]
- [[_COMMUNITY_auth-store.ts|auth-store.ts]]
- [[_COMMUNITY_invite-page-client.tsx|invite-page-client.tsx]]
- [[_COMMUNITY_app-dialog-close.tsx|app-dialog-close.tsx]]
- [[_COMMUNITY_calendar-grid.ts|calendar-grid.ts]]
- [[_COMMUNITY_app-dialog-close.tsx|app-dialog-close.tsx]]
- [[_COMMUNITY_environment.ts|environment.ts]]
- [[_COMMUNITY_use-login.ts|use-login.ts]]
- [[_COMMUNITY_app-searchable-multi-select.tsx|app-searchable-multi-select.tsx]]
- [[_COMMUNITY_invite-team-page-client.tsx|invite-team-page-client.tsx]]
- [[_COMMUNITY_components.json|components.json]]
- [[_COMMUNITY_Patient|Patient]]
- [[_COMMUNITY_useLogin|useLogin]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_devDependencies|devDependencies]]
- [[_COMMUNITY_eslint.config.mjs|eslint.config.mjs]]
- [[_COMMUNITY_next.config.ts|next.config.ts]]
- [[_COMMUNITY_postcss.config.mjs|postcss.config.mjs]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 90 edges
2. `useAuth()` - 38 edges
3. `isInitialLoading()` - 29 edges
4. `Notice()` - 28 edges
5. `ActionButton()` - 27 edges
6. `supabase` - 24 edges
7. `Employee` - 21 edges
8. `AppointmentWithRelations` - 21 edges
9. `useAuthStore` - 19 edges
10. `SkeletonList()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `proxy()` --calls--> `updateSession()`  [EXTRACTED]
  proxy.ts → src/lib/supabase/proxy.ts
- `proxy()` --calls--> `withSessionCookies()`  [EXTRACTED]
  proxy.ts → src/lib/supabase/proxy.ts
- `AppSearchableComboboxItem()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/app-searchable-combobox-item.tsx → src/lib/utils.ts
- `AppSearchableCombobox()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/app-searchable-combobox.tsx → src/lib/utils.ts
- `CalendarDayButton()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/calendar.tsx → src/lib/utils.ts

## Import Cycles
- 3-file cycle: `src/lib/active-clinic-id.ts -> src/stores/auth-store.ts -> src/stores/employees-store.ts -> src/lib/active-clinic-id.ts`

## Communities (85 total, 17 thin omitted)

### Community 0 - "useAuth"
Cohesion: 0.12
Nodes (22): InventoryItemAdjustStockDialog(), InventoryItemAdjustStockDialogProps, PatientEditDialog(), PatientEditDialogProps, AppConfirmDialogProps, AppDialog(), AppDialogProps, AppDialogDescription() (+14 more)

### Community 1 - "appointments-store.ts"
Cohesion: 0.11
Nodes (33): Separator(), Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction() (+25 more)

### Community 2 - "use-schedule-x-calendar.ts"
Cohesion: 0.21
Nodes (9): PatientCreateFormProps, NewPatientDateField(), NewPatientDateFieldProps, PATIENT_CREATE_COPY, defaultValues, patientFormSchema, PatientFormValues, usePatientCreateDialog() (+1 more)

### Community 3 - "format.ts"
Cohesion: 0.22
Nodes (8): PatientsFilters(), PatientsFiltersProps, PatientFilters, PatientsFiltersSheet(), PatientsFiltersSheetProps, statusOptions, statusOptions, PATIENTS_COPY

### Community 4 - "cn"
Cohesion: 0.10
Nodes (19): AppSearchableCombobox(), AppSearchableComboboxOption, AppSearchableComboboxProps, AppSearchableComboboxItem(), AppSearchableComboboxItemProps, ComboboxChip(), ComboboxChips(), ComboboxChipsInput() (+11 more)

### Community 5 - "login-form-panel.tsx"
Cohesion: 0.06
Nodes (51): AppointmentCreateDialog(), AppointmentCreateDialogProps, AppointmentCreateFormProps, NewAppointmentDatetimeField(), NewAppointmentDatetimeFieldProps, DashboardPageClient(), formatTodayTitle(), PatientDetailActionsMenu() (+43 more)

### Community 7 - "patients-page-client.tsx"
Cohesion: 0.13
Nodes (26): AppointmentStatusBadge(), AppointmentStatusBadgeProps, statusStyles, EmployeeAppointmentRow(), EmployeeAppointmentRowProps, EmployeeTimeline(), EmployeeTimelineProps, mapAppointmentsToTimelineItems() (+18 more)

### Community 8 - "employee-detail-page-client.tsx"
Cohesion: 0.17
Nodes (11): AppDateField(), AppDateFieldProps, pad(), AppDatePopoverFieldProps, Popover(), PopoverContent(), PopoverDescription(), PopoverHeader() (+3 more)

### Community 9 - "employee-edit-dialog.tsx"
Cohesion: 0.06
Nodes (60): getActiveClinicId(), EffectiveAppointmentMaterial, fetchDefaultMaterialsForTreatments(), appointmentFieldsSchema, appointmentSchema, AppointmentSchemaInput, appointmentUpdateSchema, AppointmentUpdateSchemaInput (+52 more)

### Community 10 - "appointments-page-client.tsx"
Cohesion: 0.23
Nodes (12): InventoryOption, TreatmentInventoryLinkRowProps, TreatmentInventoryLinksFieldProps, DataTableProps, Table(), TableBody(), TableCaption(), TableCell() (+4 more)

### Community 11 - "employees-page-client.tsx"
Cohesion: 0.18
Nodes (8): LoginAuthTabs(), LoginAuthTabsProps, LoginFormFieldsProps, LoginFormPanelProps, LoginHeroIllustration(), loginIllustrationSvg, HERO_INDICATORS, LOGIN_COPY

### Community 12 - "layout.tsx"
Cohesion: 0.09
Nodes (23): geistMono, geistSans, metadata, viewport, AuthProvider(), AuthProviderProps, getClientHydratedSnapshot(), getServerHydratedSnapshot() (+15 more)

### Community 13 - "action-button.tsx"
Cohesion: 0.15
Nodes (13): TreatmentDeleteConfirmDialog(), TreatmentDeleteConfirmDialogProps, TreatmentFilters, TreatmentsFiltersSheet(), TreatmentsFiltersSheetProps, TreatmentCatalogFilters, useTreatmentCatalog(), useTreatmentsPage() (+5 more)

### Community 14 - "transactions-columns.tsx"
Cohesion: 0.14
Nodes (15): EmployeeEditDialog(), EmployeeEditDialogProps, EmployeeEditFormProps, roleOptions, EMPLOYEE_EDIT_COPY, employeeColors, employeeRoles, employeeEditFormSchema (+7 more)

### Community 15 - "owner-clinic-form.ts"
Cohesion: 0.27
Nodes (10): formatMovementQuantity(), inventoryMovementDotClass(), InventoryMovementRow(), InventoryMovementRowProps, inventoryMovementToneClass(), inventoryMovementTypeLabel(), groupMovementsByMonth(), InventoryMovementsList() (+2 more)

### Community 16 - "proxy.ts"
Cohesion: 0.21
Nodes (7): config, proxy(), publicRoutes, pwaRoutes, SessionUpdateResult, updateSession(), withSessionCookies()

### Community 28 - "appointment-create-dialog.tsx"
Cohesion: 0.19
Nodes (10): EmployeeDetailActionsMenu(), EmployeeDetailActionsMenuProps, EmployeeQuickActions(), EmployeeQuickActionsProps, EmployeeDetailActionHandlers, getEmployeeDetailActions(), ProfileAction, ProfileActionsMenuProps (+2 more)

### Community 36 - "patients-page-client.tsx"
Cohesion: 0.18
Nodes (8): SettingsAccountPanel(), SettingsAccountPanelProps, SettingsActionRow(), SettingsActionRowProps, SettingsManagementLink(), SettingsManagementLinkProps, MANAGEMENT_LINKS, SETTINGS_COPY

### Community 37 - "action-button.tsx"
Cohesion: 0.05
Nodes (47): AppointmentTreatmentsSection(), CategoryBreakdownItem, FinancesCategoryBreakdownProps, FinancesCategoryRow(), FinancesCategoryRowProps, FinancesFilters(), FinancesFiltersProps, FinancesFilters (+39 more)

### Community 38 - "inventory-page-client.tsx"
Cohesion: 0.16
Nodes (15): AppointmentHeader(), AppointmentHeaderProps, DashboardAppointmentRow(), DashboardAppointmentRowProps, formatAppointmentDay(), formatAppointmentDetailDay(), formatAppointmentDuration(), formatAppointmentMonth() (+7 more)

### Community 39 - "app-bottom-nav-more-sheet.tsx"
Cohesion: 0.10
Nodes (20): AppLayoutClient(), AppLayoutClientProps, AppBottomNav(), AppBottomNavItem(), AppBottomNavItemProps, AppBottomNavMoreSheet(), AppBottomNavMoreSheetProps, AppSheetContent() (+12 more)

### Community 40 - "transactions-columns.tsx"
Cohesion: 0.19
Nodes (16): EmployeeProfileHeader(), EmployeeProfileHeaderProps, getAvatarStyle(), PatientProfileHeader(), PatientProfileHeaderProps, getAvatarStyle(), getProfileInitials(), ProfileContactItem (+8 more)

### Community 41 - "use-inventory-item-create-dialog.ts"
Cohesion: 0.14
Nodes (13): Button(), buttonVariants, Calendar(), CalendarDayButton(), FiltersSheet(), FiltersSheetProps, Sheet(), SheetContent() (+5 more)

### Community 42 - "patient-edit-dialog.tsx"
Cohesion: 0.08
Nodes (26): EmployeesFilters(), EmployeesFiltersProps, roleOptions, EmployeeFilters, EmployeesFiltersSheet(), EmployeesFiltersSheetProps, roleOptions, statusOptions (+18 more)

### Community 43 - "patient-detail-page-client.tsx"
Cohesion: 0.12
Nodes (18): APPOINTMENT_FILTER_DEFAULTS, AppointmentsPageClient(), InventoryFilters, InventoryFiltersSheet(), InventoryFiltersSheetProps, stockOptions, INVENTORY_FILTER_DEFAULTS, InventoryPageClient() (+10 more)

### Community 44 - "inventory-columns.tsx"
Cohesion: 0.17
Nodes (12): RegisterEmployeeFormCopy, RegisterEmployeeFormProps, RegisterEmployeeSidebar(), RegisterEmployeeSidebarProps, getSidebarCopy(), REGISTER_COPY, REGISTER_EMPLOYEE_FORM_COPY, REGISTER_EMPLOYEE_SIDEBAR_COPY (+4 more)

### Community 45 - "use-inventory.ts"
Cohesion: 0.22
Nodes (9): SidebarClinicSwitcherProps, SidebarProfileFooter(), SIDEBAR_COPY, clinicMembershipRoleLabel(), useActiveClinic(), useUpdateProfile(), useAuthStore, ClinicMembershipView (+1 more)

### Community 47 - "calendar-empty-header.tsx"
Cohesion: 0.22
Nodes (9): scripts, build, dev, dev:https, lint, lint:staged, prepare, start (+1 more)

### Community 48 - "dashboard-appointment-row.tsx"
Cohesion: 0.20
Nodes (9): EmployeeInviteFormProps, roleOptions, EMPLOYEE_FILTER_DEFAULTS, EmployeesPageClient(), EMPLOYEE_INVITE_COPY, defaultValues, EmployeeFormValues, useEmployeeInviteDialog() (+1 more)

### Community 49 - "app-dialog-header.tsx"
Cohesion: 0.17
Nodes (10): FinancesMovementsSectionProps, transactionsColumns, TransactionsTable(), TransactionsTableProps, FinancesTabBar(), SkeletonListItem(), SkeletonList(), transactionTypeLabel() (+2 more)

### Community 50 - "patient-timeline.tsx"
Cohesion: 0.18
Nodes (10): Props, EmployeeProfileSidebar(), EmployeeProfileSidebarProps, EmployeeProfileSummary(), EmployeeProfileSummaryProps, EmployeeStatCard(), EmployeeStatCardProps, Notice() (+2 more)

### Community 51 - "format.ts"
Cohesion: 0.33
Nodes (5): lint-staged, *.{ts,tsx}, name, private, version

### Community 52 - "useAuth"
Cohesion: 0.25
Nodes (11): SettingsProfileHeader(), SettingsProfileHeaderProps, SettingsPageClient(), SettingsProfilePanel(), SettingsProfilePanelProps, useUploadProfileAvatar(), usePendingClinicRequests(), buildProfileSubtitle() (+3 more)

### Community 53 - "create-clinic-page-client.tsx"
Cohesion: 0.07
Nodes (38): AppointmentMaterialsOverrideForm(), AppointmentMaterialsOverrideFormProps, AppointmentMaterialsFormValues, InventoryItemCreateForm(), InventoryItemCreateFormProps, InventoryItemSidebar(), InventoryItemSidebarProps, inventoryStockLevelToneClass() (+30 more)

### Community 54 - "schema-helpers.ts"
Cohesion: 0.08
Nodes (34): AppointmentDateRange(), AppointmentDateRangeProps, formatAppointmentDateParam(), getDefaultAppointmentDateRange(), parseAppointmentDateParam(), AppointmentEmployeeFilter(), AppointmentEmployeeFilterProps, AppointmentFilters() (+26 more)

### Community 55 - "use-post-auth-redirect.ts"
Cohesion: 0.20
Nodes (10): signInWithGoogleFlow(), navigateAfterAuth(), resolveUnauthenticatedRoute(), createWebPersistStorage(), webStorage, OnboardingIntentStore, OnboardingStore, useOnboardingHydrated() (+2 more)

### Community 56 - "profile-timeline.tsx"
Cohesion: 0.19
Nodes (15): TreatmentDialog(), TreatmentDialogProps, TreatmentForm(), emptyValues, toFormValues(), useTreatmentDialog(), useCreateTreatment(), useTreatment() (+7 more)

### Community 57 - "dependencies"
Cohesion: 0.06
Nodes (33): dependencies, @base-ui/react, class-variance-authority, clsx, date-fns, @hookform/resolvers, lucide-react, match-sorter (+25 more)

### Community 58 - "use-register-type.ts"
Cohesion: 0.23
Nodes (7): RegisterEmployeeEmail(), Props, RegisterTypePicker(), RegisterPageClient(), REGISTER_COPY, RegisterStep, useRegisterType()

### Community 59 - "use-settings-page.ts"
Cohesion: 0.21
Nodes (8): SettingsProfileQuickActions(), SettingsProfileQuickActionsProps, SettingsProfileSidebar(), SettingsProfileSidebarProps, SettingsProfileSummary(), SettingsProfileSummaryProps, SettingsStatItem(), SettingsStatItemProps

### Community 60 - "Employee"
Cohesion: 0.27
Nodes (5): AppDialogClose(), AppDialogCloseProps, AppDialogContentProps, AppSheetContentProps, APP_DIALOG_COPY

### Community 61 - "use-employee-invite-dialog.ts"
Cohesion: 0.26
Nodes (7): TreatmentColorFieldProps, TreatmentFormProps, TreatmentsFilters(), TreatmentsFiltersProps, TreatmentFormValues, TREATMENT_COLOR_PRESETS, TREATMENTS_COPY

### Community 62 - "use-settings-page.ts"
Cohesion: 0.08
Nodes (30): AppointmentDetailPageClient(), AppointmentDetailPageClientProps, resolveTotalDurationMinutes(), AppointmentDetailCardProps, AppointmentDetailSidebar(), AppointmentDetailSidebarProps, reminderLabel(), AppointmentDetailTreatmentItem() (+22 more)

### Community 63 - "use-appointment-materials-override-dialog.ts"
Cohesion: 0.07
Nodes (35): allStatuses, AppointmentStatusSelectProps, statusColors, buildAppointmentsColumns(), AppointmentsTable(), AppointmentsTableProps, employeesColumns, EmployeesTable() (+27 more)

### Community 64 - "owner-clinic-form.ts"
Cohesion: 0.24
Nodes (11): ProfileColorFieldProps, ProfileEditDialog(), ProfileEditDialogProps, ProfileEditForm(), ProfileEditFormProps, PROFILE_COLOR_PRESETS, PROFILE_EDIT_COPY, profileEditFormSchema (+3 more)

### Community 65 - "finances-category-breakdown.tsx"
Cohesion: 0.33
Nodes (9): externalMemberships(), needsClinicSelector(), PostAuthRouteInput, PostAuthRouteResult, resolvePostAuthRoute(), buildOwnerProfileMetadata(), hasPendingTeamInvites(), hasRegistrationProfile() (+1 more)

### Community 66 - "auth-store.ts"
Cohesion: 0.60
Nodes (3): normalizeEmail(), PendingClinicRequest, UsePendingClinicRequestsResult

### Community 68 - "invite-page-client.tsx"
Cohesion: 0.21
Nodes (10): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea() (+2 more)

### Community 70 - "app-dialog-close.tsx"
Cohesion: 0.21
Nodes (9): mapOperationalRoleToEmployeeRole(), OperationalRoleOption, operationalRoleOptions, buildCreateClinicPayload(), buildCreateClinicPayloadFromProfile(), CreateClinicPayload, OwnerClinicFormValues, OwnerClinicOnlyValues (+1 more)

### Community 71 - "calendar-grid.ts"
Cohesion: 0.07
Nodes (38): @schedule-x/calendar, CalendarEmployeeFilter(), CALENDAR_FILTER_DEFAULTS, CalendarPageClient(), CalendarEmptyHeader(), CalendarFilters, CalendarFiltersSheetProps, CalendarToolbar() (+30 more)

### Community 75 - "app-dialog-close.tsx"
Cohesion: 0.24
Nodes (7): Props, EMPLOYEE_ROLE_OPTIONS, InvitePageClient(), MEMBERSHIP_ROLE_LABELS, Props, InvitationState, useAcceptInvitation()

### Community 77 - "environment.ts"
Cohesion: 0.29
Nodes (7): TreatmentRowActions(), TreatmentRowActionsProps, getTreatmentsColumns(), GetTreatmentsColumnsParams, TreatmentsTable(), TreatmentsTableProps, TreatmentWithInventory

### Community 78 - "use-login.ts"
Cohesion: 0.44
Nodes (8): useRegisterEmployee(), RegisterEmployeePageClient(), InviteTeamPageClient(), getRegisterCopy(), useAuth(), usePostAuthRedirect(), useOnboardingIntentStore, usePendingInviteStore

### Community 79 - "app-searchable-multi-select.tsx"
Cohesion: 0.33
Nodes (4): AppSearchableMultiSelectOption, AppSearchableMultiSelectProps, AppSearchableMultiSelectOption(), AppSearchableMultiSelectOptionProps

### Community 81 - "invite-team-page-client.tsx"
Cohesion: 0.23
Nodes (6): CreateClinicPageClient(), captureEvent(), waitForAuthSessionReady(), normalizeInviteEmails(), validateInviteEmails(), useClinicStore

### Community 82 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 83 - "Patient"
Cohesion: 0.31
Nodes (6): MobileCardViewItem(), MobileCardViewItemProps, MobileCardAction, MobileCardColumn, MobileCardView(), MobileCardViewProps

### Community 89 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 130 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, husky, lint-staged, prettier, tailwindcss, @tailwindcss/postcss (+4 more)

## Knowledge Gaps
- **406 isolated node(s):** `Props`, `geistSans`, `geistMono`, `metadata`, `viewport` (+401 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `format.ts`, `calendar-grid.ts`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `@schedule-x/calendar` connect `calendar-grid.ts` to `dependencies`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `cn()` connect `appointments-store.ts` to `owner-clinic-form.ts`, `cn`, `invite-page-client.tsx`, `app-bottom-nav-more-sheet.tsx`, `employee-detail-page-client.tsx`, `use-inventory-item-create-dialog.ts`, `appointments-page-client.tsx`, `use-employee-invite-dialog.ts`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **What connects `Props`, `geistSans`, `geistMono` to the rest of the system?**
  _406 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `appointments-store.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11025641025641025 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.10461538461538461 - nodes in this community are weakly interconnected._