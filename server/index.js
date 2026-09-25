import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { defaultPreferences } from './data/seedPreferences.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || '';

app.use(cors());
app.use(express.json());

// Persistent local storage path for offline / local-first guarantee
const DATA_DIR = path.join(__dirname, 'data');
const PREFERENCES_FILE = path.join(DATA_DIR, 'preferences.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// -------------------------------------------------------------
// MONGOOSE SCHEMAS & MODELS
// -------------------------------------------------------------
const preferenceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  luxury: { type: String, default: 'Unspecified' },
  home: { type: String, default: 'Unspecified' },
  commute: { type: String, default: 'Unspecified' },
  thought: { type: String, required: true },
  author: { type: String, default: 'A Punekar' },
  reactions: {
    heart: { type: Number, default: 0 },
    resonates: { type: Number, default: 0 },
    truePune: { type: Number, default: 0 },
    dislike: { type: Number, default: 0 }
  },
  userAgent: { type: String, default: '' },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

const PreferenceModel = mongoose.model('Preference', preferenceSchema);

const analyticsEventSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  event: { type: String, required: true, index: true },
  payload: { type: mongoose.Schema.Types.Mixed, default: {} },
  sessionId: { type: String, default: 'anon' },
  timestamp: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

const AnalyticsModel = mongoose.model('AnalyticsEvent', analyticsEventSchema);

// In-memory + File Storage helper
let preferencesStore = [];
let analyticsEventsStore = [];

function loadData() {
  try {
    if (fs.existsSync(PREFERENCES_FILE)) {
      preferencesStore = JSON.parse(fs.readFileSync(PREFERENCES_FILE, 'utf8'));
    } else {
      preferencesStore = [...defaultPreferences];
      savePreferences();
    }
  } catch (err) {
    console.error('Error loading preferences file, using seed data:', err.message);
    preferencesStore = [...defaultPreferences];
  }

  try {
    if (fs.existsSync(ANALYTICS_FILE)) {
      analyticsEventsStore = JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf8'));
    } else {
      analyticsEventsStore = [
        { event: 'P2_Landing_View', timestamp: new Date().toISOString() },
        { event: 'P2_50_Scroll', timestamp: new Date().toISOString() },
        { event: 'P2_Preference_Select', payload: { question: 'luxury', value: 'More nature' }, timestamp: new Date().toISOString() }
      ];
      saveAnalytics();
    }
  } catch (err) {
    console.error('Error loading analytics file:', err.message);
    analyticsEventsStore = [];
  }
}

function savePreferences() {
  try {
    fs.writeFileSync(PREFERENCES_FILE, JSON.stringify(preferencesStore, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving preferences:', err.message);
  }
}

function saveAnalytics() {
  try {
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(analyticsEventsStore, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving analytics:', err.message);
  }
}

loadData();

// -------------------------------------------------------------
// MONGODB ATLAS CONNECTION & AUTO-SYNC
// -------------------------------------------------------------
let isMongoConnected = false;

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 })
    .then(async () => {
      isMongoConnected = true;
      console.log('✅ Connected to MongoDB Atlas cluster (dear_pune database)');

      try {
        const count = await PreferenceModel.countDocuments();
        if (count === 0) {
          console.log('🌱 Seeding MongoDB Atlas with initial Pune reflections...');
          const initialData = preferencesStore.length > 0 ? preferencesStore : defaultPreferences;
          await PreferenceModel.insertMany(initialData);
          console.log(`✅ Seeded ${initialData.length} reflections into MongoDB Atlas.`);
        } else {
          // Sync existing data from MongoDB into local memory/file store
          const mongoPrefs = await PreferenceModel.find().sort({ createdAt: -1 }).lean();
          if (mongoPrefs && mongoPrefs.length > 0) {
            preferencesStore = mongoPrefs.map(doc => ({
              id: doc.id,
              luxury: doc.luxury,
              home: doc.home,
              commute: doc.commute,
              thought: doc.thought,
              author: doc.author,
              reactions: doc.reactions || { heart: 0, resonates: 0, truePune: 0, dislike: 0 },
              userAgent: doc.userAgent || '',
              createdAt: doc.createdAt
            }));
            savePreferences();
            console.log(`🔄 Synced ${preferencesStore.length} reflections from MongoDB Atlas.`);
          }
        }
      } catch (syncErr) {
        console.warn('MongoDB sync notice:', syncErr.message);
      }
    })
    .catch((err) => {
      console.warn('⚠️ MongoDB connection failed. Operating in local persistent file store mode:', err.message);
    });
} else {
  console.log('ℹ️ No MONGODB_URI detected. Running in robust local persistent file storage mode.');
}

// Compute aggregate breakdown statistics
function computeStats(items) {
  const luxuryCounts = {
    'More space': 0,
    'More privacy': 0,
    'More nature': 0,
    'More convenience': 0,
    'Unspecified': 0
  };

  const homeCounts = {
    'A greener view': 0,
    'A higher floor': 0,
    'A better location': 0,
    'More room': 0,
    'Unspecified': 0
  };

  const commuteCounts = {
    'Absolutely': 0,
    'Maybe': 0,
    'Probably not': 0,
    'Unspecified': 0
  };

  items.forEach(item => {
    if (luxuryCounts[item.luxury] !== undefined) luxuryCounts[item.luxury]++;
    else luxuryCounts['Unspecified']++;

    if (homeCounts[item.home] !== undefined) homeCounts[item.home]++;
    else homeCounts['Unspecified']++;

    if (commuteCounts[item.commute] !== undefined) commuteCounts[item.commute]++;
    else commuteCounts['Unspecified']++;
  });

  return {
    total: items.length,
    luxuryCounts,
    homeCounts,
    commuteCounts
  };
}

// -------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Dear Pune - Chapter Two: The Unsent Letter API',
    company: 'Swastik Realty Group',
    database: isMongoConnected ? 'MongoDB Atlas' : 'Local Persistent JSON Store',
    mongoConnected: isMongoConnected,
    totalRecords: preferencesStore.length,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// GET /api/preferences - Fetch thoughts and aggregated analytics
app.get('/api/preferences', async (req, res) => {
  const { luxury, home, commute, search, limit = 50 } = req.query;

  let filtered = [...preferencesStore];

  if (luxury && luxury !== 'all') {
    filtered = filtered.filter(item => item.luxury === luxury);
  }
  if (home && home !== 'all') {
    filtered = filtered.filter(item => item.home === home);
  }
  if (commute && commute !== 'all') {
    filtered = filtered.filter(item => item.commute === commute);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(item =>
      item.thought.toLowerCase().includes(q) ||
      (item.author && item.author.toLowerCase().includes(q))
    );
  }

  // Sort descending by creation date
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const stats = computeStats(preferencesStore);

  res.json({
    success: true,
    count: filtered.length,
    stats,
    database: isMongoConnected ? 'MongoDB Atlas' : 'Local Store',
    preferences: filtered.slice(0, parseInt(limit, 10))
  });
});

// POST /api/preferences - Submit questionnaire and thought
app.post('/api/preferences', async (req, res) => {
  const { luxury, home, commute, thought, author } = req.body;

  if (!thought || typeof thought !== 'string' || !thought.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Please enter your reflection or thought.'
    });
  }

  const cleanThought = thought.trim().replace(/[<>]/g, '');
  if (cleanThought.length > 180) {
    return res.status(400).json({
      success: false,
      error: 'Thought cannot exceed 180 characters.'
    });
  }

  const validLuxuries = ['More space', 'More privacy', 'More nature', 'More convenience'];
  const validHomes = ['A greener view', 'A higher floor', 'A better location', 'More room'];
  const validCommutes = ['Absolutely', 'Maybe', 'Probably not'];

  const newEntry = {
    id: `pref-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    luxury: validLuxuries.includes(luxury) ? luxury : 'Unspecified',
    home: validHomes.includes(home) ? home : 'Unspecified',
    commute: validCommutes.includes(commute) ? commute : 'Unspecified',
    thought: cleanThought,
    author: author && author.trim() ? author.trim().replace(/[<>]/g, '') : 'A Punekar',
    reactions: { heart: 0, resonates: 0, truePune: 0, dislike: 0 },
    userAgent: req.headers['user-agent'] || '',
    createdAt: new Date().toISOString()
  };

  preferencesStore.unshift(newEntry);
  savePreferences();

  // Save to MongoDB Atlas if connected
  if (isMongoConnected) {
    try {
      await PreferenceModel.create(newEntry);
    } catch (mErr) {
      console.error('MongoDB save error:', mErr.message);
    }
  }

  // Log analytics event for form submission
  const analyticsPayload = {
    id: newEntry.id,
    luxury: newEntry.luxury,
    home: newEntry.home,
    commute: newEntry.commute,
    length: cleanThought.length
  };

  const eventRecord = {
    id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    event: 'P2_Home_Must_Have',
    payload: analyticsPayload,
    sessionId: req.headers['x-session-id'] || 'anon',
    timestamp: new Date().toISOString()
  };

  analyticsEventsStore.push(eventRecord);
  saveAnalytics();

  if (isMongoConnected) {
    try {
      await AnalyticsModel.create(eventRecord);
    } catch {}
  }

  res.status(201).json({
    success: true,
    message: 'Your reflection has been added to the Unsent Letter.',
    preference: newEntry,
    stats: computeStats(preferencesStore)
  });
});

// PATCH /api/preferences/:id/reaction - Add or remove a community reaction (like / unlike)
app.patch('/api/preferences/:id/reaction', async (req, res) => {
  const { id } = req.params;
  const { type, action = 'add' } = req.body; // type: 'heart' | 'resonates' | 'truePune' | 'dislike', action: 'add' | 'remove'

  const target = preferencesStore.find(item => item.id === id);
  if (!target) {
    return res.status(404).json({ success: false, error: 'Thought not found.' });
  }

  if (!target.reactions) {
    target.reactions = { heart: 0, resonates: 0, truePune: 0, dislike: 0 };
  }

  const isDecrement = action === 'remove' || action === 'unlike' || action === 'decrement';
  const delta = isDecrement ? -1 : 1;

  if (type === 'heart') {
    target.reactions.heart = Math.max(0, (target.reactions.heart || 0) + delta);
  } else if (type === 'resonates') {
    target.reactions.resonates = Math.max(0, (target.reactions.resonates || 0) + delta);
  } else if (type === 'truePune') {
    target.reactions.truePune = Math.max(0, (target.reactions.truePune || 0) + delta);
  } else if (type === 'dislike') {
    target.reactions.dislike = Math.max(0, (target.reactions.dislike || 0) + delta);
  } else {
    return res.status(400).json({ success: false, error: 'Invalid reaction type.' });
  }

  savePreferences();

  // Persist to MongoDB Atlas
  if (isMongoConnected) {
    try {
      await PreferenceModel.findOneAndUpdate(
        { id },
        { reactions: target.reactions },
        { new: true }
      );
    } catch (mErr) {
      console.error('MongoDB reaction update error:', mErr.message);
    }
  }

  res.json({ success: true, reactions: target.reactions, action: isDecrement ? 'removed' : 'added' });
});

// DELETE /api/preferences/:id - Admin moderation endpoint
app.delete('/api/preferences/:id', async (req, res) => {
  const { id } = req.params;
  const index = preferencesStore.findIndex(item => item.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Entry not found.' });
  }

  const [removed] = preferencesStore.splice(index, 1);
  savePreferences();

  if (isMongoConnected) {
    try {
      await PreferenceModel.findOneAndDelete({ id });
    } catch (mErr) {
      console.error('MongoDB delete error:', mErr.message);
    }
  }

  res.json({
    success: true,
    message: 'Entry removed successfully.',
    id: removed.id
  });
});

// POST /api/analytics/event - Ingest telemetry & dataLayer events
app.post('/api/analytics/event', async (req, res) => {
  const { event, payload, sessionId } = req.body;
  if (!event) {
    return res.status(400).json({ success: false, error: 'Event name required.' });
  }

  const eventRecord = {
    id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    event,
    payload: payload || {},
    sessionId: sessionId || req.headers['x-session-id'] || 'anon',
    timestamp: new Date().toISOString()
  };

  analyticsEventsStore.push(eventRecord);
  if (analyticsEventsStore.length > 1000) {
    analyticsEventsStore = analyticsEventsStore.slice(-1000);
  }
  saveAnalytics();

  if (isMongoConnected) {
    try {
      await AnalyticsModel.create(eventRecord);
    } catch {}
  }

  res.status(201).json({ success: true, logged: eventRecord });
});

// GET /api/analytics - Get aggregate analytics telemetry
app.get('/api/analytics', (req, res) => {
  const eventCounts = {};
  analyticsEventsStore.forEach(ev => {
    eventCounts[ev.event] = (eventCounts[ev.event] || 0) + 1;
  });

  const preferenceStats = computeStats(preferencesStore);

  res.json({
    success: true,
    totalEvents: analyticsEventsStore.length,
    eventCounts,
    funnel: {
      views: eventCounts['P2_Landing_View'] || 0,
      scrolled50: eventCounts['P2_50_Scroll'] || 0,
      scrolled90: eventCounts['P2_90_Scroll'] || 0,
      preferencesSelected: eventCounts['P2_Preference_Select'] || 0,
      letterOpened: eventCounts['P2_Open_Letter_Click'] || 0,
      clueIntent: eventCounts['P2_Next_Clue_Intent'] || 0,
      submissions: eventCounts['P2_Home_Must_Have'] || preferencesStore.length
    },
    preferenceStats,
    recentEvents: analyticsEventsStore.slice(-30).reverse()
  });
});

// Serve frontend in production if built
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Swastik Realty Server running on http://localhost:${PORT}`);
});
