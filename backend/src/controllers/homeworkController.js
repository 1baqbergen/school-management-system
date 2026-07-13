const HomeworkModel = require("../models/homeworkModel");
const TeacherSubjectModel = require("../models/teacherSubject.model");

const HomeworkController = {
  // ✅ CREATE
  createHomework: async (req, res) => {
    try {
      let { title, description, class_id, subject_id, teacher_id, due_date } = req.body;

      if (!title || !class_id || !subject_id || !due_date) {
        return res.status(400).json({ message: "Міндетті өрістер толтырылмады" });
      }

      let finalTeacherId = null;

      if (req.user.role === "teacher") {
        finalTeacherId = req.user.teacher_id;

        const isAllowed = await TeacherSubjectModel.checkTeacherSubject(
          finalTeacherId,
          subject_id
        );

        if (!isAllowed) {
          return res.status(403).json({ message: "Сіз бұл пәнге үй жұмысы бере алмайсыз" });
        }
      } else {
        if (!teacher_id) {
          return res.status(400).json({ message: "teacher_id міндетті" });
        }
        finalTeacherId = teacher_id;
      }

      const homework = await HomeworkModel.createHomework(
        title,
        description,
        class_id,
        subject_id,
        finalTeacherId,
        due_date
      );

      res.status(201).json({ message: "Үй жұмысы құрылды", homework });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Қате" });
    }
  },

  // ✅ GET (role-based)
  getHomeworks: async (req, res) => {
    try {
      const role = req.user.role;

      if (role === "admin" || role === "director") {
        return res.json(await HomeworkModel.getAllHomeworks());
      }

      if (role === "teacher") {
        return res.json(
          await HomeworkModel.getHomeworksByTeacher(req.user.teacher_id)
        );
      }

      if (role === "student") {
        return res.json(
          await HomeworkModel.getHomeworksByClass(req.user.class_id)
        );
      }

      return res.status(403).json({ message: "Рұқсат жоқ" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Қате" });
    }
  },
  getMeta: async (req, res) => {
  try {
    let subjects = [];
    let classes = [];

    // ✅ Classes бәріне бірдей
    const classesRes = await require("../config/db").query(`
      SELECT id, (grade::text || letter::text) AS name FROM classes
    `);
    classes = classesRes.rows;

    // ✅ Subjects role бойынша
    if (req.user.role === "teacher") {
      const result = await require("../config/db").query(`
        SELECT s.id, s.name
        FROM teacher_subjects ts
        JOIN subjects s ON ts.subject_id = s.id
        WHERE ts.teacher_id = $1
      `, [req.user.teacher_id]);

      subjects = result.rows;
    } else {
      const result = await require("../config/db").query(`
        SELECT id, name FROM subjects
      `);
      subjects = result.rows;
    }

    res.json({ classes, subjects });

  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Қате" });
  }
},

  deleteHomework: async (req, res) => {
  try {
    const { id } = req.params;

    const hw = await HomeworkModel.getHomeworkById(id);
    if (!hw) return res.status(404).json({ message: "Табылмады" });

    // ✅ ADMIN / DIRECTOR
    if (req.user.role === "admin" || req.user.role === "director") {
      await HomeworkModel.deleteHomework(id);
      return res.json({ message: "Өшірілді" });
    }

    // ✅ TEACHER (тек өзінікі)
    if (req.user.role === "teacher") {
      if (hw.teacher_id !== req.user.teacher_id) {
        return res.status(403).json({ message: "Бұл сіздің homework емес" });
      }

      await HomeworkModel.deleteHomework(id);
      return res.json({ message: "Өшірілді" });
    }

    return res.status(403).json({ message: "Рұқсат жоқ" });

  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Қате" });
  }
}
};

module.exports = HomeworkController;