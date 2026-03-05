import { readFileSync } from "fs";

const buf = readFileSync("src/app/pages/overview-page.tsx");

// Find the title= on line 72
const text = buf.toString("utf-8");
const idx = text.indexOf('title="', 70 * 80); // approximate byte offset for line 72
const snippet = text.substring(idx, idx + 120);
console.log("Snippet:", JSON.stringify(snippet));

// Show the Unicode code points
for (const ch of snippet.slice(7, 50)) {
  console.log(`  U+${ch.codePointAt(0).toString(16).padStart(4, "0")} = ${ch}`);
}

// Try: take code points, map to bytes (assuming they represent Latin-1 byte values), decode as UTF-8
const mojibake = text.match(/title="([^"]+)"/)?.[1] ?? "";
console.log("\nMojibake title:", JSON.stringify(mojibake));
console.log("Code points:", [...mojibake].map(c => "U+" + c.codePointAt(0).toString(16).padStart(4, "0")).join(" "));

// Attempt 1: chars -> latin1 bytes -> utf8 decode
try {
  const latin1Bytes = Buffer.from(mojibake, "latin1");
  console.log("Latin1 bytes hex:", latin1Bytes.toString("hex"));
  const decoded1 = latin1Bytes.toString("utf-8");
  console.log("Attempt 1 (latin1->utf8):", decoded1);
} catch(e) { console.log("Attempt 1 failed:", e.message); }

// Attempt 2: double decode - chars are UTF-8 of chars that are Latin-1 of original UTF-8
try {
  const utf8Bytes = Buffer.from(mojibake, "utf-8");
  console.log("UTF8 bytes hex:", utf8Bytes.toString("hex").substring(0, 80));
  // interpret those bytes as latin1 to get intermediate string
  const intermediate = utf8Bytes.toString("latin1");
  console.log("Intermediate:", JSON.stringify(intermediate.substring(0, 40)));
  // then encode THAT as latin1 bytes and decode as utf8
  const step2Bytes = Buffer.from(intermediate, "latin1");
  const decoded2 = step2Bytes.toString("utf-8");
  console.log("Attempt 2 (utf8->latin1->utf8):", decoded2);
} catch(e) { console.log("Attempt 2 failed:", e.message); }
