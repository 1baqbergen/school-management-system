require("dotenv").config();
const app = require("./app");
const pool = require("./db");
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("База дайын");
    app.listen(PORT, () => {
      console.log(`Сервер іске қосылды: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Сервер немесе база қатесі:", error);
  }
};
startServer();
