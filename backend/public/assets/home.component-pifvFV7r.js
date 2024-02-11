import{T as t}from"./game.constant-sV4GMeaH.js";import{h as o}from"./index-iXdiA8If.js";const r=({title:e,description:a,value:i})=>`
  <div class="card card-compact cursor-pointer bg-base-300 transition-colors hover:bg-primary" data-value="${i}">
    <div class="card-body items-center">
      <p class="card-title">${e}</p>
      ${a?`<p class="card-description">${a}</p>`:""}
    </div>
  </div>
`,c=()=>`
  <div id="gameModeOptions" class="grid grid-cols-3 gap-4">
    ${t.map(r).join("")}
  </div>
`,s=`
  <div class="container">
    ${c()}
    <!-- <div id="home-chat-container"></div> -->
  </div>
`;function m(){document.querySelectorAll("#gameModeOptions .card").forEach(a=>{a.addEventListener("click",()=>{const i=a.getAttribute("data-value");o(`/gameQueue/${i}`)})})}export{m as afterInitialize,s as component};
