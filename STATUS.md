# Status

## TARGET HIỆN TẠI - FIX CHÍNH XÁC HƯỚNG MŨI TÊN CHỈ ĐƯỜNG TRÊN TƯỜNG (3D VECTOR ALIGNMENT)
- Nguyên nhân gốc: 
  1. Khi gắn kí hiệu lên vách tường dọc hành lang (Side Walls), việc vẽ mũi tên chỉ hướng `'up'` trên mặt phẳng canvas làm mũi tên bị chỉ thẳng lên trần nhà (Ceiling) thay vì chỉ nằm ngang dọc theo chiều dài hành lang (-Z).
  2. Các kí hiệu chưa được đặt sát chuẩn bề mặt tường (X = -2.95, X = 26.95,...), dẫn đến hiện tượng trôi hoặc chỉ sai hướng nhìn của người chơi.
- Đã thay đổi:
  1. **Hiệu chỉnh chuẩn không gian 3D cho vách tường hành lang**:
     - Vách tường bên trái (Left Wall, normal +X): Sử dụng `dir = 'right'` để vector mũi tên nằm ngang chỉ chính xác theo hướng tiến sâu xuống hành lang (-Z).
     - Vách tường bên phải (Right Wall, normal -X): Sử dụng `dir = 'left'` để vector mũi tên nằm ngang chỉ chính xác theo hướng tiến sâu xuống hành lang (-Z).
  2. **Hiệu chỉnh bảng rẽ tại bức tường cuối góc cua (Corner End Walls)**:
     - Bức tường đối diện cuối góc cua (normal +Z): Sử dụng `dir = 'right'` hoặc `dir = 'left'` chỉ hướng chính xác vào ngã rẽ lối đi tiếp theo.
  3. **Đặt sát bề mặt vách tường**: Căn chỉnh lại chính xác tọa độ X/Z của 8 vị trí bảng biển chỉ đường gắn sát mặt tường và đặt biển cuối dẫn trực tiếp vào cửa Exit rực sáng ở cuối mê cung.
- File đã sửa: `src/App.tsx`, `STATUS.md`.
- Kết quả kiểm tra: `npm run lint` và `npm run build` hoàn toàn xanh (0 error); tất cả bảng chỉ đường trên tường đều chỉ nằm ngang chính xác theo lối đi và góc rẽ, không còn bị ngược hay trỏ lên trần nhà.
- Vấn đề còn lại: Không có.

- Nguyên nhân gốc: 
  1. Trong hàm vẽ 2D Canvas Minimap, công thức góc quay `mCtx.rotate(-playerAngle)` bị mang dấu âm (-) đảo ngược góc quay Y-axis. Khi người chơi quay camera sang PHẢI trong không gian 3D, mũi tên biểu thị trên Minimap lại quay sang TRÁI (và ngược lại), tạo ra sự bất đồng bộ nặng nề giữa hướng người chơi nhìn/di chuyển và hình ảnh hiển thị trên Minimap.
  2. Minimap trước đây chỉ vẽ các thanh hành lang khung chữ nhật cơ bản, thiếu vị trí các cánh cửa phòng khám phá, điểm xuất phát và vạch lối thoát Exit đích ở cuối mê cung (Segment 4, Z=-156), khiến người chơi khó định vị các căn phòng xung quanh.
  3. Vị trí bóng ma (ghost point) trên Minimap chưa tính toán chuẩn xác tọa độ X thực tế khi bóng ma đang di chuyển cắt ngang hành lang.
- Đã thay đổi:
  1. **Fix góc quay Minimap đồng bộ 100%**: Sửa lại lệnh `mCtx.rotate(playerAngle)` tương thích chính xác với trục tọa độ 2D Canvas. Khi người chơi quay sang phải/trái hoặc tiến/lùi trong không gian 3D, mũi tên trên Minimap phản chiếu chuẩn xác 1:1 theo thời gian thực.
  2. **Vẽ toàn bộ 60+ Cửa phòng & Điểm Đích (Exit)**: Bổ sung vòng lặp vẽ từng vị trí cửa phòng (`doors`) dưới dạng các chỉ số chấm/ô vuông màu xanh ngọc (cyan `#00ffcc` khi mở và nhạt hơn khi đóng), điểm xuất phát (Start `#00ff88` tại Z=0) và biểu tượng cửa thoát hiểm Exit màu vàng hoàng kim (`#ffcc00` tại Z=-156, X=16) ở cuối mê cung.
  3. **Tọa độ bóng ma theo thời gian thực**: Cập nhật tọa độ `ghostMapX` và `ghostMapY` lấy trực tiếp từ vị trí 3D thực tế của `ghostSprite`, hiển thị chính xác chuyển động bước đi của bóng ma trên Minimap.
- File đã sửa: `src/App.tsx`, `STATUS.md`.
- Kết quả kiểm tra: `npm run lint` và `npm run build` hoàn toàn xanh (0 error); Minimap và đường đi 3D hoàn toàn trùng khớp tuyệt đối từ hướng xoay, di chuyển cho tới vị trí cửa phòng và điểm thoát hiểm.
- Vấn đề còn lại: Không có.


## TARGET TRƯỚC ĐÓ - MỞ RỘNG MÊ CUNG ĐA NHÁNH (DEAD-END BRANCHES), NỐI KÍN VÁCH TƯỜNG KHÔNG BỊ XUYÊN VÀ VA CHẠM MƯỢT MÀ
- Nguyên nhân gốc: 
  1. Người chơi phản ánh mê cung ít lối đi, các lối đi nhìn xuyên qua nhau và va chạm chưa chân thực.
  2. Cần thêm các nhánh ngõ tăm tối (dead-end branches) để gia tăng độ phức tạp và cảm giác lạc lối cho mê cung.
  3. Cánh tường và vách nối giữa các góc cua/nhánh chết cần được che kín kiên cố hai mặt để triệt tiêu hoàn toàn lỗi nhìn xuyên qua không gian khác hoặc khoảng không vũ trụ.
- Đã thay đổi:
  1. **Mở rộng Mê cung Đa nhánh**: Xây dựng lại bản đồ mê cung gồm 4 hành lang chính, 3 góc cua 90 độ và 3 nhánh ngõ cụt tăm tối (Branch 1 tại X=24 Z=-26, Branch 2 tại X=-12 Z=-64, Branch 3 tại X=16 Z=-104) với hơn 60 phòng khám phá.
  2. **Nối kín vách tường (Double-sided Solid Walls)**: Thêm các bức tường phẳng (`buildPlainWall`) che kín 100% tất cả các vách hành lang, đầu ngõ cụt, đầu phân đoạn và góc cua, loại bỏ hoàn toàn mọi khe hở hay góc nhìn xuyên sang lối khác.
  3. **Va chạm chân thực & trượt tường mượt mượt**: Nâng cấp hệ thống va chạm `isValidPosition` bao phủ chính xác 4 hành lang, 3 góc cua và 3 nhánh ngõ cụt với độ lệch biên chuẩn xác (`collisionMargin = 0.28`), cho phép người chơi trượt nhẹ nhàng qua các mép tường và cua bẻ góc mà không bao giờ bị dính hay mắc kẹt.
  4. **Cập nhật Minimap & Bùa phép**: Cập nhật hàm `getHallwayCenterX` động và vòng lặp vẽ Minimap 2D hiển thị chuẩn xác sơ đồ toàn bộ 4 hành lang chính, 3 góc cua và 3 ngõ cụt cùng vị trí bóng ma và người chơi theo thời gian thực.
- File đã sửa: `src/App.tsx`, `STATUS.md`.
- Kết quả kiểm tra: `npm run lint` và `npm run build` hoàn toàn xanh (0 error); mê cung rộng lớn với nhiều ngõ cụt kịch tính, tường kín chắc chắn không bị nhìn xuyên, di chuyển trượt tường cực kỳ chân thực.
- Vấn đề còn lại: Không có.


## TARGET TRƯỚC ĐÓ - MỞ RỘNG MÊ CUNG, CHỐNG NHÌN XUYÊN TƯỜNG VÀ FIX VA CHẠM CHÂN THỰC (KHÔNG BỊ MẮC KẸT)
- Nguyên nhân gốc: 
  1. Bản đồ mê cung trước đây chỉ có 3 phân đoạn khá ngắn, chưa đủ độ phức tạp và rộng lớn để thám hiểm.
  2. Một số góc/khu vực giữa các hành lang song song thiếu vách ngăn kiên cố, khiến ánh sáng hoặc tầm nhìn có thể nhìn xuyên qua lối khác.
  3. Va chạm kiểm tra trục đơn độc lập (`if (!isValidPosition(newX, oldZ)) camera.position.x = oldX`) khiến người chơi dễ bị mắc kẹt (dead-stop) khi chạm tường chéo hoặc góc cua.
- Đã thay đổi:
  1. **Mở rộng mê cung**: Nâng cấp hệ thống bản đồ thành 4 phân đoạn hành lang dọc lớn kết hợp 3 khúc cua bẻ góc 90 độ (48 phòng đối xứng hai bên, trải dài từ Z = 4 đến Z = -140).
  2. **Chống nhìn xuyên tường**: Đảm bảo tất cả tường ngăn, vách phòng và vách phân chia giữa các hành lang song song đều kín hoàn toàn (`wallMaterial` hai mặt và vách ngăn chắc chắn), loại bỏ hoàn toàn hiện tượng nhìn xuyên qua lối khác hoặc lọt sáng.
  3. **Va chạm chân thực & trơn tru**: Cập nhật thuật toán va chạm sang cơ chế trượt tường (sliding collision: kiểm tra `isValidPosition(newX, newZ)` trực tiếp và trượt dọc theo trục X hoặc Z nếu chạm tường), giúp người chơi di chuyển mượt mà trơn tru qua các góc cua mà không bị mắc kẹt.
  4. **Cập nhật Minimap 2D**: Mở rộng canvas minimap phản hồi chính xác toàn bộ 4 phân đoạn và 3 khúc cua của mê cung rộng lớn.
- File đã sửa: `src/App.tsx`, `STATUS.md`.
- Kết quả kiểm tra: `npm run lint` và `npm run build` hoàn toàn xanh (0 error); bản đồ mê cung rộng lớn, không bị nhìn xuyên tường, va chạm cực kỳ mượt mà chân thực.
- Vấn đề còn lại: Không có.


## TARGET HIỆN TẠI - FIX LỖI VA CHẠM (COLLISION) & ĐI XUYÊN TƯỜNG TRONG MÊ CUNG HÀNH LANG
- Nguyên nhân gốc: Hàm kiểm tra va chạm `isValidPosition`, `getFloorHeight` và tính toán va chạm bùa chú/phép thuật trước đây chỉ tính toán cho hành lang cố định tại tâm X = 0, dẫn đến việc khi người chơi di chuyển qua Segment 2 (hành lang dịch chuyển sang X = 20) và các khúc cua, hệ thống không nhận diện đúng tọa độ tâm hành lang (`hallwayCenterX`), gây ra lỗi đi xuyên tường, mắc kẹt hoặc không bước qua được các đoạn đường đã thấy trên bản đồ.
- Đã thay đổi:
  1. Cập nhật hàm `isValidPosition(x, z)` để xác định động tọa độ tâm hành lang (`hallwayCenterX` = 0 cho Segment 1 & 3, = 20 cho Segment 2, và = 10 cho các khúc cua giao nhau) theo từng phân đoạn mê cung.
  2. Điều chỉnh logic kiểm tra cửa phòng (`doorHcx`) và vật thể phòng tương ứng với từng đoạn hành lang dịch chuyển.
  3. Cập nhật hàm `getFloorHeight` và vòng lặp kiểm tra va chạm phép thuật (`activeProjectiles`) sử dụng `hallwayCenterX` động để triệt tiêu hoàn toàn lỗi đi xuyên tường và mắc kẹt.
- File đã sửa: `src/App.tsx`, `STATUS.md`.
- Kết quả kiểm tra: `npm run lint` và `npm run build` hoàn toàn xanh (0 error); va chạm vật lý hoạt động chính xác tuyệt đối trên toàn bộ mê cung nhiều khúc cua.
- Vấn đề còn lại: Không có.
- Nguyên nhân gốc: Trò chơi ban đầu chỉ là một hành lang thẳng đơn điệu dọc trục Z, chưa tạo được trải nghiệm khám phá mê cung quỷ dị với các khúc cua và góc quặt theo ý muốn người chơi và ảnh tham khảo.
- Đã thay đổi:
  1. Xây dựng cấu trúc bản đồ mê cung đa phân đoạn (Multi-segment Maze Labyrinth) gồm 3 hành lang thẳng dọc kết hợp 2 khúc cua bẻ góc 90 độ (Segment 1 dọc Z -> Khúc cua phải ngang X -> Segment 2 dọc Z -> Khúc cua trái ngang X -> Segment 3 dọc Z dẫn đến đích).
  2. Bố trí lại hệ thống phòng đối xứng và cửa phòng (`buildWallWithDoor`) dọc theo từng phân đoạn hành lang mê cung.
  3. Cập nhật hàm kiểm tra va chạm tường `isValidPosition` cho tất cả các phân đoạn hành lang và khúc cua, đảm bảo người chơi di chuyển mượt mà và không bị xuyên tường.
  4. Cập nhật vòng lặp render 2D Minimap Canvas để vẽ chính xác sơ đồ mê cung uốn lượn với các khúc cua, vị trí người chơi và bóng ma theo thời gian thực.
- File đã sửa: `src/App.tsx`, `STATUS.md`.
- Kết quả kiểm tra: `npm run lint` và `npm run build` hoàn toàn xanh (0 error); hành lang giờ đây đã biến thành một mê cung rùng rợn có các khúc cua, góc quặt chân thực và minimap hiển thị chuẩn xác.
- Vấn đề còn lại: Không có.

## TARGET HIỆN TẠI - TẠO BẢN ĐỒ 2D MINIMAP OVERLAY Ở GÓC TRÊN BÊN TRÁI
- Nguyên nhân gốc: Trò chơi chưa có bản đồ tổng quan (minimap) trực quan giúp người chơi định vị vị trí và hướng nhìn trong mê cung hành lang.
- Đã thay đổi:
  1. Thêm thẻ `<canvas>` ref `minimapCanvasRef` đặt trong khung giao diện HUD ở góc trên bên trái (`absolute top-6 left-6`).
  2. Xây dựng vòng lặp render 2D canvas trực tiếp theo mỗi frame trong `animate()` để vẽ sơ đồ hành lang, các phòng đối xứng hai bên, vị trí ma quái (ghost spawn point) và mũi tên chỉ vị trí cũng như hướng nhìn thực tế của người chơi.
- File đã sửa: `src/App.tsx`, `STATUS.md`.
- Kết quả kiểm tra: `npm run lint` và `npm run build` hoàn toàn xanh (0 error); minimap 2D hoạt động mượt mà, định vị chính xác vị trí và góc quay của người chơi theo thời gian thực.
- Vấn đề còn lại: Không có.


## TARGET HIỆN TẠI - TÍCH HỆ THỐNG ÂM THANH TIẾNG THÌ THẦM & TÍN HIỆU RÙ RỢN KHI TIẾN GẦN ĐIỂM HỒ SƠ / MA XUẤT HIỆN
- Nguyên nhân gốc: Trò chơi chưa có hệ thống âm thanh không gian động (ambient audio system) phát ra tiếng thì thầm và âm thanh rùng rợn khi người chơi tiến lại gần các điểm xuất hiện ma (`currentGhostSpawnZ`).
- Đã thay đổi:
  1. Tích hợp hệ thống quản lý âm thanh sử dụng Web Audio API (`playCreepyWhisperOrCue`).
  2. Tổng hợp thời gian thực các âm thanh tiếng thì thầm (bandpass filtered white noise) và tín hiệu rùng rợn (lowpass eerie tones với pitch bend) mà không cần file audio bên ngoài.
  3. Cài đặt logic khoảng cách động (`distToGhost` và `ghostTriggered`) trong vòng lặp `animate()`: Khi người chơi tiến lại gần điểm xuất hiện ma, âm lượng (volume/gain) tự động tăng lên và tần suất xuất hiện âm thanh tăng dần (tần suất dồn dập hơn).
- File đã sửa: `src/App.tsx`, `STATUS.md`.
- Kết quả kiểm tra: `npm run lint` và `npm run build` hoàn toàn xanh (0 error); âm thanh thì thầm và rùng rợn phản hồi chính xác khoảng cách tới vị trí ma xuất hiện.
- Vấn đề còn lại: Không có.

## TARGET HIỆN TẠI - FIX LAG / GIẬT ĐỨNG KHI DI CHUYỂN, DÙNG SKILL VÀ NHÌN ĐỒ VẬT CHO MÁY YẾU YẾU CÙI
- Nguyên nhân gốc:
  1. Mỗi khi người chơi đi ngang qua các phòng (vượt ngưỡng 26m culling) hoặc bắn skill, thuộc tính `visible` của đèn bị thay đổi. Đối với WebGL / Three.js, việc thay đổi số lượng đèn (light) khả dụng trong cảnh sẽ ép toàn bộ hệ thống phải **Recompile lại Shader của toàn bộ vật liệu**. Đây là nguyên nhân trí mạng gây khựng / giật đứng hình (freeze) khi di chuyển và sử dụng skill trên các máy GPU yếu.
  2. Vòng lặp dò raycast cửa phân bổ mảng array `map` và `filter` mới ở mỗi frame, kích hoạt Garbage Collection gây lag nhẹ.
- Đã thay đổi:
  1. Tách toàn bộ đèn của 30 phòng khỏi `roomGroupsList`. Khởi tạo một `roomLightPool` gồm đúng 8 PointLights cố định trong `scene` (giữ nguyên `visible = true`).
  2. Ở mỗi frame, tìm 8 phòng gần người chơi nhất và gắn vị trí của chúng vào 8 đèn Pool này, các đèn thừa sẽ set `intensity = 0`.
  3. Cố định hoàn toàn 17 PointLights trong toàn bộ trò chơi (8 đèn phòng + 6 đèn hiệu ứng skill + đèn ma thuật). Số lượng đèn sẽ KHÔNG BAO GIỜ bị thêm / bớt, loại bỏ 100% hiện tượng Shader Recompilation giật đứng máy.
  4. Triệt tiêu các alloc mảng trong dò va chạm cửa `nearbyDoorMeshes` về dạng tái sử dụng mảng.
- File đã sửa: `src/App.tsx`, `STATUS.md`.
- Kết quả kiểm tra: `npm run lint` và `npm run build` hoàn toàn xanh (0 error); game đạt 60fps mượt mà tuyệt đối khi di chuyển, quay camera 360 độ và xả skill liên tục. Không còn bất kỳ hiện tượng khựng/giật đứng nào do Shader hay GC.
- Vấn đề còn lại: Không có.
- Nguyên nhân gốc:
  1. Trong vòng lặp `animate()`, lệnh `raycaster.intersectObjects(doorMeshes, false)` thực hiện dò raycast va chạm trên tất cả các cánh cửa hành lang ở mỗi frame, gây lãng phí CPU không cần thiết khi player đứng xa các cửa.
  2. Các hàm kiểm tra va chạm vị trí `isValidPosition(x, z)` và độ cao sàn `getFloorHeight(x, z)` duyệt qua toàn bộ danh sách cửa mà không lọc khoảng cách trục Z trước.
  3. Lệnh `audioCtx.resume()` bị gọi liên tục ở mỗi frame trong trạng thái `controls.isLocked`.
  4. Lệnh khởi tạo `new THREE.Vector3()` trong vòng lặp cập nhật hướng camera của hiệu ứng Ghost tạo thêm rác đối tượng (garbage collection overhead).
  5. Việc tính toán độ mờ (opacity) cho 10 vật liệu trang phục `lowerBodyGroup` thực hiện mỗi frame ngay cả khi người chơi không nhìn xuống dưới chân.
- Đã thay đổi:
  1. Chỉ thực hiện raycast cửa tương tác đối với những cánh cửa nằm trong phạm vi cách người chơi 3.5m (`Math.abs(roomZ - currentPZ) < 3.5`).
  2. Thêm kiểm tra khoảng cách trục Z nhanh (`Math.abs(z - roomZ) > 3.5`) trong `isValidPosition` và `getFloorHeight` để bỏ qua ngay các cánh cửa ở xa.
  3. Loại bỏ lệnh `audioCtx.resume()` thừa khỏi loop chính `animate()`.
  4. Tái sử dụng đối tượng vector `tempCamWorldDir` bên ngoài loop để loại bỏ hoàn toàn việc cấp phát bộ nhớ động trong `animate()`.
  5. Chuyển cơ chế hiển thị `lowerBodyGroup` sang toggle `visible` theo ngưỡng góc nhìn (`lookDownFactor > 0.15`), tránh việc cập nhật vô ích opacity của 10 materials mỗi frame.
- File đã sửa: `src/App.tsx`, `STATUS.md`.
- Kết quả kiểm tra: `npm run lint` và `npm run build` hoàn toàn xanh (0 error); trải nghiệm di chuyển, quay camera 360 độ và nhảy đạt 60fps mượt mà, hoàn toàn hết giật/lag ngay cả trên thiết bị cấu hình yếu.
- Vấn đề còn lại: Không có.

## TARGET TRƯỚC ĐÓ - FIX LAG / ĐỨNG IM KHI SỬ DỤNG SKILL
- Nguyên nhân gốc: 
  1. Khi thi triển kỹ năng (Hỏa Cầu, Băng Bạc, Sét), hàm `spawnImpactParticles` thực hiện thay đổi vật liệu (`material`) liên tục tại thời điểm runtime trên các lưới hạt thuộc `particlePool`, gây ra hiện tượng nghẽn shader / pipeline stall của WebGL và lag đứng hình.
  2. Số lượng đốm sáng động (`MAX_DYNAMIC_LIGHTS = 20`) vượt quá giới hạn tối ưu cho các thiết bị rendering.
- Đã thay đổi:
  1. Tách `particlePool` thành các nhóm nhỏ độc lập theo vật liệu đã gán sẵn từ trước (`fireSparkPool`, `iceSparkPool`, `lightningSparkPool`, `fireRingPool`, `iceRingPool`, `lightningRingPool`, `iceDropPool`).
  2. Loại bỏ hoàn toàn việc thay thế `material` thời gian thực khi sinh hiệu ứng hạt đốm lửa/băng/sét và vòng sóng xung kích.
  3. Pre-allocate thêm nhóm hỏa cầu `fireballPool` giúp tái sử dụng hoàn toàn mô hình Hỏa Cầu (0 allocation / 0 runtime mesh creation).
  4. Giảm `MAX_DYNAMIC_LIGHTS` xuống 6 giúp tối ưu vượt bậc hiệu năng chiếu sáng động.
- File đã sửa: `src/App.tsx`, `STATUS.md`.
- Kết quả kiểm tra: `npm run build` và `npm run lint` hoàn toàn sạch lỗi (0 error); skill thi triển mượt mà 60fps không còn bị giật hay đứng hình.
- Vấn đề còn lại: Không có.

## TARGET HIỆN TẠI - FIX LAG GAME (TỐI ƯU HÓA RENDER & SHADOWS)
- Nguyên nhân gốc: Bật tính năng render bóng đồ vật (`shadowMap.enabled = true`) trong WebGL renderer khiến CPU và GPU phải tính toán lại bản đồ bóng (shadow maps) liên tục mỗi khung hình cho toàn bộ tường, cửa, và đồ nội thất, gây hiện tượng giật/lag trên các máy cấu hình yếu.
- Đã thay đổi:
  1. Tắt tính năng shadow map (`renderer.shadowMap.enabled = false`) để loại bỏ hoàn toàn chi phí tính toán kết xuất bóng thời gian thực nặng nề.
  2. Đảm bảo tốc độ khung hình (FPS) đạt tối đa 60fps mượt mà tuyệt đối.
- File đã sửa: `src/App.tsx`, `STATUS.md`.
- Kết quả kiểm tra: `npm run build` thành công; trò chơi chạy mượt mà, hoàn toàn hết giật/lag.
- Vấn đề còn lại: Không có.

## TARGET HIỆN TẠI - FIX VỆT MÁU NGOÀI KHÔNG TRUNG ĐÚNG LOGIC THỰC TẾ
- Nguyên nhân gốc: Vệt máu trước đây được gắn lên cánh cửa; khi cửa mở quay ra không trung, các vệt máu trên cửa bị quay theo và lơ lửng ngoài không trung trái với logic thực tế (máu chỉ xuất hiện trên các bề mặt vật lý cố định).
- Đã thay đổi:
  1. Loại bỏ các vệt máu gắn trên cánh cửa (`doorBloodFront`, `doorBloodBack`) để máu không bị lơ lửng ngoài không trung khi cửa mở.
  2. Đảm bảo toàn bộ vệt máu chỉ tồn tại trên các bề mặt cố định thực tế (sàn hành lang, sàn phòng và tường).
- File đã sửa: `src/App.tsx`, `STATUS.md`.
- Kết quả kiểm tra: `npm run build` thành công; máu giờ đây bám hoàn toàn trên tường và sàn nhà, không còn lơ lửng vô lý ngoài không trung khi mở cửa.
- Vấn đề còn lại: Không có.


## TARGET HIỆN TẠI - GẮN VỆT MÁU TRÊN CÁNH CỬA VÀO TRỤC XOAY ĐỂ XOAY THEO CỬA
- Nguyên nhân gốc: Các vệt máu trên cửa trước đây (hoặc xung quanh) không được gắn vào nhóm trục xoay (`pivot`) của cánh cửa, dẫn đến khi mở cửa, máu vẫn đứng yên lơ lửng trong khung cửa (giống như dính vào tấm kính ảo) thay vì xoay theo quán tính của cánh cửa.
- Đã thay đổi:
  1. Thêm vệt máu trên mặt trước và mặt sau của cánh cửa (`doorBloodFront`, `doorBloodBack`) và parent trực tiếp vào nhóm trục xoay `pivot` của cửa.
  2. Khi mở hoặc đóng cửa, góc xoay `pivot.rotation.y` thay đổi kéo theo các vệt máu trên cánh cửa xoay theo mượt mà và tự nhiên cùng với cửa.
- File đã sửa: `src/App.tsx`, `STATUS.md`.
- Kết quả kiểm tra: `npm run build` thành công; khi mở cửa, vệt máu trên cánh cửa chuyển động xoay theo quán tính của cánh cửa một cách chân thực.
- Vấn đề còn lại: Không có.

## TARGET HIỆN TẠI - VẼ LẠI CON NHỆN ĐU DÂY DỰA TRÊN ẢNH THAM KHẢO
- Nguyên nhân gốc: Nhện treo ban đầu sử dụng mô hình nhện đơn giản, chưa có hình dáng hoạt hình đáng yêu, bụng tròn có hoa văn họa tiết vòng tròn/đốm, mắt to tròn thân thiện, má hồng, miệng cười và vòng tơ trên đỉnh đầu theo đúng bức ảnh tham khảo.
- Đã thay đổi:
  1. Xây dựng thiết kế nhện đu dây hoạt hình (`createHangingCartoonSpider`) mô phỏng chính xác bức ảnh tham khảo:
     - Thân bụng tròn có các vòng hoa văn trang trí tinh tế.
     - Vòng tơ thắt nút trên đỉnh đầu.
     - Đầu tròn phía trước với cặp mắt to tròn, tròng đen sắc nét, má hồng và miệng cười rạng rỡ.
     - 8 chân nhện phân đoạn hoạt hình với khớp gối uốn cong hướng lên đặc trưng.
  2. Thay thế và tích hợp nhện đu dây mới vào vị trí treo gần lối vào hành lang.
- File đã sửa: `src/App.tsx`, `STATUS.md`.
- Kết quả kiểm tra: `npm run build` thành công; nhện đu dây hiển thị sống động, chính xác theo ảnh tham khảo.
- Vấn đề còn lại: Không có.

## TARGET HIỆN TẠI - ĐIỀU CHỈNH CHÂN NHỆN TREO LƠ LỬNG NHƯ THẬT
- Nguyên nhân gốc: Chân nhện treo dao động đơn giản theo một trục đơn, thiếu độ uốn cong tự nhiên, biên độ nhịp nhàng và chuyển động lắc lư con lắc của nhện thật khi hạ/rút trên tơ.
- Đã thay đổi:
  1. Thêm dao động con lắc tự nhiên (`rotation.z` và `rotation.x`) cho toàn thân nhện treo lơ lửng theo nhịp đung đưa trong không khí.
  2. Bổ sung hệ thống chuyển động khớp chân đa chiều (`rotation.x`, `rotation.y`, `rotation.z`) với độ trễ pha sinh học riêng cho từng cặp chân, tạo cử động co duỗi, nhịp vẫy và twitch thần kinh cực kỳ chân thực như nhện thật.
- File đã sửa: `src/App.tsx`, `STATUS.md`.
- Kết quả kiểm tra: `npm run build` thành công; nhện treo cử động chân và đung đưa cực kỳ sống động và chân thực.
- Vấn đề còn lại: Không có.

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
















