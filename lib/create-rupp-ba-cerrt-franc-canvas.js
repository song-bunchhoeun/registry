import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText, loadRemoteResource } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createRUPPBachelorFrancDegreeCanvas(certificateInfo = {}, qrcodeContent) {
  const VANDA_TEXT_COLORS = {
    black: '#000000',
    blue: '#000000'
  };

  const RUPP_FONTS = {
    KhmerOSMuolLight: 'Khmer OS Muol Light',
    KhmerOSSiemreap: 'Khmer OS Siemreap',
    khmerOSBattambang: 'Khmer OS Battambang',
    khmerOSMuolPali: 'Khmer OS Muol Pali',
    timesNewRoman: 'Times New Roman',
  };

  const nameKm = certificateInfo.recipient.nameKm.replaceAll(' ', '  ')
  const name = certificateInfo.recipient.name.replaceAll(' ', '   ')
  const dateOfBirthKm = certificateInfo.recipient.dateOfBirthKm.replaceAll(' ', '  ')
  const dateOfBirthFr = certificateInfo.recipient.dateOfBirthFr.replaceAll(' ', '  ')
  let rectorSignatureDateFr = certificateInfo.certificate.rectorSignatureDateFr.replaceAll(' ', '  ')
  let boardSignatureDateKm = certificateInfo.certificate.boardSignatureDateKm.replaceAll(' ', '   ')
  let boardSignatureLunarDateKm = certificateInfo.certificate.boardSignatureLunarDateKm.replaceAll(' ខែ', '  ខែ').replaceAll(' ឆ្នាំ', '  ឆ្នាំ')

  const DATA = {
    BACKGROUND: {
      // pdfFilename: "rupp-france-certificate-v6-final.png",
      // pngFilename: 'rupp-france-certificate-v6-final.png',
      pngFilename: 'rupp-france-bachelor-background.png',
      width: 3508,
      height: 2479
    },
    FONTS: [
      {
        name: "Old English Text MT",
        filename: "OLDENGL.TTF"
      },
      {
        name: RUPP_FONTS.khmerOSMuolPali,
        filename: "KhmerOSmuolpali.ttf"
      },
      {
        name: RUPP_FONTS.khmerOSBattambang,
        filename: "KhmerOS_battambang.ttf"
      },
      {
        name: RUPP_FONTS.KhmerOSMuolLight,
        filename: "KhmerOSmuollight.ttf"
      },
      {
        name: "Times New Roman Bold",
        filename: "timesbd.ttf"
      },
      {
        name: RUPP_FONTS.timesNewRoman,
        filename: "times.ttf"
      }
    ],
    TEXTS: [
      {
        key: "recipient.name",
        dataKeys: [
          "recipient.name"
        ],
        text: `à  ${name}`,
        textSize: 47,
        textColor: VANDA_TEXT_COLORS.blue,
        textStyle: 'bold',
        textFont: {
          name: RUPP_FONTS.timesNewRoman,
          filename: "timesbd.ttf"
        },
        x: 999,
        y: 1253,
        align: "center"
      },
      {
        key: "recipient.nameKm",
        dataKeys: [
          "recipient.nameKm"
        ],
        text: nameKm,
        textSize: 48,
        textColor: VANDA_TEXT_COLORS.blue,
        textFont: {
          name: RUPP_FONTS.KhmerOSMuolLight,
          filename: "KhmerOSmuollight.ttf"
        },
        x: 2530,
        y: 866.5,
        align: "center"
      },
      {
        key: "certificate.logDate",
        dataKeys: [
          "certificate.logDate"
        ],
        text: "en date du  {certificate.logDate}",
        textSize: 47,
        textColor: VANDA_TEXT_COLORS.blue,
        textFont: {
          name: RUPP_FONTS.timesNewRoman,
          filename: "times.ttf"
        },
        x: 998,
        y: 781.0+7,
        align: "center"
      },
      {
        key: "certificate.logDateKm",
        dataKeys: [
          "certificate.logDateKm"
        ],
        text: "ចុះថ្ងៃទី {certificate.logDateKm}",
        textSize: 47,
        textColor: VANDA_TEXT_COLORS.blue,
        textFont: {
          name: RUPP_FONTS.khmerOSBattambang,
          filename: "KhmerOS_battambang.ttf"
        },
        x: 2529,
        y: 706.3+7,
        align: "center"
      },
      {
        key: "recipient.dateOfBirthFr",
        dataKeys: [
          "recipient.dateOfBirthFr"
        ],
        text: `né(e) le ${dateOfBirthFr}`,
        textSize: 51,
        textColor: VANDA_TEXT_COLORS.blue,
        textFont: {
          name: RUPP_FONTS.timesNewRoman,
          filename: "times.ttf"
        },
        x: 999,
        y: 1314,
        align: "center"
      },
      {
        key: "certificate.year",
        dataKeys: [
          "certificate.year"
        ],
        text: "au titre de l’année universitaire {certificate.year}",
        textSize: 47,
        textColor: VANDA_TEXT_COLORS.black,
        textFont: {
          name: RUPP_FONTS.timesNewRoman,
          filename: "times.ttf"
        },
        x: 999,
        y: 1399-29,
        align: "center"
      },
      {
        key: "recipient.dateOfBirthKm",
        dataKeys: [
          "recipient.dateOfBirthKm"
        ],
        text: `កើត${dateOfBirthKm}`,
        textSize: 47,
        textColor: VANDA_TEXT_COLORS.blue,
        textFont: {
          name: RUPP_FONTS.khmerOSBattambang,
          filename: "times.ttf"
        },
        x: 2529.5,
        y: 955,
        align: "center"
      },
      {
        key: "certificate.degreeFr",
        dataKeys: [
          "certificate.degreeFr"
        ],
        text: "{certificate.degreeFr}",
        textStyle: 'bold',
        textSize: 75,
        textColor: VANDA_TEXT_COLORS.blue,
        textFont: {
          name: "Old English Text MT",
          filename: "OLDENGL.TTF"
        },
        x: 1000.5,
        y: 1030.5+26,
        align: "center"
      },
      {
        key: "certificate.degreeKm",
        dataKeys: [
          "certificate.degreeKm"
        ],
        text: "{certificate.degreeKm}",
        textSize: 59,
        textStyle: 'bold',
        textColor: VANDA_TEXT_COLORS.blue,
        textFont: {
          name: RUPP_FONTS.khmerOSMuolPali,
          filename: "KhmerOSmuolpali.ttf"
        },
        x: 2530,
        y: 1068,
        align: "center"
      },
      {
        key: "certificate.majorFr",
        dataKeys: [
          "certificate.majorFr"
        ],
        text: "{certificate.majorFr}",
        textStyle: "bold",
        textSize: 51,
        textColor: VANDA_TEXT_COLORS.blue,
        textFont: {
          name: RUPP_FONTS.timesNewRoman,
          filename: "times.ttf"
        },
        x: 1000,
        y: 1134.5,
        align: "center"
      },
      {
        key: "certificate.majorKm",
        dataKeys: [
          "certificate.majorKm"
        ],
        text: "ជំនាញ​  {certificate.majorKm}",
        textSize: 47,
        textColor: VANDA_TEXT_COLORS.blue,
        textFont: {
          name: RUPP_FONTS.khmerOSBattambang,
          filename: "KhmerOS_battambang.ttf"
        },
        x: 2513.5,
        y: 1178,
        align: "center"
      },
      {
        key: "certificate.boardSignatureLunarDateKm",
        dataKeys: [
          "certificate.boardSignatureLunarDateKm"
        ],
        text: boardSignatureLunarDateKm,
        textSize: 47,
        textColor: VANDA_TEXT_COLORS.blue,
        textFont: {
          name: RUPP_FONTS.khmerOSBattambang,
          filename: "KhmerOS_battambang.ttf"
        },
        x: 2530,
        y: 1441,
        align: "center"
      },
      {
        key: "certificate.boardSignatureDateKm",
        dataKeys: [
          "certificate.boardSignatureDateKm"
        ],
        text: `${boardSignatureDateKm}`,
        textSize: 47,
        textColor: VANDA_TEXT_COLORS.blue,
        textFont: {
          name: RUPP_FONTS.khmerOSBattambang,
          filename: "KhmerOS_battambang.ttf"
        },
        x: 2530,
        y: 1615,
        align: "center"
      },
      {
        key: "certificate.rectorSignatureDateFr",
        dataKeys: [
          "certificate.rectorSignatureDateFr"
        ],
        text: rectorSignatureDateFr,
        textSize: 47,
        textColor: VANDA_TEXT_COLORS.blue,
        textFont: {
          name: RUPP_FONTS.timesNewRoman,
          filename: "times.ttf"
        },
        x: 932,
        y:1612.5,
        align: "center"
      },
      {
        key: "certificate.number",
        dataKeys: [
          "certificate.number"
        ],
        text: "{certificate.number}",
        textSize: 43,
        textColor: VANDA_TEXT_COLORS.blue,
        textStyle: 'bold',
        textFont: {
          name: RUPP_FONTS.timesNewRoman,
          filename: "timesbd.ttf"
        },
        x: 1708,
        y: 1590,
        align: "left"
      },
    ],
    QRCODE: {
      width: 270, 
      height: 336,
      x: 2913,
      y: 1856.2-30
    }
  }

  const bg = await createTemplateImage(DATA.BACKGROUND.pngFilename);
  const canvas = createCanvas(DATA.BACKGROUND.width, DATA.BACKGROUND.height);
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

  // draw profile photo
  if (certificateInfo.recipient.photoUrl) {
    const profileImage = await loadRemoteResource(certificateInfo.recipient.photoUrl);
    if (profileImage) {
      const maxImgBoxWidth = 352;
      const maxImgBoxHeight = 402;

      // get the scale
      // it is the min of the 2 ratios
      let scale_factor = Math.min(maxImgBoxWidth / profileImage.width, maxImgBoxHeight / profileImage.height);

      // Lets get the new width and height based on the scale factor
      let newWidth = profileImage.width * scale_factor;
      let newHeight = profileImage.height * scale_factor;
      const profileX = 1778-(newWidth/2)
      const profileY = 1644;
      ctx.drawImage(profileImage, profileX, profileY, newWidth, newHeight);
    }
  }
  return canvas;
}
const drawTextItem = (canvas, ctx, textItem, FONTS, certificateInfo) => {
  if (typeof textItem.text !== 'string') return;
  
  if (textItem.dataKeys && textItem.dataKeys.length > 0) {
    for (const key of textItem.dataKeys)
      textItem.text = textItem.text.replace(`{${key}}`, _.get(certificateInfo, key, ''));
  }

  drawText(canvas, ctx, textItem.text, {
    x: textItem.x,
    y: textItem.y -7,
    textColor: textItem.textColor || '#000000',
    align: textItem.align,
    font: resolveFont(FONTS[0].name, 24, textItem),
    // strokeLine: 0.1,
    // strokeColor: '#000000',
    // textMaxWidth: textItem.textMaxWidth,
  });
};


export async function drawQrCodeStandard(qrcodeContent, ctx, x = 0, y = 0, width = 120) {
  // ration: 120/148 of QR Standard
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

// Note that: this commit I have addd  36 px to original certificate possition
// if want to back old position change bg "rupp-frace-bachelor-teamplate-no-text-v4.png", romve -36 px

