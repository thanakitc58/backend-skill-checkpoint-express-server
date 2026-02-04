import "dotenv/config";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.config.mjs";
import questionApi from "./routes/questionApi.mjs";
import answerApi, { questionAnswersRouter } from "./routes/answerApi.mjs";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/questions", questionApi);
app.use("/questions", questionAnswersRouter);
app.use("/answers", answerApi);

// Run server locally (skip on Vercel serverless)
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running at ${port}`);
    console.log(`Swagger docs: http://localhost:${port}/api-docs`);
  });
}

export default app;

