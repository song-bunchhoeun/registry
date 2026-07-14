import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawWrapTexts, drawText } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createMPTCCybersecurityWorkshop2026CertificateCanvas(
  certificateInfo = {},
  qrcodeContent
) {
  const MPTC_TEXT_COLORS = {
    black: '#020202',
    blue: '#013F88'
  };

  const MPTC_FONTS = {
    primary: 'Kantumruy Pro',
    secondary: 'Niradei'
  };

  let MPTC_TEXTS = [
    {
      dataKeys: ['recipient.nameKm'],
      text: '{recipient.nameKm}',
      textSize: 60,
      textStyle: '700',
      textColor: MPTC_TEXT_COLORS.blue,
      y: 1449.6,
      align: 'center',
      textFont: MPTC_FONTS.primary
    }
  ];

  const MPTC_TEMPLATE_IMAGE = 'mptc-cybersecurity-2026-background-no-stamp.jpg';

  const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
  const canvas = createCanvas(bg.width, bg.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bg, 0, 0);

  const type = _.get(certificateInfo, 'certificate.type', '');

  drawWrapTexts(ctx, {
    top: type.toLowerCase() === 'participant' ? 1547.8 : 1557,
    left: 0,
    width: 2480,
    textAlignment: 'center',
    lineHeight: 1,
    spans: [
      {
        text: (() => {
          switch (type.toLowerCase()) {
            case 'speaker':
              return 'ដែលបានចូលរួមជាវាគ្មិនក្នុងសិក្ខាសាលាស្ដីពី';
            case 'trainer':
              return 'ដែលបានចូលរួមជាគ្រូបង្គោលក្នុងវគ្គបណ្តុះបណ្តាលស្តីពី';
            case 'facilitator':
              return 'ដែលបានចូលរួមជាអ្នកសម្របសម្រួលក្នុងវគ្គបណ្តុះបណ្តាលស្តីពី';
            case 'organizer':
              return 'ដែលបានចូលរួមជាអ្នករៀបចំ និងសម្របសម្រួលក្នុងកម្មវិធី';
            case 'volunteer':
              return 'ដែលបានចូលរួមជាអ្នកស្ម័គ្រចិត្តក្នុងកម្មវិធី';
            case 'attendee':
              return 'ដែលបានចូលរួមក្នុងវគ្គបណ្ដុះបណ្ដាលស្ដីពី';
            default:
              return 'ដែលបានចូលរួមក្នុងសិក្ខាសាលាស្ដីពី';
          }
        })(),
        fontSize: 60,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: '600'
      }
    ]
  }).draw();

  drawWrapTexts(ctx, {
    top: 1645,
    left: 0,
    width: 2480,
    textAlignment: 'center',
    lineHeight: 1,
    spans: [
      {
        text: "\u201C",
        fontSize: 59,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: 'bold',
      },
      {
        text: certificateInfo.certificate.courseKm,
        fontSize: 59,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: 'bold'
      },
      {
        text: "\u201D",
        fontSize: 59,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: 'bold',
      },
    ]
  }).draw();

  drawWrapTexts(ctx, {
    top: type.toLowerCase() === 'participant' ? 1731 : 1738,
    left: 0,
    width: 2480,
    textAlignment: 'center',
    lineHeight: 1,
    spans: [
      {
        dataKeys: ['certificate.heldOnKm', 'certificate.heldAtKm'],
        text: (() => {
          switch (type.toLowerCase()) {
            case 'participant':
              return `${certificateInfo.certificate.heldOnKm} នៅ${certificateInfo.certificate.heldAtKm}។`;
            default:
              return `ចាប់ពី${certificateInfo.certificate.heldOnKm} នៅ${certificateInfo.certificate.heldAtKm}។`;
          }
        })(),
        fontSize: 60,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: '600'
      }
    ]
  }).draw();

  drawWrapTexts(ctx, {
    top: 1947,
    left: 0,
    width: 2480,
    textAlignment: 'center',
    lineHeight: 1,
    spans: [
      {
        dataKeys: ['recipient.name'],
        text: certificateInfo.recipient.name,
        fontSize: 58,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.blue,
        fontWeight: 'bold'
      }
    ]
  }).draw();

  drawWrapTexts(ctx, {
    top: 2035,
    left: 0,
    width: 2480,
    textAlignment: 'center',
    lineHeight: 1,
    spans: [
      {
        text: (() => {
          switch (type.toLowerCase()) {
            case 'speaker':
              return 'in recognition of their invaluable contribution as a speaker for the';
            case 'trainer':
              return 'in recognition of their invaluable contribution as a trainer for the';
            case 'facilitator':
              return 'in recognition of their invaluable contribution as a facilitator for the';
            case 'organizer':
              return 'in recognition of their invaluable contribution as an organizer for the';
            case 'volunteer':
              return 'in recognition of their invaluable contribution as a volunteer for the';
            default:
              return 'In recognition of successfully completing the';
          }
        })(),
        fontSize: 56,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: '600'
      }
    ]
  }).draw();

  drawWrapTexts(ctx, {
    top: 2125.5,
    left: 0,
    width: 2480,
    textAlignment: 'center',
    lineHeight: 1,
    spans: [
      {
        text: "\u201C",
        fontSize: 59,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: 'bold',
      },
      {
        text: certificateInfo.certificate.course,
        fontSize: 59,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: 'bold'
      },
      {
        text: "\u201D",
        fontSize: 59,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: 'bold',
      },
    ]
  }).draw();

  drawWrapTexts(ctx, {
    top: 2203.5,
    left: 0,
    width: 2480,
    textAlignment: 'center',
    lineHeight: 1,
    spans: [
      {
        dataKeys: ['certificate.heldOn', 'certificate.heldAt'],
        text: (() => {
          switch (type.toLowerCase()) {
            case 'participant':
              return `held on ${certificateInfo.certificate.heldOn}, at ${certificateInfo.certificate.heldAt}.`;
            case 'attendee':
              return `held from ${certificateInfo.certificate.heldOn}, at ${certificateInfo.certificate.heldAt}.`;
            default:
              return `initiative, held from ${certificateInfo.certificate.heldOn}, at ${certificateInfo.certificate.heldAt}.`;
          }
        })(),
        fontSize: 55,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: '600'
      }
    ]
  }).draw();

  drawWrapTexts(ctx, {
    top: 2377.4,
    left: 0,
    width: 2480,
    textAlignment: 'center',
    lineHeight: 1,
    spans: [
      {
        dataKeys: ['certificate.signatureLunarDateKm'],
        text: certificateInfo.certificate.signatureLunarDateKm,
        fontSize: 55,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: '600'
      }
    ]
  }).draw();

  drawWrapTexts(ctx, {
    top: 2472.4,
    left: 0,
    width: 2480,
    textAlignment: 'center',
    lineHeight: 1,
    spans: [
      {
        dataKeys: ['certificate.signatureDateKm'],
        text: certificateInfo.certificate.signatureDateKm,
        fontSize: 55,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: '600'
      }
    ]
  }).draw();

  drawWrapTexts(ctx, {
    top: 2558,
    left: 0,
    width: 2480,
    textAlignment: 'center',
    lineHeight: 1,
    spans: [
      {
        dataKeys: ['certificate.signatureDate'],
        text: certificateInfo.certificate.signatureDate,
        fontSize: 55,
        fontFamily: MPTC_FONTS.primary,
        fillStyle: MPTC_TEXT_COLORS.black,
        fontWeight: '600'
      }
    ]
  }).draw();

  for (const text of MPTC_TEXTS) {
    if (text.length > 0) {
      for (const index in text) {
        const textItem = text[index];
        let lastItem;
        if (index > 0) lastItem = text[index - 1];

        if (!textItem.x) {
          const lastFont = resolveFont(
            MPTC_FONTS.primary,
            24,
            lastItem
          );
          ctx.font = lastFont;
          const lastItemMetric = ctx.measureText(lastItem.text);
          textItem.x =
            lastItem.x + lastItemMetric.width + textItem.addX;
        }

        if (!textItem.y) textItem.y = lastItem.y;

        drawTextItem(
          canvas,
          ctx,
          textItem,
          MPTC_FONTS.primary,
          certificateInfo
        );
      }
    } else
      drawTextItem(
        canvas,
        ctx,
        text,
        MPTC_FONTS.primary,
        certificateInfo
      );
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(qrcodeContent, ctx, 1996.4, 2908.5, 272);
  }
  return canvas;
}
const drawTextItem = (canvas, ctx, textItem, FONTS, certificateInfo) => {
  if (textItem.dataKeys && textItem.dataKeys.length > 0) {
    for (const key of textItem.dataKeys)
      textItem.text = textItem.text.replace(
        `{${key}}`,
        _.get(certificateInfo, key, '')
      );
  }

  drawText(canvas, ctx, textItem.text, {
    x: textItem.x,
    y: textItem.y,
    textColor: textItem.textColor || '#0033ff',
    align: textItem.align,
    font: resolveFont(FONTS, 24, textItem),
    strokeLine: textItem.strokeLine,
    strokeColor: textItem.textColor,
    textMaxWidth: textItem.textMaxWidth,
    textWidth: textItem.textWidth
  });
};

export async function drawQrCodeStandard(
  qrcodeContent,
  ctx,
  x = 0,
  y = 0,
  width = 120
) {
  // ration: 120/148 of QR Standard
  const logoPath = path.join(process.cwd(), 'assets', 'qr-bg-v2.png');
  const qrcodeLogoImage = await loadImage(logoPath);
  const gapSize = (width * 10) / 120; //
  const qrcodeSize = width - gapSize * 2; // exclude margin x,y
  const height = (width * 148) / 120;
  ctx.drawImage(qrcodeLogoImage, x, y, width, height);
  const qrcodeBuffer = await QRCode.toBuffer(qrcodeContent, {
    margin: 0,
    width: qrcodeSize
  });
  const qrcodeImage = await loadImage(qrcodeBuffer);
  ctx.drawImage(qrcodeImage, x + gapSize, y + gapSize);
}
function resolveFont(defaultFont, defaultSize, text) {
  const space = ' ';
  let font = '';
  const fontName = text.textFont ? text.textFont : defaultFont;

  font += text.textStyle ? text.textStyle + space : '';
  font += text.textSize ? text.textSize : defaultSize;
  font += 'px' + space;
  font += fontName;

  return font;
}
