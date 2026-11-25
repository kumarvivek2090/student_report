// Login & Registration Component
const { useState } = React;

window.AuthScreen = function ({ users, students, onLoginSuccess, onRegisterUser }) {
  const [mode, setMode] = useState("login");
  const [selectedRole, setSelectedRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [linkedStudentId, setLinkedStudentId] = useState(students[0]?.id || "STU101");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleQuickFill = (role) => {
    setMode("login");
    setErrorMsg("");
    setSuccessMsg("");
    setSelectedRole(role);
    if (role === "teacher") {
      setEmail("teacher@edu.in");
      setPassword("password123");
    } else if (role === "student") {
      setEmail("student@edu.in");
      setPassword("password123");
    } else {
      setEmail("parent@edu.in");
      setPassword("password123");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (mode === "login") {
      const matched = users.find(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password &&
          u.role === selectedRole
      );
      if (!matched) {
        setErrorMsg(
          `Invalid credentials for ${selectedRole.toUpperCase()} portal. Enter valid email & password or use Quick Demo chips below.`
        );
        return;
      }
      onLoginSuccess(matched, rememberMe);
    } else {
      if (!fullName.trim() || !email.trim() || password.length < 6) {
        setErrorMsg("Please enter full name, valid email, and password (minimum 6 characters).");
        return;
      }
      const exists = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (exists) {
        setErrorMsg("An account with this email already exists. Please sign in.");
        return;
      }
      const newUser = {
        id: "USR-" + Date.now(),
        name: fullName.trim(),
        email: email.trim(),
        password: password,
        role: selectedRole,
        linkedStudentId: selectedRole !== "teacher" ? linkedStudentId : undefined
      };
      onRegisterUser(newUser);
      setSuccessMsg("Account created successfully! Entering portal...");
      setTimeout(() => {
        onLoginSuccess(newUser, rememberMe);
      }, 650);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card row g-0">
        {/* Left Branding Panel */}
        <div className="col-lg-5 auth-brand-panel">
          <div>
            <div className="d-flex align-items-center gap-2 mb-4">
              <div className="bg-white text-success rounded-3 p-2 d-flex align-items-center justify-content-center">
                <i className="bi bi-mortarboard-fill fs-4"></i>
              </div>
              <div>
                <h5 className="mb-0 fw-bold">Student Portal</h5>
                <small className="text-white-50">Student Report System</small>
              </div>
            </div>

            <h3 className="fw-bold mb-3">Academic Performance & Progress Portal</h3>
            <p className="text-white-50 small lh-lg mb-4">
              Access student progress reports, attendance records, grades, assignments, exams, and performance analytics in one unified portal.
            </p>

            <div className="d-flex flex-column gap-3 small">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-check-circle-fill text-warning"></i>
                <span>Dedicated Student, Parent & Teacher Portals</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-check-circle-fill text-warning"></i>
                <span>Real-Time Grade Sheet, CGPA & Attendance</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-check-circle-fill text-warning"></i>
                <span>Printable Transcripts & Trend Analytics</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-top border-white border-opacity-10 mt-4">
            <span className="badge bg-light text-success mb-1">Student Report System</span>
            <p className="mb-0 small text-white-50">
              React JS • Bootstrap 5 • Responsive Academic UI
            </p>
          </div>
        </div>

        {/* Right Login / Register Form Panel */}
        <div className="col-lg-7 p-4 p-md-5 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-1">
                {mode === "login" ? "Portal Sign In" : "Create Account"}
              </h4>
              <p className="text-muted small mb-0">
                {mode === "login"
                  ? "Select your role and sign in to your dashboard"
                  : "Register a new Teacher, Student, or Parent account"}
              </p>
            </div>
            <div className="btn-group btn-group-sm" role="group">
              <button
                type="button"
                className={`btn ${mode === "login" ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => { setMode("login"); setErrorMsg(""); }}
              >
                Login
              </button>
              <button
                type="button"
                className={`btn ${mode === "register" ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => { setMode("register"); setErrorMsg(""); setFullName(""); }}
              >
                Register
              </button>
            </div>
          </div>

          {/* Role Selector Tabs */}
          <label className="form-label small fw-semibold text-muted">SELECT ROLE</label>
          <div className="row g-2 mb-3">
            {[
              { id: "student", label: "Student", icon: "bi-person-badge" },
              { id: "parent", label: "Parent", icon: "bi-people-fill" },
              { id: "teacher", label: "Teacher", icon: "bi-person-workspace" }
            ].map((r) => (
              <div className="col-4" key={r.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole(r.id);
                    setErrorMsg("");
                  }}
                  className={`w-100 btn py-2 d-flex flex-column align-items-center gap-1 border ${
                    selectedRole === r.id
                      ? "btn-primary text-white border-success shadow-sm"
                      : "btn-light text-dark"
                  }`}
                >
                  <i className={`bi ${r.icon} fs-5`}></i>
                  <span className="small fw-semibold">{r.label}</span>
                </button>
              </div>
            ))}
          </div>

          {errorMsg && (
            <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success py-2 small d-flex align-items-center gap-2">
              <i className="bi bi-check-circle-fill"></i>
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === "register" && (
              <div className="mb-3">
                <label className="form-label small fw-semibold">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Vivek Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label small fw-semibold">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>
            </div>

            {mode === "register" && selectedRole !== "teacher" && (
              <div className="mb-3">
                <label className="form-label small fw-semibold">
                  Link Student Profile ({selectedRole === "parent" ? "Ward" : "Your Record"})
                </label>
                <select
                  className="form-select"
                  value={linkedStudentId}
                  onChange={(e) => setLinkedStudentId(e.target.value)}
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.rollNo} - {st.section})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="rememberCheck"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className="form-check-label small text-muted" htmlFor="rememberCheck">
                  Keep me signed in
                </label>
              </div>
              <span
                className="small text-primary fw-medium"
                style={{ cursor: "pointer" }}
                onClick={() => { setEmail(""); setPassword(""); setErrorMsg(""); }}
              >
                Clear
              </span>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold shadow-sm">
              <i className={`bi ${mode === "login" ? "bi-box-arrow-in-right" : "bi-person-plus"} me-2`}></i>
              {mode === "login"
                ? `Sign In as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`
                : "Register & Continue"}
            </button>
          </form>

          {/* One-Click Demo Credential Fillers */}
          <div className="mt-4 pt-3 border-top">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small fw-semibold text-muted">
                <i className="bi bi-lightning-charge-fill text-success me-1"></i>
                Quick Fill Demo Accounts:
              </span>
              <span className="badge bg-light text-dark border">Pass: password123</span>
            </div>
            <div className="row g-2">
              <div className="col-sm-4">
                <div className="p-2 rounded-3 demo-chip text-center" onClick={() => handleQuickFill("student")}>
                  <div className="fw-semibold small text-success">Vivek Kumar</div>
                  <div className="text-muted" style={{ fontSize: "0.72rem" }}>student@edu.in</div>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="p-2 rounded-3 demo-chip text-center" onClick={() => handleQuickFill("parent")}>
                  <div className="fw-semibold small text-success">Harekrishna Singh</div>
                  <div className="text-muted" style={{ fontSize: "0.72rem" }}>parent@edu.in</div>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="p-2 rounded-3 demo-chip text-center" onClick={() => handleQuickFill("teacher")}>
                  <div className="fw-semibold small text-success">Teacher</div>
                  <div className="text-muted" style={{ fontSize: "0.72rem" }}>teacher@edu.in</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
