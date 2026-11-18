import{TOPICS}from"../core/config.js";
import{pageTitle,$,$$,esc}from"../core/ui.js";

let theoryCache=null;
async function loadTheory(){
 if(theoryCache)return theoryCache;
 try{
  const response=await fetch("assets/data/theory.json");
  if(!response.ok)throw Error("theory data");
  const payload=await response.json();
  theoryCache=payload.modules||{};
 }catch{theoryCache={}}
 return theoryCache;
}

function reactionCard(reaction){
 return `<article class="reaction-card"><div class="reaction-equation" role="math" aria-label="Phương trình ${esc(reaction.equation)}">${esc(reaction.equation)}</div><dl><div><dt>Điều kiện</dt><dd>${esc(reaction.condition)}</dd></div><div><dt>Hiện tượng</dt><dd>${esc(reaction.phenomenon)}</dd></div><div><dt>Kết luận</dt><dd>${esc(reaction.conclusion)}</dd></div></dl></article>`;
}

export async function render(ctx,params={}){
 let active=TOPICS[params.topic]?params.topic:"halogen";
 const modules=await loadTheory();
 ctx.root.innerHTML=`${pageTitle("Sổ tay phản ứng","Lý thuyết, điều kiện, hiện tượng và lỗi dễ nhầm đã được tách thành dữ liệu để đối chiếu trước khi làm bài.")}<div class="topic-tabs">${Object.entries(TOPICS).map(([k,t])=>`<button data-topic="${k}" class="${k===active?"active":""}">${t.short}</button>`).join("")}</div><div id="theoryRoot"></div>`;
 const draw=key=>{
  active=key;const topic=TOPICS[key],module=modules[key]||{};
  $$(".topic-tabs button").forEach(button=>button.classList.toggle("active",button.dataset.topic===key));
  const objectives=module.objectives||[],concepts=module.conceptBlocks||[],reactions=module.reactions||[],misconceptions=module.misconceptions||[],safety=module.safetyNotes||[];
  $("#theoryRoot").innerHTML=`<section class="theory-layout"><article class="card theory-main"><span class="pill" style="background:${topic.soft};color:${topic.color}">${topic.symbol} • ${esc(topic.district)}</span><h2>${esc(module.title||topic.name)}</h2>${objectives.length?`<div class="learning-objectives"><h3>Mục tiêu</h3><ul>${objectives.map(item=>`<li>${esc(item)}</li>`).join("")}</ul></div>`:""}<div class="concept-grid">${concepts.map(block=>`<section><h3>${esc(block.title)}</h3><p>${esc(block.text)}</p></section>`).join("")}</div><h3>Phương trình và dấu hiệu quan sát</h3><div class="reaction-list">${reactions.map(reactionCard).join("")}</div>${misconceptions.length?`<section class="misconception-list"><h3>Lỗi dễ nhầm</h3><ul>${misconceptions.map(item=>`<li>${esc(item)}</li>`).join("")}</ul></section>`:""}${safety.length?`<section class="safety-list"><h3>An toàn</h3><ul>${safety.map(item=>`<li>${esc(item)}</li>`).join("")}</ul></section>`:""}<div class="theory-actions"><button class="primary-button" id="theoryGame">Thử một chặng</button><button class="ghost-button" id="theoryLab">Mở xưởng phản ứng</button></div></article><aside class="card theory-side" style="background:linear-gradient(145deg,#fff,${topic.soft})"><img class="map-preview" src="${topic.map}" alt="Minh họa ${esc(topic.name)}"><div class="key-card"><b>Trọng tâm của trạm</b><span>${esc(topic.summary)}</span></div><div class="key-card"><b>Trình tự tự học</b><span>Nhận diện nhóm chức, đọc điều kiện, dự đoán hiện tượng, rồi kiểm tra bằng lab.</span></div></aside></section><section class="mindmap-image-card" aria-labelledby="mindmap-${key}"><header><div><p class="eyebrow">SƠ ĐỒ TƯ DUY CUỐI TRẠM</p><h2 id="mindmap-${key}">${esc(topic.name)} trong một trang</h2></div><p>Quan sát toàn cảnh, sau đó quay lại từng phương trình để kiểm tra điều kiện và hiện tượng.</p></header><img src="assets/images/mindmaps/${key}.webp" alt="Sơ đồ tư duy ${esc(topic.name)}" loading="lazy" decoding="async"></section>`;
  $("#theoryGame").onclick=()=>ctx.navigate("game",{topic:key});
  $("#theoryLab").onclick=()=>ctx.navigate("labs",{labId:topic.lab});
 };
 $$(".topic-tabs button").forEach(button=>button.onclick=()=>draw(button.dataset.topic));draw(active);
}
