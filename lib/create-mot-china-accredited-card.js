import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import {
  createTemplateImage,
  loadRemoteResource,
  drawWrapTexts,
  drawText,
  drawPreview,
} from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createMoTChinaAccreditedCard(
  certificateInfo = {},
  qrcodeContent,
  preview,
) {
  const MOT_TEXT_COLORS = {
    blue: "#15143E",
    white: "#FFFFFF",
  };

  const MOT_FONTS = {
    kh_koulen: "Kh KoulenL",
    simsun: "SimSun",
    brlnsdb: "Berlin Sans FB Demi",
  };

  const MOT_TEMPLATE_IMAGE = "mot-chinese-ready-background.jpg";

  const companyNameKm = _.get(certificateInfo, "recipient.companyNameKm", "");
  const companyNameZh = _.get(certificateInfo, "recipient.companyNameZh", "");
  const duration = _.get(certificateInfo, "certificate.duration", "");
  const serviceKm = _.get(certificateInfo, "certificate.serviceKm", "").replace(
    "សេវាកម្ម",
    "",
  );
  const serviceZh = _.get(certificateInfo, "certificate.serviceZh", "");
  const service = _.get(certificateInfo, "certificate.service", "");

  let MOT_TEXTS = [
    {
      dataKey: ["recipient.companyNameKm"],
      text: companyNameKm,
      textSize: 320,
      textFont: MOT_FONTS.kh_koulen,
    },
    {
      dataKey: ["recipient.companyNameZh"],
      text: companyNameZh,
      textSize: 200,
      textFont: MOT_FONTS.simsun,
    },
    {
      dataKey: ["certificate.duration"],
      text: duration,
      textSize: 220,
      textFont: MOT_FONTS.brlnsdb,
    },
    {
      dataKey: ["certificate.serviceZh"],
      text: serviceZh,
      textSize: 520,
      textFont: MOT_FONTS.simsun,
    },
    {
      dataKey: ["certificate.service"],
      text: service,
      textSize: 210,
      textFont: MOT_FONTS.brlnsdb,
    },
  ];

  const getTextMaxWidth = (ctx, textItem) => {
    ctx.font = resolveFont(textItem.textFont, 24, textItem);
    const kmTargetMatric = ctx.measureText(textItem.text);
    return kmTargetMatric;
  };

  const bg = await createTemplateImage(MOT_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  let banner = "accomodation-banner.jpg";

  switch (service.toLowerCase()) {
    case "accommodation":
      banner = "accomodation-banner.jpg";
      break;
    case "tour operator":
      banner = "tour-banner.jpg";
      break;
    case "attractions":
      banner = "attraction-banner.jpg";
      break;
    case "food & beverage":
      banner = "food-banner.jpg";
      // banner = "food-banner-2.jpg";
      break;
    case "fun & entertainment":
      banner = "fun-banner.jpg";
      break;
    case "shopping & retail":
      banner = "shopping-banner.jpg";
      break;
    case "transport & getting around":
      banner = "transport-banner.jpg";
      break;
  }

  const bannerCanvas = await createTemplateImage(banner);
  const bannerSize = createCanvas(bannerCanvas.width, bannerCanvas.height);
  ctx.drawImage(bannerCanvas, 0, 5580);

  const adjustFontSize = (ctx, dataItem, textMaxWidth) => {
    let fontSize = dataItem.textSize;
    let getTextWidth = getTextMaxWidth(ctx, {
      ...dataItem,
      textSize: fontSize,
    });
    while (getTextWidth.width > textMaxWidth && fontSize > 0) {
      fontSize--;
      getTextWidth = getTextMaxWidth(ctx, {
        ...dataItem,
        textSize: fontSize,
      });
    }
    return fontSize;
  };

  const MAX_WIDTH = 2500;

  const companyNameKmSize = adjustFontSize(ctx, MOT_TEXTS[0], MAX_WIDTH);
  const companyNameZhSize = adjustFontSize(ctx, MOT_TEXTS[1], MAX_WIDTH);
  const durationSize = adjustFontSize(ctx, MOT_TEXTS[2], MAX_WIDTH);
  const serviceZhSize = adjustFontSize(ctx, MOT_TEXTS[3], MAX_WIDTH);
  const serviceSize = adjustFontSize(ctx, MOT_TEXTS[4], 2300);

  MOT_TEXTS = [
    {
      dataKey: ["recipient.companyNameKm"],
      text: companyNameKm,
      textSize: companyNameKmSize,
      textFont: MOT_FONTS.kh_koulen,
      textColor: MOT_TEXT_COLORS.blue,
      fontWeight: "500",
      align: "center",
      x: 2612.5,
      y: 806,
    },
    {
      dataKey: ["recipient.companyNameZh"],
      text: companyNameZh,
      textSize: companyNameZhSize,
      textFont: MOT_FONTS.simsun,
      textColor: MOT_TEXT_COLORS.blue,
      fontWeight: "500",
      align: "center",
      x: 2635,
      y: 1210,
    },
    {
      dataKey: ["certificate.duration"],
      text: duration,
      textSize: durationSize,
      textFont: MOT_FONTS.brlnsdb,
      textColor: MOT_TEXT_COLORS.blue,
      align: "center",
      x: 2635,
      y: 4585,
    },
    {
      dataKey: ["certificate.serviceKm"],
      text: serviceKm,
      textSize: 260,
      textFont: MOT_FONTS.kh_koulen,
      textColor: MOT_TEXT_COLORS.blue,
      align: "center",
      x: 2635,
      y: 5401,
    },
    {
      dataKey: ["certificate.serviceZh"],
      text: serviceZh,
      textSize: serviceZhSize,
      textFont: MOT_FONTS.simsun,
      textColor: MOT_TEXT_COLORS.white,
      align: "center",
      x: 2437,
      y: 6282,
    },
    {
      dataKey: ["certificate.service"],
      text: service,
      textSize: serviceSize,
      textFont: MOT_FONTS.brlnsdb,
      textColor: MOT_TEXT_COLORS.white,
      align: "center",
      x: 2437,
      y: 6615.5,
    },
  ];

  for (const text of MOT_TEXTS) {
    if (text.length > 0) {
      for (const index in text) {
        const textItem = text[index];
        let lastItem;
        if (index > 0) lastItem = text[index - 1];

        if (!textItem.x) {
          const lastFont = resolveFont(MOT_FONTS.Khmer, 24, lastItem);
          ctx.font = lastFont;
          const lastItemMetric = ctx.measureText(lastItem.text);
          textItem.x = lastItem.x + lastItemMetric.width + textItem.addX;
        }

        if (!textItem.y) textItem.y = lastItem.y;

        drawTextItem(
          canvas,
          ctx,
          textItem,
          MOT_FONTS.kh_koulen,
          certificateInfo,
        );
      }
    } else
      drawTextItem(canvas, ctx, text, MOT_FONTS.kh_koulen, certificateInfo);
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 3796, 5580, 1165);
  } else {
    const qrBlank = await loadImage(
      path.join(process.cwd(), "assets", "qr-bg-v2.png"),
    );
    if (qrBlank) {
      ctx.drawImage(qrBlank, 3796, 5580, 1165, (1165 * 148) / 120);
    }
  }

  if (preview === true || preview === "true") {
    drawPreview(canvas, ctx, {
      rotate: -45,
      color: "#DCDCDC",
      text: "Preview",
      fontFamily: certificateInfo.previewFontFamily,
    });
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
