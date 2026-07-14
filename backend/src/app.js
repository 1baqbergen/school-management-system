const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

const adminRoutes = require('./routes/admin.routes');
const classRoutes = require("./routes/class.routes");
const studentRoutes = require("./routes/student.routes");
const teacherRoutes = require("./routes/teacher.routes");
const subjectRoutes = require("./routes/subject.routes");
const teacherSubjectRoutes = require("./routes/teacherSubject.routes");
const scheduleRoutes = require("./routes/schedule.routes");
const gradeRoutes = require("./routes/grade.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const homeworkRoutes = require("./routes/homeworkRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const aiRoutes = require("./ai/ai.routes");
const parentRoutes = require('./routes/parent.routes');

//app.use(cors());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://school-management-system-bice-seven.vercel.app"
  ],
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/students", studentRoutes); 
app.use("/api/teachers", teacherRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/teacher-subjects", teacherSubjectRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/homeworks", homeworkRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/ai", aiRoutes);
app.use('/api/profile', require('./routes/profile.routes'));
app.use('/api/parents', parentRoutes);
app.use('/uploads', express.static('uploads'));
app.get("/", (req, res) => {
  res.json({ message: "School System Backend жұмыс істеп тұр" });
});

module.exports = app;
