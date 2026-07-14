import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";
import { drawWrapTexts } from "./create-biu-np-bachelor-certificate";

export async function createMPTCPromotingDigitalAdoptionCertificateCanvas(
  certificateInfo = {},
  qrcodeContent
) {
  const MPTC_TEXT_COLORS = {
    black: "#040404",
    blue: "#1b4580",
  };

  const MPTC_FONTS = {
    primary: "NiDA Funan",
    secondary: "NiDA Sowannaphum",
    thirdly: "Google Sans",
  };

  const MPTC_TEMPLATE_IMAGE = "mptc-certificate-recognition-2025.jpg";

  const nameKm = _.get(certificateInfo, "recipient.nameKm", "");
  const name = _.get(certificateInfo, "recipient.name", "");
  const positionKm = _.get(certificateInfo, "recipient.positionKm", "");
  const position = _.get(certificateInfo, "recipient.position", "");
  const provinceKm = _.get(certificateInfo, "recipient.provinceKm", "");
  const province = _.get(certificateInfo, "recipient.province", "");
  const themeKm = _.get(certificateInfo, "certificate.themeKm");
  const theme = _.get(certificateInfo, "certificate.theme");
  const dateKm = _.get(certificateInfo, "certificate.dateKm");
  const date = _.get(certificateInfo, "certificate.date");
  const signLunarDate = _.get(
    certificateInfo,
    "certificate.ministerSignatureLunarDateKm"
  );
  const signDateKm = _.get(
    certificateInfo,
    "certificate.ministerSignatureDateKm"
  );
  const signDate = _.get(certificateInfo, "certificate.ministerSignatureDate");

  let MPTC_TEXTS = [
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
      dataKeys: ["recipient.positionKm"],
      text: `${certificateInfo.recipient.positionKm}`,
      textSize: 50,
      textFont: MPTC_FONTS.primary,
    },
    {
      dataKeys: ["recipient.position"],
      text: `${certificateInfo.recipient.position}`,
      textSize: 50,
      textFont: MPTC_FONTS.thirdly,
      textStyle: 'bold'
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
      dataKeys: ["certificate.themeKm"],
      text: `\u201C${certificateInfo.certificate.themeKm}\u201D`,
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

  const nameKmFontSize = adjustFontSize(ctx, MPTC_TEXTS[0], 1550);
  const positionKmFontSize = adjustFontSize(ctx, MPTC_TEXTS[2], 1550);
  const provinceKmFontSize = adjustFontSize(ctx, MPTC_TEXTS[4], 1550);
  const themeKmFontSize = adjustFontSize(ctx, MPTC_TEXTS[6], 1550);
  const dateKmFontSize = adjustFontSize(ctx, MPTC_TEXTS[8], 1550);

  const nameFontSize = adjustFontSize(ctx, MPTC_TEXTS[1], 1580);
  const positionFontSize = adjustFontSize(ctx, MPTC_TEXTS[3], 1580);
  const provinceFontSize = adjustFontSize(ctx, MPTC_TEXTS[5], 1580);
  const themeFontSize = adjustFontSize(ctx, MPTC_TEXTS[7], 1580);
  const dateFontSize = adjustFontSize(ctx, MPTC_TEXTS[9], 1580);

  const isInProvince = !!_.get(certificateInfo, "recipient.provinceKm", "");

  const signatureEmboss = await loadImage(
    path.join(process.cwd(), "assets", "mptc-minister-signature.png")
  );
  if (signatureEmboss && isInProvince) {
    ctx.drawImage(signatureEmboss, 1526.4, 1825, 688, 356);
  } else {
    ctx.drawImage(signatureEmboss, 1526.4, 1810, 688, 356);
  }

  const drawPresentToKm = drawWrapTexts(ctx, {
    top: isInProvince ? 828 : 849,
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
    top: isInProvince ? 821 : 847,
    left: 1754,
    width: 1580,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: "Presented to",
        fontSize: 50,
        fontFamily: MPTC_FONTS.thirdly,
        fillStyle: MPTC_TEXT_COLORS.black,
      },
    ],
  }).draw();

  const drawNameKmWrap = drawWrapTexts(ctx, {
    top: isInProvince ? 912 : 949.4,
    left: 200,
    width: 1550,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: nameKm,
        fontSize: nameKmFontSize,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.blue,
      },
    ],
  }).draw();

  const drawNameWrap = drawWrapTexts(ctx, {
    top: isInProvince ? 904.4 : 947.2,
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

  const drawPositionWrap = drawWrapTexts(ctx, {
    top: isInProvince ? 988 : 1047,
    left: 1754,
    width: 1580,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: position,
        fontSize: positionFontSize,
        fontFamily: MPTC_FONTS.thirdly,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "bold",
      },
    ],
  }).draw();

  const drawProvinceKmWrap = drawWrapTexts(ctx, {
    top: 1078.5,
    left: 200,
    width: 1550,
    textAlignment: "center",
    lineHeight: 1.6,
    spans: [
      {
        text: provinceKm,
        fontSize: provinceKmFontSize,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.blue,
      },
    ],
  });

  const drawProvinceWrap = drawWrapTexts(ctx, {
    top: 1072,
    left: 1754,
    width: 1580,
    textAlignment: "center",
    lineHeight: 1.65,
    spans: [
      {
        text: province,
        fontSize: provinceFontSize,
        fontFamily: MPTC_FONTS.thirdly,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "bold",
      },
    ],
  });

  const drawDescLine1Km = drawWrapTexts(ctx, {
    top: isInProvince ? 1162.5 : 1149.5,
    left: 200,
    width: 1550,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: `ដែលបានចូលរួមសិក្ខាសាលាពង្រឹងសមត្ថភាពអនុវត្តការងារ${
          isInProvince ? "នៅមន្ទីរ" : ""
        }`,
        fontSize: 50,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.black,
      },
    ],
  }).draw();

  const drawDescLine2Km = drawWrapTexts(ctx, {
    top: 1245,
    left: 200,
    width: 1550,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: `ប្រៃសណីយ៍និងទូរគមនាគមន៍ឆ្នាំ២០២៥ ក្រោមប្រធានបទ`,
        fontSize: 50,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.black,
      },
    ],
  });

  const drawDescLine1 = drawWrapTexts(ctx, {
    top: isInProvince ? 1155.5 : 1147,
    left: 1754,
    width: 1580,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: `for Participating in the Workshop on Enhancing Work Performance`,
        fontSize: 47,
        fontFamily: MPTC_FONTS.thirdly,
        fillStyle: MPTC_TEXT_COLORS.black,
      },
    ],
  }).draw();

  const drawDescLine2 = drawWrapTexts(ctx, {
    top: 1239.5,
    left: 1754,
    width: 1580,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: `at Post and Telecommunications Provincial Departments in 2025`,
        fontSize: 48,
        fontFamily: MPTC_FONTS.thirdly,
        fillStyle: MPTC_TEXT_COLORS.black,
      },
    ],
  });

  const drawThemeKmWrap = drawWrapTexts(ctx, {
    top: isInProvince ? 1328.7 : 1250,
    left: 200,
    width: 1550,
    textAlignment: "center",
    lineHeight: 1.6,
    spans: [
      {
        text: isInProvince ? "" : "ក្រោមប្រធានបទ ",
        fontSize: themeKmFontSize,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.black,
      },
      {
        text: "\u201C",
        fontSize: themeKmFontSize,
        fontFamily: MPTC_FONTS.thirdly,
        fillStyle: MPTC_TEXT_COLORS.black,
      },
      {
        text: themeKm,
        fontSize: themeKmFontSize,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "bold",
      },
      {
        text: "\u201D",
        fontSize: themeKmFontSize,
        fontFamily: MPTC_FONTS.thirdly,
        fillStyle: MPTC_TEXT_COLORS.black,
      },
    ],
  }).draw();

  const drawThemeWrap = drawWrapTexts(ctx, {
    top: isInProvince ? 1322 : 1247,
    left: 1754,
    width: 1580,
    textAlignment: "center",
    lineHeight: 1.6,
    spans: [
      {
        text: `Under the theme of `,
        fontSize: themeFontSize,
        fontFamily: MPTC_FONTS.thirdly,
        fillStyle: MPTC_TEXT_COLORS.black,
      },
      {
        text: `"${theme}"`,
        fontSize: themeFontSize,
        fontFamily: MPTC_FONTS.thirdly,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "bold",
      },
    ],
  }).draw();

  const drawDateKmWrap = drawWrapTexts(ctx, {
    top: isInProvince ? 1412 : 1349,
    left: 200,
    width: 1550,
    textAlignment: "center",
    lineHeight: 1.6,
    spans: [
      {
        text: dateKm + ` នៅ${certificateInfo.certificate.locationKm}។`,
        fontSize: dateKmFontSize,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.black,
      },
    ],
  }).draw();

  const drawDateWrap = drawWrapTexts(ctx, {
    top: isInProvince ? 1404 : 1346.5,
    left: 1754,
    width: 1580,
    textAlignment: "center",
    lineHeight: 1.6,
    spans: [
      {
        text: date + ` in ${certificateInfo.certificate.location}.`,
        fontSize: dateFontSize,
        fontFamily: MPTC_FONTS.thirdly,
        fillStyle: MPTC_TEXT_COLORS.black,
      },
    ],
  }).draw();

  const drawSignatureLunarDateKmWrap = drawWrapTexts(ctx, {
    top: isInProvince ? 1519.5 : 1476.7,
    left: 0,
    width: 3508,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: signLunarDate,
        fontSize: 50,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.black,
      },
    ],
  }).draw();

  const drawSignatureDateKmWrap = drawWrapTexts(ctx, {
    top: isInProvince ? 1606.3 : 1565,
    left: 0,
    width: 3508,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: signDateKm,
        fontSize: 50,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.black,
      },
    ],
  }).draw();

  const drawSignatureDateWrap = drawWrapTexts(ctx, {
    top: isInProvince ? 1693.8 : 1652.5,
    left: 0,
    width: 3508,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: signDate,
        fontSize: 50,
        fontFamily: MPTC_FONTS.thirdly,
        fillStyle: MPTC_TEXT_COLORS.black,
      },
    ],
  }).draw();

  const drawMinisterKmWrap = drawWrapTexts(ctx, {
    top: isInProvince ? 1773 : 1731,
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
    top: isInProvince ? 1852 : 1810,
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
    top: isInProvince ? 2235.5 : 2193.4,
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
    top: isInProvince ? 2314.5 : 2274.7,
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

  if (isInProvince) {
    drawProvinceKmWrap.draw();
    drawProvinceWrap.draw();
    drawDescLine2Km.draw();
    drawDescLine2.draw();
  }

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
