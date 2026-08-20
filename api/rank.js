const RANKS = [
  { hours: 1000, name: '👑 Legende' },
  { hours: 600, name: '🔥 Elite' },
  { hours: 350, name: '🔴 Großmeister' },
  { hours: 200, name: '🟣 Meister' },
  { hours: 100, name: '💎 Diamant' },
  { hours: 50, name: '💠 Platin' },
  { hours: 25, name: '🟡 Gold' },
  { hours: 10, name: '⚪ Silber' },
  { hours: 5, name: '🟤 Bronze' },
  { hours: 0, name: '⚪ Unranked' },
];

const UNIT_HOURS = {
  sec: 1 / 3600, secs: 1 / 3600, second: 1 / 3600, seconds: 1 / 3600,
  min: 1 / 60, mins: 1 / 60, minute: 1 / 60, minutes: 1 / 60,
  hour: 1, hours: 1,
  day: 24, days: 24,
  week: 168, weeks: 168,
  month: 730, months: 730,
  year: 8760, years: 8760,
};

function parseWatchtime(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const text = value.trim().toLowerCase();
  let hours = 0;
  let matched = false;
  const regex = /(\d+(?:[.,]\d+)?)\s*(secs?|seconds?|mins?|minutes?|hours?|days?|weeks?|months?|years?)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const amount = Number(match[1].replace(',', '.'));
    const factor = UNIT_HOURS[match[2]];
    if (Number.isFinite(amount) && factor !== undefined) {
      hours += amount * factor;
      matched = true;
    }
  }
  return matched ? hours : null;
}

function rankFor(hours) {
  return RANKS.find((rank) => hours >= rank.hours).name;
}

function clean(value, fallback = '') {
  return String(value ?? fallback).replace(/[\r\n]/g, ' ').trim();
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).type('text/plain').send('Only GET is supported.');
  }

  const user = clean(req.query.user, 'Viewer');
  const watchtime = clean(req.query.watchtime);
  const points = clean(req.query.points, '0');
  const hours = parseWatchtime(watchtime);

  if (hours === null) {
    return res.status(200).type('text/plain; charset=utf-8').send(`${user} [⚪ Unranked] – Watchtime: ${watchtime || '0 secs'} – Schokies: ${points}`);
  }

  const output = `${user} [${rankFor(hours)}] – Watchtime: ${watchtime} – Schokies: ${points}`;
  return res.status(200).type('text/plain; charset=utf-8').send(output.slice(0, 380));
}

export { parseWatchtime, rankFor };
