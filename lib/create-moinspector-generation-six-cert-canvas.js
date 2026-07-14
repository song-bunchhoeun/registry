import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText, loadRemoteResource } from './shared';
import QRCode from 'qrcode';
import _, { indexOf } from 'lodash';

export async function createMoinspectorGenerationSixCertCanvas(certificateInfo = {}, qrcodeContent) {
  const COLORS = {
    black: '#000000',
    blue: '#0033ff',
  };
  const DATA = {
    BACKGROUND: {
      pngFilename: 'moinspector-training-2024-no-stamp.jpg',
      width: 2480,
      height: 3508,
      size: [2480, 3508],
    },
    FONTS: [
      {
        name: 'Baskerville Old Face',
        filename: 'BASKVILL.TTF',
      },
      {
        name: 'Khmer OS Muol Light',
        filename: 'KhmerOSmuollight.ttf',
      },
      {
        name: 'Khmer OS Siemreap',
        filename: 'KhmerOSsiemreap.ttf',
      },
    ],
    TEXTS: [
      {
        dataKeys: [],
        text: 'បញ្ជាក់ថា',
        textFont: { name: 'Khmer OS Siemreap' },
        textSize: 57,
        textColor: COLORS.blue,
        x: 388,
        y: 1544 - 53,
        align: 'left',
      },
      {
        dataKeys: [],
        text: 'ជាអក្សរឡាតាំង',
        textFont: { name: 'Khmer OS Siemreap' },
        textSize: 57,
        textColor: COLORS.blue,
        x: 1272,
        y: 1544 - 53,
        align: 'left',
      },
      {
        dataKeys: ['certificate.number'],
        text: 'លេខ: {certificate.number}',
        textFont: { name: 'Khmer OS Siemreap' },
        textSize: 55,
        textColor: '#ff0000',
        x: 1240.5,
        y: 2199.25 - 7,
        align: 'center',
      },
      {
        dataKeys: ['certificate.signatureLunarDateKm'],
        text: '{certificate.signatureLunarDateKm}',
        textFont: { name: 'Khmer OS Siemreap' },
        textSize: 55,
        textColor: COLORS.blue,
        x: 1240.5,
        y: 2314 - 7,
        align: 'center',
      },
      {
        dataKeys: ['certificate.signatureDateKm'],
        text: '{certificate.signatureDateKm}',
        textFont: { name: 'Khmer OS Siemreap' },
        textSize: 55,
        textColor: COLORS.blue,
        x: 1240.5,
        y: 2428.5 - 7,
        align: 'center',
      }

    ],
    QRCODE: {
      width: 218,
      height: 260,
      x: 2132,
      y: 3155,
    },
  };

  const bg = await createTemplateImage(DATA.BACKGROUND.pngFilename);
  const canvas = createCanvas(DATA.BACKGROUND.width, DATA.BACKGROUND.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bg, 0, 0);

  // custom dateofbirth
  const splitted = _.get(certificateInfo, 'recipient.dateOfBirthKm', '').split(' ');
  if (splitted[0][0] === '០' || splitted[0][0] === '0') {
    splitted[0] = splitted[0].replace('០', '');
    splitted[0] = splitted[0].replace('0', '');
  }

  const dateTexts = [
    {
      dataKeys: ['recipient.genderKm'],
      text: 'ភេទ   {recipient.genderKm}',
      textFont: { name: 'Khmer OS Siemreap' },
      textSize: 57,
      textColor: COLORS.blue,
      x: 240,
      y: 1613.5 - 7,
      align: 'left',
    },
    {
      dataKeys: [],
      text: 'កើតថ្ងៃទី',
      textFont: { name: 'Khmer OS Siemreap' },
      textSize: 57,
      textColor: COLORS.blue,
      // x: 240,
      addX: 75,
      y: 1613.5 - 7,
      align: 'left',
    },
    {
      dataKeys: [],
      text: splitted[0],
      textFont: { name: 'Khmer OS Siemreap' },
      textSize: 57,
      textColor: COLORS.blue,
      addX: 0,
      y: 1610 - 5,
      align: 'left',
    },
    {
      dataKeys: [],
      text: 'ខែ' + splitted[1],
      textFont: { name: 'Khmer OS Siemreap' },
      textSize: 57,
      textColor: COLORS.blue,
      y: 1610 - 5,
      addX: 60,
    },
    {
      dataKeys: [],
      text: 'ឆ្នាំ' + splitted[2],
      textFont: { name: 'Khmer OS Siemreap' },
      textSize: 57,
      textColor: COLORS.blue,
      y: 1610 - 5,
      addX: 50,
    },
  ];

  DATA.TEXTS.push(dateTexts);

  // custom name + title
  const nameKm = _.get(certificateInfo, 'recipient.nameKm', '');
  const splittedNameKm = nameKm.split(' ');
  let title = splittedNameKm[0];
  const titles = ['លោក', 'លោកស្រី', 'ឯកឧត្តម'];
  // nameKM with Title
  let centerX = 934;
  let nameKmMaxWidth = 664;
  if (titles.indexOf(title) > -1) {
    let textWidth = 0;
    let titleTextItem = {
      dataKeys: [],
      text: title + ' ',
      textFont: { name: 'Khmer OS Siemreap' },
      textSize: 57,
      textColor: COLORS.blue,
      x: 954,
      y: 1498 - 7,
      align: 'left',
    };

    if (certificateInfo.recipient.nameKm === 'លោកស្រី ជានីរ័ត្ន ឧត្តមលាភីធីតា') {
      centerX = 873
      DATA.TEXTS[0].x = 287.7;
      DATA.TEXTS[0].textSize = 52;
      DATA.TEXTS[1].x = 1269
      DATA.TEXTS[1].textSize = 52;
      titleTextItem.textSize = 52
      nameKmMaxWidth = 754
    }
    let titleWidth = getTextMaxWidth(ctx, titleTextItem).width;

    const name = splittedNameKm.slice(1).join(' ')
    const nameTextItem = {
      dataKeys: [],
      text: name,
      textFont: { name: 'Khmer OS Muol Light' },
      textSize: 57,
      textColor: COLORS.blue,
      x: 954,
      y: 1498 - 7,
      align: 'left',
    };
    let nameWidth = getTextMaxWidth(ctx, nameTextItem).width;

    textWidth = titleWidth + nameWidth;

    if (textWidth > nameKmMaxWidth) {
      nameTextItem.textSize -= 6;

      titleWidth = getTextMaxWidth(ctx, titleTextItem).width;
      nameWidth = getTextMaxWidth(ctx, nameTextItem).width;

      textWidth = titleWidth + nameWidth + 10;
    }

    const titleX = centerX - textWidth / 2;
    const nameX = titleX + titleWidth;
    titleTextItem.x = titleX;
    nameTextItem.x = nameX;

    DATA.TEXTS.push(titleTextItem, nameTextItem);
  } else {
    // nameKm without Title
    DATA.TEXTS.push({
      dataKeys: ['recipient.nameKm'],
      text: '{recipient.nameKm}',
      textFont: { name: 'Khmer OS Muol Light' },
      textSize: 57,
      textColor: COLORS.blue,
      x: 954,

      y: 1498 - 7,
      align: 'center',
    });
  }

  // nameEn
  const nameEn = _.get(certificateInfo, 'recipient.name', '');
  let nameEnItem = {
    dataKeys: [],
    text: nameEn,
    textFont: { name: 'Baskerville Old Face' },
    textSize: 55,
    textColor: COLORS.blue,
    x: 2236,
    y: 1497 - 7,
    align: 'right',
    textWidth: 0,
    textMaxWidth: 0
  };
  let nameEnMaxWidth = 600
  if (certificateInfo.recipient.nameKm === 'លោកស្រី ជានីរ័ត្ន ឧត្តមលាភីធីតា') {
    nameEnItem.x = 2394
    nameEnMaxWidth = 813
    nameEnItem.textSize = 52
    nameEnItem.textMaxWidth = 813
    nameEnItem.x += 60
  }
  let nameEnWidth = getTextMaxWidth(ctx, nameEnItem).width;

  nameEnItem.textWidth = nameEnWidth;

  if (nameEnWidth > nameEnMaxWidth) {
    nameEnItem.textSize -= 4;
    nameEnWidth = getTextMaxWidth(ctx, nameEnItem).width;
    nameEnItem.textWidth = nameEnWidth;
  }


  DATA.TEXTS.push(nameEnItem);



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
  if (certificateInfo.certificate.photoUrl) {
    const profileImage = await loadRemoteResource(certificateInfo, certificateInfo.certificate.photoUrl)
    if (profileImage) {
      const profileMaxWidth = 300;
      const profileHeight = profileMaxWidth / (profileImage.width / profileImage.height);
      const profileX = 1060;
      const profileY = 1119;
      ctx.drawImage(profileImage, profileX, profileY, profileMaxWidth, profileHeight);
    }
  }

  return canvas;
}

const getTextMaxWidth = (ctx, textItem) => {
  ctx.font = resolveFont(textItem.textFont, 24, textItem);
  return ctx.measureText(textItem.text);
};

const drawTextItem = (canvas, ctx, textItem, FONTS, certificateInfo) => {
  if (textItem.dataKeys && textItem.dataKeys.length > 0) {
    for (const key of textItem.dataKeys)
      textItem.text = textItem.text.replace(`{${key}}`, _.get(certificateInfo, key, ''));
  }

  drawText(canvas, ctx, textItem.text, {
    x: textItem.x,
    y: textItem.y + 60 - 7,
    textColor: textItem.textColor || '#0033ff',
    align: textItem.align,
    font: resolveFont(FONTS[0].name, 24, textItem),
    strokeLine: 1,
    strokeColor: '#0033ff',
    textMaxWidth: textItem.textMaxWidth,
    textWidth: textItem.textWidth,
  });
};

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
