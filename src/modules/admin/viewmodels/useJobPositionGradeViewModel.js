// This hook provides mock data and state for the analytics dashboard
export function useJobPositionGradeViewModel() {
  // statistics cards
  const stats = {
    positionsFilled: 120,
    openPositions: 15,
    avgEmployeesPerPosition: 3.8,
    highestSalaryGrade: 'G8',
    lowestSalaryGrade: 'G1',
  };

  // salary heatmap data
  const salaryHeatmap = [
    { grade: 'G1', department: 'Engineering', salary: 30000 },
    { grade: 'G2', department: 'Engineering', salary: 40000 },
    { grade: 'G3', department: 'Engineering', salary: 55000 },
    { grade: 'G1', department: 'Finance', salary: 32000 },
    { grade: 'G2', department: 'Finance', salary: 42000 },
    { grade: 'G3', department: 'Finance', salary: 50000 },
  ];

  // department workforce data
  const departmentWorkforce = [
    { department: 'Engineering', totalEmployees: 60, totalPositions: 20 },
    { department: 'Finance', totalEmployees: 30, totalPositions: 10 },
    { department: 'HR', totalEmployees: 15, totalPositions: 5 },
  ];

  // grade pyramid data
  const gradePyramid = [
    { level: 'Entry Level', count: 50 },
    { level: 'Mid Level', count: 30 },
    { level: 'Senior Level', count: 20 },
    { level: 'Executive', count: 10 },
  ];

  // promotion insights
  const promotionInsights = [
    { name: 'Alice Johnson', current: 'Software Engineer', target: 'Senior Software Engineer', years: 2 },
    { name: 'Bob Lee', current: 'Junior Accountant', target: 'Accountant', years: 3 },
    { name: 'Carlos Ruiz', current: 'HR Specialist', target: 'HR Manager', years: 4 },
  ];

  // organization hierarchy mock
  const organizationHierarchy = {
    id: '1',
    title: 'CEO',
    count: 1,
    children: [
      {
        id: '2',
        title: 'CTO',
        count: 1,
        children: [
          {
            id: '3',
            title: 'Engineering Manager',
            count: 1,
            children: [
              { id: '4', title: 'Senior Software Engineer', count: 2, children: [] },
              { id: '5', title: 'Software Engineer', count: 4, children: [] },
            ],
          },
          { id: '6', title: 'QA Manager', count: 1, children: [] },
        ],
      },
      {
        id: '7',
        title: 'CFO',
        count: 1,
        children: [{ id: '8', title: 'Finance Manager', count: 2, children: [] }],
      },
    ],
  };

  // career path for a selected position
  const careerPaths = {
    'Software Engineer': [
      'Junior Engineer',
      'Software Engineer',
      'Senior Software Engineer',
      'Engineering Manager',
    ],
  };

  // distribution charts data
  const positionDistribution = [
    { name: 'Engineering', value: 60 },
    { name: 'Finance', value: 30 },
    { name: 'HR', value: 15 },
  ];
  const gradeDistribution = [
    { name: 'G1', value: 25 },
    { name: 'G2', value: 40 },
    { name: 'G3', value: 35 },
  ];

  // trend/growth data
  const salaryTrend = [
    { month: 'Jan', averageSalary: 40000 },
    { month: 'Feb', averageSalary: 41000 },
    { month: 'Mar', averageSalary: 42000 },
  ];
  const positionGrowth = [
    { year: 2021, positions: 50 },
    { year: 2022, positions: 80 },
    { year: 2023, positions: 100 },
  ];

  // tables
  const positionTable = [
    { position: 'Software Engineer', grade: 'G3', filled: 4, open: 1 },
    { position: 'Accountant', grade: 'G2', filled: 2, open: 0 },
  ];
  const gradeTable = [
    { grade: 'G1', level: 'Entry', minSalary: '$30k', maxSalary: '$40k' },
    { grade: 'G2', level: 'Mid', minSalary: '$40k', maxSalary: '$55k' },
  ];

  // memoized selected career path
  const getCareerPath = (position) => careerPaths[position] || [];

  // search/filter helpers (future implementation)
  const searchPositions = (query) => {
    // TODO: filter positionTable based on query
    return positionTable.filter((r) => r.position.toLowerCase().includes(query.toLowerCase()));
  };

  // export functionality stubs
  const exportPositionsCSV = () => {
    // TODO: implement CSV download
    console.log('export positions');
  };
  const exportGradesCSV = () => {
    console.log('export grades');
  };

  // CRUD placeholders
  const addPosition = (pos) => {
    // TODO: open modal / call API
    console.log('add position', pos);
  };
  const addGrade = (grade) => {
    console.log('add grade', grade);
  };

  const assignGradeToPosition = (position, grade) => {
    console.log('assign', position, grade);
  };

  return {
    stats,
    salaryHeatmap,
    departmentWorkforce,
    gradePyramid,
    promotionInsights,
    organizationHierarchy,
    careerPaths,
    getCareerPath,
    searchPositions,
    exportPositionsCSV,
    exportGradesCSV,
    addPosition,
    addGrade,
    assignGradeToPosition,
    positionDistribution,
    gradeDistribution,
    salaryTrend,
    positionGrowth,
    positionTable,
    gradeTable,
  };
}

export default useJobPositionGradeViewModel;
