/**
 * EmployeeDetailPage - View Employee Details
 * Enterprise grade with clean layout
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Building2,
  Briefcase,
  Calendar,
  DollarSign,
  Users,
  Award
} from 'lucide-react';
import employeeService from '../services/employeeService';

// Format currency to Rupiah
const formatCurrency = (amount) => {
  if (!amount) return 'Rp 0';
  return 'Rp ' + parseInt(amount).toLocaleString('id-ID', { maximumFractionDigits: 0 });
};

// Format date
const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load employee data
  useEffect(() => {
    const loadEmployee = async () => {
      try {
        setLoading(true);
        const data = await employeeService.getEmployeeById(id);
        setEmployee(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load employee');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      loadEmployee();
    }
  }, [id]);

  // Handle go back
  const handleGoBack = () => {
    navigate('/employees');
  };

  // Loading state
  if (loading) {
    return (
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto mt-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded-xl"></div>
              <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto mt-4">
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-12 text-center">
            <div className="text-red-500 mb-2">Error</div>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <button
              onClick={handleGoBack}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
              Back to Employee List
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!employee) return null;

  return (
    <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto mt-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={handleGoBack}
            className="p-2 mr-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Employee Details</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <img
              src={employee.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.fullName}`}
              alt={employee.fullName}
              className="w-24 h-24 rounded-xl shadow-sm"
            />
            
            {/* Basic Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-gray-900">{employee.fullName}</h2>
              <p className="text-sm text-gray-500">{employee.employeeId} • {employee.position}</p>
              <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  employee.employmentStatus === 'Active' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {employee.employmentStatus}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  {employee.employmentType}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Personal Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-4 h-4 mr-2 text-indigo-600" />
              Personal Information
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3">
                  <span className="text-gray-400 text-xs font-medium">NIK</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">NIK</p>
                  <p className="text-sm font-medium text-gray-900">{employee.nik}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{employee.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{employee.phone}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm font-medium text-gray-900">{employee.address || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Employment Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-indigo-600" />
              Employment Details
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3">
                  <Building2 className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="text-sm font-medium text-gray-900">{employee.department}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3">
                  <Award className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Position</p>
                  <p className="text-sm font-medium text-gray-900">{employee.position}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3">
                  <span className="text-gray-400 text-xs">Level</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Job Level</p>
                  <p className="text-sm font-medium text-gray-900">{employee.jobLevel}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Join Date</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(employee.joinDate)}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Basic Salary</p>
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(employee.basicSalary)}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3">
                  <Users className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Reporting Manager</p>
                  <p className="text-sm font-medium text-gray-900">{employee.reportingManager || '-'}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mr-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Work Location</p>
                  <p className="text-sm font-medium text-gray-900">{employee.workLocation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailPage;

