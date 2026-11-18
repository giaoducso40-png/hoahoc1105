export default{
 id:"substitution",
 name:"Thế hay tách?",
 topic:"halogen",
 warning:"KOH và NaOH ăn mòn; ethanol dễ cháy. Chỉ gia nhiệt bằng bể cách thủy, không dùng ngọn lửa trực tiếp.",
 objective:"Theo dõi cùng một mẫu 1-chloropropane trong hai môi trường để phân biệt phản ứng thế và phản ứng tách.",
 liquid:"#b9e2dc",
 prediction:[
  "Nhánh A: NaOH trong nước tạo propan-1-ol",
  "Nhánh B: KOH trong ethanol, đun nóng tạo propene"
 ],
 steps:[
  {
   title:"Nạp hai nhánh phản ứng",
   text:"Cho cùng lượng 1-chloropropane vào hai ống. Thêm NaOH loãng vào nhánh A; thêm KOH trong ethanol vào nhánh B.",
   action:"Nạp hai ống",
   observation:"Hai ống chứa cùng chất ban đầu nhưng khác môi trường phản ứng. Nhánh A được đánh dấu NaOH nước; nhánh B được đánh dấu KOH/ethanol.",
   visual:"branches-ready"
  },
  {
   title:"Gia nhiệt bằng bể cách thủy",
   text:"Đặt hai ống vào bể nước ấm. Nhiệt hỗ trợ cả hai phản ứng; nhánh ethanol tuyệt đối không tiếp xúc ngọn lửa.",
   action:"Bật bể cách thủy",
   observation:"Nước trong bể ấm lên đồng đều. Nhánh A chuyển hóa theo hướng thế; ở nhánh B, propene sinh ra thoát qua ống dẫn khí riêng. Không dùng ngọn lửa trực tiếp với hệ có ethanol.",
   visual:"branches-heated"
  },
  {
   title:"Mở thẻ sản phẩm",
   text:"Đối chiếu sản phẩm của từng nhánh sau khi gia nhiệt, không trộn kết quả của hai môi trường.",
   action:"Đối chiếu A và B",
   observation:"Nhánh A tạo propan-1-ol. Nhánh B xảy ra phản ứng tách HCl dưới tác dụng của KOH trong ethanol, tạo propene; khí được thể hiện đúng trên ống dẫn riêng.",
   visual:"branch-products"
  },
  {
   title:"Chốt quy tắc lựa chọn",
   text:"NaOH trong nước ưu tiên phản ứng thế tạo alcohol; KOH trong ethanol và đun nóng ưu tiên phản ứng tách HX tạo alkene.",
   action:"Hoàn tất lab",
   observation:"Dung môi và điều kiện gia nhiệt quyết định hướng phản ứng của cùng một dẫn xuất halogen.",
   visual:"branch-products"
  }
 ],
 equation:"CH₃CH₂CH₂Cl + NaOH(aq) → CH₃CH₂CH₂OH + NaCl\nCH₃CH₂CH₂Cl + KOH(ethanol) → CH₃CH=CH₂ + KCl + H₂O  (đun nóng)"
};
