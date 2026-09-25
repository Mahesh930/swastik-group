// Seed data representing authentic reflections from Pune residents
export const defaultPreferences = [
  {
    id: "pref-1",
    luxury: "More nature",
    home: "A greener view",
    commute: "Absolutely",
    thought: "I don't need fifty amenities. I need a home that feels less crowded.",
    author: "A Punekar from Prabhat Road",
    reactions: { heart: 24, resonates: 19, truePune: 31 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString()
  },
  {
    id: "pref-2",
    luxury: "More space",
    home: "A greener view",
    commute: "Maybe",
    thought: "A green view I can actually wake up to every morning without staring into someone's balcony.",
    author: "A Punekar from Kothrud",
    reactions: { heart: 18, resonates: 14, truePune: 22 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: "pref-3",
    luxury: "More privacy",
    home: "More room",
    commute: "Absolutely",
    thought: "Peace after work. Just bird songs and trees. That is luxury now.",
    author: "A Punekar from Baner",
    reactions: { heart: 32, resonates: 27, truePune: 40 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString()
  },
  {
    id: "pref-4",
    luxury: "More nature",
    home: "A better location",
    commute: "Maybe",
    thought: "The old Pune aroma of wet petrichor under gulmohar trees. Build homes that breathe.",
    author: "A Punekar from Model Colony",
    reactions: { heart: 15, resonates: 21, truePune: 35 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  },
  {
    id: "pref-5",
    luxury: "More space",
    home: "More room",
    commute: "Absolutely",
    thought: "A large veranda where evening chai actually feels like an occasion, not a rush.",
    author: "A Punekar from Kalyani Nagar",
    reactions: { heart: 28, resonates: 16, truePune: 29 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
  },
  {
    id: "pref-6",
    luxury: "More convenience",
    home: "A greener view",
    commute: "Probably not",
    thought: "Wide windows, quiet cross-breeze, and zero honking during late evenings.",
    author: "A Punekar from Aundh",
    reactions: { heart: 12, resonates: 19, truePune: 18 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  }
];
