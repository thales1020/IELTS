# IELTS Writing — Kho luyện viết

Repo này dùng để luyện viết IELTS Writing (Task 1 & Task 2) và nhờ Claude chấm điểm, sửa lỗi trực tiếp trong từng bài.

## Cấu trúc

```
templates/           Khung bài mẫu để copy khi viết bài mới
essays/task1/         Các bài Task 1 (biểu đồ/bản đồ/quy trình), mỗi bài 1 file .md
essays/task2/         Các bài Task 2 (essay luận điểm), mỗi bài 1 file .md
resources/
  band-descriptors.md   Tóm tắt tiêu chí chấm điểm IELTS band 5-9
  common-mistakes.md    Nhật ký lỗi lặp lại qua các bài
  vocabulary-bank.md    Từ vựng/collocation hay, tích luỹ dần
progress-log.md       Bảng theo dõi điểm qua thời gian
```

## Quy trình luyện viết

1. **Tạo bài mới**: copy `templates/task1-template.md` hoặc `templates/task2-template.md` vào `essays/task1/` hoặc `essays/task2/`, đặt tên file theo dạng `YYYY-MM-DD-chu-de-slug.md` (ví dụ: `2026-07-03-technology-education.md`).
2. **Điền đề bài** vào phần `## Đề bài` và frontmatter (`topic`, `type`).
3. **Viết bài** vào phần `## Bài viết của tôi`. Ghi lại thời gian làm bài (`time_spent_minutes`) và số từ (`word_count`) — luyện viết trong đúng giới hạn thời gian thi thật (Task 1: ~20 phút, Task 2: ~40 phút) sẽ hiệu quả hơn.
4. **Nhờ Claude review**: mở file trong Claude Code và yêu cầu chấm bài, ví dụ: "Chấm bài essays/task2/2026-07-03-technology-education.md". Claude sẽ:
   - Chấm điểm 4 tiêu chí (dựa theo `resources/band-descriptors.md`) và tính band tổng.
   - Sửa lỗi cụ thể trong bài (câu sai → câu sửa → giải thích).
   - Gợi ý cải thiện cho bài sau.
   - Điền toàn bộ nhận xét vào section `## Nhận xét của Claude` ngay trong file đó.
5. **Cập nhật `progress-log.md`**: thêm 1 dòng mới với điểm và link bài vừa review.
6. **Cập nhật `resources/common-mistakes.md` và `resources/vocabulary-bank.md`** nếu Claude phát hiện lỗi lặp lại hoặc gợi ý từ vựng hay — tra cứu lại trước khi viết bài mới để tránh lặp lỗi cũ.

## Lưu ý

- Điểm band trong repo là **ước tính tham khảo** để luyện tập, không thay thế kết quả chấm thi thật.
- Nên viết bài mới đều đặn (ví dụ 2-3 bài/tuần) và xem lại `progress-log.md` định kỳ để đánh giá xu hướng tiến bộ.
