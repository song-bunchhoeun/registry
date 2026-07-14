import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, loadRemoteResource } from "./shared";
import QRCode from "qrcode";
import _, { add } from "lodash";

export async function createDGCGovTeachCertificateCanvas(
  certificateInfo = {},
  qrcodeContent
) {
  const { BACKGROUND, FONTS, TEXTS, QRCODE } = {
    BACKGROUND: {
      pngFilename: "dgc-govtech-certificate-appreciation.jpg",
      width: 2480,
      height: 3508,
    },
    FONTS: [{ name: "Kantumruy Pro" }],
    TEXTS: [],
    QRCODE: { width: 1996, height: 2973, x: 0, y: 0 },
  };

  const presentToKm = [
    {
      key: "recipient.positionKm",
      dataKeys: ["recipient.positionKm"],
      text: "{recipient.positionKm}",
      textSize: 54,
      textColor: "#003399",
      textStyle: "700", // bold
      x: 1240,
      y: 1450,
      align: "center",
    },
    {
      key: "recipient.nameKm",
      dataKeys: ["recipient.nameKm"],
      text: "{recipient.nameKm}",
      textSize: 54,
      textColor: "#003399",
      textStyle: "700", // bold
      x: 1240,
      y: 3000,
      align: "center",
    },
  ];

  const presentToEn = [
    {
      key: "recipient.position",
      dataKeys: ["recipient.position"],
      text: "{recipient.position}",
      textSize: 54,
      textColor: "#003399",
      textStyle: "700", //bold
      x: 1240,
      y: 2023 + 45,
      align: "center",
    },
    {
      key: "recipient.name",
      dataKeys: ["recipient.name"],
      text: "{recipient.name}",
      textSize: 54,
      textColor: "#003399",
      textStyle: "700", //bold
      x: 1240,
      y: 1951 + 45,
      align: "center",
    },
  ];

  const bg = await createTemplateImage(BACKGROUND.pngFilename);
  const canvas = createCanvas(BACKGROUND.width, BACKGROUND.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  drawTextPresentTo(
    presentToEn,
    2140,
    72,
    {
      text: "Presented to",
      textSize: 50,
      textColor: "#000000",
      textStyle: "700", //bold
      x: 1240,
      align: "center",
    },
    certificateInfo,
    canvas,
    ctx,
    FONTS
  );
  drawTextPresentTo(
    presentToKm,
    1533,
    87,
    {
      text: "ជូនចំពោះ",
      textSize: 58,
      textColor: "#000000",
      textStyle: "700", //bold
      x: 1240,
      align: "center",
    },
    certificateInfo,
    canvas,
    ctx,
    FONTS
  );

  // Draw Caption
  for (const text of TEXTS) {
    if (text.dataKeys && text.dataKeys.length > 0) {
      for (const key of text.dataKeys)
        text.text = text.text.replace(
          `{${key}}`,
          _.get(certificateInfo, key, "")
        );
    }

    if (text.text === "null" || text.text === null) continue;

    drawText(canvas, ctx, text.text, {
      x: text.x,
      y: text.y,
      textColor: text.textColor || MPTC_TEXT_COLORS.black,
      align: text.align,
      font: resolveFont(FONTS[0].name, 24, text),
    });
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 2000, 2974, 269);
  }

  // draw profile photo
  if (certificateInfo.recipient.photoUrl) {
    const profileImage = await loadRemoteResource(
      certificateInfo,
      certificateInfo.recipient.photoUrl
    );
    if (profileImage) {
      const maxImgBoxWidth = 158;
      const maxImgBoxHeight = 209;

      // get the scale
      let scale_factor = Math.min(
        maxImgBoxWidth / profileImage.width,
        maxImgBoxHeight / profileImage.height
      );

      let newWidth = profileImage.width * scale_factor;
      let newHeight = profileImage.height * scale_factor;

      const profileX = 669;
      const profileY = 646;
      ctx.drawImage(profileImage, profileX, profileY, newWidth, newHeight);
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

function new_mptc_arr(
  key,
  val,
  size,
  style,
  color,
  font,
  x_axis,
  y_axis,
  alignment
) {
  return {
    dataKeys: [key],
    text: val,
    textSize: size,
    textStyle: style,
    textColor: color,
    textFont: font,
    x: x_axis,
    y: y_axis,
    align: alignment,
  };
}

const drawTextPresentTo = (
  texts,
  initBottomPosition,
  minusNumber,
  presentText,
  certificateInfo,
  canvas,
  ctx,
  FONTS
) => {
  for (const text of texts) {
    const value = _.get(certificateInfo, text.key, "");

    if (
      text.key === "recipient.positionKm" ||
      text.key === "recipient.nameKm"
    ) {
      initBottomPosition += 15;
    }
    const longestPosition =
      "Chair of AI and Data Science Working Group, Ministry of Post and Telecommunications";

    if (text.key === "recipient.position" && value === longestPosition) {
      const positionLines = value.split(",");
      positionLines.reverse().forEach((line, index) => {
        const isLastLine = index === positionLines.length - 1;
        drawText(canvas, ctx, line.trim() + (isLastLine ? "," : ""), {
          x: text.x,
          y: initBottomPosition - 10,
          textColor: text.textColor || "#000000",
          align: text.align,
          font: resolveFont(FONTS[0].name, 24, text),
        });
        initBottomPosition -= minusNumber;
      });
    } else {
      if (value !== "null" && value !== null) {
        if (text.dataKeys && text.dataKeys.length > 0) {
          for (const key of text.dataKeys)
            text.text = text.text.replace(
              `{${key}}`,
              _.get(certificateInfo, key, "")
            );
        }

        if (text.text === "null" || text.text === null) continue;

        drawText(canvas, ctx, text.text, {
          x: text.x,
          y: initBottomPosition - 15,
          textColor: text.textColor || "#000000",
          align: text.align,
          font: resolveFont(FONTS[0].name, 24, text),
        });
        initBottomPosition -= minusNumber + 10;
      }
    }
  }
  drawText(canvas, ctx, presentText.text, {
    x: presentText.x,
    y: initBottomPosition,
    textColor: presentText.textColor || "#000000",
    align: presentText.align,
    font: resolveFont(FONTS[0].name, 24, presentText),
  });
};
