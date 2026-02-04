# Quora-like Q&A API Backend

RESTful API backend สำหรับแพลตฟอร์มถาม-ตอบ แบบคล้าย Quora สร้างด้วย Node.js และ Express รองรับ CRUD สำหรับคำถามและคำตอบ ระบบค้นหา และระบบโหวต

---

## รายละเอียดโปรเจกต์

### ทำอะไรได้บ้าง

API นี้รองรับการทำงานดังนี้:

- สร้าง อ่าน แก้ไข และลบคำถาม
- เพิ่มคำตอบให้คำถาม (มีจำกัดจำนวนตัวอักษร)
- ค้นหาคำถามจากหัวข้อหรือหมวดหมู่
- โหวตเห็นด้วย/ไม่เห็นด้วยกับคำถามและคำตอบ
- ลบคำถามพร้อมลบคำตอบและโหวตที่เกี่ยวข้องอัตโนมัติ (cascade delete)

### จุดประสงค์ของการพัฒนา

โปรเจกต์นี้ออกแบบเพื่อใช้เป็น backend skill checkpoint สำหรับแสดงให้เห็น:

- การออกแบบ RESTful API
- การออกแบบฐานข้อมูลและความสัมพันธ์ (relationships)
- การตรวจสอบข้อมูลนำเข้าและการจัดการ error
- การแยกส่วนโค้ด (routes, middleware, utilities)
- การใช้ transaction เพื่อความถูกต้องของข้อมูล

### แก้ปัญหาอะไร

เป็นฐานสำหรับแพลตฟอร์มชุมชนถาม-ตอบ ที่ผู้ใช้สามารถแชร์ความรู้ ถามคำถาม และมีส่วนร่วมผ่านคำตอบและโหวต

---

## ฟีเจอร์

| ฟีเจอร์ | รายละเอียด |
|---------|-------------|
| **จัดการคำถาม** | สร้าง อ่าน แก้ไข ลบคำถาม พร้อมหัวข้อ คำอธิบาย และหมวดหมู่ |
| **จัดการคำตอบ** | สร้าง ดู และลบคำตอบ (สูงสุด 300 ตัวอักษรต่อคำตอบ) |
| **ค้นหา** | ค้นหาคำถามจากหัวข้อหรือหมวดหมู่ (ไม่สนใจตัวพิมพ์) |
| **โหวต** | โหวตเห็นด้วย (+1) หรือไม่เห็นด้วย (-1) ทั้งคำถามและคำตอบ |
| **Cascade Delete** | ลบคำถามจะลบคำตอบและโหวตที่เกี่ยวข้องทั้งหมด |
| **Validation** | Middleware ตรวจสอบ body และ path parameters |
| **Error Handling** | ตอบกลับ error แบบสม่ำเสมอ พร้อม HTTP status ที่เหมาะสม |

---

## เทคโนโลยีที่ใช้

| เทคโนโลยี | การใช้งาน |
|-----------|-----------|
| **Node.js** | Runtime |
| **Express.js** | Web framework |
| **PostgreSQL** | ฐานข้อมูล |
| **pg** | PostgreSQL client สำหรับ Node.js |
| **Nodemon** | เซิร์ฟเวอร์สำหรับ development พร้อม auto-reload |

---

## การติดตั้งและตั้งค่า

### ความต้องการของระบบ

- Node.js (แนะนำ v18 ขึ้นไป)
- PostgreSQL (แนะนำ v12 ขึ้นไป)
- npm หรือ yarn

### ขั้นที่ 1: โคลน repository

```bash
git clone <repository-url>
cd backend-skill-checkpoint-express-server
```

### ขั้นที่ 2: ติดตั้ง dependencies

```bash
npm install
```

### ขั้นที่ 3: ตั้งค่าฐานข้อมูล

1. สร้างฐานข้อมูล PostgreSQL ชื่อ `Backend-Checkpoint-Quora` (หรือแก้ connection string ใน `utils/db.mjs`)
2. สร้างตาราง `questions`, `answers`, `question_votes`, และ `answer_votes`
3. ปรับการเชื่อมต่อใน `utils/db.mjs` ถ้าข้อมูลแตกต่างไป:

```javascript
// ค่าเริ่มต้น: postgresql://postgres:1234@localhost:5432/Backend-Checkpoint-Quora
```

### ขั้นที่ 4: รันเซิร์ฟเวอร์

```bash
npm run start
```

เซิร์ฟเวอร์จะรันที่ `http://localhost:4000`

---

## วิธีใช้งาน

### Base URL

```
http://localhost:4000
```

### Endpoint คำถาม

| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| POST | `/questions` | สร้างคำถาม |
| GET | `/questions` | ดึงคำถามทั้งหมด |
| GET | `/questions/search?title=...&category=...` | ค้นหาคำถาม |
| GET | `/questions/:id` | ดึงคำถามตาม ID |
| PUT | `/questions/:id` | แก้ไขคำถาม |
| DELETE | `/questions/:id` | ลบคำถาม (cascade) |
| POST | `/questions/:questionId/vote` | โหวตคำถาม |

### Endpoint คำตอบ

| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| POST | `/questions/:questionId/answers` | สร้างคำตอบ |
| GET | `/questions/:questionId/answers` | ดึงคำตอบของคำถาม |
| DELETE | `/questions/:questionId/answers` | ลบคำตอบทั้งหมดของคำถาม |
| POST | `/answers/:answerId/vote` | โหวตคำตอบ |

### ตัวอย่างการเรียกใช้

**สร้างคำถาม**

```http
POST http://localhost:4000/questions


{
  "title": "What is the capital of France?",
  "description": "A geography question about European capitals.",
  "category": "Geography"
}
```

**สร้างคำตอบ**

```http
POST http://localhost:4000/questions/1/answers


{
  "content": "The capital of France is Paris."
}
```

**โหวตคำถาม**

```http
POST http://localhost:4000/questions/1/vote

{
  "vote": 1
}
```

**ค้นหาคำถาม**

```http
GET http://localhost:4000/questions/search?category=Geography
```

---

## โครงสร้างโฟลเดอร์

```
backend-skill-checkpoint-express-server/
├── app.mjs                 # จุดเริ่มต้นแอป, การตั้งค่า Express
├── package.json            # Dependencies และ scripts
├── middleware/             # Validation middleware
│   ├── validateQuestion.mjs   # ตรวจสอบคำถามและค้นหา
│   ├── validateAnswer.mjs     # ตรวจสอบคำตอบ
│   ├── validateVote.mjs       # ตรวจสอบโหวต
│   └── validateParams.mjs     # ตรวจสอบ ID/params
├── routes/                 # API route handlers
│   ├── questionApi.mjs     # CRUD คำถาม, ค้นหา, โหวต
│   └── answerApi.mjs       # CRUD คำตอบ, โหวตคำตอบ
├── utils/                  # ฟังก์ชันช่วยเหลือ
│   └── db.mjs              # PostgreSQL connection pool
└── scripts/                # สคริปต์สำหรับฐานข้อมูล
    ├── check-database.sql  # คำสั่ง SQL สำหรับตรวจสอบ
    └── TEST-CASCADE-DELETE.md  # คู่มือทดสอบ cascade delete
```

---

## รูปแบบการตอบกลับของ API

### สำเร็จ (200/201)

```json
{
  "message": "Question created successfully.",
  "data": { ... }
}
```

### Error (400/404/500)

```json
{
  "message": "Invalid request data."
}
```

---

## เครดิต

- พัฒนาในโปรเจกต์ backend skill checkpoint ของ TechUp Bootcamp
- ออกแบบตามแพลตฟอร์มถาม-ตอบอย่าง Quora

---

## License

ISC
