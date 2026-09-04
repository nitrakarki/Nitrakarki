import{initializeApp}from"https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import{getFirestore,collection,getDocs,addDoc,serverTimestamp}from"https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const app=initializeApp({
apiKey:"AIzaSyC9w-i15TJEjy6VMfWW_q0EWOUtDp0lLI8",
authDomain:"nitra-hiking-trek.firebaseapp.com",
projectId:"nitra-hiking-trek",
storageBucket:"nitra-hiking-trek.firebasestorage.app",
messagingSenderId:"229092748752",
appId:"1:229092748752:web:ab822b061527ce37ce1dd5"
});

const db=getFirestore(app);
const nav=document.getElementById("nav");

document.getElementById("menuBtn")?.addEventListener("click",()=>{
nav?.classList.toggle("show");
});

document.querySelectorAll("#nav a").forEach(a=>{
a.onclick=()=>nav?.classList.remove("show");
});

const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({
"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
}[c]));

const itineraries={
ebc:["Everest Base Camp Trek — 14 Days",
"Day 1: Kathmandu — 1,300 m",
"Day 2: Kathmandu – Lukla – Phakding — 2,651 m • 4 hrs",
"Day 3: Phakding – Namche Bazaar — 3,438 m • 5–6 hrs",
"Day 4: Acclimatization at Namche Bazaar",
"Day 5: Namche – Tengboche — 3,860 m",
"Day 6: Tengboche – Dingboche — 4,410 m",
"Day 7: Acclimatization at Dingboche",
"Day 8: Dingboche – Lobuche — 4,910 m",
"Day 9: Lobuche – Everest Base Camp – Gorak Shep",
"Day 10: Kala Patthar – Pheriche",
"Day 11: Pheriche – Namche Bazaar",
"Day 12: Namche – Lukla",
"Day 13: Lukla – Kathmandu",
"Day 14: Departure"],

abc:["Annapurna Base Camp Trek — 5 Days",
"Day 1: Pokhara to Chhomrong",
"Day 2: Chhomrong to Himalaya",
"Day 3: Himalaya to Annapurna Base Camp",
"Day 4: Annapurna Base Camp to Bamboo",
"Day 5: Bamboo to Pokhara"],

langtang:["Langtang Valley Trek — 10 Days",
"Day 1: Kathmandu",
"Day 2: Kathmandu – Syabrubesi",
"Day 3: Syabrubesi – Lama Hotel",
"Day 4: Lama Hotel – Langtang Village",
"Day 5: Langtang Village – Kyanjin Gompa",
"Day 6: Exploration at Kyanjin Gompa",
"Day 7: Kyanjin Gompa – Lama Hotel",
"Day 8: Lama Hotel – Syabrubesi",
"Day 9: Syabrubesi – Kathmandu",
"Day 10: Departure"]
};

window.openItinerary=k=>{
const d=itineraries[k],m=document.getElementById("modal"),c=document.getElementById("modalContent");
if(!d||!m||!c)return;
c.innerHTML=`<h2>${esc(d[0])}</h2>`+
d.slice(1).map(x=>`<div class="day">${esc(x)}</div>`).join("");
m.style.display="block";
document.body.style.overflow="hidden";
};

window.closeItinerary=()=>{
document.getElementById("modal").style.display="none";
document.body.style.overflow="";
};

document.getElementById("modal")?.addEventListener("click",e=>{
if(e.target.id==="modal")closeItinerary();
});

let gi=0;
const track=document.getElementById("galleryTrack");
const dots=document.getElementById("dots");
const mobile=()=>innerWidth<=750;

function total(){
return Math.max(1,document.querySelectorAll(".gallery-slide").length-(mobile()?1:3)+1);
}

function gallery(){
const n=total();
gi=(gi+n)%n;
if(track)track.style.transform=
`translateX(-${gi*(mobile()?100:33.333333)}%)`;

if(dots)[...dots.children].forEach((x,i)=>
x.classList.toggle("active",i===gi));
}

function makeDots(){
if(!dots)return;
dots.innerHTML="";
for(let i=0;i<total();i++){
const d=document.createElement("span");
d.className="dot";
d.onclick=()=>{
gi=i;
gallery();
};
dots.appendChild(d);
}
gallery();
}

window.moveGallery=x=>{
gi+=x;
gallery();
};

makeDots();
addEventListener("resize",makeDots);

const stars=n=>
"★".repeat(Math.round(n))+
"☆".repeat(5-Math.round(n));

async function loadReviews(){
const list=document.getElementById("reviewList");

try{
const snap=await getDocs(collection(db,"reviews"));
const r=[];

snap.forEach(x=>{
const d=x.data(),rating=Number(d.rating);

if(d.name&&d.text&&rating>=1&&rating<=5)
r.push({
name:d.name,
text:d.text,
rating
});
});

list.innerHTML=r.length
?r.map(x=>`
<div class="review-card">
<b>${esc(x.name)}</b>
<div class="review-stars">${stars(x.rating)}</div>
<p>${esc(x.text)}</p>
</div>`).join("")
:"<div class='review-card'>Be the first to leave a review!</div>";

const avg=r.length
?r.reduce((a,x)=>a+x.rating,0)/r.length
:0;

document.getElementById("avg").textContent=avg.toFixed(1);
document.getElementById("avgStars").textContent=stars(avg);
document.getElementById("count").textContent=
`${r.length} review${r.length===1?"":"s"}`;

}catch(e){
console.error(e);
list.innerHTML=
"<div class='review-card'>Reviews are temporarily unavailable.</div>";
}
}

document.getElementById("reviewForm")?.addEventListener("submit",async e=>{
e.preventDefault();

const name=document.getElementById("name");
const rating=document.getElementById("rating");
const text=document.getElementById("text");
const msg=document.getElementById("msg");
const btn=document.getElementById("submit");

if(!name.value.trim()||!text.value.trim()||!rating.value){
msg.textContent="Please complete all fields.";
return;
}

btn.disabled=true;
msg.textContent="Submitting...";

try{
await addDoc(collection(db,"reviews"),{
name:name.value.trim(),
text:text.value.trim(),
rating:Number(rating.value),
createdAt:serverTimestamp()
});

e.target.reset();
msg.textContent="Thank you! Your review has been submitted.";
loadReviews();

}catch(err){
console.error(err);
msg.textContent="Could not submit your review.";
}

btn.disabled=false;
});

loadReviews();
