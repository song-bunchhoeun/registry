import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, loadRemoteResource } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createNIEPhdCertificateCanvas(
  certificateInfo = {},
  qrcodeContent
) {
  const NIE_TEXT_COLORS = {
    black: "#000000",
  };

  const NIE_FONTS = {
    muol: "Khmer OS Muol Light",
    times: "Times New Roman",
    content: "Khmer OS Content",
  };

  const degree = _.get(certificateInfo, "certificate.degree", "").replace(
    /^doctor\s+of\s+philosophy\s+in\s*/i,
    ""
  );
  const major = _.get(certificateInfo, "certificate.major", "");

  const NIE_TEMPLATE_IMAGE = "nie-phd.jpg";
  const NIE_TEXTS = [
    {
      dataKeys: ["certificate.logDateKm"],
      text: "{certificate.logDateKm}",
      textSize: 45,
      textStyle: "semi-bold",
      textColor: NIE_TEXT_COLORS.black,
      textFont: NIE_FONTS.content,
      align: "center",
      x: 1174.5,
      y: 998,
    },
    {
      dataKeys: ["certificate.logDate"],
      text: "{certificate.logDate}",
      textSize: 45,
      textStyle: "semi-bold",
      textColor: NIE_TEXT_COLORS.black,
      textFont: NIE_FONTS.times,
      align: "center",
      x: 2560.5,
      y: 996,
    },
    {
      dataKeys: ["recipient.nameKm"],
      text: "{recipient.nameKm}",
      textSize: 45,
      textStyle: "normal",
      textColor: NIE_TEXT_COLORS.black,
      textFont: NIE_FONTS.muol,
      align: "center",
      x: 1051.3,
      y: 1162,
    },
    {
      dataKeys: ["recipient.name"],
      text: "{recipient.name}",
      textSize: 50,
      textStyle: "semi-bold",
      textColor: NIE_TEXT_COLORS.black,
      textFont: NIE_FONTS.times,
      align: "center",
      x: 2612.2,
      y: 1162,
    },
    {
      dataKeys: ["recipient.dateOfBirthKm"],
      text: "{recipient.dateOfBirthKm}",
      textSize: 44,
      textStyle: "semi-bold",
      textColor: NIE_TEXT_COLORS.black,
      textFont: NIE_FONTS.content,
      align: "center",
      x: 1045.5,
      y: 1246.2,
    },
    {
      dataKeys: ["recipient.dateOfBirth"],
      text: "{recipient.dateOfBirth}",
      textSize: 50,
      textStyle: "600",
      textColor: NIE_TEXT_COLORS.black,
      textFont: NIE_FONTS.times,
      align: "center",
      x: 2612.2,
      y: 1246.2,
    },
    {
      dataKeys: ["certificate.majorKm"],
      text: "{certificate.majorKm}",
      textSize: 44,
      textStyle: "normal",
      textColor: NIE_TEXT_COLORS.black,
      textFont: NIE_FONTS.muol,
      align: "center",
      x: 1045.5,
      y: 1411,
    },
    {
      dataKeys: ["certificate.number"],
      text: "{certificate.number}",
      textSize: 40,
      textStyle: "normal",
      textColor: NIE_TEXT_COLORS.black,
      textFont: NIE_FONTS.content,
      x: 1654.5,
      y: 1773.4,
    },
  ];

  const DEGREE_MAJOR_TEXTS = [
    {
      dataKeys: ["certificate.degree", "certificate.major"],
      text: `${degree} Specialized in ${major}`,
      textSize: 50,
      textStyle: "semi-bold",
      textColor: NIE_TEXT_COLORS.black,
      textFont: NIE_FONTS.times,
      x: 1788,
      y: 1411,
    },
  ];

  const bg = await createTemplateImage(NIE_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  const getTextMaxWidth = (ctx, textItem) => {
    ctx.font = resolveFont(textItem.textFont, textItem.textSize, textItem);
    const targetMatric = ctx.measureText(textItem.text);
    return targetMatric;
  };

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

  const degreeMajorFontSize = adjustFontSize(ctx, DEGREE_MAJOR_TEXTS[0], 1382);

  const NEW_DEGREE_MAJOR_TEXTS = [
    {
      dataKeys: ["certificate.degree", "certificate.major"],
      text: `${degree} Specialized in ${major}`,
      textSize: degreeMajorFontSize,
      textStyle: "semi-bold",
      textColor: NIE_TEXT_COLORS.black,
      textFont: NIE_FONTS.times,
      x: 1788,
      y: 1411,
    },
  ];

  NIE_TEXTS.push(...NIE_TEXTS, ...NEW_DEGREE_MAJOR_TEXTS);

  // Draw Caption
  for (const text of NIE_TEXTS) {
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
      textColor: text.textColor || NIE_TEXT_COLORS.black,
      align: text.align,
      font: resolveFont(NIE_FONTS.primary, 24, text),
    });
  }
  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 2927.3, 1810, 320);
  }

  // draw profile photo
  if (certificateInfo.recipient.photoBase64) {
    const profileImage = await loadRemoteResource(
      certificateInfo.recipient.photoBase64
    );
    if (profileImage) {
      const profileMaxWidth = 260;
      const profileHeight =
        profileMaxWidth / (profileImage.width / profileImage.height);
      const profileX = 1623;
      const profileY = 1800;
      ctx.drawImage(
        profileImage,
        profileX,
        profileY,
        profileMaxWidth,
        profileHeight
      );
    }
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
// 'style size fontName' ex:'semi-bold 20px Arial'
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
