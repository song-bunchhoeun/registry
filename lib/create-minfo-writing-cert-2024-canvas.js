import { Image, createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText, loadRemoteResource } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';
export async function createMinfoWritingNews2024Certificate(certificateInfo = {}, qrcodeContent) {
  const TEXT_COLORS = {
    black: '#000000',
    blue: '#2E3192'
  };

  const TEXT_FONTS = {
    khmerOsMoulLight: "Khmer OS Muol Light",
    KhmerOSSiemreap: "Khmer OS Siemreap",
    timesNewRoman: "Times New Roman",
  };


  let LunarDay;
  let lunarMonth;
  let lunarYear;

  const signatureDateKm = _.get(certificateInfo, 'certificate.signatureDateKm', '');
  const signatureLunarDateKm = _.get(certificateInfo, 'certificate.signatureLunarDateKm', '');
  LunarDay = `${signatureLunarDateKm.split(' ')[0].split('ថ្ងៃ')[1]} ${signatureLunarDateKm.split(' ')[1]}`
  lunarMonth = `${signatureLunarDateKm.split(' ')[2].split('ខែ')[1]}`
  lunarYear = `${signatureLunarDateKm.split('ឆ្នាំ')[1]}`

  const DATA =
  {
    BACKGROUND: {
      pdfFilename: "minfo-certificate-of-traning-2024.png",
      pngFilename: "minfo-certificate-of-traning-2024.png",
      width: 3508,
      height: 2479
    },
    FONTS: [
      {
        name: "Khmer Moul",
        filename: "KhmerMoul.ttf"
      },
      {
        name: "Times New Roman",
        filename: "times.ttf"
      },
      {
        name: "Times New Roman Bold",
        filename: "timesbd.ttf"
      }
    ],
    TEXTS: [
      {
        key: "certificate.number",
        dataKeys: [
          "certificate.number"
        ],
        text: "{certificate.number}",
        textSize: 40,
        textColor: TEXT_COLORS.black,
        // textStyle: 'bold',
        textFont: {
          name: TEXT_FONTS.khmerOsMoulLight,
          filename: "KhmerMoul.ttf"
        },
        x: 771.8,
        y: 852 - 34,
        align: "center"
      },
      {
        key: "recipient.nameKm",
        dataKeys: [
          "recipient.nameKm"
        ],
        text: "{recipient.nameKm}",
        textSize: 40,
        textColor: TEXT_COLORS.black,
        // textStyle: 'bold',
        textFont: {
          name: TEXT_FONTS.khmerOsMoulLight,
          filename: "KhmerMoul.ttf"
        },
        x: 601.5,
        y: 956 - 34,
        align: "left"
      },
      {
        key: "recipient.genderKm",
        dataKeys: [
          "recipient.genderKm"
        ],
        text: "{recipient.genderKm}",
        textSize: 40,
        textColor: TEXT_COLORS.black,
        // textStyle: 'bold',
        textFont: {
          name: TEXT_FONTS.khmerOsMoulLight,
          filename: "KhmerMoul.ttf"
        },
        x: 601.5,
        y: 1049.9 - 34,
        align: "left"
      },
      {
        key: "recipient.nationalityKm",
        dataKeys: [
          "recipient.nationalityKm"
        ],
        text: "{recipient.nationalityKm}",
        textSize: 40,
        textColor: TEXT_COLORS.black,
        // textStyle: 'bold',
        textFont: {
          name: TEXT_FONTS.khmerOsMoulLight,
          filename: "KhmerMoul.ttf"
        },
        x: 1109,
        y: 1049.9 - 34,
        align: "left"
      },
      {
        key: "recipient.dateOfBirthKm",
        dataKeys: [
          "recipient.dateOfBirthKm"
        ],
        text: "{recipient.dateOfBirthKm}",
        textSize: 40,
        textColor: TEXT_COLORS.black,
        // textStyle: 'bold',
        textFont: {
          name: TEXT_FONTS.khmerOsMoulLight,
          filename: "KhmerMoul.ttf"
        },
        x: 686,
        y: 1147.1 - 34,
        align: "left"
      },
      {
        key: "certificate.courseKm",
        dataKeys: [
          "certificate.courseKm"
        ],
        text: "{certificate.courseKm}",
        textSize: 40,
        textColor: TEXT_COLORS.black,
        // textStyle: 'bold',
        textFont: {
          name: TEXT_FONTS.khmerOsMoulLight,
          filename: "KhmerMoul.ttf"
        },
        x: 789.5,
        y: 1332 - 34,
        align: "center"
      },
      {
        key: "certificate.durationKm",
        dataKeys: [
          "certificate.durationKm"
        ],
        text: "{certificate.durationKm}",
        textSize: 40,
        textColor: TEXT_COLORS.black,
        // textStyle: 'bold',
        textFont: {
          name: TEXT_FONTS.khmerOsMoulLight,
          filename: "KhmerMoul.ttf"
        },
        x: 1351.5,
        y: 1332 - 34,
        align: "left"
      },
      {
        key: "certificate.fromKm",
        dataKeys: [
          "certificate.fromKm"
        ],
        text: "{certificate.fromKm}",
        textSize: 40,
        textColor: TEXT_COLORS.black,
        // textStyle: 'bold',
        textFont: {
          name: TEXT_FONTS.khmerOsMoulLight,
          filename: "KhmerMoul.ttf"
        },
        x: 530.5,
        y: 1432.8 - 34,
        align: "left"
      },
      {
        key: "certificate.toKm",
        dataKeys: [
          "certificate.toKm"
        ],
        text: "{certificate.toKm}",
        textSize: 40,
        textColor: TEXT_COLORS.black,
        // textStyle: 'bold',
        textFont: {
          name: TEXT_FONTS.khmerOsMoulLight,
          filename: "KhmerMoul.ttf"
        },
        x: 1124.5,
        y: 1432.8 - 34,
        align: "left"
      },
      {
        key: "recipient.name",
        dataKeys: [
          "recipient.name"
        ],
        text: "{recipient.name}",
        textSize: 44,
        textStyle: "bold",
        textColor: TEXT_COLORS.black,
        textFont: {
          name: TEXT_FONTS.timesNewRoman,
          filename: "times.ttf"
        },
        x: 2259,
        y: 958.9 - 34,
        align: "left"
      },
      {
        key: "recipient.gender",
        dataKeys: [
          "recipient.gender"
        ],
        text: "{recipient.gender}",
        textSize: 44,
        textColor: TEXT_COLORS.black,
        textStyle: "bold",
        textFont: {
          name: TEXT_FONTS.timesNewRoman,
          filename: "times.ttf"
        },
        x: 1982.5,
        y: 1050 - 34,
        align: "left"
      },
      {
        key: "recipient.nationality",
        dataKeys: [
          "recipient.nationality"
        ],
        text: "{recipient.nationality}",
        textSize: 44,
        textColor: TEXT_COLORS.black,
        textStyle: "bold",
        textFont: {
          name: TEXT_FONTS.timesNewRoman,
          filename: "times.ttf"
        },
        x: 2556.5,
        y: 1049.8 - 34,
        align: "left"
      },
      {
        key: "recipient.dateOfBirth",
        dataKeys: [
          "recipient.dateOfBirth"
        ],
        text: "{recipient.dateOfBirth}",
        textSize: 44,
        textStyle: 'bold',
        textColor: TEXT_COLORS.black,
        textFont: {
          name: TEXT_FONTS.timesNewRoman,
          filename: "times.ttf"
        },
        x: 2170.5,
        y: 1147.8 - 34,
        align: "left"
      },
      {
        key: "certificate.course",
        dataKeys: [
          "certificate.course"
        ],
        text: "{certificate.course}",
        textSize: 44,
        textColor: TEXT_COLORS.black,
        textStyle: 'bold',
        textFont: {
          name: TEXT_FONTS.timesNewRoman,
          filename: "times.ttf"
        },
        x: 2159,
        y: 1331.9 - 34,
        align: "center"
      },
      {
        key: "certificate.duration",
        dataKeys: [
          "certificate.duration"
        ],
        text: "{certificate.duration}",
        textSize: 44,
        textColor: TEXT_COLORS.black,
        textStyle: 'bold',
        textFont: {
          name: TEXT_FONTS.timesNewRoman,
          filename: "times.ttf"
        },
        x: 2689.5,
        y: 1331.9 - 34,
        align: "left"
      },
      {
        key: "certificate.from",
        dataKeys: [
          "certificate.from"
        ],
        text: "{certificate.from}",
        textSize: 44,
        textColor: TEXT_COLORS.black,
        textStyle: 'bold',
        textFont: {
          name: TEXT_FONTS.timesNewRoman,
          filename: "times.ttf"
        },
        x: 1995.5,
        y: 1432.7 - 34,
        align: "left"
      },
      {
        key: "certificate.to",
        dataKeys: [
          "certificate.to"
        ],
        text: "{certificate.to}",
        textSize: 44,
        textColor: TEXT_COLORS.black,
        textStyle: 'bold',
        textFont: {
          name: TEXT_FONTS.timesNewRoman,
          filename: "times.ttf"
        },
        x: 2547.5,
        y: 1432.7 - 34,
        align: "left"
      },
      {
        key: "rcertificate.to",
        dataKeys: [
          "certificate.to"
        ],
        text: LunarDay,
        textSize: 40,
        textColor: TEXT_COLORS.black,
        // textStyle: 'bold',
        textFont: {
          name: TEXT_FONTS.KhmerOSSiemreap,
          filename: "KhmerMoul.ttf"
        },
        x: 1917.5,
        y: 1624.8 - 34,
        align: "left"
      },
      {
        key: "certificate.to",
        dataKeys: [
          "certificate.to"
        ],
        text: lunarMonth,
        textSize: 40,
        textColor: TEXT_COLORS.black,
        // textStyle: 'bold',
        textFont: {
          name: TEXT_FONTS.KhmerOSSiemreap,
          filename: "KhmerMoul.ttf"
        },
        x: 2360,
        y: 1624.8 - 34,
        align: "left"
      },
      {
        key: "certificate.to",
        dataKeys: [
          "certificate.to"
        ],
        text: lunarYear,
        textSize: 40,
        textColor: TEXT_COLORS.blue,
        textFont: {
          name: TEXT_FONTS.KhmerOSSiemreap,
          filename: "KhmerMoul.ttf"
        },
        x: 2360 + 230,
        y: 1595,
        align: "left"
      },
      {
        key: "recipient.day",
        dataKeys: [
          "recipient.day"
        ],
        text: signatureDateKm.split(' ')[0],
        textSize: 40,
        textColor: TEXT_COLORS.black,
        // textStyle: 'bold',
        textFont: {
          name: TEXT_FONTS.KhmerOSSiemreap,
          filename: "KhmerMoul.ttf"
        },
        x: 2308.5,
        y: 1719.8 - 34,
        align: "left"
      },
      {
        key: "recipient.month",
        dataKeys: [
          "recipient.month"
        ],
        text: signatureDateKm.split(' ')[1],
        textSize: 40,
        textColor: TEXT_COLORS.black,
        // textStyle: 'bold',
        textFont: {
          name: TEXT_FONTS.KhmerOSSiemreap,
          filename: "KhmerMoul.ttf"
        },
        x: 2552.5,
        y: 1719.8 - 34,
        align: "left"
      },
      {
        key: "recipient.year",
        dataKeys: [
          "recipient.year"
        ],
        text: signatureDateKm.split(' ')[2],
        textSize: 40,
        textColor: TEXT_COLORS.black,
        // textStyle: 'bold',
        textFont: {
          name: TEXT_FONTS.KhmerOSSiemreap,
          filename: "KhmerMoul.ttf"
        },
        x: 2815.5,
        y: 1719.8 - 34,
        align: "left"
      }
    ],
    QRCODE: {
      width: 243,
      height: 299.7,
      x: 420,
      y: 1890
    }
  }

  const bg = await createTemplateImage(DATA.BACKGROUND.pngFilename);
  const canvas = createCanvas(DATA.BACKGROUND.width, DATA.BACKGROUND.height);
  // const canvas = createCanvas(2105, 1488);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bg, 0, 0);


  for (const text of DATA.TEXTS) {
    if (text.length > 0) {
      for (const index in text) {
        const textItem = text[index];
        let lastItem;
        if (index > 0) lastItem = text[index - 1];

        if (!textItem.x) {
          const lastFont = resolveFont(DATA.FONTS[0].name, 24, lastItem);
          ctx.font = lastFont;
          const lastItemMetric = ctx.measureText(lastItem.text);
          textItem.x = lastItem.x + lastItemMetric.width + textItem.addX;
        }

        if (!textItem.y) textItem.y = lastItem.y;

        drawTextItem(canvas, ctx, textItem, DATA.FONTS, certificateInfo);
      }
    } else drawTextItem(canvas, ctx, text, DATA.FONTS, certificateInfo);
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, DATA.QRCODE.x, DATA.QRCODE.y, DATA.QRCODE.width);
  }
  return canvas;
}
const drawTextItem = (canvas, ctx, textItem, FONTS, certificateInfo) => {
  if (textItem.dataKeys && textItem.dataKeys.length > 0) {
    for (const key of textItem.dataKeys)
      textItem.text = textItem.text.replace(`{${key}}`, _.get(certificateInfo, key, ''));
  }

  drawText(canvas, ctx, textItem.text, {
    x: textItem.x,
    y: textItem.y + 34,
    textColor: textItem.textColor || 'TEXT_COLORS.black',
    align: textItem.align,
    font: resolveFont(FONTS[0].name, 24, textItem),
  });
};


export async function drawQrCodeStandard(qrcodeContent, ctx, x = 0, y = 0, width = 120) {
  const logoPath = path.join(process.cwd(), 'assets', 'qr-bg-v2.png');
  const qrcodeLogoImage = await loadImage(logoPath);
  const gapSize = (width * 10) / 120;        // 
  const qrcodeSize = width - (gapSize * 2); // exclude margin x,y
  const height = (width * 148) / 120;
  ctx.drawImage(
    qrcodeLogoImage,
    x,
    y,
    width,
    height
  );
  const qrcodeBuffer = await QRCode.toBuffer(qrcodeContent, { margin: 0, width: qrcodeSize });
  const qrcodeImage = await loadImage(qrcodeBuffer);
  ctx.drawImage(qrcodeImage, x + gapSize, y + gapSize);
}
// 'style size fontName' ex:'bold 20px Arial'
function resolveFont(defaultFont, defaultSize, textItem) {
  const space = ' ';
  let font = '';
  const fontName = textItem.textFont ? textItem.textFont.name : defaultFont;

  font += textItem.textStyle ? textItem.textStyle + space : '';
  font += textItem.textSize ? textItem.textSize : defaultSize;
  font += 'px' + space;
  font += fontName;
  return font;
}