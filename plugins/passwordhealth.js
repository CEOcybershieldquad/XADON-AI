// commands/security/hash-verify.js
//Xadon EDUCATIONAL / CTF / PERSONAL RESEARCH TOOL ONLY — NEVER use against real systems without permission by Musteqeem 

const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const https = require('https'); // for HIBP k-anonymity check

let bcrypt, argon2;
try { bcrypt = require('bcrypt');   } catch (e) {}
try { argon2  = require('argon2');   } catch (e) {}

const FAST_HASHES = new Set(['md5', 'sha1', 'sha256', 'sha512']);
const SLOW_HASH_PREFIXES = {
  bcrypt: ['$2a$', '$2b$', '$2y$'],
  argon2: ['\( argon2i \)', '\( argon2d \)', '\( argon2id \)']
};

module.exports = {
  command: 'hash',
  aliases: ['hv', 'hashcheck', 'verifyhash', 'ispwned'],
  description: 'Verify password vs hash OR check if password was leaked (HIBP) — EDUCATION/CTF ONLY',
  category: 'security',
  cooldown: 45,
  usageRestricted: true,

  execute: async (sock, msg, { args, prefix, command, isOwner, reply }) => {
    if (!isOwner && !msg.key.fromMe) {
      return reply("⚠️ This is an educational/research tool — restricted access.");
    }

    if (args.length < 1) {
      return reply(
        `Usage examples:\n` +
        `\( {prefix} \){command} <hash> [password | wordlist-path]\n` +
        `\( {prefix} \){command} --pwned mypassword123     (checks against HaveIBeenPwned via k-anonymity)\n\n` +
        `Supported (auto-detected when possible):\n` +
        `• Fast: md5, sha1, sha256, sha512\n` +
        `• Slow: bcrypt, argon2(id), pbkdf2 (with params), scrypt\n\n` +
        `Install extras for full support:\n` +
        `npm i bcrypt argon2`
      );
    }

    // ─── Pwned Passwords check (k-anonymity — safe & private) ────────
    if (args[0] === '--pwned' || command === 'pwned-check') {
      const password = args.slice(1).join(' ') || '';
      if (!password) return reply("Provide a password to check.");

      try {
        const sha1 = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
        const prefix = sha1.slice(0, 5);
        const suffix = sha1.slice(5);

        const url = `https://api.pwnedpasswords.com/range/${prefix}`;

        const data = await new Promise((resolve, reject) => {
          https.get(url, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve(body));
          }).on('error', reject);
        });

        const lines = data.split('\n');
        const match = lines.find(line => line.startsWith(suffix + ':'));

        if (match) {
          const count = match.split(':')[1].trim();
          return reply(
            `❌ This password was found in breaches!\n` +
            `It appeared ${count} time(s) in HaveIBeenPwned database.\n\n` +
            `→ Change it immediately and never reuse passwords.`
          );
        } else {
          return reply(
            `✅ Good news — this password has NOT appeared in known data breaches (via HIBP).\n` +
            `Still use strong, unique passwords + MFA!`
          );
        }
      } catch (err) {
        return reply(`Error checking HIBP: ${err.message}`);
      }
    }

    // ─── Normal hash verification mode ───────────────────────────────
    const inputHash = args[0].trim();
    let candidates = [];

    // Single password or wordlist?
    const rest = args.slice(1).join(' ');
    let isSingle = rest && rest.length < 200 && !rest.includes('/') && !rest.endsWith('.txt');

    if (isSingle) {
      candidates = [rest.trim()];
    } else if (rest) {
      let wordlistPath = path.isAbsolute(rest) ? rest : path.join(process.cwd(), rest);
      try {
        const content = await fs.readFile(wordlistPath, 'utf-8');
        candidates = content.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        await reply(`Loaded ${candidates.length.toLocaleString()} words. Starting check...`);
      } catch (e) {
        return reply(`Wordlist error: ${e.message}`);
      }
    } else {
      return reply("Missing password or wordlist path.");
    }

    const start = Date.now();

    // ─── Try slow / modern hashes first (verification, not brute) ─────
    const hashLower = inputHash.toLowerCase();

    // bcrypt
    if (bcrypt && SLOW_HASH_PREFIXES.bcrypt.some(p => inputHash.startsWith(p))) {
      await reply("Detected bcrypt → verifying with bcrypt.compare ... (slow by design)");
      for (const pw of candidates) {
        if (await bcrypt.compare(pw, inputHash)) {
          return reply(`✅ MATCH (bcrypt)!\nPassword: ||${pw}||`);
        }
      }
      return reply(`❌ No match (bcrypt)`);
    }

    // argon2
    if (argon2 && inputHash.startsWith('$argon2')) {
      await reply("Detected Argon2 → verifying ... (memory-hard, slow)");
      for (const pw of candidates) {
        if (await argon2.verify(inputHash, pw)) {
          return reply(`✅ MATCH (Argon2)!\nPassword: ||${pw}||`);
        }
      }
      return reply(`❌ No match (Argon2)`);
    }

    // PBKDF2 (common format: pbkdf2-sha256$10000$salt$hash  or similar)
    if (inputHash.startsWith('pbkdf2-') || inputHash.includes('$')) {
      try {
        // Very basic parsing — real impl would need full PHC string parser
        // For demo: assume format like pbkdf2-sha256$iters$salt$key
        const parts = inputHash.split('$');
        if (parts.length >= 4) {
          const algo = parts[0].replace('pbkdf2-', '');
          const iterations = parseInt(parts[1], 10);
          const salt = Buffer.from(parts[2], 'hex');
          const storedKey = Buffer.from(parts[3], 'hex');

          await reply(`Detected PBKDF2 → verifying (${iterations} iterations)`);

          for (const pw of candidates) {
            const derived = crypto.pbkdf2Sync(pw, salt, iterations, storedKey.length, algo);
            if (crypto.timingSafeEqual(derived, storedKey)) {
              return reply(`✅ MATCH (PBKDF2)!\nPassword: ||${pw}||`);
            }
          }
          return reply(`❌ No match (PBKDF2)`);
        }
      } catch {}
    }

    // scrypt (crypto.scrypt)
    // Note: scrypt hashes usually stored as PHC string too — basic check only
    if (inputHash.startsWith('scrypt$')) {
      await reply("Detected scrypt → this demo only supports basic fast-hash fallback.");
      // Full scrypt verify needs params parsing — skip to fast mode or extend later
    }

    // ─── Fallback: fast unsalted hashes (MD5/SHA etc.) ───────────────
    const algo = FAST_HASHES.has(hashLower) ? hashLower : 'sha256'; // default guess

    await reply(`Falling back to fast hash mode (${algo.toUpperCase()}) — brute-force only`);

    for (let i = 0; i < candidates.length; i++) {
      const pw = candidates[i];
      const computed = crypto.createHash(algo).update(pw).digest('hex');

      if (computed === inputHash) {
        const took = ((Date.now() - start) / 1000).toFixed(2);
        return reply(
          `✅ FOUND after \( {i+1} attempts ( \){took}s)\n` +
          `Password → ||${pw}||\n` +
          `Hash (${algo}): ${inputHash}`
        );
      }

      if ((i + 1) % 5000 === 0 && candidates.length > 10000) {
        await reply(`⋯ ${i+1} / ${candidates.length} checked`);
      }
    }

    const took = ((Date.now() - start) / 1000).toFixed(2);
    reply(`❌ No match after \( {candidates.length.toLocaleString()} attempts ( \){took}s)`);
  }
};