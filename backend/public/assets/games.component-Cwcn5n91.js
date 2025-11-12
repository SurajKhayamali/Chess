import{g as v}from"./index-Ckin8rOF.js";import{g as I}from"./game.service-DxX43Isf.js";const B=`
  <div class="container">
    <h1 class="text-3xl font-bold">Games</h1>

    <div class="mt-4">
      <div class="mt-4">
        <table id="gamesListTable" class="table-auto">
          <thead>
            <tr>
              <th>ID</th>
              <th>White Player</th>
              <th>Black Player</th>
              <th>Mode</th>
              <th>Time Limit</th>
              <th>Result</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>

        <div id="noGamesFound" class="hidden">
          <p class="text-base font-semibold">No games found</p>
        </div>
  </div>
`,G=(n,l,t)=>n?l?t?"Won":"Lost":t?"Lost":"Won":"N/A",N=async()=>{var d;const n=document.getElementById("gamesListTable");if(!n)return;const l=n.getElementsByTagName("tbody")[0],t=document.getElementById("noGamesFound");if(!t)return;const r=await I();if(!r.length){t.classList.remove("hidden");return}const u=(d=v())==null?void 0:d.userId;for(const c of r){const e=l.insertRow();e.classList.add("[&>*]:px-4");const g=e.insertCell(0),o=e.insertCell(1),i=e.insertCell(2),f=e.insertCell(3),b=e.insertCell(4),C=e.insertCell(5),T=e.insertCell(6),{id:x,whitePlayer:s,blackPlayer:a,mode:y,timeLimit:L,isOver:m,hasWhitePlayerWon:p}=c,h=s?s.id===u:!1;g.innerText=String(x),o.innerText=(s==null?void 0:s.username)||"N/A",i.innerText=(a==null?void 0:a.username)||"N/A",h?(o.classList.add("font-bold"),o.innerText+=" (You)"):(i.classList.add("font-bold"),i.innerText+=" (You)"),f.innerText=y,b.innerText=String(L),C.innerText=G(m,p,h),T.innerHTML=`
      <a href="/games/${c.slug}" class="btn btn-ghost">${m?"View":"Play"}</a>
    `}};export{N as afterInitialize,B as component};
