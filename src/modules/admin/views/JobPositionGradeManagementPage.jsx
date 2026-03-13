import React, { Suspense } from 'react';
import useJobPositionGradeViewModel from '../viewmodels/useJobPositionGradeViewModel';
import LoadingFallback from '../../../routes/loadingFallback';

// Lazy load charts
const PositionDistributionChart = React.lazy(() => import('../components/analytics/PositionDistributionChart'));
const GradeDistributionChart = React.lazy(() => import('../components/analytics/GradeDistributionChart'));
const SalaryTrendChart = React.lazy(() => import('../components/analytics/SalaryTrendChart'));
const PositionGrowthChart = React.lazy(() => import('../components/analytics/PositionGrowthChart'));
const SalaryHeatmapChart = React.lazy(() => import('../components/analytics/SalaryHeatmapChart'));
const DepartmentWorkforceChart = React.lazy(() => import('../components/analytics/DepartmentWorkforceChart'));
const OrganizationHierarchyChart = React.lazy(() => import('../components/analytics/OrganizationHierarchyChart'));
const CareerPathFlow = React.lazy(() => import('../components/analytics/CareerPathFlow'));
const GradePyramidChart = React.lazy(() => import('../components/analytics/GradePyramidChart'));
const PromotionInsightPanel = React.lazy(() => import('../components/analytics/PromotionInsightPanel'));
const StatsCard = React.lazy(() => import('../components/analytics/StatsCard'));
const PositionTable = React.lazy(() => import('../components/analytics/PositionTable'));
const GradeTable = React.lazy(() => import('../components/analytics/GradeTable'));

export default function JobPositionGradeManagementPage() {
  const vm = useJobPositionGradeViewModel();
  const selectedCareerPosition = 'Software Engineer';

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Suspense fallback={<LoadingFallback />}>
            <StatsCard title="Positions Filled" value={vm.stats.positionsFilled} icon="👥" />
            <StatsCard title="Open Positions" value={vm.stats.openPositions} icon="📌" />
            <StatsCard title="Avg Employees/Position" value={vm.stats.avgEmployeesPerPosition} icon="📊" />
            <StatsCard title="Highest Salary Grade" value={vm.stats.highestSalaryGrade} icon="💼" />
            <StatsCard title="Lowest Salary Grade" value={vm.stats.lowestSalaryGrade} icon="💼" />
          </Suspense>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Suspense fallback={<LoadingFallback />}>
            <PositionDistributionChart data={vm.positionDistribution} />
            <GradeDistributionChart data={vm.gradeDistribution} />
          </Suspense>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Suspense fallback={<LoadingFallback />}>
            <SalaryTrendChart data={vm.salaryTrend} />
            <PositionGrowthChart data={vm.positionGrowth} />
          </Suspense>
        </div>

        {/* Charts Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Suspense fallback={<LoadingFallback />}>
            <SalaryHeatmapChart data={vm.salaryHeatmap} />
            <DepartmentWorkforceChart data={vm.departmentWorkforce} />
          </Suspense>
        </div>

        {/* Charts Row 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Suspense fallback={<LoadingFallback />}>
            <OrganizationHierarchyChart data={vm.organizationHierarchy} />
            <CareerPathFlow path={vm.getCareerPath(selectedCareerPosition)} />
          </Suspense>
        </div>

        {/* Additional charts row for grade pyramid and promotion panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Suspense fallback={<LoadingFallback />}>
            <GradePyramidChart data={vm.gradePyramid} />
            <PromotionInsightPanel insights={vm.promotionInsights} />
          </Suspense>
        </div>

        {/* Bottom Section - tables with toolbar */}
        <div className="flex flex-col space-y-2">
          <div className="flex flex-wrap items-center justify-between bg-white p-3 rounded shadow">
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded"
                onClick={() => vm.addPosition()}
              >
                + Add Position
              </button>
              <button
                className="px-3 py-1 bg-green-500 text-white rounded"
                onClick={() => vm.addGrade()}
              >
                + Add Grade
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search positions..."
                className="border p-1 rounded"
                onChange={(e) => vm.searchPositions(e.target.value)}
              />
              <button
                className="px-3 py-1 bg-gray-300 text-gray-800 rounded"
                onClick={vm.exportPositionsCSV}
              >
                Export Positions
              </button>
              <button
                className="px-3 py-1 bg-gray-300 text-gray-800 rounded"
                onClick={vm.exportGradesCSV}
              >
                Export Grades
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Suspense fallback={<LoadingFallback />}>
              <PositionTable data={vm.positionTable} />
              <GradeTable data={vm.gradeTable} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
