import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";
import { drawWrapTexts } from "./shared";

export async function createMPTCCDACertificateOfAppreciationSponsor(
  certificateInfo = {},
  qrcodeContent
) {
  const MPTC_TEXT_COLORS = {
    black: "#16294d",
    blue: "#12264d",
  };

  const MPTC_FONTS = {
    primary: "Niradei",
  };
  const MPTC_TEMPLATE_IMAGE =
    "mptc-cda-certificate-of-appreciation-general.jpg";

  const MPTC_TEXTS = [];

  const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  const canvasWidth = bg.width;
  const centerOfCanvas = canvasWidth / 2;
  const textWidth = 3090;
  const textStartLeft = centerOfCanvas - textWidth / 2;

  drawWrapTexts(ctx, {
    top: 2127,
    left: textStartLeft,
    width: textWidth,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: `for sponsoring and supporting the`,
        fontSize: 75,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "500",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 2246,
    left: textStartLeft,
    width: textWidth,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: `Cambodia Digital Awards 2024`,
        fontSize: 95,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "500",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 2446,
    left: textStartLeft,
    width: textWidth,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: "Phnom Penh, 29 November 2024",
        fontSize: 66.67,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "500",
      },
    ],
  }).draw();

  const recipientName = _.get(certificateInfo, "recipient.name", "");

  let nameParts = [recipientName];

  if (recipientName.includes("(")) {
    const splitIndex = recipientName.indexOf("(");
    const firstPart = recipientName.substring(0, splitIndex).trim();
    const secondPart = recipientName.substring(splitIndex).trim();
    nameParts = [firstPart, secondPart];
  }

  drawWrapTexts(ctx, {
    top: 1679,
    left: textStartLeft,
    width: textWidth,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: nameParts[0],
        fontSize: 110,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "700",
      },
    ],
  }).draw();

  if (nameParts.length > 1) {
    drawWrapTexts(ctx, {
      top: 1805,
      left: textStartLeft,
      width: textWidth,
      textAlignment: "center",
      lineHeight: 1,
      spans: [
        {
          text: nameParts[1],
          fontSize: 110,
          fontFamily: MPTC_FONTS.primary,
          fillStyle: MPTC_TEXT_COLORS.black,
          fontWeight: "700",
        },
      ],
    }).draw();
  }

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
      textColor: text.textColor || "#000000",
      align: text.align,
      font: resolveFont(MPTC_FONTS.primary, 24, text),
    });
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 2009, 2889, 320);
  }
  return canvas;
}

const drawTextItem = (canvas, ctx, textItem, FONTS, certificateInfo) => {
  if (textItem.dataKeys && textItem.dataKeys.length > 0) {
    for (const key of textItem.dataKeys)
      textItem.text = textItem.text.replace(
        `{${key}}`,
        _.get(certificateInfo, key, "")
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
