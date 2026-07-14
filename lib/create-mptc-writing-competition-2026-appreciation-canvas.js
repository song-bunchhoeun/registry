import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, drawWrapTexts } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createMptcWrtingCompetitionAppreciationCanvas(
  certificateInfo = {},
  qrcodeContent,
) {
  const MPTC_TEXT_COLORS = {
    black: "#000005",
    blue: "#004282",
    // black: "#f000f0",
    // blue: "#f000f0",
  };

  const MPTC_FONTS = {
    khmerDigitalMax: "Khmer Digital Max",
    siemreap: "Khmer OS Siemreap",
  };

  const MPTC_TEMPLATE_IMAGE =
    "mptc-certificate-writting-competition-appreciation.jpg";

  const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  const nameKm = certificateInfo.recipient.nameKm.split(" ");
  const positionKm = certificateInfo.recipient.positionKm;
  const provinceKm = certificateInfo.recipient.provinceKm;
  const programKm = certificateInfo.certificate.programKm;

  // Name
  drawWrapTexts(ctx, {
    top: 1587,
    left: 0,
    width: 2480,
    textAlignment: "center",
    lineHeight: 2.2,
    spans: [
      {
        text: "សូមសំដែងការកោតសរសើរជូនចំពោះ" + nameKm[0] + " ",
        fontSize: 50,
        fontFamily: MPTC_FONTS.khmerDigitalMax,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "normal",
      },
      {
        text: nameKm.length > 1 ? nameKm.slice(1).join(" ") : "",
        fontSize: 53,
        fontFamily: MPTC_FONTS.khmerDigitalMax,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "normal",
      },
    ],
  }).draw();

  // Poistion and province
  drawWrapTexts(ctx, {
    top: 1704,
    left: 0,
    width: 2480,
    textAlignment: "center",
    lineHeight: 2.2,
    spans: [
      {
        text: `${positionKm} ${provinceKm} និងសហការីទាំងអស់`,
        fontSize: 50,
        fontFamily: MPTC_FONTS.khmerDigitalMax,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: "normal",
      },
    ],
  }).draw();

  // Province Program
  drawWrapTexts(ctx, {
    top: 1922,
    left: 0,
    width: 2480,
    textAlignment: "center",
    lineHeight: 2.2,
    spans: [
      {
        text: "ក្នុង",
        fontSize: 59,
        fontFamily: MPTC_FONTS.siemreap,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "normal",
      },
      {
        text: ` ${provinceKm} `,
        fontSize: 59,
        fontFamily: MPTC_FONTS.siemreap,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "bold",
      },
      {
        text: `អំពីកម្មវិធី${programKm}។`,
        fontSize: 59,
        fontFamily: MPTC_FONTS.siemreap,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "normal",
      },
    ],
  }).draw();

  // Province
  drawWrapTexts(ctx, {
    top: 2058,
    left: 0,
    width: 2480,
    textAlignment: "center",
    lineHeight: 2.2,
    spans: [
      {
        text: "ការបំពេញភារកិច្ចដោយយកចិត្តទុកដាក់នេះបានធ្វើឱ្យ",
        fontSize: 59,
        fontFamily: MPTC_FONTS.siemreap,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "normal",
      },
      {
        text: ` ${provinceKm} `,
        fontSize: 59,
        fontFamily: MPTC_FONTS.siemreap,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "bold",
      },
      {
        text: `ជាខេត្តមួយក្នុងចំណោម`,
        fontSize: 59,
        fontFamily: MPTC_FONTS.siemreap,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: "normal",
      },
    ],
  }).draw();

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 1923, 2881, 297);
  }
  return canvas;
}

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
