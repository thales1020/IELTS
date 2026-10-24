// Exercise bank. Claude appends new entries here on request (newest first).
// Fields: id, date, type, title, instructions, minutes, task_text, reference_answer
window.EXERCISES = [
  {
    id: "2026-10-24-sentence-upgrade-public-art",
    date: "2026-10-24",
    type: "Nâng cấp câu",
    title: "Public art: nâng 3 câu band 5.5 lên band 7+",
    instructions: "Viết lại từng câu dưới đây ở mức band 7+. Giữ nguyên ý, nhưng dùng cấu trúc và từ vựng tốt hơn.",
    minutes: 5,
    task_text:
      "1. Public art is good because many people can see it.\n" +
      "2. The government should not spend too much money on statues because hospitals need money.\n" +
      "3. Some sculptures are very expensive but people do not like them.",
    reference_answer:
      "1. Because public art is displayed in shared spaces, it can be enjoyed by everyone, including people who would never pay to visit a gallery.\n" +
      "2. Governments should be cautious about spending large sums on statues when that money is urgently needed for hospitals.\n" +
      "3. Some sculptures cost a great deal of public money, yet they fail to win the approval of the residents who live with them.",
  },
  {
    id: "2026-10-24-back-translation-public-art",
    date: "2026-10-24",
    type: "Dịch ngược",
    title: "Public art: dịch ngược đoạn thân bài band 8",
    instructions: "Dịch đoạn tiếng Việt dưới đây sang tiếng Anh, sau đó mở đáp án để so sánh từng cụm.",
    minutes: 5,
    task_text:
      "Một tác phẩm điêu khắc hoặc sắp đặt được thiết kế tốt có thể mang lại cho một quảng trường, nhà ga hay công viên bình thường một bản sắc rõ nét hơn và khiến khu vực đó đáng nhớ hơn. " +
      "Không giống như những tác phẩm nằm trong bộ sưu tập tư nhân, nghệ thuật công cộng có thể được chiêm ngưỡng mà không cần trả phí vào cửa, vì vậy lợi ích của nó không chỉ giới hạn ở những người vốn đã thường xuyên đến phòng tranh.",
    reference_answer:
      "A well-designed sculpture or installation can give an ordinary square, station, or park a stronger identity and make the area more memorable. " +
      "Unlike art kept in a private collection, public art can be seen without an entrance fee, so its benefits are not limited to people who already visit galleries.",
  },
];
