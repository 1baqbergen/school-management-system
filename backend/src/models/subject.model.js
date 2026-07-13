const pool = require("../config/db");

const SubjectModel = {
  createSubject: async (name) => {
    const result = await pool.query(
      `INSERT INTO subjects (name)
       VALUES ($1)
       RETURNING *`,
      [name]
    );
    return result.rows[0];
  },

  getAllSubjects: async () => {
    const result = await pool.query(
      `SELECT * FROM subjects ORDER BY name`
    );
    return result.rows;
  },
  updateSubject: async (id, name) => {
  const result = await pool.query(
    `UPDATE subjects
     SET name = $1
     WHERE id = $2
     RETURNING *`,
    [name, id]
  );
  return result.rows[0];
},

deleteSubject: async (id) => {
  await pool.query(
    `DELETE FROM subjects WHERE id = $1`,
    [id]
  );
}
};

module.exports = SubjectModel;
