// backend/src/controllers/grade.controller.js
const GradeModel = require("../models/grade.model");
const TeacherSubjectModel = require("../models/teacherSubject.model");

function autoCommentByValue(value) {
  if (value >= 9) return "Өте жақсы жұмыс";
  if (value >= 7) return "Жақсы жұмыс";
  if (value >= 5) return "Қанағаттанарлық";
  if (value >= 3) return "Талпыну бар, бірақ толықтыру қажет";
  return "Қосымша дайындық қажет";
}

function parseGradeValue(raw) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return n;
}

const GradeController = {
  // ✅ POST /api/grades
  createGrade: async (req, res) => {
  try {
    let { student_id, subject_id, teacher_id, grade_value, grade_date, comment } = req.body;

    // ✅ grade_value: allow 0
    if (
      !student_id ||
      !subject_id ||
      grade_value === undefined ||
      grade_value === null ||
      !grade_date
    ) {
      return res.status(400).json({ message: "Барлық міндетті өрістерді толтырыңыз" });
    }

    const gv = parseGradeValue(grade_value);
    if (gv === null || gv < 0 || gv > 10) {
      return res.status(400).json({ message: "grade_value 0 мен 10 аралығында болуы керек" });
    }

    // ✅ teacher_id-ты рольге қарай анықтаймыз
    let finalTeacherId = null;

    if (req.user.role === "teacher") {
      if (!req.user.teacher_id) {
        return res.status(400).json({ message: "teacher_id табылмады (token payload тексеріңіз)" });
      }
      finalTeacherId = Number(req.user.teacher_id);

      // teacher тек өз пәніне ғана қояды
      const isAllowed = await TeacherSubjectModel.checkTeacherSubject(finalTeacherId, subject_id);
      if (!isAllowed) {
        return res.status(403).json({ message: "Сіз бұл пәнге баға қоя алмайсыз" });
      }
    } else {
      // admin/director міндетті түрде teacher_id жіберуі керек
      if (!teacher_id) {
        return res.status(400).json({ message: "teacher_id міндетті (admin/director үшін)" });
      }
      finalTeacherId = Number(teacher_id);
    }

    // ✅ Auto comment if empty
    const finalComment =
      comment && String(comment).trim().length > 0 ? String(comment).trim() : autoCommentByValue(gv);

    const grade = await GradeModel.createGrade(
      student_id,
      subject_id,
      finalTeacherId,
      gv,
      grade_date,
      finalComment
    );

    res.status(201).json({ message: "Баға сәтті қойылды", grade });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Баға қою қатесі" });
  }
},

  // ✅ GET /api/grades  (admin all, teacher own, student own)
  getGrades: async (req, res) => {
    try {
      const role = req.user.role;

      if (role === "admin" || role === "director") {
        const rows = await GradeModel.getAllGrades();
        return res.json(rows);
      }

      if (role === "teacher") {
        if (!req.user.teacher_id) {
          return res.status(400).json({ message: "teacher_id табылмады (token/me payload тексеріңіз)" });
        }
        const rows = await GradeModel.getGradesByTeacher(req.user.teacher_id);
        return res.json(rows);
      }

      if (role === "student") {
        if (!req.user.student_id) {
          return res.status(400).json({ message: "student_id табылмады (token/me payload тексеріңіз)" });
        }
        const rows = await GradeModel.getGradesByStudent(req.user.student_id);
        return res.json(rows);
      }

      return res.status(403).json({ message: "Рұқсат жоқ" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Бағаларды алу қатесі" });
    }
  },
  getAllGrades: async (req, res) => {
    try {
      const grades = await GradeModel.getAllGrades();
      res.json(grades);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Бағаларды алу қатесі" });
    }
  },
  
  getMyTeacherGrades: async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Тек teacher ғана" });
    }

    const teacher_id = req.user.teacher_id;
    const limit = req.query.limit ? Number(req.query.limit) : null;

    const grades = await GradeModel.getGradesByTeacher(teacher_id, limit);

    res.json(grades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Бағаларды алу қатесі" });
  }
},

  // ✅ GET /api/grades/student/:student_id (сақтаймыз)
  getStudentGrades: async (req, res) => {
    try {
      const { student_id } = req.params;

      if (req.user.role === "student") {
        if (Number(req.user.student_id) !== Number(student_id)) {
          return res.status(403).json({ message: "Сіз тек өз бағаларыңызды ғана көре аласыз" });
        }
      }

      const grades = await GradeModel.getGradesByStudent(student_id);
      res.json(grades);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Бағаларды алу қатесі" });
    }
  },

  getMeta: async (req, res) => {
  try {
    const role = req.user.role;

    const students = await GradeModel.getStudentsForMeta();

    if (role === "teacher") {
      if (!req.user.teacher_id) {
        return res.status(400).json({ message: "teacher_id табылмады (token payload тексеріңіз)" });
      }

      // ✅ teacher пәндері ғана
      const subjects = await GradeModel.getSubjectsByTeacher(req.user.teacher_id);
      return res.json({ students, subjects });
    }

    // ✅ admin/director
    const teachers = await GradeModel.getTeachersForMeta();
    const subjects = await GradeModel.getAllSubjectsForMeta(); // admin-ға жалпы тізім (алғашқыда бос қылмай-ақ қой)
    return res.json({ students, subjects, teachers });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Meta алу қатесі" });
  }
},

getMetaByTeacher: async (req, res) => {
  try {
    const { teacher_id } = req.params;
    const subjects = await GradeModel.getSubjectsByTeacher(teacher_id);
    return res.json({ subjects });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Teacher meta алу қатесі" });
  }
},

  // ✅ PUT /api/grades/:id
  updateGrade: async (req, res) => {
    try {
      const { id } = req.params;
      const { grade_value, grade_date, comment } = req.body;

      if (grade_value === undefined || grade_value === null || !grade_date) {
        return res.status(400).json({ message: "grade_value және grade_date міндетті" });
      }

      const gv = parseGradeValue(grade_value);
      if (gv === null || gv < 0 || gv > 10) {
        return res.status(400).json({ message: "grade_value 0 мен 10 аралығында болуы керек" });
      }

      const existing = await GradeModel.getGradeById(id);
      if (!existing) return res.status(404).json({ message: "Баға табылмады" });

      // ✅ teacher тек өз бағасын өзгертсін
      if (req.user.role === "teacher") {
        if (Number(existing.teacher_id) !== Number(req.user.teacher_id)) {
          return res.status(403).json({ message: "Сіз өзіңіз қойған бағаларды ғана өзгерте аласыз" });
        }
      }

      const finalComment =
        comment && String(comment).trim().length > 0 ? String(comment).trim() : autoCommentByValue(gv);

      const updated = await GradeModel.updateGrade(id, gv, grade_date, finalComment);
      res.json({ message: "Баға жаңартылды", grade: updated });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Бағаны жаңарту қатесі" });
    }
  },

  // ✅ DELETE /api/grades/:id
  deleteGrade: async (req, res) => {
    try {
      const { id } = req.params;

      const existing = await GradeModel.getGradeById(id);
      if (!existing) return res.status(404).json({ message: "Баға табылмады" });

      // ✅ admin/director delete; (қаласаң teacher own delete қосып берем)
      if (!(req.user.role === "admin" || req.user.role === "director")) {
        return res.status(403).json({ message: "Тек admin/delete рұқсат" });
      }

      await GradeModel.deleteGrade(id);
      res.json({ message: "Баға өшірілді" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Бағаны өшіру қатесі" });
    }
  },
};

module.exports = GradeController;