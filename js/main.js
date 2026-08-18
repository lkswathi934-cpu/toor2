/**
 * Mantra Miles Tour - V22 Core Engine
 * Features: Bento categories, pricing cards, accordion journey, stats counters,
 * orbit testimonials, route map, custom itinerary form, WhatsApp + n8n webhook integration
 */

let lenis;
let logoClickCount = 0;
let logoClickTimer = null;

const n8nWebhookUrl = "https://f1be-106-222-212-16.ngrok-free.dev/webhook/mantra-chat";

// Default Package Database — 3 pricing cards per spec
const defaultPackagesDB = [
    {
        id: "murudeshwar-gokarna",
        title: "Murudeshwar & Gokarna Divine Beach Trail",
        price: 6499,
        image: "https://images.pexels.com/photos/35775960/pexels-photo-35775960.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
        badge: "Reel Favorite",
        rating: "5.0 (490+)",
        duration: "3 Days / 2 Nights",
        status: "active",
        category: "coastal",
        desc: "World's second-tallest Shiva statue at Murudeshwar, golden beach promenade, paired with Gokarna's cliff treks between Om Beach and Kudle — temple town charm meets coastal serenity.",
        itinerary: [
            "• Day 1: Board Volvo Sleeper from Bengaluru -> Arrival & Check-in at Beach Resort -> Murudeshwar Temple Darshan.",
            "• Day 2: Gokarna Cliff Trek (Om Beach to Kudle) -> Sunset Beach Dinner & Bonfire.",
            "• Day 3: Beach Watersports -> Local Shopping -> Evening Volvo Return."
        ],
        inclusions: ["Multi-Axle Volvo Sleeper", "4-Star Beach Resort Stay", "Temple Darshan Pass", "Cliff Trek Guide", "Daily Breakfast & Dinner"]
    },
    {
        id: "coorg-chikmagalur",
        title: "Coorg & Chikmagalur Coffee Mist Journey",
        price: 7999,
        image: "https://images.pexels.com/photos/33046721/pexels-photo-33046721.png?auto=compress&cs=tinysrgb&h=650&w=940",
        badge: "Bestseller",
        rating: "4.9 (340+)",
        duration: "3 Days / 2 Nights",
        status: "active",
        category: "hill",
        desc: "Stay at an authentic coffee plantation resort in Coorg, misty waterfall treks in Chikmagalur, bonfire acoustic sessions, and Abbey Falls — the ultimate Western Ghams escape.",
        itinerary: [
            "• Day 1: Board Volvo Sleeper -> Check-in Coffee Plantation Resort -> Waterfall Trek.",
            "• Day 2: Abbey Falls & Raja's Seat Sunset -> Acoustic Music Bonfire Campfire.",
            "• Day 3: Spice & Coffee Tasting Tour -> Souvenir Shopping -> Evening Volvo Return."
        ],
        inclusions: ["Multi-Axle Volvo Sleeper", "Coffee Plantation Resort Stay", "Private Waterfall Trek", "Campfire & Acoustic Evening", "Daily Breakfast & Dinner"]
    },
    {
        id: "kukke-dharmasthala",
        title: "Kukke & Dharmasthala Sacred Yatra",
        price: 4999,
        image: "https://images.pexels.com/photos/38921995/pexels-photo-38921995.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
        badge: "Heritage",
        rating: "4.9 (210+)",
        duration: "2 Days / 1 Night",
        status: "active",
        category: "spiritual",
        desc: "Sacred serpent deity darshan at Kukke Subramanya nestled in the Western Ghats, combined with Dharmasthala's renowned Manjunatha temple and charitable heritage — a soul-stirring pilgrimage circuit.",
        itinerary: [
            "• Day 1: Board Volvo Sleeper -> Kukke Subramanya Temple Darshan -> Check-in Heritage Hotel.",
            "• Day 2: Dharmasthala Manjunatha Temple -> Heritage Market -> Evening Volvo Return."
        ],
        inclusions: ["Multi-Axle Volvo Sleeper", "4-Star Heritage Hotel Stay", "Temple Darshan Pass", "Daily Breakfast & Dinner"]
    }
];

function getStoredPackages() {
    const data = localStorage.getItem('mantra_miles_packages_v6');
    if (data) {
        try { return JSON.parse(data); } catch (e) { console.error(e); }
    }
    localStorage.setItem('mantra_miles_packages_v6', JSON.stringify(defaultPackagesDB));
    return defaultPackagesDB;
}

function savePackagesToStore(packages) {
    localStorage.setItem('mantra_miles_packages_v6', JSON.stringify(packages));
    renderPackagesGrid();
}

// ============================================================
// INIT ON DOMContentLoaded
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    initLenisSmoothScroll();
    initGSAPAnimations();
    initHeroVideoController();
    triggerTimedHeroTextPopUp();
    setupAdminTripleClickTrigger();
    setupCustomItineraryFormListener();
    renderPackagesGrid();
    checkUrlPackageFilter();
    setupFilterPills();
    setupHeroSearchForm();
    initHeroMediaScrollScale();
    initScrollReveal();
    initAccordion();
    initStatsCounters();
    initOrbitTestimonials();
    drawRouteMap();
});

// ============================================================
// 1. CUSTOM ITINERARY FORM
// ============================================================
function setupCustomItineraryFormListener() {
    const form = document.getElementById('custom-itinerary-form');
    if (form) {
        form.addEventListener('submit', generateAIItinerary);
    }
}

// ============================================================
// 2. FLOATING BOOKING BAR: FILTER PILLS + TRAVELLER COUNTER
// ============================================================
let currentFilterCategory = 'all';
let travellerCountValue = 2;

function setupFilterPills() {
    const pills = document.querySelectorAll('.filter-pill');
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentFilterCategory = pill.getAttribute('data-filter') || 'all';
            applyBentoFilter(currentFilterCategory);
        });
    });
}

function setupHeroSearchForm() {
    const form = document.getElementById('heroSearchForm');
    if (form) {
        form.addEventListener('submit', handleHeroSearch);
    }
}

function adjustTravellerCount(delta) {
    travellerCountValue = Math.max(1, Math.min(20, travellerCountValue + delta));
    const el = document.getElementById('travellerCount');
    if (el) el.textContent = travellerCountValue;
}

function applyBentoFilter(category) {
    const grid = document.getElementById('packagesGrid');
    if (!grid) return;
    const cards = grid.querySelectorAll('[data-package]');
    const categoryMap = {
        coastal: ['murudeshwar-gokarna'],
        spiritual: ['kukke-dharmasthala'],
        hill: ['coorg-chikmagalur'],
        all: []
    };
    const allowed = categoryMap[category] || [];
    cards.forEach(card => {
        const pkgId = card.getAttribute('data-package') || '';
        if (category === 'all' || allowed.includes(pkgId)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
    if (lenis) {
        const pkgSection = document.getElementById('packages');
        if (pkgSection) lenis.scrollTo(pkgSection, { offset: -60 });
    }
}

function filterBentoCategory(category) {
    const targetPill = document.querySelector(`.filter-pill[data-filter="${category}"]`);
    if (targetPill) targetPill.click();
}

function generateAIItinerary(e) {
    if (e) {
        e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
    }

    const dest = document.getElementById('aiDest')?.value || 'Dubai';
    const daysSelect = document.getElementById('aiDays');
    const daysText = daysSelect ? daysSelect.options[daysSelect.selectedIndex].text : '3 Days / 2 Nights';
    const name = document.getElementById('aiUserName')?.value || 'Lithin';
    const phone = document.getElementById('aiPhone')?.value || '9686078395';

    if (typeof launchAditiCustomLocationChat === 'function') {
        launchAditiCustomLocationChat(dest, daysText, name, phone);
    }
    return false;
}

// ============================================================
// 3. DYNAMIC PRICING CARDS RENDERER
// ============================================================
function renderPackagesGrid() {
    const grid = document.getElementById('packagesGrid');
    if (!grid) return;

    const packages = getStoredPackages();
    const urlParams = new URLSearchParams(window.location.search);
    const pkgParam = urlParams.get('pkg')?.toLowerCase().trim();

    grid.innerHTML = '';

    packages.forEach(pkg => {
        const isTargetedByAd = pkgParam && (pkg.id.includes(pkgParam) || pkg.title.toLowerCase().includes(pkgParam));

        const card = document.createElement('div');
        card.className = `tilt-card group relative bg-obsidian/60 backdrop-blur-xl border border-gold/30 rounded-3xl overflow-hidden shadow-glass hover:border-gold transition-all duration-500 flex flex-col justify-between ${isTargetedByAd ? 'reel-highlight-card' : ''}`;
        card.setAttribute('data-package', pkg.id);

        let buttonHTML = '';

        if (!pkgParam || isTargetedByAd || pkg.status === 'active') {
            buttonHTML = `
                <button onclick="openVisualShowcaseModal('${pkg.title}', ${pkg.price})" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold via-amber to-gold text-obsidian font-extrabold text-xs shadow-gold-glow hover:scale-105 transition-all flex items-center justify-center gap-2">
                    <span>Book Now</span>
                    <i class="fa-solid fa-arrow-right text-xs"></i>
                </button>
            `;
        } else {
            buttonHTML = `
                <button onclick="openLeadModal('${pkg.title}')" class="px-3 py-2 rounded-xl bg-leafGreen/20 border border-gold/40 text-gold font-extrabold text-[11px] hover:bg-gold hover:text-obsidian transition-all flex items-center gap-1">
                    <i class="fa-solid fa-bell text-amber"></i> Next Batch Planning - I'm Interested
                </button>
            `;
        }

        let expandedDetailsHTML = '';
        if (isTargetedByAd) {
            expandedDetailsHTML = `
                <div class="mt-4 pt-4 border-t border-gold/30 space-y-3 bg-forestObsidian/90 p-4 rounded-2xl border border-gold/30">
                    <div class="space-y-1.5">
                        <span class="text-[11px] font-extrabold uppercase text-gold tracking-wider flex items-center gap-1.5">
                            <i class="fa-solid fa-list-check"></i> Reel Exclusive Itinerary
                        </span>
                        <div class="text-[11px] text-gray-300 space-y-1 font-mono">
                            ${pkg.itinerary.map(item => `<div>${item}</div>`).join('')}
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-1.5 text-[10px] text-gold font-semibold pt-1">
                        ${pkg.inclusions.map(inc => `<span class="px-2 py-0.5 rounded-md bg-gold/10 border border-gold/30">✓ ${inc}</span>`).join('')}
                    </div>
                    <button onclick="openVisualShowcaseModal('${pkg.title}', ${pkg.price})" class="w-full py-3 rounded-xl bg-gradient-to-r from-gold via-amber to-gold text-obsidian font-black text-xs uppercase shadow-gold-glow hover:scale-105 transition-all flex items-center justify-center gap-2 mt-2">
                        <span>Book Now (₹${pkg.price})</span>
                        <i class="fa-solid fa-arrow-right text-xs"></i>
                    </button>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="relative h-64 overflow-hidden">
                <img src="${pkg.image}" alt="${pkg.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                <div class="absolute inset-0 bg-gradient-to-t from-forestObsidian via-forestObsidian/20 to-transparent"></div>
                <div class="absolute top-4 left-4 flex gap-2">
                    <span class="px-3 py-1 rounded-full bg-amber text-obsidian text-xs font-black uppercase shadow-lg">${pkg.badge}</span>
                    <span class="px-3 py-1 rounded-full bg-forestObsidian/80 backdrop-blur-md text-gold border border-gold/30 text-xs font-bold">${pkg.duration}</span>
                </div>
                <div class="absolute top-4 right-4 px-3 py-1 rounded-full bg-forestObsidian/80 backdrop-blur-md text-cyanGlow text-xs font-bold border border-cyanGlow/30">
                    <i class="fa-solid fa-star text-gold mr-1"></i> ${pkg.rating}
                </div>
            </div>
            <div class="p-6 space-y-4">
                <div class="flex items-center justify-between">
                    <h3 class="text-xl font-bold text-white group-hover:text-gold transition-colors">${pkg.title}</h3>
                    <span class="text-xs font-bold text-gray-400"><i class="fa-solid fa-bus text-gold"></i> Volvo Included</span>
                </div>
                <p class="text-gray-300 text-xs leading-relaxed">${pkg.desc}</p>
                <div class="pt-4 border-t border-gold/15 flex items-center justify-between">
                    <div>
                        <span class="text-[10px] font-bold text-gray-400 block uppercase">Starting From</span>
                        <span class="text-2xl font-black text-gold">₹${pkg.price.toLocaleString('en-IN')} <span class="text-xs font-normal text-gray-400">/person</span></span>
                    </div>
                    ${buttonHTML}
                </div>
                ${expandedDetailsHTML}
            </div>
        `;

        grid.appendChild(card);
    });

    init3DCardsTilt();
}

function checkUrlPackageFilter() {
    const urlParams = new URLSearchParams(window.location.search);
    const pkg = urlParams.get('pkg');

    const banner = document.getElementById('reelBanner');
    const bannerText = document.getElementById('reelBannerText');

    if (pkg && banner && bannerText) {
        bannerText.textContent = `🔥 Ad Reel Offer Activated: Displaying exclusive ${pkg.toUpperCase()} Package!`;
        banner.classList.remove('hidden');

        setTimeout(() => {
            const packagesElem = document.getElementById('packages');
            if (packagesElem && lenis) {
                lenis.scrollTo(packagesElem, { offset: -50 });
            }
        }, 1000);
    }
}

// ============================================================
// 4. ACCORDION (Let's Drive Your Journey)
// ============================================================
function initAccordion() {
    const items = document.querySelectorAll('.accordion-item');
    // Open first item by default
    if (items.length > 0) {
        toggleAccordionItem(items[0].querySelector('.accordion-header'), true);
    }
}

function toggleAccordionItem(headerBtn, forceOpen) {
    if (!headerBtn) return;
    const item = headerBtn.closest('.accordion-item');
    if (!item) return;

    const isActive = item.classList.contains('active-accordion');
    const allItems = document.querySelectorAll('.accordion-item');

    // Close all
    allItems.forEach(other => {
        other.classList.remove('active-accordion');
        const body = other.querySelector('.accordion-body');
        if (body) body.classList.add('hidden');
    });

    // Open this one (if it wasn't active, or if forceOpen)
    if (!isActive || forceOpen) {
        item.classList.add('active-accordion');
        const body = item.querySelector('.accordion-body');
        if (body) body.classList.remove('hidden');
    }

    // Update left-side visual
    const stepNum = item.getAttribute('data-step');
    const img = item.getAttribute('data-img');
    const title = item.getAttribute('data-title');
    const desc = item.getAttribute('data-desc');

    const stepPill = document.getElementById('journeyStepPill');
    const stepImg = document.getElementById('journeyStepImg');
    const stepTitle = document.getElementById('journeyStepTitle');
    const stepDesc = document.getElementById('journeyStepDesc');

    if (stepPill) stepPill.textContent = `Step ${String(stepNum).padStart(2, '0')} of 4`;
    if (stepImg && img) stepImg.src = img;
    if (stepTitle && title) stepTitle.textContent = title;
    if (stepDesc && desc) stepDesc.textContent = desc;
}

// ============================================================
// 5. STATS COUNTERS
// ============================================================
function initStatsCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (counters.length === 0) return;

    if (!('IntersectionObserver' in window)) {
        counters.forEach(c => {
            const target = parseInt(c.getAttribute('data-counter'));
            const suffix = c.getAttribute('data-suffix') || '';
            c.textContent = formatCounter(target) + suffix;
        });
        return;
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    counters.forEach(c => counterObserver.observe(c));
}

function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-counter'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        el.textContent = formatCounter(current) + suffix;
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = formatCounter(target) + suffix;
        }
    }
    requestAnimationFrame(update);
}

function formatCounter(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(num >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
}

// ============================================================
// 6. ORBIT TESTIMONIALS
// ============================================================
const testimonialsData = [
    { name: "Priya Sharma", rating: 5, text: "The Murudeshwar trip was absolutely magical! The Volvo sleeper was so comfortable and Aditi took care of every detail. Best travel experience ever!", avatar: "https://images.pexels.com/photos/4993172/pexels-photo-4993172.jpeg?auto=compress&cs=tinysrgb&h=150&w=150" },
    { name: "Rohan Gupta", rating: 5, text: "Coorg coffee mist journey exceeded all expectations. The bonfire night and waterfall trek were unforgettable. Highly recommend Mantra Miles!", avatar: "https://images.pexels.com/photos/4986291/pexels-photo-4986291.jpeg?auto=compress&cs=tinysrgb&h=150&w=150" },
    { name: "Ananya Reddy", rating: 5, text: "Kukke & Dharmasthala yatra was a soul-stirring experience. The temple darshan was well-organized and the heritage hotel was excellent.", avatar: "https://images.pexels.com/photos/28589238/pexels-photo-28589238.jpeg?auto=compress&cs=tinysrgb&h=150&w=150" },
    { name: "Karthik Naidu", rating: 4, text: "Great service from booking to return! The WhatsApp booking system is so convenient. Volvo sleeper berths were spacious and clean.", avatar: "https://images.pexels.com/photos/12759731/pexels-photo-12759731.jpeg?auto=compress&cs=tinysrgb&h=150&w=150" },
    { name: "Deepa Iyer", rating: 5, text: "Gokarna beach trek was the highlight of my year! The cliff views between Om Beach and Kudle were breathtaking. Thank you Mantra Miles!", avatar: "https://images.pexels.com/photos/4993172/pexels-photo-4993172.jpeg?auto=compress&cs=tinysrgb&h=150&w=150" },
    { name: "Vikram Pai", rating: 5, text: "Chikmagalur coffee estates were stunning. The resort stay was luxurious and the campfire evening was so much fun. 10/10 would book again!", avatar: "https://images.pexels.com/photos/4986291/pexels-photo-4986291.jpeg?auto=compress&cs=tinysrgb&h=150&w=150" }
];

function initOrbitTestimonials() {
    const container = document.getElementById('orbitAvatars');
    if (!container) return;

    const popup = document.getElementById('reviewPopup');
    const popupAvatar = document.getElementById('reviewAvatar');
    const popupName = document.getElementById('reviewName');
    const popupStars = document.getElementById('reviewStars');
    const popupText = document.getElementById('reviewText');

    const orbitContainer = document.getElementById('orbitContainer');
    const containerWidth = orbitContainer?.offsetWidth || 600;
    const containerHeight = orbitContainer?.offsetHeight || 500;
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;

    // Two rings of avatars
    const ring1Radius = Math.min(containerWidth, containerHeight) * 0.22;
    const ring2Radius = Math.min(containerWidth, containerHeight) * 0.34;

    const ring1Count = 3;
    const ring2Count = 3;

    let avatarIndex = 0;

    // Ring 1
    for (let i = 0; i < ring1Count && avatarIndex < testimonialsData.length; i++) {
        const angle = (i / ring1Count) * Math.PI * 2 - Math.PI / 2;
        const x = centerX + Math.cos(angle) * ring1Radius - 28;
        const y = centerY + Math.sin(angle) * ring1Radius - 28;
        createOrbitAvatar(container, testimonialsData[avatarIndex], x, y, popup, popupAvatar, popupName, popupStars, popupText);
        avatarIndex++;
    }

    // Ring 2
    for (let i = 0; i < ring2Count && avatarIndex < testimonialsData.length; i++) {
        const angle = (i / ring2Count) * Math.PI * 2 - Math.PI / 2 + 0.5;
        const x = centerX + Math.cos(angle) * ring2Radius - 28;
        const y = centerY + Math.sin(angle) * ring2Radius - 28;
        createOrbitAvatar(container, testimonialsData[avatarIndex], x, y, popup, popupAvatar, popupName, popupStars, popupText);
        avatarIndex++;
    }
}

function createOrbitAvatar(container, data, x, y, popup, popupAvatar, popupName, popupStars, popupText) {
    const avatar = document.createElement('div');
    avatar.className = 'orbit-avatar';
    avatar.style.left = x + 'px';
    avatar.style.top = y + 'px';
    avatar.innerHTML = `<img src="${data.avatar}" alt="${data.name}">`;

    avatar.addEventListener('mouseenter', () => {
        if (popupAvatar) popupAvatar.src = data.avatar;
        if (popupName) popupName.textContent = data.name;
        if (popupStars) popupStars.textContent = '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating);
        if (popupText) popupText.textContent = data.text;
        if (popup) {
            popup.classList.remove('hidden');
            popup.classList.add('visible');
        }
    });

    avatar.addEventListener('mouseleave', () => {
        if (popup) {
            popup.classList.remove('visible');
            popup.classList.add('hidden');
        }
    });

    avatar.addEventListener('click', () => {
        if (popupAvatar) popupAvatar.src = data.avatar;
        if (popupName) popupName.textContent = data.name;
        if (popupStars) popupStars.textContent = '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating);
        if (popupText) popupText.textContent = data.text;
        if (popup) {
            popup.classList.remove('hidden');
            popup.classList.add('visible');
            setTimeout(() => {
                popup.classList.remove('visible');
                popup.classList.add('hidden');
            }, 5000);
        }
    });

    container.appendChild(avatar);
}

// ============================================================
// 7. ROUTE MAP (SVG)
// ============================================================
function drawRouteMap() {
    const svg = document.getElementById('routeMapSvg');
    if (!svg) return;

    const routes = [
        { x: 100, y: 200, label: "Bangalore", color: "#E6AF2E" },
        { x: 280, y: 100, label: "Murudeshwar", color: "#FB8500" },
        { x: 380, y: 180, label: "Gokarna", color: "#00F5D4" },
        { x: 520, y: 120, label: "Coorg", color: "#218359" },
        { x: 680, y: 220, label: "Kukke", color: "#A78BFA" }
    ];

    // Draw curved paths between nodes
    for (let i = 0; i < routes.length - 1; i++) {
        const a = routes[i];
        const b = routes[i + 1];
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2 - 30;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${a.x} ${a.y} Q ${midX} ${midY} ${b.x} ${b.y}`);
        path.setAttribute('class', 'route-line');
        svg.appendChild(path);
    }

    // Draw nodes
    routes.forEach((node, i) => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'route-node-group');

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', node.x);
        circle.setAttribute('cy', node.y);
        circle.setAttribute('r', 8);
        circle.setAttribute('fill', node.color);
        circle.setAttribute('class', 'route-node');
        g.appendChild(circle);

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', node.x);
        label.setAttribute('y', node.y - 18);
        label.setAttribute('class', 'route-node-label');
        label.textContent = node.label;
        g.appendChild(label);

        svg.appendChild(g);
    });
}

// ============================================================
// 8. SECRET ADMIN PANEL
// ============================================================
function setupAdminTripleClickTrigger() {
    const logoBtn = document.getElementById('mainLogoBtn');
    if (!logoBtn) return;

    logoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logoClickCount++;

        if (logoClickTimer) clearTimeout(logoClickTimer);
        logoClickTimer = setTimeout(() => {
            logoClickCount = 0;
        }, 600);

        if (logoClickCount >= 3) {
            logoClickCount = 0;
            openAdminAuthChallenge();
        }
    });
}

function openAdminAuthChallenge() {
    const pass = prompt("🔐 MANTRA MILES ADMIN ACCESS\n\nEnter Master Password:");
    if (pass === "mantra123") {
        openAdminModal();
    } else if (pass !== null) {
        alert("❌ Incorrect Password. Access Denied.");
    }
}

function openAdminModal() {
    const modal = document.getElementById('adminModal');
    if (!modal) return;
    populateAdminDashboard();
    modal.classList.remove('hidden');
}

function closeAdminModal() {
    const modal = document.getElementById('adminModal');
    if (modal) modal.classList.add('hidden');
}

function populateAdminDashboard() {
    const packages = getStoredPackages();
    const tableBody = document.getElementById('adminPackageTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    packages.forEach((pkg, index) => {
        const row = document.createElement('tr');
        row.className = 'border-b border-white/10 text-xs';
        row.innerHTML = `
            <td class="py-3 px-2 font-bold text-white">${pkg.title}</td>
            <td class="py-3 px-2">
                <input type="number" id="adminPrice_${index}" value="${pkg.price}" class="w-24 bg-obsidian border border-gold/30 rounded px-2 py-1 text-gold font-bold">
            </td>
            <td class="py-3 px-2">
                <select id="adminStatus_${index}" class="bg-obsidian border border-gold/30 rounded px-2 py-1 text-white">
                    <option value="active" ${pkg.status === 'active' ? 'selected' : ''}>Active</option>
                    <option value="planning" ${pkg.status === 'planning' ? 'selected' : ''}>Planning Soon</option>
                </select>
            </td>
            <td class="py-3 px-2">
                <input type="text" id="adminImg_${index}" value="${pkg.image}" class="w-full bg-obsidian border border-gold/30 rounded px-2 py-1 text-gray-300">
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function saveAdminChanges() {
    const packages = getStoredPackages();
    packages.forEach((pkg, index) => {
        const priceInput = document.getElementById(`adminPrice_${index}`);
        const statusInput = document.getElementById(`adminStatus_${index}`);
        const imgInput = document.getElementById(`adminImg_${index}`);
        if (priceInput) pkg.price = parseInt(priceInput.value) || pkg.price;
        if (statusInput) pkg.status = statusInput.value;
        if (imgInput) pkg.image = imgInput.value;
    });
    savePackagesToStore(packages);
    closeAdminModal();
}

function resetAdminDefaults() {
    if (confirm("Reset all trip pricing and statuses to default settings?")) {
        localStorage.removeItem('mantra_miles_packages_v6');
        renderPackagesGrid();
        closeAdminModal();
    }
}

// ============================================================
// 9. LEAD CAPTURE MODAL
// ============================================================
function openLeadModal(pkgName) {
    const modal = document.getElementById('leadModal');
    const title = document.getElementById('leadPackageTitle');
    const hiddenPkg = document.getElementById('leadPackageInput');
    if (title) title.textContent = pkgName;
    if (hiddenPkg) hiddenPkg.value = pkgName;
    if (modal) modal.classList.remove('hidden');
}

function closeLeadModal() {
    const modal = document.getElementById('leadModal');
    if (modal) modal.classList.add('hidden');
}

function submitLeadForm(e) {
    e.preventDefault();
    const nameEl = document.getElementById('leadUserName');
    const phoneEl = document.getElementById('leadPhone');
    const monthEl = document.getElementById('leadMonth');
    const pkgEl = document.getElementById('leadPackageInput');
    if (!nameEl || !phoneEl || !monthEl || !pkgEl) return;

    const name = nameEl.value;
    const phone = phoneEl.value;
    const month = monthEl.value;
    const pkg = pkgEl.value;

    const payloadText = `*MANTRA MILES TOUR - NEXT BATCH LEAD* 🚌\n\n` +
        `• *Package:* ${pkg}\n` +
        `• *Guest Name:* ${name}\n` +
        `• *WhatsApp Phone:* ${phone}\n` +
        `• *Preferred Month:* ${month}\n\n` +
        `Hi Aditi, please notify me when the next batch opens for ${pkg}!`;

    triggerN8nWebhook({
        event: "lead_captured",
        guest_name: name,
        phone: phone,
        package: pkg,
        preferred_month: month
    });

    window.open(`https://wa.me/919686078395?text=${encodeURIComponent(payloadText)}`, '_blank');
    closeLeadModal();
}

// ============================================================
// 10. NEWSLETTER
// ============================================================
function submitNewsletter(e) {
    e.preventDefault();
    const emailEl = document.getElementById('newsletterEmail');
    if (!emailEl) return;
    const email = emailEl.value;
    triggerN8nWebhook({
        event: "newsletter_subscribed",
        email: email,
        timestamp: new Date().toISOString()
    });
    emailEl.value = '';
    alert("✅ Subscribed! You'll receive updates about new batches and exclusive offers.");
}

// ============================================================
// 11. TIMED HERO TEXT POP-UP
// ============================================================
function triggerTimedHeroTextPopUp() {
    const textWrapper = document.getElementById('heroTextWrapper');
    if (!textWrapper) return;

    if (typeof gsap !== 'undefined') {
        gsap.to('#heroTextWrapper', {
            opacity: 1,
            y: 0,
            duration: 1.2,
            delay: 3.0,
            ease: 'back.out(1.4)',
            onComplete: () => {
                textWrapper.style.pointerEvents = 'auto';
            }
        });
    } else {
        setTimeout(() => {
            textWrapper.style.opacity = '1';
            textWrapper.style.transform = 'translateY(0)';
            textWrapper.style.pointerEvents = 'auto';
        }, 3000);
    }
}

// ============================================================
// 12. LENIS SMOOTH SCROLL
// ============================================================
function initLenisSmoothScroll() {
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }
    }
}

function initHeroVideoController() {
    const video = document.getElementById('heroBgVideo');
    const canvas = document.getElementById('hero3dCanvas');
    if (video) {
        video.play().catch(() => {
            if (canvas) canvas.classList.remove('hidden');
        });
    }
}

function initGSAPAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
        start: 'top -40',
        end: 99999,
        toggleClass: { className: 'shadow-amber-glow', targets: '#mainHeader' }
    });

    gsap.from('#floatingSearchWrapper', {
        y: 40,
        opacity: 0,
        duration: 1.0,
        ease: 'power3.out',
        delay: 0.3
    });
}

// ============================================================
// 13. SCROLL-DRIVEN EXPANDING MEDIA
// ============================================================
function initHeroMediaScrollScale() {
    const card = document.getElementById('heroMediaCard');
    if (!card) return;

    if (!('IntersectionObserver' in window)) {
        card.classList.add('expanded');
        return;
    }

    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
                card.classList.add('expanded');
            } else if (!entry.isIntersecting) {
                card.classList.remove('expanded');
            }
        });
    }, {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '-10% 0px -10% 0px'
    });
    heroObserver.observe(card);
}

// ============================================================
// 14. SCROLL REVEAL
// ============================================================
function initScrollReveal() {
    const revealElems = document.querySelectorAll('[data-reveal]');
    if (revealElems.length === 0) return;

    if (!('IntersectionObserver' in window)) {
        revealElems.forEach(el => el.classList.add('revealed'));
        return;
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    });
    revealElems.forEach(el => revealObserver.observe(el));
}

// ============================================================
// 15. 3D CARD TILT
// ============================================================
function init3DCardsTilt() {
    if (window.matchMedia('(hover: none)').matches) return;
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
}

// ============================================================
// 16. HERO SEARCH
// ============================================================
function handleHeroSearch(e) {
    if (e) e.preventDefault();
    const destEl = document.getElementById('searchDestination');
    const dest = destEl ? destEl.options[destEl.selectedIndex].text : 'Custom';
    const countEl = document.getElementById('travellerCount');
    const count = countEl ? countEl.textContent : '2';
    openVisualShowcaseModal(`Custom Query: ${dest} (${count} Travellers)`, 6499);
}

function toggleMobileMenu() {
    const drawer = document.getElementById('mobileDrawer');
    if (drawer) drawer.classList.toggle('hidden');
}

// ============================================================
// 17. WEBHOOK + WHATSAPP DISPATCH
// ============================================================
function triggerN8nWebhook(payloadData) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    fetch(n8nWebhookUrl, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            brand: "Mantra Miles Tour",
            timestamp: new Date().toISOString(),
            ...payloadData
        }),
        signal: controller.signal
    }).catch(err => {
        console.warn('[Mantra Miles Webhook Event Error]', err);
    }).finally(() => clearTimeout(timeoutId));
}

function dispatchBookingPayload() {
    const basePrice = (typeof activePackageContext !== 'undefined' && activePackageContext?.price) || 6499;
    const passengerCount = (typeof onboardingState !== 'undefined' && onboardingState.passengerCount) || 2;
    const totalFare = basePrice * passengerCount;
    triggerN8nWebhook({
        event: "whatsapp_booking_confirmed",
        guest_name: (typeof onboardingState !== 'undefined' && onboardingState.name) || 'Valued Guest',
        phone: (typeof onboardingState !== 'undefined' && onboardingState.phone) || '+91 9686078395',
        package: (typeof activePackageContext !== 'undefined' && activePackageContext?.name) || 'Murudeshwar & Gokarna Divine Beach Trail',
        travellers: (typeof onboardingState !== 'undefined' && onboardingState.passengers) || '2 Travellers (Couple)',
        meal_pref: (typeof onboardingState !== 'undefined' && onboardingState.food) || 'Pure Veg',
        pickup_hub: (typeof onboardingState !== 'undefined' && onboardingState.pickup) || 'Indiranagar 100ft Road (10:00 PM)',
        total_fare: `₹${totalFare.toLocaleString('en-IN')}`,
        timestamp: new Date().toISOString()
    });
}

function redirectToWhatsAppPayment(customData) {
    const phoneTarget = "919686078395";
    const name = customData?.name || (typeof onboardingState !== 'undefined' && onboardingState.name) || 'Valued Guest';
    const phone = customData?.phone || (typeof onboardingState !== 'undefined' && onboardingState.phone) || '+91 9686078395';
    const lang = (typeof onboardingState !== 'undefined' && onboardingState.lang === 'kn') ? 'ಕನ್ನಡ (Kannada)' : ((typeof onboardingState !== 'undefined' && onboardingState.lang === 'hi') ? 'हिंदी (Hindi)' : 'English');
    const pkg = customData?.package || (typeof activePackageContext !== 'undefined' && activePackageContext?.name) || 'Murudeshwar & Gokarna Divine Beach Trail';
    const travellers = customData?.passengers || (typeof onboardingState !== 'undefined' && onboardingState.passengers) || '2 Travellers (Couple)';
    const food = customData?.food || (typeof onboardingState !== 'undefined' && onboardingState.food) || 'Pure Veg';
    const pickup = customData?.pickup || (typeof onboardingState !== 'undefined' && onboardingState.pickup) || 'Indiranagar 100ft Road (10:00 PM)';
    const basePrice = (typeof activePackageContext !== 'undefined' && activePackageContext?.price) || 6499;
    const passengerCount = (typeof onboardingState !== 'undefined' && onboardingState.passengerCount) || 2;
    const totalFare = basePrice * passengerCount;

    const payloadText = `*MANTRA MILES TOUR - BOOKING REQUEST* 🚌\n\n` +
        `• *Package:* ${pkg}\n` +
        `• *Guest Name:* ${name}\n` +
        `• *Phone Number:* ${phone}\n` +
        `• *Preferred Language:* ${lang}\n` +
        `• *Travellers:* ${travellers}\n` +
        `• *Meal Preference:* ${food}\n` +
        `• *Pickup Hub:* ${pickup}\n` +
        `• *Total Est. Fare:* ₹${totalFare.toLocaleString('en-IN')}\n\n` +
        `Hi Aditi, please confirm availability and lock sleeper berths for our trip!`;

    dispatchBookingPayload();
    window.open(`https://wa.me/${phoneTarget}?text=${encodeURIComponent(payloadText)}`, '_blank');
}
