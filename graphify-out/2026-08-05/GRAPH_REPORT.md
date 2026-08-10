# Graph Report - thalia-web  (2026-08-05)

## Corpus Check
- 791 files · ~320,158 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3182 nodes · 9236 edges · 210 communities (148 shown, 62 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 37 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `38568d1e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- database.types.ts
- use-treatment.ts
- Employee
- cn
- patient-detail-page-client.tsx
- calendar-grid.ts
- app-layout-client.tsx
- AppointmentWithRelations
- formatCurrency
- campaign-create-form.tsx
- sidebar.tsx
- sidebar-profile-footer.tsx
- app/layout.tsx
- appointment-materials-override-dialog.tsx
- employees-store.ts
- employee-detail-page-client.tsx
- reset-password/page.client.tsx
- app-date-picker-popover.tsx
- app-dialog-trigger.tsx
- migration-map.ts
- index.ts
- index.ts
- index.ts
- appointments-store.ts
- index.ts
- index.ts
- dropzone.tsx
- index.ts
- appointments-columns.tsx
- clinic-hours-dialog.tsx
- schema-helpers.ts
- inventory-item-summary.tsx
- calendar-overlap-group-event.tsx
- use-appointment-create-dialog.ts
- patient-file-edit-dialog.tsx
- inventory-detail-page-client.tsx
- treatments-page-client.tsx
- patients-page-client.tsx
- patient-files-store.ts
- settings-copy.ts
- settings-profile-header.tsx
- scripts
- inventory-item-adjust-stock-dialog.tsx
- finances-store.ts
- use-files-page.ts
- package.json
- appointment-datetime.ts
- invite-page-client.tsx
- use-campaign-create-dialog.ts
- action-button.tsx
- owner-clinic-form.ts
- dependencies
- marketing-page-client.tsx
- patient-file-viewer.tsx
- patient-file-storage.ts
- before-after-comparison-slider.tsx
- button.tsx
- app-date-field.tsx
- clinic-edit-dialog.tsx
- filters-sheet.tsx
- settings-layout-client.tsx
- inventory-page-client.tsx
- patient-images-store.ts
- campaigns.dal.ts
- use-patient-image-uploader.ts
- use-topbar-actions.ts
- bootstrap.ts
- toggle-group.tsx
- data-table.tsx
- files-table.tsx
- files-filters-sheet.tsx
- app-topbar.tsx
- campaigns-filters-sheet.tsx
- profile-edit-dialog.tsx
- PATIENT_GALLERY_COPY
- EmployeeRole
- components.json
- notice.tsx
- patient-gallery-tab.tsx
- register-employee-copy.ts
- mocks.ts
- register
- useActiveClinic
- compilerOptions
- invite-team-page-client.tsx
- dropdown-menu.tsx
- finances-movements-section.tsx
- useClinicId
- useAuth
- employee-profile-header.tsx
- appointment-schema.ts
- use-treatment-images.ts
- employee-schema.ts
- finances-store.test.ts
- calendar-view-mode-toggle.tsx
- patient-image-viewer.tsx
- getServerActiveClinicId
- patient-edit-dialog.tsx
- use-patient-file-uploader.ts
- createClient
- inventory-filters-sheet.tsx
- loader-status-list.tsx
- use-appointments.ts
- unwrapSupabaseList
- employees-filters-sheet.tsx
- employee-invite-errors.ts
- finances-category-breakdown.tsx
- campaign-image-storage.ts
- treatment-detail-page-client.tsx
- settings-profile-summary.tsx
- app-searchable-multi-select.tsx
- format.ts
- clinic-store.ts
- useTreatments
- filter-field.tsx
- boot-loading-screen.tsx
- appointment-detail-page-client.tsx
- inventory-schema.ts
- settings-account-panel.tsx
- devDependencies
- github
- class-variance-authority
- app-dialog-close.tsx
- use-patient-images.ts
- eslint-config-next
- useFilterSearch
- employees-page-client.tsx
- clsx
- campaign-image-dialog.tsx
- whatsapp.ts
- stat.tsx
- cuelume
- date-fns
- table-mobile-columns.tsx
- date-fns-tz
- @hookform/resolvers
- husky
- jsdom
- @radix-ui/react-dialog
- lint-staged
- marketing-copy.ts
- appointment-person-avatar.tsx
- loader-spinner.tsx
- lucide-react
- use-settings-page.ts
- e2e-helpers.ts
- match-sorter
- @pdfslick/react
- @preact/signals
- use-employee-edit-dialog.ts
- preact
- @radix-ui/react-popover
- radix-ui
- @radix-ui/themes
- react-day-picker
- react-compare-slider
- use-schedule-x-calendar.ts
- react-hook-form
- react-dom
- finances-page-client.tsx
- react-dropzone
- shadcn
- react-toastify
- @supabase/ssr
- @schedule-x/events-service
- @schedule-x/react
- @tanstack/react-table
- @sentry/nextjs
- server-only
- tw-animate-css
- yet-another-react-lightbox
- @supabase/supabase-js
- tailwind-merge
- zod
- temporal-polyfill
- zustand
- supabase
- tailwindcss
- hyperframes.json
- @tailwindcss/postcss
- @testing-library/react
- @types/node
- @types/react
- typescript
- @vitest/coverage-v8
- calendar-page-client.tsx
- scripts
- capture-product.mjs
- supabase.ts
- skeleton.tsx
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `cn()` - 183 edges
2. `Button()` - 99 edges
3. `unwrapSupabaseList()` - 56 edges
4. `useActiveClinicTimezone()` - 50 edges
5. `AppointmentWithRelations` - 46 edges
6. `useAuth()` - 45 edges
7. `Employee` - 44 edges
8. `unwrapSupabase()` - 43 edges
9. `notifySuccess()` - 42 edges
10. `useClinicId()` - 41 edges

## Surprising Connections (you probably didn't know these)
- `OwnerAccountStep()` --calls--> `register()`  [INFERRED]
  src/components/auth/register/components/owner-account-step.tsx → instrumentation.ts
- `RegisterEmployeeForm()` --calls--> `register()`  [INFERRED]
  src/components/auth/register-employee/components/register-employee-form.tsx → instrumentation.ts
- `TransactionCreateForm()` --calls--> `register()`  [INFERRED]
  src/components/finances/components/transaction-create-form.tsx → instrumentation.ts
- `CreateClinicForm()` --calls--> `register()`  [INFERRED]
  src/components/onboarding/create-clinic/components/create-clinic-form.tsx → instrumentation.ts
- `PatientCreateForm()` --calls--> `register()`  [INFERRED]
  src/components/patients/components/form/patient-create-form.tsx → instrumentation.ts

## Import Cycles
- 3-file cycle: `src/lib/active-clinic-id.ts -> src/stores/auth-store.ts -> src/stores/employees-store.ts -> src/lib/active-clinic-id.ts`

## Communities (210 total, 62 thin omitted)

### Community 0 - "database.types.ts"
Cohesion: 0.09
Nodes (30): getInventoryItem(), getInventoryItems(), getInventoryMovements(), insertInventoryItem(), insertInventoryMovement(), InventoryItemInsert, InventoryMovementInsert, updateInventoryItem() (+22 more)

### Community 1 - "use-treatment.ts"
Cohesion: 0.20
Nodes (14): TreatmentDialog(), emptyValues, toFormValues(), useTreatmentDialog(), useTreatmentDetail(), useCreateTreatment(), useTreatment(), useUpdateTreatment() (+6 more)

### Community 2 - "Employee"
Cohesion: 0.14
Nodes (24): AppointmentsPageClient(), AppointmentsPageClientProps, AppointmentDateRange(), AppointmentDateRangeProps, formatAppointmentDateParam(), formatAppointmentDateRangeLabel(), getDefaultAppointmentDateRange(), parseAppointmentDateParam() (+16 more)

### Community 3 - "cn"
Cohesion: 0.06
Nodes (51): PasswordInputProps, AppSearchableCombobox(), AppSearchableComboboxOption, AppSearchableComboboxProps, AppSearchableComboboxItem(), AppSearchableComboboxItemProps, Avatar(), AvatarBadge() (+43 more)

### Community 4 - "patient-detail-page-client.tsx"
Cohesion: 0.05
Nodes (49): PATIENT_DETAIL_TAB_ITEMS, PatientDetailTabBar(), PatientDetailTabBarProps, PatientDetailTabContent(), PatientDetailTabContentProps, PatientInfoSection(), PatientInfoSectionProps, PatientCreateForm() (+41 more)

### Community 5 - "calendar-grid.ts"
Cohesion: 0.09
Nodes (35): CalendarDayDialog(), CalendarDayDialogProps, DayAgendaList(), DayAgendaListProps, MonthMiniCalendar(), MonthMiniCalendarProps, DashboardAgendaProps, DashboardHeader() (+27 more)

### Community 7 - "AppointmentWithRelations"
Cohesion: 0.18
Nodes (13): CalendarOverlapGroupRow(), CalendarOverlapGroupRowProps, PatientDetailStatsProps, PatientDetailStatsRow(), PatientStatCard(), PatientStatCardProps, PatientSummaryTab(), PatientSummaryTabProps (+5 more)

### Community 8 - "formatCurrency"
Cohesion: 0.15
Nodes (13): AppointmentDetailTreatmentItem(), AppointmentDetailTreatmentItemProps, FinancesWeeklyRow(), FinancesWeeklyRowProps, InventoryItemSidebar(), InventoryItemSidebarProps, inventoryStockLevelToneClass(), TreatmentDetailHeader() (+5 more)

### Community 9 - "campaign-create-form.tsx"
Cohesion: 0.15
Nodes (15): CampaignCreateForm(), CampaignCreateFormProps, CampaignMessageFields(), CampaignMessageFieldsProps, CampaignRecipientsPreview(), CampaignRecipientsPreviewProps, resolveMessage(), CampaignSegmentFields() (+7 more)

### Community 10 - "sidebar.tsx"
Cohesion: 0.05
Nodes (53): AppBottomNav(), AppBottomNavItem(), AppBottomNavItemProps, AppShell(), AppShellProps, AppSidebar(), AppSidebarNavItem(), AppSidebarNavItemProps (+45 more)

### Community 11 - "sidebar-profile-footer.tsx"
Cohesion: 0.17
Nodes (10): PatientAvatarFieldProps, ProfileAvatarImage(), ProfileAvatarImageProps, sizeClasses, sizeHints, SidebarClinicSwitcherProps, SidebarProfileFooter(), SidebarSignOutConfirmDialog() (+2 more)

### Community 12 - "app/layout.tsx"
Cohesion: 0.10
Nodes (21): geistMono, inter, metadata, outfit, viewport, AuthProvider(), PwaInstallProvider(), PwaInstallProviderProps (+13 more)

### Community 13 - "appointment-materials-override-dialog.tsx"
Cohesion: 0.08
Nodes (36): AppointmentDetailCard(), AppointmentDetailCardProps, AppointmentMaterialsOverrideDialog(), AppointmentMaterialsOverrideDialogProps, AppointmentMaterialsOverrideForm(), AppointmentMaterialsOverrideFormProps, hasInsufficientStock(), AppointmentMaterialsSection() (+28 more)

### Community 14 - "employees-store.ts"
Cohesion: 0.13
Nodes (24): TopbarClinicSelector(), getInventoryAlerts(), markInventoryAlertsAsRead(), getTreatmentPatientImagesPage(), getActiveClinicId(), clinicMembershipRoleLabel(), logger, SentryLogArgs (+16 more)

### Community 15 - "employee-detail-page-client.tsx"
Cohesion: 0.12
Nodes (21): EMPLOYEE_DETAIL_TAB_ITEMS, EmployeeDetailTabBar(), EmployeeDetailTabBarProps, EmployeeDetailTabContent(), EmployeeDetailTabContentProps, EmployeeProfileSidebarProps, EmployeeProfileSummary(), EmployeeProfileSummaryProps (+13 more)

### Community 16 - "reset-password/page.client.tsx"
Cohesion: 0.11
Nodes (17): PasswordInput(), ForgotPasswordPageClient(), LoginAuthTabs(), LoginAuthTabsProps, LoginFormFields(), LoginFormFieldsProps, LoginFormPanel(), LoginFormPanelProps (+9 more)

### Community 28 - "appointments-store.ts"
Cohesion: 0.12
Nodes (22): AppointmentInsert, AppointmentInventoryLinkInput, AppointmentTreatmentInsert, AppointmentUpdate, deleteAppointment(), deleteAppointmentTreatments(), EffectiveAppointmentMaterial, getAppointment() (+14 more)

### Community 31 - "dropzone.tsx"
Cohesion: 0.06
Nodes (47): CampaignImageDropzoneFileItemProps, CampaignImageField(), CampaignImageFieldProps, PatientFileUploaderDropzoneFileItem(), PatientFileUploaderDropzoneFileItemProps, PatientFileUploaderForm(), PatientFileUploaderFormProps, PatientImageUploaderDropzoneFileItemProps (+39 more)

### Community 33 - "appointments-columns.tsx"
Cohesion: 0.08
Nodes (37): APPOINTMENT_GLOW, appointmentGlow(), AppointmentRow(), AppointmentRowProps, AppointmentStatusErrorToast(), AppointmentStatusErrorToastProps, allStatuses, AppointmentStatusSelect() (+29 more)

### Community 35 - "clinic-hours-dialog.tsx"
Cohesion: 0.16
Nodes (17): ClinicHoursConflictList(), formatDate(), Props, resolveName(), ClinicHoursDialog(), ClinicHoursDialogProps, ClinicHoursForm(), ClinicHoursFormProps (+9 more)

### Community 36 - "schema-helpers.ts"
Cohesion: 0.20
Nodes (11): campaignFieldsSchema, CampaignSchemaInput, patientFieldsSchema, patientSchema, PatientSchemaInput, patientUpdateSchema, PatientUpdateSchemaInput, nullableDateString() (+3 more)

### Community 37 - "inventory-item-summary.tsx"
Cohesion: 0.18
Nodes (16): InventoryDetailHeader(), InventoryDetailHeaderProps, InventoryItemIconDisplay(), InventoryItemSummary(), InventoryItemSummaryProps, inventoryStockLevelToneClass(), InventoryStockBadge(), InventoryStockBadgeProps (+8 more)

### Community 38 - "calendar-overlap-group-event.tsx"
Cohesion: 0.11
Nodes (28): CalendarOverlapGroupEvent(), CalendarOverlapGroupEventProps, getEmployeeColor(), getEmployeeName(), CalendarEventProps, CalendarTimeGridEvent(), DayAgendaAppointmentCard(), DayAgendaAppointmentCardProps (+20 more)

### Community 39 - "use-appointment-create-dialog.ts"
Cohesion: 0.08
Nodes (40): AppointmentCreateDialog(), AppointmentCreateDialogProps, AppointmentCreateFormProps, AppointmentPatientOption, AppointmentSlotPicker(), formatSlot(), Props, AppointmentSlotSearchControls() (+32 more)

### Community 40 - "patient-file-edit-dialog.tsx"
Cohesion: 0.15
Nodes (23): categoryOptions, PatientFileCategoryFilter(), PatientFileCategoryFilterProps, PatientFileDeleteConfirmDialog(), PatientFileDeleteConfirmDialogProps, PatientFileEditDialog(), PatientFileEditDialogProps, PatientFileEditFormValues (+15 more)

### Community 41 - "inventory-detail-page-client.tsx"
Cohesion: 0.22
Nodes (13): INVENTORY_DETAIL_TAB_ITEMS, InventoryDetailTabBar(), InventoryDetailTabBarProps, InventoryDetailTabContent(), InventoryDetailTabContentProps, getInventoryDetailPrimaryAction(), InventoryDetailPageClient(), InventoryDetailPageClientProps (+5 more)

### Community 42 - "treatments-page-client.tsx"
Cohesion: 0.17
Nodes (14): TreatmentDetailHeaderProps, getTreatmentsColumns(), TreatmentFilters, TreatmentsFiltersSheet(), TreatmentsFiltersSheetProps, TreatmentsTable(), TreatmentsTableProps, useTreatmentsPage() (+6 more)

### Community 43 - "patients-page-client.tsx"
Cohesion: 0.22
Nodes (9): PatientFilters, PatientsFiltersSheet(), PatientsFiltersSheetProps, statusOptions, PATIENT_FILTER_DEFAULTS, PatientsPageClientProps, PageStickyFiltersSection(), PageStickyFiltersSectionProps (+1 more)

### Community 44 - "patient-files-store.ts"
Cohesion: 0.16
Nodes (20): createPatientFile(), deletePatientFile(), deletePatientFileRecord(), getGlobalPatientFiles(), getPatientFiles(), PaginatedPatientFiles, PatientFileRelation, PatientFileWithRawPatient (+12 more)

### Community 45 - "settings-copy.ts"
Cohesion: 0.14
Nodes (12): ClinicInfoRow(), ClinicInfoRowProps, SettingsClinicHoursPanelProps, SettingsClinicPanelProps, SettingsManagementLink(), SettingsManagementLinkProps, MANAGEMENT_LINKS, SettingsProfileQuickActions() (+4 more)

### Community 46 - "settings-profile-header.tsx"
Cohesion: 0.16
Nodes (14): EmployeeDetailHeader(), EmployeeDetailHeaderProps, SettingsDetailHeaderProps, SettingsProfileHeader(), SettingsProfileHeaderProps, SettingsProfileSidebarProps, Badge(), badgeVariants (+6 more)

### Community 47 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, build, dev, dev:https, lint, lint:staged, prepare, start (+10 more)

### Community 48 - "inventory-item-adjust-stock-dialog.tsx"
Cohesion: 0.16
Nodes (18): formatStockValue(), InventoryAdjustStockPreview(), InventoryAdjustStockPreviewProps, resultingStockToneClass(), InventoryItemAdjustStockDialog(), InventoryItemAdjustStockDialogProps, movementTypeOptions, INVENTORY_ITEM_DETAIL_COPY (+10 more)

### Community 49 - "finances-store.ts"
Cohesion: 0.14
Nodes (20): FinancesPage(), transactionTypeForTab(), FinancesMonthSelector(), FinancesMonthSelectorProps, financesMonthToParam(), getTransactions(), insertTransaction(), TransactionInsert (+12 more)

### Community 50 - "use-files-page.ts"
Cohesion: 0.17
Nodes (15): FilesPageClient(), PATIENT_FILE_CATEGORY_OPTIONS, GlobalPatientFilesParams, FILES_FILTER_DEFAULTS, parseCategory(), parseDate(), parsePage(), parseSort() (+7 more)

### Community 51 - "package.json"
Cohesion: 0.25
Nodes (7): lint-staged, *.{ts,tsx}, name, private, version, eslint --fix, prettier --write

### Community 52 - "appointment-datetime.ts"
Cohesion: 0.20
Nodes (17): useCalendarMobileMonth(), ClinicWallDateTimeFields, clinicWallDateToIso(), clinicWallFieldsToIso(), formatClinicDayKey(), getClinicRangeIso(), instantToClinicZonedDateTime(), buildHasAppointmentsOnDay() (+9 more)

### Community 53 - "invite-page-client.tsx"
Cohesion: 0.29
Nodes (5): Props, EMPLOYEE_ROLE_OPTIONS, InvitePageClient(), MEMBERSHIP_ROLE_LABELS, Props

### Community 54 - "use-campaign-create-dialog.ts"
Cohesion: 0.09
Nodes (28): CampaignStepIndicatorProps, MarketingPageClient(), countCampaignSegmentPatients(), CAMPAIGN_STEPS, campaignFormSchema, defaultValues, useCampaignCreateDialog(), PreviewResult (+20 more)

### Community 55 - "action-button.tsx"
Cohesion: 0.17
Nodes (9): LoaderInline(), TreatmentDialogProps, TreatmentForm(), TreatmentFormProps, AppDialogError(), AppDialogErrorProps, ActionButton(), ProfileQuickActionButtonProps (+1 more)

### Community 56 - "owner-clinic-form.ts"
Cohesion: 0.24
Nodes (7): mapOperationalRoleToEmployeeRole(), OperationalRoleOption, operationalRoleOptions, buildCreateClinicPayload(), CreateClinicPayload, OwnerClinicFormValues, OwnerClinicOnlyValues

### Community 57 - "dependencies"
Cohesion: 0.18
Nodes (11): @base-ui/react, browser-image-compression, next, dependencies, @base-ui/react, browser-image-compression, next, @schedule-x/calendar-controls (+3 more)

### Community 58 - "marketing-page-client.tsx"
Cohesion: 0.09
Nodes (31): AppointmentDeleteDialogProps, EmployeeEditDialogProps, CampaignsEmptyState(), MARKETING_FILTER_DEFAULTS, BeforeAfterComparisonProps, PatientFileUploaderDialog(), PatientFileUploaderDialogProps, PatientImageUploaderDialog() (+23 more)

### Community 59 - "patient-file-viewer.tsx"
Cohesion: 0.17
Nodes (11): PatientFilePdfNavigation(), PatientFilePdfNavigationProps, PatientFilePdfViewerContent(), PatientFilePdfViewerContentProps, PatientFilePdfViewer(), PatientFilePdfViewerProps, PatientFileViewer(), PatientFileViewerProps (+3 more)

### Community 60 - "patient-file-storage.ts"
Cohesion: 0.15
Nodes (19): FileActionsMenu(), FileActionsMenuProps, PatientFileIcon(), PatientFileIconProps, PatientFileRowProps, DropdownMenuContent(), ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES (+11 more)

### Community 61 - "before-after-comparison-slider.tsx"
Cohesion: 0.23
Nodes (9): BeforeAfterComparisonContentProps, BeforeAfterComparisonSlider(), BeforeAfterComparisonSliderProps, BeforeAfterOrientation, buildComparisonLabel(), BeforeAfterComparisonToolbar(), BeforeAfterComparisonToolbarProps, formatInputDate() (+1 more)

### Community 62 - "button.tsx"
Cohesion: 0.07
Nodes (21): NoMembershipPageClient(), MonthMiniCalendarDayProps, EmployeeDetailTabButton(), EmployeeDetailTabButtonProps, InventoryDetailTabButton(), InventoryDetailTabButtonProps, PatientDetailTabButton(), PatientDetailTabButtonProps (+13 more)

### Community 63 - "app-date-field.tsx"
Cohesion: 0.15
Nodes (11): AppDateField(), AppDateFieldProps, pad(), AppDatePopoverFieldProps, Input(), Popover(), PopoverContent(), PopoverDescription() (+3 more)

### Community 64 - "clinic-edit-dialog.tsx"
Cohesion: 0.23
Nodes (12): ClinicEditDialog(), ClinicEditDialogProps, ClinicEditForm(), ClinicEditFormProps, CLINIC_EDIT_COPY, updateClinic(), clinicEditFormSchema, ClinicEditFormValues (+4 more)

### Community 65 - "filters-sheet.tsx"
Cohesion: 0.15
Nodes (13): CalendarOverlapGroupSheet(), CalendarOverlapGroupSheetProps, CalendarOverlapGroupSheetState, FiltersSheet(), FiltersSheetProps, Sheet(), SheetContent(), SheetDescription() (+5 more)

### Community 66 - "settings-layout-client.tsx"
Cohesion: 0.22
Nodes (10): SETTINGS_NAV_ITEMS, SettingsNav(), SettingsNavProps, SettingsSectionContentProps, getSettingsDetailPrimaryAction(), SettingsLayoutClient(), SettingsLayoutClientProps, getSettingsSectionFromPathname() (+2 more)

### Community 67 - "inventory-page-client.tsx"
Cohesion: 0.14
Nodes (18): InventoryItemCreateForm(), InventoryItemCreateFormProps, InventoryItemEditDialog(), InventoryItemEditDialogProps, INVENTORY_FILTER_DEFAULTS, InventoryPageClient(), InventoryPageClientProps, INVENTORY_ITEM_CREATE_COPY (+10 more)

### Community 68 - "patient-images-store.ts"
Cohesion: 0.14
Nodes (19): createPatientImage(), deletePatientImage(), getPatientImage(), getPatientImages(), TreatmentPatientImagesPage, compressTreatmentImage(), getImageDimensions(), buildPatientImageKey() (+11 more)

### Community 69 - "campaigns.dal.ts"
Cohesion: 0.13
Nodes (25): countCampaignPatients(), getCampaignRecipients(), CampaignSegmentInsert, CampaignSegmentPatient, CampaignSegmentRpcArgs, getCampaignSegmentPatients(), getCampaignSegments(), replaceCampaignSegments() (+17 more)

### Community 70 - "use-patient-image-uploader.ts"
Cohesion: 0.15
Nodes (13): PatientImageTreatmentSelect(), PatientImageTreatmentSelectProps, PatientImageUploaderForm(), PatientImageUploaderFormProps, phaseOptions, defaultValues, patientImageFormSchema, PatientImageFormValues (+5 more)

### Community 71 - "use-topbar-actions.ts"
Cohesion: 0.24
Nodes (9): getInventoryDetailMenuSections(), InventoryDetailActionHandlers, showComingSoon(), PatientDetailActionHandlers, SettingsDetailActionHandlers, TreatmentDetailActionHandlers, ProfileActionSection, TopbarActionButtonConfig (+1 more)

### Community 72 - "bootstrap.ts"
Cohesion: 0.18
Nodes (13): ClinicMembershipRow, getMemberships(), ActiveClinicBootstrap, AppBootstrap, getCachedEmployee, getCachedMemberships, getServerIdentity, mapMembershipRow() (+5 more)

### Community 73 - "toggle-group.tsx"
Cohesion: 0.20
Nodes (12): react, react, CalendarDayButton(), useComboboxAnchor(), SidebarMenuSkeleton(), ToggleGroup(), ToggleGroupContext, ToggleGroupItem() (+4 more)

### Community 74 - "data-table.tsx"
Cohesion: 0.12
Nodes (24): formatQuantity(), InventoryOption, TreatmentInventoryLinkRow(), TreatmentInventoryLinkRowDisplayProps, TreatmentInventoryLinkRowFormProps, TreatmentInventoryLinkRowProps, TreatmentInventoryLinksFieldProps, DataTableProps (+16 more)

### Community 75 - "files-table.tsx"
Cohesion: 0.19
Nodes (16): buildFilesColumns(), FileAction, FilesPagination(), FilesPaginationProps, FileAction, FilesResults(), FilesResultsProps, FileAction (+8 more)

### Community 76 - "files-filters-sheet.tsx"
Cohesion: 0.19
Nodes (17): FilesDateRangeFilter(), FilesDateRangeFilterProps, formatRangeLabel(), parseDate(), FilesFiltersSheet(), FilesFiltersSheetProps, parseDate(), sortOptions (+9 more)

### Community 77 - "app-topbar.tsx"
Cohesion: 0.31
Nodes (8): PAGE_TITLES_BY_ROUTE, Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator()

### Community 78 - "campaigns-filters-sheet.tsx"
Cohesion: 0.24
Nodes (8): CampaignsFiltersSheetProps, CampaignsSheetFilters, statusOptions, useCampaigns(), CAMPAIGN_STATUS_VALUES, MarketingPageFilters, matchesDateRange(), useMarketingPage()

### Community 79 - "profile-edit-dialog.tsx"
Cohesion: 0.24
Nodes (12): ProfileColorField(), ProfileColorFieldProps, ProfileEditDialog(), ProfileEditDialogProps, ProfileEditForm(), ProfileEditFormProps, PROFILE_COLOR_PRESETS, PROFILE_EDIT_COPY (+4 more)

### Community 80 - "PATIENT_GALLERY_COPY"
Cohesion: 0.21
Nodes (10): PatientGalleryDateGroup(), PatientGalleryDateGroupProps, DENSITY_OPTIONS, PatientGalleryDensityToggle(), PatientGalleryDensityToggleProps, PatientGalleryImageThumbProps, PATIENT_GALLERY_COPY, PATIENT_GALLERY_DENSITY_GRID_CLASSES (+2 more)

### Community 81 - "EmployeeRole"
Cohesion: 0.29
Nodes (5): employeeColors, employeeRoles, EmployeesUiStore, useEmployeesUiStore, EmployeeRole

### Community 82 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 83 - "notice.tsx"
Cohesion: 0.08
Nodes (33): OwnerAccountStep(), Props, OwnerClinicStep(), Props, displayValue(), OwnerConfirmationStep(), Props, OwnerRegistrationProgress() (+25 more)

### Community 84 - "patient-gallery-tab.tsx"
Cohesion: 0.13
Nodes (18): PatientGalleryFiltersSheet(), PatientGalleryFiltersSheetProps, PatientGalleryFilterValues, sortOptions, filterImages(), PatientGalleryTab(), PatientGalleryTabProps, PatientImageViewer() (+10 more)

### Community 85 - "register-employee-copy.ts"
Cohesion: 0.27
Nodes (9): RegisterEmployeeSidebar(), RegisterEmployeeSidebarProps, getSidebarCopy(), REGISTER_COPY, REGISTER_EMPLOYEE_SIDEBAR_COPY, RegisterCopy, SIDEBAR_COPY, SidebarCopy (+1 more)

### Community 86 - "mocks.ts"
Cohesion: 0.09
Nodes (18): mockAppointment, mockEmployee, mockInventoryItem, mockPatient, mockTreatment, end, initialState, start (+10 more)

### Community 87 - "register"
Cohesion: 0.29
Nodes (4): register(), AppointmentCreateForm(), EmployeeEditForm(), EmployeeInviteForm()

### Community 88 - "useActiveClinic"
Cohesion: 0.21
Nodes (13): AppLayoutClient(), AppLayoutClientProps, useActiveClinic(), externalMemberships(), needsClinicSelector(), PostAuthRouteInput, PostAuthRouteResult, resolvePostAuthRoute() (+5 more)

### Community 89 - "compilerOptions"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+22 more)

### Community 90 - "invite-team-page-client.tsx"
Cohesion: 0.12
Nodes (20): getDefaultValues(), OwnerRegistrationStep, SubmissionStage, syncAuthenticatedUser(), useOwnerRegistration(), OwnerRegistrationPageClient(), defaultValues, useCreateClinic() (+12 more)

### Community 91 - "dropdown-menu.tsx"
Cohesion: 0.14
Nodes (13): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+5 more)

### Community 92 - "finances-movements-section.tsx"
Cohesion: 0.20
Nodes (9): FinancesMovementsSectionProps, TransactionsTable(), FinancesTabBar(), FinancesTabBarProps, FinancesTabValue, parseFinancesTabParam(), FinancesUiStore, useFinancesPageState() (+1 more)

### Community 93 - "useClinicId"
Cohesion: 0.21
Nodes (23): AppointmentEmployeeFilter(), EmployeeDetailPageClient(), useClinicId(), useDashboard(), useEmployee(), useEmployeeAppointments(), useEmployeeAppointmentStats(), useEmployees() (+15 more)

### Community 94 - "useAuth"
Cohesion: 0.15
Nodes (24): useLogin(), createDefaultValues(), useRegisterEmployee(), RegisterEmployeePageClient(), getRegisterCopy(), AUTH_ERROR_COPY, getAuthErrorMessage(), signInWithGoogleFlow() (+16 more)

### Community 95 - "employee-profile-header.tsx"
Cohesion: 0.15
Nodes (23): EmployeeAvatarDisplay(), EmployeeAvatarDisplayProps, getAvatarStyle(), EmployeeProfileHeader(), EmployeeProfileHeaderProps, getAvatarStyle(), SettingsProfilePanel(), SettingsProfilePanelProps (+15 more)

### Community 96 - "appointment-schema.ts"
Cohesion: 0.16
Nodes (12): appointmentCommonFieldsSchema, appointmentFormSchema, appointmentSchema, AppointmentSchemaInput, appointmentUpdateSchema, AppointmentUpdateSchemaInput, clinicIdSchema(), uuidSchema() (+4 more)

### Community 97 - "use-treatment-images.ts"
Cohesion: 0.17
Nodes (11): TreatmentDetailInventorySectionProps, TreatmentImageGalleryProps, TreatmentImageThumbnailProps, TreatmentImagesSection(), TreatmentImagesSectionProps, EMPTY_IMAGES, useTreatmentImages(), TreatmentImageGalleryItem (+3 more)

### Community 98 - "employee-schema.ts"
Cohesion: 0.20
Nodes (9): clinicMembershipInvitationRoleSchema, employeeFieldsSchema, employeeInviteSchema, EmployeeInviteSchemaInput, employeeRoleSchema, employeeSchema, EmployeeSchemaInput, employeeUpdateSchema (+1 more)

### Community 99 - "finances-store.test.ts"
Cohesion: 0.14
Nodes (13): transactionsToCsv(), decExpense, decIncome, decTransactions, initialState, jan10, jan15, jan22 (+5 more)

### Community 102 - "calendar-view-mode-toggle.tsx"
Cohesion: 0.33
Nodes (4): e2eUser, playwrightResult, status, statusResult

### Community 106 - "getServerActiveClinicId"
Cohesion: 0.15
Nodes (23): AppointmentsPage(), CalendarPage(), DashboardPage(), EmployeesPage(), InventoryPage(), PatientsPage(), SettingsLayout(), SettingsLayoutProps (+15 more)

### Community 107 - "patient-edit-dialog.tsx"
Cohesion: 0.36
Nodes (7): PatientEditDialog(), PatientEditDialogProps, PATIENT_EDIT_COPY, patientFormSchema, toFormValues(), usePatientEditDialog(), Patient

### Community 108 - "use-patient-file-uploader.ts"
Cohesion: 0.24
Nodes (8): defaultValues, patientFileFormSchema, PatientFileFormValues, useUploadPatientFiles(), PatientFileCategoryOption, patientFileCategorySchema, PatientFileUploadInput, patientFileUploadSchema

### Community 109 - "createClient"
Cohesion: 0.11
Nodes (26): AppointmentDetailPage(), EmployeeDetailPage(), InventoryItemDetailPage(), PatientDetailPage(), TreatmentDetailPage(), GET(), config, proxy() (+18 more)

### Community 110 - "inventory-filters-sheet.tsx"
Cohesion: 0.14
Nodes (12): InventoryFilters, InventoryFiltersSheet(), InventoryFiltersSheetProps, stockOptions, InventoryStockSummaryProps, InventoryStockSummaryItemProps, StockTone, toneActive (+4 more)

### Community 111 - "loader-status-list.tsx"
Cohesion: 0.28
Nodes (6): LoaderProgressBar(), LoaderProgressBarProps, LoaderStatusList(), LoaderStatusListProps, LoaderStatusRow(), LoaderStatusRowProps

### Community 113 - "use-appointments.ts"
Cohesion: 0.24
Nodes (14): notifyAppointmentStatusError(), useAppointmentDetail(), useAppointment(), useAppointmentInventoryItems(), useAppointments(), useCreateAppointment(), useReplaceAppointmentInventoryItems(), useRescheduleAppointment() (+6 more)

### Community 114 - "unwrapSupabaseList"
Cohesion: 0.10
Nodes (29): getTodayAppointments(), EmployeeInviteInput, EmployeeUpdate, getEmployee(), getEmployeeAppointments(), getEmployeeAppointmentStats(), getEmployees(), getPatientFile() (+21 more)

### Community 115 - "employees-filters-sheet.tsx"
Cohesion: 0.29
Nodes (6): EmployeeFilters, EmployeesFiltersSheet(), EmployeesFiltersSheetProps, roleOptions, statusOptions, EMPLOYEES_COPY

### Community 116 - "employee-invite-errors.ts"
Cohesion: 0.31
Nodes (10): createEmployeeInviteError(), EMPLOYEE_INVITE_ERROR_MESSAGES, EMPLOYEE_INVITE_STATUS_MESSAGES, EmployeeInviteErrorBody, getDictionaryMessage(), getErrorCandidates(), getNestedMessage(), getStringValue() (+2 more)

### Community 117 - "finances-category-breakdown.tsx"
Cohesion: 0.33
Nodes (4): CategoryBreakdownItem, FinancesCategoryBreakdownProps, FinancesCategoryRow(), FinancesCategoryRowProps

### Community 118 - "campaign-image-storage.ts"
Cohesion: 0.48
Nodes (5): buildCampaignImageKey(), copyCampaignImage(), extensionFromMimeType(), uploadCampaignImage(), compressCampaignImage()

### Community 119 - "treatment-detail-page-client.tsx"
Cohesion: 0.19
Nodes (14): CampaignDetailPageClient(), getTreatmentDetailMenuSections(), getTreatmentDetailPrimaryAction(), TreatmentDetailPageClient(), TreatmentDetailPageClientProps, TopbarActionConfig, flattenMenuSections(), useTopbarActions() (+6 more)

### Community 120 - "settings-profile-summary.tsx"
Cohesion: 0.40
Nodes (3): SettingsProfileSummaryProps, SettingsStatItem(), SettingsStatItemProps

### Community 121 - "app-searchable-multi-select.tsx"
Cohesion: 0.28
Nodes (5): AppSearchableMultiSelectOption, AppSearchableMultiSelectProps, AppSearchableMultiSelectOption(), AppSearchableMultiSelectOptionProps, COMBOBOX_COPY

### Community 122 - "format.ts"
Cohesion: 0.07
Nodes (51): AppointmentDetailSidebar(), AppointmentDetailSidebarProps, AppointmentHeader(), AppointmentHeaderProps, AppointmentStatusBadge(), AppointmentStatusBadgeProps, statusVariants, EmployeeAppointmentRow() (+43 more)

### Community 123 - "clinic-store.ts"
Cohesion: 0.11
Nodes (18): AppLayout(), ServerBootstrapContext, ServerBootstrapState, StoreHydrator(), StoreHydratorProps, useServerBootstrap(), ClinicMembershipRow, getMemberships() (+10 more)

### Community 124 - "useTreatments"
Cohesion: 0.60
Nodes (4): TreatmentCatalogFilters, useTreatmentCatalog(), useFilterPills(), useTreatments()

### Community 125 - "filter-field.tsx"
Cohesion: 0.07
Nodes (31): EmployeesFiltersProps, roleOptions, statusOptions, categoryOptions, FilesFiltersProps, sortOptions, FinancesFilters(), FinancesFiltersProps (+23 more)

### Community 126 - "boot-loading-screen.tsx"
Cohesion: 0.15
Nodes (10): LoginPageClient(), BootLoadingScreen(), BootLoadingScreenProps, LoaderRedirectCheckBadge(), LoaderRedirectVisual(), useBootLoadingPhase(), UseBootLoadingPhaseInput, LoaderScreenShell() (+2 more)

### Community 127 - "appointment-detail-page-client.tsx"
Cohesion: 0.26
Nodes (10): AppointmentDetailActionHandlers, AppointmentDetailTopbarParams, getAppointmentDetailMenuSections(), getAppointmentDetailPrimaryAction(), resolvePrimaryLabel(), AppointmentDetailPageClient(), AppointmentDetailPageClientProps, resolveTotalDurationMinutes() (+2 more)

### Community 128 - "inventory-schema.ts"
Cohesion: 0.50
Nodes (3): inventoryFieldsSchema, inventorySchema, InventorySchemaInput

### Community 129 - "settings-account-panel.tsx"
Cohesion: 0.24
Nodes (7): SettingsAccountPanel(), SettingsAccountPanelProps, SettingsActionRow(), SettingsActionRowProps, SettingsDetailHeader(), SettingsUserPanel(), SettingsUserPanelProps

### Community 130 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, devDependencies, eslint, @playwright/test, prettier, @testing-library/jest-dom, @testing-library/user-event, @types/react-dom (+9 more)

### Community 131 - "github"
Cohesion: 0.40
Nodes (4): GITHUB_PERSONAL_ACCESS_TOKEN, npx, github, @modelcontextprotocol/server-github

### Community 133 - "app-dialog-close.tsx"
Cohesion: 0.50
Nodes (3): AppDialogClose(), AppDialogCloseProps, APP_DIALOG_COPY

### Community 134 - "use-patient-images.ts"
Cohesion: 0.21
Nodes (15): BeforeAfterComparisonImage(), BeforeAfterComparisonImageProps, PatientGalleryImageThumb(), PatientImageDeleteConfirmDialog(), PatientImageDeleteConfirmDialogProps, getImageUrl(), useDeletePatientImage(), usePatientImages() (+7 more)

### Community 136 - "useFilterSearch"
Cohesion: 0.33
Nodes (7): AppSearchBarInput(), AppSearchBarInputProps, useDebouncedValue(), useFilterSearch(), useSearch(), TopbarSearchState, useTopbarSearchStore

### Community 137 - "employees-page-client.tsx"
Cohesion: 0.10
Nodes (26): EmployeeEditDialog(), EmployeeInviteFormProps, roleOptions, EmployeeStatusConfirmDialog(), EmployeeStatusConfirmDialogProps, EMPLOYEE_FILTER_DEFAULTS, EmployeesPageClient(), EmployeesPageClientProps (+18 more)

### Community 139 - "campaign-image-dialog.tsx"
Cohesion: 0.27
Nodes (8): CampaignDetailImage(), CampaignDetailImageProps, CampaignImageCell(), CampaignImageCellProps, CampaignImageDialog(), CampaignImageDialogProps, getCampaignImageUrl(), useCampaignImageUrl()

### Community 140 - "whatsapp.ts"
Cohesion: 0.12
Nodes (12): baseMessage, corsHeaders, SegmentPatient, corsHeaders, postToTwilio(), resolveWhatsAppMode(), sendWhatsApp(), VALID_MODES (+4 more)

### Community 141 - "stat.tsx"
Cohesion: 0.40
Nodes (4): Stat(), StatProps, StatTone, toneClasses

### Community 145 - "table-mobile-columns.tsx"
Cohesion: 0.10
Nodes (21): employeesColumns, EmployeesTable(), EmployeesTableProps, transactionsColumns, TransactionsTableProps, inventoryColumns, InventoryTable(), InventoryTableProps (+13 more)

### Community 155 - "marketing-copy.ts"
Cohesion: 0.10
Nodes (24): CampaignDetailHeader(), CampaignDetailHeaderProps, CampaignReachSummary(), CampaignReachSummaryProps, CampaignRecipientStatusBadge(), CampaignRecipientStatusBadgeProps, statusVariants, CampaignRecipientsList() (+16 more)

### Community 156 - "appointment-person-avatar.tsx"
Cohesion: 0.38
Nodes (4): AppointmentHeaderPersonProps, AppointmentPersonAvatar(), AppointmentPersonAvatarProps, getInitials()

### Community 157 - "loader-spinner.tsx"
Cohesion: 0.33
Nodes (5): LoaderOrbitalVisual(), LoaderSpinner(), LoaderSpinnerProps, LoaderSpinnerSize, SPINNER_SIZES

### Community 159 - "use-settings-page.ts"
Cohesion: 0.31
Nodes (8): normalizeEmail(), PendingClinicRequest, useUploadProfileAvatar(), usePendingClinicRequests(), UsePendingClinicRequestsResult, buildProfileSubtitle(), useSettingsPageActions(), canManageClinicSettings()

### Community 160 - "e2e-helpers.ts"
Cohesion: 0.16
Nodes (16): createAndGoToAppointmentDetail(), authDirectory, authFile, E2E_DATA, E2E_TINY_PNG, E2E_USER, clickPatientTableRow(), clickTopbarMenuAction() (+8 more)

### Community 164 - "use-employee-edit-dialog.ts"
Cohesion: 0.30
Nodes (8): EmployeeColorField(), EmployeeColorFieldProps, EmployeeEditFormProps, roleOptions, EMPLOYEE_COLOR_PRESETS, EMPLOYEE_EDIT_COPY, employeeEditFormSchema, EmployeeEditFormValues

### Community 171 - "use-schedule-x-calendar.ts"
Cohesion: 0.11
Nodes (29): @schedule-x/calendar, @schedule-x/calendar, CalendarWeekUiRefs, updateCalendarWeekUiRefs(), CalendarEmptyHeader(), CalendarWeekGridDate(), ScheduleXCalendarInner(), buildClinicBackgroundEvents() (+21 more)

### Community 174 - "finances-page-client.tsx"
Cohesion: 0.10
Nodes (24): FinancesFilters, FinancesFiltersSheet(), FinancesFiltersSheetProps, FinancesMetricItem(), FinancesMetricItemProps, FinancesSummaryMetrics(), FinancesSummaryMetricsProps, MetricConfig (+16 more)

### Community 193 - "hyperframes.json"
Cohesion: 0.20
Nodes (9): authoringSkill, media, autoProxy, paths, assets, blocks, components, registry (+1 more)

### Community 233 - "calendar-page-client.tsx"
Cohesion: 0.09
Nodes (36): CalendarEmployeeFilter(), CalendarEmployeeFilterProps, CALENDAR_FILTER_DEFAULTS, CalendarPageClient(), CalendarPageClientProps, CLOSED_GROUP_SHEET, CalendarFilters, CalendarFiltersSheet() (+28 more)

### Community 235 - "scripts"
Cohesion: 0.22
Nodes (8): name, private, scripts, check, dev, publish, render, type

### Community 240 - "capture-product.mjs"
Cohesion: 0.40
Nodes (4): captureDir, captures, projectDir, scriptDir

### Community 263 - "supabase.ts"
Cohesion: 0.16
Nodes (17): AuthProviderProps, getClientHydratedSnapshot(), getServerHydratedSnapshot(), subscribeToClientHydration(), useAuthHydrated(), getEmployeeProfile(), ProfileUpdate, updateEmployeeAvatar() (+9 more)

## Knowledge Gaps
- **868 isolated node(s):** `npx`, `@modelcontextprotocol/server-github`, `GITHUB_PERSONAL_ACCESS_TOKEN`, `SettingsLayoutProps`, `Props` (+863 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **62 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `AppointmentWithRelations`, `sidebar.tsx`, `skeleton.tsx`, `loader-spinner.tsx`, `dropzone.tsx`, `use-employee-edit-dialog.ts`, `calendar-overlap-group-event.tsx`, `use-schedule-x-calendar.ts`, `patients-page-client.tsx`, `settings-profile-header.tsx`, `action-button.tsx`, `marketing-page-client.tsx`, `patient-file-storage.ts`, `button.tsx`, `app-date-field.tsx`, `filters-sheet.tsx`, `toggle-group.tsx`, `data-table.tsx`, `app-topbar.tsx`, `profile-edit-dialog.tsx`, `notice.tsx`, `dropdown-menu.tsx`, `calendar-page-client.tsx`, `filter-field.tsx`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `Button()` connect `button.tsx` to `settings-account-panel.tsx`, `Employee`, `cn`, `patient-detail-page-client.tsx`, `useFilterSearch`, `employees-page-client.tsx`, `sidebar.tsx`, `sidebar-profile-footer.tsx`, `appointment-materials-override-dialog.tsx`, `reset-password/page.client.tsx`, `table-mobile-columns.tsx`, `dropzone.tsx`, `appointments-columns.tsx`, `clinic-hours-dialog.tsx`, `use-employee-edit-dialog.ts`, `use-appointment-create-dialog.ts`, `patient-file-edit-dialog.tsx`, `patients-page-client.tsx`, `settings-copy.ts`, `finances-page-client.tsx`, `settings-profile-header.tsx`, `inventory-item-adjust-stock-dialog.tsx`, `finances-store.ts`, `invite-page-client.tsx`, `action-button.tsx`, `marketing-page-client.tsx`, `patient-file-viewer.tsx`, `patient-file-storage.ts`, `before-after-comparison-slider.tsx`, `app-date-field.tsx`, `clinic-edit-dialog.tsx`, `filters-sheet.tsx`, `inventory-page-client.tsx`, `data-table.tsx`, `files-table.tsx`, `files-filters-sheet.tsx`, `app-topbar.tsx`, `profile-edit-dialog.tsx`, `notice.tsx`, `invite-team-page-client.tsx`, `dropdown-menu.tsx`, `finances-movements-section.tsx`, `employee-profile-header.tsx`, `use-treatment-images.ts`, `calendar-page-client.tsx`, `patient-edit-dialog.tsx`, `app-searchable-multi-select.tsx`, `filter-field.tsx`, `appointment-detail-page-client.tsx`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `class-variance-authority`, `clsx`, `cuelume`, `date-fns`, `date-fns-tz`, `@hookform/resolvers`, `@radix-ui/react-dialog`, `lucide-react`, `match-sorter`, `@pdfslick/react`, `@preact/signals`, `preact`, `@radix-ui/react-popover`, `radix-ui`, `@radix-ui/themes`, `react-day-picker`, `react-compare-slider`, `use-schedule-x-calendar.ts`, `react-hook-form`, `react-dom`, `react-dropzone`, `shadcn`, `react-toastify`, `@supabase/ssr`, `package.json`, `@schedule-x/events-service`, `@schedule-x/react`, `@sentry/nextjs`, `server-only`, `@tanstack/react-table`, `tw-animate-css`, `@supabase/supabase-js`, `tailwind-merge`, `yet-another-react-lightbox`, `temporal-polyfill`, `zod`, `zustand`, `toggle-group.tsx`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **What connects `npx`, `@modelcontextprotocol/server-github`, `GITHUB_PERSONAL_ACCESS_TOKEN` to the rest of the system?**
  _868 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `database.types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Employee` be split into smaller, more focused modules?**
  _Cohesion score 0.14015151515151514 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.061072261072261075 - nodes in this community are weakly interconnected._