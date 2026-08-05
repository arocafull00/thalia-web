# Graph Report - thalia-web  (2026-08-05)

## Corpus Check
- 792 files · ~320,231 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3184 nodes · 9239 edges · 186 communities (150 shown, 36 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 37 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `38568d1e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- database.types.ts
- use-treatment-dialog.ts
- FilterField
- cn
- Patient
- calendar-grid.ts
- app-layout-client.tsx
- useActiveClinicTimezone
- marketing-copy.ts
- campaign-create-form.tsx
- sidebar.tsx
- patient-create-form.tsx
- app/layout.tsx
- appointment-materials-section.tsx
- query-state.ts
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
- use-clinic-hours-dialog.ts
- schema-helpers.ts
- inventory-item-sidebar.tsx
- calendar-overlap-group-event.tsx
- appointment-create-form.tsx
- patient-files-tab.tsx
- inventory-detail-page-client.tsx
- formatCurrency
- employees-page-client.tsx
- patient-files-store.ts
- settings-copy.ts
- settings-profile-header.tsx
- scripts
- use-inventory-adjust-stock-dialog.ts
- useClinicId
- use-files-page.ts
- package.json
- appointment-datetime.ts
- button.tsx
- use-campaign-create-dialog.ts
- use-active-clinic.ts
- owner-clinic-form.ts
- dependencies
- appointment-create-dialog.tsx
- useAuth
- patient-file-storage.ts
- before-after-comparison-slider.tsx
- utils.ts
- app-date-field.tsx
- use-clinic-edit-dialog.ts
- filters-sheet.tsx
- settings-layout-client.tsx
- use-inventory-item-create-dialog.ts
- patient-images-store.ts
- campaigns.dal.ts
- patient-image-uploader-form.tsx
- use-topbar-actions.ts
- employees-store.ts
- toggle-group.tsx
- data-table.tsx
- patient-files-copy.ts
- filter-field.tsx
- app-topbar.tsx
- campaigns-filters.tsx
- use-profile-edit-dialog.ts
- PATIENT_GALLERY_COPY
- format.ts
- components.json
- use-create-clinic.ts
- patient-gallery-tab.tsx
- onboarding-intent-store.ts
- mocks.ts
- register
- app-layout-client.tsx
- compilerOptions
- use-owner-registration.ts
- dropdown-menu.tsx
- context-menu.tsx
- use-employees.ts
- invite-team-page-client.tsx
- employee-profile-header.tsx
- use-appointment-create-dialog.ts
- use-treatment-images.ts
- employee-schema.ts
- patient-detail-page-client.tsx
- calendar-view-mode-toggle.tsx
- patient-image-viewer.tsx
- getServerActiveClinicId
- app-sidebar-nav-item.tsx
- use-clinic-info.ts
- bootstrap.ts
- inventory-filters-sheet.tsx
- dashboard-page-client.tsx
- AppointmentWithRelations
- unwrapSupabaseList
- use-login.ts
- employee-invite-errors.ts
- register-employee-form.tsx
- use-appointment-materials-override-dialog.ts
- campaign-detail-page-client.tsx
- treatment-detail-page-client.tsx
- app-searchable-multi-select.tsx
- formatDate
- clinic-store.ts
- patient-image-viewer.tsx
- page-filters-bar.tsx
- boot-loading-screen.tsx
- appointment-detail-page-client.tsx
- use-patient-image-uploader.ts
- settings-account-panel.tsx
- devDependencies
- github
- patient-gallery-filters-sheet.tsx
- app-dialog-content.tsx
- use-patient-images.ts
- browser-image-compression
- app-search-bar-input.tsx
- notifySuccess
- clsx
- campaign-image-storage.ts
- whatsapp.ts
- campaign-reach-summary.tsx
- cuelume
- date-fns
- table-mobile-columns.tsx
- date-fns-tz
- @schedule-x/calendar
- use-app-nav-items.tsx
- @base-ui/react
- @radix-ui/react-dialog
- campaigns-columns.tsx
- appointment-person-avatar.tsx
- loader-spinner.tsx
- use-pending-clinic-requests.ts
- e2e-helpers.ts
- formatZodError
- preact
- radix-ui
- react-compare-slider
- use-schedule-x-calendar.ts
- react-dom
- finances-page-client.tsx
- react-dropzone
- react-toastify
- @schedule-x/events-service
- @schedule-x/react
- @sentry/nextjs
- server-only
- @supabase/supabase-js
- tailwind-merge
- temporal-polyfill
- hyperframes.json
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
- `EmployeeEditForm()` --calls--> `register()`  [INFERRED]
  src/components/employees/components/form/employee-edit-form.tsx → instrumentation.ts
- `EmployeeInviteForm()` --calls--> `register()`  [INFERRED]
  src/components/employees/components/form/employee-invite-form.tsx → instrumentation.ts
- `TransactionCreateForm()` --calls--> `register()`  [INFERRED]
  src/components/finances/components/transaction-create-form.tsx → instrumentation.ts
- `CreateClinicForm()` --calls--> `register()`  [INFERRED]
  src/components/onboarding/create-clinic/components/create-clinic-form.tsx → instrumentation.ts
- `PatientCreateForm()` --calls--> `register()`  [INFERRED]
  src/components/patients/components/form/patient-create-form.tsx → instrumentation.ts

## Import Cycles
- 3-file cycle: `src/lib/active-clinic-id.ts -> src/stores/auth-store.ts -> src/stores/employees-store.ts -> src/lib/active-clinic-id.ts`

## Communities (186 total, 36 thin omitted)

### Community 0 - "database.types.ts"
Cohesion: 0.11
Nodes (17): EmployeesUiStore, useEmployeesUiStore, AppointmentInventoryItem, AppointmentInventoryItemWithStock, AppointmentReminderStatus, AppointmentTreatment, AppointmentTreatmentInventoryItemWithStock, CampaignRecipient (+9 more)

### Community 1 - "use-treatment-dialog.ts"
Cohesion: 0.17
Nodes (12): TreatmentForm(), TreatmentFormProps, emptyValues, toFormValues(), TreatmentFormValues, useTreatmentDialog(), AppDialogError(), AppDialogErrorProps (+4 more)

### Community 2 - "FilterField"
Cohesion: 0.13
Nodes (26): AppointmentDateRange(), AppointmentDateRangeProps, formatAppointmentDateParam(), formatAppointmentDateRangeLabel(), getDefaultAppointmentDateRange(), parseAppointmentDateParam(), AppointmentEmployeeFilter(), AppointmentEmployeeFilterProps (+18 more)

### Community 3 - "cn"
Cohesion: 0.11
Nodes (30): AppSearchableCombobox(), AppSearchableComboboxOption, AppSearchableComboboxProps, AppSearchableComboboxItem(), AppSearchableComboboxItemProps, Avatar(), AvatarBadge(), AvatarFallback() (+22 more)

### Community 4 - "Patient"
Cohesion: 0.08
Nodes (27): PatientDetailStatsProps, PatientDetailStatsRow(), PATIENT_DETAIL_TAB_ITEMS, PatientDetailTabBar(), PatientDetailTabBarProps, PatientDetailTabContent(), PatientDetailTabContentProps, PatientStatCard() (+19 more)

### Community 5 - "calendar-grid.ts"
Cohesion: 0.14
Nodes (21): MonthMiniCalendar(), MonthMiniCalendarProps, ScheduleXCalendarInner(), ScheduleXCalendar(), SkeletonBlock(), appointmentLayout(), formatDayHeader(), formatWeekRange() (+13 more)

### Community 7 - "useActiveClinicTimezone"
Cohesion: 0.13
Nodes (23): APPOINTMENT_GLOW, appointmentGlow(), AppointmentRow(), AppointmentRowProps, buildAppointmentsColumns(), AppointmentsMobileList(), AppointmentsMobileListProps, APPOINTMENTS_INITIAL_SORTING (+15 more)

### Community 8 - "marketing-copy.ts"
Cohesion: 0.13
Nodes (13): CampaignRecipientStatusBadge(), CampaignRecipientStatusBadgeProps, statusVariants, CampaignRecipientsList(), CampaignRecipientsListProps, CampaignMessagePreviewProps, CampaignRecipientsPreview(), CampaignRecipientsPreviewProps (+5 more)

### Community 9 - "campaign-create-form.tsx"
Cohesion: 0.19
Nodes (12): CampaignCreateForm(), CampaignCreateFormProps, CampaignMessageFields(), CampaignMessageFieldsProps, CampaignSegmentFields(), CampaignSegmentFieldsProps, NumericField, TreatmentOption (+4 more)

### Community 10 - "sidebar.tsx"
Cohesion: 0.07
Nodes (36): react, react, AppShell(), AppShellProps, AppSidebar(), AppSidebarNavSection(), AppSidebarNavSectionProps, useComboboxAnchor() (+28 more)

### Community 11 - "patient-create-form.tsx"
Cohesion: 0.33
Nodes (6): PatientCreateForm(), PatientCreateFormProps, PatientAvatarField(), PatientAvatarFieldProps, PATIENT_CREATE_COPY, PatientFormValues

### Community 12 - "app/layout.tsx"
Cohesion: 0.10
Nodes (21): geistMono, inter, metadata, outfit, viewport, AuthProvider(), PwaInstallProvider(), PwaInstallProviderProps (+13 more)

### Community 13 - "appointment-materials-section.tsx"
Cohesion: 0.18
Nodes (13): AppointmentDetailCard(), AppointmentDetailCardProps, AppointmentMaterialsSection(), AppointmentMaterialsSectionProps, formatQuantity(), isStockInsufficient(), toDialogInitialItems(), AppointmentTreatmentsSection() (+5 more)

### Community 14 - "query-state.ts"
Cohesion: 0.10
Nodes (31): DashboardPageClient(), TreatmentDialog(), AppTopbar(), TopbarClinicSelector(), getInventoryAlerts(), markInventoryAlertsAsRead(), getActiveClinicId(), clinicMembershipRoleLabel() (+23 more)

### Community 15 - "employee-detail-page-client.tsx"
Cohesion: 0.13
Nodes (21): EMPLOYEE_DETAIL_TAB_ITEMS, EmployeeDetailTabBar(), EmployeeDetailTabBarProps, EmployeeDetailTabContent(), EmployeeDetailTabContentProps, EmployeeProfileSidebarProps, EmployeeProfileSummary(), EmployeeProfileSummaryProps (+13 more)

### Community 16 - "reset-password/page.client.tsx"
Cohesion: 0.14
Nodes (11): ForgotPasswordPageClient(), LoginHeroIllustration(), loginIllustrationSvg, LoginHeroPanel(), RegisterPageClient(), ResetPasswordOpeningSession(), ResetPasswordPageClient(), LOGIN_COPY (+3 more)

### Community 28 - "appointments-store.ts"
Cohesion: 0.08
Nodes (34): AppointmentInsert, AppointmentInventoryLinkInput, AppointmentTreatmentInsert, AppointmentUpdate, deleteAppointment(), deleteAppointmentTreatments(), EffectiveAppointmentMaterial, getAppointment() (+26 more)

### Community 31 - "dropzone.tsx"
Cohesion: 0.06
Nodes (48): CampaignImageDropzoneFileItemProps, CampaignImageField(), CampaignImageFieldProps, PatientFileUploaderDropzoneFileItem(), PatientFileUploaderDropzoneFileItemProps, PatientFileUploaderForm(), PatientFileUploaderFormProps, PatientImageUploaderDropzoneFileItemProps (+40 more)

### Community 33 - "appointments-columns.tsx"
Cohesion: 0.11
Nodes (27): AppointmentStatusErrorToast(), AppointmentStatusErrorToastProps, notifyAppointmentStatusError(), allStatuses, AppointmentStatusSelect(), AppointmentStatusSelectProps, statusColors, statusOptions (+19 more)

### Community 35 - "use-clinic-hours-dialog.ts"
Cohesion: 0.16
Nodes (16): ClinicHoursConflictList(), formatDate(), Props, resolveName(), ClinicHoursDialog(), ClinicHoursForm(), ClinicHoursFormProps, CLINIC_HOURS_COPY (+8 more)

### Community 36 - "schema-helpers.ts"
Cohesion: 0.13
Nodes (19): campaignFieldsSchema, campaignSchema, CampaignSchemaInput, inventoryFieldsSchema, inventorySchema, InventorySchemaInput, patientFieldsSchema, PatientSchemaInput (+11 more)

### Community 37 - "inventory-item-sidebar.tsx"
Cohesion: 0.12
Nodes (23): InventoryDetailHeader(), InventoryDetailHeaderProps, InventoryItemIconDisplay(), InventoryItemSidebar(), InventoryItemSidebarProps, inventoryStockLevelToneClass(), InventoryItemSummary(), InventoryItemSummaryProps (+15 more)

### Community 38 - "calendar-overlap-group-event.tsx"
Cohesion: 0.20
Nodes (14): CalendarOverlapGroupEvent(), CalendarOverlapGroupEventProps, getEmployeeColor(), getEmployeeName(), collectUniqueProfessionalColors(), formatProfessionalSummary(), groupOverlappingAppointments(), groupOverlappingAppointmentsByDay() (+6 more)

### Community 39 - "appointment-create-form.tsx"
Cohesion: 0.15
Nodes (16): AppointmentCreateFormProps, AppointmentPatientOption, AppointmentSlotPicker(), formatSlot(), Props, AppointmentSlotSearchControls(), AppointmentSlotSearchControlsProps, SEARCH_MODE_OPTIONS (+8 more)

### Community 40 - "patient-files-tab.tsx"
Cohesion: 0.15
Nodes (21): categoryOptions, PatientFileCategoryFilter(), PatientFileCategoryFilterProps, PatientFileDeleteConfirmDialog(), PatientFileDeleteConfirmDialogProps, PatientFileEditDialog(), filterFilesByCategory(), PatientFilesTab() (+13 more)

### Community 41 - "inventory-detail-page-client.tsx"
Cohesion: 0.10
Nodes (34): INVENTORY_DETAIL_TAB_ITEMS, InventoryDetailTabBar(), InventoryDetailTabBarProps, InventoryDetailTabContent(), InventoryDetailTabContentProps, InventoryItemEditDialog(), getInventoryDetailMenuSections(), getInventoryDetailPrimaryAction() (+26 more)

### Community 42 - "formatCurrency"
Cohesion: 0.13
Nodes (18): AppointmentDetailTreatmentItem(), AppointmentDetailTreatmentItemProps, FinancesWeeklyRow(), FinancesWeeklyRowProps, TreatmentDetailHeader(), TreatmentDetailHeaderProps, TreatmentDetailInfoSection(), TreatmentDetailInfoSectionProps (+10 more)

### Community 43 - "employees-page-client.tsx"
Cohesion: 0.12
Nodes (31): AppointmentsPageClient(), AppointmentsPageClientProps, AppointmentsAuroraBackdrop(), EMPLOYEE_FILTER_DEFAULTS, EmployeesPageClient(), EmployeesPageClientProps, FinancesPageClient(), INVENTORY_FILTER_DEFAULTS (+23 more)

### Community 44 - "patient-files-store.ts"
Cohesion: 0.12
Nodes (25): createPatientFile(), deletePatientFile(), deletePatientFileRecord(), getGlobalPatientFiles(), getPatientFile(), getPatientFiles(), GlobalPatientFilesParams, PaginatedPatientFiles (+17 more)

### Community 45 - "settings-copy.ts"
Cohesion: 0.13
Nodes (11): ClinicInfoRow(), ClinicInfoRowProps, SettingsClinicHoursPanelProps, SettingsClinicPanelProps, SettingsManagementLink(), SettingsManagementLinkProps, MANAGEMENT_LINKS, SettingsProfileSummaryProps (+3 more)

### Community 46 - "settings-profile-header.tsx"
Cohesion: 0.11
Nodes (18): AppointmentStatusBadgeProps, statusVariants, EmployeeDetailHeader(), EmployeeDetailHeaderProps, SettingsDetailHeader(), SettingsDetailHeaderProps, SettingsProfileHeader(), SettingsProfileHeaderProps (+10 more)

### Community 47 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, build, dev, dev:https, lint, lint:staged, prepare, start (+10 more)

### Community 48 - "use-inventory-adjust-stock-dialog.ts"
Cohesion: 0.11
Nodes (26): formatStockValue(), InventoryAdjustStockPreview(), InventoryAdjustStockPreviewProps, resultingStockToneClass(), InventoryItemAdjustStockDialog(), formatMovementQuantity(), inventoryMovementDotClass(), InventoryMovementRow() (+18 more)

### Community 49 - "useClinicId"
Cohesion: 0.06
Nodes (57): FinancesPage(), transactionTypeForTab(), TransactionCreateForm(), TransactionCreateFormProps, FinancesMonthSelector(), FinancesMonthSelectorProps, financesMonthToParam(), TRANSACTION_CREATE_COPY (+49 more)

### Community 50 - "use-files-page.ts"
Cohesion: 0.11
Nodes (21): categoryOptions, FilesFiltersProps, sortOptions, FilesPagination(), FilesPaginationProps, FileAction, FilesResults(), FilesResultsProps (+13 more)

### Community 51 - "package.json"
Cohesion: 0.25
Nodes (7): lint-staged, *.{ts,tsx}, name, private, version, eslint --fix, prettier --write

### Community 52 - "appointment-datetime.ts"
Cohesion: 0.20
Nodes (17): useCalendarMobileMonth(), ClinicWallDateTimeFields, clinicWallDateToIso(), clinicWallFieldsToIso(), formatClinicDayKey(), getClinicRangeIso(), instantToClinicZonedDateTime(), buildHasAppointmentsOnDay() (+9 more)

### Community 53 - "button.tsx"
Cohesion: 0.08
Nodes (23): Props, LoginAuthTabs(), LoginAuthTabsProps, LoginFormPanelProps, displayValue(), OwnerConfirmationStep(), Props, Props (+15 more)

### Community 54 - "use-campaign-create-dialog.ts"
Cohesion: 0.09
Nodes (30): CampaignSegmentInsert, CampaignSegmentPatient, CampaignSegmentRpcArgs, countCampaignSegmentPatients(), getCampaignSegmentPatients(), toRpcArgs(), CAMPAIGN_STEPS, campaignFormSchema (+22 more)

### Community 55 - "use-active-clinic.ts"
Cohesion: 0.20
Nodes (15): AppointmentReminderRow(), AppointmentReminderRowProps, useServerBootstrap(), SettingsWhatsAppPanel(), ClinicReminderSettingsUpdate, getClinicReminderSettings(), getRemindersForAppointment(), sendManualReminder() (+7 more)

### Community 56 - "owner-clinic-form.ts"
Cohesion: 0.23
Nodes (8): mapOperationalRoleToEmployeeRole(), OperationalRoleOption, operationalRoleOptions, buildCreateClinicPayload(), CreateClinicPayload, OwnerClinicFormValues, OwnerClinicOnlyValues, EmployeeRole

### Community 57 - "dependencies"
Cohesion: 0.05
Nodes (41): class-variance-authority, @hookform/resolvers, lucide-react, match-sorter, next, dependencies, class-variance-authority, @hookform/resolvers (+33 more)

### Community 58 - "appointment-create-dialog.tsx"
Cohesion: 0.12
Nodes (35): AppointmentCreateDialogProps, AppointmentDeleteDialogProps, AppointmentMaterialsOverrideDialogProps, CalendarDayDialogProps, EmployeeEditDialogProps, InventoryItemAdjustStockDialogProps, movementTypeOptions, InventoryItemEditDialogProps (+27 more)

### Community 59 - "useAuth"
Cohesion: 0.20
Nodes (10): NoMembershipPageClient(), createDefaultValues(), useRegisterEmployee(), RegisterEmployeePageClient(), getRegisterCopy(), waitForAuthSessionReady(), useAuth(), buildEmployeeProfileMetadata() (+2 more)

### Community 60 - "patient-file-storage.ts"
Cohesion: 0.14
Nodes (19): PatientFileUploaderDialog(), defaultValues, patientFileFormSchema, usePatientFileUploader(), ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES, CachedSignedUrl, EXTENSION_MIME_MAP (+11 more)

### Community 61 - "before-after-comparison-slider.tsx"
Cohesion: 0.24
Nodes (8): BeforeAfterComparisonContentProps, BeforeAfterComparisonSlider(), BeforeAfterComparisonSliderProps, BeforeAfterOrientation, buildComparisonLabel(), BeforeAfterComparisonToolbar(), BeforeAfterComparisonToolbarProps, usePrefersReducedMotion()

### Community 62 - "utils.ts"
Cohesion: 0.12
Nodes (10): EmployeeDetailTabButton(), EmployeeDetailTabButtonProps, InventoryDetailTabButton(), InventoryDetailTabButtonProps, PatientDetailTabButton(), PatientDetailTabButtonProps, SettingsNavItem(), SettingsNavItemProps (+2 more)

### Community 63 - "app-date-field.tsx"
Cohesion: 0.14
Nodes (13): AppDateField(), AppDateFieldProps, pad(), AppDatePopoverFieldProps, buttonVariants, Calendar(), CalendarDayButton(), Popover() (+5 more)

### Community 64 - "use-clinic-edit-dialog.ts"
Cohesion: 0.26
Nodes (9): ClinicEditDialog(), ClinicEditFormProps, CLINIC_EDIT_COPY, updateClinic(), clinicEditFormSchema, ClinicEditFormValues, EMPTY_DEFAULTS, toFormValues() (+1 more)

### Community 65 - "filters-sheet.tsx"
Cohesion: 0.15
Nodes (13): CalendarOverlapGroupSheet(), CalendarOverlapGroupSheetProps, CalendarOverlapGroupSheetState, FiltersSheet(), FiltersSheetProps, Sheet(), SheetContent(), SheetDescription() (+5 more)

### Community 66 - "settings-layout-client.tsx"
Cohesion: 0.15
Nodes (18): SETTINGS_NAV_ITEMS, SettingsNav(), SettingsNavProps, SettingsSectionContentProps, getSettingsDetailPrimaryAction(), SettingsLayoutClient(), SettingsLayoutClientProps, useUploadProfileAvatar() (+10 more)

### Community 67 - "use-inventory-item-create-dialog.ts"
Cohesion: 0.27
Nodes (8): InventoryItemCreateForm(), InventoryItemCreateFormProps, INVENTORY_ITEM_CREATE_COPY, defaultValues, inventoryFormSchema, InventoryFormValues, useInventoryItemCreateDialog(), useCreateInventoryItem()

### Community 68 - "patient-images-store.ts"
Cohesion: 0.11
Nodes (22): createPatientImage(), deletePatientImage(), getPatientImage(), getPatientImages(), getTreatmentPatientImagesPage(), TreatmentPatientImagesPage, compressTreatmentImage(), getImageDimensions() (+14 more)

### Community 69 - "campaigns.dal.ts"
Cohesion: 0.17
Nodes (20): countCampaignPatients(), getCampaignRecipients(), getCampaignSegments(), replaceCampaignSegments(), buildCopyTitle(), CampaignInsert, CampaignUpdate, duplicateCampaign() (+12 more)

### Community 70 - "patient-image-uploader-form.tsx"
Cohesion: 0.15
Nodes (13): PatientImageTreatmentSelect(), PatientImageTreatmentSelectProps, PatientImageUploaderForm(), PatientImageUploaderFormProps, phaseOptions, NewPatientDateField(), NewPatientDateFieldProps, TreatmentCatalogFilters (+5 more)

### Community 71 - "use-topbar-actions.ts"
Cohesion: 0.22
Nodes (8): InventoryDetailActionHandlers, PatientDetailActionHandlers, SettingsDetailActionHandlers, TreatmentDetailActionHandlers, ProfileAction, ProfileActionSection, TopbarActionButtonConfig, TopbarActionsConfig

### Community 72 - "employees-store.ts"
Cohesion: 0.17
Nodes (15): EmployeeAppointmentRow, EmployeeInviteInput, EmployeeUpdate, getEmployee(), getEmployeeAppointments(), getEmployeeAppointmentStats(), getEmployees(), inviteEmployee() (+7 more)

### Community 73 - "toggle-group.tsx"
Cohesion: 0.36
Nodes (7): ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), toggleGroupItemVariants, toggleGroupVariants, Toggle(), toggleVariants

### Community 74 - "data-table.tsx"
Cohesion: 0.11
Nodes (25): TreatmentDetailInventorySectionProps, formatQuantity(), InventoryOption, TreatmentInventoryLinkRow(), TreatmentInventoryLinkRowDisplayProps, TreatmentInventoryLinkRowFormProps, TreatmentInventoryLinkRowProps, TreatmentInventoryLinksFieldProps (+17 more)

### Community 75 - "patient-files-copy.ts"
Cohesion: 0.12
Nodes (26): FileActionsMenu(), FileActionsMenuProps, buildFilesColumns(), FileAction, FileAction, FilesTable(), FilesTableProps, PatientFileIcon() (+18 more)

### Community 76 - "filter-field.tsx"
Cohesion: 0.14
Nodes (21): FilesDateRangeFilter(), FilesDateRangeFilterProps, formatRangeLabel(), parseDate(), FilesFiltersSheet(), FilesFiltersSheetProps, parseDate(), sortOptions (+13 more)

### Community 77 - "app-topbar.tsx"
Cohesion: 0.31
Nodes (8): PAGE_TITLES_BY_ROUTE, Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator()

### Community 78 - "campaigns-filters.tsx"
Cohesion: 0.17
Nodes (10): CampaignsFiltersProps, CampaignsFiltersSheetProps, CampaignsSheetFilters, statusOptions, statusOptions, useCampaigns(), CAMPAIGN_STATUS_VALUES, MarketingPageFilters (+2 more)

### Community 79 - "use-profile-edit-dialog.ts"
Cohesion: 0.25
Nodes (10): ProfileColorField(), ProfileColorFieldProps, ProfileEditDialog(), ProfileEditFormProps, PROFILE_COLOR_PRESETS, PROFILE_EDIT_COPY, profileEditFormSchema, ProfileEditFormValues (+2 more)

### Community 80 - "PATIENT_GALLERY_COPY"
Cohesion: 0.19
Nodes (10): PatientGalleryDateGroup(), PatientGalleryDateGroupProps, DENSITY_OPTIONS, PatientGalleryDensityToggle(), PatientGalleryDensityToggleProps, PatientGalleryFiltersProps, sortOptions, PATIENT_GALLERY_COPY (+2 more)

### Community 81 - "format.ts"
Cohesion: 0.13
Nodes (19): AppointmentDetailSidebar(), AppointmentDetailSidebarProps, AppointmentHeader(), AppointmentHeaderProps, AppointmentStatusBadge(), employeeColors, employeeRoles, formatAppointmentDay() (+11 more)

### Community 82 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 83 - "use-create-clinic.ts"
Cohesion: 0.17
Nodes (13): Props, RegisterTypePicker(), CreateClinicForm(), Props, defaultValues, CREATE_CLINIC_COPY, REGISTER_COPY, RegisterStep (+5 more)

### Community 84 - "patient-gallery-tab.tsx"
Cohesion: 0.23
Nodes (11): filterImages(), PatientGalleryTab(), PatientGalleryTabProps, usePatientGalleryDensity(), usePatientImages(), getDateGroupLabel(), getSortIndex(), groupImagesByDate() (+3 more)

### Community 85 - "onboarding-intent-store.ts"
Cohesion: 0.22
Nodes (11): RegisterEmployeeSidebar(), RegisterEmployeeSidebarProps, getSidebarCopy(), REGISTER_COPY, REGISTER_EMPLOYEE_FORM_COPY, REGISTER_EMPLOYEE_SIDEBAR_COPY, RegisterCopy, SIDEBAR_COPY (+3 more)

### Community 86 - "mocks.ts"
Cohesion: 0.14
Nodes (13): mockAppointment, mockEmployee, mockInventoryItem, mockPatient, mockTreatment, end, initialState, start (+5 more)

### Community 87 - "register"
Cohesion: 0.22
Nodes (6): register(), AppointmentCreateForm(), OwnerAccountStep(), RegisterEmployeeForm(), ClinicEditForm(), ProfileEditForm()

### Community 88 - "app-layout-client.tsx"
Cohesion: 0.27
Nodes (8): AppLayout(), AppLayoutClient(), AppLayoutClientProps, StoreHydrator(), NotificationsSheet(), hasRegistrationProfile(), getAppBootstrap, useInventoryAlertsStore

### Community 89 - "compilerOptions"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+22 more)

### Community 90 - "use-owner-registration.ts"
Cohesion: 0.19
Nodes (10): getDefaultValues(), OwnerRegistrationStep, SubmissionStage, syncAuthenticatedUser(), useOwnerRegistration(), OwnerRegistrationPageClient(), captureEvent(), buildCreateClinicPayloadFromProfile() (+2 more)

### Community 91 - "dropdown-menu.tsx"
Cohesion: 0.14
Nodes (13): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+5 more)

### Community 92 - "context-menu.tsx"
Cohesion: 0.14
Nodes (12): PatientGalleryImageThumbProps, ContextMenu(), ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator() (+4 more)

### Community 93 - "use-employees.ts"
Cohesion: 0.27
Nodes (12): EmployeeStatusConfirmDialog(), EmployeeStatusConfirmDialogProps, EmployeeDetailPageClient(), EMPLOYEE_STATUS_COPY, useCreateEmployee(), useEmployee(), useEmployeeAppointments(), useEmployeeAppointmentStats() (+4 more)

### Community 94 - "invite-team-page-client.tsx"
Cohesion: 0.14
Nodes (23): InviteTeamPageClient(), useAcceptInvitation(), usePostAuthRedirect(), useRegisterType(), normalizeInviteEmails(), validateInviteEmails(), navigateAfterAuth(), externalMemberships() (+15 more)

### Community 95 - "employee-profile-header.tsx"
Cohesion: 0.11
Nodes (32): EmployeeAvatarDisplay(), EmployeeAvatarDisplayProps, getAvatarStyle(), EmployeeProfileHeader(), EmployeeProfileHeaderProps, getAvatarStyle(), PatientDetailHeader(), PatientDetailHeaderProps (+24 more)

### Community 96 - "use-appointment-create-dialog.ts"
Cohesion: 0.20
Nodes (14): AppointmentCreateDialog(), createDefaultStartsAt(), createDefaultValues(), isClinicOpenOnDate(), isPastInstant(), isWithinClinicHours(), jsDateToIsoDay(), useAppointmentCreateDialog() (+6 more)

### Community 97 - "use-treatment-images.ts"
Cohesion: 0.20
Nodes (10): TreatmentImageGalleryProps, TreatmentImageThumbnailProps, TreatmentImagesSection(), TreatmentImagesSectionProps, EMPTY_IMAGES, useTreatmentImages(), TreatmentImageGalleryItem, TREATMENT_DETAIL_COPY (+2 more)

### Community 98 - "employee-schema.ts"
Cohesion: 0.13
Nodes (15): EmployeeInviteForm(), EmployeeInviteFormProps, roleOptions, EMPLOYEE_INVITE_COPY, defaultValues, EmployeeFormValues, clinicMembershipInvitationRoleSchema, employeeFieldsSchema (+7 more)

### Community 99 - "patient-detail-page-client.tsx"
Cohesion: 0.31
Nodes (13): getPatientDetailMenuSections(), getPatientDetailPrimaryAction(), PatientDetailPageClient(), PatientDetailPageClientProps, usePatientDetailTabs(), usePatient(), usePatientAppointments(), usePatients() (+5 more)

### Community 102 - "calendar-view-mode-toggle.tsx"
Cohesion: 0.33
Nodes (4): e2eUser, playwrightResult, status, statusResult

### Community 106 - "getServerActiveClinicId"
Cohesion: 0.14
Nodes (24): AppointmentDetailPage(), AppointmentsPage(), CalendarPage(), DashboardPage(), EmployeesPage(), InventoryPage(), PatientsPage(), SettingsLayout() (+16 more)

### Community 107 - "app-sidebar-nav-item.tsx"
Cohesion: 0.19
Nodes (11): AppSidebarNavItem(), AppSidebarNavItemProps, AppSidebarNavPending(), AppSidebarNavSubmenu(), AppSidebarNavSubmenuProps, SidebarMenuItem(), SidebarMenuSub(), SidebarMenuSubButton() (+3 more)

### Community 108 - "use-clinic-info.ts"
Cohesion: 0.21
Nodes (12): ExistingAppointment, findAvailableSlots(), getDateKey(), getSlotSearchRange(), nextOpenDayOpening(), parseHHMM(), roundUpToStep(), sampleEvenly() (+4 more)

### Community 109 - "bootstrap.ts"
Cohesion: 0.10
Nodes (27): EmployeeDetailPage(), GET(), config, proxy(), publicRoutes, pwaRoutes, ClinicMembershipRow, getMemberships() (+19 more)

### Community 110 - "inventory-filters-sheet.tsx"
Cohesion: 0.14
Nodes (12): InventoryFilters, InventoryFiltersSheet(), InventoryFiltersSheetProps, stockOptions, InventoryStockSummaryProps, InventoryStockSummaryItemProps, StockTone, toneActive (+4 more)

### Community 111 - "dashboard-page-client.tsx"
Cohesion: 0.24
Nodes (8): CalendarDayDialog(), DashboardAgendaProps, DashboardHeader(), DashboardHeaderProps, DashboardRecentActivityProps, DASHBOARD_COPY, DashboardPageClientProps, formatFullDayLabel()

### Community 113 - "AppointmentWithRelations"
Cohesion: 0.27
Nodes (12): useAppointmentDetail(), useAppointment(), useAppointmentInventoryItems(), useCreateAppointment(), useReplaceAppointmentInventoryItems(), useRescheduleAppointment(), useUpdateAppointment(), useUpdateAppointmentStatus() (+4 more)

### Community 114 - "unwrapSupabaseList"
Cohesion: 0.10
Nodes (27): InventoryItemDetailPage(), PatientDetailPage(), TreatmentDetailPage(), TreatmentsPage(), getTodayAppointments(), getInventoryItem(), getInventoryMovements(), getPatientAppointments() (+19 more)

### Community 115 - "use-login.ts"
Cohesion: 0.28
Nodes (7): LoginFormPanel(), useLogin(), LoginPageClient(), RedirectScreen(), AUTH_ERROR_COPY, getAuthErrorMessage(), signInWithGoogleFlow()

### Community 116 - "employee-invite-errors.ts"
Cohesion: 0.31
Nodes (10): createEmployeeInviteError(), EMPLOYEE_INVITE_ERROR_MESSAGES, EMPLOYEE_INVITE_STATUS_MESSAGES, EmployeeInviteErrorBody, getDictionaryMessage(), getErrorCandidates(), getNestedMessage(), getStringValue() (+2 more)

### Community 117 - "register-employee-form.tsx"
Cohesion: 0.10
Nodes (24): PasswordInput(), PasswordInputProps, LoginFormFields(), LoginFormFieldsProps, Props, OwnerClinicStep(), Props, OwnerRegistrationProgress() (+16 more)

### Community 118 - "use-appointment-materials-override-dialog.ts"
Cohesion: 0.22
Nodes (11): AppointmentMaterialsOverrideDialog(), AppointmentMaterialsOverrideForm(), AppointmentMaterialsOverrideFormProps, hasInsufficientStock(), toFormValues(), useAppointmentMaterialsOverrideDialog(), APPOINTMENT_DETAIL_COPY, appointmentInventoryLinkSchema (+3 more)

### Community 119 - "campaign-detail-page-client.tsx"
Cohesion: 0.24
Nodes (7): CampaignDetailPageClient(), useTopbarBreadcrumb(), TopbarAction, TopbarActionStore, TopbarBreadcrumb, TopbarMenu, useTopbarActionStore

### Community 120 - "treatment-detail-page-client.tsx"
Cohesion: 0.36
Nodes (6): getTreatmentDetailMenuSections(), getTreatmentDetailPrimaryAction(), TreatmentDetailPageClient(), TreatmentDetailPageClientProps, BackButton(), BackButtonProps

### Community 121 - "app-searchable-multi-select.tsx"
Cohesion: 0.28
Nodes (5): AppSearchableMultiSelectOption, AppSearchableMultiSelectProps, AppSearchableMultiSelectOption(), AppSearchableMultiSelectOptionProps, COMBOBOX_COPY

### Community 122 - "formatDate"
Cohesion: 0.15
Nodes (22): DashboardRecentActivity(), EmployeeAppointmentRow(), EmployeeAppointmentRowProps, EmployeeTimeline(), EmployeeTimelineProps, mapAppointmentsToTimelineItems(), mapAppointmentsToTimelineItems(), PatientTimeline() (+14 more)

### Community 123 - "clinic-store.ts"
Cohesion: 0.12
Nodes (16): ServerBootstrapContext, ServerBootstrapState, StoreHydratorProps, SidebarClinicSwitcherProps, ClinicMembershipRow, getClinicById(), getMemberships(), updateClinicHours() (+8 more)

### Community 124 - "patient-image-viewer.tsx"
Cohesion: 0.47
Nodes (5): PatientImageViewer(), PatientImageViewerProps, toLightboxIndex(), toSourceIndex(), PatientImageViewerSlide

### Community 125 - "page-filters-bar.tsx"
Cohesion: 0.07
Nodes (28): EmployeesFiltersProps, roleOptions, EmployeeFilters, EmployeesFiltersSheet(), EmployeesFiltersSheetProps, roleOptions, statusOptions, statusOptions (+20 more)

### Community 126 - "boot-loading-screen.tsx"
Cohesion: 0.11
Nodes (17): BootLoadingScreen(), BootLoadingScreenProps, LoaderProgressBar(), LoaderProgressBarProps, LoaderRedirectCheckBadge(), LoaderRedirectVisual(), LoaderStatusList(), LoaderStatusListProps (+9 more)

### Community 127 - "appointment-detail-page-client.tsx"
Cohesion: 0.29
Nodes (10): AppointmentDetailActionHandlers, AppointmentDetailTopbarParams, getAppointmentDetailMenuSections(), getAppointmentDetailPrimaryAction(), resolvePrimaryLabel(), AppointmentDetailPageClient(), AppointmentDetailPageClientProps, resolveTotalDurationMinutes() (+2 more)

### Community 128 - "use-patient-image-uploader.ts"
Cohesion: 0.24
Nodes (9): PatientImageUploaderDialog(), createSelectedFilesStore(), defaultValues, patientImageFormSchema, usePatientImageUploader(), patientImagePhaseSchema, patientImageTreatmentIdSchema, PatientImageUploadInput (+1 more)

### Community 129 - "settings-account-panel.tsx"
Cohesion: 0.28
Nodes (6): SettingsAccountPanel(), SettingsAccountPanelProps, SettingsActionRow(), SettingsActionRowProps, SettingsUserPanel(), SettingsUserPanelProps

### Community 130 - "devDependencies"
Cohesion: 0.05
Nodes (41): eslint, eslint-config-next, husky, jsdom, lint-staged, devDependencies, eslint, eslint-config-next (+33 more)

### Community 131 - "github"
Cohesion: 0.40
Nodes (4): GITHUB_PERSONAL_ACCESS_TOKEN, npx, github, @modelcontextprotocol/server-github

### Community 132 - "patient-gallery-filters-sheet.tsx"
Cohesion: 0.40
Nodes (4): PatientGalleryFiltersSheet(), PatientGalleryFiltersSheetProps, PatientGalleryFilterValues, sortOptions

### Community 133 - "app-dialog-content.tsx"
Cohesion: 0.24
Nodes (5): BeforeAfterComparisonProps, AppDialogClose(), AppDialogCloseProps, AppDialogContentProps, APP_DIALOG_COPY

### Community 134 - "use-patient-images.ts"
Cohesion: 0.22
Nodes (14): BeforeAfterComparisonImage(), BeforeAfterComparisonImageProps, PatientGalleryImageThumb(), PatientImageDeleteConfirmDialog(), PatientImageDeleteConfirmDialogProps, getImageUrl(), useDeletePatientImage(), usePatientImageUrl() (+6 more)

### Community 136 - "app-search-bar-input.tsx"
Cohesion: 0.40
Nodes (6): AppSearchBarInput(), AppSearchBarInputProps, useDebouncedValue(), useSearch(), TopbarSearchState, useTopbarSearchStore

### Community 137 - "notifySuccess"
Cohesion: 0.15
Nodes (18): PatientEditDialog(), TreatmentDeleteConfirmDialog(), TreatmentDeleteConfirmDialogProps, PATIENT_EDIT_COPY, defaultValues, patientFormSchema, usePatientCreateDialog(), patientFormSchema (+10 more)

### Community 139 - "campaign-image-storage.ts"
Cohesion: 0.19
Nodes (12): CampaignDetailImage(), CampaignDetailImageProps, CampaignImageCell(), CampaignImageCellProps, CampaignImageDialog(), buildCampaignImageKey(), copyCampaignImage(), extensionFromMimeType() (+4 more)

### Community 140 - "whatsapp.ts"
Cohesion: 0.12
Nodes (12): baseMessage, corsHeaders, SegmentPatient, corsHeaders, postToTwilio(), resolveWhatsAppMode(), sendWhatsApp(), VALID_MODES (+4 more)

### Community 141 - "campaign-reach-summary.tsx"
Cohesion: 0.29
Nodes (6): CampaignReachSummary(), CampaignReachSummaryProps, Stat(), StatProps, StatTone, toneClasses

### Community 145 - "table-mobile-columns.tsx"
Cohesion: 0.09
Nodes (22): employeesColumns, EmployeesTable(), EmployeesTableProps, transactionsColumns, TransactionsTable(), TransactionsTableProps, inventoryColumns, InventoryTable() (+14 more)

### Community 151 - "use-app-nav-items.tsx"
Cohesion: 0.17
Nodes (12): AppBottomNav(), AppBottomNavItem(), AppBottomNavItemProps, APP_SIDEBAR_COPY, AppNavSectionId, BOTTOM_NAV_COPY, BASE_NAV_ITEMS, NAV_SECTION_ORDER (+4 more)

### Community 155 - "campaigns-columns.tsx"
Cohesion: 0.16
Nodes (14): CampaignDetailHeader(), CampaignDetailHeaderProps, CampaignDateCell(), CampaignDateCellProps, CampaignStatusBadge(), CampaignStatusBadgeProps, statusVariants, buildCampaignsColumns() (+6 more)

### Community 156 - "appointment-person-avatar.tsx"
Cohesion: 0.38
Nodes (4): AppointmentHeaderPersonProps, AppointmentPersonAvatar(), AppointmentPersonAvatarProps, getInitials()

### Community 157 - "loader-spinner.tsx"
Cohesion: 0.33
Nodes (5): LoaderOrbitalVisual(), LoaderSpinner(), LoaderSpinnerProps, LoaderSpinnerSize, SPINNER_SIZES

### Community 159 - "use-pending-clinic-requests.ts"
Cohesion: 0.53
Nodes (4): normalizeEmail(), PendingClinicRequest, usePendingClinicRequests(), UsePendingClinicRequestsResult

### Community 160 - "e2e-helpers.ts"
Cohesion: 0.16
Nodes (16): createAndGoToAppointmentDetail(), authDirectory, authFile, E2E_DATA, E2E_TINY_PNG, E2E_USER, clickPatientTableRow(), clickTopbarMenuAction() (+8 more)

### Community 164 - "formatZodError"
Cohesion: 0.20
Nodes (13): EmployeeColorField(), EmployeeColorFieldProps, EmployeeEditDialog(), EmployeeEditForm(), EmployeeEditFormProps, roleOptions, EMPLOYEE_COLOR_PRESETS, EMPLOYEE_EDIT_COPY (+5 more)

### Community 171 - "use-schedule-x-calendar.ts"
Cohesion: 0.11
Nodes (34): CalendarWeekUiRefs, updateCalendarWeekUiRefs(), CalendarEmptyHeader(), CalendarEventProps, CalendarTimeGridEvent(), CalendarWeekGridDate(), buildClinicBackgroundEvents(), buildScheduleEventsForViewMode() (+26 more)

### Community 174 - "finances-page-client.tsx"
Cohesion: 0.08
Nodes (24): CategoryBreakdownItem, FinancesCategoryBreakdownProps, FinancesCategoryRow(), FinancesCategoryRowProps, FinancesFilters(), FinancesFiltersProps, FinancesFilters, FinancesFiltersSheet() (+16 more)

### Community 193 - "hyperframes.json"
Cohesion: 0.20
Nodes (9): authoringSkill, media, autoProxy, paths, assets, blocks, components, registry (+1 more)

### Community 233 - "calendar-page-client.tsx"
Cohesion: 0.09
Nodes (35): CalendarEmployeeFilter(), CalendarEmployeeFilterProps, CALENDAR_FILTER_DEFAULTS, CalendarPageClient(), CalendarPageClientProps, CLOSED_GROUP_SHEET, CalendarFilters, CalendarFiltersSheet() (+27 more)

### Community 235 - "scripts"
Cohesion: 0.22
Nodes (8): name, private, scripts, check, dev, publish, render, type

### Community 240 - "capture-product.mjs"
Cohesion: 0.40
Nodes (4): captureDir, captures, projectDir, scriptDir

### Community 263 - "supabase.ts"
Cohesion: 0.15
Nodes (17): AuthProviderProps, getClientHydratedSnapshot(), getServerHydratedSnapshot(), subscribeToClientHydration(), useAuthHydrated(), getEmployeeProfile(), ProfileUpdate, updateEmployeeAvatar() (+9 more)

## Knowledge Gaps
- **868 isolated node(s):** `npx`, `@modelcontextprotocol/server-github`, `GITHUB_PERSONAL_ACCESS_TOKEN`, `SettingsLayoutProps`, `Props` (+863 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `FilterField`, `app-dialog-content.tsx`, `useActiveClinicTimezone`, `sidebar.tsx`, `skeleton.tsx`, `loader-spinner.tsx`, `dropzone.tsx`, `formatZodError`, `calendar-overlap-group-event.tsx`, `use-schedule-x-calendar.ts`, `employees-page-client.tsx`, `settings-profile-header.tsx`, `button.tsx`, `appointment-create-dialog.tsx`, `utils.ts`, `app-date-field.tsx`, `filters-sheet.tsx`, `toggle-group.tsx`, `data-table.tsx`, `patient-files-copy.ts`, `filter-field.tsx`, `app-topbar.tsx`, `use-profile-edit-dialog.ts`, `dropdown-menu.tsx`, `context-menu.tsx`, `calendar-page-client.tsx`, `app-sidebar-nav-item.tsx`, `register-employee-form.tsx`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `browser-image-compression`, `clsx`, `sidebar.tsx`, `cuelume`, `date-fns`, `date-fns-tz`, `@schedule-x/calendar`, `@base-ui/react`, `@radix-ui/react-dialog`, `preact`, `radix-ui`, `react-compare-slider`, `react-dom`, `react-dropzone`, `react-toastify`, `package.json`, `@schedule-x/events-service`, `@schedule-x/react`, `@sentry/nextjs`, `server-only`, `@supabase/supabase-js`, `tailwind-merge`, `temporal-polyfill`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `Button()` connect `button.tsx` to `settings-account-panel.tsx`, `FilterField`, `cn`, `Patient`, `app-search-bar-input.tsx`, `sidebar.tsx`, `patient-create-form.tsx`, `appointment-materials-section.tsx`, `reset-password/page.client.tsx`, `table-mobile-columns.tsx`, `dropzone.tsx`, `appointments-columns.tsx`, `formatZodError`, `employees-page-client.tsx`, `finances-page-client.tsx`, `settings-profile-header.tsx`, `useClinicId`, `use-files-page.ts`, `use-active-clinic.ts`, `appointment-create-dialog.tsx`, `useAuth`, `before-after-comparison-slider.tsx`, `utils.ts`, `app-date-field.tsx`, `filters-sheet.tsx`, `use-topbar-actions.ts`, `data-table.tsx`, `patient-files-copy.ts`, `filter-field.tsx`, `app-topbar.tsx`, `use-profile-edit-dialog.ts`, `use-create-clinic.ts`, `dropdown-menu.tsx`, `invite-team-page-client.tsx`, `employee-profile-header.tsx`, `use-treatment-images.ts`, `calendar-page-client.tsx`, `register-employee-form.tsx`, `use-appointment-materials-override-dialog.ts`, `treatment-detail-page-client.tsx`, `app-searchable-multi-select.tsx`, `clinic-store.ts`, `page-filters-bar.tsx`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **What connects `npx`, `@modelcontextprotocol/server-github`, `GITHUB_PERSONAL_ACCESS_TOKEN` to the rest of the system?**
  _868 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `database.types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `FilterField` be split into smaller, more focused modules?**
  _Cohesion score 0.1265597147950089 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.10810810810810811 - nodes in this community are weakly interconnected._