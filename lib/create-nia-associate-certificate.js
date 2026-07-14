import { Image, createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";
import axios from "axios";
import sharp from "sharp";

export async function createNIAAssociateCertificate(
  certificateInfo = {},
  qrcodeContent
) {
  const DATA = {
    BACKGROUND: {
      // pngFilename: "nia-associate-sample.jpg",
      pngFilename: "nia-associate.jpg",
    },
    FONTS: [
      { name: "Khmer OS Battambang", filename: "KhmerOS_battambang.ttf" },
      { name: "Khmer OS Muol Light", filename: "KhmerOSmuollight.ttf" },
      { name: "Times New Roman", filename: "times.ttf" },
      { name: "Khmer OS Content", filename: "KhmerOScontent.ttf" },
    ],
    TEXTS: [],
  };

  const MPTC_TEXT_COLORS = {
    black: "#000000",
    // black: "red",
    pink: "#F72798",
  };

  const nameKm = _.get(certificateInfo, "recipient.nameKm") ?? "";
  const majorKm = _.get(certificateInfo, "certificate.majorKm") ?? "";
  const name = _.get(certificateInfo, "recipient.name") ?? "";
  const major = _.get(certificateInfo, "certificate.major");

  let nameData = [
    {
      dataKeys: ["recipient.nameKm"],
      text: nameKm,
      textSize: 42.8,
      textFont: { name: "Khmer OS Muol Light" },
    },
    {
      dataKeys: ["certificate.majorKm"],
      text: majorKm,
      textSize: 43,
      textFont: { name: "Khmer OS Muol Light" },
    },
    {
      dataKeys: ["recipient.name"],
      text: name,
      textSize: 47.7,
      textFont: { name: "Times New Roman" },
    },
    {
      dataKeys: ["certificate.major"],
      text: major,
      textSize: 49,
      textFont: { name: "Times New Roman" },
    },
  ];

  const getTextMaxWidth = (ctx, textItem) => {
    ctx.font = resolveFont(textItem.textFont, textItem.textSize, textItem);
    const targetMatric = ctx.measureText(textItem.text);
    return targetMatric;
  };

  const bg = await createTemplateImage(DATA.BACKGROUND.pngFilename);
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

  const nameKmFontSize = adjustFontSize(ctx, nameData[0], 800);
  const majorKmFontSize = adjustFontSize(ctx, nameData[1], 930);
  const nameFontSize = adjustFontSize(ctx, nameData[2], 750);
  const majorFontSize = adjustFontSize(ctx, nameData[3], 1160);

  const KM_TEXTS = [
    {
      dataKeys: ["certificate.logDateKm"],
      text: "{certificate.logDateKm}",
      textSize: 46,
      textFont: { name: "Khmer OS Content" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 1268,
      y: 1087,
      align: "left",
    },
    {
      dataKeys: ["recipient.nameKm"],
      text: nameKm,
      textSize: nameKmFontSize,
      textFont: { name: "Khmer OS Muol Light" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 644,
      y: 1182,
      align: "left",
    },
    {
      dataKeys: ["recipient.dateOfBirthKm"],
      text: "{recipient.dateOfBirthKm}",
      textSize: 45,
      textFont: { name: "Khmer OS Content" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 644,
      y: 1278,
      align: "left",
    },
    {
      dataKeys: ["recipient.placeOfBirthKm"],
      text: "{recipient.placeOfBirthKm}",
      textSize: 45,
      textFont: { name: "Khmer OS Content" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 644,
      y: 1378,
      align: "left",
    },
    {
      dataKeys: ["certificate.degreeKm"],
      text: "{certificate.degreeKm}",
      textSize: 46,
      textFont: { name: "Khmer OS Muol Light" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 644,
      y: 1570,
      align: "left",
    },
    {
      dataKeys: ["certificate.majorKm"],
      text: majorKm,
      textSize: majorKmFontSize,
      textFont: { name: "Khmer OS Muol Light" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 644,
      y: 1667,
      align: "left",
    },
  ];

  const EN_TEXTS = [
    {
      dataKeys: ["certificate.logDate"],
      text: "{certificate.logDate}",
      textSize: 45,
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 2925,
      y: 1085,
      align: "left",
    },
    {
      dataKeys: ["recipient.name"],
      text: name,
      textSize: nameFontSize,
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      textStyle: " bold",
      x: 2318,
      y: 1186,
      align: "left",
    },
    {
      dataKeys: ["recipient.dateOfBirth"],
      text: "{recipient.dateOfBirth}",
      textSize: 49,
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 2318,
      y: 1280,
      align: "left",
    },
    {
      dataKeys: ["recipient.placeOfBirth"],
      text: "{recipient.placeOfBirth}",
      textSize: 48,
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 2318,
      y: 1377,
      align: "left",
    },
    {
      dataKeys: ["certificate.degree"],
      text: "{certificate.degree}",
      textSize: 49,
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      textStyle: "bold",
      x: 2000,
      y: 1572,
      align: "left",
    },
    {
      dataKeys: ["certificate.major"],
      text: major,
      textSize: majorFontSize,
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      textStyle: "bold",
      x: 2067,
      y: 1669,
      align: "left",
    },
    {
      dataKeys: ["certificate.number"],
      text: "{certificate.number}",
      textSize: 48,
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 1805,
      y: 1800,
      align: "left",
    },
    {
      dataKeys: ["certificate.presidentSignDate"],
      text: "{certificate.presidentSignDate}",
      textSize: 48,
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 2624,
      y: 1777,
      align: "center",
    },
  ];

  let profileX;
  let profileY;
  let imgSize = [];
  let sizeBy;

  // draw profile photo
  if (certificateInfo.recipient.photoUrl) {
    let resBuffer;
    try {
      const response = await axios({
        url: certificateInfo.recipient.photoUrl,
        responseType: "arraybuffer",
      });
      resBuffer = response.data;
      const rotatedBuffer = await sharp(resBuffer)
        .rotate()
        .jpeg({ quality: 100 })
        .toBuffer();
      resBuffer = rotatedBuffer.buffer;
    } catch (err) {
      console.log(err);
    }

    const img = sharp(resBuffer, { failOn: "truncated" });
    const maxY = 1585;
    const maxImgBoxWidth = 333;
    const maxImgBoxHeight = 388;
    profileX = bg.width / 2 + 1.5;
    let imgSize = [];
    let resizedBuffer;

    const wImg = img.clone();
    const wToBuffer = await wImg
      .resize({ width: maxImgBoxWidth, fit: sharp.fit.contain })
      .jpeg({ quality: 100 })
      .toBuffer({ resolveWithObject: true });
    imgSize = [wToBuffer.info.width, wToBuffer.info.height];
    resizedBuffer = wToBuffer.data;
    sizeBy = "width";

    if (imgSize[1] > maxImgBoxHeight) {
      const hImg = img.clone();
      const hToBuffer = await hImg
        .resize({ height: maxImgBoxHeight, fit: sharp.fit.contain })
        .jpeg({ quality: 100 })
        .toBuffer({ resolveWithObject: true });
      imgSize = [hToBuffer.info.width, hToBuffer.info.height];
      resizedBuffer = hToBuffer.data;
      sizeBy = "height";
    }

    profileY = maxY - imgSize[1];
    const image = new Image();
    image.src = resizedBuffer;
    profileX = profileX - imgSize[0] / 2;
    profileY -= 3;
    ctx.drawImage(image, profileX, profileY, imgSize[0], imgSize[1]);
  }

  DATA.TEXTS = [...DATA.TEXTS, ...KM_TEXTS, ...EN_TEXTS];

  // Draw Caption
  for (const text of DATA.TEXTS) {
    if (text.length > 0) {
      for (const index in text) {
        const textItem = text[index];
        let lastItem;
        if (index > 0) lastItem = text[index - 1];

        if (!textItem.x) {
          const lastFont = resolveFont(DATA.FONTS[0].name, 24, lastItem);
          ctx.font = lastFont;
          const lastItemMetric = ctx.measureText(lastItem.text);
          textItem.x = lastItem.x + lastItemMetric.width + textItem.addX;
        }

        if (!textItem.y) textItem.y = lastItem.y;

        drawTextItem(
          canvas,
          ctx,
          textItem,
          DATA.FONTS[0].name,
          certificateInfo
        );
      }
    } else drawTextItem(canvas, ctx, text, DATA.FONTS[0].name, certificateInfo);
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 1614, 1854, 292);
  } else {
    const qrBlank = await loadImage(
      path.join(process.cwd(), "assets", "qr-bg-v2-sample.png")
    );
    if (qrBlank) {
      ctx.drawImage(qrBlank, 1614, 1854, 292, 362);
    }
  }
  //{ canvas, profileX, profileY, sizeBy }
  return canvas;
}

const drawTextItem = (canvas, ctx, textItem, defaultFont, certificateInfo) => {
  if (textItem.dataKeys && textItem.dataKeys.length > 0) {
    for (const key of textItem.dataKeys)
      textItem.text = textItem.text.replace(
        `{${key}}`,
        _.get(certificateInfo, key, "")
      );
  }

  if (textItem.scale) {
    ctx.strokeStyle = textItem.strokeColor;
    ctx.lineWidth = textItem.strokeLine;
    ctx.fillStyle = textItem.textColor;
    ctx.font = resolveFont(defaultFont, 24, textItem);
    ctx.save(); // Save the current context settings
    ctx.scale(textItem.scale, 1); // Scale horizontally while maintaining vertical scale
    ctx.strokeText(textItem.text, textItem.x / textItem.scale, textItem.y);
    ctx.fillText(textItem.text, textItem.x / textItem.scale, textItem.y); // Divide x position by scale to offset the scaling effect
    ctx.restore();
  } else {
    drawText(canvas, ctx, textItem.text, {
      x: textItem.x,
      y: textItem.y,
      textColor: textItem.textColor || MPTC_TEXT_COLORS.black,
      align: textItem.align,
      font: resolveFont(defaultFont, 24, textItem),
      strokeLine: textItem.strokeLine || 0,
      strokeColor: textItem.strokeColor,
      textMaxWidth: textItem.textMaxWidth,
    });
  }
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
  const fontName = text.textFont ? text.textFont.name : defaultFont;

  font += text.textStyle ? text.textStyle + space : "";
  font += text.textSize ? text.textSize : defaultSize;
  font += "px" + space;
  font += fontName;
  return font;
}
