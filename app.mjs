import express from "express";
import questionApi from "./routes/questionApi.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.use("/questions", questionApi);




  app.listen(port, () => {
    console.log(`Server is running at ${port}`);
  });

