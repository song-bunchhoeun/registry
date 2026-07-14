import { Image, createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";
import axios from "axios";
import sharp from "sharp";

export async function createRULEBachelorCert(
  certificateInfo = {},
  qrcodeContent
) {
  const majorKm = _.get(certificateInfo, "certificate.majorKm", "");
  const major = _.get(certificateInfo, "certificate.major", "");
  const name = _.get(certificateInfo, "recipient.name", "")
  const gender = _.get(certificateInfo, "recipient.gender", "")
  const nameKm = _.get(certificateInfo, "recipient.nameKm", "")
  const genderKm = _.get(certificateInfo, "recipient.genderKm", "")
  // Start new line
  const majorsKm = [
    // {
    //   name: "សេដ្ឋកិច្ចព័ត៌មានវិទ្យា",
    // },
    // {
    //   name: "ទេសចរណ៍ និងបដិសណ្ឋារកិច្ច",
    // },
    {
      // name: "គ្រប់គ្រងទេសចរណ៍ និងបដិសណ្ឋារកិច្ច",
    },
    {
      // name: "ទំនាក់ទំនងអន្តរជាតិ សិក្សាជាភាសាអង់គ្លេស",
    },
    {
      name: "នីតិសាស្ត្រខ្មែរ-ចិន",
    },
  ];
  const majorsEn = [
    {
      name: "INFORMATIC ECONOMICS",
    },
    {
      name: "TOURISM AND HOSPITALITY",
    },
    {
      name: "TOURISM AND HOSPITALITY MANAGEMENT",
    },
    {
      name: "TOURISM AND HOPITALITY MANAGEMENT",
    },
    {
      name: "INTERNATIONAL RELATION BASED IN ENGLISH",
    },
    {
      name: "INTERNATIONAL RELATIONS BASED IN ENGLISH",
    },
    {
      name: "LAW BASED IN KHMER AND CHINESE",
    },
    {
      name: "LAW BASED IN ENGLISH",
    },
    {
      name: "LAW BASED IN FRENCH",
    },
    {
      name: "LAW BASED IN CHINESE",
    },
  ];

  const maxMajorKmWidth = 33;
  let majorKmLines = [];
  const isMajorKmMatching = majorsKm.find((major) => major.name === majorKm);

  if (isMajorKmMatching) {
    majorKmLines.push("\n", majorKm);
  } else {
    if (majorKm.length > maxMajorKmWidth) {
      const words = majorKm.split(" ");
      let currentMajorKmLine = "";
      for (const word of words) {
        if (currentMajorKmLine.length + word.length <= maxMajorKmWidth) {
          // Add word to the current line if the currentMajorKmLine still have space
          currentMajorKmLine += (currentMajorKmLine === "" ? "" : " ") + word;
        } else {
          // Start a new line if the currentMajorKmLine have no space by push to majorKmLines of array
          majorKmLines.push(currentMajorKmLine);
          currentMajorKmLine = word;
        }
      }
      if (currentMajorKmLine !== "") {
        majorKmLines.push(currentMajorKmLine);
      }
    } else {
      majorKmLines.push(majorKm);
    }
  }

  let maxMajorWidth = 20;
  if (certificateInfo.major = "INFORMATION TECHNOLOGY") {
    maxMajorWidth = 30;
  }
  if (certificateInfo.major = "LAW IN KHMER-CHINESE LAW BASED IN KHMER AND CHINESE") {
    maxMajorWidth = 19;
  }
  if(certificateInfo.major = "PUBLIC ADMINISTRATION"){
    maxMajorWidth = 21;
  }

  let majorLines = [];
  const isMajorEnMatching = majorsEn.find((majorEn) => majorEn.name === major);
  if (isMajorEnMatching) {
    majorLines.push("\n", major);
  } else {
    if (major.length > maxMajorWidth) {
      const words = major.split(" ");
      let currentMajorLine = "";
      for (const word of words) {
        if (currentMajorLine.length + word.length <= maxMajorWidth) {
          currentMajorLine += (currentMajorLine === "" ? "" : " ") + word;
        } else {
          majorLines.push(currentMajorLine);
          currentMajorLine = word;
        }
      }
      if (currentMajorLine !== "") {
        majorLines.push(currentMajorLine);
      }
    } else {
      majorLines.push(major);
    }
  }

  const DATA = {
    BACKGROUND: {
      pngFilename: "certificate-rule-bachelor-v3.png",
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
  };

  const KM_TEXTS = [
    {
      dataKeys: ["certificate.logDateKm"],
      text: "{certificate.logDateKm} របស់គណៈកម្មការ",
      textSize: 31.9,
      textFont: { name: "Khmer OS Battambang" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 713,
      y: 956,
      align: "left",
    },
    {
      dataKeys: ["certificate.examDateKm"],
      text: "{certificate.examDateKm}",
      textSize: 31.9,
      textFont: { name: "Khmer OS Battambang" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 890,
      y: 1015,
      align: "left",
    },
    {
      dataKeys: ["recipient.dateOfBirthKm", "recipient.placeOfBirthKm"],
      text: "{recipient.dateOfBirthKm} នៅ {recipient.placeOfBirthKm}",
      textSize: 31.9,
      textFont: { name: "Khmer OS Battambang" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 449,
      y: 1152,
      align: "left",
    },
    [
      {
        dataKeys: ["certificate.majorKm"],
        text: `បរិញ្ញាបត្រ ${majorKmLines[0]}`,
        textSize: 31.95,
        textFont: { name: "Khmer OS Muol Light" },
        textColor: MPTC_TEXT_COLORS.black,
        x: 709.5,
        y: 1276.8,
        align: "left",
      },
      {
        dataKeys: ["certificate.majorKm"],
        text: `${isMajorKmMatching ? "" : majorKmLines[1] === undefined ? "។" : ""
          }`,
        textSize: 31.95,
        textFont: { name: "Khmer OS Battambang" },
        textColor: MPTC_TEXT_COLORS.black,
        addX: 0,
        y: 1276.8,
        align: "left",
      },
      {
        dataKeys: ["certificate.majorKm"],
        text: `${majorKmLines[1] ? majorKmLines[1] : ""}${majorKmLines[2] ? ` ${majorKmLines[2]}` : ""
          }${majorKmLines[3] ? ` ${majorKmLines[3]}` : ""}`,
        textSize: 31.95,
        textFont: { name: "Khmer OS Muol Light" },
        textColor: MPTC_TEXT_COLORS.black,
        x: 397,
        y: 1340,
        align: "left",
      },
      {
        dataKeys: ["certificate.majorKm"],
        text: `${isMajorKmMatching ? "។" : majorKmLines[1] === undefined ? "" : "។"
          }`,
        textSize: 31.95,
        textFont: { name: "Khmer OS Battambang" },
        textColor: MPTC_TEXT_COLORS.black,
        addX: 0,
        y: 1340,
        align: "left",
      },
    ],
  ];

  const EN_TEXTS = [
    {
      dataKeys: ["certificate.logDate"],
      text: "{certificate.logDate}  of the",
      textSize: 34.5,
      textFont: { name: "Arial" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 2142.5,
      y: 952,
      align: "left",
    },
    {
      dataKeys: ["certificate.examDate"],
      text: "{certificate.examDate}",
      textSize: 34.5,
      textFont: { name: "Arial" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 2295,
      y: 1012.4,
      align: "left",
    },
    {
      dataKeys: ["recipient.dateOfBirth", "recipient.placeOfBirth"],
      text: "{recipient.dateOfBirth} in {recipient.placeOfBirth}",
      textSize: 34.5,
      textFont: { name: "Arial" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 1796,
      y: 1140,
      align: "left",
    },
    [
      {
        dataKeys: [],
        text: isMajorEnMatching ? "" : "in",
        textSize: 34.5,
        textFont: { name: "Arial" },
        textColor: MPTC_TEXT_COLORS.black,
        strokeLine: 0.1,
        x: 2205,
        y: 1261.5,
        align: "left",
      },
      {
        dataKeys: ["certificate.major"],
        text: majorLines[0],
        textSize: majorLines[0].length > 18 ? 31 : 35,
        textFont: { name: "Arial" },
        textColor: MPTC_TEXT_COLORS.black,
        textStyle: "bold",
        x: 2240,
        y: 1262,
        align: "left",
      },
      {
        dataKeys: ["certificate.major"],
        text: `${isMajorEnMatching ? "" : majorLines[1] === undefined ? "." : ""
          }`,
        textSize: 35,
        textFont: { name: "Arial" },
        textColor: MPTC_TEXT_COLORS.black,
        addX: 0,
        y: 1263,
        align: "left",
      },
      {
        dataKeys: [],
        text: isMajorEnMatching ? "in" : "",
        textSize: 34.5,
        textFont: { name: "Arial" },
        textColor: MPTC_TEXT_COLORS.black,
        strokeLine: 0.1,
        x: 1674,
        y: 1324,
        align: "left",
      },
      {
        dataKeys: ["certificate.major"],
        text: `${majorLines[1] ? majorLines[1] : ""}${majorLines[2] ? ` ${majorLines[2]}` : ""
          }${majorLines[3] ? ` ${majorLines[3]}` : ""}`,
        textSize: 35,
        textFont: { name: "Arial" },
        textColor: MPTC_TEXT_COLORS.black,
        textStyle: "bold",
        // x: 1674,
        addX: isMajorEnMatching ? 10 : 0,
        y: 1324,
        align: "left",
      },
      {
        dataKeys: ["certificate.major"],
        text: `${isMajorEnMatching ? "." : majorLines[1] === undefined ? "" : "."
          }`,
        textSize: 35,
        textFont: { name: "Arial" },
        textColor: MPTC_TEXT_COLORS.black,
        addX: 0,
        y: 1324,
        align: "left",
      },
    ],
    {
      dataKeys: ["certificate.rectorSignatureDate"],
      text: "Phnom Penh, {certificate.rectorSignatureDate}",
      textSize: 33,
      textFont: { name: "Arial" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 2275,
      y: 1414,
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
        x: 1869,
        y: 1078,
        align: "left",
      },
      {
        dataKeys: ["recipient.gender"],
        text: " sex " + gender,
        textSize: 34.5,
        textFont: { name: "Arial" },
        textColor: MPTC_TEXT_COLORS.black,
        addX: 0,
        y: 1078,
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
        y: 1082,
        textColor: MPTC_TEXT_COLORS.black,
        align: "left",
      },
      {
        dataKeys: ["recipient.genderKm"],
        text: "  ភេទ " + genderKm,
        textSize: 31.9,
        textFont: { name: "Khmer OS Battambang" },
        textColor: MPTC_TEXT_COLORS.black,
        addX: 2,
        y: 1082,
        align: "left",
      },
    ],
  ]

  const getTextMaxWidth = (ctx, textItem) => {
    ctx.font = resolveFont(textItem.textFont, 24, textItem);
    const kmTargetMatric = ctx.measureText(textItem.text);
    return kmTargetMatric;
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

  const nameFontSize = adjustFontSize(ctx, NAME_GENDER_TEXTS[0][0], 550)
  const nameKmFontSize = adjustFontSize(ctx, NAME_GENDER_TEXTS[1][0], 700)

  NAME_GENDER_TEXTS = [
    {
      dataKeys: ["recipient.name"],
      text: name,
      textSize: nameFontSize,
      textFont: { name: "Arial" },
      textColor: MPTC_TEXT_COLORS.black,
      textStyle: "bold",
      x: 1869,
      y: 1078,
      align: "left",
    },
    {
      dataKeys: ["recipient.gender"],
      text: " sex " + gender,
      textSize: 34.5,
      textFont: { name: "Arial" },
      textColor: MPTC_TEXT_COLORS.black,
      x: '',
      y: 1078,
      align: "left",
    },
    {
      dataKeys: ["recipient.nameKm"],
      text: nameKm,
      textSize: nameKmFontSize,
      textFont: { name: "Khmer OS Muol Light" },
      x: 535,
      y: 1082,
      textColor: MPTC_TEXT_COLORS.black,
      align: "left",
    },
    {
      dataKeys: ["recipient.genderKm"],
      text: "  ភេទ " + genderKm,
      textSize: 31.9,
      textFont: { name: "Khmer OS Battambang" },
      textColor: MPTC_TEXT_COLORS.black,
      addX: 2,
      y: 1082,
      align: "left",
    }
  ]

  const widthEn = getTextMaxWidth(ctx, NAME_GENDER_TEXTS[0])
  NAME_GENDER_TEXTS[1].x = 1869 + widthEn.width

  const widthKm = getTextMaxWidth(ctx, NAME_GENDER_TEXTS[2])
  NAME_GENDER_TEXTS[3].x = 537 + widthKm.width

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
        textSize: 33,
        textStyle: "500",
        textFont: { name: "Arial" },
        textColor: MPTC_TEXT_COLORS.black,
        y: 1437,
        x: 1500,
        align: "left",
      },
      {
        dataKeys: [],
        text: "o",
        textSize: 26,
        textStyle: "500",
        textFont: { name: "Arial" },
        textColor: MPTC_TEXT_COLORS.black,
        y: 1422,
        addX: 0,
      },
      {
        dataKeys: ["certificate.number"],
        text: `: ${_.get(certificateInfo, "certificate.number", "")}`,
        textSize: 33,
        textStyle: "500",
        textFont: { name: "Arial" },
        textColor: MPTC_TEXT_COLORS.black,
        y: 1437,
        addX: 3,
      },
    ];

    let sumNoWidth = 0;
    for (let item of certId) {
      sumNoWidth += getTextMaxWidth(ctx, item).width;
    }

    let center = (bg.width - sumNoWidth) / 2 - 10;

    certId[0].x = center;
    EN_TEXTS.push(certId);
  }

  DATA.TEXTS = [...DATA.TEXTS, ...KM_TEXTS, ...EN_TEXTS, ...NAME_GENDER_TEXTS];

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
    await drawQrCodeStandard(qrcodeContent, ctx, 295, 1552, 226);
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