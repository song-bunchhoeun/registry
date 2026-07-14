import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, drawWrapTexts } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createMptcIctCnccCanvas(
  certificateInfo = {},
  qrcodeContent
) {
  const MPTC_TEXT_COLORS = {
    black: "#020202",
    blue: "#004282",
  };

  const MPTC_FONTS = {
    primary: "Kantumruy Pro",
    secondary: "Google Sans",
  };
  const MPTC_TEMPLATE_IMAGE = "mptc-ict-cncc-certificate.jpg";

  const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  drawWrapTexts(ctx, {
    top: 1569.5,
    left: 0,
    width: 2480,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        dataKeys: ["recipient.nameKm"],
        text: certificateInfo.recipient.nameKm,
        fontSize: 60,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "700",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 1666.5,
    left: 0,
    width: 2480,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        dataKeys: ["certificate.awardKm"],
        text: `ដែលទទួលបាន${certificateInfo.certificate.awardKm} ក្នុង`,
        fontSize: 58,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "600",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 1756.2,
    left: 0,
    width: 2480,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: "\u201C",
        fontSize: 58,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "bold",
      },
      {
        dataKeys: ["certificate.programKm"],
        text: `${certificateInfo.certificate.programKm}`,
        fontSize: 58,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "600",
      },
      {
        text: "\u201D",
        fontSize: 58,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "bold",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 1844.6,
    left: 0,
    width: 2480,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        dataKeys: ["certificate.dateKm"],
        text: certificateInfo.certificate.dateKm,
        fontSize: 58,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "600",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 2093.5,
    left: 0,
    width: 2480,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        dataKeys: ["recipient.name"],
        text: certificateInfo.recipient.name,
        fontSize: 58,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "bold",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 2180,
    left: 0,
    width: 2480,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: "For achieving ",
        fontSize: 58,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "600",
      },
      {
        dataKeys: ["certificate.award"],
        text: certificateInfo.certificate.award,
        fontSize: 58,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "bold",
      },
      {
        text: " in the",
        fontSize: 58,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "600",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 2267,
    left: 0,
    width: 2480,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: "\u201C",
        fontSize: 58,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "bold",
      },
      {
        dataKeys: ["certificate.program"],
        text: `${certificateInfo.certificate.program}`,
        fontSize: 58,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "600",
      },
      {
        text: "\u201D",
        fontSize: 58,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "bold",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 2347.2,
    left: 0,
    width: 2480,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        dataKeys: ["certificate.date"],
        text: certificateInfo.certificate.date,
        fontSize: 58,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "600",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 2507,
    left: 0,
    width: 2480,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        dataKeys: ["certificate.ministerSignatureLunarDateKm"],
        text: certificateInfo.certificate.ministerSignatureLunarDateKm,
        fontSize: 58,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "600",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 2601.8,
    left: 0,
    width: 2480,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        dataKeys: ["certificate.ministerSignatureDateKm"],
        text: certificateInfo.certificate.ministerSignatureDateKm,
        fontSize: 58,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "600",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 2697,
    left: 0,
    width: 2480,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        dataKeys: ["certificate.ministerSignatureDate"],
        text: certificateInfo.certificate.ministerSignatureDate,
        fontSize: 58,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "600",
      },
    ],
  }).draw();

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 1919, 3020.3, 268);
  }
  return canvas;
}

export async function drawCenterText(
  text1Style = {},
  text1Color,
  text1Content,
  text2Style = {},
  text2Color,
  text2Content,
  y,
  MPTC_FONTS,
  ctx,
  canvas,
  bg
) {
  ctx.font = `${text1Style.textStyle} ${text1Style.textSize}px ${text1Style.textFont}`;
  let text1Width = ctx.measureText(text1Content).width;
  ctx.font = `${text2Style.textStyle} ${text2Style.textSize}px ${text2Style.textFont}`;
  let text2Width = ctx.measureText(text2Content).width;
  let totalContentWidth = text1Width + text2Width;
  let spaceWidth = bg.width - totalContentWidth;

  let mulTotalWidth = spaceWidth / 2;
  drawText(canvas, ctx, text1Content, {
    x: mulTotalWidth,
    y: y,
    textColor: text1Color,
    align: "left",
    font: resolveFont(MPTC_FONTS.secondary, 50, text1Style),
  });

  drawText(canvas, ctx, text2Content, {
    x: mulTotalWidth + text1Width,
    y: y,
    textColor: text2Color,
    align: "left",
    font: resolveFont(MPTC_FONTS.primary, 50, text2Style),
  });
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
