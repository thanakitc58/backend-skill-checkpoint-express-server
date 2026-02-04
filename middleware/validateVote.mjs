// vote (required, เป็นตัวเลข, มากกว่า 0)
export const validateVote = (req, res, next) => {
  const { vote } = req.body;

  if (vote === undefined || vote === null) {
    return res.status(400).json({ message: "Vote is required." });
  }
  if (typeof vote !== "number") {
    return res.status(400).json({ message: "Vote must be a number." });
  }
  if (vote !== 1 && vote !== -1) {
    return res.status(400).json({ message: "Invalid vote value." });
  }

  next();
};
