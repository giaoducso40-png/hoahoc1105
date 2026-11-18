import{TOPICS}from"../core/config.js";
import{pageTitle,$,$$,esc,shuffle,fmtTime}from"../core/ui.js";
import{playFx}from"../core/audio.js";

let questionsCache=null,run=null,timer=null,pending=[];
const PHASE={COUNTDOWN:"countdown",RUNNING:"running",FALLING:"falling",IMPACT:"impact",QUESTION:"question",RESOLVED:"resolved",TRANSITION:"transition",FINISHED:"finished"};
const FORMULA_TEXT={
 "assets/reference/vector-image8.png":"CH₃CH₂Cl",
 "assets/reference/vector-image9.png":"CH₂=CHBr",
 "assets/reference/vector-image10.png":"ClCH₂COOH",
 "assets/reference/vector-image11.png":"CF₃CH₂Cl",
 "assets/reference/vector-image12.png":"CH₂=CHCl",
 "assets/reference/vector-image13.png":"CH₂=CHCH₂Br",
 "assets/reference/vector-image14.png":"CH₃CH=C(F)CH₃",
 "assets/reference/vector-image15.png":"(CH₃)₂C=CHI"
};
function later(fn,ms){const id=setTimeout(()=>{pending=pending.filter(x=>x!==id);fn()},ms);pending.push(id);return id}
function clearPending(){pending.forEach(clearTimeout);pending=[]}
async function questions(){if(!questionsCache){const r=await fetch("assets/data/questions.json");if(!r.ok)throw Error("question bank");const data=await r.json();questionsCache=data.filter(question=>question.reviewStatus!=="needs-review")}return questionsCache}
function bottles(kind="ambient"){return [0,1,2,3,4].map((n,i)=>`<span class="reagent-bottle ${kind}" style="--bottle-x:${n*25}%;--bottle-left:${8+i*19}%;--fall-speed:${4.8+i*.38}s;--fall-delay:${i*-1.1}s" aria-hidden="true"></span>`).join("")}

function renderStimulus(question){
 const stimulus=question.stimulus;
 if(stimulus?.type==="reaction-sequence"){
  const nodes=Array.isArray(stimulus.nodes)?stimulus.nodes:[],conditions=Array.isArray(stimulus.conditions)?stimulus.conditions:[];
  return `<div class="reaction-sequence" role="img" aria-label="${esc(stimulus.ariaLabel||"Dãy chuyển hóa hóa học")}">${nodes.map((node,index)=>`${index?`<span class="reaction-arrow" aria-hidden="true"><small>${esc(conditions[index-1]||"")}</small><b>⟶</b></span>`:""}<span class="reaction-node">${esc(node)}</span>`).join("")}</div>`;
 }
 return (question.media||[]).map(src=>`<img class="question-source-image" src="${esc(src)}" alt="Tư liệu của câu hỏi" loading="lazy" decoding="async">`).join("");
}

export async function render(ctx,params={}){
 cleanup();const topic=TOPICS[params.topic]?params.topic:"all",bank=await questions();
 ctx.root.innerHTML=`${pageTitle("Đường thử thách phân tử","Bình hóa chất rơi xuống theo nhịp chạy. Mỗi chướng ngại chỉ được chốt một lần; đáp án và lời giải chỉ mở ở Trạm sửa sai sau chặng.")}
 <section class="game-setup"><article class="card game-copy"><span class="pill">${bank.length} câu đã qua kiểm tra dữ liệu</span><h2>Chọn tuyến khám phá</h2><p>Mol sẽ chạy qua khu vườn. Khi chướng ngại xuất hiện, hoạt cảnh dừng để bạn suy luận. Kết quả được ghi ngay khi bấm <b>Chốt đáp án</b>.</p><div class="setup-form"><label>Chủ đề<select id="gameTopic"><option value="all">Tổng hợp năm khu</option>${Object.entries(TOPICS).map(([k,t])=>`<option value="${k}" ${k===topic?"selected":""}>${t.name}</option>`).join("")}</select></label><label>Số chướng ngại<select id="gameCount"><option value="5">5 câu</option><option value="10">10 câu</option><option value="15">15 câu</option></select></label><button id="startGame" class="primary-button">Mol đã kiểm tra balô – bắt đầu!</button></div></article>
 <article class="card game-preview">${bottles()}<div class="runner-sprite" role="img" aria-label="Robot Mol chạy bằng hai chân"></div><div class="game-preview-copy"><b>Bình chạm vạch, câu hỏi xuất hiện.</b><span>Không cần né bằng phím; bạn tập trung vào suy luận hóa học.</span></div></article></section>`;
 $("#startGame").onclick=()=>start(ctx);
}

async function start(ctx){
 const all=await questions(),topic=$("#gameTopic").value,count=+$("#gameCount").value;
 let pool=all.filter(q=>topic==="all"||q.topic===topic);pool=shuffle(pool).slice(0,Math.min(count,pool.length));
 run={id:`run-${Date.now()}`,phase:PHASE.COUNTDOWN,pool,index:0,attempts:[],startedAt:new Date().toISOString(),startedMs:Date.now(),elapsed:0,selected:null,hintUsed:false,questionOpenedMs:0,resolved:false,runnerAnimation:null};
 ctx.root.innerHTML=`<section class="game-stage" id="gameStage"><div class="game-hud"><span class="hud-chip" id="gameProgress">Chặng 1/${pool.length}</span><span class="hud-chip" id="gameScore">Đúng 0</span><span class="hud-chip" id="gameTime">00:00</span><span class="hud-chip" id="runStatus" aria-live="polite">Mol đang vào vạch xuất phát</span></div>${bottles("ambient stage-ambient")}<span class="reagent-bottle challenge-bottle" id="challengeBottle" aria-hidden="true"></span><div class="runner-sprite" id="runnerSprite" role="img" aria-label="Robot Mol đang chạy"></div><div class="collision-zone" aria-hidden="true"><i></i><span>VẠCH PHẢN ỨNG</span></div><div class="speed-wind one" aria-hidden="true"></div><div class="speed-wind two" aria-hidden="true"></div></section><p class="note">Mol phải chạy tới vùng phản ứng, bình mới rơi. Chỉ sau cú chạm, câu hỏi mới xuất hiện và mỗi chướng ngại chỉ được chốt một lần.</p>`;
 timer=setInterval(()=>{if(run){run.elapsed=Math.floor((Date.now()-run.startedMs)/1000);$("#gameTime")&&($("#gameTime").textContent=fmtTime(run.elapsed))}},1000);
 later(()=>beginApproach(ctx),650);
}

function setRunStatus(text){const status=$("#runStatus");if(status)status.textContent=text}

function beginApproach(ctx){
 if(!run||![PHASE.COUNTDOWN,PHASE.TRANSITION].includes(run.phase))return;
 const stage=$("#gameStage"),runner=$("#runnerSprite"),bottle=$("#challengeBottle");
 run.phase=PHASE.RUNNING;run.resolved=false;
 if(bottle){bottle.onanimationend=null;bottle.classList.remove("dropping","collided","landed")}
 if(run.runnerAnimation){run.runnerAnimation.cancel();run.runnerAnimation=null}
 setRunStatus("Mol đang chạy tới vạch phản ứng…");stage?.classList.add("run-active");
 const runnerBox=runner?.getBoundingClientRect(),zoneBox=$(".collision-zone")?.getBoundingClientRect();
 const distance=runnerBox&&zoneBox?Math.max(120,zoneBox.left-runnerBox.right+Math.min(46,zoneBox.width*.24)):Math.max(150,(stage?.clientWidth||900)*.5);
 const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches,duration=reduced?800:1750;
 if(runner?.animate){run.runnerAnimation=runner.animate([{transform:"translate3d(0,0,0)"},{transform:`translate3d(${distance*.7}px,-4px,0)`,offset:.72},{transform:`translate3d(${distance}px,0,0)`}],{duration,easing:"cubic-bezier(.25,.72,.31,1)",fill:"forwards"})}
 later(()=>dropChallenge(ctx),duration+120);
}

function dropChallenge(ctx){
 if(!run||run.phase!==PHASE.RUNNING)return;
 run.phase=PHASE.FALLING;setRunStatus("Bình hóa chất đang rơi — giữ nhịp!");
 const bottle=$("#challengeBottle");if(!bottle){later(()=>impact(ctx),700);return}
 bottle.style.setProperty("--bottle-x",`${(run.index%5)*25}%`);bottle.classList.remove("dropping","collided");void bottle.offsetWidth;
 // animationend chỉ đánh dấu phần nhìn; đồng hồ trạng thái mới quyết định lúc va chạm.
 // Nhờ vậy chế độ giảm chuyển động không thể mở câu hỏi ngay lập tức.
 const open=()=>bottle.classList.add("landed");bottle.onanimationend=open;bottle.classList.add("dropping");
 later(()=>impact(ctx),matchMedia("(prefers-reduced-motion: reduce)").matches?680:1120);
}

function impact(ctx){
 if(!run||run.phase!==PHASE.FALLING)return;
 run.phase=PHASE.IMPACT;const bottle=$("#challengeBottle"),stage=$("#gameStage");
 if(bottle){bottle.onanimationend=null;bottle.classList.remove("dropping");bottle.classList.add("collided")}
 stage?.classList.remove("run-active");stage?.classList.add("impact");
 if(run.runnerAnimation)run.runnerAnimation.pause();
 setRunStatus("Va chạm! Mol đang mở chướng ngại kiến thức…");
 later(()=>openQuestion(ctx),420);
}

function openQuestion(ctx){
 if(!run||run.phase!==PHASE.IMPACT)return;const q=run.pool[run.index],dialog=$("#questionDialog");
 run.phase=PHASE.QUESTION;run.selected=null;run.hintUsed=false;run.resolved=false;run.questionOpenedMs=Date.now();setRunStatus("Chướng ngại kiến thức");
 $("#questionMeta").textContent=`${TOPICS[q.topic].name} • ${q.level} • Câu nguồn ${q.sourceQuestionNumber}`;$("#questionCounter").textContent=`${run.index+1}/${run.pool.length}`;$("#questionStem").textContent=q.stem;$("#questionFeedback").className="feedback";$("#questionFeedback").textContent="";
 $("#questionMedia").innerHTML=renderStimulus(q);$("#questionMedia").hidden=!$("#questionMedia").innerHTML;
 const options=$("#questionOptions");options.innerHTML=q.type==="short"?'<input id="shortAnswer" class="short-answer" autocomplete="off" placeholder="Nhập câu trả lời">':q.options.map(o=>{const formula=FORMULA_TEXT[o.image]||"",label=esc(o.text||formula),image=o.image&&!formula?`<span class="option-image" aria-hidden="true"><img src="${esc(o.image)}" alt="" loading="lazy" decoding="async"></span>`:"";return `<button class="option-card" type="button" data-answer="${esc(o.id)}" aria-label="Phương án ${esc(o.id)}${label?`: ${label}`:" có hình minh họa"}"><span class="option-letter">${esc(o.id)}</span><span class="option-content">${label?`<span class="option-text">${label}</span>`:""}${image}</span></button>`}).join("");
 $$(".option-card").forEach(b=>b.onclick=()=>{if(run.resolved)return;$$(".option-card").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");run.selected=b.dataset.answer});
 const action=$("#questionAction");action.textContent="Chốt đáp án";action.disabled=false;action.onclick=()=>handleAction(ctx);
 const hint=$("#hintButton");hint.disabled=false;hint.onclick=()=>{if(run.resolved)return;run.hintUsed=true;const f=$("#questionFeedback");f.className="feedback show";f.textContent="Xác định nhóm chức, điều kiện phản ứng và kiểu biến đổi trước khi so phương án. Mol chưa tiết lộ đáp án đâu nhé."};
 dialog.showModal();dialog.scrollTop=0;
}

function handleAction(ctx){if(!run)return;if(run.phase===PHASE.QUESTION)commit(ctx);else if(run.phase===PHASE.RESOLVED)next(ctx)}

function commit(ctx){
 if(run.resolved)return;const q=run.pool[run.index],value=q.type==="short"?($("#shortAnswer")?.value.trim()||""):run.selected;
 if(!value){ctx.toast("Hãy chọn hoặc nhập một đáp án trước khi chốt.");return}
 run.resolved=true;run.phase="resolved";const correct=String(value).trim().toUpperCase()===String(q.answer).trim().toUpperCase();
 const item={runId:run.id,questionId:q.id,topic:q.topic,sourceQuestionNumber:q.sourceQuestionNumber,selectedAnswer:value,correct,hintUsed:run.hintUsed,responseMs:Date.now()-run.questionOpenedMs,submittedAt:new Date().toISOString(),mode:"challenge"};
 run.attempts.push(item);ctx.update(s=>s.attempts.push(item));playFx(correct?"correct":"wrong");
 $$(".option-card").forEach(b=>b.disabled=true);$("#shortAnswer")&&($("#shortAnswer").disabled=true);$("#hintButton").disabled=true;
 const f=$("#questionFeedback");f.className=`feedback show ${correct?"good":"bad"}`;f.innerHTML=correct?"<b>Đúng rồi!</b> Liên kết phản ứng đã khớp. Kết quả của lượt này đã được lưu.":"<b>Chưa đúng.</b> Mol đã đánh dấu để mình xem lại sau khi hết chặng. Kết quả của lượt này đã được lưu.";
 $("#questionAction").textContent=run.index===run.pool.length-1?"Xem kết quả chặng":"Tiếp tục hành trình";
 const score=run.attempts.filter(a=>a.correct).length;$("#gameScore").textContent=`Đúng ${score}`;
}

function next(ctx){
 if(!run||run.phase!==PHASE.RESOLVED)return;$("#questionDialog").close();run.index++;
 if(run.index>=run.pool.length){finish(ctx);return}
 run.phase=PHASE.TRANSITION;$("#gameProgress").textContent=`Chặng ${run.index+1}/${run.pool.length}`;setRunStatus("Mol đổi nhịp cho chặng tiếp theo…");
 const stage=$("#gameStage"),bottle=$("#challengeBottle");stage?.classList.remove("impact","run-active");if(bottle){bottle.onanimationend=null;bottle.classList.remove("dropping","collided","landed")}
 if(run.runnerAnimation){run.runnerAnimation.cancel();run.runnerAnimation=null}
 later(()=>beginApproach(ctx),500);
}

function finish(ctx){
 clearInterval(timer);timer=null;clearPending();if(run.runnerAnimation)run.runnerAnimation.cancel();run.phase=PHASE.FINISHED;const endedAt=new Date().toISOString(),seconds=Math.max(1,Math.floor((Date.now()-run.startedMs)/1000)),correct=run.attempts.filter(a=>a.correct).length,wrong=run.attempts.filter(a=>!a.correct),rate=Math.round(correct/run.attempts.length*100);
 ctx.update(s=>s.sessions.push({runId:run.id,startedAt:run.startedAt,endedAt,seconds,questions:run.attempts.length,correct}));
 ctx.root.innerHTML=`<section class="card runner-summary"><span class="pill">Lượt khám phá đã hoàn tất</span><h1>${rate>=80?"Tuyến đường đã thông!":rate>=50?"Mol đã khoanh vùng phần cần ôn.":"Mình ghé Trạm sửa sai trước nhé."}</h1><p class="note">Kết quả được tính từ lần chốt duy nhất của từng câu. Làm lại ở chặng sau sẽ tạo lượt mới, không sửa lịch sử cũ.</p><div class="summary-metrics"><div><small>Đúng</small><strong>${correct}/${run.attempts.length}</strong></div><div><small>Độ chính xác</small><strong>${rate}%</strong></div><div><small>Thời gian</small><strong>${fmtTime(seconds)}</strong></div></div>${wrong.length?`<button class="ghost-button" id="toggleRepair">Mở Trạm sửa sai (${wrong.length})</button><div class="repair-panel" id="repairPanel" hidden>${wrong.map(a=>{const q=run.pool.find(x=>x.id===a.questionId);return `<article class="repair-item"><b>${esc(q.stem)}</b><p>Bạn đã chọn: ${esc(a.selectedAnswer)}</p><div class="repair-answer">Đáp án: ${esc(q.answer)}. ${esc(q.explanation)}</div></article>`}).join("")}</div>`:`<p><b>Không có câu cần sửa trong chặng này.</b></p>`}<div style="display:flex;gap:9px;margin-top:20px"><button class="primary-button" id="gameAgain">Chạy chặng mới</button><button class="ghost-button" id="gameDash">Xem dashboard</button></div></section>`;
 $("#toggleRepair")&&($("#toggleRepair").onclick=()=>{$("#repairPanel").hidden=!$("#repairPanel").hidden});$("#gameAgain").onclick=()=>render(ctx);$("#gameDash").onclick=()=>ctx.navigate("dashboard");
}

function cleanup(){clearInterval(timer);timer=null;clearPending();if(run?.runnerAnimation)run.runnerAnimation.cancel();if($("#questionDialog")?.open)$("#questionDialog").close();run=null}
window.addEventListener("molquest:route-leave",cleanup);
