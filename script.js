import{initializeApp}from"https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import{getFirestore,collection,getDocs,addDoc,serverTimestamp}from"https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

/* ITINERARIES */
const itineraries={
ebc:["Everest Base Camp Trek — 14 Days","Day 1: Kathmandu — 1,300 m","Day 2: Kathmandu – Lukla – Phakding — 2,651 m • 4 hrs","Day 3: Phakding – Namche Bazaar — 3,440 m • 5–6 hrs","Day 4: Acclimatization in Namche — 3,700 m","Day 5: Namche – Tengboche — 3,956 m • 5–6 hrs","Day 6: Tengboche – Dingboche — 4,380 m • 4–5 hrs","Day 7: Acclimatization in Dingboche — 4,380 m","Day 8: Dingboche – Lobuche — 4,938 m • 4–5 hrs","Day 9: Lobuche – Gorakshep – Kala Patthar — 5,160 m • 6–7 hrs","Day 10: Gorakshep – Pheriche – Everest Base Camp — 4,371 m • 8–9 hrs","Day 11: Pheriche – Namche — 3,440 m • 6–7 hrs","Day 12: Namche – Lukla — 2,860 m • 7 hrs","Day 13: Lukla – Kathmandu — 30 min flight","Day 14: Final Departure"],
abc:["Annapurna Base Camp Trek — 5 Days","Day 1: Pokhara – Samrong – Sinuwa","Day 2: Sinuwa – Himalaya","Day 3: Himalaya – Annapurna Base Camp — 4,130 m • 6–7 hrs","Day 4: Annapurna Base Camp – Sinuwa — 17 km • 7–8 hrs","Day 5: Sinuwa – Jhinu Danda – Pokhara"],
langtang:["Langtang Valley Trek — 10 Days","Day 1: Arrival in Kathmandu — 1,400 m / 4,593 ft","Day 2: Kathmandu – Syabrubesi — 1,460 m / 4,790 ft","Day 3: Syabrubesi – Lama Hotel — 2,460 m / 8,070 ft","Day 4: Lama Hotel – Langtang Village — 3,450 m / 11,318 ft","Day 5: Langtang Village – Kyanjin Gompa — 3,870 m / 12,696 ft","Day 6: Exploration Day at Kyanjin Gompa","Day 7: Kyanjin Gompa – Lama Hotel — 2,460 m","Day 8: Lama Hotel – Syabrubesi — 1,460 m","Day 9: Syabrubesi – Kathmandu — 1,400 m","Day 10: Final Departure"]
};

/* MENU */
const nav=document.getElementById("nav"),menu=document.getElementById("menuBtn");
menu?.addEventListener("click",()=>nav?.classList.toggle("show"));
document.querySelectorAll("#nav a").forEach(a=>a.onclick=()=>nav?.classList.remove("show"));

/* MODAL */
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));

window.openItinerary=k=>{
 const d=itineraries[k],m=document.getElementById("modal"),c=document.getElementById("modalContent");
 if(!d||!m||!c)return;
 c.innerHTML=`<h2>🏔️ ${esc(d[0])}</h2>`+d.slice(1).map(x=>`<div class="day">${esc(x)}</div>`).join("");
 m.style.display="block";document.body.style.overflow="hidden";
};

window.closeItinerary=()=>{
 document.getElementById("modal").style.display="none";
 document.body.style.overflow="";
};

document.getElementById("modal")?.addEventListener("click",e=>{
 if(e.target.id==="modal")closeItinerary();
});

/* GALLERY */
let gi=0;
const track=document.getElementById("galleryTrack"),dots=document.getElementById("dots");
const desktop=()=>innerWidth>750;
const positions=()=>Math.max(1,document.querySelectorAll(".gallery-slide").length-(desktop()?3:1)+1);

function gallery(){
 const n=positions();
 gi=(gi+n)%n;
 track&&(track.style.transform=`translateX(-${gi*(desktop()?33.333333:100)}%)`);
 if(dots)[...dots.children].forEach((d,i)=>d.classList.toggle("active",i===gi));
}

function makeDots(){
 if(!dots)return;
 dots.innerHTML="";
 for(let i=0;i<positions();i++){
  const d=document.createElement("span");
  d.className="dot";
  d.onclick=()=>{gi=i;gallery()};
  dots.appendChild(d);
 }
 gallery();
}

window.moveGallery=x=>{gi+=x;gallery()};
makeDots();
addEventListener("resize",makeDots);

/* FIREBASE */
const app=initializeApp({
apiKey:"AIzaSyDvQwnMC_6WkyL_TuidQ9yddm8lCS07sXA",
authDomain:"nitra-hiking-trek.firebaseapp.com",
projectId:"nitra-hiking-trek",
storageBucket:"nitra-hiking-trek.firebasestorage.app",
messagingSenderId:"229092748752",
appId:"1:229092748752:web:ab822b061527ce37ce1dd5"
});
const db=getFirestore(app),stars=n=>"★".repeat(Math.round(n))+"☆".repeat(5-Math.round(n));

/* REVIEWS */
async function loadReviews(){
 const list=document.getElementById("reviewList");
 try{
  const snap=await getDocs(collection(db,"reviews"));
  const r=[];
  snap.forEach(x=>{
   const d=x.data(),rating=Number(d.rating);
   if(d.name&&d.text&&rating>=1&&rating<=5)r.push({name:d.name,text:d.text,rating});
  });
  list.innerHTML=r.length?r.map(x=>`<div class="review-card"><b class="reviewer">${esc(x.name)}</b><div class="review-stars">${stars(x.rating)}</div><p>${esc(x.text)}</p></div>`).join(""):"<div class='review-card'>Be the first to leave a review!</div>";
  const avg=r.length?r.reduce((a,x)=>a+x.rating,0)/r.length:0;
  document.getElementById("avg").textContent=avg.toFixed(1);
  document.getElementById("avgStars").textContent=stars(avg);
  document.getElementById("count").textContent=r.length+(r.length==1?" review":" reviews");
 }catch(e){
  console.error(e);
  list.innerHTML="<div class='review-card'>Reviews are temporarily unavailable.</div>";
 }
}

/* SUBMIT REVIEW */
document.getElementById("reviewForm")?.addEventListener("submit",async e=>{
 e.preventDefault();
 const name=document.getElementById("name"),rating=document.getElementById("rating"),text=document.getElementById("text"),msg=document.getElementById("msg"),btn=document.getElementById("submit");
 if(!name.value.trim()||!text.value.trim()||!rating.value)return msg.textContent="Please complete all fields.";
 btn.disabled=true;msg.textContent="Submitting...";
 try{
  await addDoc(collection(db,"reviews"),{name:name.value.trim(),text:text.value.trim(),rating:Number(rating.value),createdAt:serverTimestamp()});
  e.target.reset();msg.textContent="Thank you! Your review has been submitted.";loadReviews();
 }catch(err){console.error(err);msg.textContent="Could not submit your review."}
 btn.disabled=false;
});

loadReviews();
