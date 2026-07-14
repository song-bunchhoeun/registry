import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createMPTCDataDrivenWorkCompletionCanvas(
  certificateInfo = {},
  qrcodeContent
) {
  const MPTC_TEXT_COLORS = {
    black: "#000000",
  };

  const MPTC_FONTS = {
    primary: "Rajdhani",
    secondary: "Google Sans",
  };
  const MPTC_TEMPLATE_IMAGE = "mptc-certificate-completion-v2.jpg";

  const MPTC_TEXTS = [
    {
      dataKeys: ["recipient.name"],
      text: "{recipient.name}",
      textSize: 188,
      textStyle: "bold",
      textColor: MPTC_TEXT_COLORS.black,
      y: 1214,
      align: "center",
      textFont: MPTC_FONTS.primary,
    },
    {
      dataKeys: [""],
      text: "Is hereby awarded for successfully completing the training on",
      textSize: 56,
      textStyle: "normal",
      textColor: MPTC_TEXT_COLORS.black,
      y: 1373,
      align: "center",
      textFont: MPTC_FONTS.secondary,
    },
    {
      dataKeys: ["certificate.program"],
      text: "{certificate.program}",
      textSize: 54,
      textStyle: "bold",
      textColor: MPTC_TEXT_COLORS.black,
      y: 1472,
      align: "center",
      textFont: MPTC_FONTS.secondary,
    },
    {
      dataKeys: ["certificate.date", "certificate.location"],
      text: "{certificate.date} at {certificate.location}.",
      textSize: 53,
      textStyle: "normal",
      textColor: MPTC_TEXT_COLORS.black,
      y: 1573,
      align: "center",
      textFont: MPTC_FONTS.secondary,
    },
    {
      dataKeys: ["certificate.signatureDate"],
      text: "{certificate.signatureDate}",
      textSize: 53,
      textStyle: "normal",
      textColor: MPTC_TEXT_COLORS.black,
      y: 1718,
      align: "center",
      textFont: MPTC_FONTS.secondary,
    },
  ];

  const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);
  // Draw Caption

  for (const text of MPTC_TEXTS) {
    if (text.dataKeys && text.dataKeys.length > 0) {
      for (const key of text.dataKeys)
        text.text = text.text.replace(
          `{${key}}`,
          _.get(certificateInfo, key, "")
        );
    }

    drawText(canvas, ctx, text.text, {
      x: text.x,
      y: text.y,
      textColor: text.textColor || MPTC_TEXT_COLORS.black,
      align: text.align,
      font: resolveFont(MPTC_FONTS.primary, 24, text),
    });
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 2877, 1805, 320);
  }
  return canvas;
}

export async function drawQrCodeStandard(
  qrcodeContent,
  ctx,
  x = 0,
  y = 0,
  width = 120
) {
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
  const logoPath = path.join(
    process.cwd(),
    "assets",
    "certificate-bacii-qrcode-logo.png"
  );
  return loadImage(logoPath);
}
function font(name = fontConfig.primary, size = 20) {
  return `${size}px ${name}, sans-serif`;
}
function fontBold(name = fontConfig.primary, size = 20) {
  return `bold ${size}px ${name}, sans-serif`;
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
