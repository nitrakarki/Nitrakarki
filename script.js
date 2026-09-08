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
const db=getFirestore(initializeApp(firebaseConfig));

/* MENU */
const menu=document.getElementById("menuBtn"),nav=document.getElementById("nav");
menu?.addEventListener("click",()=>{
nav.classList.toggle("show");
menu.setAttribute("aria-expanded",nav.classList.contains("show"));
});
document.querySelectorAll("nav a").forEach(a=>a.onclick=()=>{
nav.classList.remove("show");
menu?.setAttribute("aria-expanded","false");
});

/* GALLERY */
let galleryIndex=0;
const visibleSlides=()=>innerWidth<=750?1:3;

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

function updateGallery(){
const track=document.getElementById("galleryTrack");
if(!track)return;
const total=track.children.length,v=visibleSlides(),max=Math.max(0,total-v);
galleryIndex=Math.min(galleryIndex,max);
track.style.transform=`translateX(-${galleryIndex*(100/v)}%)`;
createDots(max+1);
}

window.moveGallery=d=>{
const max=Math.max(0,document.querySelectorAll(".gallery-slide").length-visibleSlides());
galleryIndex+=d;
if(galleryIndex<0)galleryIndex=max;
if(galleryIndex>max)galleryIndex=0;
updateGallery();
};

addEventListener("resize",updateGallery);
updateGallery();

/* ITINERARIES */
const itineraries={
ebc:{title:"Everest Base Camp Trek — 14 Days",days:[
"Day 01: Arrival in Kathmandu and trek preparation.",
"Day 02: Fly to Lukla (2,860m) and trek to Phakding.",
"Day 03: Trek from Phakding to Namche Bazaar (3,440m).",
"Day 04: Acclimatization day in Namche Bazaar (Excursion to Everest View Hotel).",
"Day 05: Trek from Namche Bazaar to Tengboche Monastery.",
"Day 06: Trek from Tengboche to Dingboche (4,410m).",
"Day 07: Acclimatization day in Dingboche.",
"Day 08: Trek from Dingboche to Lobuche.",
"Day 09: Trek to Everest Base Camp (5,364m) via Gorak Shep.",
"Day 10: Hike to Kala Patthar (5,545m) and trek down to Pheriche.",
"Day 11: Trek from Pheriche to Namche Bazaar.",
"Day 12: Trek from Namche Bazaar to Lukla.",
"Day 13: Fly from Lukla to Kathmandu.",
"Day 14: Final Departure from Nepal."
]},

abc:{title:"Annapurna Base Camp Trek — 5 Days",days:[
"Day 01: Drive Pokhara to Samrong and trek to Sinuwa (2,340m).",
"Day 02: Trek from Sinuwa to Himalaya (2,900m).",
"Day 03: Trek from Himalaya to Annapurna Base Camp (4,130m) via Deurali.",
"Day 04: Trek from Annapurna Base Camp down to Bamboo.",
"Day 05: Trek to Jhinu Danda (Hot Springs) and drive back to Pokhara."
]},

langtang:{title:"Langtang Valley Trek — 10 Days",days:[
"Day 01: Scenic drive from Kathmandu to Syabrubesi.",
"Day 02: Trek from Syabrubesi to Lama Hotel.",
"Day 03: Trek from Lama Hotel to Langtang Village.",
"Day 04: Trek from Langtang Village to Kyanjin Gompa (3,870m).",
"Day 05: Excursion to Kyanjin Ri / Tserko Ri for panoramic glacier views.",
"Day 06: Trek down from Kyanjin Gompa to Lama Hotel.",
"Day 07: Trek from Lama Hotel to Thulo Syabru.",
"Day 08: Trek from Thulo Syabru to Sing Gompa.",
"Day 09: Trek from Sing Gompa to Dhunche.",
"Day 10: Drive back from Dhunche to Kathmandu."
]},

mardi:{title:"Mardi Himal Trek — 6 Days",days:[
"Day 01: Drive from Pokhara to Kande and trek to Australian Camp / Forest Camp.",
"Day 02: Trek from Forest Camp to Low Camp.",
"Day 03: Trek from Low Camp to High Camp (3,580m).",
"Day 04: Sunrise hike to Mardi Himal Base Camp (4,500m) and trek back to Low Camp.",
"Day 05: Trek from Low Camp to Siding Village.",
"Day 06: Drive from Siding Village back to Pokhara."
]},

manaslu:{title:"Manaslu Circuit Trek — 14 Days",days:[
"Day 01: Drive from Kathmandu to Soti Khola / Machha Khola.",
"Day 02: Trek to Jagat (1,340m).",
"Day 03: Trek from Jagat to Deng.",
"Day 04: Trek from Deng to Namrung.",
"Day 05: Trek from Namrung to Lho Village.",
"Day 06: Trek from Lho to Sama Gaun (3,530m).",
"Day 07: Acclimatization day at Sama Gaun (Visit Manaslu Base Camp or Birendra Lake).",
"Day 08: Trek from Sama Gaun to Samdo.",
"Day 09: Acclimatization / Rest day at Samdo.",
"Day 10: Trek from Samdo to Dharamsala (Larkya Phedi - 4,460m).",
"Day 11: Cross Larkya La Pass (5,106m) and trek down to Bimthang.",
"Day 12: Trek from Bimthang to Tilije.",
"Day 13: Trek to Dharapani and drive to Besisahar.",
"Day 14: Drive from Besisahar back to Kathmandu."
]},

/* NEW GOKYO + CHO LA TREK */
gokyo:{title:"EBC Trek via Gokyo Cho La Pass — 17 Days",days:[
"Day 01: Arrival in Kathmandu (1,400m).",
"Day 02: Fly from Kathmandu to Lukla (2,840m) and trek to Phakding (2,610m).",
"Day 03: Trek from Phakding to Namche Bazaar (3,440m).",
"Day 04: Acclimatization day in Namche Bazaar.",
"Day 05: Trek from Namche Bazaar to Dole (4,110m).",
"Day 06: Trek from Dole to Machhermo (4,470m).",
"Day 07: Trek from Machhermo to Gokyo (4,790m).",
"Day 08: Acclimatization day at Gokyo and optional Gokyo Ri hike.",
"Day 09: Trek from Gokyo to Dragnag (4,750m).",
"Day 10: Cross Cho La Pass (5,420m) and trek to Dzongla (4,830m).",
"Day 11: Trek from Dzongla to Lobuche (4,910m).",
"Day 12: Trek from Lobuche to Everest Base Camp (5,365m) via Gorak Shep.",
"Day 13: Early morning hike to Kala Patthar (5,545m), then trek to Pheriche (4,240m).",
"Day 14: Trek from Pheriche to Namche Bazaar (3,440m).",
"Day 15: Trek from Namche Bazaar to Lukla (2,840m).",
"Day 16: Fly from Lukla to Kathmandu.",
"Day 17: Final departure from Nepal."
]}};

window.openItinerary=type=>{
const x=itineraries[type];
if(!x)return;
document.getElementById("modalContent").innerHTML=
`<h2>${x.title}</h2>`+
x.days.map(d=>`<div class="day"><b>${d.split(":")[0]}:</b>${d.substring(d.indexOf(":")+1)}</div>`).join("");
document.getElementById("modal").style.display="block";
document.body.style.overflow="hidden";
};

window.closeItinerary=()=>{
document.getElementById("modal").style.display="none";
document.body.style.overflow="";
};

document.getElementById("modal")?.addEventListener("click",e=>{
if(e.target.id==="modal")closeItinerary();
});

document.addEventListener("keydown",e=>{
if(e.key==="Escape")closeItinerary();
});

/* REVIEWS */
const form=document.getElementById("reviewForm"),
list=document.getElementById("reviewList"),
avg=document.getElementById("avg"),
avgStars=document.getElementById("avgStars"),
count=document.getElementById("count"),
msg=document.getElementById("msg"),
submit=document.getElementById("submit"),
viewAll=document.getElementById("viewAllReviews");

let reviews=[],showAll=false;

const stars=n=>{
n=Math.max(0,Math.min(5,Number(n)||0));
return"★".repeat(n)+"☆".repeat(5-n);
};

const escapeHTML=s=>String(s).replace(/[&<>"']/g,m=>({
"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
}[m]));

function renderReviews(){
list.innerHTML="";
(reviews.length>3&&showAll?reviews:reviews.slice(0,3)).forEach(r=>{
const card=document.createElement("div");
card.className="review-card";
card.innerHTML=`<h3>${escapeHTML(r.name)}</h3><div class="review-stars">${stars(r.rating)}</div><p>${escapeHTML(r.text)}</p>`;
list.appendChild(card);
});

if(reviews.length>3){
viewAll.style.display="flex";
viewAll.textContent=showAll?"Show Less":`View All Reviews (${reviews.length})`;
}else viewAll.style.display="none";
}

viewAll?.addEventListener("click",()=>{
showAll=!showAll;
renderReviews();
if(!showAll)document.getElementById("reviews")?.scrollIntoView({behavior:"smooth",block:"start"});
});

async function loadReviews(){
try{
const snap=await getDocs(query(collection(db,"reviews"),orderBy("createdAt","desc")));
reviews=[];

if(snap.empty){
avg.textContent="0.0";
avgStars.textContent="☆☆☆☆☆";
count.textContent="No reviews yet";
viewAll.style.display="none";
return;
}

let total=0;

snap.forEach(doc=>{
const r=doc.data(),rating=Number(r.rating)||0;
total+=rating;
reviews.push({name:r.name||"Traveler",rating,text:r.text||""});
});

const average=total/reviews.length;
avg.textContent=average.toFixed(1);
avgStars.textContent=stars(Math.round(average));
count.textContent=`${reviews.length} review${reviews.length===1?"":"s"}`;
showAll=false;
renderReviews();

}catch(e){
console.error(e);
count.textContent="Unable to load reviews";
}
}

/* SUBMIT REVIEW */
form?.addEventListener("submit",async e=>{
e.preventDefault();

const name=document.getElementById("name").value.trim(),
rating=Number(document.getElementById("rating").value),
text=document.getElementById("text").value.trim();

if(!name||!rating||!text)return;

submit.disabled=true;
submit.textContent="Submitting...";
msg.textContent="";

try{
await addDoc(collection(db,"reviews"),{
name,rating,text,createdAt:serverTimestamp()
});

form.reset();
msg.textContent="Thank you! Your review has been submitted.";
msg.style.color="#087f5b";
await loadReviews();

}catch(e){
console.error(e);
msg.textContent="Sorry, your review could not be submitted.";
msg.style.color="#c00";
}finally{
submit.disabled=false;
submit.textContent="Submit Review";
}
});

loadReviews();
