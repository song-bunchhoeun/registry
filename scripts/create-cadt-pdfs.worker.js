import path from 'path'
import fs from 'fs/promises'
import { createCADTCertCanvas } from "../lib/create-cadt-cert-canvas.js"
import { registerFonts } from "../lib/shared.js"
import { getData } from '@govtechsg/open-attestation';
import PDFDocument from 'pdfkit';


registerFonts();

const domain = 'verifykh.com';

export default async function ({ file }) {
  console.log(`[load] ${file}`);

  const wrappedDocument = JSON.parse(await fs.readFile(file))
  const data = getData(wrappedDocument);
  const filename = path.parse(file).name;
  const targetHash = wrappedDocument.signature.targetHash
  const qrcode = `https://${domain}/verify/${targetHash}?key=${filename}`;

  const canvas = await createCADTCertCanvas(data, qrcode, {
    disablBeackground: false,
    overrideTemplateFile: "certificate-cadt-no-frame.png"
  });

  const imageBuffer = canvas.toBuffer('image/png');
  const outputFile = path.join("scripts", "cadt-outputs", path.parse(file).name + ".pdf")
  const buffer = await createPdfBuffer(imageBuffer);
  await fs.writeFile(outputFile, buffer)

  console.log(`[write] ${outputFile}`);
}

async function createPdfBuffer(imageBuffer) {
  return new Promise((resolve) => {
    const buffers = [];

    const doc = new PDFDocument({
      margin: 0,
      size: [841.89, 595.28]
    });

    doc.on('data', buffers.push.bind(buffers))
    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    })

    doc.image(imageBuffer, {
      align: 'center',
      valign: 'center',
      cover: [
        doc.page.width,
        doc.page.height,
      ]
    });

    doc.end()
  })
}