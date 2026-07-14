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

export async function createMoCaRUpperSecondarySchoolBuddhistStudyDegree(
  certificateInfo = {},
  qrcodeContent
) {
  const MOCAR_TEXT_COLORS = {
    black: "#000000",
    red: "#FF0000",
    green: "#008000",
  };

  const MOCAR_FONTS = {
    khmerOsMoulLight: "Khmer OS Muol Light",
    KhmerOSSiemreap: "Khmer OS Siemreap",
  };

  function parseKhmerDate(dateStr = "") {
    if (!dateStr) return { day: "", month: "", year: "" };
    const parts = dateStr
      .replace(/[\s\u200B]+/g, " ")
      .trim()
      .split(" ");
    return {
      day: parts[0] || "",
      month: parts[1] || "",
      year: parts[2] || "",
    };
  }

  const dobKm = certificateInfo?.recipient?.dateOfBirthKm;
  const { day, month, year } = parseKhmerDate(dobKm);

  certificateInfo.day = day;
  certificateInfo.month = month;
  certificateInfo.year = year;

  function parseKhmerPlace(placeStr = "") {
    if (!placeStr) return { commune: "", district: "", province: "" };
    const normalized = placeStr.replace(/[\s\u200B]+/g, " ").trim();
    const parts = normalized.split(" ");

    let commune = "";
    let district = "";
    let province = "";

    for (const part of parts) {
      if (/^(ឃុំ|សង្កាត់)/.test(part))
        commune = part.replace(/^(ឃុំ|សង្កាត់)/, "");
      else if (/^(ក្រុង|ស្រុក|ខណ្ឌ)/.test(part))
        district = part.replace(/^(ក្រុង|ស្រុក|ខណ្ឌ)/, "");
      else if (/^(រាជធានី|ខេត្ត)/.test(part))
        province = part.replace(/^(រាជធានី|ខេត្ត)/, "");
    }

    return { commune, district, province };
  }

  const placeOfBirth = certificateInfo?.recipient?.placeOfBirthKm;
  const { commune, district, province } = parseKhmerPlace(placeOfBirth);

  certificateInfo.commune = commune;
  certificateInfo.district = district;
  certificateInfo.province = province;

  const examDate = certificateInfo?.certificate?.examDateKm || "";
  const {
    day: examDay,
    month: examMonth,
    year: examYear,
  } = parseKhmerDate(examDate);

  certificateInfo.examDay = examDay;
  certificateInfo.examMonth = examMonth;
  certificateInfo.examYear = examYear;

  const CADT_TEMPLATE_IMAGE =
    "mocar-lower-and-upper-secondary-school-buddhist-study-degree.jpg";

  const examCenterKm = _.get(certificateInfo, "certificate.examCenterKm");

  let nameData = [
    {
      dataKeys: ["communeKm"],
      text: commune,
      textSize: 50,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
    },
    {
      dataKeys: ["certificate.examCenterKm"],
      text: examCenterKm,
      textSize: 50,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
    },
  ];

  const getTextMaxWidth = (ctx, textItem) => {
    ctx.font = resolveFont(textItem.textFont, textItem.textSize, textItem);
    const targetMatric = ctx.measureText(textItem.text);
    return targetMatric;
  };

  // Draw canvas
  const bg = await createTemplateImage(CADT_TEMPLATE_IMAGE);
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

  const communeKmFontSize = adjustFontSize(ctx, nameData[0], 431);
  const examCenterKmFontSize = adjustFontSize(ctx, nameData[1], 598);

  const MOCAR_TEXTS = [
    {
      dataKeys: ["recipient.genderKm"],
      text: "{recipient.genderKm}",
      textSize: 50,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      textStyle: "bold",
      y: 1254,
      x: 756,
      align: "center",
    },
    {
      dataKeys: ["day"],
      text: "{day}",
      textSize: 50,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      textStyle: "bold",
      y: 1254,
      x: 1119,
      align: "center",
    },
    {
      dataKeys: ["month"],
      text: "{month}",
      textSize: 50,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      textStyle: "bold",
      y: 1254,
      x: 1334,
      align: "center",
    },
    {
      dataKeys: ["year"],
      text: "{year}",
      textSize: 50,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      textStyle: "bold",
      y: 1254,
      x: 1586,
      align: "center",
    },
    {
      dataKeys: ["commune"],
      text: "{commune}",
      textSize: communeKmFontSize,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      textStyle: "bold",
      y: 1254,
      x: 2184,
      align: "center",
    },
    {
      dataKeys: ["district"],
      text: "{district}",
      textSize: 50,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      textStyle: "bold",
      y: 1254,
      x: 2754,
    },
    {
      dataKeys: ["province"],
      text: "{province}",
      textSize: 50,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      textStyle: "bold",
      y: 1345.5,
      x: 853,
      align: "center",
    },
    {
      dataKeys: ["certificate.degreeKm"],
      text: "{certificate.degreeKm}",
      textSize: 50,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      textStyle: "bold",
      y: 1345.5,
      x: 1754,
      align: "center",
    },
    {
      dataKeys: ["examDay"],
      text: "{examDay}",
      textSize: 50,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      textStyle: "bold",
      y: 1345.5,
      x: 2576,
      align: "center",
    },
    {
      dataKeys: ["examMonth"],
      text: "{examMonth}",
      textSize: 50,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      textStyle: "bold",
      y: 1345.5,
      x: 2769,
      align: "center",
    },
    {
      dataKeys: ["examYear"],
      text: "{examYear}",
      textSize: 50,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      textStyle: "bold",
      y: 1345.5,
      x: 2927,
    },
    {
      dataKeys: ["certificate.examCenterKm"],
      text: "{certificate.examCenterKm}",
      textSize: examCenterKmFontSize,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      textStyle: "bold",
      y: 1437,
      x: 924,
      align: "center",
    },
    {
      dataKeys: ["certificate.gradeKm"],
      text: "{certificate.gradeKm}",
      textSize: 50,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.khmerOsMoulLight,
      y: 1437,
      x: 1709,
      align: "center",
    },
    {
      dataKeys: ["certificate.rankKm"],
      text: "{certificate.rankKm}",
      textSize: 50,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.khmerOsMoulLight,
      y: 1437,
      x: 2605,
      align: "center",
    },
    {
      dataKeys: ["certificate.numberKm"],
      text: "ចុះបញ្ជីលេខ {certificate.numberKm}",
      textSize: 50,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      textStyle: "bold",
      align: "center",
      y: 1666,
      x: 913,
    },
  ];

  function buildLunarSpans(text, fontFamily) {
    if (!text) return [];

    let s = String(text)
      .normalize("NFC")
      .replace(/[\u200B\u200C\u200D]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    s = s.replace(/ថៃ្ង/g, "ថ្ងៃ");

    const pattern = /(ថ្ងៃ|កើត|ខែ|ឆ្នាំ|ស័ក|ព\.ស\.?)/g;

    const spans = [];
    let lastIndex = 0;
    let m;
    while ((m = pattern.exec(s)) !== null) {
      const before = s.slice(lastIndex, m.index);
      if (before) {
        spans.push({
          text: before,
          fontSize: 50,
          fillStyle: MOCAR_TEXT_COLORS.black,
          fontWeight: "bold",
          fontFamily,
          align: "center",
        });
      }
      spans.push({
        text: m[0],
        fontSize: 50,
        fontWeight: "normal",
        fontFamily,
        align: "center",
      });
      lastIndex = pattern.lastIndex;
    }

    const after = s.slice(lastIndex);
    if (after) {
      spans.push({
        text: after,
        fontSize: 50,
        fontWeight: "bold",
        fontFamily,
        align: "center",
      });
    }

    return spans;
  }

  function buildMinisterDateSpans(text, fontFamily) {
    if (!text) return [];

    let s = String(text)
      .normalize("NFC")
      .replace(/[\u200B\u200C\u200D]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const pattern = /(រាជធានីភ្នំពេញ\sថ្ងៃទី|ខែ|ឆ្នាំ)/g;

    const spans = [];
    let lastIndex = 0;
    let m;
    while ((m = pattern.exec(s)) !== null) {
      const before = s.slice(lastIndex, m.index);
      if (before) {
        spans.push({
          text: before,
          fontSize: 50,
          fillStyle: MOCAR_TEXT_COLORS.black,
          fontWeight: "bold",
          fontFamily,
          align: "center",
        });
      }
      spans.push({
        text: m[0],
        fontSize: 50,
        fontWeight: "normal",
        fontFamily,
        align: "center",
      });
      lastIndex = pattern.lastIndex;
    }

    const after = s.slice(lastIndex);
    if (after) {
      spans.push({
        text: after,
        fontSize: 50,
        fontWeight: "bold",
        fontFamily,
        align: "center",
      });
    }

    return spans;
  }

  const nameKm = certificateInfo.recipient.nameKm;
  drawWrapTexts(ctx, {
    top: 1135,
    left: 0,
    width: 3508,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: "បញ្ជាក់ថាសមណសិស្ស សិស្សឈ្មោះ ",
        fontSize: 50,
        fillStyle: MOCAR_TEXT_COLORS.black,
        fontFamily: MOCAR_FONTS.KhmerOSSiemreap,
        fontWeight: "bold",
      },
      {
        text: nameKm,
        fontSize: 50,
        fillStyle: MOCAR_TEXT_COLORS.black,
        fontFamily: MOCAR_FONTS.khmerOsMoulLight,
      },
    ],
  }).draw();

  {
    const lunarRaw = _.get(
      certificateInfo,
      "certificate.ministerSignatureLunarDateKm",
      ""
    );
    const lunarText = (lunarRaw || "").trim();

    const lunarSpans = buildLunarSpans(lunarText, MOCAR_FONTS.KhmerOSSiemreap);

    drawWrapTexts(ctx, {
      top: 1619,
      left: 1570,
      width: 1650,
      textAlignment: "center",
      lineHeight: 1.2,
      spans: lunarSpans,
    }).draw();
  }
  {
    const ministerDateRaw = _.get(
      certificateInfo,
      "certificate.ministerSignatureDateKm",
      ""
    );
    const ministerDate = (ministerDateRaw || "").trim();

    const ministerDateSpans = buildMinisterDateSpans(
      ministerDate,
      MOCAR_FONTS.KhmerOSSiemreap
    );

    drawWrapTexts(ctx, {
      top: 1710,
      left: 1682,
      width: 1650,
      textAlignment: "center",
      lineHeight: 1.2,
      spans: ministerDateSpans,
    }).draw();
  }

  // Draw Caption
  for (const text of MOCAR_TEXTS) {
    if (text.dataKeys && text.dataKeys.length > 0) {
      for (const key of text.dataKeys) {
        text.text = text.text.replace(
          `{${key}}`,
          _.get(certificateInfo, key, "")
        );
      }
    }

    drawText(canvas, ctx, text.text, {
      x: text.x,
      y: text.y,
      textColor: text.textColor || MOCAR_TEXT_COLORS.black,
      align: text.align,
      font: resolveFont(MOCAR_FONTS.primary, 24, text),
    });
  }

  // Draw QR code
  if (qrcodeContent) {
      await drawQrCodeStandard(qrcodeContent, ctx, 2845, 1754, 312);
  }

  // Draw profile photo
  if (certificateInfo.recipient.photoBase64) {
    const profileImage = await loadRemoteResource(
      certificateInfo.recipient.photoBase64
    );
    if (profileImage) {
      const profileMaxWidth = 312;
      const profileHeight =
        profileMaxWidth / (profileImage.width / profileImage.height);
      const profileX = 1612;
      const profileY = 1734;
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
