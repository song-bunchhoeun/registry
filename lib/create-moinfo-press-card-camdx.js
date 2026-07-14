import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, loadRemoteResource } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createMoINFOPressCardCamdx(
  certificateInfo = {},
  qrcodeContent
) {
  const MPTC_TEXT_COLORS = {
    blue: "#2e3192",
  };

  const MPTC_FONTS = {
    primary: "Khmer M1",
    secondary: "Khmer OS Muol Light",
    thirdly: "Khmer OS Muol Light",
    fourly: "Arial",
    fifth: "Kh Siemreap",
  };

  const MPTC_TEMPLATE_IMAGE =
    certificateInfo.certificate.type === "freelancer"
      ? "moinfo-freelancer-2025-front.jpg"
      : "moinfo-press-2025-front.jpg";

  let NAME_TEXTS = [
    {
      dataKeys: ["recipient.nameKm"],
      text: _.get(certificateInfo, "recipient.nameKm", ""),
      textSize: 92,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.secondary,
      x: 2083,
      y: 467,
      align: "left",
    },
    {
      dataKeys: ["recipient.name"],
      text: _.get(certificateInfo, "recipient.name", ""),
      textSize: 92,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.fifth,
      x: 2082,
      y: 617,
      align: "left",
    },
  ];

  let MPTC_TEXTS = [
    {
      dataKeys: ["recipient.mediaId", "certificate.year"],
      text: "{recipient.mediaId} / {certificate.year}",
      textSize: 100,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.fourly,
      textStyle: "bold",
      x: 644,
      y: 1890,
      align: "center",
    },
    {
      dataKeys: ["certificate.expiryDateKm"],
      text: "ផុតកំណត់{certificate.expiryDateKm}",
      textSize: 50,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.secondary,
      x: 644,
      y: 1960,
      align: "center",
    },
  ];

  let positionKm = certificateInfo.recipient.positionKm;
  let position = certificateInfo.recipient.position;
  let organizationKm = certificateInfo.recipient.organizationKm;
  let organization = certificateInfo.recipient.organization;
  let organizationText;
  let positionText;

  if (positionKm) {
    positionText = `${positionKm}`;
  }
  if (position) {
    positionText = `${position}`;
  }
  if (positionKm && position) {
    positionText = `${positionKm} / ${position}`;
  }
  if (position === "Deputy Director of Department") {
    positionLabel[0].textSize = 68.8;
  }
  if (position === "Director of Department") {
    positionLabel[0].textSize = 86.7;
  }

  if (organizationKm && organization) {
    organizationText = `${organizationKm} / ${organization}`;
  } else if (organization) {
    organizationText = `${organization}`;
  } else {
    organizationText = `${organizationKm}`;
  }

  let positionLabel = [
    {
      dataKeys: ["recipient.positionKm", "recipient.position"],
      text: positionText,
      textSize: 92,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.secondary,
      x: 1488,
      y: 1219,
      align: "left",
    },
  ];

  let organizationLable = [
    {
      dataKeys: ["recipient.organizationKm", "recipient.organization"],
      text: organizationText,
      textSize: 92.2,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.secondary,
      x: 1490,
      y: 920,
      align: "left",
    },
  ];

  // if (recipient.institution !== "") {
  //     MPTC_TEXTS.push(
  //         {
  //             dataKeys: ['certificate.institutionKm', 'certificate.institution'],
  //             text: '{certificate.institutionKm} / {certificate.institution}',
  //             textSize: 94,
  //             textColor: MPTC_TEXT_COLORS.blue,
  //             textFont: MPTC_FONTS.secondary,
  //             x: 1485,
  //             y: 1051,
  //             align: 'left',
  //         }
  //     )
  // }

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
    // Ensure font is set correctly before measuring
    let getTextWidth = getTextMaxWidth(ctx, {
      ...dataItem,
      textSize: fontSize,
    });

    // Only reduce font size if width exceeds textMaxWidth
    if (getTextWidth.width > textMaxWidth) {
      while (getTextWidth.width > textMaxWidth && fontSize > 0) {
        fontSize -= 0.5;

        // Recalculate text width with the new font size using getTextMaxWidth
        getTextWidth = getTextMaxWidth(ctx, {
          ...dataItem,
          textSize: fontSize,
        });
      }
    }
    return fontSize;
  };

  let positionFontSize = adjustFontSize(ctx, positionLabel[0], 1740);
  let organizationFontSize = adjustFontSize(ctx, organizationLable[0], 1740);
  let nameKmFontSize = adjustFontSize(ctx, NAME_TEXTS[0], 1145);
  let nameFontSize = adjustFontSize(ctx, NAME_TEXTS[1], 1145);

  NAME_TEXTS = [
    {
      dataKeys: ["recipient.nameKm"],
      text: _.get(certificateInfo, "recipient.nameKm", ""),
      textSize: nameKmFontSize,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.secondary,
      x: 2083,
      y: 467,
      align: "left",
    },
    {
      dataKeys: ["recipient.name"],
      text: _.get(certificateInfo, "recipient.name", ""),
      textSize: nameFontSize,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.fifth,
      x: 2082,
      y: 617,
      align: "left",
    },
  ];

  let organizationLabel = [
    {
      dataKeys: ["recipient.organizationKm", "recipient.organization"],
      text: organizationText,
      textSize: organizationFontSize,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.secondary,
      x: 1490,
      y: 920,
      align: "left",
    },
  ];

  let newPositionLabel = [
    {
      dataKeys: ["recipient.positionKm", "recipient.position"],
      text: positionText,
      textSize: positionFontSize,
      textColor: MPTC_TEXT_COLORS.blue,
      textFont: MPTC_FONTS.secondary,
      x: 1488,
      y: 1219,
      align: "left",
    },
  ];

  // draw profile photo
  if (certificateInfo.recipient.photoUrl) {
    const profileImage = await loadRemoteResource(
      certificateInfo.recipient.photoUrl
    );
    if (profileImage) {
      const maxImgBoxWidth = 1014;
      const maxImgBoxHeight = 1255;

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
      const profileX = 131;
      const profileY = 425;
      ctx.drawImage(
        profileImage,
        profileX,
        profileY,
        newWidth,
        newHeight
      );
    }
    // draw photo stamp emboss
    //  const stampEmboss = await loadImage(path.join(process.cwd(), 'assets', 'minfo-stamp.png'));
    //  if (stampEmboss) {
    //      ctx.drawImage(stampEmboss,865+20, 1330-10 /* 1186 + 60 */, 730, 720);
    //  }
  }

  MPTC_TEXTS = [
    ...MPTC_TEXTS,
    ...newPositionLabel,
    ...organizationLabel,
    ...NAME_TEXTS,
  ];

  // Draw Caption
  for (const text of MPTC_TEXTS) {
    const value = _.get(certificateInfo, text.key, "");
    if (value !== "null" && value !== null) {
      if (text.dataKeys && text.dataKeys.length > 0) {
        for (const key of text.dataKeys)
          text.text = text.text.replace(
            `{${key}}`,
            _.get(certificateInfo, key, "")
          );
      }

      if (text.text === "null" || text.text === null) continue;

      drawText(canvas, ctx, text.text, {
        x: text.x,
        y: text.y,
        textColor: text.textColor || MPTC_TEXT_COLORS.black,
        align: text.align,
        font: resolveFont(MPTC_FONTS.primary, 24, text),
      });
    }
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 1392, 1289, 547);
  }else {
    const qrBlank = await loadImage(
      path.join(process.cwd(), "assets", "qr-bg-v2-sample.png")
    );
    if (qrBlank) {
      ctx.drawImage(qrBlank, 1392, 1289, 547, 679);
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
