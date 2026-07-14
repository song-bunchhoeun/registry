import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, loadRemoteResource } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createMPTCGDABackCard(
  certificateInfo = {},
  qrcodeContent,
) {
  const MPTC_TEXT_COLORS = {
    black: "#004282",
    // black: "#f00000",
  };

  const MPTC_FONTS = {
    nidaSovannaPhum: "NiDA Sowannaphum",
    myriadPro: "Myriad Pro",
  };

  const MPTC_TEMPLATE_IMAGE = "mptc-teacher-digital-back-card.jpg";
  // const MPTC_TEMPLATE_IMAGE = "mptc-teacher-digital-back-card-sample.jpg";

  const MPTC_TEXTS = [
    {
      dataKeys: ["certificate.issuedLunaDateKm"],
      text: "{certificate.issuedLunaDateKm}",
      textSize: 50,
      textColor: MPTC_TEXT_COLORS.black,
      textFont: MPTC_FONTS.nidaSovannaPhum,
      x: 1240,
      y: 1683,
      align: "center",
      strokeLine: 1,
      strokeColor: MPTC_TEXT_COLORS.black,
    },
    {
      dataKeys: ["certificate.issuedDateKm"],
      text: "{certificate.issuedDateKm}",
      textSize: 50,
      textColor: MPTC_TEXT_COLORS.black,
      textFont: MPTC_FONTS.nidaSovannaPhum,
      x: 1240,
      y: 1783,
      align: "center",
      strokeLine: 1,
      strokeColor: MPTC_TEXT_COLORS.black,
    },
    {
      dataKeys: ["certificate.cardNumber"],
      text: "{certificate.cardNumber}",
      textSize: 56,
      textColor: MPTC_TEXT_COLORS.black,
      textFont: MPTC_FONTS.myriadPro,
      x: 558,
      y: 2287,
      align: "left",
      strokeLine: 1,
      strokeColor: MPTC_TEXT_COLORS.black,
    },
    {
      dataKeys: ["certificate.expiryDate"],
      text: "{certificate.expiryDate}",
      textSize: 56,
      textColor: MPTC_TEXT_COLORS.black,
      textFont: MPTC_FONTS.myriadPro,
      x: 745,
      y: 2375,
      align: "left",
      strokeLine: 1,
      strokeColor: MPTC_TEXT_COLORS.black,
    },
  ];

  const getTextMaxWidth = (ctx, textItem) => {
    ctx.font = resolveFont(textItem.textFont, 24, textItem);
    const kmTargetMatric = ctx.measureText(textItem.text);
    return kmTargetMatric;
  };

  const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  for (const text of MPTC_TEXTS) {
    if (text.dataKeys && text.dataKeys.length > 0) {
      for (const key of text.dataKeys)
        text.text = text.text.replace(
          `{${key}}`,
          _.get(certificateInfo, key, ""),
        );
    }

    drawText(canvas, ctx, text.text, {
      x: text.x,
      y: text.y,
      textColor: text.textColor || MPTC_TEXT_COLORS.black,
      align: text.align,
      font: resolveFont(MPTC_FONTS.primary, 24, text),
      strokeLine: text.strokeLine,
      strokeColor: text.strokeColor,
    });
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 627, 148, 684);
  }

  return canvas;
}

const drawTextItem = (canvas, ctx, textItem, FONTS, certificateInfo) => {
  if (textItem.dataKeys && textItem.dataKeys.length > 0) {
    for (const key of textItem.dataKeys)
      textItem.text = textItem.text.replace(
        `{${key}}`,
        _.get(certificateInfo, key, ""),
      );
  }

  drawText(canvas, ctx, textItem.text, {
    x: textItem.x,
    y: textItem.y,
    textColor: textItem.textColor || "#0033ff",
    align: textItem.align,
    font: resolveFont(FONTS[0].name, 24, textItem),
    strokeLine: textItem.strokeLine,
    strokeColor: textItem.textColor,
    textMaxWidth: textItem.textMaxWidth,
    textWidth: textItem.textWidth,
  });
};

export async function drawQrCodeStandard(
  qrcodeContent,
  ctx,
  x = 0,
  y = 0,
  width = 120,
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
    "certificate-bacii-qrcode-logo.png",
  );
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
