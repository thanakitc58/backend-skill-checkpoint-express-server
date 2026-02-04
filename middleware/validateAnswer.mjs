// content (required, ไม่ว่าง, ไม่เกิน 300 ตัวอักษร)
export const validateCreateAnswer = (req, res, next) => {
  const { content } = req.body;

  if (!content || typeof content !== "string") {
    return res.status(400).json({ message: "Content is required." });
  }
  if (content.trim().length === 0) {
    return res.status(400).json({ message: "Content cannot be empty." });
  }
  if (content.length > 300) {
    return res.status(400).json({
      message: "Answer content must not exceed 300 characters.",
    });
  }

  next();
};
