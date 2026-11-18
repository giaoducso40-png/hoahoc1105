const phenolBromineLab = {
  id: "phenol-bromine",
  name: "Phenol và nước bromine",
  topic: "phenol",
  warning: "Phenol độc, gây bỏng; bromine độc và ăn mòn. Thí nghiệm thật phải dùng kính, găng tay và thực hiện trong tủ hút.",
  objective: "Theo dõi đồng thời sự mất màu của nước bromine và sự hình thành kết tủa trắng 2,4,6-tribromophenol.",
  liquid: "#f7faf5",
  prediction: [
    "Màu bromine mất dần và kết tủa trắng xuất hiện",
    "Chỉ xuất hiện bọt khí không màu"
  ],
  steps: [
    {
      id: "phenol-sample",
      stage: "Mẫu ban đầu",
      title: "Chuẩn bị mẫu phenol",
      text: "Đặt ống nghiệm chứa khoảng 2 mL dung dịch phenol loãng, gần như không màu, vào giá ống nghiệm.",
      action: "Đặt mẫu phenol",
      observation: "Dung dịch phenol loãng gần như không màu, trong suốt; chưa có kết tủa và không có bọt khí.",
      visual: "phenol-ready",
      effect: {
        bromineColor: 1,
        precipitateLevel: 0,
        dropCount: 0
      }
    },
    {
      id: "add-bromine",
      stage: "Thao tác",
      title: "Thêm nước bromine từng giọt",
      text: "Đặt đầu ống nhỏ giọt ngay trên miệng ống nghiệm rồi nhỏ chậm nước bromine màu vàng nâu vào dung dịch phenol.",
      action: "Nhỏ từng giọt",
      observation: "Mỗi giọt nước bromine màu vàng nâu mất màu nhanh tại vùng tiếp xúc; dung dịch bắt đầu vẩn đục trắng, không sinh khí.",
      visual: "bromine-drops",
      effect: {
        bromineColor: 0.65,
        precipitateLevel: 0.18,
        dropCount: 3
      }
    },
    {
      id: "observe-reaction",
      stage: "Hiện tượng",
      title: "Theo dõi mất màu và tạo kết tủa",
      text: "Lắc nhẹ ống nghiệm để trộn đều. Theo dõi đồng thời màu nước bromine và các bông kết tủa trong toàn bộ phần chất lỏng.",
      action: "Quan sát phản ứng",
      observation: "Màu vàng nâu biến mất; kết tủa trắng 2,4,6-tribromophenol tạo thành dưới dạng các bông nhỏ phân tán rồi tăng dần.",
      visual: "precipitate-growing",
      effect: {
        bromineColor: 0.12,
        precipitateLevel: 0.78,
        dropCount: 0
      }
    },
    {
      id: "phenol-conclusion",
      stage: "Kết luận",
      title: "Chốt dấu hiệu nhận biết",
      text: "Nhóm hydroxy hoạt hóa vòng benzene nên bromine thế vào các vị trí 2, 4 và 6. Để yên, kết tủa trắng lắng dần xuống đáy ống nghiệm.",
      action: "Hoàn tất lab",
      observation: "Nước bromine mất màu và kết tủa trắng xuất hiện đồng thời; không có hiện tượng sủi bọt hay thoát khí.",
      visual: "precipitate-settled",
      effect: {
        bromineColor: 0,
        precipitateLevel: 1,
        dropCount: 0
      }
    }
  ],
  equation: "C₆H₅OH + 3Br₂ → C₆H₂Br₃OH↓ + 3HBr",
  product: "2,4,6-tribromophenol",
  conclusion: "Phenol làm mất màu nước bromine và tạo kết tủa trắng 2,4,6-tribromophenol.",
  commonErrors: [
    "Chỉ mô phỏng nước bromine mất màu nhưng không tạo kết tủa trắng.",
    "Tạo bọt khí hoặc đổi dung dịch sang màu không có trong hiện tượng thật.",
    "Cho kết tủa xuất hiện trước khi nước bromine tiếp xúc với phenol."
  ]
};

export default phenolBromineLab;

