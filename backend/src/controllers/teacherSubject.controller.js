const TeacherSubjectModel = require("../models/teacherSubject.model");

const TeacherSubjectController = {
  assignSubject: async (req, res) => {
    try {
      const { teacher_id, subject_id } = req.body;

      if (!teacher_id || !subject_id) {
        return res.status(400).json({
          message: "teacher_id және subject_id міндетті"
        });
      }

      const exists = await TeacherSubjectModel.checkTeacherSubject(
        teacher_id,subject_id);
      if (exists) {
        return res.status(400).json({
          message: "Бұл пән осы мұғалімге бұрыннан бекітілген"
        });
      }

      const result = await TeacherSubjectModel.assignSubject(
        teacher_id,
        subject_id
      );

      res.status(201).json({
        message: "Пән мұғалімге бекітілді",
        data: result
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Пән бекіту қатесі"
      });
    }
  },



  getMySubjects: async (req, res) => {
  try {
    if (!req.user.teacher_id) {
      return res.status(400).json({
        message: "teacher_id табылмады"
      });
    }

    const teacher_id = req.user.teacher_id;

    const data = await TeacherSubjectModel.getSubjectsByTeacher(teacher_id);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Өз пәндерін алу қатесі"
    });
  }
},


  getAll: async (req, res) => {
    try {
      const data = await TeacherSubjectModel.getTeacherSubjects();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Деректерді алу қатесі"
      });
    }
  },
  deleteAssignment: async (req, res) => {
  try {
    const { id } = req.params;

    await TeacherSubjectModel.deleteAssignment(id);

    res.json({
      message: "Бекіту жойылды"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Жою қатесі"
    });
  }
},
};

module.exports = TeacherSubjectController;
