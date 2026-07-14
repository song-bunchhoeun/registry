import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import {
  createTemplateImage,
  drawText,
  drawWrapTexts,
  loadRemoteResource,
} from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createMoINFOConstractStaffCardFront(
  certificateInfo = {},
  qrcodeContent,
) {
  const MPTC_TEXT_COLORS = {
    blue: "#283891",
  };

  const MPTC_FONTS = {
    primary: "Khmer OS Siemreap",
    secondary: "Khmer OS Muol Light",
    thirdly: "Times New Roman",
  };

  const MPTC_TEMPLATE_IMAGE = "moinfo-contract-staff-card-front.jpg";

  let MPTC_TEXTS = [
    {
      dataKeys: ["recipient.genderKm"],
      text: "{recipient.genderKm}",
      textSize: 108,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.secondary,
      x: 3010,
      y: 185,
      align: "left",
    },
    {
      dataKeys: ["recipient.dateOfBirthKm"],
      text: "{recipient.dateOfBirthKm}",
      textSize: 108,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.secondary,
      x: 1654,
      y: 387,
      align: "left",
    },
    {
      dataKeys: ["certificate.signatureDateKm"],
      text: "{certificate.signatureDateKm}",
      textSize: 81,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.primary,
      x: 2330,
      y: 1403,
      align: "center",
    },
    {
      dataKeys: ["certificate.signatureLunarDateKm"],
      text: "{certificate.signatureLunarDateKm}",
      textSize: 81,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.primary,
      x: 2320,
      y: 1252,
      align: "center",
    },
    {
      dataKeys: ["recipient.mediaId"],
      text: "{recipient.mediaId}",
      textSize: 108,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.thirdly,
      textStyle: "bold",
      x: 425,
      y: 1282,
      align: "center",
    },
    {
      dataKeys: ["certificate.expiredDate"],
      text: "{certificate.expiredDate}",
      textSize: 95,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.primary,
      x: 462,
      y: 1933,
      align: "center",
    },
  ];

  let measureData = [
    {
      dataKeys: ["recipient.nameKm"],
      text: _.get(certificateInfo, "recipient.nameKm"),
      textSize: 108,
      textFont: MPTC_FONTS.secondary,
    },
    {
      dataKeys: ["recipient.addressKm"],
      text: _.get(certificateInfo, "recipient.addressKm"),
      textSize: 108,
      textFont: MPTC_FONTS.secondary,
    },
    {
      dataKeys: ["recipient.organizationKm"],
      text: _.get(certificateInfo, "recipient.organizationKm"),
      textSize: 108,
      textFont: MPTC_FONTS.secondary,
    },
    {
      dataKeys: ["recipient.positionKm"],
      text: _.get(certificateInfo, "recipient.positionKm"),
      textSize: 108,
      textFont: MPTC_FONTS.secondary,
    },
  ];

  const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  const getTextMaxWidth = (ctx, textItem) => {
    const fontFamily = textItem.textFont?.name || textItem.textFont || "Arial";
    const fontSize = textItem.textSize || 12;
    const fontWeight = textItem.textStyle || "";

    let font = "";
    if (fontWeight) font += fontWeight + " ";
    font += fontSize + "px ";
    font += fontFamily;

    ctx.font = font;
    return ctx.measureText(textItem.text);
  };

  const adjustFontSize = (ctx, dataItem, textMaxWidth) => {
    let fontSize = dataItem.textSize;
    let getTextWidth = getTextMaxWidth(ctx, {
      ...dataItem,
      textSize: fontSize,
    });

    if (getTextWidth.width > textMaxWidth) {
      while (getTextWidth.width > textMaxWidth && fontSize > 0) {
        fontSize -= 0.5;
        getTextWidth = getTextMaxWidth(ctx, {
          ...dataItem,
          textSize: fontSize,
        });
      }
    }
    return fontSize;
  };

  let nameKmFontSize = adjustFontSize(ctx, measureData[0], 1070);
  let addressKmFontSize = adjustFontSize(ctx, measureData[1], 3200);
  let organizationKmFontSize = adjustFontSize(ctx, measureData[2], 1659);
  let positionKmFontSize = adjustFontSize(ctx, measureData[3], 1659);

  let reduceFontItems = [
    {
      dataKeys: ["recipient.nameKm"],
      text: "{recipient.nameKm}",
      textSize: nameKmFontSize,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.secondary,
      x: 1654,
      y: 185,
      align: "left",
    },
    {
      dataKeys: ["recipient.organizationKm"],
      text: "{recipient.organizationKm}",
      textSize: organizationKmFontSize,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.secondary,
      x: 1660,
      y: 1075,
      align: "left",
    },
    {
      dataKeys: ["recipient.positionKm"],
      text: "{recipient.positionKm}",
      textSize: positionKmFontSize,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.secondary,
      x: 1654,
      y: 914,
      align: "left",
    },
  ];

  MPTC_TEXTS = [...MPTC_TEXTS, ...reduceFontItems];

  drawWrapTexts(ctx, {
    top: 556,
    left: 887,
    width: 2363,
    textAlignment: "left",
    lineHeight: 1.5,
    spans: [
      {
        text: "ទីលំនៅបច្ចុប្បន្ន    ",
        fontSize: 107,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "500",
      },
      {
        text: certificateInfo.recipient.addressKm,
        fontSize: addressKmFontSize,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "500",
      },
    ],
  }).draw();

  // Draw Caption
  for (const text of MPTC_TEXTS) {
    const value = _.get(certificateInfo, text.key, "");
    if (value !== "null" && value !== null) {
      if (text.dataKeys && text.dataKeys.length > 0) {
        for (const key of text.dataKeys)
          text.text = text.text.replace(
            `{${key}}`,
            _.get(certificateInfo, key, ""),
          );
      }

      if (text.text === "null" || text.text === null) continue;

      drawText(canvas, ctx, text.text, {
        x: text.x,
        y: text.y,
        textColor: text.textColor || MPTC_TEXT_COLORS.black,
        align: text.align,
        font: resolveFont(MPTC_FONTS.primary, 24, text),
      });
    }
  }
  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 881, 1290, 540);
  }

  // draw profile photo
  if (certificateInfo.recipient.photoUrl) {
    const profileImage = await loadRemoteResource(
      certificateInfo.recipient.photoUrl,
    );
    if (profileImage) {
      const maxImgBoxWidth = 722;
      const maxImgBoxHeight = 925;

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
      const profileX = 72;
      const profileY = 86;
      ctx.drawImage(profileImage, profileX, profileY, newWidth, newHeight);
    }
  }
  return canvas;
}
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
const getTextMaxWidth = (ctx, textItem) => {
  ctx.font = resolveFont(textItem.textFont, 24, textItem);
  const kmTargetMatric = ctx.measureText(textItem.text || "");
  return kmTargetMatric;
};
