import { createHash, randomBytes } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync, renameSync, rmdirSync, unlinkSync } from 'node:fs';
import { setTimeout as pause } from 'node:timers/promises';
import { isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const campaigns = {
  d2c: 'daily_d2c_outreach',
  manufacturer: 'daily_manufacturer_outreach',
  foreign: 'foreign_clients_outreach',
};

export function campaignLink({ campaign, destination = 'https://growwstack.in/', content = 'initial_email', outreachId }) {
  const campaignName = Object.hasOwn(campaigns, campaign) ? campaigns[campaign] : Object.values(campaigns).find(value => value === campaign);
  if (!campaignName) throw new Error('Campaign must be d2c, manufacturer, or foreign.');
  const url = new URL(destination);
  if (url.origin !== 'https://growwstack.in' || url.username || url.password) throw new Error('Use the canonical https://growwstack.in destination.');
  if (!/^[a-z0-9_-]{1,60}$/.test(content)) throw new Error('Content must be a short lowercase template/stage label, never recipient data.');
  if (outreachId && !/^[A-Za-z0-9_-]{16,64}$/.test(outreachId)) throw new Error('Invalid opaque outreach ID.');
  // A destination is a page, never a pre-filled form or recipient URL.
  url.search = '';
  url.searchParams.set('utm_source', 'growwstack_outreach');
  url.searchParams.set('utm_medium', 'email');
  url.searchParams.set('utm_campaign', campaignName);
  url.searchParams.set('utm_id', campaignName);
  url.searchParams.set('utm_content', content);
  if (outreachId) url.searchParams.set('oid', outreachId);
  return url.toString();
}

export async function recipientLink({ campaign, recipient, company = '', ledger, destination, content }) {
  if (!ledger || !isAbsolute(ledger)) throw new Error('Supply an absolute private ledger directory outside the website repository.');
  const ledgerPath = resolve(ledger);
  const repository = resolve(fileURLToPath(new URL('..', import.meta.url)));
  if (ledgerPath.toLowerCase() === repository.toLowerCase() || ledgerPath.toLowerCase().startsWith(repository.toLowerCase() + '\\') || ledgerPath.toLowerCase().startsWith(repository.toLowerCase() + '/')) throw new Error('Recipient mapping must stay outside the website repository.');
  const normalizedRecipient = String(recipient || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedRecipient)) throw new Error('A verified recipient email is required.');
  const genericUrl = campaignLink({ campaign, destination, content });
  const campaignName = new URL(genericUrl).searchParams.get('utm_campaign');
  const lookup = createHash('sha256').update(`${campaignName}\n${normalizedRecipient}`).digest('hex');
  mkdirSync(ledgerPath, { recursive: true });
  const filename = join(ledgerPath, `${lookup}.json`);
  // Directory creation is atomic on Windows too; publish only a complete file.
  const lock = `${filename}.lock`;
  let acquired = false;
  for (let attempt = 0; attempt < 50; attempt++) {
    try { mkdirSync(lock); acquired = true; break; }
    catch (error) { if (error.code !== 'EEXIST') throw error; }
    await pause(100);
  }
  if (!acquired) throw new Error('Recipient mapping is locked by another run. Reconcile the active run before retrying.');
  const temporary = join(lock, 'record.tmp');
  try {
    if (!existsSync(filename)) {
      const record = {
        outreach_id: randomBytes(24).toString('base64url'), campaign: campaignName,
        recipient: normalizedRecipient, company: String(company).trim(), created_at: new Date().toISOString(),
      };
      record.tracking_url = campaignLink({ campaign, destination, content, outreachId: record.outreach_id });
      writeFileSync(temporary, JSON.stringify(record, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
      renameSync(temporary, filename);
    }
    const saved = JSON.parse(readFileSync(filename, 'utf8'));
    if (saved.campaign !== campaignName || saved.recipient !== normalizedRecipient || !/^[A-Za-z0-9_-]{16,64}$/.test(saved.outreach_id)) throw new Error('Existing private mapping failed validation; investigate without overwriting.');
    return { outreach_id: saved.outreach_id, tracking_url: campaignLink({ campaign, destination, content, outreachId: saved.outreach_id }) };
  } finally {
    if (existsSync(temporary)) unlinkSync(temporary);
    rmdirSync(lock);
  }
}

export function lookupRecipient({ outreachId, ledger }) {
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(outreachId || '') || !ledger || !isAbsolute(ledger)) throw new Error('Supply a valid opaque ID and absolute private ledger directory.');
  return import('node:fs').then(({ readdirSync }) => {
    if (!existsSync(ledger)) return null;
    for (const filename of readdirSync(ledger).filter(name => /^[a-f0-9]{64}\.json$/.test(name))) {
      const record = JSON.parse(readFileSync(join(ledger, filename), 'utf8'));
      if (record.outreach_id === outreachId) return record;
    }
    return null;
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    const options = {};
    for (let i = 0; i < args.length; i += 2) {
      if (!/^--(campaign|recipient|company|ledger|destination|content|lookup)$/.test(args[i]) || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error('Use --campaign d2c|manufacturer|foreign [--destination URL] [--content initial_email]; add --recipient EMAIL --company NAME --ledger PRIVATE_ABSOLUTE_DIRECTORY for a recipient link. Lookup: --lookup ID --ledger DIRECTORY.');
      options[args[i].slice(2)] = args[i + 1];
    }
    const output = options.lookup
      ? await lookupRecipient({ outreachId: options.lookup, ledger: options.ledger })
      : options.recipient ? await recipientLink(options) : { tracking_url: campaignLink(options) };
    process.stdout.write(JSON.stringify(output, null, 2) + '\n');
  } catch (error) { process.stderr.write(error.message + '\n'); process.exitCode = 1; }
}
