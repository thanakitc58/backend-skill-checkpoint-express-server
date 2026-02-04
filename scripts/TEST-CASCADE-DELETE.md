# วิธีทดสอบ Cascade Delete (ลบคำถาม → คำตอบและ votes ถูกลบตาม)

## ขั้นตอนที่ 1: เช็คข้อมูลก่อนลบ

1. เปิด pgAdmin หรือ DBeaver เชื่อมต่อกับ database `Backend-Checkpoint-Quora`
2. รัน query จาก `check-database.sql` ข้อ 2 (เปลี่ยน `198` เป็น question_id ที่จะทดสอบ)
3. บันทึกว่า question นั้นมีกี่ answer และกี่ vote

## ขั้นตอนที่ 2: ทดสอบลบผ่าน API

1. รัน server: `npm run start`
2. ใน Postman ส่ง **DELETE** ไปที่:
   ```
   http://localhost:4000/questions/198
   ```
   (เปลี่ยน `198` เป็น question_id เดียวกับข้อ 1)
3. ควรได้ response 200 พร้อมข้อความ `"Question post has been deleted successfully."`

## ขั้นตอนที่ 3: เช็คใน Database ว่าถูกลบหมด

1. รัน query จาก `check-database.sql` ข้อ 3
2. ตรวจว่า:
   - `questions` ไม่มีแถวของ id นั้น
   - `answers` ไม่มีแถวที่ question_id = id นั้น
   - `question_votes` ไม่มีแถวที่ question_id = id นั้น
   - `answer_votes` ไม่มีแถวของ answers ที่ถูกลบไป

## ขั้นตอนที่ 4: เช็ค Foreign Key (ถ้าต้องการ)

รัน query ข้อ 1 ใน `check-database.sql` เพื่อดูว่า table ต่างๆ มี FK และ ON DELETE ตั้งค่าอย่างไร
