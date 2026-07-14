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

export async function createMoCaRPrimarySchoolBuddhistStudyCertificte(
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

  const center = certificateInfo.certificate.examCenterKm || "";
  const examCenter = center.replace(/វត្ដ|វត្ត/g, "").trim();
  certificateInfo.examCenter = examCenter;

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
    "mocar-primary-school-buddhist-study-certificate.jpg";

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

  let nameData = [
    {
      dataKeys: ["commune"],
      text: "{commune}",
      textSize: 48,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
    },
    {
      dataKeys: ["commune"],
      text: "{commune}",
      textSize: 48,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
    },
  ];

  const realcommuneText = _.get(certificateInfo, "commune", "");
  const realDistrictKmText = _.get(certificateInfo, "district", "");

  const communeKmFontSize = adjustFontSize(
    ctx,
    { ...nameData[0], text: realcommuneText },
    378
  );
  const districtKmFontSize = adjustFontSize(
    ctx,
    { ...nameData[1], text: realDistrictKmText },
    340
  );

  const MOCAR_TEXTS = [
    {
      dataKeys: ["day"],
      text: "{day}",
      textSize: 48,
      textStyle: "bold",
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      y: 1198,
      x: 705,
      align: "center",
    },
    {
      dataKeys: ["month"],
      text: "{month}",
      textSize: 48,
      textStyle: "bold",
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      y: 1198,
      x: 881,
      align: "center",
    },
    {
      dataKeys: ["year"],
      text: "{year}",
      textSize: 48,
      textStyle: "bold",
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      y: 1198,
      x: 1128,
      align: "center",
    },
    {
      dataKeys: ["commune"],
      text: "{commune}",
      textSize: communeKmFontSize,
      textStyle: "bold",
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      y: 1198,
      x: 1709,
      align: "center",
    },
    {
      dataKeys: ["district"],
      text: "{district}",
      textSize: districtKmFontSize,
      textStyle: "bold",
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      y: 1198,
      x: 2368,
      align: "center",
    },
    {
      dataKeys: ["province"],
      text: "{province}",
      textSize: 48,
      textStyle: "bold",
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      y: 1198,
      x: 2783,
    },
    {
      dataKeys: ["examDay"],
      text: "{examDay}",
      textSize: 48,
      textStyle: "bold",
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      y: 1289,
      x: 1669,
      align: "center",
    },
    {
      dataKeys: ["examMonth"],
      text: "{examMonth}",
      textSize: 48,
      textStyle: "bold",
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      y: 1289,
      x: 1855,
      align: "center",
    },
    {
      dataKeys: ["examYear"],
      text: "{examYear}",
      textSize: 48,
      textStyle: "bold",
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      y: 1289,
      x: 2073,
      align: "center",
    },
    {
      dataKeys: ["certificate.examCenterKm"],
      text: "{certificate.examCenterKm}",
      textSize: 48,
      textStyle: "bold",
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      y: 1289,
      x: 2410,
    },
    {
      dataKeys: ["certificate.gradeKm"],
      text: "{certificate.gradeKm}",
      textSize: 48,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.khmerOsMoulLight,
      y: 1380,
      x: 844,
      align: "center",
    },
    {
      dataKeys: ["certificate.numberKm"],
      text: "ចុះបញ្ជីលេខ {certificate.numberKm}",
      textSize: 48,
      textStyle: "bold",
      align: "center",
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      y: 1596,
      x: 943,
    },
  ];

  function buildLunarSpans(text, blackColor, fontFamily) {
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
          fontSize: 48,
          fontWeight: "bold",
          fillStyle: blackColor,
          fontFamily,
          align: "center",
        });
      }
      spans.push({
        text: m[0],
        fontSize: 48,
        fontFamily,
        align: "center",
      });
      lastIndex = pattern.lastIndex;
    }

    const after = s.slice(lastIndex);
    if (after) {
      spans.push({
        text: after,
        fontSize: 48,
        fontWeight: "bold",
        fontFamily,
        align: "center",
      });
    }

    return spans;
  }

  function buildMinisterDateSpans(text, blackColor, fontFamily) {
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
          fontSize: 48,
          fontWeight: "bold",
          fillStyle: blackColor,
          fontFamily,
          align: "center",
        });
      }
      spans.push({
        text: m[0],
        fontSize: 48,
        fontFamily,
        align: "center",
      });
      lastIndex = pattern.lastIndex;
    }

    const after = s.slice(lastIndex);
    if (after) {
      spans.push({
        text: after,
        fontSize: 48,
        fontWeight: "bold",
        fontFamily,
        align: "center",
      });
    }

    return spans;
  }

  const nameKm = certificateInfo.recipient.nameKm;
  drawWrapTexts(ctx, {
    top: 1081,
    left: 0,
    width: 3508,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: "បញ្ជាក់ថាសមណសិស្ស សិស្សឈ្មោះ ",
        fontSize: 48,
        fillStyle: MOCAR_TEXT_COLORS.black,
        fontFamily: MOCAR_FONTS.KhmerOSSiemreap,
        fontWeight: "bold",
      },
      {
        text: nameKm,
        fontSize: 48,
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

    const lunarSpans = buildLunarSpans(
      lunarText,
      MOCAR_TEXT_COLORS.black,
      MOCAR_FONTS.KhmerOSSiemreap
    );

    drawWrapTexts(ctx, {
      top: 1583,
      left: 1684,
      width: 1460,
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
      MOCAR_TEXT_COLORS.black,
      MOCAR_FONTS.KhmerOSSiemreap
    );

    drawWrapTexts(ctx, {
      top: 1668,
      left: 1684,
      width: 1460,
      textAlignment: "center",
      lineHeight: 1.2,
      spans: ministerDateSpans,
    }).draw();
  }

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
    await drawQrCodeStandard(qrcodeContent, ctx, 2771, 1725, 312);
  }

  // Draw profile photo
  if (certificateInfo.recipient.photoBase64) {
    const profileImage = await loadRemoteResource(
      certificateInfo.recipient.photoBase64
    );
    if (profileImage) {
      const profileMaxWidth = 364;
      const profileHeight =
        profileMaxWidth / (profileImage.width / profileImage.height);
      const profileX = 1559;
      const profileY = 1626;
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
