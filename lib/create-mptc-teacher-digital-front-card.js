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

export async function createMPTCGDAFrontCard(
  certificateInfo = {},
  qrcodeContent,
) {
  const MPTC_TEXT_COLORS = {
    black: "#004282",
    // black: "#f00000",
  };

  const MPTC_FONTS = {
    nidaFunan: "NiDA Funan",
    nidaSovannaPhum: "NiDA Sowannaphum",
    groundColtrol: "Ground Control",
  };

  const MPTC_TEMPLATE_IMAGE = "mptc-teacher-digital-front-card.jpg";
  // const MPTC_TEMPLATE_IMAGE = "mptc-teacher-digital-front-card-sample.jpg";

  const MPTC_TEXTS = [
    {
      dataKeys: ["recipient.nameKm"],
      text: "{recipient.nameKm}",
      textSize: 126,
      textColor: MPTC_TEXT_COLORS.black,
      textFont: MPTC_FONTS.nidaFunan,
      y: 2042,
      align: "center",
    },
    {
      dataKeys: ["recipient.name"],
      text: "{recipient.name}",
      textSize: 126,
      textColor: MPTC_TEXT_COLORS.black,
      textFont: MPTC_FONTS.groundColtrol,
      y: 2192,
      align: "center",
    },
    {
      dataKeys: ["recipient.roleKm"],
      text: "{recipient.roleKm}",
      textSize: 88,
      textColor: MPTC_TEXT_COLORS.black,
      textFont: MPTC_FONTS.nidaSovannaPhum,
      y: 2472,
      align: "center",
      strokeLine: 3,
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

  drawWrapTexts(ctx, {
    top: 2623,
    left: 55,
    width: 1844,
    textAlignment: "center",
    lineHeight: 1.7,
    spans: [
      {
        text:
          certificateInfo.recipient.organizationKm +
          "\n" +
          certificateInfo.recipient.provinceKm,
        fontSize: 88,
        fontFamily: MPTC_FONTS.nidaSovannaPhum,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "600",
      },
    ],
  }).draw();

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

  // draw profile photo in circular container
  if (certificateInfo.recipient.photoBase64) {
    const profileImage = await loadRemoteResource(
      certificateInfo.recipient.photoBase64,
    );
    if (profileImage) {
      const circleX = 969;
      const circleY = 1380 - 14;
      const radius = 434;

      // Clip to circular area
      ctx.save();
      ctx.beginPath();
      ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
      ctx.clip();

      // Scale image to cover circle (crop excess)
      const scale = Math.max(
        (radius * 2) / profileImage.width,
        (radius * 2) / profileImage.height,
      );
      const scaledWidth = profileImage.width * scale;
      const scaledHeight = profileImage.height * scale;

      const x = circleX - scaledWidth / 2;
      const y = circleY - radius;

      ctx.drawImage(profileImage, x, y, scaledWidth, scaledHeight);
      ctx.restore();
    }
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
