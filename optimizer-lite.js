const TRACK_SELECTION_KEY = 'f1clashSelectedTrack';
const TRACK_SELECTION_OPTIONS_KEY = 'f1clashTrackOptions';
const TRACK_SELECTION_INDEX_KEY = 'f1clashSelectedTrackIndex';
const ACTIVE_PROFILE_KEY = 'f1clashActiveClashId';
const REGISTRATION_KEY = 'f1clashRegistration';
const COMMUNITY_KNOWLEDGE_KEY = 'f1clashCommunityKnowledge';
const OPTIMIZER_MODE_KEY = 'f1clashOptimizerMode';
const DRIVER_PAIR_SELECTION_KEY = 'f1clashSelectedDriverPair';
const DRIVER_CATALOG_SNAPSHOT_KEY = 'driverCatalogSnapshot';
const DRIVER_CATALOG_LAST_COUNT_KEY = 'f1clashOptimizerLastDriverCatalogCount';
const BOOST_PROFILE_KEY = 'f1clashCategoryBoostProfile';
const DRIVER_BOOST_FOCUS_KEY = 'f1clashDriverBoostFocus';
const DRIVER_ASSIGNED_BOOSTS_KEY = 'f1clashAssignedDriverBoosts';

const STAT_KEYS = ['tempo', 'kurven', 'antrieb', 'quali', 'drs'];
const PART_CATEGORIES = ['engine', 'front_wing', 'rear_wing', 'gearbox', 'suspension', 'brakes'];
const TRACK_BACKGROUNDS_DIR = 'assets/track-backgrounds';

const CATEGORY_BOOST_PROFILES = (Array.isArray(window.BOOTS_DATA) ? window.BOOTS_DATA : []).map((entry, index) => ({
  id: String(entry.id || 'boot_' + (index + 1)),
  tier: 'Boot',
  medal: String(entry.name || 'Boot ' + (index + 1)),
  percent: Number(entry.total || 0),
  weeklyLeague: '-',
  races: 0,
  coins: '-',
  cc: 0,
  series: Number(entry.sourceIndex || index + 1),
  rarity: 'None',
  lineA: Array.isArray(entry.lineA) ? entry.lineA : [],
  lineB: Array.isArray(entry.lineB) ? entry.lineB : [],
  total: Number(entry.total || 0)
}));

const DRIVER_RARITY_BY_NAME = {
  Verstappen: 'Epic',
  Leclerc: 'Epic',
  Norris: 'Epic',
  Hamilton: 'Epic',
  Alonso: 'Epic',
  Sainz: 'Epic',
  Piastri: 'Epic',
  Russell: 'Epic',
  Gasly: 'Epic',
  Tsunoda: 'Epic'
};

const CATEGORY_DRIVER_AFFINITY = {
  engine: { pace: 0.45, qualifying: 0.1, tyre: 0.15, overtaking: 0.2, consistency: 0.1 },
  gearbox: { pace: 0.25, qualifying: 0.15, tyre: 0.2, overtaking: 0.2, consistency: 0.2 },
  front_wing: { pace: 0.15, qualifying: 0.4, tyre: 0.1, overtaking: 0.1, consistency: 0.25 },
  rear_wing: { pace: 0.3, qualifying: 0.15, tyre: 0.1, overtaking: 0.35, consistency: 0.1 },
  suspension: { pace: 0.05, qualifying: 0.2, tyre: 0.35, overtaking: 0.1, consistency: 0.3 },
  brakes: { pace: 0.1, qualifying: 0.2, tyre: 0.2, overtaking: 0.25, consistency: 0.25 }
};

const trackBackgroundProbeCache = new Map();
let trackBackgroundRequestId = 0;

const TRACKS = [
  { name: 'Bahrain', laps: 8, pitLoss: 20, wear: 1.0, speed: 84, corners: 58, drs: 62 },
  { name: 'Saudi Arabia', laps: 7, pitLoss: 21, wear: 0.92, speed: 88, corners: 54, drs: 66 },
  { name: 'Australia', laps: 8, pitLoss: 20, wear: 0.96, speed: 74, corners: 68, drs: 60 },
  { name: 'Japan', laps: 7, pitLoss: 21, wear: 1.04, speed: 76, corners: 86, drs: 50 },
  { name: 'Monaco', laps: 10, pitLoss: 18, wear: 1.07, speed: 40, corners: 92, drs: 30 },
  { name: 'Canada', laps: 9, pitLoss: 20, wear: 0.95, speed: 82, corners: 63, drs: 64 },
  { name: 'Austria', laps: 10, pitLoss: 19, wear: 0.94, speed: 86, corners: 64, drs: 65 },
  { name: 'Belgium', laps: 6, pitLoss: 22, wear: 0.98, speed: 90, corners: 74, drs: 67 },
  { name: 'Italy', laps: 8, pitLoss: 21, wear: 0.9, speed: 94, corners: 42, drs: 64 },
  { name: 'Singapore', laps: 8, pitLoss: 21, wear: 1.09, speed: 46, corners: 90, drs: 34 },
  { name: 'Brazil', laps: 9, pitLoss: 20, wear: 1.01, speed: 80, corners: 75, drs: 57 },
  { name: 'Abu Dhabi', laps: 8, pitLoss: 21, wear: 0.97, speed: 81, corners: 70, drs: 59 }
];

const TRACK_SKETCH_POINTS = {
  Bahrain: [[0.08, 0.58], [0.18, 0.42], [0.3, 0.39], [0.43, 0.46], [0.56, 0.36], [0.66, 0.41], [0.75, 0.56], [0.66, 0.68], [0.5, 0.73], [0.32, 0.7], [0.18, 0.64]],
  'Saudi Arabia': [[0.1, 0.6], [0.2, 0.48], [0.33, 0.44], [0.46, 0.37], [0.6, 0.41], [0.72, 0.35], [0.82, 0.46], [0.76, 0.61], [0.63, 0.69], [0.46, 0.71], [0.28, 0.67]],
  Australia: [[0.09, 0.56], [0.2, 0.46], [0.34, 0.43], [0.48, 0.47], [0.61, 0.42], [0.73, 0.49], [0.8, 0.6], [0.72, 0.7], [0.57, 0.75], [0.4, 0.73], [0.24, 0.67]],
  Japan: [[0.11, 0.57], [0.23, 0.45], [0.36, 0.41], [0.48, 0.49], [0.41, 0.62], [0.53, 0.7], [0.67, 0.64], [0.78, 0.54], [0.72, 0.41], [0.58, 0.36], [0.42, 0.35], [0.27, 0.4]],
  Monaco: [[0.12, 0.6], [0.22, 0.49], [0.34, 0.44], [0.45, 0.5], [0.52, 0.42], [0.63, 0.39], [0.73, 0.47], [0.78, 0.59], [0.7, 0.7], [0.57, 0.74], [0.43, 0.7], [0.29, 0.66]],
  Canada: [[0.1, 0.58], [0.19, 0.47], [0.31, 0.42], [0.44, 0.46], [0.56, 0.4], [0.68, 0.45], [0.77, 0.55], [0.71, 0.67], [0.58, 0.72], [0.44, 0.74], [0.28, 0.69]],
  Austria: [[0.09, 0.59], [0.19, 0.49], [0.32, 0.44], [0.46, 0.43], [0.6, 0.46], [0.73, 0.53], [0.78, 0.63], [0.69, 0.71], [0.54, 0.74], [0.38, 0.72], [0.24, 0.67]],
  Belgium: [[0.08, 0.57], [0.18, 0.46], [0.31, 0.39], [0.47, 0.37], [0.62, 0.44], [0.74, 0.39], [0.84, 0.5], [0.78, 0.64], [0.64, 0.73], [0.47, 0.76], [0.29, 0.71], [0.16, 0.63]],
  Italy: [[0.09, 0.6], [0.2, 0.5], [0.34, 0.47], [0.49, 0.47], [0.64, 0.49], [0.77, 0.56], [0.8, 0.64], [0.71, 0.71], [0.56, 0.74], [0.39, 0.73], [0.24, 0.69]],
  Singapore: [[0.11, 0.62], [0.2, 0.5], [0.32, 0.45], [0.45, 0.48], [0.56, 0.42], [0.67, 0.47], [0.76, 0.57], [0.74, 0.68], [0.63, 0.75], [0.48, 0.76], [0.34, 0.72], [0.22, 0.67]],
  Brazil: [[0.1, 0.58], [0.21, 0.47], [0.34, 0.42], [0.47, 0.44], [0.6, 0.4], [0.71, 0.45], [0.79, 0.55], [0.74, 0.66], [0.61, 0.72], [0.46, 0.74], [0.3, 0.69]],
  'Abu Dhabi': [[0.09, 0.57], [0.2, 0.47], [0.34, 0.43], [0.49, 0.45], [0.63, 0.41], [0.74, 0.47], [0.81, 0.57], [0.74, 0.68], [0.6, 0.74], [0.44, 0.75], [0.28, 0.7]]
};

const DRIVERS = [
  { name: 'Verstappen', pace: 95, qualifying: 95, tyre: 88, overtaking: 92, consistency: 90 },
  { name: 'Leclerc', pace: 92, qualifying: 94, tyre: 84, overtaking: 86, consistency: 84 },
  { name: 'Norris', pace: 90, qualifying: 89, tyre: 86, overtaking: 85, consistency: 87 },
  { name: 'Hamilton', pace: 89, qualifying: 88, tyre: 92, overtaking: 90, consistency: 91 },
  { name: 'Alonso', pace: 87, qualifying: 86, tyre: 91, overtaking: 88, consistency: 92 },
  { name: 'Sainz', pace: 86, qualifying: 88, tyre: 85, overtaking: 84, consistency: 86 },
  { name: 'Piastri', pace: 87, qualifying: 87, tyre: 84, overtaking: 83, consistency: 85 },
  { name: 'Russell', pace: 88, qualifying: 90, tyre: 85, overtaking: 84, consistency: 86 },
  { name: 'Gasly', pace: 82, qualifying: 82, tyre: 80, overtaking: 79, consistency: 80 },
  { name: 'Tsunoda', pace: 79, qualifying: 80, tyre: 77, overtaking: 79, consistency: 76 }
];

const UNKNOWN_DRIVER_BASE = {
  pace: 68,
  qualifying: 68,
  tyre: 68,
  overtaking: 68,
  consistency: 68
};

function buildCategoryParts(category, entries, baseStats) {
  const rarityBoost = { Common: 0, Rare: 3, Epic: 7, Legendary: 10 };
  return (entries || []).map((entry, index) => {
    const rarity = entry && entry.rarity ? entry.rarity : 'Common';
    const boost = (rarityBoost[rarity] || 0) + index;
    return {
      name: String(entry && entry.name ? entry.name : 'Part ' + (index + 1)),
      category,
      rarity,
      tempo: Number(baseStats.tempo || 0) + Math.round(boost * 0.8),
      kurven: Number(baseStats.kurven || 0) + Math.round(boost * 0.7),
      antrieb: Number(baseStats.antrieb || 0) + Math.round(boost * 0.9),
      quali: Number(baseStats.quali || 0) + Math.round(boost * 0.6),
      drs: Number(baseStats.drs || 0) + Math.round(boost * 0.5)
    };
  });
}

const PART_CATALOG = [
  ...buildCategoryParts('brakes', [
    { name: 'Pivot', rarity: 'Common' },
    { name: 'The Stabiliser', rarity: 'Common' },
    { name: 'Rumble', rarity: 'Rare' },
    { name: 'Flow 1K', rarity: 'Rare' },
    { name: 'Boombox', rarity: 'Epic' }
  ], { tempo: 12, kurven: 32, antrieb: 34, quali: 24, drs: 12 }),
  ...buildCategoryParts('gearbox', [
    { name: 'Hustle', rarity: 'Common' },
    { name: 'Fury', rarity: 'Rare' },
    { name: 'The Dynamo', rarity: 'Rare' },
    { name: 'The Beast', rarity: 'Rare' },
    { name: 'Metronome', rarity: 'Epic' }
  ], { tempo: 26, kurven: 18, antrieb: 56, quali: 24, drs: 30 }),
  ...buildCategoryParts('rear_wing', [
    { name: 'Motion', rarity: 'Common' },
    { name: 'Power Lift', rarity: 'Rare' },
    { name: 'Aero Blade', rarity: 'Rare' },
    { name: 'The Valkyrie', rarity: 'Epic' }
  ], { tempo: 28, kurven: 52, antrieb: 16, quali: 34, drs: 32 }),
  ...buildCategoryParts('front_wing', [
    { name: 'The Dash', rarity: 'Common' },
    { name: 'The Sabre', rarity: 'Rare' },
    { name: 'Curler', rarity: 'Rare' },
    { name: 'Flex XL', rarity: 'Epic' },
    { name: 'Vortex', rarity: 'Epic' }
  ], { tempo: 24, kurven: 58, antrieb: 14, quali: 36, drs: 28 }),
  ...buildCategoryParts('suspension', [
    { name: 'Swish', rarity: 'Common' },
    { name: 'Quantum', rarity: 'Rare' },
    { name: 'Gyro', rarity: 'Rare' },
    { name: 'Nexus', rarity: 'Epic' }
  ], { tempo: 14, kurven: 44, antrieb: 30, quali: 20, drs: 14 }),
  ...buildCategoryParts('engine', [
    { name: 'Mach I', rarity: 'Common' },
    { name: 'Mach II', rarity: 'Rare' },
    { name: 'Behemoth', rarity: 'Rare' },
    { name: 'Mach III', rarity: 'Epic' },
    { name: 'Turbo Jet', rarity: 'Epic' }
  ], { tempo: 54, kurven: 20, antrieb: 50, quali: 26, drs: 18 })
];

function byId(id) {
  return document.getElementById(id);
}

function getOptimizerMode() {
  try {
    const raw = String(localStorage.getItem(OPTIMIZER_MODE_KEY) || '').trim();
    if (raw === 'inventory_strict' || raw === 'meta_sim') return raw;
  } catch {}
  return 'inventory_meta';
}

function saveOptimizerMode(mode) {
  try {
    localStorage.setItem(OPTIMIZER_MODE_KEY, mode);
  } catch {}
}

function getBoostProfileId() {
  try {
    const raw = String(localStorage.getItem(BOOST_PROFILE_KEY) || '').trim();
    if (raw && CATEGORY_BOOST_PROFILES.some((entry) => entry.id === raw)) return raw;
  } catch {}
  return CATEGORY_BOOST_PROFILES[0] ? CATEGORY_BOOST_PROFILES[0].id : '';
}

function saveBoostProfileId(id) {
  try { localStorage.setItem(BOOST_PROFILE_KEY, String(id || '')); } catch {}
}

function getDriverBoostFocus() {
  try {
    const raw = String(localStorage.getItem(DRIVER_BOOST_FOCUS_KEY) || '').trim();
    if (['auto', 'balanced', 'pace', 'qualifying', 'tyre', 'overtaking', 'consistency'].includes(raw)) return raw;
  } catch {}
  return 'auto';
}

function saveDriverBoostFocus(focus) {
  try { localStorage.setItem(DRIVER_BOOST_FOCUS_KEY, String(focus || 'auto')); } catch {}
}

function getActiveBoostProfile() {
  const id = getBoostProfileId();
  return CATEGORY_BOOST_PROFILES.find((entry) => entry.id === id) || CATEGORY_BOOST_PROFILES[0] || null;
}

function loadAssignedDriverBoosts() {
  const parsed = readJsonSafeLite(DRIVER_ASSIGNED_BOOSTS_KEY, null);
  if (!parsed || typeof parsed !== 'object') return null;
  return parsed;
}

function getAssignedProfileForDriver(driverName) {
  const assigned = loadAssignedDriverBoosts();
  if (!assigned) return null;
  const entries = [assigned.a, assigned.b].filter(Boolean);
  for (const entry of entries) {
    if (String(entry.name || '').trim() !== String(driverName || '').trim()) continue;
    const profileId = String(entry.profileId || '').trim();
    const profile = CATEGORY_BOOST_PROFILES.find((item) => item.id === profileId);
    if (profile) return profile;
  }
  return null;
}

function getBoostFocusLabel(focus) {
  const map = {
    auto: 'Auto',
    balanced: 'Balanced',
    pace: 'Pace',
    qualifying: 'Qualifying',
    tyre: 'Tyre',
    overtaking: 'Overtaking',
    consistency: 'Consistency'
  };
  return map[String(focus || 'auto')] || 'Auto';
}

function fillBoostProfileSelect(select) {
  if (!select) return;
  select.innerHTML = '';
  CATEGORY_BOOST_PROFILES.forEach((profile) => {
    const option = document.createElement('option');
    option.value = profile.id;
    option.textContent = 'S' + profile.series + ' | ' + profile.medal + ' | +' + Number(profile.percent || 0).toFixed(1) + '%';
    select.appendChild(option);
  });

  const stored = getBoostProfileId();
  if (stored && CATEGORY_BOOST_PROFILES.some((profile) => profile.id === stored)) {
    select.value = stored;
  }
  if (!select.value && CATEGORY_BOOST_PROFILES[0]) {
    select.value = CATEGORY_BOOST_PROFILES[0].id;
  }
}

function getBoostProfileLabel(profile) {
  if (!profile) return '-';
  return 'S' + profile.series + ' ' + profile.medal + ' (+' + Number(profile.percent || 0).toFixed(1) + '%)';
}

function renderBoostProfileHint(profile, focus, setupBoostContext, suggestion) {
  const hint = byId('boostProfileHint');
  if (!hint) return;
  if (!profile) {
    hint.textContent = 'Kein Boost-Profil aktiv.';
    return;
  }

  const factors = setupBoostContext && setupBoostContext.factors
    ? setupBoostContext.factors
    : { pace: 0, qualifying: 0, tyre: 0, overtaking: 0, consistency: 0 };
  hint.textContent =
    'Aktiv: S' + profile.series + ' ' + profile.medal +
    ' | Seltenheit: ' + profile.rarity +
    ' | Fokus: ' + getBoostFocusLabel(focus) +
    ' | Fahrer-Delta P/Q/T/O/C: +' + factors.pace.toFixed(2) +
    '/+' + factors.qualifying.toFixed(2) +
    '/+' + factors.tyre.toFixed(2) +
    '/+' + factors.overtaking.toFixed(2) +
    '/+' + factors.consistency.toFixed(2) +
    (suggestion && suggestion.pairBest && suggestion.pairBest.profile
      ? ' | Empfehlung Pair: ' + getBoostProfileLabel(suggestion.pairBest.profile)
      : '');
}

function computeBoostSuggestionForPair(track, setupParts, pair, inventoryCtx, mode, focus) {
  if (!pair || !pair.a || !pair.b || !Array.isArray(setupParts) || !setupParts.length) return null;

  const catalog = getDriverCatalogLite();
  const driverA = catalog.find((entry) => entry.name === pair.a.name);
  const driverB = catalog.find((entry) => entry.name === pair.b.name);
  if (!driverA || !driverB) return null;

  const zeroContext = {
    profile: null,
    focus,
    factors: { pace: 0, qualifying: 0, tyre: 0, overtaking: 0, consistency: 0 }
  };

  const baseA = scoreDriverForTrack(driverA, track, inventoryCtx, mode, zeroContext).effective;
  const baseB = scoreDriverForTrack(driverB, track, inventoryCtx, mode, zeroContext).effective;

  let bestA = null;
  let bestB = null;
  let pairBest = null;
  let pairBestAny = null;

  const rarityA = getDriverRarityLite(driverA);
  const rarityB = getDriverRarityLite(driverB);

  CATEGORY_BOOST_PROFILES.forEach((profile) => {
    const context = computeSetupDriverBoostContext(track, setupParts, profile, focus);
    const scoredA = scoreDriverForTrack(driverA, track, inventoryCtx, mode, context).effective;
    const scoredB = scoreDriverForTrack(driverB, track, inventoryCtx, mode, context).effective;
    const deltaA = scoredA - baseA;
    const deltaB = scoredB - baseB;
    const pairDelta = deltaA + deltaB;

    const profileRarity = String(profile && profile.rarity || 'None');
    const rarityMatchA = profileRarity !== 'None' && profileRarity === rarityA;
    const rarityMatchB = profileRarity !== 'None' && profileRarity === rarityB;

    const evalA = deltaA + (rarityMatchA ? 0.35 : 0);
    const evalB = deltaB + (rarityMatchB ? 0.35 : 0);
    const evalPair = pairDelta + (rarityMatchA ? 0.22 : 0) + (rarityMatchB ? 0.22 : 0);

    if (!bestA || evalA > bestA.eval) bestA = { profile, delta: deltaA, eval: evalA, rarityMatch: rarityMatchA };
    if (!bestB || evalB > bestB.eval) bestB = { profile, delta: deltaB, eval: evalB, rarityMatch: rarityMatchB };
    const pairCandidate = {
      profile,
      delta: pairDelta,
      eval: evalPair,
      rarityMatchA,
      rarityMatchB,
      rarityHits: Number(rarityMatchA) + Number(rarityMatchB)
    };

    if (!pairBestAny || pairCandidate.eval > pairBestAny.eval) {
      pairBestAny = pairCandidate;
    }

    if (pairCandidate.rarityHits >= 1 && (!pairBest || pairCandidate.eval > pairBest.eval)) {
      pairBest = {
        profile,
        delta: pairDelta,
        eval: evalPair,
        rarityMatchA,
        rarityMatchB,
        rarityHits: Number(rarityMatchA) + Number(rarityMatchB)
      };
    }
  });

  const pairUsedFallback = !pairBest;
  const resolvedPairBest = pairBest || pairBestAny;

  return {
    baseA,
    baseB,
    bestA,
    bestB,
    pairBest: resolvedPairBest,
    pairUsedFallback
  };
}

function saveTrackState(select) {
  const value = String(select.value || '').trim();
  if (!value) return;
  try {
    localStorage.setItem(TRACK_SELECTION_KEY, value);
    localStorage.setItem(TRACK_SELECTION_INDEX_KEY, String(select.selectedIndex));
    localStorage.setItem(
      TRACK_SELECTION_OPTIONS_KEY,
      JSON.stringify(Array.from(select.options).map((option) => option.value).filter(Boolean))
    );
  } catch {}
}

function loadStoredTrack() {
  try {
    return String(localStorage.getItem(TRACK_SELECTION_KEY) || '').trim();
  } catch {
    return '';
  }
}

function fillTrackSelect(select) {
  select.innerHTML = '';
  TRACKS.forEach((track) => {
    const option = document.createElement('option');
    option.value = track.name;
    option.textContent = track.name;
    select.appendChild(option);
  });

  const stored = loadStoredTrack();
  if (stored && TRACKS.some((track) => track.name === stored)) {
    select.value = stored;
  }
  if (!select.value && TRACKS[0]) {
    select.value = TRACKS[0].name;
  }
  saveTrackState(select);
}

function updateBadge(select) {
  const badge = byId('selectedTrackBadge');
  if (!badge) return;
  const value = String(select.value || '').trim() || '-';
  badge.textContent = 'Aktuelle Strecke: ' + value;
}

function getTrack(name) {
  return TRACKS.find((track) => track.name === name) || TRACKS[0];
}

function readJsonSafeLite(key, fallbackValue) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallbackValue;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function getActiveProfileIdLocalLite() {
  const profile = readJsonSafeLite(REGISTRATION_KEY, null);
  if (profile && typeof profile === 'object' && profile.clashId) {
    return String(profile.clashId);
  }
  try {
    return String(localStorage.getItem(ACTIVE_PROFILE_KEY) || 'guest');
  } catch {
    return 'guest';
  }
}

function driverStageStorageKeyLite() {
  return 'driverStage_' + getActiveProfileIdLocalLite();
}

function parseStageNumberFromAny(raw) {
  const text = String(raw || 'S1');
  const match = text.match(/^S(\d{1,2})$/i);
  const value = match ? Number(match[1]) : Number(text);
  return clamp(Number.isFinite(value) ? value : 1, 1, 12);
}

function loadDriverStageMapLite() {
  return readJsonSafeLite(driverStageStorageKeyLite(), {});
}

function normalizeDriverNameLite(value) {
  return String(value || '').trim();
}

function normalizeDriverStatsLite(source, fallback) {
  const base = fallback || UNKNOWN_DRIVER_BASE;
  return {
    pace: clamp(Number(source && source.pace || base.pace), 1, 120),
    qualifying: clamp(Number(source && source.qualifying || base.qualifying), 1, 120),
    tyre: clamp(Number(source && source.tyre || base.tyre), 1, 120),
    overtaking: clamp(Number(source && source.overtaking || base.overtaking), 1, 120),
    consistency: clamp(Number(source && source.consistency || base.consistency), 1, 120)
  };
}

function loadDriverSnapshotLite() {
  const parsed = readJsonSafeLite(DRIVER_CATALOG_SNAPSHOT_KEY, []);
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter((entry) => entry && typeof entry === 'object' && !Array.isArray(entry))
    .map((entry) => {
      const name = normalizeDriverNameLite(entry.name);
      if (!name) return null;
      return {
        name,
        rarity: normalizeDriverNameLite(entry.rarity || 'Common') || 'Common',
        ...normalizeDriverStatsLite(entry, UNKNOWN_DRIVER_BASE)
      };
    })
    .filter(Boolean);
}

function buildUnknownDriverFromNameLite(name) {
  const clean = normalizeDriverNameLite(name);
  let hash = 0;
  for (let i = 0; i < clean.length; i += 1) {
    hash = ((hash << 5) - hash) + clean.charCodeAt(i);
    hash |= 0;
  }
  const spread = Math.abs(hash % 8);
  const base = {
    pace: UNKNOWN_DRIVER_BASE.pace + (spread % 4),
    qualifying: UNKNOWN_DRIVER_BASE.qualifying + ((spread + 1) % 4),
    tyre: UNKNOWN_DRIVER_BASE.tyre + ((spread + 2) % 4),
    overtaking: UNKNOWN_DRIVER_BASE.overtaking + ((spread + 3) % 4),
    consistency: UNKNOWN_DRIVER_BASE.consistency + ((spread + 1) % 4)
  };
  return {
    name: clean,
    rarity: 'Common',
    ...normalizeDriverStatsLite(base, UNKNOWN_DRIVER_BASE)
  };
}

function getDriverCatalogLite() {
  const baseCatalog = DRIVERS.map((driver) => ({
    name: normalizeDriverNameLite(driver.name),
    rarity: normalizeDriverNameLite(driver.rarity || DRIVER_RARITY_BY_NAME[driver.name] || 'Common') || 'Common',
    ...normalizeDriverStatsLite(driver, UNKNOWN_DRIVER_BASE)
  }));
  const map = new Map(baseCatalog.map((driver) => [driver.name, driver]));

  loadDriverSnapshotLite().forEach((driver) => {
    if (!map.has(driver.name)) {
      map.set(driver.name, driver);
      return;
    }
    const existing = map.get(driver.name);
    map.set(driver.name, {
      ...existing,
      rarity: normalizeDriverNameLite(existing.rarity || driver.rarity || 'Common') || 'Common',
      ...normalizeDriverStatsLite(existing, driver)
    });
  });

  const stageMap = loadDriverStageMapLite();
  Object.keys(stageMap || {}).forEach((name) => {
    const clean = normalizeDriverNameLite(name);
    if (!clean || map.has(clean)) return;
    map.set(clean, buildUnknownDriverFromNameLite(clean));
  });

  const selected = loadSelectedDriverPairLite();
  [selected && selected.a, selected && selected.b].forEach((name) => {
    const clean = normalizeDriverNameLite(name);
    if (!clean || map.has(clean)) return;
    map.set(clean, buildUnknownDriverFromNameLite(clean));
  });

  return Array.from(map.values());
}

function getDriverRarityLite(driver) {
  if (!driver || typeof driver !== 'object') return 'Common';
  const byName = normalizeDriverNameLite(DRIVER_RARITY_BY_NAME[driver.name]);
  if (byName) return byName;
  const byField = normalizeDriverNameLite(driver.rarity);
  return byField || 'Common';
}

function renderDriverCatalogStatusLite() {
  const node = byId('driverCatalogStatus');
  if (!node) return;

  const catalog = getDriverCatalogLite();
  const stageMap = loadDriverStageMapLite();
  const stageCount = Object.keys(stageMap || {})
    .map((name) => normalizeDriverNameLite(name))
    .filter(Boolean)
    .length;

  const currentCount = Number(catalog.length || 0);
  const previousCountRaw = sessionStorage.getItem(DRIVER_CATALOG_LAST_COUNT_KEY);
  const previousCount = Number.isFinite(Number(previousCountRaw)) ? Number(previousCountRaw) : null;
  const hasChanged = previousCount != null && previousCount !== currentCount;

  if (hasChanged) {
    node.style.color = '#ffd166';
    node.textContent =
      'Fahrerliste auto-synchronisiert: ' + currentCount +
      ' Fahrer im Optimizer (geaendert: ' + previousCount + ' -> ' + currentCount + ')' +
      ' | Fahrerlager-Eintraege: ' + stageCount;
  } else {
    node.style.color = '';
    node.textContent =
      'Fahrerliste auto-synchronisiert: ' + currentCount +
      ' Fahrer im Optimizer | Fahrerlager-Eintraege: ' + stageCount;
  }

  try {
    sessionStorage.setItem(DRIVER_CATALOG_LAST_COUNT_KEY, String(currentCount));
  } catch {}
}

function loadCommunityDriverBoostMap(trackName) {
  const knowledge = readJsonSafeLite(COMMUNITY_KNOWLEDGE_KEY, {});
  const trackCfg = knowledge && knowledge.tracks && knowledge.tracks[trackName];
  const rawBoosts = trackCfg && typeof trackCfg.driverBoosts === 'object' ? trackCfg.driverBoosts : {};
  return Object.fromEntries(
    Object.entries(rawBoosts).map(([name, val]) => [String(name), Number(val) || 0])
  );
}

function loadCommunityPartBoostMap(trackName) {
  const knowledge = readJsonSafeLite(COMMUNITY_KNOWLEDGE_KEY, {});
  const trackCfg = knowledge && knowledge.tracks && knowledge.tracks[trackName];
  const rawBoosts = trackCfg && typeof trackCfg.partBoosts === 'object' ? trackCfg.partBoosts : {};
  return Object.fromEntries(
    Object.entries(rawBoosts).map(([name, val]) => [String(name), Number(val) || 0])
  );
}

function loadOwnedPartsLite() {
  try {
    const raw = localStorage.getItem('ownedParts');
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map((name) => String(name)) : [];
  } catch {
    return [];
  }
}

function partMetaStorageKeyLite() {
  return 'partMeta_' + getActiveProfileIdLocalLite();
}

function manualSetupStorageKeyLite() {
  return 'manualSetup_' + String(new Date().getFullYear());
}

function loadSelectedSetupForTrackLite(trackName) {
  const map = readJsonSafeLite(manualSetupStorageKeyLite(), {});
  const setup = map && typeof map === 'object' ? map[trackName] : null;
  if (!setup || typeof setup !== 'object') return null;

  const normalized = {};
  PART_CATEGORIES.forEach((category) => {
    const value = String(setup[category] || '').trim();
    if (value) normalized[category] = value;
  });
  return normalized;
}

function buildSelectedSetupResult(track, mode) {
  const selected = loadSelectedSetupForTrackLite(track.name);
  if (!selected) {
    return { hasSetup: false, missingCategories: [...PART_CATEGORIES], names: [], pickedParts: [], score: 0 };
  }

  const partMetaMap = loadPartMetaMapLite();
  const partBoostMap = loadCommunityPartBoostMap(track.name);
  const pickedParts = [];
  const missingCategories = [];

  PART_CATEGORIES.forEach((category) => {
    const partName = String(selected[category] || '').trim();
    const part = PART_CATALOG.find((entry) => entry.category === category && entry.name === partName);
    if (part) pickedParts.push(part);
    else missingCategories.push(category);
  });

  if (pickedParts.length !== PART_CATEGORIES.length) {
    return {
      hasSetup: false,
      missingCategories,
      names: pickedParts.map((part) => part.name),
      pickedParts,
      score: 0
    };
  }

  const weights = getTrackWeightsLite(track);
  const effectiveStats = sumEffectiveStats(pickedParts, partMetaMap);
  const score = scoreStatsLite(effectiveStats, weights) +
    setupSynergyBonusLite(pickedParts, effectiveStats) +
    pickedParts.reduce((sum, part) => sum + Number(partBoostMap[part.name] || 0), 0);

  return {
    hasSetup: true,
    missingCategories: [],
    names: pickedParts.map((part) => part.name),
    pickedParts,
    score,
    mode: mode || 'inventory_meta'
  };
}

function loadPartMetaMapLite() {
  return readJsonSafeLite(partMetaStorageKeyLite(), {});
}

function getPartEffectiveStatsLite(part, partMetaMap) {
  const meta = partMetaMap && partMetaMap[part.name] ? partMetaMap[part.name] : {};
  const level = clamp(Number(meta.level || 1), 1, 12);
  const mod = Number(meta.mod || 0);
  const levelBoost = 1 + (level - 1) * 0.018;
  const modBoost = 1 + mod * 0.01;
  const boost = levelBoost * modBoost;
  return {
    tempo: part.tempo * boost,
    kurven: part.kurven * boost,
    antrieb: part.antrieb * boost,
    quali: part.quali * boost,
    drs: part.drs * boost
  };
}

function getTrackWeightsLite(track) {
  const raw = {
    tempo: Number(track.speed || 0),
    kurven: Number(track.corners || 0),
    antrieb: clamp(Math.round(Number(track.speed || 0) * 0.45 + Number(track.wear || 0) * 28), 35, 95),
    quali: clamp(Math.round(Number(track.corners || 0) * 0.58 + Number(track.speed || 0) * 0.2), 35, 95),
    drs: Number(track.drs || 0)
  };
  const sum = STAT_KEYS.reduce((acc, key) => acc + raw[key], 0) || 1;
  return Object.fromEntries(STAT_KEYS.map((key) => [key, raw[key] / sum]));
}

function scoreStatsLite(stats, weights) {
  return STAT_KEYS.reduce((acc, key) => acc + Number(stats[key] || 0) * Number(weights[key] || 0), 0);
}

function setupSynergyBonusLite(parts, effectiveStats) {
  const avg = STAT_KEYS.reduce((s, k) => s + Number(effectiveStats[k] || 0), 0) / STAT_KEYS.length;
  const variance = STAT_KEYS.reduce((s, k) => s + Math.pow(Number(effectiveStats[k] || 0) - avg, 2), 0) / STAT_KEYS.length;
  const rarityCount = parts.reduce((acc, part) => {
    const rarity = String(part.rarity || 'Common');
    acc[rarity] = (acc[rarity] || 0) + 1;
    return acc;
  }, {});
  const uniformityBonus = Object.values(rarityCount).some((v) => v >= 4) ? 1.8 : 0;
  return Math.max(0, 10 - Math.sqrt(variance) * 0.16) + uniformityBonus;
}

function sumEffectiveStats(parts, partMetaMap) {
  return parts.reduce((acc, part) => {
    const eff = getPartEffectiveStatsLite(part, partMetaMap);
    STAT_KEYS.forEach((key) => {
      acc[key] = Number(acc[key] || 0) + Number(eff[key] || 0);
    });
    return acc;
  }, { tempo: 0, kurven: 0, antrieb: 0, quali: 0, drs: 0 });
}

function optimizeSetupFromInventory(track, mode) {
  const ownedSet = new Set(loadOwnedPartsLite());
  const partMetaMap = loadPartMetaMapLite();
  const partBoostMap = loadCommunityPartBoostMap(track.name);
  const weights = getTrackWeightsLite(track);
  const activeMode = mode || 'inventory_meta';

  const picks = {};
  const missingCategories = [];

  PART_CATEGORIES.forEach((category) => {
    const pool = PART_CATALOG.filter((part) => {
      if (part.category !== category) return false;
      if (activeMode === 'meta_sim') return true;
      return ownedSet.has(part.name);
    });
    if (!pool.length) {
      missingCategories.push(category);
      return;
    }

    let bestPart = null;
    let bestScore = -Infinity;
    pool.forEach((part) => {
      const eff = getPartEffectiveStatsLite(part, partMetaMap);
      const score = scoreStatsLite(eff, weights) + Number(partBoostMap[part.name] || 0) * 7;
      if (score > bestScore) {
        bestScore = score;
        bestPart = part;
      }
    });

    picks[category] = bestPart;
  });

  const pickedParts = PART_CATEGORIES.map((category) => picks[category]).filter(Boolean);
  if (!pickedParts.length) {
    return {
      hasSetup: false,
      missingCategories,
      score: 0,
      names: [],
      pickedParts: [],
      metaComparison: null
    };
  }

  const effectiveStats = sumEffectiveStats(pickedParts, partMetaMap);
  const trackScore = scoreStatsLite(effectiveStats, weights);
  const synergy = setupSynergyBonusLite(pickedParts, effectiveStats);
  const metaBonus = pickedParts.reduce((sum, part) => sum + Number(partBoostMap[part.name] || 0), 0);
  const totalScore = trackScore + synergy + metaBonus;

  const metaSuggestedParts = PART_CATALOG
    .filter((part) => Number(partBoostMap[part.name] || 0) > 0)
    .sort((a, b) => Number(partBoostMap[b.name] || 0) - Number(partBoostMap[a.name] || 0));
  const metaByCategory = {};
  metaSuggestedParts.forEach((part) => {
    if (!metaByCategory[part.category]) metaByCategory[part.category] = part;
  });

  const metaParts = PART_CATEGORIES.map((category) => metaByCategory[category]).filter(Boolean);
  const metaOwnedCount = metaParts.filter((part) => ownedSet.has(part.name)).length;
  const missingMetaParts = metaParts.filter((part) => !ownedSet.has(part.name)).map((part) => part.name);

  let metaScore = 0;
  if (metaParts.length === PART_CATEGORIES.length) {
    const metaStats = sumEffectiveStats(metaParts, partMetaMap);
    metaScore = scoreStatsLite(metaStats, weights) + setupSynergyBonusLite(metaParts, metaStats) +
      metaParts.reduce((sum, part) => sum + Number(partBoostMap[part.name] || 0), 0);
  }

  return {
    hasSetup: true,
    missingCategories,
    score: totalScore,
    names: pickedParts.map((part) => part.name),
    pickedParts,
    metaComparison: {
      metaKnown: metaParts.length > 0,
      metaOwnedCount,
      metaTargetCount: metaParts.length,
      metaScore,
      gapToMeta: metaScore > 0 ? (totalScore - metaScore) : 0,
      missingMetaParts,
      mode: activeMode
    },
    mode: activeMode
  };
}

function buildInventoryDriverContext(track) {
  const catalog = getDriverCatalogLite();
  const stageMap = loadDriverStageMapLite();
  const ownedNameSet = new Set(
    Object.entries(stageMap)
      .filter(([, value]) => {
        const stage = parseStageNumberFromAny(value && value.stage);
        return stage >= 1;
      })
      .map(([name]) => String(name).trim())
      .filter(Boolean)
  );

  const ownedInCatalog = catalog.filter((driver) => ownedNameSet.has(driver.name));
  const communityBoostMap = loadCommunityDriverBoostMap(track.name);

  return {
    stageMap,
    ownedNameSet,
    ownedInCatalog,
    hasOwnedInCatalog: ownedInCatalog.length > 0,
    communityBoostMap,
    hasCommunityMeta: Object.keys(communityBoostMap).length > 0
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function buildTrackRequirement(track) {
  const wearScaled = clamp(Math.round(track.wear * 70), 45, 95);
  const paceWeight = clamp(Math.round(track.speed * 0.5 + track.drs * 0.35), 45, 95);
  const qualifyingWeight = clamp(Math.round(track.corners * 0.55 + track.speed * 0.25), 45, 95);
  const tyreWeight = clamp(Math.round(wearScaled * 0.75 + track.corners * 0.25), 45, 95);
  const overtakingWeight = clamp(Math.round(track.drs * 0.55 + track.speed * 0.3), 45, 95);
  const consistencyWeight = clamp(Math.round(track.corners * 0.45 + wearScaled * 0.35), 45, 95);

  return {
    paceWeight,
    qualifyingWeight,
    tyreWeight,
    overtakingWeight,
    consistencyWeight,
    wearScaled
  };
}

function computeFocusFactors(track, focus) {
  if (focus === 'pace') return { pace: 1.25, qualifying: 0.88, tyre: 0.88, overtaking: 1.1, consistency: 0.9 };
  if (focus === 'qualifying') return { pace: 0.95, qualifying: 1.25, tyre: 0.9, overtaking: 0.95, consistency: 1.05 };
  if (focus === 'tyre') return { pace: 0.9, qualifying: 0.9, tyre: 1.28, overtaking: 0.92, consistency: 1.1 };
  if (focus === 'overtaking') return { pace: 1.08, qualifying: 0.9, tyre: 0.92, overtaking: 1.3, consistency: 0.92 };
  if (focus === 'consistency') return { pace: 0.9, qualifying: 1.03, tyre: 1.05, overtaking: 0.9, consistency: 1.28 };
  if (focus === 'balanced') return { pace: 1, qualifying: 1, tyre: 1, overtaking: 1, consistency: 1 };

  const req = buildTrackRequirement(track);
  const sum = req.paceWeight + req.qualifyingWeight + req.tyreWeight + req.overtakingWeight + req.consistencyWeight || 1;
  const base = {
    pace: req.paceWeight / sum,
    qualifying: req.qualifyingWeight / sum,
    tyre: req.tyreWeight / sum,
    overtaking: req.overtakingWeight / sum,
    consistency: req.consistencyWeight / sum
  };
  const avg = (base.pace + base.qualifying + base.tyre + base.overtaking + base.consistency) / 5;
  return {
    pace: clamp(0.84 + (base.pace / avg) * 0.22, 0.84, 1.28),
    qualifying: clamp(0.84 + (base.qualifying / avg) * 0.22, 0.84, 1.28),
    tyre: clamp(0.84 + (base.tyre / avg) * 0.22, 0.84, 1.28),
    overtaking: clamp(0.84 + (base.overtaking / avg) * 0.22, 0.84, 1.28),
    consistency: clamp(0.84 + (base.consistency / avg) * 0.22, 0.84, 1.28)
  };
}

function computeSetupDriverBoostContext(track, setupParts, profile, focus) {
  const empty = {
    profile,
    focus,
    factors: { pace: 0, qualifying: 0, tyre: 0, overtaking: 0, consistency: 0 },
    totalMagnitude: 0,
    profileMultiplier: 1
  };
  if (!profile || !Array.isArray(setupParts) || !setupParts.length) return empty;

  const partMetaMap = loadPartMetaMapLite();
  const trackWeights = getTrackWeightsLite(track);
  const focusFactors = computeFocusFactors(track, focus);
  const profileMultiplier = 1 + (Number(profile.percent || 0) / 100) * 0.12;

  const totals = { pace: 0, qualifying: 0, tyre: 0, overtaking: 0, consistency: 0 };
  setupParts.forEach((part) => {
    const effective = getPartEffectiveStatsLite(part, partMetaMap);
    const categoryScore = scoreStatsLite(effective, trackWeights);
    const normalizedCategoryScore = clamp(categoryScore / 120, 0, 5);
    const affinity = CATEGORY_DRIVER_AFFINITY[part.category] || CATEGORY_DRIVER_AFFINITY.engine;
    totals.pace += normalizedCategoryScore * Number(affinity.pace || 0);
    totals.qualifying += normalizedCategoryScore * Number(affinity.qualifying || 0);
    totals.tyre += normalizedCategoryScore * Number(affinity.tyre || 0);
    totals.overtaking += normalizedCategoryScore * Number(affinity.overtaking || 0);
    totals.consistency += normalizedCategoryScore * Number(affinity.consistency || 0);
  });

  const scaled = {
    pace: totals.pace * 1.6 * focusFactors.pace * profileMultiplier,
    qualifying: totals.qualifying * 1.6 * focusFactors.qualifying * profileMultiplier,
    tyre: totals.tyre * 1.6 * focusFactors.tyre * profileMultiplier,
    overtaking: totals.overtaking * 1.6 * focusFactors.overtaking * profileMultiplier,
    consistency: totals.consistency * 1.6 * focusFactors.consistency * profileMultiplier
  };

  return {
    profile,
    focus,
    factors: scaled,
    totalMagnitude: scaled.pace + scaled.qualifying + scaled.tyre + scaled.overtaking + scaled.consistency,
    profileMultiplier
  };
}

function scoreDriverForTrack(driver, track, inventoryCtx, mode, setupBoostContext) {
  const req = buildTrackRequirement(track);
  const weightedScore =
    driver.pace * (req.paceWeight / 100) +
    driver.qualifying * (req.qualifyingWeight / 100) +
    driver.tyre * (req.tyreWeight / 100) +
    driver.overtaking * (req.overtakingWeight / 100) +
    driver.consistency * (req.consistencyWeight / 100);

  const baseScore = weightedScore / 3.65;
  const activeMode = mode || 'inventory_meta';
  const stage = parseStageNumberFromAny(inventoryCtx && inventoryCtx.stageMap && inventoryCtx.stageMap[driver.name] && inventoryCtx.stageMap[driver.name].stage);
  const stageBoost = activeMode === 'meta_sim' ? 1 : (1 + (stage - 1) * 0.013);
  const isOwned = Boolean(inventoryCtx && inventoryCtx.ownedNameSet && inventoryCtx.ownedNameSet.has(driver.name));
  const communityBoost = Number(inventoryCtx && inventoryCtx.communityBoostMap && inventoryCtx.communityBoostMap[driver.name]) || 0;

  const boostFactors = setupBoostContext && setupBoostContext.factors
    ? setupBoostContext.factors
    : { pace: 0, qualifying: 0, tyre: 0, overtaking: 0, consistency: 0 };
  const profileRarity = String(setupBoostContext && setupBoostContext.profile && setupBoostContext.profile.rarity || '').trim();
  const driverRarity = getDriverRarityLite(driver);
  const rarityFactor = profileRarity && profileRarity !== 'None' && profileRarity === driverRarity ? 1.12 : 1;

  const boostedDriver = {
    pace: driver.pace + boostFactors.pace * rarityFactor,
    qualifying: driver.qualifying + boostFactors.qualifying * rarityFactor,
    tyre: driver.tyre + boostFactors.tyre * rarityFactor,
    overtaking: driver.overtaking + boostFactors.overtaking * rarityFactor,
    consistency: driver.consistency + boostFactors.consistency * rarityFactor
  };

  const boostedWeighted =
    boostedDriver.pace * (req.paceWeight / 100) +
    boostedDriver.qualifying * (req.qualifyingWeight / 100) +
    boostedDriver.tyre * (req.tyreWeight / 100) +
    boostedDriver.overtaking * (req.overtakingWeight / 100) +
    boostedDriver.consistency * (req.consistencyWeight / 100);

  const setupBoostScore = (boostedWeighted - weightedScore) / 3.65;

  let effective = (baseScore + setupBoostScore) * stageBoost + communityBoost * 3.2;
  if (activeMode === 'inventory_strict') {
    if (!isOwned) effective -= 30;
    else effective += 5.6;
  } else if (activeMode === 'inventory_meta') {
    if (isOwned) effective += 4.5;
    if (!isOwned && inventoryCtx && inventoryCtx.hasOwnedInCatalog) effective -= 2.8;
  }

  return {
    effective,
    baseScore,
    stage,
    stageBoost,
    isOwned,
    communityBoost,
    setupBoostScore
  };
}

function rankDriversForTrack(track, inventoryCtx, mode, setupBoostContext) {
  return getDriverCatalogLite()
    .map((driver) => {
      const scoreData = scoreDriverForTrack(driver, track, inventoryCtx, mode, setupBoostContext);
      return {
        name: driver.name,
        score: scoreData.effective,
        raw: driver,
        baseScore: scoreData.baseScore,
        stage: scoreData.stage,
        stageBoost: scoreData.stageBoost,
        isOwned: scoreData.isOwned,
        communityBoost: scoreData.communityBoost,
        setupBoostScore: scoreData.setupBoostScore
      };
    })
    .sort((a, b) => b.score - a.score);
}

function computeBestPair(track, mode, setupBoostContext) {
  let best = null;
  const inventoryCtx = buildInventoryDriverContext(track);
  const activeMode = mode || 'inventory_meta';
  const ranked = rankDriversForTrack(track, inventoryCtx, activeMode, setupBoostContext);

  for (let i = 0; i < ranked.length; i += 1) {
    for (let j = i + 1; j < ranked.length; j += 1) {
      const a = ranked[i];
      const b = ranked[j];
      const synergy = ((a.raw.tyre + b.raw.tyre + a.raw.consistency + b.raw.consistency) / 4) * 0.12;
      const ownedPairBonus = activeMode === 'inventory_strict'
        ? (a.isOwned && b.isOwned ? 3.1 : -6.5)
        : (a.isOwned && b.isOwned ? 2.2 : (a.isOwned || b.isOwned ? 0.9 : 0));
      const metaPairBonus = (a.communityBoost + b.communityBoost) * 1.7;
      const pairScore = (a.score + b.score) / 2 + synergy + ownedPairBonus + metaPairBonus;
      if (!best || pairScore > best.score) {
        best = { a, b, score: pairScore, synergy, ownedPairBonus, metaPairBonus };
      }
    }
  }

  return { best, ranked, inventoryCtx, mode: activeMode };
}

function loadSelectedDriverPairLite() {
  const parsed = readJsonSafeLite(DRIVER_PAIR_SELECTION_KEY, null);
  if (!parsed || typeof parsed !== 'object') return null;
  const a = String(parsed.a || '').trim();
  const b = String(parsed.b || '').trim();
  if (!a || !b || a === b) return null;
  return {
    a,
    b,
    source: String(parsed.source || 'manual').trim() || 'manual'
  };
}

function saveSelectedDriverPairLite(a, b, source) {
  const aName = String(a || '').trim();
  const bName = String(b || '').trim();
  if (!aName || !bName || aName === bName) {
    try { localStorage.removeItem(DRIVER_PAIR_SELECTION_KEY); } catch {}
    return;
  }

  try {
    localStorage.setItem(DRIVER_PAIR_SELECTION_KEY, JSON.stringify({
      a: aName,
      b: bName,
      source: String(source || 'manual').trim() || 'manual'
    }));
  } catch {}
}

function fillDriverSelectLite(select) {
  if (!select) return;
  const current = String(select.value || '').trim();
  select.innerHTML = '';

  const autoOption = document.createElement('option');
  autoOption.value = '';
  autoOption.textContent = 'Auto (KI-Paarung)';
  select.appendChild(autoOption);

  getDriverCatalogLite()
    .map((driver) => driver.name)
    .sort((a, b) => a.localeCompare(b, 'de', { sensitivity: 'base' }))
    .forEach((name) => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      select.appendChild(option);
    });

  if (current && Array.from(select.options).some((option) => option.value === current)) {
    select.value = current;
  }
}

function syncDriverPairSelectionFromUi(selectA, selectB) {
  if (!selectA || !selectB) return;
  const a = String(selectA.value || '').trim();
  const b = String(selectB.value || '').trim();
  saveSelectedDriverPairLite(a, b, 'manual');
}

function initDriverPairSelectors(selectA, selectB, onChange) {
  if (!selectA || !selectB) return;

  let lastDriverSignature = '';
  const refreshDriverPairOptions = () => {
    const currentA = String(selectA.value || '').trim();
    const currentB = String(selectB.value || '').trim();
    const selectedPair = loadSelectedDriverPairLite();
    const signature = getDriverCatalogLite()
      .map((driver) => driver.name)
      .sort((a, b) => a.localeCompare(b, 'de', { sensitivity: 'base' }))
      .join('|');

    if (signature === lastDriverSignature && currentA && currentB) return;

    fillDriverSelectLite(selectA);
    fillDriverSelectLite(selectB);

    const targetA = currentA || (selectedPair && selectedPair.a) || '';
    const targetB = currentB || (selectedPair && selectedPair.b) || '';

    if (targetA && Array.from(selectA.options).some((option) => option.value === targetA)) {
      selectA.value = targetA;
    }
    if (targetB && Array.from(selectB.options).some((option) => option.value === targetB)) {
      selectB.value = targetB;
    }

    if (selectA.value && selectA.value === selectB.value) {
      selectB.value = '';
    }

    lastDriverSignature = signature;
    syncDriverPairSelectionFromUi(selectA, selectB);
    renderDriverCatalogStatusLite();
  };

  refreshDriverPairOptions();

  const handleSelectChange = (changedSelect, otherSelect) => {
    const changedValue = String(changedSelect.value || '').trim();
    const otherValue = String(otherSelect.value || '').trim();
    if (changedValue && changedValue === otherValue) {
      otherSelect.value = '';
    }

    syncDriverPairSelectionFromUi(selectA, selectB);
    if (typeof onChange === 'function') onChange();
  };

  selectA.addEventListener('change', () => handleSelectChange(selectA, selectB));
  selectB.addEventListener('change', () => handleSelectChange(selectB, selectA));

  window.addEventListener('focus', refreshDriverPairOptions);
  window.addEventListener('storage', (event) => {
    const key = String(event && event.key || '');
    if (!key) return;
    const watchKeys = new Set([
      driverStageStorageKeyLite(),
      DRIVER_CATALOG_SNAPSHOT_KEY,
      DRIVER_PAIR_SELECTION_KEY
    ]);
    if (watchKeys.has(key)) refreshDriverPairOptions();
  });

  const resetButton = byId('resetDriverPairButton');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      selectA.value = '';
      selectB.value = '';
      saveSelectedDriverPairLite('', '', 'manual');
      if (typeof onChange === 'function') onChange();
    });
  }
}

function computeSelectedPair(track, inventoryCtx, mode, setupBoostContext, setupParts, focus) {
  const selected = loadSelectedDriverPairLite();
  if (!selected) return null;

  const catalog = getDriverCatalogLite();
  const aDriver = catalog.find((driver) => driver.name === selected.a);
  const bDriver = catalog.find((driver) => driver.name === selected.b);
  if (!aDriver || !bDriver) return null;

  const activeMode = mode || 'inventory_meta';
  const assignedAProfile = getAssignedProfileForDriver(aDriver.name);
  const assignedBProfile = getAssignedProfileForDriver(bDriver.name);
  const aBoostContext = assignedAProfile
    ? computeSetupDriverBoostContext(track, setupParts || [], assignedAProfile, focus || 'auto')
    : setupBoostContext;
  const bBoostContext = assignedBProfile
    ? computeSetupDriverBoostContext(track, setupParts || [], assignedBProfile, focus || 'auto')
    : setupBoostContext;

  const aScoreData = scoreDriverForTrack(aDriver, track, inventoryCtx, activeMode, aBoostContext);
  const bScoreData = scoreDriverForTrack(bDriver, track, inventoryCtx, activeMode, bBoostContext);
  const synergy = ((aDriver.tyre + bDriver.tyre + aDriver.consistency + bDriver.consistency) / 4) * 0.12;
  const ownedPairBonus = activeMode === 'inventory_strict'
    ? (aScoreData.isOwned && bScoreData.isOwned ? 3.1 : -6.5)
    : (aScoreData.isOwned && bScoreData.isOwned ? 2.2 : (aScoreData.isOwned || bScoreData.isOwned ? 0.9 : 0));
  const metaPairBonus = (aScoreData.communityBoost + bScoreData.communityBoost) * 1.7;
  const score = ((aScoreData.effective + bScoreData.effective) / 2) + synergy + ownedPairBonus + metaPairBonus;

  return {
    a: {
      name: aDriver.name,
      raw: aDriver,
      score: aScoreData.effective,
      isOwned: aScoreData.isOwned,
      communityBoost: aScoreData.communityBoost,
      setupBoostScore: aScoreData.setupBoostScore,
      assignedBoostProfile: assignedAProfile
    },
    b: {
      name: bDriver.name,
      raw: bDriver,
      score: bScoreData.effective,
      isOwned: bScoreData.isOwned,
      communityBoost: bScoreData.communityBoost,
      setupBoostScore: bScoreData.setupBoostScore,
      assignedBoostProfile: assignedBProfile
    },
    score,
    synergy,
    ownedPairBonus,
    metaPairBonus,
    source: selected.source
  };
}

function determineRaceArchetype(track) {
  if (track.corners >= 88 && track.speed <= 50) return 'Street-Technical';
  if (track.speed >= 88 && track.drs >= 62) return 'High-Speed DRS';
  if (track.wear >= 1.03) return 'High-Wear';
  return 'Balanced';
}

function buildStintPlan(track, pairTyre) {
  const laps = track.laps;
  const highWear = track.wear >= 1.03;
  const tyreStrong = pairTyre >= 89;

  if (highWear && !tyreStrong) {
    const first = Math.max(3, Math.round(laps * 0.42));
    const second = Math.max(2, Math.round(laps * 0.33));
    const third = Math.max(2, laps - first - second);
    return {
      title: '2-Stop Control',
      stints: 'M(' + first + ') -> H(' + second + ') -> S(' + third + ')',
      ers: 'Deploy nur in DRS-Zonen, sonst Harvest',
      risk: 'Mittel'
    };
  }

  if (track.speed >= 88 && track.drs >= 62) {
    const first = Math.max(3, Math.round(laps * 0.45));
    const second = Math.max(3, laps - first);
    return {
      title: '1-Stop Aggressive',
      stints: 'S(' + first + ') -> M(' + second + ')',
      ers: 'Push in DRS-Fenstern fuer Overtakes',
      risk: 'Mittel-Hoch'
    };
  }

  const first = Math.max(3, Math.round(laps * 0.5));
  const second = Math.max(3, laps - first);
  return {
    title: '1-Stop Balanced',
    stints: 'M(' + first + ') -> H(' + second + ')',
    ers: 'Ausgeglichen: frueh sparen, spaet pushen',
    risk: 'Niedrig-Mittel'
  };
}

function computeStrategyConfidence(track, bestPair, inventoryCtx) {
  if (!bestPair) return 70;
  const catalogSize = Math.max(1, getDriverCatalogLite().length);
  const pairTyre = (bestPair.a.raw.tyre + bestPair.b.raw.tyre) / 2;
  const pairConsistency = (bestPair.a.raw.consistency + bestPair.b.raw.consistency) / 2;
  const synergyBoost = bestPair.synergy * 1.7;
  const ownedBoost = bestPair.ownedPairBonus || 0;
  const metaBoost = (bestPair.metaPairBonus || 0) * 0.5;
  const ownedCoverage = inventoryCtx && inventoryCtx.ownedInCatalog && inventoryCtx.ownedInCatalog.length
    ? Math.min(1, inventoryCtx.ownedInCatalog.length / Math.max(1, catalogSize * 0.4))
    : 0;
  const wearPenalty = track.wear >= 1.05 ? 4 : 0;
  const confidence = 66 + (pairTyre - 80) * 0.32 + (pairConsistency - 80) * 0.22 + synergyBoost + ownedBoost + metaBoost + ownedCoverage * 3.6 - wearPenalty;
  return clamp(confidence, 55, 98);
}

function recommendStrategy(track, bestPair, inventoryCtx, mode) {
  const highWear = track.wear >= 1.03;
  const highPitPenalty = track.pitLoss >= 21;
  const drsHeavy = track.drs >= 62;
  const archetype = determineRaceArchetype(track);
  const pairTyre = bestPair ? (bestPair.a.raw.tyre + bestPair.b.raw.tyre) / 2 : 85;
  const plan = buildStintPlan(track, pairTyre);

  let raceCall = 'Stabil auf Position fahren';
  if (highWear && highPitPenalty) raceCall = 'Undercut vermeiden, Reifenfenster strikt managen';
  else if (drsHeavy && track.speed >= 85) raceCall = 'Position ueber DRS-Zuege aktiv angreifen';

  return {
    archetype,
    title: plan.title,
    stints: plan.stints,
    ers: plan.ers,
    risk: plan.risk,
    raceCall,
    confidence: computeStrategyConfidence(track, bestPair, inventoryCtx),
    hasCommunityMeta: Boolean(inventoryCtx && inventoryCtx.hasCommunityMeta),
    ownedDriversInPool: Number(inventoryCtx && inventoryCtx.ownedInCatalog ? inventoryCtx.ownedInCatalog.length : 0),
    mode: mode || 'inventory_meta'
  };
}

function recommendSetup(track, mode) {
  return optimizeSetupFromInventory(track, mode);
}

function renderOutput(track) {
  applyTrackBackground(track);
  const mode = getOptimizerMode();
  const selectedSetup = buildSelectedSetupResult(track, mode);
  const fallbackSetup = recommendSetup(track, mode);
  const setup = selectedSetup.hasSetup ? selectedSetup : fallbackSetup;
  const activeBoostProfile = getActiveBoostProfile();
  const driverBoostFocus = getDriverBoostFocus();
  const setupBoostContext = computeSetupDriverBoostContext(track, setup.pickedParts || [], activeBoostProfile, driverBoostFocus);

  const pairingData = computeBestPair(track, mode, setupBoostContext);
  const selectedPair = computeSelectedPair(
    track,
    pairingData.inventoryCtx,
    mode,
    setupBoostContext,
    setup.pickedParts || [],
    driverBoostFocus
  );
  const activePair = selectedPair || pairingData.best;
  const boostSuggestion = computeBoostSuggestionForPair(
    track,
    setup.pickedParts || [],
    activePair,
    pairingData.inventoryCtx,
    mode,
    driverBoostFocus
  );
  const strategy = recommendStrategy(track, activePair, pairingData.inventoryCtx, mode);
  const impacts = pairingData.ranked.slice(0, 5);
  const baseline = pairingData.ranked.reduce((sum, row) => sum + row.score, 0) / pairingData.ranked.length;

  renderBoostProfileHint(activeBoostProfile, driverBoostFocus, setupBoostContext, boostSuggestion);

  const optimizerResult = byId('optimizerResult');
  if (optimizerResult) {
    const metaBlock = setup.metaComparison && setup.metaComparison.metaKnown
      ? '<br><small>Meta-Vergleich: Owned Meta-Teile ' + setup.metaComparison.metaOwnedCount + '/' + setup.metaComparison.metaTargetCount +
        ' | Meta-Score: ' + setup.metaComparison.metaScore.toFixed(2) +
        ' | Gap: ' + setup.metaComparison.gapToMeta.toFixed(2) +
        (setup.metaComparison.missingMetaParts.length
          ? ' | Fehlt: ' + setup.metaComparison.missingMetaParts.slice(0, 4).join(', ')
          : ' | Meta komplett im Inventar') + '</small>'
      : '<br><small>Meta-Vergleich: keine Track-Meta fuer Parts hinterlegt.</small>';

    const modeLabel = mode === 'inventory_strict'
      ? 'Strikt Inventar'
      : (mode === 'meta_sim' ? 'Meta-Simulation' : 'Inventar + Meta');

    const missingBlock = setup.missingCategories.length
      ? '<br><small>Fehlende Kategorien im Inventar: ' + setup.missingCategories.join(', ') + '</small>'
      : '';

    const sourceBlock = selectedSetup.hasSetup
      ? '<br><small>Quelle: Gewaehlte Teile aus Garage/Builder wurden direkt uebernommen.</small>'
      : '<br><small>Quelle: Keine vollstaendige Teileauswahl gespeichert, daher KI-Inventarvorschlag.</small>';

    const boostBlock = activeBoostProfile
      ? '<br><small>Boost-Profil: S' + activeBoostProfile.series + ' ' + activeBoostProfile.medal +
        ' (' + activeBoostProfile.rarity + ', +' + Number(activeBoostProfile.percent || 0).toFixed(1) + '%) | Fokus: ' + getBoostFocusLabel(driverBoostFocus) +
        ' | Setup->Driver Score: +' + Number(setupBoostContext.totalMagnitude || 0).toFixed(2) + '</small>'
      : '';

    optimizerResult.innerHTML =
      '<strong>Empfohlenes Setup fuer ' + track.name + ':</strong><br>' +
      (setup.hasSetup
        ? setup.names.join(' + ') +
          '<br><small>Track-Score: ' + setup.score.toFixed(2) + ' | Modus: ' + modeLabel + '</small>'
        : 'Kein verwertbares Setup aus Inventar moeglich.') +
      missingBlock +
      sourceBlock +
      boostBlock +
      metaBlock;
  }

  const strategyResult = byId('strategyResult');
  if (strategyResult) {
    strategyResult.innerHTML =
      '<strong>Strategie: ' + strategy.title + '</strong><br>' +
      'Stints: ' + strategy.stints + '<br>' +
      'ERS: ' + strategy.ers + '<br>' +
      'Race Call: ' + strategy.raceCall + '<br>' +
      '<small>Typ: ' + strategy.archetype +
      ' | Risiko: ' + strategy.risk +
      ' | Confidence: ' + strategy.confidence.toFixed(1) + '% | Runden: ' + track.laps +
        ' | Pit-Loss: ' + track.pitLoss + 's | Wear: ' + track.wear.toFixed(2) +
        ' | Inventar-Fahrer: ' + strategy.ownedDriversInPool +
        ' | Meta: ' + (strategy.hasCommunityMeta ? 'aktiv' : 'neutral') + '</small>';
  }

  const driverPairResult = byId('driverPairResult');
  if (driverPairResult && activePair) {
    const sourceText = selectedPair
      ? 'Rubrik-Auswahl (' + (selectedPair.source === 'best' ? 'Best Pair' : 'manuell') + ')'
      : 'KI-Optimierung';

    const bestAProfile = boostSuggestion && boostSuggestion.bestA ? boostSuggestion.bestA.profile : null;
    const bestBProfile = boostSuggestion && boostSuggestion.bestB ? boostSuggestion.bestB.profile : null;
    const bestPairProfile = boostSuggestion && boostSuggestion.pairBest ? boostSuggestion.pairBest.profile : null;
    const activeIsBestPair = Boolean(bestPairProfile && activeBoostProfile && bestPairProfile.id === activeBoostProfile.id);
    const suggestionBlock = boostSuggestion
      ? '<br><small><strong>Boost-Vorschlag (Realbestand):</strong> ' +
        activePair.a.name + ' -> ' + getBoostProfileLabel(bestAProfile) +
        ' (+' + Number(boostSuggestion.bestA && boostSuggestion.bestA.delta || 0).toFixed(2) + ')' +
        (boostSuggestion.bestA && boostSuggestion.bestA.rarityMatch ? ' [Rarity-Match]' : '') +
        ' | ' +
        activePair.b.name + ' -> ' + getBoostProfileLabel(bestBProfile) +
        ' (+' + Number(boostSuggestion.bestB && boostSuggestion.bestB.delta || 0).toFixed(2) + ')' +
        (boostSuggestion.bestB && boostSuggestion.bestB.rarityMatch ? ' [Rarity-Match]' : '') +
        '<br><mark>Pair Best: ' + getBoostProfileLabel(bestPairProfile) +
        ' (+' + Number(boostSuggestion.pairBest && boostSuggestion.pairBest.delta || 0).toFixed(2) + ')' +
        ' | Rarity Hits: ' + Number(boostSuggestion.pairBest && boostSuggestion.pairBest.rarityHits || 0) + '/2' +
        (boostSuggestion.pairUsedFallback ? ' | Fallback ohne Rarity-Treffer' : ' | Rarity-Regel aktiv') +
        (activeIsBestPair ? ' aktiv' : ' empfohlen') + '</mark></small>'
      : '';

    driverPairResult.innerHTML =
      '<strong>Aktive Fahrerpaarung:</strong> ' + activePair.a.name + ' + ' + activePair.b.name +
      '<br><small>Quelle: ' + sourceText +
      ' | Pair-Score: ' + activePair.score.toFixed(2) +
      ' | Synergie: +' + activePair.synergy.toFixed(2) +
      ' | Setup-Bonus: +' + (Number(activePair.a.setupBoostScore || 0) + Number(activePair.b.setupBoostScore || 0)).toFixed(2) +
      ' | Inventar-Bonus: +' + Number(activePair.ownedPairBonus || 0).toFixed(2) +
      ' | Meta-Bonus: +' + Number(activePair.metaPairBonus || 0).toFixed(2) +
      (activePair.a.assignedBoostProfile || activePair.b.assignedBoostProfile
        ? '<br>Zugeordnete Fahrer-Boosts: ' +
          activePair.a.name + ' -> ' + getBoostProfileLabel(activePair.a.assignedBoostProfile || activeBoostProfile) +
          ' | ' +
          activePair.b.name + ' -> ' + getBoostProfileLabel(activePair.b.assignedBoostProfile || activeBoostProfile)
        : '') +
      (pairingData.best ? '<br>KI-Vergleich: ' + pairingData.best.a.name + ' + ' + pairingData.best.b.name + ' (' + pairingData.best.score.toFixed(2) + ')' : '') +
      '<br>Inventar im Pool: ' + pairingData.inventoryCtx.ownedInCatalog.length + '/' + getDriverCatalogLite().length + '</small>' +
      suggestionBlock;
  }

  const impactResult = byId('impactResult');
  if (impactResult) {
    impactResult.innerHTML =
      impacts.map((row, idx) => {
        const delta = row.score - baseline;
        const sign = delta >= 0 ? '+' : '';
        const inventoryTag = row.isOwned ? ' [Inventar]' : '';
        const metaTag = row.communityBoost > 0 ? ' [Meta +' + row.communityBoost.toFixed(1) + ']' : '';
        const setupTag = row.setupBoostScore > 0 ? ' [Setup +' + row.setupBoostScore.toFixed(2) + ']' : '';
        return (idx + 1) + '. ' + row.name +
          inventoryTag + metaTag + setupTag +
          ' - Impact: ' + sign + delta.toFixed(2) +
          ' | Effektiv: ' + row.score.toFixed(2) +
          ' | Stage: S' + row.stage;
      }).join('<br>');
  }

  renderTrackProfile(track);
}

function drawLabelBadge(ctx, text, x, y, align) {
  ctx.save();
  ctx.font = 'bold 12px Segoe UI, Arial, sans-serif';
  const padX = 6;
  const padY = 3;
  const textW = Math.ceil(ctx.measureText(text).width);
  const boxW = textW + padX * 2;
  const boxH = 18;

  let left = x - boxW / 2;
  if (align === 'left') left = x;
  if (align === 'right') left = x - boxW;

  ctx.fillStyle = 'rgba(7, 13, 28, 0.86)';
  ctx.strokeStyle = 'rgba(194, 217, 255, 0.32)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(left, y - boxH / 2, boxW, boxH, 5);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = 'rgba(239, 246, 255, 0.96)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, left + boxW / 2, y + 0.5);
  ctx.restore();
}

function getCompactRadarLabel(label) {
  const map = {
    Qualifying: 'Quali',
    Overtaking: 'Overtk',
    Consistency: 'Cons.',
    Corners: 'Crnrs'
  };
  if (map[label]) return map[label];
  return String(label || '').length > 7 ? String(label).slice(0, 7) : String(label || '');
}

function drawRadarGrid(ctx, cx, cy, radius, labels, levels, compactMode) {
  ctx.save();
  ctx.strokeStyle = 'rgba(210,225,255,0.14)';
  ctx.lineWidth = 1;
  for (let level = 1; level <= levels; level += 1) {
    const r = (radius * level) / levels;
    ctx.beginPath();
    labels.forEach((_, idx) => {
      const angle = -Math.PI / 2 + (idx * Math.PI * 2) / labels.length;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.stroke();
  }

  labels.forEach((label, idx) => {
    const angle = -Math.PI / 2 + (idx * Math.PI * 2) / labels.length;
    const x = cx + Math.cos(angle) * (radius + 24);
    const y = cy + Math.sin(angle) * (radius + 24);

    ctx.strokeStyle = 'rgba(210,225,255,0.2)';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    ctx.stroke();

    const displayLabel = compactMode ? getCompactRadarLabel(label) : label;
    drawLabelBadge(ctx, displayLabel, x, y, x >= cx ? 'left' : 'right');
  });
  ctx.restore();
}

function drawRadarShape(ctx, cx, cy, radius, values, labels, stroke, fill) {
  ctx.save();
  ctx.beginPath();
  values.forEach((rawValue, idx) => {
    const value = clamp(Number(rawValue || 0), 0, 100) / 100;
    const angle = -Math.PI / 2 + (idx * Math.PI * 2) / labels.length;
    const x = cx + Math.cos(angle) * radius * value;
    const y = cy + Math.sin(angle) * radius * value;
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawTrackSketch(ctx, trackName, areaX, areaY, areaW, areaH) {
  const points = TRACK_SKETCH_POINTS[trackName] || TRACK_SKETCH_POINTS.Bahrain;
  if (!points || points.length < 3) return;

  const mapPoint = (point) => ({
    x: areaX + point[0] * areaW,
    y: areaY + point[1] * areaH
  });
  const mapped = points.map(mapPoint);

  ctx.save();
  ctx.strokeStyle = 'rgba(255, 222, 120, 0.82)';
  ctx.lineWidth = 4;
  ctx.shadowColor = 'rgba(255, 210, 90, 0.85)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.beginPath();
  for (let i = 0; i < mapped.length; i += 1) {
    const curr = mapped[i];
    const next = mapped[(i + 1) % mapped.length];
    const cx = (curr.x + next.x) / 2;
    const cy = (curr.y + next.y) / 2;
    if (i === 0) ctx.moveTo(curr.x, curr.y);
    ctx.quadraticCurveTo(curr.x, curr.y, cx, cy);
  }
  ctx.closePath();
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(255, 240, 170, 0.45)';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();
}

function slugifyTrackName(trackName) {
  return String(trackName || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getTrackBackgroundCandidates(trackName) {
  const slug = slugifyTrackName(trackName);
  const encodedName = encodeURIComponent(String(trackName || '').trim());
  const names = [slug, encodedName].filter(Boolean);
  const exts = ['jpg', 'jpeg', 'png', 'webp'];
  const out = [];
  names.forEach((name) => {
    exts.forEach((ext) => {
      out.push(TRACK_BACKGROUNDS_DIR + '/' + name + '.' + ext);
    });
  });
  return Array.from(new Set(out));
}

function probeImageUrl(url) {
  if (trackBackgroundProbeCache.has(url)) return trackBackgroundProbeCache.get(url);
  const promise = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
  trackBackgroundProbeCache.set(url, promise);
  return promise;
}

async function resolveTrackBackgroundUrl(trackName) {
  const candidates = getTrackBackgroundCandidates(trackName);
  for (const candidate of candidates) {
    // Probe in order and stop at first matching custom asset.
    // eslint-disable-next-line no-await-in-loop
    const exists = await probeImageUrl(candidate);
    if (exists) return candidate;
  }
  return '';
}

async function renderTrackBackgroundStatus(activeTrackName, hasActiveCustom) {
  const statusNode = byId('trackBackgroundStatus');
  if (!statusNode) return;

  const checks = await Promise.all(
    TRACKS.map(async (track) => ({
      name: track.name,
      url: await resolveTrackBackgroundUrl(track.name)
    }))
  );

  const available = checks.filter((row) => Boolean(row.url)).map((row) => row.name);
  const missing = checks.filter((row) => !row.url).map((row) => row.name);
  const activeMode = hasActiveCustom ? 'Custom-Bild' : 'Diagramm-Fallback';

  statusNode.innerHTML =
    '<strong>Track-Hintergrund:</strong> ' + activeTrackName + ' (' + activeMode + ')' +
    '<br><small>Custom verfuegbar: ' + available.length + '/' + TRACKS.length +
    (available.length ? ' | Vorhanden: ' + available.join(', ') : '') +
    (missing.length ? ' | Fehlt: ' + missing.slice(0, 6).join(', ') + (missing.length > 6 ? ' ...' : '') : '') +
    '</small>';
}

function buildTrackBackgroundSvg(track, req) {
  const hueA = Math.round((track.speed * 2.1 + track.drs * 0.8) % 360);
  const hueB = Math.round((track.corners * 2.4 + req.wearScaled) % 360);
  const values = [track.speed, track.corners, track.drs, req.wearScaled, req.paceWeight, req.tyreWeight];
  const bars = values
    .map((value, idx) => {
      const x = 70 + idx * 72;
      const h = Math.max(18, Math.round(value * 1.25));
      const y = 320 - h;
      const opacity = (0.18 + idx * 0.055).toFixed(3);
      return '<rect x="' + x + '" y="' + y + '" width="42" height="' + h + '" rx="10" fill="hsla(' + (hueA + idx * 9) + ',90%,66%,' + opacity + ')" />';
    })
    .join('');

  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 520" preserveAspectRatio="none">',
    '<defs>',
    '<linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">',
    '<stop offset="0%" stop-color="hsl(' + hueA + ', 88%, 18%)"/>',
    '<stop offset="100%" stop-color="hsl(' + hueB + ', 90%, 10%)"/>',
    '</linearGradient>',
    '<radialGradient id="orb" cx="72%" cy="26%" r="46%">',
    '<stop offset="0%" stop-color="hsla(' + (hueA + 18) + ', 95%, 72%, 0.34)"/>',
    '<stop offset="100%" stop-color="hsla(' + (hueB + 26) + ', 100%, 50%, 0)"/>',
    '</radialGradient>',
    '</defs>',
    '<rect width="960" height="520" fill="url(#bgGrad)"/>',
    '<rect width="960" height="520" fill="url(#orb)"/>',
    '<g stroke="rgba(255,255,255,0.08)" stroke-width="1">',
    '<path d="M40 370 L920 370"/><path d="M40 318 L920 318"/><path d="M40 266 L920 266"/><path d="M40 214 L920 214"/>',
    '</g>',
    '<g>',
    bars,
    '</g>',
    '<path d="M52 418 C170 300, 264 330, 358 252 C446 180, 564 226, 652 186 C742 144, 820 158, 910 122" stroke="hsla(' + (hueA + 32) + ',95%,72%,0.45)" stroke-width="7" fill="none" stroke-linecap="round"/>',
    '<text x="46" y="468" fill="rgba(242,246,255,0.82)" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="700">' + track.name + '  Track Diagram</text>',
    '</svg>'
  ].join('');
}

async function applyTrackBackground(track) {
  const req = buildTrackRequirement(track);
  const svg = buildTrackBackgroundSvg(track, req);
  const encoded = encodeURIComponent(svg);
  const body = document.body;
  if (!body) return;

  const reqId = ++trackBackgroundRequestId;
  const customUrl = await resolveTrackBackgroundUrl(track.name);
  if (reqId !== trackBackgroundRequestId) return;

  if (customUrl) {
    body.style.backgroundImage =
      'linear-gradient(180deg, rgba(5,8,18,0.55), rgba(3,6,16,0.78)), ' +
      'url("' + customUrl + '"), ' +
      'url("data:image/svg+xml;charset=UTF-8,' + encoded + '")';
    body.style.backgroundBlendMode = 'multiply, normal, soft-light';
  } else {
    body.style.backgroundImage =
      'linear-gradient(180deg, rgba(5,8,18,0.58), rgba(3,6,16,0.84)), ' +
      'url("data:image/svg+xml;charset=UTF-8,' + encoded + '")';
    body.style.backgroundBlendMode = 'multiply, normal';
  }

  body.style.backgroundSize = 'cover, cover, cover';
  body.style.backgroundPosition = 'center, center, center';
  body.style.backgroundRepeat = 'no-repeat, no-repeat, no-repeat';
  body.style.backgroundAttachment = 'fixed, fixed, fixed';

  renderTrackBackgroundStatus(track.name, Boolean(customUrl));
}

function renderTrackProfile(track) {
  const profileResult = byId('trackProfileResult');
  const canvas = byId('trackProfileCanvas');
  if (!profileResult || !canvas) return;

  const req = buildTrackRequirement(track);
  const profileText =
    '<strong>' + track.name + ' - Streckenanforderung:</strong><br>' +
    'Speed-Fokus: ' + req.paceWeight + ' | Kurven-Fokus: ' + req.qualifyingWeight +
    ' | Reifen-Management: ' + req.tyreWeight +
    '<br><small>DRS-Anforderung: ' + track.drs +
    ' | Wear-Profil: ' + req.wearScaled +
    ' | Pit-Loss: ' + track.pitLoss + 's</small>';
  profileResult.innerHTML = profileText;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, 'rgba(9,15,32,0.88)');
  bg.addColorStop(1, 'rgba(6,10,24,0.95)');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = 'rgba(224,236,255,0.95)';
  ctx.font = 'bold 14px Segoe UI, Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Leistung vs. Anforderung  ' + track.name, 16, 22);

  drawTrackSketch(ctx, track.name, 38, 30, w - 76, h - 58);

  const perfLabels = ['Speed', 'Corners', 'DRS', 'Wear'];
  const perfValues = [track.speed, track.corners, track.drs, req.wearScaled];
  const reqLabels = ['Pace', 'Quali', 'Tyre', 'Overtake', 'Consistency'];
  const reqValues = [req.paceWeight, req.qualifyingWeight, req.tyreWeight, req.overtakingWeight, req.consistencyWeight];

  const leftCx = Math.round(w * 0.28);
  const rightCx = Math.round(w * 0.72);
  const cy = 154;
  const leftRadius = 88;
  const rightRadius = 88;
  const compactLabels = w < 820;

  drawRadarGrid(ctx, leftCx, cy, leftRadius, perfLabels, 5, compactLabels);
  drawRadarShape(ctx, leftCx, cy, leftRadius, perfValues, perfLabels, 'rgba(112,234,255,0.95)', 'rgba(112,234,255,0.22)');

  drawRadarGrid(ctx, rightCx, cy, rightRadius, reqLabels, 5, compactLabels);
  drawRadarShape(ctx, rightCx, cy, rightRadius, reqValues, reqLabels, 'rgba(255,196,98,0.95)', 'rgba(255,196,98,0.2)');

  ctx.fillStyle = 'rgba(170,204,255,0.95)';
  ctx.font = 'bold 12px Segoe UI, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Leistungsprofil Strecke', leftCx, 266);
  ctx.fillStyle = 'rgba(255,212,140,0.95)';
  ctx.fillText('Anforderungsprofil Fahrer', rightCx, 266);
}

function initActions(select) {
  const optimizeButton = byId('optimizeButton');
  const strategyButton = byId('strategyButton');
  const pairingButton = byId('pairingButton');
  const pageButton = byId('trackSelectionPageButton');

  if (optimizeButton) {
    optimizeButton.addEventListener('click', () => {
      const track = getTrack(select.value);
      saveTrackState(select);
      updateBadge(select);
      renderOutput(track);
    });
  }

  if (strategyButton) {
    strategyButton.addEventListener('click', () => {
      const track = getTrack(select.value);
      saveTrackState(select);
      updateBadge(select);
      renderOutput(track);
    });
  }

  if (pairingButton) {
    pairingButton.addEventListener('click', () => {
      const track = getTrack(select.value);
      saveTrackState(select);
      updateBadge(select);
      renderOutput(track);
    });
  }

  if (pageButton) {
    pageButton.addEventListener('click', () => {
      saveTrackState(select);
      window.location.href = 'track-selection.html?next=optimizer.html';
    });
  }
}

function clearServiceWorkerAndCaches() {
  if (sessionStorage.getItem('optimizerLiteCacheCleared') === '1') return;

  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.getRegistrations()
    .then((regs) => Promise.all(regs.map((reg) => reg.unregister())))
    .catch(() => {});

  if (typeof caches !== 'undefined' && typeof caches.keys === 'function') {
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .catch(() => {});
  }

  sessionStorage.setItem('optimizerLiteCacheCleared', '1');
}

function initOptimizerLite() {
  clearServiceWorkerAndCaches();

  const select = byId('trackSelect');
  const modeSelect = byId('optimizerModeSelect');
  const boostProfileSelect = byId('boostProfileSelect');
  const driverBoostFocusSelect = byId('driverBoostFocusSelect');
  const driverSelectA = byId('driverSelectA');
  const driverSelectB = byId('driverSelectB');
  if (!select) return;

  if (modeSelect) {
    modeSelect.value = getOptimizerMode();
    modeSelect.addEventListener('change', () => {
      const mode = String(modeSelect.value || 'inventory_meta');
      saveOptimizerMode(mode);
      renderOutput(getTrack(select.value));
    });
  }

  if (boostProfileSelect) {
    fillBoostProfileSelect(boostProfileSelect);
    boostProfileSelect.addEventListener('change', () => {
      const id = String(boostProfileSelect.value || '').trim();
      saveBoostProfileId(id);
      renderOutput(getTrack(select.value));
    });
  }

  if (driverBoostFocusSelect) {
    driverBoostFocusSelect.value = getDriverBoostFocus();
    driverBoostFocusSelect.addEventListener('change', () => {
      const focus = String(driverBoostFocusSelect.value || 'auto').trim();
      saveDriverBoostFocus(focus);
      renderOutput(getTrack(select.value));
    });
  }

  renderTrackBackgroundStatus(getTrack(select.value).name, false);

  initDriverPairSelectors(driverSelectA, driverSelectB, () => {
    renderOutput(getTrack(select.value));
  });

  fillTrackSelect(select);
  updateBadge(select);
  renderOutput(getTrack(select.value));
  initActions(select);

  select.addEventListener('change', () => {
    saveTrackState(select);
    updateBadge(select);
    renderOutput(getTrack(select.value));
  });
}

document.addEventListener('DOMContentLoaded', initOptimizerLite);
