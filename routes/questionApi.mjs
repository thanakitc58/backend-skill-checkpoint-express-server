import express from "express";
import connectionPool from "../utils/db.mjs";

const router = express.Router();

//ผู้ใช้งานสามารถสร้างคำถามได้
router.post('/', async (req, res) => {
  const { title, description, category } = req.body;
  try {
      const query = 'INSERT INTO questions (title, description, category) VALUES ($1, $2, $3) RETURNING *';
      await connectionPool.query(query, [title, description, category]);
      
      res.status(201).json({ "message": "Question created successfully." });
  } catch (err) {
      res.status(400).json({ "message": "Invalid request data." });
  }
});

//ผู้ใช้งานสามารถดูคำถามทั้งหมดได้
router.get('/', async (req, res) => {
  try{
    const result = await connectionPool.query("SELECT * FROM questions");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({"message": "Unable to fetch questions."});
  }
});

//ผู้ใช้งานสามารถที่จะค้นหาคำถามจากหัวข้อ หรือหมวดหมู่ได้
router.get('/search', async (req, res) => {
  const { title, category } = req.query;

  if (!title && !category) {
    return res.status(400).json({ message: "Invalid search parameters." });
  }

  try {
    let query = "SELECT id, title, description, category FROM questions WHERE 1=1";
    const values = [];
    let paramIndex = 1;

    if (title) {
      query += ` AND title ILIKE $${paramIndex}`;
      values.push(`%${title}%`);
      paramIndex++;
    }
    if (category) {
      query += ` AND category ILIKE $${paramIndex}`;
      values.push(`%${category}%`);
    }

    const result = await connectionPool.query(query, values);
    res.status(200).json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ message: "Unable to search questions." });
  }
});

//ผู้ใช้งานสามารถดูคำถามเฉพาะได้
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try{
    const result = await connectionPool.query("SELECT * FROM questions WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ "message": "Question not found." });
    }
    res.status(200).json({ "data": result.rows[0] });
  } catch (err) {
    res.status(500).json({"message": "Unable to fetch question."});
  }
});

//ผู้ใช้งานสามารถแก้ไขคำถามได้
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, category } = req.body;
  try {
      const result = await connectionPool.query(
          'UPDATE questions SET title = $1, description = $2, category = $3 WHERE id = $4 RETURNING *',
          [title, description, category, id]
      );
      if (result.rows.length === 0) {
          return res.status(404).json({ "message": "Question not found." });
      }
      res.status(200).json({ "message": "Question updated successfully." });
  } catch (err) {
      res.status(400).json({ "message": "Invalid request data." });
  }
});

//ผู้ใช้งานสามารถลบคำถามได้
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const result = await connectionPool.query('DELETE FROM questions WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
          return res.status(404).json({ "message": "Question not found." });
      }
      res.status(200).json({ "message": "Question post has been deleted successfully." });
  } catch (err) {
      res.status(500).json({ "message": "Unable to delete question." });
  }
});





export default router;
