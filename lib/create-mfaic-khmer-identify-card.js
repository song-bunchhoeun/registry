import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, loadRemoteResource } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";
import { drawWrapTexts } from "./create-biu-np-bachelor-certificate";

export async function createMFAICKhmerIdentifyCard(
  certificateInfo = {},
  qrcodeContent
) {
  const MFAIC_TEXT_COLORS = {
    black: "#000000",
  };

  const MFAIC_FONTS = {
    primary: "Times New Roman",
  };

  const MFAIC_TEMPLATE_IMAGE = "mfaic-khmer-identity-card.png";

  const fullName = _.get(certificateInfo, "recipient.fullName");
  const fullname = fullName.split(" ");

  const gender = _.get(certificateInfo, "recipient.gender")

  let newGender = "";

  if (gender === "M") {
    newGender = "Male";
  } else if (gender === "F") {
    newGender = "Female";
  } else {
    newGender = "Not Specified";
  }

  const MFAIC_TEXTS = [
    {
      dataKeys: ["recipient.nationalId"],
      text: "{recipient.nationalId}",
      textSize: 53,
      textStyle: "normal",
      textColor: MFAIC_TEXT_COLORS.black,
      textFont: MFAIC_FONTS.primary,
      x: 1280,
      y: 1059.2,
      align: "center",
    },
    {
      dataKeys: ["recipient.fullName"],
      text: "{recipient.fullName}",
      textSize: 53,
      textStyle: "normal",
      textColor: MFAIC_TEXT_COLORS.black,
      textFont: MFAIC_FONTS.primary,
      y: 1165.2,
      x: 973.5,
      align: "left",
    },
    {
      dataKeys: [
        "recipient.dateOfBirth",
        "recipient.gender",
        "recipient.height",
      ],
      text: `{recipient.dateOfBirth}, Sex: ${newGender}, Height: {recipient.height}`,
      textSize: 53,
      textStyle: "normal",
      textColor: MFAIC_TEXT_COLORS.black,
      textFont: MFAIC_FONTS.primary,
      y: 1227.4,
      x: 973.5,
      align: "left",
    },
    {
      dataKeys: ["recipient.placeOfBirth"],
      text: "{recipient.placeOfBirth}",
      textSize: 53,
      textStyle: "normal",
      textColor: MFAIC_TEXT_COLORS.black,
      textFont: MFAIC_FONTS.primary,
      y: 1290.4,
      x: 973.5,
      align: "left",
    },
    {
      dataKeys: ["certificate.validity"],
      text: "{certificate.validity}",
      textSize: 53,
      textStyle: "normal",
      textColor: MFAIC_TEXT_COLORS.black,
      textFont: MFAIC_FONTS.primary,
      y: 1537.5,
      x: 679.5,
      align: "left",
    },
    {
      dataKeys: ["recipient.marks"],
      text: "{recipient.marks}",
      textSize: 53,
      textStyle: "normal",
      textColor: MFAIC_TEXT_COLORS.black,
      textFont: MFAIC_FONTS.primary,
      y: 1597.5,
      x: 679.5,
      align: "left",
    },
    {
      dataKeys: ["recipient.mrz[0]"],
      text: "{recipient.mrz[0]}",
      textSize: 53,
      textStyle: "normal",
      textColor: MFAIC_TEXT_COLORS.black,
      textFont: MFAIC_FONTS.primary,
      y: 1717,
      x: 505.5,
      align: "left",
    },
    {
      dataKeys: ["recipient.mrz[1]"],
      text: "{recipient.mrz[1]}",
      textSize: 53,
      textStyle: "normal",
      textColor: MFAIC_TEXT_COLORS.black,
      textFont: MFAIC_FONTS.primary,
      y: 1777.5,
      x: 505.5,
      align: "left",
    },
    {
      dataKeys: ["recipient.mrz[2]"],
      text: `{recipient.mrz[2]}`,
      textSize: 53,
      textStyle: "normal",
      textColor: MFAIC_TEXT_COLORS.black,
      textFont: MFAIC_FONTS.primary,
      y: 1839.5,
      x: 505.5,
      align: "left",
    },
    {
      dataKeys: ["certificate.no"],
      text: "{certificate.no}",
      textSize: 53,
      textStyle: "normal",
      textColor: MFAIC_TEXT_COLORS.black,
      textFont: MFAIC_FONTS.primary,
      y: 2067.5,
      x: 444,
      align: "left",
    },
    {
      dataKeys: ["certificate.chiefSignatureDate"],
      text: "{certificate.chiefSignatureDate}",
      textSize: 53,
      textStyle: "normal",
      textColor: MFAIC_TEXT_COLORS.black,
      textFont: MFAIC_FONTS.primary,
      y: 2191.5,
      x: 355,
      align: "left",
    },
    {
      dataKeys: ["certificate.signee"],
      text: "{certificate.signee}",
      textSize: 53,
      textStyle: "normal",
      textColor: MFAIC_TEXT_COLORS.black,
      textFont: MFAIC_FONTS.primary,
      y: 2380.5,
      x: 804.8,
      align: "left",
    },
    {
      dataKeys: ["certificate.number"],
      text: " {certificate.number}/GDLCBA",
      textSize: 53,
      textStyle: "normal",
      textColor: MFAIC_TEXT_COLORS.black,
      textFont: MFAIC_FONTS.primary,
      y: 2488,
      x: 709.8,
      align: "left",
    },
    {
      dataKeys: ["certificate.directorGeneralNote"],
      text: "{certificate.directorGeneralNote}",
      textSize: 53,
      textStyle: "semibold",
      textColor: MFAIC_TEXT_COLORS.black,
      textFont: MFAIC_FONTS.primary,
      y: 2707.5,
      x: 647.5,
      align: "left",
    },
    {
      dataKeys: ["certificate.directorGeneralSignatureDate"],
      text: "{certificate.directorGeneralSignatureDate}",
      textSize: 53,
      textStyle: "normal",
      textColor: MFAIC_TEXT_COLORS.black,
      textFont: MFAIC_FONTS.primary,
      y: 2767.5,
      x: 800,
      align: "left",
    },
  ];

  const bg = await createTemplateImage(MFAIC_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  const address = _.get(certificateInfo, "recipient.permanentAddress");
  const chiefTitle = _.get(certificateInfo, "certificate.chiefTitle")

  console.log(chiefTitle)

  drawWrapTexts(ctx, {
    top: 1353.5,
    left: 973.5,
    width: 1252,
    lineHeight: 1.1,
    textAlignment: "left",
    spans: [
      {
        text: `${address}`,
        fontSize: 53,
        fontFamily: MFAIC_FONTS.primary,
        fillStyle: MFAIC_TEXT_COLORS.black,
        fontWeight: "500",
      },
    ],
  }).draw();

  const chiefTitleWrap = drawWrapTexts(ctx, {
    top: 2255.8,
    left: 352,
    width: 1908,
    lineHeight: 1.1,
    textAlignment: "left",
    spans: [
      {
        text: `${chiefTitle}`,
        fontSize: 53,
        fontFamily: MFAIC_FONTS.primary,
        fillStyle: MFAIC_TEXT_COLORS.black,
        fontWeight: "500",
      },
    ]
  }).draw()

  // Draw Caption
  for (const text of MFAIC_TEXTS) {
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
      textColor: text.textColor || MFAIC_TEXT_COLORS.black,
      align: text.align,
      font: resolveFont(MFAIC_FONTS.primary, 24, text),
    });
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 184, 2943, 321);
  }

  // draw profile photo
  if (certificateInfo.recipient.photoUrl) {
    const profileImage = await loadRemoteResource(
      certificateInfo.recipient.photoUrl
    );
    if (profileImage) {
      const profileMaxWidth = 210;
      const profileHeight =
        profileMaxWidth / (profileImage.width / profileImage.height);
      const profileX = 235.5;
      const profileY = 1139.2;
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
