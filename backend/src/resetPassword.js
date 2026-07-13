const bcrypt = require("bcrypt");
const pool = require("./config/db"); // сенің db конфиг файлыңның жолы

async function resetTeacherPassword(email, newPassword) {
  try {
    // Жаңа парольді hash ету
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Парольді PostgreSQL-де жаңарту
    const result = await pool.query(
      `UPDATE users
       SET password = $1
       WHERE email = $2
       RETURNING id, full_name, email`,
      [hashedPassword, email]
    );

    if (result.rows.length === 0) {
      console.log("Мұндай email табылмады");
      return;
    }

    console.log("Пароль сәтті өзгертілді:", result.rows[0]);
  } catch (err) {
    console.error("Пароль өзгерту қатесі:", err);
  } finally {
    pool.end();
  }
}

// Тікелей шақыру
resetTeacherPassword("student1@school.kz", "123456");
