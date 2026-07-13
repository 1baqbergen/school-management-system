const pool = require('../config/db');

class ParentModel {

  static async createParent(user_id, client = pool) {
    const result = await client.query(
      `INSERT INTO parents (user_id) VALUES ($1) RETURNING *`,
      [user_id]
    );
    return result.rows[0];
  }

  static async getParentByUserId(user_id) {
    const result = await pool.query(
      `SELECT * FROM parents WHERE user_id = $1 LIMIT 1`,
      [user_id]
    );
    return result.rows[0];
  }

  static async getParentById(parent_id) {
    const result = await pool.query(
      `SELECT * FROM parents WHERE id = $1 LIMIT 1`,
      [parent_id]
    );
    return result.rows[0];
  }

  static async getAllParents() {
    const result = await pool.query(`
      SELECT
        p.id AS parent_id,
        u.id AS user_id,
        u.full_name,
        u.email,
        u.phone,
        u.is_active,
        p.created_at
      FROM parents p
      JOIN users u ON p.user_id = u.id
      ORDER BY u.full_name ASC
    `);
    return result.rows;
  }

  static async getParentProfile(parent_id) {
    const result = await pool.query(`
      SELECT
        p.id AS parent_id,
        u.full_name,
        u.email,
        u.phone,
        u.bio,
        u.avatar_url,
        u.is_active
      FROM parents p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
      LIMIT 1
    `, [parent_id]);

    return result.rows[0];
  }

  static async getChildrenByParent(parent_id) {
    const result = await pool.query(`
      SELECT
        s.id AS student_id,
        u.full_name AS student_name,
        CONCAT(c.grade, c.letter) AS class_name
      FROM parent_students ps
      JOIN students s ON ps.student_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN classes c ON s.class_id = c.id
      WHERE ps.parent_id = $1
    `, [parent_id]);

    return result.rows;
  }

  static async checkParentStudentRelation(parent_id, student_id) {
    const result = await pool.query(`
      SELECT 1 FROM parent_students
      WHERE parent_id = $1 AND student_id = $2
    `, [parent_id, student_id]);

    return result.rows.length > 0;
  }

  static async assignStudentToParent(parent_id, student_id) {
    const exists = await this.checkParentStudentRelation(parent_id, student_id);
    if (exists) return null;

    const result = await pool.query(`
      INSERT INTO parent_students (parent_id, student_id)
      VALUES ($1, $2)
      RETURNING *
    `, [parent_id, student_id]);

    return result.rows[0];
  }

  static async removeStudentFromParent(parent_id, student_id) {
    const result = await pool.query(`
      DELETE FROM parent_students
      WHERE parent_id = $1 AND student_id = $2
      RETURNING *
    `, [parent_id, student_id]);

    return result.rows[0];
  }

  static async getChildGrades(student_id) {
    const result = await pool.query(`
      SELECT
        g.grade_value,
        g.grade_date,
        sub.name AS subject_name
      FROM grades g
      JOIN subjects sub ON g.subject_id = sub.id
      WHERE g.student_id = $1
      ORDER BY g.grade_date DESC
    `, [student_id]);

    return result.rows;
  }

  static async getChildSchedule(student_id) {
    const result = await pool.query(`
      SELECT
        sch.day_of_week,
        sch.lesson_number,
        sub.name AS subject_name
      FROM students s
      JOIN classes c ON s.class_id = c.id
      JOIN schedules sch ON sch.class_id = c.id
      JOIN subjects sub ON sch.subject_id = sub.id
      WHERE s.id = $1
    `, [student_id]);

    return result.rows;
  }

  static async deleteParent(parent_id) {
    await pool.query(`DELETE FROM parent_students WHERE parent_id = $1`, [parent_id]);

    const result = await pool.query(`
      DELETE FROM parents WHERE id = $1 RETURNING *
    `, [parent_id]);

    return result.rows[0];
  }
}

module.exports = ParentModel;