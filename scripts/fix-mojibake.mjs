import { readFileSync, writeFileSync } from "fs";
import { argv } from "process";

const filePath = argv[2];
if (!filePath) { console.error("Usage: node fix-mojibake.mjs <file>"); process.exit(1); }

const content = readFileSync(filePath, "utf-8");

// Mojibake pattern: UTF-8 Thai bytes were misread as Latin-1 then re-encoded to UTF-8.
// To fix: encode back to Latin-1 (to recover original UTF-8 bytes), then decode as UTF-8.
// Thai mojibake chars fall in the range U+0E00..U+0E7F mixed with U+00C0..U+00FF and other Latin-1 chars.
// A simpler heuristic: find runs of Thai-like mojibake and try to decode them.

function fixMojibake(str) {
  // Match sequences that contain Thai Unicode chars (U+0E00-U+0E7F) that look like mojibake
  // Mojibake Thai produces sequences like เธ, เน, etc.
  const mojibakePattern = /[\u0e00-\u0e7f\u00c0-\u00ff\u2013\u2014\u2018\u2019\u201c\u201d\u2020\u2021\u2022\u2026\u2030\u2039\u203a\u20ac\u0152\u0153\u0160\u0161\u0178\u017d\u017e\u0192]{3,}/g;
  
  return str.replace(mojibakePattern, (match) => {
    try {
      // Convert each char to its code point, treat as Latin-1 byte value
      const bytes = [];
      for (const ch of match) {
        const cp = ch.codePointAt(0);
        if (cp <= 0xFF) {
          bytes.push(cp);
        } else if (cp >= 0x0E00 && cp <= 0x0E7F) {
          // Thai chars in mojibake - these come from 3-byte UTF-8 sequences
          // that were double-encoded. The UTF-8 encoding of U+0Exx is E0 B8/B9 xx
          // When misread as Latin-1: E0->à(U+00E0), B8->¸(U+00B8), xx->various
          // Then re-encoded to UTF-8: U+00E0->C3 A0, U+00B8->C2 B8, etc.
          // But what we see is Thai chars, meaning another layer happened.
          // Actually the pattern is: original UTF-8 bytes -> read as UTF-8 incorrectly 
          // producing Thai-range chars -> that IS the mojibake we see.
          // So these code points ARE the byte values of the intermediate encoding.
          
          // For Thai code points U+0E00-U+0E3F: UTF-8 is E0 B8 80-BF
          // For Thai code points U+0E40-U+0E7F: UTF-8 is E0 B9 80-BF
          // The mojibake we see IS these bytes interpreted as characters.
          // So we need the UTF-8 bytes of these Thai chars, then interpret THOSE as UTF-8 again.
          
          // Actually, let me think about this more carefully.
          // The file stores: C3 A0 C2 B8 C2 AA (for ส U+0E2A)
          // When read as UTF-8: U+00E0 U+00B8 U+00AA = à ¸ ª
          // But we're seeing เธช which is U+0E40 U+0E18 U+0E0A
          // That doesn't match. 
          
          // Wait - the read_file tool might be showing the raw bytes differently.
          // Let me just try: take the UTF-8 bytes of the mojibake string, 
          // then see if interpreting them as a different encoding works.
          
          // Encode this Thai char to UTF-8 bytes
          const encoded = new TextEncoder().encode(ch);
          for (const b of encoded) bytes.push(b);
        } else {
          // Other chars like smart quotes, euro sign, etc. from Windows-1252
          // Map them back to their Windows-1252 byte values
          const cp1252Map = {
            0x20AC: 0x80, 0x201A: 0x82, 0x0192: 0x83, 0x201E: 0x84, 0x2026: 0x85,
            0x2020: 0x86, 0x2021: 0x87, 0x02C6: 0x88, 0x2030: 0x89, 0x0160: 0x8A,
            0x2039: 0x8B, 0x0152: 0x8C, 0x017D: 0x8E, 0x2018: 0x91, 0x2019: 0x92,
            0x201C: 0x93, 0x201D: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
            0x02DC: 0x98, 0x2122: 0x99, 0x0161: 0x9A, 0x203A: 0x9B, 0x0153: 0x9C,
            0x017E: 0x9E, 0x0178: 0x9F,
          };
          if (cp1252Map[cp] !== undefined) {
            bytes.push(cp1252Map[cp]);
          } else {
            const encoded = new TextEncoder().encode(ch);
            for (const b of encoded) bytes.push(b);
          }
        }
      }
      
      // Now try to decode these bytes as UTF-8
      const decoded = new TextDecoder("utf-8", { fatal: true }).decode(new Uint8Array(bytes));
      
      // Check if result contains valid Thai characters
      if (/[\u0E01-\u0E7F]/.test(decoded)) {
        return decoded;
      }
      return match; // Return original if decode didn't produce Thai
    } catch {
      return match; // Return original on error
    }
  });
}

const fixed = fixMojibake(content);
const changesCount = [...content].filter((_, i) => content[i] !== fixed[i]).length;

if (content !== fixed) {
  writeFileSync(filePath, fixed, "utf-8");
  console.log(`Fixed mojibake in ${filePath}`);
} else {
  console.log(`No mojibake changes needed in ${filePath}`);
}
