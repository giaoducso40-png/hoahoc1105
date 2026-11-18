const STYLE_HREF="assets/css/lab-acid-v5.css";
if(typeof document!=="undefined"&&!document.querySelector(`link[href="${STYLE_HREF}"]`)){
 const link=document.createElement("link");link.rel="stylesheet";link.href=STYLE_HREF;document.head.append(link);
}

const scene=`<div class="acid-simulation" aria-hidden="true">
 <div class="acid-flask">
  <span class="acid-liquid"></span>
  <i class="acid-contact"></i>
  <div class="acid-bubbles"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
  <div class="acid-gas"><i></i><i></i><i></i></div>
 </div>
 <div class="bicarbonate-spoon"><i class="powder-bed"></i><span class="powder-stream"><b></b><b></b><b></b><b></b><b></b></span></div>
 <span class="acid-label">CH₃COOH</span><span class="bicarbonate-label">NaHCO₃</span><strong class="co2-label">CO₂</strong>
</div>`;

export default{
 id:"carbonate",
 sceneClass:"acid",
 asset:"carbonate",
 name:"Acid và hydrogencarbonate",
 topic:"acid",
 warning:"Giữ bình phản ứng luôn hở. Không bịt kín hệ sinh khí; cho NaHCO₃ từng phần để CO₂ thoát an toàn.",
 objective:"Quan sát NaHCO₃ tiếp xúc với acetic acid, tạo bọt CO₂ từ đúng vùng phản ứng rồi yếu dần khi chất phản ứng cạn.",
 liquid:"#dbeff0",
 scene,
 prediction:["NaHCO₃ tan dần và khí CO₂ thoát ra","Dung dịch chỉ đổi màu nhưng không tạo khí"],
 steps:[
  {title:"Chuẩn bị bình acid và thìa hóa chất",text:"Bình tam giác chứa dung dịch acetic acid được để hở. Đưa thìa NaHCO₃ tới sát miệng bình nhưng chưa cho chất rắn tiếp xúc với dung dịch.",action:"Đưa thìa tới miệng bình",observation:"Dung dịch acetic acid gần như không màu; NaHCO₃ còn nằm trên thìa nên chưa có bọt khí.",visual:"spoon-ready",aria:"Thìa chứa sodium hydrogencarbonate đặt trên miệng bình acetic acid; chưa xảy ra phản ứng."},
  {title:"Nghiêng thìa cho NaHCO₃ vào bình",text:"Nghiêng thìa từ từ để hạt NaHCO₃ rơi đúng vào dung dịch. Không đổ dồn một lần và không che kín miệng bình.",action:"Nghiêng thìa và đổ từ từ",observation:"Hạt NaHCO₃ chạm bề mặt dung dịch; bọt CO₂ bắt đầu xuất hiện ngay tại vùng tiếp xúc.",visual:"powder-contact",aria:"Thìa nghiêng; sodium hydrogencarbonate rơi vào dung dịch và bọt khí bắt đầu hình thành tại điểm tiếp xúc."},
  {title:"Theo dõi dòng khí CO₂",text:"Quan sát bọt sinh ra trong bình, đi từ vùng phản ứng lên mặt chất lỏng rồi thoát qua miệng bình hở.",action:"Quan sát khí thoát ra",observation:"Nhiều bọt CO₂ không màu đi lên trong dung dịch và thoát ra ở miệng bình; dung dịch không tạo chất rắn mới.",visual:"co2-strong",aria:"Nhiều bọt carbon dioxide sinh ra trong dung dịch, chuyển động lên trên và thoát qua miệng bình."},
  {title:"Quan sát phản ứng giảm dần",text:"Chờ khi phần lớn NaHCO₃ đã phản ứng. Tốc độ sinh khí phải giảm dần, không còn bọt xuất hiện ngẫu nhiên bên ngoài bình.",action:"Chờ bọt khí giảm",observation:"Bọt CO₂ thưa dần rồi gần như dừng; phần chất rắn đã tan đáng kể và dung dịch vẫn trong.",visual:"co2-fading",aria:"Bọt carbon dioxide trong bình thưa dần vì các chất phản ứng sắp hết."}
 ],
 equation:"CH₃COOH + NaHCO₃ → CH₃COONa + CO₂↑ + H₂O"
};
