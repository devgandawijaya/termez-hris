import React from 'react';

import KPIActivityLogTab from '../components/kpi/KPIActivityLogTab';
import KPIApprovalTab from '../components/kpi/KPIApprovalTab';
import KPIAssignmentModal from '../components/kpi/KPIAssignmentModal';
import KPIAssignmentTab from '../components/kpi/KPIAssignmentTab';
import KPIDashboardTab from '../components/kpi/KPIDashboardTab';
import KPIFilterBar from '../components/kpi/KPIFilterBar';
import KPIMasterDataTab from '../components/kpi/KPIMasterDataTab';
import KPIMasterFormModal from '../components/kpi/KPIMasterFormModal';
import KPIReportTab from '../components/kpi/KPIReportTab';
import KPITrackingModal from '../components/kpi/KPITrackingModal';
import KPITrackingTab from '../components/kpi/KPITrackingTab';
import useKPIManagementViewModel from '../viewmodels/useKPIManagementViewModel';

export default function KPIManagementPage() {
  const vm = useKPIManagementViewModel();
  const isUserView = vm.effectiveRole === 'user';

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto space-y-6">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <nav className="text-sm text-gray-500 mb-2">
              <span>Features</span> {'>'} <span>Performance Management</span> {'>'} <span className="font-medium text-gray-700">KPI Management</span>
            </nav>
            <h1 className="text-3xl font-semibold text-gray-900">KPI Management</h1>
            <p className="text-gray-600 mt-2 max-w-3xl">
              Dashboard KPI end-to-end untuk master data, assignment, tracking, workflow approval, scoring, reporting, dan audit log.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
              Role aktif: {isUserView ? 'user biasa' : 'admin'}
            </span>
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-1">
              <button
                type="button"
                onClick={() => vm.setDemoRole('admin')}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${vm.effectiveRole === 'admin' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => vm.setDemoRole('user')}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${vm.effectiveRole === 'user' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                User Biasa
              </button>
            </div>
            {isUserView ? (
              <select
                value={vm.demoEmployeeId}
                onChange={(event) => vm.setDemoEmployeeId(event.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
              >
                {vm.snapshot.filterOptions.employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>{employee.name}</option>
                ))}
              </select>
            ) : null}
            <button type="button" onClick={vm.reload} className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Refresh Data
            </button>
          </div>
        </div>

        {isUserView ? (
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
            <div className="rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4">
              <div className="text-sm font-semibold text-sky-900">Alur KPI Management untuk User Biasa</div>
              <div className="mt-4 space-y-3">
                {vm.userFlow.map((item) => (
                  <div key={item.step} className="rounded-xl bg-white/80 px-4 py-3 border border-sky-100">
                    <div className="font-medium text-sky-900">{item.step}</div>
                    <div className="text-sm text-slate-600 mt-1">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
              <div className="text-sm font-semibold text-amber-900">Akses User Biasa</div>
              <div className="mt-3 space-y-2 text-sm text-amber-900">
                <div>• Melihat KPI yang di-assign ke dirinya</div>
                <div>• Input realisasi dan catatan progress</div>
                <div>• Submit KPI untuk approval admin</div>
                <div>• Melihat status approval dan catatan revisi</div>
                <div>• Tidak bisa CRUD master KPI atau assignment baru</div>
              </div>
            </div>
          </div>
        ) : null}

        {vm.feedback ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {vm.feedback}
          </div>
        ) : null}

        {vm.error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {vm.error}
          </div>
        ) : null}

        <KPIFilterBar
          filters={vm.filters}
          filterOptions={vm.snapshot.filterOptions}
          onChange={(field, value) => vm.setFilters((current) => ({ ...current, [field]: value }))}
          onReset={() => vm.setFilters({ periodType: '', department: '', employeeId: '' })}
        />

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex flex-wrap gap-2">
          {/* Tabs keep the page modular without changing the existing route contract. */}
          {vm.tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => vm.setActiveTab(tab.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${vm.activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {vm.loading ? (
          <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-8 text-center text-gray-500">Memuat KPI Management...</div>
        ) : null}

        {!vm.loading && vm.activeTab === 'dashboard' ? (
          <KPIDashboardTab
            summary={vm.visibleSummary}
            byEmployee={vm.visiblePerformanceByEmployee}
            byDepartment={vm.visiblePerformanceByDepartment}
            assignments={vm.visibleAssignments}
            finalScores={vm.visibleFinalScores}
          />
        ) : null}

        {!vm.loading && vm.activeTab === 'master' ? (
          <KPIMasterDataTab
            records={vm.snapshot.masterRecords}
            canManageMaster={vm.capabilities.canManageMaster}
            onCreate={vm.openCreateKpi}
            onEdit={vm.openEditKpi}
            onDelete={vm.handleDeleteKpi}
          />
        ) : null}

        {!vm.loading && vm.activeTab === 'assignment' ? (
          <KPIAssignmentTab
            assignments={vm.visibleAssignments}
            canAssign={vm.capabilities.canAssign}
            onCreate={vm.openAssignmentModal}
          />
        ) : null}

        {!vm.loading && vm.activeTab === 'tracking' ? (
          <KPITrackingTab
            assignments={vm.visibleAssignments}
            currentUser={vm.currentUser}
            capabilities={vm.capabilities}
            onEdit={vm.openTrackingModal}
            onSubmit={vm.handleSubmitForApproval}
          />
        ) : null}

        {!vm.loading && vm.activeTab === 'approval' ? (
          <KPIApprovalTab
            approvals={vm.visibleApprovalQueue}
            canApprove={vm.capabilities.canApprove}
            isUserView={isUserView}
            reviewNotes={vm.reviewNotes}
            onNoteChange={(assignmentId, value) => vm.setReviewNotes((current) => ({ ...current, [assignmentId]: value }))}
            onReview={vm.handleReview}
          />
        ) : null}

        {!vm.loading && vm.activeTab === 'report' ? (
          <KPIReportTab rows={vm.snapshot.reportRows} onExportPdf={vm.exportPdf} onExportExcel={vm.exportExcel} />
        ) : null}

        {!vm.loading && vm.activeTab === 'activity' ? (
          <KPIActivityLogTab logs={vm.snapshot.activityLog} roleSummary={vm.snapshot.roleSummary} />
        ) : null}
      </div>

      <KPIMasterFormModal
        isOpen={vm.modalState.kpiFormOpen}
        onClose={vm.closeModals}
        form={vm.kpiForm}
        departments={vm.snapshot.filterOptions.departments}
        errors={vm.formErrors}
        onChange={(field, value) => vm.setKpiForm((current) => ({ ...current, [field]: value }))}
        onSave={vm.handleSaveKpi}
      />

      <KPIAssignmentModal
        isOpen={vm.modalState.assignmentOpen}
        onClose={vm.closeModals}
        form={vm.assignmentForm}
        errors={vm.formErrors}
        employees={vm.snapshot.employees}
        departments={vm.snapshot.filterOptions.departments}
        masterRecords={vm.snapshot.masterRecords}
        onChange={(field, value) => vm.setAssignmentForm((current) => ({ ...current, [field]: value }))}
        onToggleEmployee={(employeeId) => vm.setAssignmentForm((current) => ({
          ...current,
          employeeIds: current.employeeIds.includes(employeeId)
            ? current.employeeIds.filter((item) => item !== employeeId)
            : [...current.employeeIds, employeeId],
        }))}
        onSave={vm.handleSaveAssignment}
      />

      <KPITrackingModal
        isOpen={vm.modalState.trackingOpen}
        onClose={vm.closeModals}
        form={vm.trackingForm}
        errors={vm.formErrors}
        onChange={(field, value) => vm.setTrackingForm((current) => ({ ...current, [field]: value }))}
        onSave={vm.handleSaveTracking}
      />
    </div>
  );
}
