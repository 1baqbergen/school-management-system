const ScheduleModel = require("../models/schedule.model");
const ClassModel = require("../models/class.model");
const TeacherModel = require("../models/teacher.model");
const SubjectModel = require("../models/subject.model");

const ScheduleController = {
  createSchedule: async (req, res) => {
    try {
      const {
        class_id,
        teacher_id,
        subject_id,
        day_of_week,
        lesson_number,
        start_time,
        end_time
      } = req.body;

      if (
        !class_id ||
        !teacher_id ||
        !subject_id ||
        !day_of_week ||
        !lesson_number ||
        !start_time ||
        !end_time
      ) {
        return res.status(400).json({ message: "Барлық өрістер міндетті" });
      }

      const schedule = await ScheduleModel.createSchedule(
        class_id,
        teacher_id,
        subject_id,
        day_of_week,
        lesson_number,
        start_time,
        end_time
      );

      res.status(201).json({
        message: "Сабақ кестеге қосылды",
        schedule
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Кесте қосу қатесі" });
    }
  },

  getAllSchedules: async (req, res) => {
    try {
      const data = await ScheduleModel.getAllSchedules();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Кестені алу қатесі" });
    }
  },

  // ✅ META: select үшін класстар/мұғалімдер/пәндер
  getScheduleMeta: async (req, res) => {
    try {
      const [classes, teachers, subjects] = await Promise.all([
        ClassModel.getAllClasses(),
        TeacherModel.getAllTeachers(),
        SubjectModel.getAllSubjects(),
      ]);

      res.json({
        classes: classes.map(c => ({ id: c.id, name: c.name })),
        teachers: teachers.map(t => ({ id: t.id, full_name: t.full_name })),
        subjects: subjects.map(s => ({ id: s.id, name: s.name })),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Meta алу қатесі" });
    }
  },

  // ✅ UPDATE
  updateSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        class_id,
        teacher_id,
        subject_id,
        day_of_week,
        lesson_number,
        start_time,
        end_time
      } = req.body;

      const updated = await ScheduleModel.updateSchedule(
        Number(id),
        class_id,
        teacher_id,
        subject_id,
        day_of_week,
        lesson_number,
        start_time,
        end_time
      );

      if (!updated) {
        return res.status(404).json({ message: "Кесте табылмады" });
      }

      res.json({ message: "Кесте жаңартылды", schedule: updated });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Кестені жаңарту қатесі" });
    }
  },

  // ✅ DELETE
  deleteSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      await ScheduleModel.deleteSchedule(Number(id));
      res.json({ message: "Кесте өшірілді" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Кестені өшіру қатесі" });
    }
  },
  getMyStudentSchedule: async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Тек студентке арналған" });
    }

    const student_id = req.user.student_id;
    const { day } = req.query;

    const data = await ScheduleModel.getStudentSchedule(student_id, day);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Кесте алу қатесі" });
  }
},
  getMySchedule: async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Тек мұғалімге арналған" });
    }

    const teacher_id = req.user.teacher_id;
    const { day } = req.query;

    const data = await ScheduleModel.getTeacherSchedule(teacher_id, day);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Кесте алу қатесі" });
  }
}
};

module.exports = ScheduleController;