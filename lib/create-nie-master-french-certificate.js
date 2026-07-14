import { Image, createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";
import axios from "axios";
import sharp from "sharp";

export async function createNIEMasterFrenchCertificate(
  certificateInfo = {},
  qrcodeContent
) {
  const DATA = {
    BACKGROUND: {
      pngFilename: "nie-master-fr.jpg",
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
    pink: "#F72798",
  };

  const degreeKm = _.get(certificateInfo, "certificate.degreeKm") ?? "";
  const nameKm = _.get(certificateInfo, "recipient.nameKm") ?? "";
  const secondDegreeKm = _.get(certificateInfo, "certificate.degreeKm") ?? "";
  const majorKm = _.get(certificateInfo, "certificate.majorKm") ?? "";
  const degreeFr = _.get(certificateInfo, "certificate.degreeFr") ?? "";
  const nameFr = _.get(certificateInfo, "recipient.nameFr") ?? "";
  const majorFr = _.get(certificateInfo, "certificate.majorFr") ?? "";
  const secondDegreeFr = _.get(certificateInfo, "certificate.degreeFr") ?? "";

  let nameData = [
    {
      dataKeys: ["certificate.degreeKm"],
      text: degreeKm,
      textSize: 42.5,
      textFont: { name: "Khmer OS Muol Light" },
    },
    {
      dataKeys: ["recipient.nameKm"],
      text: nameKm,
      textSize: 47,
      textFont: { name: "Khmer OS Muol Light" },
    },
    {
      dataKeys: ["certificate.major"],
      text: secondDegreeKm,
      textSize: 42.5,
      textFont: { name: "Khmer OS Muol Light" },
    },
    {
      dataKeys: ["certificate.major"],
      text: majorKm,
      textSize: 42.5,
      textFont: { name: "Khmer OS Muol Light" },
    },
    {
      dataKeys: ["certificate.degree"],
      text: degreeFr,
      textSize: 37.2,
      textFont: { name: "Times New Roman" },
    },
    {
      dataKeys: ["recipient.nameFr"],
      text: nameFr,
      textSize: 50,
      textFont: { name: "Times New Roman" },
    },
    {
      dataKeys: ["certificate.degree"],
      text: secondDegreeFr,
      textSize: 43.4,
      textFont: { name: "Times New Roman" },
    },
    {
      dataKeys: ["certificate.major"],
      text: majorFr,
      textSize: 43.4,
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

  const degreeKmFontSize = adjustFontSize(ctx, nameData[0], 500);
  const nameKmFontSize = adjustFontSize(ctx, nameData[1], 1230);
  const secondDegreeKmFontSize = adjustFontSize(ctx, nameData[2], 600);
  const majorKmFontSize = adjustFontSize(ctx, nameData[3], 1240);
  const degreeFrFontSize = adjustFontSize(ctx, nameData[4], 350);
  const nameFontSize = adjustFontSize(ctx, nameData[5], 1100);
  const secondDegreeFrFontSize = adjustFontSize(ctx, nameData[6], 750);
  const majorFrFontSize = adjustFontSize(ctx, nameData[7], 1100);

  const KM_TEXTS = [
    {
      dataKeys: ["certificate.logDateKm"],
      text: "{certificate.logDateKm}",
      textSize: 43.8,
      textFont: { name: "Khmer OS Content" },
      textColor: MPTC_TEXT_COLORS.black,
      strokeLine: 1,
      strokeColor: MPTC_TEXT_COLORS.black,
      x: 1184,
      y: 997,
      align: "center",
    },
    {
      dataKeys: ["certificate.degreeKm"],
      text: degreeKm,
      textSize: degreeKmFontSize,
      textFont: { name: "Khmer OS Muol Light" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 1434,
      y: 1080,
      align: "center",
    },
    {
      dataKeys: ["recipient.nameKm"],
      text: nameKm,
      textSize: nameKmFontSize,
      textFont: { name: "Khmer OS Muol Light" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 1062,
      y: 1163,
      align: "center",
    },
    {
      dataKeys: ["recipient.dateOfBirthKm"],
      text: "{recipient.dateOfBirthKm}",
      textSize: 43.8,
      textFont: { name: "Khmer OS Content" },
      textColor: MPTC_TEXT_COLORS.black,
      strokeLine: 1,
      strokeColor: MPTC_TEXT_COLORS.black,
      x: 1051,
      y: 1247,
      align: "center",
    },
    {
      dataKeys: ["certificate.degreeKm"],
      text: secondDegreeKm,
      textSize: secondDegreeKmFontSize,
      textFont: { name: "Khmer OS Muol Light" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 1384,
      y: 1330,
      align: "center",
    },
    {
      dataKeys: ["certificate.major"],
      text: majorKm,
      textSize: majorKmFontSize,
      textFont: { name: "Khmer OS Muol Light" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 1056,
      y: 1413,
      align: "center",
    },
  ];

  const EN_TEXTS = [
    {
      dataKeys: ["certificate.degreeFr"],
      text: degreeFr,
      textSize: degreeFrFontSize,
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      textStyle: "bold",
      x: 2829,
      y: 980.5,
      align: "left",
    },
    {
      dataKeys: ["certificate.logDateFr"],
      text: "{certificate.logDateFr}",
      textSize: 47.5,
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      textStyle: "bold",
      x: 2599,
      y: 1043,
      align: "center",
    },
    {
      dataKeys: ["recipient.nameFr"],
      text: nameFr,
      textSize: nameFontSize,
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      textStyle: "bold",
      x: 2606,
      y: 1109,
      align: "center",
    },
    {
      dataKeys: ["recipient.dateOfBirthFr"],
      text: "{recipient.dateOfBirthFr}",
      textSize: 47.5,
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      textStyle: "bold",
      x: 2599,
      y: 1176,
      align: "center",
    },
    {
      dataKeys: ["certificate.degreeFr"],
      text: secondDegreeFr,
      textSize: secondDegreeFrFontSize,
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      textStyle: "bold",
      x: 2780,
      y: 1376,
      align: "center",
    },
    {
      dataKeys: ["certificate.majorFr"],
      text: majorFr,
      textSize: majorFrFontSize,
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      textStyle: "bold",
      x: 2615,
      y: 1443,
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
      const rotatedBuffer = await jo.rotate(resBuffer, { quality: 100 });
      resBuffer = rotatedBuffer.buffer;
    } catch (err) {
      console.log(err);
    }

    const img = sharp(resBuffer, { failOn: "truncated" });
    const maxY = 2141;
    const maxImgBoxWidth = 289;
    const maxImgBoxHeight = 342;
    profileX = bg.width / 2;
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

    const certId = [
      {
        dataKeys: ["certificate.number"],
        text: `${_.get(certificateInfo, "certificate.number", "")}`,
        textSize: 38.5,
        textStyle: "500",
        textFont: { name: "Khmer OS Content" },
        textColor: MPTC_TEXT_COLORS.black,
        x: 1644,
        y: 1773,
      },
    ];
    EN_TEXTS.push(certId);
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
    await drawQrCodeStandard(qrcodeContent, ctx, 2930, 1844, 302);
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