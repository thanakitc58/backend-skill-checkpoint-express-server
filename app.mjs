import express from "express";
import questionApi from "./routes/questionApi.mjs";
import answerApi, { questionAnswersRouter } from "./routes/answerApi.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.use("/questions", questionApi);
app.use("/questions", questionAnswersRouter);
app.use("/answers", answerApi);




  app.listen(port, () => {
    console.log(`Server is running at ${port}`);
  });

