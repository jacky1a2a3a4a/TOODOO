import"./main-B6Q3Bb71.js";const y=document.querySelector(".account-name"),u=document.querySelector("#user-name"),v=document.querySelector("#new-todo-form"),p=document.querySelector("#todo-content"),c=document.querySelector(".task-list"),S=document.querySelector(".tabs");document.querySelector(".clear-all-btn");const h=document.querySelector(".sort-buttons"),g=document.querySelector(".task-clear-container"),m=localStorage.getItem("nickname"),k=localStorage.getItem("userName")||"",n=JSON.parse(localStorage.getItem("todos"))||[];m&&(y.innerHTML=m);function L(){u.value=k,u.addEventListener("change",e=>{localStorage.setItem("userName",e.target.value)})}function b(){const e=p.value.trim(),t=document.querySelector('input[name="category"]:checked');return e?t?{content:e,categorySelected:t}:(showCustomAlert("👉 Please choose a category."),!1):(showCustomAlert("👉 Please Key in a todo."),!1)}function A(){const e=b();if(!e)return;const t={content:e.content,category:e.categorySelected.value,done:!1,createdAt:new Date().getTime()};n.push(t),localStorage.setItem("todos",JSON.stringify(n)),a()}let l="all";function a(){c.innerHTML="",n.length===0?g.classList.remove("hidden"):g.classList.add("hidden");let e=n.filter(t=>{if(l==="all")return!0;if(l==="progressing")return!t.done;if(l==="completed")return t.done});e=q(e,i),e.forEach((t,o)=>{const s=n.findIndex(r=>r.content===t.content&&r.category===t.category&&r.createdAt===t.createdAt);c.innerHTML+=`
    <div 
    class="task ${t.done?"completed":""}" 
    data-index="${s}"
    >
    <input class="task-checkbox" type="checkbox"
    ${t.done?"checked":""}
    />
    <div class="task-list-tag ${t.category}">${t.category}</div>
    <input
      class="task-content"
      type="text"
      value="${t.content}"
      readonly
    />
    <div class="edit-btn">✎</div>
    <div class="remove-btn">✕</div>
  </div>
  `}),c.innerHTML+=`
  <div class="footer">
    <span><span class="task-count">
    ${n.filter(t=>!t.done).length}
    </span> tasks progressing</span>
     <span class="clear-all-btn">clear all completed</span>
  </div>
  `}function I(e){n[e].done=!n[e].done,localStorage.setItem("todos",JSON.stringify(n)),a()}function w(e,t){e.classList.add("slide-up"),setTimeout(()=>{n.splice(t,1),localStorage.setItem("todos",JSON.stringify(n)),a()},200)}function T(e,t){const o=e.querySelector(".task-content");o.removeAttribute("readonly"),o.focus(),o.addEventListener("blur",()=>{const s=o.value.trim();s?(n[t].content=s,localStorage.setItem("todos",JSON.stringify(n))):alert("Todo cannot be empty.")}),o.addEventListener("keydown",s=>{s.key==="Enter"&&(s.preventDefault(),o.blur())})}function N(){const e=n.filter(t=>!t.done);n.length=0,n.push(...e),localStorage.setItem("todos",JSON.stringify(n)),a()}let i="latest";const f={business:1,personal:2,travel:3,study:4};function q(e,t){const o=[...e];switch(t){case"category":return o.sort((s,r)=>{const d=f[s.category]-f[r.category];return d!==0?d:r.createdAt-s.createdAt});case"latest":return o.sort((s,r)=>r.createdAt-s.createdAt);case"oldest":return o.sort((s,r)=>s.createdAt-r.createdAt);default:return o}}v.addEventListener("submit",e=>{e.preventDefault(),A(),e.target.reset()});S.addEventListener("click",e=>{const t=e.target;t.classList.contains("tab")&&(document.querySelectorAll(".tab").forEach(o=>{o.classList.remove("active")}),t.classList.add("active"),l=t.dataset.filter,a())});c.addEventListener("click",e=>{if(e.target.classList.contains("clear-all-btn")){const s=n.some(r=>r.done);s||showCustomAlert("🛬 All todo is progressing."),s&&showCustomConfirm(r=>{r&&N()});return}const t=e.target.closest(".task");if(!t)return;const o=t.dataset.index;if(e.target.classList.contains("remove-btn")){w(t,o);return}if(e.target.classList.contains("edit-btn")){T(t,o);return}I(o)});h.addEventListener("change",e=>{e.target.type==="radio"&&(i=e.target.value,a())});window.addEventListener("load",()=>{L(),document.getElementById("sort-latest").checked=!0,i="latest",a()});const E="https://todoo.5xcamp.us",x=document.querySelector(".logout-btn");function C(){const e=localStorage.getItem("Authorization");axios.defaults.headers.common.Authorization=e,axios.delete(`${E}/users/sign_out`).then(t=>{localStorage.removeItem("Authorization"),localStorage.removeItem("nickname"),localStorage.removeItem("userName"),axios.defaults.headers.common.Authorization=null,alert("Logout successful! Now will return to login page."),window.location.href="/pages/Login/login.html",console.log(t)}).catch(t=>{console.log(t)})}x.addEventListener("click",e=>{C()});
