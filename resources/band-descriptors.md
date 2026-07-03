# Tóm tắt Band Descriptors — IELTS Writing

Tài liệu này tóm tắt (không phải bản đầy đủ chính thức của IELTS) các tiêu chí chấm điểm cho Writing Task 1 và Task 2, dùng làm cơ sở tham chiếu để chấm điểm nhất quán giữa các lần review trong repo này.

Task 1 và Task 2 dùng 4 tiêu chí giống nhau về tên nhưng nội dung đánh giá khác nhau ở tiêu chí đầu tiên:
- **Task 1**: Task Achievement (TA)
- **Task 2**: Task Response (TR) — chiếm trọng số cao hơn vì Task 2 chiếm 2/3 điểm Writing tổng.

Điểm tổng Writing = trung bình cộng 4 tiêu chí, làm tròn theo quy tắc IELTS (Task 2 nhân đôi trọng số so với Task 1 khi tính điểm Writing tổng của bài thi, nhưng trong repo này ta chấm độc lập từng bài).

## 1. Task Achievement / Task Response

| Band | Task 1 (TA) | Task 2 (TR) |
|---|---|---|
| 9 | Trả lời đầy đủ mọi yêu cầu, overview rõ và nổi bật, nhấn mạnh đúng trọng tâm số liệu | Trả lời đầy đủ mọi phần của đề, luận điểm phát triển sâu sắc, đầy đủ, thuyết phục |
| 7 | Đủ yêu cầu, có overview rõ ràng, các đặc điểm chính được chọn lọc và làm nổi bật hợp lý | Trả lời rõ ràng các phần của đề, có lập trường nhất quán, luận điểm phát triển đủ nhưng có thể chưa hoàn toàn sâu sắc |
| 6 | Đủ yêu cầu cơ bản, có overview nhưng có thể chưa rõ/chưa đủ nổi bật, một vài chi tiết thừa/thiếu | Trả lời được đề nhưng một số phần phát triển chưa đủ, luận điểm đôi khi thiếu rõ ràng hoặc lặp ý |
| 5 | Trả lời đề một phần, overview còn hạn chế hoặc thiếu, có thể liệt kê số liệu thay vì mô tả xu hướng | Trả lời đề nhưng cách tiếp cận chưa rõ ràng, thiếu luận điểm phát triển, có thể lạc đề một phần |

## 2. Coherence & Cohesion (CC) — áp dụng cho cả 2 task

| Band | Mô tả |
|---|---|
| 9 | Bố cục mạch lạc hoàn hảo, liên kết tự nhiên không lộ dấu vết, phân đoạn hợp lý |
| 7 | Bố cục rõ ràng, dùng từ nối đa dạng và hợp lý, phân đoạn logic, thỉnh thoảng có lỗi nhỏ |
| 6 | Bố cục mạch lạc nhưng đôi khi thiếu logic giữa các câu/đoạn, dùng từ nối còn máy móc hoặc lặp |
| 5 | Có tổ chức nhưng thiếu mạch lạc tổng thể, từ nối dùng sai/thiếu/thừa, phân đoạn chưa hợp lý |

## 3. Lexical Resource (LR) — áp dụng cho cả 2 task

| Band | Mô tả |
|---|---|
| 9 | Từ vựng phong phú, tự nhiên, chính xác tuyệt đối kể cả từ hiếm/collocation phức tạp |
| 7 | Từ vựng đủ đa dạng, dùng được một số từ ít thông dụng, có lỗi chọn từ/collocation/chính tả nhưng không gây khó hiểu |
| 6 | Từ vựng đủ dùng cho chủ đề, có cố gắng dùng từ ít thông dụng nhưng còn lỗi, lỗi chính tả/word form xuất hiện nhưng không cản trở giao tiếp |
| 5 | Từ vựng hạn chế, lặp từ nhiều, lỗi chọn từ/chính tả có thể gây khó hiểu đôi chỗ |

## 4. Grammatical Range & Accuracy (GRA) — áp dụng cho cả 2 task

| Band | Mô tả |
|---|---|
| 9 | Cấu trúc câu đa dạng, hầu như không lỗi, lỗi (nếu có) chỉ do "slip" |
| 7 | Kết hợp câu đơn/phức đa dạng, đa số câu không lỗi, một số lỗi ngữ pháp/dấu câu nhưng hiếm gây khó hiểu |
| 6 | Kết hợp câu đơn/phức nhưng độ chính xác hạn chế, lỗi ngữ pháp xuất hiện thường xuyên hơn nhưng không cản trở giao tiếp |
| 5 | Chỉ dùng được một số cấu trúc phức hạn chế, lỗi ngữ pháp thường xuyên, đôi khi gây khó hiểu |

## Cách dùng trong repo này

Khi review một bài trong `essays/task1/` hoặc `essays/task2/`, Claude sẽ:
1. Chấm điểm ước tính (0.5 band) cho từng tiêu chí ở trên, kèm 1-2 câu giải thích vì sao đạt mức đó (dựa vào bảng trên).
2. Tính band tổng = trung bình cộng 4 tiêu chí (làm tròn theo quy tắc IELTS: .25 làm tròn xuống 0.5 gần nhất, .75 làm tròn lên).
3. Liệt kê lỗi cụ thể trong bài (trích câu sai → câu sửa → giải thích ngắn gọn).
4. Gợi ý 2-3 điểm cải thiện ưu tiên nhất cho lần viết tiếp theo.

> Lưu ý: đây là điểm ước tính tham khảo để luyện tập, không thay thế kết quả chấm thi thật.
