// title (required, ไม่ว่าง, ไม่เกิน 255 ตัวอักษร)
// description (required, ไม่ว่าง, ไม่เกิน 300 ตัวอักษร)
// category (required, ไม่ว่าง, ไม่เกิน 255 ตัวอักษร)
export const validateCreateQuestion = (req, res, next) => {
  const { title, description, category } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ message: "Title is required." });
  }
  if (title.trim().length === 0) {
    return res.status(400).json({ message: "Title cannot be empty." });
  }
  if (title.length > 255) {
    return res.status(400).json({
      message: "Title must not exceed 255 characters.",
    });
  }

  if (!description || typeof description !== "string") {
    return res.status(400).json({ message: "Description is required." });
  }
  if (description.trim().length === 0) {
    return res.status(400).json({ message: "Description cannot be empty." });
  }

  if (!category || typeof category !== "string") {
    return res.status(400).json({ message: "Category is required." });
  }
  if (category.trim().length === 0) {
    return res.status(400).json({ message: "Category cannot be empty." });
  }
  if (category.length > 255) {
    return res.status(400).json({
      message: "Category must not exceed 255 characters.",
    });
  }

  next();
};
  
// title (required, ไม่ว่าง, ไม่เกิน 255 ตัวอักษร)
// description (required, ไม่ว่าง, ไม่เกิน 300 ตัวอักษร)
// category (required, ไม่ว่าง, ไม่เกิน 255 ตัวอักษร)
export const validateUpdateQuestion = (req, res, next) => {
  const { title, description, category } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ message: "Title is required." });
  }
  if (title.trim().length === 0) {
    return res.status(400).json({ message: "Title cannot be empty." });
  }
  if (title.length > 255) {
    return res.status(400).json({
      message: "Title must not exceed 255 characters.",
    });
  }

  if (!description || typeof description !== "string") {
    return res.status(400).json({ message: "Description is required." });
  }
  if (description.trim().length === 0) {
    return res.status(400).json({ message: "Description cannot be empty." });
  }

  if (!category || typeof category !== "string") {
    return res.status(400).json({ message: "Category is required." });
  }
  if (category.trim().length === 0) {
    return res.status(400).json({ message: "Category cannot be empty." });
  }
  if (category.length > 255) {
    return res.status(400).json({
      message: "Category must not exceed 255 characters.",
    });
  }

  next();
};
  
// title (optional, ไม่ว่าง, ไม่เกิน 255 ตัวอักษร)
// category (optional, ไม่ว่าง, ไม่เกิน 255 ตัวอักษร)
export const validateSearchParams = (req, res, next) => {
  const { title, category } = req.query;
  if (!title && !category) {
    return res.status(400).json({ message: "Invalid search parameters." });
  }
  next();
};
