import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, drawWrapTexts } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createMPTCITCInternComplationCanvas(certificateInfo = {}, qrcodeContent) {
  const MPTC_TEXT_COLORS = {
    black: "#000000",
    blue: "#004282",
    red: "red",
  };

  const MPTC_FONTS = {
    primary: "Khmer OS Muol Light",
    secondary: "NiDA Sowannaphum",
    thirdly: "NiDA Funan",
    fouthly: "Leelawadee UI",
    fifthly: "Leelawadee UI Bold",
    sixly: "Google Sans",
  };

  const MPTC_TEMPLATE_IMAGE = "mptc-internship-completion-certificate.jpg";

  const MPTC_TEXTS = [
    {
      dataKeys: ["recipient.nameKm"],
      text: "{recipient.nameKm}",
      textSize: 62,
      textColor: MPTC_TEXT_COLORS.blue,
      y: 1814,
      align: "center",
      textFont: MPTC_FONTS.primary,
    },
    {
      dataKeys: ["recipient.name"],
      text: "{recipient.name}",
      textSize: 62,
      textColor: MPTC_TEXT_COLORS.blue,
      y: 2462,
      align: "center",
      textStyle: "bold",
      textFont: MPTC_FONTS.fouthly,
    },
    {
      dataKeys: ["recipient.position"],
      text: "{recipient.position}",
      textSize: 62,
      textColor: MPTC_TEXT_COLORS.black,
      y: 2570,
      align: "center",
      textStyle: "medium",
      strokeLine: 1,
      textFont: MPTC_FONTS.fouthly,
    },
    {
      dataKeys: ["certificate.date"],
      text: "{certificate.date}.",
      textSize: 61,
      textColor: "#000000",
      y: 2774,
      align: "center",
      textStyle: "medium",
      strokeLine: 1.5,
      textFont: MPTC_FONTS.sixly,
    },
    {
      dataKeys: ["certificate.dateKm"],
      text: "{certificate.dateKm} ប្រាកដមែន។",
      textSize: 62,
      textColor: "#000000",
      y: 2138,
      align: "center",
      textStyle: "medium",
      textFont: MPTC_FONTS.secondary,
    },
    {
      dataKeys: ["certificate.signatureLunarDateKm"],
      text: "{certificate.signatureLunarDateKm}",
      textSize: 62,
      textColor: "#000000",
      y: 2984,
      align: "center",
      textStyle: "medium",
      textFont: MPTC_FONTS.secondary,
    },
    {
      dataKeys: ["certificate.signatureDateKm"],
      text: "{certificate.signatureDateKm}",
      textSize: 62,
      textColor: "#000000",
      y: 3078,
      align: "center",
      textStyle: "medium",
      textFont: MPTC_FONTS.secondary,
    },
    {
      dataKeys: ["certificate.signatureDate"],
      text: "{certificate.signatureDate}",
      textSize: 62,
      textColor: "#000000",
      y: 3172,
      align: "center",
      textStyle: "medium",
      strokeLine: 1.5,
      textFont: MPTC_FONTS.sixly,
    },
  ];

  const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  const positionKmValue = _.get(certificateInfo, "recipient.positionKm", "");
  const segments = positionKmValue.match(/[\u1780-\u17FF]+|[a-zA-ZÀ-ÿ0-9\s]+/g) || [];
  const positionKmSpans = segments.map((seg) => ({
    text: seg,
    fontSize: 62,
    fontFamily: /[\u1780-\u17FF]/.test(seg) ? MPTC_FONTS.secondary : MPTC_FONTS.sixly,
    fillStyle: MPTC_TEXT_COLORS.black,
    fontWeight: "medium",
  }));

  drawWrapTexts(ctx, {
    top: 1930,
    left: 0,
    width: 3000,
    textAlignment: "center",
    lineHeight: 1,
    spans: positionKmSpans,
  }).draw();

  // Draw Caption
  for (const text of MPTC_TEXTS) {
    if (text.dataKeys && text.dataKeys.length > 0) {
      for (const key of text.dataKeys) text.text = text.text.replace(`{${key}}`, _.get(certificateInfo, key, ""));
    }

    drawText(canvas, ctx, text.text, {
      x: text.x,
      y: text.y,
      textColor: text.textColor || "#000000",
      align: text.align,
      font: resolveFont(MPTC_FONTS.primary, 24, text),
      strokeLine: text.strokeLine,
    });
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 2344, 3527, 325);
  }
  return canvas;
}

export async function drawQrCodeStandard(qrcodeContent, ctx, x = 0, y = 0, width = 120) {
  // ration: 120/148 of QR Standard
  const logoPath = path.join(process.cwd(), "assets", "qr-bg-v2.png");
  const qrcodeLogoImage = await loadImage(logoPath);
  const gapSize = (width * 10) / 120; //
  const qrcodeSize = width - gapSize * 2; // exclude margin x,y
  const height = (width * 148) / 120;
  ctx.drawImage(qrcodeLogoImage, x, y, width, height);
  const qrcodeBuffer = await QRCode.toBuffer(qrcodeContent, {
    margin: 0,
    width: qrcodeSize,
  });
  const qrcodeImage = await loadImage(qrcodeBuffer);
  ctx.drawImage(qrcodeImage, x + gapSize, y + gapSize);
}
export async function createQRCodeLogoImage() {
  const logoPath = path.join(process.cwd(), "assets", "certificate-bacii-qrcode-logo.png");
  return loadImage(logoPath);
}
// 'style size fontName' ex:'bold 20px Arial'
function resolveFont(defaultFont, defaultSize, text) {
  const space = " ";
  let font = "";
  const fontName = text.textFont ? text.textFont : defaultFont;

  font += text.textStyle ? text.textStyle + space : "";
  font += text.textSize ? text.textSize : defaultSize;
  font += "px" + space;
  font += fontName;

  return font;
}
