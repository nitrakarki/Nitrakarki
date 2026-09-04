import{initializeApp}from"https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import{getFirestore,collection,addDoc,getDocs,query,orderBy,serverTimestamp}from"https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig={
apiKey:"AIzaSyC9w-i15TJEjy6VMfWW_q0EWOUtDp0lLI8",
authDomain:"nitra-hiking-trek.firebaseapp.com",
projectId:"nitra-hiking-trek",
storageBucket:"nitra-hiking-trek.firebasestorage.app",
messagingSenderId:"229092748752",
appId:"1:229092748752:web:ab822b061527ce37ce1dd5"
};

const app=initializeApp(firebaseConfig);
const db=getFirestore(app);

const menu=document.getElementById("menuBtn");
const nav=document.getElementById("nav");

if(menu)menu.addEventListener("click",()=>{
nav.classList.toggle("show");
menu.setAttribute("aria-expanded",nav.classList.contains("show"));
});

document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>{
nav.classList.remove("show");
menu.setAttribute("aria-expanded","false");
}));

let galleryIndex=0;

function visibleSlides(){
return window.innerWidth<=750?1:3;
}

function updateGallery(){
const track=document.getElementById("galleryTrack");
if(!track)return;
const total=track.children.length;
const visible=visibleSlides();
const max=Math.max(0,total-visible);
galleryIndex=Math.min(galleryIndex,max);
track.style.transform=`translateX(-${galleryIndex*(100/visible)}%)`;
createDots(total-visible+1);
}

function createDots(total){
const dots=document.getElementById("dots");
if(!dots)return;
dots.innerHTML="";
for(let i=0;i<total;i++){
const d=document.createElement("span");
d.className="dot"+(i===galleryIndex?" active":"");
d.onclick=()=>{galleryIndex=i;updateGallery()};
dots.appendChild(d);
}
}

window.moveGallery=function(direction){
const total=document.querySelectorAll(".gallery-slide").length;
const max=Math.max(0,total-visibleSlides());
galleryIndex+=direction;
if(galleryIndex<0)galleryIndex=max;
if(galleryIndex>max)galleryIndex=0;
updateGallery();
};

window.addEventListener("resize",updateGallery);
updateGallery();

const itineraries={
ebc:{
title:"Everest Base Camp Trek — 14 Days",
days:[
"Day 01: Arrival in Kathmandu and trek preparation.",
"Day 02: Fly to Lukla and trek to Phakding.",
"Day 03: Trek from Phakding to Namche Bazaar.",
"Day 04: Acclimatization day in Namche Bazaar.",
"Day 05: Trek from Namche Bazaar to Tengboche.",
"Day 06: Trek from Tengboche to Dingboche.",
"Day 07: Acclimatization day in Dingboche.",
"Day 08: Trek from Dingboche to Lobuche.",
"Day 09: Trek to Everest Base Camp via Gorak Shep.",
"Day 10: Hike to Kala Patthar and trek to Pheriche.",
"Day 11: Trek from Pheriche to Namche Bazaar.",
"Day 12: Trek from Namche Bazaar to Lukla.",
"Day 13: Fly from Lukla to Kathmandu.",
"Day 14: Departure from Nepal."
]},
abc:{
title:"Annapurna Base Camp Trek — 5 Days",
days:[
"Day 01: Drive Pokhara to Samrong and trek to Sinuwa (2,340m).",
"Day 02: Trek from Sinuwa (2,340m) to Himalaya (2,900m).",
"Day 03: Trek from Himalaya (2,900m) to Annapurna Base Camp (4,130m).",
"Day 04: Trek from Annapurna Base Camp to Bamboo.",
"Day 05: Trek to Jhinu Danda and drive back to Pokhara."
]},
langtang:{
title:"Langtang Valley Trek — 10 Days",
days:[
"Day 01: Drive from Kathmandu to Syabrubesi.",
"Day 02: Trek from Syabrubesi to Lama Hotel.",
"Day 03: Trek from Lama Hotel to Langtang Village.",
"Day 04: Trek from Langtang Village to Kyanjin Gompa.",
"Day 05: Explore Kyanjin Gompa and surrounding Himalayan views.",
"Day 06: Trek from Kyanjin Gompa to Lama Hotel.",
"Day 07: Trek from Lama Hotel to Thulo Syabru.",
"Day 08: Trek from Thulo Syabru to Sing Gompa.",
"Day 09: Trek from Sing Gompa to Dhunche.",
"Day 10: Drive back to Kathmandu."
]}
};

window.openItinerary=function(type){
const data=itineraries[type];
if(!data)return;
document.getElementById("modalContent").innerHTML=
`<h2>${data.title}</h2>${data.days.map((d,i)=>`<div class="day"><b>${d.split(":")[0]}:</b>${d.substring(d.indexOf(":")+1)}</div>`).join("")}`;
document.getElementById("modal").style.display="block";
document.body.style.overflow="hidden";
};

window.closeItinerary=function(){
document.getElementById("modal").style.display="none";
document.body.style.overflow="";
};

document.getElementById("modal")?.addEventListener("click",e=>{
if(e.target.id==="modal")closeItinerary();
});

document.addEventListener("keydown",e=>{
if(e.key==="Escape")closeItinerary();
});

const form=document.getElementById("reviewForm");
const list=document.getElementById("reviewList");
const avg=document.getElementById("avg");
const avgStars=document.getElementById("avgStars");
const count=document.getElementById("count");
const msg=document.getElementById("msg");
const submit=document.getElementById("submit");

function stars(n){
return"★".repeat(n)+"☆".repeat(5-n);
}

function escapeHTML(str){
return String(str).replace(/[&<>"']/g,m=>({
"&":"&amp;",
"<":"&lt;",
">":"&gt;",
'"':"&quot;",
"'":"&#039;"
}[m]));
}

async function loadReviews(){
try{
const q=query(collection(db,"reviews"),orderBy("createdAt","desc"));
const snap=await getDocs(q);
let total=0;
list.innerHTML="";

if(snap.empty){
count.textContent="No reviews yet";
avg.textContent="0.0";
avgStars.textContent="☆☆☆☆☆";
return;
}

snap.forEach(doc=>{
const r=doc.data();
const rating=Number(r.rating)||0;
total+=rating;

const card=document.createElement("div");
card.className="review-card";
card.innerHTML=
`<h3>${escapeHTML(r.name||"Traveler")}</h3>
<div class="review-stars">${stars(rating)}</div>
<p>${escapeHTML(r.text||"")}</p>`;
list.appendChild(card);
});

const average=total/snap.size;
avg.textContent=average.toFixed(1);
avgStars.textContent=stars(Math.round(average));
count.textContent=`${snap.size} review${snap.size===1?"":"s"}`;

}catch(error){
console.error(error);
count.textContent="Unable to load reviews";
}
}

form?.addEventListener("submit",async e=>{
e.preventDefault();

const name=document.getElementById("name").value.trim();
const rating=Number(document.getElementById("rating").value);
const text=document.getElementById("text").value.trim();

if(!name||!rating||!text)return;

submit.disabled=true;
submit.textContent="Submitting...";
msg.textContent="";

try{
await addDoc(collection(db,"reviews"),{
name:name,
rating:rating,
text:text,
createdAt:serverTimestamp()
});

form.reset();
msg.textContent="Thank you! Your review has been submitted.";
msg.style.color="#087f5b";
await loadReviews();

}catch(error){
console.error(error);
msg.textContent="Sorry, your review could not be submitted.";
msg.style.color="#c00";

}finally{
submit.disabled=false;
submit.textContent="Submit Review";
}
});

loadReviews();
