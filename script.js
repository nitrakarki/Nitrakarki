const itineraries = {
ebc: [
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

abc: [
"Annapurna Base Camp Trek — 5 Days",
"Day 1: Pokhara – Samrong – Sinuwa",
"Day 2: Sinuwa – Himalaya",
"Day 3: Himalaya – Annapurna Base Camp — 4,130 m • 6–7 hrs",
"Day 4: Annapurna Base Camp – Sinuwa — 17 km • 7–8 hrs",
"Day 5: Sinuwa – Jhinu Danda – Pokhara"
],

langtang: [
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
]
};

/* =========================
ITINERARY MODAL
========================= */

window.openItinerary = function(key) {
const data = itineraries[key];
const modal = document.getElementById("modal");
const content = document.getElementById("modalContent");

if (!data || !modal || !content) return;

content.innerHTML =
"<h2>🏔️ " + escapeHTML(data[0]) + "</h2>" +
data.slice(1).map(day => {
const parts = day.split(" — ");
return "<div class="day"> <b>${escapeHTML(parts[0])}</b> ${parts.length > 1 ? " — " + escapeHTML(parts.slice(1).join(" — ")) : ""} </div>";
}).join("");

modal.style.display = "block";
document.body.style.overflow = "hidden";
};

window.closeItinerary = function() {
const modal = document.getElementById("modal");

if (modal) {
modal.style.display = "none";
}

document.body.style.overflow = "";
};

/* =========================
MOBILE MENU
========================= */

const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menuBtn");

if (menuBtn && nav) {
menuBtn.addEventListener("click", () => {
nav.classList.toggle("show");
});

document.querySelectorAll("#nav a").forEach(link => {
link.addEventListener("click", () => {
nav.classList.remove("show");
});
});
}

/* =========================
CLOSE MODAL
========================= */

const modal = document.getElementById("modal");

if (modal) {
modal.addEventListener("click", event => {
if (event.target === modal) {
closeItinerary();
}
});
}

/* =========================
GALLERY SLIDER
========================= */

let galleryIndex = 0;

const galleryTrack = document.getElementById("galleryTrack");
const dotsContainer = document.getElementById("dots");

function isDesktop() {
return window.innerWidth > 750;
}

function slidesPerView() {
return isDesktop() ? 3 : 1;
}

function totalPositions() {
const totalSlides = document.querySelectorAll(".gallery-slide").length;
return Math.max(1, totalSlides - slidesPerView() + 1);
}

function createGalleryDots() {
if (!dotsContainer) return;

dotsContainer.innerHTML = "";

const total = totalPositions();

for (let i = 0; i < total; i++) {
const dot = document.createElement("span");

dot.className = "dot";
if (i === galleryIndex) {
  dot.classList.add("active");
}

dot.addEventListener("click", () => {
  galleryIndex = i;
  updateGallery();
});

dotsContainer.appendChild(dot);

}
}

function updateGallery() {
if (!galleryTrack) return;

const desktop = isDesktop();

galleryTrack.style.transform =
"translateX(-${galleryIndex * (desktop ? 33.333333 : 100)}%)";

if (dotsContainer) {
[...dotsContainer.children].forEach((dot, index) => {
dot.classList.toggle("active", index === galleryIndex);
});
}
}

window.moveGallery = function(direction) {
const total = totalPositions();

galleryIndex += direction;

if (galleryIndex < 0) {
galleryIndex = total - 1;
}

if (galleryIndex >= total) {
galleryIndex = 0;
}

updateGallery();
};

/* =========================
GALLERY TOUCH SWIPE
========================= */

let touchStartX = 0;
let touchEndX = 0;

if (galleryTrack) {

galleryTrack.addEventListener("touchstart", event => {
touchStartX = event.touches[0].clientX;
}, { passive: true });

galleryTrack.addEventListener("touchend", event => {
touchEndX = event.changedTouches[0].clientX;

const distance = touchEndX - touchStartX;

if (Math.abs(distance) > 50) {
  if (distance < 0) {
    moveGallery(1);
  } else {
    moveGallery(-1);
  }
}

}, { passive: true });
}

/* =========================
GALLERY RESIZE
========================= */

window.addEventListener("resize", () => {
galleryIndex = 0;
createGalleryDots();
updateGallery();
});

createGalleryDots();
updateGallery();

/* =========================
FLOATING WHATSAPP
========================= */

const contactFloat = document.getElementById("contactFloat");

let scrollTimer;

if (contactFloat) {
window.addEventListener("scroll", () => {

contactFloat.classList.add("hide");

clearTimeout(scrollTimer);

scrollTimer = setTimeout(() => {
  contactFloat.classList.remove("hide");
}, 700);

}, { passive: true });
}

/* =========================
FIREBASE
========================= */

import {
initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
getFirestore,
collection,
getDocs,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyDvQwnMC_6WkyL_TuidQ9yddm8lCS07sXA",
authDomain: "nitra-hiking-trek.firebaseapp.com",
projectId: "nitra-hiking-trek",
storageBucket: "nitra-hiking-trek.firebasestorage.app",
messagingSenderId: "229092748752",
appId: "1:229092748752:web:ab822b061527ce37ce1dd5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* =========================
HELPERS
========================= */

function getElement(id) {
return document.getElementById(id);
}

function escapeHTML(value) {
return String(value ?? "")
.replace(/&/g, "&")
.replace(/</g, "<")
.replace(/>/g, ">")
.replace(/"/g, """)
.replace(/'/g, "'");
}

function starString(number) {
const rating = Math.max(0, Math.min(5, Math.round(Number(number) || 0)));

return "★".repeat(rating) + "☆".repeat(5 - rating);
}

/* =========================
LOAD REVIEWS
========================= */

async function loadReviews() {

const list = getElement("reviewList");
const average = getElement("avg");
const averageStars = getElement("avgStars");
const count = getElement("count");

if (!list) return;

try {

if (count) {
  count.textContent = "Loading reviews...";
}

const snapshot = await getDocs(
  collection(db, "reviews")
);

const reviews = [];

snapshot.forEach(documentSnapshot => {

  const data = documentSnapshot.data();

  const name = String(data.name ?? "").trim();
  const text = String(data.text ?? "").trim();
  const rating = Number(data.rating);

  if (
    name &&
    text &&
    rating >= 1 &&
    rating <= 5
  ) {

    reviews.push({
      id: documentSnapshot.id,
      name,
      text,
      rating,
      createdAt: data.createdAt || null
    });

  }

});


/* Newest first */

reviews.sort((a, b) => {

  const aTime =
    a.createdAt?.seconds ??
    a.createdAt?.toMillis?.() ??
    0;

  const bTime =
    b.createdAt?.seconds ??
    b.createdAt?.toMillis?.() ??
    0;

  return bTime - aTime;

});


/* Display reviews */

if (reviews.length === 0) {

  list.innerHTML =
    "<div class='review-card'>Be the first to leave a review!</div>";

  if (average) average.textContent = "0.0";

  if (averageStars) {
    averageStars.textContent = "☆☆☆☆☆";
  }

  if (count) {
    count.textContent = "No reviews yet";
  }

  return;
}


list.innerHTML = reviews.map(review => {

  return `
    <div class="review-card">
      <b class="reviewer">${escapeHTML(review.name)}</b>
      <div class="review-stars">${starString(review.rating)}</div>
      <p>${escapeHTML(review.text)}</p>
    </div>
  `;

}).join("");


/* Calculate average */

const total = reviews.reduce(
  (sum, review) => sum + review.rating,
  0
);

const avg = total / reviews.length;


if (average) {
  average.textContent = avg.toFixed(1);
}

if (averageStars) {
  averageStars.textContent = starString(avg);
}

if (count) {
  count.textContent =
    reviews.length +
    (reviews.length === 1 ? " review" : " reviews");
}

} catch (error) {

console.error("Firestore error:", error);

list.innerHTML = `
  <div class="review-card">
    <b>Reviews are temporarily unavailable.</b>
    <p>Please try again later.</p>
  </div>
`;

if (average) {
  average.textContent = "0.0";
}

if (averageStars) {
  averageStars.textContent = "☆☆☆☆☆";
}

if (count) {
  count.textContent = "Reviews unavailable";
}

}
}

/* =========================
SUBMIT REVIEW
========================= */

const reviewForm = getElement("reviewForm");

if (reviewForm) {

reviewForm.addEventListener("submit", async event => {

event.preventDefault();

const submitButton = getElement("submit");
const message = getElement("msg");

const nameInput = getElement("name");
const ratingInput = getElement("rating");
const textInput = getElement("text");

if (
  !submitButton ||
  !message ||
  !nameInput ||
  !ratingInput ||
  !textInput
) {
  return;
}


const name = nameInput.value.trim();
const rating = Number(ratingInput.value);
const text = textInput.value.trim();


/* Validation */

if (
  !name ||
  name.length > 60 ||
  !text ||
  text.length > 500 ||
  rating < 1 ||
  rating > 5
) {

  message.textContent =
    "Please complete all fields correctly.";

  return;
}


submitButton.disabled = true;
message.textContent = "Submitting...";


try {

  await addDoc(
    collection(db, "reviews"),
    {
      name: name,
      text: text,
      rating: rating,
      createdAt: serverTimestamp()
    }
  );


  reviewForm.reset();

  message.textContent =
    "Thank you! Your review has been submitted.";

  await loadReviews();


} catch (error) {

  console.error("Review submission error:", error);

  message.textContent =
    "Could not submit your review. Please try again.";

} finally {

  submitButton.disabled = false;

}

});

}

/* =========================
START REVIEWS
========================= */

loadReviews();
