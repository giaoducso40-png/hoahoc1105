import{TOPICS}from"../core/config.js";
import{metrics,topicMetrics}from"../core/store.js";
import{pageTitle,fmtTime,esc}from"../core/ui.js";

export async function render(ctx){
 const state=ctx.getState(),m=metrics(),rawName=state.profile.name||"nhà thám hiểm",name=esc(rawName);
 const topicRows=Object.entries(TOPICS).map(([key,t])=>[key,t,topicMetrics(key)]);
 const weak=topicRows.filter(x=>x[2].count).sort((a,b)=>a[2].accuracy-b[2].accuracy)[0]||topicRows[0];
 const recent=state.attempts.slice(-6).reverse();
 const needsReview=topicRows.map(([k,t,v])=>({k,name:t.name,wrong:v.wrong})).filter(x=>x.wrong).sort((a,b)=>b.wrong-a.wrong).slice(0,3);
 const coverage=Math.min(100,Math.round(m.unique/69*100)),labRate=Math.round(m.labs/6*100);
 ctx.root.innerHTML=`${pageTitle(`Tiến độ của ${rawName}`,`Kết quả của ${rawName} được tính theo từng lượt đã chốt. Bấm tiếp tục không tạo thêm kết quả.`)}
 <section class="dash-overview">
  <article class="card dash-welcome"><div><span class="pill">THẺ HÀNH TRÌNH • ${name}</span><h2>${m.completed?`${name} đã có ${m.completed} dấu mốc học tập.`:`Chào ${name}, chuyến khám phá đầu tiên đang chờ.`}</h2><p>${m.completed?`Mol đã khoanh vùng <strong>${weak[1].name}</strong> để ${name} ưu tiên. Một chặng 5 câu đủ để kiểm tra lại phần kiến thức này.`:`Hãy làm một chặng ngắn để Mol dựng bản đồ thế mạnh và nội dung cần xem lại cho ${name}.`}</p><div class="dash-actions"><button class="primary-button" id="continueMission">Chạy chặng đề xuất</button><button class="ghost-button" id="openWeak">Mở sổ tay trạm</button></div></div>
   <div class="progress-orbit" style="--progress:${coverage*3.6}deg"><div><strong>${coverage}%</strong><span>phủ ngân hàng câu hỏi</span></div></div>
  </article>
  <article class="card tower-card"><div class="tower-copy"><p class="eyebrow">THÁP CHINH PHỤC</p><h2>Năm tầng kiến thức</h2><p>Mỗi tầng sáng lên khi đã có lượt chốt tại khu tương ứng.</p></div><div class="learning-tower">${topicRows.slice().reverse().map(([k,t,v],i)=>`<div class="tower-floor ${v.count?"visited":""}" style="--floor:${t.color};--floor-soft:${t.soft};--floor-width:${72+i*6}%"><span>${t.symbol}</span><b>${t.short}</b><small>${v.count?`${v.accuracy}%`:`Chưa ghé`}</small></div>`).join("")}</div></article>
 </section>
 <section class="metric-grid dash-metrics">
  <article class="card metric"><i class="metric-icon">✓</i><small>Lượt đã chốt</small><strong>${m.completed}</strong><span>Một câu, một kết quả</span></article>
  <article class="card metric"><i class="metric-icon">◎</i><small>Độ chính xác</small><strong>${m.accuracy}%</strong><span>Tính trên lượt đầu đã lưu</span></article>
  <article class="card metric"><i class="metric-icon">↺</i><small>Câu đã tự sửa</small><strong>${m.repaired}</strong><span>Sai ở lượt trước, đúng ở lượt sau</span></article>
  <article class="card metric"><i class="metric-icon">⚗</i><small>Lab hoàn tất</small><strong>${m.labs}/6</strong><span>${labRate}% tuyến thí nghiệm</span></article>
 </section>
 <section class="dash-detail-grid">
  <article class="card panel topic-panel"><div class="panel-heading"><div><p class="eyebrow">ĐỘ CHÍNH XÁC THEO KHU</p><h2>Năm khu, năm tín hiệu</h2></div><span>Không dùng điểm game thay cho kết quả học</span></div>${topicRows.map(([k,t,v])=>`<div class="topic-meter" style="--topic:${t.color};--value:${v.count?v.accuracy:0}%"><div class="topic-badge">${t.symbol}</div><div><b>${t.name}</b><small>${v.count?`${v.count} lượt đã chốt`:`Chưa có dữ liệu`}</small></div><div class="meter-track"><i></i></div><strong>${v.count?v.accuracy:0}%</strong></div>`).join("")}</article>
  <article class="card panel review-panel"><p class="eyebrow">TRẠM SỬA SAI</p><h2>Ba nội dung cần ghé lại</h2><ol class="review-list">${needsReview.length?needsReview.map((x,i)=>`<li><span>${i+1}</span><div><b>${x.name}</b><small>${x.wrong} lượt chưa chính xác</small></div></li>`).join(""):`<li class="empty-review"><span>✓</span><div><b>Chưa có lượt sai</b><small>Mol sẽ cập nhật sau chặng đầu tiên.</small></div></li>`}</ol></article>
  <article class="card panel activity-panel"><p class="eyebrow">NHỊP HỌC GẦN ĐÂY</p><h2>Dòng thời gian</h2><div class="activity-list">${recent.length?recent.map(a=>`<div class="activity"><i class="${a.correct?"good":"review"}"></i><span><b>${TOPICS[a.topic]?.name||a.topic}</b><small>Câu ${a.sourceQuestionNumber} • ${new Date(a.submittedAt).toLocaleString("vi-VN")}</small></span><strong>${a.correct?"Đúng":"Cần ôn"}</strong></div>`).join(""):`<p class="note">Chưa có hoạt động. Thành phố vẫn đang giữ chỗ cho bạn.</p>`}</div></article>
  <article class="card panel time-panel"><div class="time-dial"><span>◷</span><strong>${fmtTime(m.time)}</strong><small>thời gian chặng đã hoàn tất</small></div><p>Chỉ tính các chặng đã kết thúc; thời gian để tab ẩn không được cộng.</p></article>
 </section>`;
 document.querySelector("#continueMission").onclick=()=>ctx.navigate("game",{topic:weak[0]});
 document.querySelector("#openWeak").onclick=()=>ctx.navigate("library",{topic:weak[0]});
}
