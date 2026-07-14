import { Image, createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";
import axios from "axios";
import sharp from "sharp";
import jo from 'jpeg-autorotate';
import { drawWrapTexts } from "./create-biu-np-bachelor-certificate";

export async function createBIUIpMasterCertificate(
  certificateInfo = {},
  qrcodeContent
) {
  const DATA = {
    BACKGROUND: {
      // pngFilename: "biu-ip-certificate-sample-2x.png",
      pngFilename: "biu-master-ip-certificate-2x.png",
    },
    FONTS: [
      { name: "Khmer OS Battambang", filename: "KhmerOS_battambang.ttf" },
      { name: "Khmer OS Muol Light", filename: "KhmerOSmuollight.ttf" },
      { name: "Times New Roman", filename: "times.ttf" },
      { name: "Arial", filename: "Arial.ttf" },
    ],
    TEXTS: [],
  };
  const MPTC_TEXT_COLORS = {
    black: "#000000",
  };

  const nameKm = _.get(certificateInfo, "recipient.nameKm") || "";
  const name = _.get(certificateInfo, "recipient.name" || "");
  const degreeKm = _.get(certificateInfo, "certificate.degreeKm");
  const degree = _.get(certificateInfo, "certificate.degree");
  const majorKm = _.get(certificateInfo, "certificate.majorKm");
  const major = _.get(certificateInfo, "certificate.major");

  let nameData = [
    {
      dataKeys: ["recipient.nameKm"],
      text: nameKm,
      textSize: 106,
      textFont: { name: "Khmer OS Muol Light" },
    },
    {
      dataKeys: ["certificate.name"],
      text: name,
      textSize: 129.5,
      textFont: { name: "Times New Roman" },
      textStyle: "bold",
    },
    {
      dataKeys: ["certificate.degreeKm"],
      text: degreeKm,
      textSize: 106.3,
      textFont: { name: "Khmer OS Muol Light" },
    },
    {
      dataKeys: ["certificate.degree"],
      text: degree,
      textSize: 118.4,
      textFont: { name: "Times New Roman" },
      textStyle: "bold",
    },
    {
      dataKeys: ["certificate.majorKm"],
      text: majorKm,
      textSize: 106.3,
      textFont: { name: "Khmer OS Muol Light" },
    },
    {
      dataKeys: ["certificate.major"],
      text: major,
      textSize: 112,
      textFont: { name: "Times New Roman" },
      textStyle: "bold",
    },
  ];

  const getTextMaxWidth = (ctx, textItem) => {
    ctx.font = resolveFont(textItem.textFont, textItem.textSize, textItem);
    const targetMatric = ctx.measureText(textItem.text || "");
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
      fontSize -= 0.1;
      getTextWidth = getTextMaxWidth(ctx, {
        ...dataItem,
        textSize: fontSize,
      });
    }
    return fontSize;
  };

  const nameKmFontSize = adjustFontSize(ctx, nameData[0], 1420);
  const nameFontSize = adjustFontSize(ctx, nameData[1], 1780);
  const degreeKmFontSize = adjustFontSize(ctx, nameData[2], 1630);
  const degreeFontSize = adjustFontSize(ctx, nameData[3], 2740);
  const majorKmFontSize = adjustFontSize(ctx, nameData[4], 2440);
  const majorKmFontSizeNewLine = adjustFontSize(ctx, nameData[4], 2460);
  const majorFontSize = adjustFontSize(ctx, nameData[5], 2740);

  const keywords = ["ទេសចរណ៍និងបដិសណ្ឋារកិច្ច", "ហិរញ្ញវត្ថុនិងធនាគារ"];
  const newLineKeywords = ["គ្រប់គ្រងពាណិជ្ជកម្ម"]

  const degreeKmType = keywords.some((keyword) =>
    degreeKm.replace(/\s+/g, "").includes(keyword.replace(/\s+/g, ""))
  );

  const degreeKmNewLine = newLineKeywords.some((newLineKeyword) =>
    degreeKm.replace(/\s+/g, "").includes(newLineKeyword.replace(/\s+/g, ""))
  );

  drawWrapTexts(ctx, {
    top: 5352,
    left: 586.3,
    width: 2667,
    textAlignment: "left",
    lineHeight: 2.2,
    spans: [
      {
        text: `សម្រាប់ទទួលសញ្ញាបត្រ `,
        fontSize: 102,
        fontFamily: DATA.FONTS[0].name,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "500",
      },
      ...(degreeKmNewLine
        ? [
          {
            text: "បរិញ្ញាបត្រជាន់ខ្ពស់",
            fontSize: 102,
            fontFamily: DATA.FONTS[1].name,
            fillStyle: MPTC_TEXT_COLORS.black,
          },
          {
            text: `\n${degreeKm.replace("បរិញ្ញាបត្រជាន់ខ្ពស់ ", "")} `,
            fontSize: 102,
            fontFamily: DATA.FONTS[1].name,
            fillStyle: MPTC_TEXT_COLORS.black,
          }
        ]
        : [
          {
            text: degreeKm + (degreeKmType ? " " : ""),
            fontSize: degreeKmType ? 102 : degreeKmFontSize,
            fontFamily: DATA.FONTS[1].name,
            fillStyle: MPTC_TEXT_COLORS.black,
          }
        ]
      ),
      {
        text: degreeKmType || degreeKmNewLine ? "ផ្នែក " : "\nផ្នែក ",
        fontSize: 102,
        fontFamily: DATA.FONTS[0].name,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "500",
      },
      {
        text: majorKm,
        fontSize: degreeKmType
          ? majorKmFontSize
          : majorKmFontSizeNewLine,

        fontFamily: DATA.FONTS[1].name,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "500",
      },
    ],
  }).draw();

  const KM_TEXTS = [
    {
      dataKeys: ["certificate.logDateKm"],
      text: "{certificate.logDateKm}",
      textSize: 102,
      textFont: { name: "Khmer OS Battambang" },
      textColor: MPTC_TEXT_COLORS.black,
      textStyle: "bold",
      strokeColor: MPTC_TEXT_COLORS.black,
      x: 1088.5 + 1090,
      y: 2123 + 2285 - 165,
      align: "center",
    },
    {
      dataKeys: ["recipient.nameKm"],
      text: nameKm,
      textSize: nameKmFontSize,
      textFont: { name: "Khmer OS Muol Light" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 1727,
      y: 2339.5 + 2500 - 159,
      align: "center",
    },
    {
      dataKeys: ["recipient.genderKm"],
      text: "{recipient.genderKm}",
      textSize: 106.3,
      textFont: { name: "Khmer OS Muol Light" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 2724,
      y: 2339.5 + 2502 - 159,
      align: "left",
    },
    {
      dataKeys: ["recipient.dateOfBirthKm"],
      text: "{recipient.dateOfBirthKm}",
      textSize: 106.3,
      textFont: { name: "Khmer OS Muol Light" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 1280,
      y: 2451.5 + 2611 - 159,
      align: "left",
    },
    {
      dataKeys: ["certificate.chairSignatureLunarDateKm"],
      text: "{certificate.chairSignatureLunarDateKm}",
      textSize: 106,
      textFont: { name: "Khmer OS Battambang" },
      textColor: MPTC_TEXT_COLORS.black,
      strokeColor: MPTC_TEXT_COLORS.black,
      x: 585,
      y: 3225 + 3225,
      align: "left",
    },
    {
      dataKeys: ["certificate.chairSignatureDateKm"],
      text: "{certificate.chairSignatureDateKm}",
      textSize: 118,
      textFont: { name: "Khmer OS Battambang" },
      textColor: MPTC_TEXT_COLORS.black,
      strokeLine: 0.2,
      strokeColor: MPTC_TEXT_COLORS.black,
      x: 1882,
      y: 3341 + 3342,
      align: "center",
    },
  ];
  const EN_TEXTS = [
    {
      dataKeys: ["certificate.logDate"],
      text: "{certificate.logDate}",
      textSize: 106,
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      textStyle: "bold",
      x: 5733,
      y: 2123 + 2282 - 155,
      align: "center",
    },
    {
      dataKeys: ["certificate.logDate"],
      text: "of the",
      textSize: 111,
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 6199,
      y: 2123 + 2286 - 158,
      align: "left",
    },
    {
      dataKeys: ["recipient.name"],
      text: name,
      textSize: nameFontSize,
      textFont: { name: "Times New Roman" },
      textStyle: "bold",
      textColor: MPTC_TEXT_COLORS.black,
      x: 4924,
      y: 2339.5 + 2502.5 - 159,
      align: "center",
    },
    {
      dataKeys: ["recipient.gender"],
      text: "{recipient.gender}",
      textSize: 125.5,
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      textStyle: "bold",
      x: 6087,
      y: 2339.5 + 2502.5 - 159,
      align: "left",
    },
    {
      dataKeys: ["recipient.dateOfBirth"],
      text: "{recipient.dateOfBirth}",
      textSize: 124,
      textFont: { name: "Times New Roman" },
      textStyle: "bold",
      textColor: MPTC_TEXT_COLORS.black,
      x: 4923,
      y: 2339.5 + 2719 - 160,
      align: "center",
    },
    {
      dataKeys: ["certificate.degree"],
      text: degree,
      textSize: degreeFontSize,
      textFont: { name: "Times New Roman" },
      textStyle: "bold",
      textColor: MPTC_TEXT_COLORS.black,
      x: 3728,
      y: 2339.5 + 3165 - 160,
      align: "left",
    },
    {
      dataKeys: ["certificate.major"],
      text: major,
      textSize: majorFontSize,
      textFont: { name: "Times New Roman" },
      textStyle: "bold",
      textColor: MPTC_TEXT_COLORS.black,
      x: 3728,
      y: 2339.5 + 3397 - 164,
      align: "left",
    },
    {
      dataKeys: ["certificate.presidentSignatureDate"],
      text: "{certificate.presidentSignatureDate}",
      textSize: 129.8,
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      x: 4602,
      y: 2339.5 + 4354,
      align: "left",
    },
    {
      dataKeys: ["certificate.number"],
      text: "{certificate.number}",
      textSize: 140,
      textStyle: "500",
      textFont: { name: "Times New Roman" },
      textColor: MPTC_TEXT_COLORS.black,
      y: 3218 + 3190,
      x: 3750,
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
      if (err && err.code !== 'read_exif' && err.code !== 'no_orientation') {
        console.log(err);
      }
    }

    const img = sharp(resBuffer, { failOn: "truncated" });
    const maxY = 3938 + 3750;
    const maxImgBoxWidth = 952;
    const maxImgBoxHeight = 1005;
    profileX = bg.width / 2 + 150;
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
          const lastItemMetric = ctx.measureText(lastItem.text || "");
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
    await drawQrCodeStandard(qrcodeContent, ctx, 676, 8710, 642);
  }

  let qrLink = certificateInfo.certificate.link ?? "";
  if (qrLink) {
    await qrCertificate(qrLink, ctx, 5802, 8820, 622);
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
export async function qrCertificate(qrLink, ctx, x = 0, y = 0, width = 120) {
  const gapSize = (width * 10) / 120;
  const qrcodeSize = width - gapSize * 2;
  const qrcodeBuffer = await QRCode.toBuffer(qrLink, {
    margin: 0,
    width: qrcodeSize,
  });
  const qrcodeImage = await loadImage(qrcodeBuffer);
  ctx.drawImage(qrcodeImage, x + gapSize, y + gapSize);
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
