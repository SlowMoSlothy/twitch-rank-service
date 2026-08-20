const RANKS = [
  { hours: 1800, name: '5. Dan (Großmeister)' },
  { hours: 1000, name: '4. Dan (Hoher Meister)' },
  { hours: 600, name: '3. Dan (Meister)' },
  { hours: 350, name: '2. Dan (Veteran)' },
  { hours: 200, name: '1. Dan (Kämpfer)' },
  { hours: 135, name: '1st Kyū (Meisterschüler)' },
  { hours: 100, name: '2nd Kyū (Veteranschüler)' },
  { hours: 70, name: '3rd Kyū (Adept)' },
  { hours: 45, name: '4th Kyū (Fortgeschrittener)' },
  { hours: 25, name: '5th Kyū (Schüler)' },
  { hours: 10, name: '6th Kyū (Novize)' },
  { hours: 0, name: 'Unranked' },
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

function sendText(res, statusCode, text) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(text);
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendText(res, 405, 'Only GET is supported.');
  }

  const user = clean(req.query?.user, 'Viewer');
  const watchtime = clean(req.query?.watchtime);
  const points = clean(req.query?.points, '0');
  const hours = parseWatchtime(watchtime);

  if (hours === null) {
    return sendText(res, 200, `${user} [⚪ Unranked] – Watchtime: ${watchtime || '0 secs'} – Zeuros: ${points}`);
  }

  const output = `${user} [${rankFor(hours)}] – Watchtime: ${watchtime} – Zeuros: ${points}`;
  return sendText(res, 200, output.slice(0, 380));
}

export { parseWatchtime, rankFor };
