/**
 * Mantra Miles Tour - Live Webhook & AI Conversation Engine (V22 Release)
 * Persona: Aditi - Senior Tour Specialist (Mantra Miles)
 * Webhook: https://f1be-106-222-212-16.ngrok-free.dev/webhook/mantra-chat
 */

let currentLang = 'kn';
let activePackageContext = null;
let awaitingCustomGroupInput = false;
let currentShowcasePkg = { name: "Goa Luxury Beach Escape", price: 7499 };

const aditiAvatarUrl = "aditi.jpg";
const n8nWebhookUrl = "https://f1be-106-222-212-16.ngrok-free.dev/webhook/mantra-chat";

// Guided Onboarding State Object
let onboardingState = {
    step: 1,
    name: '',
    phone: '',
    lang: 'kn',
    passengers: '2 Travellers (Couple)',
    passengerCount: 2,
    food: 'Pure Veg 🟢',
    pickup: 'Indiranagar 100ft Road (10:00 PM)'
};

// ----------------------------------------------------
// 1. LAUNCH ADITI CUSTOM LOCATION CHAT (ZERO SCROLL)
// ----------------------------------------------------
function launchAditiCustomLocationChat(dest, daysText, name, phone) {
    const formattedDest = dest ? dest.toUpperCase().trim() : 'DUBAI';
    const formattedDays = daysText || '3 Days / 2 Nights';
    const guestName = name ? name.trim() : 'Lithin';
    const guestPhone = phone ? phone.trim() : '9686078395';

    const customPkgTitle = `Custom Trip: ${formattedDest} (${formattedDays})`;
    activePackageContext = { name: customPkgTitle, price: 14999 };

    onboardingState = {
        step: 2,
        name: guestName,
        phone: guestPhone,
        lang: currentLang || 'en',
        passengers: '2 Travellers (Couple)',
        passengerCount: 2,
        food: 'Pure Veg 🟢',
        pickup: 'Indiranagar 100ft Road (10:00 PM)'
    };

    const modalTitle = document.getElementById('aiModalPackageTitle');
    const modalPrice = document.getElementById('aiModalPackagePrice');

    if (modalTitle) modalTitle.textContent = customPkgTitle;
    if (modalPrice) modalPrice.textContent = `Custom Package Plan`;

    const modal = document.getElementById('aiBookingModal');
    if (modal) modal.classList.remove('hidden');

    const container = document.getElementById('aiModalChatMessages');
    if (container) container.innerHTML = '';

    // Aditi Left Welcome Bubble
    const aditiGreeting = `
        Namaste <strong>${guestName}</strong>! 🌸 I'm Aditi, Senior Tour Specialist at Mantra Miles. I see you want to plan a custom trip to <strong>${formattedDest}</strong> for <strong>${formattedDays}</strong>! I've saved your contact (+91${guestPhone}). Let's design your perfect custom itinerary right away!<br><br>
        <span class="text-gold font-bold">Step 2 of 5:</span> Which language do you prefer for your trip updates and itinerary?
    `;
    appendAditiLeftMessage(aditiGreeting, "Custom Request");

    // Right-Aligned User Chat Card
    const userRequestSummary = `Destination: ${formattedDest} | Duration: ${formattedDays} | Name: ${guestName} | Phone: ${guestPhone}`;
    appendUserRightMessage(userRequestSummary);

    // Step 2 Language Pills in Action Dock
    renderStep2LanguagePills();

    // Trigger Webhook Event
    triggerN8nWebhook({
        event: "custom_itinerary_initiated",
        destination: formattedDest,
        duration: formattedDays,
        guest_name: guestName,
        phone: guestPhone
    });
}

function openAditiCustomItineraryChat(dest, days, name, phone) {
    launchAditiCustomLocationChat(dest, `${days} Days`, name, phone);
}

// ----------------------------------------------------
// 2. STEP-1 INTERSTITIAL VISUAL SHOWCASE MODAL
// ----------------------------------------------------
function openVisualShowcaseModal(packageName = "Goa Luxury Beach Escape", price = 7499) {
    currentShowcasePkg = { name: packageName, price: price };

    const modalTitle = document.getElementById('showcaseModalTitle');
    const modalPrice = document.getElementById('showcaseModalPrice');

    if (modalTitle) modalTitle.textContent = packageName;
    if (modalPrice) modalPrice.textContent = `Starting ₹${price.toLocaleString('en-IN')} / person`;

    const showcaseModal = document.getElementById('visualShowcaseModal');
    if (showcaseModal) showcaseModal.classList.remove('hidden');
}

function closeVisualShowcaseModal() {
    const showcaseModal = document.getElementById('visualShowcaseModal');
    if (showcaseModal) showcaseModal.classList.add('hidden');
}

function proceedFromShowcaseToAditiChat() {
    closeVisualShowcaseModal();
    openAIChatWithPackageContext(currentShowcasePkg.name, currentShowcasePkg.price);
}

// ----------------------------------------------------
// 3. OPEN HUMAN EXPERT DESK (ADITI) & RESET ONBOARDING
// ----------------------------------------------------
function openHumanAgentChat(packageName = "Goa Luxury Beach Escape", price = 7499) {
    openVisualShowcaseModal(packageName, price);
}

function openAIChatWithPackageContext(packageName = "Goa Luxury Beach Escape", price = 7499) {
    activePackageContext = { name: packageName, price: price };
    awaitingCustomGroupInput = false;

    // Reset Onboarding State Machine
    onboardingState = {
        step: 1,
        name: '',
        phone: '',
        lang: currentLang || 'kn',
        passengers: '2 Travellers (Couple)',
        passengerCount: 2,
        food: 'Pure Veg 🟢',
        pickup: 'Indiranagar 100ft Road (10:00 PM)'
    };

    // Update Modal Header & Targeted Package Banner
    const modalTitle = document.getElementById('aiModalPackageTitle');
    const modalPrice = document.getElementById('aiModalPackagePrice');

    if (modalTitle) modalTitle.textContent = packageName;
    if (modalPrice) modalPrice.textContent = `Starting ₹${price.toLocaleString('en-IN')} / person`;

    // Open Center Screen Pop-up Modal WITHOUT page scrolling
    const modal = document.getElementById('aiBookingModal');
    if (modal) modal.classList.remove('hidden');

    // Start Step 1 Onboarding Sequence
    startOnboardingSequence();
}

function closeAIBookingModal() {
    const modal = document.getElementById('aiBookingModal');
    if (modal) modal.classList.add('hidden');
}

// ----------------------------------------------------
// 4. WHATSAPP-STYLE CHAT BUBBLE RENDERERS (LEFT & RIGHT)
// ----------------------------------------------------
function appendAditiLeftMessage(msgHtml, stepBadgeText = null) {
    const container = document.getElementById('aiModalChatMessages');
    if (!container) return null;

    const aditiDiv = document.createElement('div');
    aditiDiv.className = 'flex gap-3 animate-fade-in self-start max-w-[90%]';

    let badgeHTML = '';
    if (stepBadgeText) {
        badgeHTML = `<span class="text-[9px] text-amber font-bold bg-obsidian px-2 py-0.5 rounded-full border border-gold/30">${stepBadgeText}</span>`;
    }

    aditiDiv.innerHTML = `
        <div class="relative w-8 h-8 rounded-full overflow-hidden border border-gold shrink-0 mt-1 shadow-gold-glow">
            <img src="${aditiAvatarUrl}" alt="Aditi" class="w-full h-full object-cover" style="object-position: center 18%;">
        </div>
        <div class="bg-obsidian/90 border border-gold/30 rounded-2xl p-4 text-gray-200 leading-relaxed font-sans text-xs space-y-2 shadow-glass">
            <div class="flex items-center justify-between border-b border-gold/20 pb-1.5 gap-2">
                <span class="font-bold text-gold text-xs">Aditi</span>
                ${badgeHTML}
            </div>
            <div class="message-body">${msgHtml}</div>
        </div>
    `;

    container.appendChild(aditiDiv);
    container.scrollTop = container.scrollHeight;
    return aditiDiv;
}

function appendUserRightMessage(msgText) {
    const container = document.getElementById('aiModalChatMessages');
    if (!container) return;

    const userDiv = document.createElement('div');
    userDiv.className = 'flex gap-2 justify-end animate-fade-in self-end ml-auto max-w-[85%]';
    userDiv.innerHTML = `
        <div class="bg-gradient-to-r from-gold via-amber to-gold text-obsidian font-bold rounded-2xl p-3.5 text-xs shadow-gold-glow">
            ${msgText}
        </div>
    `;

    container.appendChild(userDiv);
    container.scrollTop = container.scrollHeight;
}

function clearActionDock() {
    const dock = document.getElementById('onboardingActionDock');
    if (dock) dock.innerHTML = '';
}

function renderActionDockOptions(optionsArray) {
    const dock = document.getElementById('onboardingActionDock');
    if (!dock) return;

    dock.innerHTML = '';
    optionsArray.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'px-3.5 py-2 rounded-xl bg-forestObsidian border border-gold/40 text-gold font-bold text-xs hover:bg-gold hover:text-obsidian transition-all shadow-gold-glow flex items-center gap-1.5';
        btn.innerHTML = opt.label;
        btn.onclick = () => selectStepChoice(opt.key, opt.displayLabel, opt.extraVal);
        dock.appendChild(btn);
    });
}

// ----------------------------------------------------
// 5. STEP-BY-STEP GUIDED ONBOARDING ENGINE
// ----------------------------------------------------
function startOnboardingSequence() {
    const container = document.getElementById('aiModalChatMessages');
    if (!container) return;

    container.innerHTML = '';
    clearActionDock();
    onboardingState.step = 1;
    awaitingCustomGroupInput = false;

    const pkgName = activePackageContext?.name || "Goa Luxury Beach Escape";
    const pkgPrice = activePackageContext?.price || 7499;

    const msg = `
        Namaste! 🌸 I'm Aditi from Mantra Miles Tour. Let's get your luxury booking for <strong>${pkgName}</strong> (₹${pkgPrice.toLocaleString('en-IN')}) confirmed in a few quick steps!<br><br>
        <span class="text-gold font-bold">Step 1 of 5:</span> Please type your <strong>Name & WhatsApp Phone Number</strong> in the input bar below to begin:
    `;

    appendAditiLeftMessage(msg, "Step 1 of 5");

    const input = document.getElementById('aiModalChatInput');
    if (input) input.placeholder = "Type Name & Phone e.g. Lithin 9686078395...";
}

function renderStep2LanguagePills() {
    onboardingState.step = 2;
    clearActionDock();

    const msg = `Great to connect, <strong>${onboardingState.name}</strong>! Which language do you prefer for your trip updates and itinerary?`;
    appendAditiLeftMessage(msg, "Step 2 of 5");

    renderActionDockOptions([
        { key: 'lang', label: '🇬🇧 English', displayLabel: 'English', extraVal: 'en' },
        { key: 'lang', label: '🇮🇳 ಕನ್ನಡ', displayLabel: 'ಕನ್ನಡ (Kannada)', extraVal: 'kn' },
        { key: 'lang', label: '🇮🇳 हिंदी', displayLabel: 'हिंदी (Hindi)', extraVal: 'hi' }
    ]);

    const input = document.getElementById('aiModalChatInput');
    if (input) input.placeholder = "Tap language above or ask Aditi a question...";
}

function renderStep3Passengers() {
    onboardingState.step = 3;
    clearActionDock();
    awaitingCustomGroupInput = false;

    let msg = "How many travellers are joining you on this trip?";
    if (onboardingState.lang === 'kn') msg = "ಈ ಪ್ರವಾಸದಲ್ಲಿ ನಿಮ್ಮೊಂದಿಗೆ ಎಷ್ಟು ಪ್ರಯಾಣಿಕರು ಬರುತ್ತಿದ್ದಾರೆ?";
    else if (onboardingState.lang === 'hi') msg = "इस यात्रा में आपके साथ कितने यात्री आ रहे हैं?";

    appendAditiLeftMessage(msg, "Step 3 of 5");

    renderActionDockOptions([
        { key: 'passengers', label: '👤 Solo (1 Seat)', displayLabel: 'Solo Traveller (1 Seat)', extraVal: 1 },
        { key: 'passengers', label: '👥 Couple (2 Sleeper Berths)', displayLabel: 'Couple (2 Sleeper Berths)', extraVal: 2 },
        { key: 'passengers', label: '👨‍👩‍👧‍👦 Family / Group (3+ Sleeper Berths)', displayLabel: 'Family / Group (3+ Sleeper Berths)', extraVal: 4 },
        { key: 'custom_group', label: '🛠️ Custom Group / Mixed Count', displayLabel: 'Custom Group / Mixed Count', extraVal: 'custom' }
    ]);

    const input = document.getElementById('aiModalChatInput');
    if (input) input.placeholder = "Select an option above or type your question...";
}

function renderStep4FoodPref() {
    onboardingState.step = 4;
    clearActionDock();
    awaitingCustomGroupInput = false;

    let msg = "What is your meal preference for resort dining and breakfast?";
    if (onboardingState.lang === 'kn') msg = "ನಿಮ್ಮ ಆಹಾರದ ಆದ್ಯತೆ ಏನು? (ಉಪಹಾರ ಮತ್ತು ಭೋಜನ)";
    else if (onboardingState.lang === 'hi') msg = "भोजन के लिए आपकी क्या पसंद है?";

    appendAditiLeftMessage(msg, "Step 4 of 5");

    renderActionDockOptions([
        { key: 'food', label: '🟢 Pure Veg', displayLabel: 'Pure Veg 🟢' },
        { key: 'food', label: '🔴 Non-Veg', displayLabel: 'Non-Veg 🔴' },
        { key: 'food', label: '🟡 Both (Veg & Non-Veg)', displayLabel: 'Both Veg & Non-Veg 🟡' }
    ]);

    const input = document.getElementById('aiModalChatInput');
    if (input) input.placeholder = "Tap food preference above...";
}

function renderStep5PickupPoint() {
    onboardingState.step = 5;
    clearActionDock();

    let msg = "Select your preferred Bengaluru Volvo Sleeper pickup hub:";
    if (onboardingState.lang === 'kn') msg = "ಬೆಂಗಳೂರಿನಲ್ಲಿ ನಿಮ್ಮ ಆಧ್ಯತೆಯ Volvo ಬಸ್ ಪಿಕ್-ಅಪ್ ಪಾಯಿಂಟ್ ಆಯ್ಕೆಮಾಡಿ:";
    else if (onboardingState.lang === 'hi') msg = "ಬೆಂಗಳೂರಿನಲ್ಲಿ ನಿಮ್ಮ ಆದ್ಯತೆಯ ಪಿಕ್-ಅಪ್ ಪಾಯಿಂಟ್ ಆಯ್ಕೆಮಾಡಿ:";

    appendAditiLeftMessage(msg, "Step 5 of 5");

    renderActionDockOptions([
        { key: 'pickup', label: '📍 Majestic (09:30 PM)', displayLabel: 'Majestic Bus Stand Hub (09:30 PM)' },
        { key: 'pickup', label: '📍 Indiranagar (10:00 PM)', displayLabel: 'Indiranagar 100ft Road (10:00 PM)' },
        { key: 'pickup', label: '📍 Silk Board (10:30 PM)', displayLabel: 'Silk Board Junction (10:30 PM)' },
        { key: 'pickup', label: '📍 Electronic City (10:45 PM)', displayLabel: 'Electronic City Toll Gate (10:45 PM)' }
    ]);

    const input = document.getElementById('aiModalChatInput');
    if (input) input.placeholder = "Select pickup point above...";
}

function selectStepChoice(key, choiceLabel, extraVal = null) {
    if (key === 'custom_group') {
        appendUserRightMessage(choiceLabel);
        clearActionDock();
        awaitingCustomGroupInput = true;

        const aditiPrompt = `Got it! Please type your exact group breakdown in the input bar below (e.g., <em>'4 Men, 3 Women, 2 Kids'</em> or <em>'6 Male Friends'</em>):`;
        appendAditiLeftMessage(aditiPrompt, "Custom Group");

        const input = document.getElementById('aiModalChatInput');
        if (input) {
            input.placeholder = "Type your group breakdown here (e.g., 4 Men, 3 Women, 2 Kids)...";
            input.focus();
        }
        return;
    }

    appendUserRightMessage(choiceLabel);

    if (key === 'lang') {
        onboardingState.lang = extraVal || 'en';
        currentLang = onboardingState.lang;
        renderStep3Passengers();
    } else if (key === 'passengers') {
        onboardingState.passengers = choiceLabel;
        if (extraVal) onboardingState.passengerCount = extraVal;
        renderStep4FoodPref();
    } else if (key === 'food') {
        onboardingState.food = choiceLabel;
        renderStep5PickupPoint();
    } else if (key === 'pickup') {
        onboardingState.pickup = choiceLabel;
        clearActionDock();
        generateFinalBookingTicketSummary();
    }
}

function generateFinalBookingTicketSummary() {
    onboardingState.step = 6;
    clearActionDock();
    awaitingCustomGroupInput = false;

    const pkgName = activePackageContext?.name || "Goa Luxury Beach Escape";
    const basePrice = activePackageContext?.price || 7499;
    const totalFare = basePrice * (onboardingState.passengerCount || 1);

    const ticketMsg = `
        <span class="font-black text-gold uppercase tracking-wider flex items-center gap-1.5 border-b border-gold/30 pb-1.5 mb-2">
            <i class="fa-solid fa-ticket"></i> MANTRA MILES TICKET SUMMARY
        </span>
        <div class="space-y-1 font-mono text-gray-200 bg-obsidian/90 p-3 rounded-xl border border-gold/20 text-xs">
            <div><span class="text-gold font-bold">Package:</span> ${pkgName}</div>
            <div><span class="text-gold font-bold">Guest:</span> ${onboardingState.name} (${onboardingState.phone})</div>
            <div><span class="text-gold font-bold">Travellers:</span> ${onboardingState.passengers}</div>
            <div><span class="text-gold font-bold">Meal Pref:</span> ${onboardingState.food}</div>
            <div><span class="text-gold font-bold">Pickup Hub:</span> ${onboardingState.pickup}</div>
            <div class="pt-1.5 border-t border-gold/20 text-sm font-black text-amber flex justify-between">
                <span>Total Est. Fare:</span>
                <span>₹${totalFare.toLocaleString('en-IN')}</span>
            </div>
        </div>
        <p class="text-xs text-gray-300 mt-2">
            Your customized ticket parameters are locked! Click the <strong>Confirm & Pay on WhatsApp</strong> button below to instantly submit your booking ticket to Aditi.
        </p>
    `;

    appendAditiLeftMessage(ticketMsg, "Booking Locked ✓");

    const footerStatus = document.getElementById('onboardingFooterStatus');
    const whatsappLabel = document.getElementById('whatsappBtnLabel');

    if (footerStatus) footerStatus.textContent = `✓ Ticket generated for ${onboardingState.name}. Click WhatsApp below to lock sleeper berths.`;
    if (whatsappLabel) whatsappLabel.textContent = `Confirm & Pay ₹${totalFare.toLocaleString('en-IN')} on WhatsApp`;

    triggerN8nWebhook({
        event: "onboarding_completed",
        guest_name: onboardingState.name,
        phone: onboardingState.phone,
        package: pkgName,
        total_fare: totalFare,
        pickup: onboardingState.pickup,
        food: onboardingState.food
    });
}

// ----------------------------------------------------
// 6. CHAT SUBMIT DISPATCHER & WEBHOOK / AI ENGINE
// ----------------------------------------------------
async function handleAIModalChatSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('aiModalChatInput');
    const query = input ? input.value.trim() : '';

    if (!query) return;

    // Handle Custom Group Input State
    if (awaitingCustomGroupInput) {
        awaitingCustomGroupInput = false;
        onboardingState.passengers = query;

        const numbers = query.match(/\d+/g);
        if (numbers && numbers.length > 0) {
            onboardingState.passengerCount = numbers.reduce((acc, num) => acc + parseInt(num), 0);
        } else {
            onboardingState.passengerCount = 4;
        }

        appendUserRightMessage(`Custom Breakdown: ${query}`);
        if (input) input.value = '';

        renderStep4FoodPref();
        return;
    }

    // Handle Step 1 Contact Intake Parsing
    if (onboardingState.step === 1 && !onboardingState.name) {
        onboardingState.name = query.split(/[\s,]+/)[0] || query;
        onboardingState.phone = query;
        appendUserRightMessage(`Name & Contact: ${query}`);
        if (input) input.value = '';
        renderStep2LanguagePills();
        return;
    }

    appendUserRightMessage(query);
    if (input) input.value = '';

    const knowledgeContext = {
        activePackage: activePackageContext?.name || "Goa Luxury Beach Escape",
        activePrice: activePackageContext?.price || 7499
    };

    // Show temporary typing indicator
    const typingBubble = appendAditiLeftMessage(`<span class="inline-flex items-center gap-1 text-gold"><i class="fa-solid fa-circle-notch fa-spin"></i> Aditi is typing...</span>`);

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const response = await fetch(n8nWebhookUrl, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: query,
                sessionId: onboardingState.phone || 'guest_session',
                guest_name: onboardingState.name,
                phone: onboardingState.phone,
                package: knowledgeContext.activePackage,
                language: onboardingState.lang,
                onboarding_state: onboardingState
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            const replyText = data.output || data.response || data.text || data.message || (typeof data === 'string' ? data : null);
            if (replyText) {
                if (typingBubble) {
                    const bodyElem = typingBubble.querySelector('.message-body');
                    if (bodyElem) bodyElem.innerHTML = replyText;
                } else {
                    appendAditiLeftMessage(replyText);
                }
                return;
            }
        }
    } catch (err) {
        console.warn('[Mantra Miles Webhook] Falling back to intelligent response engine:', err);
    }

    // Fallback if webhook is slow or returns non-standard format
    const fallbackAnswer = generateIntelligentResponse(query, knowledgeContext);
    if (typingBubble) {
        const bodyElem = typingBubble.querySelector('.message-body');
        if (bodyElem) bodyElem.innerHTML = fallbackAnswer;
    } else {
        appendAditiLeftMessage(fallbackAnswer);
    }
}

function generateIntelligentResponse(userQuery, contextData) {
    const pkgName = contextData.activePackage;
    const pkgPrice = contextData.activePrice;
    const lower = userQuery.toLowerCase();

    // CUSTOM LOCATION: DUBAI
    if (lower.includes("dubai") || lower.includes("uae") || lower.includes("visa") || lower.includes("burj")) {
        return `For Dubai custom packages, we include round-trip flights from Bengaluru/Mumbai, 5-Star Resort stay, 14-day Tourist Visa processing, Desert Safari & Burj Khalifa At The Top tickets! Packages start from ₹44,999/person. Would you like me to reserve flight slots?`;
    }

    // CUSTOM LOCATION: KERALA
    if (lower.includes("kerala") || lower.includes("munnar") || lower.includes("houseboat") || lower.includes("alleppey")) {
        return `For Kerala escapes, we feature 5-star Luxury Houseboat cruises in Alleppey, tea estate resorts in Munnar, and private AC Volvo/SUV transportation. Packages start from ₹8,999/person.`;
    }

    // CUSTOM LOCATION: MANALI / HIMACHAL
    if (lower.includes("manali") || lower.includes("himachal") || lower.includes("solang") || lower.includes("snow")) {
        return `For Manali & Solang Valley, we offer luxury Volvo sleeper connectivity from Delhi/Chandigarh, 4-star mountain view resorts, snow sports passes, and bonfire dinners from ₹9,499/person.`;
    }

    // MONEY / PRICE / EXPENSE INTENT FIX
    if (lower.includes("money") || lower.includes("price") || lower.includes("cost") || lower.includes("rupee") || lower.includes("inr") || lower.includes("expense") || lower.includes("budget") || lower.includes("discount") || lower.includes("offer") || lower.includes("pay") || lower.includes("fare") || lower.includes("hike") || lower.includes("rate")) {
        if (currentLang === 'kn') {
            return `${pkgName} ಒಟ್ಟು ಪ್ಯಾಕೇಜ್ ದರ ಪ್ರತಿ ವ್ಯಕ್ತಿಗೆ ₹${pkgPrice.toLocaleString('en-IN')}. ಇದರಲ್ಲಿ Volvo Sleeper ಪ್ರಯಾಣ, 5-ಸ್ಟಾರ್ ರಿಸಾರ್ಟ್ ತಂಗುವಿಕೆ ಮತ್ತು ಉಚಿತ ಉಪಹಾರ ಮತ್ತು ಊಟ ಸೇರಿದೆ! ವೈಯಕ್ತಿಕ ಶಾಪಿಂಗ್ ಅಥವಾ ವಾಟರ್ ಸ್ಪೋರ್ಟ್ಸ್‌ಗಾಗಿ ನೀವು ಹೆಚ್ಚುವರಿಯಾಗಿ ಕೇವಲ ₹2,000–3,000 ಇಟ್ಟುಕೊಂಡರೆ ಸಾಕಾಗುತ್ತದೆ.`;
        } else if (currentLang === 'hi') {
            return `${pkgName} का कुल पैकेज शुल्क ₹${pkgPrice.toLocaleString('en-IN')} प्रति व्यक्ति है (वोल्वो स्लीपर यात्रा, 5-स्टार रिसॉर्ट और दैनिक भोजन शामिल है)। व्यक्तिगत खरीदारी या वाटर स्पोर्ट्स के लिए आपको केवल ₹2,000-3,000 अतिरिक्त चाहिए।`;
        } else {
            return `The total package fare for ${pkgName} is ₹${pkgPrice.toLocaleString('en-IN')} per person (including round-trip AC Volvo Sleeper, 5-Star Resort stay, and daily breakfast & dinner). You'll only need around ₹2,000–3,000 extra per person for personal shopping or watersports outside the resort!`;
        }
    }

    // LUGGAGE POLICY INTENT
    if (lower.includes("bag") || lower.includes("luggage") || lower.includes("trolley") || lower.includes("weight") || lower.includes("ಲಗೇಜ್") || lower.includes("सामान")) {
        return `You can carry 1 main trolley bag (up to 20kg) plus 1 handbag/backpack per seat on our luxury Volvo sleeper buses.`;
    }

    // PICKUP POINTS INTENT
    if (lower.includes("pick") || lower.includes("board") || lower.includes("point") || lower.includes("location")) {
        return `Our Volvo sleeper buses depart from major Bengaluru hubs: Majestic (09:30 PM), Indiranagar 100ft Road (10:00 PM), Silk Board (10:30 PM), and Electronic City Toll Gate (10:45 PM).`;
    }

    // DATES & BATCHES INTENT
    if (lower.includes("date") || lower.includes("when") || lower.includes("schedule") || lower.includes("batch")) {
        return `Our upcoming batches for ${pkgName} depart every Friday evening! Next departures are on August 22 and August 29. Sleeper berths fill up fast!`;
    }

    // STRICT DOMAIN BOUNDARY FALLBACK
    return `I specialize exclusively in Mantra Miles travel packages across South India, Goa, and custom international getaways! Let me know if you need help with your ${pkgName} booking, pick-up points, or visa rules.`;
}

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
    const basePrice = activePackageContext?.price || 7499;
    const totalFare = basePrice * (onboardingState.passengerCount || 1);
    triggerN8nWebhook({
        event: "whatsapp_booking_confirmed",
        guest_name: onboardingState.name || 'Valued Guest',
        phone: onboardingState.phone || '+91 9686078395',
        package: activePackageContext?.name || 'Goa Luxury Beach Escape',
        travellers: onboardingState.passengers || '2 Travellers (Couple)',
        meal_pref: onboardingState.food || 'Pure Veg 🟢',
        pickup_hub: onboardingState.pickup || 'Indiranagar 100ft Road (10:00 PM)',
        total_fare: `₹${totalFare.toLocaleString('en-IN')}`,
        timestamp: new Date().toISOString()
    });
}

// ----------------------------------------------------
// 7. DIRECT WHATSAPP PAYLOAD GENERATOR (+919686078395)
// ----------------------------------------------------
function redirectToWhatsAppPayment(customData = null) {
    const phoneTarget = "919686078395";
    const name = customData?.name || onboardingState.name || 'Valued Guest';
    const phone = customData?.phone || onboardingState.phone || '+91 9686078395';
    const lang = onboardingState.lang === 'kn' ? 'ಕನ್ನಡ (Kannada)' : (onboardingState.lang === 'hi' ? 'हिंदी (Hindi)' : 'English');
    const pkg = customData?.package || activePackageContext?.name || 'Goa Luxury Beach Escape';
    const travellers = customData?.passengers || onboardingState.passengers || '2 Travellers (Couple)';
    const food = customData?.food || onboardingState.food || 'Pure Veg 🟢';
    const pickup = customData?.pickup || onboardingState.pickup || 'Indiranagar 100ft Road (10:00 PM)';
    const basePrice = activePackageContext?.price || 7499;
    const totalFare = basePrice * (onboardingState.passengerCount || 1);

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
