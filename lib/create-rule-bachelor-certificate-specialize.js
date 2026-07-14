import { Image, createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";
import axios from "axios";
import sharp from "sharp";
import jo from "jpeg-autorotate";

export async function createRULEBachelorCertSpecialize(
  certificateInfo = {},
  qrcodeContent,
) {
  const major = _.get(certificateInfo, "certificate.major", "");
  const specializedIn = _.get(certificateInfo, "certificate.specialized");
  const specializedInKm = _.get(certificateInfo, "certificate.specializedKm");
  const majorKm = _.get(certificateInfo, "certificate.majorKm", "");
  const name = _.get(certificateInfo, "recipient.name", "");
  const gender = _.get(certificateInfo, "recipient.gender", "");
  const nameKm = _.get(certificateInfo, "recipient.nameKm", "");
  const genderKm = _.get(certificateInfo, "recipient.genderKm", "");

  const degreeList = ["ECONOMICS AND MANAGEMENT BASED IN FRENCH AND ENGLISH"];

  const thresholdLabelMap = {
    "ECONOMICS AND MANAGEMENT BASED IN FRENCH": {
      textMaxWidth: 820,
      sumX: 10,
      targetIndex: 0,
      qrX: 315,
      qrY: 1537,
    },
    "AND ENGLISH": {
      textMaxWidth: 220,
      sumX: 200,
      targetIndex: 1,
      qrX: 315,
      qrY: 1537,
    },
    "ECONOMICS AND MANAGEMENT BASED IN ENGLISH": {
      textMaxWidth: 820,
      sumX: 10,
      targetIndex: 0,
      qrX: 315,
      qrY: 1537,
    },
  };

  const maxSpecializedInKmWidth = 50;
  let specializedInKmLines = [];

  if (specializedInKm?.length > maxSpecializedInKmWidth) {
    const words = specializedInKm.split(" ");
    let currentSpecializedInKmLine = "";

    for (const word of words) {
      if (
        currentSpecializedInKmLine.length + word.length <=
        maxSpecializedInKmWidth
      ) {
        currentSpecializedInKmLine +=
          (currentSpecializedInKmLine === "" ? "" : " ") + word;
      } else {
        specializedInKmLines.push(currentSpecializedInKmLine);
        currentSpecializedInKmLine = word;
      }
    }
    if (currentSpecializedInKmLine !== "") {
      specializedInKmLines.push(currentSpecializedInKmLine);
    }
  } else {
    specializedInKmLines.push(specializedInKm);
  }

  const maxSpecializedInWidth = 40;
  let specializedInLines = [];

  if (specializedIn?.length > maxSpecializedInWidth) {
    const words = specializedIn.split(" ");
    let currentSpecializedInLine = "";

    for (const word of words) {
      if (
        currentSpecializedInLine.length + word.length <=
        maxSpecializedInWidth
      ) {
        currentSpecializedInLine +=
          (currentSpecializedInLine === "" ? "" : " ") + word;
      } else {
        specializedInLines.push(currentSpecializedInLine);
        currentSpecializedInLine = word;
      }
    }
    if (currentSpecializedInLine !== "") {
      specializedInLines.push(currentSpecializedInLine);
    }
  } else {
    specializedInLines.push(specializedIn);
  }

  const DATA = {
    BACKGROUND: {
      pngFilename: "rule-specializing-v1.2.png",
    },
    FONTS: [
      { name: "Khmer OS Battambang", filename: "KhmerOS_battambang.ttf" },
      { name: "Khmer OS Muol Light", filename: "KhmerOSmuollight.ttf" },
      { name: "Times New Roman", filename: "times.ttf" },
      { name: "Arial", filename: "Arial.ttf" },
    ],
    TEXTS: [],
    QRCODE: { width: 244, height: 300.93333333333334, x: 302, y: 1537 },
  };

  const MPTC_TEXT_COLORS = {
    black: "#000000",
    pink: "#F72798",
  };

  const KM_TEXTS = [
    {
      dataKeys: ["certificate.logDateKm"],
      text: "{certificate.logDateKm} របស់គណៈកម្មការ",
      textSize: 31.9,
      textFont: { name: "Khmer OS Battambang" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 712,
      y: 961,
      align: "left",
    },
    {
      dataKeys: ["certificate.examDateKm"],
      text: "{certificate.examDateKm}",
      textSize: 31.9,
      textFont: { name: "Khmer OS Battambang" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 890,
      y: 1021,
      align: "left",
    },
    {
      dataKeys: ["recipient.dateOfBirthKm", "recipient.placeOfBirthKm"],
      text: "{recipient.dateOfBirthKm} នៅ {recipient.placeOfBirthKm}",
      textSize: 31.9,
      textFont: { name: "Khmer OS Battambang" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 449,
      y: 1146,
      align: "left",
    },
    [
      {
        dataKeys: ["certificate.majorKm"],
        text: `បរិញ្ញាបត្រ {certificate.majorKm}`,
        textSize: 31.1,
        textFont: { name: "Khmer OS Muol Light" },
        textColor: MPTC_TEXT_COLORS.black,
        x: 708.5,
        y: 1265,
        align: "left",
      },
      {
        dataKeys: ["certificate.specializedKm"],
        text: specializedInKm ? "ឯកទេស " : "",
        textSize: 31.95,
        textFont: { name: "Khmer OS Battambang" },
        textColor: MPTC_TEXT_COLORS.black,
        x: 396,
        y: 1325,
        align: "left",
      },
      {
        dataKeys: ["certificate.specializedKm"],
        text: specializedInKmLines[0],
        textSize: 31.95,
        textFont: { name: "Khmer OS Muol Light" },
        textColor: MPTC_TEXT_COLORS.black,
        addX: 0,
        y: 1326,
        align: "left",
      },
      {
        dataKeys: ["certificate.specializedKm"],
        text:
          specializedInKmLines[1] === undefined
            ? specializedInKm
              ? "។"
              : " "
            : "",
        textSize: 31.95,
        textFont: { name: "Khmer OS Battambang" },
        textColor: MPTC_TEXT_COLORS.black,
        addX: 0,
        y: 1326,
        align: "left",
      },
      {
        dataKeys: ["certificate.specializedKm"],
        text: `${specializedInKmLines[1] ? specializedInKmLines[1] : ""}${
          specializedInKmLines[2] ? ` ${specializedInKmLines[2]}` : ""
        }${specializedInKmLines[3] ? ` ${specializedInKmLines[3]}` : ""}`,
        textSize: 31.95,
        textFont: { name: "Khmer OS Muol Light" },
        textColor: MPTC_TEXT_COLORS.black,
        x: 397,
        y: 1385,
        align: "left",
      },
      {
        dataKeys: ["certificate.specializedKm"],
        text: specializedInKmLines[1] === undefined ? "" : "។",
        textSize: 31.95,
        textFont: { name: "Khmer OS Battambang" },
        textColor: MPTC_TEXT_COLORS.black,
        addX: 0,
        y: 1385,
        align: "left",
      },
    ],
  ];

  const EN_TEXTS = [
    {
      dataKeys: ["certificate.logDate"],
      text: "{certificate.logDate} of the",
      textSize: 35.8,
      textFont: { name: "Arial" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 2128.5,
      y: 935,
      align: "left",
    },
    {
      dataKeys: ["certificate.examDate"],
      text: "{certificate.examDate}",
      textSize: 35.8,
      textFont: { name: "Arial" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 2285,
      y: 996,
      align: "left",
    },
    {
      dataKeys: ["recipient.dateOfBirth", "recipient.placeOfBirth"],
      text: "{recipient.dateOfBirth} in {recipient.placeOfBirth}",
      textSize: 35.8,
      textFont: { name: "Arial" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 1764,
      y: 1125,
      align: "left",
    },
    [
      {
        dataKeys: [],
        text: "in",
        textSize: 34.5,
        textFont: { name: "Arial" },
        textColor: MPTC_TEXT_COLORS.black,
        strokeLine: 0.1,
        x: 2195,
        y: 1248,
        align: "left",
      },
      {
        dataKeys: ["certificate.major"],
        text: "{certificate.major}",
        textSize: major.length >= 18 ? 30 : 35,
        textFont: { name: "Arial" },
        textColor: MPTC_TEXT_COLORS.black,
        textStyle: "bold",
        x: 2230,
        y: 1248,
        align: "left",
      },
      {
        dataKeys: ["certificate.specialized"],
        text: specializedIn ? "specializing in " : "",
        textSize: 35,
        textFont: { name: "Arial" },
        textColor: MPTC_TEXT_COLORS.black,
        x: 1636,
        y: 1309,
        align: "left",
      },
    ],
    {
      dataKeys: ["certificate.rectorSignatureDate"],
      text: "Phnom Penh, {certificate.rectorSignatureDate}",
      textSize: 33 + 2.5,
      textFont: { name: "Arial" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 2275 + 1,
      y: 1414 + 3,
      align: "center",
    },
  ];

  let NAME_GENDER_TEXTS = [
    [
      {
        dataKeys: ["recipient.name"],
        text: name,
        textSize: 40,
        textFont: { name: "Arial" },
        textColor: MPTC_TEXT_COLORS.black,
        textStyle: "bold",
        x: 1843,
        y: 1060,
        align: "left",
      },
      {
        dataKeys: ["recipient.gender"],
        text: " sex " + gender,
        textSize: 34.5,
        textFont: { name: "Arial" },
        textColor: MPTC_TEXT_COLORS.black,
        addX: 0,
        y: 1060,
        align: "left",
      },
    ],
    [
      {
        dataKeys: ["recipient.nameKm"],
        text: nameKm,
        textSize: 40,
        textFont: { name: "Khmer OS Muol Light" },
        x: 535,
        y: 1085,
        textColor: MPTC_TEXT_COLORS.black,
        align: "left",
      },
      {
        dataKeys: ["recipient.genderKm"],
        text: "  ភេទ " + genderKm,
        textSize: 31.9,
        textFont: { name: "Khmer OS Battambang" },
        textColor: MPTC_TEXT_COLORS.black,
        addX: 0,
        y: 1084,
        align: "left",
      },
    ],
  ];

  const getTextMaxWidth = (ctx, textItem) => {
    ctx.font = resolveFont(textItem.textFont, 24, textItem);
    const kmTargetMatric = ctx.measureText(textItem.text);
    return kmTargetMatric;
  };

  let specializedInFirstLine = specializedInLines[0]
    ? specializedInLines[0]
    : "";
  let specializedInNewLine = `${
    specializedInLines[1] ? specializedInLines[1] : ""
  }${specializedInLines[2] ? ` ${specializedInLines[2]}` : ""}`;

  const degreeConfig = Object.entries(degreeList).find(([key]) =>
    major.includes(key),
  );
  const degreeTextSize = degreeConfig ? 35 : 30;
  const degreeAddX = degreeConfig ? -1126.5 : -1000;

  let nameLabel = [
    [
      {
        dataKeys: ["certificate.specialized"],
        text: specializedInLines[0]
          ? specializedInLines[1]
            ? specializedInLines[0]
            : specializedInLines[0] + "."
          : "",
        textSize: degreeTextSize,
        textFont: { name: "Arial" },
        textColor: MPTC_TEXT_COLORS.black,
        textStyle: "bold",
        x: 1860,
        y: 1309,
        align: "left",
        letterSpacing: -6,
        textMaxWidth: 0,
      },
      {
        dataKeys: ["certificate.specialized"],
        text: specializedInLines[1] ? specializedInLines[1] + "." : "",
        textSize: degreeTextSize,
        textFont: { name: "Arial" },
        textColor: MPTC_TEXT_COLORS.black,
        addX: degreeAddX,
        textStyle: "bold",
        y: 1371,
        align: "left",
      },
    ],
  ];

  const updateLabel = (line) => {
    if (thresholdLabelMap[line]) {
      const { textMaxWidth, sumX, targetIndex } = thresholdLabelMap[line];
      nameLabel[0][targetIndex].textMaxWidth = textMaxWidth;

      if (nameLabel[0][targetIndex].hasOwnProperty("x")) {
        nameLabel[0][targetIndex].x += sumX;
      }
    }
  };

  updateLabel(specializedInFirstLine);
  updateLabel(specializedInNewLine);

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

  const nameFontSize = adjustFontSize(ctx, NAME_GENDER_TEXTS[0][0], 550);
  const nameKmFontSize = adjustFontSize(ctx, NAME_GENDER_TEXTS[1][0], 650);

  NAME_GENDER_TEXTS = [
    {
      dataKeys: ["recipient.name"],
      text: name,
      textSize: nameFontSize,
      textFont: { name: "Arial" },
      textColor: MPTC_TEXT_COLORS.black,
      textStyle: "bold",
      x: 1843,
      y: 1060,
      align: "left",
    },
    {
      dataKeys: ["recipient.gender"],
      text: " sex " + gender,
      textSize: 34.5,
      textFont: { name: "Arial" },
      textColor: MPTC_TEXT_COLORS.black,
      x: "",
      y: 1060,
      align: "left",
    },
    {
      dataKeys: ["recipient.nameKm"],
      text: nameKm,
      textSize: nameKmFontSize,
      textFont: { name: "Khmer OS Muol Light" },
      x: 535,
      y: 1085,
      textColor: MPTC_TEXT_COLORS.black,
      align: "left",
    },
    {
      dataKeys: ["recipient.genderKm"],
      text: "  ភេទ " + genderKm,
      textSize: 31.9,
      textFont: { name: "Khmer OS Battambang" },
      textColor: MPTC_TEXT_COLORS.black,
      x: "",
      y: 1084,
      align: "left",
    },
  ];

  const widthEn = getTextMaxWidth(ctx, NAME_GENDER_TEXTS[0]);
  NAME_GENDER_TEXTS[1].x = 1869 + widthEn.width;

  const widthKm = getTextMaxWidth(ctx, NAME_GENDER_TEXTS[2]);
  NAME_GENDER_TEXTS[3].x = 535 + widthKm.width;

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
      // console.log(err);
    }

    const img = sharp(resBuffer, { failOn: "truncated" });
    const maxY = 1773.5;
    const maxImgBoxWidth = 232;
    const maxImgBoxHeight = 285;
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
        dataKeys: [],
        text: "N",
        textSize: 33 + 2,
        textStyle: "500",
        textFont: { name: "Arial" },
        textColor: MPTC_TEXT_COLORS.black,
        y: 1437 + 2.2,
        x: 1500,
        align: "left",
      },
      {
        dataKeys: [],
        text: "o",
        textSize: 26 + 6,
        textStyle: "500",
        textFont: { name: "Arial" },
        textColor: MPTC_TEXT_COLORS.black,
        y: 1422 + 6,
        addX: 0,
      },
      {
        dataKeys: ["certificate.number"],
        text: `: ${_.get(certificateInfo, "certificate.number", "")}`,
        textSize: 33 + 2,
        textStyle: "500",
        textFont: { name: "Arial" },
        textColor: MPTC_TEXT_COLORS.black,
        y: 1437 + 3,
        addX: 3,
      },
    ];

    let sumNoWidth = 0;
    for (let item of certId) {
      sumNoWidth += getTextMaxWidth(ctx, item).width;
    }

    let center = (bg.width - sumNoWidth) / 2 - 5;

    certId[0].x = center;
    EN_TEXTS.push(certId);
  }

  DATA.TEXTS = [
    ...DATA.TEXTS,
    ...KM_TEXTS,
    ...EN_TEXTS,
    ...nameLabel,
    ...NAME_GENDER_TEXTS,
  ];

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
          certificateInfo,
        );
      }
    } else drawTextItem(canvas, ctx, text, DATA.FONTS[0].name, certificateInfo);
  }

  if (qrcodeContent) {
    const isDegreeMatched = degreeList.includes(major);
    const qrX = isDegreeMatched ? 295 : 315;
    const qrY = isDegreeMatched ? 1542 : 1537;
    const qrWidth = 226;
    await drawQrCodeStandard(qrcodeContent, ctx, qrX, qrY, qrWidth);
  }
  //{ canvas, profileX, profileY, sizeBy }
  return canvas;
}

const drawTextItem = (canvas, ctx, textItem, defaultFont, certificateInfo) => {
  if (textItem.dataKeys && textItem.dataKeys.length > 0) {
    for (const key of textItem.dataKeys)
      textItem.text = textItem.text.replace(
        `{${key}}`,
        _.get(certificateInfo, key, ""),
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
  const fontName = text.textFont ? text.textFont.name : defaultFont;

  font += text.textStyle ? text.textStyle + space : "";
  font += text.textSize ? text.textSize : defaultSize;
  font += "px" + space;
  font += fontName;
  return font;
}
