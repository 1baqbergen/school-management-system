const SubjectModel = require("../models/subject.model");

const SubjectController = {
  createSubject: async (req, res) => {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({
          message: "Пән атауы міндетті"
        });
      }

      const subject = await SubjectModel.createSubject(name);

      res.status(201).json({
        message: "Пән сәтті қосылды",
        subject
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Пән қосу қатесі"
      });
    }
  },

  getAllSubjects: async (req, res) => {
    try {
      const subjects = await SubjectModel.getAllSubjects();
      res.json(subjects);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Пәндерді алу қатесі"
      });
    }
  },

  updateSubject: async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Пән атауы міндетті" });
    }

    const subject = await SubjectModel.updateSubject(id, name);

    if (!subject) {
      return res.status(404).json({ message: "Пән табылмады" });
    }

    res.json({
      message: "Пән жаңартылды",
      subject
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Жаңарту қатесі" });
  }
},

deleteSubject: async (req, res) => {
  try {
    const { id } = req.params;

    await SubjectModel.deleteSubject(id);

    res.json({ message: "Пән өшірілді" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Өшіру қатесі" });
  }
}

};

module.exports = SubjectController;
