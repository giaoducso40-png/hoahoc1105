export default{
 id:"cuo",
 name:"Alcohol và CuO",
 topic:"alcohol",
 warning:"Dây đồng nóng và ethanol dễ cháy. Dùng đèn cồn, đậy nắp để tắt lửa rồi mới đưa dây sang ống nghiệm; không ngửi trực tiếp ethanal.",
 objective:"Quan sát sự biến đổi ngay trên bề mặt dây đồng: Cu đỏ tạo CuO đen khi nung trong không khí; CuO nóng bị ethanol khử, để lộ lại Cu đỏ.",
 liquid:"#eef1e9",
 prediction:[
  "Lớp CuO đen giảm dần và đồng đỏ xuất hiện trở lại",
  "Toàn bộ chất lỏng chuyển thành màu đen"
 ],
 steps:[
  {
   title:"Nung dây đồng sạch trên đèn cồn",
   text:"Đưa đoạn dây đồng cần khảo sát vào vùng nóng của ngọn lửa đèn cồn. Giữ cố định để oxygen trong không khí oxi hóa bề mặt dây.",
   action:"Nung dây đồng",
   observation:"Màu đỏ đồng tối dần rồi chuyển thành lớp CuO màu đen chỉ trên bề mặt dây; dụng cụ và chất lỏng không đổi màu.",
   visual:"black-cuo"
  },
  {
   title:"Đưa dây ra khỏi ngọn lửa và hạ vào ethanol",
   text:"Đậy nắp đèn cồn để tắt lửa, sau đó chuyển ngay dây CuO còn nóng sang ống nghiệm và hạ phần phủ đen vào ethanol.",
   action:"Hạ dây vào ethanol",
   observation:"Ngọn lửa đã tắt; phần dây phủ CuO được hạ vào ethanol. Chỉ lớp CuO trên dây phản ứng, không có chất đen lan vào dung dịch.",
   visual:"immersed-cuo"
  },
  {
   title:"Theo dõi lớp CuO bị khử",
   text:"Giữ dây trong mẫu và quan sát màu thay đổi lan dần dọc theo phần dây đang tiếp xúc với ethanol.",
   action:"Quan sát đổi màu",
   observation:"Lớp CuO đen mất dần để lộ màu đỏ đồng. Đồng thời, ethanol bị oxi hóa thành ethanal và tạo nước.",
   visual:"copper-restored"
  },
  {
   title:"Đối chiếu hiện tượng và chốt kết luận",
   text:"Dấu hiệu trực quan phải nằm trên dây: Cu đỏ tạo CuO đen khi nung; sau đó CuO đen bị ethanol khử thành Cu đỏ, đồng thời ethanol bị oxi hóa thành ethanal.",
   action:"Hoàn tất lab",
   observation:"Dây đồng trở lại màu đỏ ở vùng đã phản ứng; mẫu không bị nhuộm đen và không xuất hiện bọt khí vô căn cứ.",
   visual:"cuo-concluded"
  }
 ],
 equation:"2Cu + O₂ → 2CuO\nCH₃CH₂OH + CuO → CH₃CHO + Cu + H₂O"
};
