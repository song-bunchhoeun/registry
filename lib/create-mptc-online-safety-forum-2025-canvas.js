import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createMptcOnlineForum2025Canvas(
  certificateInfo = {},
  qrcodeContent
) {
  const MPTC_TEXT_COLORS = {
    blue: "#234282",
    black: "#101010",
    // black: "#FF0000",
  };
  const typeKm =
    certificateInfo.certificate.type === "Speaker"
      ? "ក្នុងនាមជាវាគ្មិនក្នុង"
      : "ក្នុងការសហការរៀបចំ";

  const type =
    certificateInfo.certificate.type === "Speaker"
      ? "contributing as a Speaker"
      : "supporting the organization of";

  const applyAt = certificateInfo.certificate.type === "Speaker" ? "at " : "";

  const MPTC_FONTS = {
    primary: "Khmer OS Muol Light",
    secondary: "Arial",
    thirdly: "NiDA Sowannaphum",
    fourly: "Google Sans",
  };
  const MPTC_TEMPLATE_IMAGE = "mptc-online-safety-forum-2025.jpg";

  const MPTC_TEXTS = [
    {
      dataKeys: ["recipient.nameKm"],
      text: "{recipient.nameKm}",
      textSize: 50,
      textColor: MPTC_TEXT_COLORS.blue,
      y: 1471.5,
      align: "center",
      textFont: MPTC_FONTS.primary,
    },
    {
      dataKeys: ["recipient.roleKm"],
      text: `ដែលបានចូលរួមចំណែកយ៉ាងសកម្ម${typeKm}`,
      textSize: 51,
      textColor: MPTC_TEXT_COLORS.black,
      y: 1557.5,
      align: "center",
      textFont: MPTC_FONTS.thirdly,
    },
    {
      dataKeys: ["certificate.forumKm", "certificate.topicKm"],
      text: `វេទិកាលើកទី២ ឆ្នាំ២០២៥ ស្តីពី "${certificateInfo.certificate.forumKm}"`,
      textSize: 50.5,
      textColor: MPTC_TEXT_COLORS.black,
      textStyle: "bold",
      y: 1638.6,
      align: "center",
      textFont: MPTC_FONTS.thirdly,
    },
    {
      dataKeys: ["certificate.themeKm"],
      text: `ក្រោមមូលបទ៖${certificateInfo.certificate.themeKm.replace(
        /ការ/g,
        ""
      )}`,
      textSize: 50,
      textColor: MPTC_TEXT_COLORS.black,
      textStyle: "bold",
      y: 1724.3,
      align: "center",
      textFont: MPTC_FONTS.thirdly,
    },
    {
      dataKeys: ["certificate.dateKm", "certificate.placeKm"],
      text: `${certificateInfo.certificate.dateKm} នៅ${certificateInfo.certificate.locationKm}។`,
      textSize: 50,
      textColor: MPTC_TEXT_COLORS.black,
      y: 1809,
      align: "center",
      textFont: MPTC_FONTS.thirdly,
    },
    {
      dataKeys: ["recipient.name"],
      text: "{recipient.name}",
      textSize: 58,
      textColor: MPTC_TEXT_COLORS.blue,
      y: 1974,
      align: "center",
      textFont: MPTC_FONTS.fourly,
      textStyle: "bold",
    },
    {
      dataKeys: ["recipient.role"],
      text: `for actively ${type}`,
      textSize: 46,
      textColor: MPTC_TEXT_COLORS.black,
      y: 2059,
      align: "center",
      textFont: MPTC_FONTS.fourly,
      strokeLine: 1,
      strokeColor: MPTC_TEXT_COLORS.black,
    },
    {
      dataKeys: ["certificate.forum", "certificate.theme"],
      text: `${applyAt}the ${certificateInfo.certificate.forum}: ${certificateInfo.certificate.theme}`,
      textSize: 47,
      textColor: MPTC_TEXT_COLORS.black,
      y: 2142,
      align: "center",
      textFont: MPTC_FONTS.fourly,
      textStyle: "bold",
    },
    {
      dataKeys: ["certificate.date", "certificate.place"],
      text: `${certificateInfo.certificate.date} at the ${certificateInfo.certificate.location}`,
      textSize: 47,
      textColor: MPTC_TEXT_COLORS.black,
      y: 2224.4,
      align: "center",
      textFont: MPTC_FONTS.fourly,
      strokeLine: 1,
      strokeColor: MPTC_TEXT_COLORS.black,
    },
    {
      dataKeys: ["certificate.signatureLunarDateKm"],
      text: `${certificateInfo.certificate.signatureLunarDateKm}`,
      textSize: 50,
      textColor: MPTC_TEXT_COLORS.black,
      y: 2410.3,
      align: "center",
      textFont: MPTC_FONTS.thirdly,
    },
    {
      dataKeys: ["certificate.locationKm"],
      text: `${certificateInfo.certificate.signatureDateKm}`,
      textSize: 50,
      textColor: MPTC_TEXT_COLORS.black,
      y: 2494.3,
      align: "center",
      textFont: MPTC_FONTS.thirdly,
    },
    {
      dataKeys: ["certificate.signatureDate"],
      text: `${certificateInfo.certificate.signatureDate}`,
      textSize: 47.5,
      textColor: MPTC_TEXT_COLORS.black,
      y: 2577.7,
      align: "center",
      textFont: MPTC_FONTS.fourly,
      strokeLine: 1,
      strokeColor: MPTC_TEXT_COLORS.black,
    },
  ];

  const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  for (const text of MPTC_TEXTS) {
    if (text.length > 0) {
      for (const index in text) {
        const textItem = text[index];
        let lastItem;
        if (index > 0) lastItem = text[index - 1];

        if (!textItem.x) {
          const lastFont = resolveFont(
            MPTC_FONTS.khmerOsMoulLight,
            24,
            lastItem
          );
          ctx.font = lastFont;
          const lastItemMetric = ctx.measureText(lastItem.text);
          textItem.x = lastItem.x + lastItemMetric.width + textItem.addX;
        }

        if (!textItem.y) textItem.y = lastItem.y;

        drawTextItem(
          canvas,
          ctx,
          textItem,
          MPTC_FONTS.khmerOsMoulLight,
          certificateInfo
        );
      }
    } else
      drawTextItem(
        canvas,
        ctx,
        text,
        MPTC_FONTS.khmerOsMoulLight,
        certificateInfo
      );
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 1920, 2880, 300);
  }
  return canvas;
}

const drawTextItem = (canvas, ctx, textItem, FONTS, certificateInfo) => {
  if (textItem.dataKeys && textItem.dataKeys.length > 0) {
    for (const key of textItem.dataKeys)
      textItem.text = textItem.text.replace(
        `{${key}}`,
        _.get(certificateInfo, key, "")
      );
  }

  drawText(canvas, ctx, textItem.text, {
    x: textItem.x,
    y: textItem.y,
    textColor: textItem.textColor || "#0033ff",
    align: textItem.align,
    font: resolveFont("Khmer OS Battambang", 24, textItem),
    strokeLine: textItem.strokeLine,
    strokeColor: textItem.textColor,
    textMaxWidth: textItem.textMaxWidth,
    textWidth: textItem.textWidth,
  });
};

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
