import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, drawWrapTexts } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createMptcCamSpeakerCertificate(
  certificateInfo = {},
  qrcodeContent
) {
  const MPTC_TEXT_COLORS = {
    black: "#060606",
    blue: "#02418e",
  };

  const MPTC_FONTS = {
    primary: "Kantumruy Pro",
    secondary: "Times New Roman",
  };
  const MPTC_TEMPLATE_IMAGE = "mptc-cam-2024.jpg";

  const MPTC_TEXTS = [
    {
      dataKeys: ["recipient.nameKm"],
      text: "{recipient.nameKm}",
      textSize: 60,
      textColor: MPTC_TEXT_COLORS.blue,
      textStyle: "bold",
      y: 1444.3,
      align: "center",
      textFont: MPTC_FONTS.primary,
    },
    {
      dataKeys: ["recipient.roleKm"],
      text: "",
      textSize: 60,
      textColor: MPTC_TEXT_COLORS.black,
      y: 1547.3,
      align: "center",
      textFont: MPTC_FONTS.primary,
      textStyle: "600",
    },
    {
      dataKeys: ["recipient.name"],
      text: "{recipient.name}",
      textSize: 60,
      textColor: MPTC_TEXT_COLORS.blue,
      textStyle: "bold",
      y: 1956.7,
      align: "center",
      textFont: MPTC_FONTS.primary,
    },
    {
      dataKeys: ["recipient.role"],
      text: "",
      textSize: 60,
      textColor: MPTC_TEXT_COLORS.black,
      y: 2052.7,
      align: "center",
      textFont: MPTC_FONTS.primary,
      textStyle: "600",
    },
    {
      dataKeys: ["certificate.ministerSignatureLunarDateKm"],
      text: "{certificate.ministerSignatureLunarDateKm}",
      textSize: 60,
      textColor: MPTC_TEXT_COLORS.black,
      y: 2398,
      align: "center",
      textFont: MPTC_FONTS.primary,
      textStyle: "600",
    },
    {
      dataKeys: ["certificate.ministerSignatureDateKm"],
      text: "{certificate.ministerSignatureDateKm}",
      textSize: 60,
      textColor: MPTC_TEXT_COLORS.black,
      y: 2492.1,
      align: "center",
      textFont: MPTC_FONTS.primary,
      textStyle: "600",
    },
    {
      dataKeys: ["certificate.ministerSignatureDate"],
      text: "{certificate.ministerSignatureDate}",
      textSize: 60,
      textColor: MPTC_TEXT_COLORS.black,
      y: 2591.3,
      align: "center",
      textFont: MPTC_FONTS.primary,
      textStyle: "600",
    },
  ];

  const type = _.get(certificateInfo, "certificate.type");

  if (type === "panelist") {
    MPTC_TEXTS[1].text = "ដែលបានចូលរួមជាវាគ្មិនកិច្ចពិភាក្សាក្នុង";
    MPTC_TEXTS[3].text =
      "For their invaluable contribution as a Panelist at the";
  }
  if (type === "speaker") {
    MPTC_TEXTS[1].text = "ដែលបានចូលរួមជាវាគ្មិនក្នុងកម្មវិធីបណ្ដុះបណ្ដាលស្ដីពី";
    MPTC_TEXTS[3].text =
      "In recognition of their invaluable contribution as a Speaker for the";
  }
  if (type === "oc") {
    MPTC_TEXTS[1].text = "ដែលបានចូលរួមជាអ្នកផ្ដួចផ្ដើម និងរៀបចំ";
    MPTC_TEXTS[3].text =
      "For their invaluable service as the Organizing Committee that launched the";
  }
  if (type === "partner") {
    MPTC_TEXTS[1].text = "ដែលបានចូលរួមជាដៃគូសហការក្នុង";
    MPTC_TEXTS[3].text =
      "In recognition of their invaluable Partnership in the";
  }
  if (type === 'keynote_speaker') {
    MPTC_TEXTS[1].text = "ដែលបានចូលរួមជាវាគ្មិនក្នុង";
    MPTC_TEXTS[3].text =
      "For their invaluable contribution as a Keynote Speaker at the";
  }

  const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  drawWrapTexts(ctx, {
    top: 1630,
    left: 0,
    width: 2480,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: "\u201C",
        fontSize: 70,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "600",
      },
      {
        dataKeys: ["certificate.themeKm"],
        text: certificateInfo.certificate.themeKm,
        fontSize: 60,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "600",
      },
      {
        text: "\u201D",
        fontSize: 70,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "600",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 1725.8,
    left: 0,
    width: 2480,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        dataKeys: ["certificate.dateKm"],
        text: certificateInfo.certificate.dateKm,
        fontSize: 60,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "600",
      },
      {
        dataKeys: ["certificate.locationKm"],
        text:
          certificateInfo.certificate.locationKm === ""
            ? ``
            : ` នៅ${certificateInfo.certificate.locationKm}`,
        fontSize: 60,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "600",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 2130,
    left: 0,
    width: 2480,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        text: "\u201C",
        fontSize: 70,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "600",
      },
      {
        dataKeys: ["certificate.theme"],
        text: certificateInfo.certificate.theme,
        fontSize: 60,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "600",
      },
      {
        text: "\u201D",
        fontSize: 70,
        fontFamily: MPTC_FONTS.secondary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "600",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 2225.2,
    left: 0,
    width: 2480,
    textAlignment: "center",
    lineHeight: 1,
    spans: [
      {
        dataKeys: ["certificate.date"],
        text: certificateInfo.certificate.date,
        fontSize: 60,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "600",
      },
      {
        dataKeys: ["certificate.location"],
        text:
          certificateInfo.certificate.location === ""
            ? ``
            : ` in ${certificateInfo.certificate.location}`,
        fontSize: 60,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "600",
      },
    ],
  }).draw();
  // Draw Caption

  for (const text of MPTC_TEXTS) {
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
      textColor: text.textColor || "#000000",
      align: text.align,
      font: resolveFont(MPTC_FONTS.primary, 24, text),
      strokeLine: text.strokeLine,
    });
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 2001, 2972.4, 270);
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
