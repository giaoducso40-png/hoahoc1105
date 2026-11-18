import{getState,update}from"./store.js";
let bg=null,correct=null,wrong=null;
function ensure(){
 if(bg)return;
 bg=new Audio("assets/audio/nhac-nen.mp3");bg.loop=true;bg.preload="none";bg.volume=.17;
 correct=new Audio("assets/audio/tra-loi-dung.mp3");correct.preload="none";correct.volume=.65;
 wrong=new Audio("assets/audio/tra-loi-sai.wav");wrong.preload="none";wrong.volume=.55;
}
export function isAudioOn(){return getState().settings.audio}
export function toggleAudio(){ensure();const on=!isAudioOn();update(s=>s.settings.audio=on);if(on)bg.play().catch(()=>{});else bg.pause();return on}
export function syncAudioButton(button){const on=isAudioOn();button.setAttribute("aria-pressed",String(on));button.setAttribute("aria-label",on?"Tắt âm thanh":"Bật âm thanh");button.textContent=on?"♫":"♪"}
export function playFx(kind){if(!isAudioOn())return;ensure();const fx=kind==="correct"?correct:wrong;fx.currentTime=0;fx.play().catch(()=>{})}
