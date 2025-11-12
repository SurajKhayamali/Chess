import{T as d}from"./game.constant-DvAprQgS.js";import{e as i,S as n,s as a,h as o}from"./index-Ckin8rOF.js";const g=e=>d.find(s=>s.value===e),u=e=>{const s=g(e);return`
	<div class="card bg-base-300">
		<div class="card-body">
		<div class="flex flex-col items-center">
      <p class="text-2xl">Game Queue for mode:  ${s==null?void 0:s.title} (${s==null?void 0:s.description})</p>
			<div class="spinne mt-4"><span class="loading loading-dots loading-lg"></span></div>
      <p class="text-xl mt-4">Waiting for opponent...</p>
      <button id="cancelQueueBtn" class="btn btn-ghost mt-4">Cancel</button>
		</div>
		</div>
	</div>
`},E=async e=>{const s=await i(a,n.GAME_JOIN_QUEUE,{timeLimit:e}),c=s==null?void 0:s.slug;c&&o(`/games/${c}`);const t=document.getElementById("cancelQueueBtn");t==null||t.addEventListener("click",async()=>{await i(a,n.GAME_LEAVE_QUEUE,{timeLimit:e}),o("/")}),a.on(n.GAME_STARTED,l=>{o(`/games/${l.slug}`)})};export{E as afterInitialize,u as renderGameQueue};
