import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, loadRemoteResource } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createMoInspectionOfficialIDFrontCard(
  certificateInfo = {},
  qrcodeContent,
) {
  const MOINSPECT_TEXT_COLORS = {
    black: "#0A2434",
  };

  const MOINSPECT_FONTS = {
    suwannaphum: "Suwannaphum",
    canela: "Canela",
  };

  const MOINSPECT_TEMPLATE_IMAGE = "moinspection-staff-id-front.jpg";

  const departmentKm = _.get(certificateInfo, "certificate.departmentKm");
  const department = _.get(certificateInfo, "certificate.department");
  const nameKm = _.get(certificateInfo, "recipient.nameKm");
  const name = _.get(certificateInfo, "recipient.name");

  let DEPARTMENT_TEXT = [
    {
      dataKeys: ["certificate.departmentKm"],
      text: departmentKm,
      textSize: 60,
      textFont: MOINSPECT_FONTS.suwannaphum,
    },
    {
      dataKeys: ["certificate.department"],
      text: department,
      textSize: 50,
      textFont: MOINSPECT_FONTS.canela,
    },
  ]

  let NAME_TEXT = [
    {
      dataKeys: ["recipient.nameKm"],
      text: nameKm,
      textSize: 54.5,
      textColor: MOINSPECT_TEXT_COLORS.black,
      textFont: MOINSPECT_FONTS.suwannaphum,
      x: 529,
      y: 1332,
      align: "left",
    },
    {
      dataKeys: ["recipient.name"],
      text: name,
      textSize: 54.5,
      textColor: MOINSPECT_TEXT_COLORS.black,
      textFont: MOINSPECT_FONTS.canela,
      x: 529,
      y: 1415,
      align: "left",
    },
  ]

  let MOINSPECT_TEXTS = [
    {
      dataKeys: ["recipient.positionKm"],
      text: "{recipient.positionKm}",
      textSize: 54.5,
      textColor: MOINSPECT_TEXT_COLORS.black,
      textFont: MOINSPECT_FONTS.suwannaphum,
      x: 529,
      y: 1521.5,
      align: "left",
    },
    {
      dataKeys: ["recipient.position"],
      text: "{recipient.position}",
      // textSize: 53,
      textSize: 54.5,
      textColor: MOINSPECT_TEXT_COLORS.black,
      textFont: MOINSPECT_FONTS.canela,
      x: 529,
      y: 1607,
      align: "left",
    },
    {
      dataKeys: ["certificate.number"],
      text: "ID: {certificate.number}",
      textSize: 54.5,
      textColor: MOINSPECT_TEXT_COLORS.black,
      textFont: MOINSPECT_FONTS.canela,
      x: 120,
      y: 1699,
      align: "left",
    },
    {
      dataKeys: ["certificate.ministerSignatureDateKm"],
      text: "{certificate.ministerSignatureDateKm}",
      textSize: 54.5,
      textColor: MOINSPECT_TEXT_COLORS.black,
      textFont: MOINSPECT_FONTS.suwannaphum,
      x: 1012,
      y: 1788,
      align: "center",
    },
  ];

  const getTextMaxWidth = (ctx, textItem) => {
    ctx.font = resolveFont(textItem.textFont, textItem.textSize, textItem);
    const targetMatric = ctx.measureText(textItem.text);
    return targetMatric;
  };

  const bg = await createTemplateImage(MOINSPECT_TEMPLATE_IMAGE);
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

  const departmentKmFontSize = adjustFontSize(ctx, DEPARTMENT_TEXT[0], 1294);
  const departmentFontSize = adjustFontSize(ctx, DEPARTMENT_TEXT[1], 1294);
  const nameKmFontSize = adjustFontSize(ctx, NAME_TEXT[0], 885);
  const nameFontSize = adjustFontSize(ctx, NAME_TEXT[1], 885);

  DEPARTMENT_TEXT = [
    {
      dataKeys: ["certificate.departmentKm"],
      text: departmentKm,
      textSize: departmentKmFontSize,
      textColor: MOINSPECT_TEXT_COLORS.black,
      textFont: MOINSPECT_FONTS.suwannaphum,
      align: 'left',
      x: 120,
      y: 1125,
    },
    {
      dataKeys: ["certificate.department"],
      text: department,
      textSize: departmentFontSize,
      textColor: MOINSPECT_TEXT_COLORS.black,
      textFont: MOINSPECT_FONTS.canela,
      x: 120,
      y: 1210.5,
    },
  ]

  NAME_TEXT = [
    {
      dataKeys: ["recipient.nameKm"],
      text: nameKm,
      textSize: nameKmFontSize,
      textColor: MOINSPECT_TEXT_COLORS.black,
      textFont: MOINSPECT_FONTS.suwannaphum,
      x: 529,
      y: 1332,
      align: "left",
    },
    {
      dataKeys: ["recipient.name"],
      text: name,
      textSize: nameFontSize,
      textColor: MOINSPECT_TEXT_COLORS.black,
      textFont: MOINSPECT_FONTS.canela,
      x: 529,
      y: 1415,
      align: "left",
    },
  ]

  MOINSPECT_TEXTS = [...DEPARTMENT_TEXT, ...NAME_TEXT, ...MOINSPECT_TEXTS];

  for (const text of MOINSPECT_TEXTS) {
    if (text.dataKeys && text.dataKeys.length > 0) {
      for (const key of text.dataKeys)
        text.text = text.text.replace(
          `{${key}}`,
          _.get(certificateInfo, key, ""),
        );
    }

    drawText(canvas, ctx, text.text, {
      x: text.x,
      y: text.y,
      textColor: text.textColor || MOINSPECT_TEXT_COLORS.black,
      align: text.align,
      font: resolveFont(MOINSPECT_FONTS.suwannaphum, 24, text),
      strokeLine: text.strokeLine,
      strokeColor: text.strokeColor,
    });
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 120, 1750, 410);
  }

  if (certificateInfo.recipient.photoBase64) {
    const profileImage = await loadRemoteResource(
      certificateInfo.recipient.photoBase64
    );
    if (profileImage) {
      const profileMaxWidth = 545;
      const profileHeight =
        profileMaxWidth / (profileImage.width / profileImage.height);
      const profileX = 502;
      const profileY = 370;

      const borderRadius = 20;

      ctx.save();
      ctx.beginPath();

      ctx.roundRect(profileX, profileY, profileMaxWidth, profileHeight, borderRadius);

      ctx.clip();

      ctx.drawImage(
        profileImage,
        profileX,
        profileY,
        profileMaxWidth,
        profileHeight
      );

      ctx.restore();
    }
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
    y: textItem.y,
    textColor: textItem.textColor || "#0033ff",
    align: textItem.align,
    font: resolveFont(FONTS[0].name, 24, textItem),
    strokeLine: textItem.strokeLine,
    strokeColor: textItem.textColor,
    textMaxWidth: textItem.textMaxWidth,
    // textWidth: textItem.textWidth,
  });
};

export async function drawQrCodeStandard(
  qrcodeContent,
  ctx,
  x = 0,
  y = 0,
  width = 120,
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
    "certificate-bacii-qrcode-logo.png",
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
