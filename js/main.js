/**
 * Mantra Miles Tour - V21 Core Engine
 * Features: Zero Page-Scroll Custom Holiday Form Submission, Custom Location AI Engine, Visual Showcase Modal (2 Images + 2 Videos), WhatsApp Integration (+919686078395)
 */

let lenis;
let logoClickCount = 0;
let logoClickTimer = null;

// Default Package Database
const defaultPackagesDB = [
    {
        id: "goa",
        title: "Goa Luxury Beach Escape",
        price: 7499,
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop",
        badge: "Reel Favorite",
        rating: "5.0 (490+)",
        duration: "3 Days / 2 Nights",
        status: "active",
        category: "coastal",
        desc: "5-star oceanfront resort in North Goa, private yacht sunset cruise, beach club VIP entry & seafood dining.",
        itinerary: [
            "• Day 1: Board Volvo Sleeper from Bengaluru -> Arrival & Check-in at 5-Star Beach Resort.",
            "• Day 2: Private Yacht Sunset Cruise -> VIP Beach Club Dinner & DJ Night.",
            "• Day 3: Watersports at Calangute Beach -> Shopping -> Evening Volvo return."
        ],
        inclusions: ["Multi-Axle Volvo Sleeper", "5-Star Oceanfront Resort Stay", "Private Yacht Cruise", "Daily Breakfast & Dinner"]
    },
    {
        id: "coorg",
        title: "Coorg Mist & Coffee Estate",
        price: 6999,
        image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=1000&auto=format&fit=crop",
        badge: "Bestseller",
        rating: "4.9 (340+)",
        duration: "3 Days / 2 Nights",
        status: "active",
        category: "hill",
        desc: "Stay at an authentic coffee plantation resort, private waterfall treks, bonfire acoustic sessions, and Abbey Falls.",
        itinerary: [
            "• Day 1: Board Volvo Sleeper -> Check-in Coffee Plantation Resort -> Waterfall Trek.",
            "• Day 2: Abbey Falls & Raja's Seat Sunset -> Acoustic Music Bonfire Campfire.",
            "• Day 3: Spice Tasting Tour -> Souvenir Shopping -> Evening Volvo Return."
        ],
        inclusions: ["Multi-Axle Volvo Sleeper", "Coffee Plantation Resort Stay", "Private Waterfall Trek", "Campfire & Acoustic Evening"]
    },
    {
        id: "ooty",
        title: "Ooty & Coonoor Toy Train",
        price: 8499,
        image: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1000&auto=format&fit=crop",
        badge: "Trending",
        rating: "4.8 (280+)",
        duration: "4 Days / 3 Nights",
        status: "active",
        category: "hill",
        desc: "Nilgiri mountain railway ride, tea tasting in Coonoor, Doddabetta peak sunset view, and Pykara lake speed boating.",
        itinerary: [
            "• Day 1: Volvo Sleeper Arrival -> Nilgiri Mountain Rail Ride to Coonoor.",
            "• Day 2: Doddabetta Peak Viewpoint -> Tea Tasting & Pykara Lake Speed Boating.",
            "• Day 3: Botanical Gardens Tour -> Chocolate Factory Visit -> Return Volvo."
        ],
        inclusions: ["Multi-Axle Volvo Sleeper", "Heritage Toy Train Tickets", "4-Star Hill Resort Stay", "Boating & Tea Tasting Pass"]
    },
    {
        id: "mysuru",
        title: "Mysuru Palace & Heritage Trail",
        price: 5999,
        image: "https://images.pexels.com/photos/14702568/pexels-photo-14702568.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
        badge: "Heritage",
        rating: "4.9 (210+)",
        duration: "2 Days / 1 Night",
        status: "active",
        category: "heritage",
        desc: "Royal Mysuru Palace illuminated tour, Chamundi Hill temple darshan, Brindavan Gardens fountain show & heritage market walk.",
        itinerary: [
            "• Day 1: Volvo Sleeper Arrival -> Mysuru Palace Illumination Tour -> Brindavan Gardens Fountain Show.",
            "• Day 2: Chamundi Hill Temple Darshan -> Heritage Market & Silk Weaving Tour -> Evening Volvo Return."
        ],
        inclusions: ["Multi-Axle Volvo Sleeper", "4-Star Heritage Hotel Stay", "Palace Entry Tickets", "Temple Darshan Pass"]
    }
];

function getStoredPackages() {
    const data = localStorage.getItem('mantra_miles_packages_v5');
    if (data) {
        try { return JSON.parse(data); } catch (e) { console.error(e); }
    }
    localStorage.setItem('mantra_miles_packages_v5', JSON.stringify(defaultPackagesDB));
    return defaultPackagesDB;
}

function savePackagesToStore(packages) {
    localStorage.setItem('mantra_miles_packages_v5', JSON.stringify(packages));
    renderPackagesGrid();
}

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
    initDestinationCardReveal();
});

// ----------------------------------------------------
// 1. CUSTOM ITINERARY FORM ZERO-SCROLL SUBMISSION
// ----------------------------------------------------
function setupCustomItineraryFormListener() {
    const form = document.getElementById('custom-itinerary-form');
    if (form) {
        form.addEventListener('submit', generateAIItinerary);
    }
}

// ----------------------------------------------------
// 1.5 FLOATING BOOKING BAR: FILTER PILLS + TRAVELLER COUNTER
// ----------------------------------------------------
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
        coastal: ['goa'],
        spiritual: ['mysuru'],
        hill: ['coorg', 'ooty'],
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

    launchAditiCustomLocationChat(dest, daysText, name, phone);
    return false;
}

// ----------------------------------------------------
// 2. DYNAMIC RENDERER & VISUAL SHOWCASE INTERCEPTION
// ----------------------------------------------------
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
                    <h3 class="text-2xl font-bold text-white group-hover:text-gold transition-colors">${pkg.title}</h3>
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

function openBookingModal(packageName = "Mantra Miles Volvo Custom Trip", price = 6999) {
    openVisualShowcaseModal(packageName, price);
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

// ----------------------------------------------------
// 3. SECRET ADMIN PANEL TRIPLE-CLICK TRIGGER (mantra123)
// ----------------------------------------------------
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
        localStorage.removeItem('mantra_miles_packages_v5');
        renderPackagesGrid();
        closeAdminModal();
    }
}

// ----------------------------------------------------
// 4. LEAD CAPTURE MODAL
// ----------------------------------------------------
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

    window.open(`https://wa.me/919686078395?text=${encodeURIComponent(payloadText)}`, '_blank');

    closeLeadModal();
}

// ----------------------------------------------------
// 5. TIMED 3.0-SECOND DELAYED HERO TEXT POP-UP
// ----------------------------------------------------
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

// ----------------------------------------------------
// 6. LENIS JS SMOOTH SCROLL INTEGRATION
// ----------------------------------------------------
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
        video.play().catch(err => {
            console.warn('[Mantra Miles Video] Autoplay blocked, showing 3D Canvas visual fallback.', err);
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

function initDestinationCardReveal() {
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

function switchFleetTab(tabId) {
    const tabs = ['volvo', 'cabs', 'flights'];
    tabs.forEach(t => {
        const view = document.getElementById(`fleet-${t}`);
        const btn = document.getElementById(`fleetTab-${t}`);

        if (t === tabId) {
            if (view) view.classList.remove('hidden');
            if (btn) {
                btn.className = 'px-6 py-2.5 rounded-xl text-xs md:text-sm font-extrabold transition-all bg-gradient-to-r from-gold to-amber text-obsidian shadow-gold-glow';
            }
        } else {
            if (view) view.classList.add('hidden');
            if (btn) {
                btn.className = 'px-6 py-2.5 rounded-xl text-xs md:text-sm font-extrabold text-gray-400 hover:text-white transition-all';
            }
        }
    });
}

function handleHeroSearch(e) {
    if (e) e.preventDefault();
    const destEl = document.getElementById('searchDestination');
    const dest = destEl ? destEl.value : 'Custom';
    const countEl = document.getElementById('travellerCount');
    const count = countEl ? countEl.textContent : '2';
    openVisualShowcaseModal(`Custom Query: ${dest.toUpperCase()} (${count} Travellers)`, 6999);
}

function toggleMobileMenu() {
    const drawer = document.getElementById('mobileDrawer');
    if (drawer) drawer.classList.toggle('hidden');
}
