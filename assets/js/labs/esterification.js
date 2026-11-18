export default {
  id: "esterification",
  name: "Điều chế ester",
  topic: "acid",
  warning: "H₂SO₄ đặc ăn mòn mạnh; ethanol và ethyl ethanoate dễ cháy. Chỉ gia nhiệt bể nước bằng đèn cồn, không hơ trực tiếp ống nghiệm; tắt đèn trước khi lấy ống ra và không ngửi trực tiếp sản phẩm.",
  objective: "Theo dõi đúng trình tự phản ứng ester hóa thuận nghịch và nhận biết pha hữu cơ giàu ethyl ethanoate qua sự tách hai lớp sau khi thêm dung dịch NaCl bão hòa.",
  liquid: "#e5eee2",
  prediction: [
    "Sau khi thêm NaCl bão hòa, pha hữu cơ giàu ester tách ở phía trên",
    "Hỗn hợp đổi màu là bằng chứng đã tạo ester"
  ],
  steps: [
    {
      title: "Trộn các chất phản ứng",
      text: "Cho ethanol và acetic acid vào ống nghiệm khô, sau đó thêm từ từ vài giọt H₂SO₄ đặc. Lắc nhẹ để hỗn hợp đồng nhất.",
      action: "Trộn ethanol, acid và xúc tác",
      observation: "Ba chất tạo hỗn hợp lỏng đồng nhất, gần như không màu. Chưa có dấu hiệu màu sắc nào chứng minh ester đã hình thành.",
      visual: "ester-mixing"
    },
    {
      title: "Gia nhiệt cách thủy bằng đèn cồn",
      text: "Đặt ống nghiệm vào bể nước, châm đèn cồn để làm ấm bể. Nhiệt truyền qua nước sang hỗn hợp; tuyệt đối không hơ ống nghiệm trực tiếp trên ngọn lửa.",
      action: "Châm đèn cồn gia nhiệt cách thủy",
      observation: "Ngọn lửa đèn cồn chỉ gia nhiệt bể nước; nước truyền nhiệt đều sang ống nghiệm. Hỗn hợp vẫn gần như không màu; H₂SO₄ đặc xúc tác phản ứng và góp phần dịch chuyển cân bằng theo chiều tạo ester.",
      visual: "ester-water-bath"
    },
    {
      title: "Làm nguội và thêm NaCl bão hòa",
      text: "Tắt đèn cồn, lấy ống nghiệm khỏi bể và để nguội. Sau đó rót hỗn hợp vào ống chứa dung dịch NaCl bão hòa, lắc nhẹ rồi đặt yên.",
      action: "Làm nguội và thêm nước muối",
      observation: "Đèn cồn đã tắt trước khi chuyển hỗn hợp. Dung dịch NaCl bão hòa làm giảm độ tan của ethyl ethanoate trong pha nước; ranh giới hai pha bắt đầu hiện ra.",
      visual: "ester-brine-transfer"
    },
    {
      title: "Quan sát hai lớp",
      text: "Để yên ống nghiệm. Pha hữu cơ giàu ethyl ethanoate ít tan và có khối lượng riêng nhỏ hơn pha nước muối nên nằm ở phía trên.",
      action: "Quan sát sự tách lớp",
      observation: "Hai lớp gần như không màu tách rõ: pha hữu cơ giàu ester ở trên, pha nước muối ở dưới. Vệt phân cách pha là dấu hiệu quan sát; sự đổi màu không phải bằng chứng tạo ester.",
      visual: "ester-two-layers"
    }
  ],
  equation: "CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O  (H₂SO₄ đặc, đun cách thủy)"
};
