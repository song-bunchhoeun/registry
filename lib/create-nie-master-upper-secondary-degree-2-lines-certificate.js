import { Image, createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";
import axios from "axios";
import sharp from "sharp";

export async function createNIEMasterUpperSecondaryDegreeTwoLineCertificate(
  certificateInfo = {},
  qrcodeContent
) {
  const DATA = {
    BACKGROUND: {
      pngFilename: "nie-degree-2lines.jpg",
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
  let degreeKmFirstLine = degreeKm.slice(0, 25);
  let degreeKmSecondLine = degreeKm.substring(25);
  const nameKm = _.get(certificateInfo, "recipient.nameKm") ?? "";
  const majorKm = _.get(certificateInfo, "certificate.majorKm") ?? "";
  const degree = _.get(certificateInfo, "certificate.degree") ?? "";
  let degreeFirstLine = degree.slice(0, 20);
  let degreeSecondLine = degree.substring(20);
  const name = _.get(certificateInfo, "recipient.name") ?? "";
  const secondDegree = _.get(certificateInfo, "certificate.degree") ?? "";
  const major = _.get(certificateInfo, "certificate.major") ?? "";

  let nameData = [
    {
      dataKeys: ["certificate.degreeKm"],
      text: degreeKmSecondLine,
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
      text: majorKm,
      textSize: 42.5,
      textFont: { name: "Khmer OS Muol Light" },
    },
    {
      dataKeys: ["certificate.degree"],
      text: degreeSecondLine,
      textSize: 43,
      textFont: { name: "Times New Roman" },
    },
    {
      dataKeys: ["recipient.name"],
      text: name,
      textSize: 50,
      textFont: { name: "Times New Roman" },
    },
    {
      dataKeys: ["certificate.degree"],
      text: secondDegree,
      textSize: 43,
      textFont: { name: "Times New Roman" },
    },
    {
      dataKeys: ["certificate.major"],
      text: major,
      textSize: 47,
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

  const degreeKmSecondLineFontSize = adjustFontSize(ctx, nameData[0], 1350);
  const nameKmFontSize = adjustFontSize(ctx, nameData[1], 1140);
  const majorKmFontSize = adjustFontSize(ctx, nameData[2], 1050);
  const degreeSecondLineFontSize = adjustFontSize(ctx, nameData[3], 1340);
  const nameFontSize = adjustFontSize(ctx, nameData[4], 1100);
  const secondDegreeFontSize = adjustFontSize(ctx, nameData[5], 1340);
  const majorFontSize = adjustFontSize(ctx, nameData[6], 1110);

  const KM_TEXTS = [
    {
      dataKeys: ["certificate.logDateKm"],
      text: "{certificate.logDateKm}",
      textSize: 43.8,
      textFont: { name: "Khmer OS Content" },
      textColor: MPTC_TEXT_COLORS.black,
      strokeLine: 1,
      strokeColor: MPTC_TEXT_COLORS.black,
      x: 1174,
      y: 983,
      align: "center",
    },
    {
      dataKeys: ["certificate.degreeKm"],
      text: degreeKmFirstLine,
      textSize: 42.5,
      textFont: { name: "Khmer OS Muol Light" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 1327,
      y: 1055,
      align: "center",
    },
    {
      dataKeys: ["certificate.degreeKm"],
      text: degreeKmSecondLine,
      textSize: degreeKmSecondLineFontSize,
      textFont: { name: "Khmer OS Muol Light" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 316,
      y: 1120,
      align: "left",
    },
    {
      dataKeys: ["certificate.examDateKm"],
      text: "{certificate.examDateKm}",
      textSize: 43.8,
      textFont: { name: "Khmer OS Content" },
      textColor: MPTC_TEXT_COLORS.black,
      strokeLine: 1,
      strokeColor: MPTC_TEXT_COLORS.black,
      x: 1105,
      y: 1183,
      align: "center",
    },
    {
      dataKeys: ["recipient.nameKm"],
      text: nameKm,
      textSize: nameKmFontSize,
      textFont: { name: "Khmer OS Muol Light" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 1054,
      y: 1250,
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
      x: 1096,
      y: 1316,
      align: "center",
    },
    {
      dataKeys: ["certificate.degreeKm"],
      text: degreeKmFirstLine,
      textSize: 42.5,
      textFont: { name: "Khmer OS Muol Light" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 1390,
      y: 1388,
      align: "center",
    },
    {
      dataKeys: ["certificate.degreeKm"],
      text: degreeKmSecondLine,
      textSize: degreeKmSecondLineFontSize,
      textFont: { name: "Khmer OS Muol Light" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 316,
      y: 1455,
      align: "left",
    },
    {
      dataKeys: ["certificate.major"],
      text: majorKm,
      textSize: majorKmFontSize,
      textFont: { name: "Khmer OS Muol Light" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 1103,
      y: 1517,
      align: "center",
    },
  ];

  const EN_TEXTS = [
    {
      dataKeys: ["certificate.logDate"],
      text: "{certificate.logDate}",
      textSize: 47.5,
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      textStyle: "bold",
      x: 2780,
      y: 980,
      align: "center",
    },
    {
      dataKeys: ["certificate.degree"],
      text: degreeFirstLine,
      textSize: 43,
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      textStyle: "bold",
      x: 2838,
      y: 1051,
      align: "center",
    },
    {
      dataKeys: ["certificate.degree"],
      text: degreeSecondLine,
      textSize: degreeSecondLineFontSize,
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      textStyle: "bold",
      x: 1787,
      y: 1118,
      align: "left",
    },
    {
      dataKeys: ["certificate.examDate"],
      text: "{certificate.examDate}",
      textSize: 47.5,
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      textStyle: "bold",
      x: 2600,
      y: 1180,
      align: "center",
    },
    {
      dataKeys: ["recipient.name"],
      text: name,
      textSize: nameFontSize,
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      textStyle: "bold",
      x: 2607,
      y: 1247,
      align: "center",
    },
    {
      dataKeys: ["recipient.dateOfBirth"],
      text: "{recipient.dateOfBirth}",
      textSize: 47.5,
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      textStyle: "bold",
      x: 2609,
      y: 1314,
      align: "center",
    },
    {
      dataKeys: ["certificate.degree"],
      text: secondDegree,
      textSize: secondDegreeFontSize,
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      textStyle: "bold",
      x: 1786,
      y: 1451,
      align: "left",
    },
    {
      dataKeys: ["certificate.major"],
      text: major,
      textSize: majorFontSize,
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      textStyle: "bold",
      x: 2615,
      y: 1514,
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
        textSize: 43.3,
        textStyle: "500",
        textFont: { name: "Khmer OS Content" },
        textColor: MPTC_TEXT_COLORS.black,
        x: 1635,
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