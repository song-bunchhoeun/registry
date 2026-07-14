import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";
import { drawWrapTexts } from "./shared";

export async function createMPTCDigitalAdoptionAppreciationCertificateCanvas(
  certificateInfo = {},
  qrcodeContent
) {
  const MPTC_TEXT_COLORS = {
    black: "#040404",
    blue: "#1b4580",
  };

  const MPTC_FONTS = {
    primary: "Khmer OS Muol Light",
    secondary: "NiDA Sowannaphum",
    thirdly: "Google Sans",
  };

  const MPTC_TEMPLATE_IMAGE = "mptc-certificate-appreciation-2025.jpg";

  const nameKm = _.get(certificateInfo, "recipient.nameKm", "");
  const name = _.get(certificateInfo, "recipient.name", "");
  const departmentKm = _.get(certificateInfo, "recipient.departmentKm", "");
  const department = _.get(certificateInfo, "recipient.department", "");
  const topicKm = _.get(certificateInfo, "certificate.topicKm");
  const isInProvince = !!_.get(certificateInfo, "recipient.provinceKm", "");
  const type = _.get(certificateInfo, "certificate.type");

  let MPTC_TEXTS_MEASURE = [
    {
      dataKeys: ["recipient.nameKm"],
      text: `${certificateInfo.recipient.nameKm}`,
      textSize: 50,
      textFont: MPTC_FONTS.primary,
    },
    {
      dataKeys: ["recipient.name"],
      text: `${certificateInfo.recipient.name}`,
      textSize: 50,
      textStyle: "bold",
      textFont: MPTC_FONTS.thirdly,
    },
    {
      dataKeys: ["recipient.departmentKm"],
      text: `${certificateInfo.recipient.departmentKm}`,
      textSize: 50,
      textFont: MPTC_FONTS.primary,
    },
    {
      dataKeys: ["recipient.department"],
      text: `${certificateInfo.recipient.department}`,
      textSize: 50,
      textFont: MPTC_FONTS.thirdly,
      textStyle: "bold",
    },
    {
      dataKeys: ["recipient.provinceKm"],
      text: `${certificateInfo.recipient.provinceKm}`,
      textSize: 50,
      textFont: MPTC_FONTS.primary,
    },
    {
      dataKeys: ["recipient.province"],
      text: `${certificateInfo.recipient.province}`,
      textSize: 50,
      textStyle: "bold",
      textFont: MPTC_FONTS.thirdly,
    },
    {
      dataKeys: ["certificate.topicKm"],
      text: `\u201C${certificateInfo.certificate.topicKm}\u201D`,
      textSize: 50,
      textFont: MPTC_FONTS.secondary,
    },
    {
      dataKeys: ["certificate.theme"],
      text: `Under the theme of \u201C${certificateInfo.certificate.theme}\u201D`,
      textSize: 46,
      textFont: MPTC_FONTS.thirdly,
    },
    {
      dataKeys: ["certificate.dateKm"],
      text: `${certificateInfo.certificate.dateKm} នៅ${certificateInfo.certificate.locationKm}។`,
      textSize: 50,
      textFont: MPTC_FONTS.secondary,
    },
    {
      dataKeys: ["certificate.date"],
      text: `${certificateInfo.certificate.date} in ${certificateInfo.certificate.location}.`,
      textSize: 50,
      textFont: MPTC_FONTS.thirdly,
    },
  ];

  const getTextMaxWidth = (ctx, textItem) => {
    ctx.font = resolveFont(textItem.textFont, textItem.textSize, textItem);
    const targetMatric = ctx.measureText(textItem.text);
    return targetMatric;
  };

  const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
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

  const nameKmFontSize = adjustFontSize(ctx, MPTC_TEXTS_MEASURE[0], 1550);
  const departmentKmFontSize = adjustFontSize(ctx, MPTC_TEXTS_MEASURE[2], 1550);
  const provinceKmFontSize = adjustFontSize(ctx, MPTC_TEXTS_MEASURE[4], 1550);
  const topicKmFontSize = adjustFontSize(ctx, MPTC_TEXTS_MEASURE[6], 1550);
  const dateKmFontSize = adjustFontSize(ctx, MPTC_TEXTS_MEASURE[8], 1550);

  const nameFontSize = adjustFontSize(ctx, MPTC_TEXTS_MEASURE[1], 1580);
  const departmentFontSize = adjustFontSize(ctx, MPTC_TEXTS_MEASURE[3], 1580);
  const provinceFontSize = adjustFontSize(ctx, MPTC_TEXTS_MEASURE[5], 1580);
  const themeFontSize = adjustFontSize(ctx, MPTC_TEXTS_MEASURE[7], 1580);
  const dateFontSize = adjustFontSize(ctx, MPTC_TEXTS_MEASURE[9], 1580);

  const MPTC_TEXTS = [
    {
      dataKeys: ["recipient.departmentKm"],
      text: isInProvince ? null : `{recipient.departmentKm}`,
      textSize: departmentKmFontSize,
      textColor: MPTC_TEXT_COLORS.blue,
      y: 995,
      x: "975",
      align: "center",
      textFont: MPTC_FONTS.primary,
    },
    {
      dataKeys: ["recipient.nameKm"],
      text: "{recipient.nameKm}",
      textSize: nameKmFontSize,
      textColor: MPTC_TEXT_COLORS.blue,
      y: 910,
      x: "975",
      align: "center",
      textFont: MPTC_FONTS.primary,
    },
  ];

  for (const text of MPTC_TEXTS) {
    if (text.text === null) continue; // Skip null text entries

    if (text.dataKeys && text.dataKeys.length > 0) {
      for (const key of text.dataKeys)
        text.text = text.text.replace(
          `{${key}}`,
          _.get(certificateInfo, key, "")
        );
    }

    drawText(canvas, ctx, text.text, {
      x: text.x,
      y: text.y,
      textColor: text.textColor || MPTC_TEXT_COLORS.black,
      align: text.align,
      font: resolveFont(MPTC_FONTS.primary, 24, text),
    });
  }

  const signatureEmboss = await loadImage(
    path.join(process.cwd(), "assets", "mptc-minister-signature.png")
  );
  ctx.drawImage(signatureEmboss, 1528, 1850, 688, 356);

  const drawPresentToKm = drawWrapTexts(ctx, {
    top: 828,
    left: 190,
    width: 1550,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: "ជូនចំពោះ",
        fontSize: 50,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.black,
      },
    ],
  }).draw();

  const drawPresentTo = drawWrapTexts(ctx, {
    top: 830,
    left: 1752,
    width: 1580,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: "Presented to",
        fontSize: 50,
        fontFamily: MPTC_FONTS.thirdly,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "500",
      },
    ],
  }).draw();

  const drawNameWrap = drawWrapTexts(ctx, {
    top: 914,
    left: 1754,
    width: 1580,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: name,
        fontSize: nameFontSize,
        fontFamily: MPTC_FONTS.thirdly,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "bold",
      },
    ],
  }).draw();

  if (isInProvince) {
    const drawPositionKmWrap = drawWrapTexts(ctx, {
      top: isInProvince ? 995 : 1050.5,
      left: 200,
      width: 1550,
      textAlignment: "center",
      lineHeight: 1,
      spans: [
        {
          text: positionKm,
          fontSize: positionKmFontSize,
          fontFamily: MPTC_FONTS.primary,
          fillStyle: MPTC_TEXT_COLORS.blue,
        },
      ],
    }).draw();
  }
  const drawdepartmentWrap = drawWrapTexts(ctx, {
    top: 997,
    left: 1754,
    width: 1580,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: department,
        fontSize: departmentFontSize,
        fontFamily: MPTC_FONTS.thirdly,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "bold",
      },
    ],
  }).draw();

  const drawDescLine1Km = drawWrapTexts(ctx, {
    top: 1078,
    left: 200,
    width: 1550,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text:
          type === "trainer"
            ? "ដែលបានចូលរួមជាវាគ្មិនកិត្តិយស"
            : "ដែលបានចូលរួមសម្របសម្រួលក្នុង",
        fontSize: 50,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.black,
      },
    ],
  }).draw();

  const drawDescLine2Km = drawWrapTexts(ctx, {
    top: 1162,
    left: 200,
    width: 1550,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: `សិក្ខាសាលាពង្រឹងសមត្ថភាពអនុវត្តការងារនៅមន្ទីរប្រៃសណីយ៍`,
        fontSize: 50,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.black,
      },
    ],
  }).draw();

  const drawDescLine3Km = drawWrapTexts(ctx, {
    top: 1245,
    left: 200,
    width: 1550,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: `និងទូរគមនាគមន៍ឆ្នាំ២០២៥ ក្រោមប្រធានបទ`,
        fontSize: 50,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.black,
      },
    ],
  }).draw();

  const drawDescLine4Km = drawWrapTexts(ctx, {
    top: 1327,
    left: 200,
    width: 1550,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: "\u201C",
        fontSize: topicKmFontSize,
        fontFamily: MPTC_FONTS.thirdly,
        fillStyle: MPTC_TEXT_COLORS.black,
      },
      {
        text: topicKm,
        fontSize: topicKmFontSize,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "bold",
      },
      {
        text: "\u201D",
        fontSize: topicKmFontSize,
        fontFamily: MPTC_FONTS.thirdly,
        fillStyle: MPTC_TEXT_COLORS.black,
      },
    ],
  }).draw();

  const drawDateKmWrap = drawWrapTexts(ctx, {
    top: 1410,
    left: 200,
    width: 1550,
    textAlignment: "center",
    lineHeight: 1.6,
    spans: [
      {
        text: `ចាប់ពី${certificateInfo.certificate.topicDateKm}។`,
        fontSize: dateKmFontSize,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.black,
      },
    ],
  }).draw();

  const drawDescLine1 = drawWrapTexts(ctx, {
    top: 1079,
    left: 1754,
    width: 1580,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: `in greatful recognition of your outstanding contribution as`,
        fontSize: 47,
        fontFamily: MPTC_FONTS.thirdly,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "500",
      },
    ],
  }).draw();

  const drawDescLine2 = drawWrapTexts(ctx, {
    top: 1164,
    left: 1754,
    width: 1580,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text:
          type === "trainer"
            ? " as a guest speaker in the Workshop on Enhancing Work Performance"
            : " coordinator in the Workshop on Enhancing Work Performance",
        fontSize: 48,
        fontFamily: MPTC_FONTS.thirdly,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "500",
      },
    ],
  }).draw();

  const drawDescLine3 = drawWrapTexts(ctx, {
    top: 1246,
    left: 1754,
    width: 1580,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: "at Post and Telecommunications Provincial Departments in 2025",
        fontSize: 48,
        fontFamily: MPTC_FONTS.thirdly,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "500",
      },
    ],
  }).draw();

  const drawDescLine4 = drawWrapTexts(ctx, {
    top: 1330,
    left: 1754,
    width: 1580,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: "Under the theme of",
        fontSize: 48,
        fontFamily: MPTC_FONTS.thirdly,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "500",
      },
      {
        text: ` "${certificateInfo.certificate.topic}"`,
        fontSize: 48,
        fontFamily: MPTC_FONTS.thirdly,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "700",
      },
    ],
  }).draw();

  const drawDateWrap = drawWrapTexts(ctx, {
    top: 1413,
    left: 1754,
    width: 1580,
    textAlignment: "center",
    lineHeight: 1.6,
    spans: [
      {
        text: `held from  ${certificateInfo.certificate.topicDate}.`,
        fontSize: dateFontSize,
        fontFamily: MPTC_FONTS.thirdly,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "500",
      },
    ],
  }).draw();

  const drawSignatureLunarDateKmWrap = drawWrapTexts(ctx, {
    top: 1518,
    left: 0,
    width: 3508,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: `${certificateInfo.certificate.ministerSignatureLunarDateKm}`,
        fontSize: 50,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.black,
      },
    ],
  }).draw();

  const drawSignatureDateKmWrap = drawWrapTexts(ctx, {
    top: 1607,
    left: 0,
    width: 3508,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: `${certificateInfo.certificate.ministerSignatureDateKm}`,
        fontSize: 50,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.black,
      },
    ],
  }).draw();

  const drawSignatureDateWrap = drawWrapTexts(ctx, {
    top: 1694,
    left: 0,
    width: 3508,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: `${certificateInfo.certificate.ministerSignatureDate}`,
        fontSize: 50,
        fontFamily: MPTC_FONTS.thirdly,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "500",
      },
    ],
  }).draw();

  const drawMinisterKmWrap = drawWrapTexts(ctx, {
    top: 1774,
    left: 0,
    width: 3508,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: "រដ្ឋមន្ត្រី",
        fontSize: 50,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
      },
    ],
  }).draw();

  const drawMinisterWrap = drawWrapTexts(ctx, {
    top: 1852,
    left: 0,
    width: 3508,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: "Minister",
        fontSize: 50,
        fontFamily: MPTC_FONTS.thirdly,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "bold",
      },
    ],
  }).draw();

  const drawMinisterNameKmWrap = drawWrapTexts(ctx, {
    top: 2235.5,
    left: 1748.5,
    width: 3508,
    textAlignment: "left",
    lineHeight: 1,
    spans: [
      {
        text: "ជា វ៉ាន់ដេត",
        fontSize: 50,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
      },
    ],
  }).draw();

  const drawMinisterNameWrap = drawWrapTexts(ctx, {
    top: 2315,
    left: 1746,
    width: 3508,
    textAlignment: "left",
    lineHeight: 1,
    spans: [
      {
        text: "Chea Vandeth",
        fontSize: 50,
        fontFamily: MPTC_FONTS.thirdly,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "bold",
      },
    ],
  }).draw();

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 2909, 1805.6, 310);
  }

  return canvas;
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
export async function createQRCodeLogoImage() {
  const logoPath = path.join(
    process.cwd(),
    "assets",
    "certificate-bacii-qrcode-logo.png"
  );
  return loadImage(logoPath);
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
