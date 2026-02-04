// questionId (required, เป็นตัวเลข, มากกว่า 0)
export const validateQuestionId = (req, res, next) => {
  const questionId = parseInt(req.params.questionId, 10);
  if (isNaN(questionId) || questionId < 1) {
    return res.status(400).json({ message: "Invalid question ID." });
  }
  next();
};

// answerId (required, เป็นตัวเลข, มากกว่า 0)
export const validateAnswerId = (req, res, next) => {
  const answerId = parseInt(req.params.answerId, 10);
  if (isNaN(answerId) || answerId < 1) {
    return res.status(400).json({ message: "Invalid answer ID." });
  }
  next();
};
  
// id (required, เป็นตัวเลข, มากกว่า 0)
export const validateId = (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id < 1) {
    return res.status(400).json({ message: "Invalid ID." });
  }
  next();
};
