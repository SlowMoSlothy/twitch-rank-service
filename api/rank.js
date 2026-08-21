const RANKS = [
  { hours: 1800, rank: '5. Dan', title: 'Großmeister' },
  { hours: 1000, rank: '4. Dan', title: 'Hoher Meister' },
  { hours: 600, rank: '3. Dan', title: 'Meister' },
  { hours: 350, rank: '2. Dan', title: 'Veteran' },
  { hours: 200, rank: '1. Dan', title: 'Kämpfer' },
  { hours: 135, rank: '1st Kyū', title: 'Meisterschüler' },
  { hours: 100, rank: '2nd Kyū', title: 'Veteranschüler' },
  { hours: 70, rank: '3rd Kyū', title: 'Adept' },
  { hours: 45, rank: '4th Kyū', title: 'Fortgeschrittener' },
  { hours: 25, rank: '5th Kyū', title: 'Schüler' },
  { hours: 10, rank: '6th Kyū', title: 'Novize' },
  { hours: 0, rank: 'Agōkai', title: 'Mitglied' },
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
  return RANKS.find((entry) => hours >= entry.hours);
}

function clean(value, fallback = '') {
  return String(value ?? fallback).replace(/[\r\n]/g, ' ').trim();
}

function sendText(res, statusCode, text) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(text);
}

function formatHours(hours) {
  return Math.floor(Math.max(0, hours));
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendText(res, 405, 'Only GET is supported.');
  }

  const watchtime = clean(req.query?.watchtime);
  const points = clean(req.query?.points, '0');
  const parsedHours = parseWatchtime(watchtime);
  const hours = parsedHours ?? 0;
  const rank = rankFor(hours);

  const output = `${rank.rank} (${rank.title}) – Im Training: ${formatHours(hours)} h – Punkte: ${points}`;
  return sendText(res, 200, output.slice(0, 380));
}

export { parseWatchtime, rankFor, formatHours };
