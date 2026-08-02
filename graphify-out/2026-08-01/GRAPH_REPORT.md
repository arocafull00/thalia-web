# Graph Report - thalia-web  (2026-08-01)

## Corpus Check
- 769 files · ~326,102 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2921 nodes · 8156 edges · 164 communities (146 shown, 18 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.54)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `69d7f6a3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- inventory-detail-page-client.tsx
- use-appointment-materials-override-dialog.ts
- useEmployees
- app-searchable-combobox.tsx
- Patient
- calendar-grid.ts
- app-layout-client.tsx
- useCalendarStore
- use-treatment-images.ts
- employees-page-client.tsx
- sidebar.tsx
- createClient
- app/layout.tsx
- use-treatment-dialog.ts
- finances-page-client.tsx
- calendar-agenda.ts
- proxy.ts
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
- supabase/functions/send-reminders/index.ts
- schema-helpers.ts
- patient-file-storage.ts
- inventory-page-client.tsx
- table-mobile-columns.tsx
- use-clinic-hours-dialog.ts
- login-hero-panel.tsx
- patient-detail-page-client.tsx
- useTreatments
- patient-files-store.ts
- register-employee-copy.ts
- employee-detail-page-client.tsx
- scripts
- use-inventory-adjust-stock-dialog.ts
- app-dialog-content.tsx
- database.types.ts
- format.ts
- treatment-detail-page-client.tsx
- employees-filters.tsx
- campaign-segment-schema.ts
- bootstrap.ts
- getServerActiveClinicId
- dependencies
- appointment-create-dialog.tsx
- use-app-nav-items.tsx
- campaign-detail-page-client.tsx
- use-campaign-create-dialog.ts
- use-login.ts
- app-date-field.tsx
- patient-files-copy.ts
- filters-sheet.tsx
- useAuth
- cn
- patient-images-store.ts
- campaigns.dal.ts
- employee-timeline.tsx
- patient-files-tab.tsx
- use-clinic-edit-dialog.ts
- input-group.tsx
- data-table.tsx
- files-table.tsx
- use-files-page.ts
- AppointmentWithRelations
- campaigns-filters.tsx
- use-profile-edit-dialog.ts
- patient-file-row.tsx
- inventory-item-sidebar.tsx
- components.json
- use-owner-registration.ts
- appointment-create-form.tsx
- useClinicId
- search-copy.ts
- treatment-store.ts
- invite-team-page-client.tsx
- compilerOptions
- unwrapSupabaseList
- app-topbar.tsx
- appointment-detail-page-client.tsx
- use-appointments.ts
- use-register-employee.ts
- formatCurrency
- use-appointment-create-dialog.ts
- use-topbar-actions.ts
- sound.ts
- patients-filters.tsx
- calendar-view-mode-toggle.tsx
- patient-image-viewer.tsx
- patients-table.tsx
- inventory-adjust-stock-preview.tsx
- mocks.ts
- use-clinic-info.ts
- inventory-filters-sheet.tsx
- appointment-materials-section.tsx
- app-search-bar-input.tsx
- inventory-store.ts
- mobile-card-view.tsx
- InventoryItem
- find-slots.ts
- loader-spinner.tsx
- patient-gallery-tab.tsx
- badge.tsx
- calendar-day-stats.ts
- employees-table.tsx
- use-patient-file-uploader.ts
- page-filters-bar.tsx
- useFileUrl
- boot-loading-screen.tsx
- appointment-person-avatar.tsx
- settings-page-client.tsx
- finances-summary-metrics.tsx
- devDependencies
- finances-filters.tsx
- treatment-delete-confirm-dialog.tsx
- format.ts
- schedule-x-calendar.tsx
- app-bottom-nav.tsx
- send-campaign/index.ts
- campaigns-date-range-filter.tsx
- use-inventory-item-create-dialog.ts
- e2e-helpers.ts
- use-employee-edit-dialog.ts
- use-schedule-x-calendar.ts
- button.tsx
- before-after-comparison-slider.tsx
- employee-schema.ts
- utils.ts
- inventory-movements-list.tsx
- use-patient-create-dialog.ts
- hyperframes.json
- register
- use-active-clinic.ts
- calendar-page-client.tsx
- app-searchable-multi-select.tsx
- scripts
- capture-product.mjs
- owner-clinic-form.ts
- supabase.ts
- settings-profile-header.tsx
- skeleton.tsx
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `cn()` - 170 edges
2. `Button()` - 100 edges
3. `unwrapSupabaseList()` - 50 edges
4. `AppointmentWithRelations` - 46 edges
5. `useAuth()` - 45 edges
6. `Employee` - 44 edges
7. `unwrapSupabase()` - 40 edges
8. `Notice()` - 38 edges
9. `useClinicId()` - 38 edges
10. `supabase` - 36 edges

## Surprising Connections (you probably didn't know these)
- `AppointmentDetailPage()` --calls--> `getAppointment()`  [EXTRACTED]
  app/(app)/appointments/[id]/page.tsx → src/dal/appointments.server.dal.ts
- `AppointmentsPage()` --calls--> `appointmentsKey()`  [EXTRACTED]
  app/(app)/appointments/page.tsx → src/stores/appointments-store.ts
- `FinancesPage()` --calls--> `getTransactions()`  [EXTRACTED]
  app/(app)/finances/page.tsx → src/dal/finances.server.dal.ts
- `InventoryPage()` --calls--> `getServerActiveClinicId()`  [EXTRACTED]
  app/(app)/inventory/page.tsx → src/lib/server/active-clinic.ts
- `TreatmentDetailPage()` --calls--> `getTreatment()`  [EXTRACTED]
  app/(app)/treatments/[id]/page.tsx → src/dal/treatments.server.dal.ts

## Import Cycles
- 3-file cycle: `src/lib/active-clinic-id.ts -> src/stores/auth-store.ts -> src/stores/employees-store.ts -> src/lib/active-clinic-id.ts`

## Communities (164 total, 18 thin omitted)

### Community 0 - "inventory-detail-page-client.tsx"
Cohesion: 0.16
Nodes (19): INVENTORY_DETAIL_TAB_ITEMS, InventoryDetailTabBar(), InventoryDetailTabBarProps, InventoryDetailTabContent(), InventoryDetailTabContentProps, InventoryDetailPageClient(), InventoryDetailPageClientProps, TreatmentInventoryLinksField() (+11 more)

### Community 1 - "use-appointment-materials-override-dialog.ts"
Cohesion: 0.21
Nodes (10): AppointmentMaterialsOverrideDialog(), AppointmentMaterialsOverrideForm(), AppointmentMaterialsOverrideFormProps, toFormValues(), useAppointmentMaterialsOverrideDialog(), useReplaceAppointmentInventoryItems(), appointmentInventoryLinkSchema, appointmentMaterialsFormSchema (+2 more)

### Community 2 - "useEmployees"
Cohesion: 0.14
Nodes (22): AppointmentDateRange(), AppointmentDateRangeProps, formatAppointmentDateParam(), getDefaultAppointmentDateRange(), parseAppointmentDateParam(), AppointmentEmployeeFilter(), AppointmentEmployeeFilterProps, AppointmentFilters() (+14 more)

### Community 3 - "app-searchable-combobox.tsx"
Cohesion: 0.11
Nodes (18): AppSearchableCombobox(), AppSearchableComboboxOption, AppSearchableComboboxProps, AppSearchableComboboxItem(), AppSearchableComboboxItemProps, ComboboxChip(), ComboboxChips(), ComboboxChipsInput() (+10 more)

### Community 4 - "Patient"
Cohesion: 0.11
Nodes (18): PatientDetailActionsMenu(), PatientDetailActionsMenuProps, PatientDetailStatsProps, PatientDetailStatsRow(), PatientInfoSection(), PatientInfoSectionProps, PatientStatCard(), PatientStatCardProps (+10 more)

### Community 5 - "calendar-grid.ts"
Cohesion: 0.22
Nodes (16): MonthMiniCalendar(), MonthMiniCalendarProps, appointmentLayout(), formatDayHeader(), formatWeekRange(), getDayEnd(), getDayStart(), getMonthGridDays() (+8 more)

### Community 7 - "useCalendarStore"
Cohesion: 0.20
Nodes (15): CalendarDayDialog(), CalendarMobileDayView(), CalendarMobileMonthAppointments(), CalendarMobileMonthView(), useCalendarDayAgenda(), useCalendarMobileMonth(), formatVisibleRangeLabel(), useCalendarPage() (+7 more)

### Community 8 - "use-treatment-images.ts"
Cohesion: 0.18
Nodes (10): PatientGalleryTab(), TreatmentImageGalleryProps, TreatmentImageThumbnailProps, TreatmentImagesSection(), TreatmentImagesSectionProps, EMPTY_IMAGES, useTreatmentImages(), TreatmentImageGalleryItem (+2 more)

### Community 9 - "employees-page-client.tsx"
Cohesion: 0.10
Nodes (32): AppointmentsPageClient(), AppointmentsPageClientProps, EMPLOYEE_FILTER_DEFAULTS, EmployeesPageClient(), EmployeesPageClientProps, FinancesPageClient(), InventoryItemEditDialogProps, INVENTORY_FILTER_DEFAULTS (+24 more)

### Community 10 - "sidebar.tsx"
Cohesion: 0.07
Nodes (37): AppBottomNav(), AppShell(), AppShellProps, AppSidebar(), AppSidebarNavSection(), AppSidebarNavSectionProps, Separator(), Sidebar() (+29 more)

### Community 11 - "createClient"
Cohesion: 0.11
Nodes (28): AppointmentDetailPage(), EmployeeDetailPage(), InventoryItemDetailPage(), InventoryPage(), PatientDetailPage(), TreatmentDetailPage(), TreatmentsPage(), GET() (+20 more)

### Community 12 - "app/layout.tsx"
Cohesion: 0.11
Nodes (18): geistMono, geistSans, metadata, viewport, AuthProvider(), PwaInstallProvider(), PwaInstallProviderProps, ServiceWorkerProvider() (+10 more)

### Community 13 - "use-treatment-dialog.ts"
Cohesion: 0.17
Nodes (11): TreatmentColorFieldProps, TreatmentFormProps, TreatmentFilters, TreatmentsFiltersSheet(), TreatmentsFiltersSheetProps, emptyValues, TreatmentFormValues, TREATMENT_COLOR_PRESETS (+3 more)

### Community 14 - "finances-page-client.tsx"
Cohesion: 0.16
Nodes (11): FinancesMovementsSectionProps, FinancesMonthSelector(), FinancesMonthSelectorProps, financesMonthToParam(), FinancesPageClientProps, FinancesTabBar(), FinancesTabBarProps, FinancesTabValue (+3 more)

### Community 15 - "calendar-agenda.ts"
Cohesion: 0.12
Nodes (18): AppointmentRow(), AppointmentRowProps, AppointmentsMobileList(), AppointmentsMobileListProps, DayAgendaAppointmentCard(), DayAgendaAppointmentCardProps, DayAgendaList(), DayAgendaListProps (+10 more)

### Community 16 - "proxy.ts"
Cohesion: 0.33
Nodes (7): config, proxy(), publicRoutes, pwaRoutes, SessionUpdateResult, updateSession(), withSessionCookies()

### Community 28 - "appointments-store.ts"
Cohesion: 0.12
Nodes (22): AppointmentInsert, AppointmentInventoryLinkInput, AppointmentTreatmentInsert, AppointmentUpdate, deleteAppointment(), deleteAppointmentTreatments(), EffectiveAppointmentMaterial, getAppointment() (+14 more)

### Community 31 - "dropzone.tsx"
Cohesion: 0.06
Nodes (43): CampaignImageFieldProps, PatientFileUploaderDropzoneFileItem(), PatientFileUploaderDropzoneFileItemProps, PatientFileUploaderForm(), PatientFileUploaderFormProps, PatientImageUploaderDropzoneFileItemProps, PatientImageUploaderForm(), PatientImageUploaderFormProps (+35 more)

### Community 33 - "appointments-columns.tsx"
Cohesion: 0.10
Nodes (27): AppointmentStatusErrorToastProps, notifyAppointmentStatusError(), allStatuses, AppointmentStatusSelect(), AppointmentStatusSelectProps, statusColors, statusOptions, AppointmentStockButton() (+19 more)

### Community 36 - "schema-helpers.ts"
Cohesion: 0.11
Nodes (23): appointmentFieldsSchema, appointmentSchema, AppointmentSchemaInput, appointmentUpdateSchema, AppointmentUpdateSchemaInput, inventoryFieldsSchema, InventorySchemaInput, patientImagePhaseSchema (+15 more)

### Community 37 - "patient-file-storage.ts"
Cohesion: 0.16
Nodes (17): PatientFileViewer(), getFileUrl(), usePatientFileUrl(), ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES, CachedSignedUrl, EXTENSION_MIME_MAP, getFileExtension() (+9 more)

### Community 38 - "inventory-page-client.tsx"
Cohesion: 0.12
Nodes (24): CalendarOverlapGroupEvent(), CalendarOverlapGroupEventProps, getEmployeeColor(), getEmployeeName(), buildScheduleEventsForViewMode(), collectUniqueProfessionalColors(), formatProfessionalSummary(), groupOverlappingAppointments() (+16 more)

### Community 39 - "table-mobile-columns.tsx"
Cohesion: 0.15
Nodes (14): transactionsColumns, TransactionsTable(), TransactionsTableProps, InventoryTable(), InventoryTableProps, TreatmentsTable(), TreatmentsTableProps, DataTable() (+6 more)

### Community 40 - "use-clinic-hours-dialog.ts"
Cohesion: 0.14
Nodes (11): Props, ClinicHoursDialog(), ClinicHoursFormProps, CLINIC_HOURS_COPY, FutureAppointmentConflict, getFutureAppointments(), ClinicHoursFormValues, clinicHoursSchema (+3 more)

### Community 41 - "login-hero-panel.tsx"
Cohesion: 0.14
Nodes (8): LoginHeroIllustration(), loginIllustrationSvg, LoginHeroPanel(), Props, RegisterTypePicker(), RegisterPageClient(), useCreateClinic(), CreateClinicPageClient()

### Community 42 - "patient-detail-page-client.tsx"
Cohesion: 0.15
Nodes (23): PATIENT_DETAIL_TAB_ITEMS, PatientDetailTabBar(), PatientDetailTabBarProps, PatientDetailPageClient(), PatientDetailPageClientProps, getPatientAvatarKey(), usePatientAvatar(), PatientDetailTabId (+15 more)

### Community 43 - "useTreatments"
Cohesion: 0.31
Nodes (7): TreatmentCatalogFilters, useTreatmentCatalog(), CategorizedItem, useFilterPills(), resolveStockLevel(), useInventoryPage(), useTreatments()

### Community 44 - "patient-files-store.ts"
Cohesion: 0.13
Nodes (24): createPatientFile(), deletePatientFile(), deletePatientFileRecord(), getGlobalPatientFiles(), getPatientFile(), getPatientFiles(), GlobalPatientFilesParams, PaginatedPatientFiles (+16 more)

### Community 45 - "register-employee-copy.ts"
Cohesion: 0.23
Nodes (10): RegisterEmployeeSidebar(), RegisterEmployeeSidebarProps, getSidebarCopy(), REGISTER_COPY, REGISTER_EMPLOYEE_FORM_COPY, REGISTER_EMPLOYEE_SIDEBAR_COPY, RegisterCopy, SIDEBAR_COPY (+2 more)

### Community 46 - "employee-detail-page-client.tsx"
Cohesion: 0.06
Nodes (56): EmployeeDetailHeader(), EmployeeDetailHeaderProps, EMPLOYEE_DETAIL_TAB_ITEMS, EmployeeDetailTabBar(), EmployeeDetailTabBarProps, EmployeeDetailTabContent(), EmployeeDetailTabContentProps, EmployeeProfileSidebarProps (+48 more)

### Community 47 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, build, dev, dev:https, lint, lint:staged, prepare, start (+10 more)

### Community 48 - "use-inventory-adjust-stock-dialog.ts"
Cohesion: 0.17
Nodes (14): InventoryItemAdjustStockDialog(), getInventoryDetailActions(), InventoryDetailActionHandlers, showComingSoon(), INVENTORY_ITEM_DETAIL_COPY, defaultValues, InventoryAdjustStockItem, useInventoryAdjustStockDialog() (+6 more)

### Community 49 - "app-dialog-content.tsx"
Cohesion: 0.38
Nodes (4): AppDialogClose(), AppDialogCloseProps, AppDialogContentProps, APP_DIALOG_COPY

### Community 50 - "database.types.ts"
Cohesion: 0.07
Nodes (29): EmployeeQuickActionsProps, PatientImageTreatmentSelect(), PatientImageTreatmentSelectProps, SettingsDetailHeader(), SettingsDetailHeaderProps, SettingsDetailTabContentProps, SettingsUserPanel(), SettingsUserPanelProps (+21 more)

### Community 51 - "format.ts"
Cohesion: 0.33
Nodes (5): lint-staged, *.{ts,tsx}, name, private, version

### Community 52 - "treatment-detail-page-client.tsx"
Cohesion: 0.21
Nodes (11): TreatmentDetailInfoSection(), TreatmentDetailInfoSectionProps, TreatmentDetailInventorySectionProps, getTreatmentDetailActions(), TreatmentDetailActionHandlers, TreatmentDetailPageClient(), TreatmentDetailPageClientProps, TREATMENT_DETAIL_COPY (+3 more)

### Community 53 - "employees-filters.tsx"
Cohesion: 0.18
Nodes (10): EmployeesFilters(), EmployeesFiltersProps, roleOptions, EmployeeFilters, EmployeesFiltersSheet(), EmployeesFiltersSheetProps, roleOptions, statusOptions (+2 more)

### Community 54 - "campaign-segment-schema.ts"
Cohesion: 0.13
Nodes (18): ageRangeConfigSchema, buildCampaignSegmentFilters(), buildSegmentsFromFilters(), CampaignSegmentFilters, EMPTY_CAMPAIGN_SEGMENT_FILTERS, EMPTY_CAMPAIGN_SEGMENT_INPUTS, lastVisitDateConfigSchema, NUMERIC_RULES (+10 more)

### Community 55 - "bootstrap.ts"
Cohesion: 0.10
Nodes (22): AppLayout(), ServerBootstrapContext, ServerBootstrapState, StoreHydrator(), StoreHydratorProps, SidebarClinicSwitcherProps, writeActiveClinicCookie(), ActiveClinicBootstrap (+14 more)

### Community 56 - "getServerActiveClinicId"
Cohesion: 0.17
Nodes (21): AppointmentsPage(), CalendarPage(), DashboardPage(), EmployeesPage(), PatientsPage(), SettingsPage(), DashboardPageClient(), getAppointments() (+13 more)

### Community 57 - "dependencies"
Cohesion: 0.05
Nodes (43): dependencies, @base-ui/react, browser-image-compression, class-variance-authority, clsx, cuelume, date-fns, date-fns-tz (+35 more)

### Community 58 - "appointment-create-dialog.tsx"
Cohesion: 0.13
Nodes (32): AppointmentCreateDialogProps, AppointmentDeleteDialogProps, AppointmentMaterialsOverrideDialogProps, CalendarDayDialogProps, EmployeeEditDialogProps, InventoryItemAdjustStockDialogProps, movementTypeOptions, LoaderInline() (+24 more)

### Community 59 - "use-app-nav-items.tsx"
Cohesion: 0.14
Nodes (13): AppSidebarNavItem(), AppSidebarNavItemProps, AppSidebarNavPending(), SidebarMenuItem(), APP_SIDEBAR_COPY, AppNavSectionId, AppNavItem, AppNavSection (+5 more)

### Community 60 - "campaign-detail-page-client.tsx"
Cohesion: 0.14
Nodes (15): CampaignDetailPageClient(), CampaignDetailImage(), CampaignDetailImageProps, CampaignReachSummary(), CampaignReachSummaryProps, CampaignMessagePreviewProps, CampaignImageCellProps, MARKETING_COPY (+7 more)

### Community 61 - "use-campaign-create-dialog.ts"
Cohesion: 0.13
Nodes (16): CampaignCreateForm(), CampaignCreateFormProps, CampaignRecipientsPreview(), CampaignRecipientsPreviewProps, resolveMessage(), CampaignSegmentFieldsProps, NumericField, TreatmentOption (+8 more)

### Community 62 - "use-login.ts"
Cohesion: 0.19
Nodes (7): LoginFormPanel(), useLogin(), LoginPageClient(), AUTH_ERROR_COPY, getAuthErrorMessage(), signInWithGoogleFlow(), navigateAfterAuth()

### Community 63 - "app-date-field.tsx"
Cohesion: 0.14
Nodes (13): AppDateField(), AppDateFieldProps, pad(), AppDatePopoverFieldProps, buttonVariants, Calendar(), CalendarDayButton(), Popover() (+5 more)

### Community 64 - "patient-files-copy.ts"
Cohesion: 0.18
Nodes (11): categoryOptions, PatientFileCategoryFilter(), PatientFileCategoryFilterProps, PatientFilePdfNavigation(), PatientFilePdfNavigationProps, PatientFilePdfViewerContent(), PatientFilePdfViewerContentProps, PatientFilePdfViewer() (+3 more)

### Community 65 - "filters-sheet.tsx"
Cohesion: 0.16
Nodes (12): CalendarOverlapGroupSheet(), CalendarOverlapGroupSheetProps, FiltersSheet(), FiltersSheetProps, Sheet(), SheetContent(), SheetDescription(), SheetFooter() (+4 more)

### Community 66 - "useAuth"
Cohesion: 0.19
Nodes (8): NoMembershipPageClient(), RegisterEmployeePageClient(), RedirectScreen(), AppLayoutClient(), AppLayoutClientProps, useAuth(), useUpdateProfile(), UpdateProfileInput

### Community 67 - "cn"
Cohesion: 0.11
Nodes (24): PatientGalleryImageThumbProps, Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), ContextMenu() (+16 more)

### Community 68 - "patient-images-store.ts"
Cohesion: 0.10
Nodes (26): createPatientImage(), deletePatientImage(), getImageUrl(), getPatientImage(), getPatientImages(), getTreatmentPatientImagesPage(), TreatmentPatientImagesPage, compressTreatmentImage() (+18 more)

### Community 69 - "campaigns.dal.ts"
Cohesion: 0.17
Nodes (12): buildCopyTitle(), CampaignInsert, CampaignUpdate, duplicateCampaign(), getCampaign(), insertCampaign(), SendCampaignResult, buildCampaignImageKey() (+4 more)

### Community 70 - "employee-timeline.tsx"
Cohesion: 0.26
Nodes (15): EmployeeAppointmentRow(), EmployeeAppointmentRowProps, EmployeeTimeline(), EmployeeTimelineProps, mapAppointmentsToTimelineItems(), mapAppointmentsToTimelineItems(), PatientTimeline(), PatientTimelineProps (+7 more)

### Community 71 - "patient-files-tab.tsx"
Cohesion: 0.24
Nodes (11): PatientFileDeleteConfirmDialog(), PatientFileDeleteConfirmDialogProps, PatientFileEditDialog(), PatientFilesTab(), PatientFilesTabProps, useDeletePatientFile(), usePatientFiles(), useUpdatePatientFile() (+3 more)

### Community 72 - "use-clinic-edit-dialog.ts"
Cohesion: 0.24
Nodes (9): ClinicEditDialog(), ClinicEditForm(), ClinicEditFormProps, CLINIC_EDIT_COPY, clinicEditFormSchema, ClinicEditFormValues, EMPTY_DEFAULTS, toFormValues() (+1 more)

### Community 73 - "input-group.tsx"
Cohesion: 0.18
Nodes (13): REMINDER_HOUR_OPTIONS, SettingsWhatsAppPanel(), InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput() (+5 more)

### Community 74 - "data-table.tsx"
Cohesion: 0.19
Nodes (16): formatQuantity(), InventoryOption, TreatmentInventoryLinkRow(), TreatmentInventoryLinkRowDisplayProps, TreatmentInventoryLinkRowFormProps, TreatmentInventoryLinkRowProps, TreatmentInventoryLinksFieldProps, DataTableProps (+8 more)

### Community 75 - "files-table.tsx"
Cohesion: 0.19
Nodes (12): buildFilesColumns(), FilesPagination(), FilesPaginationProps, FileAction, FilesResults(), FilesResultsProps, FileAction, FilesTable() (+4 more)

### Community 76 - "use-files-page.ts"
Cohesion: 0.11
Nodes (18): categoryOptions, FilesFiltersProps, FilesFiltersSheet(), FilesFiltersSheetProps, parseDate(), sortOptions, sortOptions, FilesPageClient() (+10 more)

### Community 77 - "AppointmentWithRelations"
Cohesion: 0.14
Nodes (16): AppointmentsTable(), PatientDetailTabContent(), PatientDetailTabContentProps, PatientAppointmentsTab(), PatientAppointmentsTabProps, PatientClinicalHistoryTab(), PatientClinicalHistoryTabProps, PatientSummaryTab() (+8 more)

### Community 78 - "campaigns-filters.tsx"
Cohesion: 0.15
Nodes (13): CampaignsFilters(), CampaignsFiltersProps, CampaignsFiltersSheet(), CampaignsFiltersSheetProps, CampaignsSheetFilters, statusOptions, statusOptions, CAMPAIGN_STATUS_VALUES (+5 more)

### Community 79 - "use-profile-edit-dialog.ts"
Cohesion: 0.23
Nodes (10): ProfileColorFieldProps, ProfileEditDialog(), ProfileEditForm(), ProfileEditFormProps, PROFILE_COLOR_PRESETS, PROFILE_EDIT_COPY, profileEditFormSchema, ProfileEditFormValues (+2 more)

### Community 80 - "patient-file-row.tsx"
Cohesion: 0.24
Nodes (11): FileActionsMenu(), FileActionsMenuProps, FileAction, PatientFileIcon(), PatientFileIconProps, PatientFileRow(), PatientFileRowProps, getPatientFileCategoryLabel() (+3 more)

### Community 81 - "inventory-item-sidebar.tsx"
Cohesion: 0.13
Nodes (20): InventoryDetailHeader(), InventoryDetailHeaderProps, InventoryItemIconDisplay(), InventoryItemSidebar(), InventoryItemSidebarProps, inventoryStockLevelToneClass(), InventoryItemSummary(), InventoryItemSummaryProps (+12 more)

### Community 82 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 83 - "use-owner-registration.ts"
Cohesion: 0.09
Nodes (29): Props, OwnerClinicStep(), Props, displayValue(), OwnerConfirmationStep(), Props, Props, getDefaultValues() (+21 more)

### Community 84 - "appointment-create-form.tsx"
Cohesion: 0.17
Nodes (8): AppointmentCreateFormProps, AppointmentPatientOption, Props, AppointmentSlotSearchControlsProps, SEARCH_MODE_OPTIONS, NewAppointmentDatetimeField(), APPOINTMENT_CREATE_COPY, SlotSearchMode

### Community 85 - "useClinicId"
Cohesion: 0.07
Nodes (53): FinancesPage(), transactionTypeForTab(), TransactionCreateFormProps, TRANSACTION_CREATE_COPY, getTransactions(), insertTransaction(), TransactionInsert, TransactionUpdate (+45 more)

### Community 86 - "search-copy.ts"
Cohesion: 0.22
Nodes (9): InventoryFilters(), InventoryFiltersProps, stockOptions, TreatmentsFilters(), TreatmentsFiltersProps, AppSearchBar(), getSearchPlaceholder(), SEARCH_COPY (+1 more)

### Community 87 - "treatment-store.ts"
Cohesion: 0.12
Nodes (26): TreatmentDialog(), toFormValues(), useTreatmentDialog(), deleteTreatment(), getTreatment(), getTreatments(), getTreatmentsByIds(), insertTreatment() (+18 more)

### Community 88 - "invite-team-page-client.tsx"
Cohesion: 0.21
Nodes (11): InviteTeamPageClient(), normalizeInviteEmails(), validateInviteEmails(), externalMemberships(), needsClinicSelector(), PostAuthRouteInput, PostAuthRouteResult, resolvePostAuthRoute() (+3 more)

### Community 89 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 90 - "unwrapSupabaseList"
Cohesion: 0.26
Nodes (11): getPatientAppointments(), getPatients(), getUpcomingPatientAppointments(), insertPatient(), PatientInsert, PatientUpdate, updatePatient(), patientUpdateSchema (+3 more)

### Community 91 - "app-topbar.tsx"
Cohesion: 0.09
Nodes (24): AppTopbar(), PAGE_TITLES_BY_ROUTE, Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage() (+16 more)

### Community 92 - "appointment-detail-page-client.tsx"
Cohesion: 0.27
Nodes (8): AppointmentDetailActionHandlers, getAppointmentDetailMenuActions(), AppointmentDetailPageClient(), AppointmentDetailPageClientProps, resolveTotalDurationMinutes(), BackButton(), BackButtonProps, APPOINTMENT_DETAIL_COPY

### Community 93 - "use-appointments.ts"
Cohesion: 0.32
Nodes (10): useAppointmentDetail(), useAppointment(), useAppointmentInventoryItems(), useCreateAppointment(), useRescheduleAppointment(), useUpdateAppointment(), useUpdateAppointmentStatus(), AppointmentFormInput (+2 more)

### Community 94 - "use-register-employee.ts"
Cohesion: 0.15
Nodes (20): createDefaultValues(), useRegisterEmployee(), getRegisterCopy(), InvitationState, useAcceptInvitation(), usePostAuthRedirect(), useRegisterType(), resolveUnauthenticatedRoute() (+12 more)

### Community 95 - "formatCurrency"
Cohesion: 0.17
Nodes (12): AppointmentDetailCard(), AppointmentDetailCardProps, AppointmentDetailTreatmentItem(), AppointmentDetailTreatmentItemProps, AppointmentTreatmentsSection(), AppointmentTreatmentsSectionProps, FinancesSummaryMetrics(), FinancesWeeklyRow() (+4 more)

### Community 96 - "use-appointment-create-dialog.ts"
Cohesion: 0.25
Nodes (9): AppointmentCreateDialog(), appointmentFormSchema, AppointmentFormValues, createDefaultStartsAt(), createDefaultValues(), isClinicOpenOnDate(), jsDateToIsoDay(), useAppointmentCreateDialog() (+1 more)

### Community 97 - "use-topbar-actions.ts"
Cohesion: 0.21
Nodes (9): SettingsDetailActionHandlers, ProfileAction, TopbarSecondaryAction(), TopbarActionButtonConfig, TopbarActionsConfig, TopbarAction, TopbarActionStore, TopbarBreadcrumb (+1 more)

### Community 98 - "sound.ts"
Cohesion: 0.22
Nodes (11): PatientImageUploaderDialog(), defaultValues, patientImageFormSchema, PatientImageFormValues, usePatientImageUploader(), useUploadPatientImages(), patientImageUploadSchema, initSounds() (+3 more)

### Community 99 - "patients-filters.tsx"
Cohesion: 0.22
Nodes (8): PatientsFilters(), PatientsFiltersProps, PatientFilters, PatientsFiltersSheet(), PatientsFiltersSheetProps, statusOptions, statusOptions, PATIENTS_COPY

### Community 102 - "calendar-view-mode-toggle.tsx"
Cohesion: 0.33
Nodes (4): e2eUser, playwrightResult, status, statusResult

### Community 106 - "patients-table.tsx"
Cohesion: 0.24
Nodes (7): patientsColumns, PatientsTable(), PatientsTableProps, getTreatmentsColumns(), SortableTableHead(), SortableTableHeadProps, patientsMobileColumns

### Community 107 - "inventory-adjust-stock-preview.tsx"
Cohesion: 0.47
Nodes (5): formatStockValue(), InventoryAdjustStockPreview(), InventoryAdjustStockPreviewProps, resultingStockToneClass(), InventoryMovementType

### Community 108 - "mocks.ts"
Cohesion: 0.24
Nodes (8): mockAppointment, mockEmployee, mockPatient, mockTreatment, end, initialState, start, initialState

### Community 109 - "use-clinic-info.ts"
Cohesion: 0.28
Nodes (4): NewAppointmentDatetimeFieldProps, ClinicInfo, CLINIC, Clinic

### Community 110 - "inventory-filters-sheet.tsx"
Cohesion: 0.14
Nodes (12): InventoryFilters, InventoryFiltersSheet(), InventoryFiltersSheetProps, stockOptions, InventoryStockSummaryProps, InventoryStockSummaryItemProps, StockTone, toneActive (+4 more)

### Community 111 - "appointment-materials-section.tsx"
Cohesion: 0.29
Nodes (6): AppointmentMaterialsSection(), AppointmentMaterialsSectionProps, toDialogInitialItems(), defaultMaterialsKey(), useAppointmentMaterials(), AppointmentInventoryItemWithInventory

### Community 113 - "app-search-bar-input.tsx"
Cohesion: 0.40
Nodes (6): AppSearchBarInput(), AppSearchBarInputProps, useDebouncedValue(), useSearch(), TopbarSearchState, useTopbarSearchStore

### Community 114 - "inventory-store.ts"
Cohesion: 0.11
Nodes (26): getTodayAppointments(), getInventoryAlerts(), markInventoryAlertsAsRead(), getInventoryItem(), getInventoryItems(), getInventoryMovements(), insertInventoryItem(), insertInventoryMovement() (+18 more)

### Community 115 - "mobile-card-view.tsx"
Cohesion: 0.31
Nodes (6): MobileCardViewItem(), MobileCardViewItemProps, MobileCardAction, MobileCardColumn, MobileCardView(), MobileCardViewProps

### Community 116 - "InventoryItem"
Cohesion: 0.33
Nodes (6): InventoryItemEditDialog(), InventoryEditFormValues, inventoryEditSchema, toValues(), useInventoryItemEditDialog(), InventoryItem

### Community 117 - "find-slots.ts"
Cohesion: 0.40
Nodes (9): ExistingAppointment, findAvailableSlots(), getDateKey(), getSlotSearchRange(), nextOpenDayOpening(), parseHHMM(), roundUpToStep(), sampleEvenly() (+1 more)

### Community 118 - "loader-spinner.tsx"
Cohesion: 0.33
Nodes (5): LoaderOrbitalVisual(), LoaderSpinner(), LoaderSpinnerProps, LoaderSpinnerSize, SPINNER_SIZES

### Community 119 - "patient-gallery-tab.tsx"
Cohesion: 0.10
Nodes (24): BeforeAfterComparisonProps, PatientGalleryDateGroup(), PatientGalleryDateGroupProps, PatientGalleryFilters(), PatientGalleryFiltersProps, PatientGalleryFiltersSheet(), PatientGalleryFiltersSheetProps, PatientGalleryFilterValues (+16 more)

### Community 120 - "badge.tsx"
Cohesion: 0.21
Nodes (9): Badge(), badgeVariants, groupItemsByMonth(), ProfileTimelineItem, ProfileTimelineItemRow(), ProfileTimelineItemRowProps, statusVariants, ProfileTimeline() (+1 more)

### Community 121 - "calendar-day-stats.ts"
Cohesion: 0.57
Nodes (6): computeDayStats(), computeDayStatsForRange(), getAppointmentDayKey(), getClinicOpenMinutes(), jsDayToIsoDay(), parseHHMM()

### Community 122 - "employees-table.tsx"
Cohesion: 0.40
Nodes (4): employeesColumns, EmployeesTable(), EmployeesTableProps, employeesMobileColumns

### Community 123 - "use-patient-file-uploader.ts"
Cohesion: 0.21
Nodes (10): PatientFileUploaderDialog(), defaultValues, patientFileFormSchema, PatientFileFormValues, usePatientFileUploader(), useUploadPatientFiles(), PatientFileCategoryOption, patientFileCategorySchema (+2 more)

### Community 124 - "page-filters-bar.tsx"
Cohesion: 0.40
Nodes (3): PageFiltersBarProps, PageSearchFilter(), PageSearchFilterProps

### Community 125 - "useFileUrl"
Cohesion: 0.13
Nodes (22): EmployeeAvatarDisplay(), EmployeeAvatarDisplayProps, getAvatarStyle(), EmployeeProfileHeader(), EmployeeProfileHeaderProps, getAvatarStyle(), getAvatarStyle(), getProfileInitials() (+14 more)

### Community 126 - "boot-loading-screen.tsx"
Cohesion: 0.13
Nodes (15): BootLoadingScreen(), BootLoadingScreenProps, LoaderProgressBar(), LoaderProgressBarProps, LoaderRedirectCheckBadge(), LoaderRedirectVisual(), LoaderStatusList(), LoaderStatusListProps (+7 more)

### Community 127 - "appointment-person-avatar.tsx"
Cohesion: 0.38
Nodes (4): AppointmentHeaderPersonProps, AppointmentPersonAvatar(), AppointmentPersonAvatarProps, getInitials()

### Community 128 - "settings-page-client.tsx"
Cohesion: 0.14
Nodes (19): SETTINGS_TAB_ITEMS, SettingsDetailTabBar(), SettingsDetailTabBarProps, getSettingsDetailActions(), SettingsPageClient(), SettingsPageClientProps, SettingsProfilePanel(), SettingsProfilePanelProps (+11 more)

### Community 129 - "finances-summary-metrics.tsx"
Cohesion: 0.40
Nodes (4): FinancesMetricItem(), FinancesMetricItemProps, FinancesSummaryMetricsProps, MetricConfig

### Community 130 - "devDependencies"
Cohesion: 0.10
Nodes (21): devDependencies, eslint, eslint-config-next, husky, jsdom, lint-staged, @playwright/test, prettier (+13 more)

### Community 131 - "finances-filters.tsx"
Cohesion: 0.13
Nodes (11): CategoryBreakdownItem, FinancesCategoryBreakdownProps, FinancesCategoryRow(), FinancesCategoryRowProps, FinancesFilters(), FinancesFiltersProps, FinancesFilters, FinancesFiltersSheet() (+3 more)

### Community 132 - "treatment-delete-confirm-dialog.tsx"
Cohesion: 0.67
Nodes (3): TreatmentDeleteConfirmDialog(), TreatmentDeleteConfirmDialogProps, useDeleteTreatment()

### Community 133 - "format.ts"
Cohesion: 0.11
Nodes (22): AppointmentDetailSidebar(), AppointmentDetailSidebarProps, AppointmentHeader(), AppointmentHeaderProps, AppointmentStatusBadge(), AppointmentStatusBadgeProps, statusVariants, CalendarOverlapGroupRow() (+14 more)

### Community 138 - "schedule-x-calendar.tsx"
Cohesion: 0.39
Nodes (4): ScheduleXCalendarInner(), ScheduleXCalendar(), SkeletonBlock(), useElementHeight()

### Community 139 - "app-bottom-nav.tsx"
Cohesion: 0.47
Nodes (3): AppBottomNavItem(), AppBottomNavItemProps, BOTTOM_NAV_COPY

### Community 141 - "campaigns-date-range-filter.tsx"
Cohesion: 0.24
Nodes (12): FilesDateRangeFilter(), FilesDateRangeFilterProps, formatRangeLabel(), parseDate(), CampaignsDateRangeFilter(), CampaignsDateRangeFilterProps, formatRangeLabel(), parseDate() (+4 more)

### Community 159 - "use-inventory-item-create-dialog.ts"
Cohesion: 0.20
Nodes (8): InventoryItemCreateFormProps, AppDialogError(), AppDialogErrorProps, defaultValues, inventoryFormSchema, InventoryFormValues, inventorySchema, formatZodError()

### Community 160 - "e2e-helpers.ts"
Cohesion: 0.16
Nodes (16): createAndGoToAppointmentDetail(), authDirectory, authFile, E2E_DATA, E2E_TINY_PNG, E2E_USER, clickPatientTableRow(), clickTopbarMenuAction() (+8 more)

### Community 164 - "use-employee-edit-dialog.ts"
Cohesion: 0.21
Nodes (10): EmployeeColorFieldProps, EmployeeEditDialog(), EmployeeEditFormProps, roleOptions, EMPLOYEE_COLOR_PRESETS, EMPLOYEE_EDIT_COPY, employeeEditFormSchema, EmployeeEditFormValues (+2 more)

### Community 171 - "use-schedule-x-calendar.ts"
Cohesion: 0.10
Nodes (23): CalendarWeekUiRefs, updateCalendarWeekUiRefs(), CalendarEmptyHeader(), CalendarEventProps, CalendarTimeGridEvent(), CalendarWeekGridDate(), buildClinicBackgroundEvents(), CLOSED_DAY_STYLE (+15 more)

### Community 174 - "button.tsx"
Cohesion: 0.07
Nodes (32): Props, LoginAuthTabs(), LoginAuthTabsProps, LoginFormFields(), LoginFormFieldsProps, LoginFormPanelProps, Props, RegisterEmployeeFormCopy (+24 more)

### Community 178 - "before-after-comparison-slider.tsx"
Cohesion: 0.16
Nodes (13): BeforeAfterComparisonContentProps, BeforeAfterComparisonImage(), BeforeAfterComparisonImageProps, BeforeAfterComparisonSlider(), BeforeAfterComparisonSliderProps, BeforeAfterOrientation, buildComparisonLabel(), BeforeAfterComparisonToolbar() (+5 more)

### Community 183 - "employee-schema.ts"
Cohesion: 0.12
Nodes (16): EmployeeInviteFormProps, roleOptions, EMPLOYEE_INVITE_COPY, defaultValues, EmployeeFormValues, useEmployeeInviteDialog(), useCreateEmployee(), clinicMembershipInvitationRoleSchema (+8 more)

### Community 185 - "utils.ts"
Cohesion: 0.12
Nodes (15): EmployeeDetailTabButton(), EmployeeDetailTabButtonProps, InventoryDetailTabButton(), InventoryDetailTabButtonProps, PatientDetailTabButton(), PatientDetailTabButtonProps, SettingsDetailTabButton(), SettingsDetailTabButtonProps (+7 more)

### Community 186 - "inventory-movements-list.tsx"
Cohesion: 0.29
Nodes (9): formatMovementQuantity(), inventoryMovementDotClass(), InventoryMovementRow(), InventoryMovementRowProps, inventoryMovementToneClass(), inventoryMovementTypeLabel(), groupMovementsByMonth(), InventoryMovementsList() (+1 more)

### Community 187 - "use-patient-create-dialog.ts"
Cohesion: 0.13
Nodes (14): PatientCreateFormProps, PatientEditDialog(), NewPatientDateField(), NewPatientDateFieldProps, PatientAvatarFieldProps, PATIENT_CREATE_COPY, PATIENT_EDIT_COPY, defaultValues (+6 more)

### Community 193 - "hyperframes.json"
Cohesion: 0.20
Nodes (9): authoringSkill, media, autoProxy, paths, assets, blocks, components, registry (+1 more)

### Community 223 - "use-active-clinic.ts"
Cohesion: 0.19
Nodes (14): AppointmentReminderRow(), AppointmentReminderRowProps, useServerBootstrap(), TopbarClinicSelector(), ClinicReminderSettingsUpdate, getClinicReminderSettings(), getRemindersForAppointment(), sendManualReminder() (+6 more)

### Community 233 - "calendar-page-client.tsx"
Cohesion: 0.11
Nodes (25): CalendarEmployeeFilter(), CalendarEmployeeFilterProps, CALENDAR_FILTER_DEFAULTS, CalendarPageClient(), CalendarPageClientProps, CLOSED_GROUP_SHEET, CalendarFilters, CalendarFiltersSheet() (+17 more)

### Community 234 - "app-searchable-multi-select.tsx"
Cohesion: 0.28
Nodes (5): AppSearchableMultiSelectOption, AppSearchableMultiSelectProps, AppSearchableMultiSelectOption(), AppSearchableMultiSelectOptionProps, COMBOBOX_COPY

### Community 235 - "scripts"
Cohesion: 0.22
Nodes (8): name, private, scripts, check, dev, publish, render, type

### Community 240 - "capture-product.mjs"
Cohesion: 0.40
Nodes (4): captureDir, captures, projectDir, scriptDir

### Community 249 - "owner-clinic-form.ts"
Cohesion: 0.14
Nodes (12): employeeColors, employeeRoles, mapOperationalRoleToEmployeeRole(), OperationalRoleOption, operationalRoleOptions, buildCreateClinicPayload(), CreateClinicPayload, OwnerClinicFormValues (+4 more)

### Community 263 - "supabase.ts"
Cohesion: 0.13
Nodes (19): AuthProviderProps, getClientHydratedSnapshot(), getServerHydratedSnapshot(), subscribeToClientHydration(), useAuthHydrated(), ClinicMembershipRow, getClinicById(), getMemberships() (+11 more)

### Community 272 - "settings-profile-header.tsx"
Cohesion: 0.10
Nodes (16): ClinicInfoRow(), ClinicInfoRowProps, SettingsClinicHoursPanelProps, SettingsClinicPanelProps, SettingsManagementLink(), SettingsManagementLinkProps, MANAGEMENT_LINKS, SettingsProfileHeader() (+8 more)

## Knowledge Gaps
- **817 isolated node(s):** `InventoryStockBadgeProps`, `levelVariants`, `StockTone`, `InventoryStockSummaryItemProps`, `toneText` (+812 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `app-searchable-combobox.tsx`, `format.ts`, `sidebar.tsx`, `use-treatment-dialog.ts`, `calendar-agenda.ts`, `skeleton.tsx`, `dropzone.tsx`, `use-employee-edit-dialog.ts`, `inventory-page-client.tsx`, `use-schedule-x-calendar.ts`, `button.tsx`, `app-dialog-content.tsx`, `utils.ts`, `appointment-create-dialog.tsx`, `use-app-nav-items.tsx`, `app-date-field.tsx`, `filters-sheet.tsx`, `input-group.tsx`, `data-table.tsx`, `use-profile-edit-dialog.ts`, `use-owner-registration.ts`, `app-topbar.tsx`, `calendar-page-client.tsx`, `loader-spinner.tsx`, `badge.tsx`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `Button()` connect `button.tsx` to `settings-page-client.tsx`, `use-appointment-materials-override-dialog.ts`, `useEmployees`, `app-searchable-combobox.tsx`, `Patient`, `use-treatment-images.ts`, `employees-page-client.tsx`, `sidebar.tsx`, `campaigns-date-range-filter.tsx`, `finances-page-client.tsx`, `use-treatment-dialog.ts`, `settings-profile-header.tsx`, `dropzone.tsx`, `appointments-columns.tsx`, `use-employee-edit-dialog.ts`, `login-hero-panel.tsx`, `before-after-comparison-slider.tsx`, `bootstrap.ts`, `utils.ts`, `appointment-create-dialog.tsx`, `use-patient-create-dialog.ts`, `app-date-field.tsx`, `patient-files-copy.ts`, `filters-sheet.tsx`, `useAuth`, `cn`, `input-group.tsx`, `data-table.tsx`, `files-table.tsx`, `use-profile-edit-dialog.ts`, `patient-file-row.tsx`, `use-owner-registration.ts`, `invite-team-page-client.tsx`, `app-topbar.tsx`, `appointment-detail-page-client.tsx`, `use-active-clinic.ts`, `use-topbar-actions.ts`, `calendar-page-client.tsx`, `app-searchable-multi-select.tsx`, `patients-table.tsx`, `appointment-materials-section.tsx`, `app-search-bar-input.tsx`, `mobile-card-view.tsx`, `page-filters-bar.tsx`, `useFileUrl`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `format.ts`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **What connects `InventoryStockBadgeProps`, `levelVariants`, `StockTone` to the rest of the system?**
  _817 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useEmployees` be split into smaller, more focused modules?**
  _Cohesion score 0.13793103448275862 - nodes in this community are weakly interconnected._
- **Should `app-searchable-combobox.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11231884057971014 - nodes in this community are weakly interconnected._
- **Should `Patient` be split into smaller, more focused modules?**
  _Cohesion score 0.10887096774193548 - nodes in this community are weakly interconnected._