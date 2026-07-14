import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, drawWrapTexts } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";
export async function createMinfoWritingNews2025Certificate(
  certificateInfo = {},
  qrcodeContent,
) {
  const TEXT_COLORS = {
    black: "#000000",
    blue: "#2E3192",
  };

  const TEXT_FONTS = {
    khmerOsMoulLight: "Khmer OS Muol Light",
    KhmerOSSiemreap: "Khmer OS Siemreap",
    timesNewRoman: "Times New Roman",
  };

  let LunarDay;
  let lunarMonth;
  let lunarYear;

  const signatureDateKm = _.get(
    certificateInfo,
    "certificate.signatureDateKm",
    "",
  );
  const signatureLunarDateKm = _.get(
    certificateInfo,
    "certificate.signatureLunarDateKm",
    "",
  );
  LunarDay = `${signatureLunarDateKm.split(" ")[0].split("ថ្ងៃ")[1]} ${
    signatureLunarDateKm.split(" ")[1]
  }`;
  lunarMonth = `${signatureLunarDateKm.split(" ")[2].split("ខែ")[1]}`;
  lunarYear = `${signatureLunarDateKm.split("ឆ្នាំ")[1]}`;

  let dobKm = _.get(certificateInfo, "recipient.dateOfBirthKm", "");
  dobKm = dobKm.replace("ថ្ងៃទី", "").replace("ខែ", " ").replace("ឆ្នាំ", " ");

  const specificCourseKm = _.get(certificateInfo, "certificate.courseKm", "");

  const cleanedCourseKm = specificCourseKm.replace("វគ្គបណ្តុះបណ្តាលជំនាញ", "");

  const DATA = {
    BACKGROUND: {
      pngFilename: "minfo-certificate-of-traning-2024.jpg",
      width: 3508,
      height: 2479,
    },
    FONTS: [
      {
        name: "Khmer Moul",
        filename: "KhmerMoul.ttf",
      },
      {
        name: "Times New Roman",
        filename: "times.ttf",
      },
      {
        name: "Times New Roman Bold",
        filename: "timesbd.ttf",
      },
    ],
    TEXTS: [
      {
        key: "certificate.number",
        dataKeys: ["certificate.number"],
        text: "{certificate.number}",
        textSize: 35,
        textColor: TEXT_COLORS.black,
        textFont: {
          name: TEXT_FONTS.khmerOsMoulLight,
          filename: "KhmerMoul.ttf",
        },
        x: 635,
        y: 852 - 34,
        align: "left",
      },
      {
        key: "recipient.nameKm",
        dataKeys: ["recipient.nameKm"],
        text: "{recipient.nameKm}",
        textSize: 40,
        textColor: TEXT_COLORS.black,
        textFont: {
          name: TEXT_FONTS.khmerOsMoulLight,
          filename: "KhmerMoul.ttf",
        },
        x: 601.5,
        y: 956 - 34,
        align: "left",
      },
      {
        key: "recipient.genderKm",
        dataKeys: ["recipient.genderKm"],
        text: "{recipient.genderKm}",
        textSize: 40,
        textColor: TEXT_COLORS.black,
        textFont: {
          name: TEXT_FONTS.khmerOsMoulLight,
          filename: "KhmerMoul.ttf",
        },
        x: 601.5,
        y: 1049.9 - 34,
        align: "left",
      },
      {
        key: "recipient.nationalityKm",
        dataKeys: ["recipient.nationalityKm"],
        text: "{recipient.nationalityKm}",
        textSize: 40,
        textColor: TEXT_COLORS.black,
        textFont: {
          name: TEXT_FONTS.khmerOsMoulLight,
          filename: "KhmerMoul.ttf",
        },
        x: 1109,
        y: 1049.9 - 34,
        align: "left",
      },
      {
        key: "recipient.dateOfBirthKm",
        dataKeys: ["recipient.dateOfBirthKm"],
        text: dobKm,
        textSize: 40,
        textColor: TEXT_COLORS.black,
        textFont: {
          name: TEXT_FONTS.khmerOsMoulLight,
          filename: "KhmerMoul.ttf",
        },
        x: 686,
        y: 1147.1 - 34,
        align: "left",
      },
      {
        key: "certificate.durationKm",
        dataKeys: ["certificate.durationKm"],
        text: "{certificate.durationKm}",
        textSize: 40,
        textColor: TEXT_COLORS.black,
        textFont: {
          name: TEXT_FONTS.khmerOsMoulLight,
          filename: "KhmerMoul.ttf",
        },
        x: 1351.5,
        y: 1332 - 34,
        align: "left",
      },
      {
        key: "certificate.fromKm",
        dataKeys: ["certificate.fromKm"],
        text: "{certificate.fromKm}",
        textSize: 40,
        textColor: TEXT_COLORS.black,
        textFont: {
          name: TEXT_FONTS.khmerOsMoulLight,
          filename: "KhmerMoul.ttf",
        },
        x: 530.5,
        y: 1432.8 - 34,
        align: "left",
      },
      {
        key: "certificate.toKm",
        dataKeys: ["certificate.toKm"],
        text: "{certificate.toKm}",
        textSize: 40,
        textColor: TEXT_COLORS.black,
        textFont: {
          name: TEXT_FONTS.khmerOsMoulLight,
          filename: "KhmerMoul.ttf",
        },
        x: 1124.5,
        y: 1432.8 - 34,
        align: "left",
      },
      {
        key: "recipient.name",
        dataKeys: ["recipient.name"],
        text: "{recipient.name}",
        textSize: 44,
        textStyle: "bold",
        textColor: TEXT_COLORS.black,
        textFont: {
          name: TEXT_FONTS.timesNewRoman,
          filename: "times.ttf",
        },
        x: 2259,
        y: 958.9 - 34,
        align: "left",
      },
      {
        key: "recipient.gender",
        dataKeys: ["recipient.gender"],
        text: "{recipient.gender}",
        textSize: 44,
        textColor: TEXT_COLORS.black,
        textStyle: "bold",
        textFont: {
          name: TEXT_FONTS.timesNewRoman,
          filename: "times.ttf",
        },
        x: 1982.5,
        y: 1050 - 34,
        align: "left",
      },
      {
        key: "recipient.nationality",
        dataKeys: ["recipient.nationality"],
        text: "{recipient.nationality}",
        textSize: 44,
        textColor: TEXT_COLORS.black,
        textStyle: "bold",
        textFont: {
          name: TEXT_FONTS.timesNewRoman,
          filename: "times.ttf",
        },
        x: 2556.5,
        y: 1049.8 - 34,
        align: "left",
      },
      {
        key: "recipient.dateOfBirth",
        dataKeys: ["recipient.dateOfBirth"],
        text: "{recipient.dateOfBirth}",
        textSize: 44,
        textStyle: "bold",
        textColor: TEXT_COLORS.black,
        textFont: {
          name: TEXT_FONTS.timesNewRoman,
          filename: "times.ttf",
        },
        x: 2170.5,
        y: 1147.8 - 34,
        align: "left",
      },
      {
        key: "certificate.duration",
        dataKeys: ["certificate.duration"],
        text: "{certificate.duration}",
        textSize: 44,
        textColor: TEXT_COLORS.black,
        textStyle: "bold",
        textFont: {
          name: TEXT_FONTS.timesNewRoman,
          filename: "times.ttf",
        },
        x: 2689.5,
        y: 1331.9 - 34,
        align: "left",
      },
      {
        key: "certificate.from",
        dataKeys: ["certificate.from"],
        text: "{certificate.from}",
        textSize: 44,
        textColor: TEXT_COLORS.black,
        textStyle: "bold",
        textFont: {
          name: TEXT_FONTS.timesNewRoman,
          filename: "times.ttf",
        },
        x: 1995.5,
        y: 1432.7 - 34,
        align: "left",
      },
      {
        key: "certificate.to",
        dataKeys: ["certificate.to"],
        text: "{certificate.to}",
        textSize: 44,
        textColor: TEXT_COLORS.black,
        textStyle: "bold",
        textFont: {
          name: TEXT_FONTS.timesNewRoman,
          filename: "times.ttf",
        },
        x: 2547.5,
        y: 1432.7 - 34,
        align: "left",
      },
      {
        key: "rcertificate.to",
        dataKeys: ["certificate.to"],
        text: LunarDay,
        textSize: 40,
        textColor: TEXT_COLORS.black,
        textFont: {
          name: TEXT_FONTS.KhmerOSSiemreap,
          filename: "KhmerMoul.ttf",
        },
        x: 1917.5,
        y: 1624.8 - 34,
        align: "left",
      },
      {
        key: "certificate.to",
        dataKeys: ["certificate.to"],
        text: lunarMonth,
        textSize: 40,
        textColor: TEXT_COLORS.black,
        textFont: {
          name: TEXT_FONTS.KhmerOSSiemreap,
          filename: "KhmerMoul.ttf",
        },
        x: 2360,
        y: 1624.8 - 34,
        align: "left",
      },
      {
        key: "certificate.to",
        dataKeys: ["certificate.to"],
        text: lunarYear,
        textSize: 40,
        textColor: TEXT_COLORS.blue,
        textFont: {
          name: TEXT_FONTS.KhmerOSSiemreap,
          filename: "KhmerMoul.ttf",
        },
        x: 2360 + 230,
        y: 1595,
        align: "left",
      },
      {
        key: "recipient.day",
        dataKeys: ["recipient.day"],
        text: signatureDateKm.split(" ")[0],
        textSize: 40,
        textColor: TEXT_COLORS.black,
        textFont: {
          name: TEXT_FONTS.KhmerOSSiemreap,
          filename: "KhmerMoul.ttf",
        },
        x: 2308.5,
        y: 1719.8 - 34,
        align: "left",
      },
      {
        key: "recipient.month",
        dataKeys: ["recipient.month"],
        text: signatureDateKm.split(" ")[1],
        textSize: 40,
        textColor: TEXT_COLORS.black,
        textFont: {
          name: TEXT_FONTS.KhmerOSSiemreap,
          filename: "KhmerMoul.ttf",
        },
        x: 2552.5,
        y: 1719.8 - 34,
        align: "left",
      },
      {
        key: "recipient.year",
        dataKeys: ["recipient.year"],
        text: signatureDateKm.split(" ")[2],
        textSize: 40,
        textColor: TEXT_COLORS.black,
        textFont: {
          name: TEXT_FONTS.KhmerOSSiemreap,
          filename: "KhmerMoul.ttf",
        },
        x: 2815.5,
        y: 1719.8 - 34,
        align: "left",
      },
    ],
    QRCODE: {
      width: 243,
      height: 299.7,
      x: 420,
      y: 1890,
    },
  };

  const getTextMaxWidth = (ctx, textItem) => {
    ctx.font = resolveFont(textItem.textFont, textItem.textSize, textItem);
    const targetMatric = ctx.measureText(textItem.text);
    return targetMatric;
  };

  let courseText = [
    {
      // key: 'certificate.courseKm',
      dataKeys: ["certificate.courseKm"],
      text: cleanedCourseKm,
      textSize: 40,
      textColor: TEXT_COLORS.black,
      textFont: {
        name: TEXT_FONTS.khmerOsMoulLight,
        filename: "KhmerMoul.ttf",
      },
    },
    {
      // key: 'certificate.course',
      dataKeys: ["certificate.course"],
      text: certificateInfo.certificate.course,
      textSize: 44,
      textColor: TEXT_COLORS.black,
      textStyle: "bold",
      textFont: {
        name: TEXT_FONTS.timesNewRoman,
        filename: "times.ttf",
      },
    },
  ];

  const bg = await createTemplateImage(DATA.BACKGROUND.pngFilename);
  const canvas = createCanvas(DATA.BACKGROUND.width, DATA.BACKGROUND.height);
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

  const courseKmFontSize = adjustFontSize(ctx, courseText[0], 1140);
  const courseFontSize = adjustFontSize(ctx, courseText[1], 1095);

  const courseKmWrap = drawWrapTexts(ctx, {
    top: courseKmFontSize >= 30 ? 1242 : 1237,
    left: 427.3,
    width: 1298,
    textAlign: "left",
    lineHeight: courseKmFontSize >= 30 ? 2.3 : 2.48,
    spans: [
      {
        text: " ".repeat(73),
        fontSize: 40,
        fontFamily: TEXT_FONTS.khmerOsMoulLight,
        fillStyle: TEXT_COLORS.black,
      },
      {
        text: cleanedCourseKm,
        fontSize: courseKmFontSize,
        fontFamily: TEXT_FONTS.khmerOsMoulLight,
        fillStyle: TEXT_COLORS.black,
      },
    ],
  });

  courseKmWrap.draw();

  const courseWrap = drawWrapTexts(ctx, {
    top: 1246 - (44 - courseFontSize),
    left: 1860.7,
    width: 1298,
    textAlign: "left",
    lineHeight: 2 + (44 - courseFontSize) / 50,
    spans: [
      {
        text: " ".repeat(73),
        fontSize: 43.5,
        fontFamily: TEXT_FONTS.timesNewRoman,
        fillStyle: TEXT_COLORS.black,
      },
      {
        text: certificateInfo.certificate.course,
        fontSize: courseFontSize,
        fontFamily: TEXT_FONTS.timesNewRoman,
        fillStyle: TEXT_COLORS.black,
        fontWeight: "bold",
      },
    ],
  });
  courseWrap.draw();

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
      DATA.QRCODE.width,
    );
  }
  return canvas;
}
const drawTextItem = (canvas, ctx, textItem, FONTS, certificateInfo) => {
  if (textItem.dataKeys && textItem.dataKeys.length > 0) {
    for (const key of textItem.dataKeys)
      textItem.text = textItem.text.replace(
        `{${key}}`,
        _.get(certificateInfo, key, ""),
      );
  }

  drawText(canvas, ctx, textItem.text, {
    x: textItem.x,
    y: textItem.y + 34,
    textColor: textItem.textColor || "TEXT_COLORS.black",
    align: textItem.align,
    font: resolveFont(FONTS[0].name, 24, textItem),
  });
};

export async function drawQrCodeStandard(
  qrcodeContent,
  ctx,
  x = 0,
  y = 0,
  width = 120,
) {
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
