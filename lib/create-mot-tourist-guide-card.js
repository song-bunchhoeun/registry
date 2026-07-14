import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import {
  createTemplateImage,
  drawText,
  loadRemoteResource,
  drawPreview,
} from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createMoTTouristGuideCard(
  certificateInfo = {},
  qrcodeContent,
  preview,
) {
  const MOT_TEXT_COLORS = {
    black: "#000000",
  };

  const MOT_FONTS = {
    khmer: "Khmer M1",
    english: "AKbalthom Freedom Plus",
  };

  // const MOT_TEMPLATE_IMAGE = "mot-tourism-card-blank.jpg";
  const MOT_TEMPLATE_IMAGE = "mot-tourism-card-blank-v2.jpg";

  function convertDateKm(dateStr) {
    const khmerNums = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    const khmerMonths = [
      "មករា",
      "កុម្ភៈ",
      "មីនា",
      "មេសា",
      "ឧសភា",
      "មិថុនា",
      "កក្កដា",
      "សីហា",
      "កញ្ញា",
      "តុលា",
      "វិច្ឆិកា",
      "ធ្នូ",
    ];
    const [d, m, y] = dateStr.split("-");
    const toKhmer = (n) =>
      n
        .split("")
        .map((ch) => khmerNums[ch])
        .join("");
    return `${toKhmer(y)} ${khmerMonths[m - 1]} ${toKhmer(d)}`;
  }

  const expiredDateKm = certificateInfo.certificate.expiredDate;
  const expiredDate = certificateInfo.certificate.expiredDate.split("-");

  const resultExpiredDate =
    expiredDate[2] + "-" + expiredDate[1] + "-" + expiredDate[0];

  const nameKm = _.get(certificateInfo, "recipient.nameKm");
  const name = _.get(certificateInfo, "recipient.nameKm");
  const zoneKm = _.get(certificateInfo, "certificate.zoneKm");
  const zone = _.get(certificateInfo, "certificate.zone");
  const languageKm = _.get(certificateInfo, "recipient.languageKm");
  const language = _.get(certificateInfo, "recipient.language");
  const code = _.get(certificateInfo, "certificate.code");

  let TEXTS = [
    {
      dataKeys: ["recipient.nameKm"],
      text: nameKm,
      textSize: 30,
      textColor: MOT_TEXT_COLORS.black,
      textFont: MOT_FONTS.khmer,
      x: 186.3,
      y: 330.2,
    },
    {
      dataKeys: ["recipient.name"],
      text: name,
      textSize: 30,
      textColor: MOT_TEXT_COLORS.black,
      textFont: MOT_FONTS.english,
      x: 186.3,
      y: 385.2,
    },
    {
      dataKeys: ["certificate.zoneKm"],
      text: zoneKm,
      textSize: 30,
      textColor: MOT_TEXT_COLORS.black,
      textFont: MOT_FONTS.khmer,
      x: 186.3,
      y: 440,
    },
    {
      dataKeys: ["certificate.zone"],
      text: zone,
      textSize: 30,
      textColor: MOT_TEXT_COLORS.black,
      textFont: MOT_FONTS.english,
      x: 186.3,
      y: 495.6,
    },
    {
      dataKeys: ["recipient.languageKm"],
      text: languageKm,
      textSize: 30,
      textColor: MOT_TEXT_COLORS.black,
      textFont: MOT_FONTS.khmer,
      x: 186.3,
      y: 550,
    },
    {
      dataKeys: ["recipient.language"],
      text: language,
      textSize: 30,
      textColor: MOT_TEXT_COLORS.black,
      textFont: MOT_FONTS.english,
      x: 186.3,
      y: 605.4,
    },
    {
      dataKeys: [""],
      text: convertDateKm(expiredDateKm),
      textSize: 30,
      textColor: MOT_TEXT_COLORS.black,
      textFont: MOT_FONTS.khmer,
      x: 186.3,
      y: 660.5,
    },
    {
      dataKeys: [""],
      text: resultExpiredDate,
      textSize: 30,
      textColor: MOT_TEXT_COLORS.black,
      textFont: MOT_FONTS.english,
      x: 186.3,
      y: 715.3,
    },
    {
      dataKeys: ["certificate.code"],
      text: "CODE    : " + "{certificate.code}",
      textSize: 25,
      textColor: MOT_TEXT_COLORS.black,
      textFont: MOT_FONTS.english,
      x: 196.5,
      // y: 1589.6,
      y: 1608,
    },
    {
      dataKeys: ["recipient.name"],
      text: "NAMES : " + certificateInfo.recipient.name.toUpperCase(),
      textSize: 25,
      textColor: MOT_TEXT_COLORS.black,
      textFont: MOT_FONTS.english,
      x: 196.5,
      // y: 1627,
      y: 1645,
    },
  ];

  const getTextMaxWidth = (ctx, textItem) => {
    ctx.font = resolveFont(textItem.textFont, textItem.textSize, textItem);
    const targetMatric = ctx.measureText(textItem.text);
    return targetMatric;
  };

  const bg = await createTemplateImage(MOT_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

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

  const nameKmFontSize = adjustFontSize(ctx, TEXTS[0], 440);
  const nameFontSize = adjustFontSize(ctx, TEXTS[1], 440);
  const zoneKmFontSize = adjustFontSize(ctx, TEXTS[2], 440);
  const zoneFontSize = adjustFontSize(ctx, TEXTS[3], 440);
  const languageKmFontSize = adjustFontSize(ctx, TEXTS[4], 440);
  const languageFontSize = adjustFontSize(ctx, TEXTS[5], 440);
  const expiredDateKmFontSize = adjustFontSize(ctx, TEXTS[6], 440);
  const expiredDateFontSize = adjustFontSize(ctx, TEXTS[7], 440);
  const codeFontSize = adjustFontSize(ctx, TEXTS[8], 440);

  TEXTS = [
    {
      dataKeys: ["recipient.nameKm"],
      text: "{recipient.nameKm}",
      textSize: nameKmFontSize,
      textColor: MOT_TEXT_COLORS.black,
      textFont: MOT_FONTS.khmer,
      x: 186.3,
      y: 330.2,
    },
    {
      dataKeys: ["recipient.name"],
      text: "{recipient.name}",
      textSize: nameFontSize,
      textColor: MOT_TEXT_COLORS.black,
      textFont: MOT_FONTS.english,
      x: 186.3,
      y: 385.2,
    },
    {
      dataKeys: ["certificate.zoneKm"],
      text: "{certificate.zoneKm}",
      textSize: zoneKmFontSize,
      textColor: MOT_TEXT_COLORS.black,
      textFont: MOT_FONTS.khmer,
      x: 186.3,
      y: 440,
    },
    {
      dataKeys: ["certificate.zone"],
      text: "{certificate.zone}",
      textSize: zoneFontSize,
      textColor: MOT_TEXT_COLORS.black,
      textFont: MOT_FONTS.english,
      x: 186.3,
      y: 495.6,
    },
    {
      dataKeys: ["recipient.languageKm"],
      text: "{recipient.languageKm}",
      textSize: languageKmFontSize,
      textColor: MOT_TEXT_COLORS.black,
      textFont: MOT_FONTS.khmer,
      x: 186.3,
      y: 550,
    },
    {
      dataKeys: ["recipient.language"],
      text: "{recipient.language}",
      textSize: languageFontSize,
      textColor: MOT_TEXT_COLORS.black,
      textFont: MOT_FONTS.english,
      x: 186.3,
      y: 605.4,
    },
    {
      dataKeys: [""],
      text: convertDateKm(expiredDateKm),
      textSize: expiredDateKmFontSize,
      textColor: MOT_TEXT_COLORS.black,
      textFont: MOT_FONTS.khmer,
      x: 186.3,
      y: 660.5,
    },
    {
      dataKeys: [""],
      text: resultExpiredDate,
      textSize: expiredDateFontSize,
      textColor: MOT_TEXT_COLORS.black,
      textFont: MOT_FONTS.english,
      x: 186.3,
      y: 715.3,
    },
    {
      dataKeys: ["certificate.code"],
      text: "CODE    : " + "{certificate.code}",
      textSize: codeFontSize,
      textColor: MOT_TEXT_COLORS.black,
      textFont: MOT_FONTS.english,
      x: 196.5,
      y: 1608,
    },
    {
      dataKeys: ["recipient.name"],
      text: "NAMES : " + certificateInfo.recipient.name.toUpperCase(),
      textSize: nameFontSize,
      textColor: MOT_TEXT_COLORS.black,
      textFont: MOT_FONTS.english,
      x: 196.5,
      y: 1645,
    },
  ];

  for (const text of TEXTS) {
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

        drawTextItem(canvas, ctx, textItem, MOT_FONTS.Khmer, certificateInfo);
      }
    } else drawTextItem(canvas, ctx, text, MOT_FONTS.khmer, certificateInfo);
  }

  if (qrcodeContent) {
    const qrWidth = 270;
    const qrX = (canvas.width - qrWidth) / 2;
    await drawQrCodeStandard(qrcodeContent, ctx, qrX, 1223, qrWidth);
  }

  if (preview === true || preview === "true") {
    drawPreview(canvas, ctx, {
      rotate: -45,
      color: "#DCDCDC",
      text: "Preview",
      fontFamily: certificateInfo.previewFontFamily,
    });
  }

  if (certificateInfo.recipient.photoBase64) {
    const profileImage = await loadRemoteResource(
      certificateInfo.recipient.photoBase64,
    );
    if (profileImage) {
      const maxImgBoxWidth = 162;
      const maxImgBoxHeight = 193;

      // get the scale
      // it is the min of the 2 ratios
      let scale_factor = Math.min(
        maxImgBoxWidth / profileImage.width,
        maxImgBoxHeight / profileImage.height,
      );

      // Lets get the new width and height based on the scale factor
      let newWidth = profileImage.width * scale_factor;
      let newHeight = profileImage.height * scale_factor;

      // const profileHeight = profileMaxWidth / (profileImage.width / profileImage.height);
      const profileX = 457.4;
      const profileY = 297;
      ctx.drawImage(profileImage, profileX, profileY, newWidth, newHeight);
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
    font: resolveFont(FONTS, 24, textItem),
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
