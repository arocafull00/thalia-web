# Graph Report - thalia-web  (2026-07-04)

## Corpus Check
- 329 files · ~78,963 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1237 nodes · 3056 edges · 80 communities (65 shown, 15 thin omitted)
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
8. `Employee` - 17 edges
9. `useFileUrl()` - 16 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `proxy()` --calls--> `updateSession()`  [EXTRACTED]
  proxy.ts → src/lib/supabase/proxy.ts
- `proxy()` --calls--> `withSessionCookies()`  [EXTRACTED]
  proxy.ts → src/lib/supabase/proxy.ts
- `InputGroupText()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/input-group.tsx → src/lib/utils.ts
- `InputGroupTextarea()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/input-group.tsx → src/lib/utils.ts
- `SheetOverlay()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/sheet.tsx → src/lib/utils.ts

## Import Cycles
- 3-file cycle: `src/lib/active-clinic-id.ts -> src/stores/auth-store.ts -> src/stores/employees-store.ts -> src/lib/active-clinic-id.ts`

## Communities (80 total, 15 thin omitted)

### Community 0 - "useAuth"
Cohesion: 0.20
Nodes (10): InventoryItemCreateForm(), InventoryItemCreateFormProps, INVENTORY_ITEM_CREATE_COPY, defaultValues, inventoryFormSchema, InventoryFormValues, inventoryFieldsSchema, inventorySchema (+2 more)

### Community 1 - "appointments-store.ts"
Cohesion: 0.09
Nodes (30): AppShellProps, AppSidebar(), Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup() (+22 more)

### Community 2 - "use-schedule-x-calendar.ts"
Cohesion: 0.07
Nodes (40): CalendarEmployeeFilter(), CalendarPageClient(), CalendarEmptyHeader(), CalendarToolbar(), CalendarToolbarProps, CalendarToolbarMobileMenu(), CalendarToolbarMobileMenuProps, useCalendarPage() (+32 more)

### Community 3 - "format.ts"
Cohesion: 0.06
Nodes (47): AppointmentCreateDialog(), AppointmentCreateFormProps, NewAppointmentDatetimeField(), NewAppointmentDatetimeFieldProps, EmployeeInviteFormProps, roleOptions, EmployeeStatusConfirmDialog(), EmployeeStatusConfirmDialogProps (+39 more)

### Community 4 - "cn"
Cohesion: 0.15
Nodes (21): AppSearchableCombobox(), AppSearchableComboboxOption, AppSearchableComboboxProps, AppSearchableComboboxItem(), AppSearchableComboboxItemProps, ComboboxChip(), ComboboxChips(), ComboboxChipsInput() (+13 more)

### Community 5 - "login-form-panel.tsx"
Cohesion: 0.20
Nodes (19): AppointmentCreateDialogProps, AppointmentMaterialsOverrideDialogProps, EmployeeEditDialogProps, PatientEditDialogProps, TreatmentDialogProps, AppConfirmDialogProps, AppDialog(), AppDialogProps (+11 more)

### Community 7 - "patients-page-client.tsx"
Cohesion: 0.21
Nodes (17): EmployeeAppointmentRow(), EmployeeAppointmentRowProps, EmployeeTimeline(), EmployeeTimelineProps, mapAppointmentsToTimelineItems(), PatientAppointmentRow(), PatientAppointmentRowProps, mapAppointmentsToTimelineItems() (+9 more)

### Community 8 - "employee-detail-page-client.tsx"
Cohesion: 0.18
Nodes (12): useLogin(), CreateClinicPageClient(), InviteTeamPageClient(), captureEvent(), signInWithGoogleFlow(), waitForAuthSessionReady(), useAuth(), usePostAuthRedirect() (+4 more)

### Community 9 - "employee-edit-dialog.tsx"
Cohesion: 0.06
Nodes (55): AppointmentMaterialsOverrideForm(), FinancesMonthSelector(), FinancesPageClient(), FinancesTabBar(), FinancesTabBarProps, FinancesTabValue, TreatmentInventoryLinksField(), getActiveClinicId() (+47 more)

### Community 10 - "appointments-page-client.tsx"
Cohesion: 0.18
Nodes (9): AppLayoutClient(), AppLayoutClientProps, AppShell(), SidebarClinicSwitcherProps, SidebarProfileFooter(), SIDEBAR_COPY, clinicMembershipRoleLabel(), useActiveClinic() (+1 more)

### Community 11 - "employees-page-client.tsx"
Cohesion: 0.15
Nodes (17): RegisterEmployeeFormCopy, RegisterEmployeeFormProps, RegisterEmployeeSidebar(), RegisterEmployeeSidebarProps, useRegisterEmployee(), RegisterEmployeePageClient(), getRegisterCopy(), getSidebarCopy() (+9 more)

### Community 12 - "layout.tsx"
Cohesion: 0.11
Nodes (18): geistMono, geistSans, metadata, viewport, AuthProvider(), PwaInstallProvider(), PwaInstallProviderProps, ServiceWorkerProvider() (+10 more)

### Community 13 - "action-button.tsx"
Cohesion: 0.15
Nodes (10): LoginAuthTabs(), LoginAuthTabsProps, LoginFormFieldsProps, LoginFormPanel(), LoginFormPanelProps, LoginHeroIllustration(), loginIllustrationSvg, HERO_INDICATORS (+2 more)

### Community 14 - "transactions-columns.tsx"
Cohesion: 0.16
Nodes (12): employeeColors, employeeRoles, mapOperationalRoleToEmployeeRole(), OperationalRoleOption, operationalRoleOptions, buildCreateClinicPayload(), buildCreateClinicPayloadFromProfile(), CreateClinicPayload (+4 more)

### Community 15 - "owner-clinic-form.ts"
Cohesion: 0.20
Nodes (11): DashboardAppointmentRow(), DashboardAppointmentRowProps, formatAppointmentDay(), formatAppointmentDuration(), formatAppointmentMonth(), formatBirthDateWithAge(), formatInputDate(), formatInputDateTime() (+3 more)

### Community 16 - "proxy.ts"
Cohesion: 0.27
Nodes (7): config, proxy(), publicRoutes, pwaRoutes, SessionUpdateResult, updateSession(), withSessionCookies()

### Community 28 - "appointment-create-dialog.tsx"
Cohesion: 0.16
Nodes (11): SettingsProfileHeader(), SettingsProfileHeaderProps, SettingsProfileQuickActions(), SettingsProfileSidebar(), SettingsProfileSidebarProps, SettingsProfileSummary(), SettingsProfileSummaryProps, SettingsStatItem() (+3 more)

### Community 36 - "patients-page-client.tsx"
Cohesion: 0.15
Nodes (20): EmployeeProfileHeader(), EmployeeProfileHeaderProps, getAvatarStyle(), PatientProfileHeader(), PatientProfileHeaderProps, getAvatarStyle(), getProfileInitials(), ProfileContactItem (+12 more)

### Community 37 - "action-button.tsx"
Cohesion: 0.15
Nodes (11): appointmentsColumns, AppointmentsTable(), AppointmentsTableProps, employeesColumns, EmployeesTable(), EmployeesTableProps, DataTable(), SortableTableHead() (+3 more)

### Community 38 - "inventory-page-client.tsx"
Cohesion: 0.25
Nodes (8): InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupText(), InputGroupTextarea(), Input(), Textarea()

### Community 39 - "app-bottom-nav-more-sheet.tsx"
Cohesion: 0.18
Nodes (12): AppBottomNav(), AppBottomNavItem(), AppBottomNavItemProps, AppBottomNavMoreSheet(), AppBottomNavMoreSheetProps, BOTTOM_NAV_COPY, AppNavItem, BASE_NAV_ITEMS (+4 more)

### Community 40 - "transactions-columns.tsx"
Cohesion: 0.15
Nodes (13): PatientCreateFormProps, PatientEditDialog(), NewPatientDateField(), NewPatientDateFieldProps, PATIENT_CREATE_COPY, PATIENT_EDIT_COPY, defaultValues, patientFormSchema (+5 more)

### Community 41 - "use-inventory-item-create-dialog.ts"
Cohesion: 0.16
Nodes (8): Button(), buttonVariants, SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 42 - "patient-edit-dialog.tsx"
Cohesion: 0.20
Nodes (7): EmployeesPageClient(), roles, PatientsPageClient(), useDebouncedValue(), usePatientCreateDialog(), EmployeesUiStore, useEmployeesUiStore

### Community 43 - "patient-detail-page-client.tsx"
Cohesion: 0.22
Nodes (11): AppointmentDetailSidebar(), AppointmentDetailSidebarProps, reminderLabel(), AppointmentHeader(), AppointmentHeaderProps, AppointmentStatusBadge(), AppointmentStatusBadgeProps, statusStyles (+3 more)

### Community 44 - "inventory-columns.tsx"
Cohesion: 0.16
Nodes (14): transactionsColumns, TransactionsTable(), TransactionsTableProps, inventoryColumns, InventoryTable(), InventoryTableProps, transactionTypeLabel(), getInventoryStockLevel() (+6 more)

### Community 45 - "use-inventory.ts"
Cohesion: 0.23
Nodes (9): resolveUnauthenticatedRoute(), createWebPersistStorage(), webStorage, ClinicStore, OnboardingStore, useOnboardingHydrated(), useOnboardingStore, PendingInviteStore (+1 more)

### Community 46 - "transactions-table.tsx"
Cohesion: 0.26
Nodes (6): TreatmentCategoryFilter(), TreatmentCategoryFilterProps, useTreatmentCatalog(), useTreatmentsPage(), TreatmentsPageClient(), useTreatments()

### Community 47 - "calendar-empty-header.tsx"
Cohesion: 0.22
Nodes (9): scripts, build, dev, dev:https, lint, lint:staged, prepare, start (+1 more)

### Community 48 - "dashboard-appointment-row.tsx"
Cohesion: 0.06
Nodes (35): AppointmentDetailCardProps, AppointmentDetailTreatmentItem(), AppointmentDetailTreatmentItemProps, AppointmentMaterialsOverrideDialog(), AppointmentMaterialsOverrideFormProps, AppointmentMaterialsSection(), AppointmentMaterialsSectionProps, toDialogInitialItems() (+27 more)

### Community 49 - "app-dialog-header.tsx"
Cohesion: 0.10
Nodes (26): appointmentFieldsSchema, appointmentSchema, AppointmentSchemaInput, appointmentUpdateSchema, AppointmentUpdateSchemaInput, clinicMembershipInvitationRoleSchema, employeeFieldsSchema, EmployeeInviteSchemaInput (+18 more)

### Community 50 - "patient-timeline.tsx"
Cohesion: 0.24
Nodes (8): EmployeeEditDialog(), EmployeeEditFormProps, roleOptions, EMPLOYEE_EDIT_COPY, employeeEditFormSchema, EmployeeEditFormValues, toFormValues(), useEmployeeEditDialog()

### Community 51 - "format.ts"
Cohesion: 0.33
Nodes (5): lint-staged, *.{ts,tsx}, name, private, version

### Community 52 - "format.ts"
Cohesion: 0.27
Nodes (5): AppDialogClose(), AppDialogCloseProps, AppDialogContentProps, AppSheetContentProps, APP_DIALOG_COPY

### Community 53 - "appointment-create-form.tsx"
Cohesion: 0.08
Nodes (26): PatientInfoSection(), PatientInfoSectionProps, PatientProfileSidebar(), PatientProfileSidebarProps, PatientQuickActions(), PatientQuickActionsProps, patientsColumns, PatientsTable() (+18 more)

### Community 54 - "use-pending-clinic-requests.ts"
Cohesion: 0.15
Nodes (10): AppointmentDetailPageClient(), AppointmentDetailPageClientProps, resolveTotalDurationMinutes(), DashboardPageClient(), formatTodayTitle(), FinancesMovementsSectionProps, Notice(), NoticeProps (+2 more)

### Community 55 - "use-patient-edit-dialog.ts"
Cohesion: 0.27
Nodes (8): TransactionCreateFormProps, TRANSACTION_CREATE_COPY, useClinicId(), useCreateTransaction(), createDefaultValues(), transactionFormSchema, TransactionFormValues, useTransactionCreateDialog()

### Community 56 - "profile-timeline.tsx"
Cohesion: 0.06
Nodes (47): TreatmentColorFieldProps, TreatmentDeleteConfirmDialog(), TreatmentDeleteConfirmDialogProps, TreatmentDialog(), TreatmentForm(), TreatmentFormProps, InventoryOption, TreatmentInventoryLinkRowProps (+39 more)

### Community 57 - "dependencies"
Cohesion: 0.06
Nodes (33): dependencies, @base-ui/react, class-variance-authority, clsx, date-fns, @hookform/resolvers, lucide-react, match-sorter (+25 more)

### Community 58 - "AppointmentWithRelations"
Cohesion: 0.33
Nodes (9): externalMemberships(), needsClinicSelector(), PostAuthRouteInput, PostAuthRouteResult, resolvePostAuthRoute(), buildOwnerProfileMetadata(), hasPendingTeamInvites(), hasRegistrationProfile() (+1 more)

### Community 59 - "use-settings-page.ts"
Cohesion: 0.31
Nodes (7): groupItemsByMonth(), dotClassNames, ProfileTimelineItem, ProfileTimelineItemRow(), ProfileTimelineItemRowProps, ProfileTimeline(), ProfileTimelineProps

### Community 60 - "Employee"
Cohesion: 0.28
Nodes (5): CategoryBreakdownItem, FinancesCategoryBreakdownProps, FinancesCategoryRow(), FinancesCategoryRowProps, FINANCES_COPY

### Community 61 - "profile-timeline.tsx"
Cohesion: 0.20
Nodes (5): Separator(), Skeleton(), Tooltip(), TooltipContent(), TooltipTrigger()

### Community 62 - "use-settings-page.ts"
Cohesion: 0.25
Nodes (9): SettingsPageClient(), SettingsProfilePanel(), SettingsProfilePanelProps, useUploadProfileAvatar(), usePendingClinicRequests(), buildProfileSubtitle(), useSettingsPageActions(), SettingsUiStore (+1 more)

### Community 63 - "employee-profile-summary.tsx"
Cohesion: 0.20
Nodes (10): EmployeeProfileSidebar(), EmployeeProfileSidebarProps, EmployeeProfileSummary(), EmployeeProfileSummaryProps, EmployeeQuickActions(), EmployeeQuickActionsProps, EmployeeStatCard(), EmployeeStatCardProps (+2 more)

### Community 64 - "appointments-store.ts"
Cohesion: 0.28
Nodes (5): AppSearchableMultiSelectOption, AppSearchableMultiSelectProps, AppSearchableMultiSelectOption(), AppSearchableMultiSelectOptionProps, COMBOBOX_COPY

### Community 65 - "notice.tsx"
Cohesion: 0.21
Nodes (8): SettingsAccountPanel(), SettingsAccountPanelProps, SettingsActionRow(), SettingsActionRowProps, SettingsManagementLink(), SettingsManagementLinkProps, MANAGEMENT_LINKS, SETTINGS_COPY

### Community 66 - "auth-store.ts"
Cohesion: 0.22
Nodes (11): AuthProviderProps, getClientHydratedSnapshot(), getServerHydratedSnapshot(), subscribeToClientHydration(), useAuthHydrated(), useUpdateProfile(), assertSupabaseConfigured(), supabase (+3 more)

### Community 67 - "use-appointment-create-dialog.ts"
Cohesion: 0.60
Nodes (3): normalizeEmail(), PendingClinicRequest, UsePendingClinicRequestsResult

### Community 68 - "appointments-page-client.tsx"
Cohesion: 0.23
Nodes (6): AppointmentsPageClient(), InventoryPageClient(), PageHeader(), useInventoryItemCreateDialog(), TopbarSearchState, useTopbarSearchStore

### Community 82 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 89 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 102 - "app-date-field.tsx"
Cohesion: 0.35
Nodes (9): AppDateField(), AppDateFieldProps, AppDatePopoverField(), AppDatePopoverFieldProps, formatLocalDateInputValue(), formatLocalDatetimeInputValue(), pad(), parseLocalDateInputValue() (+1 more)

### Community 130 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, eslint-config-next, husky, lint-staged, prettier, tailwindcss, @tailwindcss/postcss (+4 more)

## Knowledge Gaps
- **326 isolated node(s):** `geistSans`, `geistMono`, `metadata`, `viewport`, `$schema` (+321 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `format.ts`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `@schedule-x/calendar` connect `dependencies` to `use-schedule-x-calendar.ts`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `appointments-store.ts`, `inventory-page-client.tsx`, `use-inventory-item-create-dialog.ts`, `profile-timeline.tsx`, `profile-timeline.tsx`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **What connects `geistSans`, `geistMono`, `metadata` to the rest of the system?**
  _326 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `appointments-store.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `use-schedule-x-calendar.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06775956284153005 - nodes in this community are weakly interconnected._
- **Should `format.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._