import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, drawWrapTexts } from "./shared";
import QRCode from "qrcode";
import _, { get } from "lodash";

export async function createMptcWritingCompetition2026Canvas(
  certificateInfo = {},
  qrcodeContent,
) {
  // const DEBUG_COLOR = "#f00000";
  const MPTC_TEXT_COLORS = {
    black: "#050708",
    blue: "#164582",
    yellow: "#f2710c",
    // black: DEBUG_COLOR,
    // blue: DEBUG_COLOR,
    // yellow: DEBUG_COLOR,
  };

  const MPTC_FONTS = {
    khmerDigital: "Khmer Digital",
    khmerDigitalMax: "Khmer Digital Max",
    googleSans: "Google Sans",
  };

  const MPTC_TEMPLATE_IMAGE = "mptc-certificate-writing-competition-2026.jpg";
  // "mptc-certificate-writing-competition-2026-sample.jpg";

  const awardKm = certificateInfo.certificate.awardKm || "";
  const award = certificateInfo.certificate.award || "";

  const isWinnerKm = ["លេខ១", "លេខ២", "លេខ៣"].includes(awardKm);

  const positionKm = _.get(certificateInfo, "recipient.positionKm");
  const position = _.get(certificateInfo, "recipient.position");
  const provinceKm = _.get(certificateInfo, "recipient.provinceKm");
  const province = _.get(certificateInfo, "recipient.province");

  const isWinner = [
    "First Place Winner",
    "Second Place Winner",
    "Third Place Winner",
  ].includes(award);

  const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  let MPTC_TEXTS = [
    {
      dataKeys: ["recipient.nameKm"],
      text: "{recipient.nameKm}",
      textSize: 50,
      textStyle: "nomal",
      textColor: MPTC_TEXT_COLORS.blue,
      y: 1589,
      align: "center",
      textFont: MPTC_FONTS.khmerDigitalMax,
    },
    {
      dataKeys: ["recipient.name"],
      text: "{recipient.name}",
      textSize: 50,
      textStyle: "bold",
      textColor: MPTC_TEXT_COLORS.blue,
      y: 2015,
      align: "center",
      textFont: MPTC_FONTS.googleSans,
      strokeLine: 1.5,
    },
  ];

  drawWrapTexts(ctx, {
    top: 1765,
    left: 0,
    width: 2480,
    textAlignment: "center",
    lineHeight: 2.2,
    spans: isWinnerKm
      ? [
          {
            text: "បានទទួលជ័យលាភី",
            fontSize: 50,
            fontFamily: MPTC_FONTS.khmerDigital,
            fillStyle: MPTC_TEXT_COLORS.black,
            fontWeight: "700",
          },
          {
            text: ` ${awardKm}`,
            fontSize: 50,
            fontFamily: MPTC_FONTS.khmerDigitalMax,
            fillStyle: MPTC_TEXT_COLORS.yellow,
            fontWeight: "normal",
          },
        ]
      : [
          {
            text: `បានទទួលជ័យលាភីពិន្ទុខ្ពស់ជាងគេ`,
            fontSize: 50,
            fontFamily: MPTC_FONTS.khmerDigital,
            fillStyle: MPTC_TEXT_COLORS.black,
            fontWeight: "700",
          },
          {
            text: ` ១០រូប`,
            fontSize: 50,
            fontFamily: MPTC_FONTS.khmerDigitalMax,
            fillStyle: MPTC_TEXT_COLORS.yellow,
            fontWeight: "normal",
          },
        ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 2165,
    left: 0,
    width: 2480,
    textAlignment: "center",
    lineHeight: 2.2,
    spans: isWinner
      ? [
          {
            text: "as the",
            fontSize: 50,
            fontFamily: MPTC_FONTS.googleSans,
            fillStyle: MPTC_TEXT_COLORS.black,
            fontWeight: "600",
          },
          {
            text: ` ${award}`,
            fontSize: 50,
            fontFamily: MPTC_FONTS.googleSans,
            fillStyle: MPTC_TEXT_COLORS.yellow,
            fontWeight: "600",
          },
        ]
      : [
          {
            text: `for being on Top`,
            fontSize: 50,
            fontFamily: MPTC_FONTS.googleSans,
            fillStyle: MPTC_TEXT_COLORS.black,
            fontWeight: "600",
          },
          {
            text: ` 10 Shortlist`,
            fontSize: 50,
            fontFamily: MPTC_FONTS.googleSans,
            fillStyle: MPTC_TEXT_COLORS.yellow,
            fontWeight: "600",
          },
        ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 1678,
    left: 0,
    width: 2480,
    textAlignment: "center",
    lineHeight: 2.2,
    spans: [
      {
        text: `${positionKm}${provinceKm ? ` (${provinceKm})` : ""}`,
        fontSize: 50,
        fontFamily: MPTC_FONTS.khmerDigitalMax,
        fillStyle: MPTC_TEXT_COLORS.blue,
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 2090,
    left: 0,
    width: 2480,
    textAlignment: "center",
    lineHeight: 2.2,
    spans: [
      {
        text: `${position}${province ? ` (${province})` : ""}`,
        fontSize: 50,
        fontFamily: MPTC_FONTS.googleSans,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "700",
      },
    ],
  }).draw();

  for (const text of MPTC_TEXTS) {
    if (text.length > 0) {
      for (const index in text) {
        const textItem = text[index];
        let lastItem;
        if (index > 0) lastItem = text[index - 1];

        if (!textItem.x) {
          const lastFont = resolveFont(
            MPTC_FONTS.khmerDigitalMax,
            24,
            lastItem,
          );
          ctx.font = lastFont;
          const lastItemMetric = ctx.measureText(lastItem.text);
          textItem.x = lastItem.x + lastItemMetric.width + textItem.addX;
        }

        if (!textItem.y) textItem.y = lastItem.y;

        drawTextItem(
          canvas,
          ctx,
          textItem,
          MPTC_FONTS.khmerDigitalMax,
          certificateInfo,
        );
      }
    } else
      drawTextItem(
        canvas,
        ctx,
        text,
        MPTC_FONTS.khmerDigitalMax,
        certificateInfo,
      );
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 1923, 2881, 297);
  }
  return canvas;
}

const drawTextItem = (canvas, ctx, textItem, FONTS, certificateInfo) => {
  if (textItem.dataKeys?.length > 0)
    for (const key of textItem.dataKeys)
      textItem.text = textItem.text.replace(
        `{${key}}`,
        _.get(certificateInfo, key, ""),
      );

  const font = resolveFont(FONTS[0].name, 24, textItem);
  const opts = {
    x: textItem.x,
    y: textItem.y,
    font,
    fillStyle: textItem.textColor,
    align: textItem.align,
    canvasWidth: canvas.width,
    superscriptMod: textItem.superscriptMod, // ← passed through so withSuperscript can read it
  };

  if (textItem.draw) return textItem.draw(textItem.text, opts); // ← custom renderer (e.g. superscript)

  drawText(canvas, ctx, textItem.text, {
    ...opts,
    textColor: textItem.textColor || "#0033ff",
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
