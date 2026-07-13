const SubmissionModel = require("../models/submissionModel");
const HomeworkModel = require("../models/homeworkModel");
const pool = require("../config/db");
const GradeModel = require("../models/grade.model");
const SubmissionController = {
  // ✅ STUDENT submit
  submitHomework: async (req, res) => {
  try {
    const { homework_id, content, file_url } = req.body;

    // ❗ 1. homework_id тексеру
    if (!homework_id) {
      return res.status(400).json({ message: "homework_id міндетті" });
    }

    // ❗ 2. content бос болмау
    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Мәтін бос болмауы керек" });
    }

    // ❗ 3. Homework бар ма
    const hw = await HomeworkModel.getHomeworkById(homework_id);
    if (!hw) {
      return res.status(404).json({ message: "Homework табылмады" });
    }

    // ❗ 4. Бұл student-ке тиесілі ме
    if (hw.class_id !== req.user.class_id) {
      return res.status(403).json({ message: "Бұл үй жұмысы сізге арналмаған" });
    }

    // ❗ 5. Deadline тексеру
    if (new Date() > new Date(hw.due_date)) {
      return res.status(400).json({ message: "Deadline өтіп кетті" });
    }

    // ❗ 6. Бұрын жіберген бе
    const existing = await pool.query(
      `SELECT * FROM homework_submissions 
       WHERE homework_id = $1 AND student_id = $2`,
      [homework_id, req.user.student_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Сіз бұл жұмысты бұрын жібергенсіз" });
    }

    // ✅ SUBMIT
    const submission = await SubmissionModel.submitHomework(
      homework_id,
      req.user.student_id,
      content,
      file_url
    );

    res.status(201).json({ message: "Жіберілді", submission });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Қате" });
  }
},

  // ✅ TEACHER
  getSubmissions: async (req, res) => {
    try {
      const { homework_id } = req.query;
      if (!homework_id) {
        return res.status(400).json({ message: "homework_id міндетті" });
      }
      // ❗ Homework тексеру
const hw = await HomeworkModel.getHomeworkById(homework_id);

if (!hw) {
  return res.status(404).json({ message: "Homework табылмады" });
}

// ❗ тек өз homework
if (hw.teacher_id !== req.user.teacher_id) {
  return res.status(403).json({ message: "Рұқсат жоқ" });
}

      const data = await SubmissionModel.getSubmissionsByHomework(homework_id);
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: "Қате" });
    }
  },

  // ✅ STUDENT own
  getMySubmissions: async (req, res) => {
    try {
      const data = await SubmissionModel.getMySubmissions(req.user.student_id);
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: "Қате" });
    }
  },

  // ✅ GRADE
  gradeSubmission: async (req, res) => {
    try {
      const { id } = req.params;
      const { grade, comment } = req.body;

      // 1. Submission update
      const updated = await SubmissionModel.gradeSubmission(id, grade, comment);

      if (!updated) {
        return res.status(404).json({ message: "Submission табылмады" });
      }

      // 2. Submission толық ақпарат алу
      const submission = await SubmissionModel.getSubmissionById(id);

if (!submission) {
  return res.status(404).json({ message: "Submission табылмады" });
}

// 🔥 OWNER CHECK
const hw = await HomeworkModel.getHomeworkById(submission.homework_id);

if (hw.teacher_id !== req.user.teacher_id) {
  return res.status(403).json({ message: "Сіз тек өз homework-ыңызды бағалай аласыз" });
}

      // 3. Grades table-ға жазу 🔥
      await GradeModel.createGrade(
        submission.student_id,
        submission.subject_id,
        req.user.teacher_id,
        grade,
        new Date(),
        comment || null
      );

      res.json({ message: "Бағаланды және grades-ке сақталды", updated });

    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Қате" });
    }
  }
};

module.exports = SubmissionController;