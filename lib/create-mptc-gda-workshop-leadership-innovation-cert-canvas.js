  import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, drawWrapTexts } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createMptcGdaWorkshopLeadershipInnovationCertCanvas(
  certificateInfo = {},
  qrcodeContent
) {
  
  const MPTC_TEXT_COLORS = {
    black: "#050708",
    blue: "#164582",
  };

  const MPTC_FONTS = {
    khmerOsMoulLight: "Khmer OS Muol Light",
    nidaSowannaphum: "NiDA Sowannaphum",
    googleSans: "Google Sans",
    googleSansMedium: "Google Sans Medium",
  };
  const MPTC_TEMPLATE_IMAGE =
    "certificate-mptc-leadership-innovation.jpg";

  let MPTC_TEXTS = [
    {
      dataKeys: ["recipient.nameKm"],
      text: "{recipient.nameKm}",
      textSize: 50,
      textStyle: "nomal",
      textColor: MPTC_TEXT_COLORS.blue,
      y: 1510,
      align: "center",
      textFont: MPTC_FONTS.khmerOsMoulLight,
      strokeLine: 0.1,
    },

    {
      dataKeys: ["recipient.name"],
      text: "{recipient.name}",
      textSize: 50,
      textColor: MPTC_TEXT_COLORS.blue,
      y: 1944,
      align: "center",
      textStyle: "bold",
      textFont: MPTC_FONTS.googleSans,
      strokeLine: 0.1,
    },
    {
      dataKeys: ["certificate.dateKm", "certificate.placeKm"],
      text: `{certificate.dateKm} នៅ{certificate.placeKm}។`,
      textSize: 50,
      textColor: MPTC_TEXT_COLORS.black,
      align: "center",
      y: 1755,
      textFont: MPTC_FONTS.nidaSowannaphum,
      strokeLine: 0.1,
    },
    {
      dataKeys: ["certificate.signatureLunarDateKm"],
      text: "{certificate.signatureLunarDateKm}",
      textSize: 50,
      textColor: MPTC_TEXT_COLORS.black,
      align: "center",
      y: 2325,
      textFont: MPTC_FONTS.nidaSowannaphum,
      strokeLine: 0.1,
    },
    {
      dataKeys: ["certificate.signatureDateKm"],
      text: "{certificate.signatureDateKm}",
      textSize: 50,
      align: "center",
      textColor: MPTC_TEXT_COLORS.black,
      y: 2407,
      textFont: MPTC_FONTS.nidaSowannaphum,
      strokeLine: 0.1,
    },
    {
      dataKeys: ["certificate.signatureDate"],
      text: "{certificate.signatureDate}",
      textSize: 50,
      textColor: MPTC_TEXT_COLORS.black,
      align: "center",
      y: 2490,
      textFont: MPTC_FONTS.googleSans,
      strokeLine: 1,
    },
  ];

  const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  const canvasWidth = bg.width;
  const centerOfCanvas = canvasWidth / 2;
  const textWidthKm = 1610; // width of drawWrapTexts
  const textWidthDate = 2500; // width of drawWrapTexts
  const textStartLeft = centerOfCanvas - textWidthKm / 2;
  const textStartLeftDate = centerOfCanvas - textWidthDate / 2;

  drawWrapTexts(ctx, {
    top: 2194,
    left: textStartLeftDate,
    width: textWidthDate,
    textAlignment: 'center',
    lineHeight: 1,
    spans: [
      {
        text: `${certificateInfo.certificate.date} at the ${certificateInfo.certificate.place}.`,
        fontSize: 49,
        fontFamily: MPTC_FONTS.googleSans,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: '500'
      }
    ]
  }).draw()

  drawWrapTexts(ctx, {
    top: 1674,
    left: textStartLeft,
    width: textWidthKm,
    textAlignment: 'center',
    lineHeight: 1,
    spans: [
      {
        text: '“',
        fontSize: 49,
        fontFamily: MPTC_FONTS.googleSans,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: '600'
      },
      {
        text: certificateInfo.certificate.courseKm,
        fontSize: 49,
        fontFamily: MPTC_FONTS.nidaSowannaphum,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: '600'
      },
      {
        text: '”',
        fontSize: 49,
        fontFamily: MPTC_FONTS.googleSans,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: '600'
      }
    ]
  }).draw()

  drawWrapTexts(ctx, {
    top: 2110,
    left: textStartLeft,
    width: textWidthKm, 
    textAlignment: 'center',
    lineHeight: 1.6,
    spans: [
      {
        text: '“',
        fontSize: 49,
        fontFamily: MPTC_FONTS.googleSans,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: '600'
      },
      {
        text: certificateInfo.certificate.course,
        fontSize: 49,
        fontFamily: MPTC_FONTS.googleSans,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: '600'
      },
      {
        text: '”',
        fontSize: 49,
        fontFamily: MPTC_FONTS.googleSans,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: '600'
      },
    ]

  }).draw()

  for (const text of MPTC_TEXTS) {
    if (text.length > 0) {
      for (const index in text) {
        const textItem = text[index];
        let lastItem;
        if (index > 0) lastItem = text[index - 1];

        if (!textItem.x) {
          const lastFont = resolveFont(
            MPTC_FONTS.khmerOsMoulLight,
            24,
            lastItem
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
          MPTC_FONTS.khmerOsMoulLight,
          certificateInfo
        );
      }
    } else
      drawTextItem(
        canvas,
        ctx,
        text,
        MPTC_FONTS.khmerOsMoulLight,
        certificateInfo
      );
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 1923, 2881, 297);
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