import fs from 'node:fs/promises'
import utif from 'utif'
import { createCanvas } from '@napi-rs/canvas';

const canvas = createCanvas(512, 512);
const ctx = canvas.getContext("2d");

ctx.fillStyle = "red";
ctx.fillRect(0, 0, canvas.width,  canvas.height);

ctx.font = "72px, sans-serif";
ctx.fillStyle = "#fff";
ctx.fillText("Hello, TIFF!!!", 0, 100);

const buffer = canvas.data();
const tiffBuffer = utif.encodeImage(buffer, canvas.width, canvas.height);

// await fs.writeFile("scripts/image.tiff", Buffer.from(tiffBuffer));