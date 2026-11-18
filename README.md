# MolQuest – Thành phố Hóa chất 11

Học liệu tĩnh về **Dẫn xuất hydrocarbon Hóa học 11**, chạy trực tiếp trên GitHub Pages, không cần cơ sở dữ liệu hoặc khóa API. Dữ liệu học tập được lưu trong `localStorage` của trình duyệt.

Phiên bản phát hành hiện tại: **V6**. Khi chuyển dự án sang tài khoản khác, đọc `HUONG_DAN_TIEP_TUC.md` trước khi chỉnh sửa.

## Nguồn nội dung

- Tệp Word gốc do tác giả cung cấp được lưu tại `sources/Dan_xuat_hydrocarbon_lop_11.docx` để đối chiếu câu hỏi và lý thuyết.
- `assets/data/questions.json` lưu ngân hàng câu hỏi đã số hóa, giữ trường `sourceQuestionNumber` để truy ngược số câu trong tài liệu nguồn.
- `assets/data/theory.json` lưu phần kiến thức cốt lõi, phản ứng, hiện tượng, kết luận, lỗi dễ nhầm và lưu ý an toàn đã chuẩn hóa từ tài liệu nguồn.
- Các câu có hình công thức cấu tạo dùng ảnh trích xuất trong `assets/reference/`; không tự suy đoán lại cấu trúc bị thiếu trong văn bản thuần.

## Điểm mới của phiên bản Thành phố Hóa chất

- Màn nhập tên xuất hiện ở lần mở đầu; không gán sẵn tên người chơi. Trình duyệt ghi nhớ riêng từng hồ sơ và tiến độ trên chính thiết bị đó.
- Nút đăng xuất kết thúc phiên nhưng giữ hồ sơ để người chơi nhập lại đúng tên và tiếp tục. Chỉ chức năng “Đặt lại hành trình” mới xóa dữ liệu của hồ sơ hiện tại sau bước xác nhận.
- Bản đồ năm khu: dẫn xuất halogen, alcohol, phenol, hợp chất carbonyl và carboxylic acid.
- Mỗi khu có ba cửa: sổ tay kiến thức, xưởng phản ứng và đường thử thách. Khi chọn trạm, công trình nổi sáng và robot Mol chạy tới đúng vị trí trước khi cửa trạm mở.
- 69 câu từ tài liệu nguồn; 67 câu đã thẩm định được đưa vào lượt chơi, 2 câu còn nghi vấn được giữ lại với trạng thái chờ rà soát.
- Logic **một câu – một lần chốt – một kết quả**. Sai không được thử lại ngay và không lộ đáp án trong lượt.
- Trạm sửa sai chỉ mở sau khi kết thúc chặng.
- Dashboard có vòng phủ ngân hàng câu hỏi, tháp năm tầng, độ chính xác theo khu, nội dung cần xem lại và dòng thời gian; mọi số liệu đều lấy từ kết quả đã chốt.
- Sáu lab tách mô-đun, dùng sơ đồ 2D rõ nét theo cùng một bố cục: mô phỏng bên trái, bốn bước thao tác bên phải; mỗi lần bấm chỉ kích hoạt một biến đổi quan sát được. Màu chất, kết tủa, khí, lớp bạc và sự tách lớp chỉ xuất hiện ở đúng bước phản ứng tương ứng.
- Robot Mol chạy bằng chu kỳ tám khung; bộ bình thủy tinh 2.5D rơi theo từng chặng và chính va chạm tại vạch phản ứng kích hoạt câu hỏi. Hiệu ứng hỗ trợ `prefers-reduced-motion`.
- Âm thanh mặc định tắt và chỉ tải sau thao tác của người dùng.

## Sáu lab

1. Thế hay tách dẫn xuất halogen.
2. Oxi hóa alcohol bằng CuO.
3. Phenol và nước bromine.
4. Phản ứng tráng bạc.
5. Carboxylic acid và sodium hydrogencarbonate.
6. Điều chế ester bằng đun cách thủy và tách lớp với dung dịch NaCl bão hòa.

## Đưa lên GitHub Pages

1. Giải nén tệp ZIP.
2. Tải **toàn bộ nội dung bên trong thư mục đã giải nén** lên nhánh `main` của repository.
3. Đảm bảo `index.html` nằm ngay ở thư mục gốc repository.
4. Mở **Settings → Pages**.
5. Chọn **Deploy from a branch**, nhánh `main`, thư mục `/ (root)`.
6. Chờ GitHub cung cấp địa chỉ website.

Không tải nguyên một thư mục bọc bên ngoài vào repository nếu việc đó làm `index.html` nằm ở tầng thứ hai.

## Kiểm thử

```bash
python3 tests/verify.py
```

Bộ kiểm thử kiểm tra:

- số lượng và đáp án của 69 câu;
- đường dẫn tư liệu;
- sáu mô-đun lab;
- cú pháp JavaScript;
- các lỗi chữ và công thức đã cấm;
- khóa logic một câu chỉ có một đường ghi kết quả;
- cấu trúc chạy trên GitHub Pages.

Bản phát hành đã được chạy trực tiếp đủ bốn bước của cả sáu lab và hoàn tất một chặng năm câu; không ghi nhận lỗi JavaScript của ứng dụng, tràn ngang hoặc ngắt dòng thủ công trong nội dung.

Luồng nhập tên, đăng xuất, đăng nhập lại và khôi phục tiến độ cũng được thử trực tiếp. Dữ liệu được lưu cục bộ trong trình duyệt, không phải tài khoản trực tuyến và không tự đồng bộ sang máy khác.

## Lưu ý khoa học và an toàn

- Công thức, danh pháp và phương trình được dựng bằng văn bản, không lấy chữ sinh tự động trong ảnh làm đáp án.
- Phenol, bromine, HCN, H₂SO₄ đặc và thuốc thử Tollens chỉ xuất hiện trong mô phỏng có cảnh báo.
- Thuốc thử Tollens phải mới pha, dùng ngay và không để khô cặn.
- Không nếm hoặc ngửi trực tiếp hóa chất.
- Không bịt kín hệ thống sinh CO₂.
- Phản ứng ester hóa được mô phỏng bằng đun cách thủy; sự tách lớp sau khi thêm dung dịch NaCl bão hòa mới là quan sát trực quan, không dùng đổi màu làm bằng chứng tạo ester.

## Cấu trúc chính

```text
index.html
assets/
  css/app.css
  css/dashboard.css
  data/questions.json
  images/
  audio/
  js/
    app.js
    core/
    stations/
    labs/
tests/verify.py
sources/Dan_xuat_hydrocarbon_lop_11.docx
```
