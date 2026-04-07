import React from 'react';

import CareerPathPanel from '../components/performance-management/CareerPathPanel';
import Evaluation360Panel from '../components/performance-management/Evaluation360Panel';
import OKRTrackingPanel from '../components/performance-management/OKRTrackingPanel';
import PerformanceAnalyticsPanel from '../components/performance-management/PerformanceAnalyticsPanel';
import PerformanceAppraisalPanel from '../components/performance-management/PerformanceAppraisalPanel';
import { SpotlightCard, Toolbar, WorkflowSteps } from '../components/performance-management/PerformanceShared';
import usePerformanceManagementViewModel from '../viewmodels/usePerformanceManagementViewModel';

const pageConfig = {
  'okr-tracking': {
    title: 'OKR Tracking',
    description: 'Objective dan key results tracking untuk HRD dan karyawan, lengkap dengan CRUD, nested KR, progress, dan timeline check-in.',
    toolbarType: 'okr',
    tone: 'sky',
    workflow: [
      { title: 'Plan Objective', description: 'HRD dan manager menetapkan objective per quarter, owner, dan KR yang terukur.' },
      { title: 'Weekly Check-in', description: 'Karyawan memperbarui KR, menandai status on track atau at risk, lalu menambahkan progress note.' },
      { title: 'Quarter Close', description: 'Objective dievaluasi saat closing quarter untuk carry forward atau completion.' },
    ],
    spotlight: {
      eyebrow: 'Execution Rhythm',
      title: 'Fokus di cadence check-in dan progress KR, bukan penilaian akhir.',
      description: 'Halaman ini seharusnya terasa seperti workspace operasional untuk menjalankan target harian sampai quarter selesai.',
    },
  },
  'performance-appraisal': {
    title: 'Performance Appraisal',
    description: 'Penilaian formal dengan score KPI, attitude, discipline, grading, dan approval workflow lintas HRD dan atasan.',
    toolbarType: 'appraisal',
    tone: 'emerald',
    workflow: [
      { title: 'Assess Score', description: 'Atasan atau HRD memberi penilaian KPI, attitude, dan discipline sesuai cycle appraisal.' },
      { title: 'Calibrate Result', description: 'Skor direview ulang untuk memastikan fairness, grading, dan komentar pengembangan konsisten.' },
      { title: 'Approve Outcome', description: 'Appraisal di-approve, dikembalikan, atau dibuka lagi untuk revisi sebelum final release.' },
    ],
    spotlight: {
      eyebrow: 'Formal Review',
      title: 'Fokus di scoring, grading, dan approval workflow.',
      description: 'Berbeda dari OKR, modul ini adalah penilaian resmi yang dipakai untuk evaluasi periodik dan keputusan HR.',
    },
  },
  '360-evaluation': {
    title: '360 Evaluation',
    description: 'Feedback multi reviewer dari atasan, rekan kerja, dan bawahan dengan opsi anonymous serta radar chart competency.',
    toolbarType: 'evaluation',
    tone: 'violet',
    workflow: [
      { title: 'Launch Review Cycle', description: 'Tentukan subject review dan reviewer mix dari atasan, peer, serta bawahan.' },
      { title: 'Collect Feedback', description: 'Reviewer mengirim feedback naratif dan rating competency, dengan opsi anonymous bila diizinkan.' },
      { title: 'Read Theme Pattern', description: 'HRD dan subject membaca pola insight kolektif dari radar chart dan komentar reviewer.' },
    ],
    spotlight: {
      eyebrow: 'Multi-source Feedback',
      title: 'Fokus di persepsi lintas peran dan kualitas feedback.',
      description: 'Modul ini tidak mengejar nilai formal seperti appraisal, tetapi menangkap insight perilaku dan kolaborasi dari banyak reviewer.',
    },
  },
  'performance-dashboard-analytics': {
    title: 'Performance Dashboard Analytics',
    description: 'Analitik performa organisasi dengan KPI cards, leaderboard, chart per departemen, dan low performer alert.',
    toolbarType: 'analytics',
    tone: 'amber',
    workflow: [
      { title: 'Monitor Trend', description: 'HRD dan leadership membaca tren performa per bulan, departemen, dan distribusi grade.' },
      { title: 'Spot Outlier', description: 'Top performer, low performer, dan alert area diidentifikasi untuk follow-up cepat.' },
      { title: 'Drive Decision', description: 'Dashboard dipakai untuk memutuskan coaching, talent pool, atau prioritasi action plan lintas unit.' },
    ],
    spotlight: {
      eyebrow: 'Executive Monitoring',
      title: 'Fokus di insight agregat dan keputusan organisasi.',
      description: 'Berbeda dari empat halaman lain, analytics bukan tempat mengedit record utama, tetapi pusat monitoring dan prioritisasi action.',
    },
  },
  'promotion-career-path-tracking': {
    title: 'Promotion Career Path Tracking',
    description: 'Career path timeline, histori promosi, readiness score, rekomendasi promosi, dan approval HRD.',
    toolbarType: 'career',
    tone: 'rose',
    workflow: [
      { title: 'Map Career Stage', description: 'Jalur karir karyawan dipetakan dari posisi sekarang menuju level target sesuai framework perusahaan.' },
      { title: 'Assess Readiness', description: 'Readiness score dan histori promosi dibandingkan dengan performa terkini untuk melihat kesiapan naik level.' },
      { title: 'Approve Promotion', description: 'HRD memutuskan eligible, pending, atau development plan berdasarkan evidence yang tersedia.' },
    ],
    spotlight: {
      eyebrow: 'Promotion Governance',
      title: 'Fokus di readiness dan keputusan promosi, bukan evaluasi harian.',
      description: 'Halaman ini harus terasa seperti decision workspace antara performa, histori, dan jalur karir masa depan.',
    },
  },
};

export default function PerformanceManagementFeaturePage({ item }) {
  const vm = usePerformanceManagementViewModel();
  const config = pageConfig[item];

  if (!config) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(124,58,237,0.10),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#f8fafc_100%)] px-4 pb-12 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-[32px] border border-white/60 bg-white/90 p-6 shadow-[0_30px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur md:p-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <nav className="text-sm text-slate-500">
                <span>Admin</span> {'>'} <span>Features</span> {'>'} <span>Performance Management</span> {'>'} <span className="font-semibold text-slate-700">{config.title}</span>
              </nav>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">{config.title}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">{config.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => vm.setDemoRole('hrd')}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold ${vm.demoRole === 'hrd' ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-white'}`}
                >
                  HRD View
                </button>
                <button
                  type="button"
                  onClick={() => vm.setDemoRole('employee')}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold ${vm.demoRole === 'employee' ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-white'}`}
                >
                  Employee View
                </button>
              </div>
              <select value={vm.demoEmployeeId} onChange={(event) => vm.setDemoEmployeeId(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                {vm.snapshot.employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>{employee.fullName}</option>
                ))}
              </select>
              <button type="button" onClick={vm.loadSnapshot} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Refresh
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Workflow</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">Alur utama modul ini memang berbeda dari halaman performance lain.</div>
                </div>
                <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-600">
                  {vm.demoRole === 'hrd' ? 'HRD / Approver Mode' : 'Employee Self Mode'}
                </div>
              </div>
              <WorkflowSteps items={config.workflow} tone={config.tone} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              <SpotlightCard
                eyebrow={config.spotlight.eyebrow}
                title={config.spotlight.title}
                description={config.spotlight.description}
                tone={config.tone}
              />
              <div className="rounded-3xl border border-slate-100 bg-white p-5">
                <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Current context</div>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between gap-3"><span>Active employee</span><span className="font-semibold text-slate-900">{vm.currentEmployee?.fullName || '-'}</span></div>
                  <div className="flex items-center justify-between gap-3"><span>Department</span><span className="font-semibold text-slate-900">{vm.currentEmployee?.department || '-'}</span></div>
                  <div className="flex items-center justify-between gap-3"><span>OKR average</span><span className="font-semibold text-slate-900">{Math.round(vm.derivedSummary.okrAverage)}%</span></div>
                  <div className="flex items-center justify-between gap-3"><span>Appraisal average</span><span className="font-semibold text-slate-900">{vm.derivedSummary.appraisalAverage}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {vm.feedback ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{vm.feedback}</div> : null}
        {vm.error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{vm.error}</div> : null}

        <Toolbar
          filters={vm.filters}
          filterOptions={vm.snapshot.filterOptions}
          onChange={(field, value) => vm.setFilters((current) => ({ ...current, [field]: value }))}
          onReset={() => vm.setFilters({ search: '', department: '', employeeId: '', quarter: '', cycle: '' })}
          pageType={config.toolbarType}
        />

        {vm.loading ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center text-sm text-slate-500">Memuat performance management module...</div>
        ) : null}

        {!vm.loading && item === 'okr-tracking' ? (
          <OKRTrackingPanel
            records={vm.visibleOkrs}
            capabilities={vm.capabilities}
            onCreate={vm.openCreateOkr}
            onEdit={vm.openEditOkr}
            onDelete={vm.handleDeleteOkr}
            onOpenDetail={vm.setOkrDetail}
            detailRecord={vm.okrDetail}
            onCloseDetail={() => vm.setOkrDetail(null)}
            modalOpen={vm.okrModalOpen}
            form={vm.okrForm}
            errors={vm.formErrors}
            employees={vm.snapshot.employees}
            departments={vm.snapshot.filterOptions.departments}
            onFormChange={(field, value) => vm.setOkrForm((current) => ({ ...current, [field]: value }))}
            onKeyResultChange={vm.updateOkrKeyResult}
            onAddKeyResult={vm.addOkrKeyResult}
            onRemoveKeyResult={vm.removeOkrKeyResult}
            onCloseModal={vm.closeOkrModal}
            onSave={vm.handleSaveOkr}
          />
        ) : null}

        {!vm.loading && item === 'performance-appraisal' ? (
          <PerformanceAppraisalPanel
            records={vm.visibleAppraisals}
            capabilities={vm.capabilities}
            onCreate={vm.openAppraisalModal}
            onEdit={vm.openAppraisalModal}
            onWorkflowChange={vm.handleAppraisalWorkflow}
            modalOpen={vm.appraisalModalOpen}
            form={vm.appraisalForm}
            errors={vm.formErrors}
            employees={vm.snapshot.employees}
            onFormChange={(field, value) => vm.setAppraisalForm((current) => ({ ...current, [field]: value }))}
            onScoreChange={(field, value) => vm.setAppraisalForm((current) => ({
              ...current,
              scores: { ...current.scores, [field]: value },
            }))}
            onCloseModal={vm.closeAppraisalModal}
            onSave={vm.handleSaveAppraisal}
          />
        ) : null}

        {!vm.loading && item === '360-evaluation' ? (
          <Evaluation360Panel
            records={vm.visibleEvaluations}
            onOpenFeedback={vm.openEvaluationModal}
            modalOpen={vm.evaluationModalOpen}
            form={vm.evaluationForm}
            errors={vm.formErrors}
            onFormChange={(field, value) => vm.setEvaluationForm((current) => ({ ...current, [field]: value }))}
            onCompetencyChange={(field, value) => vm.setEvaluationForm((current) => ({
              ...current,
              competencies: { ...current.competencies, [field]: value },
            }))}
            onCloseModal={vm.closeEvaluationModal}
            onSave={vm.handleSaveEvaluation}
          />
        ) : null}

        {!vm.loading && item === 'performance-dashboard-analytics' ? (
          <PerformanceAnalyticsPanel analytics={vm.analyticsView} />
        ) : null}

        {!vm.loading && item === 'promotion-career-path-tracking' ? (
          <CareerPathPanel records={vm.visibleCareerPaths} capabilities={vm.capabilities} onApprovalChange={vm.handleCareerApproval} />
        ) : null}
      </div>
    </div>
  );
}