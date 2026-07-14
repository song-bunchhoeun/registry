import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, drawWrapTexts } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";


export async function createCpfacPermitRegister(
  certificateInfo = {}
) {
  const CPFAC_TEXT_COLORS = {
    black: "#000000",
    // red: "#f00000",
  };

  const CPFAC_FONTS = {
    angDaunKeo: "Ang DaunTeav",
    khmerMool: "Khmer Mool1",
    time: "Times New Roman",
  };
  const CPFAC_TEMPLATE = "cpfac-background.jpg";

  let CPFAC_TEXTS = [
  {
      dataKeys: [""],
      text: "លេខ :.......................ចផ",
      textSize: 45,
      textStyle: "normal",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.angDaunKeo,
      x: 178.4,
      y: 724.5,
      align: "left",
    },
    {
      dataKeys: ["recipient.decisionLetterIssuedNumber"],
      text: "{recipient.decisionLetterIssuedNumber}",
      textSize: 45,
      textStyle: "normal",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.angDaunKeo,
      x: 290,
      y: 718,
      align: "left",
    },
    {
      dataKeys: ["recipient.issuedLunarDateKm"],
      text: "{recipient.issuedLunarDateKm}",
      textSize: 45,
      textStyle: "normal",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.angDaunKeo,
      x: 1890,
      y: 728.5,
      align: "center",
    },
    {
      dataKeys: ["recipient.issuedDateKm"],
      text: "រាជធានីភ្នំពេញ {recipient.issuedDateKm}",
      textSize: 45,
      textStyle: "normal",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.angDaunKeo,
      x: 1890,
      y: 806.5,
      align: "center",
    },
    {
      dataKeys: [""],
      text: "សេចក្ដីសម្រេច",
      textSize: 60,
      textStyle: "normal",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.khmerMool,
      x: 1225,
      y: 870,
      align: "center",
      letterSpacing: -1
    },
    {
      dataKeys: [""],
      text: "ស្តីពី",
      textSize: 56,
      textStyle: "normal",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.khmerMool,
      x: 1223,
      y: 962,
      align: "center",
      letterSpacing: -1
    },
    {
      dataKeys: [""],
      text: "ការចុះឈ្មោះផលិតផលក្នុងបញ្ជីសមាគម",
      textSize: 52,
      textStyle: "normal",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.khmerMool,
      x: 1223,
      y: 1047.6,
      align: "center",
      letterSpacing: -1
    },
    // References
    {
      dataKeys: [""],
      text: "យោង  :",
      textSize: 46,
      textStyle: "normal",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.khmerMool,
      x: 181,
      y: 1157,
      align: "left",
    },
    {
      dataKeys: [""],
      text: "- រដ្ឋធម្មនុញ្ញ នៃព្រះរាជាណាចក្រកម្ពុជា",
      textSize: 46,
      textStyle: "normal",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.angDaunKeo,
      x: 404,
      y: 1157,
      align: "left",
    },
    {
      dataKeys: [""],
      text: "- លក្ខន្តិកៈ និងបទបញ្ជាផ្ទៃក្នុងរបស់សមាគមសហព័ន្ធការពារអ្នកប្រើប្រាស់នៅកម្ពុជា",
      textSize: 46,
      textStyle: "normal",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.angDaunKeo,
      x: 404,
      y: 1583,
      align: "left",
    },
    {
      dataKeys: ["recipient.iscLicenseNumberKm", "recipient.iscLicenseDateKm"],
      text: "- អាជ្ញាបណ្ណលេខ {recipient.iscLicenseNumberKm} ចុះ{recipient.iscLicenseDateKm} របស់វិទ្យាស្ថានស្ដង់ដារកម្ពុជា",
      textSize: 45.5,
      textStyle: "normal",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.angDaunKeo,
      x: 404,
      y: 1653,
      align: "left",
    },
    {
      dataKeys: [""],
      text: "គណៈអចិន្ត្រៃយ៍សមាគមសហព័ន្ធការពារអ្នកប្រើប្រាស់នៅកម្ពុជា",
      textSize: 50,
      textStyle: "normal",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.khmerMool,
      x: 1243,
      y: 1804.2,
      align: "center",
    },
    {
      dataKeys: [""],
      text: "សម្រេច",
      textSize: 55,
      textStyle: "normal",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.khmerMool,
      x: 1243,
      y: 1893,
      align: "center",
    },
    {
      dataKeys: [""],
      text: "ប្រការ១.",
      textSize: 46,
      textStyle: "normal",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.khmerMool,
      x: 181,
      y: 1986,
      align: "left",
    },
    {
      dataKeys: [""],
      text: "~",
      textSize: 45,
      textStyle: "normal",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.time,
      x: 334.7,
      y: 1993,
      align: "left",
    },
    {
      dataKeys: [""],
      text: "សញ្ញាចុះបញ្ជីផលិតផល/Registration Mark       :",
      textSize: 53,
      textStyle: "bold",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.angDaunKeo,
      x: 446,
      y: 2165,
      align: "left",
    },
    // Product Info
    {
      dataKeys: ["product.registrationMark"],
      text: "{product.registrationMark}",
      textSize: 53,
      textStyle: "bold",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.angDaunKeo,
      x: 1445.2,
      y: 2165,
      align: "left",
    },
    {
      dataKeys: [""],
      text: "លេខកូដផលិតផល/Product Code                     :",
      textSize: 53,
      textStyle: "bold",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.angDaunKeo,
      x: 446,
      y: 2262.3,
      align: "left",
    },
    {
      dataKeys: ["product.productCode"],
      text: "{product.productCode}",
      textSize: 53,
      textStyle: "bold",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.angDaunKeo,
      x: 1444.5,
      y: 2262.3,
      align: "left",
    },
    {
      dataKeys: [""],
      text: "ផលិតផល/Product                                            :",
      textSize: 53,
      textStyle: "bold",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.angDaunKeo,
      x: 446,
      y: 2361.4,
      align: "left",
    },
  ];

  const bg = await createTemplateImage(CPFAC_TEMPLATE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

  drawWrapTexts(ctx, {
    top: 1230,
    left: 404,
    width: 1924,
    textAlignment: "left",
    lineHeight: 1.5,
    spans: [
      {
        text: "- ",
        fontSize: 45,
        fontFamily: CPFAC_FONTS.angDaunKeo,
        fillStyle: CPFAC_TEXT_COLORS.black,
        fontWeight: "normal",
      },
      {
        text: "ព្រះរាជក្រមលេខ នស/រកម/០៨១៥/០១០ ចុះថ្ងៃទី១២ ខែសីហា ឆ្នាំ២០១៥ ដែលប្រកាសឱ្យប្រើច្បាប់ស្ដីពីសមាគម  និងអង្គការមិនមែនរដ្ឋាភិបាល",
        fontSize: 44.5,
        fontFamily: CPFAC_FONTS.angDaunKeo,
        fillStyle: CPFAC_TEXT_COLORS.black,
        fontWeight: "normal",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 1370,
    left: 404,
    width: 1924,
    textAlignment: "left",
    lineHeight: 1.6,
    spans: [
      {
        text: "- ",
        fontSize: 45,
        fontFamily: CPFAC_FONTS.angDaunKeo,
        fillStyle: CPFAC_TEXT_COLORS.black,
        fontWeight: "normal",
      },
      {
        text: "ព្រះរាជក្រមលេខ នស/រកម/១១១៩/០១៦  ចុះថ្ងៃទី០២ ខែវិច្ឆិកា ឆ្នាំ២០១៩  ច្បាប់ស្តីពីកិច្ចការពារអ្នកប្រើប្រាស់",
        fontSize: 45,
        fontFamily: CPFAC_FONTS.angDaunKeo,
        fillStyle: CPFAC_TEXT_COLORS.black,
        fontWeight: "normal",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 1440.7,
    left: 404,
    width: 1924,
    textAlignment: "left",
    lineHeight: 1.6,
    spans: [
      {
        text: "- ",
        fontSize: 45,
        fontFamily: CPFAC_FONTS.angDaunKeo,
        fillStyle: CPFAC_TEXT_COLORS.black,
        fontWeight: "normal",
      },
      {
        text: "ប្រកាសលេខ ០០១ ប្រក ចុះថ្ងៃទី០២ ខែមករា ឆ្នាំ២០២០ ស្តីពីការចុះឈ្មោះសមាគមសហព័ន្ធការពារអ្នកប្រើប្រាស់\n  នៅកម្ពុជា  ក្នុងបញ្ជីសមាគម នៅក្រសួងមហាផ្ទៃ",
        fontSize: 45,
        fontFamily: CPFAC_FONTS.angDaunKeo,
        fillStyle: CPFAC_TEXT_COLORS.black,
        fontWeight: "normal",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 1724.3,
    left: 404,
    width: 1924,
    textAlignment: "left",
    lineHeight: 1.6,
    spans: [
      {
        dataKeys: ['recipient.iscLicenseDateKm'],
        text: `- ពាក្យស្នើសុំ ចុះ${certificateInfo.recipient.iscLicenseDateKm} របស់ `,
        fontSize: 45,
        fontFamily: CPFAC_FONTS.angDaunKeo,
        fillStyle: CPFAC_TEXT_COLORS.black,
        fontWeight: "normal",
      },
      {
        dataKeys: ['recipient.companyNameKm'],
        text: `ក្រុមហ៊ុន ${certificateInfo.recipient.companyNameKm}`,
        fontSize: 45,
        fontFamily: CPFAC_FONTS.angDaunKeo,
        fillStyle: CPFAC_TEXT_COLORS.black,
        fontWeight: "bold",
      },
    ],
  }).draw();

  drawWrapTexts(ctx, {
    top: 1986,
    left: 380.6,
    width: 1830,
    textAlignment: "left",
    lineHeight: 1.81,
    spans: [
      {
        text: `ត្រូវបានចុះឈ្មោះ`,
        fontSize: 46,
        fontFamily: CPFAC_FONTS.angDaunKeo,
        fillStyle: CPFAC_TEXT_COLORS.black,
        fontWeight: "normal",
      },
      {
        dataKeys: ['recipient.companyName'],
        text: `ផលិតផលរបស់ ក្រុមហ៊ុន ${certificateInfo.recipient.companyNameKm} (${certificateInfo.recipient.companyName}) `,
        fontSize: 45,
        fontFamily: CPFAC_FONTS.angDaunKeo,
        fillStyle: CPFAC_TEXT_COLORS.black,
        fontWeight: "bold",
      },
      {
        text: `ក្នុងបញ្ជីសមាគមសហព័ន្ធ`,
        fontSize: 46,
        fontFamily: CPFAC_FONTS.angDaunKeo,
        fillStyle: CPFAC_TEXT_COLORS.black,
        fontWeight: "normal",
      },
      {
        text: `ការពារអ្នកប្រើប្រាស់នៅកម្ពុជា៖`,
        fontSize: 47,
        fontFamily: CPFAC_FONTS.angDaunKeo,
        fillStyle: CPFAC_TEXT_COLORS.black,
        fontWeight: "normal",
      },
    ],
  }).draw();

  const productDrawWrap = drawWrapTexts(ctx, {
    top: 2361.4,
    left: 1445.2,
    width: 854,
    textAlignment: "left",
    lineHeight: 1.80,
    spans: [
      {
        dataKeys: ["product.productName"],
        text: `${certificateInfo.product.productName} សញ្ញា `,
        fontSize: 53,
        fontFamily: CPFAC_FONTS.angDaunKeo,
        fillStyle: CPFAC_TEXT_COLORS.black,
        fontWeight: "bold",
      },
      {
        dataKeys: ["product.registrationMark"],
        text: `${certificateInfo.product.registrationMark}`,
        fontSize: 53,
        fontFamily: CPFAC_FONTS.angDaunKeo,
        fillStyle: CPFAC_TEXT_COLORS.black,
        fontWeight: "bold",
      },
    ],
  })

  const productWrapHeight = productDrawWrap.height()
  productDrawWrap.draw()

  let CPFAC_TEXTS_SECOND = [
    {
      dataKeys: [""],
      text: "ប្រការ២.",
      textSize: 46,
      textStyle: "normal",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.khmerMool,
      x: 181,
      y: 2461 + (productWrapHeight > 53 && 95),
      align: "left",
    },
    {
      dataKeys: [""],
      text: "~",
      textSize: 45,
      textStyle: "normal",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.time,
      x: 341.6,
      y: 2468 + (productWrapHeight > 53 && 95),
      align: "left",
    },
    {
      dataKeys: [""],
      text: "សម្គាល់",
      textSize: 44,
      textStyle: "normal",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.khmerMool,
      x: 212.4,
      y: 2782 + (productWrapHeight > 53 && 95),
      align: "left",
    },
    {
      dataKeys: [""],
      text: ":",
      textSize: 52,
      textStyle: "normal",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.angDaunKeo,
      x: 346.8,
      y: 2782 + (productWrapHeight > 53 && 95),
      align: "left",
    },
    {
      dataKeys: ["recipient.expirationDateKm"],
      text: "-  មានសុពលភាពដល់ : {recipient.expirationDateKm}",
      textSize: 42,
      textStyle: "normal",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.angDaunKeo,
      x: 210,
      y: 2872.2 + (productWrapHeight > 53 && 95),
      align: "left",
    },
    {
      dataKeys: ["recipient.expirationDateKm"],
      text: `ជ.គណៈអចិន្ត្រៃយ៍`,
      textSize: 52,
      textStyle: "normal",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.khmerMool,
      x: 1694,
      y: 2682 + (productWrapHeight > 53 && 95),
      align: "center",
    },
    {
      dataKeys: ["recipient.expirationDateKm"],
      text: `ប្រធាន`,
      textSize: 52,
      textStyle: "normal",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.khmerMool,
      x: 1694,
      y: 2775 + (productWrapHeight > 53 && 95),
      align: "center",
    },
    {
      dataKeys: ["recipient.expirationDateKm"],
      text: `ឧកញ៉ាសាស្ត្រាចារ្យសមូហកបណ្ឌិត ឡី សុភាព`,
      textSize: 53,
      textStyle: "normal",
      textColor: CPFAC_TEXT_COLORS.black,
      textFont: CPFAC_FONTS.khmerMool,
      x: 1807,
      y: 3110 + (productWrapHeight > 53 && 95),
      align: "center",
      letterSpacing: -1
    },
  ]

  drawWrapTexts(ctx, {
    top: 2461 + (productWrapHeight > 53 && 95),
    left: 380.6,
    width: 1970,
    textAlignment: "left",
    lineHeight: 1.81,
    spans: [
      {
        dataKeys: ['recipient.companyName'],
        text: `ក្រុមហ៊ុន ${certificateInfo.recipient.companyNameKm  } `,
        fontSize: 46,
        fontFamily: CPFAC_FONTS.angDaunKeo,
        fillStyle: CPFAC_TEXT_COLORS.black,
        fontWeight: "bold",
      },
      {
        text: `ត្រូវគោរពតាមច្បាប់ លិខិតបទដ្ឋានគតិយុត្តនានាជាធរមាន នៃព្រះរាជាណាចក្រកម្ពុជា ស្ថាប័នអង្គភាព ដែលពាក់ព័ន្ធ ព្រមទាំងលក្ខន្តិកៈ បទបញ្ជាផ្ទៃក្នុង និងរាល់សេចក្ដីសម្រេចរបស់សមាគម។`,
        fontSize: 45,
        fontFamily: CPFAC_FONTS.angDaunKeo,
        fillStyle: CPFAC_TEXT_COLORS.black,
        fontWeight: "normal",
      },
    ],
  }).draw()

  ctx.beginPath();
  ctx.strokeStyle = CPFAC_TEXT_COLORS.black
  ctx.lineWidth = 3

  ctx.moveTo(1158, 1902);
  ctx.lineTo(1325, 1902);
  ctx.stroke();

  if (productWrapHeight > 53) {
    ctx.moveTo(208, 2789 + 95);
    ctx.lineTo(357.5, 2789 + 95);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(409, 2148.5, 10, 0, 2 * Math.PI);
  ctx.fillStyle = CPFAC_TEXT_COLORS.black;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(409, 2247, 10, 0, 2 * Math.PI);
  ctx.fillStyle = CPFAC_TEXT_COLORS.black;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(409, 2346, 10, 0, 2 * Math.PI);
  ctx.fillStyle = CPFAC_TEXT_COLORS.black;
  ctx.fill();
  ctx.stroke();

  CPFAC_TEXTS = [...CPFAC_TEXTS, ...CPFAC_TEXTS_SECOND]

  // Draw Caption
  for (const text of CPFAC_TEXTS) {
    if (text.dataKeys && text.dataKeys.length > 0) {
      for (const key of text.dataKeys)
        text.text = text.text.replace(
          `{${key}}`,
          _.get(certificateInfo, key, "")
        );
    }

    drawTextWithLetterSpacing(canvas, ctx, text.text, {
      x: text.x,
      y: text.y,
      textColor: text.textColor || CPFAC_TEXT_COLORS.blue,
      align: text.align,
      font: resolveFont(CPFAC_FONTS.siemReap, 24, text),
      letterSpacing: text.letterSpacing,
    });
  }

  // if (qrcodeangDaunKeo) {
  //   await drawQrCodeStandard(qrcodeangDaunKeo, ctx, 1946.7, 3029, 320);
  // }

  return canvas;
}

export async function drawQrCodeStandard(
  qrcodeangDaunKeo,
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
  const qrcodeBuffer = await QRCode.toBuffer(qrcodeangDaunKeo, {
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

export function drawTextWithLetterSpacing(canvas, ctx, text, options) {
  if (!options.letterSpacing) return drawText(canvas, ctx, text, options);

  ctx.font = options.font || "12px Arial, sans-serif";
  ctx.fillStyle = options.textColor || "black";

  if ("letterSpacing" in ctx) {
    const orig = ctx.letterSpacing;
    ctx.letterSpacing = `${options.letterSpacing}px`;
    drawText(canvas, ctx, text, options);
    ctx.letterSpacing = orig;
    return;
  }

  const chars = Array.from(new Intl.Segmenter("km", { granularity: "grapheme" }).segment(text)).map(s => s.segment);
  const widths = chars.map(c => ctx.measureText(c).width);
  const totalW = widths.reduce((sum, w) => sum + w, 0) + (chars.length - 1) * options.letterSpacing;

  let x = options.x || 0;
  if (options.align === "center") x = (options.x || canvas.width / 2) - totalW / 2;
  else if (options.align === "right") x = (options.x || canvas.width) - totalW;
  else if (options.align === "left") x += options.margin || 0;

  chars.forEach((char, i) => {
    ctx.fillText(char, x, options.y);
    if (options.strokeLine) {
      ctx.lineWidth = options.strokeLine;
      ctx.strokeStyle = options.strokeColor;
      ctx.strokeText(char, x, options.y);
    }
    x += widths[i] + options.letterSpacing;
  });
}
