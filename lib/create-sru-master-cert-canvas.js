import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import {
  createTemplateImage,
  drawText,
  drawWrapTexts,
  loadRemoteResource,
} from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createSRUMasterCertificateCanvas(
  certificateInfo = {},
  qrcodeContent
) {
  const MPTC_TEXT_COLORS = {
    blue: "#020202",
  };

  const MPTC_FONTS = {
    primary: "Khmer Mool",
    secondary: "Khmer Kep",
    thirdly: "Cambria",
    fourdy: "Cooper Black",
  };
  const MPTC_TEMPLATE_IMAGE = "sru-master-certificate.jpg";

  const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  let nameKmText = _.get(certificateInfo, "recipient.nameKm", "");
  nameKmText = nameKmText.trim().replace(/(\S) (\S)/g, "$1  $2");

  const SRU_TEXTS = [
    {
      dataKeys: ["recipient.nameKm"],
      text: nameKmText,
      textSize: 73,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.primary,
      y: 1120,
      x: 1040,
      align: "center",
    },
    {
      dataKeys: ["recipient.dateOfBirth"],
      text: `born on ${certificateInfo.recipient.dateOfBirth}`,
      textSize: 48,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.thirdly,
      y: 1202,
      x: 2522,
      align: "center",
    },
    {
      dataKeys: ["certificate.rectorSignatureDate"],
      text: `${certificateInfo.certificate.rectorSignatureDate}`,
      textSize: 48,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.thirdly,
      y: 1679,
      x: 2522,
      align: "center",
    },
  ];

  drawWrapTexts(ctx, {
    top: 1213,
    left: 520,
    width: 1058,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        dataKeys: ["recipient.dateOfBirthKm"],
        text: `កើត${certificateInfo.recipient.dateOfBirthKm}`,
        fontSize: 50,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "normal",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 1341,
    left: 385,
    width: 1343,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        dataKeys: ["certificate.degreeKm"],
        text: `${certificateInfo.certificate.degreeKm}`,
        fontSize: 66.6,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "normal",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 1431,
    left: 520,
    width: 1058,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        dataKeys: ["certificate.majorKm"],
        text: `ជំនាញ ${certificateInfo.certificate.majorKm}`,
        fontSize: 50,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "bold",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 1608,
    left: 385,
    width: 1343,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        dataKeys: ["certificate.chairmanSignatureLunarDateKm"],
        text: `${certificateInfo.certificate.chairmanSignatureLunarDateKm}`,
        fontSize: 46,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "normal",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 1679,
    left: 385,
    width: 1343,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        dataKeys: ["certificate.chairmanSignatureDateKm"],
        text: `${certificateInfo.certificate.chairmanSignatureDateKm}`,
        fontSize: 46,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "normal",
      },
    ],
  }).draw();

  //   en

  drawWrapTexts(ctx, {
    top: 1114,
    left: 1976,
    width: 1098,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        dataKeys: ["recipient.name"],
        text: `${certificateInfo.recipient.name}`,
        fontSize: 63,
        fontFamily: MPTC_FONTS.fourdy,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "normal",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 1376,
    left: 1831,
    width: 1387,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        dataKeys: [""],
        text: `${certificateInfo.certificate.degree}`,
        fontSize: 63,
        fontFamily: MPTC_FONTS.fourdy,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "normal",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 1460,
    left: 1831,
    width: 1387,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        dataKeys: [""],
        text: `in ${certificateInfo.certificate.major}`,
        fontSize: 48,
        fontFamily: MPTC_FONTS.thirdly,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "bold",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 1760,
    left: 1303,
    width: 896,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        dataKeys: [""],
        text: `លេខ....`,
        fontSize: 48,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "normal",
      },
      {
        dataKeys: ["certificate.number"],
        text: `${certificateInfo.certificate.number}`,
        fontSize: 48,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "bold",
      },
      {
        dataKeys: ["certificate.number"],
        text: `....`,
        fontSize: 48,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "bold",
      },
    ],
  }).draw();

  for (const text of SRU_TEXTS) {
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
      textColor: text.textColor || MPTC_TEXT_COLORS.blue,
      align: text.align,
      font: resolveFont(MPTC_FONTS.primary, 24, text),
    });
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 323, 1781, 320);
  }

  // draw profile photo
  if (certificateInfo.recipient.photoBase64) {
    const profileImage = await loadRemoteResource(
      certificateInfo.recipient.photoBase64
    );
    if (profileImage) {
      const profileMaxWidth = 290;
      const profileMaxHeight = 380;

      // Calculate aspect ratio
      const aspectRatio = profileImage.width / profileImage.height;
      let drawWidth = profileMaxWidth;
      let drawHeight = profileMaxHeight;

      // Fit image within max dimensions
      if (aspectRatio > profileMaxWidth / profileMaxHeight) {
        drawWidth = profileMaxWidth;
        drawHeight = profileMaxWidth / aspectRatio;
      } else {
        drawHeight = profileMaxHeight;
        drawWidth = profileMaxHeight * aspectRatio;
      }

      // Center image in the box
      const profileX = 1606 + (profileMaxWidth - drawWidth) / 2;
      const profileY = 1799 + (profileMaxHeight - drawHeight) / 2;

      ctx.drawImage(profileImage, profileX, profileY, drawWidth, drawHeight);
    }
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
