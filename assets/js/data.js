/**
 * Sample Data for Wanderly Travel Booking Homepage
 * Includes:
 * - 6 Destinations (exceeds minimum 6)
 * - 10 Featured Hotels (exceeds minimum 10)
 * - 3 Promotional Offers (exceeds minimum 3)
 * - 6 Customer Testimonials (exceeds minimum 6)
 */

const TRAVEL_DATA = {
  destinations: [
    {
      id: "dest-santorini",
      name: "Santorini",
      country: "Greece",
      region: "Europe",
      propertiesCount: 48,
      startingPrice: 240,
      tagline: "Caldera sunsets & whitewashed cliffside suites",
      image: "assets/images/dest-santorini.webp"
    },
    {
      id: "dest-kyoto",
      name: "Kyoto",
      country: "Japan",
      region: "Asia",
      propertiesCount: 64,
      startingPrice: 195,
      tagline: "Zen temple gardens, cedar ryokans & tea houses",
      image: "assets/images/dest-kyoto.webp"
    },
    {
      id: "dest-amalfi",
      name: "Amalfi Coast",
      country: "Italy",
      region: "Europe",
      propertiesCount: 52,
      startingPrice: 280,
      tagline: "Lemon groves, pastel villages & Mediterranean coves",
      image: "assets/images/dest-amalfi.webp"
    },
    {
      id: "dest-bali",
      name: "Bali",
      country: "Indonesia",
      region: "Asia",
      propertiesCount: 91,
      startingPrice: 145,
      tagline: "Emerald rice terraces, jungle infinity pools & surf",
      image: "assets/images/dest-bali.webp"
    },
    {
      id: "dest-swiss-alps",
      name: "Swiss Alps",
      country: "Switzerland",
      region: "Europe",
      propertiesCount: 37,
      startingPrice: 320,
      tagline: "Glacier peaks, alpine chalets & scenic rail routes",
      image: "assets/images/dest-swiss-alps.webp"
    },
    {
      id: "dest-tulum",
      name: "Tulum",
      country: "Mexico",
      region: "Americas",
      propertiesCount: 59,
      startingPrice: 210,
      tagline: "Eco-luxury beachfront cabanas & cenote lagoons",
      image: "assets/images/dest-tulum.webp"
    },
    {
      id: "dest-dubai",
      name: "Dubai",
      country: "United Arab Emirates",
      region: "Middle East",
      propertiesCount: 73,
      startingPrice: 260,
      tagline: "Desert dune sanctuaries & skyline rooftop pools",
      image: "assets/images/dest-dubai.webp"
    },
    {
      id: "dest-maldives",
      name: "Maldives",
      country: "Maldives",
      region: "Asia",
      propertiesCount: 82,
      startingPrice: 350,
      tagline: "Overwater villas, coral atolls & turquoise lagoons",
      image: "assets/images/dest-maldives.webp"
    },
    {
      id: "dest-paris",
      name: "Paris",
      country: "France",
      region: "Europe",
      propertiesCount: 115,
      startingPrice: 220,
      tagline: "Haussmannian boulevards, bistros & Eiffel views",
      image: "assets/images/dest-paris.webp"
    }
  ],

  hotels: [
    {
      id: "hotel-1",
      name: "Oia Caldera Cliff Suites",
      destination: "Santorini",
      country: "Greece",
      pricePerNight: 340,
      rating: 4.9,
      reviewsCount: 412,
      tag: "Caldera View",
      amenities: ["Infinity Pool", "Breakfast Included", "Sunset Terrace"],
      image: "assets/images/hotel-1.webp"
    },
    {
      id: "hotel-2",
      name: "Arashiyama Bamboo Ryokan",
      destination: "Kyoto",
      country: "Japan",
      pricePerNight: 275,
      rating: 4.9,
      reviewsCount: 328,
      tag: "Heritage Stay",
      amenities: ["Private Onsen", "Kaiseki Dining", "Zen Garden"],
      image: "assets/images/hotel-2.webp"
    },
    {
      id: "hotel-3",
      name: "Villa Ravello Belvedere",
      destination: "Amalfi Coast",
      country: "Italy",
      pricePerNight: 420,
      rating: 4.8,
      reviewsCount: 289,
      tag: "Editor's Pick",
      amenities: ["Sea View", "Private Beach Club", "Spa"],
      image: "assets/images/hotel-3.webp"
    },
    {
      id: "hotel-4",
      name: "Ubud Canopy Jungle Resort",
      destination: "Bali",
      country: "Indonesia",
      pricePerNight: 165,
      rating: 4.7,
      reviewsCount: 530,
      tag: "Best Value",
      amenities: ["Plunge Pool", "Yoga Pavilion", "Free Airport Shuttle"],
      image: "assets/images/hotel-4.webp"
    },
    {
      id: "hotel-5",
      name: "Matterhorn Glacier Lodge",
      destination: "Swiss Alps",
      country: "Switzerland",
      pricePerNight: 490,
      rating: 4.9,
      reviewsCount: 194,
      tag: "Ski-In / Ski-Out",
      amenities: ["Heated Outdoor Pool", "Sauna", "Fireplace Lounge"],
      image: "assets/images/hotel-5.webp"
    },
    {
      id: "hotel-6",
      name: "Casa Cenote Beachfront",
      destination: "Tulum",
      country: "Mexico",
      pricePerNight: 230,
      rating: 4.6,
      reviewsCount: 367,
      tag: "Eco Luxury",
      amenities: ["Private Beach", "Rooftop Bar", "Wellness Spa"],
      image: "assets/images/hotel-6.webp"
    },
    {
      id: "hotel-7",
      name: "Al Maha Desert Oasis",
      destination: "Dubai",
      country: "UAE",
      pricePerNight: 560,
      rating: 4.9,
      reviewsCount: 245,
      tag: "Ultra Luxury",
      amenities: ["Private Pool", "Desert Safari", "All-Inclusive Dining"],
      image: "assets/images/hotel-7.webp"
    },
    {
      id: "hotel-8",
      name: "Gion Lantern Boutique Hotel",
      destination: "Kyoto",
      country: "Japan",
      pricePerNight: 185,
      rating: 4.6,
      reviewsCount: 410,
      tag: "Central Location",
      amenities: ["Matcha Lounge", "High-Speed Wi-Fi", "Bicycle Rental"],
      image: "assets/images/hotel-8.webp"
    },
    {
      id: "hotel-9",
      name: "Positano Cliffside Maison",
      destination: "Amalfi Coast",
      country: "Italy",
      pricePerNight: 310,
      rating: 4.7,
      reviewsCount: 301,
      tag: "Romantic Escape",
      amenities: ["Terrace Breakfast", "Boat Excursions", "Concierge"],
      image: "assets/images/hotel-9.webp"
    },
    {
      id: "hotel-10",
      name: "Canggu Surf & Villa Club",
      destination: "Bali",
      country: "Indonesia",
      pricePerNight: 140,
      rating: 4.5,
      reviewsCount: 488,
      tag: "Coastal Vibe",
      amenities: ["Lagoon Pool", "Co-Working Loft", "Surf Lessons"],
      image: "assets/images/hotel-10.webp"
    },
    {
      id: "hotel-11",
      name: "Soneva Fushi Overwater Haven",
      destination: "Maldives",
      country: "Maldives",
      pricePerNight: 580,
      rating: 4.9,
      reviewsCount: 310,
      tag: "Overwater Villa",
      amenities: ["Overwater Hammock", "Private Lagoon Pool", "House Reef Snorkeling"],
      image: "assets/images/dest-maldives.webp"
    },
    {
      id: "hotel-12",
      name: "Le Marais Haussmann Grand",
      destination: "Paris",
      country: "France",
      pricePerNight: 310,
      rating: 4.8,
      reviewsCount: 425,
      tag: "City Center",
      amenities: ["Eiffel Tower View", "French Bakery Breakfast", "Concierge"],
      image: "assets/images/dest-paris.webp"
    }
  ],

  offers: [
    {
      id: "offer-1",
      badge: "20% OFF STAYS",
      title: "Early Autumn Escape",
      description: "Save 20% on boutique hotels and cliffside villas when booking 3 or more nights.",
      code: "AUTUMN20",
      discountPercent: 20,
      validUntil: "Valid through December 20, 2026"
    },
    {
      id: "offer-2",
      badge: "15% WELCOME DEAL",
      title: "First Wanderly Booking",
      description: "New to Wanderly? Apply this code at checkout for an instant 15% discount on any stay.",
      code: "WANDER15",
      discountPercent: 15,
      validUntil: "Valid on all destinations"
    },
    {
      id: "offer-3",
      badge: "25% SUITE UPGRADE",
      title: "Extended Stay Sanctuary",
      description: "Stay 5+ nights in Asia or Europe and enjoy 25% off your total accommodation rate.",
      code: "STAYLONG25",
      discountPercent: 25,
      validUntil: "Limited seasonal inventory"
    }
  ],

  testimonials: [
    {
      id: "rev-1",
      name: "Elena Rostova",
      trip: "Stayed at Oia Caldera Cliff Suites",
      rating: 5,
      quote: "The price estimator matched our final invoice to the dollar. Watching sunset from our caldera terrace in Santorini was effortless from start to finish.",
      avatar: "assets/images/avatar-1.webp"
    },
    {
      id: "rev-2",
      name: "Marcus Vance",
      trip: "Stayed at Arashiyama Bamboo Ryokan",
      rating: 5,
      quote: "Wanderly's curation saved hours of research. The private cedar onsen and kaiseki breakfast in Kyoto exceeded every expectation.",
      avatar: "assets/images/avatar-2.webp"
    },
    {
      id: "rev-3",
      name: "Priya Nair",
      trip: "Stayed at Ubud Canopy Jungle Resort",
      rating: 5,
      quote: "Used the AUTUMN20 promo code and saved over $130 on our five-night Bali retreat. Instant confirmation and airport pickup worked seamlessly.",
      avatar: "assets/images/avatar-3.webp"
    },
    {
      id: "rev-4",
      name: "Daniel Lindqvist",
      trip: "Stayed at Matterhorn Glacier Lodge",
      rating: 5,
      quote: "Filtering by rating and nightly budget made comparing Swiss Alps lodges super clean. The heated outdoor pool facing the peaks was unforgettable.",
      avatar: "assets/images/avatar-4.webp"
    },
    {
      id: "rev-5",
      name: "Sophia Alverez",
      trip: "Stayed at Casa Cenote Beachfront",
      rating: 5,
      quote: "Saved three hotels to my wishlist while planning with my partner, compared total room costs for 4 guests, and booked in two minutes.",
      avatar: "assets/images/avatar-5.webp"
    },
    {
      id: "rev-6",
      name: "Kenji Takahashi",
      trip: "Stayed at Villa Ravello Belvedere",
      rating: 5,
      quote: "Zero hidden resort surprises and responsive concierge support when our flight into Naples was delayed by three hours.",
      avatar: "assets/images/avatar-6.webp"
    }
  ],

  faqs: [
    {
      id: "faq-1",
      category: "booking",
      question: "How do I search and book a hotel stay with Stackly?",
      answer: "Booking with Stackly is designed to be effortless: browse our curated destinations or search hotels by name and region, choose your check-in and check-out dates along with the number of guests, and explore tailored room options. When you click Estimate & Book on any hotel card, our instant estimator computes the exact total—including all room nights, seasonal discounts, and hospitality taxes. Once confirmed, you receive an instant digital receipt and check-in voucher via email."
    },
    {
      id: "faq-2",
      category: "cancellation",
      question: "What is the Flexible Cancellation Policy?",
      answer: "We know travel schedules can shift unexpectedly. The vast majority of boutique resorts and city hotels on Stackly feature Free Cancellation up to 48 hours prior to your local 3:00 PM check-in time. Look for the green Free Cancellation badge on hotel cards. Cancellations made within the grace window receive a 100% refund credited back to your original payment card within 3–5 banking days."
    },
    {
      id: "faq-3",
      category: "rates",
      question: "How does the Best Price Guarantee work?",
      answer: "We partner directly with boutique properties to ensure you enjoy the most competitive rates available anywhere online. If you find the identical hotel, room class, dates, and cancellation conditions advertised for less on any authorized public site within 24 hours of booking, let us know. We will immediately match the lower rate and credit an additional $50 travel voucher toward your next stay."
    },
    {
      id: "faq-4",
      category: "rates",
      question: "Are all taxes, cleaning, and resort fees included?",
      answer: "Yes, 100% transparent pricing is our standard. Unlike platforms that add unexpected resort and cleaning fees at the final payment step, Stackly displays a comprehensive cost breakdown upfront. All mandatory municipal tourism levies, cleaning fees, and VAT/sales taxes are calculated right inside the live price estimator so there are zero surprise charges at checkout or upon hotel arrival."
    },
    {
      id: "faq-5",
      category: "promos",
      question: "How do I apply promotional discount vouchers?",
      answer: "You can discover active seasonal promotions in our Special Offers section. To apply a promo, click Copy Code or manually type the code (such as AUTUMN20 for 20% off or SUMMER15 for 15% off) into the coupon field in the booking estimate modal. The system validates the code in real-time, displays the exact dollar savings, and applies the discount directly to your estimate."
    },
    {
      id: "faq-6",
      category: "promos",
      question: "How does the Saved Wishlist feature work?",
      answer: "Click the heart icon on any hotel card to bookmark stays you love. Your saved properties synchronize to your browser's local storage automatically. Access your collection anytime by clicking the Saved badge in the top navigation bar. From the drawer, you can inspect nightly rates, remove items, or jump straight to reservation planning."
    },
    {
      id: "faq-7",
      category: "booking",
      question: "Can I modify my stay dates or guest count after reserving?",
      answer: "Yes. Date modifications, room category upgrades, and guest headcount adjustments can be requested online via your booking management link or by contacting our concierge team. Stackly never charges administrative modification fees. Any change in total cost simply reflects the hotel's seasonal rate differential for the updated dates or room category."
    },
    {
      id: "faq-8",
      category: "booking",
      question: "What payment methods and encryption standards are supported?",
      answer: "We support all major payment providers: Visa, MasterCard, American Express, Apple Pay, Google Pay, and Discover, as well as selected local payment gateways. Every transaction is secured using bank-grade 256-bit SSL encryption and PCI-DSS Level 1 compliant tokenization."
    }
  ]
};
