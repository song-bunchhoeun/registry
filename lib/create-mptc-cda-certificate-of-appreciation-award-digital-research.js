import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";
import { drawWrapTexts } from "./shared";

export async function createMPTCCDACertificateOfAppreciationBestDigitalResearchAndInnovation(
  certificateInfo = {},
  qrcodeContent
) {
  const MPTC_TEXT_COLORS = {
    black: "#16294d",
    blue: "#12264d",
    red: "#FF0000",
  };

  const MPTC_FONTS = {
    primary: "Niradei",
  };
  const MPTC_TEMPLATE_IMAGE =
    "mptc-cda-certificate-of-appreciation-adward-winner.jpg";

  const MPTC_TEXTS = [
    {
      dataKeys: ["recipient.name"],
      text: "{recipient.name}",
      textSize: 100,
      textStyle: "bold",
      textColor: MPTC_TEXT_COLORS.black,
      y: 1891,
      align: "center",
      textFont: MPTC_FONTS.primary,
      strokeLine: 1,
    },
    {
      dataKeys: ["certificate.product"],
      text: `“{certificate.product}”`,
      textSize: 85,
      textStyle: "bold",
      textColor: MPTC_TEXT_COLORS.black,
      y: 2220,
      align: "center",
      textFont: MPTC_FONTS.primary,
      strokeLine: 1,
    },
  ];

  const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  const canvasWidth = bg.width;
  const centerOfCanvas = canvasWidth / 2;
  const textWidth = 3090;
  const textStartLeft = centerOfCanvas - textWidth / 2;

  function getAward(type, certificateInfo) {
    if (type === "award") {
      return certificateInfo.certificate.award;
    }
  }

  const awardText = getAward("award", certificateInfo);

  // Break "of the Year 2024" into a new line.
  const [firstLine, secondLine] = awardText.includes("of")
    ? awardText
        .split(" of ")
        .map((line, index) => (index === 1 ? `of ${line}` : line))
    : [awardText, ""];

  drawWrapTexts(ctx, {
    top: 1367,
    left: textStartLeft,
    width: textWidth,
    textAlignment: "center",
    spans: [
      {
        text: firstLine,
        fontSize: 100,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "700",
      },
    ],
  }).draw();

  if (secondLine) {
    drawWrapTexts(ctx, {
      top: 1493,
      left: textStartLeft,
      width: textWidth,
      textAlignment: "center",
      spans: [
        {
          text: secondLine,
          fontSize: 100,
          fontFamily: MPTC_FONTS.primary,
          fillStyle: MPTC_TEXT_COLORS.blue,
          fontWeight: "500",
        },
      ],
    }).draw();
  }

  drawWrapTexts(ctx, {
    top: 1692,
    left: textStartLeft,
    width: textWidth,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: `is awarded to`,
        fontSize: 75,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "500",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 2090,
    left: textStartLeft,
    width: textWidth,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: `for Outstanding Product`,
        fontSize: 85,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "500",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 2416,
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
