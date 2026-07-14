import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, loadRemoteResource, drawPreview } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createMoTContractualCard(
  certificateInfo = {},
  qrcodeContent,
  preview
) {
  const MOT_TEXT_COLORS = {
    blue: "#273580",
    black: "#000000",
  };

  const MOT_FONTS = {
    Khmer: "Khmer OS Muol Light",
    English: "Roboto Condensed",
    secondary: "Khmer OS Battambang",
  };

  const MOT_TEMPLATE_IMAGE = "mot-official-card.jpg";

  const nameKm = _.get(certificateInfo, "recipient.nameKm"); 
  const name = _.get(certificateInfo, "recipient.name");
  const positionKm = _.get(certificateInfo, "recipient.positionKm");
  const position = _.get(certificateInfo, "recipient.position");

  let namePositionData = [
    {
      dataKeys: ["recipient.nameKm"],
      text: nameKm,
      textSize: 80,
      textFont: MOT_FONTS.Khmer,
    },
    {
      dataKeys: ["recipient.name"],
      text: name,
      textSize: 80,
      textFont: MOT_FONTS.English,

    },
    {
      dataKeys: ["recipient.positionKm"],
      text: positionKm,
      textSize: 80,
      textFont: MOT_FONTS.Khmer,
    },
    {
      dataKeys: ["recipient.position"],
      text: position,
      textSize: 80,
      textFont: MOT_FONTS.English,
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

  const MAX_WIDTH = 1065;

  const nameKmFontSize = adjustFontSize(ctx, namePositionData[0], MAX_WIDTH);
  const nameFontSize = adjustFontSize(ctx, namePositionData[1], MAX_WIDTH);
  const positionKmFontSize = adjustFontSize(
    ctx,
    namePositionData[2],
    MAX_WIDTH
  );
  const positionFontSize = adjustFontSize(ctx, namePositionData[3], MAX_WIDTH);
  const MOT_TEXTS = [
    {
      dataKeys: ["recipient.nameKm"],
      text: "{recipient.nameKm}",
      textSize: nameKmFontSize,
      textColor: MOT_TEXT_COLORS.blue,
      textFont: MOT_FONTS.Khmer,
      x: 1032.3,
      y: 2200.7,
    },
    {
      dataKeys: ["recipient.name"],
      text: "{recipient.name}",
      textSize: nameFontSize,
      textColor: MOT_TEXT_COLORS.blue,
      textFont: MOT_FONTS.English,
      x: 1032.3,
      y: 2325.7,
    },
    {
      dataKeys: ["recipient.positionKm"],
      text: "{recipient.positionKm}",
      textSize: positionKmFontSize,
      textColor: MOT_TEXT_COLORS.blue,
      textFont: MOT_FONTS.Khmer,
      x: 1032.3,
      y: 2477.7,
    },
    {
      dataKeys: ["recipient.position"],
      text: "{recipient.position}",
      textSize: positionFontSize,
      textColor: MOT_TEXT_COLORS.blue,
      textFont: MOT_FONTS.English,
      x: 1032.3,
      y: 2596.7,
    }
  ];

  // Draw Caption
  for (const text of MOT_TEXTS) {
    const value = _.get(certificateInfo, text.key, "");
    if (value !== "null" && value !== null) {
      if (text.dataKeys && text.dataKeys.length > 0) {
        for (const key of text.dataKeys)
          text.text = text.text.replace(
            `{${key}}`,
            _.get(certificateInfo, key, "")
          );
      }

      if (text.text === "null" || text.text === null) continue;

      drawText(canvas, ctx, text.text, {
        x: text.x,
        y: text.y,
        textColor: text.textColor || MOT_TEXT_COLORS.black,
        align: text.align,
        font: resolveFont(MOT_FONTS.primary, 24, text),
      });
    }
  }

  for (const text of MOT_TEXTS) {
    if (text.length > 0) {
      for (const index in text) {
        const textItem = text[index];
        let lastItem;
        if (index > 0) lastItem = text[index - 1];

        if (!textItem.x) {
          const lastFont = resolveFont(
            MOT_FONTS.Khmer,
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
          MOT_FONTS.Khmer,
          certificateInfo
        );
      }
    } else
      drawTextItem(
        canvas,
        ctx,
        text,
        MOT_FONTS.Khmer,
        certificateInfo
      );
  }

  
  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 219, 2574, 500);
  }

  if (preview === true || preview === "true") {
    drawPreview(canvas, ctx, {
      rotate: -45,
      color: "#DCDCDC",
      text: "Preview",
      fontFamily: certificateInfo.previewFontFamily,
    });
  }

  // draw profile photo
  if (certificateInfo.recipient.photoBase64) {
    const profileImage = await loadRemoteResource(
      certificateInfo.recipient.photoBase64
    );
    if (profileImage) {
      const maxImgBoxWidth = 961;
      const maxImgBoxHeight = 1061;

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
      const profileX = 666.3;
      const profileY = 1024.4;
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
export async function   drawQrCodeStandard(
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
