import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, loadRemoteResource } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createMoTInterpreterCard(
  certificateInfo = {},
  qrcodeContent
) {
  const MOT_TEXT_COLORS = {
    black: "#040404",
    // black: "#f00000",
  };

  const MOT_FONTS = {
    khmer: "Khmer OS Muol Light",
    english: "AKbalthom Freedom Plus",
    secondary: "Khmer OS Battambang",
  };

  //   const MOT_TEMPLATE_IMAGE = "mot-tourism-card-blank-v2-sample.jpg";
  const MOT_TEMPLATE_IMAGE = "mot-tourism-card-blank-v2.jpg";

  const name = _.get(certificateInfo, "recipient.name", "");
  const names = _.get(certificateInfo, "certificate.names", "");
  const licenseType = _.get(certificateInfo, "certificate.licenseType", "");
  const code = _.get(certificateInfo, "certificate.code", "");
  const passport = _.get(certificateInfo, "recipient.passport", "");
  const expired = certificateInfo.certificate.expiredDate.split("-");

  const expiry = expired[2] + "-" + expired[1] + "-" + expired[0];

  let nameData = [
    {
      dataKeys: ["recipient.name"],
      text: name,
      textSize: 29,
      textFont: MOT_FONTS.english,
      textStyle: "bold",
    },
    {
      dataKeys: ["certificate.licenseType"],
      text: licenseType,
      textSize: 29,
      textFont: MOT_FONTS.english,
      textStyle: "bold",
    },
    {
      dataKeys: ["recipient.passport"],
      text: passport,
      textSize: 29,
      textFont: MOT_FONTS.english,
      textStyle: "bold",
    },
    {
      dataKeys: ["recipient.expiredDate"],
      text: expiry,
      textSize: 29,
      textFont: MOT_FONTS.english,
      textStyle: "bold",
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

  const MAX_WIDTH = 373;

  const nameFontSize = adjustFontSize(ctx, nameData[0], MAX_WIDTH);
  const namesFontSize = adjustFontSize(ctx, nameData[0], MAX_WIDTH);
  const licenseTypeFontSize = adjustFontSize(ctx, nameData[1], MAX_WIDTH);
  const codeFontSize = adjustFontSize(ctx, nameData[1], MAX_WIDTH);
  const passportFontSize = adjustFontSize(ctx, nameData[2], MAX_WIDTH);
  const expiryFontSize = adjustFontSize(ctx, nameData[3], MAX_WIDTH);

  const MOT_TEXTS = [
    {
      dataKeys: ["recipient.name"],
      text: name,
      textSize: nameFontSize,
      textColor: MOT_TEXT_COLORS.black,
      textFont: MOT_FONTS.english,
      x: 214,
      y: 478,
    },
    {
      dataKeys: ["certificate.code"],
      text: licenseType,
      textSize: licenseTypeFontSize,
      textColor: MOT_TEXT_COLORS.black,
      textFont: MOT_FONTS.english,
      x: 215.8,
      y: 529.6,
    },
    {
      dataKeys: ["recipient.passport"],
      text: passport,
      textSize: passportFontSize,
      textColor: MOT_TEXT_COLORS.black,
      textFont: MOT_FONTS.english,
      x: 215.8,
      y: 580.4,
      textStyle: "bold",
    },
    {
      dataKeys: ["certificate.expiredDate"],
      text: expiry,
      textSize: expiryFontSize,
      textColor: MOT_TEXT_COLORS.black,
      textFont: MOT_FONTS.english,
      x: 215.8,
      y: 631.3,
      textStyle: "bold",
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

  for (const text of MOT_TEXTS) {
    if (text.length > 0) {
      for (const index in text) {
        const textItem = text[index];
        let lastItem;
        if (index > 0) lastItem = text[index - 1];

        if (!textItem.x) {
          const lastFont = resolveFont(MOT_FONTS.khmer, 24, lastItem);
          ctx.font = lastFont;
          const lastItemMetric = ctx.measureText(lastItem.text);
          textItem.x = lastItem.x + lastItemMetric.width + textItem.addX;
        }

        if (!textItem.y) textItem.y = lastItem.y;

        drawTextItem(canvas, ctx, textItem, MOT_FONTS.khmer, certificateInfo);
      }
    } else drawTextItem(canvas, ctx, text, MOT_FONTS.khmer, certificateInfo);
  }

  if (qrcodeContent) {
    const qrWidth = 270;
    const qrX = (canvas.width - qrWidth) / 2;
    await drawQrCodeStandard(qrcodeContent, ctx, qrX, 1223, qrWidth);
  }

  // draw profile photo
  if (certificateInfo.recipient.photoBase64) {
    const profileImage = await loadRemoteResource(
      certificateInfo.recipient.photoBase64
    );
    if (profileImage) {
      const maxImgBoxWidth = 150;
      const maxImgBoxHeight = 200;

      // get the scale
      // it is the min of the 2 ratios
      let scale_factor = Math.min(
        maxImgBoxWidth / profileImage.width,
        maxImgBoxHeight / profileImage.height
      );

      // Lets get the new width and height based on the scale factor
      let newWidth = profileImage.width * scale_factor;
      let newHeight = profileImage.height * scale_factor;

      // const profileHeight = profileMaxWidth / (profileImage.width / profileImage.height);
      const profileX = 42;
      const profileY = 670;
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
