const AIService = require("./ai.service");

const AIController = {

  askAI: async (req, res) => {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ message: "Сұрақ бос" });
      }

      const response = await AIService.handleQuestion(req.user, message, req.headers.authorization);

      res.json({ answer: response });

    } catch (err) {
      res.status(500).json({ message: "AI error" });
    }
  }

};

module.exports = AIController;