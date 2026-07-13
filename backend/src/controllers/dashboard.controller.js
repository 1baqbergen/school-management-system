const DashboardModel = require("../models/dashboard.model");

const DashboardController = {

  // 🔹 GET /api/dashboard/stats
  getStats: async (req, res) => {
    try {
      const data = await DashboardModel.getStats();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Статистика алу қатесі" });
    }
  },

  // 🔹 GET /api/dashboard/top-students
  getTopStudents: async (req, res) => {
    try {
      const data = await DashboardModel.getTopStudents();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "ТОП студенттер қатесі" });
    }
  },

  // 🔹 GET /api/dashboard/weak-students
  getWeakStudents: async (req, res) => {
    try {
      const data = await DashboardModel.getWeakStudents();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Әлсіз студенттер қатесі" });
    }
  },

  // 🔹 GET /api/dashboard/grade-dynamics
  getGradeDynamics: async (req, res) => {
    try {
      const data = await DashboardModel.getGradeDynamics();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "График қатесі" });
    }
  },

  // 🔹 GET /api/dashboard/subject-stats
  getSubjectStats: async (req, res) => {
    try {
      const data = await DashboardModel.getSubjectStats();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Пән статистикасы қатесі" });
    }
  }

};

module.exports = DashboardController;