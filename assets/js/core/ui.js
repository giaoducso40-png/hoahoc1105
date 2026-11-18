export const $=s=>document.querySelector(s);
export const $$=s=>[...document.querySelectorAll(s)];
export const esc=(v="")=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export const fmtTime=s=>`${String(Math.floor((+s||0)/60)).padStart(2,"0")}:${String((+s||0)%60).padStart(2,"0")}`;
export function toast(message){const box=$("#toast");box.textContent=message;box.classList.add("show");clearTimeout(box._timer);box._timer=setTimeout(()=>box.classList.remove("show"),2500)}
export function pageTitle(title,description,action=""){return `<header class="page-title"><div><p class="eyebrow">THÀNH PHỐ HÓA CHẤT</p><h1>${esc(title)}</h1><p>${esc(description)}</p></div>${action}</header>`}
export function shuffle(items){return items.map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(x=>x[1])}
