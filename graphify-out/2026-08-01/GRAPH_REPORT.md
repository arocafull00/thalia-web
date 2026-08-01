# Graph Report - thalia-web  (2026-08-01)

## Corpus Check
- 766 files · ~325,464 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2906 nodes · 8130 edges · 172 communities (154 shown, 18 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.54)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ea5a1b85`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- useClinicId
- appointment-materials-section.tsx
- useEmployees
- cn
- patient-detail-copy.ts
- calendar-grid.ts
- app-layout-client.tsx
- useCalendarStore
- use-treatment-images.ts
- employees-page-client.tsx
- sidebar.tsx
- createClient
- app/layout.tsx
- treatments-copy.ts
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
- login-form-panel.tsx
- patient-detail-page-client.tsx
- use-treatment.ts
- patient-files-store.ts
- register-employee-copy.ts
- employees-store.ts
- scripts
- use-inventory-adjust-stock-dialog.ts
- app-dialog-content.tsx
- database.types.ts
- format.ts
- employee-invite-errors.ts
- invite-page-client.tsx
- campaign-segment-schema.ts
- clinic-store.ts
- getServerActiveClinicId
- dependencies
- appointment-create-dialog.tsx
- use-app-nav-items.tsx
- campaign-detail-page-client.tsx
- use-campaign-create-dialog.ts
- Employee
- app-date-field.tsx
- patient-files-tab.tsx
- filters-sheet.tsx
- employee-detail-page-client.tsx
- context-menu.tsx
- patient-images-store.ts
- campaigns.dal.ts
- employee-timeline.tsx
- use-patient-files.ts
- use-clinic-edit-dialog.ts
- input-group.tsx
- settings-profile-sidebar.tsx
- files-table.tsx
- use-files-page.ts
- AppointmentWithRelations
- campaigns-filters.tsx
- use-profile-edit-dialog.ts
- bootstrap.ts
- formatCurrency
- components.json
- register-schema.ts
- use-appointment-create-dialog.ts
- finances-store.ts
- employee-detail-tab-bar.tsx
- treatment-store.ts
- resolve-post-auth-route.ts
- compilerOptions
- logger.ts
- app-topbar.tsx
- finances-store.test.ts
- use-appointments.ts
- useAuth
- appointment-detail-sidebar.tsx
- employee-profile-header.tsx
- treatment-detail-page-client.tsx
- use-patient-image-uploader.ts
- search-copy.ts
- calendar-view-mode-toggle.tsx
- patient-image-viewer.tsx
- dropdown-menu.tsx
- inventory-store.ts
- mocks.ts
- use-clinic-info.ts
- inventory-filters.tsx
- finances/page.tsx
- patient-image-uploader-form.tsx
- unwrapSupabaseList
- calendar-view-mode-toggle.tsx
- settings-detail-tab-content.tsx
- find-slots.ts
- employee-detail-header.tsx
- patient-gallery-tab.tsx
- profile-timeline.tsx
- sidebar-profile-footer.tsx
- use-finances-page.ts
- use-patient-file-uploader.ts
- employee-schema.ts
- use-file-url.ts
- calendar-page-client.tsx
- appointment-person-avatar.tsx
- settings-page-client.tsx
- finances-summary-metrics.tsx
- devDependencies
- finances-weekly-breakdown.tsx
- schedule-x-employee-calendars.ts
- format.ts
- appointment-status-select.tsx
- auth-provider.tsx
- settings-account-panel.tsx
- settings-management-panel.tsx
- useScheduleXCalendar
- app-bottom-nav.tsx
- send-campaign/index.ts
- campaigns-date-range-filter.tsx
- stat.tsx
- sound.ts
- employees-store.test.ts
- campaign-recipients-preview.tsx
- use-transaction-create-dialog.ts
- e2e-helpers.ts
- use-employee-edit-dialog.ts
- use-schedule-x-calendar.ts
- button.tsx
- before-after-comparison-slider.tsx
- use-employee-invite-dialog.ts
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
- settings-copy.ts
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
- `FinancesPage()` --calls--> `getTransactions()`  [EXTRACTED]
  app/(app)/finances/page.tsx → src/dal/finances.server.dal.ts
- `FinancesPage()` --calls--> `summaryKey()`  [EXTRACTED]
  app/(app)/finances/page.tsx → src/stores/finances-store.ts
- `FinancesPage()` --calls--> `transactionsKey()`  [EXTRACTED]
  app/(app)/finances/page.tsx → src/stores/finances-store.ts
- `InventoryPage()` --calls--> `getServerActiveClinicId()`  [EXTRACTED]
  app/(app)/inventory/page.tsx → src/lib/server/active-clinic.ts

## Import Cycles
- 3-file cycle: `src/lib/active-clinic-id.ts -> src/stores/auth-store.ts -> src/stores/employees-store.ts -> src/lib/active-clinic-id.ts`

## Communities (172 total, 18 thin omitted)

### Community 0 - "useClinicId"
Cohesion: 0.10
Nodes (29): INVENTORY_DETAIL_TAB_ITEMS, InventoryDetailTabBar(), InventoryDetailTabBarProps, InventoryDetailTabContent(), InventoryDetailTabContentProps, InventoryItemEditDialog(), InventoryDetailPageClient(), InventoryDetailPageClientProps (+21 more)

### Community 1 - "appointment-materials-section.tsx"
Cohesion: 0.11
Nodes (20): AppointmentDetailActionHandlers, AppointmentMaterialsOverrideDialog(), AppointmentMaterialsOverrideForm(), AppointmentMaterialsOverrideFormProps, AppointmentMaterialsSection(), AppointmentMaterialsSectionProps, toDialogInitialItems(), defaultMaterialsKey() (+12 more)

### Community 2 - "useEmployees"
Cohesion: 0.14
Nodes (20): AppointmentDateRange(), AppointmentDateRangeProps, formatAppointmentDateParam(), getDefaultAppointmentDateRange(), parseAppointmentDateParam(), AppointmentEmployeeFilter(), AppointmentEmployeeFilterProps, AppointmentFilters() (+12 more)

### Community 3 - "cn"
Cohesion: 0.10
Nodes (30): AppSearchableCombobox(), AppSearchableComboboxOption, AppSearchableComboboxProps, AppSearchableComboboxItem(), AppSearchableComboboxItemProps, Avatar(), AvatarBadge(), AvatarFallback() (+22 more)

### Community 4 - "patient-detail-copy.ts"
Cohesion: 0.09
Nodes (23): PatientDetailActionsMenu(), PatientDetailActionsMenuProps, PatientDetailStatsProps, PatientDetailStatsRow(), PatientStatCard(), PatientStatCardProps, PatientClinicalNotesPanel(), PatientClinicalNotesPanelProps (+15 more)

### Community 5 - "calendar-grid.ts"
Cohesion: 0.20
Nodes (17): MonthMiniCalendar(), MonthMiniCalendarProps, appointmentLayout(), formatDayHeader(), formatWeekRange(), getDayEnd(), getDayStart(), getMonthGridDays() (+9 more)

### Community 7 - "useCalendarStore"
Cohesion: 0.20
Nodes (16): CalendarDayDialog(), CalendarMobileDayView(), CalendarMobileMonthAppointments(), CalendarMobileMonthView(), useCalendarDayAgenda(), useCalendarMobileMonth(), formatVisibleRangeLabel(), useCalendarPage() (+8 more)

### Community 8 - "use-treatment-images.ts"
Cohesion: 0.17
Nodes (11): TreatmentDetailInventorySectionProps, TreatmentImageGalleryProps, TreatmentImageThumbnailProps, TreatmentImagesSection(), TreatmentImagesSectionProps, EMPTY_IMAGES, useTreatmentImages(), TreatmentImageGalleryItem (+3 more)

### Community 9 - "employees-page-client.tsx"
Cohesion: 0.11
Nodes (32): AppointmentsPageClient(), AppointmentsPageClientProps, EMPLOYEE_FILTER_DEFAULTS, EmployeesPageClient(), EmployeesPageClientProps, FinancesPageClient(), INVENTORY_FILTER_DEFAULTS, InventoryPageClient() (+24 more)

### Community 10 - "sidebar.tsx"
Cohesion: 0.08
Nodes (31): AppBottomNav(), AppShell(), AppShellProps, AppSidebar(), Separator(), Sidebar(), SidebarContent(), SidebarContext (+23 more)

### Community 11 - "createClient"
Cohesion: 0.14
Nodes (22): EmployeeDetailPage(), InventoryItemDetailPage(), InventoryPage(), PatientDetailPage(), PatientsPage(), TreatmentDetailPage(), GET(), getEmployee() (+14 more)

### Community 12 - "app/layout.tsx"
Cohesion: 0.11
Nodes (18): geistMono, geistSans, metadata, viewport, AuthProvider(), PwaInstallProvider(), PwaInstallProviderProps, ServiceWorkerProvider() (+10 more)

### Community 13 - "treatments-copy.ts"
Cohesion: 0.12
Nodes (17): TreatmentColorFieldProps, TreatmentDetailHeader(), TreatmentDetailHeaderProps, TreatmentDetailInfoSection(), TreatmentDetailInfoSectionProps, TreatmentFormProps, getTreatmentsColumns(), TreatmentFilters (+9 more)

### Community 14 - "finances-page-client.tsx"
Cohesion: 0.09
Nodes (21): CategoryBreakdownItem, FinancesCategoryBreakdownProps, FinancesCategoryRow(), FinancesCategoryRowProps, FinancesFilters(), FinancesFiltersProps, FinancesFilters, FinancesFiltersSheet() (+13 more)

### Community 15 - "calendar-agenda.ts"
Cohesion: 0.14
Nodes (16): AppointmentRow(), AppointmentRowProps, DayAgendaAppointmentCard(), DayAgendaAppointmentCardProps, DayAgendaList(), DayAgendaListProps, DashboardAgendaProps, DashboardHeaderProps (+8 more)

### Community 16 - "proxy.ts"
Cohesion: 0.33
Nodes (7): config, proxy(), publicRoutes, pwaRoutes, SessionUpdateResult, updateSession(), withSessionCookies()

### Community 28 - "appointments-store.ts"
Cohesion: 0.11
Nodes (23): AppointmentInsert, AppointmentInventoryLinkInput, AppointmentRangeParams, AppointmentTreatmentInsert, AppointmentUpdate, deleteAppointment(), deleteAppointmentTreatments(), EffectiveAppointmentMaterial (+15 more)

### Community 31 - "dropzone.tsx"
Cohesion: 0.06
Nodes (41): CampaignImageFieldProps, PatientFileUploaderDropzoneFileItem(), PatientFileUploaderDropzoneFileItemProps, PatientFileUploaderForm(), PatientFileUploaderFormProps, PatientImageUploaderDropzoneFileItemProps, PatientImageUploaderForm(), Dropzone() (+33 more)

### Community 33 - "appointments-columns.tsx"
Cohesion: 0.14
Nodes (20): AppointmentStatusErrorToastProps, notifyAppointmentStatusError(), AppointmentStockButton(), AppointmentStockButtonProps, buildAppointmentsColumns(), APPOINTMENT_STATUS_COPY, ControlledAppointmentError, getAppointmentStatusErrorMessage() (+12 more)

### Community 36 - "schema-helpers.ts"
Cohesion: 0.13
Nodes (19): appointmentFieldsSchema, appointmentSchema, AppointmentSchemaInput, appointmentUpdateSchema, AppointmentUpdateSchemaInput, patientFieldsSchema, PatientSchemaInput, patientUpdateSchema (+11 more)

### Community 37 - "patient-file-storage.ts"
Cohesion: 0.12
Nodes (25): FileActionsMenu(), FileActionsMenuProps, PatientFileIcon(), PatientFileIconProps, PatientFileRowProps, PatientFileViewer(), DropdownMenu(), DropdownMenuContent() (+17 more)

### Community 38 - "inventory-page-client.tsx"
Cohesion: 0.12
Nodes (24): CalendarOverlapGroupEvent(), CalendarOverlapGroupEventProps, getEmployeeColor(), getEmployeeName(), buildScheduleEventsForViewMode(), collectUniqueProfessionalColors(), formatProfessionalSummary(), groupOverlappingAppointments() (+16 more)

### Community 39 - "table-mobile-columns.tsx"
Cohesion: 0.10
Nodes (22): employeesColumns, EmployeesTable(), EmployeesTableProps, transactionsColumns, TransactionsTable(), TransactionsTableProps, inventoryColumns, InventoryTable() (+14 more)

### Community 40 - "use-clinic-hours-dialog.ts"
Cohesion: 0.14
Nodes (11): Props, ClinicHoursDialog(), ClinicHoursFormProps, CLINIC_HOURS_COPY, FutureAppointmentConflict, getFutureAppointments(), ClinicHoursFormValues, clinicHoursSchema (+3 more)

### Community 41 - "login-form-panel.tsx"
Cohesion: 0.12
Nodes (13): LoginAuthTabs(), LoginAuthTabsProps, LoginFormFields(), LoginFormFieldsProps, LoginFormPanel(), LoginFormPanelProps, LoginHeroIllustration(), loginIllustrationSvg (+5 more)

### Community 42 - "patient-detail-page-client.tsx"
Cohesion: 0.15
Nodes (23): PATIENT_DETAIL_TAB_ITEMS, PatientDetailTabBar(), PatientDetailTabBarProps, PatientDetailPageClient(), PatientDetailPageClientProps, getPatientAvatarKey(), usePatientAvatar(), usePatientCreateDialog() (+15 more)

### Community 43 - "use-treatment.ts"
Cohesion: 0.14
Nodes (20): TreatmentDeleteConfirmDialog(), TreatmentDeleteConfirmDialogProps, TreatmentDialog(), TreatmentCatalogFilters, useTreatmentCatalog(), emptyValues, toFormValues(), useTreatmentDialog() (+12 more)

### Community 44 - "patient-files-store.ts"
Cohesion: 0.13
Nodes (24): createPatientFile(), deletePatientFile(), deletePatientFileRecord(), getGlobalPatientFiles(), getPatientFile(), getPatientFiles(), GlobalPatientFilesParams, PaginatedPatientFiles (+16 more)

### Community 45 - "register-employee-copy.ts"
Cohesion: 0.23
Nodes (10): RegisterEmployeeSidebar(), RegisterEmployeeSidebarProps, getSidebarCopy(), REGISTER_COPY, REGISTER_EMPLOYEE_FORM_COPY, REGISTER_EMPLOYEE_SIDEBAR_COPY, RegisterCopy, SIDEBAR_COPY (+2 more)

### Community 46 - "employees-store.ts"
Cohesion: 0.13
Nodes (20): EmployeeDetailTabContent(), EmployeeDetailTabContentProps, EmployeeProfileSidebarProps, EmployeeProfileSummary(), EmployeeProfileSummaryProps, EmployeeStatCard(), EmployeeStatCardProps, EmployeeAppointmentRow (+12 more)

### Community 47 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, build, dev, dev:https, lint, lint:staged, prepare, start (+10 more)

### Community 48 - "use-inventory-adjust-stock-dialog.ts"
Cohesion: 0.13
Nodes (19): formatStockValue(), InventoryAdjustStockPreview(), InventoryAdjustStockPreviewProps, resultingStockToneClass(), InventoryItemAdjustStockDialog(), getInventoryDetailActions(), InventoryDetailActionHandlers, showComingSoon() (+11 more)

### Community 49 - "app-dialog-content.tsx"
Cohesion: 0.24
Nodes (6): BeforeAfterComparisonProps, AppDialogClose(), AppDialogCloseProps, AppDialogContent(), AppDialogContentProps, APP_DIALOG_COPY

### Community 50 - "database.types.ts"
Cohesion: 0.09
Nodes (20): employeeColors, employeeRoles, EmployeesUiStore, useEmployeesUiStore, AppointmentInventoryItem, AppointmentInventoryItemWithStock, AppointmentReminderStatus, AppointmentTreatment (+12 more)

### Community 51 - "format.ts"
Cohesion: 0.33
Nodes (5): lint-staged, *.{ts,tsx}, name, private, version

### Community 52 - "employee-invite-errors.ts"
Cohesion: 0.31
Nodes (10): createEmployeeInviteError(), EMPLOYEE_INVITE_ERROR_MESSAGES, EMPLOYEE_INVITE_STATUS_MESSAGES, EmployeeInviteErrorBody, getDictionaryMessage(), getErrorCandidates(), getNestedMessage(), getStringValue() (+2 more)

### Community 53 - "invite-page-client.tsx"
Cohesion: 0.11
Nodes (16): Props, EmployeesFilters(), EmployeesFiltersProps, roleOptions, EmployeeFilters, EmployeesFiltersSheet(), EmployeesFiltersSheetProps, roleOptions (+8 more)

### Community 54 - "campaign-segment-schema.ts"
Cohesion: 0.13
Nodes (18): ageRangeConfigSchema, buildCampaignSegmentFilters(), buildSegmentsFromFilters(), CampaignSegmentFilters, EMPTY_CAMPAIGN_SEGMENT_FILTERS, EMPTY_CAMPAIGN_SEGMENT_INPUTS, lastVisitDateConfigSchema, NUMERIC_RULES (+10 more)

### Community 55 - "clinic-store.ts"
Cohesion: 0.13
Nodes (14): AppLayout(), ServerBootstrapContext, ServerBootstrapState, StoreHydrator(), StoreHydratorProps, writeActiveClinicCookie(), getAppBootstrap, ClinicStore (+6 more)

### Community 56 - "getServerActiveClinicId"
Cohesion: 0.19
Nodes (19): AppointmentsPage(), CalendarPage(), DashboardPage(), EmployeesPage(), SettingsPage(), TreatmentsPage(), getAppointments(), getClinicById() (+11 more)

### Community 57 - "dependencies"
Cohesion: 0.05
Nodes (43): dependencies, @base-ui/react, browser-image-compression, class-variance-authority, clsx, cuelume, date-fns, date-fns-tz (+35 more)

### Community 58 - "appointment-create-dialog.tsx"
Cohesion: 0.12
Nodes (35): AppointmentCreateDialogProps, AppointmentDeleteDialogProps, AppointmentMaterialsOverrideDialogProps, CalendarDayDialogProps, EmployeeEditDialogProps, InventoryItemAdjustStockDialogProps, movementTypeOptions, InventoryItemEditDialogProps (+27 more)

### Community 59 - "use-app-nav-items.tsx"
Cohesion: 0.12
Nodes (17): AppSidebarNavItem(), AppSidebarNavItemProps, AppSidebarNavPending(), AppSidebarNavSection(), AppSidebarNavSectionProps, SidebarGroup(), SidebarGroupContent(), SidebarGroupLabel() (+9 more)

### Community 60 - "campaign-detail-page-client.tsx"
Cohesion: 0.18
Nodes (11): CampaignDetailPageClient(), CampaignDetailImage(), CampaignDetailImageProps, CampaignReachSummary(), CampaignReachSummaryProps, CampaignMessagePreviewProps, CampaignImageCellProps, MARKETING_COPY (+3 more)

### Community 61 - "use-campaign-create-dialog.ts"
Cohesion: 0.15
Nodes (13): CampaignCreateForm(), CampaignCreateFormProps, CampaignSegmentFieldsProps, NumericField, TreatmentOption, CampaignStepIndicatorProps, CAMPAIGN_STEPS, campaignFormSchema (+5 more)

### Community 62 - "Employee"
Cohesion: 0.17
Nodes (15): PatientDetailHeader(), PatientDetailHeaderProps, SettingsDetailHeader(), SettingsDetailHeaderProps, SettingsProfileHeader(), SettingsProfileHeaderProps, SettingsUserPanelProps, getAvatarStyle() (+7 more)

### Community 63 - "app-date-field.tsx"
Cohesion: 0.14
Nodes (13): AppDateField(), AppDateFieldProps, pad(), AppDatePopoverFieldProps, buttonVariants, Calendar(), CalendarDayButton(), Popover() (+5 more)

### Community 64 - "patient-files-tab.tsx"
Cohesion: 0.17
Nodes (12): categoryOptions, PatientFileCategoryFilter(), PatientFileCategoryFilterProps, PatientFilePdfNavigation(), PatientFilePdfNavigationProps, PatientFilePdfViewerContent(), PatientFilePdfViewerContentProps, PatientFilePdfViewer() (+4 more)

### Community 65 - "filters-sheet.tsx"
Cohesion: 0.16
Nodes (12): CalendarOverlapGroupSheet(), CalendarOverlapGroupSheetProps, FiltersSheet(), FiltersSheetProps, Sheet(), SheetContent(), SheetDescription(), SheetFooter() (+4 more)

### Community 66 - "employee-detail-page-client.tsx"
Cohesion: 0.27
Nodes (13): EmployeeStatusConfirmDialog(), EmployeeStatusConfirmDialogProps, EmployeeDetailPageClient(), EmployeeDetailPageClientProps, EMPLOYEE_STATUS_COPY, useEmployeeDetailTabs(), useEmployee(), useEmployeeAppointments() (+5 more)

### Community 67 - "context-menu.tsx"
Cohesion: 0.14
Nodes (12): PatientGalleryImageThumbProps, ContextMenu(), ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator() (+4 more)

### Community 68 - "patient-images-store.ts"
Cohesion: 0.14
Nodes (20): createPatientImage(), deletePatientImage(), getImageUrl(), getPatientImages(), TreatmentPatientImagesPage, compressTreatmentImage(), getImageDimensions(), buildPatientImageKey() (+12 more)

### Community 69 - "campaigns.dal.ts"
Cohesion: 0.17
Nodes (12): buildCopyTitle(), CampaignInsert, CampaignUpdate, duplicateCampaign(), getCampaign(), insertCampaign(), SendCampaignResult, buildCampaignImageKey() (+4 more)

### Community 70 - "employee-timeline.tsx"
Cohesion: 0.26
Nodes (14): EmployeeAppointmentRow(), EmployeeAppointmentRowProps, EmployeeTimeline(), EmployeeTimelineProps, mapAppointmentsToTimelineItems(), mapAppointmentsToTimelineItems(), PatientTimeline(), PatientTimelineProps (+6 more)

### Community 71 - "use-patient-files.ts"
Cohesion: 0.19
Nodes (15): PatientFileDeleteConfirmDialog(), PatientFileDeleteConfirmDialogProps, PatientFileEditDialog(), PatientFilesTab(), getFileUrl(), useDeletePatientFile(), usePatientFiles(), usePatientFileUrl() (+7 more)

### Community 72 - "use-clinic-edit-dialog.ts"
Cohesion: 0.16
Nodes (13): ClinicEditDialog(), ClinicEditForm(), ClinicEditFormProps, CLINIC_EDIT_COPY, ClinicMembershipRow, getMemberships(), updateClinic(), updateClinicHours() (+5 more)

### Community 73 - "input-group.tsx"
Cohesion: 0.18
Nodes (13): REMINDER_HOUR_OPTIONS, SettingsWhatsAppPanel(), InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput() (+5 more)

### Community 74 - "settings-profile-sidebar.tsx"
Cohesion: 0.13
Nodes (22): formatQuantity(), InventoryOption, TreatmentInventoryLinkRow(), TreatmentInventoryLinkRowDisplayProps, TreatmentInventoryLinkRowFormProps, TreatmentInventoryLinkRowProps, TreatmentInventoryLinksFieldProps, DataTableProps (+14 more)

### Community 75 - "files-table.tsx"
Cohesion: 0.17
Nodes (16): buildFilesColumns(), FileAction, FilesPagination(), FilesPaginationProps, FileAction, FilesResults(), FilesResultsProps, FileAction (+8 more)

### Community 76 - "use-files-page.ts"
Cohesion: 0.10
Nodes (25): FilesDateRangeFilter(), FilesDateRangeFilterProps, formatRangeLabel(), parseDate(), categoryOptions, FilesFiltersProps, FilesFiltersSheet(), FilesFiltersSheetProps (+17 more)

### Community 77 - "AppointmentWithRelations"
Cohesion: 0.19
Nodes (11): AppointmentsMobileList(), AppointmentsMobileListProps, AppointmentsTable(), AppointmentsTableProps, PatientDetailTabContent(), PatientDetailTabContentProps, PatientAppointmentsTab(), PatientAppointmentsTabProps (+3 more)

### Community 78 - "campaigns-filters.tsx"
Cohesion: 0.15
Nodes (13): CampaignsFilters(), CampaignsFiltersProps, CampaignsFiltersSheet(), CampaignsFiltersSheetProps, CampaignsSheetFilters, statusOptions, statusOptions, CAMPAIGN_STATUS_VALUES (+5 more)

### Community 79 - "use-profile-edit-dialog.ts"
Cohesion: 0.23
Nodes (10): ProfileColorFieldProps, ProfileEditDialog(), ProfileEditForm(), ProfileEditFormProps, PROFILE_COLOR_PRESETS, PROFILE_EDIT_COPY, profileEditFormSchema, ProfileEditFormValues (+2 more)

### Community 80 - "bootstrap.ts"
Cohesion: 0.18
Nodes (13): ClinicMembershipRow, getMemberships(), ActiveClinicBootstrap, AppBootstrap, getCachedEmployee, getCachedMemberships, getServerIdentity, mapMembershipRow() (+5 more)

### Community 81 - "formatCurrency"
Cohesion: 0.10
Nodes (26): AppointmentDetailTreatmentItem(), AppointmentDetailTreatmentItemProps, AppointmentTreatmentsSection(), AppointmentTreatmentsSectionProps, InventoryDetailHeader(), InventoryDetailHeaderProps, InventoryItemIconDisplay(), InventoryItemSidebar() (+18 more)

### Community 82 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 83 - "register-schema.ts"
Cohesion: 0.10
Nodes (22): Props, OwnerClinicStep(), Props, displayValue(), OwnerConfirmationStep(), Props, Props, Props (+14 more)

### Community 84 - "use-appointment-create-dialog.ts"
Cohesion: 0.13
Nodes (14): AppointmentCreateFormProps, AppointmentPatientOption, Props, AppointmentSlotSearchControlsProps, SEARCH_MODE_OPTIONS, APPOINTMENT_CREATE_COPY, getAppointments(), SlotSearchMode (+6 more)

### Community 85 - "finances-store.ts"
Cohesion: 0.23
Nodes (11): getTransactions(), insertTransaction(), TransactionInsert, TransactionUpdate, updateTransaction(), FinancesStore, TransactionInput, transactionsToCsv() (+3 more)

### Community 86 - "employee-detail-tab-bar.tsx"
Cohesion: 0.20
Nodes (9): EMPLOYEE_DETAIL_TAB_ITEMS, EmployeeDetailTabBar(), EmployeeDetailTabBarProps, EmployeeQuickActions(), EmployeeQuickActionsProps, EmployeeDetailActionHandlers, getEmployeeDetailActions(), EMPLOYEE_DETAIL_COPY (+1 more)

### Community 87 - "treatment-store.ts"
Cohesion: 0.14
Nodes (17): deleteTreatment(), getTreatment(), getTreatments(), getTreatmentsByIds(), insertTreatment(), replaceTreatmentInventoryLinks(), TreatmentInsert, TreatmentInventoryLinkInsert (+9 more)

### Community 88 - "resolve-post-auth-route.ts"
Cohesion: 0.23
Nodes (12): navigateAfterAuth(), externalMemberships(), needsClinicSelector(), PostAuthRouteInput, PostAuthRouteResult, resolvePostAuthRoute(), resolveUnauthenticatedRoute(), buildEmployeeProfileMetadata() (+4 more)

### Community 89 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 90 - "logger.ts"
Cohesion: 0.17
Nodes (8): AppointmentDetailPage(), getAppointment(), getTreatmentPatientImagesPage(), getActiveClinicId(), SentryLogArgs, SentryLogMethod, TreatmentImagesEntry, TreatmentImagesStore

### Community 91 - "app-topbar.tsx"
Cohesion: 0.24
Nodes (11): AppTopbar(), PAGE_TITLES_BY_ROUTE, Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage() (+3 more)

### Community 92 - "finances-store.test.ts"
Cohesion: 0.15
Nodes (12): decExpense, decIncome, decTransactions, initialState, jan10, jan15, jan22, jan29 (+4 more)

### Community 93 - "use-appointments.ts"
Cohesion: 0.33
Nodes (10): AppointmentCreateDialog(), useAppointmentCreateDialog(), useAppointmentDetail(), useAppointment(), useAppointmentInventoryItems(), useCreateAppointment(), useRescheduleAppointment(), useUpdateAppointment() (+2 more)

### Community 94 - "useAuth"
Cohesion: 0.10
Nodes (30): NoMembershipPageClient(), createDefaultValues(), useRegisterEmployee(), RegisterEmployeePageClient(), InviteTeamPageClient(), getRegisterCopy(), AUTH_ERROR_COPY, getAuthErrorMessage() (+22 more)

### Community 95 - "appointment-detail-sidebar.tsx"
Cohesion: 0.21
Nodes (9): AppointmentDetailCard(), AppointmentDetailCardProps, AppointmentDetailSidebar(), AppointmentDetailSidebarProps, AppointmentStatusBadge(), CalendarOverlapGroupRow(), CalendarOverlapGroupRowProps, formatDateTime() (+1 more)

### Community 96 - "employee-profile-header.tsx"
Cohesion: 0.24
Nodes (7): AppointmentStatusBadgeProps, statusVariants, EmployeeProfileHeader(), EmployeeProfileHeaderProps, getAvatarStyle(), Badge(), badgeVariants

### Community 97 - "treatment-detail-page-client.tsx"
Cohesion: 0.12
Nodes (22): getAppointmentDetailMenuActions(), AppointmentDetailPageClient(), AppointmentDetailPageClientProps, resolveTotalDurationMinutes(), SettingsDetailActionHandlers, getTreatmentDetailActions(), TreatmentDetailActionHandlers, TreatmentDetailPageClient() (+14 more)

### Community 98 - "use-patient-image-uploader.ts"
Cohesion: 0.21
Nodes (10): PatientImageUploaderDialog(), defaultValues, patientImageFormSchema, PatientImageFormValues, usePatientImageUploader(), useUploadPatientImages(), patientImagePhaseSchema, patientImageTreatmentIdSchema (+2 more)

### Community 99 - "search-copy.ts"
Cohesion: 0.11
Nodes (20): PatientsFilters(), PatientsFiltersProps, PatientFilters, PatientsFiltersSheet(), PatientsFiltersSheetProps, statusOptions, statusOptions, TreatmentsFilters() (+12 more)

### Community 102 - "calendar-view-mode-toggle.tsx"
Cohesion: 0.33
Nodes (4): e2eUser, playwrightResult, status, statusResult

### Community 106 - "dropdown-menu.tsx"
Cohesion: 0.17
Nodes (7): DropdownMenuCheckboxItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent(), DropdownMenuSubTrigger()

### Community 107 - "inventory-store.ts"
Cohesion: 0.27
Nodes (10): getInventoryItem(), getInventoryItems(), getInventoryMovements(), insertInventoryItem(), insertInventoryMovement(), InventoryItemInsert, InventoryMovementInsert, updateInventoryItem() (+2 more)

### Community 108 - "mocks.ts"
Cohesion: 0.21
Nodes (9): mockAppointment, mockEmployee, mockInventoryItem, mockPatient, mockTreatment, end, initialState, start (+1 more)

### Community 109 - "use-clinic-info.ts"
Cohesion: 0.22
Nodes (6): NewAppointmentDatetimeField(), NewAppointmentDatetimeFieldProps, getClinicById(), ClinicInfo, CLINIC, Clinic

### Community 110 - "inventory-filters.tsx"
Cohesion: 0.22
Nodes (8): InventoryFilters(), InventoryFiltersProps, InventoryFilters, InventoryFiltersSheet(), InventoryFiltersSheetProps, stockOptions, stockOptions, INVENTORY_COPY

### Community 111 - "finances/page.tsx"
Cohesion: 0.47
Nodes (8): FinancesPage(), transactionTypeForTab(), buildFinancialSummary(), financesMonthRange(), financesPreviousMonthRange(), formatFinancesMonthParam(), parseFinancesMonthParam(), parseFinancesTabParam()

### Community 113 - "patient-image-uploader-form.tsx"
Cohesion: 0.14
Nodes (14): PatientGalleryFilters(), PatientGalleryFiltersProps, PatientGalleryFiltersSheet(), PatientGalleryFiltersSheetProps, PatientGalleryFilterValues, sortOptions, sortOptions, PatientImageTreatmentSelect() (+6 more)

### Community 114 - "unwrapSupabaseList"
Cohesion: 0.11
Nodes (28): DashboardPageClient(), getTodayAppointments(), getInventoryAlerts(), markInventoryAlertsAsRead(), getPatient(), getPatientAppointments(), getPatients(), getUpcomingPatientAppointments() (+20 more)

### Community 115 - "calendar-view-mode-toggle.tsx"
Cohesion: 0.22
Nodes (11): CalendarViewModeToggleProps, DEFAULT_VIEW_MODES, VIEW_MODE_OPTIONS, BeforeAfterComparisonToolbarProps, ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), toggleGroupItemVariants (+3 more)

### Community 116 - "settings-detail-tab-content.tsx"
Cohesion: 0.24
Nodes (6): SETTINGS_TAB_ITEMS, SettingsDetailTabBar(), SettingsDetailTabBarProps, SettingsDetailTabContentProps, SettingsUserPanel(), SettingsTabId

### Community 117 - "find-slots.ts"
Cohesion: 0.40
Nodes (9): ExistingAppointment, findAvailableSlots(), getDateKey(), getSlotSearchRange(), nextOpenDayOpening(), parseHHMM(), roundUpToStep(), sampleEvenly() (+1 more)

### Community 118 - "employee-detail-header.tsx"
Cohesion: 0.31
Nodes (7): EmployeeAvatarDisplay(), EmployeeAvatarDisplayProps, getAvatarStyle(), EmployeeDetailHeader(), EmployeeDetailHeaderProps, SidebarProfileFooter(), employeeRoleLabel()

### Community 119 - "patient-gallery-tab.tsx"
Cohesion: 0.13
Nodes (18): PatientGalleryDateGroup(), PatientGalleryDateGroupProps, PatientGalleryTab(), PatientGalleryTabProps, PatientImageDeleteConfirmDialog(), PatientImageDeleteConfirmDialogProps, PatientImageViewer(), PatientImageViewerProps (+10 more)

### Community 120 - "profile-timeline.tsx"
Cohesion: 0.31
Nodes (7): groupItemsByMonth(), ProfileTimelineItem, ProfileTimelineItemRow(), ProfileTimelineItemRowProps, statusVariants, ProfileTimeline(), ProfileTimelineProps

### Community 121 - "sidebar-profile-footer.tsx"
Cohesion: 0.36
Nodes (4): SidebarClinicSwitcherProps, SidebarSignOutConfirmDialog(), SidebarSignOutConfirmDialogProps, SIDEBAR_COPY

### Community 122 - "use-finances-page.ts"
Cohesion: 0.42
Nodes (8): FinancesPageFilters, FinancesPageSeed, transactionTypeForTab(), useFinancesPage(), useFinancialSummary(), useTransactions(), summaryKey(), transactionsKey()

### Community 123 - "use-patient-file-uploader.ts"
Cohesion: 0.28
Nodes (7): defaultValues, patientFileFormSchema, PatientFileFormValues, PatientFileCategoryOption, patientFileCategorySchema, PatientFileUploadInput, patientFileUploadSchema

### Community 124 - "employee-schema.ts"
Cohesion: 0.22
Nodes (8): clinicMembershipInvitationRoleSchema, employeeFieldsSchema, EmployeeInviteSchemaInput, employeeRoleSchema, employeeSchema, EmployeeSchemaInput, employeeUpdateSchema, EmployeeUpdateSchemaInput

### Community 125 - "use-file-url.ts"
Cohesion: 0.39
Nodes (6): AsyncFileUrl, getFileUrl(), peekCachedFileUrl(), resolvePublicFileUrl(), uploadFile(), withFileUrlCacheBust()

### Community 126 - "calendar-page-client.tsx"
Cohesion: 0.11
Nodes (18): BootLoadingScreen(), BootLoadingScreenProps, LoaderProgressBar(), LoaderProgressBarProps, LoaderRedirectCheckBadge(), LoaderRedirectVisual(), LoaderStatusList(), LoaderStatusListProps (+10 more)

### Community 127 - "appointment-person-avatar.tsx"
Cohesion: 0.38
Nodes (4): AppointmentHeaderPersonProps, AppointmentPersonAvatar(), AppointmentPersonAvatarProps, getInitials()

### Community 128 - "settings-page-client.tsx"
Cohesion: 0.19
Nodes (15): getSettingsDetailActions(), SettingsPageClient(), SettingsPageClientProps, SettingsProfilePanel(), SettingsProfilePanelProps, normalizeEmail(), PendingClinicRequest, useUploadProfileAvatar() (+7 more)

### Community 129 - "finances-summary-metrics.tsx"
Cohesion: 0.33
Nodes (5): FinancesMetricItem(), FinancesMetricItemProps, FinancesSummaryMetrics(), FinancesSummaryMetricsProps, MetricConfig

### Community 130 - "devDependencies"
Cohesion: 0.10
Nodes (21): devDependencies, eslint, eslint-config-next, husky, jsdom, lint-staged, @playwright/test, prettier (+13 more)

### Community 131 - "finances-weekly-breakdown.tsx"
Cohesion: 0.33
Nodes (4): FinancesWeeklyBreakdownProps, FinancesWeeklyRow(), FinancesWeeklyRowProps, FinancialSummary

### Community 132 - "schedule-x-employee-calendars.ts"
Cohesion: 0.43
Nodes (6): buildEmployeeCalendars(), ColorDefinition, EmployeeCalendarSource, sanitizeColorName(), stripeOnlyColors(), toCalendarEntry()

### Community 133 - "format.ts"
Cohesion: 0.16
Nodes (12): AppointmentHeader(), AppointmentHeaderProps, TopbarClinicSelector(), clinicMembershipRoleLabel(), formatAppointmentDay(), formatAppointmentDetailDay(), formatAppointmentDuration(), formatAppointmentMonth() (+4 more)

### Community 134 - "appointment-status-select.tsx"
Cohesion: 0.33
Nodes (5): allStatuses, AppointmentStatusSelect(), AppointmentStatusSelectProps, statusColors, statusOptions

### Community 135 - "auth-provider.tsx"
Cohesion: 0.53
Nodes (5): AuthProviderProps, getClientHydratedSnapshot(), getServerHydratedSnapshot(), subscribeToClientHydration(), useAuthHydrated()

### Community 136 - "settings-account-panel.tsx"
Cohesion: 0.40
Nodes (4): SettingsAccountPanel(), SettingsAccountPanelProps, SettingsActionRow(), SettingsActionRowProps

### Community 137 - "settings-management-panel.tsx"
Cohesion: 0.40
Nodes (3): SettingsManagementLink(), SettingsManagementLinkProps, MANAGEMENT_LINKS

### Community 138 - "useScheduleXCalendar"
Cohesion: 0.26
Nodes (8): ScheduleXCalendarInner(), getInitialCalendarConfig(), getRangeForViewMode(), toPlainDate(), useScheduleXCalendar(), ScheduleXCalendar(), SkeletonBlock(), useElementHeight()

### Community 139 - "app-bottom-nav.tsx"
Cohesion: 0.47
Nodes (3): AppBottomNavItem(), AppBottomNavItemProps, BOTTOM_NAV_COPY

### Community 141 - "campaigns-date-range-filter.tsx"
Cohesion: 0.70
Nodes (4): CampaignsDateRangeFilter(), CampaignsDateRangeFilterProps, formatRangeLabel(), parseDate()

### Community 142 - "stat.tsx"
Cohesion: 0.40
Nodes (4): Stat(), StatProps, StatTone, toneClasses

### Community 143 - "sound.ts"
Cohesion: 0.70
Nodes (4): initSounds(), isSoundDisabled(), notifySuccess(), playSound()

### Community 144 - "employees-store.test.ts"
Cohesion: 0.40
Nodes (4): initialState, mockAppointmentRow, mockEmployee, mockStats

### Community 145 - "campaign-recipients-preview.tsx"
Cohesion: 0.67
Nodes (3): CampaignRecipientsPreview(), CampaignRecipientsPreviewProps, resolveMessage()

### Community 159 - "use-transaction-create-dialog.ts"
Cohesion: 0.14
Nodes (14): TransactionCreateFormProps, InventoryItemCreateFormProps, AppDialogError(), AppDialogErrorProps, TRANSACTION_CREATE_COPY, useCreateTransaction(), useUpdateTransaction(), InventoryFormValues (+6 more)

### Community 160 - "e2e-helpers.ts"
Cohesion: 0.16
Nodes (16): createAndGoToAppointmentDetail(), authDirectory, authFile, E2E_DATA, E2E_TINY_PNG, E2E_USER, clickPatientTableRow(), clickTopbarMenuAction() (+8 more)

### Community 164 - "use-employee-edit-dialog.ts"
Cohesion: 0.21
Nodes (10): EmployeeColorFieldProps, EmployeeEditDialog(), EmployeeEditFormProps, roleOptions, EMPLOYEE_COLOR_PRESETS, EMPLOYEE_EDIT_COPY, employeeEditFormSchema, EmployeeEditFormValues (+2 more)

### Community 171 - "use-schedule-x-calendar.ts"
Cohesion: 0.13
Nodes (18): CalendarWeekUiRefs, updateCalendarWeekUiRefs(), CalendarEmptyHeader(), CalendarEventProps, CalendarTimeGridEvent(), CalendarWeekGridDate(), buildClinicBackgroundEvents(), CLOSED_DAY_STYLE (+10 more)

### Community 174 - "button.tsx"
Cohesion: 0.09
Nodes (15): Props, RegisterEmployeeFormCopy, RegisterEmployeeFormProps, CalendarMobileMonthAppointmentsProps, MonthMiniCalendarDayProps, PatientFileViewerProps, PatientFileViewerToolbar(), PatientFileViewerToolbarProps (+7 more)

### Community 178 - "before-after-comparison-slider.tsx"
Cohesion: 0.16
Nodes (13): BeforeAfterComparisonContentProps, BeforeAfterComparisonImage(), BeforeAfterComparisonImageProps, BeforeAfterComparisonSlider(), BeforeAfterComparisonSliderProps, BeforeAfterOrientation, buildComparisonLabel(), BeforeAfterComparisonToolbar() (+5 more)

### Community 183 - "use-employee-invite-dialog.ts"
Cohesion: 0.24
Nodes (8): EmployeeInviteFormProps, roleOptions, EMPLOYEE_INVITE_COPY, defaultValues, EmployeeFormValues, useEmployeeInviteDialog(), useCreateEmployee(), employeeInviteSchema

### Community 185 - "utils.ts"
Cohesion: 0.11
Nodes (13): EmployeeDetailTabButton(), EmployeeDetailTabButtonProps, InventoryDetailTabButton(), InventoryDetailTabButtonProps, LoaderOrbitalVisual(), LoaderSpinner(), LoaderSpinnerProps, LoaderSpinnerSize (+5 more)

### Community 186 - "inventory-movements-list.tsx"
Cohesion: 0.27
Nodes (10): formatMovementQuantity(), inventoryMovementDotClass(), InventoryMovementRow(), InventoryMovementRowProps, inventoryMovementToneClass(), inventoryMovementTypeLabel(), groupMovementsByMonth(), InventoryMovementsList() (+2 more)

### Community 187 - "use-patient-create-dialog.ts"
Cohesion: 0.15
Nodes (13): PatientCreateFormProps, PatientEditDialog(), PatientAvatarFieldProps, PATIENT_CREATE_COPY, PATIENT_EDIT_COPY, defaultValues, patientFormSchema, PatientFormValues (+5 more)

### Community 193 - "hyperframes.json"
Cohesion: 0.20
Nodes (9): authoringSkill, media, autoProxy, paths, assets, blocks, components, registry (+1 more)

### Community 223 - "use-active-clinic.ts"
Cohesion: 0.16
Nodes (15): AppointmentReminderRow(), AppointmentReminderRowProps, AppLayoutClient(), AppLayoutClientProps, useServerBootstrap(), ClinicReminderSettingsUpdate, getClinicReminderSettings(), getRemindersForAppointment() (+7 more)

### Community 233 - "calendar-page-client.tsx"
Cohesion: 0.12
Nodes (23): CalendarEmployeeFilter(), CalendarEmployeeFilterProps, CALENDAR_FILTER_DEFAULTS, CalendarPageClient(), CalendarPageClientProps, CLOSED_GROUP_SHEET, CalendarFilters, CalendarFiltersSheet() (+15 more)

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
Cohesion: 0.24
Nodes (7): mapOperationalRoleToEmployeeRole(), OperationalRoleOption, operationalRoleOptions, buildCreateClinicPayload(), CreateClinicPayload, OwnerClinicFormValues, OwnerClinicOnlyValues

### Community 263 - "supabase.ts"
Cohesion: 0.12
Nodes (20): getDefaultValues(), OwnerRegistrationStep, SubmissionStage, useOwnerRegistration(), OwnerRegistrationPageClient(), defaultValues, getEmployeeProfile(), ProfileUpdate (+12 more)

### Community 272 - "settings-copy.ts"
Cohesion: 0.13
Nodes (12): ClinicInfoRow(), ClinicInfoRowProps, SettingsClinicHoursPanelProps, SettingsClinicPanelProps, SettingsProfileQuickActions(), SettingsProfileQuickActionsProps, SettingsProfileSidebarProps, SettingsProfileSummaryProps (+4 more)

## Knowledge Gaps
- **808 isolated node(s):** `CampaignDetailImageProps`, `CampaignReachSummaryProps`, `CampaignCreateFormProps`, `CampaignImageFieldProps`, `CampaignMessagePreviewProps` (+803 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `patient-detail-copy.ts`, `sidebar.tsx`, `treatments-copy.ts`, `calendar-agenda.ts`, `skeleton.tsx`, `dropzone.tsx`, `use-employee-edit-dialog.ts`, `patient-file-storage.ts`, `inventory-page-client.tsx`, `use-schedule-x-calendar.ts`, `button.tsx`, `app-dialog-content.tsx`, `utils.ts`, `use-app-nav-items.tsx`, `app-date-field.tsx`, `filters-sheet.tsx`, `context-menu.tsx`, `input-group.tsx`, `settings-profile-sidebar.tsx`, `use-profile-edit-dialog.ts`, `register-schema.ts`, `app-topbar.tsx`, `appointment-detail-sidebar.tsx`, `employee-profile-header.tsx`, `calendar-page-client.tsx`, `dropdown-menu.tsx`, `calendar-view-mode-toggle.tsx`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `Button()` connect `button.tsx` to `settings-page-client.tsx`, `appointment-materials-section.tsx`, `useEmployees`, `cn`, `patient-detail-copy.ts`, `settings-account-panel.tsx`, `employees-page-client.tsx`, `use-treatment-images.ts`, `sidebar.tsx`, `campaigns-date-range-filter.tsx`, `finances-page-client.tsx`, `treatments-copy.ts`, `dropzone.tsx`, `appointments-columns.tsx`, `use-employee-edit-dialog.ts`, `patient-file-storage.ts`, `table-mobile-columns.tsx`, `login-form-panel.tsx`, `invite-page-client.tsx`, `utils.ts`, `appointment-create-dialog.tsx`, `use-patient-create-dialog.ts`, `Employee`, `app-date-field.tsx`, `patient-files-tab.tsx`, `filters-sheet.tsx`, `input-group.tsx`, `settings-profile-sidebar.tsx`, `files-table.tsx`, `use-files-page.ts`, `use-profile-edit-dialog.ts`, `register-schema.ts`, `app-topbar.tsx`, `useAuth`, `use-active-clinic.ts`, `treatment-detail-page-client.tsx`, `search-copy.ts`, `calendar-page-client.tsx`, `app-searchable-multi-select.tsx`, `calendar-view-mode-toggle.tsx`, `sidebar-profile-footer.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Why does `supabase` connect `devDependencies` to `supabase.ts`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **What connects `CampaignDetailImageProps`, `CampaignReachSummaryProps`, `CampaignCreateFormProps` to the rest of the system?**
  _808 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useClinicId` be split into smaller, more focused modules?**
  _Cohesion score 0.1036036036036036 - nodes in this community are weakly interconnected._
- **Should `appointment-materials-section.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1103448275862069 - nodes in this community are weakly interconnected._
- **Should `useEmployees` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._