import { createClient } from "@/lib/supabase/server";

// Mock data for demo/fallback purposes
const MOCK_LISTINGS: Listing[] = [
  {
    id: "mock-1",
    agent_id: "mock-agent-1",
    title: "Modern 3-Bedroom Apartment in Ikoyi",
    description: "Beautiful apartment with excellent amenities, located in the heart of Ikoyi with access to top restaurants and businesses.",
    house_type: "apartment",
    rent_amount: 850000,
    currency: "NGN",
    bedrooms: 3,
    bathrooms: 2,
    parking_spots: 1,
    furnished: false,
    state: "Lagos",
    lga: "Ikoyi",
    amenities: "WiFi, Generator, Water Tank, Balcony",
    features: "Modern kitchen, Spacious rooms, 24/7 Security",
    images_urls: null,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-2",
    agent_id: "mock-agent-2",
    title: "Luxury 4-Bedroom Duplex in Abuja",
    description: "Premium duplex with modern finishes, located in a secure estate with excellent amenities and 24/7 security.",
    house_type: "duplex",
    rent_amount: 2500000,
    currency: "NGN",
    bedrooms: 4,
    bathrooms: 3,
    parking_spots: 2,
    furnished: true,
    state: "FCT",
    lga: "Asokoro",
    amenities: "Pool, Garden, Gym, Generator",
    features: "Smart home system, Modern architecture, Secure estate",
    images_urls: null,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "mock-3",
    agent_id: "mock-agent-1",
    title: "Exquisite 5-Bedroom Penthouse",
    description: "Top-floor luxury living with premium finishes, rooftop access, and panoramic city views.",
    house_type: "penthouse",
    rent_amount: 5000000,
    currency: "NGN",
    bedrooms: 5,
    bathrooms: 4,
    parking_spots: 3,
    furnished: true,
    state: "Lagos",
    lga: "Victoria Island",
    amenities: "Rooftop, Concierge, Home Theater, Gym",
    features: "Smart home, Elevator, Private parking, City views",
    images_urls: null,
    status: "active",
    created_at: new Date().toISOString(),
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
