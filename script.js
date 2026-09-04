import{initializeApp}from"https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import{getFirestore,collection,getDocs,addDoc,serverTimestamp}from"https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

/* MENU */
const nav=document.getElementById("nav"),menu=document.getElementById("menuBtn");
menu?.addEventListener("click",()=>{
 nav.classList.toggle("show");
 menu.setAttribute("aria-expanded",nav.classList.contains("show"));
});
document.querySelectorAll("#nav a").forEach(a=>a.onclick=()=>{
 nav.classList.remove("show");menu?.setAttribute("aria-expanded","false");
});

/* SECURITY */
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));

/* ITINERARIES */
const itineraries={
ebc:["Everest Base Camp Trek — 14 Days","Day 1: Kathmandu — 1,300 m","Day 2: Kathmandu – Lukla – Phakding — 2,651 m","Day 3: Phakding – Namche Bazaar — 3,438 m","Day 4: Acclimatization at Namche Bazaar","Day 5: Namche – Tengboche — 3,860 m","Day 6: Tengboche – Dingboche — 4,410 m","Day 7: Acclimatization at Dingboche","Day 8: Dingboche – Lobuche — 4,910 m","Day 9: Lobuche – Everest Base Camp – Gorak Shep","Day 10: Kala Patthar – Pheriche","Day 11: Pheriche – Namche Bazaar","Day 12: Namche – Lukla","Day 13: Lukla – Kathmandu","Day 14: Departure"],
abc:["Annapurna Base Camp Trek — 5 Days","Day 1: Pokhara – Chhomrong","Day 2: Chhomrong – Himalaya","Day 3: Himalaya – Annapurna Base Camp","Day 4: Annapurna Base Camp – Bamboo","Day 5: Bamboo – Pokhara"],
langtang:["Langtang Valley Trek — 10 Days","Day 1: Kathmandu – Syabrubesi","Day 2: Syabrubesi – Lama Hotel","Day 3: Lama Hotel – Langtang Village","Day 4: Langtang Village – Kyanjin Gompa","Day 5: Kyanjin Gompa Exploration","Day 6: Kyanjin Gompa – Lama Hotel","Day 7: Lama Hotel – Syabrubesi","Day 8: Syabrubesi – Kathmandu","Day 9: Kathmandu","Day 10: Departure"]
};

window.openItinerary=k=>{
 const d=itineraries[k],m=document.getElementById("modal"),c=document.getElementById("modalContent");
 if(!d||!m||!c)return;
 c.innerHTML=`<h2>${esc(d[0])}</h2>`+d.slice(1).map(x=>`<div class="day">${esc(x)}</div>`).join("");
 m.style.display="block";document.body.style.overflow="hidden";
};

window.closeItinerary=()=>{
 document.getElementById("modal").style.display="none";
 document.body.style.overflow="";
};

document.getElementById("modal")?.addEventListener("click",e=>{
 if(e.target.id==="modal")closeItinerary();
});
document.addEventListener("keydown",e=>e.key==="Escape"&&closeItinerary());

/* GALLERY */
let gi=0;
const track=document.getElementById("galleryTrack"),dots=document.getElementById("dots");
const mobile=()=>innerWidth<=750;

function total(){
 return Math.max(1,document.querySelectorAll(".gallery-slide").length-(mobile()?1:3)+1);
}

function gallery(){
 const n=total();
 gi=(gi+n)%n;
 if(track)track.style.transform=`translateX(-${gi*(mobile()?100:33.333333)}%)`;
 if(dots)[...dots.children].forEach((x,i)=>x.classList.toggle("active",i===gi));
}

function makeDots(){
 if(!dots)return;
 dots.innerHTML="";
 for(let i=0;i<total();i++){
  const d=document.createElement("span");
  d.className="dot";d.onclick=()=>{gi=i;gallery()};
  dots.appendChild(d);
 }
 gallery();
}

window.moveGallery=x=>{gi+=x;gallery()};
makeDots();addEventListener("resize",makeDots);

/* FIREBASE
   Replace these with your Firebase Web App config. */
const firebaseConfig={
 apiKey:"YOUR_API_KEY",
 authDomain:"YOUR_PROJECT.firebaseapp.com",
 projectId:"YOUR_PROJECT_ID",
 storageBucket:"YOUR_PROJECT.appspot.com",
 messagingSenderId:"YOUR_SENDER_ID",
 appId:"YOUR_APP_ID"
};

const ready=firebaseConfig.apiKey!="YOUR_API_KEY"&&firebaseConfig.projectId!="YOUR_PROJECT_ID";
let db=null;

if(ready)db=getFirestore(initializeApp(firebaseConfig));

/* REVIEWS */
const stars=n=>{
 n=Math.round(Number(n)||0);
 return"★".repeat(n)+"☆".repeat(5-n);
};

async function loadReviews(){
 const list=document.getElementById("reviewList");
 if(!list)return;

 if(!db){
  list.innerHTML='<div class="review-card"><h3>Reviews not connected</h3><p>Firebase configuration is required.</p></div>';
  document.getElementById("count").textContent="0 reviews";
  return;
 }

 try{
  const snap=await getDocs(collection(db,"reviews")),r=[];
  snap.forEach(x=>{
   const d=x.data(),rating=Number(d.rating);
   if(d.name&&d.text&&rating>=1&&rating<=5)r.push({name:d.name,text:d.text,rating});
  });

  r.reverse();

  list.innerHTML=r.length?r.map(x=>`
  <div class="review-card">
  <h3>${esc(x.name)}</h3>
  <div class="review-stars">${stars(x.rating)}</div>
  <p>${esc(x.text)}</p>
  </div>`).join(""):`
  <div class="review-card"><h3>No reviews yet</h3><p>Be the first traveler to leave a review!</p></div>`;

  const avg=r.length?r.reduce((a,x)=>a+x.rating,0)/r.length:0;
  document.getElementById("avg").textContent=avg.toFixed(1);
  document.getElementById("avgStars").textContent=stars(avg);
  document.getElementById("count").textContent=`${r.length} review${r.length==1?"":"s"}`;

 }catch(e){
  console.error(e);
  list.innerHTML='<div class="review-card"><h3>Reviews temporarily unavailable</h3><p>Please try again later.</p></div>';
 }
}

/* SUBMIT REVIEW */
document.getElementById("reviewForm")?.addEventListener("submit",async e=>{
 e.preventDefault();

 const name=document.getElementById("name"),rating=document.getElementById("rating"),
 text=document.getElementById("text"),msg=document.getElementById("msg"),
 btn=document.getElementById("submit");

 if(!name.value.trim()||!text.value.trim()||!rating.value){
  msg.textContent="Please complete all fields.";return;
 }

 if(!db){
  msg.textContent="Reviews are not connected yet.";return;
 }

 btn.disabled=true;msg.textContent="Submitting...";

 try{
  await addDoc(collection(db,"reviews"),{
   name:name.value.trim(),
   text:text.value.trim(),
   rating:Number(rating.value),
   createdAt:serverTimestamp()
  });

  e.target.reset();
  msg.textContent="Thank you! Your review has been submitted.";
  await loadReviews();
 }catch(err){
  console.error(err);
  msg.textContent="Could not submit your review. Please try again.";
 }

 btn.disabled=false;
});

loadReviews();
