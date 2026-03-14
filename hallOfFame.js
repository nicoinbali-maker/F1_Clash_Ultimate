const HALL_SEASON = 2026;
const REGISTRATION_KEY = 'f1clashRegistration';
const PART_SNAPSHOT_KEY = 'partCatalogSnapshot';
const DRIVER_SNAPSHOT_KEY = 'driverCatalogSnapshot';
const HALL_IMPORTED_HISTORY_KEY = 'hallImportedSeasonHistory';

const HALL_TIMELINE = [
  { year: 2025, titleKey: 'hall_timeline_2025_title', detailKey: 'hall_timeline_2025_detail' },
  { year: 2026, titleKey: 'hall_timeline_2026_title', detailKey: 'hall_timeline_2026_detail' }
];

const ACHIEVEMENT_DEFS = [
  {
    id: 'legacy_archive',
    titleKey: 'hall_achievement_legacy_title',
    descriptionKey: 'hall_achievement_legacy_desc',
    badge: '2025',
    threshold: 1,
    value: (context) => context.seasonSetups.filter((entry) => entry.season === 2025).length,
    hint: () => tr('hall_achievement_legacy_hint')
  },
  {
    id: 'setup_collector',
    titleKey: 'hall_achievement_setup_title',
    descriptionKey: 'hall_achievement_setup_desc',
    badge: '2026',
    threshold: 12,
    value: (context) => context.latestSetupCount,
    hint: (context) => tr('hall_achievement_setup_hint', { count: context.latestSetupCount })
  },
  {
    id: 'inventory_archivist',
    titleKey: 'hall_achievement_inventory_title',
    descriptionKey: 'hall_achievement_inventory_desc',
    badge: 'Items',
    threshold: 40,
    value: (context) => context.ownedParts.length,
    hint: (context) => tr('hall_achievement_inventory_hint', { count: context.ownedParts.length })
  },
  {
    id: 'driver_squad',
    titleKey: 'hall_achievement_driver_title',
    descriptionKey: 'hall_achievement_driver_desc',
    badge: 'Driver',
    threshold: 4,
    value: (context) => context.driverSnapshot.length,
    hint: (context) => tr('hall_achievement_driver_hint', { count: context.driverSnapshot.length })
  },
  {
    id: 'legacy_sync',
    titleKey: 'hall_achievement_sync_title',
    descriptionKey: 'hall_achievement_sync_desc',
    badge: 'Sync',
    unlocked: (context) => context.seasonSetups.some((entry) => entry.season === HALL_SEASON)
  }
];

function setResult(elementId, text, kind = 'info') {
  const node = document.getElementById(elementId);
  if (!node) return;
  node.textContent = text;
  node.dataset.kind = kind;
}

function tr(key, vars = {}) {
  const i18n = window.AppI18n;
  if (i18n?.t) return i18n.t(key, vars);
  return key;
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

function loadJson(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadRegistrationProfile() {
  const raw = localStorage.getItem(REGISTRATION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    const firstName = String(parsed.firstName || '').trim();
    const lastName = String(parsed.lastName || '').trim();
    const playerType = String(parsed.playerType || '').trim();
    const nationality = String(parsed.nationality || '').trim();
    const clashId = String(parsed.clashId || '').trim();
    if (!firstName || !lastName || !playerType || !nationality || !clashId) return null;
    return { firstName, lastName, playerType, nationality, clashId };
  } catch {
    return null;
  }
}

function loadOwnedParts() {
  try {
    const raw = localStorage.getItem('ownedParts');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((item) => typeof item === 'string');
  } catch {
    // ignore
  }
  return [];
}

function gatherSeasonSetups() {
  const entries = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith('manualSetup_')) continue;
    const season = Number(key.split('_')[1]) || null;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) continue;
      entries.push({ season, trackCount: Object.keys(parsed).length });
    } catch {
      // noop
    }
  }
  const imported = loadJson(HALL_IMPORTED_HISTORY_KEY);
  if (Array.isArray(imported)) {
    imported.forEach((entry) => {
      const season = Number(entry?.season) || null;
      const trackCount = Math.max(0, Number(entry?.trackCount) || 0);
      if (!season) return;
      entries.push({ season, trackCount });
    });
  }
  const merged = new Map();
  entries.forEach((entry) => {
    if (!entry?.season) return;
    const current = merged.get(entry.season);
    if (!current || entry.trackCount > current.trackCount) merged.set(entry.season, entry);
  });
  return Array.from(merged.values()).sort((a, b) => (b.season || 0) - (a.season || 0));
}

function normalizeImportedDrivers(drivers) {
  if (!Array.isArray(drivers)) return [];
  return drivers
    .filter((driver) => driver && typeof driver === 'object' && !Array.isArray(driver) && String(driver.name || '').trim())
    .map((driver) => ({
      name: String(driver.name || '').trim(),
      rarity: String(driver.rarity || 'Unknown').trim(),
      pace: Number(driver.pace || 0),
      qualifying: Number(driver.qualifying || 0),
      tyre: Number(driver.tyre || 0),
      overtaking: Number(driver.overtaking || 0),
      consistency: Number(driver.consistency || 0)
    }));
}

function normalizeImportedParts(parts) {
  if (!Array.isArray(parts)) return [];
  return parts
    .filter((part) => part && typeof part === 'object' && !Array.isArray(part) && String(part.name || '').trim() && String(part.category || '').trim())
    .map((part) => {
      const stats = part.stats && typeof part.stats === 'object' ? part.stats : part;
      return {
        name: String(part.name || '').trim(),
        category: String(part.category || '').trim(),
        rarity: String(part.rarity || 'Unknown').trim(),
        tempo: Number(stats.tempo || 0),
        kurven: Number(stats.kurven || 0),
        antrieb: Number(stats.antrieb || 0),
        quali: Number(stats.quali || 0),
        drs: Number(stats.drs || 0)
      };
    });
}

function normalizeImportedSeasonHistory(entries) {
  if (!Array.isArray(entries)) return [];
  return entries
    .map((entry) => ({
      season: Number(entry?.season) || null,
      trackCount: Math.max(0, Number(entry?.trackCount) || 0)
    }))
    .filter((entry) => !!entry.season);
}

function mergeDriverSnapshots(currentDrivers, importedDrivers) {
  const map = new Map();
  [...currentDrivers, ...importedDrivers].forEach((driver) => {
    const name = String(driver?.name || '').trim();
    if (!name) return;
    const current = map.get(name);
    if (!current) {
      map.set(name, driver);
      return;
    }
    const currentScore = Number(current.pace || 0) + Number(current.qualifying || 0) + Number(current.consistency || 0);
    const nextScore = Number(driver.pace || 0) + Number(driver.qualifying || 0) + Number(driver.consistency || 0);
    map.set(name, nextScore >= currentScore ? driver : current);
  });
  return Array.from(map.values());
}

function mergePartSnapshots(currentParts, importedParts) {
  const map = new Map();
  [...currentParts, ...importedParts].forEach((part) => {
    const key = `${String(part?.category || '').trim()}::${String(part?.name || '').trim()}`;
    if (!key || key === '::') return;
    const current = map.get(key);
    if (!current) {
      map.set(key, part);
      return;
    }
    const currentScore = Number(current.tempo || 0) + Number(current.kurven || 0) + Number(current.antrieb || 0) + Number(current.quali || 0) + Number(current.drs || 0);
    const nextScore = Number(part.tempo || 0) + Number(part.kurven || 0) + Number(part.antrieb || 0) + Number(part.quali || 0) + Number(part.drs || 0);
    map.set(key, nextScore >= currentScore ? part : current);
  });
  return Array.from(map.values());
}

function mergeSeasonHistory(currentHistory, importedHistory) {
  const map = new Map();
  [...currentHistory, ...importedHistory].forEach((entry) => {
    const season = Number(entry?.season) || null;
    const trackCount = Math.max(0, Number(entry?.trackCount) || 0);
    if (!season) return;
    const current = map.get(season);
    if (!current || trackCount > current.trackCount) map.set(season, { season, trackCount });
  });
  return Array.from(map.values()).sort((a, b) => (b.season || 0) - (a.season || 0));
}

function importHallArchive(payload, mergeMode = true) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error(tr('hall_import_invalid'));
  }

  const player = payload.player && typeof payload.player === 'object' && !Array.isArray(payload.player)
    ? payload.player
    : null;
  const drivers = normalizeImportedDrivers(payload.drivers);
  const items = payload.items && typeof payload.items === 'object' && !Array.isArray(payload.items)
    ? payload.items
    : {};
  const importedParts = normalizeImportedParts(items.parts);
  const ownedPartNames = Array.isArray(items.ownedPartNames)
    ? items.ownedPartNames.filter((name) => typeof name === 'string')
    : importedParts.filter((part) => !!part.owned).map((part) => part.name);
  const seasonHistory = normalizeImportedSeasonHistory(payload.seasonHistory);

  const currentProfile = loadRegistrationProfile();
  const currentDrivers = normalizeImportedDrivers(loadJson(DRIVER_SNAPSHOT_KEY) || []);
  const currentOwnedParts = loadOwnedParts();
  const currentParts = normalizeImportedParts(loadJson(PART_SNAPSHOT_KEY) || []);
  const currentSeasonHistory = normalizeImportedSeasonHistory(loadJson(HALL_IMPORTED_HISTORY_KEY) || []);

  const nextProfile = mergeMode ? (currentProfile || player) : player;
  const nextDrivers = mergeMode ? mergeDriverSnapshots(currentDrivers, drivers) : drivers;
  const nextOwnedParts = mergeMode
    ? Array.from(new Set([...currentOwnedParts, ...ownedPartNames]))
    : ownedPartNames;
  const nextParts = mergeMode ? mergePartSnapshots(currentParts, importedParts) : importedParts;
  const nextSeasonHistory = mergeMode ? mergeSeasonHistory(currentSeasonHistory, seasonHistory) : seasonHistory;

  if (nextProfile) saveJson(REGISTRATION_KEY, nextProfile);
  if (nextDrivers.length) saveJson(DRIVER_SNAPSHOT_KEY, nextDrivers);
  if (nextOwnedParts.length) saveJson('ownedParts', nextOwnedParts);
  if (nextParts.length) saveJson(PART_SNAPSHOT_KEY, nextParts);
  if (nextSeasonHistory.length) saveJson(HALL_IMPORTED_HISTORY_KEY, nextSeasonHistory);

  return {
    drivers: nextDrivers.length,
    parts: nextParts.length || nextOwnedParts.length,
    seasons: nextSeasonHistory.length,
    playerImported: !!nextProfile,
    mergeMode
  };
}

async function handleHallImportFile(file, mergeMode) {
  if (!file) {
    setResult('hallExportResult', tr('hall_import_missing'), 'error');
    return;
  }
  try {
    const raw = await file.text();
    const payload = JSON.parse(raw);
    const summary = importHallArchive(payload, mergeMode);
    renderHallData();
    setResult('hallExportResult', tr('hall_imported', {
      drivers: summary.drivers,
      parts: summary.parts,
      seasons: summary.seasons,
      mode: summary.mergeMode ? tr('hall_import_mode_merge') : tr('hall_import_mode_replace')
    }));
  } catch (error) {
    setResult('hallExportResult', tr('hall_import_failed', { message: error.message }), 'error');
  }
}

function categorizeParts(ownedParts, snapshot) {
  const categories = {};
  snapshot.forEach((part) => {
    if (!part || !part.category) return;
    const bucket = categories[part.category] || { total: 0, owned: 0, list: [] };
    bucket.total += 1;
    const owned = ownedParts.includes(part.name);
    if (owned) bucket.owned += 1;
    bucket.list.push({ ...part, owned });
    categories[part.category] = bucket;
  });
  return categories;
}

function buildAchievementStatus(context) {
  return ACHIEVEMENT_DEFS.map((def) => {
    const value = typeof def.value === 'function' ? def.value(context) : 0;
    const unlocked = typeof def.threshold === 'number'
      ? value >= def.threshold
      : typeof def.unlocked === 'function'
        ? def.unlocked(context)
        : false;
    const hint = typeof def.hint === 'function' ? def.hint(context) : def.hint || (def.threshold ? `${value}/${def.threshold}` : '');
    return {
      id: def.id,
      title: tr(def.titleKey),
      description: tr(def.descriptionKey),
      badge: def.badge,
      hint,
      unlocked,
      value
    };
  });
}

function renderTimeline() {
  const host = document.getElementById('hallTimeline');
  if (!host) return;
  host.innerHTML = HALL_TIMELINE.map((item) => `
    <div class="hall-timeline__item${item.year === HALL_SEASON ? ' hall-timeline__item--active' : ''}">
      <strong>${item.year}</strong>
      <p>${tr(item.titleKey)}</p>
      <small>${tr(item.detailKey)}</small>
    </div>
  `).join('');
}

function renderAchievements(context) {
  const host = document.getElementById('achievementList');
  if (!host) return;
  host.innerHTML = '';
  const statuses = buildAchievementStatus(context);
  statuses.forEach((status) => {
    const pill = document.createElement('div');
    pill.className = `hall-pill${status.unlocked ? ' hall-pill--active' : ''}`;
    pill.innerHTML = `
      <strong>${status.title}</strong>
      <span>${status.description}</span>
      <div class="hall-pill__meta">${status.hint}</div>
      <small>${status.badge}</small>
    `;
    host.appendChild(pill);
  });
}

function renderSeasonHistory(seasons) {
  const host = document.getElementById('seasonHistory');
  if (!host) return;
  host.innerHTML = '';
  if (!seasons.length) {
    host.textContent = tr('hall_no_season_history');
    return;
  }
  seasons.forEach((entry) => {
    const item = document.createElement('div');
    item.className = 'hall-season-item';
    item.innerHTML = `
      <strong>${entry.season || tr('hall_season_unknown')}</strong>
      <span>${tr('hall_season_setups', { count: entry.trackCount })}</span>
      <p>${entry.season === HALL_SEASON ? tr('hall_season_active') : tr('hall_season_archived')}</p>
    `;
    host.appendChild(item);
  });
}

function renderItems(context) {
  const summary = document.getElementById('itemSummary');
  const list = document.getElementById('itemList');
  if (!summary || !list) return;
  summary.innerHTML = '';
  const categories = Object.entries(context.categories);
  if (!categories.length) {
    summary.textContent = tr('hall_no_parts_data');
  } else {
    categories.forEach(([category, data]) => {
      const pill = document.createElement('div');
      pill.className = 'hall-pill hall-pill--compact';
      pill.innerHTML = `<strong>${category}</strong><span>${tr('hall_items_owned_ratio', { owned: data.owned, total: data.total })}</span>`;
      summary.appendChild(pill);
    });
  }
  list.innerHTML = '';
  const ownedList = context.partSnapshot.filter((part) => context.ownedParts.includes(part.name)).slice(0, 8);
  if (!ownedList.length) {
    list.textContent = tr('hall_no_items');
    return;
  }
  ownedList.forEach((part) => {
    const row = document.createElement('div');
    row.className = 'hall-item-list__row';
    row.innerHTML = `<span>${part.name}</span><span>${tr('hall_item_owned')}</span>`;
    list.appendChild(row);
  });
}

function renderDrivers(context) {
  const host = document.getElementById('driverShowcase');
  if (!host) return;
  host.innerHTML = '';
  const drivers = context.driverSnapshot.slice().sort((a, b) => (b.pace || 0) - (a.pace || 0));
  if (!drivers.length) {
    host.textContent = tr('hall_no_drivers');
    return;
  }
  const header = document.createElement('div');
  header.className = 'hall-table__row hall-table__header';
  header.innerHTML = `<span>${tr('hall_driver_col_name')}</span><span>${tr('hall_driver_col_pace')}</span><span>${tr('hall_driver_col_quali')}</span><span>${tr('hall_driver_col_consistency')}</span>`;
  host.appendChild(header);
  drivers.slice(0, 6).forEach((driver, index) => {
    const row = document.createElement('div');
    row.className = `hall-table__row${index === 0 ? ' hall-table__row--top' : ''}`;
    const consistency = driver.consistency || 0;
    row.innerHTML = `
      <span>${driver.name}</span>
      <span>${driver.pace}</span>
      <span>${driver.qualifying}</span>
      <span>${Math.round((driver.pace + driver.qualifying + consistency) / 3)}</span>
    `;
    host.appendChild(row);
  });
}

function getContextData() {
  const profile = loadRegistrationProfile();
  const ownedParts = loadOwnedParts();
  const partSnapshot = loadJson(PART_SNAPSHOT_KEY) || [];
  const driverSnapshot = loadJson(DRIVER_SNAPSHOT_KEY) || [];
  const seasonSetups = gatherSeasonSetups();
  const latest = seasonSetups.find((entry) => entry.season === HALL_SEASON) || { trackCount: 0 };
  const categories = categorizeParts(ownedParts, partSnapshot);
  return {
    profile,
    ownedParts,
    driverSnapshot,
    seasonSetups,
    latestSetupCount: latest.trackCount,
    categories,
    partSnapshot
  };
}

function renderHallData() {
  const context = getContextData();
  renderTimeline();
  renderAchievements(context);
  renderSeasonHistory(context.seasonSetups);
  renderItems(context);
  renderDrivers(context);
  const lang = window.AppI18n?.getLang?.() || 'de';
  setResult('hallExportResult', tr('hall_reloaded', { time: new Date().toLocaleTimeString(lang) }));
  return context;
}

function toLocalDateStamp(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

function exportHallArchive(context) {
  const achievements = buildAchievementStatus(context);
  const exportedParts = context.partSnapshot.map((part) => ({
    name: part.name,
    category: part.category,
    rarity: part.rarity || 'Unknown',
    owned: context.ownedParts.includes(part.name),
    stats: {
      tempo: part.tempo ?? 0,
      kurven: part.kurven ?? 0,
      antrieb: part.antrieb ?? 0,
      quali: part.quali ?? 0,
      drs: part.drs ?? 0
    }
  }));

  const payload = {
    version: 2,
    app: tr('hall_export_app_name'),
    season: HALL_SEASON,
    exportedAt: new Date().toISOString(),
    player: context.profile,
    achievements,
    items: {
      totalOwned: context.ownedParts.length,
      categories: Object.entries(context.categories).map(([category, data]) => ({
        category,
        owned: data.owned,
        total: data.total
      })),
      ownedPartNames: context.ownedParts.slice(),
      parts: exportedParts
    },
    drivers: context.driverSnapshot,
    seasonHistory: context.seasonSetups
  };

  const safeName = context.profile ? `${context.profile.clashId}` : 'guest';
  const fileName = `f1clash_hall_${HALL_SEASON}_${safeName}_${toLocalDateStamp()}.json`;
  try {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    setResult('hallExportResult', tr('hall_exported', { file: fileName }));
  } catch (error) {
    setResult('hallExportResult', tr('hall_export_failed', { message: error.message }), 'error');
  }
}

function initHall() {
  applyActiveSubnavByPath();
  const refresh = document.getElementById('refreshHallButton');
  const exportButton = document.getElementById('exportHallButton');
  const importButton = document.getElementById('importHallButton');
  const importInput = document.getElementById('hallImportInput');
  const importMerge = document.getElementById('hallImportMerge');
  if (refresh) {
    refresh.addEventListener('click', renderHallData);
  }
  if (exportButton) {
    exportButton.addEventListener('click', () => exportHallArchive(renderHallData()));
  }
  if (importButton && importInput) {
    importButton.addEventListener('click', () => importInput.click());
    importInput.addEventListener('change', async (event) => {
      const [file] = Array.from(event.target.files || []);
      await handleHallImportFile(file, !!importMerge?.checked);
      event.target.value = '';
    });
  }
  renderHallData();
}

document.addEventListener('app:language-changed', () => {
  renderHallData();
});

document.addEventListener('DOMContentLoaded', initHall);
