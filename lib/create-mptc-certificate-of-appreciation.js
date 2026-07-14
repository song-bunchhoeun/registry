import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createMptcCertificateOfAppreciation(
  certificateInfo = {},
  qrcodeContent
) {
  const MPTC_TEXT_COLORS = {
    black: "#00090A",
    blue: "#14407e",
  };

  const MPTC_FONTS = {
    primary: "Google Sans",
  };

  const MPTC_TEMPLATE_IMAGE = "mptc-letter-of-appreciation-sr-2024-no-stamp-v2.jpg";
  const MPTC_TEXTS = [
    {
      dataKeys: ["recipient.name"],
      text: "{recipient.name}",
      textSize: 90,
      textStyle: "bold",
      textColor: MPTC_TEXT_COLORS.blue,
      y: 1502,
      align: "center",
    },
    {
      dataKeys: ["recipient.role"],
      text: "Contribution as {recipient.role} in the Training on",
      textSize: 60,
      textStyle: "medium",
      textColor: MPTC_TEXT_COLORS.black,
      strokeLine: 1.5,
      x: 1232,
      y: 1760,
      align: "center",
    },
  ];

  const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  for (const text of MPTC_TEXTS) {
    if (text.dataKeys) {
      for (const key of text.dataKeys) {
        text.text = text.text.replace(
          `{${key}}`,
          _.get(certificateInfo, key, "")
        );
      }
    }

    drawText(canvas, ctx, text.text, {
      x: text.x,
      y: text.y,
      textColor: text.textColor || MPTC_TEXT_COLORS.black,
      strokeLine: text.strokeLine,
      align: text.align,
      font: resolveFont(MPTC_FONTS.primary, 24, text),
    });
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 1991, 2945, 268);
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
  const logoPath = path.join(process.cwd(), "assets", "qr-bg-v2.png");
  const qrcodeLogoImage = await loadImage(logoPath);
  const gapSize = (width * 10) / 120;
  const qrcodeSize = width - gapSize * 2;
  const height = (width * 148) / 120;
  ctx.drawImage(qrcodeLogoImage, x, y, width, height);

  const qrcodeBuffer = await QRCode.toBuffer(qrcodeContent, {
    margin: 0,
    width: qrcodeSize,
  });
  const qrcodeImage = await loadImage(qrcodeBuffer);
  ctx.drawImage(qrcodeImage, x + gapSize, y + gapSize);
}

function resolveFont(defaultFont, defaultSize, text) {
  const fontName = text.textFont ? text.textFont : defaultFont;
  const fontStyle = text.textStyle ? text.textStyle + " " : "";
  return `${fontStyle}${text.textSize || defaultSize}px ${fontName}`;
}
