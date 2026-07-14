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

export async function createMoCaRPharmaDisciplineCertficate(
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
    if (!placeStr) return { village: "", commune: "", province: "" };
    const normalized = placeStr.replace(/[\s\u200B]+/g, " ").trim();
    const parts = normalized.split(" ");

    let village = "";
    let commune = "";
    let province = "";

    for (const part of parts) {
      if (/^(ឃុំ|សង្កាត់)/.test(part))
        village = part.replace(/^(ឃុំ|សង្កាត់)/, "");
      else if (/^(ក្រុង|ស្រុក|ខណ្ឌ)/.test(part))
        commune = part.replace(/^(ក្រុង|ស្រុក|ខណ្ឌ)/, "");
      else if (/^(រាជធានី|ខេត្ត)/.test(part))
        province = part.replace(/^(រាជធានី|ខេត្ត)/, "");
    }

    return { village, commune, province };
  }

  const examPlace = certificateInfo?.certificate?.placeOfSchoolKm;
  const { village, commune, province } = parseKhmerPlace(examPlace);

  certificateInfo.village = village;
  certificateInfo.commune = commune;
  certificateInfo.province = province;

  const CADT_TEMPLATE_IMAGE = "mocar-dharma-discipline-certificate.jpg";

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
      dataKeys: ["recipient.nounNameKm"],
      text: "{recipient.nounNameKm}",
      textSize: 46,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
    },
    {
      dataKeys: ["village"],
      text: "{village}",
      textSize: 46,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
    },
    {
      dataKeys: ["certificate.courseKm"],
      text: "{certificate.courseKm}",
      textSize: 46,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
    },
  ];

  const realNounNameText = _.get(certificateInfo, "recipient.nounNameKm", "");
  const realVillageText = _.get(certificateInfo, "village", "");
  const realCourseKmText = _.get(certificateInfo, "certificate.courseKm", "");

  const nounNameKmFontSize = adjustFontSize(
    ctx,
    { ...nameData[0], text: realNounNameText },
    283
  );
  const villageKmFontSize = adjustFontSize(
    ctx,
    { ...nameData[1], text: realVillageText },
    273
  );
  const courKmFontSize = adjustFontSize(
    ctx,
    { ...nameData[2], text: realCourseKmText },
    209
  );

  const MOCAR_TEXTS = [
    {
      dataKeys: ["recipient.nounNameKm"],
      text: "{recipient.nounNameKm}",
      textSize: nounNameKmFontSize,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      y: 1532,
      x: 771,
      align: "center",
    },
    {
      dataKeys: ["recipient.durationKm"],
      text: "{recipient.durationKm}",
      textSize: 46,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      y: 1532,
      x: 1079,
      align: "center",
    },
    {
      dataKeys: ["day"],
      text: "{day}",
      textSize: 46,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      y: 1532,
      x: 1405,
      align: "center",
    },
    {
      dataKeys: ["month"],
      text: "{month}",
      textSize: 46,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      y: 1532,
      x: 1677,
      align: "center",
    },
    {
      dataKeys: ["year"],
      text: "{year}",
      textSize: 46,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      y: 1532,
      x: 1961,
      align: "center",
    },
    {
      dataKeys: ["examCenter"],
      text: "{examCenter}",
      textSize: 46,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      y: 1532,
      x: 2498,
      align: "center",
    },
    {
      dataKeys: ["village"],
      text: "{village}",
      textSize: villageKmFontSize,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      y: 1606,
      x: 750,
      align: "center",
    },
    {
      dataKeys: ["commune"],
      text: "{commune}",
      textSize: 46,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      y: 1606,
      x: 1436,
      align: "center",
    },
    {
      dataKeys: ["province"],
      text: "{province}",
      textSize: 46,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      y: 1606,
      x: 2131,
      align: "center",
    },
    {
      dataKeys: ["certificate.courseKm"],
      text: "{certificate.courseKm}",
      textSize: courKmFontSize,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      y: 1682,
      x: 813,
      align: "center",
    },
    {
      dataKeys: ["certificate.gradeKm"],
      text: "{certificate.gradeKm}",
      textSize: 46,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.khmerOsMoulLight,
      y: 1682,
      x: 1115,
      align: "center",
    },
    {
      dataKeys: ["certificate.rankKm"],
      text: "{certificate.rankKm}",
      textSize: 46,
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.khmerOsMoulLight,
      y: 1682,
      x: 1543,
    },
    {
      dataKeys: ["certificate.numberKm"],
      text: "ចុះបញ្ជីលេខ {certificate.numberKm}",
      textSize: 46,
      textStyle: "bold",
      align: "center",
      textColor: MOCAR_TEXT_COLORS.black,
      textFont: MOCAR_FONTS.KhmerOSSiemreap,
      y: 1842,
      x: 886,
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
          fontSize: 46,
          fontWeight: "bold",
          fillStyle: blackColor,
          fontFamily,
          align: "center",
        });
      }
      spans.push({
        text: m[0],
        fontSize: 46,
        fontFamily,
        align: "center",
      });
      lastIndex = pattern.lastIndex;
    }

    const after = s.slice(lastIndex);
    if (after) {
      spans.push({
        text: after,
        fontWeight: "bold",
        fontSize: 46,
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
          fontSize: 46,
          fontWeight: "bold",
          fillStyle: blackColor,
          fontFamily,
          align: "center",
        });
      }
      spans.push({
        text: m[0],
        fontSize: 46,
        fontFamily,
        align: "center",
      });
      lastIndex = pattern.lastIndex;
    }

    const after = s.slice(lastIndex);
    if (after) {
      spans.push({
        text: after,
        fontSize: 46,
        fontWeight: "bold",
        fontFamily,
        align: "center",
      });
    }

    return spans;
  }

  const loggedAt = certificateInfo.certificate.loggedAt;
  const {
    day: logDay,
    month: logMonth,
    year: logYear,
  } = parseKhmerDate(certificateInfo.certificate.logDateKm || "");

  drawWrapTexts(ctx, {
    top: 1343,
    left: 0,
    width: 3508,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: "បានឃើញកំណត់ហេតុ ចុះថ្ងៃ ",
        fontSize: 46,
        fillStyle: MOCAR_TEXT_COLORS.black,
        fontFamily: MOCAR_FONTS.KhmerOSSiemreap,
        align: "center",
      },
      {
        text: logDay,
        fontSize: 46,
        fillStyle: MOCAR_TEXT_COLORS.black,
        fontFamily: MOCAR_FONTS.KhmerOSSiemreap,
        align: "center",
      },
      {
        text: " ខែ ",
        fontSize: 46,
        fillStyle: MOCAR_TEXT_COLORS.black,
        fontFamily: MOCAR_FONTS.KhmerOSSiemreap,
        align: "center",
      },
      {
        text: logMonth,
        fontSize: 46,
        fillStyle: MOCAR_TEXT_COLORS.black,
        fontFamily: MOCAR_FONTS.KhmerOSSiemreap,
        align: "center",
      },
      {
        text: " ឆ្នាំ ",
        fontSize: 46,
        fillStyle: MOCAR_TEXT_COLORS.black,
        fontFamily: MOCAR_FONTS.KhmerOSSiemreap,
        align: "center",
      },
      {
        text: logYear,
        fontSize: 46,
        fillStyle: MOCAR_TEXT_COLORS.black,
        fontFamily: MOCAR_FONTS.KhmerOSSiemreap,
        align: "center",
      },
      {
        text: " របស់គណៈកម្មការប្រឡងក្នុងរាជធានី ខេត្ត",
        fontSize: 46,
        fillStyle: MOCAR_TEXT_COLORS.black,
        fontFamily: MOCAR_FONTS.KhmerOSSiemreap,
        align: "center",
      },
      {
        text: loggedAt,
        fontSize: 46,
        fillStyle: MOCAR_TEXT_COLORS.black,
        fontFamily: MOCAR_FONTS.KhmerOSSiemreap,
        align: "center",
      },
    ],
  }).draw();

  const nameKm = certificateInfo.recipient.nameKm;
  drawWrapTexts(ctx, {
    top: 1427,
    left: 0,
    width: 3508,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: "បញ្ជាក់ថាសមណសិស្ស សិស្សឈ្មោះ ",
        fontSize: 46,
        fillStyle: MOCAR_TEXT_COLORS.black,
        fontFamily: MOCAR_FONTS.KhmerOSSiemreap,
        fontWeight: "bold",
      },
      {
        text: nameKm,
        fontSize: 46,
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
      top: 1831,
      left: 1710,
      width: 1353,
      textAlignment: "center",
      lineHeight: 2.2,
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
      top: 1912,
      left: 1710,
      width: 1353,
      textAlignment: "center",
      lineHeight: 1,
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
    await drawQrCodeStandard(qrcodeContent, ctx, 2886, 1870, 312);
  }

  // Draw profile photo
  if (certificateInfo.recipient.photoUrl) {
    const profileImage = await loadRemoteResource(
      certificateInfo.recipient.photoUrl
    );
    if (profileImage) {
      const profileMaxWidth = 316;
      const profileHeight =
        profileMaxWidth / (profileImage.width / profileImage.height);
      const profileX = 1596;
      const profileY = 1848;
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
