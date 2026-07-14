import path from 'path'
import fs from 'fs/promises'
import fg from 'fast-glob'
import { Piscina } from 'piscina';

const parentDir = path.join("scripts", "cadt-outputs");
await fs.mkdir(parentDir, { recursive: true });

const piscina = new Piscina({
  filename: new URL("./create-cadt-pdfs.worker.js", import.meta.url).href
})

let totalCount = 0;
for await (const file of fg.stream("./scripts/cadt-documents/*.json")) {
  piscina.run({ file })
  totalCount++;
}

console.log(`total discovered ${totalCount} files`)