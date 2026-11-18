const KEY="molquest.hoa11.v2",OLD_KEY="molquest.hoa11.v1",PROFILES_KEY="molquest.hoa11.profiles.v1";
const fresh=()=>({schemaVersion:2,contentVersion:"2026.11.1",profile:{name:"",onboarded:false,goal:10,userNamedAt:""},settings:{audio:false},attempts:[],sessions:[],labRuns:[],legacyAttempts:[],lastRoute:"city",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});
let state=load();

export function normalizeName(value){
 return String(value??"").normalize("NFC").trim().replace(/\s+/gu," ");
}

export function validateName(value){
 const name=normalizeName(value);
 if(!name)return{valid:false,name,error:"Vui lòng nhập tên của bạn."};
 if([...name].length<2)return{valid:false,name,error:"Tên cần có ít nhất 2 ký tự."};
 if([...name].length>30)return{valid:false,name,error:"Tên tối đa 30 ký tự."};
 if(!/^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N} '\u2019-]*$/u.test(name))return{valid:false,name,error:"Tên chỉ dùng chữ, số, khoảng trắng, dấu gạch nối hoặc dấu nháy đơn."};
 return{valid:true,name,error:""};
}

function clean(value){
 const base=fresh(),s=value&&typeof value==="object"?value:{};
 const safe={...base,...s,profile:{...base.profile,...s.profile},settings:{...base.settings,...s.settings}};
 safe.profile.name=normalizeName(safe.profile.name);
 if([...safe.profile.name].length>30)safe.profile.name=[...safe.profile.name].slice(0,30).join("");
 safe.profile.onboarded=Boolean(safe.profile.onboarded&&safe.profile.name);
 safe.profile.userNamedAt=String(safe.profile.userNamedAt||"");
 safe.profile.goal=[5,10,15].includes(+safe.profile.goal)?+safe.profile.goal:10;
 safe.settings.audio=Boolean(safe.settings.audio);
 safe.attempts=Array.isArray(safe.attempts)?safe.attempts.filter(a=>a&&a.runId&&a.questionId&&typeof a.correct==="boolean").slice(-5000):[];
 safe.sessions=Array.isArray(safe.sessions)?safe.sessions.filter(x=>x&&Number.isFinite(+x.seconds)).slice(-1000):[];
 safe.labRuns=Array.isArray(safe.labRuns)?safe.labRuns.filter(x=>x&&x.labId).slice(-1000):[];
 safe.legacyAttempts=Array.isArray(safe.legacyAttempts)?safe.legacyAttempts.slice(-5000):[];
 const looksLikeOldPlaceholder=["Bạn","Hiếu"].includes(safe.profile.name)&&!safe.profile.userNamedAt&&!safe.attempts.length&&!safe.sessions.length&&!safe.labRuns.length&&!safe.legacyAttempts.length;
 if(looksLikeOldPlaceholder){safe.profile.name="";safe.profile.onboarded=false}
 safe.lastRoute=["city","dashboard","library","game","labs","profile"].includes(safe.lastRoute)?safe.lastRoute:"city";
 return safe;
}

function migrate(old){
 const next=fresh();
 next.profile.name=normalizeName(old?.profile?.name||"");
 next.profile.onboarded=Boolean(next.profile.name&&next.profile.name!=="Bạn");
 next.profile.goal=[5,10,15].includes(+old?.profile?.goal)?+old.profile.goal:10;
 next.settings.audio=Boolean(old?.audio);
 next.legacyAttempts=Array.isArray(old?.answers)?old.answers:[];
 next.labRuns=Array.isArray(old?.labRuns)?old.labRuns.map(x=>({...x,labId:x.lab||x.labId,legacy:true})):[];
 next.sessions=Array.isArray(old?.sessions)?old.sessions.filter(x=>Number.isFinite(+x.seconds)):[];
 return next;
}

function load(){
 try{const v=JSON.parse(localStorage.getItem(KEY));if(v?.schemaVersion===2)return clean(v)}catch{}
 try{const old=JSON.parse(localStorage.getItem(OLD_KEY));if(old?.version===1){const next=clean(migrate(old));persist(next);return next}}catch{}
 return fresh();
}

function persist(value=state){
 try{value.updatedAt=new Date().toISOString();const json=JSON.stringify(value);localStorage.setItem(KEY+".tmp",json);localStorage.setItem(KEY,json);localStorage.removeItem(KEY+".tmp");if(value.profile?.onboarded&&value.profile?.name){const profiles=loadProfiles();profiles[profileKey(value.profile.name)]=value;localStorage.setItem(PROFILES_KEY,JSON.stringify(profiles))}return true}catch{return false}
}

function profileKey(name){return normalizeName(name).toLocaleLowerCase("vi-VN")}
function loadProfiles(){try{const value=JSON.parse(localStorage.getItem(PROFILES_KEY));return value&&typeof value==="object"&&!Array.isArray(value)?value:{}}catch{return{}}}

export function login(name){
 const result=validateName(name);if(!result.valid)return result;
 const saved=loadProfiles()[profileKey(result.name)];state=clean(saved||fresh());state.profile.name=result.name;state.profile.onboarded=true;state.profile.userNamedAt=state.profile.userNamedAt||new Date().toISOString();persist();return{...result,restored:Boolean(saved)}
}

export function logout(){
 if(state.profile.onboarded&&state.profile.name)persist();state=fresh();try{localStorage.setItem(KEY,JSON.stringify(state));localStorage.removeItem(KEY+".tmp")}catch{}return state
}

export function getState(){return state}
export function update(mutator){mutator(state);state=clean(state);persist();return state}
export function replace(next){state=clean(next);persist();return state}
export function reset(){const currentKey=state.profile?.name?profileKey(state.profile.name):"";if(currentKey){try{const profiles=loadProfiles();delete profiles[currentKey];localStorage.setItem(PROFILES_KEY,JSON.stringify(profiles))}catch{}}state=fresh();try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}return state}
export function exportState(){return JSON.stringify(state,null,2)}
export function importState(raw){const parsed=JSON.parse(raw);if(parsed?.schemaVersion!==2)throw Error("Phiên bản dữ liệu không phù hợp");return replace(parsed)}

export function metrics(){
 const attempts=state.attempts,correct=attempts.filter(a=>a.correct).length;
 const seen=new Set(attempts.map(a=>a.questionId));
 const repaired=new Set(),seenWrong=new Set();
 attempts.forEach(a=>{if(!a.correct)seenWrong.add(a.questionId);else if(seenWrong.has(a.questionId))repaired.add(a.questionId)});
 return {completed:attempts.length,unique:seen.size,accuracy:attempts.length?Math.round(correct/attempts.length*100):0,repaired:repaired.size,labs:new Set(state.labRuns.filter(x=>x.completed).map(x=>x.labId)).size,time:state.sessions.reduce((n,x)=>n+(+x.seconds||0),0)};
}

export function topicMetrics(topic){
 const list=state.attempts.filter(a=>a.topic===topic);const correct=list.filter(a=>a.correct).length;
 return {count:list.length,accuracy:list.length?Math.round(correct/list.length*100):0,wrong:list.filter(a=>!a.correct).length};
}
