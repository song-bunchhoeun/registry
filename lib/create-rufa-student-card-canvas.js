import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText, loadRemoteResource } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createRUFAStudentCard(certificateInfo = {}, qrcodeContent) {
    const MPTC_TEXT_COLORS = {
        black: '#434146',
        white: '#ffffff',
        red: '#900d13'
    };
    const year = certificateInfo.certificate.year.replaceAll(' ','    ');
    const name = certificateInfo.recipient.name.split('').join(' ');
    let DATA = {
        BACKGROUND: {
            pngFilename: "rufa-card-front-scale-size-update.png",
            // "rufa-card-front copy.png",
            // "rufa-student-card-template-bigest-teamplate-size-finla.png",
            //  "default-small-size-for-templa-resize-for-template-only.png",
            // "rufa-student-card-template-bigest-teamplate-size-finla.png",
            // old normal size
            // 'rufa-student-card-template.png',
            // 'rufa-card-2-in-1-v2.png',
            width: 1000,
            height: 3183,
        },
        FONTS: [
            { name: 'Khmer MEF2', filename: 'Khmer MEF2 Regular.ttf' },
            { name: 'Khmer MEF1', filename: 'Khmer MEF1 Regular.ttf' },
            { name: 'Khmer OS Muol Pali', filename: 'KhmerOSmuolpali.ttf' },
            { name: 'Times New Roman', filename: 'times.ttf' },
        ],
        TEXTS: [
            {
              key: "certificate.expiredDate",
              dataKeys: [
                "certificate.expiredDate"
              ],
              text: "{certificate.expiredDate}",
              textSize: 36,
              textColor: MPTC_TEXT_COLORS.white,
              textStyle: 'bold',
              textFont: {
                name: "Khmer OS Content",
              },

              x: 472,
              y: 2599,
              // y: 2604,
              align: "left"
            },
            {
              key: "certificate.levelKm",
              dataKeys: [
                "certificate.levelKm"
              ],
              text: "{certificate.levelKm}",
              textFont: {
                name: "Khmer Mool1",
              },
              textSize: 188,
              textColor: MPTC_TEXT_COLORS.red,
              x: 2390,
              y: 4526,
              align: "left"
            },
            {
              key: "certificate.majorKm",
              dataKeys: [
                "certificate.majorKm"
              ],
              text: "{certificate.majorKm}",
              textFont: {
                name: "Khmer Mool1",
              },
              textSize: 188,
              textColor: MPTC_TEXT_COLORS.red,
              x: 2390,
              y: 4898.8,
              align: "left"
            },
            {
              key: "certificate.rectorSignatureDate",
              dataKeys: [
                "certificate.rectorSignatureDate"
              ],
              text: "រាជធានីភ្នំពេញ​ {certificate.rectorSignatureDate}",
              textStyle: 'bold',
              textFont: {
                name: "Khmer OS Content",
              },
              textSize: 170,
              textColor: MPTC_TEXT_COLORS.red,
              x: 3221,
              y: 5604,
              align: "center"
            },
            // {
            //   key: "certificate.year",
            //   dataKeys: [
            //     "certificate.year"
            //   ],
            //   text: year,
            //   // "{certificate.year}",
            //   textFont: {
            //     name: "AKbalthom TNRB",
            //   },
            //   textSize: 39,
            //   textColor: MPTC_TEXT_COLORS.white,
            //   x: 500,
            // //   x: 410.5,
            //   y: 2529,
            //   align: "center"
            // },
            // {
            //   key: "certificate.yearKm",
            //   dataKeys: [
            //     "certificate.yearKm"
            //   ],
            //   text: "{certificate.yearKm}",
            //   textFont: {
            //     name: "Khmer Mool1",
            //   },
            //   textSize: 39,
            //   textColor: MPTC_TEXT_COLORS.white,
            // //   x: 356.5,
            //   x: 500,
            //   y: 2479,
            //   align: "center"
            // },
            {
              key: "recipient.dateOfBirthKm",
              dataKeys: [
                "recipient.dateOfBirthKm"
              ],
              text: "{recipient.dateOfBirthKm}",
              textFont: {
                name: "Khmer Mool1",
              },
              textSize: 188,
              textColor:MPTC_TEXT_COLORS.red,
              x: 2390,
              y: 4160,
              align: "left"
            },
            {
              key: "recipient.name",
              dataKeys: [
                "recipient.name"
              ],
              text: "N a m e",
              textFont:{
                name: "AKbalthom TNRB"
              },
              textSize: 177,
              textColor: MPTC_TEXT_COLORS.red,
              x: 690,
              y: 3790.8,
              align: "left"
            },
           
            {
              key: "recipient.nameKm",
              dataKeys: [
                "recipient.nameKm"
              ],
              text: "{recipient.nameKm}",
              textFont: {
                name: "Khmer Mool1",
              },
              textSize: 255,
              textColor: MPTC_TEXT_COLORS.red,
              x: 2390,
              y: 3419,
              align: "left"
            },
            {
              key: "recipient.phoneNumber",
              dataKeys: [
                "recipient.phoneNumber"
              ],
              text: "{recipient.phoneNumber}",
              textStyle: 'bold',
              textFont: {
                name: "Khmer Mool1",
              },
              textSize: 188,
              textColor:MPTC_TEXT_COLORS.red,
              x: 2390,
              y: 5264.8,
              align: "left"
            },
            {
              key: "recipient.studentId",
              dataKeys: [
                "recipient.studentId"
              ],
              text: "{recipient.studentId}",
              textStyle: 'bold',
              textFont: {
                name: "Khmer OS Content",
              },
              textSize: 183,
              textColor: MPTC_TEXT_COLORS.red,
              x: 2380,
              y: 3006,
              align: "left"
            }
          ],
          QRCODE: {
            width: 1267,
            height: 1558,
            x: 370.6,
            y: 6200
             //qr position on front side
            //  x: 73,
            //  y: 2842
          }
        }

let nameData = [
  {
    key: "recipient.name",
    dataKeys: [
      "recipient.name"
    ],
    text: name,
    // "{recipient.name}",
    textFont:{
      name: "AKbalthom TNRB"
    },
    textSize: 177,
    textColor: MPTC_TEXT_COLORS.red,
    x: 2390,
    y: 3790.8,
    align: "left"
  },
]
let nameWidht = '';
const getTextMaxWidth = (ctx, textItem) => {
  ctx.font = resolveFont(textItem.textFont, 24, textItem);
  const kmTargetMatric = ctx.measureText(textItem.text);
  return kmTargetMatric;
};


    const bg = await createTemplateImage(DATA.BACKGROUND.pngFilename);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);

    nameWidht = getTextMaxWidth(ctx,nameData[0])
    // console.log("nameWidht",nameWidht.width);
    if(nameWidht.width >=  2412){
      nameData[0].text = certificateInfo.recipient.name
      nameData[0].textSize = nameData[0].textSize-35
    }

DATA.TEXTS = [...DATA.TEXTS,...nameData]

    // Draw Caption
    for (const text of DATA.TEXTS) {
        if (text.dataKeys && text.dataKeys.length > 0) {
            for (const key of text.dataKeys) text.text = text.text.replace(`{${key}}`, _.get(certificateInfo, key, ''));
        }

        drawText(canvas, ctx, text.text, {
            x: text.x,
            y: text.y,
            textColor: text.textColor || '#000000',
            align: text.align,
            font: resolveFont(DATA.FONTS[0].name, 24, text),
        });
    }

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, DATA.QRCODE.x, DATA.QRCODE.y, DATA.QRCODE.width);
    }

     // draw profile photo
     if (certificateInfo.recipient.photoUrl) {
        const profileImage = await loadRemoteResource(certificateInfo.recipient.photoUrl);
        if (profileImage) {
            const maxImgBoxWidth = 1776;
            const maxImgBoxHeight = 2258;

            // get the scale
            // it is the min of the 2 ratios
            let scale_factor = Math.min(maxImgBoxWidth / profileImage.width, maxImgBoxHeight / profileImage.height);

            // Lets get the new width and height based on the scale factor
            let newWidth = profileImage.width * scale_factor;
            let newHeight = profileImage.height * scale_factor;

            // const profileHeight = profileMaxWidth / (profileImage.width / profileImage.height);
            const profileX = 500.5
            // const profileX = 326
            const profileY = 452.8;
            ctx.drawImage(profileImage, 2552-(newWidth/2), profileY, newWidth, newHeight);
        }
    }
    return canvas;
}

export async function drawQrCodeStandard(qrcodeContent, ctx, x = 0, y = 0, width = 120) {
    // ration: 120/148 of QR Standard
    const logoPath = path.join(process.cwd(), 'assets', 'qr-bg-v2.png');
    const qrcodeLogoImage = await loadImage(logoPath);
    const gapSize = (width * 10) / 120; //
    const qrcodeSize = width - gapSize * 2; // exclude margin x,y
    const height = (width * 148) / 120;
    ctx.drawImage(qrcodeLogoImage, x, y, width, height);
    const qrcodeBuffer = await QRCode.toBuffer(qrcodeContent, { margin: 0, width: qrcodeSize });
    const qrcodeImage = await loadImage(qrcodeBuffer);
    ctx.drawImage(qrcodeImage, x + gapSize, y + gapSize);
}

export async function createQRCodeLogoImage() {
    const logoPath = path.join(process.cwd(), 'assets', 'qr-bg-v2.png');
    return loadImage(logoPath);
}
function font(name = fontConfig.primary, size = 20) {
    return `${size}px ${name}, sans-serif`;
}
function fontBold(name = fontConfig.primary, size = 20) {
    return `bold ${size}px ${name}, sans-serif`;
}
// 'style size fontName' ex:'bold 20px Arial'
function resolveFont(defaultFont, defaultSize, text) {
    const space = ' ';
    let font = '';
    const fontName = text.textFont ? text.textFont.name : defaultFont;

    font += text.textStyle ? text.textStyle + space : '';
    font += text.textSize ? text.textSize : defaultSize;
    font += 'px' + space;
    font += fontName;

    return font;
}
