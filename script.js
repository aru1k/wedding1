const container = document.getElementById("container");
const navLinks = document.querySelectorAll(".nav-link");

const bgm = document.getElementById("bgm");
const musicBtn = document.getElementById("musicBtn");

/* NAV ACTIVE + AUTO SCROLL */
container.addEventListener("scroll",()=>{
    let current="";
    document.querySelectorAll(".page").forEach(sec=>{
        if(container.scrollTop >= sec.offsetTop - 200){
            current = sec.id;
        }
    });

    navLinks.forEach(link=>{
        const active = link.getAttribute("href") === "#"+current;
        link.classList.toggle("active", active);
        if(active){
            link.scrollIntoView({
                behavior:"smooth",
                inline:"center",
                block:"nearest"
            });
        }
    });
});

/* OPEN INVITATION */
function openInvitation(){
    requestFullscreen();

    // play musik
    bgm.muted = false;
    bgm.play();

    // tampilkan tombol musik
    musicBtn.classList.remove("hidden");
    musicBtn.innerText = "♫";

    // scroll ke quotes
    document.getElementById("quotes")
    .scrollIntoView({ behavior: "smooth" });
}

function requestFullscreen(){
    const el = document.documentElement;

    if (el.requestFullscreen) {
        el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen(); // Safari
    } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen(); // IE lama
    }
}

/* MUTE / UNMUTE */
function toggleMusic(){
    bgm.muted = !bgm.muted;
    musicBtn.innerText = bgm.muted ? "♫×" : "♫";
}

/* COUNTDOWN */
const target = new Date("Jan 23, 2026 08:00:00").getTime();
const dEl = document.getElementById("cd-days");
const hEl = document.getElementById("cd-hours");
const mEl = document.getElementById("cd-minutes");
const sEl = document.getElementById("cd-seconds");

setInterval(()=>{
    const now = Date.now();
    const diff = target - now;
    if(diff <= 0) return;

    dEl.innerText = Math.floor(diff / (1000*60*60*24));
    hEl.innerText = Math.floor((diff / (1000*60*60)) % 24);
    mEl.innerText = Math.floor((diff / (1000*60)) % 60);
    sEl.innerText = Math.floor((diff / 1000) % 60);
},1000);

/* COPY REKENING */
function copyRekb(btn){
    const text = document.getElementById("rekb").innerText;

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text);
    } else {
        // fallback HP lama
        const temp = document.createElement("textarea");
        temp.value = text;
        temp.style.position = "fixed";
        temp.style.opacity = "0";
        document.body.appendChild(temp);
        temp.focus();
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
    }

    btn.innerText = "Disalin";
    btn.disabled = true;

    setTimeout(()=>{
        btn.innerText = "Salin Rekening";
        btn.disabled = false;
    }, 2000);
}

function copyRekj(btn){
    const text = document.getElementById("rekj").innerText;

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text);
    } else {
        // fallback HP lama
        const temp = document.createElement("textarea");
        temp.value = text;
        temp.style.position = "fixed";
        temp.style.opacity = "0";
        document.body.appendChild(temp);
        temp.focus();
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
    }

    btn.innerText = "Disalin";
    btn.disabled = true;

    setTimeout(()=>{
        btn.innerText = "Salin Rekening";
        btn.disabled = false;
    }, 2000);
}

let startY = 0;
let isScrolling = false;
const sections = document.querySelectorAll(".page");

container.addEventListener("touchstart", e => {
    startY = e.touches[0].clientY;
}, { passive:true });

container.addEventListener("touchmove", e => {
    if(isScrolling) e.preventDefault();
}, { passive:false });

container.addEventListener("touchend", e => {
    if(isScrolling) return;

    const endY = e.changedTouches[0].clientY;
    const diff = startY - endY;

    // threshold biar ngga sensitif
    if(Math.abs(diff) < 50) return;

    isScrolling = true;

    let currentIndex = 0;
    sections.forEach((sec, i) => {
        if(container.scrollTop >= sec.offsetTop - 10){
            currentIndex = i;
        }
    });

    let targetIndex = diff > 0
    ? Math.min(currentIndex + 1, sections.length - 1)
    : Math.max(currentIndex - 1, 0);

    sections[targetIndex].scrollIntoView({
        behavior: "smooth"
    });

    // unlock setelah animasi
    setTimeout(() => {
        isScrolling = false;
    }, 700);
}, { passive:false });

function openZoom(img){
    const overlay = document.getElementById("zoomOverlay");
    const zoomImg = document.getElementById("zoomImg");

    zoomImg.src = img.src;
    overlay.classList.add("active");
}

function closeZoom(){
    document.getElementById("zoomOverlay")
    .classList.remove("active");
}

const UCAPAN_URL = "https://script.google.com/macros/s/AKfycbzqRNRHuMy3ZVpC3KmDgiaCBAOOyq0H8btfE9-JDOac7KmkntwfB7i-3RZuZoGF5mzd/exec";

function loadUcapan(){
    fetch(UCAPAN_URL)
    .then(res => res.json())
    .then(data => {
        const box = document.getElementById("ucapanList");
        box.innerHTML = "";

        if(!data.length){
            box.innerHTML = "<p class='loading'>Belum ada ucapan</p>";
            return;
        }

        data.forEach(item => {
            const div = document.createElement("div");
            div.className = "ucapan-item";
            div.innerHTML = `
            <div class="ucapan-header">
            <span class="ucapan-nama">${item.nama}</span>
            <span class="ucapan-waktu">${formatWaktu(item.waktu)}</span>
            </div>
            <div class="ucapan-pesan">${item.pesan}</div><br>
            `;
            box.appendChild(div);
        });
    })
    .catch(err => {
        console.error(err);
        document.getElementById("ucapanList").innerHTML =
        "<p class='loading'>Gagal memuat ucapan</p>";
    });
}

loadUcapan();

setInterval(loadUcapan, 15000);
function formatWaktu(w){
    const d = new Date(w);
    return d.toLocaleDateString("id-ID", {
        day:"2-digit",
        month:"short",
        year:"numeric"
    });
}

const animatedEls = document.querySelectorAll(
    ".fade-up, .fade-up2, .fade-down, .fade-scale, .fade-right, .fade-left"
);

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add("show");
            }else{
                entry.target.classList.remove("show");
            }
        });
    },
    {
        threshold: 0.6
    }
);

animatedEls.forEach(el => observer.observe(el));

function animateSection(section){
    section.querySelectorAll(
        ".fade-up, .fade-up2, .fade-down, .fade-scale, .fade-right, .fade-left"
    ).forEach(el=>{
        el.classList.remove("show");
        void el.offsetWidth; // force reflow
        el.classList.add("show");
    });
}

if(active){
    animateSection(
        document.getElementById(current)
    );
}

