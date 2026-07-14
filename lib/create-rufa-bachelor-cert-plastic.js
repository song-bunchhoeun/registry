import { Image, createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, drawWrapTexts } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";
import axios from "axios";
import sharp from "sharp";

export async function createRUFABachelorCertPlastic(
  certificateInfo = {},
  qrcodeContent
) {
  const DATA = {
    BACKGROUND: {
      pngFilename: "rufa-background.jpg",
    },
    FONTS: [
      { name: "Arial", filename: "assets/fonts/Arial.ttf" },
      {
        name: "Khmer OS Battambang",
        filename: "assets/fonts/KhmerOS_battambang.ttf",
      },
      {
        name: "Khmer OS Muol Light",
        filename: "assets/fonts/KhmerOSmuollight.ttf",
      },
      { name: "Calibri", filename: "assets/fonts/CALIBRI.ttf" },
    ],
    TEXTS: [],
  };

  const degreeKm = _.get(certificateInfo, "certificate.degreeKm", "");
  const examDateKm = _.get(certificateInfo, "certificate.examDateKm", "");
  const splitedExamDateKm = examDateKm.split(" ");
  const kmDay = splitedExamDateKm[0];
  const kmMonth = splitedExamDateKm[1];
  const kmYear = splitedExamDateKm[2];

  const degree = _.get(certificateInfo, "certificate.degree", "");
  const examDateEn = _.get(certificateInfo, "certificate.examDate", "");
  const splitedExamDateEn = examDateEn.split(" ");
  const enDay = splitedExamDateEn[0];
  const enMonth = splitedExamDateEn[1];
  const enYear = splitedExamDateEn[2];

  const KM_TEXTS = [
    [
      {
        dataKeys: [],
        text: "បញ្ជាក់ថា ៖​",
        textSize: 37,
        textColor: "#000000",
        textFont: DATA.FONTS[1],
        x: 379.5,
        y: 1291,
        align: "left",
      },
      {
        dataKeys: ["recipient.nameKm"],
        text: "{recipient.nameKm}",
        textSize: 37,
        textColor: "#000000",
        textFont: DATA.FONTS[2],
        align: "left",
        addX: 50,
        y: 1291,
      },
    ],
    {
      dataKeys: [
        "recipient.genderKm",
        "recipient.dateOfBirthKm",
        "recipient.placeOfBirthKm",
      ],
      text: "ភេទ{recipient.genderKm} កើត{recipient.dateOfBirthKm} នៅ{recipient.placeOfBirthKm}",
      textSize: 39.5,
      textColor: "#000000",
      textFont: DATA.FONTS[1],
      x: 379.5,
      y: 1350,
      align: "left",
    },
    {
      text: "បានបំពេញលក្ខខណ្ឌគ្រប់គ្រាន់ក្នុងការទទួលបាន",
      textSize: 38,
      textColor: "#000000",
      textFont: { name: "Khmer OS Battambang" },
      x: 379.5,
      y: 1415,
      align: "left",
    },
    {
      text: "បរិញ្ញាបត្រ",
      textSize: 37,
      textColor: "#000000",
      textFont: { name: "Khmer OS Battambang" },
      x: 379.5,
      y: 1481,
      align: "left",
    },
    {
      text: "ឯកទេស",
      textSize: 37,
      textColor: "#000000",
      textFont: { name: "Khmer OS Battambang" },
      x: 379.5,
      y: 1550,
      align: "left",
    },
    {
      text: "បរិញ្ញាបត្រនេះប្រគល់ជូនសាមីខ្លួនប្រើប្រាស់តាមផ្លូវច្បាប់។",
      textSize: 38.5,
      textColor: "#000000",
      textFont: { name: "Khmer OS Battambang" },
      x: 379.5,
      y: 1616,
      align: "left",
      textStyle: "bold",
    },
    {
      dataKeys: ["certificate.degreeKm"],
      text: "{certificate.degreeKm}",
      textSize: 39,
      textColor: "#000000",
      textStyle: "bold",
      textFont: DATA.FONTS[1],
      x: 728.4,
      y: 1484.7,
      align: "left",
    },
    {
      dataKeys: ["certificate.majorKm"],
      text: "{certificate.majorKm}",
      textSize: 39,
      textColor: "#000000",
      textStyle: "bold",
      textFont: DATA.FONTS[1],
      x: 728.4,
      y: 1554.7,
      align: "left",
    },
    {
      dataKeys: ["certificate.chairmanSignatureLunarDateKm"],
      text: "{certificate.chairmanSignatureLunarDateKm}",
      textSize: 33,
      textColor: "#000000",
      textFont: { name: "Khmer OS Battambang" },
      x: 976,
      y: 1681,
      align: "center",
    },
    {
      dataKeys: ["certificate.chairmanSignatureDateKm"],
      text: "រាជធានីភ្នំពេញ {certificate.chairmanSignatureDateKm}",
      textSize: 33,
      textColor: "#000000",
      textFont: { name: "Khmer OS Battambang" },
      x: 976,
      y: 1733,
      align: "center",
    },
  ];

  const KM_JUSTIFY_TEXT = [
    {
      dataKeys: ["certificate.logNoKm", "certificate.logDateKm"],
      text: `បានឃើញប្រកាសលេខ ${certificateInfo.certificate.logNoKm} ប្រ.ក ចុះ${certificateInfo.certificate.logDateKm} របស់ក្រសួង`,
      textSize: 37,
      textColor: "#000000",
      textFont: DATA.FONTS[1],
      x: 379.5,
      y: 1099.013,
      align: "left",
    },
    {
      dataKeys: ["certificate.degreeKm", "certificate.generationKm"],
      text: `មហាវិទ្យាល័យ${certificateInfo.certificate.degreeKm} ជំនាន់ទី${certificateInfo.certificate.generationKm} នាសម័យប្រឡង`,
      textSize: 37,
      textColor: "#000000",
      textFont: { name: "Khmer OS Battambang" },
      x: 379.5,
      y: 1224.5,
      align: "left",
    },
    {
      dataKeys: [],
      text: `វប្បធម៌និងវិចិត្រសិល្បៈស្ដីពីការទទួលស្គាល់លទ្ធផលប្រឡងបញ្ចប់បរិញ្ញាបត្រ`,
      textSize: 37,
      textColor: "#000000",
      textFont: { name: "Khmer OS Battambang" },
      x: 379.5,
      y: 1159.5,
      align: "left",
    },
  ];

  const EN_JUSTIFY_TEXTS = [
    {
      dataKeys: ["certificate.logNo", "certificate.logDate"],
      text: `in accordance with the Prakas Nᵒ ${certificateInfo.certificate.logNo} dated ${certificateInfo.certificate.logDate} by the`,
      textSize: 40,
      textColor: "#000000",
      textFont: DATA.FONTS[3],
      x: 1932.6,
      y: 1089,
      align: "left",
    },
    {
      dataKeys: [
        "certificate.degree",
        "certificate.generation",
        "certificate.examDate",
      ],
      text: `examinations of the Degree in {certificate.degree}, Generation {certificate.generation}, held on ${enDay}`,
      textSize: 40,
      textColor: "#000000",
      textFont: DATA.FONTS[3],
      x: 1932.6,
      y: 1201,
      align: "left",
    },
  ];

  const EN_TEXTS = [
    [
      {
        dataKeys: [],
        text: "certifies that :",
        textSize: 40,
        textColor: "#000000",
        textFont: DATA.FONTS[3],
        x: 1932.6,
        y: 1254.8,
        align: "left",
      },
      {
        dataKeys: ["recipient.name"],
        text: "{recipient.name}",
        textSize: 40,
        textColor: "#000000",
        textStyle: "bold",
        textFont: DATA.FONTS[3],
        align: "left",
        addX: 60,
        y: 1254.8,
      },
    ],
    {
      dataKeys: [
        "recipient.gender",
        "recipient.dateOfBirth",
        "recipient.placeOfBirth",
      ],
      text: "gender: {recipient.gender}, born on {recipient.dateOfBirth} in {recipient.placeOfBirth},",
      textSize: 41.5,
      textColor: "#000000",
      textFont: DATA.FONTS[3],
      x: 1932.6,
      y: 1313,
      align: "left",
    },
    {
      dataKeys: ["certificate.degree"],
      text: "{certificate.degree}",
      textSize: 41,
      textColor: "#000000",
      textStyle: "bold",
      textFont: DATA.FONTS[3],
      x: 2428.8,
      y: 1432,
      align: "left",
    },
    {
      dataKeys: ["certificate.major"],
      text: "{certificate.major}",
      textSize: 40,
      textColor: "#000000",
      textStyle: "bold",
      textFont: DATA.FONTS[3],
      x: 2428.8,
      y: 1503,
      align: "left",
    },
    {
      dataKeys: ["certificate.rectorSignatureDate"],
      text: "Phnom Penh, {certificate.rectorSignatureDate}",
      textSize: 37,
      textColor: "#000000",
      textFont: DATA.FONTS.arial,
      x: 2529,
      y: 1734.2,
      align: "center",
    },
  ];

  const NUM_TEXTS = [
    [
      {
        dataKeys: [],
        text: "លេខ",
        textSize: 35,
        textColor: "#000000",
        textStyle: "500",
        textFont: DATA.FONTS[1],
        x: 1628,
        y: 1994.5,
        align: "left",
      },
      {
        dataKeys: [],
        text: "/N\u00B0:",
        textSize: 35,
        textColor: "#000000",
        textStyle: "500",
        textFont: DATA.FONTS.arial,
        addX: 1,
        y: 1994.5,
        align: "left",
      },
      {
        dataKeys: ["certificate.number"],
        text: "{certificate.number}",
        textSize: 40,
        textColor: "#000000",
        textStyle: "500",
        textFont: DATA.FONTS.arial,
        align: "left",
        addX: 5,
        y: 1994.5,
      },
    ],
  ];

  const bg = await createTemplateImage(DATA.BACKGROUND.pngFilename);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  const kmTargetMatric = 1122;
  KM_JUSTIFY_TEXT.map(x => x.letterSpacing = "dynamic");
  KM_JUSTIFY_TEXT.map(x => x.textMaxWidth = kmTargetMatric);

  KM_JUSTIFY_TEXT[1].text += `${kmDay} ${kmMonth}`;
  KM_TEXTS[0][0].text = `${kmYear} ` + KM_TEXTS[0][0].text;

  const enTargetMatric = 1200;
  EN_JUSTIFY_TEXTS.map(x => x.letterSpacing = "dynamic");
  EN_JUSTIFY_TEXTS.map(x => x.textMaxWidth = enTargetMatric);

  EN_JUSTIFY_TEXTS[1].text = EN_JUSTIFY_TEXTS[1].text
    .replace("{certificate.degree}", degree)
    .replace("Faculty of ", "");
  EN_TEXTS[0][0].text = `${enMonth} ${enYear}, ` + EN_TEXTS[0][0].text;

  const presentedWrap = drawWrapTexts(ctx, {
    top: 1555,
    left: 1932.6,
    width: enTargetMatric,
    textAlignment: "left",
    lineHeight: 1.2,
    spans: [
      {
        text: `This Degree is presented to the bearer with all rights and privileges thereto pertaining.`,
        fontSize: 38,
        fontFamily: "Calibri",
        fillStyle: "#000000",
        fontWeight: "bold",
      },
    ],
  }).draw();

  DATA.TEXTS = [...DATA.TEXTS, ...KM_TEXTS, ...EN_TEXTS, ...NUM_TEXTS, ...EN_JUSTIFY_TEXTS, ...KM_JUSTIFY_TEXT];

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
    const maxY = 1943;
    const maxImgBoxWidth = 270;
    const maxImgBoxHeight = 337;
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
  }

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
    await drawQrCodeStandard(qrcodeContent, ctx, 379, 1785, 247);
  }

  return { canvas, profileX, profileY, sizeBy };
}

const getTextMaxWidth = (ctx, textItem) => {
  ctx.font = resolveFont(textItem.textFont, 24, textItem);
  const kmTargetMatric = ctx.measureText(textItem.text);
  return kmTargetMatric;
};

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
      textColor: textItem.textColor || "#000000",
      align: textItem.align,
      font: resolveFont(defaultFont, 24, textItem),
      textMaxWidth: textItem.textMaxWidth,
      letterSpacing: textItem.letterSpacing,
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
