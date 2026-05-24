// =====================================================
// Silpa Production — main.js
// =====================================================


// =====================================================
// Year
// =====================================================
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());


// =====================================================
// Active nav by filename
// =====================================================
(() => {
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  document.querySelectorAll(".nav a[data-page]").forEach((a) => {
    const p = (a.getAttribute("data-page") || "").toLowerCase();
    if (p === current) a.classList.add("is-active");
  });
})();


// =====================================================
// Transition overlay
// =====================================================
const transition = document.querySelector(".transition");

function transitionOn(label = "Loading") {
  if (!transition) return;
  const t = transition.querySelector(".transition-inner");
  if (t) t.textContent = label;
  transition.classList.add("is-on");
}

function transitionOff() {
  if (!transition) return;
  transition.classList.remove("is-on");
}

window.addEventListener("load", transitionOff);


// =====================================================
// Intercept internal nav clicks
// =====================================================
document.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (!a) return;

  const href = a.getAttribute("href");
  if (!href) return;

  if (a.host && a.host !== location.host) return;
  if (href.startsWith("#")) return;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return;
  if (!href.endsWith(".html")) return;

  e.preventDefault();
  transitionOn("Opening");

  setTimeout(() => {
    location.href = href;
  }, 180);
});


// =====================================================
// Fullscreen Project Viewer
// =====================================================
const viewer = document.querySelector(".project-viewer");
const viewerTitle = document.querySelector(".viewer-title");
const viewerClient = document.querySelector(".viewer-client");
const viewerRight = document.querySelector(".viewer-right");
const viewerClose = document.querySelector(".viewer-close");
const viewerNext = document.querySelector(".viewer-next");

const workItems = Array.from(document.querySelectorAll(".work-item[data-modal]"));
let currentIndex = -1;


// -------------------------
// Close Viewer
// -------------------------
function closeViewer() {

  if (!viewer) return;

  viewer.classList.remove("active");

  viewerRight.querySelectorAll("video").forEach(v => {
    v.pause();
    v.src = "";
  });

  viewerRight.innerHTML = "";
}


// -------------------------
// Open Viewer
// -------------------------
function openViewer(card) {

  if (!viewer) return;

  currentIndex = workItems.indexOf(card);

  const title = card.dataset.title;
  const client = card.dataset.client;
  const type = card.dataset.type;
  const src = card.dataset.src;

  viewerTitle.textContent = title || "";
  viewerClient.textContent = client || "";

  viewerRight.innerHTML = "";

  // ---- Single Video ----
  if (type === "video") {

    const video = document.createElement("video");
    video.src = src;
    video.controls = true;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    viewerRight.appendChild(video);
  }

  // ---- YouTube Video ----
  else if (type === "youtube") {

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${src}?autoplay=1&controls=1`;
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.frameBorder = "0";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.style.borderRadius = "8px";

    viewerRight.appendChild(iframe);
  }

  // ---- Single Image ----
  else if (type === "image") {

    const img = document.createElement("img");
    img.src = src;
    img.alt = title;

    viewerRight.appendChild(img);
  }

  // ---- Multi Video Gallery ----
  else if (type === "gallery") {

    const sources = src.split(",");

    sources.forEach((file, index) => {

      const video = document.createElement("video");
      video.src = file.trim();
      video.controls = true;
      video.playsInline = true;

      if (index === 0) {
        video.autoplay = true;
        video.muted = true;
      }

      video.classList.add("gallery-video");
      viewerRight.appendChild(video);
    });
  }

  viewer.classList.add("active");
}


// =====================================================
// Work Click Events
// =====================================================
workItems.forEach(item => {
  item.addEventListener("click", () => {
    openViewer(item);
  });
});


// =====================================================
// Next Button Logic
// =====================================================
if (viewerNext) {
  viewerNext.addEventListener("click", () => {

    if (currentIndex === -1) return;

    let nextIndex = currentIndex + 1;

    if (nextIndex >= workItems.length) {
      nextIndex = 0; // loop to first
    }

    openViewer(workItems[nextIndex]);
  });
}


// =====================================================
// Close Events
// =====================================================
if (viewerClose) {
  viewerClose.addEventListener("click", closeViewer);
}

document.addEventListener("keydown", (e) => {

  if (!viewer.classList.contains("active")) return;

  if (e.key === "Escape") closeViewer();

  if (e.key === "ArrowRight") {
    if (currentIndex === -1) return;

    let nextIndex = currentIndex + 1;
    if (nextIndex >= workItems.length) nextIndex = 0;
    openViewer(workItems[nextIndex]);
  }
});

if (viewer) {
  viewer.addEventListener("click", (e) => {
    if (e.target === viewer) closeViewer();
  });
}


// =====================================================
// Cinematic Hero Title Animation
// =====================================================
window.addEventListener("load", () => {
  const hero = document.querySelector(".hero-title");
  if (!hero) return;

  const words = hero.textContent.trim().split(" ");
  hero.innerHTML = "";

  words.forEach((word, i) => {
    const span = document.createElement("span");
    span.textContent = word + " ";
    span.style.animationDelay = `${0.4 + i * 0.18}s`;
    hero.appendChild(span);
  });

  requestAnimationFrame(() => {
    hero.classList.add("is-visible");
  });
});


// =====================================================
// Step-by-step Word Reveal
// =====================================================
document.querySelectorAll(".reveal-text").forEach(el => {

  const words = el.textContent.trim().split(" "); // FIX
  el.textContent = "";

  words.forEach((word, index) => {
    const span = document.createElement("span");

    span.textContent = word; // no space here
    span.style.animationDelay = `${index * 0.12}s`;

    el.appendChild(span);
  });

});

// Run Lucide AFTER everything
lucide.createIcons();