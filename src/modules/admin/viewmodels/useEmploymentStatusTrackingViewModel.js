import { useState, useMemo } from 'react';

// simple id generator
const genId = () => Math.random().toString(36).substr(2, 9);

export default function useEmploymentStatusTrackingViewModel() {
  // raw data - initial mock
  const initialMock = [
    {
      id: genId(),
      name: 'John Doe',
      employeeId: 'EMP-1021',
      department: 'Technology',
      position: 'Software Engineer',
      employmentType: 'Full Time',
      currentStatus: 'Active',
      startDate: '2024-01-01',
      endDate: '',
      lastUpdate: '2025-03-12',
      statusDuration: '1 Year 2 Months',
      tenure: '1 Year 3 Months',
      tenureMonths: 15,
      photo: '',
      history: [
        { status: 'Probation', date: '2024-01-01' },
        { status: 'Active', date: '2024-04-01' },
      ],
    },
    {
      id: genId(),
      name: 'Jane Smith',
      employeeId: 'EMP-1045',
      department: 'HR',
      position: 'HR Manager',
      employmentType: 'Full Time',
      currentStatus: 'Probation',
      startDate: '2025-01-15',
      endDate: '',
      lastUpdate: '2025-03-01',
      statusDuration: '1 Month',
      tenure: '2 Months',
      tenureMonths: 2,
      photo: '',
      history: [
        { status: 'Probation', date: '2025-01-15' },
      ],
    },
  ];
  
  const [employees] = useState(initialMock);
  const [statusRecords, setStatusRecords] = useState(
    initialMock.map((e) => ({ ...e, recordId: genId() }))
  );

  // ui state
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    employmentType: '',
    dateFrom: '',
    dateTo: '',
  });
  const [modalStates, setModalStates] = useState({
    create: false,
    update: false,
    delete: false,
    profile: false,
    history: false,
  });
  const [activeRecord, setActiveRecord] = useState(null);
  const [activeEmployee, setActiveEmployee] = useState(null);

  // statistics and chart data derived
  const statistics = useMemo(() => {
    const stats = {
      total: employees.length,
      active: 0,
      probation: 0,
      contract: 0,
      onLeave: 0,
      resigned: 0,
      terminated: 0,
      avgTenure: 0,
    };
    employees.forEach((e) => {
      stats.active += e.currentStatus === 'Active' ? 1 : 0;
      stats.probation += e.currentStatus === 'Probation' ? 1 : 0;
      stats.contract += e.currentStatus === 'Contract' ? 1 : 0;
      stats.onLeave += e.currentStatus === 'On Leave' ? 1 : 0;
      stats.resigned += e.currentStatus === 'Resigned' ? 1 : 0;
      stats.terminated += e.currentStatus === 'Terminated' ? 1 : 0;
    });
    // simple tenure average - assume field "tenureMonths" in employee
    const totalMonths = employees.reduce((acc, e) => acc + (e.tenureMonths || 0), 0);
    stats.avgTenure = employees.length ? Math.round((totalMonths / employees.length) / 12) : 0;
    return stats;
  }, [employees]);

  const statusDistribution = useMemo(() => {
    const map = {};
    employees.forEach((e) => {
      map[e.currentStatus] = (map[e.currentStatus] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [employees]);

  // for simplicity generate a fixed sample trend outside render
  const trendData = useMemo(() => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    // deterministic sample data
    return months.map((m, idx) => ({
      month: m,
      Active: 100 + idx * 5,
      Probation: 20 + idx,
      Contract: 30 + idx * 2,
      'On Leave': 10 + Math.floor(idx / 2),
    }));
  }, []);

  const departmentStatusData = useMemo(() => {
    // compute per department counts
    const map = {};
    employees.forEach((e) => {
      if (!map[e.department]) map[e.department] = { Active:0, Probation:0, Contract:0, 'On Leave':0 };
      map[e.department][e.currentStatus] = (map[e.department][e.currentStatus] || 0) + 1;
    });
    return Object.entries(map).map(([department, stats]) => ({ department, ...stats }));
  }, [employees]);

  const lifecycleData = useMemo(() => {
    // static example
    return [
      { stage: 'Probation', count: 25 },
      { stage: 'Active', count: 120 },
      { stage: 'Promotion', count: 15 },
      { stage: 'Exit', count: 10 },
    ];
  }, []);

  const tenureGroupsData = useMemo(() => {
    // example groups
    return [
      { range: '0-1 Year', count: 40 },
      { range: '1-3 Years', count: 80 },
      { range: '3-5 Years', count: 50 },
      { range: '5+ Years', count: 30 },
    ];
  }, []);

  const funnelData = useMemo(() => [
    { name: 'Candidates', value: 200 },
    { name: 'Probation', value: 80 },
    { name: 'Active', value: 150 },
    { name: 'Exit', value: 30 },
  ], []);


  // filtering logic
  const filteredRecords = useMemo(() => {
    return statusRecords.filter((r) => {
      let ok = true;
      if (search) {
        ok = r.name.toLowerCase().includes(search.toLowerCase()) || r.employeeId.toLowerCase().includes(search.toLowerCase());
      }
      if (ok && filters.department) ok = r.department === filters.department;
      if (ok && filters.status) ok = r.currentStatus === filters.status;
      if (ok && filters.employmentType) ok = r.employmentType === filters.employmentType;
      return ok;
    });
  }, [statusRecords, search, filters]);

  // handlers
  const handleSearch = (q) => setSearch(q);
  const handleFilterChange = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const handleAddRecord = (rec) => {
    const e = employees.find((emp) => emp.id === rec.employeeId);
    const newRecord = { ...rec, id: genId(), name: e?.name || '' };
    setStatusRecords((prev) => [newRecord, ...prev]);
  };
  const handleUpdateRecord = (id, changes) => {
    setStatusRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...changes } : r)));
  };
  const handleDeleteRecord = (id) => {
    setStatusRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const openCreateModal = () => setModalStates((m) => ({ ...m, create: true }));
  const openUpdateModal = (rec) => {
    setActiveRecord(rec);
    setModalStates((m) => ({ ...m, update: true }));
  };
  const openDeleteModal = (rec) => {
    setActiveRecord(rec);
    setModalStates((m) => ({ ...m, delete: true }));
  };
  const openProfileModal = (emp) => {
    setActiveEmployee(emp);
    setModalStates((m) => ({ ...m, profile: true }));
  };
  const openHistoryModal = (emp) => {
    setActiveEmployee(emp);
    setModalStates((m) => ({ ...m, history: true }));
  };

  const closeAllModals = () => setModalStates({ create:false, update:false, delete:false, profile:false, history:false });

  const filterOptions = useMemo(() => {
    return {
      departments: [...new Set(employees.map((e) => e.department))],
      statuses: [...new Set(employees.map((e) => e.currentStatus))],
      employmentTypes: [...new Set(employees.map((e) => e.employmentType))],
    };
  }, [employees]);

  return {
    employees,
    statusRecords: filteredRecords,
    statistics,
    charts: {
      statusDistribution,
      trendData,
      departmentStatusData,
      lifecycleData,
      tenureGroupsData,
      funnelData,
    },
    filters,
    search,
    modalStates,
    activeRecord,
    activeEmployee,
    filterOptions,
    handleSearch,
    handleFilterChange,
    handleAddRecord,
    handleUpdateRecord,
    handleDeleteRecord,
    openCreateModal,
    openUpdateModal,
    openDeleteModal,
    openProfileModal,
    openHistoryModal,
    closeAllModals,
  };
}
