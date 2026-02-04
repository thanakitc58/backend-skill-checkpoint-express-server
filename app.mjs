import "dotenv/config";
import express from "express";
import questionApi from "./routes/questionApi.mjs";
import answerApi, { questionAnswersRouter } from "./routes/answerApi.mjs";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.use("/questions", questionApi);
app.use("/questions", questionAnswersRouter);
app.use("/answers", answerApi);

// Run server locally (skip on Vercel serverless)
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running at ${port}`);
  });
}

export default app;

