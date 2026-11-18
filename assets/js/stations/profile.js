import{pageTitle,$,esc}from"../core/ui.js";
import{exportState,importState,reset,validateName,logout}from"../core/store.js";

export async function render(ctx){
 const s=ctx.getState(),size=new Blob([exportState()]).size;
 ctx.root.innerHTML=`${pageTitle(`Hồ sơ của ${s.profile.name||"nhà thám hiểm"}`,"Đổi tên thẻ tham quan mà không làm mất tiến độ, đặt mục tiêu và sao lưu dữ liệu trên thiết bị này.")}
 <section class="profile-grid">
  <article class="card profile-card">
   <h2>Thẻ tham quan</h2>
   <label>Tên nhà thám hiểm<input id="profileName" maxlength="30" autocomplete="name" value="${esc(s.profile.name)}" aria-describedby="profileNameError"><small id="profileNameError" class="field-error" aria-live="polite"></small></label>
   <label>Mục tiêu mỗi chặng<select id="profileGoal">${[5,10,15].map(n=>`<option value="${n}" ${s.profile.goal===n?"selected":""}>${n} câu</option>`).join("")}</select></label>
   <button class="primary-button" id="saveProfile">Lưu thay đổi</button>
   <button class="ghost-button logout-profile" id="logoutProfile">Đăng xuất khỏi hồ sơ</button>
   <p class="note">Đổi tên chỉ cập nhật thẻ và lời chào; toàn bộ kết quả học tập vẫn được giữ nguyên.</p>
   <p class="note">Đăng xuất không xóa tiến độ. Nhập lại đúng tên trên trình duyệt này để tiếp tục hành trình.</p>
  </article>
  <article class="card profile-card">
   <h2>Sao lưu tiến độ</h2>
   <p class="note">${s.attempts.length} lượt đã chốt • ${s.sessions.length} chặng • ${Math.round(size/1024)} KB</p>
   <div class="data-actions"><button class="soft-button" id="exportData">Xuất JSON</button><label class="soft-button">Nhập JSON<input id="importData" type="file" accept="application/json" hidden></label><button class="ghost-button" id="resetData">Đặt lại hành trình</button></div>
   <p id="resetWarning" class="reset-warning" hidden><b>Thao tác này xóa tên, kết quả, lab và sổ tay trên thiết bị.</b><span>Nhấn lại nút bên dưới để xác nhận.</span></p>
   <p class="note">Dữ liệu cũ phiên bản 1 được giữ riêng trong mục lịch sử cũ, không trộn vào chỉ số mới.</p>
  </article>
 </section>`;

 const nameInput=$("#profileName"),nameError=$("#profileNameError");
 const showNameError=message=>{nameError.textContent=message;nameInput.setAttribute("aria-invalid",message?"true":"false")};
 nameInput.oninput=()=>showNameError(validateName(nameInput.value).error);
 $("#saveProfile").onclick=()=>{
  const result=validateName(nameInput.value);
  if(!result.valid){showNameError(result.error);nameInput.focus();return}
  ctx.update(x=>{x.profile.name=result.name;x.profile.onboarded=true;x.profile.userNamedAt=new Date().toISOString();x.profile.goal=+$("#profileGoal").value});
  window.dispatchEvent(new CustomEvent("molquest:profile-updated"));
  ctx.toast(`Đã cập nhật hồ sơ của ${result.name}.`);render(ctx);
 };
 $("#exportData").onclick=()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([exportState()],{type:"application/json"}));a.download="molquest-hoa11-du-lieu-v2.json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)};
 $("#logoutProfile").onclick=()=>{logout();location.reload()};
 $("#importData").onchange=async e=>{try{const f=e.target.files[0];if(!f||f.size>5_000_000)throw Error();importState(await f.text());window.dispatchEvent(new CustomEvent("molquest:profile-updated"));ctx.toast("Đã nhập dữ liệu.");render(ctx)}catch{ctx.toast("Tệp sao lưu không hợp lệ; dữ liệu hiện tại được giữ nguyên.")}};
 let resetArmed=false,resetTimer=0;
 $("#resetData").onclick=()=>{
  const button=$("#resetData"),warning=$("#resetWarning");
  if(!resetArmed){resetArmed=true;warning.hidden=false;button.textContent="Xóa dữ liệu và bắt đầu lại";button.classList.add("danger-confirm");clearTimeout(resetTimer);resetTimer=setTimeout(()=>{resetArmed=false;warning.hidden=true;button.textContent="Đặt lại hành trình";button.classList.remove("danger-confirm")},10000);return}
  clearTimeout(resetTimer);reset();window.dispatchEvent(new CustomEvent("molquest:profile-updated"));location.reload();
 };
}
