import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path'
import QRCode from 'qrcode';
import { createTemplateImage, drawText } from './shared.js'

export async function createCADTCertCanvas(
  document = {},
  qrcodeContent,
  renderOptions = {},
) {
  if (document == null) document = {};

  let templateFileName = "certificate-cadt-stamp.png"

  if (typeof renderOptions.overrideTemplateFile === 'string') {
    templateFileName = renderOptions.overrideTemplateFile;
  }
  const bg = await createTemplateImage(templateFileName);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext('2d');
  const colorCode = "#122A4A";
  if (!renderOptions.disableBackground) {
    ctx.drawImage(bg, 0, 0);
  }


  drawText(canvas, ctx, document.recipient.name, {
    y: 700,
    textColor: colorCode,
    align: "center",
    font: 'bold 50pt Niradei, Arial, sans-serif',
  })

  drawText(canvas, ctx, document.recipient.nameEn, {
    y: 790,
    textColor: colorCode,
    align: "center",
    font: 'bold 40pt Niradei, Arial, sans-serif',
  })

  drawText(canvas, ctx, `${document.certificate.examDate} ពិតប្រាកដមែន ។`,
    {
      y: 870,
      x: 1312,
      textColor: colorCode,
      align: "left",
      font: '31pt Niradei, Arial, sans-serif',
    })

  drawText(canvas, ctx, `${document.certificate.examDateEn}.`,
    {
      y: 920,
      x: 1607,
      textColor: colorCode,
      align: "left",
      font: '23pt Niradei, Arial, sans-serif',
    })

  drawText(canvas, ctx, document.certificate.signatureDate,
    {
      y: 1010,
      textColor: colorCode,
      align: "center",
      font: '25pt Niradei, Arial, sans-serif',
    })

  drawText(canvas, ctx, document.certificate.signatureDateEn,
    {
      y: 1056,
      textColor: colorCode,
      align: "center",
      font: '22pt Niradei, Arial, sans-serif',
    })
  if (qrcodeContent) {
    const qrcodeSize = 182;
    const gapSize = 0;
    const qrcodeBuffer = await QRCode.toBuffer(qrcodeContent, { margin: 0, width: qrcodeSize });
    const qrcodeImage = await loadImage(qrcodeBuffer);
    const qrcodeCoordinate = [429, 1258 + (qrcodeSize / 2)]

    ctx.drawImage(qrcodeImage, qrcodeCoordinate[0], qrcodeCoordinate[1]);

    const qrcodeLogoImage = await createQRCodeLogoImage();

    ctx.drawImage(
      qrcodeLogoImage,
      qrcodeCoordinate[0],
      qrcodeCoordinate[1] + qrcodeSize + gapSize,
      qrcodeSize,
      qrcodeSize / (qrcodeLogoImage.width / qrcodeLogoImage.height)
    )
  }

  return canvas;
}

export async function createQRCodeLogoImage() {
  const logoPath = path.join(
    process.cwd(),
    'assets',
    'certificate-bacii-qrcode-logo.png'
  )
  return loadImage(logoPath)
}


export function toUTF16(codePoint) {
  var TEN_BITS = parseInt('1111111111', 2);
  function u(codeUnit) {
      return '\\u'+codeUnit.toString(16).toUpperCase();
  }

  if (codePoint <= 0xFFFF) {
      return u(codePoint);
  }
  codePoint -= 0x10000;

  // Shift right to get to most significant 10 bits
  var leadSurrogate = 0xD800 + (codePoint >> 10);

  // Mask to get least significant 10 bits
  var tailSurrogate = 0xDC00 + (codePoint & TEN_BITS);

  return u(leadSurrogate) + u(tailSurrogate);
}