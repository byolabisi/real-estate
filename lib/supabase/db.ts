import { createClient } from "@/lib/supabase/server";

// Mock data for demo/fallback purposes - Comprehensive Lagos Properties (Island, Lekki, Mainland)
const MOCK_LISTINGS: Listing[] = [
  // PREMIUM PROPERTIES - Lagos Island & Ikoyi
  {
    id: "mock-1",
    agent_id: "mock-agent-1",
    title: "Luxury 4-Bedroom Penthouse at Oniru Estate, Victoria Island",
    description: "Stunning high-rise penthouse with sweeping views of the Lagos lagoon. Close to Lekki Conservation Centre and top restaurants. Comes with backup power, water treatment system, and premium finishes throughout.",
    house_type: "penthouse",
    rent_amount: 8500000,
    currency: "NGN",
    bedrooms: 4,
    bathrooms: 4,
    parking_spots: 3,
    furnished: true,
    state: "Lagos",
    lga: "Victoria Island",
    amenities: "Gym, Concierge, Rooftop lounge, 24/7 Security, Internet, Generator",
    features: "Smart home automation, Air conditioning, Modern kitchen, Elevator access",
    images_urls: null,
    status: "active",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-2",
    agent_id: "mock-agent-2",
    title: "Modern 3-Bedroom Apartment at Eko Atlantic City",
    description: "Contemporary apartment in the prestigious Eko Atlantic development. Includes access to private beach, shopping mall, and world-class amenities. Perfect for professionals.",
    house_type: "apartment",
    rent_amount: 4500000,
    currency: "NGN",
    bedrooms: 3,
    bathrooms: 3,
    parking_spots: 2,
    furnished: true,
    state: "Lagos",
    lga: "Victoria Island",
    amenities: "Pool, Gym, Mall access, Beach access, 24/7 Security, Generator",
    features: "Open plan living, Kitchen with island counter, Marble flooring, Sea view",
    images_urls: null,
    status: "active",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-3",
    agent_id: "mock-agent-1",
    title: "Exclusive 5-Bedroom Mansion at Banana Island, Ikoyi",
    description: "Ultra-luxury waterfront mansion with private jetty access. Located on the most exclusive island in Lagos. Panoramic lagoon views, infinity pool, and state-of-the-art security features.",
    house_type: "villa",
    rent_amount: 15000000,
    currency: "NGN",
    bedrooms: 5,
    bathrooms: 5,
    parking_spots: 4,
    furnished: true,
    state: "Lagos",
    lga: "Ikoyi",
    amenities: "Private jetty, Infinity pool, Spa, Cinema, Wine cellar, 24/7 Armed security",
    features: "Waterfront property, Smart home, Generator + Solar, Gated compound",
    images_urls: null,
    status: "active",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-4",
    agent_id: "mock-agent-3",
    title: "Sophisticated 3-Bedroom Flat in Ikoyi, near Awolowo Road",
    description: "Well-designed apartment in a secure building close to Awolowo Road. Walking distance to major shops and restaurants. Excellent for expatriates and professionals.",
    house_type: "flat",
    rent_amount: 2800000,
    currency: "NGN",
    bedrooms: 3,
    bathrooms: 2,
    parking_spots: 1,
    furnished: false,
    state: "Lagos",
    lga: "Ikoyi",
    amenities: "Generator, Water tank, CCTV, 24/7 Security, WiFi available",
    features: "Spacious rooms, Modern kitchen, Fitted wardrobes, Balcony",
    images_urls: null,
    status: "active",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-5",
    agent_id: "mock-agent-2",
    title: "Stunning 4-Bedroom Duplex at Parkview Estate, Ikoyi",
    description: "Beautiful duplex in the secured Parkview Estate. Well-landscaped compound with lush gardens. Close to schools, hospitals, and shopping centers. Perfect for families.",
    house_type: "duplex",
    rent_amount: 6500000,
    currency: "NGN",
    bedrooms: 4,
    bathrooms: 4,
    parking_spots: 2,
    furnished: true,
    state: "Lagos",
    lga: "Ikoyi",
    amenities: "Swimming pool, Garden, Gym, 24/7 Security, Generator, Borehole",
    features: "Home office, Maids quarters, Large kitchen, Terrace garden",
    images_urls: null,
    status: "active",
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },

  // MID-RANGE PROPERTIES - Lekki & Lagos Island
  {
    id: "mock-6",
    agent_id: "mock-agent-4",
    title: "Premium 2-Bedroom Apartment at Chevron Drive, Lekki",
    description: "Compact yet luxurious apartment ideal for young professionals and singles. Located on popular Chevron Drive with easy access to the business district.",
    house_type: "apartment",
    rent_amount: 2200000,
    currency: "NGN",
    bedrooms: 2,
    bathrooms: 2,
    parking_spots: 1,
    furnished: true,
    state: "Lagos",
    lga: "Lekki",
    amenities: "Generator, Water supply, CCTV, 24/7 Security, AC",
    features: "Modern finishes, Walk-in closet, Kitchen with granite tops",
    images_urls: null,
    status: "active",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-7",
    agent_id: "mock-agent-1",
    title: "Upscale 4-Bedroom House at Lekki Phase 1",
    description: "Detached house in the serene and secure Lekki Phase 1 community. Spacious compound with garden and play area. Near shopping centers and good schools.",
    house_type: "house",
    rent_amount: 5200000,
    currency: "NGN",
    bedrooms: 4,
    bathrooms: 3,
    parking_spots: 2,
    furnished: false,
    state: "Lagos",
    lga: "Lekki",
    amenities: "Generator, Borehole, Garden, Gate, 24/7 Security patrol",
    features: "Sitting/dining room, Family kitchen, Study, Outdoor space",
    images_urls: null,
    status: "active",
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-8",
    agent_id: "mock-agent-3",
    title: "Business District 2-Bedroom Apartment at The Pinnacle, Lagos Island",
    description: "Office-ready apartment in the heart of Lagos business district. Perfect for business travelers and remote workers. Close to banks and commercial centers.",
    house_type: "apartment",
    rent_amount: 3500000,
    currency: "NGN",
    bedrooms: 2,
    bathrooms: 2,
    parking_spots: 1,
    furnished: true,
    state: "Lagos",
    lga: "Lagos Island",
    amenities: "Backup power, High-speed Internet, 24/7 Security, AC, Water supply",
    features: "Work-from-home setup, Modern kitchen, Tile finishes",
    images_urls: null,
    status: "active",
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-9",
    agent_id: "mock-agent-4",
    title: "Boutique 3-Bedroom Flat at Expressway, Lagos Island",
    description: "Charming flat with easy expressway access. Great location for quick access to mainland. Well-maintained building with resident association.",
    house_type: "flat",
    rent_amount: 2100000,
    currency: "NGN",
    bedrooms: 3,
    bathrooms: 2,
    parking_spots: 1,
    furnished: false,
    state: "Lagos",
    lga: "Lagos Island",
    amenities: "Generator backup, Water tank, Parking, 24/7 Security, Intercom",
    features: "Open plan design, Fitted kitchen, Balcony with city view",
    images_urls: null,
    status: "active",
    created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-10",
    agent_id: "mock-agent-2",
    title: "Elegant 3-Bedroom Apartment at Osborne Road, Ikoyi",
    description: "Prestigious address on Osborne Road. Close to shopping, dining, and entertainment. Known for its vibrant nightlife and upscale establishments.",
    house_type: "apartment",
    rent_amount: 3800000,
    currency: "NGN",
    bedrooms: 3,
    bathrooms: 3,
    parking_spots: 2,
    furnished: true,
    state: "Lagos",
    lga: "Ikoyi",
    amenities: "Gym, Pool access, Generator, 24/7 Security, WiFi included",
    features: "Hardwood floors, Spacious kitchen, Study area, Terrace",
    images_urls: null,
    status: "active",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },

  // AFFORDABLE HOUSING - Lagos Mainland (Yaba, Surulere, Ikeja, Alimosho)
  {
    id: "mock-11",
    agent_id: "mock-agent-5",
    title: "Cozy Self-Contained Studio at Yaba, Near Unilag",
    description: "Perfect starter home or investment property. Fully furnished studio apartment close to Unilag campus. Secure gated compound with resident security. Great for students and young professionals.",
    house_type: "room",
    rent_amount: 450000,
    currency: "NGN",
    bedrooms: 0,
    bathrooms: 1,
    parking_spots: 0,
    furnished: true,
    state: "Lagos",
    lga: "Yaba",
    amenities: "Generator, Water supply, 24/7 Security",
    features: "Open plan living, Fitted kitchen, Ensuite bathroom",
    images_urls: null,
    status: "active",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-12",
    agent_id: "mock-agent-3",
    title: "Affordable 1-Bedroom Apartment in Surulere",
    description: "Budget-friendly 1-bedroom apartment in the bustling Surulere community. Close to schools, hospitals, and shopping. Well-lit rooms with ventilation. Ideal for young couples and single professionals.",
    house_type: "apartment",
    rent_amount: 650000,
    currency: "NGN",
    bedrooms: 1,
    bathrooms: 1,
    parking_spots: 0,
    furnished: false,
    state: "Lagos",
    lga: "Surulere",
    amenities: "Generator access, Water supply, Community security",
    features: "Spacious room, Equipped kitchen, Separate living area",
    images_urls: null,
    status: "active",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-13",
    agent_id: "mock-agent-4",
    title: "Neat 1-Bedroom Flat at Shomolu, Lagos Mainland",
    description: "Comfortable 1-bedroom flat in peaceful Shomolu neighborhood. Quiet residential area with easy access to major roads. Perfect for families and professionals seeking affordable housing.",
    house_type: "flat",
    rent_amount: 580000,
    currency: "NGN",
    bedrooms: 1,
    bathrooms: 1,
    parking_spots: 0,
    furnished: false,
    state: "Lagos",
    lga: "Shomolu",
    amenities: "Water tank, Community lighting, Basic security",
    features: "Well-ventilated room, Basic kitchen, Clean utility",
    images_urls: null,
    status: "active",
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-14",
    agent_id: "mock-agent-1",
    title: "Spacious 2-Bedroom Apartment in Yaba, Lagos",
    description: "Well-sized 2-bedroom apartment in the heart of Yaba. Close to universities, shops, and transport terminals. Great residential community with friendly neighbors.",
    house_type: "apartment",
    rent_amount: 1200000,
    currency: "NGN",
    bedrooms: 2,
    bathrooms: 1,
    parking_spots: 0,
    furnished: false,
    state: "Lagos",
    lga: "Yaba",
    amenities: "Generator, Water supply, 24/7 Security gates",
    features: "Spacious bedrooms, Fitted kitchen, Sitting area, Balcony",
    images_urls: null,
    status: "active",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-15",
    agent_id: "mock-agent-2",
    title: "Affordable 2-Bedroom Flat in Ikeja GRA",
    description: "Comfortable 2-bedroom apartment in the planned Ikeja GRA community. Close to shopping malls, schools, and government offices. Ideal investment property with high rental demand.",
    house_type: "flat",
    rent_amount: 1450000,
    currency: "NGN",
    bedrooms: 2,
    bathrooms: 2,
    parking_spots: 0,
    furnished: false,
    state: "Lagos",
    lga: "Ikeja",
    amenities: "Generator access, Water supply, Street lighting, 24/7 Gate security",
    features: "Well-built rooms, Modern kitchen, Living/dining area",
    images_urls: null,
    status: "active",
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-16",
    agent_id: "mock-agent-3",
    title: "Modern 2-Bedroom Apartment at Alimosho, Lagos",
    description: "Recently renovated 2-bedroom apartment in the growing Alimosho area. Close to retail centers and transport hubs. Budget-friendly option for middle-income earners.",
    house_type: "apartment",
    rent_amount: 950000,
    currency: "NGN",
    bedrooms: 2,
    bathrooms: 1,
    parking_spots: 0,
    furnished: false,
    state: "Lagos",
    lga: "Alimosho",
    amenities: "Water supply, Generator available, Community watch",
    features: "Newly painted, Good ventilation, Separate kitchen",
    images_urls: null,
    status: "active",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-17",
    agent_id: "mock-agent-4",
    title: "Budget-Friendly 3-Bedroom Flat in Ejigbo, Lagos",
    description: "Spacious 3-bedroom apartment in the affordable Ejigbo neighborhood. Good for families seeking value for money. Close to major roads and commercial areas.",
    house_type: "flat",
    rent_amount: 1800000,
    currency: "NGN",
    bedrooms: 3,
    bathrooms: 2,
    parking_spots: 0,
    furnished: false,
    state: "Lagos",
    lga: "Ejigbo",
    amenities: "Water supply, Basic security, Community lighting",
    features: "Spacious rooms, Kitchen with counter, Living area, Balcony",
    images_urls: null,
    status: "active",
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-18",
    agent_id: "mock-agent-1",
    title: "Comfortable 2-Bedroom Duplex at Bariga, Lagos Mainland",
    description: "Mid-terrace duplex in the bustling Bariga area. Separate entrance with small yard space. Good for families and those wanting more space than a flat.",
    house_type: "duplex",
    rent_amount: 1500000,
    currency: "NGN",
    bedrooms: 2,
    bathrooms: 2,
    parking_spots: 0,
    furnished: false,
    state: "Lagos",
    lga: "Bariga",
    amenities: "Water tank, Generator access, Yard space",
    features: "Good ventilation, Fitted kitchen, Spacious rooms, Storage",
    images_urls: null,
    status: "active",
    created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-19",
    agent_id: "mock-agent-2",
    title: "Affordable 3-Bedroom Duplex in Ilupeju, Lagos",
    description: "Value-for-money 3-bedroom duplex in the accessible Ilupeju area. Close to schools, transport, and markets. Suitable for families and investors.",
    house_type: "duplex",
    rent_amount: 2200000,
    currency: "NGN",
    bedrooms: 3,
    bathrooms: 2,
    parking_spots: 1,
    furnished: false,
    state: "Lagos",
    lga: "Ilupeju",
    amenities: "Borehole, Generator, Compound space, Community security",
    features: "Master bedroom ensuite, Family kitchen, Spacious living area",
    images_urls: null,
    status: "active",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-20",
    agent_id: "mock-agent-3",
    title: "Economy 1-Bedroom Apartment at Mushin, Lagos",
    description: "No-frills 1-bedroom apartment in the lively Mushin neighborhood. Perfect starter home for young professionals and students. Near transport and commercial centers.",
    house_type: "apartment",
    rent_amount: 520000,
    currency: "NGN",
    bedrooms: 1,
    bathrooms: 1,
    parking_spots: 0,
    furnished: false,
    state: "Lagos",
    lga: "Mushin",
    amenities: "Water supply, Basic neighborhood watch",
    features: "Decent room size, Basic kitchen, Shared facilities option",
    images_urls: null,
    status: "active",
    created_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Types for the database
export interface User {
  id: string;
  user_type: "agent" | "landlord" | "house_hunter" | "tenant";
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  state: string | null;
  lga: string | null;
  profile_image_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Listing {
  id: string;
  agent_id: string;
  title: string;
  description: string | null;
  house_type: "apartment" | "house" | "duplex" | "room" | "flat" | "bungalow" | "villa" | "penthouse";
  rent_amount: number;
  currency: string;
  bedrooms: number | null;
  bathrooms: number | null;
  parking_spots: number | null;
  furnished: boolean;
  state: string;
  lga: string;
  amenities: string | null;
  features: string | null;
  images_urls: string | null;
  status: "active" | "rented" | "maintenance" | "archived";
  created_at: string;
  updated_at: string;
}

export interface Waitlist {
  id: string;
  email: string;
  user_id: string | null;
  user_type: "agent" | "landlord" | "house_hunter" | "tenant";
  state: string | null;
  lga: string | null;
  joined_at: string;
  welcome_email_sent: boolean;
  status: "active" | "inactive";
}

// User operations
export async function getUser(userId: string): Promise<User | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  return data;
}

export async function updateUser(userId: string, updates: Partial<User>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating user:", error);
    return null;
  }

  return data;
}

// Listing operations
export async function createListing(listing: Omit<Listing, "id" | "created_at" | "updated_at">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .insert([listing])
    .select()
    .single();

  if (error) {
    console.error("Error creating listing:", error);
    return null;
  }

  return data;
}

export async function getActiveListings(filters?: {
  state?: string;
  lga?: string;
  house_type?: string;
}) {
  const supabase = await createClient();
  let query = supabase.from("listings").select("*").eq("status", "active");

  if (filters?.state) {
    query = query.eq("state", filters.state);
  }
  if (filters?.lga) {
    query = query.eq("lga", filters.lga);
  }
  if (filters?.house_type) {
    query = query.eq("house_type", filters.house_type);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching listings:", error);
    // Return mock data as fallback
    let mockData = MOCK_LISTINGS;
    if (filters?.state) {
      mockData = mockData.filter((l) => l.state === filters.state);
    }
    if (filters?.lga) {
      mockData = mockData.filter((l) => l.lga === filters.lga);
    }
    if (filters?.house_type) {
      mockData = mockData.filter((l) => l.house_type === filters.house_type);
    }
    return mockData;
  }

  return data || [];
}

export async function getListingById(id: string): Promise<Listing | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching listing:", error);
    // Return mock data as fallback
    const mockListing = MOCK_LISTINGS.find((l) => l.id === id);
    return mockListing || null;
  }

  return data;
}

export async function getUserListings(agentId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("agent_id", agentId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user listings:", error);
    return [];
  }

  return data || [];
}

export async function updateListing(id: string, updates: Partial<Listing>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating listing:", error);
    return null;
  }

  return data;
}

export async function deleteListing(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("listings").delete().eq("id", id);

  if (error) {
    console.error("Error deleting listing:", error);
    return false;
  }

  return true;
}

// Waitlist operations
export async function joinWaitlist(email: string, userType: string, state?: string, lga?: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("waitlist")
    .insert([
      {
        email,
        user_type: userType,
        state,
        lga,
        joined_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error joining waitlist:", error);
    return null;
  }

  return data;
}

export async function getWaitlistUser(email: string): Promise<Waitlist | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("waitlist")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    return null;
  }

  return data;
}

// Agent ratings
export async function getAgentRating(agentId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("agent_ratings")
    .select("rating")
    .eq("agent_id", agentId);

  if (error || !data) {
    return 0;
  }

  if (data.length === 0) return 0;
  const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
  return Number(avg.toFixed(1));
}

// Email log
export async function logEmail(
  recipientEmail: string,
  subject: string,
  emailType: string,
  userId?: string,
  listingId?: string
) {
  const supabase = await createClient();
  const { error } = await supabase.from("email_logs").insert([
    {
      recipient_email: recipientEmail,
      subject,
      email_type: emailType,
      user_id: userId || null,
      related_listing_id: listingId || null,
      sent_at: new Date().toISOString(),
      status: "sent",
    },
  ]);

  if (error) {
    console.error("Error logging email:", error);
  }
}
