import swaggerJsdoc from "swagger-jsdoc";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : `http://localhost:${process.env.PORT || 4000}`;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Quora-like Q&A API",
      version: "1.0.0",
      description: "RESTful API for question-and-answer platform with voting system",
    },
    servers: [
      { url: "http://localhost:4000", description: "Local development" },
      { url: baseUrl, description: process.env.VERCEL ? "Vercel" : "Current" },
    ],
    components: {
      schemas: {
        Question: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            title: { type: "string", example: "What is the capital of France?" },
            description: { type: "string", example: "A geography question." },
            category: { type: "string", example: "Geography" },
          },
        },
        CreateQuestion: {
          type: "object",
          required: ["title", "description", "category"],
          properties: {
            title: { type: "string", maxLength: 255 },
            description: { type: "string" },
            category: { type: "string", maxLength: 255 },
          },
        },
        Answer: {
          type: "object",
          properties: {
            id: { type: "integer" },
            content: { type: "string", maxLength: 300 },
          },
        },
        CreateAnswer: {
          type: "object",
          required: ["content"],
          properties: {
            content: { type: "string", maxLength: 300 },
          },
        },
        Vote: {
          type: "object",
          required: ["vote"],
          properties: {
            vote: { type: "integer", enum: [1, -1], description: "1 = upvote, -1 = downvote" },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    paths: {
      "/questions": {
        get: {
          summary: "Get all questions",
          tags: ["Questions"],
          responses: {
            200: { description: "List of questions" },
            500: { description: "Server error", schema: { $ref: "#/components/schemas/Error" } },
          },
        },
        post: {
          summary: "Create a question",
          tags: ["Questions"],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/CreateQuestion" } },
            },
          },
          responses: {
            201: { description: "Question created successfully" },
            400: { description: "Invalid request data", schema: { $ref: "#/components/schemas/Error" } },
          },
        },
      },
      "/questions/search": {
        get: {
          summary: "Search questions by title or category",
          tags: ["Questions"],
          parameters: [
            { name: "title", in: "query", schema: { type: "string" } },
            { name: "category", in: "query", schema: { type: "string" } },
          ],
          responses: {
            200: { description: "Search results", schema: { type: "object", properties: { data: { type: "array" } } } },
            400: { description: "Invalid search parameters", schema: { $ref: "#/components/schemas/Error" } },
          },
        },
      },
      "/questions/{id}": {
        get: {
          summary: "Get question by ID",
          tags: ["Questions"],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: {
            200: { description: "Question details", schema: { type: "object", properties: { data: { $ref: "#/components/schemas/Question" } } } },
            404: { description: "Question not found", schema: { $ref: "#/components/schemas/Error" } },
          },
        },
        put: {
          summary: "Update a question",
          tags: ["Questions"],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/CreateQuestion" } },
            },
          },
          responses: {
            200: { description: "Question updated successfully" },
            400: { description: "Invalid request data", schema: { $ref: "#/components/schemas/Error" } },
            404: { description: "Question not found", schema: { $ref: "#/components/schemas/Error" } },
          },
        },
        delete: {
          summary: "Delete a question (cascade: answers and votes)",
          tags: ["Questions"],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: {
            200: { description: "Question deleted successfully" },
            404: { description: "Question not found", schema: { $ref: "#/components/schemas/Error" } },
          },
        },
      },
      "/questions/{questionId}/answers": {
        get: {
          summary: "Get answers for a question",
          tags: ["Answers"],
          parameters: [{ name: "questionId", in: "path", required: true, schema: { type: "integer" } }],
          responses: {
            200: { description: "List of answers", schema: { type: "object", properties: { data: { type: "array" } } } },
            404: { description: "Question not found", schema: { $ref: "#/components/schemas/Error" } },
          },
        },
        post: {
          summary: "Create an answer (max 300 characters)",
          tags: ["Answers"],
          parameters: [{ name: "questionId", in: "path", required: true, schema: { type: "integer" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/CreateAnswer" } },
            },
          },
          responses: {
            201: { description: "Answer created successfully" },
            400: { description: "Invalid request data", schema: { $ref: "#/components/schemas/Error" } },
            404: { description: "Question not found", schema: { $ref: "#/components/schemas/Error" } },
          },
        },
        delete: {
          summary: "Delete all answers for a question",
          tags: ["Answers"],
          parameters: [{ name: "questionId", in: "path", required: true, schema: { type: "integer" } }],
          responses: {
            200: { description: "All answers deleted successfully" },
            404: { description: "Question not found", schema: { $ref: "#/components/schemas/Error" } },
          },
        },
      },
      "/questions/{questionId}/vote": {
        post: {
          summary: "Vote on a question",
          tags: ["Votes"],
          parameters: [{ name: "questionId", in: "path", required: true, schema: { type: "integer" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Vote" } },
            },
          },
          responses: {
            200: { description: "Vote recorded successfully" },
            400: { description: "Invalid vote value", schema: { $ref: "#/components/schemas/Error" } },
            404: { description: "Question not found", schema: { $ref: "#/components/schemas/Error" } },
          },
        },
      },
      "/answers/{answerId}/vote": {
        post: {
          summary: "Vote on an answer",
          tags: ["Votes"],
          parameters: [{ name: "answerId", in: "path", required: true, schema: { type: "integer" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Vote" } },
            },
          },
          responses: {
            200: { description: "Vote recorded successfully" },
            400: { description: "Invalid vote value", schema: { $ref: "#/components/schemas/Error" } },
            404: { description: "Answer not found", schema: { $ref: "#/components/schemas/Error" } },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
