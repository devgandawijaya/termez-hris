import React, { Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';

import LoadingFallback from '../../../routes/loadingFallback';

const EmployeeSelfServicePage = lazy(() => import('../../employee-self-service/views/EmployeeSelfServicePage'));

export default function AdminFeaturePage() {
  const { category, item } = useParams();

  const isEmployeeSelfServicePage = category === 'core-hr-data-administrasi' && item === 'employee-self-service-ess';

  if (isEmployeeSelfServicePage) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <EmployeeSelfServicePage />
      </Suspense>
    );
  }
  
  // Convert slugs to readable titles
  const categoryTitle = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
    
  const itemTitle = item
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="pt-24 pb-12 px-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <nav className="text-sm text-gray-500 mb-4">
            <span className="capitalize">{category.replace('-', ' ')}</span> {'>'} 
            <span className="ml-2 capitalize">{categoryTitle}</span> {'>'} 
            <span className="ml-2 font-medium text-gray-900">{itemTitle}</span>
          </nav>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{itemTitle}</h1>
          <p className="text-lg text-gray-600">
            Detailed information about <strong>{itemTitle}</strong> in the {categoryTitle} category.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 mb-6">
                This page provides comprehensive information about the {itemTitle} feature within the {categoryTitle} module of the Termez HRIS system.
              </p>
              <div className="space-y-4">
                <div className="border-l-4 border-indigo-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Category</h3>
                  <p className="text-gray-600">{categoryTitle}</p>
                </div>
                <div className="border-l-4 border-indigo-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Feature</h3>
                  <p className="text-gray-600">{itemTitle}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Key Benefits</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Streamlined HR processes and workflows</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Enhanced data accuracy and compliance</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Improved employee experience</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Real-time insights and reporting</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Implementation Status</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700">Development Progress</span>
                <span className="text-sm text-gray-500">Coming Soon</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{width: '25%'}}></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                This feature is currently in development. Contact our team for more information about implementation timelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

