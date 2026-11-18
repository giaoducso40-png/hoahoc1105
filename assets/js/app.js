import{ROUTES}from"./core/config.js";
import{getState,update,validateName,login,logout}from"./core/store.js";
import{$,$$,toast}from"./core/ui.js";
import{toggleAudio,syncAudioButton}from"./core/audio.js";

const root=$("#viewRoot"),progress=$("#routeProgress");
let currentRoute="";

function ensurePersonalizationStyles(){
 if(document.querySelector('link[href="assets/css/personalization-v4.css"]'))return;
 const link=document.createElement("link");link.rel="stylesheet";link.href="assets/css/personalization-v4.css";document.head.append(link);
}

function syncProfileShell(){
 const profile=getState().profile,name=profile.onboarded&&profile.name?profile.name:"Chưa đăng ký";
 $("#explorerName").textContent=name;
 $("#explorerName").title=profile.onboarded?profile.name:"";
 const logoutButton=$("#logoutButton");if(logoutButton)logoutButton.hidden=!profile.onboarded;
}

const context={
 root,
 getState,
 update,
 toast,
 navigate,
 openStation(topic){window.dispatchEvent(new CustomEvent("molquest:open-station",{detail:{topic}}))},
 setNav(route){$$('[data-route]').forEach(b=>b.classList.toggle("active",b.dataset.route===route))}
};

async function navigate(route="city",params={}){
 if(!ROUTES[route])route="city";
 window.dispatchEvent(new CustomEvent("molquest:route-leave",{detail:{from:currentRoute,to:route}}));
 if(route!=="game"&&$("#questionDialog").open)$("#questionDialog").close();
 progress.hidden=false;
 try{
  const mod=await import(ROUTES[route]);
  currentRoute=route;update(s=>s.lastRoute=route);context.setNav(route);
  await mod.render(context,params);syncProfileShell();
  root.focus({preventScroll:true});window.scrollTo({top:0,behavior:"smooth"});
 }catch(error){console.error(error);root.innerHTML=`<section class="card" style="padding:28px"><h1>Trạm đang được kiểm tra</h1><p>Mol chưa mở được khu vực này. Hãy quay về bản đồ và thử lại.</p><button class="primary-button" id="backCity">Về Thành phố</button></section>`;$("#backCity").onclick=()=>navigate("city")}
 finally{progress.hidden=true}
}

function bindShell(){
 $$('[data-route]').forEach(button=>button.addEventListener("click",()=>navigate(button.dataset.route)));
 const audio=$("#audioToggle");syncAudioButton(audio);audio.addEventListener("click",()=>{toggleAudio();syncAudioButton(audio)});
 const logoutButton=$("#logoutButton");if(logoutButton)logoutButton.addEventListener("click",()=>{logout();location.reload()});
 $("[data-close-dialog]").addEventListener("click",()=>$("#stationDialog").close());
 $("#stationDialog").addEventListener("click",e=>{if(e.target===$("#stationDialog"))$("#stationDialog").close()});
 $("#questionDialog").addEventListener("cancel",e=>e.preventDefault());
 $("#questionDialog").addEventListener("click",e=>{if(e.target===$("#questionDialog"))e.preventDefault()});
 window.addEventListener("molquest:navigate",e=>navigate(e.detail.route,e.detail.params||{}));
 window.addEventListener("molquest:profile-updated",syncProfileShell);
 const chip=document.querySelector(".explorer-chip");
 if(chip){chip.tabIndex=0;chip.setAttribute("role","button");chip.setAttribute("aria-label","Mở hồ sơ nhà thám hiểm");chip.addEventListener("click",()=>navigate("profile"));chip.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();navigate("profile")}})}
}

function onboarding(){
 const state=getState(),dialog=$("#welcomeDialog"),form=$("#welcomeForm");
 const input=$("#welcomeName");
 let error=$("#welcomeNameError");
 if(!error){error=document.createElement("small");error.id="welcomeNameError";error.className="field-error";error.setAttribute("aria-live","polite");input.insertAdjacentElement("afterend",error);input.setAttribute("aria-describedby","welcomeNameError")}
 syncProfileShell();
 const setError=message=>{error.textContent=message;input.setAttribute("aria-invalid",message?"true":"false")};
 input.addEventListener("input",()=>setError(validateName(input.value).error));
 dialog.addEventListener("cancel",e=>{if(!getState().profile.onboarded)e.preventDefault()});
 if(!state.profile.onboarded){dialog.showModal();requestAnimationFrame(()=>input.focus())}
 form.addEventListener("submit",e=>{e.preventDefault();const result=login(input.value);if(!result.valid){setError(result.error);input.focus();return}syncProfileShell();dialog.close();window.dispatchEvent(new CustomEvent("molquest:profile-updated"));toast(result.restored?`Chào mừng ${result.name} trở lại! Tiến độ đã được khôi phục.`:`Chào mừng ${result.name}! Hành trình của bạn đã sẵn sàng.`);if(currentRoute==="city")navigate("city")});
}

ensurePersonalizationStyles();bindShell();onboarding();navigate(getState().lastRoute||"city");
