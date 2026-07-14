import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createAUPPInnovationEcosystemMentorCompletionCertificate(
  certificateInfo = {},
  qrcodeContent
) {
  const AUPP_TEXT_COLORS = {
    black: "#000000",
    red: "#fd0505",
  };

  const AUPP_FONTS = {
    primary: "The Seasons",
  };

  const AUPP_TEMPLATE_IMAGE =
    "aupp-innovation-ecosystem-mentor-completion-certificate.jpg";
  let AUPP_TEXTS = [
    {
      dataKeys: ["recipient.name"],
      text: "{recipient.name}",
      textSize: 270,
      textFont: AUPP_FONTS.primary,
      y: 1335,
      textColor: AUPP_TEXT_COLORS.black,
      align: "center",
    },
    // {
    //   dataKeys: ["certificate.program"],
    //   text: "Is hereby awarded for successfully completing the {certificate.program}",
    //   textSize: 60,
    //   textFont: AUPP_FONTS.primary,
    //   textColor: AUPP_TEXT_COLORS.black,
    //   y: 1562,
    //   align: "center",
    // },
    // {
    //   dataKeys: ["certificate.date"],
    //   text: "held from {certificate.date} at AUPP Technology Center, Phnom nd th Penh, Cambodia",
    //   textSize: 59,
    //   textFont: AUPP_FONTS.primary,
    //   textColor: AUPP_TEXT_COLORS.black,
    //   y: 1782,
    //   align: "center",
    // },
    // {
    //   dataKeys: ["certificate.issuedDate"],
    //   text: "{certificate.issuedDate}",
    //   textSize: 59,
    //   textFont: AUPP_FONTS.primary,
    //   textColor: AUPP_TEXT_COLORS.black,
    //   y: 1926,
    //   align: "center",
    // },
  ];

  const bg = await createTemplateImage(AUPP_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  for (const text of AUPP_TEXTS) {
    if (text.dataKeys && text.dataKeys.length > 0) {
      for (const key of text.dataKeys)
        text.text = text.text.replace(
          `{${key}}`,
          _.get(certificateInfo, key, "")
        );
    }

    drawText(canvas, ctx, text.text, {
      y: text.y,
      x: text.x,
      textColor: text.textColor || AUPP_TEXT_COLORS.black,
      align: text.align,
      font: resolveFont(AUPP_FONTS.primary, 24, text),
    });
  }
  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 1594, 2015, 320);
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
