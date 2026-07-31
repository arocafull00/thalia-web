"use client";

import FilesFilters from "@/components/files/components/files-filters";
import FilesFiltersSheet from "@/components/files/components/files-filters-sheet";
import FilesResults from "@/components/files/components/files-results";
import PatientFileDeleteConfirmDialog from "@/components/patients/components/files/patient-file-delete-confirm-dialog";
import PatientFileViewer from "@/components/patients/components/files/patient-file-viewer";
import PageStickyFiltersSection from "@/components/ui/page-sticky-filters-section";
import { useFilesPage } from "@/lib/hooks/use-files-page";

export default function FilesPageClient() {
  const page = useFilesPage();

  return (
    <div data-testid="files-page" className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <PageStickyFiltersSection>
          <FilesFilters
            search={page.searchQuery}
            category={page.filters.category}
            from={page.filters.from}
            to={page.filters.to}
            sort={page.filters.sort}
            onSearchChange={page.handleSearchChange}
            onCategoryChange={page.setCategory}
            onFromChange={page.handleFromChange}
            onToChange={page.handleToChange}
            onSortChange={page.setSort}
            onOpenSheet={page.handleOpenSheet}
            onClearDates={() =>
              page.setFilters({
                category: page.filters.category,
                from: "",
                sort: page.filters.sort,
                to: "",
              })
            }
          />
        </PageStickyFiltersSection>
        <main className="px-4 py-5 lg:px-8 lg:py-7">
          <FilesResults
            files={page.files}
            total={page.total}
            page={page.page}
            totalPages={page.totalPages}
            hasActiveFilters={page.hasActiveFilters}
            isLoading={page.filesQuery.isLoading}
            isRefreshing={page.filesQuery.isRefreshing}
            error={page.filesQuery.error}
            onView={page.handleView}
            onDownload={page.handleDownload}
            onDelete={page.handleDelete}
            onPageChange={page.setPage}
          />
        </main>
      </div>

      <PatientFileViewer
        file={page.viewerFile}
        open={page.viewerOpen}
        onOpenChange={page.setViewerOpen}
        onDownload={page.handleDownload}
      />

      {page.deleteConfirm ? (
        <PatientFileDeleteConfirmDialog
          patientId={page.deleteConfirm.file.patient_id}
          file={page.deleteConfirm.file}
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              page.closeDeleteConfirm();
            }
          }}
          onSuccess={() => page.deleteConfirm?.onSuccess?.()}
        />
      ) : null}

      <FilesFiltersSheet
        key={page.sheetKey}
        open={page.sheetOpen}
        filters={{
          category: page.filters.category,
          from: page.filters.from,
          sort: page.filters.sort,
          to: page.filters.to,
        }}
        onApply={page.setFilters}
        onClear={page.resetFilters}
        onDismiss={() => page.setSheetOpen(false)}
      />
    </div>
  );
}
