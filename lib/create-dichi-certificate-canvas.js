import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createDichiAppreciationCertificateCanvas(
  certificateInfo = {},
  qrcodeContent
) {
  const MPTC_TEXT_COLORS = {
    black: "#000",
  };

  const MPTC_FONTS = {
    primary: "Poppins",
  };

  const DACHI_TEMPLATE_IMAGE = {
    certificate: "certificate-dachi-completion.jpg",
    partner: "certificate-dachi-appreciation-partners.jpg",
    appreciation: "certificate-dachi-appreciation-trainers.jpg",
  };

  const FINAL_TEMPLATE_IMAGE =
    certificateInfo.certificate.type === "partner"
      ? DACHI_TEMPLATE_IMAGE.partner
      : certificateInfo.certificate.type === "appreciation"
      ? DACHI_TEMPLATE_IMAGE.appreciation
      : DACHI_TEMPLATE_IMAGE.certificate;

  const MPTC_TEXTS =
    certificateInfo.certificate.type !== "partner"
      ? [
          {
            dataKeys: ["recipient.name"],
            text: "{recipient.name}",
            textSize: 132,
            textColor: MPTC_TEXT_COLORS.black,
            y: 1167,
            align: "center",
            textFont: MPTC_FONTS.primary,
          },
        ]
      : [];

  const bg = await createTemplateImage(FINAL_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

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
      textColor: text.textColor || MPTC_TEXT_COLORS.black,
      align: text.align,
      font: resolveFont(MPTC_FONTS.primary, 24, text),
    });
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 2916, 1608, 320);
  }

  // draw profile photo
  const newWidth = 1050;
  const newHeight = 380;
  const profileX = (canvas.width - newWidth) / 2;
  const profileY = 960;

  if (certificateInfo.certificate.type == "partner") {
    if (certificateInfo.recipient.photoBase64) {
      const profileImage = await loadImage(
        certificateInfo.recipient.photoBase64
      );
      if (profileImage) {
        const imgAspect = profileImage.width / profileImage.height;
        const targetAspect = newWidth / newHeight;

        let drawWidth, drawHeight;

        if (imgAspect > targetAspect) {
          drawWidth = newWidth;
          drawHeight = newWidth / imgAspect;
        } else {
          drawHeight = newHeight;
          drawWidth = newHeight * imgAspect;
        }

        const offsetX = (newWidth - drawWidth) / 2;
        const offsetY = (newHeight - drawHeight) / 2;

        ctx.drawImage(
          profileImage,
          profileX + offsetX,
          profileY + offsetY,
          drawWidth,
          drawHeight
        );
      }
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
