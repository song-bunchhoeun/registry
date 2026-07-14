import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import {
  createTemplateImage,
  loadRemoteResource,
  drawWrapTexts,
  drawText,
  drawPreview,
  drawSpaceWrapTexts,
} from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createMOTChinaAccreditedCertificateCanvas(
  certificateInfo = {},
  qrcodeContent,
  preview,
) {
  const MOT_TEXT_COLORS = {
    gold: "#BFAC0E",
    brown: "#6B2803",
  };

  const MOT_FONTS = {
    muol_light: "Khmer OS Muol Light",
    myriad_pro: "Myriad Pro",
    heiti_std: "Adobe Heiti Std",
    khmer_os_siemreap: "Khmer OS Siemreap",
  };

  const MOT_TEMPLATE_IMAGE = "mot-china-ready-certificate-background.jpg";

  let MOT_TEXTS = [
    {
      dataKeys: ["certificate.ministerSignatureLunarDateKm"],
      text: "{certificate.ministerSignatureLunarDateKm}",
      textSize: 50,
      textColor: MOT_TEXT_COLORS.brown,
      textFont: MOT_FONTS.khmer_os_siemreap,
      align: "center",
      y: 1631,
      //   x: 3335,
      x: 2598.5,
    },
    {
      dataKeys: ["certificate.ministerSignatureDateKm"],
      text: "{certificate.ministerSignatureDateKm}",
      textSize: 50,
      textColor: MOT_TEXT_COLORS.brown,
      textFont: MOT_FONTS.khmer_os_siemreap,
      align: "center",
      y: 1732.5,
      //   x: 3335,
      x: 2598.5,
    },
  ];

  let MOT_TOP_TEXTS = [
    {
      dataKeys: ["certificate.serviceKm"],
      text: `ក្រសួងទេសចរណ៍សូមបញ្ជាក់ថា ${certificateInfo.certificate.serviceKm}`,
      textSize: 57,
      textFont: MOT_FONTS.muol_light,
      align: "center",
    },
    {
      dataKeys: ["recipient.companyNameKm"],
      text: `${certificateInfo.recipient.companyNameKm}`,
      textSize: 70,
      textFont: MOT_FONTS.muol_light,
      align: "center",
    },
    {
      dataKeys: ["recipient.companyName"],
      text: `${certificateInfo.recipient.companyName}`,
      textSize: 84,
      textFont: MOT_FONTS.myriad_pro,
      align: "center",
    },
  ];

  const getTextMaxWidth = (ctx, textItem) => {
    ctx.font = resolveFont(textItem.textFont, 24, textItem);
    const kmTargetMatric = ctx.measureText(textItem.text);
    return kmTargetMatric;
  };

  const bg = await createTemplateImage(MOT_TEMPLATE_IMAGE);
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
      fontSize -= 0.1;
      getTextWidth = getTextMaxWidth(ctx, {
        ...dataItem,
        textSize: fontSize,
      });
    }
    return fontSize;
  };

  const companyNameKmWrapped = drawSpaceWrapTexts(ctx, {
    top: 1139.5,
    left: 130,
    width: 1614,
    textAlignment: "center",
    lineHeight: 1.78,
    spans: [
      {
        dataKeys: ["recipient.companyNameKm"],
        text: certificateInfo.recipient.companyNameKm,
        fontSize: 70,
        fontFamily: MOT_FONTS.muol_light,
        fillStyle: MOT_TEXT_COLORS.gold,
      },
    ],
  });

  //   companyNameKmWrapped.draw();
  let currentY = 1139.5 + companyNameKmWrapped.height();
  currentY += 70;

  const bottomTextKm = drawWrapTexts(ctx, {
    // top: currentY /* enable this for drop line */,
    top: 1229.5 /* enable this for adjust font size */,
    left: 130,
    width: 1614,
    textAlignment: "center",
    lineHeight: 1.78,
    spans: [
      {
        text: "បានបំពេញលក្ខខណ្ឌដូចមានចែងក្នុង\n",
        fontSize: 57,
        fontFamily: MOT_FONTS.muol_light,
        fillStyle: MOT_TEXT_COLORS.brown,
      },
      {
        text: "ស្ដង់ដាវាយតម្លៃគុណភាពរបស់កម្ពុជាសម្រាប់សេវាកម្ម\n",
        fontSize: 57,
        fontFamily: MOT_FONTS.muol_light,
        fillStyle: MOT_TEXT_COLORS.brown,
      },
      {
        text: `ទេសចរណ៍ត្រៀមទទួលភ្ញៀវទេសចរចិន`,
        fontSize: 57,
        fontFamily: MOT_FONTS.muol_light,
        fillStyle: MOT_TEXT_COLORS.brown,
      },
      {
        text: `(China Ready)\n`,
        fontSize: 57,
        fontWeight: "bold",
        fontFamily: MOT_FONTS.muol_light,
        fillStyle: MOT_TEXT_COLORS.brown,
      },
      {
        dataKeys: ["certificate.expiredDateKm", "certificate.type"],
        text: `មានសុពលភាពដល់${certificateInfo.certificate.expiredDateKm} ${certificateInfo.certificate.type === "new" ? "(ថ្មី)" : "(បន្ត)"}`,
        fontSize: 59,
        fontFamily: MOT_FONTS.muol_light,
        fillStyle: MOT_TEXT_COLORS.brown,
      },
    ],
  });

  bottomTextKm.draw();

  const topTextZh = drawWrapTexts(ctx, {
    top: 1012.5,
    left: 1825,
    width: 1547,
    textAlignment: "center",
    lineHeight: 1.54,
    spans: [
      {
        text: `旅游部证明`,
        fontSize: 80,
        fontFamily: MOT_FONTS.heiti_std,
        fillStyle: MOT_TEXT_COLORS.brown,
        fontWeight: "bold",
      },
    ],
  });

  topTextZh.draw();
  let currentZhY = 1012.5 + topTextZh.height();
  currentZhY += 50;

  const companyNameZhWrapped = drawSpaceWrapTexts(ctx, {
    top: currentZhY,
    left: 1825,
    width: 1547,
    textAlignment: "center",
    lineHeight: 1.54,
    spans: [
      {
        dataKeys: ["recipient.companyName"],
        text: `${certificateInfo.recipient.companyName}`,
        fontSize: 84,
        fontFamily: MOT_FONTS.heiti_std,
        fillStyle: MOT_TEXT_COLORS.gold,
      },
    ],
  });

  //   companyNameZhWrapped.draw();
  currentZhY += companyNameZhWrapped.height();
  currentZhY += 50;

  const bottomTextZh = drawWrapTexts(ctx, {
    // top: currentZhY /* enable this for drop line */,
    top: 1229.5 /* enable this for adjust font size */,
    left: 1825,
    width: 1547,
    textAlignment: "center",
    lineHeight: 1.54,
    spans: [
      {
        text: `已符合接待中国游客标准(China Ready)\n`,
        fontSize: 80,
        fontFamily: MOT_FONTS.heiti_std,
        fillStyle: MOT_TEXT_COLORS.brown,
        fontWeight: "bold",
      },
      {
        dataKeys: ["certificate.expiredDateZh"],
        text: `此证书有效至${certificateInfo.certificate.expiredDateZh}\n`,
        fontSize: 80,
        fontFamily: MOT_FONTS.heiti_std,
        fillStyle: MOT_TEXT_COLORS.brown,
        fontWeight: "bold",
      },
    ],
  });

  bottomTextZh.draw();

  const topTextFontSize = adjustFontSize(ctx, MOT_TOP_TEXTS[0], 1614);
  const companyNameKmFontSize = adjustFontSize(ctx, MOT_TOP_TEXTS[1], 1614);
  const companyNameFontSize = adjustFontSize(ctx, MOT_TOP_TEXTS[2], 1547);

  MOT_TOP_TEXTS = [
    {
      dataKeys: ["certificate.serviceKm"],
      text: `ក្រសួងទេសចរណ៍សូមបញ្ជាក់ថា ${certificateInfo.certificate.serviceKm}`,
      textSize: topTextFontSize,
      textColor: MOT_TEXT_COLORS.brown,
      textFont: MOT_FONTS.muol_light,
      align: "center",
      y: 1012.5,
      x: 932,
    },
    {
      dataKeys: ["recipient.companyNameKm"],
      text: `${certificateInfo.recipient.companyNameKm}`,
      textSize: companyNameKmFontSize,
      textColor: MOT_TEXT_COLORS.gold,
      textFont: MOT_FONTS.muol_light,
      align: "center",
      y: 1120.5,
      x: 932,
    },
    {
      dataKeys: ["recipient.companyName"],
      text: `${certificateInfo.recipient.companyName}`,
      textSize: companyNameFontSize,
      textColor: MOT_TEXT_COLORS.gold,
      textFont: MOT_FONTS.myriad_pro,
      align: "center",
      y: 1120.5,
      x: 2598.5,
    },
  ];

  MOT_TEXTS = [...MOT_TEXTS, ...MOT_TOP_TEXTS];

  for (const text of MOT_TEXTS) {
    if (text.dataKeys && text.dataKeys.length > 0) {
      for (const key of text.dataKeys)
        text.text = text.text.replace(
          `{${key}}`,
          _.get(certificateInfo, key, ""),
        );
    }

    drawText(canvas, ctx, text.text, {
      y: text.y,
      x: text.x,
      textColor: text.textColor || AUPP_TEXT_COLORS.black,
      align: text.align,
      font: resolveFont(MOT_FONTS.muol_light, 24, text),
    });
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 683, 1835.2, 387);
  } else {
    const qrBlank = await loadImage(
      path.join(process.cwd(), "assets", "qr-bg-v2.png"),
    );
    if (qrBlank) {
      ctx.drawImage(qrBlank, 683, 1835.2, 387, 477.3);
    }
  }
  if (preview === true || preview === "true") {
    drawPreview(canvas, ctx, {
      rotate: -45,
      color: "#DCDCDC",
      text: "Preview",
      fontSize: "400",
      fontFamily: certificateInfo.previewFontFamily,
    });
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
