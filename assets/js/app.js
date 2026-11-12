/**
 * Wanderly Travel Booking Homepage - Interactive Frontend Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS animations
  if (typeof AOS !== "undefined") {
    AOS.init({
      once: true,
      offset: 60,
      duration: 650,
      easing: "ease-out-cubic"
    });
  }

  // =========================================================================
  // Application State (Hydrated with LocalStorage where applicable)
  // =========================================================================
  const STORAGE_KEYS = {
    WISHLIST: "wanderly_wishlist_v1",
    PROMO: "wanderly_active_promo_v1",
    NEWSLETTER: "wanderly_newsletter_email_v1",
    SEARCH_PREFS: "wanderly_search_prefs_v1"
  };

  const state = {
    searchQuery: "",
    selectedRegion: "All",
    selectedDestinationFilter: "all",
    maxPrice: 650,
    minRating: 0,
    sortBy: "recommended",
    checkIn: "",
    checkOut: "",
    nights: 3,
    guests: {
      adults: 2,
      children: 0,
      rooms: 1
    },
    wishlist: loadFromStorage(STORAGE_KEYS.WISHLIST, []),
    activePromo: loadFromStorage(STORAGE_KEYS.PROMO, null),
    testimonialIndex: 0
  };

  // =========================================================================
  // DOM Element References
  // =========================================================================
  const el = {
    header: document.getElementById("siteHeader"),
    mobileMenuBtn: document.getElementById("mobileMenuBtn"),
    mainNav: document.getElementById("mainNav"),

    // Search & Dates
    heroSearchForm: document.getElementById("heroSearchForm"),
    destinationInput: document.getElementById("destinationInput"),
    clearDestinationBtn: document.getElementById("clearDestinationBtn"),
    destinationSuggestions: document.getElementById("destinationSuggestions"),
    checkInDate: document.getElementById("checkInDate"),
    checkOutDate: document.getElementById("checkOutDate"),
    dateErrorMsg: document.getElementById("dateErrorMsg"),
    staySummaryDisplay: document.getElementById("staySummaryDisplay"),

    // Guests & Rooms
    guestSelectorContainer: document.getElementById("guestSelectorContainer"),
    guestTriggerBtn: document.getElementById("guestTriggerBtn"),
    guestPopover: document.getElementById("guestPopover"),
    guestSummaryText: document.getElementById("guestSummaryText"),
    adultsCount: document.getElementById("adultsCount"),
    childrenCount: document.getElementById("childrenCount"),
    roomsCount: document.getElementById("roomsCount"),
    applyGuestsBtn: document.getElementById("applyGuestsBtn"),

    // Destinations
    regionFilterPills: document.getElementById("regionFilterPills"),
    destinationsGrid: document.getElementById("destinationsGrid"),

    // Hotels & Filters
    activeNightsLabel: document.getElementById("activeNightsLabel"),
    activeRoomsLabel: document.getElementById("activeRoomsLabel"),
    hotelDestinationFilter: document.getElementById("hotelDestinationFilter"),
    maxPriceRange: document.getElementById("maxPriceRange"),
    maxPriceValue: document.getElementById("maxPriceValue"),
    minRatingFilter: document.getElementById("minRatingFilter"),
    sortHotelsSelect: document.getElementById("sortHotelsSelect"),
    resetAllFiltersBtn: document.getElementById("resetAllFiltersBtn"),
    hotelResultsCount: document.getElementById("hotelResultsCount"),
    activePromoIndicator: document.getElementById("activePromoIndicator"),
    hotelsGrid: document.getElementById("hotelsGrid"),

    // Offers
    offersGrid: document.getElementById("offersGrid"),

    // Testimonials
    testimonialTrack: document.getElementById("testimonialTrack"),
    testimonialDots: document.getElementById("testimonialDots"),
    prevTestimonialBtn: document.getElementById("prevTestimonialBtn"),
    nextTestimonialBtn: document.getElementById("nextTestimonialBtn"),

    // Newsletter
    newsletterForm: document.getElementById("newsletterForm"),
    newsletterEmail: document.getElementById("newsletterEmail"),
    newsletterFeedback: document.getElementById("newsletterFeedback"),

    // Wishlist Drawer
    openWishlistBtn: document.getElementById("openWishlistBtn"),
    closeWishlistBtn: document.getElementById("closeWishlistBtn"),
    closeDrawerExploreBtn: document.getElementById("closeDrawerExploreBtn"),
    clearWishlistBtn: document.getElementById("clearWishlistBtn"),
    wishlistBackdrop: document.getElementById("wishlistBackdrop"),
    wishlistDrawer: document.getElementById("wishlistDrawer"),
    wishlistCount: document.getElementById("wishlistCount"),
    drawerWishlistCount: document.getElementById("drawerWishlistCount"),
    wishlistItemsContainer: document.getElementById("wishlistItemsContainer"),

    // Booking Price Estimator Modal
    bookingModalBackdrop: document.getElementById("bookingModalBackdrop"),
    closeBookingModalBtn: document.getElementById("closeBookingModalBtn"),
    bookingModalContent: document.getElementById("bookingModalContent"),

    // Toast
    toastNotification: document.getElementById("toastNotification")
  };

  // =========================================================================
  // LocalStorage Helpers
  // =========================================================================
  function loadFromStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  }

  function saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn("LocalStorage unavailable:", err);
    }
  }

  function showToast() {
    // All notifications disabled
  }

  // =========================================================================
  // Date Initialization & Check-in / Check-out Validation
  // =========================================================================
  function formatDateISO(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function initDates() {
    const today = new Date();
    const defaultCheckIn = new Date(today);
    defaultCheckIn.setDate(today.getDate() + 7);

    const defaultCheckOut = new Date(defaultCheckIn);
    defaultCheckOut.setDate(defaultCheckIn.getDate() + 3);

    const minTodayISO = formatDateISO(today);
    el.checkInDate.min = minTodayISO;
    el.checkOutDate.min = formatDateISO(new Date(today.getTime() + 86400000));

    const savedPrefs = loadFromStorage(STORAGE_KEYS.SEARCH_PREFS, null);
    if (savedPrefs && savedPrefs.checkIn >= minTodayISO && savedPrefs.checkOut > savedPrefs.checkIn) {
      state.checkIn = savedPrefs.checkIn;
      state.checkOut = savedPrefs.checkOut;
      state.guests = savedPrefs.guests || state.guests;
    } else {
      state.checkIn = formatDateISO(defaultCheckIn);
      state.checkOut = formatDateISO(defaultCheckOut);
    }

    el.checkInDate.value = state.checkIn;
    el.checkOutDate.value = state.checkOut;
    validateAndCalculateDates(false);
  }

  function validateAndCalculateDates(showError = true) {
    const inVal = el.checkInDate.value;
    const outVal = el.checkOutDate.value;
    const todayISO = formatDateISO(new Date());

    el.dateErrorMsg.textContent = "";

    if (!inVal || !outVal) {
      if (showError) el.dateErrorMsg.textContent = "Please select both check-in and check-out dates.";
      return false;
    }

    if (inVal < todayISO) {
      el.dateErrorMsg.textContent = "Check-in date cannot be in the past.";
      return false;
    }

    // Ensure checkout min is at least 1 day after checkin
    const inDate = new Date(inVal + "T00:00:00");
    const nextDay = new Date(inDate);
    nextDay.setDate(inDate.getDate() + 1);
    el.checkOutDate.min = formatDateISO(nextDay);

    if (outVal <= inVal) {
      if (showError) {
        el.dateErrorMsg.textContent = "Check-out date must be at least 1 night after check-in.";
      }
      // Auto-adjust checkout to +1 night so calculations remain valid
      const correctedOut = formatDateISO(nextDay);
      el.checkOutDate.value = correctedOut;
      state.checkIn = inVal;
      state.checkOut = correctedOut;
      state.nights = 1;
      updateStayLabels();
      return false;
    }

    const outDate = new Date(outVal + "T00:00:00");
    const diffMs = outDate - inDate;
    const nights = Math.round(diffMs / (1000 * 60 * 60 * 24));

    state.checkIn = inVal;
    state.checkOut = outVal;
    state.nights = Math.max(1, nights);

    saveToStorage(STORAGE_KEYS.SEARCH_PREFS, {
      checkIn: state.checkIn,
      checkOut: state.checkOut,
      guests: state.guests
    });

    updateStayLabels();
    return true;
  }

  function updateStayLabels() {
    const totalGuests = state.guests.adults + state.guests.children;
    const nightLabel = `${state.nights} ${state.nights === 1 ? "Night" : "Nights"}`;
    const roomLabel = `${state.guests.rooms} ${state.guests.rooms === 1 ? "Room" : "Rooms"}`;
    const guestLabel = `${totalGuests} ${totalGuests === 1 ? "Guest" : "Guests"}`;

    el.staySummaryDisplay.textContent = `${nightLabel} · ${roomLabel} · ${guestLabel}`;
    el.activeNightsLabel.textContent = nightLabel.toLowerCase();
    el.activeRoomsLabel.textContent = roomLabel.toLowerCase();

    el.guestSummaryText.textContent = `${state.guests.adults} Adult${state.guests.adults > 1 ? "s" : ""}, ${state.guests.children} Child${state.guests.children === 1 ? "" : "ren"} · ${roomLabel}`;
    el.adultsCount.textContent = state.guests.adults;
    el.childrenCount.textContent = state.guests.children;
    el.roomsCount.textContent = state.guests.rooms;

    // Update counter button disabled states
    document.querySelector('[data-type="adults"][data-action="decrease"]').disabled = state.guests.adults <= 1;
    document.querySelector('[data-type="children"][data-action="decrease"]').disabled = state.guests.children <= 0;
    document.querySelector('[data-type="rooms"][data-action="decrease"]').disabled = state.guests.rooms <= 1;
    document.querySelector('[data-type="rooms"][data-action="increase"]').disabled = state.guests.rooms >= 8;
  }

  // =========================================================================
  // Dynamic Price Estimation Helper
  // =========================================================================
  function calculateStayEstimate(pricePerNight) {
    const rooms = state.guests.rooms;
    const nights = state.nights;
    const extraGuestCount = Math.max(0, state.guests.adults - rooms * 2);
    const extraGuestFee = extraGuestCount * 35 * nights;
    const baseSubtotal = pricePerNight * nights * rooms;
    const subtotal = baseSubtotal + extraGuestFee;

    let discountAmount = 0;
    if (state.activePromo && state.activePromo.discountPercent) {
      discountAmount = Math.round(subtotal * (state.activePromo.discountPercent / 100));
    }

    const taxesAndFees = Math.round((subtotal - discountAmount) * 0.12);
    const grandTotal = subtotal - discountAmount + taxesAndFees;

    return {
      pricePerNight,
      nights,
      rooms,
      baseSubtotal,
      extraGuestFee,
      subtotal,
      discountAmount,
      taxesAndFees,
      grandTotal
    };
  }

  // =========================================================================
  // Render Destinations & Autocomplete Filtering
  // =========================================================================
  function populateDestinationDropdown() {
    TRAVEL_DATA.destinations.forEach((dest) => {
      const option = document.createElement("option");
      option.value = dest.name;
      option.textContent = `${dest.name}, ${dest.country}`;
      el.hotelDestinationFilter.appendChild(option);
    });
  }

  function renderDestinations() {
    const query = state.searchQuery.trim().toLowerCase();
    const filtered = TRAVEL_DATA.destinations.filter((dest) => {
      const matchesRegion = state.selectedRegion === "All" || dest.region === state.selectedRegion;
      const matchesQuery =
        !query ||
        dest.name.toLowerCase().includes(query) ||
        dest.country.toLowerCase().includes(query) ||
        dest.region.toLowerCase().includes(query);
      return matchesRegion && matchesQuery;
    });

    if (filtered.length === 0) {
      el.destinationsGrid.innerHTML = `
        <div class="empty-state">
          <h3>No matching destinations found</h3>
          <p>Try clearing your search filter or selecting "All Regions".</p>
        </div>
      `;
      return;
    }

    el.destinationsGrid.innerHTML = filtered
      .map(
        (dest, idx) => `
        <article class="destination-card" data-destination="${dest.name}" data-aos="fade-up" data-aos-delay="${(idx % 3) * 80}">
          <img src="${dest.image}" alt="${dest.name}, ${dest.country}" loading="lazy" />
          <div class="destination-overlay">
            <span class="destination-badge">${dest.region} · ${dest.propertiesCount} Stays</span>
            <div class="destination-info">
              <h3>${dest.name}, ${dest.country}</h3>
              <div class="destination-meta">
                <span>${dest.tagline}</span>
                <strong>From $${dest.startingPrice}/nt</strong>
              </div>
            </div>
          </div>
        </article>
      `
      )
      .join("");
  }

  function renderDestinationSuggestions(queryText) {
    const q = queryText.trim().toLowerCase();
    const matches = TRAVEL_DATA.destinations.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q)
    );

    if (matches.length === 0) {
      el.destinationSuggestions.classList.remove("open");
      return;
    }

    el.destinationSuggestions.innerHTML = matches
      .map(
        (d) => `
        <div class="suggestion-item" role="option" data-pick-dest="${d.name}">
          <div>
            <strong>${d.name}</strong>, <small>${d.country}</small>
          </div>
          <small>${d.propertiesCount} properties</small>
        </div>
      `
      )
      .join("");

    el.destinationSuggestions.classList.add("open");
  }

  // =========================================================================
  // Render Featured Hotels (With Price, Rating, Sort & Wishlist)
  // =========================================================================
  function renderHotels() {
    const query = state.searchQuery.trim().toLowerCase();

    let filtered = TRAVEL_DATA.hotels.filter((hotel) => {
      const matchesDropdown =
        state.selectedDestinationFilter === "all" ||
        hotel.destination.toLowerCase() === state.selectedDestinationFilter.toLowerCase();

      const matchesSearch =
        !query ||
        hotel.destination.toLowerCase().includes(query) ||
        hotel.country.toLowerCase().includes(query) ||
        hotel.name.toLowerCase().includes(query);

      const matchesPrice = hotel.pricePerNight <= state.maxPrice;
      const matchesRating = hotel.rating >= state.minRating;

      return matchesDropdown && matchesSearch && matchesPrice && matchesRating;
    });

    // Sorting
    if (state.sortBy === "price-asc") {
      filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (state.sortBy === "price-desc") {
      filtered.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (state.sortBy === "rating-desc") {
      filtered.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
    }

    el.hotelResultsCount.textContent = `Showing ${filtered.length} ${filtered.length === 1 ? "property" : "properties"}`;

    if (state.activePromo) {
      el.activePromoIndicator.innerHTML = `<i class="fa-solid fa-circle-check"></i> Promo <strong>${state.activePromo.code}</strong> (-${state.activePromo.discountPercent}%) applied to estimates`;
    } else {
      el.activePromoIndicator.textContent = "";
    }

    if (filtered.length === 0) {
      el.hotelsGrid.innerHTML = `
        <div class="empty-state">
          <h3>No hotels match your current filters</h3>
          <p>Try increasing your maximum nightly budget or resetting destination filters.</p>
        </div>
      `;
      return;
    }

    el.hotelsGrid.innerHTML = filtered
      .map((hotel) => {
        const isSaved = state.wishlist.includes(hotel.id);
        const est = calculateStayEstimate(hotel.pricePerNight);
        return `
          <article class="hotel-card">
            <div class="hotel-image-wrap">
              <img src="${hotel.image}" alt="${hotel.name}" loading="lazy" />
              <span class="hotel-tag">${hotel.tag}</span>
              <button
                type="button"
                class="wishlist-btn ${isSaved ? "active" : ""}"
                data-wishlist-id="${hotel.id}"
                aria-label="${isSaved ? "Remove from wishlist" : "Save to wishlist"}"
                title="${isSaved ? "Saved in Wishlist" : "Save to Wishlist"}"
              >
                <i class="${isSaved ? "fa-solid" : "fa-regular"} fa-heart"></i>
              </button>
            </div>

            <div class="hotel-body">
              <div class="hotel-top-row">
                <span class="hotel-location"><i class="fa-solid fa-location-dot"></i> ${hotel.destination}, ${hotel.country}</span>
                <span class="hotel-rating"><i class="fa-solid fa-star"></i> ${hotel.rating.toFixed(1)} (${hotel.reviewsCount})</span>
              </div>

              <h3 class="hotel-title">${hotel.name}</h3>

              <div class="hotel-amenities">
                ${hotel.amenities.map((item) => `<span class="amenity-chip">${item}</span>`).join("")}
              </div>

              <div class="hotel-footer">
                <div class="price-block">
                  <div class="nightly-rate">$${hotel.pricePerNight} <span>/ night</span></div>
                  <span class="total-estimate">Est. $${est.grandTotal.toLocaleString()} total (${est.nights}n, ${est.rooms}r)</span>
                </div>
                <a href="404.html" class="btn btn-primary btn-sm" data-estimate-hotel="${hotel.id}">
                  Estimate &amp; Book
                </a>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  // =========================================================================
  // Render Special Offers & Coupon Code Copying
  // =========================================================================
  function renderOffers() {
    el.offersGrid.innerHTML = TRAVEL_DATA.offers
      .map(
        (offer, idx) => `
        <article class="offer-card" data-aos="fade-up" data-aos-delay="${idx * 90}">
          <div>
            <span class="offer-discount-badge">${offer.badge}</span>
            <h3>${offer.title}</h3>
            <p>${offer.description}</p>
          </div>
          <div>
            <div class="offer-validity"><i class="fa-regular fa-clock"></i> ${offer.validUntil}</div>
            <div class="coupon-box">
              <span class="coupon-code">${offer.code}</span>
              <div class="coupon-actions">
                <a href="404.html" class="btn btn-outline btn-sm" data-copy-code="${offer.code}">
                  <i class="fa-regular fa-copy"></i> Copy
                </a>
                <a href="404.html" class="btn btn-primary btn-sm" data-apply-code="${offer.code}">
                  Apply
                </a>
              </div>
            </div>
          </div>
        </article>
      `
      )
      .join("");
  }

  function applyPromoCode(code) {
    const cleanCode = code.trim().toUpperCase();
    const found = TRAVEL_DATA.offers.find((o) => o.code === cleanCode);
    if (!found) {
      return false;
    }
    state.activePromo = found;
    saveToStorage(STORAGE_KEYS.PROMO, found);
    renderHotels();
    return true;
  }

  // =========================================================================
  // Render Testimonials Slider & Moving Animation
  // =========================================================================
  let testimonialAutoPlayTimer = null;
  const AUTOPLAY_INTERVAL = 3500; // 3.5s moving interval

  function getSlidesPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function startTestimonialsAutoPlay() {
    stopTestimonialsAutoPlay();
    testimonialAutoPlayTimer = setInterval(() => {
      const perView = getSlidesPerView();
      const maxIndex = Math.max(0, TRAVEL_DATA.testimonials.length - perView);
      state.testimonialIndex = state.testimonialIndex >= maxIndex ? 0 : state.testimonialIndex + 1;
      updateTestimonialSlider();
    }, AUTOPLAY_INTERVAL);
  }

  function stopTestimonialsAutoPlay() {
    if (testimonialAutoPlayTimer) {
      clearInterval(testimonialAutoPlayTimer);
      testimonialAutoPlayTimer = null;
    }
  }

  function resetTestimonialsAutoPlay() {
    stopTestimonialsAutoPlay();
    startTestimonialsAutoPlay();
  }

  function renderTestimonials() {
    el.testimonialTrack.innerHTML = TRAVEL_DATA.testimonials
      .map(
        (item) => `
        <div class="testimonial-slide">
          <article class="testimonial-card">
            <div>
              <div class="testimonial-stars" aria-label="${item.rating} out of 5 stars">
                ${'<i class="fa-solid fa-star"></i>'.repeat(item.rating)}
              </div>
              <p class="testimonial-quote">"${item.quote}"</p>
            </div>
            <div class="testimonial-author">
              <img src="${item.avatar}" alt="${item.name}" class="author-avatar" loading="lazy" />
              <div>
                <strong>${item.name}</strong>
                <span>${item.trip}</span>
              </div>
            </div>
          </article>
        </div>
      `
      )
      .join("");

    updateTestimonialSlider();
    startTestimonialsAutoPlay();
  }

  function updateTestimonialSlider() {
    const perView = getSlidesPerView();
    const maxIndex = Math.max(0, TRAVEL_DATA.testimonials.length - perView);
    if (state.testimonialIndex > maxIndex) state.testimonialIndex = 0;
    if (state.testimonialIndex < 0) state.testimonialIndex = maxIndex;

    const shiftPercent = (100 / perView) * state.testimonialIndex;
    el.testimonialTrack.style.transform = `translateX(-${shiftPercent}%)`;

    // Render dots
    const dotCount = maxIndex + 1;
    el.testimonialDots.innerHTML = Array.from({ length: dotCount })
      .map(
        (_, i) => `
        <button
          type="button"
          class="dot-btn ${i === state.testimonialIndex ? "active" : ""}"
          data-slide-dot="${i}"
          aria-label="Go to review slide ${i + 1}"
        ></button>
      `
      )
      .join("");
  }

  // =========================================================================
  // Wishlist Management (LocalStorage)
  // =========================================================================
  function toggleWishlist(hotelId) {
    const index = state.wishlist.indexOf(hotelId);
    const hotel = TRAVEL_DATA.hotels.find((h) => h.id === hotelId);
    if (index === -1) {
      state.wishlist.push(hotelId);
    } else {
      state.wishlist.splice(index, 1);
    }
    saveToStorage(STORAGE_KEYS.WISHLIST, state.wishlist);
    updateWishlistUI();
    renderHotels();
  }

  function updateWishlistUI() {
    const count = state.wishlist.length;
    el.wishlistCount.textContent = count;
    el.drawerWishlistCount.textContent = count;

    if (count === 0) {
      el.wishlistItemsContainer.innerHTML = `
        <div class="empty-state">
          <p>Your wishlist is empty.</p>
          <small>Tap the heart icon on any hotel to save it for later.</small>
        </div>
      `;
      return;
    }

    el.wishlistItemsContainer.innerHTML = state.wishlist
      .map((id) => {
        const hotel = TRAVEL_DATA.hotels.find((h) => h.id === id);
        if (!hotel) return "";
        return `
          <div class="wishlist-item">
            <img src="${hotel.image}" alt="${hotel.name}" />
            <div class="wishlist-item-info">
              <h4>${hotel.name}</h4>
              <p>${hotel.destination}, ${hotel.country}</p>
              <strong>$${hotel.pricePerNight} / night</strong>
            </div>
            <button type="button" class="icon-close-btn" data-wishlist-id="${hotel.id}" aria-label="Remove saved hotel">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        `;
      })
      .join("");
  }

  function openWishlistDrawer() {
    el.wishlistDrawer.classList.add("open");
    el.wishlistBackdrop.classList.add("open");
    el.wishlistDrawer.setAttribute("aria-hidden", "false");
  }

  function closeWishlistDrawer() {
    el.wishlistDrawer.classList.remove("open");
    el.wishlistBackdrop.classList.remove("open");
    el.wishlistDrawer.setAttribute("aria-hidden", "true");
  }

  // =========================================================================
  // Dynamic Booking Price Estimator Modal
  // =========================================================================
  function openBookingModal(hotelId) {
    const hotel = TRAVEL_DATA.hotels.find((h) => h.id === hotelId);
    if (!hotel) return;

    const est = calculateStayEstimate(hotel.pricePerNight);
    const activeCode = state.activePromo ? state.activePromo.code : "";

    el.bookingModalContent.innerHTML = `
      <span class="section-tag">Instant Stay Estimate</span>
      <h2 id="bookingModalTitle" style="font-family: 'Playfair Display', serif; margin-bottom: 0.25rem;">${hotel.name}</h2>
      <p style="color: var(--text-secondary); font-size: 0.9rem;">
        <i class="fa-solid fa-location-dot" style="color: var(--primary);"></i> ${hotel.destination}, ${hotel.country} ·
        <strong>${state.checkIn}</strong> to <strong>${state.checkOut}</strong> (${est.nights} night${est.nights > 1 ? "s" : ""})
      </p>

      <div class="estimator-breakdown">
        <div class="breakdown-row">
          <span>$${est.pricePerNight} &times; ${est.nights} night${est.nights > 1 ? "s" : ""} &times; ${est.rooms} room${est.rooms > 1 ? "s" : ""}</span>
          <span>$${est.baseSubtotal.toLocaleString()}</span>
        </div>
        ${
          est.extraGuestFee > 0
            ? `<div class="breakdown-row">
                <span>Extra adult occupancy fee</span>
                <span>$${est.extraGuestFee.toLocaleString()}</span>
              </div>`
            : ""
        }
        ${
          est.discountAmount > 0
            ? `<div class="breakdown-row discount">
                <span>Promo Discount (${state.activePromo.code} - ${state.activePromo.discountPercent}%)</span>
                <span>-$${est.discountAmount.toLocaleString()}</span>
              </div>`
            : ""
        }
        <div class="breakdown-row">
          <span>Taxes &amp; local resort fees (12%)</span>
          <span>$${est.taxesAndFees.toLocaleString()}</span>
        </div>
        <div class="breakdown-row total">
          <span>Estimated Total</span>
          <span>$${est.grandTotal.toLocaleString()}</span>
        </div>
      </div>

      <div class="promo-apply-row">
        <input type="text" id="modalPromoInput" placeholder="Promo code (e.g. AUTUMN20)" value="${activeCode}" />
        <button type="button" class="btn btn-outline btn-sm" id="modalApplyPromoBtn" data-hotel-id="${hotel.id}">Apply Code</button>
      </div>

      <div style="margin-top: 1.25rem; display: flex; justify-content: flex-end; gap: 0.75rem;">
        <button type="button" class="btn btn-outline" id="cancelModalBtn">Close</button>
        <a href="404.html" class="btn btn-primary" id="confirmDemoBookingBtn">
          Reserve Stay
        </a>
      </div>
    `;

    el.bookingModalBackdrop.classList.add("open");
  }

  function closeBookingModal() {
    el.bookingModalBackdrop.classList.remove("open");
  }

  // =========================================================================
  // Event Listeners
  // =========================================================================
  // Sticky header shadow
  window.addEventListener("scroll", () => {
    el.header.classList.toggle("scrolled", window.scrollY > 20);
  });

  // Mobile navigation toggle
  el.mobileMenuBtn.addEventListener("click", () => {
    const isOpen = el.mainNav.classList.toggle("open");
    el.mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
  });

  // Close mobile nav when clicking a link
  el.mainNav.addEventListener("click", (e) => {
    if (e.target.classList.contains("nav-link")) {
      el.mainNav.classList.remove("open");
      el.mobileMenuBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Destination search input & autocomplete
  el.destinationInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    el.clearDestinationBtn.classList.toggle("visible", state.searchQuery.length > 0);
    renderDestinationSuggestions(state.searchQuery);
    renderDestinations();
    renderHotels();
  });

  el.destinationInput.addEventListener("focus", () => {
    renderDestinationSuggestions(el.destinationInput.value);
  });

  el.clearDestinationBtn.addEventListener("click", () => {
    state.searchQuery = "";
    state.selectedDestinationFilter = "all";
    el.destinationInput.value = "";
    el.hotelDestinationFilter.value = "all";
    el.clearDestinationBtn.classList.remove("visible");
    el.destinationSuggestions.classList.remove("open");
    renderDestinations();
    renderHotels();
  });

  el.destinationSuggestions.addEventListener("click", (e) => {
    const item = e.target.closest("[data-pick-dest]");
    if (!item) return;
    const picked = item.getAttribute("data-pick-dest");
    state.searchQuery = picked;
    state.selectedDestinationFilter = picked;
    el.destinationInput.value = picked;
    el.hotelDestinationFilter.value = picked;
    el.clearDestinationBtn.classList.add("visible");
    el.destinationSuggestions.classList.remove("open");
    renderDestinations();
    renderHotels();
  });

  // Close popovers when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-destination")) {
      el.destinationSuggestions.classList.remove("open");
    }
    if (!e.target.closest("#guestSelectorContainer")) {
      el.guestPopover.classList.remove("open");
      el.guestTriggerBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Date change validation
  el.checkInDate.addEventListener("change", () => {
    validateAndCalculateDates(true);
    renderHotels();
  });

  el.checkOutDate.addEventListener("change", () => {
    validateAndCalculateDates(true);
    renderHotels();
  });

  // Guest & Room Popover
  el.guestTriggerBtn.addEventListener("click", () => {
    const isOpen = el.guestPopover.classList.toggle("open");
    el.guestTriggerBtn.setAttribute("aria-expanded", String(isOpen));
  });

  el.applyGuestsBtn.addEventListener("click", () => {
    el.guestPopover.classList.remove("open");
    el.guestTriggerBtn.setAttribute("aria-expanded", "false");
  });

  el.guestPopover.addEventListener("click", (e) => {
    const btn = e.target.closest(".counter-btn");
    if (!btn) return;
    const type = btn.dataset.type;
    const action = btn.dataset.action;

    if (type === "adults") {
      if (action === "increase" && state.guests.adults < 16) state.guests.adults++;
      if (action === "decrease" && state.guests.adults > 1) state.guests.adults--;
    } else if (type === "children") {
      if (action === "increase" && state.guests.children < 10) state.guests.children++;
      if (action === "decrease" && state.guests.children > 0) state.guests.children--;
    } else if (type === "rooms") {
      if (action === "increase" && state.guests.rooms < 8) state.guests.rooms++;
      if (action === "decrease" && state.guests.rooms > 1) state.guests.rooms--;
    }

    updateStayLabels();
    saveToStorage(STORAGE_KEYS.SEARCH_PREFS, {
      checkIn: state.checkIn,
      checkOut: state.checkOut,
      guests: state.guests
    });
    renderHotels();
  });

  // Hero Search Form Submit
  el.heroSearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const isValid = validateAndCalculateDates(true);
    if (!isValid) return;

    renderDestinations();
    renderHotels();
    document.getElementById("hotels").scrollIntoView({ behavior: "smooth" });
  });

  // Region Pills Filter
  el.regionFilterPills.addEventListener("click", (e) => {
    const btn = e.target.closest(".pill-btn");
    if (!btn) return;
    document.querySelectorAll(".pill-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.selectedRegion = btn.dataset.region;
    renderDestinations();
  });

  // Clicking a destination card filters hotels and scrolls down
  el.destinationsGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".destination-card");
    if (!card) return;
    const destName = card.dataset.destination;
    state.selectedDestinationFilter = destName;
    state.searchQuery = "";
    el.destinationInput.value = destName;
    el.hotelDestinationFilter.value = destName;
    el.clearDestinationBtn.classList.add("visible");
    renderHotels();
    document.getElementById("hotels").scrollIntoView({ behavior: "smooth" });
  });

  // Hotel Filter & Sort Controls
  el.hotelDestinationFilter.addEventListener("change", (e) => {
    state.selectedDestinationFilter = e.target.value;
    state.searchQuery = "";
    el.destinationInput.value = e.target.value === "all" ? "" : e.target.value;
    el.clearDestinationBtn.classList.toggle("visible", e.target.value !== "all");
    renderHotels();
  });

  el.maxPriceRange.addEventListener("input", (e) => {
    state.maxPrice = Number(e.target.value);
    el.maxPriceValue.textContent = `$${state.maxPrice}`;
    renderHotels();
  });

  el.minRatingFilter.addEventListener("change", (e) => {
    state.minRating = Number(e.target.value);
    renderHotels();
  });

  el.sortHotelsSelect.addEventListener("change", (e) => {
    state.sortBy = e.target.value;
    renderHotels();
  });

  el.resetAllFiltersBtn.addEventListener("click", () => {
    state.searchQuery = "";
    state.selectedRegion = "All";
    state.selectedDestinationFilter = "all";
    state.maxPrice = 650;
    state.minRating = 0;
    state.sortBy = "recommended";

    el.destinationInput.value = "";
    el.clearDestinationBtn.classList.remove("visible");
    el.hotelDestinationFilter.value = "all";
    el.maxPriceRange.value = 650;
    el.maxPriceValue.textContent = "$650";
    el.minRatingFilter.value = "0";
    el.sortHotelsSelect.value = "recommended";

    document.querySelectorAll(".pill-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.region === "All");
    });

    renderDestinations();
    renderHotels();
  });

  // Hotel Grid Delegation (Wishlist & Estimate Modal)
  el.hotelsGrid.addEventListener("click", (e) => {
    const wishBtn = e.target.closest("[data-wishlist-id]");
    if (wishBtn) {
      toggleWishlist(wishBtn.dataset.wishlistId);
      return;
    }

    const estBtn = e.target.closest("[data-estimate-hotel]");
    if (estBtn) {
      e.preventDefault();
      sessionStorage.setItem("wanderly_last_section", "hotels");
      window.location.href = "404.html?from=hotels";
      return;
    }
  });

  // Offers Grid Delegation (Copy Coupon & Apply Coupon -> 404)
  el.offersGrid.addEventListener("click", (e) => {
    const copyBtn = e.target.closest("[data-copy-code]");
    if (copyBtn) {
      e.preventDefault();
      sessionStorage.setItem("wanderly_last_section", "offers");
      window.location.href = "404.html?from=offers";
      return;
    }

    const applyBtn = e.target.closest("[data-apply-code]");
    if (applyBtn) {
      e.preventDefault();
      sessionStorage.setItem("wanderly_last_section", "offers");
      window.location.href = "404.html?from=offers";
      return;
    }
  });

  // Testimonials Slider Controls & Moving Animation Listeners
  el.prevTestimonialBtn.addEventListener("click", () => {
    state.testimonialIndex--;
    updateTestimonialSlider();
    resetTestimonialsAutoPlay();
  });

  el.nextTestimonialBtn.addEventListener("click", () => {
    state.testimonialIndex++;
    updateTestimonialSlider();
    resetTestimonialsAutoPlay();
  });

  el.testimonialDots.addEventListener("click", (e) => {
    const dot = e.target.closest("[data-slide-dot]");
    if (!dot) return;
    state.testimonialIndex = Number(dot.dataset.slideDot);
    updateTestimonialSlider();
    resetTestimonialsAutoPlay();
  });

  // Pause moving animation on hover/focus, resume when cursor leaves
  const testimonialViewport = document.querySelector(".testimonial-slider-viewport");
  if (testimonialViewport) {
    testimonialViewport.addEventListener("mouseenter", stopTestimonialsAutoPlay);
    testimonialViewport.addEventListener("mouseleave", startTestimonialsAutoPlay);

    // Touch swipe support on mobile devices
    let touchStartX = 0;
    testimonialViewport.addEventListener("touchstart", (e) => {
      stopTestimonialsAutoPlay();
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    testimonialViewport.addEventListener("touchend", (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchStartX - touchEndX;
      if (Math.abs(swipeDistance) > 40) {
        if (swipeDistance > 0) {
          state.testimonialIndex++;
        } else {
          state.testimonialIndex--;
        }
        updateTestimonialSlider();
      }
      startTestimonialsAutoPlay();
    }, { passive: true });
  }

  // Also pause while interacting with prev/next buttons or dots
  const testimonialControls = document.querySelector(".slider-controls");
  if (testimonialControls) {
    testimonialControls.addEventListener("mouseenter", stopTestimonialsAutoPlay);
    testimonialControls.addEventListener("mouseleave", startTestimonialsAutoPlay);
  }
  if (el.testimonialDots) {
    el.testimonialDots.addEventListener("mouseenter", stopTestimonialsAutoPlay);
    el.testimonialDots.addEventListener("mouseleave", startTestimonialsAutoPlay);
  }

  // Pause moving animation when tab is hidden, resume when tab is active
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopTestimonialsAutoPlay();
    } else {
      startTestimonialsAutoPlay();
    }
  });

  window.addEventListener("resize", () => {
    updateTestimonialSlider();
    resetTestimonialsAutoPlay();
  });

  // Newsletter Form Validation
  el.newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = el.newsletterEmail.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    el.newsletterFeedback.className = "newsletter-feedback";

    if (!email) {
      el.newsletterFeedback.textContent = "Please enter your email address.";
      el.newsletterFeedback.classList.add("error");
      return;
    }

    if (!emailRegex.test(email)) {
      el.newsletterFeedback.textContent = "Please enter a valid email address (e.g., alex@domain.com).";
      el.newsletterFeedback.classList.add("error");
      return;
    }

    saveToStorage(STORAGE_KEYS.NEWSLETTER, email);
    sessionStorage.setItem("wanderly_last_section", "newsletter");
    window.location.href = "404.html?from=newsletter";
  });

  // Wishlist Drawer Events
  el.openWishlistBtn.addEventListener("click", openWishlistDrawer);
  el.closeWishlistBtn.addEventListener("click", closeWishlistDrawer);
  el.closeDrawerExploreBtn.addEventListener("click", closeWishlistDrawer);
  el.wishlistBackdrop.addEventListener("click", closeWishlistDrawer);

  el.wishlistItemsContainer.addEventListener("click", (e) => {
    const removeBtn = e.target.closest("[data-wishlist-id]");
    if (removeBtn) {
      toggleWishlist(removeBtn.dataset.wishlistId);
    }
  });

  el.clearWishlistBtn.addEventListener("click", () => {
    state.wishlist = [];
    saveToStorage(STORAGE_KEYS.WISHLIST, []);
    updateWishlistUI();
    renderHotels();
  });

  // Booking Estimator Modal Events
  el.closeBookingModalBtn.addEventListener("click", closeBookingModal);
  el.bookingModalBackdrop.addEventListener("click", (e) => {
    if (e.target === el.bookingModalBackdrop) closeBookingModal();
  });

  el.bookingModalContent.addEventListener("click", (e) => {
    if (e.target.id === "cancelModalBtn") {
      closeBookingModal();
    } else if (e.target.id === "modalApplyPromoBtn") {
      e.preventDefault();
      sessionStorage.setItem("wanderly_last_section", "hotels");
      window.location.href = "404.html?from=hotels";
    } else if (e.target.closest("#confirmDemoBookingBtn")) {
      closeBookingModal();
    }
  });

  // Global handler for any dummy buttons or links
  document.addEventListener("click", (e) => {
    const dummy = e.target.closest('.dummy-btn, [data-dummy], a[href="404.html"], a[href^="404.html"]');
    if (dummy) {
      e.preventDefault();
      const sec = dummy.closest("section[id]") || dummy.closest("footer[id]") || dummy.closest(".site-footer");
      const secId = sec ? (sec.id || (sec.classList.contains("site-footer") ? "footer" : "hero")) 
        : (sessionStorage.getItem("wanderly_last_section") || "hero");
      sessionStorage.setItem("wanderly_last_section", secId);
      window.location.href = `404.html?from=${encodeURIComponent(secId)}`;
    }
  });

  // Active View Section Tracking
  const trackableSections = Array.from(document.querySelectorAll("section[id], footer[id]"));
  function updateActiveViewSection() {
    let currentId = "hero";
    const scrollMid = window.scrollY + 180;

    for (let i = trackableSections.length - 1; i >= 0; i--) {
      const sec = trackableSections[i];
      if (sec.offsetTop <= scrollMid) {
        currentId = sec.id || "hero";
        break;
      }
    }

    sessionStorage.setItem("wanderly_last_section", currentId);
  }

  window.addEventListener("scroll", updateActiveViewSection, { passive: true });
  updateActiveViewSection();

  // Footer quick destination links
  document.querySelectorAll("[data-footer-dest]").forEach((link) => {
    link.addEventListener("click", () => {
      const dest = link.dataset.footerDest;
      state.selectedDestinationFilter = dest;
      el.hotelDestinationFilter.value = dest;
      renderHotels();
    });
  });

  // =========================================================================
  // FAQ Accordion & Category Filter
  // =========================================================================
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll(".faq-item");
    const faqPills = document.querySelectorAll(".faq-pill-btn");

    faqItems.forEach((item) => {
      const questionBtn = item.querySelector(".faq-question");
      if (!questionBtn) return;

      questionBtn.addEventListener("click", () => {
        const isOpen = item.classList.contains("active");

        // Close other items for accordion behavior
        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove("active");
            const btn = other.querySelector(".faq-question");
            if (btn) btn.setAttribute("aria-expanded", "false");
          }
        });

        // Toggle current item
        if (isOpen) {
          item.classList.remove("active");
          questionBtn.setAttribute("aria-expanded", "false");
        } else {
          item.classList.add("active");
          questionBtn.setAttribute("aria-expanded", "true");
        }
      });
    });

    // Category filter pills
    faqPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        faqPills.forEach((p) => {
          p.classList.remove("active");
          p.setAttribute("aria-selected", "false");
        });
        pill.classList.add("active");
        pill.setAttribute("aria-selected", "true");

        const selectedCategory = pill.dataset.faqCategory;

        faqItems.forEach((item) => {
          const itemCategory = item.dataset.category;
          if (selectedCategory === "all" || itemCategory === selectedCategory) {
            item.style.display = "";
          } else {
            item.style.display = "none";
            item.classList.remove("active");
            const btn = item.querySelector(".faq-question");
            if (btn) btn.setAttribute("aria-expanded", "false");
          }
        });

        // If no visible item is active, activate the first visible one
        const visibleItems = Array.from(faqItems).filter((i) => i.style.display !== "none");
        const hasActive = visibleItems.some((i) => i.classList.contains("active"));
        if (!hasActive && visibleItems.length > 0) {
          visibleItems[0].classList.add("active");
          const btn = visibleItems[0].querySelector(".faq-question");
          if (btn) btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  // =========================================================================
  // Page Preloader & GSAP Heading Text Animations
  // =========================================================================
  function initPreloader(onLoadedCallback) {
    const preloader = document.getElementById("pagePreloader");
    const progressBar = document.getElementById("preloaderProgressBar");
    if (!preloader) {
      document.body.classList.remove("preloader-active");
      if (onLoadedCallback) onLoadedCallback();
      return;
    }

    let progress = { value: 30 };
    let hasFinished = false;

    function finish() {
      if (hasFinished) return;
      function restoreTargetSection() {
        const urlParams = new URLSearchParams(window.location.search);
        const fromParam = urlParams.get("from");
        const hash = window.location.hash ? window.location.hash.substring(1) : "";
        const targetId = hash || fromParam;

        if (targetId && targetId !== "hero") {
          const targetEl = document.getElementById(targetId) 
            || (targetId === "footer" ? document.getElementById("footer") : null);
          if (targetEl) {
            setTimeout(() => {
              targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 120);
          }
        }
      }

      hasFinished = true;

      if (typeof gsap !== "undefined") {
        gsap.to(progress, {
          value: 100,
          duration: 0.45,
          ease: "power2.out",
          onUpdate: () => {
            if (progressBar) progressBar.style.width = `${progress.value}%`;
          },
          onComplete: () => {
            gsap.to(preloader, {
              opacity: 0,
              duration: 0.5,
              ease: "power2.inOut",
              onComplete: () => {
                preloader.classList.add("loaded");
                preloader.style.display = "none";
                document.body.classList.remove("preloader-active");
                if (onLoadedCallback) onLoadedCallback();
                restoreTargetSection();
              }
            });
          }
        });
      } else {
        if (progressBar) progressBar.style.width = "100%";
        setTimeout(() => {
          preloader.classList.add("loaded");
          preloader.style.display = "none";
          document.body.classList.remove("preloader-active");
          if (onLoadedCallback) onLoadedCallback();
          restoreTargetSection();
        }, 350);
      }
    }

    // Initial progress stage
    if (typeof gsap !== "undefined") {
      gsap.to(progress, {
        value: 75,
        duration: 0.5,
        ease: "power1.inOut",
        onUpdate: () => {
          if (progressBar) progressBar.style.width = `${progress.value}%`;
        }
      });
    } else if (progressBar) {
      progressBar.style.width = "75%";
    }

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish);
      setTimeout(finish, 1300);
    }
  }

  function initGsapTextAnimations() {
    if (typeof gsap === "undefined") return;

    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    // 1. Hero Section Text Animation
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTl
      .fromTo(
        ".hero-eyebrow",
        { y: -18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65 }
      )
      .fromTo(
        ".hero-title",
        { y: 38, opacity: 0, filter: "blur(6px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.95 },
        "-=0.4"
      )
      .fromTo(
        ".hero-subtitle",
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75 },
        "-=0.5"
      )
      .fromTo(
        ".search-widget",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.45"
      );

    // 2. Section Headings Animations with ScrollTrigger
    if (typeof ScrollTrigger !== "undefined") {
      document.querySelectorAll(".section-header").forEach((header) => {
        const tag = header.querySelector(".section-tag");
        const title = header.querySelector(".section-title");
        const subtitle = header.querySelector(".section-subtitle");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: header,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          defaults: { ease: "power3.out" }
        });

        if (tag) {
          tl.fromTo(
            tag,
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55 }
          );
        }

        if (title) {
          tl.fromTo(
            title,
            { y: 32, opacity: 0, filter: "blur(4px)" },
            { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8 },
            tag ? "-=0.35" : 0
          );
        }

        if (subtitle) {
          tl.fromTo(
            subtitle,
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.65 },
            "-=0.45"
          );
        }
      });

      // 3. Newsletter Section Heading Animation
      const newsletterContent = document.querySelector(".newsletter-content");
      if (newsletterContent) {
        const badge = newsletterContent.querySelector(".newsletter-badge");
        const title = newsletterContent.querySelector("h2");
        const desc = newsletterContent.querySelector("p");

        const nTl = gsap.timeline({
          scrollTrigger: {
            trigger: newsletterContent,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          defaults: { ease: "power3.out" }
        });

        if (badge) nTl.fromTo(badge, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 });
        if (title) nTl.fromTo(title, { y: 32, opacity: 0, filter: "blur(4px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8 }, "-=0.35");
        if (desc) nTl.fromTo(desc, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65 }, "-=0.45");
      }

      // 4. FAQ Items Staggered Reveal
      const faqList = document.querySelector(".faq-list");
      if (faqList) {
        gsap.fromTo(
          ".faq-item",
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            stagger: 0.07,
            ease: "power2.out",
            scrollTrigger: {
              trigger: faqList,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      }
    }
  }

  // =========================================================================
  // Initial Boot
  // =========================================================================
  populateDestinationDropdown();
  initDates();

  // Support deep-linked destination query (e.g. from 404.html search)
  const urlParams = new URLSearchParams(window.location.search);
  const initialDest = urlParams.get("dest");
  if (initialDest) {
    const cleanDest = initialDest.trim();
    const matchedDest = TRAVEL_DATA.destinations.find(
      (d) => d.name.toLowerCase() === cleanDest.toLowerCase()
    );
    if (matchedDest) {
      state.selectedDestinationFilter = matchedDest.name;
      el.hotelDestinationFilter.value = matchedDest.name;
      el.destinationInput.value = matchedDest.name;
    } else {
      state.searchQuery = cleanDest;
      el.destinationInput.value = cleanDest;
    }
    el.clearDestinationBtn.classList.add("visible");
  }

  renderDestinations();
  renderHotels();
  renderOffers();
  renderTestimonials();
  initFaqAccordion();
  updateWishlistUI();

  // Initialize Preloader & GSAP Heading Text Animations
  initPreloader(() => {
    initGsapTextAnimations();
  });

  window.addEventListener("pageshow", () => {
    const hash = window.location.hash ? window.location.hash.substring(1) : "";
    if (hash) {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  window.addEventListener("hashchange", () => {
    const hash = window.location.hash ? window.location.hash.substring(1) : "";
    if (hash) {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
