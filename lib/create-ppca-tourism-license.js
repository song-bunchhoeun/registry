import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import {
  createTemplateImage,
  drawText,
  drawWrapTexts,
  drawSpaceWrapTexts,
  drawPreview,
} from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createPPCATourismLicenseCertificate(
  certificateInfo = {},
  qrcodeContent,
  preview,
) {
  const MPTC_TEXT_COLORS = {
    black: "#000",
  };
  const MPTC_FONTS = {
    mool: "Khmer Mool1",
    siemreap: "Khmer OS Siemreap",
    times: "Times New Roman",
  };

  let NAME_TEXT = [
    {
      dataKeys: ["recipient.nameKm"],
      text: certificateInfo.recipient.nameKm,
      textSize: 50,
      textFont: MPTC_FONTS.mool,
    },
    {
      dataKeys: ["recipient.name"],
      text: certificateInfo.recipient.name,
      textSize: 54,
      addX: 20,
      textFont: MPTC_FONTS.times,
      textStyle: "bold",
    },
  ];

  const TEMPLATE_IMAGE = "ppca-tourism-license-blank.jpg";

  const getTextMaxWidth = (ctx, textItem) => {
    ctx.font = resolveFont(textItem.textFont, textItem.textSize, textItem);
    const targetMatric = ctx.measureText(textItem.text);
    return targetMatric;
  };

  const bg = await createTemplateImage(TEMPLATE_IMAGE);
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
      adjustFontSize(ctx, { ...item, textSize: fontSizes[i] }, textMaxWidth),
    );
  };

  const nameFontSize = adjustFontSizesForMultiple(
    ctx,
    [NAME_TEXT[0], NAME_TEXT[1]],
    900,
  );

  NAME_TEXT = [
    {
      text: "អនុញ្ញាតឱ្យលោក-លោកស្រី",
      textSize: 50,
      textFont: MPTC_FONTS.mool,
      textColor: MPTC_TEXT_COLORS.black,
      y: 994.7,
      x: 864,
      align: "left",
    },
    {
      text: " ៖ ",
      textSize: 50,
      textFont: MPTC_FONTS.siemreap,
      textColor: MPTC_TEXT_COLORS.black,
      addX: 5,
      y: 994.7,
      align: "left",
    },
    {
      dataKeys: ["recipient.nameKm"],
      text: certificateInfo.recipient.nameKm,
      textSize: nameFontSize[0],
      textFont: MPTC_FONTS.mool,
      addX: 5,
      y: 994.7 - (52 - nameFontSize[1]) / 2,
      align: "left",
    },
    {
      dataKeys: ["recipient.name"],
      text: certificateInfo.recipient.name,
      textSize: nameFontSize[1],
      textFont: MPTC_FONTS.times,
      textStyle: "bold",
      addX: 20,
      y: 994.7 - (52 - nameFontSize[1]) / 2,
      align: "left",
    },
    {
      dataKeys: ["recipient.nationalityKm"],
      text: `(${certificateInfo.recipient.nationalityKm})`,
      textSize: 54,
      textFont: MPTC_FONTS.mool,
      addX: 10,
      y: 994.7,
      align: "left",
    },
    {
      text: "ភេទ",
      textSize: 52,
      textFont: MPTC_FONTS.mool,
      addX: 20,
      y: 994.7,
      align: "left",
    },
    {
      text: "៖",
      textSize: 52,
      textFont: MPTC_FONTS.siemreap,
      addX: 5,
      y: 994.7,
      align: "left",
    },
    {
      dataKeys: ["recipient.genderKm"],
      text: "{recipient.genderKm}",
      textSize: 52,
      textFont: MPTC_FONTS.mool,
      addX: 5,
      y: 994.7,
      align: "left",
    },
  ];

  const addressKmLabel = `អាសយដ្ឋាន         ៖`;
  const addressKmSegments = addressKmLabel.match(
    /[\u1780-\u17FF]+|[a-zA-Z0-9\s]+/g,
  );
  const addressKm = _.get(certificateInfo, "recipient.addressKm");
  const addressKmTextsegments =
    addressKm.match(
      /[\u1780-\u17FF\u17E0-\u17E9]+|[^\u1780-\u17FF\u17E0-\u17E9]+/g,
    ) || [];

  const addressWidthLimit = 1647;
  let addressBaseTop = 1077.7;
  let addressLines = 1;

  ctx.font = `500 43px ${MPTC_FONTS.mool}`;
  const addressMetrics = ctx.measureText(`${addressKm}`);
  if (addressMetrics.width <= addressWidthLimit) {
    addressLines = 1;
  } else {
    addressLines = Math.ceil(addressMetrics.width / addressWidthLimit);
  }

  const lineHeightAdjustment = 88;
  const positionOffset = addressLines === 1 ? lineHeightAdjustment : 0;

  const addressLine = {
    top: addressBaseTop,
    left: 864,
    width: 500,
    textAlignment: "left",
    lineHeight: 1.58,
    spans: [
      ...addressKmSegments.map((addressKmSegment) => ({
        text: addressKmSegment,
        fontSize: 49,
        fontFamily: addressKmSegment.includes("៖")
          ? MPTC_FONTS.siemreap
          : MPTC_FONTS.mool,
        fillStyle: MPTC_TEXT_COLORS.black,
      })),
    ],
  };

  const spans = addressKmTextsegments.map((segment) => {
    const isKhmer = /[\u1780-\u17FF\u17E0-\u17E9]/.test(segment);
    return {
      text: segment,
      fontSize: 48,
      fontFamily: isKhmer ? MPTC_FONTS.mool : MPTC_FONTS.times,
      fontWeight: isKhmer ? "500" : "bold",
      fillStyle: MPTC_TEXT_COLORS.black,
    };
  });

  const addressKmWrap = drawSpaceWrapTexts(ctx, {
    top: addressBaseTop,
    left: 1326,
    width: addressWidthLimit,
    textAlignment: "left",
    lineHeight: 1.75,
    spans,
  });

  addressKmWrap.draw();
  const addressKmWrapHeight = addressKmWrap.height();

  // business
  const businessKm = `ប្រកបអាជីវកម្ម​    ​៖`;
  const businessKmSegments = businessKm.match(
    /[\u1780-\u17FF]+|[a-zA-Z0-9\s]+/g,
  );

  const issuedTypeKm = certificateInfo.certificate.issuedTypeKm;

  const businessTop = addressBaseTop + addressKmWrapHeight + 48;

  const businessLine = {
    top: businessTop,
    left: 864,
    width: 500,
    textAlignment: "left",
    lineHeight: 1.58,
    spans: [
      ...businessKmSegments.map((businessKmSegment) => ({
        text: businessKmSegment,
        fontSize: 50,
        fontFamily: businessKmSegment.includes("៖")
          ? MPTC_FONTS.siemreap
          : MPTC_FONTS.mool,
        fillStyle: MPTC_TEXT_COLORS.black,
      })),
    ],
  };

  const businessTypeWrap = drawSpaceWrapTexts(ctx, {
    top: businessTop,
    left: 1326,
    width: addressWidthLimit,
    textAlignment: "left",
    leineHeight: 1.75,
    spans: [
      {
        text: `${certificateInfo.certificate.businessTypeKm}`,
        fontSize: 50,
        fontFamily: MPTC_FONTS.mool,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "normal",
      },
      {
        // text: `  (${certificateInfo.certificate.businessType})`,
        text: certificateInfo.certificate.businessType && `  (${certificateInfo.certificate.businessType})`,
        fontSize: 50,
        fontFamily: MPTC_FONTS.times,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "bold",
      },
      {
        text: `  (${certificateInfo.certificate.issuedTypeKm})`,
        fontSize: 50,
        fontFamily: MPTC_FONTS.mool,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "normal",
      },
    ],
  });

  businessTypeWrap.draw();
  const businessTypeWrapHeight = businessTypeWrap.height();

  // business name
  const businessNameKm = `អាជីវកម្មឈ្មោះ.    ៖`;
  const businessNameKmSegments = businessNameKm.match(
    /[\u1780-\u17FF]+|[a-zA-Z0-9\s]+/g,
  );

  const businessNameTop = businessTop + businessTypeWrapHeight + 48;

  const businessNameLine = {
    top: businessNameTop,
    left: 864,
    width: 500,
    textAlignment: "left",
    lineHeight: 1.58,
    spans: [
      ...businessNameKmSegments.map((businessNameKmSegment) => ({
        text: businessNameKmSegment,
        fontSize: 50,
        fontFamily: businessNameKmSegment.includes("៖")
          ? MPTC_FONTS.siemreap
          : MPTC_FONTS.mool,
        fillStyle: MPTC_TEXT_COLORS.black,
      })),
    ],
  };

  const businessNameWrap = drawSpaceWrapTexts(ctx, {
    top: businessNameTop,
    left: 1326,
    width: addressWidthLimit,
    textAlignment: "left",
    leineHeight: 1.75,
    spans: [
      {
        text: `${certificateInfo.certificate.businessNameKm}`,
        fontSize: 50,
        fontFamily: MPTC_FONTS.mool,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "normal",
      },
      {
        text: `  ${certificateInfo.certificate.businessName}`,
        fontSize: 50,
        fontFamily: MPTC_FONTS.times,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "bold",
      },
    ],
  });
  businessNameWrap.draw();
  const businessNameWrapHeight = businessNameWrap.height();

  // issued date
  const issuedDate = `ចាប់ពីថ្ងៃទី          ​៖`;
  const issuedDateSegments = issuedDate.match(
    /[\u1780-\u17FF]+|[a-zA-Z0-9\s]+/g,
  );

  const issuedDateTop = businessNameTop + businessNameWrapHeight + 48;

  const issuedDateLine = {
    top: issuedDateTop,
    left: 864,
    width: 500,
    textAlignment: "left",
    lineHeight: 1.58,
    spans: [
      ...issuedDateSegments.map((issuedDateSegment) => ({
        text: issuedDateSegment,
        fontSize: 51.3,
        fontFamily: issuedDateSegment.includes("៖")
          ? MPTC_FONTS.siemreap
          : MPTC_FONTS.mool,
        fillStyle: MPTC_TEXT_COLORS.black,
      })),
    ],
  };

  const issuedDateWrap = drawSpaceWrapTexts(ctx, {
    top: issuedDateTop,
    left: 1326,
    width: addressWidthLimit,
    textAlignment: "left",
    leineHeight: 1.75,
    spans: [
      {
        text: `${certificateInfo.certificate.issuedDateKm}`,
        fontSize: 50,
        fontFamily: MPTC_FONTS.mool,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "medium",
      },
      {
        text: ` ដល់ `,
        fontSize: 50,
        fontFamily: MPTC_FONTS.mool,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "medium",
      },
      {
        text: `${certificateInfo.certificate.expiredDateKm}`,
        fontSize: 50,
        fontFamily: MPTC_FONTS.mool,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "medium",
      },
    ],
  });
  issuedDateWrap.draw();
  const issuedDateWrapHeight = issuedDateWrap.height();

  const signatureLunarDateTop = issuedDateTop + issuedDateWrapHeight + 15;
  const signatureDateKmTop = issuedDateTop + issuedDateWrapHeight + 85;
  const authorizationTop = issuedDateTop + issuedDateWrapHeight + 185;
  const authorizationTitleTop = issuedDateTop + issuedDateWrapHeight + 255;

  let MPTC_TEXTS = [
    {
      dataKeys: [],
      text: "អាជ្ញាបណ្ណទេសចរណ៍",
      textSize: 116,
      textColor: MPTC_TEXT_COLORS.black,
      textFont: MPTC_FONTS.mool,
      y: 669,
      align: "center",
    },
    {
      dataKeys: [""],
      text: "TOURISM LICENSE",
      textSize: 110,
      textStyle: "bold",
      textColor: MPTC_TEXT_COLORS.black,
      textFont: MPTC_FONTS.times,
      y: 851.2,
      align: "center",
    },
    {
      dataKeys: [""],
      text: `ថ្ងៃ............................ខែ...................ឆ្នាំ ${certificateInfo.certificate.lunarYearKm}`,
      textSize: 50,
      textColor: MPTC_TEXT_COLORS.black,
      textFont: MPTC_FONTS.siemreap,
      x: 1569.5,
      y: signatureLunarDateTop,
    },
    {
      dataKeys: [""],
      text: `រាជធានីភ្នំពេញ ថ្ងៃទី...............ខែ...................ឆ្នាំ${certificateInfo.certificate.yearKm}`,
      textSize: 50,
      textColor: MPTC_TEXT_COLORS.black,
      textFont: MPTC_FONTS.siemreap,
      x: 1682.7,
      y: signatureDateKmTop,
    },
    {
      dataKeys: [""],
      text: "ជ.អភិបាលនៃគណៈអភិបាលរាជធានីភ្នំពេញ",
      textSize: 53.5,
      textStyle: "normal",
      textColor: MPTC_TEXT_COLORS.black,
      textFont: MPTC_FONTS.mool,
      x: 1840,
      y: authorizationTop,
    },
    {
      dataKeys: [""],
      text: "អភិបាលរង",
      textSize: 53,
      textStyle: "normal",
      textColor: MPTC_TEXT_COLORS.black,
      textFont: MPTC_FONTS.mool,
      x: 2134,
      y: authorizationTitleTop,
    },
  ];

  const relatedTexts = [
    // nameLine,
    addressLine,
    businessLine,
    businessNameLine,
    issuedDateLine,
  ];

  relatedTexts.map((relatedJson) => {
    const relatedItem = drawWrapTexts(ctx, relatedJson);
    relatedItem.draw();
  });

  MPTC_TEXTS = [...NAME_TEXT, ...MPTC_TEXTS];

  let lastDrawn = null;
  for (const text of MPTC_TEXTS) {
    if (text.dataKeys && text.dataKeys.length > 0) {
      for (const key of text.dataKeys) {
        text.text = text.text.replace(
          `{${key}}`,
          _.get(certificateInfo, key, ""),
        );
      }
    }
    const font = resolveFont(MPTC_FONTS.siemreap, text.textSize || 24, text);

    let drawX = text.x;
    if (text.addX && lastDrawn) {
      drawX = lastDrawn.x + lastDrawn.width + text.addX;
    }

    ctx.font = font;
    const metrics = ctx.measureText(text.text);
    const textWidth = metrics.width;

    drawText(canvas, ctx, text.text, {
      x: drawX,
      y: text.y,
      textColor: text.textColor || MPTC_TEXT_COLORS.black,
      align: text.align,
      font,
    });

    lastDrawn = { x: drawX, width: textWidth };
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 2820, 1733.3, 315);
  } else {
    const qrBlank = await loadImage(
      path.join(process.cwd(), "assets", "qr-bg-v2-sample.png")
    );
    if (qrBlank) {
      ctx.drawImage(qrBlank, 2820, 1733.3, 315, 388.5);
    }
  }

  if (preview === true || preview === "true") {
    drawPreview(canvas, ctx, {
      rotate: -45,
      color: "#DCDCDC",
      text: "Preview",
      fontSize: "500",
      fontFamily: MPTC_FONTS.siemreap,
    });
  }

  // draw profile photo
  if (certificateInfo.recipient.photoBase64) {
    const base64Image = certificateInfo.recipient.photoBase64;
    if (base64Image) {
      const profileImage = await loadImage(`${base64Image}`);
      const profileMaxWidth = 417;
      const profileMaxHeight = 532;
      const profileX = 382;
      const profileY = 998;
      ctx.drawImage(
        profileImage,
        profileX,
        profileY,
        profileMaxWidth,
        profileMaxHeight,
      );
    }
  }

  return canvas;
}

const drawTextItem = (canvas, ctx, textItem, defaultFont, certificateInfo) => {
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
    textColor: textItem.textColor,
    align: textItem.align,
    font: resolveFont(defaultFont, 24, textItem),
    strokeLine: textItem.strokeLine,
    strokeColor: textItem.strokeColor,
    textMaxWidth: textItem.textMaxWidth,
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
