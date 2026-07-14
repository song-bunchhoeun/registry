import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import {
  createTemplateImage,
  drawText,
  drawWrapTexts,
  drawSpaceWrapTexts,
  drawPreview,
  drawTextWithLetterSpacing,
} from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createPPCAHealthHygieneCertificateCanvas(
  certificateInfo = {},
  qrcodeContent,
  preview,
) {
  const PPCA_TEXT_COLORS = {
    black: "#00000",
  };
  const PPCA_FONTS = {
    mool: "Khmer Mool1",
    siemreap: "Khmer OS Siemreap",
    times: "Times New Roman",
  };

  const TEMPLATE_IMAGE = "ppca-hygiene-background.jpg";
  // const TEMPLATE_IMAGE = "ppca-hygiene-sample.jpg";

  const isNew = _.get(certificateInfo, "certificate.type", "");

  const businessStatus = isNew === "new" ? "ថ្មី" : "បន្ត";

  let PPCA_TEXTS = [
    // title template english
    {
      dataKeys: [],
      text: "CERTIFICATE OF HYGIENE",
      textSize: 55,
      textColor: PPCA_TEXT_COLORS.black,
      textFont: PPCA_FONTS.times,
      textStyle: "bold",
      x: 1765,
      y: 730,
      align: "center",
    },
    // lunar date km
    {
      dataKeys: ["certificate.signatureLunarYearKm"],
      text: certificateInfo.certificate.signatureLunarYearKm,
      textSize: 46,
      textColor: PPCA_TEXT_COLORS.black,
      textFont: PPCA_FONTS.siemreap,
      x: 2395,
      y: 1731,
      align: "left",
    },
    // date km
    {
      dataKeys: ["certificate.signatureYearKm"],
      text: certificateInfo.certificate.signatureYearKm,
      textSize: 46,
      textColor: PPCA_TEXT_COLORS.black,
      textFont: PPCA_FONTS.siemreap,
      x: 2597,
      y: 1806,
      align: "left",
    },
  ];

  const TITLE_TEMPLATE_KH = [
    [
      {
        dataKeys: [],
        text: "វិញ្ញាបនបត្របញ្ជាក់អនាម័យ",
        textSize: 70,
        textFont: PPCA_FONTS.mool,
        textColor: PPCA_TEXT_COLORS.black,
        x: 1690,
        y: 653,
        align: "center",
        letterSpacing: -1,
      },
      {
        dataKeys: [],
        text: "(",
        textSize: 70,
        textFont: PPCA_FONTS.times,
        textColor: PPCA_TEXT_COLORS.black,
        addX: 20,
        align: "left",
      },
      {
        dataKeys: [],
        text: `${businessStatus}`,
        textSize: 70,
        textFont: PPCA_FONTS.mool,
        textColor: PPCA_TEXT_COLORS.black,
        addX: 0,
        align: "left",
      },
      {
        dataKeys: [],
        text: ")",
        textSize: 70,
        textFont: PPCA_FONTS.times,
        textColor: PPCA_TEXT_COLORS.black,
        addX: 0,
        align: "left",
      },
    ],
  ];

  const MANAGER_KM = [
    [
      {
        dataKeys: ["recipient.titleKm"],
        text: certificateInfo.recipient.titleKm,
        textSize: 46,
        textColor: PPCA_TEXT_COLORS.black,
        textFont: PPCA_FONTS.siemreap,
        x: 683,
        y: 959,
        align: "left",
      },
      {
        dataKeys: ["recipient.nameKm"],
        text: certificateInfo.recipient.nameKm,
        textSize: 46,
        textColor: PPCA_TEXT_COLORS.black,
        textFont: PPCA_FONTS.mool,
        addX: 16,
        align: "left",
      },
    ],
  ];

  const MANAGER_EN = [
    [
      {
        dataKeys: ["recipient.title"],
        text: certificateInfo.recipient.title.toUpperCase(),
        textSize: 46,
        textStyle: "bold",
        textColor: PPCA_TEXT_COLORS.black,
        textFont: PPCA_FONTS.times,
        x: 747,
        y: 1111,
        align: "left",
      },
      {
        dataKeys: ["recipient.name"],
        text: certificateInfo.recipient.name.toUpperCase(),
        textSize: 46,
        textStyle: "bold",
        textColor: PPCA_TEXT_COLORS.black,
        textFont: PPCA_FONTS.times,
        addX: 5,
        align: "left",
      },
    ],
  ];

  const BUSINESS_NAME_KM = [
    [
      {
        dataKeys: ["certificate.businessTypeKm"],
        text: certificateInfo.certificate.businessTypeKm + "ឈ្មោះ",
        textSize: 46,
        textColor: PPCA_TEXT_COLORS.black,
        textFont: PPCA_FONTS.siemreap,
        x: 1072,
        y: 884,
        align: "left",
        letterSpacing: 0,
      },
      {
        dataKeys: ["certificate.businessNameKm"],
        text: "{certificate.businessNameKm}",
        textSize: 46,
        textColor: PPCA_TEXT_COLORS.black,
        textFont: PPCA_FONTS.mool,
        addX: 20,
        align: "left",
      },
    ],
  ];

  const BUSINESS_NAME = [
    [
      {
        dataKeys: [],
        text: "PHNOM PENH CAPITAL ADMINISTRATION CERTIFIED RESTAURANT :",
        textSize: 48,
        textColor: PPCA_TEXT_COLORS.black,
        textFont: PPCA_FONTS.times,
        textStyle: "italic",
        x: 416,
        y: 1038,
        align: "left",
        letterSpacing: 0,
      },
      {
        dataKeys: ["certificate.businessType"],
        text: certificateInfo.certificate.businessType.toUpperCase() + " : ",
        textSize: 48,
        textColor: PPCA_TEXT_COLORS.black,
        textFont: PPCA_FONTS.times,
        textStyle: "italic",
        addX: 20,
        align: "left",
        letterSpacing: 0,
      },
      {
        dataKeys: ["certificate.businessName"],
        text: certificateInfo.certificate.businessName.toUpperCase(),
        textSize: 48,
        textColor: PPCA_TEXT_COLORS.black,
        textFont: PPCA_FONTS.times,
        textStyle: "bold",
        addX: 10,
        align: "left",
        letterSpacing: 0,
      },
    ],
  ];

  const BUSINESS_ADDRESS_KM = [
    [
      {
        dataKeys: ["certificate.businessAddressKm.no"],
        text: certificateInfo.certificate.businessAddressKm.no,
        textSize: 48,
        textColor: PPCA_TEXT_COLORS.black,
        textFont: PPCA_FONTS.siemreap,
        textStyle: "bold",
        x: 680,
        y: 1190,
        align: "left",
        letterSpacing: 0,
      },
      {
        dataKeys: [],
        text: "ផ្លូវ",
        textSize: 48,
        textFont: PPCA_FONTS.siemreap,
        textColor: PPCA_TEXT_COLORS.black,
        addX: 20,
        y: 1190,
        align: "left",
      },
      {
        dataKeys: ["certificate.businessAddressKm.street"],
        text: certificateInfo.certificate.businessAddressKm.street,
        textSize: 48,
        textFont: PPCA_FONTS.siemreap,
        textColor: PPCA_TEXT_COLORS.black,
        textStyle: "bold",
        addX: 10,
        y: 1190,
        align: "left",
        letterSpacing: 0,
      },
      {
        dataKeys: [],
        text: "ភូមិ",
        textSize: 48,
        textFont: PPCA_FONTS.siemreap,
        textColor: PPCA_TEXT_COLORS.black,
        addX: 20,
        y: 1190,
        align: "left",
      },
      {
        dataKeys: ["certificate.businessAddressKm.village"],
        text: certificateInfo.certificate.businessAddressKm.village,
        textSize: 48,
        textFont: PPCA_FONTS.siemreap,
        textColor: PPCA_TEXT_COLORS.black,
        textStyle: "bold",
        addX: 15,
        y: 1190,
        align: "left",
        letterSpacing: 0,
      },
      {
        dataKeys: [],
        text: "សង្កាត់",
        textSize: 48,
        textFont: PPCA_FONTS.siemreap,
        textColor: PPCA_TEXT_COLORS.black,
        addX: 20,
        y: 1190,
        align: "left",
      },
      {
        dataKeys: ["certificate.businessAddressKm.commune"],
        text: certificateInfo.certificate.businessAddressKm.commune,
        textSize: 48,
        textFont: PPCA_FONTS.siemreap,
        textColor: PPCA_TEXT_COLORS.black,
        textStyle: "bold",
        addX: 15,
        y: 1190,
        align: "left",
        letterSpacing: 0,
      },
      {
        dataKeys: [],
        text: "ខណ្ឌ",
        textSize: 48,
        textFont: PPCA_FONTS.siemreap,
        textColor: PPCA_TEXT_COLORS.black,
        addX: 20,
        y: 1190,
        align: "left",
      },
      {
        dataKeys: ["certificate.businessAddressKm.district"],
        text: certificateInfo.certificate.businessAddressKm.district,
        textSize: 48,
        textFont: PPCA_FONTS.siemreap,
        textColor: PPCA_TEXT_COLORS.black,
        textStyle: "bold",
        addX: 15,
        y: 1190,
        align: "left",
        letterSpacing: 0,
      },
      {
        dataKeys: ["certificate.businessAddressKm.province"],
        text: certificateInfo.certificate.businessAddressKm.province,
        textSize: 48,
        textFont: PPCA_FONTS.siemreap,
        textColor: PPCA_TEXT_COLORS.black,
        addX: 20,
        y: 1190,
        align: "left",
        letterSpacing: -1,
      },
    ],
  ];

  const BUSINESS_ADDRESS = [
    [
      {
        dataKeys: [],
        text: "LOCATED AT",
        textSize: 48,
        textColor: PPCA_TEXT_COLORS.black,
        textFont: PPCA_FONTS.times,
        textStyle: "italic",
        x: 416,
        y: 1265,
        align: "left",
        letterSpacing: 0,
      },
      {
        dataKeys: ["certificate.businessAddress.no"],
        text: certificateInfo.certificate.businessAddress.no.toUpperCase(),
        textSize: 48,
        textColor: PPCA_TEXT_COLORS.black,
        textFont: PPCA_FONTS.times,
        textStyle: "bold",
        addX: 20,
        align: "left",
        letterSpacing: 0,
      },
      {
        dataKeys: [],
        text: "STREET",
        textStyle: "italic",
        textSize: 48,
        textFont: PPCA_FONTS.times,
        textColor: PPCA_TEXT_COLORS.black,
        addX: 30,
        align: "left",
      },
      {
        dataKeys: ["certificate.businessAddress.street"],
        text: certificateInfo.certificate.businessAddress.street.toUpperCase(),
        textStyle: "bold",
        textSize: 48,
        textFont: PPCA_FONTS.times,
        textColor: PPCA_TEXT_COLORS.black,
        addX: 10,
        align: "left",
        letterSpacing: 0,
      },
      {
        dataKeys: [],
        text: "PHUM",
        textStyle: "italic",
        textSize: 48,
        textFont: PPCA_FONTS.times,
        textColor: PPCA_TEXT_COLORS.black,
        addX: 20,
        align: "left",
      },
      {
        dataKeys: ["certificate.businessAddress.village"],
        text: certificateInfo.certificate.businessAddress.village.toUpperCase(),
        textStyle: "bold",
        textSize: 48,
        textFont: PPCA_FONTS.times,
        textColor: PPCA_TEXT_COLORS.black,
        addX: 15,
        align: "left",
        letterSpacing: 0,
      },
      {
        dataKeys: [],
        text: "SANGKAT",
        textStyle: "italic",
        textSize: 48,
        textFont: PPCA_FONTS.times,
        textColor: PPCA_TEXT_COLORS.black,
        addX: 20,
        align: "left",
      },
      {
        dataKeys: ["certificate.businessAddress.commune"],
        text: certificateInfo.certificate.businessAddress.commune.toUpperCase(),
        textStyle: "bold",
        textSize: 48,
        textFont: PPCA_FONTS.times,
        textColor: PPCA_TEXT_COLORS.black,
        addX: 15,
        align: "left",
        letterSpacing: 0,
      },
      {
        dataKeys: [],
        text: "KHAN",
        textStyle: "italic",
        textSize: 48,
        textFont: PPCA_FONTS.times,
        textColor: PPCA_TEXT_COLORS.black,
        addX: 20,
        align: "left",
      },
      {
        dataKeys: ["certificate.businessAddress.district"],
        text: certificateInfo.certificate.businessAddress.district.toUpperCase(),
        textStyle: "bold",
        textSize: 48,
        textFont: PPCA_FONTS.times,
        textColor: PPCA_TEXT_COLORS.black,
        addX: 15,
        align: "left",
        letterSpacing: 0,
      },
      {
        dataKeys: ["certificate.businessAddress.province"],
        text: certificateInfo.certificate.businessAddress.province.toUpperCase(),
        textStyle: "italic",
        textSize: 48,
        textFont: PPCA_FONTS.times,
        textColor: PPCA_TEXT_COLORS.black,
        addX: 25,
        align: "left",
        letterSpacing: -1,
      },
    ],
  ];

  const EXPIRED_DATE_KM = [
    [
      {
        dataKeys: ["certificate.expiredDateKm"],
        text: "{certificate.expiredDateKm}",
        textStyle: "bold",
        textSize: 46,
        textFont: PPCA_FONTS.siemreap,
        textColor: PPCA_TEXT_COLORS.black,
        x: 1040,
        y: 1487,
        align: "left",
      },
      {
        dataKeys: [],
        text: "។ ហើយលោកស្រីត្រូវស្នើសុំវិញ្ញាបនបត្របញ្ជាក់",
        textSize: 46,
        textFont: PPCA_FONTS.siemreap,
        textColor: PPCA_TEXT_COLORS.black,
        addX: 10,
        align: "left",
      },
    ],
  ];

  const EXPIRED_DATE = [
    [
      {
        dataKeys: ["certificate.expiredDate"],
        text: certificateInfo.certificate.expiredDate.toUpperCase(),
        textStyle: "bold",
        textSize: 46,
        textFont: PPCA_FONTS.times,
        textColor: PPCA_TEXT_COLORS.black,
        x: 1126,
        y: 1565,
        align: "left",
      },
      {
        dataKeys: [],
        text: ". AND YOU NEED TO REQUEST THE CERTIFICATE OF HYGIENE",
        textStyle: "italic",
        textSize: 46,
        textFont: PPCA_FONTS.times,
        textColor: PPCA_TEXT_COLORS.black,
        addX: 10,
        align: "left",
      },
    ],
  ];

  PPCA_TEXTS = [
    ...PPCA_TEXTS,
    ...TITLE_TEMPLATE_KH,
    ...MANAGER_KM,
    ...MANAGER_EN,
    ...BUSINESS_NAME_KM,
    ...BUSINESS_NAME,
    ...BUSINESS_ADDRESS_KM,
    ...BUSINESS_ADDRESS,
    ...EXPIRED_DATE_KM,
    ...EXPIRED_DATE,
  ];

  const calculateAndApplyLetterSpacing = (
    ctx,
    calArray,
    targetArray,
    maxWidth,
  ) => {
    let totalWidth = 0;

    for (const item of calArray) {
      ctx.font = resolveFont(item.textFont, item.textSize, item);
      const textMetric = ctx.measureText(item.text);
      item.measuredWidth = textMetric.width;
      totalWidth += textMetric.width + (item.addX || 0);
    }

    let letterSpacing = 0;
    if (totalWidth > maxWidth) {
      while (totalWidth > maxWidth && letterSpacing > -20) {
        letterSpacing -= 0.1;
        totalWidth = 0;

        for (const item of calArray) {
          const charCount = item.text.length;
          const spacingAdjustment = letterSpacing * (charCount - 1);
          const adjustedWidth = item.measuredWidth + spacingAdjustment;
          totalWidth += adjustedWidth + (item.addX || 0);
        }
      }
    }

    for (let i = 0; i < targetArray.length; i++) {
      targetArray[i].letterSpacing = letterSpacing;
    }

    return letterSpacing;
  };

  const getTextMaxWidth = (ctx, textItem) => {
    ctx.font = resolveFont(textItem.textFont, textItem.textSize, textItem);
    const targetMatric = ctx.measureText(textItem.text);
    return targetMatric;
  };

  const bg = await createTemplateImage(TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  const adjustLetterSpacingForWidth = (ctx, dataItem, textMaxWidth) => {
    ctx.font = resolveFont(dataItem.textFont, dataItem.textSize, dataItem);
    let textMetric = ctx.measureText(dataItem.text);
    let letterSpacing = 0;

    // Auto-reduce from 0 to -20, step -0.1
    while (textMetric.width > textMaxWidth && letterSpacing > -20) {
      letterSpacing -= 0.1;
      const charCount = dataItem.text.length;
      const spacingAdjustment = letterSpacing * (charCount - 1);
      const adjustedWidth = textMetric.width + spacingAdjustment;
      if (adjustedWidth <= textMaxWidth) break;
    }
    return letterSpacing;
  };

  // BUSINESS_NAME_CAL
  const BUSINESS_NAME_CAL = [
    [
      {
        dataKeys: [],
        text: "PHNOM PENH CAPITAL ADMINISTRATION CERTIFIED RESTAURANT :",
        textSize: 48,
        textColor: PPCA_TEXT_COLORS.black,
        textFont: PPCA_FONTS.times,
        textStyle: "italic",
        x: 416,
        y: 1038,
        align: "left",
        letterSpacing: 0,
      },
      {
        dataKeys: ["certificate.businessType"],
        text: certificateInfo.certificate.businessType.toUpperCase() + " : ",
        textSize: 48,
        textColor: PPCA_TEXT_COLORS.black,
        textFont: PPCA_FONTS.times,
        textStyle: "italic",
        addX: 20,
        align: "left",
        letterSpacing: 0,
      },
      {
        dataKeys: ["certificate.businessName"],
        text: certificateInfo.certificate.businessName.toUpperCase(),
        textSize: 48,
        textColor: PPCA_TEXT_COLORS.black,
        textFont: PPCA_FONTS.times,
        textStyle: "bold",
        addX: 10,
        align: "left",
      },
    ],
  ];

  // ===== BUSINESS_NAME LETTER SPACING (GROUP WIDTH CALCULATION) =====
  const BUSINESS_NAME_MAX_WIDTH = 2300;
  calculateAndApplyLetterSpacing(
    ctx,
    BUSINESS_NAME_CAL[0],
    BUSINESS_NAME[0],
    BUSINESS_NAME_MAX_WIDTH,
  );

  // ===== BUSINESS_ADDRESS LETTER SPACING (GROUP WIDTH CALCULATION) =====
  const BUSINESS_ADDRESS_CAL = [
    [
      {
        text: "LOCATED AT",
        textStyle: "italic",
        textSize: 48,
        textFont: PPCA_FONTS.times,
        x: 416,
        y: 1265,
      },
      {
        text: `${_.get(certificateInfo, "certificate.businessAddress.no", "")}`,
        textSize: 48,
        textFont: PPCA_FONTS.times,
        textStyle: "bold",
        letterSpacing: 0,
        addX: 20,
      },
      {
        text: "STREET",
        textStyle: "italic",
        textSize: 48,
        textFont: PPCA_FONTS.times,
        addX: 30,
      },
      {
        text: `${_.get(certificateInfo, "certificate.businessAddress.street", "")}`,
        textStyle: "bold",
        textSize: 48,
        textFont: PPCA_FONTS.times,
        addX: 10,
        letterSpacing: 0,
      },
      {
        text: "PHUM",
        textStyle: "italic",
        textSize: 48,
        textFont: PPCA_FONTS.times,
        addX: 20,
      },
      {
        text: `${_.get(certificateInfo, "certificate.businessAddress.village", "")}`,
        textStyle: "bold",
        textSize: 48,
        textFont: PPCA_FONTS.times,
        addX: 15,
        letterSpacing: 0,
      },
      {
        text: "SANGKAT",
        textStyle: "italic",
        textSize: 48,
        textFont: PPCA_FONTS.times,
        addX: 20,
      },
      {
        text: `${_.get(certificateInfo, "certificate.businessAddress.commune", "")}`,
        textStyle: "bold",
        textSize: 48,
        textFont: PPCA_FONTS.times,
        addX: 15,
        letterSpacing: 0,
      },
      {
        text: "KHAN",
        textStyle: "italic",
        textSize: 48,
        textFont: PPCA_FONTS.times,
        addX: 20,
      },
      {
        text: `${_.get(certificateInfo, "certificate.businessAddress.district", "")}`,
        textStyle: "bold",
        textSize: 48,
        textFont: PPCA_FONTS.times,
        addX: 15,
        letterSpacing: 0,
      },
      {
        text: `${_.get(certificateInfo, "certificate.businessAddress.province", "")}`,
        textStyle: "italic",
        textSize: 48,
        textFont: PPCA_FONTS.times,
        addX: 20,
        letterSpacing: -1,
      },
    ],
  ];

  // ===== BUSINESS_ADDRESS LETTER SPACING (GROUP WIDTH CALCULATION) =====
  const BUSINESS_ADDRESS_MAX_WIDTH = 1950;
  calculateAndApplyLetterSpacing(
    ctx,
    BUSINESS_ADDRESS_CAL[0],
    BUSINESS_ADDRESS[0],
    BUSINESS_ADDRESS_MAX_WIDTH,
  );

  let lastDrawn = null;
  for (const text of PPCA_TEXTS) {
    if (text.letterSpacing !== undefined) {
      drawTextWithLetterSpacing(canvas, ctx, text.text, {
        x: text.x,
        y: text.y,
        textColor: text.textColor || PPCA_TEXT_COLORS.black,
        align: text.align,
        font: resolveFont(PPCA_FONTS.siemreap, 24, text),
        letterSpacing: text.letterSpacing,
      });
    } else if (text.length > 0) {
      for (const index in text) {
        const textItem = text[index];
        let lastItem;
        if (index > 0) lastItem = text[index - 1];

        if (!textItem.x) {
          const lastFont = resolveFont(
            lastItem.textFont,
            lastItem.textSize,
            lastItem,
          );
          ctx.font = lastFont;
          const lastItemMetric = ctx.measureText(lastItem.text);
          let measuredWidth = lastItemMetric.width;
          if (lastItem.letterSpacing) {
            const charCount = lastItem.text.length;
            const spacingAdjustment = lastItem.letterSpacing * (charCount - 1);
            measuredWidth += spacingAdjustment;
          }
          let xOffset = measuredWidth;
          if (lastItem.align === "center") {
            xOffset = measuredWidth / 2;
          } else if (lastItem.align === "right") {
            xOffset = -measuredWidth;
          }
          textItem.x = lastItem.x + xOffset + textItem.addX;
        }

        if (!textItem.y) textItem.y = lastItem.y;

        if (textItem.letterSpacing !== undefined) {
          drawTextWithLetterSpacing(canvas, ctx, textItem.text, {
            x: textItem.x,
            y: textItem.y,
            textColor: textItem.textColor || PPCA_TEXT_COLORS.black,
            align: textItem.align,
            font: resolveFont(
              textItem.textFont || PPCA_FONTS.siemreap,
              textItem.textSize || 24,
              textItem,
            ),
            letterSpacing: textItem.letterSpacing,
          });
        } else {
          drawTextItem(
            canvas,
            ctx,
            textItem,
            textItem.textFont || PPCA_FONTS.siemreap,
            certificateInfo,
          );
        }
      }
    } else
      drawTextItem(canvas, ctx, text, PPCA_FONTS.siemreap, certificateInfo);
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 2815, 1786, 320);
  } else {
    const qrBlank = await loadImage(
      path.join(process.cwd(), "assets", "qr-bg-v2-sample.png"),
    );
    if (qrBlank) {
      ctx.drawImage(qrBlank, 2815, 1786, 320, 393);
    }
  }

  if (preview === true || preview === "true") {
    drawPreview(canvas, ctx, {
      rotate: -45,
      color: "#DCDCDC",
      text: "Preview",
      fontSize: "500",
      fontFamily: PPCA_FONTS.siemreap,
    });
  }

  // draw profile photo
  if (certificateInfo.recipient?.photoBase64) {
    try {
      const base64Image = certificateInfo.recipient.photoBase64;
      if (
        base64Image &&
        typeof base64Image === "string" &&
        base64Image.trim()
      ) {
        const dataUrl = base64Image.startsWith("data:")
          ? base64Image
          : `data:image/jpeg;base64,${base64Image}`;
        const profileImage = await loadImage(dataUrl);
        const profileMaxWidth = 346;
        const profileMaxHeight = 440;
        const profileX = 2788;
        const profileY = 717;
        ctx.drawImage(
          profileImage,
          profileX,
          profileY,
          profileMaxWidth,
          profileMaxHeight,
        );
      }
    } catch (err) {
      console.error("Failed to load profile photo:", err);
    }
  } else if (certificateInfo.recipient?.photoUrl) {
    try {
      let resBuffer;
      const response = await axios({
        url: certificateInfo.recipient.photoUrl,
        responseType: "arraybuffer",
      });
      resBuffer = response.data;
      const rotatedBuffer = await jo.rotate(resBuffer, { quality: 100 });
      resBuffer = rotatedBuffer.buffer;

      const img = sharp(resBuffer, { failOn: "truncated" });
      const maxY = 2033.5;
      const maxImgBoxWidth = 265;
      const maxImgBoxHeight = 294;
      let profileX = bg.width / 2;
      let imgSize = [];
      let resizedBuffer;

      const wImg = img.clone();
      const wToBuffer = await wImg
        .resize({ width: maxImgBoxWidth, fit: sharp.fit.contain })
        .jpeg({ quality: 100 })
        .toBuffer({ resolveWithObject: true });
      imgSize = [wToBuffer.info.width, wToBuffer.info.height];
      resizedBuffer = wToBuffer.data;

      if (imgSize[1] > maxImgBoxHeight) {
        const hImg = img.clone();
        const hToBuffer = await hImg
          .resize({ height: maxImgBoxHeight, fit: sharp.fit.contain })
          .jpeg({ quality: 100 })
          .toBuffer({ resolveWithObject: true });
        imgSize = [hToBuffer.info.width, hToBuffer.info.height];
        resizedBuffer = hToBuffer.data;
      }

      const profileY = maxY - imgSize[1];
      const profileImage = await loadImage(resizedBuffer);
      profileX = profileX - imgSize[0] / 2;
      ctx.drawImage(profileImage, profileX, profileY, imgSize[0], imgSize[1]);
    } catch (err) {
      console.error("Failed to load profile photo from URL:", err);
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
