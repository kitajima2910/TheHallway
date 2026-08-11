# 🕸️ The Hallway - 3D Horror Survival Experience

> **A first-person 3D horror exploration game built with Three.js, React, and WebGL.**

---

## 📜 Giới thiệu (Overview)

**The Hallway** là một trò chơi kinh dị góc nhìn thứ nhất (First-Person Perspective) lấy bối cảnh dãy hành lang u uất của một khách sạn cổ quái đầy ma mị. Người chơi sẽ nhập vai nhân vật khám phá, di chuyển dọc theo hành lang tối tăm, đối mặt với bầu không khí ngột ngạt, những cánh cửa mang biển số bí ẩn và hệ thống tơ nhện cổ quái cùng những chú nhện nhỏ sinh động.

---

## ✨ Tính năng nổi bật (Key Features)

- 🎮 **Góc nhìn thứ nhất chân thực (First-Person Controls):**
  - Điều khiển chuyển động bằng bàn phím (WASD / Arrows) kết hợp Pointer Lock xoay góc nhìn mượt mà 360°.
  - Tương tác vật lý không gian 3D thực tế với kiểm tra va chạm tường, cửa và hành lang.

- 🕷️ **Hệ thống tơ nhện & Nhện động (Procedural Cobwebs & Spiders System):**
  - Tơ nhện trong suốt giăng vắt ở các góc trần và giăng ngang hành lang.
  - Những chú nhện nhỏ gọn, xinh xắn bò linh hoạt trên từng sợi tơ nhện với đôi mắt phát sáng ngọc lam/cyan ma mị.
  - Tối ưu hóa render với `MeshBasicMaterial` và Canvas 2D textures đảm bảo mượt mà 60+ FPS.

- 🚪 **Biển số phòng & Kiến trúc chi tiết (Detailed Room Plaques & Architecture):**
  - Dãy phòng đánh số chẵn/lẻ quy chuẩn (101, 102, 103, 104, 105...).
  - Biển số kim loại tối màu viền kim loại kép, chữ số trắng nổi bật đặt ở tầm mắt cả mặt trong và mặt ngoài cánh cửa.
  - Thảm hành lang cổ điển, tường gạch hoa văn u ám, ánh đèn mờ ảo chập chờn.

- 🕯️ **Đèn pin & Bầu không khí ma mị (Flashlight & Horror Atmosphere):**
  - Đèn pin cá nhân đi theo hướng nhìn của người chơi.
  - Đèn trần hành lang tạo bóng đổ u ám và hiệu ứng âm thanh u uất đậm chất điện ảnh.

---

## 🎮 Hướng dẫn điều khiển (Controls)

| Phím / Thao tác | Hành động |
|---|---|
| **Click vào màn hình** | Khóa con trỏ chuột (Pointer Lock) để bắt đầu góc nhìn 3D |
| **W / A / S / D** | Di chuyển Tiến / Trái / Lùi / Phải |
| **Chuột (Mouse)** | Xoay góc nhìn 360° |
| **Shift** | Chạy nhanh |
| **F** | Bật / Tắt Đèn pin |
| **E / Click chuột** | Tương tác mở/đóng cửa và vật phẩm |
| **ESC** | Tạm dừng trò chơi / Nhả con trỏ chuột |

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

- **Frontend Core:** React 19, TypeScript
- **3D Graphics Engine:** Three.js (WebGL renderer)
- **Styling & UI:** Tailwind CSS
- **Build Tool:** Vite
- **Icons:** Lucide React

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy (Getting Started)

### Yêu cầu hệ thống:
- Node.js >= 18.0.0
- npm

### Các bước cài đặt:

```bash
# Cài đặt các thư viện phụ thuộc
npm install

# Khởi chạy môi trường phát triển (Dev Server)
npm run dev
```

Ứng dụng sẽ chạy tại địa chỉ `http://localhost:3000`.

---

## 📄 Trạng thái phát triển (Development Status)

Mọi tiến độ phát triển, lịch sử nâng cấp và tối ưu hóa hệ thống đều được ghi nhận chi tiết tại file `STATUS.md`.
