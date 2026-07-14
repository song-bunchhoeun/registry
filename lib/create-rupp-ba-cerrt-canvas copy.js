import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText, loadRemoteResource } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createRUPPBachelorDegreeCanvas(certificateInfo = {}, qrcodeContent) {
  const VANDA_TEXT_COLORS = {
    black: '#000000',
    // '#FF0000',
    blue: '#000000'
  };

  const RUPP_FONTS = {
    KhmerOSMuolLight: 'Khmer OS Muol Light',
    KhmerOSSiemreap: 'Khmer OS Siemreap',
    khmerOSBattambang: 'Khmer OS battambang',
    khmerOSMuolPali: 'Khmer OS Muol Pali',
    timesNewRoman: 'Times New Roman',
  };


 
  const DATA = {
    BACKGROUND: {
      pdfFilename: "rupp-bong-vesna-v3-center.png",
      // "rupp-ba-certificate-template.png",
      // "Template-font-size-remove-higthlight-35-08.png",
      pngFilename:  "rupp-bong-vesna-v3-center.png",
      // "rupp-ba-certificate-template.png",
      //  "Template-font-size-remove-higthlight-35-08.png",
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
        text: "{recipient.name}",
        textSize: 50,
        textColor: VANDA_TEXT_COLORS.black,
        textStyle: 'bold',
        textFont: {
          name: RUPP_FONTS.timesNewRoman,
          filename: "timesbd.ttf"
        },
        x: 1117.5,
        y: 800,
        align: "center"
      },
      {
        key: "recipient.nameKm",
        dataKeys: [
          "recipient.nameKm"
        ],
        text: "{recipient.nameKm}",
        textSize: 48,
        textColor: VANDA_TEXT_COLORS.black,
        textFont: {
          name: RUPP_FONTS.KhmerOSMuolLight,
          filename: "KhmerOSmuollight.ttf"
        },
        x: 2675,
        y: 801.5,
        align: "center"
      },
      {
        key: "certificate.logDate",
        dataKeys: [
          "certificate.logDate"
        ],
        text: "dated   01 / 09 / 2022",
        // text: "dated   {certificate.logDate}",
        textSize: 52,
        textColor: VANDA_TEXT_COLORS.black,
        textFont: {
          name: RUPP_FONTS.timesNewRoman,
          filename: "times.ttf"
        },
        x: 1118,
        y: 599,
        align: "center"
      },
      // {
      //   key: "certificate.logDate",
      //   dataKeys: [
      //     "certificate.logDate"
      //   ],
      //   text: "dated",
      //   // text: "dated  {certificate.logDate}",
      //   textSize: 53,
      //   textColor: VANDA_TEXT_COLORS.black,
      //   textFont: {
      //     name: RUPP_FONTS.timesNewRoman,
      //     filename: "times.ttf"
      //   },
      //   x: 903,
      //   y: 601,
      //   align: "left"
      // },
      {
        key: "certificate.logDateKm",
        dataKeys: [
          "certificate.logDateKm"
        ],
        // text: "ចុះថ្ងៃទី ០១ / ០៩ / ២០២២",
        text: "ចុះថ្ងៃទី {certificate.logDateKm}",
        textSize: 50,
        textColor: VANDA_TEXT_COLORS.black,
        textFont: {
          name: RUPP_FONTS.khmerOSBattambang,
          filename: "KhmerOS_battambang.ttf"
        },
        x: 2665.5,
        y: 615.5,
        align: "center"
      },
      {
        key: "recipient.dateOfBirth",
        dataKeys: [
          "recipient.dateOfBirth"
        ],
        text: "born on  {recipient.dateOfBirth}",
        // text: "born on  07   December   1999",
        textSize: 50,
        textColor: VANDA_TEXT_COLORS.black,
        textFont: {
          name: RUPP_FONTS.timesNewRoman,
          filename: "times.ttf"
        },
        x: 1117.5,
        y: 874.5,
        align: "center"
      },
      {
        key: "recipient.dateOfBirthKm",
        dataKeys: [
          "recipient.dateOfBirthKm"
        ],
        text: "កើតថ្ងៃ  {recipient.dateOfBirthKm}",
        // text: "born on  07   De.cember   1999",
        textSize: 50,
        textColor: VANDA_TEXT_COLORS.black,
        textFont: {
          name: RUPP_FONTS.khmerOSBattambang,
          filename: "times.ttf"
        },
        x: 2674,
        y: 935-44,
        align: "center"
      },
      {
        key: "certificate.degree",
        dataKeys: [
          "certificate.degree"
        ],
        text: "{certificate.degree}",
        textSize: 79,
        textColor: VANDA_TEXT_COLORS.black,
        textFont: {
          name: "Old English Text MT",
          filename: "OLDENGL.TTF"
        },
        x: 1117.5,
        y: 1115-44,
        align: "center"
      },
      {
        key: "certificate.degreeKm",
        dataKeys: [
          "certificate.degreeKm"
        ],
        text: "{certificate.degreeKm}",
        textSize: 54,
        textColor: VANDA_TEXT_COLORS.black,
        textFont: {
          name: RUPP_FONTS.khmerOSMuolPali,
          filename: "KhmerOSmuolpali.ttf"
        },
        x: 2674,
        y: 1069.5,
        align: "center"
      },
      {
        key: "certificate.major",
        dataKeys: [
          "certificate.major"
        ],
        text: "{certificate.major}",
        textSize: 50,
        textColor: VANDA_TEXT_COLORS.black,
        textFont: {
          name: RUPP_FONTS.timesNewRoman,
          filename: "times.ttf"
        },
        x: 1117.5,
        y: 1207-40,
        align: "center"
      },
      {
        key: "certificate.majorKm",
        dataKeys: [
          "certificate.majorKm"
        ],
        text: "{certificate.majorKm}",
        textSize: 50,
        textColor: VANDA_TEXT_COLORS.black,
        textFont: {
          name: RUPP_FONTS.KhmerOSSiemreap,
          filename: "KhmerOS_battambang.ttf"
        },
        x: 2674,
        y: 1177,
        align: "center"
      },
      {
        key: "certificate.boardSignatureLunarDateKm",
        dataKeys: [
          "certificate.boardSignatureLunarDateKm"
        ],
        text: "{certificate.boardSignatureLunarDateKm}",
        textSize: 50,
        textColor: VANDA_TEXT_COLORS.black,
        textFont: {
          name: RUPP_FONTS.khmerOSBattambang,
          filename: "KhmerOS_battambang.ttf"
        },
        x: 2142,
        y: 1373.5,
        align: "left"
      },
      {
        key: "certificate.boardSignatureDateKm",
        dataKeys: [
          "certificate.boardSignatureDateKm"
        ],
        text: "{certificate.boardSignatureDateKm}",
        textSize: 50,
        textColor: VANDA_TEXT_COLORS.black,
        textFont: {
          name: RUPP_FONTS.khmerOSBattambang,
          filename: "KhmerOS_battambang.ttf"
        },
        x: 2425.5,
        y: 1558,
        align: "left"
      },
      {
        key: "certificate.rectorSignatureDate",
        dataKeys: [
          "certificate.rectorSignatureDate"
        ],
        
        text: "16   January   2023",
        // text: "{certificate.rectorSignatureDate}",
        textSize: 50,
        textColor: VANDA_TEXT_COLORS.black,
        textFont: {
          name: RUPP_FONTS.timesNewRoman,
          filename: "times.ttf"
        },
        x: 930,
        // x: 901.5,
        y: 1560,
        align: "center"
      },
      {
        key: "certificate.number",
        dataKeys: [
          "certificate.number"
        ],
        text: "{certificate.number}",
        textSize: 42,
        textColor: VANDA_TEXT_COLORS.black,
        textStyle: 'bold',
        textFont: {
          name: RUPP_FONTS.timesNewRoman,
          filename: "timesbd.ttf"
        },
        x: 1834.5,
        y: 1692-40,
        align: "left"
      },
      // {
      //   key: "certificate.number",
      //   dataKeys: [
      //     "certificate.number"
      //   ],
      //   text: "{certificate.number}",
      //   textSize: 5,
      //   textColor: VANDA_TEXT_COLORS.black,
      //   textFont: {
      //     name: "Times New Roman Bold",
      //     filename: "timesbd.ttf"
      //   },
      //   x: 0,
      //   y: 0,
      //   align: "center"
      // }
    ],
    QRCODE: {
      width: 287,
      height: 353.96666666666664,
      x: 3115,
      y: 1814
    }
  }

  const bg = await createTemplateImage(DATA.BACKGROUND.pngFilename);
  const canvas = createCanvas(DATA.BACKGROUND.width, DATA.BACKGROUND.height);
  // const canvas = createCanvas(2105, 1488);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bg, 0, 0);

  // // Split and Draw Khmer Isuse Date
  // const isuseDate = certificateInfo.certificate.chairSignatureDateKm?.split(' ');
  // let x = 779;
  // // 787
  // for (const date of isuseDate) {
  //     const text = {
  //         text: date,
  //         textSize: 35,
  //         textColor: NUBB_TEXT_COLORS.black,
  //         textFont: NUBB_FONTS.secondary,
  //         x: x,
  //         y: 1616,
  //     }
  //     drawText(canvas, ctx, text.text, {
  //         x: text.x,
  //         y: text.y,
  //         textColor: text.textColor || NUBB_TEXT_COLORS.black,
  //         align: text.align,
  //         font: resolveFont(NUBB_FONTS.primary, 24, text),
  //     });
  //     x += 223;
  // }

  // Draw Caption 
  // for (const text of NUBB_TEXTS) {

  //     if (text.dataKeys && text.dataKeys.length > 0) {
  //         for (const key of text.dataKeys) text.text = text.text.replace(`{${key}}`, _.get(certificateInfo, key, ''));
  //     }

  //     drawText(canvas, ctx, text.text, {
  //         x: text.x,
  //         y: text.y,
  //         textColor: text.textColor || VANDA_TEXT_COLORS.black,
  //         align: text.align,
  //         font: resolveFont(VANDA_FONTS.primary, 24, text),
  //     });
  // }

  // for (const text of DATA.TEXTS) {
  //   if (text.length > 0) {
  //     for (const index in text) {
  //       const textItem = text[index];
  //       let lastItem;
  //       if (index > 0) lastItem = text[index - 1];

  //       if (!textItem.x) {
  //         const lastFont = resolveFont(DATA.FONTS[0].name, 24, lastItem);
  //         ctx.font = lastFont;
  //         const lastItemMetric = ctx.measureText(lastItem.text);
  //         textItem.x = lastItem.x + lastItemMetric.width + textItem.addX;
  //       }

  //       if (!textItem.y) textItem.y = lastItem.y;

  //       drawTextItem(canvas, ctx, textItem, DATA.FONTS, certificateInfo);
  //     }
  //   } else drawTextItem(canvas, ctx, text, DATA.FONTS, certificateInfo);
  // }

  if (qrcodeContent) {
    // await drawQrCodeStandard(qrcodeContent, ctx, 3115,1814,287);
    // await drawQrCodeStandard(qrcodeContent, ctx, 746,470, 72);
    await drawQrCodeStandard(qrcodeContent, ctx, DATA.QRCODE.x, DATA.QRCODE.y, DATA.QRCODE.width);
  }

  // draw profile photo
  // if (certificateInfo.recipient.photoUrl) {
  //   const profileImage = await loadRemoteResource(certificateInfo.recipient.photoUrl);
  //   if (profileImage) {
  //     const maxImgBoxWidth = 350;
  //     const maxImgBoxHeight = 455;

  //     // get the scale
  //     // it is the min of the 2 ratios
  //     let scale_factor = Math.min(maxImgBoxWidth / profileImage.width, maxImgBoxHeight / profileImage.height);

  //     // Lets get the new width and height based on the scale factor
  //     let newWidth = profileImage.width * scale_factor;
  //     let newHeight = profileImage.height * scale_factor;

  //     // const profileHeight = profileMaxWidth / (profileImage.width / profileImage.height);
  //     const profileX = 1719
  //     const profileY = 1768;
  //     // const profileX = (bg.width / 2) - (newWidth / 2);
  //     // const profileY = 422;
  //     ctx.drawImage(profileImage, profileX, profileY, newWidth, newHeight);
  //   }
  // }
  return canvas;
}
const drawTextItem = (canvas, ctx, textItem, FONTS, certificateInfo) => {
  if (textItem.dataKeys && textItem.dataKeys.length > 0) {
    for (const key of textItem.dataKeys)
      textItem.text = textItem.text.replace(`{${key}}`, _.get(certificateInfo, key, ''));
  }

  drawText(canvas, ctx, textItem.text, {
    x: textItem.x,
    y: textItem.y + 40,
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