import React, { Suspense } from 'react';
import useEmploymentStatusTrackingViewModel from '../viewmodels/useEmploymentStatusTrackingViewModel';
import LoadingFallback from '../../../routes/loadingFallback';

// lazy components
const EmploymentStatisticsCards = React.lazy(() => import('../components/employment/EmploymentStatisticsCards'));
const EmploymentStatusPieChart = React.lazy(() => import('../components/employment/EmploymentStatusPieChart'));
const EmploymentTrendChart = React.lazy(() => import('../components/employment/EmploymentTrendChart'));
const DepartmentStatusChart = React.lazy(() => import('../components/employment/DepartmentStatusChart'));
const EmployeeLifecycleChart = React.lazy(() => import('../components/employment/EmployeeLifecycleChart'));
const TenureDistributionChart = React.lazy(() => import('../components/employment/TenureDistributionChart'));
const WorkforceFunnelChart = React.lazy(() => import('../components/employment/WorkforceFunnelChart'));
const EmploymentStatusTable = React.lazy(() => import('../components/employment/EmploymentStatusTable'));
const CreateStatusModal = React.lazy(() => import('../components/employment/CreateStatusModal'));
const UpdateStatusModal = React.lazy(() => import('../components/employment/UpdateStatusModal'));
const DeleteStatusModal = React.lazy(() => import('../components/employment/DeleteStatusModal'));
const StatusHistoryModal = React.lazy(() => import('../components/employment/StatusHistoryModal'));
const EmployeeProfileModal = React.lazy(() => import('../components/employment/EmployeeProfileModal'));

export default function EmploymentStatusTrackingPage() {
  const vm = useEmploymentStatusTrackingViewModel();

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto space-y-6">
        {/* header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Employment Status Tracking</h1>
            <nav className="text-sm text-gray-500 mt-1">
              <span>Admin</span> {'>'} <span className="font-medium">Employment Status Tracking</span>
            </nav>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* filters and search handled by table component, only export & add button here */}
            <button
              onClick={() => { /* export logic could call vm.exportData */ }}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              Export Data
            </button>
            <button
              onClick={vm.openCreateModal}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              + Add Status Record
            </button>
          </div>
        </div>

        {/* statistics cards */}
        <Suspense fallback={<LoadingFallback />}>
          <EmploymentStatisticsCards stats={vm.statistics} />
        </Suspense>

        {/* charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Suspense fallback={<LoadingFallback />}>
            <EmploymentStatusPieChart data={vm.charts.statusDistribution} />
            <EmploymentTrendChart data={vm.charts.trendData} />
          </Suspense>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Suspense fallback={<LoadingFallback />}>
            <DepartmentStatusChart data={vm.charts.departmentStatusData} />
            <EmployeeLifecycleChart data={vm.charts.lifecycleData} />
          </Suspense>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Suspense fallback={<LoadingFallback />}>
            <TenureDistributionChart data={vm.charts.tenureGroupsData} />
            <WorkforceFunnelChart data={vm.charts.funnelData} />
          </Suspense>
        </div>

        {/* table section */}
        <Suspense fallback={<LoadingFallback />}>
          <EmploymentStatusTable
            data={vm.statusRecords}
            loading={false}
            filters={vm.filters}
            filterOptions={vm.filterOptions}
            searchQuery={vm.search}
            onSearch={vm.handleSearch}
            onFilterChange={vm.handleFilterChange}
            onRefresh={() => {}}
            onViewProfile={vm.openProfileModal}
            onEditRecord={vm.openUpdateModal}
            onUpdateStatus={vm.openUpdateModal}
            onDelete={vm.openDeleteModal}
          />
        </Suspense>
      </div>

      {/* modals */}
      <Suspense fallback={null}>
        <CreateStatusModal
          isOpen={vm.modalStates.create}
          onClose={vm.closeAllModals}
          onSave={vm.handleAddRecord}
          employees={vm.employees}
        />
        <UpdateStatusModal
          isOpen={vm.modalStates.update}
          onClose={vm.closeAllModals}
          record={vm.activeRecord}
          onUpdate={vm.handleUpdateRecord}
        />
        <DeleteStatusModal
          isOpen={vm.modalStates.delete}
          onClose={vm.closeAllModals}
          onConfirm={() => vm.handleDeleteRecord(vm.activeRecord?.id)}
        />
        <StatusHistoryModal
          isOpen={vm.modalStates.history}
          onClose={vm.closeAllModals}
          history={vm.activeEmployee?.history || []}
        />
        <EmployeeProfileModal
          isOpen={vm.modalStates.profile}
          onClose={vm.closeAllModals}
          employee={vm.activeEmployee}
        />
      </Suspense>
    </div>
  );
}
