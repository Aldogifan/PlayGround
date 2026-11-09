import * as THREE from 'three';
import './style.css';

const $ = (s) => document.querySelector(s);
const scene = new THREE.Scene();
scene.background = new THREE.Color('#c9e8e8');
scene.fog = new THREE.Fog('#c9e8e8', 23, 58);
const camera = new THREE.PerspectiveCamera(54, innerWidth / innerHeight, .1, 100);
camera.position.set(0, 2.1, 10.5);
const renderer = new THREE.WebGLRenderer({ canvas: $('#scene'), antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
scene.add(new THREE.HemisphereLight('#e9fbff', '#768b61', 2.15));
const sun = new THREE.DirectionalLight('#fff1ce', 3.2); sun.position.set(-7, 12, 8); sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024); sun.shadow.camera.left = -18; sun.shadow.camera.right = 18; sun.shadow.camera.top = 18; sun.shadow.camera.bottom = -18; scene.add(sun);
const mat = (color, roughness=.85) => new THREE.MeshStandardMaterial({ color, roughness });
const mats = {
  grass:mat('#83b884'), grass2:mat('#93c68d'), cream:mat('#f2dfbe'), wall:mat('#ead8b9'), roof:mat('#bd7860'), roof2:mat('#d38c68'), wood:mat('#946c48'), darkwood:mat('#654e39'), white:mat('#fff5dd'), glass: new THREE.MeshStandardMaterial({color:'#8cc8cb',roughness:.27,metalness:.1}), trim:mat('#fff4dd'), stone:mat('#d8d1b5'), path:mat('#baad8e'), leaf:mat('#608c60'), leaf2:mat('#82aa68'), trunk:mat('#806047'), metal:mat('#647f7a',.42), shadow:mat('#385c4c'), red:mat('#db755a'), yellow:mat('#f1c96e')
};
function box(parent, name, size, pos, material, cast=true) {const o=new THREE.Mesh(new THREE.BoxGeometry(...size), material);o.name=name;o.position.set(...pos);o.castShadow=cast;o.receiveShadow=true;parent.add(o);return o;}
function sphere(parent,size,pos,material,scale=[1,1,1]){const o=new THREE.Mesh(new THREE.SphereGeometry(size,18,14),material);o.position.set(...pos);o.scale.set(...scale);o.castShadow=true;parent.add(o);return o;}
function cylinder(parent,r1,r2,h,pos,material,segments=16){const o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,segments),material);o.position.set(...pos);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function cone(parent,r,h,pos,material){return cylinder(parent,0,r,h,pos,material,12);}
// Soft, storybook neighborhood and garden
box(scene,'Lawn',[80,.22,80],[0,-.17,-16],mats.grass,false);
box(scene,'Flowerbed',[18,.12,7],[-13,-.04,-6],mats.grass2,false);
// House with a visible garage/workshop on the right
box(scene,'House',[8,4.2,4.3],[2.5,2.1,-6],mats.wall);
const roofL=box(scene,'Roof',[4.8,.22,5], [0,4.48,-6],mats.roof);roofL.rotation.z=.48;
const roofR=box(scene,'Roof',[4.8,.22,5], [5,4.48,-6],mats.roof2);roofR.rotation.z=-.48;
box(scene,'Eave',[8.35,.2,.3],[2.5,3.98,-3.78],mats.trim);
box(scene,'Door',[1.2,2.25,.16],[2.25,1.17,-3.78],mats.wood);
sphere(scene,.055,[2.67,1.22,-3.65],mats.yellow);
for(const x of [-.15,4.95]){box(scene,'Window',[1.3,1.3,.14],[x,2.45,-3.74],mats.glass);box(scene,'Window trim',[1.48,.1,.18],[x,2.45,-3.64],mats.trim);box(scene,'Window trim',[.1,1.48,.18],[x,2.45,-3.64],mats.trim);box(scene,'Window mullion',[.06,1.25,.2],[x,2.45,-3.62],mats.trim);box(scene,'Window mullion',[1.25,.06,.2],[x,2.45,-3.62],mats.trim)}
// Garage extension and open door
box(scene,'Garage floor',[5.5,.12,5],[8.8,.02,-5.7],mat('#c6b99b'));
box(scene,'Garage left wall',[.22,3.5,5],[6.16,1.75,-5.7],mats.cream);
box(scene,'Garage right wall',[.22,3.5,5],[11.44,1.75,-5.7],mats.cream);
box(scene,'Garage back wall',[5.5,3.5,.2],[8.8,1.75,-8.12],mats.cream);
box(scene,'Garage roof',[5.9,.26,5.4],[8.8,3.55,-5.65],mats.roof);
box(scene,'Garage opening post',[.22,3.35,.27],[6.42,1.67,-3.16],mats.trim);
box(scene,'Garage opening post',[.22,3.35,.27],[11.18,1.67,-3.16],mats.trim);
box(scene,'Garage header',[5,.24,.3],[8.8,3.35,-3.16],mats.trim);
box(scene,'Workbench',[2.7,.18,.9],[8.8,.9,-6.65],mats.wood);
for(const x of [7.65,9.95])box(scene,'Bench legs',[.13,.85,.13],[x,.44,-6.65],mats.darkwood);
box(scene,'Pegboard',[2.8,1.35,.13],[8.8,2.4,-7.98],mat('#b9a784'));
// workshop shelf and colorful tools
box(scene,'Shelf',[.75,2,.75],[7.05,1.3,-6.25],mats.wood);
for(let i=0;i<3;i++)box(scene,'Shelf boards',[.8,.08,.8],[7.05,.62+i*.62,-6.25],mats.darkwood);
const toolColors=['#edbd5b','#68a5a0','#d77c5e','#f3e3bf'];
for(let i=0;i<4;i++){cylinder(scene,.09,.09,.68,[7.8+i*.56,1.45,-7.76],mat(toolColors[i]),10)}
// stone walkway, launch site and striped landing pad
box(scene,'Walkway',[2.3,.12,10],[3.1,-.005,1.9],mats.path,false);
box(scene,'Pad base',[2,.14,2],[1.2,.09,-.25],mats.stone);
const pad = new THREE.Mesh(new THREE.CylinderGeometry(.66,.8,.24,16),mats.metal);pad.position.set(1.2,.26,-.25);pad.castShadow=true;scene.add(pad);
cylinder(scene,.07,.1,.53,[1.2,.62,-.25],mats.white,12);
// Water-bottle rocket group with selectable paint and proper fins/nozzle
const rocket = new THREE.Group();scene.add(rocket);rocket.position.set(1.2,.91,-.25);
let rocketBody, rocketNose, rocketFinMat;
function makeRocket(color='#55a895'){
  if(rocketBody)rocket.remove(rocketBody);
  const body=new THREE.Group();rocket.add(body);
  const bodyMat=mat(color,.35), capMat=mat('#f5ead4',.32);
  const bodyMesh=cylinder(body,.205,.205,.91,[0,.72,0],bodyMat,20);bodyMesh.name='Bottle';
  cylinder(body,.208,.205,.11,[0,.21,0],mats.metal,20);
  const nose=cone(body,.205,.44,[0,1.395,0],mat('#f2c46d',.38));
  cylinder(body,.22,.22,.07,[0,1.22,0],capMat,20);
  const fins=mat('#e47e5f');rocketFinMat=fins;
  for(let i=0;i<3;i++){const f=box(body,'Fin',[.11,.36,.33],[0,.4,.19],fins);f.rotation.z=-.2;f.rotation.y=i*Math.PI*2/3}
  cylinder(body,.12,.17,.13,[0,.18,0],mats.white,16);
  const stripe=cylinder(body,.207,.207,.055,[0,.88,0],mat('#fff2d6',.4),20);stripe.name='Bottle label';
  rocketBody=body;
}
makeRocket();
// Launch pump, hose, gauge and a small garden launch flag
const pumpGroup=new THREE.Group();scene.add(pumpGroup);pumpGroup.position.set(2.4,0,-.28);
box(pumpGroup,'Pump base',[.43,.12,.43],[0,.12,0],mats.red);
cylinder(pumpGroup,.12,.14,.95,[0,.65,0],mats.metal,16);
cylinder(pumpGroup,.065,.065,.11,[0,1.15,0],mats.yellow,16);
box(pumpGroup,'Handle',[.57,.08,.11],[0,1.2,0],mats.red);
const hose=new THREE.Mesh(new THREE.TorusGeometry(.24,.025,8,24,Math.PI),mat('#354f4c'));hose.position.set(-.2,.52,0);hose.rotation.z=Math.PI;hose.rotation.x=Math.PI/2;pumpGroup.add(hose);
const flag=box(scene,'Launch flag',[.06,1,.06],[.32,.56,-.2],mats.darkwood);box(scene,'Flag',[.47,.28,.05],[.57,.93,-.2],mats.red);
// Clouds, trees, bushes, flowers, stepping stones and distant fence
function tree(x,z,s=1){cylinder(scene,.19*s,.3*s,1.5*s,[x,.66*s,z],mats.trunk,9);sphere(scene,.75*s,[x,.66+1.12*s,z],mats.leaf,[1,1.08,1]);sphere(scene,.52*s,[x-.35*s,.78+1.2*s,z+.12*s],mats.leaf2);sphere(scene,.48*s,[x+.38*s,.75+1.3*s,z-.12*s],mats.leaf)}
for(const [x,z,s] of [[-7,-3,1.5],[-10,-10,1.9],[13,-7,1.8],[11,1,1.2],[-7,3,1]])tree(x,z,s);
for(let i=0;i<8;i++){const x=-5+(i%4)*4,z=-9-Math.floor(i/4)*.3;box(scene,'Fence post',[.13,.8,.13],[x,.4,z],mats.trim);if(i<7)box(scene,'Fence rail',[3.8,.09,.08],[x+1.85,.58,z],mats.trim)}
for(let i=0;i<7;i++){const x=-3.3+i*.7,z=1.7+(i%2)*.28;sphere(scene,.09,[x,.15,z],mat(['#efb87a','#e98777','#f1dc83'][i%3]),[1,.7,1])}
// Puffy handmade clouds in the distance
for(const [x,y,z,s] of [[-9,9,-18,1.4],[-1,10,-23,1.1],[10,9,-20,1.5],[16,8,-25,1]]){const g=new THREE.Group();g.position.set(x,y,z);scene.add(g);for(const [dx,dy,r] of [[0,0,.7],[.7,.08,.55],[-.65,-.05,.48],[.2,.35,.52]])sphere(g,r,[dx,dy,0],mat('#fffaf0'),[1,.74,.5])}
// persistent game state
const catalog={
 rockets:[{id:'starter',name:'Si Botol #1',emoji:'🚀',price:0,power:1,desc:'Botol PET ringan untuk penerbangan pertamamu.',class:'Pemula'}, {id:'twin',name:'Twin-Thrust 2L',emoji:'🧴',price:180,power:1.28,desc:'Ruang air lebih besar, dorongan ekstra.',class:'Menengah'}, {id:'comet',name:'Komet Karbon',emoji:'☄️',price:420,power:1.65,desc:'Bodi aerodinamis untuk jarak jauh.',class:'Pro'}],
 pumps:[{id:'hand',name:'Pompa Tangan',emoji:'↻',price:0,rate:12,desc:'Andalan pemula. +12% tekanan tiap pompa.'},{id:'foot',name:'Pompa Kaki Turbo',emoji:'⚙️',price:160,rate:20,desc:'Lebih stabil dan cepat. +20% tekanan.'},{id:'pro',name:'Kompresor Mini',emoji:'⚡',price:360,rate:30,desc:'Tekanan tinggi! +30% per pompa.'}],
 upgrades:[{id:'fins',name:'Sirip Aerodinamis',emoji:'◢',price:120,power:.16,desc:'Sirip presisi membantu roket melesat lurus.'},{id:'nozzle',name:'Nosel Turbo',emoji:'◉',price:190,power:.2,desc:'Nosel menyempit untuk dorongan lebih kuat.'},{id:'tank',name:'Penguat Botol',emoji:'⬡',price:260,power:.25,desc:'Penguatan bodi untuk tekanan ekstra.'}],
 paints:[{id:'mint',name:'Mint Segar',emoji:'🟢',price:35,color:'#55a895'},{id:'coral',name:'Koral Ceria',emoji:'🟠',price:35,color:'#e17e67'},{id:'blue',name:'Biru Langit',emoji:'🔵',price:35,color:'#5b92bc'},{id:'violet',name:'Ungu Nebula',emoji:'🟣',price:55,color:'#917ab7'}]
};
const fresh={money:240,ownedRockets:['starter'],ownedPumps:['hand'],rocket:'starter',pump:'hand',upgrades:[],paint:'mint',ownedPaints:['mint'],launches:0,best:0,missionPaid:false};
let state;try{state={...fresh,...JSON.parse(localStorage.getItem('rocket-yard-save')||'{}')}}catch{state={...fresh}}
function save(){localStorage.setItem('rocket-yard-save',JSON.stringify(state));updateHud()}
const rocketDef=()=>catalog.rockets.find(x=>x.id===state.rocket)||catalog.rockets[0];
const pumpDef=()=>catalog.pumps.find(x=>x.id===state.pump)||catalog.pumps[0];
const upgradePower=()=>state.upgrades.reduce((n,id)=>n+(catalog.upgrades.find(x=>x.id===id)?.power||0),0);
let pressure=0, busy=false, currentView='yard', shopCategory='rockets';
function updateHud(){const r=rocketDef(), bonus=upgradePower();$('#money').textContent=state.money.toLocaleString('id-ID');$('#rocketName').textContent=r.name;$('#rocketStats').textContent=`Kelas ${r.class.toLowerCase()} · ${(r.power+bonus).toFixed(2)}× daya`;$('#fuelText').textContent=`${Math.round(pressure)}%`;$('#fuelFill').style.width=`${pressure}%`;$('#rocketState').textContent=busy?'TERBANG':pressure>=100?'PENUH':'SIAP';$('#missionText').textContent=state.launches?'Capai jarak terbaik baru':'Luncurkan roket pertamamu';$('#missionSub').textContent=state.launches?`Rekor saat ini ${state.best} m · terus tingkatkan!`:'Pompa roket, lalu tekan luncurkan';$('#missionReward').textContent=state.missionPaid?'—':'80';$('#launchButton').disabled=busy;$('#pumpButton').disabled=busy;}
updateHud();
makeRocket(catalog.paints.find(p=>p.id===state.paint)?.color||'#55a895');
// Responsive camera framing
function resize(){camera.aspect=innerWidth/innerHeight;camera.fov=innerWidth<700?61:54;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));}
addEventListener('resize',resize);

function toast(text){const t=$('#toast');t.textContent=text;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2300)}
function setView(view){currentView=view;const garage=view==='garage';$('#locationLabel').textContent=garage?'GARASI RUMAH':'HALAMAN RUMAH';document.querySelectorAll('.rail-button[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));$('#sceneLabel').innerHTML=garage?'<span class="label-line"></span><span>MEJA MODIFIKASI</span>':'<span class="label-line"></span><span>LANDASAN PELUNCURAN</span>';
 const target=garage?new THREE.Vector3(7.5,1.55,-2.5):new THREE.Vector3(0,2.1,10.5); const look=garage?new THREE.Vector3(8.7,1.7,-5.1):new THREE.Vector3(2,1.8,-3.2); animateCamera(target,look); if(garage){$('#actionEyebrow').textContent='BENGKEL RUMAH';$('#actionTitle').textContent='Rakit yang lebih baik.';$('#actionHint').textContent='Masuk toko untuk menambah sirip, nosel, dan warna roket.'}else{$('#actionEyebrow').textContent='AREA PELUNCURAN';$('#actionTitle').textContent='Siap mengudara?';$('#actionHint').textContent='Pompa roketmu hingga penuh untuk jarak terbaik.'}}
let cameraAnim=null;
function animateCamera(pos,look){cameraAnim={from:camera.position.clone(),to:pos.clone(),lookFrom:camera.getWorldDirection(new THREE.Vector3()).add(camera.position),lookTo:look.clone(),t:0}}
// Simple keyboard and drag-to-look exploration; movement is deliberately bounded to the yard.
let keys={};addEventListener('keydown',e=>{keys[e.code]=true;if(e.code==='Space'){e.preventDefault();pump()}if(e.code==='Escape')closeModal()});addEventListener('keyup',e=>keys[e.code]=false);
let dragging=false,lastX=0,lastY=0,yaw=0,pitch=0;
$('#scene').addEventListener('pointerdown',e=>{if(e.target.closest?.('button'))return;dragging=true;lastX=e.clientX;lastY=e.clientY;$('#scene').setPointerCapture(e.pointerId)});
$('#scene').addEventListener('pointerup',()=>dragging=false);
$('#scene').addEventListener('pointermove',e=>{if(!dragging||cameraAnim)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;yaw=Math.max(-.55,Math.min(.55,yaw-dx*.002));pitch=Math.max(-.15,Math.min(.18,pitch+dy*.0015));const look=currentView==='garage'?new THREE.Vector3(8.7,1.7,-5.1):new THREE.Vector3(2,1.8,-3.2);look.x+=yaw*5;look.y+=pitch*4;camera.lookAt(look)});
function pump(){if(busy)return;if(pressure>=100){toast('Tekanan maksimum! Roket siap diluncurkan.');return}const rate=pumpDef().rate;pressure=Math.min(100,pressure+rate);pumpGroup.position.y=.12;pumpGroup.position.y=.12;$('#actionHint').textContent=pressure>=100?'Mantap! Tekan LUNCURKAN untuk terbang.':`${pumpDef().name} bekerja · ${100-pressure}% lagi menuju tekanan penuh`;updateHud();}
$('#pumpButton').addEventListener('click',pump);
$('#launchButton').addEventListener('click',launch);

async function launch(){if(busy)return;if(pressure<25){toast('Pompa dulu minimal 25% untuk meluncurkan!');return}busy=true;updateHud();$('#launchOverlay').classList.add('show');const r=rocketDef(), multiplier=r.power+upgradePower();const distance=Math.round((34+pressure*1.52)*multiplier*(.91+Math.random()*.18));$('#launchDistance').textContent='0 m';const start=rocket.position.clone(), from=performance.now(), duration=1900;
 await new Promise(resolve=>{function tick(now){const t=Math.min(1,(now-from)/duration);rocket.position.set(start.x+Math.sin(t*5)*.4,start.y+Math.sin(t*Math.PI/2)*8*t,start.z-t*7);rocket.rotation.z=Math.sin(t*9)*.13;$('#launchDistance').textContent=`${Math.round(distance*(t*.92))} m`;if(t<1)requestAnimationFrame(tick);else resolve()}requestAnimationFrame(tick)});
 rocket.position.set(-3,.5,-8);rocket.rotation.set(0,0,0);
 const reward=Math.round(14+distance*.22);state.money+=reward;state.launches++;const record=distance>state.best;if(record)state.best=distance;let firstBonus=0;if(!state.missionPaid){firstBonus=80;state.money+=firstBonus;state.missionPaid=true}save();pressure=0;updateHud();
 setTimeout(()=>{$('#launchOverlay').classList.remove('show');rocket.position.set(1.2,.91,-.25);busy=false;$('#actionHint').textContent='Penerbangan selesai! Pompa lagi untuk mencoba jarak baru.';updateHud();showResult(distance,reward,firstBonus,record);},400);
}
function showResult(distance,reward,bonus,record){$('#modalContent').innerHTML=`<div class="modal-kicker">✦ LAPORAN PENERBANGAN</div><h2>${record?'Penerbangan hebat!':'Misi selesai!'}</h2><p class="modal-desc">${distance>150?'Roketmu membelah langit halaman!':distance>80?'Roket melesat melewati pagar!':'Awal yang bagus — upgrade roketmu untuk terbang lebih jauh.'} ${bonus?`Bonus misi pertama +${bonus} koin!`:''}</p><div class="result-card"><div><span>JARAK TERBANG</span><strong>${distance} m</strong></div><div style="text-align:right"><span>HADIAH</span><strong>+${reward+bonus} ✳</strong></div></div><button class="modal-action" id="resultContinue">LANJUTKAN PETUALANGAN</button>`;openModal();$('#resultContinue').onclick=closeModal;}

// Shop / garage upgrades
function openModal(){$('#modalBackdrop').classList.add('open')}
function closeModal(){$('#modalBackdrop').classList.remove('open')}
$('#closeModal').addEventListener('click',closeModal);
$('#modalBackdrop').addEventListener('click',e=>{if(e.target===$('#modalBackdrop'))closeModal()});
function openShop(category='rockets'){
  shopCategory=category;
  $('#modalContent').innerHTML=`<div class="modal-kicker">TOKO BENGKEL • HALAMAN RUMAH</div><h2>Perlengkapan terbang.</h2><p class="modal-desc">Pilih roket dan pompa baru, atau bawa roketmu ke bengkel untuk modifikasi.</p><div class="shop-tabs">${[['rockets','Roket'],['pumps','Pompa'],['upgrades','Modifikasi'],['paints','Warna']].map(([id,label])=>`<button class="shop-tab ${id===category?'active':''}" data-category="${id}">${label}</button>`).join('')}</div><div class="item-list" id="itemList"></div>`;
  $('#modalContent').querySelectorAll('.shop-tab').forEach(b=>b.onclick=()=>openShop(b.dataset.category));
  renderItems();openModal();
}
function renderItems(){const list=$('#itemList');if(!list)return;const items=catalog[shopCategory];list.innerHTML=items.map(item=>{
  const inventory=shopCategory==='rockets'?state.ownedRockets:shopCategory==='pumps'?state.ownedPumps:shopCategory==='upgrades'?state.upgrades:state.ownedPaints;
  const owned=inventory.includes(item.id), equipped=(shopCategory==='rockets'&&state.rocket===item.id)||(shopCategory==='pumps'&&state.pump===item.id)||(shopCategory==='paints'&&state.paint===item.id);
  const stats=shopCategory==='rockets'?`<span>${item.class}</span><span>${item.power.toFixed(2)}× daya</span>`:shopCategory==='pumps'?`<span>+${item.rate}% / pompa</span>`:shopCategory==='upgrades'?`<span>+${Math.round(item.power*100)}% daya</span>`:'';
  const label=equipped?'DIPAKAI':owned?(shopCategory==='upgrades'?'TERPASANG':'PAKAI'):`✳ ${item.price}`;
  return `<article class="shop-item"><div class="item-art">${item.emoji}</div><div class="item-copy"><strong>${item.name}</strong><p>${item.desc||'Warna khusus untuk roket andalanmu.'}</p>${stats?`<div class="stat-pills">${stats}</div>`:''}</div><button class="item-buy ${equipped?'equipped':''}" data-item="${item.id}" ${equipped?'disabled':''}>${label}</button></article>`;
 }).join('');
 list.querySelectorAll('.item-buy').forEach(btn=>btn.onclick=()=>buyItem(btn.dataset.item));
}
function buyItem(id){const item=catalog[shopCategory].find(x=>x.id===id);if(!item)return;
 const inventory=shopCategory==='rockets'?state.ownedRockets:shopCategory==='pumps'?state.ownedPumps:shopCategory==='upgrades'?state.upgrades:state.ownedPaints;
 if(inventory.includes(id)){
   if(shopCategory==='rockets')state.rocket=id;else if(shopCategory==='pumps')state.pump=id;else if(shopCategory==='paints'){state.paint=id;makeRocket(item.color)}
   save();renderItems();toast(`${item.name} siap digunakan!`);return;
 }
 if(state.money<item.price){toast(`Koin belum cukup — butuh ${item.price} ✳.`);return}
 state.money-=item.price;inventory.push(id);
 if(shopCategory==='rockets')state.rocket=id;if(shopCategory==='pumps')state.pump=id;if(shopCategory==='paints'){state.paint=id;makeRocket(item.color)}
 save();renderItems();toast(`${item.name} berhasil dibeli!`);
}
function openMissions(){
 const first=state.missionPaid;
 $('#modalContent').innerHTML=`<div class="modal-kicker">CATATAN PILOT • HARI CERAH</div><h2>Misi halaman.</h2><p class="modal-desc">Setiap penerbangan membawa koin untuk roket dan perlengkapan baru.</p><div class="mission-list"><article class="mission-row"><div class="mission-check">${first?'✓':'✦'}</div><div><strong>Penerbangan perdana</strong><small>${first?'Selesai — hadiah sudah diterima':'Luncurkan roket sekali'}</small></div><span class="mission-coins">${first?'SELESAI':'+80 ✳'}</span></article><article class="mission-row"><div class="mission-check">${state.best>=100?'✓':'↗'}</div><div><strong>Terbang jauh</strong><small>Capai jarak 100 meter · Rekor ${state.best} m</small></div><span class="mission-coins">${state.best>=100?'SELESAI':'+45 ✳'}</span></article><article class="mission-row"><div class="mission-check">${state.launches>=3?'✓':'◎'}</div><div><strong>Ilmuwan halaman</strong><small>Lakukan 3 peluncuran · ${state.launches}/3</small></div><span class="mission-coins">${state.launches>=3?'SELESAI':'+60 ✳'}</span></article></div><button class="modal-action" id="missionShop">LIHAT PERLENGKAPAN</button>`;
 openModal();$('#missionShop').onclick=()=>openShop('rockets');
}
document.querySelectorAll('.rail-button').forEach(button=>button.addEventListener('click',()=>{if(button.dataset.view)setView(button.dataset.view);else if(button.dataset.panel==='shop')openShop(currentView==='garage'?'upgrades':'rockets');else openMissions()}));

// Touch and keyboard walking for a true first-person yard view.
const touchKeys={forward:'KeyW',back:'KeyS',left:'KeyA',right:'KeyD'};
document.querySelectorAll('.touch-pad button').forEach(button=>{
 const down=e=>{e.preventDefault();keys[touchKeys[button.dataset.move]]=true};
 const up=e=>{e.preventDefault();keys[touchKeys[button.dataset.move]]=false};
 button.addEventListener('pointerdown',down);button.addEventListener('pointerup',up);button.addEventListener('pointercancel',up);button.addEventListener('pointerleave',up);
});
// Scene hotspots: the bench opens modifications; the launch stand returns to the yard.
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let downPoint=null;
$('#scene').addEventListener('pointerdown',e=>{downPoint={x:e.clientX,y:e.clientY}});
$('#scene').addEventListener('pointerup',e=>{
 if(!downPoint||Math.hypot(e.clientX-downPoint.x,e.clientY-downPoint.y)>8){downPoint=null;return}
 pointer.x=(e.clientX/innerWidth)*2-1;pointer.y=-(e.clientY/innerHeight)*2+1;raycaster.setFromCamera(pointer,camera);
 const hit=raycaster.intersectObjects(scene.children,true).find(h=>h.object.name==='Workbench'||h.object.name==='Pad base'||h.object.name==='Door');
 if(hit?.object.name==='Workbench'){setView('garage');openShop('upgrades')}else if(hit?.object.name==='Pad base')setView('yard');else if(hit?.object.name==='Door')toast('Rumah nyaman, tapi eksperimen dilakukan di halaman!');downPoint=null;
});

const clock=new THREE.Clock();
function frame(){requestAnimationFrame(frame);const dt=Math.min(clock.getDelta(),.04),now=clock.elapsedTime;
 // Gentle garden life and a hand-pump stroke
 for(const c of scene.children)if(c.name==='Cloud')c.position.x+=dt*.08;
 pumpGroup.children.forEach(o=>{if(o.name==='Handle'&&busy===false&&pressure>0)o.position.y=1.2+Math.sin(now*2)*.012});
 if(cameraAnim){cameraAnim.t=Math.min(1,cameraAnim.t+dt*1.35);const t=cameraAnim.t*tEase(cameraAnim.t);camera.position.lerpVectors(cameraAnim.from,cameraAnim.to,t);const look=new THREE.Vector3().lerpVectors(cameraAnim.lookFrom,cameraAnim.lookTo,t);camera.lookAt(look);if(cameraAnim.t>=1)cameraAnim=null}
 else if(!$('#modalBackdrop').classList.contains('open')&&!busy){const speed=dt*3.1;const forward=new THREE.Vector3();camera.getWorldDirection(forward);forward.y=0;forward.normalize();const right=new THREE.Vector3().crossVectors(forward,new THREE.Vector3(0,1,0)).normalize();let moved=false;if(keys.KeyW||keys.ArrowUp){camera.position.addScaledVector(forward,speed);moved=true}if(keys.KeyS||keys.ArrowDown){camera.position.addScaledVector(forward,-speed);moved=true}if(keys.KeyA||keys.ArrowLeft){camera.position.addScaledVector(right,-speed);moved=true}if(keys.KeyD||keys.ArrowRight){camera.position.addScaledVector(right,speed);moved=true}if(moved){camera.position.x=THREE.MathUtils.clamp(camera.position.x,-5.5,8);camera.position.z=THREE.MathUtils.clamp(camera.position.z,-1,12)}}
 renderer.render(scene,camera);
}
function tEase(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}
camera.lookAt(2,1.8,-3.2);frame();
