const statKeys = ['tempo', 'kurven', 'antrieb', 'quali', 'drs'];
const statLabels = { tempo: 'Tempo', kurven: 'Kurven', antrieb: 'Antrieb', quali: 'Quali', drs: 'DRS' };
const PART_CATEGORIES = ['engine', 'front_wing', 'rear_wing', 'gearbox', 'suspension', 'brakes'];
const PART_LEVELS = Array.from({ length: 12 }, (_, i) => i + 1);
const DRIVER_STAGES = Array.from({ length: 12 }, (_, i) => `S${i + 1}`);
const LEGENDARY_DRIVER_NAMES = new Set(['Senna', 'Schumacher', 'Prost', 'Lauda', 'Mansell', 'Stewart', 'Fittipaldi', 'G.Hill', 'Brabham', 'D.Hill', 'G.Villeneuve', 'J.Villeneuve', 'Button', 'Coulthard', 'Berger', 'Massa', 'Webber', 'Fisichella', 'Hunt', 'Andretti']);
const SPECIAL_DRIVER_NAMES = new Set([]);
const USER_CORE_DRIVER_POOL = new Set([
  'Hadjar', 'Doohan', 'Bearman', 'Colapinto', 'Bortoleto', 'Antonelli',
  'Stroll', 'Lawson', 'Ocon', 'Albon', 'Tsunoda', 'Hulkenberg',
  'Gasly', 'Sainz', 'Piastri', 'Leclerc', 'Norris', 'Alonso', 'Russell', 'Hamilton', 'Verstappen'
]);
const COMMUNITY_KNOWLEDGE_KEY = 'f1clashCommunityKnowledge';
const F1_SYNC_CONSENT_PREFIX = 'f1clashSyncConsent_';
const F1_SYNC_API_CONFIG_PREFIX = 'f1clashSyncApiConfig_';
const FIREBASE_CONFIG_KEY = 'f1clashFirebaseConfig';
const FIREBASE_AUTH_KEY = 'f1clashFirebaseAuth';
const FIREBASE_AUTO_SYNC_KEY = 'f1clashFirebaseAutoSync';
const GUEST_MODE_KEY = 'f1clashGuestMode';
const TRACK_SELECTION_KEY = 'f1clashSelectedTrack';
const TRACK_SELECTION_OPTIONS_KEY = 'f1clashTrackOptions';
const TRACK_SELECTION_INDEX_KEY = 'f1clashSelectedTrackIndex';
const DRIVER_PAIR_SELECTION_KEY = 'f1clashSelectedDriverPair';
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

const trackWeights = Object.fromEntries(tracksDb.map((track) => {
  const sum = statKeys.reduce((acc, key) => acc + track[key], 0);
  return [track.name, Object.fromEntries(statKeys.map((key) => [key, track[key] / sum]))];
}));

function isGuestModeEnabled() {
  try { sessionStorage.removeItem(GUEST_MODE_KEY); } catch {}
  try { localStorage.removeItem(GUEST_MODE_KEY); } catch {}
  // Test/demo mode is hard-disabled so interactive pages remain fully usable.
  return false;
}

function applyGuestModeUi() {
  if (!isGuestModeEnabled()) return;
  if (document.body) document.body.classList.add('guest-mode');

  const shell = document.querySelector('.app-shell');
  if (shell && !document.getElementById('guestModeBanner')) {
    const currentPage = (location.pathname.split('/').pop() || 'index.html').split('?')[0] || 'index.html';
    const registrationHref = `registration.html?next=${encodeURIComponent(currentPage)}`;
    const banner = document.createElement('div');
    banner.id = 'guestModeBanner';
    banner.className = 'guest-mode-banner neon-card';
    banner.innerHTML = `
      <div class="guest-mode-banner__copy">Demo-Modus aktiv: Optimizer/Testfunktionen sind nutzbar. Nur produktive Speicher-, Sync- und Push-Aktionen sind deaktiviert.</div>
      <a class="guest-mode-banner__action" href="${registrationHref}">Zur Registrierung</a>
    `;
    shell.insertBefore(banner, shell.firstChild || null);
  }

  const blockedActionIds = new Set([
    'saveButton',
    'saveSetupButton',
    'syncButton',
    'enableNotificationsButton',
    'notifyRaceButton',
    'notifyPitButton',
    'refreshLeaderboardButton'
  ]);

  const shouldBlockInGuestMode = (el) => {
    const id = String(el.id || '');
    if (blockedActionIds.has(id)) return true;
    if (el.matches('[data-guest-block]')) return true;
    return false;
  };

  // Allow read-only/testing features in demo mode and block only productive actions.
  document.querySelectorAll('main button, main input, main textarea, main select').forEach((el) => {
    const id = String(el.id || '');
    const allowById = id === 'trackSelectionPageButton';
    const allowByAttr = el.hasAttribute('data-guest-allow');
    const shouldBlock = shouldBlockInGuestMode(el);
    if (allowById || allowByAttr || !shouldBlock) {
      if ('disabled' in el) el.disabled = false;
      el.removeAttribute('aria-disabled');
      return;
    }
    if ('disabled' in el) el.disabled = true;
    el.setAttribute('aria-disabled', 'true');
  });
}

function buildAllClashReferenceKnowledge() {
  return {
    version: 2,
    updatedAt: '2026-03-12T00:00:00.000Z',
    sources: [
      {
        type: 'allclash',
        id: 'allclash-series-9',
        title: 'Beat Series 9 in F1 Clash',
        url: 'https://www.allclash.com/beat-series-9-in-f1-clash-best-car-setup-drivers-pit-stop-strategy-rec-boosters/',
        updatedAt: '2026-03-10',
        visibleTracks: ['Japan', 'Monaco', 'Netherlands', 'Italy'],
        visibleDrivers: ['Fittipaldi', 'D.Hill', 'G.Hill', 'J.Villeneuve'],
        setupSummary: 'Brakes: The Descent/Rumble | Gearbox: The Dynamo/Fury | Rear Wing: X-Hale/Aero Blade | Front Wing: Vortex/The Sabre | Suspension: Gyro/The Arc | Engine: Mach III/Mach II',
        driverPairings: { bestPair: ['Fittipaldi', 'D.Hill'], top4: ['Fittipaldi', 'D.Hill', 'G.Hill', 'J.Villeneuve'] },
        note: 'Public AllClash series guide data only.'
      },
      {
        type: 'allclash',
        id: 'allclash-series-10',
        title: 'Beat Series 10 in F1 Clash',
        url: 'https://www.allclash.com/beat-series-10-in-f1-clash-best-car-setup-drivers-pit-stop-strategy-rec-boosters/',
        updatedAt: '2026-03-02',
        visibleTracks: ['Canada', 'Azerbaijan', 'Las Vegas', 'Abu Dhabi'],
        visibleDrivers: ['Mansell', 'Tsunoda', 'Antonelli', 'Hadjar'],
        setupSummary: 'Brakes: Flow 1K/Rumble | Gearbox: Metronome/The Dynamo | Rear Wing: Aero Blade/Power Lift | Front Wing: Vortex/Curler | Suspension: Quantum/Gyro | Engine: Mach III/Behemoth',
        driverPairings: { bestPair: ['Mansell', 'Tsunoda'], top4: ['Mansell', 'Tsunoda', 'Antonelli', 'Hadjar'] },
        note: 'Public AllClash series guide data only.'
      },
      {
        type: 'allclash',
        id: 'allclash-series-11',
        title: 'Beat Series 11 in F1 Clash',
        url: 'https://www.allclash.com/beat-series-11-in-f1-clash-best-car-setup-drivers-pit-stop-strategy-rec-boosters/',
        updatedAt: '2026-03-11',
        visibleTracks: ['Austria', 'Netherlands', 'Monaco', 'Italy'],
        visibleDrivers: ['Fittipaldi', 'Sainz', 'Piastri', 'D.Hill'],
        setupSummary: 'Brakes: Boombox/Flow 1K | Gearbox: Metronome/Fury | Rear Wing: The Valkyrie/X-Hale | Front Wing: Flex XL/Vortex | Suspension: Gyro/Quantum | Engine: Mach III/Behemoth',
        driverPairings: { bestPair: ['Fittipaldi', 'Sainz'], top4: ['Fittipaldi', 'Sainz', 'Piastri', 'D.Hill'], note: 'S11 beste F2P-Option; Tsunoda gut für F2P-Nutzer.' },
        note: 'Public AllClash series guide. Reddit-Community-Bestätigung (März 2026): Setup Flow 1K + Metronome + Valkyrie + Flex XL + Quantum + Mach III aktuell gültig. Tsunoda von F2P-Nutzern als stärkster frei verfügbarer Fahrer bestätigt. S11 gilt lt. AllClash als F2P-freundlichste Option bis Season-Reset Mai 2026.'
      },
      {
        type: 'allclash',
        id: 'allclash-series-12',
        title: 'Beat Series 12 in F1 Clash',
        url: 'https://www.allclash.com/beat-series-12-in-f1-clash-best-car-setup-drivers-pit-stop-strategy-rec-boosters/',
        updatedAt: '2026-03-11',
        visibleTracks: ['Spain', 'Canada', 'Netherlands', 'Brazil'],
        visibleDrivers: ['Prost', 'Lauda', 'Senna', 'Schumacher'],
        setupSummary: 'Brakes: Grindlock/Rumble | Gearbox: Jittershift/The Dynamo | Rear Wing: Aero Blade/The Valkyrie | Front Wing: Curler/Edgecutter | Suspension: Joltcoil/Nexus | Engine: Turbo Jet/Mach III',
        driverPairings: { bestPair: ['Prost', 'Lauda'], top4: ['Prost', 'Lauda', 'Senna', 'Schumacher'], note: 'Special Edition Territorium – Epic erst ab Rang ~18.' },
        note: 'Public AllClash series guide. ACHTUNG: S12 ist Special-Edition-Territorium – bestes Epic-Fahrer steht erst auf Rang ~18. Empfehlung: S11 spielen bis Season-Reset Anfang Mai 2026. Barcelona (Spain): 2-Stop (Soft) bei Reifenmanagement ≥90 optimal; sonst 1-Stop auf Medium möglich.'
      },
      {
        type: 'allclash',
        id: 'allclash-emilia-romagna',
        title: 'F1 Clash Gran Premio Dell’Emilia-Romagna Event Guide',
        url: 'https://www.allclash.com/f1-clash-gran-premio-dellemilia-romagna-event-guide-champion/',
        updatedAt: '2026-03-11',
        brackets: ['Junior', 'Challenger', 'Contender', 'Champion'],
        driverPairings: {
          junior: {
            Imola: ['Bearman', 'Ocon', 'Antonelli', 'Hadjar'],
            Belgium: ['Albon', 'Ocon', 'Stroll', 'Lawson', 'Bearman'],
            Austria: ['Hadjar', 'Bortoleto', 'Tsunoda', 'Doohan'],
            Azerbaijan: ['Hadjar', 'Bearman', 'Tsunoda', 'Albon'],
            Italy: ['Hadjar', 'Bortoleto', 'Tsunoda', 'Doohan'],
            China: ['Hadjar', 'Bearman', 'Tsunoda', 'Albon'],
            Japan: ['Hadjar', 'Bortoleto', 'Tsunoda', 'Doohan']
          },
          champion: {
            Imola: ['Alonso', 'Leclerc', 'Gasly', 'Sainz', 'Piastri'],
            Belgium: ['Norris', 'Hamilton', 'Gasly', 'Sainz', 'Hulkenberg'],
            Austria: ['Verstappen', 'Sainz', 'Norris', 'Alonso', 'Piastri'],
            Azerbaijan: ['Hamilton', 'Piastri', 'Verstappen', 'Alonso', 'Tsunoda'],
            Italy: ['Verstappen', 'Sainz', 'Norris', 'Alonso', 'Piastri'],
            China: ['Hamilton', 'Piastri', 'Verstappen', 'Alonso', 'Tsunoda'],
            Japan: ['Verstappen', 'Sainz', 'Norris', 'Alonso', 'Piastri']
          }
        },
        note: 'Rotation: Imolax2, Spa (Belgium), Spielberg (Austria), Baku (Azerbaijan), Monza (Italy), Shanghai (China), Suzuka (Japan). Champion Imola: 1-Stop pflicht. Junior: Hadjar Epic universell bester Fahrer. Setup Champion Imola/Spa/Shanghai: Rumble/Dynamo/Aero Blade/Curier/Nexus/Turbo Jet. Setup Spielberg/Baku/Monza: Flow 1K/Beast/Valkyrie/Flex XL/Quantum/Behemoth. Setup Suzuka: Boombox/Metronome/Valkyrie/Flex XL/Gyro/Mach III.'
      },
      {
        type: 'allclash',
        id: 'allclash-monaco-gp',
        title: 'F1 Clash Grand Prix de Monaco Event Guide',
        url: 'https://www.allclash.com/f1-clash-grand-prix-de-monaco-event-guide-champion/',
        updatedAt: '2025-05-23',
        brackets: ['Junior', 'Challenger', 'Contender', 'Champion'],
        driverPairings: {
          champion: {
            Monaco: ['Verstappen', 'Sainz', 'Norris', 'Alonso', 'Piastri'],
            'United Kingdom': ['Norris', 'Gasly', 'Hamilton', 'Sainz', 'Hulkenberg'],
            'United States': ['Norris', 'Gasly', 'Hamilton', 'Sainz', 'Hulkenberg'],
            Singapore: ['Alonso', 'Leclerc', 'Gasly', 'Sainz', 'Piastri'],
            'Abu Dhabi': ['Hamilton', 'Piastri', 'Verstappen', 'Alonso', 'Tsunoda'],
            Australia: ['Alonso', 'Leclerc', 'Gasly', 'Sainz', 'Piastri']
          }
        },
        note: 'Rotation: Monaco x3 (dry + Rain), Silverstone (UK), Austin (US), Singapore, Abu Dhabi, Melbourne. Monaco: Boombox/Metronome/Valkyrie/Flex XL/Gyro/Mach III, 1-Stop. Silverstone/Melbourne: Flow 1K/Beast/Valkyrie/Flex XL/Quantum/Behemoth. Singapore/Abu Dhabi: Rumble/Dynamo/Aero Blade/Curier/Nexus/Turbo Jet.'
      },
      {
        type: 'allclash',
        id: 'allclash-legendary-china',
        title: 'F1 Clash Legendary China Event Guide',
        url: 'https://www.allclash.com/f1-clash-legendary-china-event-guide-junior-challenger-contender-champion/',
        updatedAt: '2026-03-11',
        brackets: ['Junior 1-3', 'Challenger 1-6', 'Contender 1-9', 'Champion 1-12'],
        driverPairings: { boosted: ['Fittipaldi'], note: 'Fittipaldi in-game boosted – klarer Standout der Event-Woche.' },
        note: 'Public event structure plus featured asset note only.'
      },
      {
        type: 'allclash',
        id: 'allclash-legendary-australia',
        title: 'F1 Clash Legendary Australian Event Guide',
        url: 'https://www.allclash.com/f1-clash-legendary-australian-event-guide-junior-challenger-contender-champion/',
        updatedAt: '2026-03-02',
        brackets: ['Junior 1-3', 'Challenger 1-6', 'Contender 1-9', 'Champion 1-12'],
        driverPairings: { boosted: ['Mansell'], note: 'Mansell in-game boosted – klarer Standout der Event-Woche.' },
        note: 'Public event structure plus featured asset note only.'
      },
      {
        type: 'allclash',
        id: 'allclash-champions-circuit',
        title: 'F1 Clash Champions Circuit Event Guide',
        url: 'https://www.allclash.com/f1-clash-champions-circuit-event-guide-junior-challenger-contender-champion/',
        updatedAt: '2026-01-14',
        brackets: ['Junior', 'Challenger', 'Contender', 'Champion'],
        driverPairings: { boosted: ['Norris', 'Hamilton', 'Verstappen', 'Alonso'], note: 'Epic-Versionen geboosted; Legendaries und Special Editions bleiben teils stärker.' },
        note: 'Champion: Epic-Versionen von Norris, Hamilton, Verstappen, Alonso hochkompetitiv. Track-Details PRO-gesperrt.'
      },
      {
        type: 'allclash',
        id: 'allclash-titans-90s',
        title: 'F1 Clash Titans of the 90s Event Guide',
        url: 'https://www.allclash.com/f1-clash-titans-of-the-90s-event-guide-junior-challenger-contender-champion/',
        updatedAt: '2026-01-06',
        brackets: ['Junior', 'Challenger', 'Contender', 'Champion'],
        driverPairings: {
          challenger: { boosted: ['Berger'], note: 'Berger dominiert die Challenger-Klasse.' },
          contender: { boosted: ['J.Villeneuve'], note: 'J.Villeneuve stark in der Contender-Klasse.' },
          champion: { boosted: ['Schumacher'], note: 'Schumacher spielbar im Champion; Turbocharged SEs dominieren.' }
        },
        note: 'Berger dominiert Challenger; J.Villeneuve stark in Contender; Schumacher viable in Champion. Track-Details PRO-gesperrt.'
      }
    ],
    tracks: {
      Imola: {
        partBoosts: { Rumble: 0.55, 'The Dynamo': 0.55, 'Aero Blade': 0.55, Curler: 0.55, Nexus: 0.55, 'Turbo Jet': 0.55 },
        strategyBoosts: { one_stop: 2.0, two_stop: -1.5 },
        driverBoosts: { Alonso: 1.5, Leclerc: 1.3, Gasly: 1.2, Piastri: 1.1 },
        notes: 'Emilia-Romagna Champion: Alonso und Leclerc Top-Picks. 1-Stop Pflicht. Setup: Rumble/Dynamo/Aero Blade/Curier/Nexus/Turbo Jet.'
      },
      Monaco: {
        partBoosts: { Boombox: 0.55, Metronome: 0.55, 'The Valkyrie': 0.55, 'Flex XL': 0.55, Gyro: 0.55, 'Mach III': 0.55 },
        strategyBoosts: { one_stop: 1.9, two_stop: -0.9 },
        driverBoosts: { Verstappen: 1.4, Sainz: 1.3, Norris: 1.2, Alonso: 1.1 },
        notes: 'Monaco GP plus S11: Verstappen, Sainz, Norris Top-Picks. 1-Stop empfohlen. Setup: Boombox/Metronome/Valkyrie/Flex XL/Gyro/Mach III.'
      },
      Japan: {
        partBoosts: { Boombox: 0.55, Metronome: 0.55, 'The Valkyrie': 0.55, 'Flex XL': 0.55, Gyro: 0.55, 'Mach III': 0.55 },
        strategyBoosts: { one_stop: 2.2, two_stop: -1.1 },
        driverBoosts: { Verstappen: 1.4, Sainz: 1.3, Norris: 1.2 },
        notes: 'S9 plus Emilia-Romagna Champion: Suzuka bevorzugt 1-Stop. Verstappen, Sainz, Norris Top-Picks.'
      },
      Canada: {
        partBoosts: {},
        strategyBoosts: { one_stop: 2.1, two_stop: -1.0 },
        driverBoosts: {},
        notes: 'S10: Montreal bevorzugt 1-Stop mit Medium-basierten Stints.'
      },
      Spain: {
        partBoosts: {},
        strategyBoosts: { one_stop: 0.5, two_stop: 1.5 },
        driverBoosts: {},
        notes: 'S12: Barcelona bevorzugt 2-Stop bei TM >= 90; sonst 1-Stop möglich.'
      },
      Belgium: {
        partBoosts: { Rumble: 0.5, 'The Dynamo': 0.5, 'Aero Blade': 0.5, Curler: 0.5, Nexus: 0.5, 'Turbo Jet': 0.5 },
        strategyBoosts: {},
        driverBoosts: { Norris: 1.5, Hamilton: 1.3, Gasly: 1.2, Sainz: 1.1 },
        notes: 'Emilia-Romagna Champion: Norris und Hamilton Top-Picks für Spa.'
      },
      Austria: {
        partBoosts: { 'Flow 1K': 0.55, 'The Beast': 0.55, 'The Valkyrie': 0.55, 'Flex XL': 0.55, Quantum: 0.55, Behemoth: 0.55 },
        strategyBoosts: { one_stop: 2.0, two_stop: -1.0 },
        driverBoosts: { Verstappen: 1.5, Sainz: 1.3, Norris: 1.2, Alonso: 1.1 },
        notes: 'S11 plus Emilia-Romagna Champion: Spielberg bevorzugt 1-Stop. Verstappen, Sainz, Norris Top-Picks.'
      },
      Azerbaijan: {
        partBoosts: { 'Flow 1K': 0.55, 'The Beast': 0.55, 'The Valkyrie': 0.55, 'Flex XL': 0.55, Quantum: 0.55, Behemoth: 0.55 },
        strategyBoosts: {},
        driverBoosts: { Hamilton: 1.5, Piastri: 1.3, Verstappen: 1.2, Alonso: 1.1 },
        notes: 'S10 plus Emilia-Romagna Champion: Hamilton und Piastri Top-Picks für Baku.'
      },
      Italy: {
        partBoosts: { 'Flow 1K': 0.55, 'The Beast': 0.55, 'The Valkyrie': 0.55, 'Flex XL': 0.55, Quantum: 0.55, Behemoth: 0.55 },
        strategyBoosts: {},
        driverBoosts: { Verstappen: 1.5, Sainz: 1.3, Norris: 1.2, Alonso: 1.1 },
        notes: 'S9/S11 plus Emilia-Romagna Champion: Verstappen und Sainz Top-Picks für Monza.'
      },
      China: {
        partBoosts: { Rumble: 0.45, 'The Dynamo': 0.45, 'Aero Blade': 0.45, Curler: 0.45, Nexus: 0.45, 'Turbo Jet': 0.45 },
        strategyBoosts: {},
        driverBoosts: { Fittipaldi: 1.6, Hamilton: 1.2, Piastri: 1.2 },
        notes: 'Legendary China: Fittipaldi geboostet. Emilia-Romagna Champion allgemein: Hamilton und Piastri bester Stat-Fit.'
      },
      Australia: {
        partBoosts: { 'Flow 1K': 0.45, 'The Beast': 0.45, 'The Valkyrie': 0.45, 'Flex XL': 0.45, Quantum: 0.45, Behemoth: 0.45 },
        strategyBoosts: {},
        driverBoosts: { Mansell: 1.6, Alonso: 1.2, Leclerc: 1.1 },
        notes: 'Legendary Australia: Mansell geboostet. Monaco GP Champion allgemein: Alonso und Leclerc bester Stat-Fit für Melbourne.'
      },
      'United Kingdom': {
        partBoosts: { 'Flow 1K': 0.5, 'The Beast': 0.5, 'The Valkyrie': 0.5, 'Flex XL': 0.5, Quantum: 0.5, Behemoth: 0.5 },
        strategyBoosts: {},
        driverBoosts: { Norris: 1.5, Hamilton: 1.3, Gasly: 1.2, Sainz: 1.1 },
        notes: 'Monaco GP Champion: Norris und Hamilton Top-Picks für Silverstone.'
      },
      'United States': {
        partBoosts: { Boombox: 0.5, Metronome: 0.5, 'The Valkyrie': 0.5, 'Flex XL': 0.5, Gyro: 0.5, 'Mach III': 0.5 },
        strategyBoosts: {},
        driverBoosts: { Norris: 1.4, Hamilton: 1.3, Gasly: 1.2, Sainz: 1.1 },
        notes: 'Monaco GP Champion: Norris, Hamilton, Gasly Top-Picks für Austin.'
      },
      Singapore: {
        partBoosts: { Rumble: 0.5, 'The Dynamo': 0.5, 'Aero Blade': 0.5, Curler: 0.5, Nexus: 0.5, 'Turbo Jet': 0.5 },
        strategyBoosts: {},
        driverBoosts: { Alonso: 1.5, Leclerc: 1.3, Gasly: 1.2, Piastri: 1.1 },
        notes: 'Monaco GP Champion: Alonso und Leclerc Top-Picks für Singapur.'
      },
      'Abu Dhabi': {
        partBoosts: { Rumble: 0.5, 'The Dynamo': 0.5, 'Aero Blade': 0.5, Curler: 0.5, Nexus: 0.5, 'Turbo Jet': 0.5 },
        strategyBoosts: {},
        driverBoosts: { Hamilton: 1.4, Piastri: 1.3, Verstappen: 1.2, Alonso: 1.1 },
        notes: 'Monaco GP Champion: Hamilton und Piastri Top-Picks für Abu Dhabi.'
      }
    },
    driverPairings: {
      series: {
        S9: { bestPair: ['Fittipaldi', 'D.Hill'], top4: ['Fittipaldi', 'D.Hill', 'G.Hill', 'J.Villeneuve'] },
        S10: { bestPair: ['Mansell', 'Tsunoda'], top4: ['Mansell', 'Tsunoda', 'Antonelli', 'Hadjar'] },
        S11: { bestPair: ['Fittipaldi', 'Sainz'], top4: ['Fittipaldi', 'Sainz', 'Piastri', 'D.Hill'], note: 'S11 beste F2P-Option; Tsunoda gut für F2P-Nutzer.' },
        S12: { bestPair: ['Prost', 'Lauda'], top4: ['Prost', 'Lauda', 'Senna', 'Schumacher'], note: 'Special Edition Territorium; Epic erst ab Rang ~18.' }
      },
      events: {
        'emilia-romagna': {
          junior: {
            Imola: ['Bearman', 'Ocon', 'Antonelli', 'Hadjar'],
            Belgium: ['Albon', 'Ocon', 'Stroll', 'Lawson'],
            Austria: ['Hadjar', 'Bortoleto', 'Tsunoda', 'Doohan'],
            Azerbaijan: ['Hadjar', 'Bearman', 'Tsunoda', 'Albon'],
            Italy: ['Hadjar', 'Bortoleto', 'Tsunoda', 'Doohan'],
            China: ['Hadjar', 'Bearman', 'Tsunoda', 'Albon'],
            Japan: ['Hadjar', 'Bortoleto', 'Tsunoda', 'Doohan']
          },
          champion: {
            Imola: ['Alonso', 'Leclerc', 'Gasly', 'Sainz', 'Piastri'],
            Belgium: ['Norris', 'Hamilton', 'Gasly', 'Sainz', 'Hulkenberg'],
            Austria: ['Verstappen', 'Sainz', 'Norris', 'Alonso', 'Piastri'],
            Azerbaijan: ['Hamilton', 'Piastri', 'Verstappen', 'Alonso', 'Tsunoda'],
            Italy: ['Verstappen', 'Sainz', 'Norris', 'Alonso', 'Piastri'],
            China: ['Hamilton', 'Piastri', 'Verstappen', 'Alonso', 'Tsunoda'],
            Japan: ['Verstappen', 'Sainz', 'Norris', 'Alonso', 'Piastri']
          }
        },
        'monaco-gp': {
          champion: {
            Monaco: ['Verstappen', 'Sainz', 'Norris', 'Alonso', 'Piastri'],
            'United Kingdom': ['Norris', 'Gasly', 'Hamilton', 'Sainz', 'Hulkenberg'],
            'United States': ['Norris', 'Gasly', 'Hamilton', 'Sainz', 'Hulkenberg'],
            Singapore: ['Alonso', 'Leclerc', 'Gasly', 'Sainz', 'Piastri'],
            'Abu Dhabi': ['Hamilton', 'Piastri', 'Verstappen', 'Alonso', 'Tsunoda'],
            Australia: ['Alonso', 'Leclerc', 'Gasly', 'Sainz', 'Piastri']
          }
        },
        'champions-circuit': {
          champion: { boosted: ['Norris', 'Hamilton', 'Verstappen', 'Alonso'] }
        },
        'titans-90s': {
          challenger: { boosted: ['Berger'] },
          contender: { boosted: ['J.Villeneuve'] },
          champion: { boosted: ['Schumacher'] }
        }
      }
    }
  };
}

function buildCategoryParts(category, entries, baseStats) {
  const safeEntries = Array.isArray(entries) ? entries : [];
  const rarityBoost = {
    Common: 0,
    Rare: 3,
    Epic: 7,
    Legendary: 10
  };

  return safeEntries.map((entry, index) => {
    const rarity = entry?.rarity || 'Common';
    const boost = (rarityBoost[rarity] || 0) + index;
    return {
      name: String(entry?.name || `Part ${index + 1}`),
      category,
      rarity,
      tempo: Number(baseStats?.tempo || 0) + Math.round(boost * 0.8),
      kurven: Number(baseStats?.kurven || 0) + Math.round(boost * 0.7),
      antrieb: Number(baseStats?.antrieb || 0) + Math.round(boost * 0.9),
      quali: Number(baseStats?.quali || 0) + Math.round(boost * 0.6),
      drs: Number(baseStats?.drs || 0) + Math.round(boost * 0.5)
    };
  });
}

// Teile-Datenbank: offizielle F1 Clash 2025 Namen (Resource Sheet by TR The Flash, 22/02/26)
const partCatalog = [
  ...buildCategoryParts('brakes', [
    { name: 'Pivot',          rarity: 'Common' },
    { name: 'The Stabiliser', rarity: 'Common' },
    { name: 'The Descent',    rarity: 'Rare'   },
    { name: 'Rumble',         rarity: 'Rare'   },
    { name: 'Flow 1K',        rarity: 'Rare'   },
    { name: 'Supernova',      rarity: 'Epic'   },
    { name: 'Boombox',        rarity: 'Epic'   },
    { name: 'Grindlock',      rarity: 'Epic'   },
  ], { tempo: 12, kurven: 32, antrieb: 34, quali: 24, drs: 12 }),

  ...buildCategoryParts('gearbox', [
    { name: 'Hustle',       rarity: 'Common' },
    { name: 'Slickshift',   rarity: 'Rare'   },
    { name: 'Beat',         rarity: 'Common' },
    { name: 'Fury',         rarity: 'Epic'   },
    { name: 'The Dynamo',   rarity: 'Rare'   },
    { name: 'The Beast',    rarity: 'Epic'   },
    { name: 'Metronome',    rarity: 'Rare'   },
    { name: 'Jittershift',  rarity: 'Epic'   },
    { name: 'Starter',      rarity: 'Epic'   },
  ], { tempo: 26, kurven: 18, antrieb: 56, quali: 24, drs: 30 }),

  ...buildCategoryParts('rear_wing', [
    { name: 'Motion',       rarity: 'Common' },
    { name: 'Gale Force',   rarity: 'Common' },
    { name: 'The Spire',    rarity: 'Rare'   },
    { name: 'Power Lift',   rarity: 'Rare'   },
    { name: 'Aero Blade',   rarity: 'Rare'   },
    { name: 'X-Hale',       rarity: 'Epic'   },
    { name: 'The Valkyrie', rarity: 'Epic'   },
    { name: 'Starter',      rarity: 'Epic'   },
  ], { tempo: 28, kurven: 52, antrieb: 16, quali: 34, drs: 32 }),

  ...buildCategoryParts('front_wing', [
    { name: 'The Dash',    rarity: 'Common' },
    { name: 'Glide',       rarity: 'Common' },
    { name: 'Synergy',     rarity: 'Common' },
    { name: 'The Sabre',   rarity: 'Rare'   },
    { name: 'Curler',      rarity: 'Rare'   },
    { name: 'Vortex',      rarity: 'Epic'   },
    { name: 'Flex XL',     rarity: 'Epic'   },
    { name: 'Edgecutter',  rarity: 'Epic'   },
    { name: 'Starter',     rarity: 'Epic'   },
  ], { tempo: 24, kurven: 58, antrieb: 14, quali: 36, drs: 28 }),

  ...buildCategoryParts('suspension', [
    { name: 'Swish',        rarity: 'Common' },
    { name: 'Curver 2.5',   rarity: 'Common' },
    { name: 'The Arc',      rarity: 'Common' },
    { name: 'Quantum',      rarity: 'Rare'   },
    { name: 'Gyro',         rarity: 'Rare'   },
    { name: 'Equinox',      rarity: 'Epic'   },
    { name: 'Joltcoil',     rarity: 'Epic'   },
    { name: 'Nexus',        rarity: 'Epic'   },
    { name: 'Fluxspring',   rarity: 'Epic'   },
    { name: 'Starter',      rarity: 'Epic'   },
  ], { tempo: 14, kurven: 44, antrieb: 30, quali: 20, drs: 14 }),

  ...buildCategoryParts('engine', [
    { name: 'Mach I',       rarity: 'Common' },
    { name: 'Spark-E',      rarity: 'Common' },
    { name: 'The Reactor',  rarity: 'Common' },
    { name: 'Mach II',      rarity: 'Rare'   },
    { name: 'Behemoth',     rarity: 'Rare'   },
    { name: 'Mach III',     rarity: 'Epic'   },
    { name: 'Chaos Core',   rarity: 'Epic'   },
    { name: 'Turbo Jet',    rarity: 'Epic'   },
  ], { tempo: 54, kurven: 20, antrieb: 50, quali: 26, drs: 18 }),
];

// Fahrer-Datenbank: offizielles F1 Clash 2025 Roster (Resource Sheet by TR The Flash, 22/02/26)
// Seltenheiten: Common, Rare, Epic, Legendary, Prospect Standard, Prospect Turbocharged,
//               Podium Stars, Podium Stars Legends
const driversDb = [
  // ── 2025 Grid ───────────────────────────────────────────────────────────────
  { name: 'Verstappen', rarity: 'Epic', pace: 52, qualifying: 67, tyre: 57, overtaking: 62, consistency: 72 },
  { name: 'Norris', rarity: 'Epic', pace: 52, qualifying: 62, tyre: 72, overtaking: 57, consistency: 67 },
  { name: 'Leclerc', rarity: 'Epic', pace: 63, qualifying: 68, tyre: 48, overtaking: 58, consistency: 53 },
  { name: 'Hamilton', rarity: 'Epic', pace: 57, qualifying: 62, tyre: 67, overtaking: 72, consistency: 52 },
  { name: 'Russell', rarity: 'Epic', pace: 57, qualifying: 72, tyre: 62, overtaking: 67, consistency: 52 },
  { name: 'Piastri', rarity: 'Epic', pace: 58, qualifying: 53, tyre: 48, overtaking: 68, consistency: 63 },
  { name: 'Sainz', rarity: 'Epic', pace: 58, qualifying: 53, tyre: 63, overtaking: 48, consistency: 68 },
  { name: 'Alonso', rarity: 'Epic', pace: 72, qualifying: 57, tyre: 52, overtaking: 62, consistency: 67 },
  { name: 'Gasly', rarity: 'Epic', pace: 58, qualifying: 63, tyre: 68, overtaking: 53, consistency: 48 },
  { name: 'Hulkenberg', rarity: 'Epic', pace: 53, qualifying: 68, tyre: 63, overtaking: 58, consistency: 48 },
  { name: 'Ocon', rarity: 'Epic', pace: 58, qualifying: 53, tyre: 63, overtaking: 48, consistency: 43 },
  { name: 'Albon', rarity: 'Epic', pace: 43, qualifying: 48, tyre: 63, overtaking: 58, consistency: 53 },
  { name: 'Tsunoda', rarity: 'Epic', pace: 43, qualifying: 58, tyre: 48, overtaking: 63, consistency: 53 },
  { name: 'Stroll', rarity: 'Epic', pace: 43, qualifying: 53, tyre: 63, overtaking: 58, consistency: 48 },
  { name: 'Antonelli', rarity: 'Epic', pace: 18, qualifying: 23, tyre: 8, overtaking: 13, consistency: 3 },
  { name: 'Hadjar', rarity: 'Common', pace: 4, qualifying: 2, tyre: 5, overtaking: 6, consistency: 3 },
  { name: 'Doohan', rarity: 'Common', pace: 3, qualifying: 4, tyre: 5, overtaking: 2, consistency: 6 },
  { name: 'Bearman', rarity: 'Common', pace: 5, qualifying: 3, tyre: 4, overtaking: 6, consistency: 2 },
  { name: 'Colapinto', rarity: 'Common', pace: 17, qualifying: 5, tyre: 1, overtaking: 9, consistency: 13 },
  { name: 'Bortoleto', rarity: 'Common', pace: 1, qualifying: 5, tyre: 17, overtaking: 9, consistency: 13 },
  { name: 'Lawson', rarity: 'Common', pace: 5, qualifying: 13, tyre: 17, overtaking: 9, consistency: 1 },
  // ── Legends (Legendary) ─────────────────────────────────────────────────────
  { name: 'Senna', rarity: 'Legendary', pace: 59, qualifying: 65, tyre: 59, overtaking: 68, consistency: 62 },
  { name: 'Schumacher', rarity: 'Legendary', pace: 55, qualifying: 58, tyre: 61, overtaking: 55, consistency: 64 },
  { name: 'Prost', rarity: 'Legendary', pace: 64, qualifying: 55, tyre: 58, overtaking: 55, consistency: 61 },
  { name: 'Lauda', rarity: 'Legendary', pace: 61, qualifying: 55, tyre: 64, overtaking: 58, consistency: 55 },
  { name: 'Mansell', rarity: 'Legendary', pace: 57, qualifying: 51, tyre: 39, overtaking: 45, consistency: 33 },
  { name: 'Stewart', rarity: 'Legendary', pace: 61, qualifying: 55, tyre: 55, overtaking: 58, consistency: 64 },
  { name: 'Fittipaldi', rarity: 'Legendary', pace: 45, qualifying: 39, tyre: 33, overtaking: 57, consistency: 51 },
  { name: 'G.Hill', rarity: 'Legendary', pace: 33, qualifying: 45, tyre: 39, overtaking: 51, consistency: 57 },
  { name: 'Brabham', rarity: 'Legendary', pace: 61, qualifying: 55, tyre: 55, overtaking: 64, consistency: 58 },
  { name: 'D.Hill', rarity: 'Legendary', pace: 45, qualifying: 51, tyre: 39, overtaking: 33, consistency: 57 },
  { name: 'G.Villeneuve', rarity: 'Legendary', pace: 57, qualifying: 39, tyre: 33, overtaking: 45, consistency: 51 },
  { name: 'J.Villeneuve', rarity: 'Legendary', pace: 43, qualifying: 37, tyre: 31, overtaking: 25, consistency: 19 },
  { name: 'Button', rarity: 'Legendary', pace: 19, qualifying: 37, tyre: 43, overtaking: 25, consistency: 31 },
  { name: 'Coulthard', rarity: 'Legendary', pace: 37, qualifying: 25, tyre: 43, overtaking: 19, consistency: 31 },
  { name: 'Berger', rarity: 'Legendary', pace: 19, qualifying: 25, tyre: 31, overtaking: 37, consistency: 43 },
  { name: 'Massa', rarity: 'Legendary', pace: 5, qualifying: 9, tyre: 13, overtaking: 21, consistency: 17 },
  { name: 'Webber', rarity: 'Legendary', pace: 17, qualifying: 13, tyre: 21, overtaking: 5, consistency: 9 },
  { name: 'Fisichella', rarity: 'Legendary', pace: 21, qualifying: 17, tyre: 13, overtaking: 9, consistency: 5 },
  { name: 'Hunt', rarity: 'Legendary', pace: 37, qualifying: 25, tyre: 19, overtaking: 43, consistency: 31 },
  { name: 'Andretti', rarity: 'Legendary', pace: 25, qualifying: 37, tyre: 31, overtaking: 43, consistency: 19 },
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
let pendingOcrSyncSnapshot = null;

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

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function applyNeonButtonPalette() {
  const nodes = Array.from(document.querySelectorAll("button, .pill, input[type='button'], input[type='submit'], input[type='reset']"));
  const neonHues = [
    [8, 34], [22, 52], [48, 82], [84, 116], [128, 166], [170, 202],
    [206, 238], [244, 274], [286, 320], [332, 14]
  ];
  nodes.forEach((el) => {
    if (!el || typeof el.style?.setProperty !== 'function') return;
    const idx = nodes.indexOf(el) % neonHues.length;
    const [hue, hue2] = neonHues[idx];
    el.style.setProperty('--btn-neon-h', String(hue));
    el.style.setProperty('--btn-neon-h2', String(hue2));
  });
}

function setupNeonButtonPalette() {
  if (!document?.body) return;
  applyNeonButtonPalette();
  if (window.__neonButtonPaletteObserver) return;
  const observer = new MutationObserver(() => {
    if (window.__neonButtonPaletteRaf) cancelAnimationFrame(window.__neonButtonPaletteRaf);
    window.__neonButtonPaletteRaf = requestAnimationFrame(() => {
      applyNeonButtonPalette();
      window.__neonButtonPaletteRaf = 0;
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
  window.__neonButtonPaletteObserver = observer;
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

function setResult(id, text, kind) {
  const out = byId(id);
  if (!out) return;
  out.textContent = text;
  if (kind) {
    out.dataset.kind = String(kind).toLowerCase();
  } else {
    delete out.dataset.kind;
  }
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
  addListener('f1SyncOcrSelectButton', 'click', () => {
    const ocrInput = byId('ocrFile');
    if (ocrInput) ocrInput.click();
  });
  addListener('ocrApplyButton', 'click', applyPendingSyncOcrSnapshot);
  addListener('ocrDiscardButton', 'click', () => {
    clearSyncOcrReview();
    setSyncResult('OCR-Vorschau verworfen.');
  });
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

function getCommunityTrackHint(trackName) {
  const trackCfg = getTrackCommunity(trackName);
  const topDrivers = Object.entries(trackCfg.driverBoosts || {})
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 3)
    .map(([name]) => name);
  return {
    notes: String(trackCfg.notes || '').trim(),
    topDrivers,
    strategyKeys: Object.entries(trackCfg.strategyBoosts || {})
      .sort((a, b) => Number(b[1]) - Number(a[1]))
      .filter(([, value]) => Number(value) > 0)
      .map(([key]) => key)
  };
}

function renderCommunityTrackInsight(trackName, panelId = 'communityTrackInsight') {
  const panel = byId(panelId);
  if (!panel) return;
  const activeTrack = trackName || byId('trackSelect')?.value || byId('builderTrackSelect')?.value;
  if (!activeTrack) {
    panel.innerHTML = '';
    return;
  }

  const trackCfg = getTrackCommunity(activeTrack);
  const hint = getCommunityTrackHint(activeTrack);
  const topDriverEntries = Object.entries(trackCfg.driverBoosts || {})
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 3);
  const topStrategyEntries = Object.entries(trackCfg.strategyBoosts || {})
    .filter(([, value]) => Number(value) > 0)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 3);
  const topPartEntries = Object.entries(trackCfg.partBoosts || {})
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 6);

  const strategyLabels = {
    one_stop: '1-Stop',
    two_stop: '2-Stop',
    balanced: 'Balanced',
    aggressive: 'Aggressive'
  };

  const driverClass = (value) => (value >= 1.4 ? 'community-pill--high' : value >= 1.1 ? 'community-pill--mid' : 'community-pill--low');
  const strategyClass = (value) => (value >= 1.5 ? 'community-pill--high' : value >= 0.8 ? 'community-pill--mid' : 'community-pill--low');
  const partClass = (value) => (value >= 0.55 ? 'community-pill--high' : value >= 0.45 ? 'community-pill--mid' : 'community-pill--low');

  const renderPill = (label, value, cls) => `<span class="community-pill ${cls}">${escapeHtml(label)} <em>+${Number(value).toFixed(2)}</em></span>`;

  const rows = [
    topDriverEntries.length
      ? `<div class="community-insight__line"><strong>Fahrer:</strong><div class="community-insight__pills">${topDriverEntries.map(([name, value]) => renderPill(name, value, driverClass(Number(value)))).join('')}</div></div>`
      : '',
    topStrategyEntries.length
      ? `<div class="community-insight__line"><strong>Strategie:</strong><div class="community-insight__pills">${topStrategyEntries.map(([key, value]) => renderPill(strategyLabels[key] || key, value, strategyClass(Number(value)))).join('')}</div></div>`
      : '',
    topPartEntries.length
      ? `<div class="community-insight__line"><strong>Setup-Teile:</strong><div class="community-insight__pills">${topPartEntries.map(([name, value]) => renderPill(name, value, partClass(Number(value)))).join('')}</div></div>`
      : ''
  ].filter(Boolean).join('');

  panel.innerHTML = `<h3 class="community-insight__title">AllClash Live-Hinweis (${escapeHtml(activeTrack)})</h3>
    <div class="community-insight__rows">${rows || '<div>Keine spezifischen Community-Boosts für diese Strecke.</div>'}</div>
    ${hint.notes ? `<div class="community-insight__notes">${escapeHtml(hint.notes)}</div>` : ''}`;
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

function loadAllClashReferenceKnowledge() {
  const seed = buildAllClashReferenceKnowledge();
  const result = saveCommunityKnowledgeWithMode(seed);
  const textArea = byId('communityKnowledgeInput');
  if (textArea) textArea.value = JSON.stringify(result.saved, null, 2);
  const modeText = result.mode === 'merge' ? 'Merge' : 'Override';
  const conflictNote = result.conflicts.length ? ` | Konflikte: ${result.conflicts.length} (${result.conflicts.slice(0, 4).join(' ; ')})` : '';
  updateCommunityKnowledgeResult(tr('community_allclash_ok', {
    mode: modeText,
    sources: result.saved.sources.length,
    tracks: Object.keys(result.saved.tracks).length,
    conflicts: conflictNote
  }));
  runStrategyCalculation();
  optimizeSelectedTrack();
}

function ensureAllClashReferenceKnowledgeUpToDate() {
  const current = loadCommunityKnowledge();
  const seed = normalizeCommunityKnowledge(buildAllClashReferenceKnowledge());

  const currentSourceIds = new Set((current.sources || []).map((source) => source?.id).filter(Boolean));
  const seedSourceIds = (seed.sources || []).map((source) => source?.id).filter(Boolean);
  const missingSeedSources = seedSourceIds.some((id) => !currentSourceIds.has(id));
  const hasNoTracks = !current.tracks || !Object.keys(current.tracks).length;
  const seedIsNewer = String(seed.updatedAt || '') > String(current.updatedAt || '');
  const versionOlder = Number(current.version || 0) < Number(seed.version || 0);

  if (!hasNoTracks && !missingSeedSources && !seedIsNewer && !versionOlder) {
    communityKnowledge = current;
    return false;
  }

  const mergeResult = mergeCommunityKnowledge(current, seed);
  saveCommunityKnowledge(mergeResult.merged);
  return true;
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
  addListener('communityLoadAllClashButton', 'click', loadAllClashReferenceKnowledge);
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

function driverEffectiveScoreOnTrack(driver, trackName, stageMap = null) {
  const activeStageMap = stageMap || loadDriverStageMap();
  const stage = getDriverStageNumber(driver.name, activeStageMap);
  const base = driverAbilityScoreOnTrack(driver, trackName);
  const stageBoost = 1 + (stage - 1) * 0.013;
  const effective = base * stageBoost;
  const communityBoost = getCommunityDriverBoost(trackName, driver.name);
  const communityAdjusted = effective + communityBoost * 6;
  return {
    name: driver.name,
    stage,
    base,
    stageBoost,
    effective,
    communityBoost,
    communityAdjusted
  };
}

function getDriverAbilityContext(trackName) {
  const stageMap = loadDriverStageMap();
  const ranked = driversDb
    .map((driver) => driverEffectiveScoreOnTrack(driver, trackName, stageMap))
    .sort((a, b) => b.communityAdjusted - a.communityAdjusted);

  const top = ranked.slice(0, 2);
  const avgTopEffective = top.length ? top.reduce((sum, row) => sum + row.communityAdjusted, 0) / top.length : 0;
  const driverModifier = Math.max(0, Math.min(2.2, (avgTopEffective - 70) * 0.028));

  return {
    ranking: ranked,
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
    return tr('driver_impact_line', {
      idx: idx + 1,
      name: entry.name,
      stage: entry.stage,
      base: entry.base.toFixed(2),
      boost: entry.stageBoost.toFixed(3),
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
    const score = driverEffectiveScoreOnTrack(driver, trackName, stageMap);
    const stageImpact = (score.stageBoost - 1) * 100;
    return {
      name: `${driver.name} (${`S${score.stage}`})`,
      effective: score.effective,
      stageImpact,
      communityValue: score.communityAdjusted
    };
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

function driverEditionType(driver) {
  const name = typeof driver === 'string' ? driver : driver?.name;
  const rarity = String(typeof driver === 'object' ? (driver?.rarity || '') : '').toLowerCase();
  if (SPECIAL_DRIVER_NAMES.has(name)) return 'special';
  if (rarity.includes('podium stars') || rarity.includes('prospect')) return 'special';
  if (LEGENDARY_DRIVER_NAMES.has(name) || rarity === 'legendary') return 'legendary';
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

function applyStoredTrackSelection() {
  const queryTrack = (() => {
    try {
      return String(new URLSearchParams(window.location.search).get('track') || '').trim();
    } catch {
      return '';
    }
  })();
  const queryTrackIndex = (() => {
    try {
      const raw = String(new URLSearchParams(window.location.search).get('trackIndex') || '').trim();
      if (!raw) return null;
      const parsed = Number.parseInt(raw, 10);
      return Number.isFinite(parsed) ? parsed : null;
    } catch {
      return null;
    }
  })();
  if (queryTrackIndex != null && queryTrackIndex >= 0) {
    try { localStorage.setItem(TRACK_SELECTION_INDEX_KEY, String(queryTrackIndex)); } catch {}
  }
  const stored = queryTrack || String(localStorage.getItem(TRACK_SELECTION_KEY) || '').trim();
  if (!stored) return;
  const select = byId('trackSelect');
  if (!select) return;

  const normalize = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const aliasByToken = {
    // Round IDs
    r1: 'bahrain',
    r2: 'saudiarabia',
    r3: 'australia',
    r4: 'japan',
    r5: 'china',
    r6: 'miami',
    r7: 'emiliaromagna',
    r8: 'monaco',
    r9: 'spain',
    r10: 'canada',
    r11: 'austria',
    r12: 'unitedkingdom',
    r13: 'belgium',
    r14: 'hungary',
    r15: 'netherlands',
    r16: 'italy',
    r17: 'azerbaijan',
    r18: 'singapore',
    r19: 'unitedstates',
    r20: 'mexico',
    r21: 'brazil',
    r22: 'lasvegas',
    r23: 'qatar',
    r24: 'abudhabi',

    // Circuit aliases
    sakhir: 'bahrain',
    jeddah: 'saudiarabia',
    melbourne: 'australia',
    suzuka: 'japan',
    shanghai: 'china',
    imola: 'emiliaromagna',
    barcelona: 'spain',
    montreal: 'canada',
    spielberg: 'austria',
    silverstone: 'unitedkingdom',
    spa: 'belgium',
    budapest: 'hungary',
    zandvoort: 'netherlands',
    monza: 'italy',
    baku: 'azerbaijan',
    austin: 'unitedstates',
    mexicocity: 'mexico',
    saopaulo: 'brazil',
    lusail: 'qatar',
    yasmarina: 'abudhabi',

    // Known variants
    uk: 'unitedkingdom',
    usa: 'unitedstates',
    emiliaromagna: 'imola',
    miami: 'unitedstates'
  };

  const resolveAliasToken = (token) => {
    let current = token;
    const visited = new Set();
    while (aliasByToken[current] && !visited.has(current)) {
      visited.add(current);
      current = aliasByToken[current];
    }
    return current;
  };

  const options = Array.from(select.options || []);
  if (!options.length && stored) {
    const fallbackOption = document.createElement('option');
    fallbackOption.value = stored;
    fallbackOption.textContent = stored;
    select.appendChild(fallbackOption);
  }
  const hydratedOptions = Array.from(select.options || []);
  const storedIndex = Number.parseInt(String(localStorage.getItem(TRACK_SELECTION_INDEX_KEY) || ''), 10);
  const direct = hydratedOptions.find((opt) => opt.value === stored);
  const storedNorm = normalize(stored);
  const resolvedStored = resolveAliasToken(storedNorm);
  const candidates = Array.from(new Set([
    storedNorm,
    resolvedStored,
    resolveAliasToken('r' + String(storedNorm).replace(/^r/i, '')),
    resolveAliasToken(String(storedNorm).replace(/^round/, 'r'))
  ].filter(Boolean)));
  const fallback = hydratedOptions.find((opt) => String(opt.value || '').toLowerCase() === stored.toLowerCase());
  const normalized = hydratedOptions.find((opt) => candidates.includes(normalize(opt.value)));
  const fuzzy = hydratedOptions.find((opt) => {
    const valueNorm = normalize(opt.value);
    return candidates.some((token) => valueNorm.includes(token) || token.includes(valueNorm));
  });
  const byIndex = Number.isFinite(storedIndex) && storedIndex >= 0 && storedIndex < hydratedOptions.length
    ? hydratedOptions[storedIndex]
    : null;
  const chosen = direct || fallback || normalized || fuzzy || byIndex;
  if (!chosen) return null;

  try {
    localStorage.setItem(TRACK_SELECTION_KEY, chosen.value);
    const idx = hydratedOptions.findIndex((opt) => opt.value === chosen.value);
    if (idx >= 0) localStorage.setItem(TRACK_SELECTION_INDEX_KEY, String(idx));
  } catch {}

  select.value = chosen.value;
  const strategy = byId('strategyTrackSelect');
  const builder = byId('builderTrackSelect');
  if (strategy) strategy.value = chosen.value;
  if (builder) builder.value = chosen.value;

  try {
    select.dispatchEvent(new Event('change', { bubbles: true }));
    if (strategy) strategy.dispatchEvent(new Event('change', { bubbles: true }));
    if (builder) builder.dispatchEvent(new Event('change', { bubbles: true }));
  } catch {}

  return chosen.value;
}

function updateSelectedTrackBadge() {
  const badge = byId('selectedTrackBadge');
  const select = byId('trackSelect');
  if (!badge || !select) return;
  if (!select.options.length) {
    // Retry once in case select options were not ready at first paint.
    try { fillTrackSelects(); } catch {}
  }
  const queryTrack = (() => {
    try {
      return String(new URLSearchParams(window.location.search).get('track') || '').trim();
    } catch {
      return '';
    }
  })();
  const storedTrack = (() => {
    try {
      return String(localStorage.getItem(TRACK_SELECTION_KEY) || '').trim();
    } catch {
      return '';
    }
  })();
  const current = select.options[select.selectedIndex]?.textContent || select.value || queryTrack || storedTrack || '-';
  badge.textContent = `Aktuelle Strecke: ${current}`;
}

function initTrackSelectionLauncher() {
  const button = byId('trackSelectionPageButton');
  const select = byId('trackSelect');
  if (!button || !select) return;

  if (!select.options.length) {
    const stored = (() => {
      try {
        return String(localStorage.getItem(TRACK_SELECTION_KEY) || '').trim();
      } catch {
        return '';
      }
    })();
    if (stored) {
      const option = document.createElement('option');
      option.value = stored;
      option.textContent = stored;
      select.appendChild(option);
    }
  }

  if (!select.value && select.options.length > 0) {
    select.value = String(select.options[0]?.value || '').trim();
  }

  try {
    const currentValue = String(select.value || '').trim();
    if (currentValue) localStorage.setItem(TRACK_SELECTION_KEY, currentValue);
    const optionValues = Array.from(select.options || [])
      .map((opt) => String(opt.value || '').trim())
      .filter(Boolean);
    if (optionValues.length) localStorage.setItem(TRACK_SELECTION_OPTIONS_KEY, JSON.stringify(optionValues));
  } catch {}

  updateSelectedTrackBadge();

  if (!button.dataset.bound) {
    button.dataset.bound = '1';
    button.addEventListener('click', () => {
      try {
        const value = String(select.value || '').trim();
        if (value) localStorage.setItem(TRACK_SELECTION_KEY, value);
        const idx = select.selectedIndex;
        if (Number.isInteger(idx) && idx >= 0) localStorage.setItem(TRACK_SELECTION_INDEX_KEY, String(idx));
        const optionValues = Array.from(select.options || [])
          .map((opt) => String(opt.value || '').trim())
          .filter(Boolean);
        if (optionValues.length) localStorage.setItem(TRACK_SELECTION_OPTIONS_KEY, JSON.stringify(optionValues));
      } catch {}
      window.location.href = 'track-selection.html?next=optimizer.html';
    });
  }
}

function initCustomTrackSelect() {
  const select = byId('trackSelect');
  const toggle = byId('trackSelectToggle');
  const menu = byId('trackSelectMenu');
  if (!select || !toggle || !menu) return;

  const closeMenu = () => {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  };

  const updateToggleLabel = () => {
    const current = select.options[select.selectedIndex];
    toggle.textContent = current?.textContent || 'Strecke waehlen';
  };

  const renderMenu = () => {
    menu.innerHTML = '';
    Array.from(select.options).forEach((opt) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'track-select-option' + (opt.value === select.value ? ' is-selected' : '');
      item.textContent = opt.textContent || opt.value;
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', opt.value === select.value ? 'true' : 'false');
      item.addEventListener('click', () => {
        if (select.value !== opt.value) {
          select.value = opt.value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
        updateToggleLabel();
        renderMenu();
        closeMenu();
      });
      menu.appendChild(item);
    });
  };

  if (!toggle.dataset.bound) {
    toggle.dataset.bound = '1';

    toggle.addEventListener('click', () => {
      const opening = menu.hidden;
      if (opening) {
        renderMenu();
        menu.hidden = false;
        toggle.setAttribute('aria-expanded', 'true');
      } else {
        closeMenu();
      }
    });

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (menu.hidden) return;
      if (target === toggle || menu.contains(target)) return;
      closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !menu.hidden) closeMenu();
    });

    select.addEventListener('change', () => {
      updateToggleLabel();
      renderMenu();
    });
  }

  updateToggleLabel();
  renderMenu();
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

  try {
    const raw = localStorage.getItem(DRIVER_PAIR_SELECTION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        const aName = String(parsed.a || '').trim();
        const bName = String(parsed.b || '').trim();
        if (aName && Array.from(a.options).some((opt) => opt.value === aName)) a.value = aName;
        if (bName && Array.from(b.options).some((opt) => opt.value === bName)) b.value = bName;
      }
    }
  } catch {}

  const persistPair = (source = 'manual') => {
    const payload = {
      a: String(a.value || ''),
      b: String(b.value || ''),
      source,
      updatedAt: new Date().toISOString()
    };
    try { localStorage.setItem(DRIVER_PAIR_SELECTION_KEY, JSON.stringify(payload)); } catch {}
  };

  if (!a.dataset.pairPersistBound) {
    a.dataset.pairPersistBound = '1';
    a.addEventListener('change', () => persistPair('manual'));
  }
  if (!b.dataset.pairPersistBound) {
    b.dataset.pairPersistBound = '1';
    b.addEventListener('change', () => persistPair('manual'));
  }
  persistPair('init');
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

let _activePartCategory = 'all';
let _activeDriverCategory = 'standard';
let _activeSpecialDriverCategory = 'podium-stars';

function buildInventory() {
  const wrap = byId('partsInventory');
  if (!wrap) return;
  wrap.innerHTML = '';
  const _catNav = byId('partsCategoryNav');
  if (_catNav && !_catNav._wired) {
    _catNav._wired = true;
    _catNav.querySelectorAll('button[data-part-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        _activePartCategory = btn.dataset.partCat || 'all';
        buildInventory();
      });
    });
  }
  if (_catNav) {
    _catNav.querySelectorAll('button[data-part-cat]').forEach((btn) => {
      const active = btn.dataset.partCat === _activePartCategory;
      btn.classList.toggle('ghost-link', !active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }
  const metaMap = loadPartMetaMap();

  function partSlug(name) {
    return String(name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function partPhotoCandidates(name, category) {
    const slug = partSlug(name);
    const catSlug = category ? partSlug(category) : null;
    const catFirst = catSlug ? [
      `assets/parts/${slug}-${catSlug}.png`,
      `assets/parts/${slug}-${catSlug}.jpg`,
      `assets/parts/${slug}-${catSlug}.jpeg`,
      `assets/parts/${slug}-${catSlug}.webp`,
    ] : [];
    return [
      ...catFirst,
      `assets/parts/${slug}.png`,
      `assets/parts/${slug}.jpg`,
      `assets/parts/${slug}.jpeg`,
      `assets/parts/${slug}.webp`,
    ];
  }

  function partInitialsAvatar(name) {
    const safe = String(name || '').trim();
    const initials = safe
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'PT';
    const hue = (safe.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) + 40) % 360;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(${hue},75%,50%)"/><stop offset="100%" stop-color="hsl(${(hue + 34) % 360},75%,34%)"/></linearGradient></defs><rect width="72" height="72" rx="16" fill="url(#g)"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="#f6f9ff" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="700">${escapeHtml(initials)}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function renderPartLegendStats(part, level, mod) {
    const eff = getPartEffectiveStats(part, { [part.name]: { level, mod } });
    return `Stats L${level}: T ${Math.round(eff.tempo)} | K ${Math.round(eff.kurven)} | A ${Math.round(eff.antrieb)} | Q ${Math.round(eff.quali)} | D ${Math.round(eff.drs)}`;
  }

  const _visibleParts = _activePartCategory === 'all'
    ? partCatalog
    : partCatalog.filter((p) => p.category === _activePartCategory);
  _visibleParts.forEach((part) => {
    const owned = ownedParts.includes(part.name);
    const el = document.createElement('div');
    el.className = 'inventory-card part-card';
    const mod = Number(metaMap[part.name]?.mod || 0);
    const level = Math.max(1, Math.min(12, Number(metaMap[part.name]?.level || 1)));
    const quality = partQualityByLevel(level);
    const updatedAtText = formatLocalDateTime(metaMap[part.name]?.updatedAt);
    el.innerHTML = `
      <div class="part-head">
        <img class="part-photo" alt="${part.name}" loading="lazy" decoding="async" />
        <h4>${part.name}</h4>
      </div>
      <div class="part-meta" data-part-quality="${part.name}">Kategorie: ${part.category} | Qualität: ${quality}</div>
      <div class="part-meta" data-part-legend="${part.name}">${renderPartLegendStats(part, level, mod)}</div>
      <div class="part-meta" data-part-updated="${part.name}">Letztes Update: ${updatedAtText}</div>
      <button class="part-ownership" type="button">${owned ? 'Im Besitz' : 'Nicht im Besitz'}</button>
      <div class="part-controls">
        <label for="part_level_${part.dbId || part.name}">Level</label>
        <select id="part_level_${part.dbId || part.name}">${PART_LEVELS.map((lvl) => `<option value="${lvl}" ${lvl === level ? 'selected' : ''}>Level ${lvl}</option>`).join('')}</select>
      </div>
    `;
    el.draggable = owned;
    el.style.opacity = owned ? '1' : '.45';
    const photoNode = el.querySelector('.part-photo');
    if (photoNode) {
      const candidates = partPhotoCandidates(part.name, part.category);
      let candidateIndex = 0;
      const applyCandidate = () => {
        if (candidateIndex >= candidates.length) {
          photoNode.src = partInitialsAvatar(part.name);
          return;
        }
        photoNode.src = candidates[candidateIndex];
      };
      photoNode.addEventListener('error', () => {
        candidateIndex += 1;
        applyCandidate();
      });
      applyCandidate();
    }
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
      const nextLevel = Math.max(1, Math.min(12, next));
      const nextMod = Number(previous.mod || 0);
      const timestamp = new Date().toISOString();
      metaMap[part.name] = { ...previous, level: nextLevel, mod: nextMod, updatedAt: timestamp };
      savePartMetaMap(metaMap);
      const qualityNode = el.querySelector('[data-part-quality]');
      if (qualityNode) qualityNode.textContent = `Kategorie: ${part.category} | Qualität: ${partQualityByLevel(nextLevel)}`;
      const legendNode = el.querySelector('[data-part-legend]');
      if (legendNode) legendNode.textContent = renderPartLegendStats(part, nextLevel, nextMod);
      const updatedNode = el.querySelector('[data-part-updated]');
      if (updatedNode) updatedNode.textContent = `Letztes Update: ${formatLocalDateTime(timestamp)}`;
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
  const specialPodiumStarsWrap = byId('driversSpecialPodiumStarsList');
  const specialPodiumStarsLegendsWrap = byId('driversSpecialPodiumStarsLegendsList');
  const specialHotContendersWrap = byId('driversSpecialHotContendersList');
  const standardSection = byId('driversStandardSection');
  const legendarySection = byId('driversLegendarySection');
  const specialSection = byId('driversSpecialSection');
  const specialPodiumStarsSection = byId('driversSpecialPodiumStarsSection');
  const specialPodiumStarsLegendsSection = byId('driversSpecialPodiumStarsLegendsSection');
  const specialHotContendersSection = byId('driversSpecialHotContendersSection');
  const driverNav = byId('driversCategoryNav');
  const specialNav = byId('driversSpecialCategoryNav');
  if (!standardWrap || !legendaryWrap || !specialPodiumStarsWrap || !specialPodiumStarsLegendsWrap || !specialHotContendersWrap) return;

  if (driverNav && !driverNav._wired) {
    driverNav._wired = true;
    driverNav.querySelectorAll('button[data-driver-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        _activeDriverCategory = btn.dataset.driverCat || 'standard';
        buildDriverInventory();
      });
    });
  }
  if (driverNav) {
    driverNav.querySelectorAll('button[data-driver-cat]').forEach((btn) => {
      const active = btn.dataset.driverCat === _activeDriverCategory;
      btn.classList.toggle('ghost-link', !active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }
  if (specialNav && !specialNav._wired) {
    specialNav._wired = true;
    specialNav.querySelectorAll('button[data-special-driver-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        _activeSpecialDriverCategory = btn.dataset.specialDriverCat || 'podium-stars';
        buildDriverInventory();
      });
    });
  }
  if (specialNav) {
    specialNav.querySelectorAll('button[data-special-driver-cat]').forEach((btn) => {
      const active = btn.dataset.specialDriverCat === _activeSpecialDriverCategory;
      btn.classList.toggle('ghost-link', !active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  const specialVisible = _activeDriverCategory === 'special';
  if (standardSection) standardSection.hidden = _activeDriverCategory !== 'standard';
  if (legendarySection) legendarySection.hidden = _activeDriverCategory !== 'legendary';
  if (specialSection) specialSection.hidden = !specialVisible;
  if (specialPodiumStarsSection) specialPodiumStarsSection.hidden = !specialVisible || _activeSpecialDriverCategory !== 'podium-stars';
  if (specialPodiumStarsLegendsSection) specialPodiumStarsLegendsSection.hidden = !specialVisible || _activeSpecialDriverCategory !== 'podium-stars-legends';
  if (specialHotContendersSection) specialHotContendersSection.hidden = !specialVisible || _activeSpecialDriverCategory !== 'hot-contenders';

  standardWrap.innerHTML = '';
  legendaryWrap.innerHTML = '';
  specialPodiumStarsWrap.innerHTML = '';
  specialPodiumStarsLegendsWrap.innerHTML = '';
  specialHotContendersWrap.innerHTML = '';

  const qualityRanks = buildDriverQualityRanks();
  const stageMap = loadDriverStageMap();

  function stageMultiplier(stageLabel) {
    const match = String(stageLabel || 'S1').match(/^S(\d{1,2})$/i);
    const stageNum = Math.max(1, Math.min(12, match ? Number(match[1]) : 1));
    return 1 + (stageNum - 1) * 0.013;
  }

  function renderDriverLegendStats(driver, stageLabel) {
    const mult = stageMultiplier(stageLabel);
    const pace = Math.round(driver.pace * mult);
    const qualifying = Math.round(driver.qualifying * mult);
    const tyre = Math.round(driver.tyre * mult);
    const overtaking = Math.round(driver.overtaking * mult);
    const consistency = Math.round(driver.consistency * mult);
    return `Pace ${pace} | Quali ${qualifying} | Reifen ${tyre} | Overtake ${overtaking} | Konstanz ${consistency}`;
  }

  function driverSlug(name) {
    return String(name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function driverPhotoCandidates(name) {
    const slug = driverSlug(name);
    return [
      `assets/drivers/${slug}.png`,
      `assets/drivers/${slug}.jpg`,
      `assets/drivers/${slug}.jpeg`,
      `assets/drivers/${slug}.webp`
    ];
  }

  function specialDriverCategory(driver) {
    const rarity = String(driver?.rarity || '').toLowerCase();
    if (rarity.includes('podium stars legends')) return 'podium-stars-legends';
    if (rarity.includes('prospect')) return 'hot-contenders';
    if (rarity.includes('podium stars')) return 'podium-stars';
    return 'podium-stars';
  }

  function driverInitialsAvatar(name) {
    const safe = String(name || '').trim();
    const initials = safe
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'DR';
    const hue = safe.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 360;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="hsl(${hue},78%,52%)"/><stop offset="100%" stop-color="hsl(${(hue + 46) % 360},78%,38%)"/></linearGradient></defs><rect width="72" height="72" rx="16" fill="url(#g)"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="#f6f9ff" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="700">${escapeHtml(initials)}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  driversDb.forEach((driver) => {
    const stage = DRIVER_STAGES.includes(stageMap[driver.name]?.stage) ? stageMap[driver.name].stage : 'S1';
    const rank = qualityRanks[driver.name] || 1;
    const corePoolTag = USER_CORE_DRIVER_POOL.has(driver.name) ? 'Core Pool' : 'Extended Pool';
    const updatedAtText = formatLocalDateTime(stageMap[driver.name]?.updatedAt);
    const card = document.createElement('div');
    card.className = 'inventory-card driver-card';
    card.innerHTML = `
      <div class="driver-head">
        <img class="driver-photo" alt="${driver.name}" loading="lazy" decoding="async" />
        <h4>${driver.name}</h4>
      </div>
      <div class="driver-meta">Seltenheit: ${driver.rarity} | Qualität ${rank}/10 | ${corePoolTag}</div>
      <div class="driver-meta" data-driver-legend="${driver.name}">${renderDriverLegendStats(driver, stage)}</div>
      <div class="driver-meta" data-driver-updated="${driver.name}">Letztes Update: ${updatedAtText}</div>
      <div class="driver-controls">
        <label for="driver_stage_${driver.name.replace(/\s+/g, '_')}">Stufe</label>
        <select id="driver_stage_${driver.name.replace(/\s+/g, '_')}">${DRIVER_STAGES.map((entry) => `<option value="${entry}" ${entry === stage ? 'selected' : ''}>${entry}</option>`).join('')}</select>
      </div>
    `;

    const targetType = driverEditionType(driver);
    let targetWrap = standardWrap;
    if (targetType === 'legendary') {
      targetWrap = legendaryWrap;
    } else if (targetType === 'special') {
      const specialCategory = specialDriverCategory(driver);
      targetWrap = specialCategory === 'podium-stars-legends'
        ? specialPodiumStarsLegendsWrap
        : (specialCategory === 'hot-contenders' ? specialHotContendersWrap : specialPodiumStarsWrap);
    }
    targetWrap.appendChild(card);

    const photoNode = card.querySelector('.driver-photo');
    if (photoNode) {
      const candidates = driverPhotoCandidates(driver.name);
      let candidateIndex = 0;
      const applyCandidate = () => {
        if (candidateIndex >= candidates.length) {
          photoNode.src = driverInitialsAvatar(driver.name);
          return;
        }
        photoNode.src = candidates[candidateIndex];
      };
      photoNode.addEventListener('error', () => {
        candidateIndex += 1;
        applyCandidate();
      });
      applyCandidate();
    }

    const select = card.querySelector('select');
    select?.addEventListener('change', (event) => {
      const timestamp = new Date().toISOString();
      const selectedStage = event.target.value;
      stageMap[driver.name] = { stage: selectedStage, updatedAt: timestamp };
      saveDriverStageMap(stageMap);
      const legendNode = card.querySelector('[data-driver-legend]');
      if (legendNode) legendNode.textContent = renderDriverLegendStats(driver, selectedStage);
      const statusNode = card.querySelector('[data-driver-updated]');
      if (statusNode) statusNode.textContent = `Letztes Update: ${formatLocalDateTime(timestamp)}`;
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
      const track = getBuilderTrackName();
      if (track) saveManualMap(track, { ...manualSetup });
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
  renderCommunityTrackInsight(track);
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
  const trackHint = getCommunityTrackHint(track);
  const hintText = [
    trackHint.topDrivers.length ? `Empf. Fahrer: ${trackHint.topDrivers.join(', ')}` : '',
    trackHint.strategyKeys.length ? `Empf. Strategie: ${trackHint.strategyKeys.join(', ')}` : '',
    trackHint.notes || ''
  ].filter(Boolean).join(' | ');
  setResult('optimizerResult', `${track}: Bestes Setup ${names} | Score ${res.best.score.toFixed(2)} | Community-Bonus ${Number(res.best.communityBonus || 0).toFixed(2)} | Kombis ${comboInfo} | Laufzeit ${res.ms.toFixed(1)}ms${reducedHint} | Top5: ${topTxt}${hintText ? ` | Hinweis: ${hintText}` : ''}`);
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
  chartNode.hidden = false;
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
  renderCommunityTrackInsight(track, 'communityBuilderInsight');
  const trackData = getTrack(track);
  const partMetaMap = loadPartMetaMap();

  // Kategorie-Affinitäten gemäß F1 Clash Sheet-Logik
  const CATEGORY_AFFINITY = {
    engine:     ['antrieb'],
    gearbox:    ['antrieb', 'tempo'],
    rear_wing:  ['drs', 'tempo'],
    front_wing: ['kurven', 'quali'],
    suspension: ['kurven', 'antrieb'],
    brakes:     ['kurven', 'antrieb'],
  };
  const RARITY_BONUS  = { Common: 0, Rare: 8, Epic: 18 };
  const RARITY_COLOR  = { Common: '#9ca3af', Rare: '#60a5fa', Epic: '#c084fc' };
  const CAT_LABEL     = {
    engine: 'Motor', front_wing: 'Frontflügel', rear_wing: 'Heckflügel',
    gearbox: 'Getriebe', suspension: 'Fahrwerk', brakes: 'Bremsen',
  };

  const setup   = {};
  const details = [];

  for (const cat of PART_CATEGORIES) {
    const pool = ownedByCategory(cat);
    if (!pool.length) { details.push({ cat, picked: null }); continue; }

    let best = null;
    let bestScore = -Infinity;
    for (const part of pool) {
      const eff = getPartEffectiveStats(part, partMetaMap);
      const affinityKeys = CATEGORY_AFFINITY[cat] || statKeys;
      const affScore = affinityKeys.reduce((s, k) => s + (trackData[k] / 100) * eff[k], 0);
      const communityPartBonus = getCommunityPartBonus(track, [part]) * 8;
      const total = affScore + (RARITY_BONUS[part.rarity] || 0) + communityPartBonus;
      if (total > bestScore) { bestScore = total; best = part; }
    }

    if (best) {
      setup[best.category] = best.name;
      const eff = getPartEffectiveStats(best, partMetaMap);
      details.push({ cat, picked: best, eff, mainStat: (CATEGORY_AFFINITY[cat] || ['tempo'])[0] });
    } else {
      details.push({ cat, picked: null });
    }
  }

  manualSetup = setup;
  renderManualSlots();

  // Gesamtscore berechnen
  const allParts = PART_CATEGORIES
    .map((cat) => partCatalog.find((p) => p.category === cat && p.name === setup[cat]))
    .filter(Boolean);
  const totalScore = allParts.length === PART_CATEGORIES.length
    ? scoreStats(
        allParts.reduce((acc, p) => {
          const e = getPartEffectiveStats(p, partMetaMap);
          statKeys.forEach((k) => { acc[k] = (acc[k] || 0) + e[k]; });
          return acc;
        }, {}),
        trackWeights[track]
      ) + synergyBonus(allParts) + getCommunityPartBonus(track, allParts)
    : 0;

  // Track-Fokus (Top-2 Gewichtungen) ermitteln
  const focusLabel = [...statKeys]
    .sort((a, b) => (trackData[b] || 0) - (trackData[a] || 0))
    .slice(0, 2)
    .map((k) => statLabels[k])
    .join(' + ');

  // HTML-Karten aufbauen
  let html = `<div class="autosetup-result">
  <div class="autosetup-header">
    <span class="autosetup-track">${escapeHtml(track)}</span>
    <span class="autosetup-focus">${escapeHtml(focusLabel)}</span>
    ${totalScore > 0 ? `<span class="autosetup-score">Score <strong>${totalScore.toFixed(1)}</strong></span>` : ''}
  </div>
  <div class="autosetup-grid">`;

  for (const d of details) {
    const label = CAT_LABEL[d.cat] || d.cat;
    if (!d.picked) {
      html += `<div class="autosetup-card autosetup-card--missing">
        <div class="autosetup-cat">${escapeHtml(label)}</div>
        <div class="autosetup-part-name">Kein Teil</div>
      </div>`;
    } else {
      const col     = RARITY_COLOR[d.picked.rarity] || '#aaa';
      const mainVal = d.eff ? Math.round(d.eff[d.mainStat]) : 0;
      const mainLbl = statLabels[d.mainStat] || d.mainStat;
      html += `<div class="autosetup-card">
        <div class="autosetup-cat">${escapeHtml(label)}</div>
        <div class="autosetup-part-name">${escapeHtml(d.picked.name)}</div>
        <div class="autosetup-rarity" style="color:${col}">${escapeHtml(d.picked.rarity)}</div>
        <div class="autosetup-stat">${escapeHtml(mainLbl)}: ${mainVal}</div>
      </div>`;
    }
  }

  html += `</div>`;
  const missing = details.filter((d) => !d.picked);
  if (missing.length) {
    html += `<p class="autosetup-warn">⚠ ${missing.length} Slot(s) fehlen: ${missing.map((d) => CAT_LABEL[d.cat]).join(', ')}</p>`;
  }
  const trackHint = getCommunityTrackHint(track);
  if (trackHint.topDrivers.length || trackHint.notes) {
    html += `<p class="autosetup-warn">AllClash: ${escapeHtml([
      trackHint.topDrivers.length ? `Empfohlene Fahrer ${trackHint.topDrivers.join(', ')}` : '',
      trackHint.notes || ''
    ].filter(Boolean).join(' | '))}</p>`;
  }
  html += `</div>`;

  const resultEl = byId('optimizerResult', 'builderResult');
  if (resultEl) resultEl.innerHTML = html;
}

function scoreManualSetup() {
  const track = getBuilderTrackName();
  renderCommunityTrackInsight(track, 'communityBuilderInsight');
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
  const trackHint = getCommunityTrackHint(track);
  const hintText = [
    trackHint.topDrivers.length ? `Empf. Fahrer: ${trackHint.topDrivers.join(', ')}` : '',
    trackHint.notes || ''
  ].filter(Boolean).join(' | ');
  setResult('builderResult', `${tr('builder_manual_score', { track, score: score.toFixed(2) })}${hintText ? ` | ${hintText}` : ''}`);
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
  renderCommunityTrackInsight(track.name);
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
  try {
    localStorage.setItem(DRIVER_PAIR_SELECTION_KEY, JSON.stringify({
      a: a.name,
      b: b.name,
      source: 'manual',
      updatedAt: new Date().toISOString()
    }));
  } catch {}
  const synergy = (a.tyre + b.tyre + a.consistency + b.consistency) / 4;
  const aScore = driverEffectiveScoreOnTrack(a, track);
  const bScore = driverEffectiveScoreOnTrack(b, track);
  const score = (aScore.communityAdjusted + bScore.communityAdjusted) / 2 + synergy * 0.2;
  const trackHint = getCommunityTrackHint(track);
  setResult('driverResult', tr('driver_pair_summary', {
    track,
    a: a.name,
    b: b.name,
    score: score.toFixed(2),
    rating: teamClass(score)
  }) + (trackHint.topDrivers.length ? ` | AllClash: ${trackHint.topDrivers.join(', ')}` : ''));
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
      const aScore = driverEffectiveScoreOnTrack(a, track);
      const bScore = driverEffectiveScoreOnTrack(b, track);
      const score = (aScore.communityAdjusted + bScore.communityAdjusted) / 2 + synergy * 0.2;
      if (!best || score > best.score) best = { a, b, score };
    }
  }
  if (best) {
    try {
      localStorage.setItem(DRIVER_PAIR_SELECTION_KEY, JSON.stringify({
        a: best.a.name,
        b: best.b.name,
        source: 'best',
        updatedAt: new Date().toISOString()
      }));
    } catch {}
    const trackHint = getCommunityTrackHint(track);
    setResult('driverResult', tr('driver_best_pair_summary', {
      track,
      a: best.a.name,
      b: best.b.name,
      score: best.score.toFixed(2)
    }) + (trackHint.topDrivers.length ? ` | AllClash: ${trackHint.topDrivers.join(', ')}` : ''));
  }
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
  const out = byId('ocrResult') || byId('f1SyncResult');
  if (!fileInput || !out) return;
  const file = fileInput.files[0];
  if (!file) { out.textContent = tr('ocr_choose_file'); return; }
  if (typeof Tesseract === 'undefined' || !Tesseract?.recognize) {
    out.textContent = 'OCR-Modul nicht geladen. Bitte Seite neu laden.';
    return;
  }
  out.textContent = tr('ocr_running');
  try {
    const { data } = await Tesseract.recognize(file, 'eng', {
      workerPath: 'vendor/worker.min.js',
      langPath: 'assets/tessdata',
      logger: (m) => { if (m.status === 'recognizing text') out.textContent = tr('ocr_running_pct', { percent: Math.round(m.progress * 100) }); }
    });
    const snapshot = parseOcrSnapshot(data.text || '');

    if (byId('ocrReviewPanel')) {
      pendingOcrSyncSnapshot = snapshot;
      renderSyncOcrReview(snapshot);
      out.textContent = 'OCR fertig. Bitte Vorschau pruefen und dann uebernehmen.';
      return;
    }

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

// ===== PERSONAL PAGE =====

const NOTIF_LOG_KEY = 'f1_notif_log';
const NOTIF_MAX = 30;
const PIT_REMINDER_MIN = 25;

function loadNotifLog() {
  const raw = localStorage.getItem(NOTIF_LOG_KEY);
  try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; } catch { return []; }
}

function saveNotifLog(log) {
  localStorage.setItem(NOTIF_LOG_KEY, JSON.stringify(Array.isArray(log) ? log.slice(-NOTIF_MAX) : []));
}

function appendNotifLog(entry) {
  const log = loadNotifLog();
  log.push({ ...entry, ts: Date.now() });
  saveNotifLog(log);
  renderNotifLog();
}

function renderNotifLog() {
  const container = byId('notificationLog');
  if (!container) return;
  const log = loadNotifLog();
  if (!log.length) { container.innerHTML = '<p style="color:var(--text-muted,#9aa2c0);font-size:0.85rem;">Noch keine Push-Ereignisse.</p>'; return; }
  container.innerHTML = log
    .slice().reverse().slice(0, 10)
    .map((e) => {
      const time = new Date(e.ts).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
      return `<div class="notification"><span>${escapeHtml(e.text)}</span><span class="lb-date">${time}</span></div>`;
    })
    .join('');
}

async function enablePushNotifications() {
  const statusEl = byId('notificationStatusResult');
  if (!('Notification' in window)) {
    if (statusEl) statusEl.textContent = 'Push-Benachrichtigungen werden in diesem Browser nicht unterstützt.';
    return;
  }
  const perm = await Notification.requestPermission();
  if (statusEl) {
    if (perm === 'granted') {
      statusEl.textContent = '✅ Push-Benachrichtigungen aktiviert.';
      appendNotifLog({ text: 'Push-Benachrichtigungen aktiviert' });
    } else {
      statusEl.textContent = '⚠️ Berechtigung verweigert. Bitte in den Browser-Einstellungen erlauben.';
    }
  }
}

function sendLocalNotification(title, body) {
  if (Notification.permission !== 'granted') {
    appendNotifLog({ text: `[Ohne Push] ${title}: ${body}` });
    return;
  }
  try {
    new Notification(title, { body, icon: 'assets/ferrari2000_candyred_192.png' });
  } catch {}
  appendNotifLog({ text: `${title}: ${body}` });
}

function sendRacePush() {
  sendLocalNotification('F1 Clash – Race', 'Das nächste Rennen startet! Überprüfe deinen Setup und fahre los. 🏎️');
  const el = byId('notificationStatusResult');
  if (el) el.textContent = 'Race-Push gesendet.';
}

function schedulePitPush() {
  sendLocalNotification('F1 Clash – Pit', `Box in ${PIT_REMINDER_MIN} Minuten – Boxenstrategie prüfen! 🛞`);
  const el = byId('notificationStatusResult');
  if (el) el.textContent = `Pit-Push gesendet (${PIT_REMINDER_MIN} Min-Erinnerung).`;
}

function buildPersonalSuggestions() {
  const container = byId('personalSuggestions');
  const resultEl = byId('personalSuggestionsResult');
  if (!container) return;

  container.innerHTML = '';

  const meta = loadPartMetaMap();
  const stages = loadDriverStageMap();
  const owned = new Set(ownedParts);

  // Find parts with room to upgrade (level < 15)
  const upgradableByCategory = {};
  PART_CATEGORIES.forEach((cat) => {
    upgradableByCategory[cat] = partCatalog
      .filter((p) => p.category === cat && owned.has(p.name))
      .map((p) => ({ ...p, level: Number(meta[p.name]?.level || 1), mod: Number(meta[p.name]?.mod || 0) }))
      .sort((a, b) => a.level - b.level)
      .slice(0, 3);
  });

  PART_CATEGORIES.forEach((cat) => {
    const parts = upgradableByCategory[cat];
    if (!parts.length) return;
    const card = document.createElement('div');
    card.className = 'personal-card';
    const title = document.createElement('strong');
    title.style.cssText = 'display:block;color:var(--accent-cyan,#79e9ff);margin-bottom:0.4rem;';
    title.textContent = `🔧 ${cat}`;
    card.appendChild(title);
    parts.forEach((part) => {
      const row = document.createElement('div');
      row.className = 'suggest-row';
      const lvBar = part.level < 5 ? '⬜⬜⬜' : part.level < 10 ? '🟨🟨⬜' : '🟩🟩🟩';
      row.innerHTML = `<span>${escapeHtml(part.name)}</span><span class="lb-score">LV ${part.level} ${lvBar}</span>`;
      card.appendChild(row);
    });
    container.appendChild(card);
  });

  // Driver stages summary card
  const stageEntries = Object.entries(stages);
  if (stageEntries.length) {
    const card = document.createElement('div');
    card.className = 'personal-card';
    const title = document.createElement('strong');
    title.style.cssText = 'display:block;color:#ffca28;margin-bottom:0.4rem;';
    title.textContent = '🏁 Fahrer-Stages';
    card.appendChild(title);
    stageEntries.slice(0, 8).forEach(([name, s]) => {
      const row = document.createElement('div');
      row.className = 'suggest-row';
      row.innerHTML = `<span>${escapeHtml(name)}</span><span class="lb-score">${escapeHtml(String(s?.stage || 'S1'))}</span>`;
      card.appendChild(row);
    });
    container.appendChild(card);
  }

  // Missing parts card
  const missing = partCatalog.filter((p) => !owned.has(p.name)).slice(0, 12);
  if (missing.length) {
    const card = document.createElement('div');
    card.className = 'personal-card';
    const title = document.createElement('strong');
    title.style.cssText = 'display:block;color:#ff6b6b;margin-bottom:0.4rem;';
    title.textContent = `❌ Noch nicht vorhanden (${missing.length}+ Parts)`;
    card.appendChild(title);
    const list = document.createElement('p');
    list.style.fontSize = '0.82rem';
    list.style.color = 'var(--text-muted,#9aa2c0)';
    list.textContent = missing.map((p) => p.name).join(', ');
    card.appendChild(list);
    container.appendChild(card);
  }

  if (!container.children.length) {
    container.innerHTML = '<p style="color:var(--text-muted,#9aa2c0);">Keine Daten – zuerst Parts in der Garage eintragen.</p>';
  }

  if (resultEl) resultEl.textContent = `${owned.size} Parts / ${stageEntries.length} Fahrer in deiner Garage.`;
}

async function populateFriendCompareSelect() {
  const sel = byId('friendCompareSelect');
  if (!sel) return;
  const currentValue = sel.value;
  sel.innerHTML = '<option value="">– Spieler wählen –</option>';
  try {
    const docs = await fetchLeaderboardDocs();
    const entries = parseLeaderboardEntries(docs);
    entries.sort((a, b) => b.score - a.score);
    const myId = String(getActiveProfileIdLocal() || '').toLowerCase();
    entries.forEach((entry) => {
      if (myId && String(entry.name).toLowerCase().includes(myId)) return;
      const opt = document.createElement('option');
      opt.value = entry.name;
      opt.textContent = `${escapeHtml(entry.name)} (${entry.score} Pts)`;
      sel.appendChild(opt);
    });
    if (currentValue) sel.value = currentValue;
  } catch {}
}

async function compareFriend() {
  const sel = byId('friendCompareSelect');
  const resultEl = byId('friendCompareResult');
  if (!resultEl) return;
  const friendName = sel?.value || '';
  if (!friendName) { resultEl.textContent = 'Bitte zuerst einen Spieler auswählen.'; return; }

  resultEl.textContent = 'Lade Vergleich…';
  try {
    const docs = await fetchLeaderboardDocs();
    const entries = parseLeaderboardEntries(docs);
    const friend = entries.find((e) => e.name === friendName);
    if (!friend) { resultEl.textContent = 'Spieler nicht gefunden.'; return; }

    const myMeta = loadPartMetaMap();
    const myOwned = new Set(ownedParts);
    const friendMeta = friend.payload.partMeta || {};
    const friendOwned = new Set(Array.isArray(friend.payload.ownedParts) ? friend.payload.ownedParts : []);

    const onlyMine = [...myOwned].filter((n) => !friendOwned.has(n));
    const onlyFriend = [...friendOwned].filter((n) => !myOwned.has(n));

    const levelComparisons = [];
    [...myOwned].forEach((name) => {
      if (!friendOwned.has(name)) return;
      const myLv = Number(myMeta[name]?.level || 1);
      const friendLv = Number(friendMeta[name]?.level || 1);
      if (myLv !== friendLv) levelComparisons.push({ name, myLv, friendLv });
    });
    levelComparisons.sort((a, b) => Math.abs(b.friendLv - b.myLv) - Math.abs(a.friendLv - a.myLv));

    const lines = [
      `Vergleich mit ${friendName}:`,
      `Parts du: ${myOwned.size} | ${friendName}: ${friendOwned.size}`,
    ];
    if (onlyFriend.length) lines.push(`Nur ${friendName} hat: ${onlyFriend.slice(0, 8).join(', ')}`);
    if (onlyMine.length) lines.push(`Nur du hast: ${onlyMine.slice(0, 8).join(', ')}`);
    if (levelComparisons.length) {
      lines.push('Level-Unterschiede (top 8):');
      levelComparisons.slice(0, 8).forEach(({ name, myLv, friendLv }) => {
        const diff = friendLv - myLv;
        const arrow = diff > 0 ? `↑ ${diff} hinter` : `↓ ${Math.abs(diff)} vorne`;
        lines.push(`  ${name}: du LV${myLv} / ${friendName} LV${friendLv} (${arrow})`);
      });
    }

    resultEl.textContent = lines.join('\n');
  } catch (err) {
    resultEl.textContent = `Fehler: ${err.message}`;
  }
}

function initPersonalPage() {
  buildPersonalSuggestions();
  renderNotifLog();
  deferUiTask(() => populateFriendCompareSelect(), 100);
}

// ===== END PERSONAL PAGE =====

// ===== LEADERBOARD =====


function leaderboardListUrl(config) {
  const projectId = encodeURIComponent(config.projectId);
  const key = encodeURIComponent(config.apiKey);
  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/playerProfiles?key=${key}&pageSize=50`;
}

function computeLeaderboardScore(payload) {
  let score = 0;
  const meta = payload?.partMeta || {};
  Object.values(meta).forEach((m) => {
    if (m && typeof m === 'object') {
      score += Math.max(1, Number(m.level || 1));
      score += Number(m.mod || 0) * 2;
    }
  });
  const stages = payload?.driverStages || {};
  Object.values(stages).forEach((s) => {
    const raw = String(s?.stage || 'S1').replace(/^S/i, '');
    score += Math.max(0, Number(raw) || 0);
  });
  return score;
}

async function fetchLeaderboardDocs() {
  const cfg = loadFirebaseConfig();
  if (!cfg.projectId || !cfg.apiKey) {
    throw new Error('Firebase-Konfig fehlt. Bitte zuerst in "Account-Sync" einrichten.');
  }
  const auth = loadFirebaseAuthState();
  const headers = { Accept: 'application/json' };
  if (auth?.idToken) headers.Authorization = `Bearer ${auth.idToken}`;
  const url = leaderboardListUrl(cfg);
  const response = await fetch(url, { headers });
  if (!response.ok) {
    const detail = await response.text().catch(() => response.statusText);
    throw new Error(`HTTP ${response.status}: ${detail}`);
  }
  const data = await response.json();
  return Array.isArray(data.documents) ? data.documents : [];
}

function parseLeaderboardEntries(docs) {
  return docs.map((doc) => {
    const fields = doc.fields || {};
    const payloadStr = fields.payload?.stringValue || '{}';
    let payload = {};
    try { payload = JSON.parse(payloadStr); } catch {}
    const profile = payload.profile || {};
    const name = profile.clashId
      || fields.profileId?.stringValue
      || fields.ownerEmail?.stringValue
      || 'Anonym';
    const score = computeLeaderboardScore(payload);
    const partsCount = Array.isArray(payload.ownedParts) ? payload.ownedParts.length : 0;
    const tsRaw = fields.updatedAt?.integerValue;
    const updatedAt = tsRaw ? new Date(Number(tsRaw)).toLocaleDateString('de-DE') : '-';
    return { name, score, partsCount, updatedAt, payload };
  });
}

async function loadLeaderboard() {
  const resultEl = byId('leaderboardResult');
  const listEl = byId('leaderboardList');
  if (!resultEl || !listEl) return;

  resultEl.textContent = 'Lade Leaderboard…';
  listEl.innerHTML = '';

  try {
    const docs = await fetchLeaderboardDocs();
    const entries = parseLeaderboardEntries(docs);
    entries.sort((a, b) => b.score - a.score);

    const ownId = String(getActiveProfileIdLocal() || '').toLowerCase();

    entries.slice(0, 20).forEach((entry, i) => {
      const isOwn = ownId && String(entry.name).toLowerCase().includes(ownId);
      const li = document.createElement('li');
      li.className = `leaderboard-entry${isOwn ? ' is-own' : ''}`;

      const rank = document.createElement('span');
      rank.className = 'lb-rank';
      rank.textContent = `#${i + 1}`;

      const name = document.createElement('span');
      name.className = 'lb-name';
      name.textContent = entry.name;

      const score = document.createElement('span');
      score.className = 'lb-score';
      score.textContent = `${entry.score} Pts`;

      const parts = document.createElement('span');
      parts.className = 'lb-parts';
      parts.textContent = `${entry.partsCount} Parts`;

      const date = document.createElement('span');
      date.className = 'lb-date';
      date.textContent = entry.updatedAt;

      li.append(rank, name, score, parts, date);
      listEl.appendChild(li);
    });

    if (!entries.length) {
      const li = document.createElement('li');
      li.textContent = 'Noch keine Einträge. Speichere dein Profil via Firebase um sichtbar zu werden.';
      listEl.appendChild(li);
    }

    resultEl.textContent = `${entries.length} Spieler gefunden – Top ${Math.min(entries.length, 20)} angezeigt.`;
  } catch (err) {
    resultEl.textContent = `Fehler: ${err.message}`;
  }
}

async function analyzePerformance() {
  const resultEl = byId('aiAnalysisResult');
  const suggestionsEl = byId('aiSuggestions');
  const competitorEl = byId('competitorPanel');
  if (!resultEl || !suggestionsEl) return;

  resultEl.textContent = 'KI analysiert…';
  suggestionsEl.innerHTML = '';
  if (competitorEl) competitorEl.innerHTML = '';

  try {
    const docs = await fetchLeaderboardDocs();
    const entries = parseLeaderboardEntries(docs).filter((e) => e.score > 0);
    entries.sort((a, b) => b.score - a.score);
    const top5 = entries.slice(0, 5);

    if (!top5.length) {
      resultEl.textContent = 'Keine Vergleichsdaten verfügbar.';
      return;
    }

    const myMeta = loadPartMetaMap();
    const myOwned = new Set(ownedParts);
    const myStages = loadDriverStageMap();

    // Upgrade recommendations: compare my part levels to top players
    const upgradeTargets = new Map();
    top5.forEach(({ payload }) => {
      const meta = payload.partMeta || {};
      Object.entries(meta).forEach(([name, m]) => {
        if (!m || typeof m !== 'object') return;
        const theirLevel = Number(m.level || 1);
        if (!myOwned.has(name)) return;
        const myLevel = Number(myMeta[name]?.level || 1);
        if (theirLevel > myLevel) {
          const existing = upgradeTargets.get(name);
          if (!existing || theirLevel > existing.theirLevel) {
            upgradeTargets.set(name, { theirLevel, myLevel });
          }
        }
      });
    });

    const sorted = Array.from(upgradeTargets.entries())
      .sort((a, b) => (b[1].theirLevel - b[1].myLevel) - (a[1].theirLevel - a[1].myLevel))
      .slice(0, 10);

    if (sorted.length) {
      const heading = document.createElement('li');
      heading.style.cssText = 'font-weight:bold;color:var(--accent-cyan,#79e9ff);list-style:none;padding:0.4rem 0;';
      heading.textContent = '🔧 Part-Upgrade-Empfehlungen (vs. Top-5):';
      suggestionsEl.appendChild(heading);
      sorted.forEach(([name, { theirLevel, myLevel }]) => {
        const li = document.createElement('li');
        li.textContent = `${name}: Level ${myLevel} → ${theirLevel}`;
        suggestionsEl.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.textContent = '✅ Bereits auf Top-Niveau – keine Upgrade-Empfehlungen.';
      suggestionsEl.appendChild(li);
    }

    // Show competitor snapshot in competitorPanel
    if (competitorEl && top5[0]) {
      const top = top5[0];
      const h = document.createElement('h4');
      h.style.cssText = 'color:var(--accent-cyan,#79e9ff);margin:0 0 0.5rem;';
      h.textContent = `#1 Spieler: ${escapeHtml(top.name)} (${top.score} Pts)`;
      competitorEl.appendChild(h);

      const theirParts = Array.isArray(top.payload.ownedParts) ? top.payload.ownedParts : [];
      const onlyTheirParts = theirParts.filter((n) => !myOwned.has(n)).slice(0, 8);
      if (onlyTheirParts.length) {
        const p = document.createElement('p');
        p.style.fontSize = '0.88rem';
        p.innerHTML = `<strong>Parts die sie haben, du nicht:</strong> ${onlyTheirParts.map(escapeHtml).join(', ')}`;
        competitorEl.appendChild(p);
      }
    }

    resultEl.textContent = `Analyse abgeschlossen. Verglichen mit ${top5.length} Top-Spieler(n).`;
  } catch (err) {
    resultEl.textContent = `Fehler bei der Analyse: ${err.message}`;
  }
}

// ===== END LEADERBOARD =====

function summarizeOcrSnapshot(snapshot) {
  const safe = snapshot || { parts: [], drivers: [], tracks: [], partMetaByName: {}, driverStageByName: {} };
  const currentPartMeta = loadPartMetaMap();
  const currentDriverStages = loadDriverStageMap();
  const newOwnedParts = safe.parts.filter((name) => !ownedParts.includes(name));
  const partLevelChanges = [];
  const driverStageChanges = [];

  safe.parts.forEach((name) => {
    const meta = safe.partMetaByName?.[name];
    if (!meta || typeof meta !== 'object') return;
    const oldLevel = Number(currentPartMeta?.[name]?.level || 1);
    const oldMod = Number(currentPartMeta?.[name]?.mod || 0);
    const nextLevel = meta.level != null ? clampNumber(meta.level, 1, 15) : null;
    const nextMod = meta.mod != null ? clampNumber(meta.mod, 0, 5) : null;
    const chunks = [];
    if (nextLevel != null && nextLevel !== oldLevel) chunks.push(`Level ${oldLevel} -> ${nextLevel}`);
    if (nextMod != null && nextMod !== oldMod) chunks.push(`Mod ${oldMod} -> ${nextMod}`);
    if (chunks.length) partLevelChanges.push(`${name}: ${chunks.join(' | ')}`);
  });

  safe.drivers.forEach((name) => {
    const parsed = safe.driverStageByName?.[name];
    if (parsed == null) return;
    const next = clampNumber(parsed, 1, 12);
    if (next == null) return;
    const prevRaw = String(currentDriverStages?.[name]?.stage || 'S1').replace(/^S/i, '');
    const prev = clampNumber(prevRaw, 1, 12) || 1;
    if (prev !== next) driverStageChanges.push(`${name}: S${prev} -> S${next}`);
  });

  const lines = [];
  lines.push(`Parts erkannt: ${safe.parts.length}`);
  if (safe.parts.length) lines.push(`- ${safe.parts.slice(0, 12).join(', ')}`);
  if (newOwnedParts.length) {
    lines.push(`Neue Parts im Besitz: ${newOwnedParts.length}`);
    lines.push(`- ${newOwnedParts.slice(0, 12).join(', ')}`);
  }
  lines.push(`Fahrer erkannt: ${safe.drivers.length}`);
  if (safe.drivers.length) lines.push(`- ${safe.drivers.slice(0, 10).join(', ')}`);
  lines.push(`Strecken erkannt: ${safe.tracks.length}`);
  if (safe.tracks.length) lines.push(`- ${safe.tracks.slice(0, 6).join(', ')}`);
  const levelCount = Object.keys(safe.partMetaByName || {}).length;
  const stageCount = Object.keys(safe.driverStageByName || {}).length;
  lines.push(`Part-Level erkannt: ${levelCount}`);
  lines.push(`Fahrer-Stage erkannt: ${stageCount}`);
  if (partLevelChanges.length) {
    lines.push('Part-Aenderungen:');
    partLevelChanges.slice(0, 14).forEach((line) => lines.push(`- ${line}`));
  }
  if (driverStageChanges.length) {
    lines.push('Fahrer-Aenderungen:');
    driverStageChanges.slice(0, 14).forEach((line) => lines.push(`- ${line}`));
  }
  return lines.join('\n');
}

function renderSyncOcrReview(snapshot) {
  const panel = byId('ocrReviewPanel');
  const text = byId('ocrReviewText');
  if (!panel || !text) return;
  text.textContent = summarizeOcrSnapshot(snapshot);
  panel.hidden = false;
}

function clearSyncOcrReview() {
  const panel = byId('ocrReviewPanel');
  const text = byId('ocrReviewText');
  pendingOcrSyncSnapshot = null;
  if (text) text.textContent = '';
  if (panel) panel.hidden = true;
}

function applyPendingSyncOcrSnapshot() {
  const out = byId('f1SyncResult') || byId('ocrResult');
  if (!pendingOcrSyncSnapshot) {
    if (out) out.textContent = 'Keine OCR-Vorschau vorhanden.';
    return;
  }
  const applied = applyOcrSnapshot(pendingOcrSyncSnapshot);
  if (out) {
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
  }
  clearSyncOcrReview();
}

function normalizeOcrToken(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function clampNumber(value, min, max) {
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  return Math.max(min, Math.min(max, Math.round(num)));
}

function findOcrLineForName(lines, name) {
  const target = normalizeOcrToken(name);
  if (!target) return '';
  const direct = lines.find((line) => normalizeOcrToken(line).includes(target));
  if (direct) return direct;

  const words = String(name || '')
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9]/g, ''))
    .filter((w) => w.length >= 3);

  if (!words.length) return '';

  return lines.find((line) => {
    const normalizedLine = normalizeOcrToken(line);
    return words.every((word) => normalizedLine.includes(word));
  }) || '';
}

function parsePartLevelFromLine(line) {
  const text = String(line || '');
  const explicit = text.match(/(?:\blv\b|\blvl\b|\blevel\b)\s*[:.]?\s*(\d{1,2})/i);
  if (explicit) return clampNumber(explicit[1], 1, 15);

  const suffix = text.match(/\b(\d{1,2})\b\s*$/);
  if (suffix) return clampNumber(suffix[1], 1, 15);
  return null;
}

function parsePartModFromLine(line) {
  const text = String(line || '');
  const mod = text.match(/\bmod\b\s*[:.]?\s*(\d{1,2})/i);
  if (!mod) return null;
  return clampNumber(mod[1], 0, 5);
}

function parseDriverStageFromLine(line) {
  const text = String(line || '');
  const explicit = text.match(/(?:\bstage\b|\bs\b)\s*[:.]?\s*(\d{1,2})/i);
  if (explicit) return clampNumber(explicit[1], 1, 12);

  const suffix = text.match(/\b(\d{1,2})\b\s*$/);
  if (suffix) return clampNumber(suffix[1], 1, 12);
  return null;
}

function parseOcrSnapshot(rawText) {
  const textLower = String(rawText || '').toLowerCase();
  const textToken = normalizeOcrToken(rawText || '');
  const lines = String(rawText || '')
    .split(/\r?\n/)
    .map((line) => String(line || '').trim())
    .filter(Boolean);

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

  const partMetaByName = {};
  parts.forEach((name) => {
    const line = findOcrLineForName(lines, name);
    if (!line) return;
    const level = parsePartLevelFromLine(line);
    const mod = parsePartModFromLine(line);
    if (level == null && mod == null) return;
    partMetaByName[name] = {
      ...(level != null ? { level } : {}),
      ...(mod != null ? { mod } : {}),
      source: 'ocr',
      updatedAt: new Date().toISOString()
    };
  });

  const driverStageByName = {};
  drivers.forEach((name) => {
    const line = findOcrLineForName(lines, name);
    if (!line) return;
    const stage = parseDriverStageFromLine(line);
    if (stage == null) return;
    driverStageByName[name] = stage;
  });

  return {
    parts: Array.from(new Set(parts)),
    drivers: Array.from(new Set(drivers)),
    tracks: Array.from(new Set(tracks)),
    partMetaByName,
    driverStageByName
  };
}

function applyOcrSnapshot(snapshot) {
  const safeSnapshot = snapshot || { parts: [], drivers: [], tracks: [], partMetaByName: {}, driverStageByName: {} };
  let addedParts = 0;
  let addedDrivers = 0;
  let updatedPartMeta = 0;
  let updatedDriverStages = 0;

  const partMeta = loadPartMetaMap();
  const parsedPartMeta = safeSnapshot.partMetaByName && typeof safeSnapshot.partMetaByName === 'object'
    ? safeSnapshot.partMetaByName
    : {};

  safeSnapshot.parts.forEach((name) => {
    if (!ownedParts.includes(name)) {
      ownedParts.push(name);
      addedParts += 1;
    }

    const parsedMeta = parsedPartMeta[name];
    if (!parsedMeta || typeof parsedMeta !== 'object') return;

    const current = partMeta[name] && typeof partMeta[name] === 'object' ? partMeta[name] : {};
    const nextLevel = parsedMeta.level != null ? clampNumber(parsedMeta.level, 1, 15) : null;
    const nextMod = parsedMeta.mod != null ? clampNumber(parsedMeta.mod, 0, 5) : null;

    const changed =
      (nextLevel != null && Number(current.level || 0) !== nextLevel) ||
      (nextMod != null && Number(current.mod || 0) !== nextMod);

    partMeta[name] = {
      ...current,
      ...(nextLevel != null ? { level: nextLevel } : {}),
      ...(nextMod != null ? { mod: nextMod } : {}),
      source: 'ocr',
      updatedAt: new Date().toISOString()
    };

    if (changed) updatedPartMeta += 1;
  });
  if (addedParts > 0) saveOwnedParts();
  if (updatedPartMeta > 0) savePartMetaMap(partMeta);

  const stageMap = loadDriverStageMap();
  const parsedDriverStages = safeSnapshot.driverStageByName && typeof safeSnapshot.driverStageByName === 'object'
    ? safeSnapshot.driverStageByName
    : {};

  safeSnapshot.drivers.forEach((name) => {
    const parsedStage = parsedDriverStages[name] != null ? clampNumber(parsedDriverStages[name], 1, 12) : null;
    if (!stageMap[name]) {
      stageMap[name] = {
        stage: `S${parsedStage || 1}`,
        source: 'ocr',
        updatedAt: new Date().toISOString()
      };
      addedDrivers += 1;
      return;
    }

    if (parsedStage == null) return;
    const prevStageRaw = String(stageMap[name]?.stage || '').replace(/^S/i, '');
    const prevStage = clampNumber(prevStageRaw, 1, 12) || 1;
    if (prevStage !== parsedStage) {
      stageMap[name] = {
        ...stageMap[name],
        stage: `S${parsedStage}`,
        source: 'ocr',
        updatedAt: new Date().toISOString()
      };
      updatedDriverStages += 1;
    }
  });
  if (addedDrivers > 0 || updatedDriverStages > 0) saveDriverStageMap(stageMap);

  const firstTrack = safeSnapshot.tracks[0] || '';
  const persistedTrack = String(localStorage.getItem(TRACK_SELECTION_KEY) || '').trim();
  if (firstTrack && !persistedTrack) {
    const mainTrackSelect = byId('trackSelect');
    const strategyTrackSelect = byId('strategyTrackSelect');
    const builderTrackSelect = byId('builderTrackSelect');
    if (mainTrackSelect) mainTrackSelect.value = firstTrack;
    if (strategyTrackSelect) strategyTrackSelect.value = firstTrack;
    if (builderTrackSelect) builderTrackSelect.value = firstTrack;
    try { localStorage.setItem(TRACK_SELECTION_KEY, firstTrack); } catch {}
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
  if (updatedPartMeta > 0) detail.push(`Part-Levels aktualisiert: ${updatedPartMeta}`);
  if (updatedDriverStages > 0) detail.push(`Fahrer-Stages aktualisiert: ${updatedDriverStages}`);

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
  const hostname = String(window.location.hostname || '').toLowerCase();
  const isLocalDev = hostname === 'localhost' || hostname === '127.0.0.1';
  if (isNative || isLocalDev) {
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
  renderCommunityTrackInsight(byId('trackSelect')?.value || byId('strategyTrackSelect')?.value || '');
  renderCommunityTrackInsight(byId('builderTrackSelect')?.value || byId('trackSelect')?.value || '', 'communityBuilderInsight');
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
  applyGuestModeUi();

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
  setupNeonButtonPalette();
  applyActiveSubnavByPath();
  registerServiceWorker();
  await detectSeason();
  ensureAllClashReferenceKnowledgeUpToDate();

  const hasOptimizerUi = hasUi('trackSelect', 'strategyTrackSelect', 'trackRadarChart', 'strategyChart');
  const isOptimizerPage = isOptimizerPageContext();
  const hasGarageUi = hasUi('partsInventory', 'garageInventory');
  const hasPaddockUi = hasUi('driversStandardList', 'ocrFile');
  const hasDashboardUi = hasUi('partsTableBody', 'partsCount', 'comboCount');
  const hasSyncUi = hasUi('f1SyncMethod', 'f1SyncResult', 'communityKnowledgeInput');
  const hasDriverCompareUi = hasUi('driverASelect', 'driverBSelect');
  const hasCalcUi = hasUi('setupAInputs', 'setupBInputs', 'teamScoreInputs', 'calcInputs');

  if ((hasOptimizerUi || hasCalcUi) && !window.__f1TrackRestoreBound) {
    window.__f1TrackRestoreBound = true;
    const reapply = () => {
      deferUiTask(() => {
        applyStoredTrackSelection();
        updateSelectedTrackBadge();
      }, 0);
    };
    window.addEventListener('pageshow', reapply);
    window.addEventListener('focus', reapply);
  }

  if (hasOptimizerUi || hasCalcUi) {
    fillTrackSelects();
    applyStoredTrackSelection();
    initTrackSelectionLauncher();
    initCustomTrackSelect();

    if (hasOptimizerUi || hasCalcUi) {
      deferUiTask(() => {
        applyStoredTrackSelection();
        updateSelectedTrackBadge();
      }, 0);
    }
  }
  if (hasDriverCompareUi) fillDriverSelects();
  if (byId('setupAInputs')) renderStatInputs('setupAInputs', 'a');
  if (byId('setupBInputs')) renderStatInputs('setupBInputs', 'b');
  if (byId('teamScoreInputs')) renderStatInputs('teamScoreInputs', 'team');
  if (byId('calcInputs')) renderStatInputs('calcInputs', 'calc');

  if (hasGarageUi) {
    deferUiTask(() => {
      buildInventory();
      setupDropSlots();
      renderManualSlots();
      updateKpis();
    }, 40);
  }

  if (hasPaddockUi) {
    deferUiTask(() => {
      buildDriverInventory();
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

  if (hasUi('leaderboardList', 'leaderboardResult')) {
    deferUiTask(() => loadLeaderboard(), 80);
  }

  if (hasUi('personalSuggestions', 'notificationLog')) {
    deferUiTask(() => initPersonalPage(), 50);
  }

  addListener('refreshPersonalSuggestionsButton', 'click', buildPersonalSuggestions);
  addListener('enableNotificationsButton', 'click', enablePushNotifications);
  addListener('notifyRaceButton', 'click', sendRacePush);
  addListener('notifyPitButton', 'click', schedulePitPush);
  addListener('compareFriendButton', 'click', compareFriend);

  addListener('trackAnalysisButton', 'click', renderTrackRadar);
  addListener('allChartsButton', 'click', renderAllTrackCharts);
  addListener('trackSelect', 'change', () => { updateSelectedTrackBadge(); renderTrackRadar(); renderCommunityTrackInsight(byId('trackSelect')?.value || ''); optimizeSelectedTrack(); });
  addListener('builderTrackSelect', 'change', () => {
    setResult('builderResult', '');
    renderCommunityTrackInsight(byId('builderTrackSelect')?.value || '', 'communityBuilderInsight');
  });
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
  addListener('refreshLeaderboardButton', 'click', loadLeaderboard);
  addListener('analyzePerformanceButton', 'click', analyzePerformance);
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
  renderCommunityTrackInsight(byId('trackSelect')?.value || byId('strategyTrackSelect')?.value || '');
  renderCommunityTrackInsight(byId('builderTrackSelect')?.value || byId('trackSelect')?.value || '', 'communityBuilderInsight');

  if (isOptimizerPage && shouldAutoRunHeavyTasks()) {
    deferUiTask(() => optimizeSelectedTrack(), 120);
  }
}

init();
