import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, loadRemoteResource } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createMoInspectionOfficialIDBackCard(
  certificateInfo = {},
  qrcodeContent,
) {
  const MOINSPECT_TEXT_COLORS = {
    white: "#FFFFFF",
  };

  const MOINSPECT_FONTS = {
    suwannaphum: "Suwannaphum",
    leelawadee: 'Leelawadee UI',
  };

  const MOINSPECT_TEMPLATE_IMAGE = "moinspection-staff-id-back.jpg";

  const expiredDateKm = _.get(certificateInfo, 'certificate.expireDateKm').split(" ");

  const MOINSPECT_TEXTS = [
    {
      dataKeys: ["certificate.expireDateKm"],
      text: `សុពលភាព ត្រឹមថ្ងៃទី${expiredDateKm[0]} ខែ${expiredDateKm[1]} ឆ្នាំ${expiredDateKm[2]}`,
      textSize: 44,
      textColor: MOINSPECT_TEXT_COLORS.white,
      textFont: MOINSPECT_FONTS.suwannaphum,
      x: 92,
      y: 2128,
      align: "left",
    },
    {
      dataKeys: ["certificate.expireDate"],
      text: "Expires on {certificate.expireDate}",
      textSize: 44,
      textColor: MOINSPECT_TEXT_COLORS.white,
      textFont: MOINSPECT_FONTS.leelawadee,
      x: 92,
      y: 2200,
      align: "left",
    }
  ];

  const getTextMaxWidth = (ctx, textItem) => {
    ctx.font = resolveFont(textItem.textFont, 24, textItem);
    const kmTargetMatric = ctx.measureText(textItem.text);
    return kmTargetMatric;
  };

  const bg = await createTemplateImage(MOINSPECT_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  for (const text of MOINSPECT_TEXTS) {
    if (text.dataKeys && text.dataKeys.length > 0) {
      for (const key of text.dataKeys)
        text.text = text.text.replace(
          `{${key}}`,
          _.get(certificateInfo, key, ""),
        );
    }

    drawText(canvas, ctx, text.text, {
      x: text.x,
      y: text.y,
      textColor: text.textColor || MOINSPECT_TEXT_COLORS.black,
      align: text.align,
      font: resolveFont(MOINSPECT_FONTS.primary, 24, text),
      strokeLine: text.strokeLine,
      strokeColor: text.strokeColor,
    });
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 627, 148, 684);
  }

  return canvas;
}

const drawTextItem = (canvas, ctx, textItem, FONTS, certificateInfo) => {
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
    textColor: textItem.textColor || "#0033ff",
    align: textItem.align,
    font: resolveFont(FONTS[0].name, 24, textItem),
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
export async function createQRCodeLogoImage() {
  const logoPath = path.join(
    process.cwd(),
    "assets",
    "certificate-bacii-qrcode-logo.png",
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
