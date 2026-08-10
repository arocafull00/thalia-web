# Graph Report - thalia-web  (2026-08-05)

## Corpus Check
- 796 files · ~320,789 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3194 nodes · 9022 edges · 197 communities (135 shown, 62 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 37 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7c7cfa1d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- database.types.ts
- utils.ts
- useActiveClinicTimezone
- cn
- AppointmentWithRelations
- calendar-grid.ts
- app-layout-client.tsx
- format.ts
- use-app-nav-items.tsx
- campaign-create-form.tsx
- sidebar.tsx
- sidebar-profile-footer.tsx
- pwa-install-content.tsx
- appointment-detail-page-client.tsx
- employees-store.ts
- Employee
- notice.tsx
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
- appointment-status-error-toast.tsx
- use-clinic-hours-dialog.ts
- schema-helpers.ts
- inventory-item-sidebar.tsx
- calendar-overlap-group-event.tsx
- use-appointment-create-dialog.ts
- patient-files.dal.ts
- inventory-detail-page-client.tsx
- formatCurrency
- employees-page-client.tsx
- patient-files-store.ts
- settings-copy.ts
- employee-profile-header.tsx
- scripts
- use-inventory-adjust-stock-dialog.ts
- settings-profile-panel.tsx
- use-files-page.ts
- package.json
- calendar-agenda.ts
- invite-page-client.tsx
- use-campaign-create-dialog.ts
- login-hero-panel.tsx
- treatment-store.ts
- dependencies
- appointment-create-dialog.tsx
- appointments-columns.tsx
- patient-file-storage.ts
- before-after-comparison-slider.tsx
- button.tsx
- app-date-field.tsx
- settings-layout-client.tsx
- filters-sheet.tsx
- settings-section-content.tsx
- appointment-reminder-row.tsx
- patient-images-store.ts
- campaigns.dal.ts
- use-patient-image-uploader.ts
- campaigns-columns.tsx
- schedule-x-calendar.tsx
- toggle-group.tsx
- data-table.tsx
- patient-file-row.tsx
- files-filters-sheet.tsx
- app-topbar.tsx
- campaigns-filters.tsx
- register
- PATIENT_GALLERY_COPY
- files-results.tsx
- components.json
- use-create-clinic.ts
- patient-gallery-tab.tsx
- onboarding-intent-store.ts
- inventory-store.ts
- campaign-detail-header.tsx
- app-layout-client.tsx
- compilerOptions
- invite-team-page-client.tsx
- dropdown-menu.tsx
- finances-page-client.tsx
- patient-create-form.tsx
- useAuth
- use-patient-create-dialog.ts
- appointments-panel-footer.tsx
- use-treatment-images.ts
- patient-image-viewer.tsx
- browser-image-compression
- calendar-view-mode-toggle.tsx
- patient-image-viewer.tsx
- bootstrap.ts
- inventory-filters-sheet.tsx
- isInitialLoading
- unwrapSupabaseList
- employee-invite-errors.ts
- treatment-detail-page-client.tsx
- app-searchable-multi-select.tsx
- formatDate
- use-active-clinic.ts
- filter-field.tsx
- boot-loading-screen.tsx
- devDependencies
- github
- class-variance-authority
- app-dialog-content.tsx
- use-patient-images.ts
- eslint-config-next
- logger.ts
- notifySuccess
- clsx
- useCampaignImageUrl
- whatsapp.ts
- campaign-reach-summary.tsx
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
- @radix-ui/themes
- react-day-picker
- react-compare-slider
- use-schedule-x-calendar.ts
- react-hook-form
- react-dom
- finances-store.ts
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
1. `cn()` - 178 edges
2. `Button()` - 99 edges
3. `unwrapSupabaseList()` - 56 edges
4. `useActiveClinicTimezone()` - 48 edges
5. `AppointmentWithRelations` - 46 edges
6. `Employee` - 44 edges
7. `unwrapSupabase()` - 43 edges
8. `useClinicId()` - 41 edges
9. `notifySuccess()` - 41 edges
10. `useAuth()` - 40 edges

## Surprising Connections (you probably didn't know these)
- `AppointmentCreateForm()` --calls--> `register()`  [INFERRED]
  src/components/appointments/components/appointment-create-form.tsx → instrumentation.ts
- `OwnerAccountStep()` --calls--> `register()`  [INFERRED]
  src/components/auth/register/components/owner-account-step.tsx → instrumentation.ts
- `OwnerClinicStep()` --calls--> `register()`  [INFERRED]
  src/components/auth/register/components/owner-clinic-step.tsx → instrumentation.ts
- `RegisterEmployeeForm()` --calls--> `register()`  [INFERRED]
  src/components/auth/register-employee/components/register-employee-form.tsx → instrumentation.ts
- `EmployeeEditForm()` --calls--> `register()`  [INFERRED]
  src/components/employees/components/form/employee-edit-form.tsx → instrumentation.ts

## Import Cycles
- 3-file cycle: `src/lib/active-clinic-id.ts -> src/stores/auth-store.ts -> src/stores/employees-store.ts -> src/lib/active-clinic-id.ts`

## Communities (197 total, 62 thin omitted)

### Community 0 - "database.types.ts"
Cohesion: 0.12
Nodes (15): AppointmentInventoryItem, AppointmentInventoryItemWithStock, AppointmentReminderStatus, AppointmentTreatment, AppointmentTreatmentInventoryItemWithStock, CampaignRecipient, CampaignTemplate, CampaignTemplateApprovalStatus (+7 more)

### Community 1 - "utils.ts"
Cohesion: 0.11
Nodes (20): AppointmentTimeField(), AppointmentTimeFieldProps, pad(), PasswordInput(), PasswordInputProps, Props, EmployeeDetailTabButton(), EmployeeDetailTabButtonProps (+12 more)

### Community 2 - "useActiveClinicTimezone"
Cohesion: 0.16
Nodes (21): AppointmentDateRange(), AppointmentDateRangeProps, formatAppointmentDateParam(), formatAppointmentDateRangeLabel(), getDefaultAppointmentDateRange(), parseAppointmentDateParam(), AppointmentEmployeeFilterProps, AppointmentFilters() (+13 more)

### Community 3 - "cn"
Cohesion: 0.07
Nodes (42): OwnerRegistrationProgress(), AppSearchableCombobox(), AppSearchableComboboxOption, AppSearchableComboboxProps, AppSearchableComboboxItem(), AppSearchableComboboxItemProps, Avatar(), AvatarBadge() (+34 more)

### Community 4 - "AppointmentWithRelations"
Cohesion: 0.08
Nodes (30): PatientDetailStatsProps, PatientDetailStatsRow(), PATIENT_DETAIL_TAB_ITEMS, PatientDetailTabBarProps, PatientDetailTabButton(), PatientDetailTabContentProps, PatientStatCard(), PatientStatCardProps (+22 more)

### Community 5 - "calendar-grid.ts"
Cohesion: 0.19
Nodes (17): DashboardHeader(), DashboardHeaderProps, DASHBOARD_COPY, appointmentLayout(), formatDayHeader(), formatMonthLabel(), formatWeekRange(), getDayEnd() (+9 more)

### Community 7 - "format.ts"
Cohesion: 0.08
Nodes (32): AppointmentDetailCard(), AppointmentDetailCardProps, AppointmentDetailSidebar(), AppointmentDetailSidebarProps, AppointmentDetailTreatmentItem(), AppointmentDetailTreatmentItemProps, AppointmentHeader(), AppointmentHeaderProps (+24 more)

### Community 8 - "use-app-nav-items.tsx"
Cohesion: 0.10
Nodes (19): AppBottomNav(), AppBottomNavItem(), AppBottomNavItemProps, AppSidebar(), AppSidebarNavItemProps, AppSidebarNavPending(), AppSidebarNavSubmenuProps, SidebarMenuItem() (+11 more)

### Community 9 - "campaign-create-form.tsx"
Cohesion: 0.16
Nodes (13): CampaignCreateFormProps, CampaignMessageFields(), CampaignMessageFieldsProps, CampaignRecipientsPreview(), CampaignRecipientsPreviewProps, resolveMessage(), CampaignSegmentFields(), CampaignSegmentFieldsProps (+5 more)

### Community 10 - "sidebar.tsx"
Cohesion: 0.07
Nodes (35): react, react, AppBackdrop(), AppShell(), AppShellProps, AppSidebarNavSectionProps, useComboboxAnchor(), Separator() (+27 more)

### Community 11 - "sidebar-profile-footer.tsx"
Cohesion: 0.29
Nodes (4): SidebarClinicSwitcherProps, SidebarSignOutConfirmDialog(), SidebarSignOutConfirmDialogProps, SIDEBAR_COPY

### Community 12 - "pwa-install-content.tsx"
Cohesion: 0.11
Nodes (18): geistMono, geistSans, metadata, viewport, PwaInstallProvider(), PwaInstallProviderProps, ServiceWorkerProviderProps, PwaInstallContent() (+10 more)

### Community 13 - "appointment-detail-page-client.tsx"
Cohesion: 0.09
Nodes (24): AppointmentDetailPageClient(), AppointmentDetailPageClientProps, resolveTotalDurationMinutes(), AppointmentMaterialsOverrideDialog(), AppointmentMaterialsOverrideForm(), AppointmentMaterialsOverrideFormProps, hasInsufficientStock(), AppointmentMaterialsSection() (+16 more)

### Community 14 - "employees-store.ts"
Cohesion: 0.13
Nodes (23): EmployeeInviteInput, EmployeeUpdate, getEmployee(), getEmployeeAppointments(), getEmployeeAppointmentStats(), getEmployees(), getInventoryAlerts(), markInventoryAlertsAsRead() (+15 more)

### Community 15 - "Employee"
Cohesion: 0.12
Nodes (20): EmployeeDetailHeaderProps, EMPLOYEE_DETAIL_TAB_ITEMS, EmployeeDetailTabBarProps, EmployeeDetailTabContentProps, EmployeeProfileSidebarProps, EmployeeProfileSummary(), EmployeeProfileSummaryProps, EmployeeQuickActions() (+12 more)

### Community 16 - "notice.tsx"
Cohesion: 0.11
Nodes (19): ForgotPasswordPageClient(), LoginAuthTabs(), LoginAuthTabsProps, LoginFormFields(), LoginFormFieldsProps, LoginFormPanelProps, Props, ResetPasswordOpeningSession() (+11 more)

### Community 28 - "appointments-store.ts"
Cohesion: 0.13
Nodes (22): AppointmentInsert, AppointmentInventoryLinkInput, AppointmentTreatmentInsert, AppointmentUpdate, deleteAppointment(), deleteAppointmentTreatments(), EffectiveAppointmentMaterial, getAppointment() (+14 more)

### Community 31 - "dropzone.tsx"
Cohesion: 0.06
Nodes (48): CampaignImageDropzoneFileItemProps, CampaignImageField(), CampaignImageFieldProps, PatientFileUploaderDropzoneFileItem(), PatientFileUploaderDropzoneFileItemProps, PatientFileUploaderForm(), PatientFileUploaderFormProps, PatientImageUploaderDropzoneFileItemProps (+40 more)

### Community 33 - "appointment-status-error-toast.tsx"
Cohesion: 0.14
Nodes (21): AppointmentRowProps, AppointmentStatusErrorToast(), AppointmentStatusErrorToastProps, notifyAppointmentStatusError(), AppointmentStockButton(), AppointmentStockButtonProps, APPOINTMENT_STATUS_COPY, ControlledAppointmentError (+13 more)

### Community 35 - "use-clinic-hours-dialog.ts"
Cohesion: 0.17
Nodes (15): ClinicHoursConflictList(), formatDate(), Props, resolveName(), ClinicHoursDialog(), ClinicHoursFormProps, CLINIC_HOURS_COPY, FutureAppointmentConflict (+7 more)

### Community 36 - "schema-helpers.ts"
Cohesion: 0.06
Nodes (44): PatientEditDialog(), PATIENT_EDIT_COPY, patientFormSchema, toFormValues(), usePatientEditDialog(), appointmentCommonFieldsSchema, appointmentFormSchema, appointmentSchema (+36 more)

### Community 37 - "inventory-item-sidebar.tsx"
Cohesion: 0.10
Nodes (27): InventoryDetailHeader(), InventoryDetailHeaderProps, InventoryItemIconDisplay(), InventoryItemSidebar(), InventoryItemSidebarProps, inventoryStockLevelToneClass(), InventoryItemSummary(), InventoryItemSummaryProps (+19 more)

### Community 38 - "calendar-overlap-group-event.tsx"
Cohesion: 0.18
Nodes (15): CalendarOverlapGroupEvent(), CalendarOverlapGroupEventProps, getEmployeeColor(), getEmployeeName(), collectUniqueProfessionalColors(), formatProfessionalSummary(), groupOverlappingAppointments(), groupOverlappingAppointmentsByDay() (+7 more)

### Community 39 - "use-appointment-create-dialog.ts"
Cohesion: 0.09
Nodes (43): AppointmentCreateDialog(), AppointmentCreateFormProps, AppointmentPatientOption, AppointmentSlotPicker(), formatSlot(), Props, AppointmentSlotSearchControls(), AppointmentSlotSearchControlsProps (+35 more)

### Community 40 - "patient-files.dal.ts"
Cohesion: 0.10
Nodes (32): categoryOptions, PatientFileCategoryFilter(), PatientFileCategoryFilterProps, PatientFileDeleteConfirmDialog(), PatientFileDeleteConfirmDialogProps, PatientFileEditDialog(), filterFilesByCategory(), PatientFilesTab() (+24 more)

### Community 41 - "inventory-detail-page-client.tsx"
Cohesion: 0.12
Nodes (20): INVENTORY_DETAIL_TAB_ITEMS, InventoryDetailTabBarProps, InventoryDetailTabButton(), InventoryDetailTabContentProps, InventoryItemEditDialog(), InventoryDetailPageClientProps, InventoryDetailTabId, useInventoryDetailTabs() (+12 more)

### Community 42 - "formatCurrency"
Cohesion: 0.12
Nodes (20): FinancesWeeklyRow(), FinancesWeeklyRowProps, TreatmentColorField(), TreatmentColorFieldProps, TreatmentDetailHeader(), TreatmentDetailHeaderProps, TreatmentDetailInfoSection(), TreatmentDetailInfoSectionProps (+12 more)

### Community 43 - "employees-page-client.tsx"
Cohesion: 0.09
Nodes (23): AppointmentsPageClientProps, DashboardPageClientProps, EMPLOYEE_FILTER_DEFAULTS, EmployeesPageClientProps, INVENTORY_FILTER_DEFAULTS, InventoryPageClientProps, MARKETING_FILTER_DEFAULTS, PATIENT_FILTER_DEFAULTS (+15 more)

### Community 44 - "patient-files-store.ts"
Cohesion: 0.15
Nodes (16): createPatientFile(), getPatient(), defaultValues, patientFileFormSchema, buildPatientFileKey(), uploadPatientFileObject(), PatientFileCategoryOption, patientFileCategorySchema (+8 more)

### Community 45 - "settings-copy.ts"
Cohesion: 0.11
Nodes (15): ClinicInfoRow(), ClinicInfoRowProps, SettingsClinicHoursPanelProps, SettingsClinicPanelProps, SettingsManagementLink(), SettingsManagementLinkProps, MANAGEMENT_LINKS, SettingsProfileQuickActions() (+7 more)

### Community 46 - "employee-profile-header.tsx"
Cohesion: 0.15
Nodes (14): EmployeeDetailHeader(), EmployeeProfileHeader(), EmployeeProfileHeaderProps, getAvatarStyle(), SettingsDetailHeaderProps, SettingsProfileHeader(), SettingsProfileHeaderProps, SettingsProfileSidebarProps (+6 more)

### Community 47 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, build, dev, dev:https, lint, lint:staged, prepare, start (+10 more)

### Community 48 - "use-inventory-adjust-stock-dialog.ts"
Cohesion: 0.16
Nodes (16): formatStockValue(), InventoryAdjustStockPreview(), InventoryAdjustStockPreviewProps, resultingStockToneClass(), InventoryItemAdjustStockDialog(), INVENTORY_ITEM_DETAIL_COPY, defaultValues, InventoryAdjustStockItem (+8 more)

### Community 49 - "settings-profile-panel.tsx"
Cohesion: 0.15
Nodes (16): PatientDetailHeader(), PatientDetailHeaderProps, SettingsProfilePanel(), SettingsProfilePanelProps, ProfileAvatarImage(), ProfileAvatarImageProps, sizeClasses, sizeHints (+8 more)

### Community 50 - "use-files-page.ts"
Cohesion: 0.16
Nodes (14): PATIENT_FILE_CATEGORY_OPTIONS, GlobalPatientFilesParams, FILES_FILTER_DEFAULTS, parseCategory(), parseDate(), parsePage(), parseSort(), sortValues (+6 more)

### Community 51 - "package.json"
Cohesion: 0.25
Nodes (7): lint-staged, *.{ts,tsx}, name, private, version, eslint --fix, prettier --write

### Community 52 - "calendar-agenda.ts"
Cohesion: 0.14
Nodes (22): AppointmentsMobileList(), AppointmentsMobileListProps, CalendarMobileMonthAppointments(), CalendarMobileMonthView(), DayAgendaList(), DayAgendaListProps, useCalendarMobileMonth(), formatClinicDayKey() (+14 more)

### Community 53 - "invite-page-client.tsx"
Cohesion: 0.29
Nodes (5): Props, EMPLOYEE_ROLE_OPTIONS, InvitePageClient(), MEMBERSHIP_ROLE_LABELS, Props

### Community 54 - "use-campaign-create-dialog.ts"
Cohesion: 0.09
Nodes (30): PatientFileUploaderDialog(), buildCampaignImageKey(), copyCampaignImage(), extensionFromMimeType(), uploadCampaignImage(), campaignFormSchema, CampaignStep, defaultValues (+22 more)

### Community 55 - "login-hero-panel.tsx"
Cohesion: 0.15
Nodes (8): LoginFormPanel(), LoginHeroIllustration(), loginIllustrationSvg, LoginHeroPanel(), LoginPageClient(), RedirectScreen(), useCreateClinic(), CreateClinicPageClient()

### Community 56 - "treatment-store.ts"
Cohesion: 0.17
Nodes (14): deleteTreatment(), getTreatment(), getTreatments(), getTreatmentsByIds(), insertTreatment(), replaceTreatmentInventoryLinks(), TreatmentInsert, TreatmentInventoryLinkInsert (+6 more)

### Community 57 - "dependencies"
Cohesion: 0.18
Nodes (11): @base-ui/react, next, dependencies, @base-ui/react, next, radix-ui, @schedule-x/calendar-controls, @schedule-x/theme-default (+3 more)

### Community 58 - "appointment-create-dialog.tsx"
Cohesion: 0.12
Nodes (36): AppointmentCreateDialogProps, AppointmentDeleteDialogProps, AppointmentMaterialsOverrideDialogProps, CalendarDayDialogProps, EmployeeEditDialogProps, InventoryItemAdjustStockDialogProps, movementTypeOptions, InventoryItemEditDialogProps (+28 more)

### Community 59 - "appointments-columns.tsx"
Cohesion: 0.23
Nodes (11): APPOINTMENT_STATUS_COLOR, appointmentStatusColor(), allStatuses, AppointmentStatusSelect(), AppointmentStatusSelectProps, statusOptions, buildAppointmentsColumns(), APPOINTMENTS_INITIAL_SORTING (+3 more)

### Community 60 - "patient-file-storage.ts"
Cohesion: 0.27
Nodes (11): ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES, CachedSignedUrl, EXTENSION_MIME_MAP, getFileExtension(), resolvePatientFileMimeType(), sanitizePatientFilename(), signedUrlCache (+3 more)

### Community 61 - "before-after-comparison-slider.tsx"
Cohesion: 0.24
Nodes (8): BeforeAfterComparisonContentProps, BeforeAfterComparisonSlider(), BeforeAfterComparisonSliderProps, BeforeAfterOrientation, buildComparisonLabel(), BeforeAfterComparisonToolbar(), BeforeAfterComparisonToolbarProps, usePrefersReducedMotion()

### Community 62 - "button.tsx"
Cohesion: 0.07
Nodes (29): OwnerClinicStep(), Props, displayValue(), OwnerConfirmationStep(), Props, Props, Props, MonthMiniCalendarDayProps (+21 more)

### Community 63 - "app-date-field.tsx"
Cohesion: 0.14
Nodes (13): AppDateField(), AppDateFieldProps, pad(), AppDatePopoverFieldProps, buttonVariants, Calendar(), CalendarDayButton(), Popover() (+5 more)

### Community 64 - "settings-layout-client.tsx"
Cohesion: 0.15
Nodes (13): ClinicEditDialog(), ClinicEditFormProps, getSettingsDetailPrimaryAction(), SettingsDetailActionHandlers, SettingsLayoutClient(), SettingsLayoutClientProps, CLINIC_EDIT_COPY, updateClinic() (+5 more)

### Community 65 - "filters-sheet.tsx"
Cohesion: 0.15
Nodes (13): CalendarOverlapGroupSheet(), CalendarOverlapGroupSheetProps, CalendarOverlapGroupSheetState, FiltersSheet(), FiltersSheetProps, Sheet(), SheetContent(), SheetDescription() (+5 more)

### Community 66 - "settings-section-content.tsx"
Cohesion: 0.17
Nodes (9): SettingsDetailHeader(), SETTINGS_NAV_ITEMS, SettingsNavProps, SettingsSectionContentProps, SettingsUserPanel(), SettingsUserPanelProps, getSettingsSectionFromPathname(), SETTINGS_SECTIONS (+1 more)

### Community 67 - "appointment-reminder-row.tsx"
Cohesion: 0.24
Nodes (11): AppointmentReminderRow(), AppointmentReminderRowProps, SettingsWhatsAppPanel(), ClinicReminderSettingsUpdate, getClinicReminderSettings(), getRemindersForAppointment(), sendManualReminder(), updateClinicReminderSettings() (+3 more)

### Community 68 - "patient-images-store.ts"
Cohesion: 0.24
Nodes (10): createPatientImage(), compressTreatmentImage(), getImageDimensions(), buildPatientImageKey(), uploadPatientImageObject(), PatientImageDeleteConfirmState, PatientImagesStore, UploadPatientImageInput (+2 more)

### Community 69 - "campaigns.dal.ts"
Cohesion: 0.18
Nodes (19): countCampaignPatients(), getCampaignRecipients(), getCampaignSegments(), replaceCampaignSegments(), buildCopyTitle(), CampaignInsert, CampaignUpdate, duplicateCampaign() (+11 more)

### Community 70 - "use-patient-image-uploader.ts"
Cohesion: 0.13
Nodes (15): PatientImageTreatmentSelect(), PatientImageTreatmentSelectProps, PatientImageUploaderDialog(), PatientImageUploaderForm(), PatientImageUploaderFormProps, phaseOptions, NewPatientDateField(), NewPatientDateFieldProps (+7 more)

### Community 71 - "campaigns-columns.tsx"
Cohesion: 0.29
Nodes (8): CampaignDateCell(), CampaignDateCellProps, buildCampaignsColumns(), BuildCampaignsColumnsOptions, CampaignsTable(), CampaignsTableProps, truncateText(), Campaign

### Community 72 - "schedule-x-calendar.tsx"
Cohesion: 0.29
Nodes (6): @schedule-x/calendar, @schedule-x/calendar, ScheduleXCalendarInner(), ScheduleXCalendar(), SkeletonBlock(), useElementHeight()

### Community 73 - "toggle-group.tsx"
Cohesion: 0.36
Nodes (7): ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), toggleGroupItemVariants, toggleGroupVariants, Toggle(), toggleVariants

### Community 74 - "data-table.tsx"
Cohesion: 0.12
Nodes (23): formatQuantity(), InventoryOption, TreatmentInventoryLinkRow(), TreatmentInventoryLinkRowDisplayProps, TreatmentInventoryLinkRowFormProps, TreatmentInventoryLinkRowProps, TreatmentInventoryLinksFieldProps, DataTableProps (+15 more)

### Community 75 - "patient-file-row.tsx"
Cohesion: 0.16
Nodes (20): FileActionsMenu(), FileActionsMenuProps, buildFilesColumns(), FileAction, FileAction, FilesTable(), FilesTableProps, PatientFileIcon() (+12 more)

### Community 76 - "files-filters-sheet.tsx"
Cohesion: 0.19
Nodes (17): FilesDateRangeFilter(), FilesDateRangeFilterProps, formatRangeLabel(), parseDate(), FilesFiltersSheet(), FilesFiltersSheetProps, parseDate(), sortOptions (+9 more)

### Community 77 - "app-topbar.tsx"
Cohesion: 0.26
Nodes (10): AppTopbar(), Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator() (+2 more)

### Community 78 - "campaigns-filters.tsx"
Cohesion: 0.17
Nodes (10): CampaignsFiltersProps, CampaignsFiltersSheetProps, CampaignsSheetFilters, statusOptions, statusOptions, useCampaigns(), CAMPAIGN_STATUS_VALUES, MarketingPageFilters (+2 more)

### Community 79 - "register"
Cohesion: 0.06
Nodes (36): register(), AppointmentCreateForm(), OwnerAccountStep(), RegisterEmployeeForm(), EmployeeEditForm(), EmployeeInviteForm(), EmployeeInviteFormProps, roleOptions (+28 more)

### Community 80 - "PATIENT_GALLERY_COPY"
Cohesion: 0.17
Nodes (11): PatientGalleryDateGroup(), PatientGalleryDateGroupProps, DENSITY_OPTIONS, PatientGalleryDensityToggle(), PatientGalleryDensityToggleProps, PatientGalleryFiltersProps, sortOptions, PATIENT_GALLERY_COPY (+3 more)

### Community 81 - "files-results.tsx"
Cohesion: 0.29
Nodes (6): FilesPagination(), FilesPaginationProps, FileAction, FilesResultsProps, FILES_COPY, PatientFilesSort

### Community 82 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 83 - "use-create-clinic.ts"
Cohesion: 0.11
Nodes (19): Props, RegisterTypePicker(), RegisterEmployeeFormCopy, RegisterEmployeeFormProps, RegisterPageClient(), defaultValues, CREATE_CLINIC_COPY, REGISTER_COPY (+11 more)

### Community 84 - "patient-gallery-tab.tsx"
Cohesion: 0.18
Nodes (14): PatientGalleryFiltersSheet(), PatientGalleryFiltersSheetProps, PatientGalleryFilterValues, sortOptions, filterImages(), PatientGalleryTab(), PatientGalleryTabProps, usePatientGalleryDensity() (+6 more)

### Community 85 - "onboarding-intent-store.ts"
Cohesion: 0.14
Nodes (16): RegisterEmployeeSidebar(), RegisterEmployeeSidebarProps, getSidebarCopy(), REGISTER_COPY, REGISTER_EMPLOYEE_SIDEBAR_COPY, RegisterCopy, SIDEBAR_COPY, SidebarCopy (+8 more)

### Community 86 - "inventory-store.ts"
Cohesion: 0.10
Nodes (21): getInventoryItem(), getInventoryItems(), getInventoryMovements(), insertInventoryItem(), insertInventoryMovement(), InventoryItemInsert, InventoryMovementInsert, updateInventoryItem() (+13 more)

### Community 87 - "campaign-detail-header.tsx"
Cohesion: 0.29
Nodes (6): CampaignDetailHeader(), CampaignDetailHeaderProps, CampaignStatusBadge(), CampaignStatusBadgeProps, statusVariants, CampaignStatus

### Community 88 - "app-layout-client.tsx"
Cohesion: 0.16
Nodes (17): AppLayout(), AppLayoutClient(), AppLayoutClientProps, StoreHydrator(), NotificationsSheet(), externalMemberships(), needsClinicSelector(), PostAuthRouteInput (+9 more)

### Community 89 - "compilerOptions"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+22 more)

### Community 90 - "invite-team-page-client.tsx"
Cohesion: 0.19
Nodes (14): getDefaultValues(), OwnerRegistrationStep, SubmissionStage, syncAuthenticatedUser(), useOwnerRegistration(), OwnerRegistrationPageClient(), InviteTeamPageClient(), inviteEmployee() (+6 more)

### Community 91 - "dropdown-menu.tsx"
Cohesion: 0.14
Nodes (12): DropdownMenuCheckboxItem(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent(), DropdownMenuSubTrigger() (+4 more)

### Community 92 - "finances-page-client.tsx"
Cohesion: 0.09
Nodes (18): CategoryBreakdownItem, FinancesCategoryBreakdownProps, FinancesCategoryRow(), FinancesCategoryRowProps, FinancesFilters, FinancesFiltersSheetProps, FinancesMovementsSectionProps, FinancesWeeklyBreakdownProps (+10 more)

### Community 93 - "patient-create-form.tsx"
Cohesion: 0.39
Nodes (5): PatientCreateFormProps, PatientAvatarField(), PatientAvatarFieldProps, PATIENT_CREATE_COPY, PatientFormValues

### Community 94 - "useAuth"
Cohesion: 0.15
Nodes (17): useLogin(), NoMembershipPageClient(), createDefaultValues(), useRegisterEmployee(), RegisterEmployeePageClient(), getRegisterCopy(), AUTH_ERROR_COPY, getAuthErrorMessage() (+9 more)

### Community 95 - "use-patient-create-dialog.ts"
Cohesion: 0.18
Nodes (18): EmployeeAvatarDisplay(), EmployeeAvatarDisplayProps, getAvatarStyle(), AsyncFileUrl, useFileUrl(), getPatientAvatarKey(), usePatientAvatar(), defaultValues (+10 more)

### Community 96 - "appointments-panel-footer.tsx"
Cohesion: 0.40
Nodes (4): AppointmentsPanelFooter(), AppointmentsPanelFooterProps, PageCardFooter(), PageCardFooterProps

### Community 97 - "use-treatment-images.ts"
Cohesion: 0.17
Nodes (10): TreatmentDetailInventorySectionProps, TreatmentImageGalleryProps, TreatmentImageThumbnailProps, TreatmentImagesSection(), TreatmentImagesSectionProps, EMPTY_IMAGES, useTreatmentImages(), TreatmentImageGalleryItem (+2 more)

### Community 98 - "patient-image-viewer.tsx"
Cohesion: 0.47
Nodes (5): PatientImageViewer(), PatientImageViewerProps, toLightboxIndex(), toSourceIndex(), PatientImageViewerSlide

### Community 102 - "calendar-view-mode-toggle.tsx"
Cohesion: 0.33
Nodes (4): e2eUser, playwrightResult, status, statusResult

### Community 109 - "bootstrap.ts"
Cohesion: 0.05
Nodes (69): AppointmentDetailPage(), AppointmentsPage(), CalendarPage(), DashboardPage(), EmployeeDetailPage(), EmployeesPage(), InventoryItemDetailPage(), InventoryPage() (+61 more)

### Community 110 - "inventory-filters-sheet.tsx"
Cohesion: 0.14
Nodes (11): InventoryFilters, InventoryFiltersSheetProps, stockOptions, InventoryStockSummaryProps, InventoryStockSummaryItemProps, StockTone, toneActive, toneChip (+3 more)

### Community 113 - "isInitialLoading"
Cohesion: 0.12
Nodes (32): defaultMaterialsKey(), useAppointmentMaterials(), useAppointmentDetail(), useAppointment(), useAppointmentInventoryItems(), useCreateAppointment(), useReplaceAppointmentInventoryItems(), useRescheduleAppointment() (+24 more)

### Community 114 - "unwrapSupabaseList"
Cohesion: 0.20
Nodes (12): getTodayAppointments(), getPatientAppointments(), getPatients(), getUpcomingPatientAppointments(), insertPatient(), PatientInsert, PatientUpdate, updatePatient() (+4 more)

### Community 116 - "employee-invite-errors.ts"
Cohesion: 0.31
Nodes (10): createEmployeeInviteError(), EMPLOYEE_INVITE_ERROR_MESSAGES, EMPLOYEE_INVITE_STATUS_MESSAGES, EmployeeInviteErrorBody, getDictionaryMessage(), getErrorCandidates(), getNestedMessage(), getStringValue() (+2 more)

### Community 119 - "treatment-detail-page-client.tsx"
Cohesion: 0.08
Nodes (31): AppointmentDetailActionHandlers, AppointmentDetailTopbarParams, getAppointmentDetailMenuSections(), getAppointmentDetailPrimaryAction(), resolvePrimaryLabel(), getInventoryDetailMenuSections(), getInventoryDetailPrimaryAction(), InventoryDetailActionHandlers (+23 more)

### Community 121 - "app-searchable-multi-select.tsx"
Cohesion: 0.28
Nodes (5): AppSearchableMultiSelectOption, AppSearchableMultiSelectProps, AppSearchableMultiSelectOption(), AppSearchableMultiSelectOptionProps, COMBOBOX_COPY

### Community 122 - "formatDate"
Cohesion: 0.09
Nodes (34): DashboardRecentActivity(), DashboardRecentActivityProps, EmployeeAppointmentRow(), EmployeeAppointmentRowProps, EmployeeTimeline(), EmployeeTimelineProps, mapAppointmentsToTimelineItems(), formatMovementQuantity() (+26 more)

### Community 123 - "use-active-clinic.ts"
Cohesion: 0.14
Nodes (17): ServerBootstrapContext, ServerBootstrapState, StoreHydratorProps, useServerBootstrap(), ClinicMembershipRow, getMemberships(), updateClinicHours(), writeActiveClinicCookie() (+9 more)

### Community 125 - "filter-field.tsx"
Cohesion: 0.09
Nodes (17): categoryOptions, FilesFiltersProps, sortOptions, FinancesFiltersProps, InventoryFiltersProps, stockOptions, PatientsFiltersProps, statusOptions (+9 more)

### Community 126 - "boot-loading-screen.tsx"
Cohesion: 0.13
Nodes (15): BootLoadingScreen(), BootLoadingScreenProps, LoaderProgressBar(), LoaderProgressBarProps, LoaderRedirectCheckBadge(), LoaderRedirectVisual(), LoaderStatusList(), LoaderStatusListProps (+7 more)

### Community 130 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, devDependencies, eslint, @playwright/test, prettier, @testing-library/jest-dom, @testing-library/user-event, @types/react-dom (+9 more)

### Community 131 - "github"
Cohesion: 0.40
Nodes (4): GITHUB_PERSONAL_ACCESS_TOKEN, npx, github, @modelcontextprotocol/server-github

### Community 133 - "app-dialog-content.tsx"
Cohesion: 0.24
Nodes (5): BeforeAfterComparisonProps, AppDialogClose(), AppDialogCloseProps, AppDialogContentProps, APP_DIALOG_COPY

### Community 134 - "use-patient-images.ts"
Cohesion: 0.13
Nodes (24): BeforeAfterComparisonImage(), BeforeAfterComparisonImageProps, PatientGalleryImageThumb(), PatientGalleryImageThumbProps, PatientImageDeleteConfirmDialog(), PatientImageDeleteConfirmDialogProps, deletePatientImage(), getImageUrl() (+16 more)

### Community 136 - "logger.ts"
Cohesion: 0.10
Nodes (21): AppSearchBarInput(), AppSearchBarInputProps, CampaignSegmentInsert, CampaignSegmentPatient, CampaignSegmentRpcArgs, countCampaignSegmentPatients(), getCampaignSegmentPatients(), toRpcArgs() (+13 more)

### Community 137 - "notifySuccess"
Cohesion: 0.09
Nodes (32): EmployeeStatusConfirmDialog(), EmployeeStatusConfirmDialogProps, PatientAppointmentsTab(), PatientAppointmentsTabProps, TreatmentDeleteConfirmDialog(), TreatmentDeleteConfirmDialogProps, TreatmentDialog(), emptyValues (+24 more)

### Community 139 - "useCampaignImageUrl"
Cohesion: 0.31
Nodes (7): CampaignDetailImage(), CampaignDetailImageProps, CampaignImageCell(), CampaignImageCellProps, CampaignImageDialog(), getCampaignImageUrl(), useCampaignImageUrl()

### Community 140 - "whatsapp.ts"
Cohesion: 0.12
Nodes (12): baseMessage, corsHeaders, SegmentPatient, corsHeaders, postToTwilio(), resolveWhatsAppMode(), sendWhatsApp(), VALID_MODES (+4 more)

### Community 141 - "campaign-reach-summary.tsx"
Cohesion: 0.29
Nodes (5): CampaignReachSummaryProps, Stat(), StatProps, StatTone, toneClasses

### Community 145 - "table-mobile-columns.tsx"
Cohesion: 0.08
Nodes (25): employeesColumns, EmployeesTableProps, transactionsColumns, TransactionsTable(), TransactionsTableProps, inventoryColumns, InventoryTableProps, PatientMarketingBadge() (+17 more)

### Community 155 - "marketing-copy.ts"
Cohesion: 0.13
Nodes (9): CampaignRecipientStatusBadge(), CampaignRecipientStatusBadgeProps, statusVariants, CampaignRecipientsListProps, CampaignMessagePreviewProps, CampaignStepIndicatorProps, MARKETING_COPY, CAMPAIGN_STEPS (+1 more)

### Community 156 - "appointment-person-avatar.tsx"
Cohesion: 0.38
Nodes (4): AppointmentHeaderPersonProps, AppointmentPersonAvatar(), AppointmentPersonAvatarProps, getInitials()

### Community 157 - "loader-spinner.tsx"
Cohesion: 0.33
Nodes (5): LoaderOrbitalVisual(), LoaderSpinner(), LoaderSpinnerProps, LoaderSpinnerSize, SPINNER_SIZES

### Community 159 - "use-settings-page.ts"
Cohesion: 0.36
Nodes (7): normalizeEmail(), PendingClinicRequest, useUploadProfileAvatar(), usePendingClinicRequests(), UsePendingClinicRequestsResult, useSettingsPageActions(), canManageClinicSettings()

### Community 160 - "e2e-helpers.ts"
Cohesion: 0.16
Nodes (16): createAndGoToAppointmentDetail(), authDirectory, authFile, E2E_DATA, E2E_TINY_PNG, E2E_USER, clickPatientTableRow(), clickTopbarMenuAction() (+8 more)

### Community 164 - "use-employee-edit-dialog.ts"
Cohesion: 0.06
Nodes (31): EmployeeColorField(), EmployeeColorFieldProps, EmployeeEditDialog(), EmployeeEditFormProps, roleOptions, EmployeesFiltersProps, roleOptions, EmployeeFilters (+23 more)

### Community 171 - "use-schedule-x-calendar.ts"
Cohesion: 0.09
Nodes (38): CalendarWeekUiRefs, updateCalendarWeekUiRefs(), CalendarEmptyHeader(), CalendarEventProps, CalendarTimeGridEvent(), CalendarWeekGridDate(), DayAgendaAppointmentCard(), DayAgendaAppointmentCardProps (+30 more)

### Community 174 - "finances-store.ts"
Cohesion: 0.06
Nodes (55): FinancesPage(), transactionTypeForTab(), FinancesMetricItem(), FinancesMetricItemProps, FinancesSummaryMetrics(), FinancesSummaryMetricsProps, MetricConfig, TransactionCreateFormProps (+47 more)

### Community 193 - "hyperframes.json"
Cohesion: 0.20
Nodes (9): authoringSkill, media, autoProxy, paths, assets, blocks, components, registry (+1 more)

### Community 233 - "calendar-page-client.tsx"
Cohesion: 0.08
Nodes (36): AppointmentEmployeeFilter(), CalendarEmployeeFilter(), CalendarEmployeeFilterProps, CALENDAR_FILTER_DEFAULTS, CalendarPageClientProps, CLOSED_GROUP_SHEET, CalendarDayDialog(), CalendarFilters (+28 more)

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
- **867 isolated node(s):** `geistSans`, `geistMono`, `metadata`, `viewport`, `AppointmentDetailPageClientProps` (+862 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **62 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `utils.ts`, `useActiveClinicTimezone`, `AppointmentWithRelations`, `app-dialog-content.tsx`, `format.ts`, `use-app-nav-items.tsx`, `sidebar.tsx`, `skeleton.tsx`, `loader-spinner.tsx`, `dropzone.tsx`, `use-employee-edit-dialog.ts`, `calendar-overlap-group-event.tsx`, `inventory-detail-page-client.tsx`, `formatCurrency`, `use-schedule-x-calendar.ts`, `employee-profile-header.tsx`, `appointment-create-dialog.tsx`, `button.tsx`, `app-date-field.tsx`, `filters-sheet.tsx`, `toggle-group.tsx`, `data-table.tsx`, `patient-file-row.tsx`, `app-topbar.tsx`, `register`, `dropdown-menu.tsx`, `calendar-page-client.tsx`, `filter-field.tsx`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `Button()` connect `button.tsx` to `utils.ts`, `useActiveClinicTimezone`, `cn`, `AppointmentWithRelations`, `logger.ts`, `sidebar.tsx`, `sidebar-profile-footer.tsx`, `appointment-detail-page-client.tsx`, `notice.tsx`, `table-mobile-columns.tsx`, `dropzone.tsx`, `appointment-status-error-toast.tsx`, `use-employee-edit-dialog.ts`, `formatCurrency`, `employees-page-client.tsx`, `settings-copy.ts`, `employee-profile-header.tsx`, `settings-profile-panel.tsx`, `invite-page-client.tsx`, `appointment-create-dialog.tsx`, `before-after-comparison-slider.tsx`, `app-date-field.tsx`, `filters-sheet.tsx`, `appointment-reminder-row.tsx`, `data-table.tsx`, `patient-file-row.tsx`, `files-filters-sheet.tsx`, `app-topbar.tsx`, `register`, `files-results.tsx`, `use-create-clinic.ts`, `invite-team-page-client.tsx`, `dropdown-menu.tsx`, `finances-page-client.tsx`, `patient-create-form.tsx`, `useAuth`, `use-treatment-images.ts`, `calendar-page-client.tsx`, `treatment-detail-page-client.tsx`, `app-searchable-multi-select.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `class-variance-authority`, `clsx`, `sidebar.tsx`, `cuelume`, `date-fns`, `date-fns-tz`, `@hookform/resolvers`, `@radix-ui/react-dialog`, `lucide-react`, `match-sorter`, `@pdfslick/react`, `@preact/signals`, `preact`, `@radix-ui/react-popover`, `@radix-ui/themes`, `react-day-picker`, `react-compare-slider`, `react-hook-form`, `react-dom`, `react-dropzone`, `shadcn`, `react-toastify`, `@supabase/ssr`, `package.json`, `@schedule-x/events-service`, `@schedule-x/react`, `@sentry/nextjs`, `server-only`, `@tanstack/react-table`, `tw-animate-css`, `@supabase/supabase-js`, `tailwind-merge`, `yet-another-react-lightbox`, `temporal-polyfill`, `zod`, `zustand`, `schedule-x-calendar.tsx`, `browser-image-compression`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **What connects `geistSans`, `geistMono`, `metadata` to the rest of the system?**
  _867 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `database.types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10591133004926108 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.06918238993710692 - nodes in this community are weakly interconnected._