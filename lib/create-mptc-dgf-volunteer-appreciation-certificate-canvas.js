import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createMPTCDGFVolunteerAppreciationCertificateCanvas(
  certificateInfo = {},
  qrcodeContent
) {
  const MPTC_TEXT_COLORS = {
    black: "#000000",
  };

  const MPTC_FONTS = {
    muolLight: "Khmer Digital Max",
    khmerDigital: "Khmer Digital",
  };

  const name = _.get(certificateInfo, "recipient.name", "").toUpperCase();

  const role = _.get(certificateInfo, "certificate.role", "").toLowerCase();

  const MPTC_TEMPLATE_IMAGE =
    role === "volunteer"
      ? "mptc-dgf-2025-volunteer.jpg"
      : "mptc-dgf-2025-organize.jpg";

  const MPTC_TEXTS = [
    {
      dataKeys: ["recipient.titleKm", "recipient.nameKm"],
      text: "{recipient.titleKm} {recipient.nameKm}",
      textSize: 59,
      textColor: MPTC_TEXT_COLORS.black,
      y: 1003,
      x: role === "volunteer" ? 820 : 889,
      align: "center",
      textFont: MPTC_FONTS.muolLight,
    },
    {
      dataKeys: ["recipient.title", "recipient.name"],
      text: "{recipient.title} " + name,
      textSize: 58,
      textColor: MPTC_TEXT_COLORS.black,
      y: 1003,
      x: role === "volunteer" ? 2473 : 2528,
      align: "center",
      textFont: MPTC_FONTS.khmerDigital,
      textStyle: "bold",
    },
  ];

  const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  for (const text of MPTC_TEXTS) {
    if (text.text === null) continue;

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
      textColor: text.textColor || MPTC_TEXT_COLORS.black,
      align: text.align,
      font: resolveFont(MPTC_FONTS.muolLight, 24, text),
    });
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 2730, 1731, 323);
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
