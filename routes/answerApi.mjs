import express from "express";
import connectionPool from "../utils/db.mjs";
import { validateCreateAnswer } from "../middleware/validateAnswer.mjs";
import { validateVote } from "../middleware/validateVote.mjs";
import { validateQuestionId, validateAnswerId } from "../middleware/validateParams.mjs";

const router = express.Router();

// Router สำหรับ answers ที่ nested ภายใต้ /questions
const questionAnswersRouter = express.Router();

//ผู้ใช้งานสามารถสร้างคำตอบของคำถามนั้นได้ (ไม่เกิน 300 ตัวอักษร)
questionAnswersRouter.post( "/:questionId/answers",validateQuestionId,validateCreateAnswer,async (req, res) => {
    const { questionId } = req.params;
    const { content } = req.body;
    try {
    const questionCheck = await connectionPool.query(
      "SELECT id FROM questions WHERE id = $1",
      [questionId]
    );
    if (questionCheck.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }
    const result = await connectionPool.query(
      "INSERT INTO answers (question_id, content) VALUES ($1, $2) RETURNING id, content",
      [questionId, content]
    );
    res.status(201).json({
      message: "Answer created successfully.",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ message: "Unable to create answer." });
  }
  }
);

//ผู้ใช้งานสามารถที่จะดูคำตอบของคำถามแต่ละอันได้
questionAnswersRouter.get("/:questionId/answers",validateQuestionId,  async (req, res) => {
    const { questionId } = req.params;
    try {
    const questionCheck = await connectionPool.query(
      "SELECT id FROM questions WHERE id = $1",
      [questionId]
    );
    if (questionCheck.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }
    const result = await connectionPool.query(
      "SELECT id, content FROM answers WHERE question_id = $1",
      [questionId]
    );
    res.status(200).json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ message: "Unable to fetch answers." });
  }
  }
);

//ผู้ใช้งานสามารถที่จะลบคำตอบของคำถามได้
questionAnswersRouter.delete( "/:questionId/answers",validateQuestionId, async (req, res) => {
    const { questionId } = req.params;
    try {
    const questionCheck = await connectionPool.query(
      "SELECT id FROM questions WHERE id = $1",
      [questionId]
    );
    if (questionCheck.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }
    await connectionPool.query("DELETE FROM answers WHERE question_id = $1", [
      questionId,
    ]);
    res.status(200).json({
      message: "All answers for the question have been deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({ message: "Unable to delete answers." });
  }
  }
);

// Router สำหรับ vote ที่ nested ภายใต้ /answers
//ผู้ใช้งานสามารถโหวตคำตอบได้
router.post( "/:answerId/vote",validateAnswerId,validateVote,async (req, res) => {
    const { answerId } = req.params;
    const { vote } = req.body;
    try {
    const answerCheck = await connectionPool.query(
      "SELECT id FROM answers WHERE id = $1",
      [answerId]
    );
    if (answerCheck.rows.length === 0) {
      return res.status(404).json({ message: "Answer not found." });
    }
    await connectionPool.query(
      "INSERT INTO answer_votes (answer_id, vote) VALUES ($1, $2)",
      [answerId, vote]
    );
    res
      .status(200)
      .json({ message: "Vote on the answer has been recorded successfully." });
  } catch (err) {
    res.status(500).json({ message: "Unable to vote answer." });
  }
  }
);

export default router;
export { questionAnswersRouter };
