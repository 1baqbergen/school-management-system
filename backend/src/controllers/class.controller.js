
// C:\school-system\backend\src\controllers\class.controller.js
const ClassModel = require("../models/class.model");

const ClassController = {
  createClass: async (req, res) => {
    try {
      const { grade, letter, class_teacher_id } = req.body;

      if (!grade || !letter) {
        return res.status(400).json({
          message: "Grade және letter міндетті"
        });
      }

      const name = `${grade}${letter}`;

      const newClass = await ClassModel.createClass(
        name,
        grade,
        letter,
        class_teacher_id
      );

      res.status(201).json({
        message: "Сынып сәтті құрылды",
        class: newClass
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Сынып құру кезінде қате"
      });
    }
  },

  getAllClasses: async (req, res) => {
    try {
      const classes = await ClassModel.getAllClasses();
      res.json(classes);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Сыныптарды алу кезінде қате"
      });
    }
  },

  // 🔥 Мұғалімнің өз сыныбын алу
  getTeacherClass: async (req, res) => {
    try {
      const teacherId = req.user.id; // teacher_id (users.id)
      const teacherClass = await ClassModel.getClassByTeacherId(teacherId);
      
      if (!teacherClass) {
        return res.status(404).json({
          message: "Сізге сынып тағайындалмаған"
        });
      }
      
      res.json([teacherClass]); // Массив қайтарамыз (getAll сияқты)
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Сыныпты алу кезінде қате"
      });
    }
  },

  updateClass: async (req, res) => {
    try {
      const { id } = req.params;
      const { grade, letter, class_teacher_id } = req.body;

      if (!grade || !letter) {
        return res.status(400).json({
          message: "Grade және letter міндетті"
        });
      }

      const updated = await ClassModel.updateClass(
        id,
        grade,
        letter,
        class_teacher_id
      );

      if (!updated) {
        return res.status(404).json({
          message: "Сынып табылмады"
        });
      }

      res.json({
        message: "Сынып жаңартылды",
        class: updated
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Жаңарту қатесі"
      });
    }
  },

  deleteClass: async (req, res) => {
    try {
      const { id } = req.params;

      await ClassModel.deleteClass(id);

      res.json({
        message: "Сынып өшірілді"
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Өшіру қатесі"
      });
    }
  },

  getClassStudents: async (req, res) => {
    try {
      const classId = req.params.id;
      const { start_date, end_date } = req.query;

      const students = await require("../models/student.model").getStudentsByClass(classId, start_date, end_date);

      res.json(students);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Сыныптағы оқушыларды алу қатесі" });
    }
  }
};

module.exports = ClassController;
