# Lilac Admin Dashboard — Product Plan (ฉบับละเอียด)

**Version:** 1.0  
**Product:** Lilac AI — สมองดวงที่สองของคุณ  
**ขอบเขต:** Admin Console สำหรับทีมดูแลระบบ  
**Core Feature ที่ต้องคำนึงถึงตลอด:** Hey Lilac (Voice Assistant)

---

## ภาพรวมโครงสร้าง

Admin Dashboard มี 6 หน้าหลัก แต่ละหน้ามีเป้าหมายและกลุ่มผู้ใช้งานที่ชัดเจน

| หน้า | เป้าหมายหลัก | ใช้บ่อยแค่ไหน | ผู้ใช้งานหลัก |
|---|---|---|---|
| 1. แดชบอร์ด | ดูภาพรวมสุขภาพระบบ | ทุกวัน | ทุก role |
| 2. ผู้ใช้งาน | จัดการ user รายคน | ทุกวัน | Support, Admin |
| 3. AI Monitor | ดู quality และ usage ของ AI + Voice | สัปดาห์ละ 2–3 ครั้ง | Technical, Product |
| 4. การเงิน | ติดตาม revenue และ churn | สัปดาห์ละครั้ง | Finance, CEO |
| 5. Notifications | ส่ง message ถึง user กลุ่มต่างๆ | ตามแคมเปญ | Marketing, Admin |
| 6. ตั้งค่าระบบ | config ระบบและจัดการ admin | ไม่บ่อย | Super Admin |

---

## หน้า 1 — แดชบอร์ด (Overview)

### เป้าหมาย
เปิดมาแล้วรู้สุขภาพของระบบทั้งหมดใน 10 วินาที ไม่ต้องไล่หาข้อมูลหลายหน้า

---

### Section 1.1 — System Alert Banner

**มีเพราะ:** ถ้ามีปัญหาเกิดขึ้น admin ต้องรู้ก่อนเลย ก่อนอ่านตัวเลขอื่น เหมือน warning light บนหน้าปัดรถ ถ้าซ่อนไว้ในหน้า AI Monitor admin อาจรู้ช้าเกินไปและกระทบ user เยอะ

**แสดงเมื่อ:**
- AI Error Rate เกิน threshold ที่กำหนด (เช่น > 2%)
- Wake Word Detection Rate ต่ำกว่าปกติ (< 90%)
- Voice Response Latency สูงกว่าปกติ (> 2.5 วินาที)
- Churn rate พุ่งขึ้นผิดปกติในรอบ 24 ชั่วโมง
- Server downtime หรือ API ของ AI provider มีปัญหา
- มีจำนวน Flagged Prompts เพิ่มขึ้นผิดปกติ

**รายละเอียด:**
- แสดงได้หลาย alert พร้อมกัน จัดเรียงตาม severity (Critical → Warning → Info)
- แต่ละ alert มีปุ่ม "ดูรายละเอียด" ที่พาไปหน้าที่เกี่ยวข้องโดยตรง
- กด dismiss ได้ และ alert จะหายไปเมื่อปัญหาได้รับการแก้ไข
- ถ้าไม่มี alert ใดๆ section นี้จะซ่อนตัว ไม่กินพื้นที่

---

### Section 1.2 — Stat Cards หลัก (5 Cards)

**มีเพราะ:** เป็น daily health check ที่ต้องอ่านได้เร็ว ตัวเลข 5 ตัวนี้บอกสุขภาพธุรกิจได้ครบในครั้งเดียว

**Card 1 — ผู้ใช้ทั้งหมด (Total Users)**
- ตัวเลขสะสม user ทั้งหมดในระบบ
- เปรียบเทียบกับเดือนที่แล้ว แสดง % การเติบโต
- มีเพราะ: บอกขนาดของ user base และ momentum ของการเติบโต

**Card 2 — ผู้ใช้งานวันนี้ (DAU)**
- จำนวน unique user ที่ใช้งานในวันนั้น
- เปรียบเทียบกับ 7 วันที่แล้ว
- มีเพราะ: DAU ≠ Total Users — คนสมัครแล้วไม่ได้แปลว่ายังใช้อยู่ ตัวเลขนี้บอกว่า user ยังใช้จริงๆ ไหม

**Card 3 — สมาชิก PLUS**
- จำนวน PLUS members ปัจจุบัน + % conversion จาก FREE
- มีเพราะ: PLUS คือ revenue จริง ต้องดูทุกวันว่าตัวเลขนี้โตหรือหด

**Card 4 — AI Calls วันนี้**
- จำนวนครั้งที่ AI ถูกเรียกใช้ทั้ง text และ voice รวมกัน
- เฉลี่ยต่อ user ต่อวัน
- มีเพราะ: AI usage คือ core engagement metric ของ Lilac โดยตรง

**Card 5 — Hey Lilac Activations วันนี้**
- จำนวนครั้งที่ user พูด "Hey Lilac" และระบบ activate
- เปรียบเทียบกับ 7 วันที่แล้ว + แสดง detection success rate
- มีเพราะ: Hey Lilac คือ differentiator หลักของ Lilac ถ้าคนไม่ใช้ voice feature แสดงว่ามีปัญหาที่ต้องไปแก้

---

### Section 1.3 — User Growth Chart

**มีเพราะ:** Stat card บอกตัวเลขปัจจุบัน แต่ chart บอก trend — ธุรกิจกำลังเร่งตัวหรือ plateau หรือกำลังชะลอ

**รายละเอียด:**
- Area chart แสดงสมาชิกสะสมรายเดือน ย้อนหลัง 6 เดือน
- แยกเส้น FREE และ PLUS ชัดเจน เพราะ PLUS growth คือสิ่งที่สำคัญกว่า
- hover ดู breakdown รายเดือนได้
- สามารถเลือก time range ได้ (3 เดือน / 6 เดือน / 1 ปี)

---

### Section 1.4 — DAU รายสัปดาห์

**มีเพราะ:** Growth chart ดู trend รายเดือน แต่ DAU weekly ดู pattern รายวัน วันไหน drop ผิดปกติจะเห็นทันที เช่น ถ้าวันจันทร์ drop ทุกสัปดาห์แสดงว่า user ไม่ใช้ตอนเริ่มสัปดาห์ ซึ่งเป็น signal สำหรับ notification strategy

**รายละเอียด:**
- Bar chart เปรียบเทียบ DAU ทุกวันในสัปดาห์นี้ vs สัปดาห์ที่แล้ว
- สีต่างกันระหว่างสัปดาห์นี้และสัปดาห์ที่แล้ว
- hover ดูตัวเลขและ % เปลี่ยนแปลงได้

---

### Section 1.5 — User Retention Curve

**มีเพราะ:** Retention คือตัวชี้วัดที่สำคัญที่สุดของ subscription app "ดึงคนมาได้เยอะ แต่ถ้าเขาไม่กลับมา product มีปัญหา" ถ้า retention ต่ำกว่า benchmark ต้องรีบแก้ก่อนทำ marketing เพิ่ม

**รายละเอียด:**
- Line chart แสดง % user ที่ยังใช้งานอยู่ ตั้งแต่ Week 1 ถึง Week 8 หลังสมัคร
- มี benchmark line แสดงค่าเฉลี่ย app ประเภทเดียวกัน เพื่อเปรียบเทียบ
- แสดงตัวเลข retention ที่ Week 1, Week 2, Week 4, Week 8 เป็น milestone
- มี annotation ถ้า retention drop ผิดปกติที่ week ใด

---

### Section 1.6 — Feature Usage Donut

**มีเพราะ:** รู้ว่า user ใช้ฟีเจอร์ไหนมากสุด ช่วย prioritize roadmap ว่าทีมควรพัฒนาอะไรต่อ ถ้า AI Chat = 60% แต่ทีมกำลัง invest ใน Calendar feature หนักมาก นั่นอาจเป็น misalignment

**รายละเอียด:**
- Donut chart แสดงสัดส่วนการใช้ฟีเจอร์หลัก (AI Chat, การเรียน, การเงิน, ปฏิทิน, Hey Lilac Voice, อื่นๆ)
- แยก Hey Lilac ออกมาเป็น segment ชัดเจน เพราะเป็น feature สำคัญ
- คลิกที่ segment เพื่อดู breakdown เพิ่มเติมได้
- เปรียบเทียบกับเดือนที่แล้ว เพื่อดูว่า feature ไหนกำลัง grow หรือ decline

---

### Section 1.7 — FREE → PLUS Conversion Funnel

**มีเพราะ:** Funnel วัด drop-off แต่ละ step ของ journey จาก FREE สู่ PLUS ถ้าตรงไหน drop มากผิดปกติ ต้องไปแก้ที่นั่นก่อน ดีกว่าเพิ่ม marketing budget โดยไม่รู้ว่าคน leak ออกตรงไหน

**รายละเอียด:**
- Funnel 4 step: สมัครใหม่ → ใช้งาน 3 วัน → ครบ 7 วัน → เป็น PLUS
- แสดง % drop-off ระหว่าง step แต่ละคู่
- ถ้า drop-off ที่ step ใดเกิน threshold จะมี highlight สีแดง
- เปรียบเทียบกับเดือนที่แล้วได้

---

### Section 1.8 — Activity Feed

**มีเพราะ:** เป็น real-time log ของระบบ เหมือน CCTV ถ้ามี incident เกิดขึ้น admin ตามรอยได้ทันที และยังช่วย celebrate milestones เช่น user ที่ใช้ AI ครบ 1,000 ครั้ง

**รายละเอียด:**
- Log แบบ real-time แสดงเหตุการณ์ล่าสุดประมาณ 10–15 รายการ
- แต่ละ event มี timestamp, ประเภท (join/upgrade/churn/milestone/warning/alert), และชื่อ user
- Color-coded ตามประเภท ให้ scan ด้วยตาได้เร็ว
- ประเภท event ที่ติดตาม:
  - **join** — ผู้ใช้ใหม่ลงทะเบียน
  - **upgrade** — FREE → PLUS
  - **churn** — ยกเลิก PLUS
  - **milestone** — ใช้ AI ครบ x ครั้ง, Hey Lilac activation ครบ x ครั้ง
  - **warning** — user ไม่ active x วัน
  - **alert** — ปัญหาระบบที่ต้องดูแล
  - **voice_error** — Hey Lilac ไม่สามารถ recognize คำสั่งได้
- คลิกที่ event เพื่อดูรายละเอียดหรือไปที่ user profile ได้

---

### Section 1.9 — Top AI Prompts

**มีเพราะ:** รู้ว่า user ใช้ AI ทำอะไรมากสุด ช่วยตัดสินใจว่าจะ optimize response, สร้าง prompt template, หรือสร้าง shortcut ในหน้า app เพื่อลด friction

**รายละเอียด:**
- แสดง 5–10 คำขอที่ถูกใช้บ่อยสุด แยกเป็น Text Prompts และ Voice Commands
- แยก voice ออกมาเพราะคนพูดกับ AI ต่างจากพิมพ์ เช่น พูด "วันนี้มีนัดอะไรบ้าง" แต่พิมพ์ "ตารางนัดหมายวันนี้"
- แสดงจำนวนครั้งและ % เทียบกับ total AI calls
- progress bar แสดงสัดส่วนให้เห็นภาพ

---

### Section 1.10 — Quick Actions

**มีเพราะ:** งาน admin ที่ทำบ่อยควรทำได้จากหน้านี้เลย ไม่ต้องเดินหลายหน้าเพื่องานที่ใช้เวลา 10 วินาที ลด friction และเวลาทำงาน

**Actions ที่มี:**
- ส่ง Broadcast (ลิงก์ไปหน้า Notifications)
- ดู User ใหม่วันนี้ (filter user table ทันที)
- Export รายงานสรุป (ดาวน์โหลด PDF หรือ CSV)
- ระงับบัญชีผู้ใช้ (เปิด dialog ค้นหาชื่อแล้ว suspend)

---

## หน้า 2 — ผู้ใช้งาน (Users)

### เป้าหมาย
ค้นหา ดู และจัดการผู้ใช้แต่ละคนได้อย่างรวดเร็ว รองรับทั้งการค้นหา 1 คน และ bulk action หลายคนพร้อมกัน

---

### Section 2.1 — Stats Bar ด้านบน

**มีเพราะ:** ให้ภาพรวมของ user base ก่อนลงไปดูรายละเอียด ไม่ต้องกลับไปดูหน้า Dashboard

**ตัวเลขที่แสดง:**
- Total Users
- Active ใน 7 วันที่ผ่านมา
- Free Members
- PLUS Members
- User ใหม่วันนี้
- Churned ใน 30 วัน

---

### Section 2.2 — Search Bar

**มีเพราะ:** งาน admin ที่ทำบ่อยที่สุดคือ "มีคนร้องเรียน ต้องหาคนนั้นให้เจอ" ต้องหาได้เร็วที่สุด

**รายละเอียด:**
- ค้นหาได้ด้วย ชื่อ, อีเมล, หรือ User ID
- แสดงผลแบบ instant (ไม่ต้องกด Enter)
- ถ้าค้นหาแล้วเจอ 1 คน highlight ที่ user นั้นเลย

---

### Section 2.3 — Filter Bar

**มีเพราะ:** admin มักต้องการดู user กลุ่มเฉพาะ เช่น "PLUS ทั้งหมดที่ไม่ active 7 วัน" หรือ "FREE ที่สมัครเดือนนี้" การ filter แบบ manual แต่ละครั้งช้าและผิดพลาดง่าย

**Filter ที่มี:**
- แผน (FREE / PLUS / ทั้งหมด)
- สถานะ (Active / Inactive / Suspended / ทั้งหมด)
- วันที่สมัคร (range picker)
- การใช้ Voice (ใช้ Hey Lilac / ไม่เคยใช้)
- AI Calls (น้อยกว่า / มากกว่า x ครั้ง)
- Last Active (ภายใน 1 วัน / 7 วัน / 30 วัน / เกิน 30 วัน)

---

### Section 2.4 — User Table

**มีเพราะ:** เป็นหัวใจของหน้านี้ ต้องแสดงข้อมูลที่จำเป็นทั้งหมดในแถวเดียว โดยไม่ต้องเปิดหน้าย่อย

**Columns:**
- Avatar + ชื่อ + User ID
- อีเมล
- แผน (FREE / PLUS) พร้อม badge สี
- สถานะ (Active / Inactive / Suspended)
- วันที่สมัคร
- Last Active
- AI Calls รวม
- Hey Lilac Activations รวม (voice user flag)
- Actions (ดูโปรไฟล์, suspend, ส่ง message)

**Feature เพิ่มเติม:**
- เรียงลำดับได้ทุก column
- Pagination แสดง 20 คน/หน้า
- เลือก row ได้หลาย row สำหรับ Bulk Actions
- Export ผลลัพธ์ที่ filter แล้วเป็น CSV

---

### Section 2.5 — Bulk Actions

**มีเพราะ:** ถ้ามี user 50 คนที่ไม่ active 30 วัน การ suspend ทีละคนใช้เวลาช้ามาก Bulk action ทำได้ในครั้งเดียว

**Actions ที่มี:**
- Suspend / Unsuspend บัญชีที่เลือก
- ส่ง Notification ไปยัง user ที่เลือก
- Export ข้อมูล user ที่เลือกเป็น CSV
- เพิ่ม tag หรือ label กลุ่ม

---

### Section 2.6 — User Profile Drawer

**มีเพราะ:** admin ต้องการดูข้อมูล user ทั้งหมดในที่เดียว โดยไม่ต้องออกจากหน้า user list การเปิด drawer ด้านข้างเร็วกว่าการโหลดหน้าใหม่

**ข้อมูลที่แสดงใน Drawer:**
- ข้อมูลพื้นฐาน: ชื่อ, อีเมล, วันสมัคร, แผนปัจจุบัน, สถานะ
- Stats: AI Calls ทั้งหมด, Hey Lilac Activations, วัน Active ติดต่อกัน (streak)
- Voice Usage: จำนวนครั้งที่ใช้ Hey Lilac, top voice commands ของ user คนนี้, accuracy rate
- Activity Timeline: 10 กิจกรรมล่าสุดของ user คนนี้
- Subscription History: ประวัติการชำระเงินและการเปลี่ยนแผน
- Actions: ส่ง notification, suspend/unsuspend, upgrade แผนด้วยตัวเอง, reset password

---

### Section 2.7 — Retention Cohort Table

**มีเพราะ:** แสดง retention แยกตาม cohort เดือนที่สมัคร ช่วยดูว่า "คนที่สมัครเดือนไหน มี retention ดีที่สุด" ถ้าเดือน ม.ค. ดีกว่าเดือน ธ.ค. แสดงว่า acquisition channel หรือ onboarding ที่ทำในเดือน ม.ค. ได้ผลดีกว่า

**รายละเอียด:**
- ตาราง cohort แสดง % retention แยกตาม cohort เดือนที่สมัคร × Week ที่นับ (W1–W8)
- Color heat map ยิ่งเข้มยิ่ง retain ดี
- คลิก cell เพื่อดู list ของ user ใน cohort นั้นได้

---

### Section 2.8 — Churn List

**มีเพราะ:** user ที่เพิ่งยกเลิก PLUS คือโอกาส win-back ถ้ารู้เหตุผลและติดต่อได้เร็ว อาจดึงกลับได้

**รายละเอียด:**
- รายชื่อ user ที่ยกเลิก PLUS ใน 30 วันที่ผ่านมา
- แสดงเหตุผลการยกเลิก (ถ้า user กรอก)
- แสดงระยะเวลาที่เป็น PLUS และ AI Calls ก่อนยกเลิก
- ปุ่ม "ส่ง Win-back Message" ที่ลิงก์ไปหน้า Notifications พร้อม pre-fill audience

---

## หน้า 3 — AI Monitor

### เป้าหมาย
รู้ว่า AI และ Hey Lilac กำลังทำอะไรอยู่ มีปัญหาด้านคุณภาพหรือไม่ และ user ใช้งานอย่างไร

---

### Section 3.1 — Stats Bar ด้านบน

**ตัวเลขที่แสดง:**
- Total AI Calls วันนี้ (Text + Voice รวม)
- Hey Lilac Activations วันนี้
- AI Error Rate (% ที่ตอบไม่ได้หรือ error)
- Average Response Latency (วินาที)
- Voice Recognition Accuracy (%)
- False Activation Rate (%)

---

### Section 3.2 — AI Call Volume Timeline

**มีเพราะ:** กราฟ calls รายชั่วโมงบอกว่าเวลาไหน load สูงสุด ถ้า spike ผิดปกติหรือ drop กะทันหัน จะเห็นทันที และช่วยวางแผน scaling ได้

**รายละเอียด:**
- Line chart แสดง AI calls รายชั่วโมงตลอด 24 ชั่วโมงที่ผ่านมา
- แยกเส้น Text Calls และ Voice Calls (Hey Lilac)
- แสดง peak hour และ low hour ชัดเจน
- ถ้ามี error spike จะมี annotation บน timeline

---

### Section 3.3 — Error Rate & Latency Monitor

**มีเพราะ:** สองตัวนี้คือตัวชี้วัดคุณภาพ service โดยตรง ถ้า error rate สูง user ได้รับประสบการณ์ที่แย่ ถ้า latency สูง user รู้สึกว่า app ช้าและเลิกใช้

**รายละเอียด:**
- Error Rate Chart: % AI errors รายชั่วโมง พร้อม threshold line (เช่น 2% = warning, 5% = critical)
- Latency Chart: median และ p95 response time รายชั่วโมง พร้อม threshold line (เช่น 2 วินาที = warning)
- ประเภท error ที่แยก:
  - AI Model Error (model ตอบไม่ได้)
  - Timeout (ใช้เวลานานเกินไป)
  - Voice Recognition Failure (แปลงเสียงไม่ได้)
  - Wake Word Not Detected (Hey Lilac ไม่ได้ยิน)
  - Content Policy Block (prompt ผิดนโยบาย)

---

### Section 3.4 — Hey Lilac Voice Monitor (เฉพาะ Voice)

**มีเพราะ:** Voice มี failure mode ที่ text ไม่มี และเป็น core feature ของ Lilac ต้องมี monitoring แยกโดยเฉพาะ

**Metrics ที่แสดง:**

**Wake Word Detection Rate**
- % ที่พูด "Hey Lilac" แล้วระบบได้ยินและ activate ถูกต้อง
- เป้าหมาย: > 95%
- ต่ำกว่า 90% = ต้องรีบแก้ไข เพราะ user จะรู้สึกว่า feature ใช้ไม่ได้

**False Activation Rate**
- % ที่ระบบ activate โดย user ไม่ได้พูด "Hey Lilac" จริงๆ
- เป้าหมาย: < 0.5%
- สูงเกินไป = bad UX และกิน battery

**Voice Recognition Accuracy**
- % ที่แปลงเสียงเป็น text ได้ถูกต้อง
- แยกตามภาษา: ไทย vs อังกฤษ vs Thai-English mixing
- แยกตามสภาพแวดล้อม: เงียบ vs มีเสียงรบกวน (ถ้า data มี)
- ภาษาไทยมักมี accuracy ต่ำกว่า English ต้องติดตามแยก

**Voice Response Latency**
- เวลาตั้งแต่ user พูดจบจนได้ยิน response
- แยก: STT (Speech-to-Text) latency + AI Processing + TTS (Text-to-Speech) latency
- เป้าหมาย: รวมไม่เกิน 2 วินาที
- เกิน 2 วินาที = user รู้สึกว่าช้า เกิน 3 วินาที = user มักจะ cancel

**Drop-off after Wake Word**
- % ที่ activate Hey Lilac แล้วไม่พูดคำสั่งต่อ (silent drop)
- สูงเกินไปอาจแปลว่า: response time นานเกินรอ, ไม่รู้จะพูดอะไร, หรือ activate โดยไม่ตั้งใจ
- ช่วย diagnose ว่าปัญหาอยู่ที่ไหน

**Voice Adoption Rate**
- % ของ user ทั้งหมดที่เคยใช้ Hey Lilac อย่างน้อย 1 ครั้ง
- % ของ user ที่ใช้ Hey Lilac เป็น primary interaction (มากกว่า 50% ของ AI calls)
- สำคัญเพราะบอกว่า user adopt feature หลักได้แค่ไหน

---

### Section 3.5 — Top Voice Commands vs Top Text Prompts

**มีเพราะ:** คนพูดกับ AI ต่างจากพิมพ์ เช่น พูด "วันนี้มีอะไรบ้าง" แต่พิมพ์ "สรุปตารางวันนี้ให้หน่อย" การรู้ทั้งสองอย่างช่วยออกแบบ UX และ prompt template ได้ตรงจุดกว่า

**รายละเอียด:**
- แสดงแยกกัน 2 list คู่กัน: Voice Commands (Top 10) และ Text Prompts (Top 10)
- แสดงจำนวนครั้งและ % ของ total
- Category ของ prompt: การเรียน / การเงิน / ตารางเวลา / ไลฟ์สไตล์ / อื่นๆ

---

### Section 3.6 — Unresolved & Flagged Queries

**มีเพราะ:** query ที่ AI ตอบไม่ได้หรือตอบผิดบอกว่า model ยังขาดอะไร ช่วย prioritize ว่าควร fine-tune หรือเพิ่ม training data ด้านไหน query ที่ถูก flag ช่วย monitor safety

**รายละเอียด:**

**Unresolved Queries**
- รายการ query ที่ AI ตอบไม่ได้หรือตอบว่าไม่รู้
- แสดง query text (anonymized), จำนวนครั้งที่ถาม, และ category
- sort ตามความถี่ เพื่อ prioritize การแก้ไข

**Flagged Prompts**
- query ที่ถูก flag โดย content policy
- แสดง flag category: inappropriate, privacy-sensitive, off-topic
- admin สามารถ review และ mark as false positive ได้
- ถ้า flag เยอะผิดปกติ จะ trigger alert บนหน้า Dashboard

---

### Section 3.7 — Token Usage & Cost Tracking

**มีเพราะ:** AI token cost คือ operational cost ที่โตตาม usage ถ้าไม่ track จะไม่รู้ว่ากำลังขาดทุนหรือกำไรต่อ user แต่ละคน และช่วยตัดสินใจว่าควร cap usage ของ FREE user ที่เท่าไหร่

**รายละเอียด:**
- Token ที่ใช้ไปวันนี้ / เดือนนี้ / เดือนที่แล้ว
- Cost โดยประมาณ (คำนวณจาก token rate)
- Cost per User เฉลี่ย: FREE vs PLUS
- Chart แสดง token usage รายวันย้อนหลัง 30 วัน
- ถ้า cost per FREE user เกินกว่าที่ sustainable จะมี alert

---

## หน้า 4 — การเงิน (Finance)

### เป้าหมาย
รู้ว่าธุรกิจอยู่ตรงไหน revenue โตหรือหด และ churn มาจากไหน

---

### Section 4.1 — Revenue Stats Bar

**ตัวเลขที่แสดง:**
- MRR เดือนนี้ (Monthly Recurring Revenue)
- เปรียบเทียบกับเดือนที่แล้ว (+/-)
- ARR (Annual Run Rate)
- Average Revenue Per User (ARPU)
- Customer Lifetime Value (LTV) โดยประมาณ

---

### Section 4.2 — MRR Trend Chart

**มีเพราะ:** MRR คือตัวเลขที่ CEO และ investor ดูก่อนเลย trend ของ MRR บอกว่าธุรกิจกำลังโตหรือหด

**รายละเอียด:**
- Bar chart แสดง MRR รายเดือน ย้อนหลัง 12 เดือน
- แยกสี: New MRR (revenue จาก user ใหม่), Expansion MRR (upgrade), Churned MRR (revenue ที่หายไป)
- Net MRR = New + Expansion - Churned
- hover ดู breakdown ของแต่ละเดือนได้

---

### Section 4.3 — MRR Movement Waterfall

**มีเพราะ:** Waterfall chart แสดงให้เห็นชัดว่า MRR เดือนนี้ เปลี่ยนจากเดือนที่แล้วอย่างไร เพิ่มจากอะไร และหายไปจากอะไร ดีกว่า line chart ธรรมดาที่บอกแค่ตัวเลขรวม

**รายละเอียด:**
- เริ่มจาก MRR เดือนที่แล้ว
- บวก New MRR (user ใหม่)
- บวก Expansion MRR (FREE → PLUS หรือ upgrade plan)
- ลบ Churned MRR (ยกเลิก)
- ลบ Contraction MRR (downgrade, ถ้ามี)
- จบที่ MRR เดือนนี้

---

### Section 4.4 — Churn Analysis

**มีเพราะ:** Churn คือ "รู" ในถัง ถ้าไม่รู้ว่า churn มาจากไหนจะแก้ไม่ถูก

**รายละเอียด:**
- Churn Rate % รายเดือน (จำนวน PLUS ที่ยกเลิก / PLUS ทั้งหมดต้นเดือน)
- Churn by Tenure: คนที่เป็น PLUS มาแค่ 1 เดือน churn มากกว่าคนที่อยู่มา 6 เดือนไหม?
- Churn by Acquisition Channel (ถ้า data มี)
- Churn Reason Breakdown: เหตุผลที่ user กรอกตอนยกเลิก (ราคาแพงเกิน / ไม่ได้ใช้ / ย้ายไปใช้อื่น / ฯลฯ)

---

### Section 4.5 — Revenue by Plan & Billing Cycle

**มีเพราะ:** การรู้ว่า user นิยม monthly หรือ yearly plan ช่วยวางแผน pricing strategy yearly plan มี LTV สูงกว่าและ churn ต่ำกว่า ถ้ายังมี monthly เยอะ ควรสร้าง incentive ให้ switch

**รายละเอียด:**
- Pie chart แสดง revenue แยกตาม plan type
- Breakdown: PLUS Monthly vs PLUS Yearly (ถ้ามีหลาย plan)
- Conversion rate จาก monthly → yearly

---

### Section 4.6 — Transaction History Table

**มีเพราะ:** ต้องใช้ตรวจสอบเมื่อมีปัญหาการชำระเงิน, ออก invoice, หรือ handle การ refund

**รายละเอียด:**
- รายการ transaction ทั้งหมด
- Filter ได้ตาม: วันที่, สถานะ (success/failed/refunded), plan, จำนวนเงิน
- แสดง: วันที่, User, จำนวนเงิน, plan, payment method, สถานะ
- ปุ่ม Export เป็น CSV สำหรับทำบัญชี

---

### Section 4.7 — Projected MRR

**มีเพราะ:** ช่วยวางแผน budget และ runway ได้ล่วงหน้า ไม่ต้องรอสิ้นเดือนถึงจะรู้ตัวเลข

**รายละเอียด:**
- ประมาณการ MRR เดือนหน้าจาก subscription ที่มีอยู่ปัจจุบัน
- แสดง optimistic / base / pessimistic scenario โดยใช้ churn rate ต่างกัน
- แสดงจำนวน subscription ที่จะ renew และ expire ในเดือนหน้า

---

## หน้า 5 — Notifications & Broadcast

### เป้าหมาย
ส่ง message ถึง user กลุ่มต่างๆ ได้อย่างตรงจุด โดยไม่ต้องพึ่ง developer

---

### Section 5.1 — Campaign Stats Bar

**ตัวเลขที่แสดง:**
- Campaign ที่ส่งไปแล้วเดือนนี้
- Average Open Rate
- Average Click Rate (ถ้ามี link)
- User ที่ถูก re-engage ผ่าน notification เดือนนี้

---

### Section 5.2 — Create Campaign Button + Draft List

**มีเพราะ:** entry point ที่ชัดเจนสำหรับสร้าง campaign ใหม่ และดู draft ที่ยังไม่ได้ส่ง

---

### Section 5.3 — Message Composer

**มีเพราะ:** admin ต้องเขียน message และดูหน้าตาก่อนส่งจริง การส่ง push notification ผิดพลาดเป็นเรื่องใหญ่มาก ต้องมี preview และ confirmation

**รายละเอียด:**
- ช่อง Title และ Message Body
- เลือกประเภท: Push Notification / In-App Banner / In-App Modal
- Preview แสดงหน้าตาจริงบน iPhone ทั้ง 3 แบบ
- รองรับ dynamic variables เช่น {{ชื่อ}} {{แผน}} เพื่อ personalize
- Character count สำหรับ push notification (จำกัดตัวอักษร)
- ปุ่ม Send Test ส่งถึงตัวเองก่อนส่งจริง

---

### Section 5.4 — Audience Targeting

**มีเพราะ:** message ที่ตรง target มี open rate สูงกว่าส่งทุกคนมาก การส่ง push notification แบบ mass blast สร้าง notification fatigue และ user มักจะปิด permission ในที่สุด

**Segment ที่สร้างไว้พร้อมใช้ (Preset):**
- ผู้ใช้ทั้งหมด
- FREE users ทั้งหมด
- PLUS users ทั้งหมด
- User ที่ไม่ active 3 วัน
- User ที่ไม่ active 7 วัน
- User ที่ยังไม่เคยใช้ Hey Lilac เลย
- User ที่ PLUS กำลังจะหมดอายุใน 7 วัน
- User ใหม่ที่สมัครภายใน 3 วัน (onboarding group)
- User ที่เพิ่งยกเลิก PLUS ภายใน 30 วัน (win-back group)

**Custom Segment Builder:**
- สร้าง audience เองได้โดยการ combine filter เช่น "FREE + ไม่ active 7 วัน + เคยใช้ Hey Lilac"
- แสดงจำนวน user ที่ match real-time
- บันทึก segment ไว้ใช้ซ้ำได้

---

### Section 5.5 — Schedule

**มีเพราะ:** เวลาที่ส่ง notification มีผลต่อ open rate มาก สำหรับ student app ช่วงที่เหมาะคือเช้า (07:00–08:00) หรือกลางคืน (20:00–22:00) ไม่ใช่กลางวัน admin ควรตั้งเวลาล่วงหน้าได้

**รายละเอียด:**
- ส่งทันที หรือ ตั้งเวลาส่งล่วงหน้า
- ตั้ง timezone ได้
- ตั้งส่งซ้ำได้ (เช่น ทุกวันจันทร์เวลา 08:00)

---

### Section 5.6 — Campaign History & Performance

**มีเพราะ:** ต้องรู้ว่า campaign ไหนได้ผล campaign ไหนไม่ได้ผล เพื่อ learn และปรับ strategy

**รายละเอียด:**
- รายการ campaign ทั้งหมดที่ส่งไปแล้ว พร้อมวันที่, target segment, จำนวนที่ส่ง
- Metrics ต่อ campaign: Sent, Delivered, Opened, Clicked, Conversion (ถ้ามี)
- กรองดูตาม campaign type หรือ date range ได้
- คลิกเพื่อดูรายละเอียด campaign และ breakdown ได้

---

### Section 5.7 — A/B Test

**มีเพราะ:** สมมติฐานว่า message แบบไหนได้ผลดีกว่าไม่ควรใช้ความรู้สึก ควรทดสอบด้วยข้อมูลจริง A/B test ให้คำตอบที่แม่นยำกว่า

**รายละเอียด:**
- แบ่ง audience ออกเป็น 2 กลุ่ม ส่ง message คนละ version
- กำหนด winning metric: open rate / click rate / conversion
- หลัง x ชั่วโมง ระบบแจ้งผลและสามารถส่ง winning version ให้คนที่เหลือได้

---

## หน้า 6 — ตั้งค่าระบบ (Settings)

### เป้าหมาย
ควบคุม config ระบบและจัดการ admin accounts โดยไม่ต้อง deploy ใหม่

---

### Section 6.1 — Admin Accounts & Roles

**มีเพราะ:** ไม่ใช่ทุกคนในทีมควรเห็นข้อมูลทุกอย่าง เช่น support staff ไม่ควรเห็น financial data และไม่ควรมีสิทธิ์ suspend user ได้

**Roles ที่แนะนำ:**

| Role | สิทธิ์ |
|---|---|
| Super Admin | เข้าถึงทุกหน้า ทุก action รวมถึง Settings |
| Admin | เข้าถึงทุกหน้า ยกเว้น Settings > Admin Management |
| Finance | เข้าถึงหน้า Finance เท่านั้น (read-only) |
| Support | เข้าถึงหน้า Users (read + basic actions) และ Dashboard |
| Marketing | เข้าถึงหน้า Notifications และ Dashboard |

**รายละเอียด:**
- เพิ่ม / แก้ไข / ลบ admin account
- กำหนด role และ permission แบบ custom ได้
- รีเซ็ต password
- ดู last login ของแต่ละ admin

---

### Section 6.2 — Feature Flags

**มีเพราะ:** ถ้าต้องการปิดฟีเจอร์ฉุกเฉิน เช่น Hey Lilac มีบัค หรือต้องการ rollout ทีละ % ของ user ไม่ควรต้องรบกวน developer ทุกครั้ง Feature flags ช่วยให้ทีม business ควบคุมได้เอง

**รายละเอียด:**
- รายการ feature flags ทั้งหมดในระบบ
- toggle เปิด/ปิดแต่ละ feature ได้ทันที
- Rollout % — เปิดฟีเจอร์ให้ user กี่ % ก่อน เพื่อ gradual rollout
- กำหนด flag ให้เฉพาะ user กลุ่มไหน เช่น เปิดเฉพาะ PLUS users ก่อน

**Feature Flags ตัวอย่างที่ควรมี:**
- Hey Lilac Voice Feature (on/off)
- PLUS Upgrade Prompt (เปิด/ปิด upsell banner ใน app)
- New Onboarding Flow (A/B test onboarding)
- AI Model Version (สลับระหว่าง model versions)

---

### Section 6.3 — Audit Log

**มีเพราะ:** ถ้ามีอะไรผิดพลาดในระบบ เช่น user ถูก suspend โดยไม่มีเหตุผล หรือ feature flag ถูกเปลี่ยน ต้องตรวจสอบได้ว่าใครทำ เมื่อไหร่

**รายละเอียด:**
- log ทุก action ที่ admin ทำในระบบ
- แสดง: เวลา, admin ที่ทำ, action ที่ทำ, target (user หรือ config), ค่าก่อนและหลังเปลี่ยน
- ค้นหาและ filter ได้
- เก็บ log ย้อนหลังอย่างน้อย 90 วัน

---

### Section 6.4 — API & Integration Config

**มีเพราะ:** ค่า config เช่น AI model ที่ใช้, webhook URL, หรือ API keys ไม่ควร hardcode ใน codebase เพราะทุกครั้งที่ต้องเปลี่ยนต้องรบกวน developer และ deploy ใหม่

**รายละเอียด:**
- AI Provider Config: เลือก model ที่ใช้, ตั้ง max tokens per request, ตั้ง rate limit per user
- Hey Lilac Voice Config: ตั้ง wake word sensitivity, timeout หลัง wake word (วินาที), fallback behavior เมื่อ recognize ไม่ได้
- Webhook URLs สำหรับ payment events
- API Keys (แสดงแบบ masked, มีปุ่ม rotate)

---

### Section 6.5 — Plan & Pricing Settings

**มีเพราะ:** ในช่วงแรกของ product pricing จะถูก test บ่อยมาก ถ้าต้องแก้ code ทุกครั้งที่ต้องการเปลี่ยนราคาหรือสิทธิ์ของแต่ละ plan จะช้ามาก

**รายละเอียด:**
- ราคาของแต่ละ plan (monthly / yearly)
- สิทธิ์ของแต่ละ plan เช่น FREE ใช้ AI ได้กี่ครั้ง/วัน, PLUS ใช้ Hey Lilac ได้ไม่จำกัด
- Free Trial settings: ทดลอง PLUS ได้กี่วัน, ต้องใส่ credit card ไหม
- Grace Period: หลังหมดอายุ PLUS ให้ใช้งานต่อได้อีกกี่วันก่อน downgrade

---

## Metrics Summary ทั้งหมดที่ต้องติดตาม

### Core Business Metrics
| Metric | หน้าหลัก |
|---|---|
| Total Users | Dashboard, Users |
| DAU / MAU | Dashboard |
| DAU/MAU Ratio (Stickiness) | Dashboard |
| MRR | Finance, Dashboard |
| PLUS Conversion Rate | Dashboard, Finance |
| Churn Rate | Finance, Users |
| Net MRR Growth | Finance |
| LTV (Lifetime Value) | Finance |
| ARPU | Finance |

### Product Health Metrics
| Metric | หน้าหลัก |
|---|---|
| Week 1 / Week 4 / Week 8 Retention | Dashboard, Users |
| Feature Adoption Rate (per feature) | Dashboard, AI Monitor |
| FREE → PLUS Funnel Drop-off | Dashboard |
| Notification Open Rate | Notifications |

### Hey Lilac Voice Metrics
| Metric | หน้าหลัก |
|---|---|
| Daily Activations | Dashboard |
| Wake Word Detection Rate | AI Monitor |
| False Activation Rate | AI Monitor |
| Voice Recognition Accuracy (TH/EN) | AI Monitor |
| Voice Response Latency | AI Monitor |
| Drop-off after Wake Word | AI Monitor |
| Voice vs Text Usage Ratio | Dashboard, AI Monitor |
| Voice Adoption Rate | AI Monitor, Users |
| Top Voice Commands | AI Monitor |

### AI Quality Metrics
| Metric | หน้าหลัก |
|---|---|
| AI Error Rate | Dashboard (alert), AI Monitor |
| AI Response Latency | AI Monitor |
| Token Usage & Cost | AI Monitor |
| Cost per User (FREE vs PLUS) | AI Monitor |
| Unresolved Query Rate | AI Monitor |
| Flagged Prompt Rate | AI Monitor |

---

*แผนนี้ครอบคลุม 6 หน้าหลัก ทุก section มีเหตุผลที่มัดจำเพราะแต่ละอย่างถูกออกแบบมาเพื่อตอบคำถามเฉพาะเจาะจง ไม่ใช่ใส่เพื่อให้ดูครบ*
