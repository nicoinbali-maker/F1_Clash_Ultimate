const statKeys = ['tempo', 'kurven', 'antrieb', 'quali', 'drs'];
const statLabels = { tempo: 'Tempo', kurven: 'Kurven', antrieb: 'Antrieb', quali: 'Quali', drs: 'DRS' };
const PART_CATEGORIES = ['engine', 'front_wing', 'rear_wing', 'gearbox', 'suspension', 'brakes'];
const PART_LEVELS = Array.from({ length: 12 }, (_, i) => i + 1);
const DRIVER_STAGES = Array.from({ length: 12 }, (_, i) => `S${i + 1}`);
const LEGENDARY_DRIVER_NAMES = new Set(['Verstappen', 'Leclerc', 'Norris', 'Hamilton', 'Alonso']);
const SPECIAL_DRIVER_NAMES = new Set(['Mick Schumacher', 'Palou', 'Antonelli', 'Bearman', 'Lawson']);
const COMMUNITY_KNOWLEDGE_KEY = 'f1clashCommunityKnowledge';
const F1_SYNC_CONSENT_PREFIX = 'f1clashSyncConsent_';
const F1_SYNC_API_CONFIG_PREFIX = 'f1clashSyncApiConfig_';
const FIREBASE_CONFIG_KEY = 'f1clashFirebaseConfig';
const FIREBASE_AUTH_KEY = 'f1clashFirebaseAuth';
const FIREBASE_AUTO_SYNC_KEY = 'f1clashFirebaseAutoSync';
const MAX_FULL_OPTIMIZER_COMBOS = 120000;

const tracksDb = [
  { name: 'Bahrain', laps: 8, pitLoss: 20, wear: 1.00, baseLap: 92.1, tempo: 84, kurven: 58, antrieb: 80, quali: 56, drs: 62, meta: 'Power + Traktion' },
  { name: 'Saudi Arabia', laps: 7, pitLoss: 21, wear: 0.92, baseLap: 89.0, tempo: 88, kurven: 54, antrieb: 72, quali: 54, drs: 66, meta: 'Topspeed + Stabilitaet' },
  { name: 'Australia', laps: 8, pitLoss: 20, wear: 0.96, baseLap: 81.5, tempo: 74, kurven: 68, antrieb: 62, quali: 58, drs: 60, meta: 'Balanced' },
  { name: 'Japan', laps: 7, pitLoss: 21, wear: 1.04, baseLap: 89.7, tempo: 76, kurven: 86, antrieb: 64, quali: 60, drs: 50, meta: 'Kurven + Balance' },
  { name: 'China', laps: 8, pitLoss: 21, wear: 0.97, baseLap: 94.8, tempo: 80, kurven: 72, antrieb: 66, quali: 55, drs: 58, meta: 'Allround' },
  { name: 'Miami', laps: 8, pitLoss: 21, wear: 0.99, baseLap: 92.4, tempo: 79, kurven: 68, antrieb: 65, quali: 57, drs: 61, meta: 'Balanced + DRS' },
  { name: 'Imola', laps: 9, pitLoss: 19, wear: 1.01, baseLap: 80.2, tempo: 70, kurven: 82, antrieb: 66, quali: 60, drs: 46, meta: 'Downforce' },
  { name: 'Monaco', laps: 10, pitLoss: 18, wear: 1.07, baseLap: 74.6, tempo: 40, kurven: 92, antrieb: 70, quali: 78, drs: 30, meta: 'Kurvenfokus' },
  { name: 'Canada', laps: 9, pitLoss: 20, wear: 0.95, baseLap: 73.1, tempo: 82, kurven: 63, antrieb: 72, quali: 58, drs: 64, meta: 'Topspeed + Traktion' },
  { name: 'Spain', laps: 9, pitLoss: 21, wear: 1.03, baseLap: 77.8, tempo: 68, kurven: 84, antrieb: 67, quali: 62, drs: 48, meta: 'Aero + Kurven' },
  { name: 'Austria', laps: 10, pitLoss: 19, wear: 0.94, baseLap: 65.4, tempo: 86, kurven: 64, antrieb: 71, quali: 59, drs: 65, meta: 'Speed Track' },
  { name: 'United Kingdom', laps: 7, pitLoss: 21, wear: 1.02, baseLap: 88.8, tempo: 78, kurven: 82, antrieb: 60, quali: 56, drs: 58, meta: 'High Speed Curves' },
  { name: 'Hungary', laps: 9, pitLoss: 19, wear: 1.05, baseLap: 78.0, tempo: 48, kurven: 90, antrieb: 66, quali: 70, drs: 36, meta: 'Quali + Grip' },
  { name: 'Belgium', laps: 6, pitLoss: 22, wear: 0.98, baseLap: 104.2, tempo: 90, kurven: 74, antrieb: 69, quali: 53, drs: 67, meta: 'Topspeed + Stability' },
  { name: 'Netherlands', laps: 9, pitLoss: 19, wear: 1.02, baseLap: 72.6, tempo: 62, kurven: 88, antrieb: 68, quali: 67, drs: 42, meta: 'Corner Momentum' },
  { name: 'Italy', laps: 8, pitLoss: 21, wear: 0.90, baseLap: 80.9, tempo: 94, kurven: 42, antrieb: 76, quali: 54, drs: 64, meta: 'Low Drag' },
  { name: 'Azerbaijan', laps: 7, pitLoss: 22, wear: 0.93, baseLap: 103.8, tempo: 92, kurven: 48, antrieb: 70, quali: 52, drs: 69, meta: 'Street Speed' },
  { name: 'Singapore', laps: 8, pitLoss: 21, wear: 1.09, baseLap: 101.1, tempo: 46, kurven: 90, antrieb: 74, quali: 72, drs: 34, meta: 'Heat + Tyre Mgmt' },
  { name: 'United States', laps: 8, pitLoss: 20, wear: 0.99, baseLap: 96.0, tempo: 77, kurven: 79, antrieb: 66, quali: 58, drs: 55, meta: 'Balanced' },
  { name: 'Mexico', laps: 9, pitLoss: 20, wear: 0.94, baseLap: 78.7, tempo: 88, kurven: 58, antrieb: 73, quali: 60, drs: 62, meta: 'Power + Thin Air' },
  { name: 'Brazil', laps: 9, pitLoss: 20, wear: 1.01, baseLap: 73.5, tempo: 80, kurven: 75, antrieb: 68, quali: 60, drs: 57, meta: 'Allround + Overtake' },
  { name: 'Las Vegas', laps: 7, pitLoss: 22, wear: 0.89, baseLap: 95.1, tempo: 93, kurven: 46, antrieb: 72, quali: 50, drs: 70, meta: 'Ultra Low Drag' },
  { name: 'Qatar', laps: 8, pitLoss: 21, wear: 1.00, baseLap: 84.1, tempo: 82, kurven: 77, antrieb: 64, quali: 58, drs: 55, meta: 'Fast Flowing' },
  { name: 'Abu Dhabi', laps: 8, pitLoss: 21, wear: 0.97, baseLap: 87.5, tempo: 81, kurven: 70, antrieb: 67, quali: 57, drs: 59, meta: 'Balanced Finale' }
];

const trackWeights = Object.fromEntries(tracksDb.map((t) => {
  const sum = statKeys.reduce((s, k) => s + t[k], 0);
  return [t.name, Object.fromEntries(statKeys.map((k) => [k, t[k] / sum]))];
}));

function buildCategoryParts(category, names, base) {
  return names.map((name, i) => ({
    name,
    category,
    tempo: base.tempo + (i % 5) * 2 + Math.floor(i / 3),
    kurven: base.kurven + ((i + 1) % 5) * 2,
    antrieb: base.antrieb + ((i + 2) % 4) * 2,
    quali: base.quali + ((i + 3) % 6),
    drs: base.drs + ((i + 4) % 5)
  }));
}

const partCatalog = [
  ...buildCategoryParts('engine', ['Quantum','Power Lift','Titan Core','Pulse V8','Inferno Unit','Dragstar','Crimson V','Vector R','Stormcell','Helix One'], { tempo: 54, kurven: 20, antrieb: 50, quali: 26, drs: 18 }),
  ...buildCategoryParts('front_wing', ['Mach III','BoomBox','Falcon X','AeroNova','Vortex W','EagleEye','NeonWing','Apex F','Cobra Aero','Spectra Wing'], { tempo: 24, kurven: 58, antrieb: 14, quali: 36, drs: 28 }),
  ...buildCategoryParts('rear_wing', ['Raptor RW','Delta RW','Sonic Tail','Ghost RW','Nebula RW','Vertex RW','Iron Tail','Comet RW','Nova RW','Pulse RW'], { tempo: 28, kurven: 52, antrieb: 16, quali: 34, drs: 32 }),
  ...buildCategoryParts('gearbox', ['Sabre','Metronome','TorqueX','GearFlux','IronBox','SwiftShift','Vector Gear','Neptune G','RidgeBox','TurboLink'], { tempo: 18, kurven: 28, antrieb: 60, quali: 18, drs: 18 }),
  ...buildCategoryParts('suspension', ['Flexion','Hydra S','Axle Pro','Carbon S','GripFlow','AeroFlex','TriLink','Pulse S','Vector S','Zenith S'], { tempo: 14, kurven: 44, antrieb: 30, quali: 20, drs: 14 }),
  ...buildCategoryParts('brakes', ['Redline B','Carbon Stop','Apex Brake','Nova Brake','Storm Brake','GripStop','Pulse Brake','Comet Brake','Zen Brake','Delta Brake'], { tempo: 12, kurven: 32, antrieb: 34, quali: 24, drs: 12 })
];

partCatalog.forEach((part) => {
  part.levelCap = 12;
});

const driversDb = [
  { name: 'Verstappen', pace: 95, qualifying: 95, tyre: 88, overtaking: 92, consistency: 90 },
  { name: 'Leclerc', pace: 92, qualifying: 94, tyre: 84, overtaking: 86, consistency: 84 },
  { name: 'Norris', pace: 90, qualifying: 89, tyre: 86, overtaking: 85, consistency: 87 },
  { name: 'Hamilton', pace: 89, qualifying: 88, tyre: 92, overtaking: 90, consistency: 91 },
  { name: 'Alonso', pace: 87, qualifying: 86, tyre: 91, overtaking: 88, consistency: 92 },
  { name: 'Russell', pace: 88, qualifying: 90, tyre: 85, overtaking: 84, consistency: 86 },
  { name: 'Piastri', pace: 87, qualifying: 87, tyre: 84, overtaking: 83, consistency: 85 },
  { name: 'Sainz', pace: 86, qualifying: 88, tyre: 85, overtaking: 84, consistency: 86 },
  { name: 'Perez', pace: 84, qualifying: 83, tyre: 82, overtaking: 84, consistency: 79 },
  { name: 'Gasly', pace: 82, qualifying: 82, tyre: 80, overtaking: 79, consistency: 80 },
  { name: 'Ocon', pace: 81, qualifying: 80, tyre: 81, overtaking: 78, consistency: 81 },
  { name: 'Albon', pace: 80, qualifying: 79, tyre: 79, overtaking: 77, consistency: 80 },
  { name: 'Tsunoda', pace: 79, qualifying: 80, tyre: 77, overtaking: 79, consistency: 76 },
  { name: 'Stroll', pace: 77, qualifying: 75, tyre: 76, overtaking: 74, consistency: 75 },
  { name: 'Hulkenberg', pace: 78, qualifying: 78, tyre: 78, overtaking: 76, consistency: 79 },
  { name: 'Bottas', pace: 78, qualifying: 79, tyre: 77, overtaking: 73, consistency: 80 },
  { name: 'Magnussen', pace: 76, qualifying: 75, tyre: 74, overtaking: 76, consistency: 73 },
  { name: 'Zhou', pace: 75, qualifying: 74, tyre: 75, overtaking: 72, consistency: 74 },
  { name: 'Ricciardo', pace: 77, qualifying: 76, tyre: 76, overtaking: 78, consistency: 75 },
  { name: 'Sargeant', pace: 72, qualifying: 71, tyre: 70, overtaking: 69, consistency: 70 }
];

let currentSeason = new Date().getFullYear();
let radarChart, strategyChart, raceChart, seasonBestChart, wearChart, driverImpactChart;
let miniTrackCharts = [];
let ownedParts = loadOwnedParts();
let manualSetup = { engine: null, front_wing: null, rear_wing: null, gearbox: null, suspension: null, brakes: null };
const strategyChartPopupData = {};
let communityKnowledge = null;
let lastDriverImpactTrack = null;
let lastDriverImpactContext = null;
const chartTouchState = {};
let activePopupChartId = null;
let firebaseAutoSyncTimer = null;
let firebaseAutoSyncMuted = false;

function byId(...ids) {
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) return el;
  }
  return null;
}

function tr(key, vars = {}) {
  const i18n = window.AppI18n;
  if (i18n?.t) return i18n.t(key, vars);
  return key;
}

function addListener(id, eventName, handler) {
  const el = byId(id);
  if (el) el.addEventListener(eventName, handler);
}

function applyActiveSubnavByPath() {
  const currentPage = String(window.location?.pathname || '')
    .split('/')
    .pop()
    .toLowerCase() || 'index.html';
  const navLinks = Array.from(document.querySelectorAll('.subnav a[href]'));
  if (!navLinks.length) return;

  navLinks.forEach((link) => {
    link.classList.remove('is-active');
    link.removeAttribute('aria-current');
  });

  let activeCount = 0;
  navLinks.forEach((link) => {
    const rawHref = String(link.getAttribute('href') || '');
    if (!rawHref || rawHref.startsWith('#')) return;
    const targetPage = rawHref.split('?')[0].split('/').pop().toLowerCase();
    if (targetPage === currentPage) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
      activeCount += 1;
    }
  });

  if (activeCount > 0) return;
  const fallback = navLinks.find((link) => String(link.getAttribute('href') || '').toLowerCase().includes('index.html'));
  if (fallback) {
    fallback.classList.add('is-active');
    fallback.setAttribute('aria-current', 'page');
  }
}

function loadRegistrationProfile() {
  const raw = localStorage.getItem('f1clashRegistration');
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function setResult(id, text) {
  const out = byId(id);
  if (out) out.textContent = text;
}

function hasUi(...ids) {
  return ids.some((id) => !!byId(id));
}

function isOptimizerPageContext() {
  const bodyClass = document.body?.classList;
  if (bodyClass?.contains('optimizer-page')) return true;
  const path = String(window.location?.pathname || '').toLowerCase();
  return path.endsWith('/optimizer.html') || path.endsWith('optimizer.html');
}

function shouldAutoRunHeavyTasks() {
  return !Boolean(window.Capacitor?.isNativePlatform?.());
}

function deferUiTask(task, delay = 60) {
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(() => task(), { timeout: 500 });
    return;
  }
  window.setTimeout(task, delay);
}

function getActiveProfileIdLocal() {
  const profile = loadRegistrationProfile();
  if (profile?.clashId) return profile.clashId;
  return localStorage.getItem('f1clashActiveClashId') || 'guest';
}

function syncConsentStorageKey() {
  return `${F1_SYNC_CONSENT_PREFIX}${getActiveProfileIdLocal()}`;
}

function loadSyncConsent() {
  return readJsonSafe(syncConsentStorageKey(), null);
}

function saveSyncConsent(consent) {
  writeJsonSafe(syncConsentStorageKey(), consent);
  queueFirebaseAutoSync('consent');
  return consent;
}

function clearSyncConsent() {
  localStorage.removeItem(syncConsentStorageKey());
}

function syncApiConfigStorageKey() {
  return `${F1_SYNC_API_CONFIG_PREFIX}${getActiveProfileIdLocal()}`;
}

function loadSyncApiConfig() {
  return readJsonSafe(syncApiConfigStorageKey(), {
    baseUrl: '',
    clientId: '',
    token: '',
    endpoint: '/v1/player/snapshot'
  });
}

function saveSyncApiConfig(config) {
  const normalized = {
    baseUrl: String(config?.baseUrl || '').trim(),
    clientId: String(config?.clientId || '').trim(),
    token: String(config?.token || '').trim(),
    endpoint: String(config?.endpoint || '/v1/player/snapshot').trim() || '/v1/player/snapshot',
    updatedAt: new Date().toISOString()
  };
  writeJsonSafe(syncApiConfigStorageKey(), normalized);
  return normalized;
}

function setSyncResult(text) {
  setResult('f1SyncResult', text);
}

function formatLocalDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  const lang = window.AppI18n?.getLang?.() || 'de';
  return date.toLocaleString(lang);
}

function renderSyncConsentState() {
  const profileNode = byId('f1SyncProfile');
  const stateNode = byId('f1SyncState');
  const updatedNode = byId('f1SyncUpdatedAt');
  const consentNode = byId('f1SyncConsent');
  const methodNode = byId('f1SyncMethod');
  const apiBaseUrlNode = byId('f1ApiBaseUrl');
  const apiClientIdNode = byId('f1ApiClientId');
  const apiTokenNode = byId('f1ApiToken');

  if (!profileNode && !stateNode && !updatedNode) return;

  const profileId = getActiveProfileIdLocal();
  const consent = loadSyncConsent();
  const apiConfig = loadSyncApiConfig();

  if (profileNode) profileNode.textContent = profileId;
  if (stateNode) stateNode.textContent = consent?.granted ? tr('sync_state_granted') : tr('sync_not_granted');
  if (updatedNode) updatedNode.textContent = formatLocalDateTime(consent?.updatedAt || consent?.grantedAt);
  if (consentNode) consentNode.checked = Boolean(consent?.granted);
  if (methodNode && consent?.method) methodNode.value = consent.method;

  if (apiBaseUrlNode && !apiBaseUrlNode.value) apiBaseUrlNode.value = apiConfig.baseUrl || '';
  if (apiClientIdNode && !apiClientIdNode.value) apiClientIdNode.value = apiConfig.clientId || '';
  if (apiTokenNode && !apiTokenNode.value) apiTokenNode.value = apiConfig.token || '';
}

function saveSyncConsentFromUi() {
  const consentNode = byId('f1SyncConsent');
  const methodNode = byId('f1SyncMethod');
  if (!consentNode || !methodNode) return;

  if (!consentNode.checked) {
    setSyncResult(tr('sync_checkbox_required'));
    return;
  }

  const now = new Date().toISOString();
  const consent = {
    granted: true,
    grantedAt: now,
    updatedAt: now,
    method: methodNode.value,
    scopes: {
      drivers: true,
      parts: true,
      setups: true
    }
  };

  saveSyncConsent(consent);
  renderSyncConsentState();
  setSyncResult(tr('sync_saved', { method: methodNode.value }));
}

function revokeSyncConsentFromUi() {
  clearSyncConsent();
  const consentNode = byId('f1SyncConsent');
  if (consentNode) consentNode.checked = false;
  renderSyncConsentState();
  setSyncResult(tr('sync_revoked'));
}

function collectApiConfigFromUi() {
  return {
    baseUrl: byId('f1ApiBaseUrl')?.value || '',
    clientId: byId('f1ApiClientId')?.value || '',
    token: byId('f1ApiToken')?.value || '',
    endpoint: '/v1/player/snapshot'
  };
}

function saveApiConfigFromUi() {
  const cfg = saveSyncApiConfig(collectApiConfigFromUi());
  const maskedToken = cfg.token ? `${cfg.token.slice(0, 4)}...${cfg.token.slice(-3)}` : tr('sync_no_token');
  setSyncResult(tr('sync_api_saved', {
    url: cfg.baseUrl || '-',
    client: cfg.clientId || '-',
    token: maskedToken
  }));
}

function loadFirebaseAuthState() {
  return readJsonSafe(FIREBASE_AUTH_KEY, null);
}

function saveFirebaseAuthState(state) {
  writeJsonSafe(FIREBASE_AUTH_KEY, state);
  return state;
}

function clearFirebaseAuthState() {
  localStorage.removeItem(FIREBASE_AUTH_KEY);
}

function loadFirebaseAutoSyncEnabled() {
  const raw = localStorage.getItem(FIREBASE_AUTO_SYNC_KEY);
  return raw !== '0';
}

function saveFirebaseAutoSyncEnabled(enabled) {
  localStorage.setItem(FIREBASE_AUTO_SYNC_KEY, enabled ? '1' : '0');
}

function firebaseAuthApiUrl(config, action) {
  const key = encodeURIComponent(config.apiKey);
  return `https://identitytoolkit.googleapis.com/v1/accounts:${action}?key=${key}`;
}

function renderFirebaseAuthState() {
  const statusNode = byId('firebaseAuthStatus');
  const autoSyncNode = byId('firebaseAutoSync');
  const auth = loadFirebaseAuthState();
  if (statusNode) {
    statusNode.textContent = auth?.email ? `${auth.email} (${auth.localId || '-'})` : 'nicht angemeldet';
  }
  if (autoSyncNode) {
    autoSyncNode.checked = loadFirebaseAutoSyncEnabled();
  }
}

function collectFirebaseAuthCredentials() {
  return {
    email: String(byId('firebaseAuthEmail')?.value || '').trim(),
    password: String(byId('firebaseAuthPassword')?.value || '')
  };
}

function applyFirebaseAuthResponse(data, emailFallback = '') {
  const expiresSec = Number(data?.expiresIn || 3600);
  const state = {
    localId: String(data?.localId || ''),
    email: String(data?.email || emailFallback || ''),
    idToken: String(data?.idToken || ''),
    refreshToken: String(data?.refreshToken || ''),
    expiresAt: Date.now() + Math.max(60, expiresSec) * 1000,
    updatedAt: new Date().toISOString()
  };
  if (!state.idToken || !state.refreshToken || !state.localId) {
    throw new Error('Firebase Auth Antwort ist unvollständig.');
  }
  saveFirebaseAuthState(state);
  renderFirebaseAuthState();
  return state;
}

async function firebaseSignUpFromUi() {
  const cfg = saveFirebaseConfig(collectFirebaseConfigFromUi());
  const creds = collectFirebaseAuthCredentials();
  if (!cfg.apiKey) throw new Error('Firebase API Key fehlt.');
  if (!creds.email || !creds.password) throw new Error('E-Mail und Passwort sind erforderlich.');

  const response = await fetch(firebaseAuthApiUrl(cfg, 'signUp'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: creds.email, password: creds.password, returnSecureToken: true })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Firebase SignUp fehlgeschlagen: ${data?.error?.message || response.statusText}`);
  }
  applyFirebaseAuthResponse(data, creds.email);
  setSyncResult(`Firebase Account erstellt: ${creds.email}`);
}

async function firebaseLoginFromUi() {
  const cfg = saveFirebaseConfig(collectFirebaseConfigFromUi());
  const creds = collectFirebaseAuthCredentials();
  if (!cfg.apiKey) throw new Error('Firebase API Key fehlt.');
  if (!creds.email || !creds.password) throw new Error('E-Mail und Passwort sind erforderlich.');

  const response = await fetch(firebaseAuthApiUrl(cfg, 'signInWithPassword'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: creds.email, password: creds.password, returnSecureToken: true })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Firebase Login fehlgeschlagen: ${data?.error?.message || response.statusText}`);
  }
  applyFirebaseAuthResponse(data, creds.email);
  setSyncResult(`Firebase Login erfolgreich: ${creds.email}`);
}

function firebaseLogout() {
  clearFirebaseAuthState();
  renderFirebaseAuthState();
  setSyncResult('Firebase Logout erfolgreich.');
}

async function ensureFirebaseIdToken(config) {
  const auth = loadFirebaseAuthState();
  if (!auth?.refreshToken) {
    throw new Error('Firebase Auth erforderlich: Bitte zuerst einloggen.');
  }

  if (auth.idToken && Number(auth.expiresAt || 0) - Date.now() > 60000) {
    return auth;
  }

  const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${encodeURIComponent(config.apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(auth.refreshToken)}`
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Firebase Token-Refresh fehlgeschlagen: ${data?.error?.message || response.statusText}`);
  }

  const refreshed = {
    ...auth,
    idToken: String(data.id_token || auth.idToken || ''),
    refreshToken: String(data.refresh_token || auth.refreshToken || ''),
    localId: String(data.user_id || auth.localId || ''),
    expiresAt: Date.now() + Math.max(60, Number(data.expires_in || 3600)) * 1000,
    updatedAt: new Date().toISOString()
  };
  saveFirebaseAuthState(refreshed);
  renderFirebaseAuthState();
  return refreshed;
}

function queueFirebaseAutoSync(reason = 'change') {
  if (firebaseAutoSyncMuted || !loadFirebaseAutoSyncEnabled()) return;
  if (firebaseAutoSyncTimer) clearTimeout(firebaseAutoSyncTimer);
  firebaseAutoSyncTimer = window.setTimeout(() => {
    savePlayerToFirebase({ silent: true, reason }).catch(() => {});
  }, 1200);
}

function loadFirebaseConfig() {
  return readJsonSafe(FIREBASE_CONFIG_KEY, {
    projectId: '',
    apiKey: ''
  });
}

function saveFirebaseConfig(config) {
  const normalized = {
    projectId: String(config?.projectId || '').trim(),
    apiKey: String(config?.apiKey || '').trim(),
    updatedAt: new Date().toISOString()
  };
  writeJsonSafe(FIREBASE_CONFIG_KEY, normalized);
  return normalized;
}

function collectFirebaseConfigFromUi() {
  return {
    projectId: byId('firebaseProjectId')?.value || '',
    apiKey: byId('firebaseApiKey')?.value || ''
  };
}

function renderFirebaseConfigState() {
  const cfg = loadFirebaseConfig();
  const projectNode = byId('firebaseProjectId');
  const keyNode = byId('firebaseApiKey');
  if (projectNode && !projectNode.value) projectNode.value = cfg.projectId || '';
  if (keyNode && !keyNode.value) keyNode.value = cfg.apiKey || '';
}

function saveFirebaseConfigFromUi() {
  const cfg = saveFirebaseConfig(collectFirebaseConfigFromUi());
  const keyInfo = cfg.apiKey ? `${cfg.apiKey.slice(0, 4)}...` : '-';
  setSyncResult(`Firebase-Konfig gespeichert. Project: ${cfg.projectId || '-'} | Key: ${keyInfo}`);
}

function currentManualSetupMap() {
  const raw = localStorage.getItem(manualKey());
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function collectPlayerCloudPayload() {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    season: currentSeason,
    profile: loadRegistrationProfile(),
    activeClashId: getActiveProfileIdLocal(),
    mode: loadRegistrationProfile()?.playerType || null,
    ownedParts,
    partMeta: loadPartMetaMap(),
    driverStages: loadDriverStageMap(),
    manualSetupByTrack: currentManualSetupMap(),
    communityKnowledge: loadCommunityKnowledge(),
    progress: {
      ownedPartsCount: Array.isArray(ownedParts) ? ownedParts.length : 0,
      totalPartsCount: partCatalog.length,
      totalDriversCount: driversDb.length
    }
  };
}

function applyPlayerCloudPayload(payload) {
  if (!payload || typeof payload !== 'object') return;

  firebaseAutoSyncMuted = true;
  try {

  if (payload.profile && typeof payload.profile === 'object') {
    localStorage.setItem('f1clashRegistration', JSON.stringify(payload.profile));
    if (payload.profile.clashId) {
      localStorage.setItem('f1clashActiveClashId', String(payload.profile.clashId));
    }
  } else if (payload.activeClashId) {
    localStorage.setItem('f1clashActiveClashId', String(payload.activeClashId));
  }

  if (Array.isArray(payload.ownedParts) && payload.ownedParts.length) {
    const allowed = new Set(partCatalog.map((part) => part.name));
    ownedParts = payload.ownedParts.filter((name) => allowed.has(name));
    if (!ownedParts.length) {
      ownedParts = partCatalog.map((part) => part.name);
    }
    saveOwnedParts();
  }

  if (payload.partMeta && typeof payload.partMeta === 'object') {
    savePartMetaMap(payload.partMeta);
  }

  if (payload.driverStages && typeof payload.driverStages === 'object') {
    saveDriverStageMap(payload.driverStages);
  }

  if (payload.manualSetupByTrack && typeof payload.manualSetupByTrack === 'object') {
    localStorage.setItem(manualKey(), JSON.stringify(payload.manualSetupByTrack));
  }

  if (payload.communityKnowledge && typeof payload.communityKnowledge === 'object') {
    saveCommunityKnowledge(payload.communityKnowledge);
  }

  if (hasUi('partsInventory')) buildInventory();
  if (hasUi('driversStandardList')) buildDriverInventory();
  updateKpis();

    if (isOptimizerPageContext()) {
      optimizeSelectedTrack();
      runStrategyCalculation();
    }
  } finally {
    firebaseAutoSyncMuted = false;
  }
}

function firebaseDocId(authState) {
  const uid = String(authState?.localId || 'guest').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_').slice(0, 80) || 'guest';
  const id = String(getActiveProfileIdLocal() || 'guest').trim().toLowerCase();
  const profile = id.replace(/[^a-z0-9_-]/g, '_').slice(0, 80) || 'guest';
  return `${uid}_${profile}`;
}

function firebaseDocUrl(config, docId) {
  const projectId = encodeURIComponent(config.projectId);
  const key = encodeURIComponent(config.apiKey);
  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/playerProfiles/${docId}?key=${key}`;
}

async function savePlayerToFirebase(options = {}) {
  const cfg = saveFirebaseConfig(collectFirebaseConfigFromUi());
  if (!cfg.projectId || !cfg.apiKey) {
    if (!options.silent) setSyncResult('Firebase-Konfig unvollstaendig: Project ID und API Key fehlen.');
    return;
  }

  const auth = await ensureFirebaseIdToken(cfg);
  const docId = firebaseDocId(auth);

  const payload = collectPlayerCloudPayload();
  const body = {
    fields: {
      ownerUid: { stringValue: String(auth.localId) },
      ownerEmail: { stringValue: String(auth.email || '') },
      profileId: { stringValue: String(getActiveProfileIdLocal()) },
      payload: { stringValue: JSON.stringify(payload) },
      updatedAt: { integerValue: String(Date.now()) }
    }
  };

  const response = await fetch(firebaseDocUrl(cfg, docId), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth.idToken}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => response.statusText);
    throw new Error(`Firebase Save fehlgeschlagen (${response.status}): ${detail}`);
  }

  if (!options.silent) {
    setSyncResult(`Firebase Save erfolgreich. Profil ${getActiveProfileIdLocal()} gespeichert.`);
  }
}

async function loadPlayerFromFirebase() {
  const cfg = saveFirebaseConfig(collectFirebaseConfigFromUi());
  if (!cfg.projectId || !cfg.apiKey) {
    setSyncResult('Firebase-Konfig unvollstaendig: Project ID und API Key fehlen.');
    return;
  }

  const auth = await ensureFirebaseIdToken(cfg);
  const docId = firebaseDocId(auth);

  const response = await fetch(firebaseDocUrl(cfg, docId), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${auth.idToken}`
    }
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => response.statusText);
    throw new Error(`Firebase Load fehlgeschlagen (${response.status}): ${detail}`);
  }

  const doc = await response.json();
  const payloadString = doc?.fields?.payload?.stringValue;
  if (!payloadString) {
    throw new Error('Firebase-Dokument enthaelt kein gueltiges payload-Feld.');
  }

  const payload = JSON.parse(payloadString);
  applyPlayerCloudPayload(payload);
  setSyncResult(`Firebase Load erfolgreich. Profil ${getActiveProfileIdLocal()} geladen.`);
}

function isMockMode() {
  const node = byId('f1SyncMockMode');
  return node ? node.checked : false;
}

function renderSyncModeLabel() {
  const label = byId('f1SyncModeLabel');
  if (label) label.textContent = isMockMode() ? tr('sync_mode_mock') : tr('sync_live');
}

function generateMockSnapshot() {
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const selectedParts = shuffle(partCatalog)
    .slice(0, 8)
    .map((p) => ({ name: p.name, level: randInt(1, 12), mod: randInt(0, 3) }));

  const selectedDrivers = shuffle(driversDb)
    .slice(0, 5)
    .map((d) => ({ name: d.name, stage: randInt(1, 12) }));

  return {
    profileId: getActiveProfileIdLocal(),
    generatedAt: new Date().toISOString(),
    mock: true,
    parts: selectedParts,
    drivers: selectedDrivers
  };
}

async function resolveSnapshot(config) {
  if (isMockMode()) {
    return new Promise((resolve) => setTimeout(() => resolve(generateMockSnapshot()), 300));
  }
  return fetchOfficialSnapshot(config);
}

function normalizeExternalPart(rawPart) {
  const name = String(rawPart?.name || rawPart?.id || '').trim();
  if (!name) return null;
  const base = partCatalog.find((p) => p.name.toLowerCase() === name.toLowerCase());
  if (!base) return null;
  return {
    name: base.name,
    category: base.category,
    level: Math.max(1, Math.min(12, Number(rawPart.level || 1))),
    mod: Number(rawPart.mod || 0)
  };
}

function mergeExternalSnapshot(snapshot) {
  const parts = Array.isArray(snapshot?.parts) ? snapshot.parts : [];
  const normalizedParts = parts.map(normalizeExternalPart).filter(Boolean);
  if (normalizedParts.length) {
    const ownedSet = new Set(ownedParts);
    const partMeta = loadPartMetaMap();
    normalizedParts.forEach((part) => {
      ownedSet.add(part.name);
      partMeta[part.name] = { level: part.level, mod: part.mod };
    });
    ownedParts = Array.from(ownedSet);
    saveOwnedParts();
    savePartMetaMap(partMeta);
    buildInventory();
    updateKpis();
  }

  const drivers = Array.isArray(snapshot?.drivers) ? snapshot.drivers : [];
  if (drivers.length) {
    const stageMap = loadDriverStageMap();
    drivers.forEach((driver) => {
      const name = String(driver?.name || '').trim();
      if (!name) return;
      const stage = Math.max(1, Math.min(12, Number(driver.stage || 1)));
      stageMap[name] = { stage: `S${stage}` };
    });
    saveDriverStageMap(stageMap);
    buildDriverInventory();
  }

  optimizeSelectedTrack();
  runStrategyCalculation();
}

async function fetchOfficialSnapshot(config) {
  const baseUrl = String(config?.baseUrl || '').replace(/\/$/, '');
  const endpoint = String(config?.endpoint || '/v1/player/snapshot').startsWith('/')
    ? String(config?.endpoint || '/v1/player/snapshot')
    : `/${String(config?.endpoint || 'v1/player/snapshot')}`;

  if (!baseUrl) throw new Error(tr('sync_api_base_missing'));

  const headers = {
    Accept: 'application/json'
  };
  if (config.clientId) headers['X-Client-Id'] = config.clientId;
  if (config.token) headers.Authorization = `Bearer ${config.token}`;

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: 'GET',
    headers
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(tr('sync_api_error', { status: response.status, detail: body || response.statusText }));
  }

  return response.json();
}

async function testApiConnection() {
  const mockFlag = isMockMode() ? ' [Mock]' : ' [Live]';
  try {
    const config = saveSyncApiConfig(collectApiConfigFromUi());
    const snapshot = await resolveSnapshot(config);
    const driversCount = Array.isArray(snapshot?.drivers) ? snapshot.drivers.length : 0;
    const partsCount = Array.isArray(snapshot?.parts) ? snapshot.parts.length : 0;
    setSyncResult(tr('sync_test_ok', { flag: mockFlag, drivers: driversCount, parts: partsCount }));
  } catch (error) {
    setSyncResult(tr('sync_test_fail', { flag: mockFlag, message: error.message }));
  }
}

function previewMockSnapshot() {
  const snapshot = generateMockSnapshot();
  const out = byId('f1SyncResult');
  if (!out) return;
  out.textContent = JSON.stringify(snapshot, null, 2);
}

async function runSyncFetchFlow() {
  const consent = loadSyncConsent();
  const methodNode = byId('f1SyncMethod');
  const method = methodNode?.value || consent?.method || 'official_api';
  const mockFlag = isMockMode() ? ' [Mock]' : '';

  if (!consent?.granted) {
    setSyncResult(tr('sync_no_consent_fetch'));
    return;
  }

  if (method === 'official_api') {
    try {
      const config = saveSyncApiConfig(collectApiConfigFromUi());
      const snapshot = await resolveSnapshot(config);
      mergeExternalSnapshot(snapshot);
      const importedDrivers = Array.isArray(snapshot?.drivers) ? snapshot.drivers.length : 0;
      const importedParts = Array.isArray(snapshot?.parts) ? snapshot.parts.length : 0;
      setSyncResult(tr('sync_fetch_ok', { flag: mockFlag, drivers: importedDrivers, parts: importedParts }));
    } catch (error) {
      setSyncResult(tr('sync_fetch_fail', { flag: mockFlag, message: error.message }));
    }
    return;
  }

  if (method === 'screenshot_ocr') {
    const ocrInput = byId('ocrFile');
    if (ocrInput) ocrInput.click();
    setSyncResult(tr('sync_ocr_hint'));
    return;
  }

  setSyncResult(tr('sync_manual_hint'));
}

function initSyncConsentPanel() {
  const hasPanel = byId('f1SyncMethod') || byId('f1SyncConsent');
  if (!hasPanel) return;
  renderSyncConsentState();
  renderSyncModeLabel();
  renderFirebaseConfigState();
  renderFirebaseAuthState();
  addListener('f1SyncGrantButton', 'click', saveSyncConsentFromUi);
  addListener('f1SyncRevokeButton', 'click', revokeSyncConsentFromUi);
  addListener('f1SyncFetchButton', 'click', runSyncFetchFlow);
  addListener('f1SyncTestButton', 'click', testApiConnection);
  addListener('f1ApiSaveButton', 'click', saveApiConfigFromUi);
  addListener('firebaseConfigSaveButton', 'click', saveFirebaseConfigFromUi);
  addListener('firebaseRegisterButton', 'click', () => {
    firebaseSignUpFromUi().catch((error) => setSyncResult(error.message || String(error)));
  });
  addListener('firebaseLoginButton', 'click', () => {
    firebaseLoginFromUi().catch((error) => setSyncResult(error.message || String(error)));
  });
  addListener('firebaseLogoutButton', 'click', firebaseLogout);
  addListener('firebaseAutoSync', 'change', (event) => {
    const enabled = Boolean(event?.target?.checked);
    saveFirebaseAutoSyncEnabled(enabled);
    if (enabled) queueFirebaseAutoSync('toggle-on');
  });
  addListener('firebaseSaveButton', 'click', () => {
    savePlayerToFirebase().catch((error) => setSyncResult(error.message || String(error)));
  });
  addListener('firebaseLoadButton', 'click', () => {
    loadPlayerFromFirebase().catch((error) => setSyncResult(error.message || String(error)));
  });
  addListener('f1SyncPreviewMock', 'click', previewMockSnapshot);
  addListener('f1SyncMockMode', 'change', renderSyncModeLabel);
  addListener('f1SyncMethod', 'change', () => {
    const consent = loadSyncConsent();
    if (!consent?.granted) return;
    consent.method = byId('f1SyncMethod')?.value || consent.method;
    consent.updatedAt = new Date().toISOString();
    saveSyncConsent(consent);
    renderSyncConsentState();
  });
}

function readJsonSafe(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJsonSafe(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeCommunityKnowledge(raw) {
  const data = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  const normalizedTracks = {};
  const tracks = data.tracks && typeof data.tracks === 'object' ? data.tracks : {};

  Object.entries(tracks).forEach(([trackName, cfg]) => {
    const trackCfg = cfg && typeof cfg === 'object' ? cfg : {};
    const partBoosts = trackCfg.partBoosts && typeof trackCfg.partBoosts === 'object' ? trackCfg.partBoosts : {};
    const strategyBoosts = trackCfg.strategyBoosts && typeof trackCfg.strategyBoosts === 'object' ? trackCfg.strategyBoosts : {};
    const driverBoosts = trackCfg.driverBoosts && typeof trackCfg.driverBoosts === 'object' ? trackCfg.driverBoosts : {};

    normalizedTracks[trackName] = {
      partBoosts: Object.fromEntries(Object.entries(partBoosts).map(([name, val]) => [name, Number(val) || 0])),
      strategyBoosts: Object.fromEntries(Object.entries(strategyBoosts).map(([name, val]) => [name, Number(val) || 0])),
      driverBoosts: Object.fromEntries(Object.entries(driverBoosts).map(([name, val]) => [name, Number(val) || 0])),
      notes: typeof trackCfg.notes === 'string' ? trackCfg.notes : ''
    };
  });

  return {
    version: Number(data.version || 1),
    updatedAt: data.updatedAt || new Date().toISOString(),
    sources: Array.isArray(data.sources) ? data.sources : [],
    tracks: normalizedTracks
  };
}

function loadCommunityKnowledge() {
  const raw = readJsonSafe(COMMUNITY_KNOWLEDGE_KEY, null);
  return normalizeCommunityKnowledge(raw || {});
}

function saveCommunityKnowledge(data) {
  const normalized = normalizeCommunityKnowledge(data);
  writeJsonSafe(COMMUNITY_KNOWLEDGE_KEY, normalized);
  communityKnowledge = normalized;
  queueFirebaseAutoSync('community');
  return normalized;
}

function mergeCommunityKnowledge(baseData, incomingData) {
  const base = normalizeCommunityKnowledge(baseData || {});
  const incoming = normalizeCommunityKnowledge(incomingData || {});
  const conflicts = [];

  const sourceMap = new Map();
  [...base.sources, ...incoming.sources].forEach((source) => {
    if (!source || typeof source !== 'object') return;
    const key = `${source.type || 'unknown'}|${source.url || source.id || JSON.stringify(source)}`;
    sourceMap.set(key, source);
  });

  const mergedTracks = { ...base.tracks };
  Object.entries(incoming.tracks).forEach(([trackName, cfg]) => {
    const prev = mergedTracks[trackName] || { partBoosts: {}, strategyBoosts: {}, driverBoosts: {}, notes: '' };
    Object.entries(cfg.partBoosts || {}).forEach(([partName, value]) => {
      if (Object.prototype.hasOwnProperty.call(prev.partBoosts, partName) && Number(prev.partBoosts[partName]) !== Number(value)) {
        conflicts.push(`${trackName} partBoost ${partName}: ${prev.partBoosts[partName]} -> ${value}`);
      }
    });
    Object.entries(cfg.strategyBoosts || {}).forEach(([strategyKey, value]) => {
      if (Object.prototype.hasOwnProperty.call(prev.strategyBoosts, strategyKey) && Number(prev.strategyBoosts[strategyKey]) !== Number(value)) {
        conflicts.push(`${trackName} strategyBoost ${strategyKey}: ${prev.strategyBoosts[strategyKey]} -> ${value}`);
      }
    });
    Object.entries(cfg.driverBoosts || {}).forEach(([driverName, value]) => {
      if (Object.prototype.hasOwnProperty.call(prev.driverBoosts, driverName) && Number(prev.driverBoosts[driverName]) !== Number(value)) {
        conflicts.push(`${trackName} driverBoost ${driverName}: ${prev.driverBoosts[driverName]} -> ${value}`);
      }
    });

    mergedTracks[trackName] = {
      partBoosts: { ...prev.partBoosts, ...cfg.partBoosts },
      strategyBoosts: { ...prev.strategyBoosts, ...cfg.strategyBoosts },
      driverBoosts: { ...prev.driverBoosts, ...cfg.driverBoosts },
      notes: cfg.notes || prev.notes || ''
    };
  });

  return {
    merged: {
      version: Math.max(base.version || 1, incoming.version || 1),
      updatedAt: new Date().toISOString(),
      sources: Array.from(sourceMap.values()),
      tracks: mergedTracks
    },
    conflicts
  };
}

function isCommunityMergeEnabled() {
  const node = byId('communityMergeMode');
  return node ? Boolean(node.checked) : false;
}

function saveCommunityKnowledgeWithMode(data) {
  if (!isCommunityMergeEnabled()) {
    return { saved: saveCommunityKnowledge(data), mode: 'override', conflicts: [] };
  }
  const mergeResult = mergeCommunityKnowledge(loadCommunityKnowledge(), data);
  return { saved: saveCommunityKnowledge(mergeResult.merged), mode: 'merge', conflicts: mergeResult.conflicts };
}

function getTrackCommunity(trackName) {
  if (!communityKnowledge) communityKnowledge = loadCommunityKnowledge();
  return communityKnowledge.tracks[trackName] || { partBoosts: {}, strategyBoosts: {}, driverBoosts: {}, notes: '' };
}

function getCommunityPartBonus(trackName, parts) {
  const trackCfg = getTrackCommunity(trackName);
  return parts.reduce((sum, part) => sum + Number(trackCfg.partBoosts[part.name] || 0), 0);
}

function getCommunityStrategyBoost(trackName, strategyKey) {
  const trackCfg = getTrackCommunity(trackName);
  return Number(trackCfg.strategyBoosts[strategyKey] || 0);
}

function getCommunityDriverBoost(trackName, driverName) {
  const trackCfg = getTrackCommunity(trackName);
  return Number((trackCfg.driverBoosts || {})[driverName] || 0);
}

window.getCommunityPartBonus = getCommunityPartBonus;
window.getCommunityStrategyBoost = getCommunityStrategyBoost;

function updateCommunityKnowledgeResult(text) {
  setResult('communityKnowledgeResult', text);
}

function importCommunityKnowledgeFromTextarea() {
  const node = byId('communityKnowledgeInput');
  if (!node) return;
  if (!node.value.trim()) {
    updateCommunityKnowledgeResult(tr('community_no_json'));
    return;
  }
  try {
    const parsed = JSON.parse(node.value);
    const result = saveCommunityKnowledgeWithMode(parsed);
    const modeText = result.mode === 'merge' ? 'Merge' : 'Override';
    const conflictNote = result.conflicts.length ? ` | Konflikte: ${result.conflicts.length} (${result.conflicts.slice(0, 4).join(' ; ')})` : '';
    updateCommunityKnowledgeResult(tr('community_import_ok', {
      mode: modeText,
      sources: result.saved.sources.length,
      tracks: Object.keys(result.saved.tracks).length,
      conflicts: conflictNote
    }));
    runStrategyCalculation();
    optimizeSelectedTrack();
  } catch (error) {
    updateCommunityKnowledgeResult(tr('community_import_err', { message: error.message }));
  }
}

function importCommunityKnowledgeFromFile() {
  const input = byId('communityKnowledgeFile');
  if (!input || !input.files || !input.files[0]) {
    updateCommunityKnowledgeResult(tr('community_file_missing'));
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || '{}'));
      const result = saveCommunityKnowledgeWithMode(parsed);
      const textArea = byId('communityKnowledgeInput');
      if (textArea) textArea.value = JSON.stringify(result.saved, null, 2);
      const modeText = result.mode === 'merge' ? 'Merge' : 'Override';
      const conflictNote = result.conflicts.length ? ` | Konflikte: ${result.conflicts.length} (${result.conflicts.slice(0, 4).join(' ; ')})` : '';
      updateCommunityKnowledgeResult(tr('community_file_ok', {
        mode: modeText,
        sources: result.saved.sources.length,
        tracks: Object.keys(result.saved.tracks).length,
        conflicts: conflictNote
      }));
      runStrategyCalculation();
      optimizeSelectedTrack();
    } catch (error) {
      updateCommunityKnowledgeResult(tr('community_file_err', { message: error.message }));
    }
  };
  reader.readAsText(input.files[0]);
}

function exportCommunityKnowledgeToTextarea() {
  const textArea = byId('communityKnowledgeInput');
  if (!textArea) return;
  if (!communityKnowledge) communityKnowledge = loadCommunityKnowledge();
  textArea.value = JSON.stringify(communityKnowledge, null, 2);
  updateCommunityKnowledgeResult(tr('community_export_ok'));
}

function resetCommunityKnowledge() {
  localStorage.removeItem(COMMUNITY_KNOWLEDGE_KEY);
  communityKnowledge = loadCommunityKnowledge();
  const textArea = byId('communityKnowledgeInput');
  if (textArea) textArea.value = '';
  updateCommunityKnowledgeResult(tr('community_reset_ok'));
  runStrategyCalculation();
  optimizeSelectedTrack();
}

function initCommunityKnowledgePanel() {
  const renderStatus = () => {
    communityKnowledge = loadCommunityKnowledge();
    const tracksCount = Object.keys(communityKnowledge.tracks || {}).length;
    updateCommunityKnowledgeResult(tr('community_active', {
      tracks: tracksCount,
      sources: communityKnowledge.sources.length
    }));
  };

  if (Boolean(window.Capacitor?.isNativePlatform?.())) {
    updateCommunityKnowledgeResult('Community-Wissen wird geladen...');
    deferUiTask(renderStatus, 260);
  } else {
    renderStatus();
  }

  addListener('communityImportButton', 'click', importCommunityKnowledgeFromTextarea);
  addListener('communityImportFileButton', 'click', importCommunityKnowledgeFromFile);
  addListener('communityExportButton', 'click', exportCommunityKnowledgeToTextarea);
  addListener('communityResetButton', 'click', resetCommunityKnowledge);
}

function partMetaStorageKey() {
  return `partMeta_${getActiveProfileIdLocal()}`;
}

function driverStageStorageKey() {
  return `driverStage_${getActiveProfileIdLocal()}`;
}

function loadPartMetaMap() {
  return readJsonSafe(partMetaStorageKey(), {});
}

function savePartMetaMap(meta) {
  writeJsonSafe(partMetaStorageKey(), meta);
  queueFirebaseAutoSync('part-meta');
}

function loadDriverStageMap() {
  return readJsonSafe(driverStageStorageKey(), {});
}

function saveDriverStageMap(meta) {
  writeJsonSafe(driverStageStorageKey(), meta);
  queueFirebaseAutoSync('driver-stage');
}

function partQualityByLevel(level) {
  const labels = String(tr('part_quality_labels')).split('|');
  return labels[Math.max(0, Math.min(labels.length - 1, level - 1))];
}

function getPartEffectiveStats(part, metaMap) {
  const meta = (metaMap && metaMap[part.name]) || {};
  const level = Math.max(1, Math.min(12, Number(meta.level || 1)));
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

function getDriverStageNumber(driverName, stageMap) {
  const raw = stageMap?.[driverName]?.stage;
  const match = String(raw || 'S1').match(/^S(\d{1,2})$/i);
  const stage = match ? Number(match[1]) : 1;
  return Math.max(1, Math.min(12, stage));
}

function driverAbilityScoreOnTrack(driver, trackName) {
  const w = trackWeights[trackName];
  if (!w) return 0;
  return driver.pace * ((w.tempo + w.kurven) / 2)
    + driver.qualifying * w.quali
    + driver.overtaking * w.drs
    + driver.tyre * w.antrieb * 0.9
    + driver.consistency * 0.12;
}

function getDriverAbilityContext(trackName) {
  const stageMap = loadDriverStageMap();
  const ranked = driversDb.map((driver) => {
    const stage = getDriverStageNumber(driver.name, stageMap);
    const base = driverAbilityScoreOnTrack(driver, trackName);
    const stageBoost = 1 + (stage - 1) * 0.013;
    const effective = base * stageBoost;
    return { name: driver.name, stage, base, effective };
  }).sort((a, b) => b.effective - a.effective);

  const top = ranked.slice(0, 2);
  const avgTopEffective = top.length ? top.reduce((sum, row) => sum + row.effective, 0) / top.length : 0;
  const driverModifier = Math.max(0, Math.min(2.2, (avgTopEffective - 70) * 0.028));

  return {
    topDrivers: top,
    avgTopEffective,
    driverModifier
  };
}

function renderDriverImpact(trackName, driverCtx) {
  const out = byId('driverImpactResult');
  const chartNode = byId('driverImpactChart');
  const modeNode = byId('driverImpactMode');
  const mode = modeNode ? modeNode.value : 'effective';
  if (!out) return;
  if (!driverCtx || !Array.isArray(driverCtx.topDrivers) || !driverCtx.topDrivers.length) {
    out.textContent = tr('driver_impact_no_data');
    if (driverImpactChart) {
      driverImpactChart.destroy();
      driverImpactChart = null;
    }
    return;
  }

  const lines = driverCtx.topDrivers.map((entry, idx) => {
    const stageBoost = 1 + (entry.stage - 1) * 0.013;
    return tr('driver_impact_line', {
      idx: idx + 1,
      name: entry.name,
      stage: entry.stage,
      base: entry.base.toFixed(2),
      boost: stageBoost.toFixed(3),
      effective: entry.effective.toFixed(2)
    });
  });

  const modeText = mode === 'stage'
    ? tr('driver_impact_mode_stage')
    : (mode === 'community' ? tr('driver_impact_mode_community') : tr('driver_impact_mode_effective'));
  const modeDescription = mode === 'stage'
    ? tr('driver_impact_desc_stage')
    : (mode === 'community'
      ? tr('driver_impact_desc_community')
      : tr('driver_impact_desc_effective'));

  out.textContent = tr('driver_impact_block', {
    track: trackName,
    lines: lines.join('\n'),
    modifier: Number(driverCtx.driverModifier || 0).toFixed(2),
    mode: modeText,
    description: modeDescription
  });

  if (!chartNode) return;

  const stageMap = loadDriverStageMap();
  const ranking = driversDb.map((driver) => {
    const stage = getDriverStageNumber(driver.name, stageMap);
    const base = driverAbilityScoreOnTrack(driver, trackName);
    const stageBoost = 1 + (stage - 1) * 0.013;
    const effective = base * stageBoost;
    const stageImpact = (stageBoost - 1) * 100;
    const communityBoost = getCommunityDriverBoost(trackName, driver.name);
    const communityValue = effective + communityBoost;
    return { name: `${driver.name} (${`S${stage}`})`, effective, stageImpact, communityValue };
  });

  let metricKey = 'effective';
  let label = tr('driver_impact_chart_label_effective', { track: trackName });
  let yLabel = tr('driver_impact_chart_y_effective');
  if (mode === 'stage') {
    metricKey = 'stageImpact';
    label = tr('driver_impact_chart_label_stage', { track: trackName });
    yLabel = tr('driver_impact_chart_y_stage');
  }
  if (mode === 'community') {
    metricKey = 'communityValue';
    label = tr('driver_impact_chart_label_community', { track: trackName });
    yLabel = tr('driver_impact_chart_y_community');
  }

  const top5 = ranking.sort((a, b) => b[metricKey] - a[metricKey]).slice(0, 5);

  if (driverImpactChart) driverImpactChart.destroy();
  driverImpactChart = new Chart(chartNode, {
    type: 'bar',
    data: {
      labels: top5.map((entry) => entry.name),
      datasets: [{
        label,
        data: top5.map((entry) => Number(entry[metricKey].toFixed(2))),
        backgroundColor: ['rgba(0,255,204,.45)', 'rgba(255,221,0,.45)', 'rgba(255,0,255,.45)', 'rgba(120,170,255,.45)', 'rgba(255,120,120,.45)']
      }]
    },
    options: chartOptions(yLabel)
  });

  setStrategyChartPopupData('driverImpactChart', {
    title: label,
    subtitle: `${trackName} | ${modeText}`,
    columns: ['Fahrer', yLabel],
    rows: top5.map((entry) => [entry.name, Number(entry[metricKey].toFixed(2))])
  });
}

function buildDriverQualityRanks() {
  const sorted = [...driversDb].sort((a, b) => b.pace - a.pace);
  const total = Math.max(1, sorted.length - 1);
  return Object.fromEntries(sorted.map((driver, idx) => {
    const score = Math.round(10 - (idx / total) * 9);
    return [driver.name, Math.max(1, Math.min(10, score))];
  }));
}

function driverEditionType(name) {
  if (SPECIAL_DRIVER_NAMES.has(name)) return 'special';
  if (LEGENDARY_DRIVER_NAMES.has(name)) return 'legendary';
  return 'standard';
}

function getTrack(name) { return tracksDb.find((t) => t.name === name) || tracksDb[0]; }
function manualKey() { return `manualSetup_${currentSeason}`; }

function loadOwnedParts() {
  const raw = localStorage.getItem('ownedParts');
  if (!raw) return partCatalog.map((p) => p.name);
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : partCatalog.map((p) => p.name);
  } catch {
    return partCatalog.map((p) => p.name);
  }
}

function saveOwnedParts() {
  localStorage.setItem('ownedParts', JSON.stringify(ownedParts));
  queueFirebaseAutoSync('owned-parts');
}

function fillTrackSelects() {
  ['trackSelect', 'builderTrackSelect', 'strategyTrackSelect'].forEach((id) => {
    const select = byId(id);
    if (!select) return;
    select.innerHTML = '';
    tracksDb.forEach((t) => {
      const option = document.createElement('option');
      option.value = t.name;
      option.textContent = t.name;
      select.appendChild(option);
    });
  });
}

function fillDriverSelects() {
  const a = byId('driverASelect');
  const b = byId('driverBSelect');
  if (!a || !b) return;
  a.innerHTML = ''; b.innerHTML = '';
  driversDb.forEach((d, idx) => {
    const oa = document.createElement('option'); oa.value = d.name; oa.textContent = d.name;
    const ob = document.createElement('option'); ob.value = d.name; ob.textContent = d.name;
    a.appendChild(oa); b.appendChild(ob);
    if (idx === 1) b.value = d.name;
  });
}

function renderStatInputs(containerId, prefix) {
  const wrap = byId(containerId);
  if (!wrap) return;
  wrap.innerHTML = '';
  statKeys.forEach((key) => {
    const div = document.createElement('div');
    div.className = 'stat';
    div.innerHTML = `<label for="${prefix}_${key}">${statLabels[key]}</label><input id="${prefix}_${key}" type="number" min="0" max="260" value="100" />`;
    wrap.appendChild(div);
  });
}

function getStatValues(prefix) {
  const values = {};
  statKeys.forEach((k) => {
    const input = byId(`${prefix}_${k}`);
    values[k] = Number(input?.value || 0);
  });
  return values;
}

function scoreStats(values, weights) {
  return statKeys.reduce((acc, k) => acc + (values[k] || 0) * (weights[k] || 0), 0);
}

function chartFontScale() {
  const viewportWidth = Math.max(window.innerWidth || 0, document.documentElement?.clientWidth || 0, 360);
  if (viewportWidth <= 480) return 0.78;
  if (viewportWidth <= 640) return 0.86;
  if (viewportWidth <= 900) return 0.96;
  if (viewportWidth <= 1280) return 1.1;
  return 1.3;
}

function isMobileChartViewport() {
  const viewportWidth = Math.max(window.innerWidth || 0, document.documentElement?.clientWidth || 0, 360);
  return viewportWidth <= 760;
}

function scaledChartFont(size, minSize = null) {
  const fallbackMin = size <= 11 ? 9 : 10;
  return Math.max(minSize ?? fallbackMin, Math.round(size * chartFontScale()));
}

function formatChartPopupValue(value) {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'number') return Number.isInteger(value) ? String(value) : value.toFixed(2);
  return String(value);
}

function setStrategyChartPopupData(chartId, config) {
  strategyChartPopupData[chartId] = config;
  const node = byId(chartId);
  if (node) node.classList.add('chart-clickable');
}

function getChartInstanceById(chartId) {
  if (chartId === 'strategyChart') return strategyChart;
  if (chartId === 'raceChart') return raceChart;
  if (chartId === 'driverImpactChart') return driverImpactChart;
  if (chartId === 'positionChart') return typeof window.positionChart !== 'undefined' ? window.positionChart : null;
  return null;
}

function getChartDatasetCount(chartId) {
  const chart = getChartInstanceById(chartId);
  return chart?.data?.datasets?.length || 0;
}

function renderChartPopupSubtitle(baseSubtitle = '') {
  const subtitleNode = byId('chartPopupSubtitle');
  if (!subtitleNode) return;
  if (!activePopupChartId) {
    subtitleNode.textContent = baseSubtitle || '';
    return;
  }
  const datasetCount = getChartDatasetCount(activePopupChartId);
  if (datasetCount <= 1) {
    subtitleNode.textContent = baseSubtitle || '';
    return;
  }
  const state = chartTouchState[activePopupChartId] || {};
  const seriesText = Number.isInteger(state.activeIndex)
    ? `Serie ${state.activeIndex + 1}/${datasetCount}`
    : 'Alle Serien sichtbar';
  const hint = 'Swipe links/rechts = Serie wechseln';
  subtitleNode.textContent = [baseSubtitle, `${seriesText} • ${hint}`].filter(Boolean).join(' | ');
}

function applyChartDatasetFocus(chartId, nextIndex = null) {
  const chart = getChartInstanceById(chartId);
  if (!chart || !Array.isArray(chart.data?.datasets)) return;
  const datasetCount = chart.data.datasets.length;
  if (datasetCount <= 1) return;
  const state = chartTouchState[chartId] || (chartTouchState[chartId] = {});

  if (nextIndex === null || nextIndex === undefined) {
    delete state.activeIndex;
    chart.data.datasets.forEach((dataset) => {
      dataset.hidden = false;
    });
  } else {
    const normalizedIndex = ((nextIndex % datasetCount) + datasetCount) % datasetCount;
    state.activeIndex = normalizedIndex;
    chart.data.datasets.forEach((dataset, idx) => {
      dataset.hidden = idx !== normalizedIndex;
    });
  }

  chart.update();
  if (activePopupChartId === chartId) {
    renderChartPopupSubtitle(strategyChartPopupData[chartId]?.subtitle || '');
  }
}

function stepChartDatasetFocus(chartId, direction) {
  const datasetCount = getChartDatasetCount(chartId);
  if (datasetCount <= 1) return;
  const state = chartTouchState[chartId] || {};
  const currentIndex = Number.isInteger(state.activeIndex) ? state.activeIndex : -1;
  const nextIndex = currentIndex < 0
    ? (direction >= 0 ? 0 : datasetCount - 1)
    : (currentIndex + direction + datasetCount) % datasetCount;
  applyChartDatasetFocus(chartId, nextIndex);
}

function toggleChartPopupFullscreen(forceValue = null) {
  const popup = byId('chartPopup');
  const fullscreenButton = byId('chartPopupFullscreen');
  if (!popup) return;
  const shouldEnable = forceValue === null ? !popup.classList.contains('is-fullscreen') : !!forceValue;
  popup.classList.toggle('is-fullscreen', shouldEnable);
  if (fullscreenButton) fullscreenButton.textContent = shouldEnable ? 'Fenster' : 'Fullscreen';
}

function buildPopupConfigFromChart(chartId) {
  const chart = getChartInstanceById(chartId);
  if (!chart || !chart.data) return null;
  const labels = Array.isArray(chart.data.labels) ? chart.data.labels : [];
  const datasets = Array.isArray(chart.data.datasets) ? chart.data.datasets : [];
  if (!datasets.length) return null;

  const columns = [tr('chart_popup_col_label'), ...datasets.map((ds, idx) => ds.label || tr('chart_popup_series_fallback', { index: idx + 1 }))];
  const rowCount = Math.max(labels.length, ...datasets.map((ds) => (Array.isArray(ds.data) ? ds.data.length : 0)));
  const rows = Array.from({ length: rowCount }, (_, rowIdx) => {
    const rowLabel = labels[rowIdx] ?? `#${rowIdx + 1}`;
    const values = datasets.map((ds) => {
      const data = Array.isArray(ds.data) ? ds.data[rowIdx] : undefined;
      return data === null || data === undefined ? '-' : data;
    });
    return [rowLabel, ...values];
  });

  const titleMap = {
    strategyChart: tr('chart_popup_title_strategy'),
    raceChart: tr('chart_popup_title_race'),
    positionChart: tr('chart_popup_title_position')
  };

  return {
    title: titleMap[chartId] || tr('chart_popup_title_default'),
    subtitle: tr('chart_popup_subtitle_live'),
    columns,
    rows
  };
}

function closeChartPopup() {
  const popup = byId('chartPopup');
  if (!popup) return;
  toggleChartPopupFullscreen(false);
  popup.hidden = true;
  activePopupChartId = null;
}

function openStrategyChartPopup(chartId) {
  let config = strategyChartPopupData[chartId];
  if (!config || !Array.isArray(config.columns) || !Array.isArray(config.rows) || config.columns.length === 0 || config.rows.length === 0) {
    config = buildPopupConfigFromChart(chartId);
  }
  const popup = byId('chartPopup');
  const titleNode = byId('chartPopupTitle');
  const subtitleNode = byId('chartPopupSubtitle');
  const headNode = byId('chartPopupHead');
  const bodyNode = byId('chartPopupBody');
  if (!popup || !titleNode || !subtitleNode || !headNode || !bodyNode) return;

  if (!config) {
    config = {
      title: tr('chart_popup_title_default'),
      subtitle: tr('chart_popup_subtitle_empty'),
      columns: [tr('chart_popup_hint_col')],
      rows: [[tr('chart_popup_hint_row')]]
    };
  }

  titleNode.textContent = config.title || tr('chart_popup_title_default');
  activePopupChartId = chartId;
  subtitleNode.textContent = config.subtitle || '';
  headNode.innerHTML = `<tr>${(config.columns || []).map((label) => `<th>${label}</th>`).join('')}</tr>`;
  bodyNode.innerHTML = (config.rows || [])
    .map((row) => `<tr>${row.map((cell) => `<td>${formatChartPopupValue(cell)}</td>`).join('')}</tr>`)
    .join('');
  popup.hidden = false;
  renderChartPopupSubtitle(config.subtitle || '');
}

function bindStrategyChartPopup(chartId) {
  const node = byId(chartId);
  if (!node || node.dataset.popupBound === 'true') return;
  node.dataset.popupBound = 'true';
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  const swipeThreshold = 36;

  node.addEventListener('touchstart', (event) => {
    if (!event.touches || event.touches.length !== 1) return;
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    touchStartTime = Date.now();
  }, { passive: true });

  node.addEventListener('touchend', (event) => {
    if (!event.changedTouches || event.changedTouches.length !== 1) return;
    const dx = event.changedTouches[0].clientX - touchStartX;
    const dy = event.changedTouches[0].clientY - touchStartY;
    const elapsed = Date.now() - touchStartTime;
    const isHorizontalSwipe = Math.abs(dx) >= swipeThreshold && Math.abs(dx) > Math.abs(dy) && elapsed <= 900;
    if (!isHorizontalSwipe) return;
    node.dataset.ignorePopupClick = 'true';
    stepChartDatasetFocus(chartId, dx < 0 ? 1 : -1);
  }, { passive: true });

  node.addEventListener('dblclick', () => applyChartDatasetFocus(chartId, null));

  node.addEventListener('click', () => {
    if (node.dataset.ignorePopupClick === 'true') {
      node.dataset.ignorePopupClick = 'false';
      return;
    }
    openStrategyChartPopup(chartId);
  });
}

function applyRaceChartChoice(choice) {
  const allowed = new Set(['strategy', 'race', 'position', 'driverImpact']);
  const selected = allowed.has(choice) ? choice : 'race';

  document.querySelectorAll('[data-choice-chart]').forEach((node) => {
    const chartKey = node.getAttribute('data-choice-chart');
    node.hidden = chartKey !== selected;
  });

  document.querySelectorAll('[data-choice-result]').forEach((node) => {
    const resultKey = node.getAttribute('data-choice-result');
    node.hidden = resultKey !== selected;
  });

  const impactRow = byId('driverImpactMode')?.closest('.row');
  if (impactRow) impactRow.hidden = selected !== 'driverImpact';

  document.querySelectorAll('.chart-choice-tab[data-choice-tab]').forEach((node) => {
    const isActive = node.getAttribute('data-choice-tab') === selected;
    node.classList.toggle('is-active', isActive);
    node.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
}

function buildStrategyPlanLabel(plan) {
  return plan.map((stint) => `${stint.start}-${stint.end} ${stint.tyre}`).join(' | ');
}

window.setStrategyChartPopupData = setStrategyChartPopupData;

function chartOptions(yLabel = tr('chart_y_value')) {
  const mobile = isMobileChartViewport();
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#f0faff',
          font: { size: scaledChartFont(mobile ? 11 : 12, mobile ? 9 : 10), weight: '600' },
          padding: mobile ? 10 : 16,
          boxWidth: mobile ? 12 : 18
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#c8e6f7',
          font: { size: scaledChartFont(mobile ? 10 : 11, 9), weight: '600' },
          autoSkip: true,
          maxTicksLimit: mobile ? 6 : 10,
          maxRotation: 0
        },
        grid: { color: 'rgba(121,233,255,0.07)' }
      },
      y: {
        ticks: {
          color: '#c8e6f7',
          font: { size: scaledChartFont(mobile ? 10 : 11, 9), weight: '600' },
          maxTicksLimit: mobile ? 6 : 9
        },
        grid: { color: 'rgba(121,233,255,0.07)' },
        title: {
          display: true,
          text: yLabel,
          color: '#79e9ff',
          font: { size: scaledChartFont(mobile ? 11 : 12, 9), weight: '700' }
        }
      }
    }
  };
}

const trackCircuitPaths = {
  'Bahrain':        'M 55,148 Q 28,148 26,112 L 26,78 Q 26,38 65,28 L 238,28 Q 274,28 274,65 L 274,95 Q 272,122 248,132 L 228,136 L 236,158 Q 240,176 214,178 L 88,175 Q 55,168 55,148 Z',
  'Saudi Arabia':   'M 75,24 L 232,22 Q 272,22 274,54 L 270,88 Q 262,112 232,120 L 210,122 L 218,148 Q 226,174 196,178 L 74,175 Q 36,172 34,140 L 34,56 Q 34,24 75,24 Z',
  'Australia':      'M 98,28 L 218,28 Q 258,30 264,68 L 260,112 Q 250,148 218,160 L 172,164 L 172,176 Q 148,184 108,178 L 78,170 Q 38,155 34,118 L 34,74 Q 38,36 75,28 Z',
  'Japan':          'M 152,97 Q 138,66 112,46 Q 74,20 42,40 Q 16,60 20,93 Q 26,126 60,140 Q 96,152 130,132 Q 150,118 154,97 Q 162,76 172,53 Q 184,26 218,20 Q 258,16 273,56 Q 284,93 264,122 Q 240,150 200,152 Q 162,152 152,125 Q 148,110 152,97 Z',
  'China':          'M 65,30 L 242,30 Q 272,30 274,62 L 274,92 Q 270,118 240,124 L 205,126 Q 200,152 210,170 Q 215,182 188,184 L 78,182 Q 38,173 34,142 L 34,66 Q 34,30 65,30 Z',
  'Miami':          'M 78,30 L 230,30 Q 268,31 270,62 L 268,97 Q 260,120 228,128 L 190,130 L 192,154 Q 190,174 162,178 L 86,175 Q 44,168 36,138 L 34,76 Q 37,32 78,30 Z',
  'Imola':          'M 92,28 L 208,28 Q 250,30 256,65 L 253,93 Q 246,120 215,128 L 184,130 L 192,157 Q 198,180 168,183 L 97,180 Q 50,172 40,142 L 39,78 Q 41,32 92,28 Z',
  'Monaco':         'M 240,50 Q 265,34 270,58 L 267,80 Q 259,103 232,110 L 194,114 L 176,90 Q 170,64 184,44 L 207,26 Q 238,16 260,37 Q 274,53 266,78 L 248,94 Q 227,105 194,108 L 138,107 Q 92,103 70,80 L 56,50 Q 49,23 78,14 L 113,9 Q 148,7 167,30 L 181,53 Q 188,74 177,95',
  'Canada':         'M 82,28 L 234,27 Q 270,27 272,58 L 270,90 Q 262,114 233,120 L 205,122 L 210,150 Q 212,174 184,178 L 90,175 Q 46,168 36,138 L 34,74 Q 36,28 82,28 Z',
  'Spain':          'M 68,33 L 232,32 Q 267,33 270,64 L 267,95 Q 260,120 230,129 L 198,132 L 208,159 Q 213,180 182,183 L 98,181 Q 46,173 36,142 L 34,78 Q 36,33 68,33 Z',
  'Austria':        'M 88,37 Q 163,20 220,52 L 260,90 Q 280,120 263,150 Q 244,178 197,182 L 107,178 Q 56,168 38,133 Q 26,102 42,70 Q 59,38 88,37 Z',
  'United Kingdom': 'M 68,53 L 180,26 Q 250,20 270,60 L 274,97 Q 267,132 233,150 L 198,157 L 216,177 Q 186,190 148,182 L 90,173 Q 43,157 30,120 L 26,76 Q 30,46 68,53 Z',
  'Hungary':        'M 148,30 Q 224,26 254,68 L 260,101 Q 257,133 229,147 L 198,152 L 203,168 Q 199,184 172,186 L 114,183 Q 63,174 46,143 L 40,107 Q 36,70 53,50 Q 74,28 114,26 Z',
  'Belgium':        'M 48,38 L 252,38 Q 280,40 282,70 L 270,96 Q 249,112 215,114 L 153,110 L 137,138 Q 132,164 105,169 L 48,167 Q 16,155 16,124 L 16,78 Q 19,40 48,38 Z',
  'Netherlands':    'M 100,30 Q 187,20 240,55 L 267,93 Q 280,127 264,157 Q 244,180 196,182 L 106,180 Q 53,169 33,131 L 26,87 Q 30,46 66,34 Z',
  'Italy':          'M 52,50 L 252,50 Q 278,52 278,80 L 274,107 L 280,132 Q 277,160 250,167 L 252,180 Q 206,190 154,186 L 52,182 Q 20,172 18,142 L 18,114 L 12,83 Q 16,52 52,50 Z',
  'Azerbaijan':     'M 78,20 L 247,20 Q 281,20 283,53 L 280,84 Q 272,108 242,115 L 182,118 L 185,148 Q 185,175 157,179 L 87,176 Q 40,168 30,134 L 28,62 Q 30,20 78,20 Z',
  'Singapore':      'M 93,26 L 218,26 Q 264,28 267,62 L 262,89 Q 254,112 222,119 L 198,122 L 200,143 Q 198,164 175,170 L 152,172 L 148,182 Q 121,190 91,184 L 63,177 Q 26,162 26,128 L 26,70 Q 29,30 67,26 Z',
  'United States':  'M 72,36 L 229,33 Q 267,33 270,65 L 267,96 Q 259,120 229,128 L 196,130 L 203,157 Q 206,177 178,181 L 99,179 Q 48,171 36,140 L 33,87 Q 33,46 64,36 Z',
  'Mexico':         'M 61,40 L 244,40 Q 278,40 280,72 L 277,104 Q 270,128 239,134 L 205,134 L 215,160 Q 220,180 192,184 L 111,182 Q 57,173 39,142 L 34,87 Q 34,43 61,40 Z',
  'Brazil':         'M 148,28 Q 227,23 264,65 L 274,102 Q 280,140 260,165 Q 236,188 185,190 L 112,187 Q 54,177 33,140 L 26,94 Q 26,50 63,33 Q 93,20 148,28 Z',
  'Las Vegas':      'M 78,40 L 238,40 Q 274,40 276,72 L 274,102 L 274,140 Q 270,174 238,180 L 78,180 Q 36,176 33,146 L 33,70 Q 33,40 78,40 Z',
  'Qatar':          'M 76,36 L 228,34 Q 269,34 271,68 L 269,99 Q 262,125 228,133 L 192,136 L 198,163 Q 198,182 170,186 L 101,184 Q 47,175 36,142 L 33,84 Q 33,38 76,36 Z',
  'Abu Dhabi':      'M 78,33 L 244,31 Q 280,31 282,65 L 280,101 Q 272,130 239,137 L 205,140 L 219,164 Q 223,182 192,186 L 104,184 Q 46,174 33,138 L 30,73 Q 30,33 78,33 Z'
};

function updateCircuitBg(trackName) {
  const svg = document.getElementById('trackCircuitSvg');
  if (!svg) return;
  const d = trackCircuitPaths[trackName];
  svg.innerHTML = d
    ? `<path d="${d}" stroke="#ffdd00" stroke-width="5" fill="rgba(255,221,0,0.07)" stroke-linecap="round" stroke-linejoin="round"/>`
    : '';
}

function renderTrackRadar() {
  const trackSelect = byId('trackSelect');
  const ctx = byId('trackRadarChart');
  if (!trackSelect || !ctx) return;
  const mobile = isMobileChartViewport();
  const track = getTrack(trackSelect.value);
  updateCircuitBg(track.name);
  if (radarChart) radarChart.destroy();
  radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: statKeys.map((k) => statLabels[k]),
      datasets: [{ label: `${track.name} Anforderungen`, data: statKeys.map((k) => track[k]), borderColor: '#00ffcc', backgroundColor: 'rgba(0,255,204,0.2)' }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1,
      plugins: {
        legend: {
          labels: {
            color: '#fff',
            font: { size: scaledChartFont(mobile ? 12 : 16, mobile ? 10 : 12), weight: '700' },
            padding: mobile ? 10 : 18
          }
        }
      },
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 100,
          pointLabels: {
            color: '#f0faff',
            font: { size: scaledChartFont(mobile ? 12 : 16, mobile ? 9 : 11), weight: '700' }
          },
          grid: { color: 'rgba(121,233,255,0.18)' },
          angleLines: { color: 'rgba(121,233,255,0.18)' },
          ticks: {
            color: '#c8e6f7',
            backdropColor: 'rgba(7,14,28,0.65)',
            backdropPadding: 3,
            font: { size: scaledChartFont(mobile ? 10 : 13, 9), weight: '600' },
            maxTicksLimit: mobile ? 5 : 7
          }
        }
      }
    }
  });
  setResult('trackAnalysisResult', `${track.name}: ${track.meta}`);
}

function renderAllTrackCharts() {
  miniTrackCharts.forEach((c) => c.destroy());
  miniTrackCharts = [];
  const host = byId('allTrackCharts');
  if (!host) return;
  host.innerHTML = '';
  tracksDb.forEach((track, idx) => {
    const card = document.createElement('div');
    card.className = 'mini-chart-card';
    card.innerHTML = `<div class="mini-chart-title">${track.name}</div><canvas id="mini_${idx}"></canvas>`;
    host.appendChild(card);
    const chart = new Chart(card.querySelector('canvas'), {
      type: 'radar',
      data: { labels: statKeys.map((k) => statLabels[k]), datasets: [{ data: statKeys.map((k) => track[k]), borderColor: '#ffdd00', backgroundColor: 'rgba(255,221,0,0.12)' }] },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { r: { suggestedMin: 0, suggestedMax: 100, pointLabels: { display: false }, ticks: { display: false }, grid: { color: 'rgba(255,255,255,.12)' }, angleLines: { color: 'rgba(255,255,255,.12)' } } } }
    });
    miniTrackCharts.push(chart);
  });
}

function buildInventory() {
  const wrap = byId('partsInventory');
  if (!wrap) return;
  wrap.innerHTML = '';
  const metaMap = loadPartMetaMap();

  partCatalog.forEach((part) => {
    const owned = ownedParts.includes(part.name);
    const el = document.createElement('div');
    el.className = 'inventory-card part-card';
    const level = Math.max(1, Math.min(12, Number(metaMap[part.name]?.level || 1)));
    const quality = partQualityByLevel(level);
    el.innerHTML = `
      <h4>${part.name}</h4>
      <div class="part-meta">Kategorie: ${part.category} | Qualität: ${quality}</div>
      <button class="part-ownership" type="button">${owned ? 'Im Besitz' : 'Nicht im Besitz'}</button>
      <div class="part-controls">
        <label for="part_level_${part.dbId || part.name}">Level</label>
        <select id="part_level_${part.dbId || part.name}">${PART_LEVELS.map((lvl) => `<option value="${lvl}" ${lvl === level ? 'selected' : ''}>Level ${lvl}</option>`).join('')}</select>
      </div>
    `;
    el.draggable = owned;
    el.style.opacity = owned ? '1' : '.45';
    const ownBtn = el.querySelector('.part-ownership');
    ownBtn?.addEventListener('click', () => {
      if (ownedParts.includes(part.name)) ownedParts = ownedParts.filter((p) => p !== part.name);
      else ownedParts.push(part.name);
      saveOwnedParts();
      buildInventory();
      updateKpis();
    });
    const levelSelect = el.querySelector('select');
    levelSelect?.addEventListener('change', (event) => {
      const next = Number(event.target.value || 1);
      const previous = metaMap[part.name] || {};
      metaMap[part.name] = { ...previous, level: Math.max(1, Math.min(12, next)), mod: Number(previous.mod || 0), updatedAt: new Date().toISOString() };
      savePartMetaMap(metaMap);
      buildInventory();
    });
    if (owned) {
      el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('partName', part.name);
        e.dataTransfer.setData('category', part.category);
      });
    }
    wrap.appendChild(el);
  });
}

function buildDriverInventory() {
  const standardWrap = byId('driversStandardList');
  const legendaryWrap = byId('driversLegendaryList');
  const specialWrap = byId('driversSpecialList');
  if (!standardWrap || !legendaryWrap || !specialWrap) return;

  standardWrap.innerHTML = '';
  legendaryWrap.innerHTML = '';
  specialWrap.innerHTML = '';

  const qualityRanks = buildDriverQualityRanks();
  const stageMap = loadDriverStageMap();

  driversDb.forEach((driver) => {
    const stage = DRIVER_STAGES.includes(stageMap[driver.name]?.stage) ? stageMap[driver.name].stage : 'S1';
    const rank = qualityRanks[driver.name] || 1;
    const card = document.createElement('div');
    card.className = 'inventory-card driver-card';
    card.innerHTML = `
      <h4>${driver.name}</h4>
      <div class="driver-meta">Qualität ${rank}/10 (absteigend)</div>
      <div class="driver-controls">
        <label for="driver_stage_${driver.name.replace(/\s+/g, '_')}">Stufe</label>
        <select id="driver_stage_${driver.name.replace(/\s+/g, '_')}">${DRIVER_STAGES.map((entry) => `<option value="${entry}" ${entry === stage ? 'selected' : ''}>${entry}</option>`).join('')}</select>
      </div>
    `;

    const targetType = driverEditionType(driver.name);
    const targetWrap = targetType === 'special' ? specialWrap : (targetType === 'legendary' ? legendaryWrap : standardWrap);
    targetWrap.appendChild(card);

    const select = card.querySelector('select');
    select?.addEventListener('change', (event) => {
      stageMap[driver.name] = { stage: event.target.value, updatedAt: new Date().toISOString() };
      saveDriverStageMap(stageMap);
    });
  });
}

function setupDropSlots() {
  PART_CATEGORIES.forEach((cat) => {
    const slot = byId(`slot_${cat}`);
    if (!slot) return;
    slot.addEventListener('dragover', (e) => e.preventDefault());
    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      const category = e.dataTransfer.getData('category');
      const name = e.dataTransfer.getData('partName');
      if (category !== cat) return;
      manualSetup[cat] = name;
      renderManualSlots();
    });
  });
}

function renderManualSlots() {
  const engine = byId('slot_engine');
  const frontWing = byId('slot_front_wing');
  const rearWing = byId('slot_rear_wing');
  const gearbox = byId('slot_gearbox');
  const suspension = byId('slot_suspension');
  const brakes = byId('slot_brakes');
  if (engine) engine.textContent = `Engine: ${manualSetup.engine || 'Drop Part here'}`;
  if (frontWing) frontWing.textContent = `Front Wing: ${manualSetup.front_wing || 'Drop Part here'}`;
  if (rearWing) rearWing.textContent = `Rear Wing: ${manualSetup.rear_wing || 'Drop Part here'}`;
  if (gearbox) gearbox.textContent = `Gearbox: ${manualSetup.gearbox || 'Drop Part here'}`;
  if (suspension) suspension.textContent = `Suspension: ${manualSetup.suspension || 'Drop Part here'}`;
  if (brakes) brakes.textContent = `Brakes: ${manualSetup.brakes || 'Drop Part here'}`;
}

function getBuilderTrackName() {
  const select = byId('builderTrackSelect', 'trackSelect');
  return select ? select.value : tracksDb[0].name;
}

function combinedStats(parts) {
  const out = { tempo: 0, kurven: 0, antrieb: 0, quali: 0, drs: 0 };
  parts.forEach((p) => {
    out.tempo += p.tempo;
    out.kurven += p.kurven;
    out.antrieb += p.antrieb;
    out.quali += p.quali;
    out.drs += p.drs;
  });
  return out;
}

function synergyBonus(parts) {
  const stats = combinedStats(parts);
  const avg = statKeys.reduce((s, k) => s + stats[k], 0) / statKeys.length;
  const variance = statKeys.reduce((s, k) => s + Math.pow(stats[k] - avg, 2), 0) / statKeys.length;
  return Math.max(0, 14 - Math.sqrt(variance) * 0.2);
}

function ownedByCategory(category) {
  return partCatalog.filter((p) => p.category === category && ownedParts.includes(p.name));
}

function optimizeTrack(trackName, useReducedPool) {
  const weights = trackWeights[trackName];
  const partMetaMap = loadPartMetaMap();
  let engines = ownedByCategory('engine');
  let fw = ownedByCategory('front_wing');
  let rw = ownedByCategory('rear_wing');
  let gb = ownedByCategory('gearbox');
  let sus = ownedByCategory('suspension');
  let brk = ownedByCategory('brakes');

  if (!engines.length || !fw.length || !rw.length || !gb.length || !sus.length || !brk.length) {
    return { comboCount: 0, best: null, top: [], ms: 0 };
  }

  const estimatedComboCount = engines.length * fw.length * rw.length * gb.length * sus.length * brk.length;
  const shouldAutoReduce = !useReducedPool && estimatedComboCount > MAX_FULL_OPTIMIZER_COMBOS;
  if (shouldAutoReduce) {
    const reduced = optimizeTrack(trackName, true);
    return {
      ...reduced,
      reducedApplied: true,
      estimatedComboCount
    };
  }

  if (useReducedPool) {
    const topN = 6;
    const rank = (p) => scoreStats(p, weights);
    engines = engines.sort((a, b) => rank(b) - rank(a)).slice(0, topN);
    fw = fw.sort((a, b) => rank(b) - rank(a)).slice(0, topN);
    rw = rw.sort((a, b) => rank(b) - rank(a)).slice(0, topN);
    gb = gb.sort((a, b) => rank(b) - rank(a)).slice(0, topN);
    sus = sus.sort((a, b) => rank(b) - rank(a)).slice(0, topN);
    brk = brk.sort((a, b) => rank(b) - rank(a)).slice(0, topN);
  }

  const comboCount = engines.length * fw.length * rw.length * gb.length * sus.length * brk.length;
  const t0 = performance.now();

  let best = null;
  const top = [];

  for (const e of engines) {
    for (const f of fw) {
      for (const r of rw) {
        for (const g of gb) {
          for (const s of sus) {
            for (const b of brk) {
              const parts = [e, f, r, g, s, b];
              const stats = parts.reduce((acc, part) => {
                const eff = getPartEffectiveStats(part, partMetaMap);
                acc.tempo += eff.tempo;
                acc.kurven += eff.kurven;
                acc.antrieb += eff.antrieb;
                acc.quali += eff.quali;
                acc.drs += eff.drs;
                return acc;
              }, { tempo: 0, kurven: 0, antrieb: 0, quali: 0, drs: 0 });
              const communityBonus = getCommunityPartBonus(trackName, parts);
              const score = scoreStats(stats, weights) + synergyBonus(parts) + communityBonus;
              const item = { parts, stats, score, communityBonus };

              if (!best || score > best.score) best = item;
              top.push(item);
              top.sort((x, y) => y.score - x.score);
              if (top.length > 5) top.pop();
            }
          }
        }
      }
    }
  }

  return { comboCount, best, top, ms: performance.now() - t0, reducedApplied: false, estimatedComboCount };
}

function optimizeSelectedTrack() {
  const trackSelect = byId('trackSelect');
  if (!trackSelect) return;
  const track = trackSelect.value;
  const res = optimizeTrack(track, false);
  if (!res.best) {
    setResult('optimizerResult', tr('optimizer_not_enough_parts'));
    updateKpis(0);
    return;
  }
  const names = res.best.parts.map((p) => p.name).join(' + ');
  const topTxt = res.top.map((r, i) => `${i + 1}) ${r.parts.map((p) => p.name).join('+')} (${r.score.toFixed(2)})`).join(' | ');
  const comboInfo = res.reducedApplied
    ? `${res.comboCount}/${res.estimatedComboCount}`
    : `${res.comboCount}`;
  const reducedHint = res.reducedApplied ? ' | Schnellmodus aktiv' : '';
  setResult('optimizerResult', `${track}: Bestes Setup ${names} | Score ${res.best.score.toFixed(2)} | Community-Bonus ${Number(res.best.communityBonus || 0).toFixed(2)} | Kombis ${comboInfo} | Laufzeit ${res.ms.toFixed(1)}ms${reducedHint} | Top5: ${topTxt}`);
  updateKpis(res.comboCount);
}

function optimizeAllTracks() {
  const labels = [];
  const data = [];
  tracksDb.forEach((t) => {
    const r = optimizeTrack(t.name, true);
    labels.push(t.name);
    data.push(r.best ? Number(r.best.score.toFixed(2)) : 0);
  });
  const chartNode = byId('seasonBestChart');
  if (!chartNode) {
    setResult('optimizerResult', tr('optimizer_all_tracks_done', { count: tracksDb.length }));
    return;
  }
  if (seasonBestChart) seasonBestChart.destroy();
  seasonBestChart = new Chart(chartNode, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Bestscore pro Strecke', data, backgroundColor: 'rgba(255,0,255,0.45)', borderColor: '#ff00ff' }] },
    options: chartOptions('Optimizer Score')
  });
}

function saveManualMap(track, setup) {
  const raw = localStorage.getItem(manualKey());
  let map = {};
  if (raw) {
    try { map = JSON.parse(raw); } catch { map = {}; }
  }
  map[track] = setup;
  localStorage.setItem(manualKey(), JSON.stringify(map));
  queueFirebaseAutoSync('manual-setup');
}

function applyAutoSetupToBuilder() {
  const track = getBuilderTrackName();
  const res = optimizeTrack(track, false);
  if (!res.best) {
    setResult('builderResult', tr('builder_autosetup_missing'));
    return;
  }
  const setup = {};
  res.best.parts.forEach((p) => { setup[p.category] = p.name; });
  manualSetup = setup;
  renderManualSlots();
  setResult('builderResult', tr('builder_autosetup_set', { track, score: res.best.score.toFixed(2) }));
}

function scoreManualSetup() {
  const track = getBuilderTrackName();
  const partMetaMap = loadPartMetaMap();
  const parts = PART_CATEGORIES.map((cat) => partCatalog.find((p) => p.category === cat && p.name === manualSetup[cat])).filter(Boolean);
  if (parts.length !== PART_CATEGORIES.length) {
    setResult('builderResult', tr('builder_fill_slots'));
    return;
  }
  const effStats = parts.reduce((acc, part) => {
    const eff = getPartEffectiveStats(part, partMetaMap);
    acc.tempo += eff.tempo;
    acc.kurven += eff.kurven;
    acc.antrieb += eff.antrieb;
    acc.quali += eff.quali;
    acc.drs += eff.drs;
    return acc;
  }, { tempo: 0, kurven: 0, antrieb: 0, quali: 0, drs: 0 });
  const score = scoreStats(effStats, trackWeights[track]) + synergyBonus(parts) + getCommunityPartBonus(track, parts);
  setResult('builderResult', tr('builder_manual_score', { track, score: score.toFixed(2) }));
}

function saveSeasonSetup() {
  const track = getBuilderTrackName();
  if (PART_CATEGORIES.some((cat) => !manualSetup[cat])) {
    setResult('builderResult', tr('builder_save_missing'));
    return;
  }
  saveManualMap(track, { ...manualSetup });
  setResult('builderResult', tr('builder_saved', { track, season: currentSeason }));
}

function compareSetups() {
  const trackSelect = byId('trackSelect');
  if (!trackSelect) return;
  const track = trackSelect.value;
  const a = scoreStats(getStatValues('a'), trackWeights[track]);
  const b = scoreStats(getStatValues('b'), trackWeights[track]);
  const winner = a >= b ? 'Setup A' : 'Setup B';
  setResult('compareResult', tr('compare_summary', {
    winner,
    track,
    a: a.toFixed(2),
    b: b.toFixed(2),
    delta: Math.abs(a - b).toFixed(2)
  }));
}

function teamClass(score) {
  if (score >= 170) return tr('team_class_top5');
  if (score >= 150) return tr('team_class_top10');
  if (score >= 130) return tr('team_class_midfield');
  return tr('team_class_weak');
}

function simulateTeamScore() {
  const trackSelect = byId('trackSelect');
  if (!trackSelect) return;
  const track = trackSelect.value;
  const score = scoreStats(getStatValues('team'), trackWeights[track]);
  setResult('teamScoreResult', tr('team_score_summary', {
    score: score.toFixed(2),
    track,
    rating: teamClass(score)
  }));
}

function getSimulationContext(trackName) {
  const seed = trackName.length % 7;
  const driverCtx = getDriverAbilityContext(trackName);
  return {
    setupModifier: (seed - 3) * 0.08,
    driverModifier: (seed - 2) * 0.06 + driverCtx.driverModifier,
    chaos: 1 + ((seed % 3) - 1) * 0.12,
    driverCtx
  };
}

function strategyPlans(track) {
  const oneStopLap = Math.round(track.laps * 0.5);
  const twoStop1 = Math.round(track.laps * 0.33);
  const twoStop2 = Math.round(track.laps * 0.67);
  return {
    one_stop: [{ tyre: 'medium', start: 1, end: oneStopLap }, { tyre: 'hard', start: oneStopLap + 1, end: track.laps }],
    two_stop: [{ tyre: 'soft', start: 1, end: twoStop1 }, { tyre: 'medium', start: twoStop1 + 1, end: twoStop2 }, { tyre: 'hard', start: twoStop2 + 1, end: track.laps }],
    balanced: [{ tyre: 'medium', start: 1, end: twoStop1 }, { tyre: 'medium', start: twoStop1 + 1, end: twoStop2 }, { tyre: 'hard', start: twoStop2 + 1, end: track.laps }],
    aggressive: [{ tyre: 'soft', start: 1, end: Math.round(track.laps * 0.27) }, { tyre: 'soft', start: Math.round(track.laps * 0.27) + 1, end: Math.round(track.laps * 0.55) }, { tyre: 'medium', start: Math.round(track.laps * 0.55) + 1, end: track.laps }]
  };
}

function tyreModel(tyre) {
  if (tyre === 'soft') return { pace: -0.6, wear: 1.24 };
  if (tyre === 'hard') return { pace: 0.45, wear: 0.82 };
  return { pace: 0.0, wear: 1.0 };
}

function simulateStrategy(track, plan, withNoise, context = {}) {
  const lapTimes = [];
  const pitLaps = [];
  const pitEvents = [];
  const wearCurve = [];
  let total = 0;
  let globalWear = 0;
  const setupModifier = Number(context.setupModifier || 0);
  const driverModifier = Number(context.driverModifier || 0);
  const chaos = Number(context.chaos || 1);

  plan.forEach((stint, idx) => {
    const model = tyreModel(stint.tyre);
    let stintLap = 0;
    for (let lap = stint.start; lap <= stint.end; lap++) {
      stintLap += 1;
      const wearPenalty = stintLap * model.wear * track.wear * 0.09;
      globalWear = Math.min(100, globalWear + model.wear * track.wear * 1.8);
      wearCurve.push(Number(globalWear.toFixed(2)));
      const random = withNoise ? (Math.random() * 0.3 - 0.15) * chaos : 0;
      const lapTime = track.baseLap + model.pace + wearPenalty + random - setupModifier - driverModifier;
      lapTimes.push(Number(lapTime.toFixed(3)));
      total += lapTime;
    }
    if (idx < plan.length - 1) {
      pitLaps.push(stint.end);
      pitEvents.push({ lap: stint.end, loss: track.pitLoss, nextTyre: plan[idx + 1].tyre });
      total += track.pitLoss;
    }
  });
  return { total, lapTimes, pitLaps, pitEvents, wearCurve };
}

function compareStrategyOptions(track, plans, context) {
  const labels = {
    one_stop: '1-Stop',
    two_stop: '2-Stop',
    balanced: 'Balanced',
    aggressive: 'Aggressive'
  };
  return Object.entries(plans)
    .map(([key, plan]) => {
      const sim = simulateStrategy(track, plan, false, context);
      const spread = sim.lapTimes.length ? Math.max(...sim.lapTimes) - Math.min(...sim.lapTimes) : 0;
      const communityBoost = getCommunityStrategyBoost(track.name, key);
      const adjustedTotal = sim.total - communityBoost;
      return { key, label: labels[key] || key, plan, sim, spread, communityBoost, adjustedTotal };
    })
    .sort((a, b) => a.adjustedTotal - b.adjustedTotal);
}

function runStrategyCalculation() {
  const strategyTrackSelect = byId('strategyTrackSelect');
  const modeSelect = byId('strategyMode');
  if (!strategyTrackSelect || !modeSelect) return null;
  const track = getTrack(strategyTrackSelect.value);
  const mode = modeSelect.value;
  const plans = strategyPlans(track);
  const context = getSimulationContext(track.name);
  const allResults = compareStrategyOptions(track, plans, context);

  const best = [...allResults].sort((a, b) => a.sim.total - b.sim.total)[0];
  const selected = mode === 'auto' ? best : allResults.find((r) => r.key === mode) || best;

  const strategyNode = byId('strategyChart');
  if (strategyNode) {
    if (strategyChart) strategyChart.destroy();
    strategyChart = new Chart(strategyNode, {
    type: 'bar',
    data: { labels: allResults.map((r) => r.label), datasets: [{ label: tr('strategy_dataset_total', { track: track.name }), data: allResults.map((r) => Number(r.adjustedTotal.toFixed(1))), backgroundColor: ['rgba(255,0,255,.45)','rgba(0,255,204,.45)','rgba(255,221,0,.45)','rgba(255,120,120,.45)'] }] },
    options: chartOptions(tr('chart_y_seconds'))
    });
    setStrategyChartPopupData('strategyChart', {
      title: tr('strategy_popup_title', { track: track.name }),
      subtitle: tr('strategy_popup_subtitle'),
      columns: [tr('strategy_col_strategy'), tr('strategy_col_total'), tr('strategy_col_spread'), tr('strategy_col_pit'), tr('strategy_col_stints')],
      rows: allResults.map((result) => [
        result.label,
        Number(result.adjustedTotal.toFixed(2)),
        Number(result.spread.toFixed(2)),
        result.sim.pitLaps.join(', ') || '-',
        buildStrategyPlanLabel(result.plan)
      ])
    });
  }

  const topDriverLabel = context.driverCtx?.topDrivers?.map((entry) => `${entry.name} ${entry.stage}`).join(' + ') || '-';
  setResult('strategyResult', tr('strategy_summary', {
    track: track.name,
    best: best.label,
    bestTime: best.adjustedTotal.toFixed(1),
    selected: selected.label,
    modifier: context.driverModifier.toFixed(2),
    top: topDriverLabel
  }));
  renderDriverImpact(track.name, context.driverCtx);
  lastDriverImpactTrack = track.name;
  lastDriverImpactContext = context.driverCtx;
  return { track, selected, best, allResults, context };
}

function runRaceSimulation() {
  const calc = runStrategyCalculation();
  if (!calc) return;
  const track = calc.track;
  const modeSelect = byId('strategyMode');
  if (!modeSelect) return;
  const mode = modeSelect.value;
  const plans = strategyPlans(track);
  const active = mode === 'auto' ? calc.best.key : mode;
  const plan = plans[active] || plans[calc.best.key];
  const sim = simulateStrategy(track, plan, true, calc.context);

  const pitData = sim.lapTimes.map((_, i) => sim.pitLaps.includes(i + 1) ? sim.lapTimes[i] : null);

  const raceNode = byId('raceChart');
  if (!raceNode) return;
  if (raceChart) raceChart.destroy();
  raceChart = new Chart(raceNode, {
    type: 'line',
    data: {
      labels: sim.lapTimes.map((_, i) => `R${i + 1}`),
      datasets: [
        { label: tr('race_dataset_laptime'), data: sim.lapTimes, borderColor: '#ffdd00', tension: 0.2, fill: false },
        { label: tr('race_dataset_pit'), data: pitData, borderColor: '#ff3366', pointRadius: 4, showLine: false }
      ]
    },
    options: chartOptions(tr('chart_y_seconds'))
  });

  setStrategyChartPopupData('raceChart', {
    title: tr('race_popup_title', { track: track.name }),
    subtitle: tr('race_popup_subtitle', { strategy: active.replace('_', '-') }),
    columns: [tr('race_col_lap'), tr('race_col_laptime'), tr('race_col_pit'), tr('race_col_wear')],
    rows: sim.lapTimes.map((lapTime, index) => [
      index + 1,
      lapTime,
      sim.pitLaps.includes(index + 1) ? tr('race_yes') : '-',
      sim.wearCurve[index] ?? '-'
    ])
  });

  setResult('raceResult', tr('race_summary', {
    track: track.name,
    strategy: active.replace('_', '-'),
    pits: sim.pitLaps.join(', ') || '-',
    total: sim.total.toFixed(1)
  }));
}

function simulateWearComparison() {
  const laps = 15;
  const aggressive = [];
  const managed = [];
  for (let i = 1; i <= laps; i++) {
    aggressive.push(Math.min(100, i * 7.2));
    managed.push(Math.min(100, i * 4.8 + (i % 3 === 0 ? -2 : 0)));
  }
  if (wearChart) wearChart.destroy();
  wearChart = new Chart(document.createElement('canvas').getContext('2d'), { type: 'line', data: { labels: [], datasets: [] } });
}

function driverTrackScore(driver, trackName) {
  const w = trackWeights[trackName];
  return driver.pace * ((w.tempo + w.kurven) / 2) + driver.qualifying * w.quali + driver.overtaking * w.drs + driver.tyre * w.antrieb * 0.9 + driver.consistency * 0.12;
}

function analyzeDriverPair() {
  const trackSelect = byId('trackSelect');
  const aSelect = byId('driverASelect');
  const bSelect = byId('driverBSelect');
  if (!trackSelect || !aSelect || !bSelect) return;
  const track = trackSelect.value;
  const a = driversDb.find((d) => d.name === aSelect.value);
  const b = driversDb.find((d) => d.name === bSelect.value);
  if (!a || !b) return;
  const synergy = (a.tyre + b.tyre + a.consistency + b.consistency) / 4;
  const score = (driverTrackScore(a, track) + driverTrackScore(b, track)) / 2 + synergy * 0.2;
  setResult('driverResult', tr('driver_pair_summary', {
    track,
    a: a.name,
    b: b.name,
    score: score.toFixed(2),
    rating: teamClass(score)
  }));
}

function findBestDriverPair() {
  const trackSelect = byId('trackSelect');
  if (!trackSelect) return;
  const track = trackSelect.value;
  let best = null;
  for (let i = 0; i < driversDb.length; i++) {
    for (let j = i + 1; j < driversDb.length; j++) {
      const a = driversDb[i];
      const b = driversDb[j];
      const synergy = (a.tyre + b.tyre + a.consistency + b.consistency) / 4;
      const score = (driverTrackScore(a, track) + driverTrackScore(b, track)) / 2 + synergy * 0.2;
      if (!best || score > best.score) best = { a, b, score };
    }
  }
  if (best) setResult('driverResult', tr('driver_best_pair_summary', {
    track,
    a: best.a.name,
    b: best.b.name,
    score: best.score.toFixed(2)
  }));
}

function evaluateCurrentSetup() {
  const score = scoreStats(getStatValues('calc'), { tempo: 0.24, kurven: 0.24, antrieb: 0.22, quali: 0.15, drs: 0.15 });
  let grade = 'S';
  if (score < 130) grade = 'C';
  else if (score < 150) grade = 'B';
  else if (score < 170) grade = 'A';
  setResult('calcResult', tr('calc_score_summary', { score: score.toFixed(2), grade }));
}

function updateKpis(comboCount) {
  const countBy = (cat) => partCatalog.filter((p) => p.category === cat && ownedParts.includes(p.name)).length;
  const combos = comboCount ?? PART_CATEGORIES.reduce((acc, c) => acc * Math.max(1, countBy(c)), 1);
  const kpiParts = byId('kpiParts', 'partsCount');
  const kpiDrivers = byId('kpiDrivers', 'driversCount');
  const kpiOwned = byId('kpiOwned', 'ownedCount');
  const kpiCombos = byId('kpiCombos', 'comboCount');
  if (kpiParts) kpiParts.textContent = String(partCatalog.length);
  if (kpiDrivers) kpiDrivers.textContent = String(driversDb.length);
  if (kpiOwned) kpiOwned.textContent = String(ownedParts.length);
  if (kpiCombos) kpiCombos.textContent = String(combos);
}

async function runOcr() {
  const fileInput = byId('ocrFile');
  const out = byId('ocrResult');
  if (!fileInput || !out) return;
  const file = fileInput.files[0];
  if (!file) { out.textContent = tr('ocr_choose_file'); return; }
  out.textContent = tr('ocr_running');
  try {
    const { data } = await Tesseract.recognize(file, 'eng', {
      workerPath: 'vendor/worker.min.js',
      langPath: 'assets/tessdata',
      logger: (m) => { if (m.status === 'recognizing text') out.textContent = tr('ocr_running_pct', { percent: Math.round(m.progress * 100) }); }
    });
    const snapshot = parseOcrSnapshot(data.text || '');
    const applied = applyOcrSnapshot(snapshot);
    if (applied.total > 0) {
      out.textContent = tr('ocr_snapshot_detected', {
        parts: String(applied.parts),
        drivers: String(applied.drivers),
        tracks: String(applied.tracks),
        details: applied.detailText
      });
    } else {
      out.textContent = tr('ocr_none');
    }
  } catch (err) {
    out.textContent = tr('ocr_error', { message: err.message });
  }
}

function normalizeOcrToken(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function parseOcrSnapshot(rawText) {
  const textLower = String(rawText || '').toLowerCase();
  const textToken = normalizeOcrToken(rawText || '');

  const detectByName = (list, nameKey = 'name') => list.filter((entry) => {
    const name = String(entry?.[nameKey] || '');
    if (!name) return false;
    const lowerName = name.toLowerCase();
    const tokenName = normalizeOcrToken(name);
    return textLower.includes(lowerName) || (tokenName && textToken.includes(tokenName));
  }).map((entry) => String(entry[nameKey]));

  const parts = detectByName(partCatalog);
  const drivers = detectByName(driversDb);
  const tracks = detectByName(tracksDb);

  return {
    parts: Array.from(new Set(parts)),
    drivers: Array.from(new Set(drivers)),
    tracks: Array.from(new Set(tracks))
  };
}

function applyOcrSnapshot(snapshot) {
  const safeSnapshot = snapshot || { parts: [], drivers: [], tracks: [] };
  let addedParts = 0;
  let addedDrivers = 0;

  safeSnapshot.parts.forEach((name) => {
    if (!ownedParts.includes(name)) {
      ownedParts.push(name);
      addedParts += 1;
    }
  });
  if (addedParts > 0) saveOwnedParts();

  const stageMap = loadDriverStageMap();
  safeSnapshot.drivers.forEach((name) => {
    if (!stageMap[name]) {
      stageMap[name] = {
        stage: 'S1',
        source: 'ocr',
        updatedAt: new Date().toISOString()
      };
      addedDrivers += 1;
    }
  });
  if (addedDrivers > 0) saveDriverStageMap(stageMap);

  const firstTrack = safeSnapshot.tracks[0] || '';
  if (firstTrack) {
    const mainTrackSelect = byId('trackSelect');
    const strategyTrackSelect = byId('strategyTrackSelect');
    const builderTrackSelect = byId('builderTrackSelect');
    if (mainTrackSelect) mainTrackSelect.value = firstTrack;
    if (strategyTrackSelect) strategyTrackSelect.value = firstTrack;
    if (builderTrackSelect) builderTrackSelect.value = firstTrack;
  }

  if (hasUi('partsInventory', 'garageInventory')) buildInventory();
  if (hasUi('driversStandardList', 'driversLegendaryList', 'driversSpecialList')) buildDriverInventory();
  updateKpis();

  if (firstTrack && hasUi('trackRadarChart') && shouldAutoRunHeavyTasks()) {
    renderTrackRadar();
    runStrategyCalculation();
  }

  const detail = [];
  if (safeSnapshot.parts.length) detail.push(`Parts: ${safeSnapshot.parts.slice(0, 8).join(', ')}`);
  if (safeSnapshot.drivers.length) detail.push(`Fahrer: ${safeSnapshot.drivers.slice(0, 6).join(', ')}`);
  if (safeSnapshot.tracks.length) detail.push(`Strecken: ${safeSnapshot.tracks.slice(0, 4).join(', ')}`);

  return {
    parts: addedParts,
    drivers: addedDrivers,
    tracks: safeSnapshot.tracks.length,
    total: addedParts + addedDrivers + safeSnapshot.tracks.length,
    detailText: detail.join(' | ') || '-'
  };
}

async function detectSeason() {
  currentSeason = new Date().getFullYear();
  const badge = byId('seasonBadge');
  if (badge) badge.textContent = String(currentSeason);
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  const isNative = Boolean(window.Capacitor?.isNativePlatform?.());
  if (isNative) {
    navigator.serviceWorker.getRegistrations()
      .then((regs) => Promise.all(regs.map((reg) => reg.unregister())))
      .catch(() => {});

    if (typeof caches !== 'undefined' && typeof caches.keys === 'function') {
      caches.keys()
        .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
        .catch(() => {});
    }
    return;
  }

  navigator.serviceWorker.register('sw.js').catch(() => {});
}

function rerenderLocalizedRuntime() {
  renderSyncConsentState();
  renderSyncModeLabel();
  if (hasUi('trackRadarChart') && shouldAutoRunHeavyTasks()) renderTrackRadar();
  if (hasUi('optimizerResult') && isOptimizerPageContext() && shouldAutoRunHeavyTasks()) optimizeSelectedTrack();
  if (hasUi('strategyChart', 'raceChart', 'positionChart', 'driverImpactChart') && shouldAutoRunHeavyTasks()) {
    deferUiTask(() => runRaceSimulation(), 90);
  }
  if (hasUi('seasonBestChart') && isOptimizerPageContext() && shouldAutoRunHeavyTasks()) {
    deferUiTask(() => optimizeAllTracks(), 160);
  }
  if (lastDriverImpactTrack && lastDriverImpactContext) {
    renderDriverImpact(lastDriverImpactTrack, lastDriverImpactContext);
  }
}

async function init() {
  // Global Chart.js dark-theme defaults — override grey #666 default
  if (typeof Chart !== 'undefined') {
    const mobileChart = Math.max(window.innerWidth || 0, document.documentElement?.clientWidth || 0, 360) <= 760;
    Chart.defaults.color = '#c8e6f7';
    Chart.defaults.borderColor = 'rgba(255,255,255,0.09)';
    Chart.defaults.font.family = "'Space Grotesk','Orbitron',system-ui,sans-serif";
    Chart.defaults.font.size = mobileChart ? 11 : 12;
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(7,14,28,0.92)';
    Chart.defaults.plugins.tooltip.titleColor = '#79e9ff';
    Chart.defaults.plugins.tooltip.bodyColor = '#c8e6f7';
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(121,233,255,0.22)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
  }

  document.addEventListener('app:language-changed', rerenderLocalizedRuntime);
  applyActiveSubnavByPath();
  registerServiceWorker();
  await detectSeason();

  const hasOptimizerUi = hasUi('trackSelect', 'strategyTrackSelect', 'trackRadarChart', 'strategyChart');
  const isOptimizerPage = isOptimizerPageContext();
  const hasGarageUi = hasUi('partsInventory', 'driversStandardList', 'garageInventory', 'ocrFile');
  const hasDashboardUi = hasUi('partsTableBody', 'partsCount', 'comboCount');
  const hasSyncUi = hasUi('f1SyncMethod', 'f1SyncResult', 'communityKnowledgeInput');
  const hasDriverCompareUi = hasUi('driverASelect', 'driverBSelect');
  const hasCalcUi = hasUi('setupAInputs', 'setupBInputs', 'teamScoreInputs', 'calcInputs');

  if (hasOptimizerUi || hasCalcUi) fillTrackSelects();
  if (hasDriverCompareUi) fillDriverSelects();
  if (byId('setupAInputs')) renderStatInputs('setupAInputs', 'a');
  if (byId('setupBInputs')) renderStatInputs('setupBInputs', 'b');
  if (byId('teamScoreInputs')) renderStatInputs('teamScoreInputs', 'team');
  if (byId('calcInputs')) renderStatInputs('calcInputs', 'calc');

  if (hasGarageUi) {
    deferUiTask(() => {
      buildInventory();
      buildDriverInventory();
      setupDropSlots();
      renderManualSlots();
      updateKpis();
    }, 40);
  } else if (hasDashboardUi) {
    deferUiTask(() => updateKpis(), 40);
  }

  if (hasOptimizerUi && isOptimizerPage) {
    if (shouldAutoRunHeavyTasks()) {
      deferUiTask(() => renderTrackRadar(), 40);
      deferUiTask(() => runRaceSimulation(), 120);
    }
    if (hasUi('seasonBestChart') && shouldAutoRunHeavyTasks()) {
      deferUiTask(() => optimizeAllTracks(), 260);
    }
  }

  if (hasSyncUi) {
    initCommunityKnowledgePanel();
    initSyncConsentPanel();
  }

  addListener('trackAnalysisButton', 'click', renderTrackRadar);
  addListener('allChartsButton', 'click', renderAllTrackCharts);
  addListener('trackSelect', 'change', () => { renderTrackRadar(); optimizeSelectedTrack(); });
  addListener('builderTrackSelect', 'change', () => { setResult('builderResult', ''); });
  addListener('strategyTrackSelect', 'change', runStrategyCalculation);
  addListener('strategyMode', 'change', runStrategyCalculation);

  addListener('autoBuildButton', 'click', applyAutoSetupToBuilder);
  addListener('manualScoreButton', 'click', scoreManualSetup);
  addListener('saveButton', 'click', saveSeasonSetup);
  addListener('saveSetupButton', 'click', saveSeasonSetup);

  addListener('optimizeButton', 'click', optimizeSelectedTrack);
  addListener('optimizeAllButton', 'click', optimizeAllTracks);

  addListener('strategyButton', 'click', runStrategyCalculation);
  addListener('raceSimButton', 'click', runRaceSimulation);
  addListener('raceChartChoice', 'change', (event) => {
    const target = event?.target;
    applyRaceChartChoice(target instanceof HTMLSelectElement ? target.value : 'race');
  });

  document.querySelectorAll('.chart-choice-tab[data-choice-tab]').forEach((node) => {
    node.addEventListener('click', () => {
      const choice = node.getAttribute('data-choice-tab') || 'race';
      applyRaceChartChoice(choice);
    });
  });

  addListener('compareButton', 'click', compareSetups);
  addListener('teamScoreButton', 'click', simulateTeamScore);
  addListener('driverAnalyzeButton', 'click', analyzeDriverPair);
  addListener('bestPairButton', 'click', findBestDriverPair);
  addListener('calcButton', 'click', evaluateCurrentSetup);
  addListener('ocrButton', 'click', runOcr);
  addListener('ocrFile', 'change', runOcr);
  addListener('driverImpactMode', 'change', () => {
    if (lastDriverImpactTrack && lastDriverImpactContext) {
      renderDriverImpact(lastDriverImpactTrack, lastDriverImpactContext);
    }
  });

  bindStrategyChartPopup('strategyChart');
  bindStrategyChartPopup('raceChart');
  bindStrategyChartPopup('positionChart');
  bindStrategyChartPopup('driverImpactChart');

  const popup = byId('chartPopup');
  const popupClose = byId('chartPopupClose');
  const popupFullscreen = byId('chartPopupFullscreen');
  const popupSeriesReset = byId('chartSeriesReset');
  if (popup) popup.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.dataset.popupClose === 'true') closeChartPopup();
  });
  if (popupClose) {
    popupClose.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeChartPopup();
    });
  }
  if (popupFullscreen) {
    popupFullscreen.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleChartPopupFullscreen();
    });
  }
  if (popupSeriesReset) {
    popupSeriesReset.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (activePopupChartId) applyChartDatasetFocus(activePopupChartId, null);
    });
  }
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeChartPopup();
  });

  const raceChartChoice = byId('raceChartChoice');
  const initialTab = document.querySelector('.chart-choice-tab.is-active[data-choice-tab]')
    || document.querySelector('.chart-choice-tab[data-choice-tab="race"]')
    || document.querySelector('.chart-choice-tab[data-choice-tab]');
  const initialChoice = raceChartChoice instanceof HTMLSelectElement
    ? raceChartChoice.value
    : (initialTab?.getAttribute('data-choice-tab') || 'race');
  applyRaceChartChoice(initialChoice);

  if (isOptimizerPage && shouldAutoRunHeavyTasks()) {
    deferUiTask(() => optimizeSelectedTrack(), 120);
  }
}

init();
