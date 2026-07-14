import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, loadRemoteResource } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createMOCARHighschoolBuddhistStudyCertificateCanvas(
  certificateInfo = {},
  qrcodeContent
) {
  const MOCAR_TEXT_COLORS = {
    blue: "#002350",
  };

  const MOCAR_FONTS = {
    siemReap: "Khmer OS Siemreap",
    muolLight: "Khmer OS Muol Light",
    time: "Times New Roman",
  };
  const MOCAR_TEMPLATE_IMAGE = "mocar_temporary_bg.jpg";

  const nameKm = _.get(certificateInfo, "recipient.nameKm", "").split(" ");

  const MOCAR_TEXTS = [
    {
      dataKeys: ["certificate.number"],
      text: "លេខ  {certificate.number}   អ.ព.ស.ជ",
      textSize: 50,
      textStyle: "normal",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.siemReap,
      x: 259.7,
      y: 721,
      align: "left",
    },
    {
      dataKeys: ["recipient.nameKm"],
      text: `${nameKm[0]}  ${nameKm[1]}`,
      textSize: 50,
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.muolLight,
      x: 1458,
      y: 1113.4,
      align: "left",
    },
    {
      dataKeys: ["recipient.genderKm"],
      text: "{recipient.genderKm}",
      textSize: 50,
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.siemReap,
      x: 734,
      y: 1245,
      align: "left",
    },
    {
      dataKeys: [""],
      text: "ថ្ងៃទី",
      textSize: 50,
      textStyle: "normal",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.siemReap,
      x: 1065,
      y: 1245,
      align: "left",
    },
    {
      dataKeys: ["recipient.dateOfBirthKm"],
      text: "{recipient.dateOfBirthKm}",
      textSize: 50,
      textStyle: "bold",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.siemReap,
      x: 1167.5,
      y: 1245,
      align: "left",
    },
    {
      dataKeys: ["recipient.placeOfBirthKm"],
      text: certificateInfo.recipient.placeOfBirthKm.replace("ខេត្ត", ""),
      textSize: 50,
      textStyle: "bold",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.siemReap,
      x: 1932.8,
      y: 1245,
      align: "left",
    },
    {
      dataKeys: ["recipient.fatherNameKm"],
      text: "{recipient.fatherNameKm}",
      textSize: 50,
      textStyle: "bold",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.siemReap,
      x: 872.1,
      y: 1337.3,
      align: "left",
    },
    {
      dataKeys: ["recipient.motherNameKm"],
      text: "{recipient.motherNameKm}",
      textSize: 50,
      textStyle: "bold",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.siemReap,
      x: 1627.6,
      y: 1337.3,
      align: "left",
    },
    {
      dataKeys: ["certificate.examDateKm"],
      text: "ថ្ងៃទី{certificate.examDateKm}",
      textSize: 50,
      textStyle: "bold",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.siemReap,
      x: 917.5,
      y: 1572,
      align: "left",
    },
    {
      dataKeys: [""],
      text: `បានប្រឡងធ្លាក់សញ្ញាបត្រពុទ្ធិកមធ្យមសិក្សាទុតិយភូមិ`,
      textSize: 50,
      textStyle: "normal",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.muolLight,
      x: 1438.35,
      y: 1453,
      align: "center",
    },
    {
      dataKeys: ["certificate.center.nameKm"],
      text: "នៅមណ្ឌល {certificate.center.nameKm}",
      textSize: 50,
      textStyle: "bold",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.siemReap,
      x: 1505.8,
      y: 1572,
      align: "left",
    },
    {
      dataKeys: ["certificate.center.roomKm"],
      text: "{certificate.center.roomKm}",
      textSize: 50,
      textStyle: "normal",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.siemReap,
      x: 911.6,
      y: 1659,
      align: "center",
    },
    {
      dataKeys: ["certificate.center.seatKm"],
      text: "{certificate.center.seatKm}",
      textSize: 50,
      textStyle: "normal",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.siemReap,
      x: 1277.8,
      y: 1659,
      align: "center",
    },
    {
      dataKeys: ["certificate.grade"],
      text: "{certificate.grade}",
      textSize: 50,
      textStyle: "normal",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.time,
      x: 1777.3,
      y: 1659,
      align: "left",
    },
    {
      dataKeys: ["certificate.subjectGrades"],
      text: certificateInfo.certificate.subjectGrades[0].grade,
      textSize: 50,
      textStyle: "normal",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.time,
      x: 886.5,
      y: 1843.3,
      align: "left",
    },
    {
      dataKeys: ["certificate.subjectGrades"],
      text: certificateInfo.certificate.subjectGrades[1].grade,
      textSize: 50,
      textStyle: "normal",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.time,
      x: 886.5,
      y: 1935.6,
      align: "left",
    },
    {
      dataKeys: ["certificate.subjectGrades"],
      text: certificateInfo.certificate.subjectGrades[2].grade,
      textSize: 50,
      textStyle: "normal",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.time,
      x: 886.5,
      y: 2023.3,
      align: "left",
    },
    {
      dataKeys: ["certificate.subjectGrades"],
      text: certificateInfo.certificate.subjectGrades[3].grade,
      textSize: 50,
      textStyle: "normal",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.time,
      x: 886.5,
      y: 2117,
      align: "left",
    },
    {
      dataKeys: ["certificate.subjectGrades"],
      text: certificateInfo.certificate.subjectGrades[4].grade,
      textSize: 50,
      textStyle: "normal",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.time,
      x: 1270.3,
      y: 1843.3,
      align: "left",
    },
    {
      dataKeys: ["certificate.subjectGrades"],
      text: certificateInfo.certificate.subjectGrades[5].grade,
      textSize: 50,
      textStyle: "normal",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.time,
      x: 1270.3,
      y: 1935.6,
      align: "left",
    },
    {
      dataKeys: ["certificate.subjectGrades"],
      text: certificateInfo.certificate.subjectGrades[6].grade,
      textSize: 50,
      textStyle: "normal",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.time,
      x: 1270.3,
      y: 2023.3,
      align: "left",
    },
    {
      dataKeys: ["certificate.subjectGrades"],
      text: certificateInfo.certificate.subjectGrades[7].grade,
      textSize: 50,
      textStyle: "normal",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.time,
      x: 1458,
      y: 2117,
      align: "left",
    },
    {
      dataKeys: ["certificate.subjectGrades"],
      text: certificateInfo.certificate.subjectGrades[8].grade,
      textSize: 50,
      textStyle: "normal",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.time,
      x: 1651,
      y: 1843.3,
      align: "left",
    },
    {
      dataKeys: ["certificate.subjectGrades"],
      text: certificateInfo.certificate.subjectGrades[9].grade,
      textSize: 50,
      textStyle: "normal",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.time,
      x: 1651,
      y: 1935.6,
      align: "left",
    },
    {
      dataKeys: ["certificate.subjectGrades"],
      text: certificateInfo.certificate.subjectGrades[10].grade,
      textSize: 50,
      textStyle: "normal",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.time,
      x: 1651,
      y: 2023.3,
      align: "left",
    },
    {
      dataKeys: ["certificate.subjectGrades"],
      text: certificateInfo.certificate.subjectGrades[11].grade,
      textSize: 50,
      textStyle: "normal",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.time,
      x: 2158,
      y: 1843.3,
      align: "left",
    },
    {
      dataKeys: ["certificate.subjectGrades"],
      text: certificateInfo.certificate.subjectGrades[12].grade,
      textSize: 50,
      textStyle: "normal",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.time,
      x: 2158,
      y: 1935.6,
      align: "left",
    },
    {
      dataKeys: ["certificate.subjectGrades"],
      text: certificateInfo.certificate.subjectGrades[13].grade,
      textSize: 50,
      textStyle: "normal",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.time,
      x: 2158,
      y: 2023.3,
      align: "left",
    },
    {
      dataKeys: ["certificate.signatureLunarDateKm"],
      text: "{certificate.signatureLunarDateKm}",
      textSize: 50,
      textStyle: "normal",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.siemReap,
      x: 1630.25,
      y: 2364,
      align: "center",
    },
    {
      dataKeys: ["certificate.signatureDateKm"],
      text: "{certificate.signatureDateKm}",
      textSize: 50,
      textStyle: "normal",
      textColor: MOCAR_TEXT_COLORS.blue,
      textFont: MOCAR_FONTS.siemReap,
      x: 1630.25,
      y: 2455.7,
      align: "center",
    },
  ];

  const bg = await createTemplateImage(MOCAR_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  // Draw Caption
  for (const text of MOCAR_TEXTS) {
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
      textColor: text.textColor || MOCAR_TEXT_COLORS.blue,
      align: text.align,
      font: resolveFont(MOCAR_FONTS.siemReap, 24, text),
    });
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 1946.7, 3029, 320);
  }

  // draw profile photo
  if (certificateInfo.recipient.photoBase64) {
    const profileImage = await loadRemoteResource(
      certificateInfo.recipient.photoBase64
    );
    if (profileImage) {
      const profileMaxWidth = 350;
      const profileHeight =
        profileMaxWidth / (profileImage.width / profileImage.height);
      const profileX = 236;
      const profileY = 1184.7;
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
