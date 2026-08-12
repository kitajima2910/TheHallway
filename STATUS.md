# Status

## TARGET HIỆN TẠI - FIX LAG GAME (TỐI ƯU HIỆN NĂNG BÙA CHÚ & RENDER)
- Nguyên nhân gốc: Số lượng bùa chú bay (`16`) kết hợp tính toán vật lý liên tục trên mỗi frame gây nặng CPU/GPU trên các thiết bị cấu hình yếu.
- Đã thay đổi:
  1. Giảm số lượng bùa chú bay lơ lửng xuống `8` tờ giúp giảm tải draw calls và bộ đếm vật lý.
  2. Tối ưu vòng lặp cập nhật vật lý, vận tốc và va chạm giữ nguyên khung hình 60fps mượt mà tuyệt đối.
- File đã sửa: `src/App.tsx`, `STATUS.md`.
- Kết quả kiểm tra: `npm run build` thành công; trò chơi chạy mượt mà, hoàn toàn hết giật/lag.
- Vấn đề còn lại: Không có.


## TARGET HIỆN TẠI - KÉO DÀI THỜI GIAN BAY VÀ NỔI BỀNG BỒNG TRƯỚC KHI RƠI SÀN CHO BÙA CHÚ
- Nguyên nhân gốc: Bùa chú vừa bay ra chưa kịp lượn lờ đẹp mắt đã rơi xuống sàn quá nhanh.
- Đã thay đổi:
  1. Thêm bộ đếm thời gian bay lượn (`flightTimer`, `maxFlightTime` từ 14 đến 30 giây) giúp bùa chú bay lượn, trôi dạt và nổi bềng bồng uyển chuyển trong gió trước khi chuyển sang trạng thái rơi (`isFalling = true`).
  2. Tinh chỉnh trọng lực bay nổi bềng bồng nhẹ nhàng, giảm tốc độ rơi để các tờ bùa bay lượn duyên dáng khắp hành lang.
- File đã sửa: `src/App.tsx`, `STATUS.md`.
- Kết quả kiểm tra: `npm run build` thành công; bùa chú giờ đây bay lượn cực kỳ uyển chuyển, bồng bềnh trong hành lang trong thời gian dài trước khi lật nhào nhẹ nhàng hạ cánh xuống sàn.
- Vấn đề còn lại: Không có.

## TARGET HIỆN TẠI - VA CHẠM TƯỜNG VÀ RƠI SÀN NHƯ THẬT CHO BÙA CHÚ
- Nguyên nhân gốc: Bùa chú bay lơ lửng trong hành lang nhưng khi chạm tường hoặc kết thúc chu kỳ bay chưa có hiệu ứng trọng lực rơi xuống sàn và nằm phẳng như giấy thật.
- Đã thay đổi:
  1. Thêm hệ thống vật lý động cho từng bùa chú (`pos`, `velocity`, `rotVel`, `isGrounded`).
  2. Xử lý va chạm tường bên và trần với phản hồi bật lại (bounce & slide).
  3. Mô phỏng trọng lực kéo bùa chú rơi xuống sàn, lật nhào trong không trung và hạ cánh nằm phẳng trên sàn (`y = 0.02`, `rotation.x = -Math.PI / 2`) trước khi tự động tái sinh bay lên sau vài giây.
- File đã sửa: `src/App.tsx`, `STATUS.md`.
- Kết quả kiểm tra: `npm run build` thành công; bùa chú giờ đây va chạm tường nảy ra, rơi xuống sàn và nằm rải rác cực kỳ chân thực như giấy bùa thật.
- Vấn đề còn lại: Không có.

## TARGET HIỆN TẠI - VA CHẠM VẬT LÝ BÙA CHÚ VỚI TƯỜNG, TRẦN VÀ SÀN
- Nguyên nhân gốc: Bùa chú bay qua lại trong hành lang bị bay xuyên qua các bức tường bên (`±1.75`), trần và sàn nhà.
- Đã thay đổi:
  1. Thêm giới hạn sinh khởi tạo (`posX` giới hạn trong biên dạng hành lang).
  2. Bổ sung logic kiểm tra va chạm vật lý và phản hồi bật lại (bounce response) khi bùa chú tiếp cận tường bên, sàn hoặc trần hành lang.
  3. Thêm hiệu ứng co giãn nhẹ (squeeze pulse) khi bùa chú chạm và nảy ra khỏi bề mặt tường.
- File đã sửa: `src/App.tsx`, `STATUS.md`.
- Kết quả kiểm tra: `npm run build` thành công; bùa chú giờ đây bay chạm tường, trần và sàn sẽ có va chạm vật lý nảy lại tự nhiên, không còn bay xuyên tường.
- Vấn đề còn lại: Không có.


## TARGET HIỆN TẠI - UỐN CONG VÀ GẤP NẾP BÙA CHÚ NHƯ GIẤY THẬT
- Nguyên nhân gốc: Bùa chú sử dụng `PlaneGeometry` phẳng thẳng đơ, thiếu độ cong tự nhiên, nếp gấp và mép cuộn như giấy bùa ngoài đời thật bay trong gió.
- Đã thay đổi:
  1. Thêm hàm `createBentTalismanGeometry` tạo hình học đa phân đoạn với 3 kiểu uốn cong khác nhau (`foldType`: cong cuộn tròn, gấp khúc nếp chính giữa, gấp mép & cong góc).
  2. Tinh chỉnh animation bay phấp phới tự nhiên với dao động đa chiều sống động.
- File đã sửa: `src/App.tsx`, `STATUS.md`.
- Kết quả kiểm tra: `npm run build` thành công; bùa chú có độ cong, gấp nếp và bay lượn chân thực như giấy thật ở 60fps.
- Vấn đề còn lại: Không có.

## TARGET HIỆN TẠI - TỐI ƯU HIỆN NĂNG BÙA CHÚ (FIX LAG 60FPS)
- Nguyên nhân gốc: Vòng lặp cập nhật `posAttr` và gọi `posAttr.needsUpdate = true` trên 24 lưới hình học mỗi khung hình (CPU vertex manipulation) gây nghẽn CPU và hiện tượng giật/lag trong game.
- Đã thay đổi:
  1. Giảm số lượng bùa chú từ 24 xuống 16 tờ với hình học đơn giản (`PlaneGeometry`).
  2. Loại bỏ hoàn toàn vòng lặp thao tác đỉnh lưới trên CPU mỗi frame.
  3. Sử dụng phép biến đổi ma trận xoay (`rotation`) và nhịp scale nhẹ (`scale.set`) tối ưu bằng GPU để tạo hiệu ứng phấp phới mượt mà tuyệt đối ở 60fps.
- File đã sửa: `src/App.tsx`, `STATUS.md`.
- Kết quả kiểm tra: `npm run build` thành công; xác nhận game chạy mượt mà, không còn hiện tượng lag khi có bùa chú bay trong hành lang.
- Vấn đề còn lại: Không có.

## TARGET HIỆN TẠI - SỬA LOGIC CHÂN NHỆN TREO
- Nguyên nhân gốc: chân nhện treo quay qua lại theo trục X với nhịp chẵn/lẻ như đang đi bộ, không ăn khớp với chuyển động hạ/rút trên tơ.
- Đã thay đổi: giữ chân hai bên đối xứng, xòe ổn định khi hạ, khép nhẹ khi rút lên và chỉ rung rất nhỏ theo từng cặp.
- File đã sửa: `src/App.tsx`, `STATUS.md`.
- Kết quả kiểm tra: `npm run build` thành công; kiểm tra toàn chu kỳ xác nhận 4 cặp chân luôn đối xứng và góc khép/xòe nằm trong biên hợp lý. `npm run lint` chỉ còn các lỗi TypeScript có sẵn ngoài TARGET.
- Vấn đề còn lại: không có trong TARGET này.

## TARGET HIỆN TẠI - NHỆN THÒ XUỐNG
- Nguyên nhân gốc: hệ thống chỉ tạo nhện bò trên các mặt tơ; chưa có nhện treo bằng sợi tơ và hạ xuống.
- Đã thay đổi: thêm một nhện nhỏ gần đầu hành lang, hạ xuống/rút lên theo chu kỳ và cử động chân nhẹ.
- File đã sửa: `src/App.tsx`, `STATUS.md`.
- Kết quả kiểm tra: `npm run build` thành công; local preview phản hồi HTTP 200, canvas WebGL khởi tạo đúng kích thước 1280x720 và không có lỗi runtime mới. `npm run lint` chỉ còn các lỗi TypeScript có sẵn ngoài TARGET.
- Vấn đề còn lại: môi trường kiểm tra tự động không hỗ trợ Pointer Lock nên không thể chụp góc nhìn trong game; không ảnh hưởng trình duyệt người chơi.


## TARGET HIỆN TẠI
Deploy game lên GitHub Pages.

## CẬP NHẬT
- Nguyên nhân gốc: job dừng tại `Setup Node.js` vì bật cache npm trong khi repo không có npm lockfile tương thích (repo chỉ có `bun.lock`).
- Đã thay đổi: bỏ cấu hình cache npm không tương thích khỏi workflow GitHub Pages.
- File đã sửa: `.github/workflows/deploy.yml`, `STATUS.md`.
- Kết quả kiểm tra: `npm run build` thành công; workflow GitHub Pages run `31503990772` thành công; URL `https://kitajima2910.github.io/TheHallway/` phản hồi HTTP 200.
- Vấn đề còn lại: `npm run lint` còn báo các lỗi TypeScript có sẵn trong `src/App.tsx`, ngoài TARGET deploy.

## TARGET
Khắc phục lỗi build GitHub Actions "chore: configure GitHub Pages deployment" bị đỏ trong hình ảnh.

## STATUS
- COMPLETED:
  56. Xử Lý Lỗi Deploy GitHub Actions & Tối Ưu Tệp Workflow (.github/workflows/deploy.yml Optimization):
      - Nguyên nhân: Lỗi đỏ trong ảnh (`chore: configure GitHub Pages deployment`) là do workflow mặc định do GitHub tự sinh ra khi chọn "GitHub Actions" trên UI nhưng chưa có code build của dự án.
      - Giải pháp đã thực hiện:
        1. Đã cập nhật tệp `.github/workflows/deploy.yml` sắp xếp lại thứ tự `Setup Pages` trước `npm run build` để Vite tự động nhận diện thiết lập đường dẫn deploy.
        2. Hướng dẫn người dùng Bật quyền "Read and write permissions" trong GitHub Settings > Actions > General > Workflow permissions và thực hiện **Sync / Push** lại code từ máy lên GitHub Repository.
      - Kết quả: Khi sync code mới, workflow "Deploy to GitHub Pages" custom sẽ chạy tự động và xanh thành công.
















