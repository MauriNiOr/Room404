/*
 * ROOM 404 · Night Desk. Original pixel art, generated in Canvas 2D.
 * No runtime dependencies, images or external network access.
 */
(function(){
'use strict';
const D=window.ROOM404_DATA,A=window.Room404Audio,$=id=>document.getElementById(id);
const canvas=$('game'),c=canvas.getContext('2d',{alpha:false}); c.imageSmoothingEnabled=false;
const W=480,H=270;let t=0,prev=0,raf=0;
const state={phase:'title',night:0,index:0,guest:null,tips:0,errors:0,stress:0,decisions:[],tool:'',scene:'lobby',cinemaElapsed:0,spawn:0,guestX:520,guestTarget:279,glitch:0,flash:0,timeMinutes:47,elapsed:0,done:false,dialogue:'',transition:0,log:[],nightSummary:false};
let introScene=-1;
const voiceManager={
  enabled:true,
  active:false,
  currentAudio:null,
  available:'speechSynthesis' in window,
  speak(text,clipIndex=-1){
    this.stop();
    if(!this.enabled||!text||A.isMuted())return;
    if(clipIndex>=0&&window.ROOM404_VOICES&&window.ROOM404_VOICES[clipIndex]){
      try{
        const audio=new Audio(window.ROOM404_VOICES[clipIndex]);audio.volume=.92;this.currentAudio=audio;
        audio.play().catch(()=>{if(this.currentAudio===audio){this.currentAudio=null;this.speak(text,-1)}});
        this.active=true;return;
      }catch(err){console.warn('Voice clip unavailable',err)}
    }
    if(!this.available)return;
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(text);
    utterance.lang='es-ES';utterance.rate=.92;utterance.pitch=.82;utterance.volume=.96;
    const choices=window.speechSynthesis.getVoices();
    const selected=choices.find(v=>v.lang.toLowerCase()==='es-es'&&v.localService)||choices.find(v=>v.lang.toLowerCase().startsWith('es'));
    if(selected)utterance.voice=selected;
    window.speechSynthesis.speak(utterance);this.active=true;
  },
  stop(){if(this.currentAudio){this.currentAudio.pause();this.currentAudio.currentTime=0;this.currentAudio=null}if(this.available)window.speechSynthesis.cancel();this.active=false},
  toggle(){this.enabled=!this.enabled;if(!this.enabled)this.stop();$('voice-state').textContent=this.enabled?'VOZ ESPAÑOL: ON':'VOZ ESPAÑOL: OFF';return this.enabled}
};
const loreScenes=[
 {head:'NOVIEMBRE, 1998',sub:'LA CARRETERA DEL NORTE',text:'El hotel Hollow Inn reabre después de treinta y siete años cerrado. Nadie recuerda quién pagó la reforma.'},
 {head:'23:47 · PRIMER TURNO',sub:'TE HAN CONTRATADO',text:'El sueldo es demasiado bueno para un turno de noche. El director dice que solo debes registrar huéspedes.'},
 {head:'LA NOTA DEL DIRECTOR',sub:'REGLA NÚMERO CUATRO',text:'Comprueba cada documento, cada reserva y cada cámara. Nunca entregues una llave si las pruebas no coinciden.'},
 {head:'03:04 · PASILLO NORTE',sub:'LA HABITACIÓN QUE NO EXISTE',text:'Hace décadas, un incendio borró la habitación cuatrocientos cuatro de los planos. Algunos huéspedes todavía la piden.'},
 {head:'06:00 · ANTES DEL AMANECER',sub:'ALGUIEN SIGUE AQUÍ',text:'No abandones la recepción antes de las seis. Si ves a una persona en el vestíbulo que no aparece en las cámaras, no la dejes entrar.'}
];
const tutorialGuest={name:'CLARA MARTÍN',room:'202',id:'CM-202-98',look:'student',line:'Buenas noches. Soy Clara Martín, tengo una reserva para la habitación 202.',question:'Reservé por teléfono esta tarde. Tengo el comprobante en mi bolso.',ledger:'CLARA MARTÍN · HAB. 202 · CONFIRMADA · 23:45',camera:'Entrada 23:46: Clara llegó sola con una maleta azul. Su imagen coincide con el documento.',trueGuest:true,note:'Su foto y su número de reserva son legibles.'};
const tutorialStages=[
 {title:'1 · REVISA SU IDENTIDAD',text:'El primer cliente ya está aquí. Pulsa IDENTIDAD para comprobar su nombre, fotografía y habitación.',focus:'tool-id',speak:'Primero, comprueba su identidad. Pulsa el botón Identidad.'},
 {title:'2 · CONFIRMA LA RESERVA',text:'Ahora pulsa REGISTRO. El nombre y la habitación deben coincidir con el documento.',focus:'tool-ledger',speak:'Muy bien. Ahora comprueba su reserva en el registro.'},
 {title:'3 · MIRA LAS CÁMARAS',text:'Pulsa CÁMARAS. Si el huésped no aparece en la grabación, sospecha.',focus:'tool-camera',speak:'Revisa las cámaras de seguridad. No todos los huéspedes aparecen en ellas.'},
 {title:'4 · HAZ UNA PREGUNTA',text:'Pulsa PREGUNTAR y compara su respuesta con la reserva.',focus:'tool-question',speak:'Hazle una pregunta para confirmar que dice la verdad.'},
 {title:'5 · ENTREGA LA LLAVE',text:'Todas las pruebas coinciden: Clara es una huésped legítima. Pulsa ACEPTAR para terminar el tutorial.',focus:'accept-btn',speak:'Sus datos coinciden. Puedes aceptar a Clara y entregar la llave.'}
];
function stageTutorial(step){
 state.tutorialStep=step;const s=tutorialStages[step];
 $('tutorial-progress').textContent=(step+1)+' / '+tutorialStages.length;
 $('tutorial-heading').textContent=s.title;$('tutorial-copy').textContent=s.text;
 for(const el of document.querySelectorAll('.tutorial-focus'))el.classList.remove('tutorial-focus');
 $(s.focus).classList.add('tutorial-focus');voiceManager.speak(s.speak,5+step);updateUI();
}
function startTutorial(){
 voiceManager.stop();state.phase='tutorial';state.night=0;state.index=0;state.scene='lobby';state.guest=tutorialGuest;state.guestX=279;state.tool='';state.transition=0;
 $('tutorial-overlay').classList.remove('hidden');
 setDialogue(tutorialGuest.line,tutorialGuest.name);
 updateEvidence('◈ EJERCICIO DE FORMACIÓN','Un huésped espera. Sigue las instrucciones iluminadas para investigar su caso.');
 stageTutorial(0);
}
function finishTutorial(){
 voiceManager.stop();$('tutorial-overlay').classList.add('hidden');
 for(const el of document.querySelectorAll('.tutorial-focus'))el.classList.remove('tutorial-focus');
 state.guest=null;state.index=0;state.night=0;startNight();
}
function updateFullScreenWidth(){
 const shell=document.querySelector('.shell');const target=$('game-screen');
 if(!document.fullscreenElement){target.style.removeProperty('--full-screen-game-width');return}
 const panel=document.querySelector('.screen-panel');
 const maxWidth=panel.clientWidth;const maxHeight=Math.max(210,window.innerHeight-54-10-36-30-112-26);
 target.style.setProperty('--full-screen-game-width',Math.min(maxWidth,maxHeight*16/9)+'px');
}
async function toggleFullscreen(){
 const shell=document.querySelector('.shell');
 try{if(!document.fullscreenElement)await shell.requestFullscreen();else await document.exitFullscreen();}
 catch(err){console.info('Pantalla completa no disponible en este navegador:',err.message)}
}
window.addEventListener('resize',updateFullScreenWidth);
document.addEventListener('fullscreenchange',()=>{
 $('fullscreen-btn').setAttribute('aria-pressed',String(!!document.fullscreenElement));
 $('fullscreen-btn').innerHTML=document.fullscreenElement?'⤢ <span>SALIR DE PANTALLA COMPLETA</span>':'⛶ <span>PANTALLA COMPLETA</span>';
 updateFullScreenWidth();
});
const PALETTE={night:'#0c111c',wall:'#28323a',wall2:'#333b40',gold:'#a88158',red:'#db766d'};
const rnd=(x,y,seed=5)=>{const q=Math.sin(x*127.1+y*311.7+seed*97.3)*43758.5453;return q-Math.floor(q)};
function box(x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h));}
function line(x1,y1,x2,y2,col='#fff',width=1){c.strokeStyle=col;c.lineWidth=width;c.beginPath();c.moveTo(Math.round(x1)+.5,Math.round(y1)+.5);c.lineTo(Math.round(x2)+.5,Math.round(y2)+.5);c.stroke();}
function word(str,x,y,col='#eee',font='7px monospace',align='left'){c.fillStyle=col;c.textAlign=align;c.font=font;c.fillText(str,x,y);c.textAlign='left';}
function rng(i){return Math.sin(i*37.12)*.5+.5}
function glow(x,y,r,color){let g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'#0000');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
function imageStatic(strength=.08){for(let i=0;i<110;i++){let x=(rnd(i+Math.floor(t*13),7)*W)|0,y=(rnd(i+Math.floor(t*9),9)*H)|0;box(x,y,1+rnd(i,y)*3,1,'rgba(241,220,190,'+strength+')')}}
function drawRain(x,y,w,h,s=1){c.save();c.beginPath();c.rect(x,y,w,h);c.clip();for(let i=0;i<65;i++){let rx=x+rnd(i,3)*w,ry=y+((rnd(i,7)*h+t*(20+15*rnd(i,9))*s)%h);line(rx,ry,rx-2,ry+7*s,'#6c8290',.55)}c.restore()}
function sign(x,y,text,scale=1){box(x,y,Math.max(30,text.length*5*scale+10),13*scale,'#1b2628');box(x+1,y+1,Math.max(28,text.length*5*scale+8),11*scale,'#202a29');word(text,x+5,y+9*scale,'#e7b88a',`${7*scale}px monospace`)}
function drawTileFloor(){
 box(0,165,W,105,'#1b2228');
 for(let y=165;y<270;y+=12){let step=((y-165)/105)*17+13;let offset=(Math.floor((y-165)/12)%2)*step/2;
 for(let x=-20;x<W;x+=step){box(x+offset,y,step-1,11,rnd(x,y)>.55?'#25292b':'#20262a');line(x+offset,y,x+offset+step,y,'#353b3e',.5)} }
 // carpet leads from front door to the counter
 box(326,166,54,112,'#482d31');box(330,166,46,112,'#61393b');
 for(let y=171;y<270;y+=12){box(335,y,3,2,'#ae8657');box(370,y,3,2,'#ae8657')}
}
function windowDrawing(x,y,w,h){
 box(x-4,y-4,w+8,h+8,'#181f27');box(x,y,w,h,'#142433');
 let sky=c.createLinearGradient(0,y,0,y+h);sky.addColorStop(0,'#142a38');sky.addColorStop(1,'#1a1725');box(x,y,w,h,sky);
 // street building silhouettes
 for(let i=0;i<7;i++){let bx=x+5+i*15;box(bx,y+41-(i%3)*6,13,h-41+(i%3)*6,'#0d1520');for(let j=0;j<4;j++){if(rnd(i,j)>.5)box(bx+3+(j%2)*5,y+49+(j/2|0)*10,2,3,'#89714e')}}
 glow(x+w*.65,y+h*.75,35,'#c3973866');drawRain(x,y,w,h,.82);
 box(x+w/2-2,y,4,h,'#343b43');box(x,y+h/2,w,4,'#343b43');
 line(x+3,y+4,x+3,y+h-2,'#6e849155');line(x+8,y+4,x+8,y+39,'#9ba9a944');
}
function drawChandelier(){
 line(240,0,240,28,'#7d766b',2);box(214,31,52,3,'#806d52');box(220,34,40,3,'#a08057');
 for(const x of [220,230,240,250,260]){box(x-2,36,4,4,'#f3dcac');glow(x,38,17,'#b69a4f21')}
}
function drawPainting(x,y){box(x-3,y-3,43,59,'#6c4e35');box(x,y,37,53,'#8a6841');box(x+4,y+4,29,45,'#111c23');
 // dark eerie portrait silhouette
 box(x+15,y+11,8,11,'#6e5b4e');box(x+11,y+24,16,23,'#2d2524');box(x+13,y+17,3,1,'#deb49a');box(x+22,y+17,3,1,'#deb49a');
}
function drawPlant(x,y){box(x-7,y+31,15,16,'#5b4334');box(x-9,y+28,19,5,'#7c5540');for(let i=0;i<12;i++){let ex=x+(rnd(i,1)*32-16),ey=y+10+rnd(i,5)*25;line(x,y+31,ex,ey,'#294434',2);box(ex-2,ey-3,6,4,i%2?'#35523e':'#415e49')}}
function drawLamp(x,y){box(x-2,y+10,4,42,'#66593e');box(x-10,y+52,20,4,'#746045');box(x-11,y+3,22,13,'#9d8259');box(x-9,y+5,18,9,'#ddc18a');glow(x,y+11,47,'#e8b66b27')}
function drawDoor(x,y,w,h,open=0){box(x-4,y-4,w+8,h+8,'#4b4140');box(x,y,w,h,'#1a252c');box(x+4,y+4,w-8,h-8,'#253843');
 box(x+w/2-2,y+4,4,h-8,'#516066');box(x+4,y+h/2,w-8,3,'#556269');
 if(open>0.05){box(x+5,y+4,w*open*.52,h-8,'#080d14');box(x+w-5-w*open*.52,y+4,w*open*.52,h-8,'#080d14')}
 box(x+5,y+7,12,17,'#3f5a64');word('IN',x+w/2,y+h-8,'#7b929a','6px monospace','center')}
function drawLuggage(x,y){box(x+1,y,17,19,'#493e3f');box(x+3,y+2,13,15,'#8b6659');box(x+6,y-4,7,4,'#9b7963');box(x+4,y+4,10,1,'#b18a75')}
function drawDesk(){
 // Desk foreground
 box(0,205,480,65,'#2e211e');box(0,209,480,3,'#73513d');box(0,214,480,5,'#45302a');box(0,221,480,49,'#332623');
 for(let x=4;x<480;x+=56){box(x,226,1,34,'#49322b');box(x+4,225,45,1,'#43322b')}
 box(0,261,480,9,'#241c1b');
 // guest book
 box(35,199,66,13,'#997b60');box(37,199,63,11,'#e9d9ac');line(66,200,66,209,'#736f5d');for(let j=0;j<3;j++){line(43,202+j*2,61,202+j*2,'#7d867a');line(72,202+j*2,94,202+j*2,'#8c8071')}
 // bronze bell
 box(190,201,19,7,'#9b6f46');box(194,198,11,4,'#c7a778');box(198,196,3,3,'#dfc08e');glow(199,198,22,'#edc99122');
 // old telephone
 box(375,198,33,12,'#1b2326');box(380,194,22,4,'#6e7977');box(382,201,19,4,'#505d5d');
 // terminal
 box(435,180,32,28,'#101b1d');box(439,184,24,16,'#315459');box(444,188,15,9,'#8db6a7');box(442,202,20,5,'#46525b');
}
function drawWall(){
 box(0,0,480,165,'#253039');box(0,0,480,34,'#121a23');box(0,28,480,6,'#4e4844');
 for(let x=0;x<480;x+=17){box(x,35,1,132,'#293842');box(x+9,35,1,132,'#303b43')}
 box(0,150,480,16,'#1b252c');box(0,153,480,3,'#5c493f');
 for(let i=0;i<6;i++){let x=i*92+8;box(x,41,8,110,'#46505a');box(x+2,41,4,110,'#59616a');box(x-3,42,14,5,'#6f6658')}
 windowDrawing(22,52,92,94);
 // hallway and elevator
 box(141,56,68,98,'#4c4141');box(147,61,56,87,'#11181f');for(let i=0;i<7;i++){box(150,62+i*11,50,1,'#252329')}
 glow(175,93,53,'#b59c5559');sign(145,44,'NORTH HALL');
 drawPainting(222,61);
 drawDoor(326,63,103,100,0);
 sign(333,50,'ENTRADA');
 drawLamp(130,89);drawLamp(285,88);drawPlant(462,112);
 drawChandelier();
 // cracks and dirty wall patches
 for(let i=0;i<36;i++){let x=(rnd(i,12)*480)|0,y=45+(rnd(i,31)*101)|0;box(x,y,3+rnd(i,17)*9,1,'#1b293154')}
}
function drawLobby(){drawWall();drawTileFloor();
 // little brochure rack
 box(15,173,39,24,'#363436');for(let i=0;i<4;i++){box(18+i*8,173,6,14,['#996a48','#837e63','#3d7280','#85614c'][i])}
 // decorative wall carpet and chair
 box(110,172,52,7,'#342b2e');box(115,180,43,17,'#473638');box(118,184,37,8,'#6c4845');
 drawDesk();
 // hanging light pools
 glow(178,143,75,'#ddaa6f11');glow(316,148,70,'#ecd79512');
 // foreground dust
 for(let i=0;i<14;i++){const xx=rnd(i,1)*480,yy=160+rnd(i,8)*107;box(xx,yy,1,1,'#a4a39924')}
}
function drawCar(x,y){box(x+8,y+15,87,19,'#1c252c');box(x+24,y+4,53,18,'#263740');box(x+27,y+6,46,12,'#4b6770');box(x+8,y+15,87,7,'#41515a');box(x+13,y+32,15,8,'#0a1016');box(x+69,y+32,15,8,'#0a1016');box(x+5,y+24,9,5,'#f6df9e');glow(x+3,y+26,58,'#f6db8d22');box(x+92,y+23,6,5,'#bd6261')}
function drawExterior(time){box(0,0,W,H,'#101b28');for(let y=0;y<180;y+=4){box(0,y,480,4,`rgb(${14+(y/14|0)},${21+(y/21|0)},${31+(y/23|0)})`)}
 // trees and distant buildings
 for(let i=0;i<24;i++){let x=i*24-10;box(x,105+rnd(i,3)*25,23,72,'#111b21');for(let j=0;j<4;j++)box(x+rnd(j,i)*20,120+j*8,2,3,'#a5884737')}
 // exterior motel
 box(82,67,304,123,'#303840');box(85,74,298,106,'#41464a');box(100,80,265,4,'#7a7162');
 for(let i=0;i<4;i++){const x=100+i*64;box(x,100,46,76,'#17242d');box(x+3,104,40,69,'#27434d');box(x+20,105,3,68,'#4e5d62');box(x+4,138,38,3,'#4e5d62');glow(x+23,132,36,'#91b3a91c')}
 box(186,98,67,79,'#121e26');box(187,99,65,76,'#263b45');box(216,98,4,78,'#6b6a65');
 box(124,49,216,26,'#171b1d');box(128,53,208,19,'#543f37');word('THE HOLLOW INN',232,67,'#e8b77e','16px monospace','center');glow(231,67,120,'#bd80552f');
 box(0,189,480,81,'#18202a');for(let i=0;i<85;i++){box(rnd(i,5)*480,193+rnd(i,7)*76,7,1,'#40536254')}
 line(0,222,480,221,'#7b725c',2);drawCar(-120+Math.min(160,time*25),171);drawRain(0,0,480,260,1.6);
 for(let i=0;i<7;i++){glow(40+i*65,215,19,'#879da611')}
}
function drawHallway(){box(0,0,480,270,'#101721');
 for(let y=0;y<200;y+=10){let w=(y/200)*400;box(240-w/2,y,w,10,'#2e3030')}
 box(135,0,210,170,'#283039');box(174,0,132,167,'#101720');
 for(let i=0;i<6;i++){let w=168-i*19;let yy=i*25;box(240-w/2,yy,w,2,'#434449')}
 for(let i=0;i<5;i++){let h=145-i*19;let xx=136+i*11;box(xx,15+i*15,4,h,'#42413c');box(480-xx-4,15+i*15,4,h,'#42413c')}
 box(216,84,48,92,'#111318');box(224,91,32,76,'#202b32');box(237,128,3,5,'#bd9d68');
 glow(240,56,105,'#b8a26627');glow(240,250,90,'#c4b5a825');
 for(let i=0;i<24;i++){let x=rnd(i,18)*480;box(x,170+rnd(i,21)*100,3,1,'#6974772a')}
}
function colorsFor(look){const map={traveler:['#756e62','#b99a83','#526b6e','#1d2835','#d6a77d'],womanred:['#281d27','#c6a69d','#7d3d4b','#36232b','#8f443d'],worker:['#453126','#c39f75','#50635d','#1a2326','#a78d6b'],business:['#30262b','#b79a83','#37414e','#17232b','#c6b4a0'],pale:['#20252b','#ded2c0','#a4a2ad','#373d45','#a8a8b3'],student:['#423125','#c9a58e','#497385','#2e3f4d','#e0b98b'],old:['#8a8a86','#ac9588','#675e62','#393038','#a7a19a'],oldwoman:['#aea9a0','#a69c91','#514b5b','#332c3e','#b4b7ae'],hood:['#12191d','#927f72','#1c2930','#19242c','#5a6668'],director:['#1a181b','#a6a095','#302e33','#101119','#6a5e54']};return map[look]||map.traveler}
function drawGuest(x,baseline,look,scale=1,phase=0,ghost=false){
 const [hair,skin,shirt,pants,accent]=colorsFor(look);
 const b=(xx,yy,w,h,col)=>box(x+xx*scale,baseline+yy*scale,w*scale,h*scale,col);
 const bob=Math.sin(phase*7)*.7;
 c.save();c.globalAlpha=ghost?.55:1;
 // shadow, legs, shoes
 box(x-13*scale,baseline+2*scale,37*scale,3*scale,'#090e13a9');
 b(-3,-10,7,11,pants);b(8,-10,7,11,pants);b(-4,0,9,2,'#151b1e');b(7,0,10,2,'#131719');
 // body coat and shoulders
 b(-7,-36+bob,26,29,shirt);b(-10,-33+bob,5,20,shirt);b(19,-33+bob,5,20,shirt);
 b(-8,-17+bob,4,8,skin);b(20,-17+bob,4,8,skin);
 b(2,-34+bob,10,3,accent);b(4,-31+bob,3,15,'#212830');
 if(look==='business'||look==='director'){b(3,-30+bob,8,8,'#d9c9ae');b(5,-28+bob,3,15,'#553d37')}
 if(look==='hood'){b(-5,-49+bob,25,20,hair);}
 // neck face and hair
 b(3,-43+bob,9,11,skin);b(0,-53+bob,17,17,skin);b(-2,-53+bob,20,6,hair);b(-2,-48+bob,4,8,hair);b(15,-48+bob,3,7,hair);
 if(look==='oldwoman'||look==='womanred')b(15,-47+bob,6,23,hair);
 if(look==='pale'){b(2,-45+bob,4,2,'#331c24');b(12,-45+bob,4,2,'#331c24')}else{b(3,-45+bob,3,1,'#171b22');b(12,-45+bob,3,1,'#171b22')}
 b(8,-39+bob,4,1,'#6e554e');
 if(look==='worker'){b(18,-22+bob,13,16,'#493b30');b(20,-24+bob,9,3,'#6e5642')}
 if(look==='traveler'){b(20,-21+bob,13,17,'#5b4947');b(22,-23+bob,9,4,'#ab896e')}
 if(look==='student'){b(-14,-32+bob,7,24,'#536454')}
 if(look==='director'){b(-8,-56+bob,27,7,'#191819');b(-1,-63+bob,18,8,'#1b1b1c');b(4,-44+bob,3,1,'#d35d53');b(12,-44+bob,3,1,'#d35d53')}
 c.restore();
}
function drawLobbyGuest(){if(state.guest&&(state.phase==='playing'||state.phase==='tutorial')){let x=state.guestX;drawGuest(x,204,state.guest.look,1.55,t*.3+state.elapsed,state.guest.look==='pale'||state.guest.look==='director'&&state.glitch>0);if(state.guest.look==='womanred'||state.guest.look==='pale'||state.guest.look==='director'){if(Math.sin(t*2.3)>.87){glow(x,128,25,'#e34d5450')}}}}
function drawCamera(){box(0,0,480,270,'#0b1b18');drawLobby();c.fillStyle='#4ac59712';c.fillRect(0,0,480,270);for(let y=0;y<270;y+=4)line(0,y,480,y,'#55b78f22');word('CAM 03  •  ENTRADA',14,20,'#b9efc9','10px monospace');word('LIVE / 14-11-1998',337,20,'#b9efc9','9px monospace');if(state.guest&&!state.guest.trueGuest){drawGuest(367,183,'director',.85,t)} }
function updateUI(){
 $('night-value').textContent='NOCHE '+String(state.night+1).padStart(2,'0');$('night-label').textContent=D.nights[state.night].subtitle;
 $('cash-value').textContent=state.tips+' €';$('error-value').textContent=String(state.errors).padStart(2,'0');$('stress-fill').style.width=Math.min(100,state.stress)+'%';
 $('night-clock').textContent=''+String((23+Math.floor(state.timeMinutes/60))%24).padStart(2,'0')+':'+String(state.timeMinutes%60).padStart(2,'0');
 $('screen-time').textContent=$('night-clock').textContent+':'+String(Math.floor(state.elapsed*7)%60).padStart(2,'0');
 const g=state.guest,valid=!!g&&(state.phase==='playing'||state.phase==='tutorial')&&state.guestX<295;
 $('guest-name').textContent=g?g.name:'SIN CLIENTE';$('guest-number').textContent=g?'#'+String(state.index+1).padStart(3,'0'):'#000';
 $('id-name').textContent=g?g.name:'—';$('id-detail').textContent=g?'HAB. '+g.room+' · '+g.id:'ESPERANDO IDENTIFICACIÓN';
 $('id-avatar').style.backgroundImage=g?`url(${portrait(g.look)})`:'';$('id-avatar').firstElementChild.textContent=g?'':'?';
 $('speaker').textContent=g?g.name:'CENTRALITA DEL HOTEL';$('dialogue-count').textContent='REGISTRO '+String(state.night+1).padStart(2,'0')+'.'+String(state.index+1).padStart(2,'0');
 $('deny-btn').disabled=!valid||(state.phase==='tutorial');$('accept-btn').disabled=!valid||(state.phase==='tutorial'&&state.tutorialStep!==4);
 for(const key of ['id','ledger','camera','question']){$('tool-'+key).disabled=!valid||(state.phase==='tutorial'&&key!==['id','ledger','camera','question'][state.tutorialStep]);$('tool-'+key).classList.toggle('active',state.tool===key)}
 $('session-status').innerHTML='<span class="status-dot"></span>'+(state.phase==='title'?'SISTEMA DESCONECTADO':state.phase==='playing'?'TURNO EN CURSO':state.phase==='tutorial'?'TUTORIAL / NIVEL 00':'REPRODUCIENDO CINTA');
 $('scene-hint').textContent=(state.phase==='playing'||state.phase==='tutorial')?(g?'CLIENTE EN MOSTRADOR':'ESPERANDO CLIENTE...'):'NIGHT DESK / 1998';
}
let portraitCache={};
function portrait(look){if(portraitCache[look])return portraitCache[look];const old=c,cc=document.createElement('canvas');cc.width=56;cc.height=72;const p=cc.getContext('2d');p.imageSmoothingEnabled=false;p.fillStyle='#5a665e';p.fillRect(0,0,56,72);p.fillStyle='#677a73';p.fillRect(2,2,52,68);const palette=colorsFor(look);const [hair,skin,shirt]=palette;function q(x,y,w,h,color){p.fillStyle=color;p.fillRect(x,y,w,h)}q(4,49,48,23,shirt);q(11,40,34,28,shirt);q(20,20,18,30,skin);q(14,16,28,12,hair);q(16,23,4,17,hair);q(36,23,4,17,hair);q(23,37,3,2,'#252525');q(33,37,3,2,'#252525');q(27,44,6,2,'#7a5d52');return portraitCache[look]=cc.toDataURL('image/png')}
function setDialogue(text,speaker){$('dialogue').textContent=text;if(speaker)$('speaker').textContent=speaker}
function updateEvidence(head,text){$('evidence-panel').querySelector('.evidence-head').textContent=head;$('evidence-text').textContent=text}
function openModal(title,html,button,action){$('modal-title').textContent=title;$('modal-content').innerHTML=html;$('modal-close').textContent=button||'ENTENDIDO →';$('modal').classList.remove('hidden');$('modal-close').onclick=()=>{A.click();$('modal').classList.add('hidden');if(action)action()}}
function showRules(){openModal('MANUAL DEL TURNO',`<p>Tu misión es sencilla: <strong>decidir quién merece una llave</strong>. El hotel tiene cuatro normas:</p><ol>${D.rules.map(a=>`<li>${a}</li>`).join('')}</ol><p>Comprueba la identificación, las reservas, las cámaras y haz preguntas. Usa el ratón o las teclas <strong>1–4</strong> para investigar. <strong>A</strong> acepta y <strong>R</strong> rechaza.</p><p>Los errores aumentan la tensión. Si la tensión llega al límite, el hotel se queda contigo.</p>`,'COMENZAR NOCHE',()=>{state.phase='playing';startNight()})}
function startIntro(){if(!document.fullscreenElement)toggleFullscreen();A.init();A.click();state.phase='intro';state.cinemaElapsed=0;introScene=0;voiceManager.speak(loreScenes[0].text,0);state.guest=null;state.tool='';state.scene='lobby';$('title-overlay').classList.add('hidden');$('cinematic').classList.add('playing');$('cinematic').classList.remove('hidden');setDialogue('Noviembre de 1998. Un empleo de noche en un hotel que no debería existir.','CENTRALITA DEL HOTEL');updateUI()}
function finishIntro(){if(state.phase!=='intro')return;voiceManager.stop();state.phase='tutorial';$('cinematic').classList.remove('playing');$('cinematic').classList.add('hidden');startTutorial();updateUI()}
function startNight(){state.index=0;state.guest=null;state.elapsed=0;state.timeMinutes=47;state.scene='lobby';state.nightSummary=false;state.glitch=0;state.transition=0;state.phase='playing';updateEvidence('◈ TERMINAL DE CONSULTAS','Espera a que llegue un huésped. Verifica su identidad y reserva antes de dejarlo pasar.');setDialogue(D.nights[state.night].opening,'NOTA DEL DIRECTOR');$('decision-help').textContent='Comprueba los documentos antes de decidir.';updateUI();state.transition=1.3}
function showGuest(){if(state.phase!=='playing')return;const g=D.nights[state.night].guests[state.index];state.guest=g;state.guestX=492;state.spawn=0;state.tool='';A.knock();setDialogue(g.line,g.name);updateEvidence('◈ TERMINAL DE CONSULTAS',g.note);$('decision-help').textContent='Compara documento, registro y cámaras.';updateUI()}
function tool(which){if(!['playing','tutorial'].includes(state.phase)||!state.guest||state.guestX>296)return;if(state.phase==='tutorial'&&which!==['id','ledger','camera','question'][state.tutorialStep])return;A.click();state.tool=which;const g=state.guest;
 const messages={id:`IDENTIDAD: ${g.name}. Documento ${g.id}. Habitación solicitada: ${g.room}. ${g.note}`,ledger:`LIBRO DE RESERVAS: ${g.ledger}`,camera:`CÁMARA DE SEGURIDAD: ${g.camera}`,question:`RESPUESTA DEL HUÉSPED: «${g.question}»`};
 updateEvidence({'id':'▣ COMPROBACIÓN DE IDENTIDAD',ledger:'▤ REGISTRO DE RESERVAS',camera:'◉ CINTA DE SEGURIDAD',question:'? INTERROGATORIO'}[which],messages[which]);
 if(which==='question')setDialogue(g.question,g.name);
 if(which==='camera'){state.scene='camera';state.glitch=Math.max(state.glitch,.15);setTimeout(()=>{if(state.scene==='camera')state.scene='lobby'},2300)}
 if(state.phase==='tutorial')stageTutorial(state.tutorialStep+1);
 updateUI();}
function decision(accept){if(!['playing','tutorial'].includes(state.phase)||!state.guest||state.guestX>295)return;if(state.phase==='tutorial'){if(state.tutorialStep!==4||!accept)return;A.good();setDialogue('Perfecto. Ya puedes gestionar tu primera noche real.','DIRECTOR');finishTutorial();return;}const g=state.guest;A.click();const right=accept===g.trueGuest;state.decisions.push({night:state.night,guest:g.name,accept,right});if(right){A.good();state.tips+=accept?8:6;state.stress=Math.max(0,state.stress-5);setDialogue(accept?'Aquí tiene su llave. Buenas noches.':'Lo siento, no puedo darle una habitación.','RECEPCIÓN');}
 else{A.bad();state.errors++;state.stress=Math.min(100,state.stress+(accept?32:17));state.glitch=1.6;setDialogue(accept?'El huésped sonríe. Sus pasos no hacen ruido al alejarse.':'El cliente se marcha indignado. Has rechazado a alguien inocente.','RECEPCIÓN');}
 updateEvidence(right?'✓ DECISIÓN REGISTRADA':'✕ INCIDENTE REGISTRADO',right?'El registro de la noche se ha actualizado.':accept?'Has dejado entrar a alguien que no debía pasar.':'Has rechazado a un huésped con reserva válida.');
 state.guest=null;state.tool='';state.index++;state.timeMinutes+=8;state.transition=1.9;state.scene='lobby';updateUI();
 if(state.stress>=100){state.phase='ending';setTimeout(()=>endGame(true),1000)}
}
function nightEnd(){state.phase='nightEnd';A.spooky();let n=state.night;setDialogue(D.nights[n].closing,'GRABACIÓN ANÓNIMA');state.guest=null;updateUI();
 const last=n===D.nights.length-1;
 openModal(last?'EL TURNO HA TERMINADO':'06:00 · FIN DE TURNO',`<p>${D.nights[n].closing}</p><div class="result-row"><span>PROPINA ACUMULADA</span><b>${state.tips} €</b></div><div class="result-row"><span>ERRORES</span><b>${state.errors}</b></div><div class="result-row"><span>TENSIÓN</span><b>${state.stress}%</b></div><p>${last?'Las luces del hotel vuelven a apagarse. Ahora escuchas una llave girando detrás de ti.':'El director ha dejado una nota nueva para el siguiente turno.'}</p>`,last?'VER EL FINAL →':'SIGUIENTE NOCHE →',()=>{if(last){endGame(false)}else{state.night++;startNight()}})
}
function endGame(trapped){state.phase='ending';state.guest=null;updateUI();A.spooky();const bad=trapped||state.errors>=4, perfect=state.errors===0;
 const title=bad?'EL HOTEL TE RECUERDA':perfect?'LIBRE A LAS 06:00':'HAS SOBREVIVIDO';
 const desc=bad?'La puerta se cierra. En el libro de reservas aparece tu nombre junto a una habitación imposible: 404.':perfect?'No dejaste pasar a ninguna anomalía. Cuando sales, ves una fotografía antigua: en ella estás tú, trabajando aquí en 1961.':'Consigues abandonar el hotel al amanecer, pero en tu bolsillo aparece una llave marcada con el número 404.';
 openModal(title,`<p>${desc}</p><div class="result-row"><span>DECISIONES CORRECTAS</span><b>${state.decisions.filter(a=>a.right).length}/${state.decisions.length}</b></div><div class="result-row"><span>PROPINA FINAL</span><b>${state.tips} €</b></div><div class="result-row"><span>ERRORES</span><b>${state.errors}</b></div><p>Gracias por jugar la demo de <strong>ROOM 404</strong>.</p>`,'VOLVER A JUGAR →',reset)
}
function reset(){state.night=0;state.index=0;state.tips=0;state.errors=0;state.stress=0;state.decisions=[];state.glitch=0;state.guest=null;startNight()}
function renderIntro(){
 const s=state.cinemaElapsed,stage=Math.min(4,Math.floor(s/9.2)),progress=(s%9.2)/9.2;
 if(stage!==introScene){introScene=stage;voiceManager.speak(loreScenes[stage].text,stage)}
 if(stage===0){drawExterior(s);drawGuest(130+Math.max(0,s-1)*13,218,'business',.85,s)}
 else if(stage===1){drawLobby();drawGuest(455-progress*178,205,'business',1.4,s)}
 else if(stage===2){drawLobby();c.fillStyle='#0009';c.fillRect(0,0,480,270);box(133,100,214,110,'#bea77e');box(143,110,194,91,'#e8d4a9');word('NOTA AL EMPLEADO',157,130,'#3b3132','11px monospace');for(let i=0;i<5;i++){line(158,140+i*10,317-((i%2)*30),140+i*10,'#7f7769')}word('NO HAY HABITACIÓN 404.',157,194,'#873e3b','9px monospace')}
 else if(stage===3){drawHallway();if(progress>.3){drawGuest(241,170,'director',.58,s,true)}if(progress>.7&&Math.sin(s*18)>.6){box(0,0,480,270,'#a6b9b0')}}
 else {drawLobby();drawGuest(310+Math.sin(s*2)*4,205,'director',1.3,s,true);if(Math.sin(s*8)>0.9)box(0,0,480,270,'#a4b4a21d')}
 const story=loreScenes[stage];
 $('cinema-text').innerHTML='<span style="font-size:11px;letter-spacing:2px;color:#dda57d">'+story.head+'</span><br><strong>'+story.sub+'</strong><br>'+story.text;
}
function drawTitle(){drawLobby();glow(279,148,80,'#a75d4a35');if(Math.sin(t*.5)>.8){drawGuest(280,204,'director',1.5,t,true)}}
function frame(now){const dt=Math.min(.05,(now-prev)/1000||.016);prev=now;t+=dt;state.elapsed+=dt;
 c.imageSmoothingEnabled=false;
 if(state.phase==='intro'){state.cinemaElapsed+=dt;renderIntro();if(state.cinemaElapsed>=46)finishIntro()}
 else if(state.phase==='title'){drawTitle()}
 else {if(state.scene==='camera'){drawCamera()}else{drawLobby();drawLobbyGuest()}}
 if(state.phase==='playing'){
   if(state.transition>0){state.transition-=dt;if(state.transition<=0){if(state.index>=D.nights[state.night].guests.length){nightEnd()}else{showGuest()}}}
   if(state.guest&&state.guestX>state.guestTarget){state.guestX=Math.max(state.guestTarget,state.guestX-dt*155);if(state.guestX<=state.guestTarget){updateUI()}}
   if(state.glitch>0){state.glitch-=dt;const g=Math.max(0,state.glitch);if(Math.random()<g*.3){box(0,Math.random()*240,480,3+Math.random()*10,'#d9dfd12e');c.globalAlpha=Math.random()*.12;box(Math.random()*40,0,480,270,'#b2d6d7');c.globalAlpha=1}if(g>1.4)imageStatic(.15)}
 }
 imageStatic(.05);raf=requestAnimationFrame(frame)
}
$('start-btn').addEventListener('click',startIntro);$('skip-tutorial').addEventListener('click',finishTutorial);$('fullscreen-btn').addEventListener('click',toggleFullscreen);$('voice-btn').addEventListener('click',()=>{A.init();voiceManager.toggle()});$('skip-cinema').addEventListener('click',finishIntro);
for(const k of ['id','ledger','camera','question'])$('tool-'+k).addEventListener('click',()=>tool(k));
$('accept-btn').addEventListener('click',()=>decision(true));$('deny-btn').addEventListener('click',()=>decision(false));
$('help-btn').addEventListener('click',()=>{A.init();A.click();openModal('MANUAL DEL TURNO',`<p><strong>Investiga antes de decidir.</strong> Usa IDENTIDAD, REGISTRO, CÁMARAS y PREGUNTAR. Acepta huéspedes normales y rechaza las anomalías.</p><p>Atajos: <strong>1</strong> identidad, <strong>2</strong> reservas, <strong>3</strong> cámaras, <strong>4</strong> pregunta, <strong>A</strong> aceptar, <strong>R</strong> rechazar.</p><p>No existe la habitación 404.</p>`,'CONTINUAR →')});
$('sound-btn').addEventListener('click',()=>{A.init();A.mute(!A.isMuted());$('sound-state').textContent=A.isMuted()?'OFF':'ON';if(A.isMuted())voiceManager.stop()});
document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='f'&&!e.repeat){toggleFullscreen();return}if(!$('modal').classList.contains('hidden'))return;if(state.phase==='intro'&&(e.key===' '||e.key==='Escape')){finishIntro();return}
 const map={'1':'id','2':'ledger','3':'camera','4':'question'};if(map[e.key])tool(map[e.key]);if(e.key.toLowerCase()==='a')decision(true);if(e.key.toLowerCase()==='r')decision(false)});
window.Room404Debug={getState:()=>({...state}),nextGuest:showGuest,skipIntro:finishIntro,skipTutorial:finishTutorial,voice:voiceManager};
updateUI();raf=requestAnimationFrame(frame);
})();