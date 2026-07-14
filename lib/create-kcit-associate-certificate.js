import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, loadRemoteResource } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createKCITAssociateCertificate(
  certificateInfo = {},
  qrcodeContent
) {
  const MPTC_TEXT_COLORS = {
    black: "#000000",
  };

  const MPTC_FONTS = {
    primary: "Khmer OS Muol Light",
    secondary: "Khmer OS Content",
    thirdly: "Times New Roman",
    fourly: "Century",
  };

  const MPTC_TEMPLATE_IMAGE = "kcit-associate-certificate.jpg";
  const logDateKm = certificateInfo.certificate.logDateKm;
  const resultLogDateKm = logDateKm
    ?.replace(/ខែ|ឆ្នាំ/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const dateOfBirthKm = certificateInfo.recipient.dateOfBirthKm?.split(" ");
  const dateOfBirth = certificateInfo.recipient.dateOfBirth?.split(" ");
  const logDate = certificateInfo.certificate.logDate?.split(" ");
  const degreeKm = _.get(certificateInfo, "certificate.degreeKm");
  const degree = _.get(certificateInfo, "certificate.degree");
  const major = _.get(certificateInfo, "certificate.major");
  const nameKm = _.get(certificateInfo, "recipient.nameKm")
  const name = _.get(certificateInfo, "recipient.name")

  const nameKmSpacing = nameKm.split(" ").length - 1;
  const nameSpacing = name.split(" ").length - 1;

  let newNameKm = ""
  let newName = ""
  if (nameKmSpacing === 1) {
    newNameKm = nameKm.split(" ")
  }
  if (nameSpacing === 1) {
      newName = name.split(" ")
  }
  let nameData = [
    {
      dataKeys: ["certificate.degreeKm"],
      text: degreeKm,
      textSize: 37.5,
      textFont: MPTC_FONTS.primary,
    },
    {
      dataKeys: ["certificate.degree"],
      text: degree,
      textSize: 42,
      textFont: MPTC_FONTS.thirdly,
    },
    {
      dataKeys: ["certificate.major"],
      text: major,
      textSize: 41,
      textFont: MPTC_FONTS.thirdly,
    },
  ];
  const DATA = {
    MPTC_TEXTS: [
      // km
      {
        dataKeys: ["certificate.number"],
        text: certificateInfo.certificate.number,
        textSize: 38,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.secondary,
        textStyle: "bold",
        x: 1730,
        y: 1729,
        align: "center",
      },
      {
        dataKeys: [""],
        text: resultLogDateKm[0],
        textSize: 40,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.secondary,
        x: 788,
        y: 1054,
        align: "left",
      },
      {
        dataKeys: [""],
        text: resultLogDateKm[1],
        textSize: 40,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.secondary,
        x: 1010,
        y: 1054,
        align: "left",
      },
      {
        dataKeys: [""],
        text: resultLogDateKm[2],
        textSize: 40,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.secondary,
        x: 1360,
        y: 1054,
        align: "left",
      },
      {
        dataKeys: ["recipient.nameKm"],
        text: nameKmSpacing >= 2 ? nameKm : `${newNameKm[0]}  ${newNameKm[1]}`,
        textSize: 41,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.primary,
        x: 956,
        y: 1223,
        align: "center",
      },
      {
        dataKeys: ["recipient.genderKm"],
        text: certificateInfo.recipient.genderKm,
        textSize: 40,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.secondary,
        x: 1512,
        y: 1223,
        align: "left",
        textStyle: "bold",
      },
      {
        dataKeys: [""],
        text: dateOfBirthKm[0],
        textSize: 40,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.secondary,
        x: 660,
        y: 1310,
        align: "left",
        textStyle: "bold",
      },
      {
        dataKeys: [""],
        text: `${dateOfBirthKm[1]}`,
        textSize: 40,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.secondary,
        x: 777,
        y: 1310,
        align: "left",
        textStyle: "bold",
      },
      {
        dataKeys: [""],
        text: `  ${dateOfBirthKm[2]}`,
        textSize: 40,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.secondary,
        x: 956,
        y: 1310,
        align: "left",
        textStyle: "bold",
      },
      {
        dataKeys: ["certificate.majorKm"],
        text: certificateInfo.certificate.majorKm,
        textSize: 41,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.primary,
        x: 660,
        y: 1487,
        align: "left",
      },
      {
        dataKeys: [""],
        text: "រាជធានីភ្នំពេញ ថ្ងៃទី....................ខែ....................ឆ្នាំ.................",
        textSize: 38,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.secondary,
        x: 500.7,
        y: 1696.1,
        align: "left",
      },
      // en
      {
        dataKeys: [""],
        text: `${logDate[0]} ${logDate[1]} ${logDate[2]}`,
        textSize: 41,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.fourly,
        x: 2563,
        y: 1049,
        align: "left",
      },
      {
        dataKeys: ["recipient.name"],
        text: nameSpacing >= 2 ? name : `${newName[0]}  ${newName[1]}`,
        textSize: 41,
        textColor: MPTC_TEXT_COLORS.black,
        textStyle: "bold",
        textFont: MPTC_FONTS.fourly,
        x: 2475,
        y: 1198,
        align: "center",
      },
      {
        dataKeys: ["recipient.gender"],
        text: certificateInfo.recipient.gender,
        textSize: 41,
        textColor: MPTC_TEXT_COLORS.black,
        textStyle: "bold",
        textFont: MPTC_FONTS.fourly,
        x: 3005,
        y: 1198,
        align: "left",
      },
      {
        dataKeys: [""],
        text: `${dateOfBirth[0]} ${dateOfBirth[1]} ${dateOfBirth[2]}`,
        textSize: 41,
        textColor: MPTC_TEXT_COLORS.black,
        textStyle: "bold",
        textFont: MPTC_FONTS.fourly,
        x: 2299,
        y: 1275,
        align: "left",
      },
      {
        dataKeys: ["certificate.directorSignatureDate"],
        text: certificateInfo.certificate.directorSignatureDate,
        textSize: 41,
        textColor: MPTC_TEXT_COLORS.black,
        textFont: MPTC_FONTS.fourly,
        x: 2585.5,
        y: 1695.3,
        align: "center",
      },
    ],
  };

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

  const majorFontSize = adjustFontSize(ctx, nameData[2], 502);

  const KM_TEXTS = [
    {
      dataKeys: ["certificate.major"],
      text: major,
      textSize: majorFontSize,
      textFont: MPTC_FONTS.thirdly,
      textColor: MPTC_TEXT_COLORS.black,
      textStyle: "bold",
      x: 2676,
      y: 1425,
      align: "left",
    },
  ];

  DATA.MPTC_TEXTS = [...DATA.MPTC_TEXTS, ...KM_TEXTS];

  // Draw Caption
  for (const text of DATA.MPTC_TEXTS) {
    if (text.dataKeys && text.dataKeys.length > 0) {
      for (const key of text.dataKeys) {
        if (typeof text.text === "string") {
          text.text = text.text.replace(
            `{${key}}`,
            _.get(certificateInfo, key, "")
          );
        }
      }
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

  if (certificateInfo.recipient.photoBase64) {
    const profileImage = await loadRemoteResource(
      certificateInfo.recipient.photoBase64
    );
    if (profileImage) {
      // Photo container configuration object
      const photoContainer = {
        maxWidth: 343 + 55, // 398
        maxHeight: 435 + 55, // 490
        x: (canvas.width - (343 + 55)) / 2 - 8, // Center horizontally
        y: 1736, // Base Y position
        borderWidth: 0, // Optional: add border if needed
        borderColor: "#000000", // Optional: border color
        borderRadius: 0, // Optional: rounded corners
        shadow: false, // Optional: add shadow effect
        shadowColor: "rgba(0, 0, 0, 0.3)",
        shadowBlur: 10,
        shadowOffsetX: 2,
        shadowOffsetY: 2,
      };

      // Calculate aspect ratio
      const aspectRatio = profileImage.width / profileImage.height;
      let drawWidth = photoContainer.maxWidth;
      let drawHeight = photoContainer.maxHeight;

      // Fit image within max dimensions
      if (aspectRatio > photoContainer.maxWidth / photoContainer.maxHeight) {
        drawWidth = photoContainer.maxWidth;
        drawHeight = photoContainer.maxWidth / aspectRatio;
      } else {
        drawHeight = photoContainer.maxHeight;
        drawWidth = photoContainer.maxHeight * aspectRatio;
      }

      // Center image in the container
      const profileX =
        photoContainer.x + (photoContainer.maxWidth - drawWidth) / 2;
      const profileY =
        photoContainer.y + (photoContainer.maxHeight - drawHeight) / 2;

      // Optional: Add shadow if enabled
      if (photoContainer.shadow) {
        ctx.shadowColor = photoContainer.shadowColor;
        ctx.shadowBlur = photoContainer.shadowBlur;
        ctx.shadowOffsetX = photoContainer.shadowOffsetX;
        ctx.shadowOffsetY = photoContainer.shadowOffsetY;
      }

      // Draw the profile image
      ctx.drawImage(profileImage, profileX, profileY, drawWidth, drawHeight);

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
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
