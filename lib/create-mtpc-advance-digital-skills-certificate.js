import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, drawWrapTexts } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createMptcAdvanceDigitalSkillsCertificate(
  certificateInfo = {},
  qrcodeContent,
) {
  const MPTC_TEXT_COLORS = {
    blue: "#014286",
  };

  const MPTC_FONTS = {
    primary: "Khmer Digital Max",
    secondary: "Khmer Digital",
  };
  
  const MPTC_TEMPLATE_IMAGE =
    "mptc-advance-digital-skills-bg.jpg";

  const MPTC_TEXTS = [
    {
      dataKeys: ["recipient.nameKm"],
      text: "{recipient.nameKm}",
      textSize: 50,
      textColor: MPTC_TEXT_COLORS.blue,
      x: 978,
      y: 824.4,
      align: "center",
      textFont: MPTC_FONTS.primary,
    },
    {
      dataKeys: ["recipient.name"],
      text: "{recipient.name}",
      textSize: 52,
      textColor: MPTC_TEXT_COLORS.blue,
      textStyle: "bold",
      x: 2527,
      y: 822,
      align: "center",
      textFont: MPTC_FONTS.secondary,
    },
    {
      dataKeys: ["certificate.dateKm", "certificate.locationKm"],
      text: "ចាប់ពី{certificate.dateKm} នៅ{certificate.locationKm}។",
      textSize: 46,
      textFont: MPTC_FONTS.secondary,
      textColor: MPTC_TEXT_COLORS.blue,
      x: 978,
      y: 1325,
      align: "center",
    },
    {
      dataKeys: ["certificate.date", "certificate.location"],
      text: "held from {certificate.date} in {certificate.location}.",
      textSize: 46,
      textFont: MPTC_FONTS.secondary,
      textColor: MPTC_TEXT_COLORS.blue,
      x: 2527,
      y: 1325,
      align: "center",
    },
    {
      dataKeys: ["certificate.signatureLunarDateKm"],
      text: "{certificate.signatureLunarDateKm}",
      textSize: 46,
      textColor: MPTC_TEXT_COLORS.blue,
      x: 1754,
      y: 1436.4,
      align: "center",
      textFont: MPTC_FONTS.secondary,
    },
    {
      dataKeys: ["certificate.signatureDateKm"],
      text: "{certificate.signatureDateKm}",
      textSize: 46,
      textColor: MPTC_TEXT_COLORS.blue,
      x: 1754,
      y: 1523,
      align: "center",
      textFont: MPTC_FONTS.secondary,
    },
    {
      dataKeys: ["certificate.signatureDate"],
      text: "{certificate.signatureDate}",
      textSize: 46,
      textColor: MPTC_TEXT_COLORS.blue,
      x: 1754,
      y: 1610,
      align: "center",
      textFont: MPTC_FONTS.secondary,
    },
  ];

  const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  const poistionKmBlock = drawWrapTexts(ctx, {
    top: 908.3,
    left: 180.5,
    width: 1584,
    textAlignment: "center",
    lineHeight: 1.7,
    spans: [
      {
        text:
          certificateInfo.recipient.positionKm +
          "\n" +
          certificateInfo.recipient.departmentKm,
        fontSize: 50,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "normal",
      },
    ],
  });

  const positionBlock = drawWrapTexts(ctx, {
    top: 908.3,
    left: 1750,
    width: 1550,
    textAlignment: "center",
    lineHeight: 1.7,
    spans: [
      {
        text:
          certificateInfo.recipient.position +
          "\n" +
          certificateInfo.recipient.department,
        fontSize: 50,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "bold",
      },
    ],
  });

  poistionKmBlock.draw();
  positionBlock.draw();

  // Draw Caption
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
      textColor: text.textColor || "#000000",
      align: text.align,
      font: resolveFont(MPTC_FONTS.primary, 24, text),
      strokeLine: text.strokeLine,
    });
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 2842.5, 1735.2, 309);
  } else {
    const qrBlank = await loadImage(
      path.join(process.cwd(), "assets", "qr-bg-v2-sample.png")
    );
    if (qrBlank) {
      ctx.drawImage(qrBlank, 2842.5, 1735.2, 309, 381.1);
    }
  }
  return canvas;
}

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
