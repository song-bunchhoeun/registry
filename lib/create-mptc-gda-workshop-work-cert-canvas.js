  import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";
import { drawWrapTexts } from "./create-biu-np-bachelor-certificate";

export async function createMptcGdaWorkshopWorkCertCanvas(
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
    "certificate-mptc-workshop-performance-audit-no-stamp.jpg";

  let thressHoldTextMaxWidth = 2090;

  let MPTC_TEXTS = [
    {
      dataKeys: ["recipient.nameKm"],
      text: "{recipient.nameKm}",
      textSize: 50,
      textStyle: "nomal",
      textColor: MPTC_TEXT_COLORS.blue,
      y: 1496,
      align: "center",
      textFont: MPTC_FONTS.khmerOsMoulLight,
      strokeLine: 0.1,
    },

    {
      dataKeys: ["recipient.name"],
      text: "{recipient.name}",
      textSize: 50,
      textColor: MPTC_TEXT_COLORS.blue,
      y: 2023,
      align: "center",
      textStyle: "bold",
      textFont: MPTC_FONTS.googleSans,
      strokeLine: 0.1,
    },

    {
      dataKeys: ["recipient.ministry"],
      text: "{recipient.ministry}",
      textSize: 50,
      textColor: MPTC_TEXT_COLORS.blue,
      y: 2193,
      align: "center",
      textStyle: "bold",
      textFont: MPTC_FONTS.googleSans,
      strokeLine: 0.1,
    },

    {
      dataKeys: ["recipient.ministryKm"],
      text: `{recipient.ministryKm}`,
      textSize: 50,
      textColor: MPTC_TEXT_COLORS.blue,
      y: 1666,
      align: "center",
      textFont: MPTC_FONTS.khmerOsMoulLight,
      strokeLine: 0.1,
    },

    {
      dataKeys: ["certificate.dateKm"],
      text: `នៅ{certificate.dateKm} នៅទីស្ដីការក្រសួងប្រៃសណីយ៍និងទូរគមនាគមន៍។`,
      textSize: 50,
      textColor: MPTC_TEXT_COLORS.black,
      align: "center",
      y: 1832,
      textFont: MPTC_FONTS.nidaSowannaphum,
      strokeLine: 0.1,
    },
    {
      dataKeys: ["certificate.ministerSignatureLunarDateKm"],
      text: "{certificate.ministerSignatureLunarDateKm}",
      textSize: 50,
      textColor: MPTC_TEXT_COLORS.black,
      align: "center",
      y: 2465,
      textFont: MPTC_FONTS.nidaSowannaphum,
      strokeLine: 0.1,
    },
    {
      dataKeys: ["certificate.ministerSignatureDateKm"],
      text: "{certificate.ministerSignatureDateKm}",
      textSize: 50,
      align: "center",
      textColor: MPTC_TEXT_COLORS.black,
      y: 2553,
      textFont: MPTC_FONTS.nidaSowannaphum,
      strokeLine: 0.1,
    },
    {
      dataKeys: ["certificate.ministerSignatureDate"],
      text: "{certificate.ministerSignatureDate}",
      textSize: 50,
      textColor: MPTC_TEXT_COLORS.black,
      align: "center",
      y: 2641,
      textFont: MPTC_FONTS.googleSans,
      strokeLine: 1,
    },
  ];

  let positionLable = [
    {
      dataKeys: [],
      text: certificateInfo.recipient.position?.replaceAll("  ", " "),
      textSize: 50,
      textColor: MPTC_TEXT_COLORS.blue,
      y: 2107,
      align: "center",
      textStyle: "bold",
      textFont: MPTC_FONTS.googleSans,
      x: 1239.5,
      strokeLine: 0.1,
    },
    {
      dataKeys: [],
      text: certificateInfo.recipient.positionKm,
      textSize: 50,
      textStyle: "nomal",
      textColor: MPTC_TEXT_COLORS.blue,
      y: 1582,
      align: "center",
      textFont: MPTC_FONTS.khmerOsMoulLight,
      x: 1239.5,
      strokeLine: 0.1,
    },
  ];

  const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  const canvasWidth = bg.width;
  const centerOfCanvas = canvasWidth / 2;
  const textWidth = 1610; // width of drawWrapTexts En
  const textStartLeft = centerOfCanvas - textWidth / 2;

  drawWrapTexts(ctx, {
    top: 1749,
    left: textStartLeft,
    width: 1620,
    textAlignment: 'center',
    lineHeight: 1,
    spans: [
      {
        text: `ដែលបានចូលរួមជា${certificateInfo.recipient.roleKm}ក្នុងសិក្ខាសាលា ស្ដីពី `,
        fontSize: 50,
        fontFamily: MPTC_FONTS.nidaSowannaphum,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: '500'
      },
      {
        text: '“',
        fontSize: 50,
        fontFamily: MPTC_FONTS.googleSans,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: '500'
      },
      {
        text: 'សវនកម្មសមិទ្ធកម្ម',
        fontSize: 50,
        fontFamily: MPTC_FONTS.nidaSowannaphum,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: '500'
      },
      {
        text: '”',
        fontSize: 50,
        fontFamily: MPTC_FONTS.googleSans,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: '500'
      }
    ]
  }).draw()

  drawWrapTexts(ctx, {
    top: 2275,
    left: 179,
    width: 2134.5, 
    textAlignment: 'center',
    lineHeight: 1.6,
    spans: [
      {
        text: `in grateful recognition of your outstanding contribution as ${certificateInfo.recipient.role} at the Workshop on `,
        fontSize: 50,
        fontFamily: MPTC_FONTS.googleSans,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: '500'
      },
      {
        text: '"',
        fontSize: 50,
        fontFamily: MPTC_FONTS.googleSans,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: '500'
      },
      {
        text: 'Performance Audit',
        fontSize: 50,
        fontFamily: MPTC_FONTS.googleSans,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: '500'
      },
      {
        text: '"',
        fontSize: 50,
        fontFamily: MPTC_FONTS.googleSans,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: '500'
      },
      {
        text: ` on ${certificateInfo.certificate.date}, `,
        fontSize: 50,
        fontFamily: MPTC_FONTS.googleSans,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: '500'
      },
      {
        text: `at Ministry of Post and Telecommunications.`,
        fontSize: 50,
        fontFamily: MPTC_FONTS.googleSans,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: '500'
      }
    ]

  }).draw()

  //  dynamic re-position
  for (let i = 0; i < positionLable.length; i++) {
    let textWidth = getTextMaxWidth(ctx, positionLable[i]);
    if (textWidth.width > thressHoldTextMaxWidth) {
      positionLable[i].textMaxWidth = thressHoldTextMaxWidth;
      positionLable[i].x += (textWidth.width - thressHoldTextMaxWidth) / 2;
    }
  }
  MPTC_TEXTS = [...MPTC_TEXTS, positionLable];

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

const getTextMaxWidth = (ctx, textItem) => {
  ctx.font = resolveFont(textItem.textFont, 24, textItem);
  const kmTargetMatric = ctx.measureText(textItem.text);
  return kmTargetMatric;
};
