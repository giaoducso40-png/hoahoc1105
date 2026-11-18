import{TOPICS}from"../core/config.js";
import{topicMetrics}from"../core/store.js";
import{$,$$,esc}from"../core/ui.js";

const CITY_CENTER={x:50,y:48.5};
const CITY_ROUTES={
 halogen:[{x:50,y:42},{x:42,y:37},{x:35.5,y:33.5}],
 alcohol:[{x:50,y:42},{x:58,y:37},{x:64.5,y:33.5}],
 phenol:[{x:45,y:48},{x:39,y:51},{x:32.5,y:53.5}],
 carbonyl:[{x:55,y:48},{x:61,y:51},{x:67.5,y:53.5}],
 acid:[{x:50,y:52},{x:50,y:57},{x:50,y:60}]
};

export async function render(ctx){
 const state=ctx.getState(),name=state.profile.name||"bạn";
 const weakest=Object.keys(TOPICS).map(k=>[k,topicMetrics(k)]).sort((a,b)=>(a[1].count? a[1].accuracy:-1)-(b[1].count?b[1].accuracy:-1))[0][0];
 ctx.root.classList.add("city-v4-root");
 window.addEventListener("molquest:route-leave",()=>ctx.root.classList.remove("city-v4-root"),{once:true});
 const suggestion=state.attempts.length
  ?`Quay lại ${TOPICS[weakest].district}. Bạn còn ${topicMetrics(weakest).wrong} lượt cần xem lại.`
  :"Bắt đầu ở Nhà kính Halogen với một chặng 5 câu để Mol xác định phần cần củng cố.";
 ctx.root.innerHTML=`<section class="city-hero city-v4" aria-label="Bản đồ năm trạm MolQuest">
  <div class="city-welcome"><span class="city-greeting">Chào ${esc(name)}!</span><strong>Hôm nay mình khám phá trạm nào?</strong></div>
  <details class="city-mission"><summary>Gợi ý của Mol</summary><p>${esc(suggestion)}</p></details>
  <div class="city-stations" aria-label="Các trạm khám phá">
  ${Object.entries(TOPICS).map(([key,t])=>{const m=topicMetrics(key),done=m.count&&m.accuracy>=70,art=window.__molStationArt?.[key]||`assets/images/stations/${key}.webp`,status=done?"Đã hoàn thành":m.count?`${m.accuracy}% chính xác • ${m.count} lượt`:"Sẵn sàng khám phá";return `<button class="station-node ${done?"completed":m.count?"in-progress":"ready"}" data-topic="${key}" style="--node:${t.color};--node-soft:${t.soft}" aria-label="Khám phá ${esc(t.district)}. ${esc(status)}"><span class="node-building"><img src="${art}" alt="" draggable="false"><i></i></span><span class="node-label"><b>${esc(t.short)}</b><small>${esc(t.symbol)}</small><em>${esc(status)}</em></span><span class="station-state" aria-hidden="true">${done?"✓":m.count?"↻":"→"}</span></button>`}).join("")}
  </div>
  <div class="map-runner" id="mapRunner" aria-hidden="true"><div class="map-runner-sprite"></div><i></i></div>
  <div class="travel-toast" id="travelToast" role="status"></div>
 </section>`;
 $$(".station-node").forEach(b=>b.onclick=()=>selectStation(ctx,b));
 const map=$(".city-v4"),runner=$("#mapRunner");
 runner.style.left=`${CITY_CENTER.x}%`;runner.style.top=`${CITY_CENTER.y}%`;
  requestAnimationFrame(()=>{
    if(ctx.root.scrollWidth<=ctx.root.clientWidth)return;
    const mapCenter=map.offsetLeft+(map.offsetWidth/2);
    ctx.root.scrollLeft=Math.max(0,mapCenter-(ctx.root.clientWidth/2));
  });
}

function selectStation(ctx,button){
 const map=button.closest(".city-hero");
 const topic=button.dataset.topic,route=CITY_ROUTES[topic];
 if(!route)return;
 const token=(map._travelToken||0)+1;map._travelToken=token;
 if(map._openTimer){clearTimeout(map._openTimer);map._openTimer=null}
 if(map._travelAnimation){try{map._travelAnimation.commitStyles()}catch{}map._travelAnimation.cancel();map._travelAnimation=null}
 map.dataset.travelling="true";
 $$(".station-node").forEach(x=>x.classList.remove("selected"));button.classList.add("selected");
 const name=ctx.getState().profile.name||"Nhà thám hiểm",notice=$("#travelToast"),runner=$("#mapRunner"),mapBox=map.getBoundingClientRect(),currentBox=runner.getBoundingClientRect();
 const current={x:(currentBox.left+currentBox.width/2-mapBox.left)/mapBox.width*100,y:(currentBox.top+currentBox.height/2-mapBox.top)/mapBox.height*100};
 const points=[current];
 if(Math.hypot(current.x-CITY_CENTER.x,current.y-CITY_CENTER.y)>4)points.push(CITY_CENTER);
 route.forEach(point=>points.push(point));
 const segments=points.slice(1).map((point,index)=>Math.hypot(point.x-points[index].x,point.y-points[index].y));
 const total=Math.max(1,segments.reduce((sum,value)=>sum+value,0));let travelled=0;
 const frames=points.map((point,index)=>{if(index){travelled+=segments[index-1]}return{left:`${point.x}%`,top:`${point.y}%`,offset:index?travelled/total:0}});
 const next=points[1]||route.at(-1);runner.dataset.direction=next.x<current.x?"left":"right";
 runner.dataset.target=topic;runner.classList.remove("arrived");runner.classList.add("travelling");
 notice.innerHTML=`Mol đang dẫn <b>${esc(name)}</b> tới ${TOPICS[topic].district}…`;notice.classList.add("show");
 const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches,duration=reduced?1:Math.min(1550,Math.max(950,total*34));
 const animation=runner.animate(frames,{duration,easing:"cubic-bezier(.38,.08,.2,1)",fill:"forwards"});map._travelAnimation=animation;
 animation.finished.then(()=>{
  if(map._travelToken!==token)return;
  const destination=route.at(-1);runner.style.left=`${destination.x}%`;runner.style.top=`${destination.y}%`;
  animation.cancel();map._travelAnimation=null;runner.classList.remove("travelling");runner.classList.add("arrived");
  notice.innerHTML=`Đã tới <b>${TOPICS[topic].district}</b>. Cửa trạm đang mở!`;
  map._openTimer=setTimeout(()=>{if(map._travelToken!==token)return;notice.classList.remove("show");button.classList.remove("selected");map.dataset.travelling="false";openStation(ctx,topic)},reduced?1:320);
 }).catch(()=>{});
}

function openStation(ctx,key){
 const t=TOPICS[key],m=topicMetrics(key),dialog=$("#stationDialog"),box=$("#stationDialogContent");
 box.innerHTML=`<div class="station-shell" style="--station:${t.color};--station-soft:${t.soft}"><div class="station-hero"><div class="station-emblem"><span>${t.symbol}</span><i></i></div><div class="station-intro"><span class="pill">${m.count?`${m.count} lượt đã chốt • ${m.accuracy}% chính xác`:"Điểm đến mới"}</span><h2>${t.district}</h2><p>${t.summary}</p><div class="station-route"><span>Quảng trường Mol</span><b>→</b><strong>${t.name}</strong></div></div></div><div class="station-actions">
  <button class="station-action" data-action="library"><span class="action-art theory-art" aria-hidden="true"><svg viewBox="0 0 72 72"><ellipse class="magic-halo" cx="36" cy="60" rx="25" ry="5"/><path class="magic-book" d="M10 22q14-6 26 3v34q-12-8-26-3Z"/><path class="magic-book" d="M62 22q-14-6-26 3v34q12-8 26-3Z"/><path class="magic-page" d="M18 32q8-3 14 1M18 41q8-3 14 1M54 32q-8-3-14 1M54 41q-8-3-14 1"/><g class="magic-molecule"><circle cx="25" cy="17" r="3"/><circle cx="36" cy="11" r="4"/><circle cx="48" cy="18" r="3"/><path d="M28 15l5-3m7 1 5 3"/></g><path class="magic-spark spark-a" d="M8 12v8m-4-4h8"/><path class="magic-spark spark-b" d="M61 8v7m-4-3.5h8"/></svg></span><span><b>Nhà kính kiến thức</b><small>Lý thuyết, phương trình và điểm dễ nhầm được trình bày bằng thẻ trực quan.</small></span><i>Vào học →</i></button>
  <button class="station-action" data-action="labs"><span class="action-art lab-art" aria-hidden="true"><svg viewBox="0 0 72 72"><ellipse class="magic-halo" cx="36" cy="61" rx="26" ry="5"/><path class="magic-flask" d="M27 9v19L14 52q-5 10 7 10h30q12 0 7-10L45 28V9"/><path class="magic-liquid" d="M20 46h32l5 10q2 5-6 5H21q-8 0-6-5Z"/><path class="magic-rim" d="M23 9h26"/><g class="magic-bubbles"><circle cx="28" cy="51" r="3"/><circle cx="39" cy="55" r="4"/><circle cx="45" cy="44" r="2.5"/><circle cx="33" cy="41" r="2"/></g><path class="magic-spark spark-a" d="M10 20v8m-4-4h8"/><path class="magic-spark spark-b" d="M61 17v7m-4-3.5h8"/></svg></span><span><b>Xưởng phản ứng</b><small>Dụng cụ lớn, hiện tượng theo từng bước và vùng quan sát được đánh dấu rõ.</small></span><i>Vào lab →</i></button>
  <button class="station-action" data-action="game"><span class="action-art game-art" aria-hidden="true"><svg viewBox="0 0 72 72"><ellipse class="magic-halo" cx="36" cy="61" rx="26" ry="5"/><path class="magic-route" d="M8 50q10-13 21-5t17-8 18-10"/><path class="magic-flag" d="M58 11v23m1-21h10l-4 5 4 5H59"/><rect class="magic-robot" x="14" y="20" width="39" height="31" rx="11"/><circle class="magic-eye" cx="27" cy="34" r="4"/><circle class="magic-eye" cx="41" cy="34" r="4"/><path d="M34 10v10M28 44q6 5 12 0"/><circle class="magic-antenna" cx="34" cy="9" r="3"/><path class="magic-spark spark-a" d="M8 13v8m-4-4h8"/></svg></span><span><b>Đường thử thách</b><small>Robot Mol chạy tới vạch phản ứng rồi mới mở câu hỏi để học sinh suy luận.</small></span><i>Bắt đầu →</i></button>
 </div></div>`;
 $$(".station-action").forEach(b=>b.onclick=()=>{dialog.close();ctx.navigate(b.dataset.action,{topic:key,labId:t.lab})});dialog.showModal();
}
