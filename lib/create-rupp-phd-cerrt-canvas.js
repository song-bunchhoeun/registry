import { createCanvas, loadImage, Image } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, loadRemoteResource } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";
import axios from "axios";
import sharp from "sharp";
import jo from "jpeg-autorotate";
export async function createRUPPPhdDegreeCanvas(
  certificateInfo = {},
  qrcodeContent
) {
  const VANDA_TEXT_COLORS = {
    black: "#000000",
    blue: "#000000",
  };

  const RUPP_FONTS = {
    KhmerOSMuolLight: "Khmer OS Muol Light",
    KhmerOSSiemreap: "Khmer OS Siemreap",
    khmerOSBattambang: "Khmer OS Battambang",
    khmerOSMuolPali: "Khmer OS Muol Pali",
    timesNewRoman: "Times New Roman",
  };
  const nameKm = certificateInfo.recipient.nameKm.replaceAll(" ", "  ");
  const name = certificateInfo.recipient.name.replaceAll(" ", "   ");
  const dateOfBirthKm = certificateInfo.recipient.dateOfBirthKm.replaceAll(
    " ",
    "  "
  );
  const dateOfBirth = certificateInfo.recipient.dateOfBirth.replaceAll(
    " ",
    "   "
  );
  let major = certificateInfo.certificate.major;
  // .split('in')
  let majorKm = certificateInfo.certificate.majorKm;
  // .split('ជំនាញ')
  let rectorSignatureDate =
    certificateInfo.certificate.rectorSignatureDate.replaceAll(" ", "   ");
  let boardSignatureDateKm =
    certificateInfo.certificate.boardSignatureDateKm.replaceAll(" ", "   ");
  let boardSignatureLunarDateKm =
    certificateInfo.certificate.boardSignatureLunarDateKm
      .replaceAll(" ខែ", "  ខែ")
      .replaceAll(" ឆ្នាំ", "  ឆ្នាំ");

  const majorHasBrackets = [
    "Japanese for Business",
    "English for International Business",
    "English for Translation and Interpreting",
    "English for Professional Communication",
    "International Economics",
    "International Relations",
  ];

  if (majorHasBrackets.includes(certificateInfo.certificate.major)) {
    major = `( ${major} )`;
    majorKm = `( ${majorKm} )`;
  } else {
    major = `in ${major} `;
    majorKm = `ជំនាញ ${majorKm} `;
  }

  const DATA = {
    BACKGROUND: {
      // pdfFilename: "rupp-v3-center-no-text.png",
      // pngFilename: "rupp-v3-center-no-text.png",
      pngFilename: "rupp-phd-background.png",
      width: 3508,
      height: 2479,
    },
    FONTS: [
      {
        name: "Old English Text MT",
        filename: "OLDENGL.TTF",
      },
      {
        name: RUPP_FONTS.khmerOSMuolPali,
        filename: "KHMEROSMUOLPALI.TTF",
      },
      {
        name: RUPP_FONTS.khmerOSBattambang,
        filename: "KhmerOS_battambang.ttf",
      },
      {
        name: RUPP_FONTS.KhmerOSMuolLight,
        filename: "KhmerOSmuollight.ttf",
      },
      {
        name: "Times New Roman Bold",
        filename: "timesbd.ttf",
      },
      {
        name: RUPP_FONTS.timesNewRoman,
        filename: "times.ttf",
      },
    ],
    TEXTS: [
      {
        key: "recipient.name",
        dataKeys: ["recipient.name"],
        text: name,
        textSize: 46,
        textColor: VANDA_TEXT_COLORS.blue,
        textStyle: "bold",
        textFont: {
          name: RUPP_FONTS.timesNewRoman,
          filename: "timesbd.ttf",
        },
        x: 1047.5,
        y: 892,
        align: "center",
      },
      {
        key: "recipient.nameKm",
        dataKeys: ["recipient.nameKm"],
        text: nameKm,
        textSize: 48,
        textColor: VANDA_TEXT_COLORS.blue,
        textFont: {
          name: RUPP_FONTS.KhmerOSMuolLight,
          filename: "KhmerOSmuollight.ttf",
        },
        x: 2512,
        y: 892.5,
        align: "center",
      },
      {
        key: "certificate.logDate",
        dataKeys: ["certificate.logDate"],
        text: "dated  {certificate.logDate}",
        textSize: 47,
        textColor: VANDA_TEXT_COLORS.blue,
        textFont: {
          name: RUPP_FONTS.timesNewRoman,
          filename: "times.ttf",
        },
        x: 1043.5,
        y: 662,
        align: "center",
      },
      {
        key: "certificate.logDateKm",
        dataKeys: ["certificate.logDateKm"],
        text: "ចុះថ្ងៃទី {certificate.logDateKm}",
        textSize: 47,
        textColor: VANDA_TEXT_COLORS.blue,
        textFont: {
          name: RUPP_FONTS.khmerOSBattambang,
          filename: "KhmerOS_battambang.ttf",
        },
        x: 2512,
        y: 677.5,
        align: "center",
      },
      {
        key: "recipient.dateOfBirth",
        dataKeys: ["recipient.dateOfBirth"],
        text: `born on  ${dateOfBirth}`,
        textSize: 47,
        textColor: VANDA_TEXT_COLORS.blue,
        textFont: {
          name: RUPP_FONTS.timesNewRoman,
          filename: "times.ttf",
        },
        x: 1047.5,
        y: 961,
        align: "center",
      },
      {
        key: "recipient.dateOfBirthKm",
        dataKeys: ["recipient.dateOfBirthKm"],
        text: `កើត${dateOfBirthKm}`,
        textSize: 47,
        textColor: VANDA_TEXT_COLORS.blue,
        textFont: {
          name: RUPP_FONTS.khmerOSBattambang,
          filename: "times.ttf",
        },
        x: 2512,
        y: 977.8,
        align: "center",
      },
      {
        key: "certificate.degree",
        dataKeys: ["certificate.degree"],
        text: "{certificate.degree}",
        textStyle: "bold",
        textSize: 74,
        textColor: VANDA_TEXT_COLORS.blue,
        textFont: {
          name: "Old English Text MT",
          filename: "OLDENGL.TTF",
        },
        x: 1047.5,
        y: 1146,
        align: "center",
      },
      {
        key: "certificate.degreeKm",
        dataKeys: ["certificate.degreeKm"],
        text: "{certificate.degreeKm}",
        textSize: 51,
        textStyle: "bold",
        textColor: VANDA_TEXT_COLORS.blue,
        textFont: {
          name: RUPP_FONTS.khmerOSMuolPali,
          filename: "KhmerOSmoulPali.ttf",
        },
        x: 2512,
        y: 1147.8,
        align: "center",
      },
      {
        key: "certificate.major",
        dataKeys: ["certificate.major"],
        text: major,
        textSize: 51,
        textColor: VANDA_TEXT_COLORS.blue,
        textFont: {
          name: RUPP_FONTS.timesNewRoman,
          filename: "times.ttf",
        },
        x: 1047.5,
        y: 1235.3,
        align: "center",
      },
      {
        key: "certificate.majorKm",
        dataKeys: ["certificate.majorKm"],
        text: majorKm,
        textSize: 47,
        textColor: VANDA_TEXT_COLORS.blue,
        textFont: {
          name: RUPP_FONTS.KhmerOSSiemreap,
          filename: "KhmerOS_battambang.ttf",
        },
        x: 2512,
        y: 1245.2,
        align: "center",
      },
      {
        key: "certificate.boardSignatureLunarDateKm",
        dataKeys: ["certificate.boardSignatureLunarDateKm"],
        text: boardSignatureLunarDateKm,
        textSize: 47,
        textColor: VANDA_TEXT_COLORS.blue,
        textFont: {
          name: RUPP_FONTS.khmerOSBattambang,
          filename: "KhmerOS_battambang.ttf",
        },
        x: 2517,
        y: 1428.5,
        align: "center",
      },
      {
        key: "certificate.boardSignatureDateKm",
        dataKeys: ["certificate.boardSignatureDateKm"],
        text: boardSignatureDateKm,
        textSize: 47,
        textColor: VANDA_TEXT_COLORS.blue,
        textFont: {
          name: RUPP_FONTS.khmerOSBattambang,
          filename: "KhmerOS_battambang.ttf",
        },
        x: 2517,
        y: 1605,
        align: "center",
      },
      {
        key: "certificate.rectorSignatureDate",
        dataKeys: ["certificate.rectorSignatureDate"],

        text: rectorSignatureDate,
        textSize: 47,
        textColor: VANDA_TEXT_COLORS.blue,
        textFont: {
          name: RUPP_FONTS.timesNewRoman,
          filename: "times.ttf",
        },
        x: 875.5,
        y: 1605.2,
        align: "center",
      },
      {
        key: "certificate.number",
        dataKeys: ["certificate.number"],
        text: "{certificate.number}",
        textSize: 39,
        textColor: VANDA_TEXT_COLORS.blue,
        textStyle: "bold",
        textFont: {
          name: RUPP_FONTS.timesNewRoman,
          filename: "timesbd.ttf",
        },
        x: 1729,
        y: 1690,
        align: "left",
      },
    ],
    QRCODE: {
      width: 270,
      height: 336,
      x: 2913,
      y: 1856.2 - 30,
    },
  };

  const bg = await createTemplateImage(DATA.BACKGROUND.pngFilename);
  const canvas = createCanvas(DATA.BACKGROUND.width, DATA.BACKGROUND.height);
  // const canvas = createCanvas(2105, 1488);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

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

        drawTextItem(canvas, ctx, textItem, DATA.FONTS, certificateInfo);
      }
    } else drawTextItem(canvas, ctx, text, DATA.FONTS, certificateInfo);
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(
      qrcodeContent,
      ctx,
      DATA.QRCODE.x,
      DATA.QRCODE.y,
      DATA.QRCODE.width
    );
  }

  // handel rotate
  // let profileX;
  // let profileY;
  let profileX;
  let profileY = 1768;
  let imgSize = [];
  let sizeBy;

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
    const maxY = 2139;
    const maxImgBoxWidth = 319;
    const maxImgBoxHeight = 371;

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
    profileX = 1782.5 - imgSize[0] / 2;
    profileY = maxY - imgSize[1];
    const image = new Image();
    image.src = resizedBuffer;
    ctx.drawImage(image, profileX, profileY, imgSize[0], imgSize[1]);
  }
  return canvas;
}
const drawTextItem = (canvas, ctx, textItem, FONTS, certificateInfo) => {
  if (typeof textItem.text !== 'string') return;
  
  if (textItem.dataKeys && textItem.dataKeys.length > 0) {
    for (const key of textItem.dataKeys)
      textItem.text = textItem.text.replace(
        `{${key}}`,
        _.get(certificateInfo, key, "")
      );
  }

  drawText(canvas, ctx, textItem.text, {
    x: textItem.x,
    y: textItem.y,
    textColor: textItem.textColor || "#000000",
    align: textItem.align,
    font: resolveFont(FONTS[0].name, 24, textItem),
    // strokeLine: 0.1,
    // strokeColor: '#000000',
    // textMaxWidth: textItem.textMaxWidth,
  });
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
function resolveFont(defaultFont, defaultSize, textItem) {
  const space = " ";
  let font = "";
  const fontName = textItem.textFont ? textItem.textFont.name : defaultFont;

  font += textItem.textStyle ? textItem.textStyle + space : "";
  font += textItem.textSize ? textItem.textSize : defaultSize;
  font += "px" + space;
  font += fontName;
  return font;
}
