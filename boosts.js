const BOOST_PROFILE_KEY = 'f1clashCategoryBoostProfile';
const DRIVER_PAIR_SELECTION_KEY = 'f1clashSelectedDriverPair';
const DRIVER_ASSIGNED_BOOSTS_KEY = 'f1clashAssignedDriverBoosts';
const ACTIVE_PROFILE_KEY = 'f1clashActiveClashId';
const REGISTRATION_KEY = 'f1clashRegistration';

const CATEGORY_BOOST_PROFILES = (Array.isArray(window.BOOTS_DATA) ? window.BOOTS_DATA : []).map((entry, index) => ({
  id: String(entry.id || 'boot_' + (index + 1)),
  name: String(entry.name || 'Boot ' + (index + 1)),
  medal: String(entry.name || 'Boot ' + (index + 1)),
  percent: Number(entry.total || 0),
  total: Number(entry.total || 0),
  overtaking: Number(entry.overtaking || 0),
  defending: Number(entry.defending || 0),
  raceStart: Number(entry.raceStart || 0),
  tyreMgmt: Number(entry.tyreMgmt || 0),
  speed: Number(entry.speed || 0),
  cornering: Number(entry.cornering || 0),
  powerUnit: Number(entry.powerUnit || 0),
  pitTime: Number(entry.pitTime || 0),
  series: Number(entry.sourceIndex || index + 1),
  rarity: 'None',
  tier: 'Boot'
}));

const FALLBACK_DRIVERS = [
  'Verstappen', 'Leclerc', 'Norris', 'Hamilton', 'Alonso', 'Sainz', 'Piastri', 'Russell', 'Gasly', 'Tsunoda'
];

function byId(id) {
  return document.getElementById(id);
}

function readJsonSafe(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function getActiveProfileId() {
  const reg = readJsonSafe(REGISTRATION_KEY, null);
  if (reg && typeof reg === 'object' && reg.clashId) return String(reg.clashId);
  try {
    return String(localStorage.getItem(ACTIVE_PROFILE_KEY) || 'guest');
  } catch {
    return 'guest';
  }
}

function parseStageNumber(value) {
  if (value == null) return 0;
  const s = String(value).toUpperCase();
  const m = s.match(/(\d+)/);
  return m ? Number(m[1]) : 0;
}

function loadOwnedDrivers() {
  const key = 'driverStage_' + getActiveProfileId();
  const map = readJsonSafe(key, {});
  return Object.entries(map || {})
    .filter(([, value]) => parseStageNumber(value && value.stage) >= 1)
    .map(([name]) => String(name || '').trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

function loadSelectedPair() {
  const parsed = readJsonSafe(DRIVER_PAIR_SELECTION_KEY, null);
  if (!parsed || typeof parsed !== 'object') return null;
  const a = String(parsed.a || '').trim();
  const b = String(parsed.b || '').trim();
  if (!a || !b || a === b) return null;
  return { a, b, source: String(parsed.source || 'manual') };
}

function loadAssignedBoosts() {
  const parsed = readJsonSafe(DRIVER_ASSIGNED_BOOSTS_KEY, null);
  if (!parsed || typeof parsed !== 'object') return null;
  return parsed;
}

function getBoostProfileId() {
  try {
    const raw = String(localStorage.getItem(BOOST_PROFILE_KEY) || '').trim();
    if (raw && CATEGORY_BOOST_PROFILES.some((entry) => entry.id === raw)) return raw;
  } catch {}
  return CATEGORY_BOOST_PROFILES[0] ? CATEGORY_BOOST_PROFILES[0].id : '';
}

function profileLabel(profile) {
  if (!profile) return '-';
  return '#' + profile.series + ' | ' + profile.medal + ' | Total ' + Number(profile.total || profile.percent || 0).toFixed(0);
}

function fillBoostProfileSelect(select) {
  if (!select) return;
  select.innerHTML = '';
  CATEGORY_BOOST_PROFILES.forEach((profile) => {
    const option = document.createElement('option');
    option.value = profile.id;
    option.textContent = profileLabel(profile);
    select.appendChild(option);
  });

  const stored = getBoostProfileId();
  if (stored) select.value = stored;
}

function fillDriverSelect(select, names, preferredName) {
  if (!select) return;
  const uniqueNames = Array.from(new Set((names || []).filter(Boolean)));
  select.innerHTML = '';
  uniqueNames.forEach((name) => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });

  if (preferredName && uniqueNames.includes(preferredName)) {
    select.value = preferredName;
  }
  if (!select.value && uniqueNames[0]) {
    select.value = uniqueNames[0];
  }
}

function fillPerDriverBoostSelect(select, preferredId, fallbackId) {
  if (!select) return;
  select.innerHTML = '';
  CATEGORY_BOOST_PROFILES.forEach((profile) => {
    const option = document.createElement('option');
    option.value = profile.id;
    option.textContent = profileLabel(profile);
    select.appendChild(option);
  });

  const candidate = preferredId && CATEGORY_BOOST_PROFILES.some((entry) => entry.id === preferredId)
    ? preferredId
    : fallbackId;
  if (candidate) select.value = candidate;
}

function renderTable(activeBoostId, assigned) {
  const tbody = byId('boostTableBody');
  if (!tbody) return;
  const assignedIds = new Set([
    String(assigned && assigned.a && assigned.a.profileId || ''),
    String(assigned && assigned.b && assigned.b.profileId || '')
  ].filter(Boolean));

  tbody.innerHTML = CATEGORY_BOOST_PROFILES.map((profile) => {
    const active = profile.id === activeBoostId;
    const assignedTag = assignedIds.has(profile.id) ? ' *zugeordnet' : '';
    return '<tr class="' + (active ? 'is-active' : '') + '">' +
      '<td>' + profile.series + '</td>' +
      '<td>' + profile.id + '</td>' +
      '<td>' + profile.medal + '</td>' +
      '<td>' + Number(profile.overtaking || 0) + '</td>' +
      '<td>' + Number(profile.defending || 0) + '</td>' +
      '<td>' + Number(profile.raceStart || 0) + '</td>' +
      '<td>' + Number(profile.tyreMgmt || 0) + '</td>' +
      '<td>' + Number(profile.speed || 0) + '</td>' +
      '<td>' + Number(profile.cornering || 0) + '</td>' +
      '<td>' + Number(profile.powerUnit || 0) + '</td>' +
      '<td>' + Number(profile.pitTime || 0) + '</td>' +
      '<td>' + Number(profile.total || profile.percent || 0).toFixed(0) + assignedTag + '</td>' +
      '</tr>';
  }).join('');
}

function saveSelections() {
  const globalSelect = byId('boostProfileSelect');
  const d1 = byId('driver1Select');
  const d2 = byId('driver2Select');
  const b1 = byId('driver1BoostSelect');
  const b2 = byId('driver2BoostSelect');
  if (!globalSelect || !d1 || !d2 || !b1 || !b2) return;

  const a = String(d1.value || '').trim();
  const b = String(d2.value || '').trim();
  if (!a || !b || a === b) {
    const info = byId('activeBoostInfo');
    if (info) info.textContent = 'Bitte zwei unterschiedliche Fahrer waehlen.';
    return;
  }

  const globalId = String(globalSelect.value || '').trim();
  const d1BoostId = String(b1.value || '').trim();
  const d2BoostId = String(b2.value || '').trim();

  try {
    localStorage.setItem(BOOST_PROFILE_KEY, globalId);
    localStorage.setItem(DRIVER_PAIR_SELECTION_KEY, JSON.stringify({ a, b, source: 'manual' }));
    localStorage.setItem(DRIVER_ASSIGNED_BOOSTS_KEY, JSON.stringify({
      a: { name: a, profileId: d1BoostId },
      b: { name: b, profileId: d2BoostId }
    }));
  } catch {}

  renderActiveInfo();
  renderTable(globalId, loadAssignedBoosts());
}

function renderActiveInfo() {
  const info = byId('activeBoostInfo');
  const pairInfo = byId('selectedPairInfo');
  if (!info || !pairInfo) return;

  const selectedPair = loadSelectedPair();
  const assigned = loadAssignedBoosts();
  const globalId = getBoostProfileId();
  const globalProfile = CATEGORY_BOOST_PROFILES.find((entry) => entry.id === globalId) || CATEGORY_BOOST_PROFILES[0];

  pairInfo.textContent = selectedPair
    ? 'Aktuelle Pair-Selektion: ' + selectedPair.a + ' + ' + selectedPair.b + ' (' + selectedPair.source + ')'
    : 'Keine Paarung gespeichert. Bitte Fahrer 1 und Fahrer 2 waehlen.';

  const aText = assigned && assigned.a
    ? (assigned.a.name + ' -> ' + (assigned.a.profileId || '-'))
    : '-';
  const bText = assigned && assigned.b
    ? (assigned.b.name + ' -> ' + (assigned.b.profileId || '-'))
    : '-';

  info.textContent =
    'Global: ' + profileLabel(globalProfile) +
    ' | Fahrer 1: ' + aText +
    ' | Fahrer 2: ' + bText;
}

function initBoostsPage() {
  const globalSelect = byId('boostProfileSelect');
  const d1 = byId('driver1Select');
  const d2 = byId('driver2Select');
  const b1 = byId('driver1BoostSelect');
  const b2 = byId('driver2BoostSelect');
  const saveBtn = byId('saveBoostButton');

  if (!globalSelect || !d1 || !d2 || !b1 || !b2 || !saveBtn) return;

  fillBoostProfileSelect(globalSelect);

  const selectedPair = loadSelectedPair();
  const ownedDrivers = loadOwnedDrivers();
  const allNames = Array.from(new Set([
    ...(selectedPair ? [selectedPair.a, selectedPair.b] : []),
    ...ownedDrivers,
    ...FALLBACK_DRIVERS
  ])).filter(Boolean);

  fillDriverSelect(d1, allNames, selectedPair && selectedPair.a);
  fillDriverSelect(d2, allNames, selectedPair && selectedPair.b);

  if (d1.value && d2.value && d1.value === d2.value) {
    const alt = allNames.find((name) => name !== d1.value);
    if (alt) d2.value = alt;
  }

  const assigned = loadAssignedBoosts();
  const globalId = getBoostProfileId();
  fillPerDriverBoostSelect(b1, assigned && assigned.a && assigned.a.profileId, globalId);
  fillPerDriverBoostSelect(b2, assigned && assigned.b && assigned.b.profileId, globalId);

  renderTable(globalId, assigned);
  renderActiveInfo();

  saveBtn.addEventListener('click', saveSelections);
  globalSelect.addEventListener('change', () => {
    try { localStorage.setItem(BOOST_PROFILE_KEY, String(globalSelect.value || '')); } catch {}
    renderTable(String(globalSelect.value || ''), loadAssignedBoosts());
    renderActiveInfo();
  });
}

document.addEventListener('DOMContentLoaded', initBoostsPage);
