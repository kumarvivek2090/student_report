// Student Report System Dataset & Portal Modules
window.INITIAL_STUDENTS = [
  {
    id: "STU101",
    rollNo: "2500030101",
    name: "Vivek Kumar",
    email: "student@edu.in",
    phone: "+91 98765 43210",
    semester: "Sem III",
    section: "CSE-A",
    parentName: "Harekrishna Singh",
    feeDue: 5200,
    feePaid: 44800,
    attendance: 94,
    marks: {
      "Data Structures": 91,
      "Front-End Web Dev": 95,
      "Discrete Mathematics": 86,
      "Operating Systems": 88,
      "Database Systems": 90
    },
    remarks: "Consistent top performer with strong front-end React architecture skills and active participation in lab reviews."
  },
  {
    id: "STU102",
    rollNo: "2500030102",
    name: "Ananya Reddy",
    email: "ananya@edu.in",
    phone: "+91 98765 43211",
    semester: "Sem III",
    section: "CSE-A",
    parentName: "Venkat Reddy",
    feeDue: 0,
    feePaid: 50000,
    attendance: 96,
    marks: {
      "Data Structures": 94,
      "Front-End Web Dev": 92,
      "Discrete Mathematics": 93,
      "Operating Systems": 91,
      "Database Systems": 95
    },
    remarks: "Exceptional analytical clarity and clean React component design. Qualified for Honor Roll."
  },
  {
    id: "STU103",
    rollNo: "2500030103",
    name: "Rohan Verma",
    email: "rohan@edu.in",
    phone: "+91 98765 43212",
    semester: "Sem III",
    section: "CSE-B",
    parentName: "Suresh Verma",
    feeDue: 12000,
    feePaid: 38000,
    attendance: 76,
    marks: {
      "Data Structures": 68,
      "Front-End Web Dev": 79,
      "Discrete Mathematics": 64,
      "Operating Systems": 71,
      "Database Systems": 73
    },
    remarks: "Good UI responsiveness in labs, but needs to improve attendance and consistency in Discrete Mathematics."
  },
  {
    id: "STU104",
    rollNo: "2500030104",
    name: "Sneha Nair",
    email: "sneha@edu.in",
    phone: "+91 98765 43213",
    semester: "Sem III",
    section: "CSE-A",
    parentName: "Mohan Nair",
    feeDue: 0,
    feePaid: 50000,
    attendance: 89,
    marks: {
      "Data Structures": 84,
      "Front-End Web Dev": 88,
      "Discrete Mathematics": 81,
      "Operating Systems": 85,
      "Database Systems": 87
    },
    remarks: "Steady academic progress across all core subjects. Well-structured Bootstrap UI deliverables."
  },
  {
    id: "STU105",
    rollNo: "2500030105",
    name: "Karthikeya Rao",
    email: "karthik@edu.in",
    phone: "+91 98765 43214",
    semester: "Sem III",
    section: "CSE-B",
    parentName: "Prakash Rao",
    feeDue: 15000,
    feePaid: 35000,
    attendance: 69,
    marks: {
      "Data Structures": 56,
      "Front-End Web Dev": 65,
      "Discrete Mathematics": 52,
      "Operating Systems": 60,
      "Database Systems": 58
    },
    remarks: "Attendance below 75% threshold. Parent counseling and remedial mentoring scheduled before final review."
  },
  {
    id: "STU106",
    rollNo: "2500030106",
    name: "Priya Patel",
    email: "priya@edu.in",
    phone: "+91 98765 43215",
    semester: "Sem III",
    section: "CSE-B",
    parentName: "Dinesh Patel",
    feeDue: 2500,
    feePaid: 47500,
    attendance: 92,
    marks: {
      "Data Structures": 89,
      "Front-End Web Dev": 94,
      "Discrete Mathematics": 85,
      "Operating Systems": 87,
      "Database Systems": 91
    },
    remarks: "Strong problem-solving mindset and polished UI presentation during First Progress Review."
  }
];

window.SUBJECTS_LIST = [
  "Data Structures",
  "Front-End Web Dev",
  "Discrete Mathematics",
  "Operating Systems",
  "Database Systems"
];

window.DEFAULT_USERS = [
  {
    id: "USR-T1",
    name: "Prof. Meera Krishnan",
    email: "teacher@edu.in",
    password: "password123",
    role: "teacher",
    department: "Computer Science & Engg."
  },
  {
    id: "USR-S1",
    name: "Vivek Kumar",
    email: "student@edu.in",
    password: "password123",
    role: "student",
    linkedStudentId: "STU101"
  },
  {
    id: "USR-P1",
    name: "Harekrishna Singh",
    email: "parent@edu.in",
    password: "password123",
    role: "parent",
    linkedStudentId: "STU101"
  }
];

window.PORTAL_EXTRAS = {
  assignments: [
    { id: "ASG-1", subject: "Front-End Web Dev", title: "React Student Report System UI", due: "28 Nov 2026", status: "Submitted" },
    { id: "ASG-2", subject: "Data Structures", title: "AVL Tree & Graph Traversal Lab", due: "02 Dec 2026", status: "Pending" },
    { id: "ASG-3", subject: "Database Systems", title: "ER Diagram & SQL Normalization", due: "05 Dec 2026", status: "Submitted" },
    { id: "ASG-4", subject: "Operating Systems", title: "CPU Scheduling Simulator", due: "09 Dec 2026", status: "Pending" }
  ],
  exams: [
    { code: "CS301", subject: "Data Structures", date: "14 Dec 2026", time: "09:30 AM - 12:30 PM", room: "Block C - 302" },
    { code: "CS302", subject: "Front-End Web Dev", date: "16 Dec 2026", time: "09:30 AM - 12:30 PM", room: "Lab Complex - 104" },
    { code: "MA303", subject: "Discrete Mathematics", date: "18 Dec 2026", time: "09:30 AM - 12:30 PM", room: "Block A - 201" },
    { code: "CS304", subject: "Operating Systems", date: "21 Dec 2026", time: "09:30 AM - 12:30 PM", room: "Block C - 305" }
  ],
  timetable: [
    { day: "Monday", s1: "Data Structures", s2: "Front-End Web Dev", s3: "Discrete Maths", s4: "OS Lab" },
    { day: "Tuesday", s1: "Operating Systems", s2: "Database Systems", s3: "Front-End Lab", s4: "Mentoring" },
    { day: "Wednesday", s1: "Discrete Maths", s2: "Data Structures", s3: "Database Lab", s4: "Library" },
    { day: "Thursday", s1: "Front-End Web Dev", s2: "Operating Systems", s3: "Data Structures", s4: "Hackathon Prep" },
    { day: "Friday", s1: "Database Systems", s2: "Discrete Maths", s3: "Project Review", s4: "Sports / Club" }
  ],
  events: [
    { day: "10", month: "DEC", title: "Science & Tech Exhibition", time: "10:00 AM - 03:00 PM • Main Auditorium", tag: "Upcoming" },
    { day: "15", month: "DEC", title: "Parent Teacher Meeting", time: "02:00 PM - 04:30 PM • Room 204", tag: "Upcoming" },
    { day: "20", month: "DEC", title: "End-Semester Project Hackathon", time: "09:00 AM - 05:00 PM • Innovation Hub", tag: "Final Review" }
  ],
  notices: [
    { date: "25 Nov 2026", title: "First Review Progress Evaluation Schedule", desc: "All CSE Sem-III students must present their React & Bootstrap Student Report System." },
    { date: "22 Nov 2026", title: "Minimum 75% Attendance Advisory", desc: "Students below 75% attendance must meet their faculty mentor before hall ticket generation." },
    { date: "18 Nov 2026", title: "Semester Fee Payment Window", desc: "Remaining tuition balance can be cleared online via the Fees section." }
  ],
  library: [
    { id: "BK-104", title: "Learning React (2nd Edition)", author: "Alex Banks & Eve Porcello", due: "10 Dec 2026", status: "Issued" },
    { id: "BK-219", title: "Introduction to Algorithms (CLRS)", author: "Thomas H. Cormen", due: "18 Dec 2026", status: "Issued" },
    { id: "BK-305", title: "Database System Concepts", author: "Abraham Silberschatz", due: "Available", status: "In Shelf" }
  ],
  faculty: [
    { name: "Prof. Meera Krishnan", subject: "Front-End Web Dev", email: "teacher@edu.in", cabin: "C-Block, 204" },
    { name: "Dr. Arvind Kulkarni", subject: "Data Structures", email: "arvind.k@edu.in", cabin: "C-Block, 112" },
    { name: "Prof. Sunita Deshmukh", subject: "Database Systems", email: "sunita.d@edu.in", cabin: "B-Block, 308" },
    { name: "Dr. R. Subramanian", subject: "Discrete Mathematics", email: "subramanian@edu.in", cabin: "A-Block, 105" }
  ]
};

window.calculateAverage = function (marksObj) {
  const vals = Object.values(marksObj || {});
  if (!vals.length) return 0;
  const sum = vals.reduce((acc, v) => acc + Number(v || 0), 0);
  return +(sum / vals.length).toFixed(1);
};

window.formatGradeByScale = function (score, scale) {
  const s = Number(score);
  if (scale === "CGPA_10") {
    const cgpa = (s / 10).toFixed(2);
    let letter = "F";
    if (s >= 90) letter = "O";
    else if (s >= 80) letter = "A+";
    else if (s >= 70) letter = "A";
    else if (s >= 60) letter = "B+";
    else if (s >= 50) letter = "B";
    return { primary: `${cgpa} / 10`, numeric: cgpa, badge: letter, pass: s >= 50 };
  }
  if (scale === "GPA_4") {
    let gpa = "0.0";
    let letter = "F";
    if (s >= 90) { gpa = "4.0"; letter = "A"; }
    else if (s >= 80) { gpa = "3.5"; letter = "B+"; }
    else if (s >= 70) { gpa = "3.0"; letter = "B"; }
    else if (s >= 60) { gpa = "2.5"; letter = "C"; }
    else if (s >= 50) { gpa = "2.0"; letter = "D"; }
    return { primary: `${gpa} / 4.0`, numeric: gpa, badge: letter, pass: s >= 50 };
  }
  let level = "Needs Support";
  let badge = "L1";
  if (s >= 85) { level = "Mastery"; badge = "L4"; }
  else if (s >= 70) { level = "Proficient"; badge = "L3"; }
  else if (s >= 55) { level = "Developing"; badge = "L2"; }
  return { primary: level, numeric: badge, badge: badge, pass: s >= 55 };
};
