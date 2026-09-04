const itineraries={
ebc:[
"Everest Base Camp Trek — 14 Days",
"Day 1: Kathmandu — 1,300 m",
"Day 2: Kathmandu – Lukla – Phakding — 2,651 m • 4 hrs",
"Day 3: Phakding – Namche Bazaar — 3,440 m • 5–6 hrs",
"Day 4: Acclimatization in Namche — 3,700 m",
"Day 5: Namche – Tengboche — 3,956 m • 5–6 hrs",
"Day 6: Tengboche – Dingboche — 4,380 m • 4–5 hrs",
"Day 7: Acclimatization in Dingboche — 4,380 m",
"Day 8: Dingboche – Lobuche — 4,938 m • 4–5 hrs",
"Day 9: Lobuche – Gorakshep – Kala Patthar — 5,160 m • 6–7 hrs",
"Day 10: Gorakshep – Pheriche – Everest Base Camp — 4,371 m • 8–9 hrs",
"Day 11: Pheriche – Namche — 3,440 m • 6–7 hrs",
"Day 12: Namche – Lukla — 2,860 m • 7 hrs",
"Day 13: Lukla – Kathmandu — 30 min flight",
"Day 14: Final Departure"
],
abc:[
"Annapurna Base Camp Trek — 5 Days",
"Day 1: Pokhara – Samrong – Sinuwa",
"Day 2: Sinuwa – Himalaya",
"Day 3: Himalaya – Annapurna Base Camp — 4,130 m • 6–7 hrs",
"Day 4: Annapurna Base Camp – Sinuwa — 17 km • 7–8 hrs",
"Day 5: Sinuwa – Jhinu Danda – Pokhara"
],
langtang:[
"Langtang Valley Trek — 10 Days",
"Day 1: Arrival in Kathmandu — 1,400 m / 4,593 ft — Airport pickup, hotel transfer and trip meeting",
"Day 2: Kathmandu – Syabrubesi — 1,460 m / 4,790 ft — Drive",
"Day 3: Syabrubesi – Lama Hotel — 2,460 m / 8,070 ft — Trek",
"Day 4: Lama Hotel – Langtang Village — 3,450 m / 11,318 ft — Trek",
"Day 5: Langtang Village – Kyanjin Gompa — 3,870 m / 12,696 ft — Trek",
"Day 6: Exploration Day at Kyanjin Gompa — Hike to Tsergo Ri or Kyanjin Ri",
"Day 7: Kyanjin Gompa – Lama Hotel — 2,460 m / 8,070 ft — Trek",
"Day 8: Lama Hotel – Syabrubesi — 1,460 m / 4,790 ft — Trek",
"Day 9: Syabrubesi – Kathmandu — 1,400 m / 4,593 ft — Drive",
"Day 10: Final Departure or onward for next program"
]};

const $=id=>document.getElementById(id);

window.openItinerary=x=>{
const a=itineraries[x];
if(!a)return;
$("modalContent").innerHTML="<h2>🏔️ "+a[0]+"</h2>"+
a.slice(1).map(d=>{
const p=d.split(" — ");
return "<div class='day'><b>"+p[0]+"</b>"+(p.length>1?" — "+p.slice(1).join(" — "):"")+"</div>";
}).join("");
$("modal").style.display="block";
document.body.style.overflow="hidden";
};

window.closeItinerary=()=>{
$("modal").style.display="none";
document.body.style.overflow="";
};

const nav=$("nav"),menu=$("menuBtn");

menu.onclick=()=>{
const open=nav.classList.toggle("show");
menu.setAttribute("aria-expanded",open);
};

document.querySelectorAll("#nav a").forEach(a=>{
a.onclick=()=>{
nav.classList.remove("show");
menu.setAttribute("aria-expanded","false");
};
});

$("modal").onclick=e=>{
if(e.target.id==="modal")closeItinerary();
};

addEventListener("keydown",e=>{
if(e.key==="Escape")closeItinerary();
});

/* GALLERY */

let gi=0;
let desk=innerWidth>750;
const track=$("galleryTrack"),dots=$("dots");

function makeDots(){
dots.innerHTML="";
const n=desk?8:10;
for(let i=0;i<n;i++){
const d=document.createElement("span");
d.className="dot"+(i===gi?" active":"");
d.onclick=()=>{
gi=i;
showGallery();
};
dots.appendChild(d);
}
}

function showGallery(){
track.style.transform=
"translateX(-"+gi*(desk?33.333:100)+"%)";

[...dots.children].forEach((d,i)=>
d.classList.toggle("active",i===gi)
);
}

window.moveGallery=n=>{
const max=desk?7:9;
gi=(gi+n+max+1)%(max+1);
showGallery();
};

addEventListener("resize",()=>{
const d=innerWidth>750;
if(d!==desk){
desk=d;
gi=0;
makeDots();
showGallery();
}
});

makeDots();
showGallery();

let sx=0;

track.addEventListener("touchstart",
e=>sx=e.touches[0].clientX,
{passive:true}
);

track.addEventListener("touchend",e=>{
const x=e.changedTouches[0].clientX;
if(Math.abs(x-sx)>50)moveGallery(x<sx?1:-1);
},{passive:true});

/* FLOATING WHATSAPP */

const cf=$("contactFloat");
let timer;

addEventListener("scroll",()=>{
cf.classList.add("hide");
clearTimeout(timer);
timer=setTimeout(()=>cf.classList.remove("hide"),700);
},{passive:true});

/* FIREBASE REVIEWS */

import{
initializeApp
}from"https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import{
getFirestore,
collection,
getDocs,
addDoc,
serverTimestamp
}from"https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig={
apiKey:"AIzaSyDvQwnMC_6WkyL_TuidQ9yddm8lCS07sXA",
authDomain:"nitra-hiking-trek.firebaseapp.com",
projectId:"nitra-hiking-trek",
storageBucket:"nitra-hiking-trek.firebasestorage.app",
messagingSenderId:"229092748752",
appId:"1:229092748752:web:ab822b061527ce37ce1dd5"
};

const db=getFirestore(initializeApp(firebaseConfig));

const stars=n=>
n>0?"★".repeat(n)+"☆".repeat(5-n):"☆☆☆☆☆";

function safe(v){
return String(v).replace(/[<>&"']/g,m=>({
"<":"<",
">":">",
"&":"&",
'"':""",
"'":"'"
}[m]));
}

async function loadReviews(){

try{

const snap=await getDocs(collection(db,"reviews"));
const reviews=[];

snap.forEach(doc=>{
const r=doc.data();
const rating=Number(r.rating);

if(
r.name&&
r.text&&
rating>=1&&
rating<=5
){
reviews.push({
name:safe(r.name),
text:safe(r.text),
rating,
createdAt:r.createdAt
});
}
});

reviews.sort((a,b)=>
(b.createdAt?.seconds||0)-
(a.createdAt?.seconds||0)
);

const total=reviews.reduce(
(sum,r)=>sum+r.rating,0
);

const average=
reviews.length?
total/reviews.length:0;

$("avg").textContent=
reviews.length?average.toFixed(1):"0.0";

$("avgStars").textContent=
reviews.length?
stars(Math.round(average)):
"☆☆☆☆☆";

$("count").textContent=
reviews.length?
reviews.length+" "+
(reviews.length===1?"review":"reviews"):
"No reviews yet";

$("reviewList").innerHTML=
reviews.length?
reviews.map(r=>
"<div class='review-card'>"+
"<b class='reviewer'>"+r.name+"</b>"+
"<div class='review-stars'>"+
stars(r.rating)+
"</div>"+
"<p>"+r.text+"</p>"+
"</div>"
).join(""):
"<div class='review-card'>"+
"Be the first to leave a review!"+
"</div>";

}catch(error){

console.error("Reviews error:",error);

$("reviewList").innerHTML=
"<div class='review-card'>"+
"Reviews are temporarily unavailable."+
"</div>";

$("count").textContent=
"Reviews unavailable";

}
}

$("reviewForm").onsubmit=async e=>{

e.preventDefault();

const button=$("submit");

button.disabled=true;
$("msg").textContent="Submitting...";

try{

const name=$("name").value.trim();
const rating=Number($("rating").value);
const text=$("text").value.trim();

if(
!name||
!text||
rating<1||
rating>5||
name.length>60||
text.length>500
){
throw Error("Invalid review");
}

await addDoc(
collection(db,"reviews"),
{
name,
rating,
text,
createdAt:serverTimestamp()
}
);

$("reviewForm").reset();

$("msg").textContent=
"Thank you! Your review has been submitted.";

await loadReviews();

}catch(error){

console.error("Submit error:",error);

$("msg").textContent=
"Could not submit review. Please try again.";

}finally{

button.disabled=false;

}
};

loadReviews();
