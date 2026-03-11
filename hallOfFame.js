const HALL_SEASON = 2026;
const REGISTRATION_KEY = 'f1clashRegistration';
const PART_SNAPSHOT_KEY = 'partCatalogSnapshot';
const DRIVER_SNAPSHOT_KEY = 'driverCatalogSnapshot';

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

function loadJson(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
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
  return entries.sort((a, b) => (b.season || 0) - (a.season || 0));
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
  const payload = {
    version: 1,
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
      }))
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
  const refresh = document.getElementById('refreshHallButton');
  const exportButton = document.getElementById('exportHallButton');
  if (refresh) {
    refresh.addEventListener('click', renderHallData);
  }
  if (exportButton) {
    exportButton.addEventListener('click', () => exportHallArchive(renderHallData()));
  }
  renderHallData();
}

document.addEventListener('app:language-changed', () => {
  renderHallData();
});

document.addEventListener('DOMContentLoaded', initHall);
