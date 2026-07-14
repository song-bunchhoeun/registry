import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, loadRemoteResource } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createKSITBachelorCertificate(
  certificateInfo = {},
  qrcodeContent
) {
  const MPTC_TEXT_COLORS = {
    black: "#000000",
    //   black: '#f00000',
  };

  const MPTC_FONTS = {
    primary: "Khmer OS Muol Light",
    secondary: "Khmer OS Siemreap",
    thirdly: "Source Sans Pro",
    fourly: "Source Sans 3",
  };
  const MPTC_TEMPLATE_IMAGE = "ksit-bachelor-certificate-v2.jpg";
  // const MPTC_TEMPLATE_IMAGE = 'ksit-associate-certificate.jpg'
  const logDateKm = certificateInfo.certificate.logDateKm.split(" ");
  const logDate = certificateInfo.certificate.logDate.split(" ");
  const examDateKm = certificateInfo.certificate.examDateKm.split(" ");
  const examDate = certificateInfo.certificate.examDate.split(" ");
  const dateOfBirthKm = certificateInfo.recipient.dateOfBirthKm.split(" ");
  const dateOfBirth = certificateInfo.recipient.dateOfBirth.split(" ");
  const placeOfBirthKm = certificateInfo.recipient.placeOfBirthKm;
  const DATA = {
    MPTC_TEXTS: [
      // Log Date Km
      {
        dataKeys: ["certificate.logDateKm"],
        text: logDateKm[0],
        textSize: 38,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.secondary,
        x: 900,
        y: 936 - 6,
        align: "center",
      },
      {
        dataKeys: ["certificate.logDateKm"],
        text: logDateKm[1],
        textSize: 38,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.secondary,
        x: 1055,
        y: 936 - 6,
        align: "center",
      },
      {
        dataKeys: ["certificate.logDateKm"],
        text: logDateKm[2],
        textSize: 38,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.secondary,
        x: 1225,
        y: 936 - 6,
        align: "center",
      },

      // Exam Date Km
      {
        dataKeys: ["certificate.examDateKm"],
        text: examDateKm[0],
        textSize: 38,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.secondary,
        x: 1144,
        y: 1019 - 6,
        align: "center",
      },
      {
        dataKeys: ["certificate.examDateKm"],
        text: examDateKm[1],
        textSize: 38,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.secondary,
        x: 1329,
        y: 1019 - 6,
        align: "center",
      },
      {
        dataKeys: ["certificate.examDateKm"],
        text: examDateKm[2],
        textSize: 38,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.secondary,
        x: 1523,
        y: 1019 - 6,
        align: "center",
      },

      // Date of Birth Km
      {
        dataKeys: ["certificate.dateOfBirthKm"],
        text: dateOfBirthKm[0],
        textSize: 38,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.secondary,
        x: 605,
        y: 1186 - 6,
        align: "center",
      },
      {
        dataKeys: ["certificate.dateOfBirthKm"],
        text: dateOfBirthKm[1],
        textSize: 38,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.secondary,
        x: 878,
        y: 1186 - 6,
        align: "center",
      },
      {
        dataKeys: ["certificate.dateOfBirthKm"],
        text: dateOfBirthKm[2],
        textSize: 38,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.secondary,
        x: 1143,
        y: 1186 - 6,
        align: "center",
      },

      {
        dataKeys: ["recipient.nameKm"],
        text: "{recipient.nameKm}",
        textSize: 37.5,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.primary,
        x: 876,
        y: 1103 - 6,
        align: "center",
      },
      {
        dataKeys: ["recipient.genderKm"],
        text: "{recipient.genderKm}",
        textSize: 37.5,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.secondary,
        x: 1444,
        y: 1103 - 6,
        align: "center",
      },
      // {
      //     dataKeys: ['recipient.placeOfBirthKm'],
      //     text: '{recipient.placeOfBirthKm}',
      //     textSize: 37.5,
      //     textColor: MPTC_TEXT_COLORS.black,
      //     textFont: MPTC_FONTS.secondary,
      //     x: 1448,
      //     y: 1186 - 6,
      //     align: 'center',
      // },
      {
        dataKeys: ["certificate.majorKm"],
        text: "{certificate.majorKm}",
        textSize: 37.5,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.primary,
        x: 1050,
        y: 1436 - 6,
        align: "center",
      },
      {
        dataKeys: ["certificate.chairmanSignatureLunarDateKm"],
        text: "{certificate.chairmanSignatureLunarDateKm}",
        textSize: 37.5,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.secondary,
        x: 990,
        y: 1635,
        align: "center",
      },
      {
        dataKeys: ["certificate.chairmanSignatureDateKm"],
        text: "{certificate.chairmanSignatureDateKm}",
        textSize: 37.5,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.secondary,
        x: 990,
        y: 1708,
        align: "center",
      },
      {
        dataKeys: ["certificate.directorSignatureDate"],
        text: "{certificate.directorSignatureDate}",
        textSize: 38,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.thirdly,
        textStyle: "semibold",
        x: 2504,
        y: 1704,
        align: "center",
      },
      {
        dataKeys: ["certificate.number"],
        text: "{certificate.number}",
        textSize: 37.5,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.secondary,
        x: 1734,
        y: 1633 - 6,
        align: "center",
      },

      // En
      {
        dataKeys: ["certificate.logDate"],
        text: logDate[0] + "  " + logDate[1] + "  " + logDate[2],
        textSize: 38,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.thirdly,
        textStyle: "semibold",
        x: 2608,
        y: 920 - 6,
        align: "center",
      },
      {
        dataKeys: ["certificate.examDate"],
        text: examDate[0] + "  " + examDate[1] + "  " + examDate[2],
        textSize: 38,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.thirdly,
        textStyle: "semibold",
        x: 2865,
        y: 994 - 6,
        align: "center",
      },
      {
        dataKeys: ["recipient.name"],
        text: "{recipient.name}",
        textSize: 38,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.fourly,
        textStyle: "600",
        x: 2271 - 130,
        y: 1070 - 6,
        align: "left",
      },
      {
        dataKeys: ["recipient.gender"],
        text: "{recipient.gender}",
        textSize: 38,
        textFont: MPTC_FONTS.thirdly,
        textColor: MPTC_TEXT_COLORS.black,
        textStyle: "semibold",
        x: 2951,
        y: 1070 - 6,
        align: "center",
      },
      {
        dataKeys: ["recipient.dateOfBirth"],
        text: dateOfBirth[0] + "  " + dateOfBirth[1] + "  " + dateOfBirth[2],
        textSize: 39,
        textFont: MPTC_FONTS.thirdly,
        textColor: MPTC_TEXT_COLORS.black,
        textStyle: "semibold",
        x: 2200,
        y: 1144 - 6,
        align: "center",
      },
      {
        dataKeys: ["recipient.placeOfBirth"],
        text: "{recipient.placeOfBirth}",
        textSize: 39,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.thirdly,
        textStyle: "semibold",
        x: 2836,
        y: 1145 - 6,
        align: "center",
      },
      {
        dataKeys: ["certificate.major"],
        text: "{certificate.major}",
        textSize: 38,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.fourly,
        x: 2186,
        y: 1370 - 6,
        align: "left",
      },
    ],
  };

  let data = [
    {
      dataKeys: ["recipient.placeOfBirthKm"],
      text: placeOfBirthKm,
      textSize: 37.5,
      textColor: MPTC_TEXT_COLORS.black,
      textFont: MPTC_FONTS.secondary,
      x: 1450,
      y: 1186 - 6,
      align: "center",
    },
  ];

  const getTextMaxWidth = (ctx, textItem) => {
    ctx.font = resolveFont(textItem.textFont, 24, textItem);
    const kmTargetMatric = ctx.measureText(textItem.text);
    return kmTargetMatric;
  };

  const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  let placeOfBirthWidth = "";
  placeOfBirthWidth = getTextMaxWidth(ctx, data[0]);
  // console.log("Width",placeOfBirthWidth.width);
  if (placeOfBirthWidth.width >= 264) {
    data[0].text = certificateInfo.recipient.placeOfBirthKm;
    data[0].textSize = data[0].textSize - 3;
  }

  DATA.MPTC_TEXTS = [...DATA.MPTC_TEXTS, ...data];

  // Draw Caption
  for (const text of DATA.MPTC_TEXTS) {
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
  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 319, 1842, 267);
  }

  if (certificateInfo.recipient.photoUrl) {
    const profileImage = await loadRemoteResource(
      certificateInfo.recipient.photoUrl
    );
    if (profileImage) {
      const maxImgBoxWidth = 372;
      const maxImgBoxHeight = 505;

      // get the scale
      // it is the min of the 2 ratios
      let scale_factor = Math.min(
        maxImgBoxWidth / profileImage.width,
        maxImgBoxHeight / profileImage.height
      );

      // Lets get the new width and height based on the scale factor
      let newWidth = profileImage.width * scale_factor;
      let newHeight = profileImage.height * scale_factor;

      // const profileHeight = profileMaxWidth / (profileImage.width / profileImage.height);
      const profileX = 1568;
      const profileY = 1667;
      ctx.drawImage(profileImage, profileX, profileY, newWidth, newHeight);
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
