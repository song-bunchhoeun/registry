import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import {
  createTemplateImage,
  drawText,
  drawWrapTexts,
  loadRemoteResource,
} from "./shared";
import QRCode from "qrcode";
import _ from "lodash";
export async function createMoINFOPressCardV2(
  certificateInfo = {},
  qrcodeContent
) {
  const MOINFO_TEXT_COLORS = {
    blue: "#2E3192",
    red: "#F00000",
    white: "#FFFFFF",
  };

  const MOINFO_FONTS = {
    siemReap: "Khmer OS Siemreap",
    moulLight: "Khmer OS Muol Light",
    arial: "Arial",
  };

  const MOINFO_TEMPLATE_IMAGE =
    certificateInfo.certificate.type === "normal"
      ? "moinfo-press-card-front-only-v5.0.jpg"
      : "moinfo-freelancer-card-front-only-v5.0.jpg";

  const name = _.toString(
    _.get(certificateInfo, "recipient.name", "")
  ).toUpperCase();

  const organization = _.get(certificateInfo, "recipient.organization", "");
  const organizationSplit = organization.split('/');

  let organizationKm
  let organizationEn
  if (organization.includes('/')) {
    organizationKm = organizationSplit[0].trim();
    organizationEn = organizationSplit[1].trim();
  }else {
    if(/[\u1780-\u17ff]+/.test(organization)) {
      organizationKm = organization;
      organizationEn = '';
    }else {
      organizationEn = organization;
      organizationKm = '';    
    }
  }
  const expiryDate = _.get(certificateInfo, "certificate.expiryDateKm", "");
  const expiryDatePrefixRemove = expiryDate
    .replace(/ថ្ងៃទី|ខែ|ឆ្នាំ/g, "")
    .trim();

  const positionKm = _.get(certificateInfo, "recipient.positionKm", "");
  const position = _.get(certificateInfo, "recipient.position", "");

  let MOINFO_TEXTS = [
    {
      dataKeys: ["recipient.nameKm"],
      text: "{recipient.nameKm}",
      textSize: 82,
      textColor: MOINFO_TEXT_COLORS.blue,
      textFont: MOINFO_FONTS.moulLight,
      y: 1591,
      align: "center",
    },
    {
      dataKeys: ["recipient.name"],
      text: name,
      textSize: 82,
      textColor: MOINFO_TEXT_COLORS.blue,
      textFont: MOINFO_FONTS.arial,
      y: 1714.4,
      align: "center",
      textStyle: "bold",
    },
    {
      dataKeys: ["recipient.mediaId", "certificate.year"],
      text: "{recipient.mediaId} / {certificate.year}",
      textSize: 62,
      textColor: MOINFO_TEXT_COLORS.blue,
      textFont: MOINFO_FONTS.arial,
      textStyle: "bold",
      x: 1022,
      y: 2025,
    },
    {
      dataKeys: ["certificate.headquarters"],
      text: "{certificate.headquarters}",
      textSize: 62,
      textColor: MOINFO_TEXT_COLORS.blue,
      textFont: MOINFO_FONTS.moulLight,
      x: 684.5,
      y: 2131,
    },
    {
      text: "ផុតកំណត់",
      textSize: 46,
      textColor: MOINFO_TEXT_COLORS.white,
      textFont: MOINFO_FONTS.moulLight,
      x: 281.5,
      y: 2621.5,
      align: "center",
    },
    {
      dataKeys: ["certificate.expiryDateKm"],
      text: expiryDatePrefixRemove,
      textSize: 46,
      textColor: MOINFO_TEXT_COLORS.white,
      textFont: MOINFO_FONTS.moulLight,
      x: 281.5,
      y: 2676,
      align: "center",
    },
  ];

  let ORGANIZATION_KM_TEXTS = [
    {
      dataKeys: ["recipient.organization"],
      text: organizationKm,
      textSize: 60,
      textFont: MOINFO_FONTS.siemReap,
      align: "left",
    },
  ];

  let ORGANIZATION_EN_TEXTS = [
    {
      dataKeys: ["recipient.organization"],
      text: organizationEn,
      textSize: 60,
      textFont: MOINFO_FONTS.arial,
      align: "left",
      textStyle: "bold",
    },
  ];

  let POSITION_KM_TEXTS = [
    {
      dataKeys: ["recipient.positionKm"],
      text: positionKm,
      textSize: 63,
      textFont: MOINFO_FONTS.siemReap,
      align: "left",
    },
  ];

  let POSITION_EN_TEXTS = [
    {
      dataKeys: ["recipient.position"],
      text: positionKm && " / " + position,
      textSize: 63,
      textFont: MOINFO_FONTS.arial,
      align: "left",
      textStyle: "bold",
    },
  ];

  let ORGANIZATION_TEXTS = [...ORGANIZATION_KM_TEXTS, ...ORGANIZATION_EN_TEXTS];

  let POSITION_TEXTS = [...POSITION_KM_TEXTS, ...POSITION_EN_TEXTS];

  const getTextMaxWidth = (ctx, textItem) => {
    ctx.font = resolveFont(textItem.textFont, textItem.textSize, textItem);
    const targetMatric = ctx.measureText(textItem.text);
    return targetMatric;
  };

  const bg = await createTemplateImage(MOINFO_TEMPLATE_IMAGE);
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

  const adjustFontSizesForMultiple = (ctx, dataItems, textMaxWidth) => {
    // Start by using each item's initial font size
    let fontSizes = dataItems.map((item) => item.textSize);

    const getTotalWidth = () => {
      return dataItems.reduce((sum, item, i) => {
        return (
          sum + getTextMaxWidth(ctx, { ...item, textSize: fontSizes[i] }).width
        );
      }, 0);
    };

    let totalWidth = getTotalWidth();

    // Reduce all font sizes proportionally until total width fits
    while (totalWidth > textMaxWidth) {
      // Reduce each font size by 0.5 (or any small step)
      fontSizes = fontSizes.map((size) => Math.max(size - 0.5, 0));
      totalWidth = getTotalWidth();
    }

    // Apply the adjusted font sizes using your existing function
    return dataItems.map((item, i) =>
      adjustFontSize(ctx, { ...item, textSize: fontSizes[i] }, textMaxWidth)
    );
  };

  const orgFontSize = adjustFontSizesForMultiple(
    ctx,
    [ORGANIZATION_TEXTS[0], ORGANIZATION_TEXTS[1]],
    1100
  );
  const posFontSize = adjustFontSizesForMultiple(
    ctx,
    [POSITION_TEXTS[0], POSITION_TEXTS[1]],
    1150
  );

  let orgSpans = [];
  if (organizationKm) {
    orgSpans.push({
      text: organizationKm,
      fontSize: orgFontSize[0],
      fontFamily: MOINFO_FONTS.siemReap,
      fillStyle: MOINFO_TEXT_COLORS.blue,
    });
  }
  if (organizationEn) {
    const prefix = organizationKm && " / ";
    orgSpans.push({
      text: `${prefix}${organizationEn}`,
      fontSize: orgFontSize[1],
      fontFamily: MOINFO_FONTS.arial,
      fillStyle: MOINFO_TEXT_COLORS.blue,
      fontWeight: "bold",
    });
  }

  let posSpans = [];

  if (positionKm) {
    posSpans.push({
      text: positionKm,
      fontSize: posFontSize[0],
      fontFamily: MOINFO_FONTS.siemReap,
      fillStyle: MOINFO_TEXT_COLORS.blue,
    });
  }
  if (position) {
    const prefix = positionKm ? " / " : "";
    posSpans.push({
      text: `${prefix}${position}`,
      fontSize: posFontSize[1],
      fontFamily: MOINFO_FONTS.arial,
      fillStyle: MOINFO_TEXT_COLORS.blue,
      fontWeight: "bold",
    });
  }

  drawWrapTexts(ctx, {
    top: 1811,
    left: 814,
    width: 1100,
    lineHeight: 1,
    spans: orgSpans,
  }).draw();

  drawWrapTexts(ctx, {
    top: 1917.5,
    left: 750.5,
    width: 1150,
    lineHeight: 1,
    spans: posSpans,
  }).draw();

  for (const text of MOINFO_TEXTS) {
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
        textColor: text.textColor || MOINFO_TEXT_COLORS.black,
        align: text.align,
        font: resolveFont(MOINFO_FONTS.primary, 24, text),
      });
    }
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 487, 2178, 422);
  }

  // draw profile photo
  if (certificateInfo.recipient.photoUrl) {
    const profileImage = await loadRemoteResource(
      // certificateInfo,
      certificateInfo.recipient.photoUrl
    );
    if (profileImage) {
      const maxImgBoxWidth = 691;
      const maxImgBoxHeight = 874;
      let scale_factor = Math.min(
        maxImgBoxWidth / profileImage.width,
        maxImgBoxHeight / profileImage.height
      );
      let newWidth = profileImage.width * scale_factor;
      let newHeight = profileImage.height * scale_factor;
      const profileX = 704;
      const profileY = 610;
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
  const logoPath = path.join(process.cwd(), "assets", "qr-bg-v2.png");
  const qrcodeLogoImage = await loadImage(logoPath);
  const gapSize = (width * 10) / 120;
  const qrcodeSize = width - gapSize * 2;
  const height = (width * 148) / 120;
  ctx.drawImage(qrcodeLogoImage, x, y, width, height);
  const qrcodeBuffer = await QRCode.toBuffer(qrcodeContent, {
    margin: 0,
    width: qrcodeSize,
  });
  const qrcodeImage = await loadImage(qrcodeBuffer);
  ctx.drawImage(qrcodeImage, x + gapSize, y + gapSize);
}
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
