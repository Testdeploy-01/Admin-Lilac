import { readFileSync, writeFileSync } from "fs";
import { argv } from "process";

// Windows-874 special chars in 0x80-0x9F range that map to Unicode
const win874Special = {
  0x20AC: 0x80, // €
  0x2026: 0x85, // …
  0x2018: 0x91, // '
  0x2019: 0x92, // '
  0x201C: 0x93, // "
  0x201D: 0x94, // "
  0x2022: 0x95, // •
  0x2013: 0x96, // –
  0x2014: 0x97, // —
};

function unicodeToWin874Byte(cp) {
  // Thai range: U+0E01-U+0E3A and U+0E3F-U+0E5B → bytes 0xA1-0xDA and 0xDF-0xFB
  if (cp >= 0x0E01 && cp <= 0x0E5B) {
    return cp - 0x0D60;
  }
  // C1 control characters (undefined in Win-874, stored as raw code point)
  if (cp >= 0x0080 && cp <= 0x009F) {
    return cp;
  }
  // NBSP
  if (cp === 0x00A0) return 0xA0;
  // Windows-874 special mappings
  if (win874Special[cp] !== undefined) {
    return win874Special[cp];
  }
  return null; // not a Win-874 byte
}

function isMojibakeChar(cp) {
  return unicodeToWin874Byte(cp) !== null;
}

function fixMojibake(str) {
  let result = "";
  let i = 0;
  
  while (i < str.length) {
    const cp = str.codePointAt(i);
    
    // Check if this starts a mojibake sequence
    if (isMojibakeChar(cp)) {
      // Collect consecutive mojibake chars
      let mojibakeChars = [];
      let j = i;
      while (j < str.length) {
        const c = str.codePointAt(j);
        if (isMojibakeChar(c)) {
          mojibakeChars.push(c);
          j += c > 0xFFFF ? 2 : 1;
        } else {
          break;
        }
      }
      
      // Convert to bytes
      const bytes = mojibakeChars.map(c => unicodeToWin874Byte(c));
      
      // Try to decode as UTF-8
      try {
        const decoded = new TextDecoder("utf-8", { fatal: true }).decode(new Uint8Array(bytes));
        // Verify it contains Thai characters (not just garbage)
        if (/[\u0E01-\u0E7F]/.test(decoded) && decoded.length >= 1) {
          result += decoded;
          i = j;
          continue;
        }
      } catch {
        // Not valid UTF-8, keep original
      }
      
      // If decode failed, keep original character and advance
      result += str[i];
      i += cp > 0xFFFF ? 2 : 1;
    } else {
      result += str[i];
      i += cp > 0xFFFF ? 2 : 1;
    }
  }
  
  return result;
}

// Process all files passed as arguments
for (const filePath of argv.slice(2)) {
  const content = readFileSync(filePath, "utf-8");
  const fixed = fixMojibake(content);
  
  if (content !== fixed) {
    writeFileSync(filePath, fixed, "utf-8");
    console.log(`Fixed: ${filePath}`);
  } else {
    console.log(`No changes: ${filePath}`);
  }
}
