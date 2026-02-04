import "dotenv/config";
import express from "express";
import { swaggerSpec } from "./swagger.config.mjs";
import questionApi from "./routes/questionApi.mjs";
import answerApi, { questionAnswersRouter } from "./routes/answerApi.mjs";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// Swagger API Documentation (ใช้ CDN - รองรับทั้ง local และ Vercel)
const swaggerHtml = `
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      url: "/api-docs.json",
      dom_id: "#swagger-ui",
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
      ],
    });
  </script>
</body>
</html>
`;

app.get("/api-docs", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(swaggerHtml);
});
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

