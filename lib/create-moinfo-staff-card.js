import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, loadRemoteResource } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createMoINFOStaffCard(
  certificateInfo = {},
  qrcodeContent,
) {
  const addressKm = _.get(certificateInfo, "recipient.addressKm", "");

  const MPTC_TEXT_COLORS = {
    blue: "#283891",
    red: "#f00000",
  };

  const MPTC_FONTS = {
    primary: "Khmer OS Siemreap",
    secondary: "Khmer OS Muol Light",
    thirdly: "Times New Roman",
  };

  const MPTC_TEMPLATE_IMAGE = "moinfo-staff-card-front-only.png";
  // const MPTC_TEMPLATE_IMAGE ='moinfo-staff-card-data.png'

  const maxAddressKmWidth = 30;
  let addressKmKmLines = [];

  if (addressKm.length > maxAddressKmWidth) {
    const words = addressKm.split(" ");
    let currentaddressKmLine = "";
    for (const word of words) {
      if (currentaddressKmLine.length + word.length <= maxAddressKmWidth) {
        currentaddressKmLine += (currentaddressKmLine === "" ? "" : " ") + word;
      } else {
        addressKmKmLines.push(currentaddressKmLine);
        currentaddressKmLine = word;
      }
    }
    if (currentaddressKmLine !== "") {
      addressKmKmLines.push(currentaddressKmLine);
    }
  } else {
    addressKmKmLines.push(addressKm);
  }

  let MPTC_TEXTS = [
    {
      dataKeys: ["recipient.nameKm"],
      text: certificateInfo.recipient.nameKm,
      textSize: 108,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.secondary,
      x: 1654,
      y: 185,
      align: "left",
    },
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
      dataKeys: ["recipient.addressKm"],
      text: addressKmKmLines[0] ? addressKmKmLines[0] : "",
      textSize: 108,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.secondary,
      x: 1654,
      y: 552,
      align: "left",
    },
    {
      dataKeys: ["recipient.addressKm"],
      text: `${addressKmKmLines[1] ? addressKmKmLines[1] : ""} ${addressKmKmLines[2] ? addressKmKmLines[2] : ""} ${addressKmKmLines[3] ? addressKmKmLines[3] : ""}`,
      textSize: 108,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.secondary,
      x: 894,
      y: 735,
      align: "left",
    },
    {
      dataKeys: ["recipient.positionKm"],
      text: certificateInfo.recipient.positionKm,
      textSize: 108,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.secondary,
      x: 1654,
      y: 914,
      align: "left",
    },
    {
      dataKeys: ["recipient.organizationKm"],
      text: certificateInfo.recipient.organizationKm,
      textSize: 108,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.secondary,
      x: 1654,
      y: 1075,
      align: "left",
    },
    {
      dataKeys: ["certificate.signatureDateKm"],
      text: "{certificate.signatureDateKm}",
      textSize: 81,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.primary,
      x: 2320 + 10,
      y: 1423,
      align: "center",
    },
    {
      dataKeys: ["certificate.signatureLunarDateKm"],
      text: "{certificate.signatureLunarDateKm}",
      textSize: 81,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.primary,
      x: 2320,
      y: 1282,
      align: "center",
    },
    {
      dataKeys: ["recipient.id"],
      text: "{recipient.id}",
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

  const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  const organizationeMetric = getTextMaxWidth(ctx, {
    dataKeys: [],
    text: _.get(certificateInfo, "recipient.organizationKm"),
    textSize: 108,
    textColor: MPTC_TEXT_COLORS.blue,
    textFont: MPTC_FONTS.secondary,
    x: 1654,
    y: 185,
    align: "left",
  });

  if (organizationeMetric.width > 1660) {
    MPTC_TEXTS[MPTC_TEXTS.length - 1].textSize = 80;
  }

  // decrease font size
  MPTC_TEXTS[0].textSize = decreaseByWidth(ctx, MPTC_TEXTS[0], 1025);
  MPTC_TEXTS[3].textSize = decreaseByWidth(ctx, MPTC_TEXTS[3], 1620);
  MPTC_TEXTS[4].textSize = decreaseByWidth(ctx, MPTC_TEXTS[4], 2415);
  MPTC_TEXTS[6].textSize = decreaseByWidth(ctx, MPTC_TEXTS[6], 1620);

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
    await drawQrCodeStandard(qrcodeContent, ctx, 881, 1320, 500);
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
  // draw photo stamp emboss
  const stampEmboss = await loadImage(
    path.join(process.cwd(), "assets", "moinfo-sign&stamp.png"),
  );
  if (stampEmboss) {
    ctx.drawImage(stampEmboss, 1645, 1108 /* 1186 + 60 */, 1440, 1020 - 100);
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
  const kmTargetMatric = ctx.measureText(textItem.text);
  return kmTargetMatric;
};
function decreaseByWidth(ctx, textItem, prefixWidth) {
  let isLong = true;
  while (isLong) {
    let textWidth = getTextMaxWidth(ctx, textItem);
    if (textWidth.width > prefixWidth) {
      textItem.textSize -= 1;
    } else {
      isLong = false;
      break;
    }
  }

  return textItem.textSize;
}
