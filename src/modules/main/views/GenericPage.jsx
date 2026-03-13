import React, { Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../../shared/components/Navbar';
import Footer from '../../../shared/components/Footer';
import LoadingFallback from '../../../routes/loadingFallback';

// lazy load the analytics page so it only downloads when needed
const JobPositionGradeManagementPage = lazy(() =>
  import('../../admin/views/JobPositionGradeManagementPage')
);

export default function GenericPage() {
  const location = useLocation();
  const slug = location.pathname.replace(/^\/page\//, '');
  const title = slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

  // special case for job position grade management analytics page
  const isJobPositionPage = slug === 'core-hr-data-administrasi-job-position-grade-management';

  return (
    <div className="min-h-screen">
      <Navbar onOpenAuth={() => {}} />
      {isJobPositionPage ? (
        <Suspense fallback={<LoadingFallback />}>
          <JobPositionGradeManagementPage />
        </Suspense>
      ) : (
        <main className="pt-24 pb-12 px-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-gray-600">Content for <strong>{title}</strong> will be added here.</p>
        </main>
      )}
      <Footer />
    </div>
  );
}

