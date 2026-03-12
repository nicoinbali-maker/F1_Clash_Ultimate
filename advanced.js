(() => {
  const PROFILE_LIST_KEY = 'f1clashProfiles';
  const ACTIVE_PROFILE_KEY = 'f1clashActiveClashId';
  const TEAM_STATE_KEY = 'f1clashTeamState';
  const LEADERBOARD_KEY = 'f1clashGlobalLeaderboard';
  const PART_META_PREFIX = 'partMeta_';
  const partNameSet = new Set((typeof partCatalog !== 'undefined' ? partCatalog : []).map((part) => part.name));

  let positionChart = null;

  const EXTRA_PART_NAMES = {
    engine: ['Ares Unit', 'Turbo Ghost', 'Helios V10', 'Nova Pulse', 'Atomic Core', 'Viper Heat', 'Saber-X', 'Titan Flux', 'Monarch Drive', 'Hyperion', 'Quasar-9', 'Ignis Prime'],
    front_wing: ['Phantom Aero', 'Lynx Wing', 'Skyline F', 'Crest FW', 'Horizon Blade', 'Atlas Wing', 'Ion Splitter', 'Aurora FW', 'Nimbus Front', 'Razor Flux', 'Delta Arc', 'Falcon Pro'],
    rear_wing: ['Hawk Tail', 'Shadow RW', 'Aero Spine', 'Helix Tail', 'Sierra RW', 'Apex Tail', 'Vanta RW', 'Meteor Tail', 'Pulse Tail', 'Ridge RW', 'Zen Tail', 'Cobalt RW'],
    gearbox: ['Prism Gear', 'Torque Pulse', 'Matrix Box', 'Falcon Shift', 'Rapid Mesh', 'Neon Gear', 'Orion Box', 'Core Shift', 'Halo Gear', 'Spectrum Box', 'Xeno Shift', 'Striker GB'],
    suspension: ['Nova Link', 'Grip Matrix', 'Titan Flex', 'Steady Arc', 'Hydro Rail', 'Pulse Link', 'Zen Flex', 'Aero Spring', 'Magna S', 'Tri Axis', 'Storm Link', 'Ion Suspension'],
    brakes: ['Crimson Stop', 'Iron Clamp', 'Rapid Brake', 'Aero Brake', 'Vortex Stop', 'Hydra Brake', 'Pulse Clamp', 'Delta Stop', 'Steel Bite', 'Meteor Brake', 'Shadow Stop', 'Prime Brake']
  };

  const EXTRA_DRIVERS = [
    { name: 'Bearman', pace: 79, qualifying: 80, tyre: 78, overtaking: 79, consistency: 77 },
    { name: 'Antonelli', pace: 82, qualifying: 83, tyre: 79, overtaking: 80, consistency: 80 },
    { name: 'Doohan', pace: 76, qualifying: 77, tyre: 75, overtaking: 74, consistency: 76 },
    { name: 'Lawson', pace: 80, qualifying: 81, tyre: 78, overtaking: 80, consistency: 79 },
    { name: 'Colapinto', pace: 78, qualifying: 79, tyre: 77, overtaking: 77, consistency: 78 },
    { name: 'Mick Schumacher', pace: 77, qualifying: 78, tyre: 76, overtaking: 75, consistency: 77 },
    { name: 'Pourchaire', pace: 79, qualifying: 81, tyre: 77, overtaking: 76, consistency: 78 },
    { name: 'Drugovich', pace: 78, qualifying: 79, tyre: 78, overtaking: 76, consistency: 79 },
    { name: 'Palou', pace: 83, qualifying: 82, tyre: 84, overtaking: 81, consistency: 84 },
    { name: 'Vesti', pace: 77, qualifying: 78, tyre: 76, overtaking: 75, consistency: 77 },
    { name: 'Hadjar', pace: 79, qualifying: 80, tyre: 77, overtaking: 78, consistency: 78 },
    { name: 'Bortoleto', pace: 80, qualifying: 81, tyre: 78, overtaking: 79, consistency: 79 }
  ];

  function byId(id) {
    return document.getElementById(id);
  }

  function parseJson(key, fallback) {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function activeProfile() {
    if (typeof loadRegistrationProfile === 'function') return loadRegistrationProfile();
    return null;
  }

  function activeProfileId() {
    const profile = activeProfile();
    return profile?.clashId || localStorage.getItem(ACTIVE_PROFILE_KEY) || 'guest';
  }

  function ownedKeyFor(clashId) {
    return `ownedParts_${clashId}`;
  }

  function partMetaKeyFor(clashId) {
    return `${PART_META_PREFIX}${clashId}`;
  }

  function clampLocal(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function hashString(input) {
    let h = 2166136261;
    for (let i = 0; i < input.length; i += 1) {
      h ^= input.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    return Math.abs(h >>> 0);
  }

  function getProfiles() {
    const list = parseJson(PROFILE_LIST_KEY, []);
    if (!Array.isArray(list)) return [];
    return list.filter((p) => p && p.clashId && p.firstName && p.lastName);
  }

  function ensureProfileRegistry() {
    const profile = activeProfile();
    let list = getProfiles();

    if (profile) {
      const existingIndex = list.findIndex((entry) => entry.clashId === profile.clashId);
      if (existingIndex >= 0) list[existingIndex] = { ...list[existingIndex], ...profile };
      else list.push({ ...profile });
      localStorage.setItem(ACTIVE_PROFILE_KEY, profile.clashId);
      localStorage.setItem('f1clashRegistration', JSON.stringify(profile));
    }

    if (list.length) writeJson(PROFILE_LIST_KEY, list);
  }

  function ensurePartSchema() {
    partCatalog.forEach((part, idx) => {
      if (typeof part.wear !== 'number') {
        part.wear = Math.round((part.tempo + part.kurven + part.antrieb) / 12 + (idx % 6));
      }
      if (!part.dbId) part.dbId = `${part.category}_${part.name.replace(/\s+/g, '_').toLowerCase()}`;
      if (!part.rarity) part.rarity = idx % 3 === 0 ? 'epic' : 'rare';
      if (!part.levelCap || part.levelCap > 12) part.levelCap = 12;
      partNameSet.add(part.name);
    });
  }

  function createExtraPart(category, name, idx) {
    const existing = partCatalog.filter((part) => part.category === category);
    const base = existing.length ? existing[Math.floor(idx % existing.length)] : { tempo: 20, kurven: 20, antrieb: 20, quali: 20, drs: 20, wear: 20 };
    const growth = idx + existing.length;
    return {
      name,
      category,
      tempo: Math.round(base.tempo + (growth % 5) * 2 + Math.floor(growth / 6)),
      kurven: Math.round(base.kurven + ((growth + 1) % 5) * 2),
      antrieb: Math.round(base.antrieb + ((growth + 2) % 4) * 2),
      quali: Math.round(base.quali + ((growth + 3) % 6)),
      drs: Math.round(base.drs + ((growth + 4) % 5)),
      wear: Math.round((base.wear || 22) + (growth % 4) * 2 + 3),
      rarity: growth % 2 ? 'epic' : 'rare',
      levelCap: 12,
      dbId: `${category}_${name.replace(/\s+/g, '_').toLowerCase()}`
    };
  }

  function expandPartCatalogTo100Plus() {
    const existingNames = new Set(partCatalog.map((part) => part.name));

    PART_CATEGORIES.forEach((category) => {
      const names = EXTRA_PART_NAMES[category] || [];
      names.forEach((name, idx) => {
        if (existingNames.has(name)) return;
        const part = createExtraPart(category, name, idx);
        partCatalog.push(part);
        partNameSet.add(part.name);
        existingNames.add(name);
      });
    });
  }

  function expandDriversDb() {
    const existing = new Set(driversDb.map((driver) => driver.name));
    EXTRA_DRIVERS.forEach((driver) => {
      if (!existing.has(driver.name)) {
        driversDb.push(driver);
        existing.add(driver.name);
      }
    });
  }

  function exposeDatabase() {
    window.appDb = {
      parts: partCatalog,
      drivers: driversDb,
      tracks: tracksDb
    };
  }

  function overrideProfileScopedStorage() {
    const clashId = activeProfileId();
    const newOwnedKey = ownedKeyFor(clashId);

    const genericOwned = parseJson('ownedParts', null);
    if (Array.isArray(genericOwned) && !localStorage.getItem(newOwnedKey)) {
      writeJson(newOwnedKey, genericOwned);
    }

    manualKey = function manualKeyScoped() {
      return `manualSetup_${currentSeason}_${activeProfileId()}`;
    };

    loadOwnedParts = function loadOwnedPartsScoped() {
      const raw = parseJson(ownedKeyFor(activeProfileId()), null);
      if (!Array.isArray(raw) || !raw.length) return partCatalog.map((part) => part.name);
      return raw.filter((name) => partNameSet.has(name));
    };

    saveOwnedParts = function saveOwnedPartsScoped() {
      const unique = Array.from(new Set(ownedParts));
      writeJson(ownedKeyFor(activeProfileId()), unique);
    };

    ownedParts = loadOwnedParts();
  }

  function effectivePart(part, metaMap) {
    const meta = metaMap[part.name] || {};
    const lvl = Number(meta.level || 1);
    const mod = Number(meta.mod || 0);
    const levelBoost = 1 + (lvl - 1) * 0.017;
    const modBoost = 1 + mod * 0.01;
    const boost = levelBoost * modBoost;

    return {
      ...part,
      tempo: part.tempo * boost,
      kurven: part.kurven * boost,
      antrieb: part.antrieb * boost,
      quali: part.quali * boost,
      drs: part.drs * boost,
      wear: (part.wear || 0) * (1 + mod * 0.006)
    };
  }

  function optimizeTrackAdvanced(trackName, useReducedPool) {
    const weights = trackWeights[trackName];
    const track = getTrack(trackName);
    const metaMap = parseJson(partMetaKeyFor(activeProfileId()), {});

    const byCategory = (category) => partCatalog
      .filter((part) => part.category === category && ownedParts.includes(part.name))
      .map((part) => ({ raw: part, eff: effectivePart(part, metaMap) }));

    let pools = {
      engine: byCategory('engine'),
      front_wing: byCategory('front_wing'),
      rear_wing: byCategory('rear_wing'),
      gearbox: byCategory('gearbox'),
      suspension: byCategory('suspension'),
      brakes: byCategory('brakes')
    };

    if (Object.values(pools).some((arr) => !arr.length)) {
      return { comboCount: 0, testedCount: 0, best: null, top: [], ms: 0 };
    }

    const rankPart = (item) => scoreStats(item.eff, weights) + (item.eff.wear || 0) * track.wear * 0.06;

    if (useReducedPool || Object.values(pools).reduce((acc, arr) => acc * arr.length, 1) > 1500000) {
      const topN = 14;
      Object.keys(pools).forEach((category) => {
        pools[category] = [...pools[category]].sort((a, b) => rankPart(b) - rankPart(a)).slice(0, topN);
      });
    }

    const comboCount = Object.values(pools).reduce((acc, arr) => acc * arr.length, 1);
    const exactLimit = 1500000;
    const sampleTarget = Math.min(exactLimit, Math.max(300000, comboCount));
    const doExact = comboCount <= exactLimit;

    const t0 = performance.now();
    let best = null;
    const top = [];

    const evaluate = (picked) => {
      const partsRaw = picked.map((item) => item.raw);
      const stats = picked.reduce((acc, item) => {
        acc.tempo += item.eff.tempo;
        acc.kurven += item.eff.kurven;
        acc.antrieb += item.eff.antrieb;
        acc.quali += item.eff.quali;
        acc.drs += item.eff.drs;
        acc.wear += item.eff.wear || 0;
        return acc;
      }, { tempo: 0, kurven: 0, antrieb: 0, quali: 0, drs: 0, wear: 0 });

      const communityBonus = typeof window.getCommunityPartBonus === 'function'
        ? Number(window.getCommunityPartBonus(trackName, partsRaw) || 0)
        : 0;
      const score = scoreStats(stats, weights) + synergyBonus(partsRaw) + stats.wear * track.wear * 0.045 + communityBonus;
      const item = { parts: partsRaw, stats, score, communityBonus };

      if (!best || score > best.score) best = item;
      top.push(item);
      top.sort((a, b) => b.score - a.score);
      if (top.length > 5) top.pop();
    };

    if (doExact) {
      for (const e of pools.engine) {
        for (const f of pools.front_wing) {
          for (const r of pools.rear_wing) {
            for (const g of pools.gearbox) {
              for (const s of pools.suspension) {
                for (const b of pools.brakes) {
                  evaluate([e, f, r, g, s, b]);
                }
              }
            }
          }
        }
      }
    } else {
      let seed = hashString(`${trackName}_${activeProfileId()}_${comboCount}`);
      const draw = (max) => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed % max;
      };

      for (let i = 0; i < sampleTarget; i += 1) {
        evaluate([
          pools.engine[draw(pools.engine.length)],
          pools.front_wing[draw(pools.front_wing.length)],
          pools.rear_wing[draw(pools.rear_wing.length)],
          pools.gearbox[draw(pools.gearbox.length)],
          pools.suspension[draw(pools.suspension.length)],
          pools.brakes[draw(pools.brakes.length)]
        ]);
      }
    }

    const testedCount = doExact ? comboCount : sampleTarget;
    return { comboCount, testedCount, best, top, ms: performance.now() - t0 };
  }

  function recommendedStrategy(trackName) {
    const track = getTrack(trackName);
    const plans = strategyPlans(track);
    const context = getSimulationContext(trackName);
    const all = compareStrategyOptions(track, plans, context);
    return all[0]?.label || '-';
  }

  function optimizeSelectedTrackAdvanced() {
    const track = byId('trackSelect').value;
    const result = optimizeTrack(track, false);

    if (!result.best) {
      setResult('optimizerResult', 'Nicht genug Teile im Inventar fuer Optimierung.', 'error');
      updateKpis(0);
      return;
    }

    const bestNames = result.best.parts.map((part) => part.name).join(' + ');
    const topText = result.top
      .map((row, index) => `${index + 1}. ${row.parts.map((part) => part.name).join(' + ')} (${row.score.toFixed(2)})`)
      .join('\n');

    const strategyLabel = recommendedStrategy(track);
    const projectedTeam = scoreStats(result.best.stats, trackWeights[track]) + (result.best.stats.wear || 0) * 0.08;

    setResult(
      'optimizerResult',
      `${track} bestes Setup:\n${bestNames}\nScore ${result.best.score.toFixed(2)} | Kombis ${result.comboCount.toLocaleString('de-DE')} | Getestet ${result.testedCount.toLocaleString('de-DE')} | Laufzeit ${result.ms.toFixed(1)}ms\nEmpfohlene Strategie: ${strategyLabel} | Teamscore-Prognose: ${projectedTeam.toFixed(2)} (${teamClass(projectedTeam)})\nTop 5:\n${topText}`
    );

    updateKpis(result.comboCount);
  }

  function parseLineMeta(line) {
    const levelMatch = line.match(/(?:lvl|level|lv)\s*[:#-]?\s*(\d{1,2})/i);
    const modMatch = line.match(/(?:mod|mods?)\s*[:#-]?\s*([+\-]?\d{1,2})/i);
    return {
      level: levelMatch ? Number(levelMatch[1]) : null,
      mod: modMatch ? Number(modMatch[1]) : null
    };
  }

  async function runOcrAdvanced() {
    const file = byId('ocrFile')?.files?.[0];
    if (!file) {
      setResult('ocrResult', 'Bitte erst ein Bild auswaehlen.', 'error');
      return;
    }

    const out = byId('ocrResult');
    out.textContent = 'OCR laeuft...';

    try {
      const { data } = await Tesseract.recognize(file, 'eng', {
        logger: (msg) => {
          if (msg.status === 'recognizing text') out.textContent = `OCR laeuft... ${Math.round(msg.progress * 100)}%`;
        }
      });

      const text = data.text || '';
      const textLower = text.toLowerCase();
      const lines = text.split(/\r?\n/);

      const detected = [];
      const metaMap = parseJson(partMetaKeyFor(activeProfileId()), {});

      partCatalog.forEach((part) => {
        const lowerName = part.name.toLowerCase();
        if (!textLower.includes(lowerName)) return;

        detected.push(part.name);

        const line = lines.find((ln) => ln.toLowerCase().includes(lowerName)) || '';
        const parsed = parseLineMeta(line);
        const previous = metaMap[part.name] || {};

        metaMap[part.name] = {
          level: Math.max(1, Math.min(12, parsed.level ?? previous.level ?? 1)),
          mod: parsed.mod ?? previous.mod ?? 0,
          updatedAt: new Date().toISOString()
        };

        if (!ownedParts.includes(part.name)) ownedParts.push(part.name);
      });

      if (!detected.length) {
        setResult('ocrResult', 'Keine bekannten Teile erkannt.', 'error');
        return;
      }

      writeJson(partMetaKeyFor(activeProfileId()), metaMap);
      saveOwnedParts();
      buildInventory();
      updateKpis();

      const preview = detected
        .slice(0, 8)
        .map((name) => {
          const m = metaMap[name] || {};
          return `${name} (Lv ${m.level || 1}, Mod ${m.mod || 0})`;
        })
        .join(', ');

      setResult('ocrResult', `Erkannt: ${detected.length} Teile fuer Profil ${activeProfileId()}. Vorschau: ${preview}`);
    } catch (error) {
      setResult('ocrResult', `OCR-Fehler: ${error.message}`, 'error');
    }
  }

  function cumulativeWithPit(sim) {
    const lap = [...sim.lapTimes];
    (sim.pitEvents || []).forEach((event) => {
      const idx = Math.max(0, event.lap - 1);
      lap[idx] += event.loss;
    });

    const cumulative = [];
    let total = 0;
    lap.forEach((value) => {
      total += value;
      cumulative.push(total);
    });
    return cumulative;
  }

  function aiNames(count) {
    const base = driversDb.map((d) => d.name);
    const names = [];
    for (let i = 0; i < count; i += 1) {
      names.push(base[i % base.length] + ` AI-${i + 1}`);
    }
    return names;
  }

  function runRaceSimulationAdvanced() {
    const calc = runStrategyCalculation();
    const playerSim = simulateStrategy(calc.track, calc.selected.plan, true, calc.context);

    const opponents = [];
    const names = aiNames(8);
    const plans = strategyPlans(calc.track);
    const planKeys = Object.keys(plans);

    for (let i = 0; i < 8; i += 1) {
      const key = planKeys[i % planKeys.length];
      const context = {
        ...calc.context,
        setupModifier: calc.context.setupModifier + (Math.random() * 0.5 - 0.25),
        driverModifier: calc.context.driverModifier + (Math.random() * 0.4 - 0.2),
        chaos: clampLocal(calc.context.chaos * (0.85 + Math.random() * 0.35), 0.3, 2)
      };
      const sim = simulateStrategy(calc.track, plans[key], true, context);
      opponents.push({ name: names[i], key, sim, cumulative: cumulativeWithPit(sim) });
    }

    const playerCum = cumulativeWithPit(playerSim);
    const positions = playerCum.map((time, lapIdx) => 1 + opponents.filter((op) => op.cumulative[lapIdx] < time).length);

    const pitData = playerSim.lapTimes.map((lapTime, idx) => (playerSim.pitLaps.includes(idx + 1) ? lapTime : null));
    const strategyPoints = positions.map((pos, idx) => {
      const pitPenalty = playerSim.pitLaps.includes(idx + 1) ? 8 : 0;
      return clampLocal(100 - (playerSim.wearCurve[idx] || 0) * 0.45 - pos * 2 - pitPenalty, 5, 100);
    });
    const mobile = Math.max(window.innerWidth || 0, document.documentElement?.clientWidth || 0, 360) <= 760;

    if (raceChart) raceChart.destroy();
    raceChart = new Chart(byId('raceChart'), {
      type: 'line',
      data: {
        labels: playerSim.lapTimes.map((_, idx) => `R${idx + 1}`),
        datasets: [
          { label: 'Rundenzeit (s)', data: playerSim.lapTimes, borderColor: '#ffdd00', tension: 0.2, pointRadius: 0, yAxisID: 'yLap' },
          { label: 'Tyre Wear (%)', data: playerSim.wearCurve, borderColor: '#00ffcc', tension: 0.2, pointRadius: 0, yAxisID: 'yWear' },
          { label: 'Strategiepunkte', data: strategyPoints, borderColor: '#8aa2ff', tension: 0.2, pointRadius: 0, yAxisID: 'yPoints' },
          { label: 'Pit Lap', data: pitData, borderColor: '#ff5570', backgroundColor: '#ff5570', showLine: false, pointRadius: 4, yAxisID: 'yLap' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#f0faff',
              font: { size: scaledChartFont(mobile ? 10 : 11, 9), weight: '600' },
              padding: mobile ? 8 : 14,
              boxWidth: mobile ? 12 : 18
            }
          }
        },
        scales: {
          x: { ticks: { color: '#c8e6f7', font: { size: scaledChartFont(mobile ? 9 : 10, 8), weight: '600' }, autoSkip: true, maxTicksLimit: mobile ? 8 : 12, maxRotation: 0 }, grid: { color: 'rgba(121,233,255,0.07)' } },
          yLap: { type: 'linear', position: 'left', ticks: { color: '#c8e6f7', font: { size: scaledChartFont(mobile ? 9 : 10, 8), weight: '600' }, maxTicksLimit: mobile ? 6 : 9 }, title: { display: true, text: 'Lap Time (s)', color: '#79e9ff', font: { size: scaledChartFont(mobile ? 10 : 11, 9), weight: '700' } } },
          yWear: { type: 'linear', position: 'right', min: 0, max: 100, ticks: { color: '#5effd2', font: { size: scaledChartFont(mobile ? 9 : 10, 8), weight: '600' }, maxTicksLimit: mobile ? 5 : 6 }, grid: { drawOnChartArea: false }, title: { display: true, text: 'Wear %', color: '#5effd2', font: { size: scaledChartFont(mobile ? 10 : 11, 9), weight: '700' } } },
          yPoints: { type: 'linear', position: 'right', min: 0, max: 100, ticks: { display: false }, grid: { drawOnChartArea: false }, title: { display: false } }
        }
      }
    });

    if (typeof window.setStrategyChartPopupData === 'function') {
      window.setStrategyChartPopupData('raceChart', {
        title: `Rennsimulation ${calc.track.name}`,
        subtitle: `Strategie ${calc.selected?.label || 'Auto'} gegen 8 KI-Gegner`,
        columns: ['Runde', 'Rundenzeit (s)', 'Wear %', 'Strategiepunkte', 'Pit'],
        rows: playerSim.lapTimes.map((lapTime, idx) => [
          idx + 1,
          lapTime,
          playerSim.wearCurve[idx],
          strategyPoints[idx],
          playerSim.pitLaps.includes(idx + 1) ? 'Ja' : '-'
        ])
      });
    }

    const positionNode = byId('positionChart');
    if (positionNode) {
      if (positionChart) positionChart.destroy();
      positionChart = new Chart(positionNode, {
        type: 'line',
        data: {
          labels: positions.map((_, idx) => `R${idx + 1}`),
          datasets: [{ label: 'Position vs KI', data: positions, borderColor: '#ff7b00', tension: 0.16, pointRadius: 0 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#f0faff',
                font: { size: scaledChartFont(mobile ? 10 : 11, 9), weight: '600' },
                padding: mobile ? 8 : 14,
                boxWidth: mobile ? 12 : 18
              }
            }
          },
          scales: {
            y: { reverse: true, min: 1, max: opponents.length + 1, ticks: { color: '#c8e6f7', stepSize: 1, font: { size: scaledChartFont(mobile ? 9 : 10, 8), weight: '600' }, maxTicksLimit: mobile ? 6 : 10 }, title: { display: true, text: 'Position', color: '#79e9ff', font: { size: scaledChartFont(mobile ? 10 : 11, 9), weight: '700' } } },
            x: { ticks: { color: '#c8e6f7', font: { size: scaledChartFont(mobile ? 9 : 10, 8), weight: '600' }, autoSkip: true, maxTicksLimit: mobile ? 8 : 12, maxRotation: 0 }, grid: { color: 'rgba(121,233,255,0.07)' } }
          }
        }
      });

      if (typeof window.setStrategyChartPopupData === 'function') {
        window.setStrategyChartPopupData('positionChart', {
          title: `Positionsverlauf ${calc.track.name}`,
          subtitle: 'Position pro Runde im Vergleich zum KI-Feld',
          columns: ['Runde', 'Position'],
          rows: positions.map((position, idx) => [idx + 1, position])
        });
      }
    }

    const finalPos = positions[positions.length - 1];
    const avgPoints = strategyPoints.reduce((a, b) => a + b, 0) / strategyPoints.length;
    const aiSummary = opponents
      .map((op) => ({ name: op.name, total: op.sim.total }))
      .sort((a, b) => a.total - b.total)
      .slice(0, 3)
      .map((entry, idx) => `${idx + 1}. ${entry.name} ${entry.total.toFixed(1)}s`)
      .join('\n');

    localStorage.setItem(`lastRace_${activeProfileId()}`, JSON.stringify({
      track: calc.track.name,
      total: playerSim.total,
      finalPosition: finalPos,
      strategyPoints: avgPoints,
      strategyLabel: calc.selected?.label || 'Auto',
      pitEvents: playerSim.pitEvents || [],
      pitLaps: playerSim.pitLaps || [],
      laps: calc.track.laps,
      updatedAt: new Date().toISOString()
    }));

    setResult('raceResult', `${calc.track.name}: Finale Position ${finalPos}/${opponents.length + 1} | Gesamtzeit ${playerSim.total.toFixed(1)}s | Strategiepunkte avg ${avgPoints.toFixed(1)}\nTop KI:\n${aiSummary}`);
  }

  function defaultTeamState() {
    return { name: 'Neon Clan', members: [] };
  }

  function loadTeamState() {
    const raw = parseJson(TEAM_STATE_KEY, defaultTeamState());
    if (!raw || typeof raw !== 'object') return defaultTeamState();
    raw.members = Array.isArray(raw.members) ? raw.members : [];
    raw.name = raw.name || 'Neon Clan';
    return raw;
  }

  function saveTeamState(state) {
    writeJson(TEAM_STATE_KEY, state);
  }

  function populateMemberSelect(state) {
    const select = byId('teamMemberSelect');
    if (!select) return;

    const profiles = getProfiles();
    select.innerHTML = '';

    if (!profiles.length) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'Keine Profile registriert';
      select.appendChild(option);
      return;
    }

    profiles.forEach((profile) => {
      if (state.members.includes(profile.clashId)) return;
      const option = document.createElement('option');
      option.value = profile.clashId;
      option.textContent = `${profile.firstName} ${profile.lastName} (${profile.clashId})`;
      select.appendChild(option);
    });

    if (!select.options.length) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'Alle Profile im Team';
      select.appendChild(option);
    }
  }

  function profileById(clashId) {
    return getProfiles().find((profile) => profile.clashId === clashId) || null;
  }

  function ownedCountForProfile(clashId) {
    const owned = parseJson(ownedKeyFor(clashId), []);
    return Array.isArray(owned) ? owned.length : 0;
  }

  function estimatedMetricsForProfile(profile, trackName) {
    const ownedCount = ownedCountForProfile(profile.clashId);
    const race = parseJson(`lastRace_${profile.clashId}`, null);

    let setupEfficiency = 120 + ownedCount * 0.35 + (hashString(profile.clashId) % 22);
    if (profile.clashId === activeProfileId()) {
      const opt = optimizeTrack(trackName, true);
      if (opt.best) setupEfficiency = opt.best.score;
    }

    const gpScore = race ? Math.max(0, 220 - race.total * 0.02 - race.finalPosition * 6) : 80 + (hashString(profile.firstName) % 40);
    const teamScore = setupEfficiency * 0.55 + gpScore * 0.45;

    return {
      ownedCount,
      setupEfficiency,
      gpScore,
      teamScore,
      race
    };
  }

  function renderTeam(state) {
    const trackName = byId('trackSelect')?.value || tracksDb[0].name;
    const membersView = byId('teamMembersView');

    const lines = state.members.map((clashId, idx) => {
      const profile = profileById(clashId);
      if (!profile) return `${idx + 1}. ${clashId} (Profil fehlt)`;
      const metrics = estimatedMetricsForProfile(profile, trackName);
      return `${idx + 1}. ${profile.firstName} ${profile.lastName} [${profile.clashId}] | Owned ${metrics.ownedCount} | Eff ${metrics.setupEfficiency.toFixed(1)} | GP ${metrics.gpScore.toFixed(1)}`;
    });

    membersView.textContent = lines.length ? lines.join('\n') : 'Noch keine Mitglieder im Team.';

    if (!state.members.length) {
      setResult('teamResult', 'Team ist leer. Fuege mindestens ein Profil hinzu.', 'error');
      return;
    }

    const scores = state.members
      .map((clashId) => {
        const profile = profileById(clashId);
        if (!profile) return null;
        return estimatedMetricsForProfile(profile, trackName).teamScore;
      })
      .filter((v) => typeof v === 'number');

    const avgScore = scores.reduce((a, b) => a + b, 0) / Math.max(1, scores.length);
    const strategy = recommendedStrategy(trackName);
    setResult('teamResult', `Team ${state.name}: Mitglieder ${scores.length} | Teamscore ${avgScore.toFixed(2)} | Empfohlene Team-Strategie: ${strategy}`);
  }

  function exportTeamCloud(state) {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      team: state,
      profiles: getProfiles()
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `f1clash_team_${state.name.replace(/\s+/g, '_')}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  async function importTeamCloud(file) {
    if (!file) return;

    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || !parsed.team) throw new Error('Ungueltige Teamdatei');

      const existingProfiles = getProfiles();
      const merged = [...existingProfiles];
      (Array.isArray(parsed.profiles) ? parsed.profiles : []).forEach((profile) => {
        if (!profile?.clashId) return;
        const idx = merged.findIndex((entry) => entry.clashId === profile.clashId);
        if (idx >= 0) merged[idx] = { ...merged[idx], ...profile };
        else merged.push(profile);
      });

      writeJson(PROFILE_LIST_KEY, merged);
      saveTeamState(parsed.team);
      setResult('teamResult', 'Team-Cloud-Import erfolgreich.');
      initializeTeamDashboard();
    } catch (error) {
      setResult('teamResult', `Cloud-Import fehlgeschlagen: ${error.message}`, 'error');
    }
  }

  function initializeTeamDashboard() {
    const teamNameInput = byId('teamNameInput');
    const addButton = byId('teamAddMemberButton');
    const saveButton = byId('teamSaveButton');
    const loadButton = byId('teamLoadButton');
    const exportButton = byId('teamExportButton');
    const importButton = byId('teamImportButton');
    const importFile = byId('teamImportFile');

    if (!teamNameInput || !addButton || !saveButton || !loadButton || !exportButton || !importButton || !importFile) return;

    const state = loadTeamState();
    teamNameInput.value = state.name;
    populateMemberSelect(state);
    renderTeam(state);
    if (typeof populateFriendCompareSelect === 'function') populateFriendCompareSelect();

    addButton.onclick = () => {
      const select = byId('teamMemberSelect');
      const clashId = select?.value || '';
      if (!clashId) return;
      if (!state.members.includes(clashId)) state.members.push(clashId);
      populateMemberSelect(state);
      renderTeam(state);
      if (typeof populateFriendCompareSelect === 'function') populateFriendCompareSelect();
    };

    saveButton.onclick = () => {
      state.name = String(teamNameInput.value || 'Neon Clan').trim() || 'Neon Clan';
      saveTeamState(state);
      renderTeam(state);
      if (typeof populateFriendCompareSelect === 'function') populateFriendCompareSelect();
      setResult('teamResult', `Team ${state.name} gespeichert.`);
    };

    loadButton.onclick = () => {
      const loaded = loadTeamState();
      state.name = loaded.name;
      state.members = loaded.members;
      teamNameInput.value = state.name;
      populateMemberSelect(state);
      renderTeam(state);
      if (typeof populateFriendCompareSelect === 'function') populateFriendCompareSelect();
      setResult('teamResult', `Team ${state.name} geladen.`);
    };

    exportButton.onclick = () => exportTeamCloud(state);
    importButton.onclick = () => importFile.click();
    importFile.onchange = async (event) => {
      const file = event.target.files?.[0];
      await importTeamCloud(file);
      event.target.value = '';
    };
  }

  function buildLeaderboard() {
    const trackName = byId('trackSelect')?.value || tracksDb[0].name;
    const profiles = getProfiles();

    const entries = profiles.map((profile) => {
      const metrics = estimatedMetricsForProfile(profile, trackName);
      return {
        type: 'player',
        name: `${profile.firstName} ${profile.lastName}`,
        clashId: profile.clashId,
        teamScore: metrics.teamScore,
        gp: metrics.gpScore,
        efficiency: metrics.setupEfficiency,
        rankScore: metrics.teamScore * 0.45 + metrics.gpScore * 0.3 + metrics.setupEfficiency * 0.25
      };
    });

    for (let i = 0; i < 20; i += 1) {
      const seed = hashString(`ai_${i}_${trackName}`);
      const teamScore = 130 + (seed % 90);
      const gp = 85 + (seed % 70);
      const efficiency = 120 + (seed % 80);
      entries.push({
        type: 'ai',
        name: `AI Rival ${i + 1}`,
        clashId: `AI-${i + 1}`,
        teamScore,
        gp,
        efficiency,
        rankScore: teamScore * 0.45 + gp * 0.3 + efficiency * 0.25
      });
    }

    entries.sort((a, b) => b.rankScore - a.rankScore);
    writeJson(LEADERBOARD_KEY, entries);
    return entries;
  }

  function renderLeaderboard(entries) {
    const header = 'Rang | Name                 | TeamScore | GP      | Effizienz';
    const lines = entries.slice(0, 15).map((entry, idx) => {
      const rank = String(idx + 1).padStart(2, '0');
      const name = entry.name.slice(0, 20).padEnd(20, ' ');
      const team = entry.teamScore.toFixed(1).padStart(8, ' ');
      const gp = entry.gp.toFixed(1).padStart(7, ' ');
      const eff = entry.efficiency.toFixed(1).padStart(9, ' ');
      return `${rank}   | ${name} | ${team} | ${gp} | ${eff}`;
    });

    setResult('leaderboardResult', `${header}\n${lines.join('\n')}`);
  }

  function runAiAnalysis(entries) {
    const profile = activeProfile();
    if (!profile) {
      setResult('aiAnalysisResult', 'Keine aktive Registrierung gefunden.', 'error');
      return;
    }

    const profileEntry = entries.find((entry) => entry.clashId === profile.clashId);
    const rank = profileEntry ? entries.findIndex((entry) => entry.clashId === profile.clashId) + 1 : null;
    const ownedCount = ownedCountForProfile(profile.clashId);
    const lastRace = parseJson(`lastRace_${profile.clashId}`, null);

    const tips = [];
    if (ownedCount < 100) tips.push(`Inventar ausbauen: aktuell ${ownedCount} Teile erkannt. OCR-Scan fuer weitere Teile nutzen.`);
    if (profileEntry && profileEntry.efficiency < 165) tips.push('Setup-Effizienz steigern: Optimizer nach jedem OCR-Scan fuer die aktuelle Strecke laufen lassen.');
    if (lastRace && lastRace.finalPosition > 4) tips.push(`Rennstrategie verbessern: letzte Position ${lastRace.finalPosition}. Mehr Sim-Runs und niedrigere Volatilitaet testen.`);
    if (!lastRace) tips.push('Noch keine Live-GP-Daten fuer dieses Profil. Ein Rennen simulieren fuer praezise KI-Analyse.');
    if (rank && rank > 10) tips.push(`Leaderboard Push: aktuell Rang ${rank}. Fokus auf Reifenmanagement und Teamscore.`);
    if (!tips.length) tips.push('Sehr starkes Profil. Feinschliff: Team-Sync und regelmaessige Strategie-Updates pro Strecke.');

    const summary = [
      `Profil: ${profile.firstName} ${profile.lastName} (${profile.clashId})`,
      rank ? `Globaler Rang (lokale Simulation): ${rank}` : 'Kein Leaderboard-Eintrag vorhanden.',
      `Analyse: ${tips.join(' ')}`
    ].join('\n');

    setResult('aiAnalysisResult', summary);
  }

  function initializeLeaderboardDashboard() {
    const refreshButton = byId('refreshLeaderboardButton');
    const analyzeButton = byId('analyzePerformanceButton');
    if (!refreshButton || !analyzeButton) return;

    refreshButton.onclick = () => {
      const entries = buildLeaderboard();
      renderLeaderboard(entries);
      setResult('teamResult', 'Leaderboard aktualisiert.');
    };

    analyzeButton.onclick = () => {
      const entries = parseJson(LEADERBOARD_KEY, []);
      const source = entries.length ? entries : buildLeaderboard();
      renderLeaderboard(source);
      runAiAnalysis(source);
    };

    const entries = buildLeaderboard();
    renderLeaderboard(entries);
    runAiAnalysis(entries);
  }

  function notificationsSupported() {
    return typeof Notification !== 'undefined';
  }

  function notificationsEnabled() {
    return localStorage.getItem('f1clashNotifyEnabled') === '1';
  }

  function setNotificationStatus(text, kind = 'info') {
    setResult('notificationStatusResult', text, kind);
  }

  async function enablePushNotifications() {
    if (!notificationsSupported()) {
      setNotificationStatus('Dieser Browser unterstuetzt keine Notifications.', 'error');
      return false;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      localStorage.setItem('f1clashNotifyEnabled', '0');
      setNotificationStatus('Push-Benachrichtigungen nicht erlaubt.', 'error');
      return false;
    }

    localStorage.setItem('f1clashNotifyEnabled', '1');
    setNotificationStatus('Push-Benachrichtigungen aktiviert.');
    return true;
  }

  async function showLocalNotification(title, body, tag) {
    if (!notificationsSupported()) return false;
    if (!notificationsEnabled()) return false;
    if (Notification.permission !== 'granted') return false;

    try {
      if (navigator.serviceWorker?.ready) {
        const reg = await navigator.serviceWorker.ready;
        await reg.showNotification(title, {
          body,
          tag,
          icon: 'assets/ferrari2000_candyred_192.png',
          badge: 'assets/ferrari2000_candyred_192.png'
        });
      } else {
        new Notification(title, { body, tag });
      }
      return true;
    } catch {
      return false;
    }
  }

  async function triggerRaceNotification() {
    if (!notificationsEnabled()) {
      setNotificationStatus('Push ist noch nicht aktiviert. Erst "Push aktivieren" klicken.', 'error');
      return;
    }

    const profile = activeProfile();
    const track = byId('trackSelect')?.value || tracksDb[0].name;
    const who = profile ? `${profile.firstName} ${profile.lastName}` : 'Driver';
    const sent = await showLocalNotification('F1 Clash Race Alert', `${who}: Rennen auf ${track} starten.`, `race_${Date.now()}`);

    if (sent) setNotificationStatus(`Rennen-Benachrichtigung fuer ${track} gesendet.`);
    else setNotificationStatus('Rennen-Benachrichtigung konnte nicht gesendet werden.', 'error');
  }

  async function schedulePitNotificationsFromLastRace() {
    if (!notificationsEnabled()) {
      setNotificationStatus('Push ist noch nicht aktiviert. Erst "Push aktivieren" klicken.', 'error');
      return;
    }

    const race = parseJson(`lastRace_${activeProfileId()}`, null);
    if (!race || !Array.isArray(race.pitEvents) || !race.pitEvents.length) {
      setNotificationStatus('Keine Boxenstopp-Daten vorhanden. Bitte zuerst ein Rennen simulieren.', 'error');
      return;
    }

    race.pitEvents.forEach((event, idx) => {
      const delayMs = 1800 + idx * 2200;
      setTimeout(() => {
        showLocalNotification(
          'F1 Clash Boxenstopp Alert',
          `${race.track}: Boxenfenster rund um Runde ${event.lap} (${event.nextTyre || 'naechster Stint'}).`,
          `pit_${race.track}_${event.lap}_${idx}`
        );
      }, delayMs);
    });

    setNotificationStatus(`Boxenstopp-Benachrichtigungen geplant (${race.pitEvents.length} Alerts).`);
  }

  function buildPersonalSuggestions() {
    const profile = activeProfile();
    if (!profile) return 'Kein aktives Profil vorhanden.';

    const trackName = byId('trackSelect')?.value || tracksDb[0].name;
    const metrics = estimatedMetricsForProfile(profile, trackName);
    const opt = optimizeTrack(trackName, true);
    const bestScore = opt?.best?.score || metrics.setupEfficiency;

    const track = getTrack(trackName);
    const plans = strategyPlans(track);
    const context = getSimulationContext(trackName);
    const strategies = compareStrategyOptions(track, plans, context);
    const bestStrategy = strategies[0];

    const lastRace = parseJson(`lastRace_${profile.clashId}`, null);
    const team = loadTeamState();

    const tips = [];
    if (metrics.ownedCount < 110) {
      tips.push(`Inventar verbessern: ${metrics.ownedCount} Teile erkannt. OCR-Scans fuer Event-Setup nachziehen.`);
    }
    if (bestScore - metrics.setupEfficiency > 6) {
      tips.push(`Setup-Potenzial: +${(bestScore - metrics.setupEfficiency).toFixed(1)} Score auf ${trackName} durch Optimizer moeglich.`);
    }
    if (bestStrategy && bestStrategy.spread > 2.5) {
      tips.push(`Strategie-Risiko beachten: ${bestStrategy.label} hat Spread ${bestStrategy.spread.toFixed(2)}s. Fuer sichere Events ggf. Balanced testen.`);
    }
    if (lastRace && lastRace.finalPosition > 4) {
      tips.push(`Rennziel: letzte Position ${lastRace.finalPosition}. Fuer Top-3 frueheren Undercut und hoehere Sim-Runs nutzen.`);
    }
    if (!lastRace) {
      tips.push('Noch keine Live-GP-Daten. Ein Rennen simulieren, damit Event-Tipps praeziser werden.');
    }
    if ((team.members || []).length > 1) {
      tips.push(`Teamvergleich aktiv: ${team.members.length} Clan-Mitglieder verfuegbar. Freundesvergleich im Dashboard nutzen.`);
    }

    if (!tips.length) {
      tips.push('Sehr gute Basis. Fokus jetzt auf Event-Micro-Tuning (Reifenfenster + Quali-Tempo).');
    }

    return [
      `Profil: ${profile.firstName} ${profile.lastName} (${profile.clashId})`,
      `Strecke: ${trackName}`,
      `Empfohlene Strategie: ${bestStrategy ? bestStrategy.label : '-'}`,
      'Auto-Vorschlaege:',
      ...tips.map((tip, idx) => `${idx + 1}. ${tip}`)
    ].join('\n');
  }

  function refreshPersonalSuggestions() {
    setResult('personalSuggestionsResult', buildPersonalSuggestions());
  }

  function populateFriendCompareSelect() {
    const select = byId('friendCompareSelect');
    if (!select) return;

    const mine = activeProfileId();
    const profiles = getProfiles().filter((profile) => profile.clashId !== mine);

    select.innerHTML = '';
    if (!profiles.length) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'Keine Freunde/Clan-Mitglieder verfuegbar';
      select.appendChild(option);
      return;
    }

    profiles.forEach((profile) => {
      const option = document.createElement('option');
      option.value = profile.clashId;
      option.textContent = `${profile.firstName} ${profile.lastName} (${profile.clashId})`;
      select.appendChild(option);
    });
  }

  function compareWithFriend() {
    const select = byId('friendCompareSelect');
    const friendId = select?.value || '';
    if (!friendId) {
      setResult('friendCompareResult', 'Bitte zuerst einen Freund auswaehlen.', 'error');
      return;
    }

    const trackName = byId('trackSelect')?.value || tracksDb[0].name;
    const mine = activeProfile();
    const friend = profileById(friendId);
    if (!mine || !friend) {
      setResult('friendCompareResult', 'Vergleich nicht moeglich (Profil fehlt).', 'error');
      return;
    }

    const myM = estimatedMetricsForProfile(mine, trackName);
    const frM = estimatedMetricsForProfile(friend, trackName);

    const deltaScore = myM.teamScore - frM.teamScore;
    const deltaGp = myM.gpScore - frM.gpScore;
    const deltaEff = myM.setupEfficiency - frM.setupEfficiency;

    const leadText = deltaScore >= 0 ? `Du liegst +${deltaScore.toFixed(1)} vorne.` : `${friend.firstName} liegt +${Math.abs(deltaScore).toFixed(1)} vorne.`;

    const action = [];
    if (deltaEff < 0) action.push('Optimizer-Fokus: Setup-Effizienz verbessern.');
    if (deltaGp < 0) action.push('GP-Performance: mehr Live-Sims und Strategie-Feintuning.');
    if (deltaEff >= 0 && deltaGp >= 0) action.push('Starke Position. Fokus auf Event-Konsistenz halten.');

    setResult(
      'friendCompareResult',
      `${mine.firstName} vs ${friend.firstName} auf ${trackName}\n${leadText}\nTeamScore Delta: ${deltaScore.toFixed(1)} | GP Delta: ${deltaGp.toFixed(1)} | Effizienz Delta: ${deltaEff.toFixed(1)}\nEmpfehlung: ${action.join(' ')}`
    );
  }

  function initializePersonalDashboard() {
    const refreshBtn = byId('refreshPersonalSuggestionsButton');
    const enablePushBtn = byId('enableNotificationsButton');
    const racePushBtn = byId('notifyRaceButton');
    const pitPushBtn = byId('notifyPitButton');
    const compareBtn = byId('compareFriendButton');

    if (!refreshBtn || !enablePushBtn || !racePushBtn || !pitPushBtn || !compareBtn) return;

    refreshBtn.onclick = refreshPersonalSuggestions;
    enablePushBtn.onclick = enablePushNotifications;
    racePushBtn.onclick = triggerRaceNotification;
    pitPushBtn.onclick = schedulePitNotificationsFromLastRace;
    compareBtn.onclick = compareWithFriend;

    const trackSelect = byId('trackSelect');
    if (trackSelect) {
      trackSelect.addEventListener('change', () => {
        refreshPersonalSuggestions();
      });
    }

    populateFriendCompareSelect();
    refreshPersonalSuggestions();

    const hasNotify = notificationsSupported();
    const permission = hasNotify ? Notification.permission : 'unsupported';
    const notifState = hasNotify ? `Push-Status: ${permission}` : 'Push-Status: nicht unterstuetzt';
    setNotificationStatus(notifState, permission === 'granted' ? 'info' : 'error');
  }

  function replaceButtonHandler(id, handler) {
    const oldButton = byId(id);
    if (!oldButton || !oldButton.parentNode) return;
    const fresh = oldButton.cloneNode(true);
    oldButton.parentNode.replaceChild(fresh, oldButton);
    fresh.addEventListener('click', handler);
  }

  function initializeAdvancedFeatures() {
    ensureProfileRegistry();
    ensurePartSchema();
    expandPartCatalogTo100Plus();
    expandDriversDb();
    exposeDatabase();

    overrideProfileScopedStorage();
    fillDriverSelects();
    buildInventory();
    if (typeof buildDriverInventory === 'function') buildDriverInventory();
    updateKpis();

    optimizeTrack = optimizeTrackAdvanced;
    optimizeSelectedTrack = optimizeSelectedTrackAdvanced;

    replaceButtonHandler('optimizeButton', optimizeSelectedTrackAdvanced);
    replaceButtonHandler('ocrButton', runOcrAdvanced);
    replaceButtonHandler('raceSimButton', runRaceSimulationAdvanced);

    optimizeSelectedTrackAdvanced();
    runRaceSimulationAdvanced();

    initializeTeamDashboard();
    initializeLeaderboardDashboard();
    initializePersonalDashboard();
  }

  window.addEventListener('load', initializeAdvancedFeatures);
})();







