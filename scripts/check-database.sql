-- ============================================
-- สคริปต์เช็ค Database สำหรับ Backend Checkpoint
-- รันใน pgAdmin, DBeaver, หรือ psql
-- ============================================

-- 1. เช็ค Foreign Key และ ON DELETE CASCADE
-- ============================================
SELECT
  tc.table_name AS "ตาราง",
  kcu.column_name AS "คอลัมน์ FK",
  ccu.table_name AS "อ้างถึงตาราง",
  ccu.column_name AS "อ้างถึงคอลัมน์",
  rc.delete_rule AS "ON DELETE"
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;


-- 2. เช็คข้อมูลก่อนลบคำถาม (แทน 198 ด้วย question_id ที่จะทดสอบ)
-- ============================================
-- คำถามที่ต้องการลบ
SELECT * FROM questions WHERE id = 198;

-- คำตอบของคำถามนั้น
SELECT * FROM answers WHERE question_id = 198;

-- โหวตของคำถามนั้น
SELECT * FROM question_votes WHERE question_id = 198;

-- โหวตของคำตอบนั้น (ถ้ามี)
SELECT av.* FROM answer_votes av
JOIN answers a ON av.answer_id = a.id
WHERE a.question_id = 198;


-- 3. หลังลบคำถาม - เช็คว่าถูกลบหมดหรือยัง
-- ============================================
-- ไม่ควรมีแถว (เปลี่ยน 198 เป็น id ที่ลบไปแล้ว)
SELECT * FROM questions WHERE id = 198;
SELECT * FROM answers WHERE question_id = 198;
SELECT * FROM question_votes WHERE question_id = 198;


-- 4. SELECT ทั่วไป สำหรับดูข้อมูลทั้งหมด
-- ============================================
SELECT * FROM questions ORDER BY id DESC LIMIT 10;
SELECT * FROM answers ORDER BY id DESC LIMIT 10;
SELECT * FROM question_votes ORDER BY id DESC LIMIT 10;
SELECT * FROM answer_votes ORDER BY id DESC LIMIT 10;


-- 5. นับจำนวน records ต่อ question
-- ============================================
SELECT 
  q.id,
  q.title,
  (SELECT COUNT(*) FROM answers a WHERE a.question_id = q.id) AS count_answers,
  (SELECT COUNT(*) FROM question_votes qv WHERE qv.question_id = q.id) AS count_question_votes
FROM questions q
ORDER BY q.id DESC
LIMIT 10;
