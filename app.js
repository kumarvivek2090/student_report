


























// Main Application Component (Left Sidebar Student/Parent/Teacher Portal)
const { useState, useEffect, useRef } = React;

function MiniOverviewChart({ student }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !student) return;
    if (chartRef.current) chartRef.current.destroy();

    const labels = window.SUBJECTS_LIST.map((s) => s.split(" ")[0]);
    const values = window.SUBJECTS_LIST.map((s) => Number(student.marks[s] || 0));

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Marks",
            data: values,
            backgroundColor: ["#16a34a", "#22c55e", "#15803d", "#4ade80", "#166534"],
            borderRadius: 6,
            barThickness: 26
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, max: 100, grid: { color: "#f1f5f9" } },
          x: { grid: { display: false } }
        }
      }
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [student]);

  return (
    <div style={{ height: "175px", width: "100%" }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

function FullAnalyticsCharts({ students, selectedStudent }) {
  const barCanvasRef = useRef(null);
  const lineCanvasRef = useRef(null);
  const barChartInstance = useRef(null);
  const lineChartInstance = useRef(null);

  useEffect(() => {
    if (!barCanvasRef.current || !lineCanvasRef.current) return;
    if (barChartInstance.current) barChartInstance.current.destroy();
    if (lineChartInstance.current) lineChartInstance.current.destroy();

    const subjects = window.SUBJECTS_LIST;
    const classAvgPerSubject = subjects.map((subj) => {
      const total = students.reduce((acc, st) => acc + Number(st.marks[subj] || 0), 0);
      return +(total / (students.length || 1)).toFixed(1);
    });
    const studentMarks = subjects.map((subj) => Number(selectedStudent?.marks[subj] || 0));

    barChartInstance.current = new Chart(barCanvasRef.current, {
      type: "bar",
      data: {
        labels: subjects,
        datasets: [
          {
            label: `${selectedStudent?.name || "Student"} Score`,
            data: studentMarks,
            backgroundColor: "#16a34a",
            borderRadius: 6
          },
          {
            label: "Class Average",
            data: classAvgPerSubject,
            backgroundColor: "#94a3b8",
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, max: 100 } }
      }
    });

    const avg = window.calculateAverage(selectedStudent?.marks);
    lineChartInstance.current = new Chart(lineCanvasRef.current, {
      type: "line",
      data: {
        labels: ["Unit Test 1", "Mid-Sem Exam", "Lab Review 1", "Pre-Final", "Current Aggregate"],
        datasets: [
          {
            label: `${selectedStudent?.name || "Student"} Trend (%)`,
            data: [
              Math.max(45, +(avg - 6.5).toFixed(1)),
              Math.max(48, +(avg - 3.2).toFixed(1)),
              Math.max(50, +(avg - 1.5).toFixed(1)),
              Math.max(52, +(avg - 0.8).toFixed(1)),
              avg
            ],
            borderColor: "#15803d",
            backgroundColor: "rgba(22, 163, 74, 0.16)",
            fill: true,
            tension: 0.35
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: false, min: 40, max: 100 } }
      }
    });

    return () => {
      if (barChartInstance.current) barChartInstance.current.destroy();
      if (lineChartInstance.current) lineChartInstance.current.destroy();
    };
  }, [students, selectedStudent]);

  return (
    <div className="row g-4">
      <div className="col-lg-7">
        <div className="stat-card p-4 h-100">
          <h6 className="fw-bold mb-1">Subject-Wise Performance vs Class Average</h6>
          <p className="text-muted small mb-3">Detailed score breakdown for {selectedStudent?.name}</p>
          <div className="chart-container">
            <canvas ref={barCanvasRef}></canvas>
          </div>
        </div>
      </div>
      <div className="col-lg-5">
        <div className="stat-card p-4 h-100">
          <h6 className="fw-bold mb-1">Semester Progression Curve</h6>
          <p className="text-muted small mb-3">Continuous internal assessment growth</p>
          <div className="chart-container">
            <canvas ref={lineCanvasRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentReportApp() {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("srs_users_v3");
    return saved ? JSON.parse(saved) : window.DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedSession = localStorage.getItem("srs_active_user_v3");
    return savedSession ? JSON.parse(savedSession) : null;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("srs_students_v3");
    return saved ? JSON.parse(saved) : window.INITIAL_STUDENTS;
  });

  const [gradingScale, setGradingScale] = useState(() => {
    return localStorage.getItem("srs_scale_v3") || "CGPA_10";
  });

  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("STU101");
  const [toastMsg, setToastMsg] = useState("");
  const [messages, setMessages] = useState([
    { from: "Prof. Meera Krishnan", text: "Welcome to Semester III! Keep up the great work on your Front-End project.", time: "10:15 AM" }
  ]);
  const [newMsgText, setNewMsgText] = useState("");

  // Teacher Edit Form State
  const [editStudentId, setEditStudentId] = useState("STU101");
  const [newStudentMode, setNewStudentMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    section: "CSE-A",
    parentName: "",
    attendance: 85,
    marks: {
      "Data Structures": 80,
      "Front-End Web Dev": 85,
      "Discrete Mathematics": 78,
      "Operating Systems": 82,
      "Database Systems": 84
    },
    remarks: ""
  });

  useEffect(() => {
    localStorage.setItem("srs_users_v3", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("srs_students_v3", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("srs_scale_v3", gradingScale);
  }, [gradingScale]);

  useEffect(() => {
    if (!newStudentMode) {
      const target = students.find((s) => s.id === editStudentId) || students[0];
      if (target) {
        setFormData({
          name: target.name,
          rollNo: target.rollNo,
          section: target.section,
          parentName: target.parentName,
          attendance: target.attendance,
          marks: { ...target.marks },
          remarks: target.remarks
        });
      }
    }
  }, [editStudentId, newStudentMode, students]);

  useEffect(() => {
    if (currentUser && currentUser.role !== "teacher" && currentUser.linkedStudentId) {
      setSelectedStudentId(currentUser.linkedStudentId);
    }
  }, [currentUser]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleLoginSuccess = (user, remember) => {
    setCurrentUser(user);
    if (remember) {
      localStorage.setItem("srs_active_user_v3", JSON.stringify(user));
    } else {
      localStorage.removeItem("srs_active_user_v3");
    }
    if (user.role !== "teacher" && user.linkedStudentId) {
      setSelectedStudentId(user.linkedStudentId);
    }
    setActiveTab("home");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("srs_active_user_v3");
  };

  const handleRegisterUser = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
  };

  if (!currentUser) {
    return (
      <window.AuthScreen
        users={users}
        students={students}
        onLoginSuccess={handleLoginSuccess}
        onRegisterUser={handleRegisterUser}
      />
    );
  }

  const isTeacher = currentUser.role === "teacher";
  const visibleStudents = isTeacher
    ? students
    : students.filter((st) => st.id === currentUser.linkedStudentId);

  const activeStudent = isTeacher
    ? students.find((s) => s.id === selectedStudentId) || students[0]
    : visibleStudents[0] || students[0];

  const firstName = currentUser.name.split(" ")[0];
  const personalAvg = window.calculateAverage(activeStudent?.marks);
  const personalGrade = window.formatGradeByScale(personalAvg, gradingScale);

  const handleSaveRecord = (e) => {
    e.preventDefault();
    if (newStudentMode) {
      const created = {
        id: "STU" + Math.floor(107 + Math.random() * 890),
        rollNo: formData.rollNo || "2500030199",
        name: formData.name,
        email: formData.name.toLowerCase().replace(/\s+/g, ".") + "@edu.in",
        phone: "+91 98765 00000",
        semester: "Sem III",
        section: formData.section,
        parentName: formData.parentName || "Guardian",
        feeDue: 0,
        feePaid: 50000,
        attendance: Number(formData.attendance),
        marks: { ...formData.marks },
        remarks: formData.remarks || "Progress report initialized."
      };
      setStudents((prev) => [...prev, created]);
      setSelectedStudentId(created.id);
      setEditStudentId(created.id);
      setNewStudentMode(false);
      showToast(`Added new student: ${created.name}`);
    } else {
      setStudents((prev) =>
        prev.map((st) =>
          st.id === editStudentId
            ? {
                ...st,
                name: formData.name,
                rollNo: formData.rollNo,
                section: formData.section,
                parentName: formData.parentName,
                attendance: Number(formData.attendance),
                marks: { ...formData.marks },
                remarks: formData.remarks
              }
            : st
        )
      );
      showToast(`Updated grades & attendance for ${formData.name}`);
    }
  };

  // Left Sidebar Menu Items (Matching Reference Screenshot)
  const sidebarMenu = [
    { id: "home", label: "Home", icon: "bi-house-door-fill", show: true },
    { id: "profile", label: "Profile", icon: "bi-person-fill", show: true },
    { id: "entry", label: "Marks Entry", icon: "bi-pencil-square", show: isTeacher },
    { id: "attendance", label: "Attendance", icon: "bi-check2-square", show: true },
    { id: "grades", label: "Grades", icon: "bi-bar-chart-steps", show: true },
    { id: "analysis", label: "Student Analysis", icon: "bi-graph-up", show: true },
    { id: "assignments", label: "Assignments", icon: "bi-journal-bookmark-fill", show: true },
    { id: "exams", label: "Exams", icon: "bi-mortarboard-fill", show: true },
    { id: "timetable", label: "Timetable", icon: "bi-calendar3", show: true },
    { id: "fees", label: "Fees", icon: "bi-currency-rupee", show: true },
    { id: "events", label: "Events", icon: "bi-calendar-event-fill", show: true },
    { id: "notices", label: "Notices", icon: "bi-bell-fill", show: true },
    { id: "library", label: "Library", icon: "bi-book-half", show: true },
    { id: "faculty", label: "Faculty", icon: "bi-people-fill", show: true },
    { id: "messages", label: "Messages", icon: "bi-chat-dots-fill", show: true },
    { id: "settings", label: "Settings", icon: "bi-gear-fill", show: true }
  ];

  // Quick Access Cards on Home Dashboard (Matching Reference Screenshot)
  const quickAccessItems = [
    { id: "profile", title: "Profile", sub: "View & edit profile", icon: "bi-person-fill", bg: "#dcfce7", color: "#15803d" },
    { id: "events", title: "Events", sub: "Academic events", icon: "bi-calendar-event-fill", bg: "#fef3c7", color: "#d97706" },
    { id: "faculty", title: "Faculty", sub: "Message faculty", icon: "bi-people-fill", bg: "#dbeafe", color: "#2563eb" },
    { id: "attendance", title: "Attendance", sub: "Check attendance", icon: "bi-check-circle-fill", bg: "#dcfce7", color: "#16a34a" },
    { id: "messages", title: "Messages", sub: "Chat with faculty", icon: "bi-chat-dots-fill", bg: "#fce7f3", color: "#db2777" },
    { id: "grades", title: "Grade Sheet", sub: "View your grades", icon: "bi-file-earmark-bar-graph-fill", bg: "#fef9c3", color: "#ca8a04" },
    { id: "analysis", title: "Student Analysis", sub: "Detailed performance", icon: "bi-graph-up-arrow", bg: "#e0f2fe", color: "#0284c7" },
    { id: "fees", title: "Fees Details", sub: "Payment & history", icon: "bi-currency-rupee", bg: "#ccfbf1", color: "#0d9488" },
    { id: "notices", title: "Notices", sub: "Latest updates", icon: "bi-megaphone-fill", bg: "#ede9fe", color: "#7c3aed" },
    { id: "assignments", title: "Assignments", sub: "Tasks & submissions", icon: "bi-clipboard-check-fill", bg: "#ffedd5", color: "#ea580c" },
    { id: "exams", title: "Exams", sub: "Schedule & results", icon: "bi-mortarboard-fill", bg: "#e0e7ff", color: "#4f46e5" },
    { id: "library", title: "Library", sub: "Books & resources", icon: "bi-book-fill", bg: "#dcfce7", color: "#15803d" }
  ];

  const navigateTo = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  return (
    <div className="portal-shell">
      {/* Left Dark-Green Sidebar */}
      <aside className={`portal-sidebar no-print ${sidebarOpen ? "open" : ""}`}>
        <div>
          <div className="sidebar-brand">
            <i className="bi bi-mortarboard-fill fs-5 text-warning"></i>
            <span>
              {currentUser.role === "teacher"
                ? "Faculty Portal"
                : currentUser.role === "parent"
                ? "Parent Portal"
                : "Student Portal"}
            </span>
          </div>

          <div className="sidebar-nav-list">
            {sidebarMenu
              .filter((m) => m.show)
              .map((item) => (
                <button
                  key={item.id}
                  className={`sidebar-item-btn ${activeTab === item.id ? "active" : ""}`}
                  onClick={() => navigateTo(item.id)}
                >
                  <i className={`bi ${item.icon}`}></i>
                  <span>{item.label}</span>
                </button>
              ))}
          </div>
        </div>

        <div className="sidebar-logout-area">
          <button className="sidebar-item-btn text-warning" onClick={handleLogout}>
            <i className="bi bi-box-arrow-left"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="portal-main">
        {/* Top Bar with Search & Logged-in User Profile */}
        <header className="portal-topbar no-print">
          <div className="d-flex align-items-center gap-2 flex-grow-1">
            <button
              className="btn btn-sm btn-outline-success d-lg-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className="bi bi-list fs-5"></i>
            </button>
            <div className="topbar-search">
              <i className="bi bi-search text-muted small"></i>
              <input
                type="text"
                placeholder="Search grades, subjects, notices..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            {isTeacher && (
              <select
                className="form-select form-select-sm d-none d-md-block"
                style={{ width: "210px" }}
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.rollNo})
                  </option>
                ))}
              </select>
            )}

            <button
              className="btn btn-light btn-sm position-relative rounded-circle"
              onClick={() => navigateTo("notices")}
              title="Notices"
            >
              <i className="bi bi-bell-fill text-success"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.6rem" }}>
                3
              </span>
            </button>

            <div className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }} onClick={() => navigateTo("profile")}>
              <div className="avatar-circle">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="d-none d-sm-block lh-1">
                <div className="fw-semibold small">{currentUser.name}</div>
                <small className="text-muted text-capitalize" style={{ fontSize: "0.72rem" }}>
                  {currentUser.role}
                </small>
              </div>
            </div>
          </div>
        </header>

        {/* Toast Notification */}
        {toastMsg && (
          <div className="px-4 pt-3 no-print">
            <div className="alert alert-success py-2 mb-0 shadow-sm d-flex align-items-center gap-2">
              <i className="bi bi-check-circle-fill"></i>
              <span>{toastMsg}</span>
            </div>
          </div>
        )}

        {/* Dynamic Page Content */}
        <div className="p-3 p-md-4">
          {/* 1. HOME DASHBOARD (Matching Reference Screenshot) */}
          {activeTab === "home" && (
            <div>
              {/* Hero Welcome Banner */}
              <div className="hero-welcome-banner mb-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div>
                  <h3 className="fw-bold mb-1">Hello, {firstName} 👋</h3>
                  <p className="mb-0 text-white-50 small">
                    {currentUser.role === "parent"
                      ? `Monitoring academic progress of ${activeStudent?.name} (${activeStudent?.rollNo})`
                      : "Have a great day ahead! Welcome to your academic dashboard."}
                  </p>
                </div>
                <div className="text-md-end small fst-italic text-white-50" style={{ maxWidth: "320px" }}>
                  "Education is the foundation for a better tomorrow."
                </div>
              </div>

              {/* Quick Access Section */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Quick Access</h6>
                <span
                  className="small fw-semibold text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigateTo("analysis")}
                >
                  View Analysis
                </span>
              </div>

              <div className="row g-3 mb-4">
                {quickAccessItems.map((item) => (
                  <div className="col-6 col-md-4 col-xl-3" key={item.id}>
                    <div className="quick-card" onClick={() => navigateTo(item.id)}>
                      <div
                        className="quick-icon"
                        style={{ backgroundColor: item.bg, color: item.color }}
                      >
                        <i className={`bi ${item.icon}`}></i>
                      </div>
                      <div className="fw-bold small mb-0">{item.title}</div>
                      <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                        {item.sub}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Academic Overview Section */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Academic Overview</h6>
                <span
                  className="small fw-semibold text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigateTo("grades")}
                >
                  View Details
                </span>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-sm-6 col-xl-3">
                  <div className="stat-card p-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <h4 className="fw-bold mb-0">{activeStudent?.attendance}%</h4>
                      <span className="badge bg-success-subtle text-success">Good</span>
                    </div>
                    <div className="text-muted small">Attendance</div>
                  </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                  <div className="stat-card p-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <h4 className="fw-bold mb-0">{personalGrade.numeric}</h4>
                      <span className="badge bg-primary-subtle text-primary">
                        {gradingScale.replace("_", " ")}
                      </span>
                    </div>
                    <div className="text-muted small">Current Score ({personalGrade.badge})</div>
                  </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                  <div className="stat-card p-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <h4 className="fw-bold mb-0">{personalAvg}%</h4>
                      <span className="badge bg-info-subtle text-info">Aggregate</span>
                    </div>
                    <div className="text-muted small">Academic Average</div>
                  </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                  <div className="stat-card p-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <h4 className="fw-bold mb-0">₹{activeStudent?.feeDue?.toLocaleString("en-IN")}</h4>
                      <span className={`badge ${activeStudent?.feeDue > 0 ? "bg-warning-subtle text-warning" : "bg-success-subtle text-success"}`}>
                        {activeStudent?.feeDue > 0 ? "Due" : "Paid"}
                      </span>
                    </div>
                    <div className="text-muted small">Fee Balance</div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Upcoming Events + Performance Overview Chart */}
              <div className="row g-4">
                <div className="col-lg-6">
                  <div className="stat-card p-4 h-100">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-bold mb-0">Upcoming Events</h6>
                      <span
                        className="small fw-semibold text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigateTo("events")}
                      >
                        View Calendar
                      </span>
                    </div>
                    <div className="d-flex flex-column gap-3">
                      {window.PORTAL_EXTRAS.events.slice(0, 2).map((ev, i) => (
                        <div key={i} className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light">
                          <div className="d-flex align-items-center gap-3">
                            <div className="bg-success bg-opacity-10 text-success rounded-3 px-3 py-2 text-center fw-bold">
                              <div className="lh-1">{ev.day}</div>
                              <small style={{ fontSize: "0.65rem" }}>{ev.month}</small>
                            </div>
                            <div>
                              <div className="fw-semibold small">{ev.title}</div>
                              <div className="text-muted" style={{ fontSize: "0.75rem" }}>{ev.time}</div>
                            </div>
                          </div>
                          <span className="badge bg-success-subtle text-success">{ev.tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="stat-card p-4 h-100">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-bold mb-0">Performance Overview ({activeStudent?.name})</h6>
                      <span
                        className="small fw-semibold text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigateTo("analysis")}
                      >
                        Full Charts
                      </span>
                    </div>
                    <MiniOverviewChart student={activeStudent} />
                  </div>
                </div>
              </div>

              {/* Teacher-Only Cohort Table on Home */}
              {isTeacher && (
                <div className="stat-card p-4 mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold mb-0">All Students Roster (Teacher View)</h6>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => { setNewStudentMode(true); navigateTo("entry"); }}
                    >
                      + Add Student
                    </button>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light small">
                        <tr>
                          <th>Roll No</th>
                          <th>Student Name</th>
                          <th>Parent Name</th>
                          <th>Attendance</th>
                          <th>Aggregate</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((st) => (
                          <tr key={st.id}>
                            <td className="small fw-semibold">{st.rollNo}</td>
                            <td className="fw-semibold">{st.name}</td>
                            <td className="small text-muted">{st.parentName}</td>
                            <td><span className="badge bg-success-subtle text-success">{st.attendance}%</span></td>
                            <td className="fw-bold">{window.calculateAverage(st.marks)}%</td>
                            <td className="text-end">
                              <button
                                className="btn btn-sm btn-outline-primary me-1"
                                onClick={() => { setSelectedStudentId(st.id); navigateTo("grades"); }}
                              >
                                Report
                              </button>
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => { setNewStudentMode(false); setEditStudentId(st.id); navigateTo("entry"); }}
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. PROFILE TAB */}
          {activeTab === "profile" && activeStudent && (
            <div className="stat-card p-4">
              <div className="d-flex align-items-center gap-3 pb-4 mb-4 border-bottom">
                <div className="avatar-circle" style={{ width: "64px", height: "64px", fontSize: "1.5rem" }}>
                  {activeStudent.name.charAt(0)}
                </div>
                <div>
                  <h4 className="fw-bold mb-1">{activeStudent.name}</h4>
                  <span className="badge bg-success me-2">{activeStudent.rollNo}</span>
                  <span className="badge bg-light text-dark border">{activeStudent.semester} • {activeStudent.section}</span>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="small text-muted">Father / Guardian Name</label>
                  <div className="fw-semibold">{activeStudent.parentName}</div>
                </div>
                <div className="col-md-4">
                  <label className="small text-muted">Institutional Email</label>
                  <div className="fw-semibold">{activeStudent.email || currentUser.email}</div>
                </div>
                <div className="col-md-4">
                  <label className="small text-muted">Contact Number</label>
                  <div className="fw-semibold">{activeStudent.phone || "+91 98765 43210"}</div>
                </div>
                <div className="col-md-4">
                  <label className="small text-muted">Department</label>
                  <div className="fw-semibold">Computer Science & Engineering</div>
                </div>
                <div className="col-md-4">
                  <label className="small text-muted">Active Portal Role</label>
                  <div className="fw-semibold text-capitalize">{currentUser.role}</div>
                </div>
              </div>
            </div>
          )}

          {/* 3. GRADES / PROGRESS REPORT SHEET */}
          {activeTab === "grades" && activeStudent && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3 no-print">
                <h5 className="fw-bold mb-0">Official Grade Sheet & Progress Report</h5>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                  <i className="bi bi-printer-fill me-2"></i>Print / Download Report Card
                </button>
              </div>
              <div className="report-sheet">
                <div className="report-header-banner p-4 d-flex flex-wrap justify-content-between align-items-center">
                  <div>
                    <span className="badge bg-light text-success mb-2">ACADEMIC TRANSCRIPT</span>
                    <h4 className="fw-bold mb-0">Department of Computer Science & Engineering</h4>
                    <small className="text-white-50">Student Progress & Continuous Assessment Report</small>
                  </div>
                  <div className="text-md-end mt-2 mt-md-0">
                    <div className="small text-white-50">Grading System</div>
                    <div className="fw-bold">{gradingScale.replace("_", " ")}</div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="row g-3 pb-3 mb-4 border-bottom small">
                    <div className="col-sm-3">
                      <span className="text-muted d-block">Student Name</span>
                      <strong className="fs-6">{activeStudent.name}</strong>
                    </div>
                    <div className="col-sm-3">
                      <span className="text-muted d-block">Roll Number</span>
                      <strong className="fs-6">{activeStudent.rollNo}</strong>
                    </div>
                    <div className="col-sm-3">
                      <span className="text-muted d-block">Parent Name</span>
                      <strong className="fs-6">{activeStudent.parentName}</strong>
                    </div>
                    <div className="col-sm-3">
                      <span className="text-muted d-block">Semester & Section</span>
                      <strong className="fs-6">{activeStudent.semester} • {activeStudent.section}</strong>
                    </div>
                  </div>

                  <div className="table-responsive mb-4">
                    <table className="table table-bordered align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Subject</th>
                          <th className="text-center">Max Marks</th>
                          <th className="text-center">Marks Obtained</th>
                          <th className="text-center">Grade</th>
                          <th className="text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {window.SUBJECTS_LIST.map((subj) => {
                          const score = activeStudent.marks[subj] ?? 0;
                          const g = window.formatGradeByScale(score, gradingScale);
                          return (
                            <tr key={subj}>
                              <td className="fw-medium">{subj}</td>
                              <td className="text-center">100</td>
                              <td className="text-center fw-bold">{score}</td>
                              <td className="text-center">
                                <span className="fw-bold text-primary me-1">{g.primary}</span>
                                <span className="badge bg-dark">{g.badge}</span>
                              </td>
                              <td className="text-center">
                                <span className={`badge ${g.pass ? "bg-success" : "bg-danger"}`}>
                                  {g.pass ? "PASS" : "RE-APPEAR"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="row g-3 bg-light p-3 rounded-3 border mb-3">
                    <div className="col-md-4">
                      <span className="text-muted small d-block">Aggregate Score</span>
                      <h5 className="fw-bold text-primary mb-0">
                        {personalAvg}% ({personalGrade.primary})
                      </h5>
                    </div>
                    <div className="col-md-4">
                      <span className="text-muted small d-block">Attendance</span>
                      <h5 className="fw-bold text-success mb-0">{activeStudent.attendance}%</h5>
                    </div>
                    <div className="col-md-4">
                      <span className="text-muted small d-block">Exam Eligibility</span>
                      <span className={`badge ${activeStudent.attendance >= 75 ? "bg-success" : "bg-danger"}`}>
                        {activeStudent.attendance >= 75 ? "Eligible" : "Shortage Warning"}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 border rounded-3">
                    <div className="small fw-bold text-muted mb-1">FACULTY REMARKS</div>
                    <p className="mb-0">{activeStudent.remarks}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. STUDENT ANALYSIS TAB */}
          {activeTab === "analysis" && activeStudent && (
            <div>
              <h5 className="fw-bold mb-3">Student Performance Analytics</h5>
              <FullAnalyticsCharts students={students} selectedStudent={activeStudent} />
            </div>
          )}

          {/* 5. ATTENDANCE TAB */}
          {activeTab === "attendance" && activeStudent && (
            <div className="stat-card p-4">
              <h5 className="fw-bold mb-1">Subject-Wise Attendance Tracker</h5>
              <p className="text-muted small mb-4">
                Overall Attendance for <strong>{activeStudent.name}</strong>: <span className="badge bg-success">{activeStudent.attendance}%</span>
              </p>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Subject</th>
                      <th>Classes Held</th>
                      <th>Attended</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {window.SUBJECTS_LIST.map((subj, idx) => {
                      const pct = Math.min(100, Math.max(65, activeStudent.attendance + (idx % 2 === 0 ? 2 : -2)));
                      return (
                        <tr key={subj}>
                          <td className="fw-medium">{subj}</td>
                          <td>40</td>
                          <td>{Math.round((pct / 100) * 40)}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className="progress flex-grow-1" style={{ height: "8px", maxWidth: "140px" }}>
                                <div className="progress-bar bg-success" style={{ width: `${pct}%` }}></div>
                              </div>
                              <span className="small fw-bold">{pct}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. TEACHER MARKS ENTRY */}
          {activeTab === "entry" && isTeacher && (
            <div className="stat-card p-4">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4 pb-3 border-bottom">
                <h5 className="fw-bold mb-0">
                  {newStudentMode ? "Add New Student & Marks" : "Edit Student Grades & Attendance"}
                </h5>
                <div className="d-flex gap-2">
                  {!newStudentMode && (
                    <select
                      className="form-select form-select-sm"
                      style={{ width: "220px" }}
                      value={editStudentId}
                      onChange={(e) => setEditStudentId(e.target.value)}
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.rollNo})
                        </option>
                      ))}
                    </select>
                  )}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setNewStudentMode(!newStudentMode)}
                  >
                    {newStudentMode ? "Edit Existing" : "+ Add New Student"}
                  </button>
                </div>
              </div>
              <form onSubmit={handleSaveRecord}>
                <div className="row g-3 mb-3">
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold">Student Name</label>
                    <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold">Roll No</label>
                    <input type="text" className="form-control" value={formData.rollNo} onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })} required />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold">Parent Name</label>
                    <input type="text" className="form-control" value={formData.parentName} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold">Attendance (%)</label>
                    <input type="number" min="0" max="100" className="form-control" value={formData.attendance} onChange={(e) => setFormData({ ...formData, attendance: e.target.value })} required />
                  </div>
                </div>
                <div className="row g-3 mb-3">
                  {window.SUBJECTS_LIST.map((subj) => (
                    <div className="col-md-4" key={subj}>
                      <label className="form-label small fw-semibold">{subj}</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="form-control"
                        value={formData.marks[subj] ?? 0}
                        onChange={(e) => setFormData({ ...formData, marks: { ...formData.marks, [subj]: Number(e.target.value) } })}
                        required
                      />
                    </div>
                  ))}
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Faculty Remarks</label>
                  <textarea className="form-control" rows="2" value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}></textarea>
                </div>
                <button type="submit" className="btn btn-primary px-4">Save Changes</button>
              </form>
            </div>
          )}

          {/* 7. ASSIGNMENTS */}
          {activeTab === "assignments" && (
            <div className="stat-card p-4">
              <h5 className="fw-bold mb-3">Course Assignments</h5>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-light">
                    <tr><th>ID</th><th>Subject</th><th>Assignment Title</th><th>Due Date</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {window.PORTAL_EXTRAS.assignments.map((a) => (
                      <tr key={a.id}>
                        <td className="small fw-bold">{a.id}</td>
                        <td>{a.subject}</td>
                        <td className="fw-medium">{a.title}</td>
                        <td className="small text-muted">{a.due}</td>
                        <td>
                          <span className={`badge ${a.status === "Submitted" ? "bg-success" : "bg-warning text-dark"}`}>
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 8. EXAMS */}
          {activeTab === "exams" && (
            <div className="stat-card p-4">
              <h5 className="fw-bold mb-3">End-Semester Examination Schedule</h5>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-light">
                    <tr><th>Course Code</th><th>Subject</th><th>Exam Date</th><th>Timing</th><th>Venue</th></tr>
                  </thead>
                  <tbody>
                    {window.PORTAL_EXTRAS.exams.map((ex) => (
                      <tr key={ex.code}>
                        <td className="fw-bold text-primary">{ex.code}</td>
                        <td className="fw-medium">{ex.subject}</td>
                        <td>{ex.date}</td>
                        <td className="small text-muted">{ex.time}</td>
                        <td><span className="badge bg-light text-dark border">{ex.room}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 9. TIMETABLE */}
          {activeTab === "timetable" && (
            <div className="stat-card p-4">
              <h5 className="fw-bold mb-3">Weekly Class Timetable ({activeStudent?.section})</h5>
              <div className="table-responsive">
                <table className="table table-bordered align-middle text-center">
                  <thead className="table-light">
                    <tr><th>Day</th><th>09:00 - 10:30</th><th>10:45 - 12:15</th><th>01:30 - 03:00</th><th>03:15 - 04:45</th></tr>
                  </thead>
                  <tbody>
                    {window.PORTAL_EXTRAS.timetable.map((row) => (
                      <tr key={row.day}>
                        <td className="fw-bold bg-light">{row.day}</td>
                        <td>{row.s1}</td>
                        <td>{row.s2}</td>
                        <td>{row.s3}</td>
                        <td>{row.s4}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 10. FEES */}
          {activeTab === "fees" && activeStudent && (
            <div className="stat-card p-4">
              <h5 className="fw-bold mb-3">Fee Summary & Receipts ({activeStudent.name})</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <div className="p-3 border rounded-3 bg-light">
                    <small className="text-muted">Total Semester Fee</small>
                    <h4 className="fw-bold mb-0">₹50,000</h4>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 border rounded-3 bg-light">
                    <small className="text-muted">Amount Paid</small>
                    <h4 className="fw-bold text-success mb-0">₹{activeStudent.feePaid?.toLocaleString("en-IN")}</h4>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 border rounded-3 bg-light">
                    <small className="text-muted">Pending Balance</small>
                    <h4 className="fw-bold text-danger mb-0">₹{activeStudent.feeDue?.toLocaleString("en-IN")}</h4>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 11. EVENTS */}
          {activeTab === "events" && (
            <div className="stat-card p-4">
              <h5 className="fw-bold mb-3">Campus & Academic Events</h5>
              <div className="row g-3">
                {window.PORTAL_EXTRAS.events.map((ev, i) => (
                  <div className="col-md-4" key={i}>
                    <div className="p-3 border rounded-3 h-100 bg-light">
                      <span className="badge bg-success mb-2">{ev.day} {ev.month} 2026</span>
                      <h6 className="fw-bold">{ev.title}</h6>
                      <p className="small text-muted mb-0">{ev.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 12. NOTICES */}
          {activeTab === "notices" && (
            <div className="stat-card p-4">
              <h5 className="fw-bold mb-3">Official Academic Notices</h5>
              <div className="d-flex flex-column gap-3">
                {window.PORTAL_EXTRAS.notices.map((n, i) => (
                  <div className="p-3 border rounded-3 bg-light" key={i}>
                    <div className="d-flex justify-content-between">
                      <h6 className="fw-bold text-primary mb-1">{n.title}</h6>
                      <small className="text-muted">{n.date}</small>
                    </div>
                    <p className="small mb-0">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 13. LIBRARY */}
          {activeTab === "library" && (
            <div className="stat-card p-4">
              <h5 className="fw-bold mb-3">Digital & Central Library Books</h5>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-light">
                    <tr><th>Book ID</th><th>Title</th><th>Author</th><th>Return Date</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {window.PORTAL_EXTRAS.library.map((b) => (
                      <tr key={b.id}>
                        <td className="fw-bold">{b.id}</td>
                        <td className="fw-medium">{b.title}</td>
                        <td className="small text-muted">{b.author}</td>
                        <td className="small">{b.due}</td>
                        <td><span className={`badge ${b.status === "Issued" ? "bg-info text-dark" : "bg-success"}`}>{b.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 14. FACULTY */}
          {activeTab === "faculty" && (
            <div className="stat-card p-4">
              <h5 className="fw-bold mb-3">Course Faculty Directory</h5>
              <div className="row g-3">
                {window.PORTAL_EXTRAS.faculty.map((f, i) => (
                  <div className="col-md-6" key={i}>
                    <div className="p-3 border rounded-3 d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="fw-bold mb-0">{f.name}</h6>
                        <div className="small text-primary">{f.subject}</div>
                        <small className="text-muted">{f.email} • {f.cabin}</small>
                      </div>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => navigateTo("messages")}>
                        Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 15. MESSAGES */}
          {activeTab === "messages" && (
            <div className="stat-card p-4">
              <h5 className="fw-bold mb-3">Faculty & Mentor Messages</h5>
              <div className="p-3 bg-light rounded-3 border mb-3" style={{ maxHeight: "260px", overflowY: "auto" }}>
                {messages.map((m, i) => (
                  <div key={i} className="mb-2 p-2 bg-white rounded-3 border">
                    <div className="d-flex justify-content-between small">
                      <strong className="text-primary">{m.from}</strong>
                      <span className="text-muted">{m.time}</span>
                    </div>
                    <div className="small mt-1">{m.text}</div>
                  </div>
                ))}
              </div>
              <form
                className="d-flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newMsgText.trim()) return;
                  setMessages([...messages, { from: currentUser.name, text: newMsgText, time: "Just now" }]);
                  setNewMsgText("");
                }}
              >
                <input
                  type="text"
                  className="form-control"
                  placeholder="Write a message to faculty..."
                  value={newMsgText}
                  onChange={(e) => setNewMsgText(e.target.value)}
                />
                <button type="submit" className="btn btn-primary px-4">Send</button>
              </form>
            </div>
          )}

          {/* 16. SETTINGS (Grading Scale Customization) */}
          {activeTab === "settings" && (
            <div className="stat-card p-4">
              <h5 className="fw-bold mb-1">Grading Format & Portal Settings</h5>
              <p className="text-muted small mb-4">Select your preferred grading format across report cards and dashboards:</p>
              <div className="row g-3">
                {[
                  { id: "CGPA_10", title: "10-Point CGPA Scale", desc: "Converts percentage to 10.0 CGPA with O, A+, A, B+ grades." },
                  { id: "GPA_4", title: "4.0 GPA Scale", desc: "Standard 4.0 GPA points with A, B+, B, C classifications." },
                  { id: "COMPETENCY_OBE", title: "Competency Levels (OBE)", desc: "Mastery levels L4, L3, L2, and L1." }
                ].map((opt) => (
                  <div className="col-md-4" key={opt.id}>
                    <div
                      className={`p-3 rounded-3 border h-100 ${gradingScale === opt.id ? "border-success bg-success bg-opacity-10" : "bg-white"}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => { setGradingScale(opt.id); showToast(`Grading format changed to ${opt.title}`); }}
                    >
                      <h6 className="fw-bold">{opt.title}</h6>
                      <p className="small text-muted mb-0">{opt.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<StudentReportApp />);
