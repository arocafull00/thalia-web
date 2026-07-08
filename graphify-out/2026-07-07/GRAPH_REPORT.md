# Graph Report - thalia-web  (2026-07-07)

## Corpus Check
- 375 files · ~93,942 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1402 nodes · 3528 edges · 80 communities (64 shown, 16 thin omitted)
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
- [[_COMMUNITY_use-search.ts|use-search.ts]]
- [[_COMMUNITY_schema-helpers.ts|schema-helpers.ts]]
- [[_COMMUNITY_use-post-auth-redirect.ts|use-post-auth-redirect.ts]]
- [[_COMMUNITY_profile-timeline.tsx|profile-timeline.tsx]]
- [[_COMMUNITY_dependencies|dependencies]]
- [[_COMMUNITY_use-register-type.ts|use-register-type.ts]]
- [[_COMMUNITY_use-settings-page.ts|use-settings-page.ts]]
- [[_COMMUNITY_Employee|Employee]]
- [[_COMMUNITY_profile-timeline.tsx|profile-timeline.tsx]]
- [[_COMMUNITY_use-settings-page.ts|use-settings-page.ts]]
- [[_COMMUNITY_use-appointment-materials-override-dialog.ts|use-appointment-materials-override-dialog.ts]]
- [[_COMMUNITY_use-settings-page.ts|use-settings-page.ts]]
- [[_COMMUNITY_finances-category-breakdown.tsx|finances-category-breakdown.tsx]]
- [[_COMMUNITY_auth-store.ts|auth-store.ts]]
- [[_COMMUNITY_use-appointment-create-dialog.ts|use-appointment-create-dialog.ts]]
- [[_COMMUNITY_patient-create-form.tsx|patient-create-form.tsx]]
- [[_COMMUNITY_app-date-field.tsx|app-date-field.tsx]]
- [[_COMMUNITY_auth-provider.tsx|auth-provider.tsx]]
- [[_COMMUNITY_app-searchable-multi-select.tsx|app-searchable-multi-select.tsx]]
- [[_COMMUNITY_components.json|components.json]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
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
- `AppointmentMaterialsOverrideForm()` --calls--> `useInventoryItems()`  [EXTRACTED]
  src/components/appointments/components/appointment-materials-override-form.tsx → src/lib/hooks/use-inventory.ts
- `RegisterPageClient()` --calls--> `useRegisterType()`  [EXTRACTED]
  src/components/auth/register/page.client.tsx → src/lib/hooks/use-register-type.ts
- `AppSearchableComboboxItem()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/app-searchable-combobox-item.tsx → src/lib/utils.ts

## Import Cycles
- 3-file cycle: `src/lib/active-clinic-id.ts -> src/stores/auth-store.ts -> src/stores/employees-store.ts -> src/lib/active-clinic-id.ts`

## Communities (80 total, 16 thin omitted)

### Community 0 - "useAuth"
Cohesion: 0.20
Nodes (12): FinancesMonthSelector(), FINANCES_FILTER_DEFAULTS, FinancesPageClient(), FinancesTabBar(), FinancesTabBarProps, FinancesTabValue, FinancesPageFilters, transactionTypeForTab() (+4 more)

### Community 1 - "appointments-store.ts"
Cohesion: 0.11
Nodes (33): Separator(), Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction() (+25 more)

### Community 2 - "use-schedule-x-calendar.ts"
Cohesion: 0.05
Nodes (54): @schedule-x/calendar, AppointmentCreateDialog(), AppointmentCreateDialogProps, AppointmentCreateFormProps, NewAppointmentDatetimeField(), NewAppointmentDatetimeFieldProps, CalendarPageClient(), CalendarEmptyHeader() (+46 more)

### Community 3 - "format.ts"
Cohesion: 0.20
Nodes (9): clinicMembershipInvitationRoleSchema, employeeFieldsSchema, employeeInviteSchema, EmployeeInviteSchemaInput, employeeRoleSchema, employeeSchema, EmployeeSchemaInput, employeeUpdateSchema (+1 more)

### Community 4 - "cn"
Cohesion: 0.11
Nodes (18): AppSearchableCombobox(), AppSearchableComboboxOption, AppSearchableComboboxProps, AppSearchableComboboxItem(), AppSearchableComboboxItemProps, ComboboxChip(), ComboboxChips(), ComboboxChipsInput() (+10 more)

### Community 5 - "login-form-panel.tsx"
Cohesion: 0.07
Nodes (38): AppointmentDetailPageClient(), AppointmentDetailPageClientProps, resolveTotalDurationMinutes(), AppointmentDetailCardProps, AppointmentDetailSidebar(), AppointmentDetailSidebarProps, reminderLabel(), AppointmentHeaderProps (+30 more)

### Community 7 - "patients-page-client.tsx"
Cohesion: 0.16
Nodes (23): EmployeeAppointmentRow(), EmployeeAppointmentRowProps, EmployeeTimeline(), EmployeeTimelineProps, mapAppointmentsToTimelineItems(), PatientAppointmentRow(), PatientAppointmentRowProps, mapAppointmentsToTimelineItems() (+15 more)

### Community 8 - "employee-detail-page-client.tsx"
Cohesion: 0.06
Nodes (39): EmployeeDetailActionsMenu(), EmployeeDetailActionsMenuProps, EmployeeProfileSidebar(), EmployeeProfileSidebarProps, EmployeeProfileSummary(), EmployeeProfileSummaryProps, EmployeeQuickActions(), EmployeeQuickActionsProps (+31 more)

### Community 9 - "employee-edit-dialog.tsx"
Cohesion: 0.06
Nodes (64): DashboardPageClient(), formatTodayTitle(), InventoryDetailPageClient(), PatientDetailPageClient(), PatientDetailPageClientProps, TreatmentInventoryLinksField(), TreatmentCatalogFilters, useTreatmentCatalog() (+56 more)

### Community 10 - "appointments-page-client.tsx"
Cohesion: 0.11
Nodes (18): EmployeeInviteFormProps, roleOptions, EmployeeFilters, EmployeesFiltersSheet(), EmployeesFiltersSheetProps, roleOptions, statusOptions, EMPLOYEE_FILTER_DEFAULTS (+10 more)

### Community 11 - "employees-page-client.tsx"
Cohesion: 0.14
Nodes (9): LoginAuthTabs(), LoginAuthTabsProps, LoginFormFieldsProps, LoginFormPanelProps, LoginHeroIllustration(), loginIllustrationSvg, HERO_INDICATORS, LoginPageClient() (+1 more)

### Community 12 - "layout.tsx"
Cohesion: 0.11
Nodes (18): geistMono, geistSans, metadata, viewport, AuthProvider(), PwaInstallProvider(), PwaInstallProviderProps, ServiceWorkerProvider() (+10 more)

### Community 13 - "action-button.tsx"
Cohesion: 0.16
Nodes (11): Props, Props, RegisterEmployeeFormCopy, RegisterEmployeeFormProps, EMPLOYEE_ROLE_OPTIONS, InvitePageClient(), MEMBERSHIP_ROLE_LABELS, Props (+3 more)

### Community 14 - "transactions-columns.tsx"
Cohesion: 0.25
Nodes (9): EmployeeEditDialog(), EmployeeEditDialogProps, EmployeeEditFormProps, roleOptions, EMPLOYEE_EDIT_COPY, employeeEditFormSchema, EmployeeEditFormValues, toFormValues() (+1 more)

### Community 15 - "owner-clinic-form.ts"
Cohesion: 0.18
Nodes (12): AppointmentHeader(), DashboardAppointmentRow(), DashboardAppointmentRowProps, formatAppointmentDay(), formatAppointmentDuration(), formatAppointmentMonth(), formatBirthDateWithAge(), formatInputDate() (+4 more)

### Community 16 - "proxy.ts"
Cohesion: 0.27
Nodes (7): config, proxy(), publicRoutes, pwaRoutes, SessionUpdateResult, updateSession(), withSessionCookies()

### Community 28 - "appointment-create-dialog.tsx"
Cohesion: 0.38
Nodes (4): PatientInfoSectionProps, ProfileInfoRow(), ProfileInfoRowProps, PATIENT_DETAIL_COPY

### Community 36 - "patients-page-client.tsx"
Cohesion: 0.26
Nodes (9): InventoryItemCreateForm(), InventoryItemCreateFormProps, INVENTORY_ITEM_CREATE_COPY, useClinicId(), defaultValues, inventoryFormSchema, InventoryFormValues, useInventoryItemCreateDialog() (+1 more)

### Community 37 - "action-button.tsx"
Cohesion: 0.09
Nodes (21): AppointmentDetailTreatmentItem(), AppointmentDetailTreatmentItemProps, AppointmentTreatmentsSection(), CategoryBreakdownItem, FinancesCategoryBreakdownProps, FinancesCategoryRow(), FinancesCategoryRowProps, FinancesFilters (+13 more)

### Community 38 - "inventory-page-client.tsx"
Cohesion: 0.29
Nodes (7): TransactionCreateFormProps, TRANSACTION_CREATE_COPY, useCreateTransaction(), createDefaultValues(), transactionFormSchema, TransactionFormValues, useTransactionCreateDialog()

### Community 39 - "app-bottom-nav-more-sheet.tsx"
Cohesion: 0.13
Nodes (17): AppBottomNav(), AppBottomNavItem(), AppBottomNavItemProps, AppBottomNavMoreSheet(), AppBottomNavMoreSheetProps, AppShell(), AppShellProps, AppSidebar() (+9 more)

### Community 40 - "transactions-columns.tsx"
Cohesion: 0.06
Nodes (42): EmployeeProfileHeader(), EmployeeProfileHeaderProps, getAvatarStyle(), PatientProfileHeader(), PatientProfileHeaderProps, SettingsAccountPanel(), SettingsAccountPanelProps, SettingsActionRow() (+34 more)

### Community 41 - "use-inventory-item-create-dialog.ts"
Cohesion: 0.16
Nodes (8): FiltersSheetProps, Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 42 - "patient-edit-dialog.tsx"
Cohesion: 0.20
Nodes (8): InventoryFilters, InventoryFiltersSheet(), InventoryFiltersSheetProps, stockOptions, INVENTORY_FILTER_DEFAULTS, stockOptions, PageHeader(), INVENTORY_COPY

### Community 43 - "patient-detail-page-client.tsx"
Cohesion: 0.13
Nodes (17): PatientEditDialog(), PatientEditDialogProps, AppConfirmDialogProps, AppDialog(), AppDialogProps, AppDialogDescription(), AppDialogDescriptionProps, AppDialogFooter() (+9 more)

### Community 44 - "inventory-columns.tsx"
Cohesion: 0.15
Nodes (13): RegisterEmployeeSidebar(), RegisterEmployeeSidebarProps, getRegisterCopy(), getSidebarCopy(), REGISTER_COPY, REGISTER_EMPLOYEE_FORM_COPY, REGISTER_EMPLOYEE_SIDEBAR_COPY, RegisterCopy (+5 more)

### Community 45 - "use-inventory.ts"
Cohesion: 0.19
Nodes (9): AppLayoutClient(), AppLayoutClientProps, SidebarClinicSwitcherProps, SidebarProfileFooter(), SIDEBAR_COPY, clinicMembershipRoleLabel(), useActiveClinic(), ClinicMembershipView (+1 more)

### Community 47 - "calendar-empty-header.tsx"
Cohesion: 0.22
Nodes (9): scripts, build, dev, dev:https, lint, lint:staged, prepare, start (+1 more)

### Community 48 - "dashboard-appointment-row.tsx"
Cohesion: 0.11
Nodes (21): InventoryItemAdjustStockDialog(), InventoryItemAdjustStockDialogProps, formatMovementQuantity(), inventoryMovementDotClass(), InventoryMovementRow(), InventoryMovementRowProps, inventoryMovementToneClass(), inventoryMovementTypeLabel() (+13 more)

### Community 49 - "app-dialog-header.tsx"
Cohesion: 0.15
Nodes (14): appointmentFieldsSchema, appointmentSchema, AppointmentSchemaInput, appointmentUpdateSchema, AppointmentUpdateSchemaInput, inventoryFieldsSchema, inventorySchema, InventorySchemaInput (+6 more)

### Community 50 - "patient-timeline.tsx"
Cohesion: 0.16
Nodes (14): EmployeesPageClient(), InventoryPageClient(), PatientFilters, PatientsFiltersSheet(), PatientsFiltersSheetProps, statusOptions, PATIENT_FILTER_DEFAULTS, PatientsPageClient() (+6 more)

### Community 51 - "format.ts"
Cohesion: 0.33
Nodes (5): lint-staged, *.{ts,tsx}, name, private, version

### Community 52 - "useAuth"
Cohesion: 0.28
Nodes (11): useLogin(), useRegisterEmployee(), RegisterEmployeePageClient(), CreateClinicPageClient(), InviteTeamPageClient(), useAcceptInvitation(), useAuth(), usePostAuthRedirect() (+3 more)

### Community 53 - "use-search.ts"
Cohesion: 0.20
Nodes (10): AppSearchBar(), AppSearchBarInput(), AppSearchBarInputProps, getSearchPlaceholder(), SEARCH_COPY, SEARCHABLE_ROUTES, useDebouncedValue(), CategorizedItem (+2 more)

### Community 54 - "schema-helpers.ts"
Cohesion: 0.22
Nodes (10): defaultValues, patientFormSchema, patientFieldsSchema, patientSchema, PatientSchemaInput, patientUpdateSchema, PatientUpdateSchemaInput, nullableDateString() (+2 more)

### Community 55 - "use-post-auth-redirect.ts"
Cohesion: 0.24
Nodes (8): resolveUnauthenticatedRoute(), createWebPersistStorage(), webStorage, ClinicStore, OnboardingStore, useOnboardingHydrated(), useOnboardingStore, PendingInviteStore

### Community 56 - "profile-timeline.tsx"
Cohesion: 0.06
Nodes (47): TreatmentCategoryFilter(), TreatmentCategoryFilterProps, TreatmentColorFieldProps, TreatmentDeleteConfirmDialog(), TreatmentDeleteConfirmDialogProps, TreatmentDialog(), TreatmentDialogProps, TreatmentForm() (+39 more)

### Community 57 - "dependencies"
Cohesion: 0.06
Nodes (32): dependencies, @base-ui/react, class-variance-authority, clsx, date-fns, @hookform/resolvers, lucide-react, match-sorter (+24 more)

### Community 58 - "use-register-type.ts"
Cohesion: 0.23
Nodes (6): RegisterEmployeeEmail(), Props, RegisterTypePicker(), RegisterPageClient(), REGISTER_COPY, RegisterStep

### Community 59 - "use-settings-page.ts"
Cohesion: 0.11
Nodes (29): APPOINTMENT_FILTER_DEFAULTS, AppointmentsPageClient(), AppointmentDateRange(), AppointmentDateRangeProps, formatAppointmentDateParam(), getDefaultAppointmentDateRange(), parseAppointmentDateParam(), AppointmentEmployeeFilter() (+21 more)

### Community 60 - "Employee"
Cohesion: 0.16
Nodes (15): inventoryColumns, InventoryItemSidebar(), InventoryItemSidebarProps, inventoryStockLevelToneClass(), InventoryTable(), InventoryTableProps, InventoryPageFilters, resolveStockLevel() (+7 more)

### Community 61 - "profile-timeline.tsx"
Cohesion: 0.27
Nodes (5): AppDialogClose(), AppDialogCloseProps, AppDialogContentProps, AppSheetContentProps, APP_DIALOG_COPY

### Community 62 - "use-settings-page.ts"
Cohesion: 0.19
Nodes (8): allStatuses, AppointmentStatusSelectProps, statusColors, buildAppointmentsColumns(), AppointmentsTable(), AppointmentsTableProps, appointmentsMobileColumns, AppointmentStatus

### Community 63 - "use-appointment-materials-override-dialog.ts"
Cohesion: 0.08
Nodes (31): employeesColumns, EmployeesTable(), EmployeesTableProps, FinancesMovementsSectionProps, transactionsColumns, TransactionsTable(), TransactionsTableProps, patientsColumns (+23 more)

### Community 64 - "use-settings-page.ts"
Cohesion: 0.31
Nodes (7): SettingsPageClient(), normalizeEmail(), PendingClinicRequest, useUploadProfileAvatar(), usePendingClinicRequests(), UsePendingClinicRequestsResult, useSettingsPageActions()

### Community 65 - "finances-category-breakdown.tsx"
Cohesion: 0.38
Nodes (8): externalMemberships(), needsClinicSelector(), PostAuthRouteInput, PostAuthRouteResult, resolvePostAuthRoute(), hasPendingTeamInvites(), hasRegistrationProfile(), isOwnerRegistration()

### Community 66 - "auth-store.ts"
Cohesion: 0.17
Nodes (13): captureEvent(), signInWithGoogleFlow(), waitForAuthSessionReady(), InvitationState, useUpdateProfile(), normalizeInviteEmails(), validateInviteEmails(), navigateAfterAuth() (+5 more)

### Community 67 - "use-appointment-create-dialog.ts"
Cohesion: 0.18
Nodes (12): Button(), buttonVariants, InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput() (+4 more)

### Community 68 - "patient-create-form.tsx"
Cohesion: 0.28
Nodes (5): PatientCreateFormProps, NewPatientDateField(), NewPatientDateFieldProps, PATIENT_CREATE_COPY, PatientFormValues

### Community 69 - "app-date-field.tsx"
Cohesion: 0.13
Nodes (14): employeeColors, employeeRoles, mapOperationalRoleToEmployeeRole(), OperationalRoleOption, operationalRoleOptions, buildCreateClinicPayload(), buildCreateClinicPayloadFromProfile(), CreateClinicPayload (+6 more)

### Community 70 - "auth-provider.tsx"
Cohesion: 0.53
Nodes (5): AuthProviderProps, getClientHydratedSnapshot(), getServerHydratedSnapshot(), subscribeToClientHydration(), useAuthHydrated()

### Community 79 - "app-searchable-multi-select.tsx"
Cohesion: 0.28
Nodes (5): AppSearchableMultiSelectOption, AppSearchableMultiSelectProps, AppSearchableMultiSelectOption(), AppSearchableMultiSelectOptionProps, COMBOBOX_COPY

### Community 82 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 89 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 130 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, husky, lint-staged, prettier, tailwindcss, @tailwindcss/postcss (+4 more)

## Knowledge Gaps
- **386 isolated node(s):** `Props`, `geistSans`, `geistMono`, `metadata`, `viewport` (+381 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `use-schedule-x-calendar.ts`, `format.ts`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `@schedule-x/calendar` connect `use-schedule-x-calendar.ts` to `dependencies`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Why does `cn()` connect `appointments-store.ts` to `use-appointment-create-dialog.ts`, `cn`, `app-bottom-nav-more-sheet.tsx`, `use-inventory-item-create-dialog.ts`, `profile-timeline.tsx`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **What connects `Props`, `geistSans`, `geistMono` to the rest of the system?**
  _386 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `appointments-store.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11025641025641025 - nodes in this community are weakly interconnected._
- **Should `use-schedule-x-calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.050957481337228175 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.11231884057971014 - nodes in this community are weakly interconnected._