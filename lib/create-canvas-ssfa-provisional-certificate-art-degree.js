import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, loadRemoteResource } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createCanvasSSFAProvisionalCertificateArtDegree(
  certificateInfo = {},
  qrcodeContent
) {
  const SSFA_TEXT_COLORS = {
    black: "#000000",
    // black: '#FF0000',
    red: "#FF0000",
    blue: "#003398",
  };

  const SSFA_FONTS = {
    khmerOSMuolLight: "Khmer OS Muol Light",
    khmerOSSiemreap: "Khmer OS Siemreap",
    TACTENG: "TACTENG",
    TimesNewRomanBold: "Times New Roman",
    Times: "Times",
  };

  const SSFA_TEMPLATE_IMAGE = "certificate-ssfa-temporary-art.png";

  const nameKm = certificateInfo.recipient.nameKm.split(" ");
  const directorSignatureDateKm =
    certificateInfo.certificate.directorSignatureDateKm;

  const SSFA_TEXTS = [
    {
      dataKeys: ["certificate.number"],
      text: "{certificate.number}",
      textSize: 49,
      textStyle: "normal",
      textColor: SSFA_TEXT_COLORS.blue,
      textFont: SSFA_FONTS.khmerOSSiemreap,
      y: 688.0402,
      x: 296.5566,
      align: "left",
    },
    {
      dataKeys: ["recipient.nameKm"],
      text: nameKm[0] + "  " + nameKm[1],
      textSize: 47,
      textStyle: "normal",
      textColor: SSFA_TEXT_COLORS.black,
      textFont: SSFA_FONTS.khmerOSMuolLight,
      y: 1049.4019,
      x: 861.5,
      align: "left",
    },
    {
      dataKeys: ["recipient.dateOfBirthKm"],
      text: "{recipient.dateOfBirthKm}",
      textSize: 47,
      textStyle: "normal",
      textColor: SSFA_TEXT_COLORS.black,
      textFont: SSFA_FONTS.khmerOSSiemreap,
      y: 1136.5446,
      x: 924.5566,
      align: "left",
    },
    {
      dataKeys: ["recipient.placeOfBirthKm"],
      text: "{recipient.placeOfBirthKm}",
      textSize: 47,
      textStyle: "normal",
      textColor: SSFA_TEXT_COLORS.black,
      textFont: SSFA_FONTS.khmerOSSiemreap,
      y: 1136.5446,
      x: 1542,
      align: "left",
    },
    {
      dataKeys: ["recipient.genderKm"],
      text: "{recipient.genderKm}",
      textSize: 48,
      textStyle: "normal",
      textColor: SSFA_TEXT_COLORS.black,
      textFont: SSFA_FONTS.khmerOSSiemreap,
      y: 1048.4019,
      x: 1593.5332,
      align: "left",
    },
    {
      dataKeys: ["certificate.majorKm"],
      text: "{certificate.majorKm}",
      textSize: 48,
      textStyle: "normal",
      textColor: SSFA_TEXT_COLORS.black,
      textFont: SSFA_FONTS.khmerOSSiemreap,
      y: 1048.5,
      x: 1973,
      align: "left",
    },
    {
      dataKeys: ["recipient.fatherNameKm"],
      text: "{recipient.fatherNameKm}",
      textSize: 47,
      textStyle: "normal",
      textColor: SSFA_TEXT_COLORS.black,
      textFont: SSFA_FONTS.khmerOSSiemreap,
      y: 1224.6679,
      x: 956.28,
      align: "left",
    },
    {
      dataKeys: ["recipient.motherNameKm"],
      text: "{recipient.motherNameKm}",
      textSize: 48,
      textStyle: "normal",
      textColor: SSFA_TEXT_COLORS.black,
      textFont: SSFA_FONTS.khmerOSSiemreap,
      y: 1225.6679,
      x: 1706.4289,
      align: "left",
    },
    {
      dataKeys: ["certificate.examDateKm"],
      text: "{certificate.examDateKm}",
      textSize: 46,
      textStyle: "normal",
      textColor: SSFA_TEXT_COLORS.black,
      textFont: SSFA_FONTS.khmerOSMuolLight,
      y: 1427.6147,
      x: 862.4289,
      align: "left",
    },
    {
      dataKeys: ["certificate.exam.room"],
      text: "{certificate.exam.room}",
      textSize: 46,
      textStyle: "normal",
      textColor: SSFA_TEXT_COLORS.black,
      textFont: SSFA_FONTS.khmerOSMuolLight,
      y: 1511.487,
      x: 805,
      align: "left",
    },
    {
      dataKeys: ["certificate.exam.seat"],
      text: "{certificate.exam.seat}",
      textSize: 46,
      textStyle: "normal",
      textColor: SSFA_TEXT_COLORS.black,
      textFont: SSFA_FONTS.khmerOSMuolLight,
      y: 1511.487,
      x: 1055,
      align: "left",
    },
    {
      dataKeys: ["certificate.finalConceptGrade"],
      text: "{certificate.finalConceptGrade}",
      textSize: 48,
      textStyle: "bold",
      textColor: SSFA_TEXT_COLORS.red,
      textFont: SSFA_FONTS.TimesNewRomanBold,
      y: 1598.9657,
      x: 929.03,
      align: "left",
    },
    {
      dataKeys: ["certificate.conceptGrades[0].grade"],
      text: "{certificate.conceptGrades[0].grade}",
      textSize: 48,
      textStyle: "bold",
      textColor: SSFA_TEXT_COLORS.red,
      textFont: SSFA_FONTS.TimesNewRomanBold,
      y: 1684.5508,
      x: 757,
      align: "left",
    },
    {
      dataKeys: ["certificate.conceptGrades[1].grade"],
      text: "{certificate.conceptGrades[1].grade}",
      textSize: 48,
      textStyle: "bold",
      textColor: SSFA_TEXT_COLORS.red,
      textFont: SSFA_FONTS.TimesNewRomanBold,
      y: 1769.487,
      x: 757,
      align: "left",
    },
    {
      dataKeys: ["certificate.conceptGrades[2].grade"],
      text: "{certificate.conceptGrades[2].grade}",
      textSize: 48,
      textStyle: "bold",
      textColor: SSFA_TEXT_COLORS.red,
      textFont: SSFA_FONTS.TimesNewRomanBold,
      y: 1853.2955,
      x: 757,
      align: "left",
    },
    {
      dataKeys: ["certificate.conceptGrades[3].grade"],
      text: "{certificate.conceptGrades[3].grade}",
      textSize: 48,
      textStyle: "bold",
      textColor: SSFA_TEXT_COLORS.red,
      textFont: SSFA_FONTS.TimesNewRomanBold,
      y: 1937.104,
      x: 757,
      align: "left",
    },
    {
      dataKeys: ["certificate.conceptGrades[4].grade"],
      text: "{certificate.conceptGrades[4].grade}",
      textSize: 48,
      textStyle: "bold",
      textColor: SSFA_TEXT_COLORS.red,
      textFont: SSFA_FONTS.TimesNewRomanBold,
      y: 2022.3381,
      x: 757,
      align: "left",
    },
    {
      dataKeys: ["certificate.conceptGrades[5].grade"],
      text: "{certificate.conceptGrades[5].grade}",
      textSize: 48,
      textStyle: "bold",
      textColor: SSFA_TEXT_COLORS.red,
      textFont: SSFA_FONTS.TimesNewRomanBold,
      y: 2105.7743,
      x: 757,
      align: "left",
    },
    {
      dataKeys: ["certificate.conceptGrades[6].grade"],
      text: "{certificate.conceptGrades[6].grade}",
      textSize: 48,
      textStyle: "bold",
      textColor: SSFA_TEXT_COLORS.red,
      textFont: SSFA_FONTS.TimesNewRomanBold,
      y: 2190.1253,
      x: 757,
      align: "left",
    },
    {
      dataKeys: ["certificate.conceptGrades[7].grade"],
      text: "{certificate.conceptGrades[7].grade}",
      textSize: 48,
      textStyle: "bold",
      textColor: SSFA_TEXT_COLORS.red,
      textFont: SSFA_FONTS.TimesNewRomanBold,
      y: 2274.987,
      x: 757,
      align: "left",
    },
    {
      dataKeys: ["certificate.conceptGrades[8].grade"],
      text: "{certificate.conceptGrades[8].grade}",
      textSize: 48,
      textStyle: "bold",
      textColor: SSFA_TEXT_COLORS.red,
      textFont: SSFA_FONTS.TimesNewRomanBold,
      y: 2358.8062,
      x: 757,
      align: "left",
    },
    {
      dataKeys: ["certificate.conceptGrades[9].grade"],
      text: "{certificate.conceptGrades[9].grade}",
      textSize: 48,
      textStyle: "bold",
      textColor: SSFA_TEXT_COLORS.red,
      textFont: SSFA_FONTS.TimesNewRomanBold,
      y: 2442.4445,
      x: 757,
      align: "left",
    },
    {
      dataKeys: ["certificate.conceptGrades[10].grade"],
      text: "{certificate.conceptGrades[10].grade}",
      textSize: 48,
      textStyle: "bold",
      textColor: SSFA_TEXT_COLORS.red,
      textFont: SSFA_FONTS.TimesNewRomanBold,
      y: 2526.2955,
      x: 757,
      align: "left",
    },
    {
      dataKeys: ["certificate.exam.center"],
      text: "{certificate.exam.center}",
      textSize: 46,
      textStyle: "normal",
      textColor: SSFA_TEXT_COLORS.black,
      textFont: SSFA_FONTS.khmerOSMuolLight,
      y: 1427.6147,
      x: 1708.163,
      align: "left",
    },
    {
      dataKeys: ["certificate.overallGrade"],
      text: "{certificate.overallGrade}",
      textSize: 48,
      textStyle: "bold",
      textColor: SSFA_TEXT_COLORS.black,
      textFont: SSFA_FONTS.TimesNewRomanBold,
      y: 1510.487,
      x: 1680.8119,
      align: "left",
    },
    {
      dataKeys: ["certificate.finalTechnicalGrade"],
      text: "{certificate.finalTechnicalGrade}",
      textSize: 48,
      textStyle: "bold",
      textColor: SSFA_TEXT_COLORS.red,
      textFont: SSFA_FONTS.TimesNewRomanBold,
      y: 1600,
      x: 2094.6949,
      align: "left",
    },

    {
      dataKeys: ["certificate.directorSignatureLunarDateKm"],
      text: "{certificate.directorSignatureLunarDateKm}",
      textSize: 48,
      textStyle: "bold",
      textColor: SSFA_TEXT_COLORS.black,
      textFont: SSFA_FONTS.khmerOSSiemreap,
      y: 2751.3168,
      x: 1786,
      align: "center",
    },
    {
      dataKeys: ["certificate.directorSignatureDateKm"],
      text: directorSignatureDateKm,
      textSize: 48,
      textStyle: "bold",
      textColor: SSFA_TEXT_COLORS.black,
      textFont: SSFA_FONTS.khmerOSSiemreap,
      y: 2840.1785,
      x: 1786,
      align: "center",
    },
    {
      dataKeys: ["certificate.totalScore"],
      text: "{certificate.totalScore}",
      textSize: 46,
      textStyle: "normal",
      textColor: SSFA_TEXT_COLORS.black,
      textFont: SSFA_FONTS.khmerOSMuolLight,
      y: 1513.8,
      x: 2070,
      align: "left",
    },
  ];

  const technical = _.get(certificateInfo, "certificate.technicalGrades");
  const technicalLength = technical[0].subGrades.length;

  const TechnicalGrades_TEXTS = [];

  let initialX_id = 1611.5776;
  let initialX_grade = 1964.3045;
  let initialY_id = 1682.8;
  let initialY_grade = 1680;
  let yOffset = 84;

  for (let i = 0; i < technicalLength; i++) {
    TechnicalGrades_TEXTS.push(
      {
        dataKeys: [`certificate.technicalGrades[0].subGrades[${i}].id`],
        text: _.get(
          certificateInfo,
          `certificate.technicalGrades[0].subGrades[${i}].id`,
          ""
        ),
        textSize: 46,
        textStyle: "normal",
        textColor: SSFA_TEXT_COLORS.black,
        textFont: SSFA_FONTS.khmerOSSiemreap,
        y: initialY_id + i * yOffset,
        x: initialX_id,
        align: "left",
      },
      {
        dataKeys: [`certificate.technicalGrades[0].subGrades[${i}].grade`],
        text: _.get(
          certificateInfo,
          `certificate.technicalGrades[0].subGrades[${i}].grade`,
          ""
        ),
        textSize: 48,
        textStyle: "bold",
        textColor: SSFA_TEXT_COLORS.red,
        textFont: SSFA_FONTS.TimesNewRomanBold,
        y: initialY_grade + i * yOffset,
        x: initialX_grade,
        align: "left",
      }
    );
  }

  const ALL_SSFA_TEXTS = [...SSFA_TEXTS, ...TechnicalGrades_TEXTS];

  const bg = await createTemplateImage(SSFA_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);
  // Draw Caption

  for (const text of ALL_SSFA_TEXTS) {
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
      textColor: text.textColor || SSFA_TEXT_COLORS.black,
      align: text.align,
      font: resolveFont(SSFA_FONTS.primary, 24, text),
    });
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 1097, 3097, 268);
  }

  // draw profile photo
  if (certificateInfo.recipient.photoUrl) {
    const profileImage = await loadRemoteResource(
      certificateInfo.recipient.photoUrl
    );
    if (profileImage) {
      const profileMaxWidth = 274;
      const profileHeight =
        profileMaxWidth / (profileImage.width / profileImage.height);
      const profileX = 236.5;
      const profileY = 972.3;
      ctx.drawImage(
        profileImage,
        profileX,
        profileY,
        profileMaxWidth,
        profileHeight
      );
    }
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
