import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createMptcGdaWorkshopStep32024Canvas(
    certificateInfo = {},
    qrcodeContent
) {
    const MPTC_TEXT_COLORS = {
        black: '#050708',
        blue: "#164582" 
    };

    const MPTC_FONTS = {
        khmerOsMoulLight: 'Khmer OS Muol Light',
        nidaSowannaphum: 'NiDA Sowannaphum',
        googleSans: 'Google Sans',
        googleSansMedium: 'Google Sans Medium'
    };
    const MPTC_TEMPLATE_IMAGE = 'certificate-mptc-workshop-participate.png'
    
    let thressHoldTextMaxWidth = 2090;

    let MPTC_TEXTS = [
        {
            dataKeys: ['recipient.nameKm'],
            text: '{recipient.nameKm}',
            textSize: 50,
            textStyle: 'nomal',
            textColor: MPTC_TEXT_COLORS.blue,
            y: 1507,
            align: 'center',
            textFont: MPTC_FONTS.khmerOsMoulLight,
            strokeLine: 0.1,
        },

        {
            dataKeys: ['recipient.name'],
            text: '{recipient.name}',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.blue,
            y:2032,
            align: 'center',
            textStyle: 'bold',
            textFont: MPTC_FONTS.googleSans,
            strokeLine: 0.1,
        },
        
        {
            dataKeys:  ['certificate.dateKm', 'certificate.locationKm'],
            text: `{certificate.dateKm} នៅ{certificate.locationKm}។`,
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,
            align: 'center',
            y: 1840,
            textStyle: 'medium',
            textFont: MPTC_FONTS.nidaSowannaphum,
            strokeLine: 0.1,
        },
        {
            dataKeys: ['certificate.date', 'certificate.location'],
            text: '{certificate.date} at {certificate.location}.',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,
            align: 'center',
            y: 2365, 
            textStyle: 'meduim',
            textFont: MPTC_FONTS.googleSans,
            strokeLine: 1,
        },
        {
            dataKeys: ['certificate.ministerSignatureLunarDateKm'],
            text: '{certificate.ministerSignatureLunarDateKm}',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,
            align: 'center',
            y: 2474,
            textFont: MPTC_FONTS.nidaSowannaphum,
            strokeLine: 0.1,
        },
        {
            dataKeys: ['certificate.ministerSignatureDateKm'],
            text: '{certificate.ministerSignatureDateKm}',
            textSize: 50,
            align: 'center',
            textColor: MPTC_TEXT_COLORS.black,
            y: 2561,
            textFont: MPTC_FONTS.nidaSowannaphum,
            strokeLine: 0.1,
        },
        {
            dataKeys: ['certificate.ministerSignatureDate'],
            text: '{certificate.ministerSignatureDate}',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,
            align: 'center',
            y: 2649,
            textFont: MPTC_FONTS.googleSans,
            strokeLine: 1,
        }
    ];

let positionLable = [
    {
        dataKeys: [],
        text: certificateInfo.recipient.position?.replaceAll('  ',' '),
        textSize: 50,
        textColor: MPTC_TEXT_COLORS.blue,
        y:2116,
        align: 'center',
        textStyle: 'bold',
        textFont: MPTC_FONTS.googleSans,
        x: 1239.5,
        strokeLine: 0.1,
    },
    {
        dataKeys: [],
        text: certificateInfo.recipient.positionKm,
        textSize: 50,
        textStyle: 'nomal',
        textColor: MPTC_TEXT_COLORS.blue,
        y: 1589,
        align: 'center',
        textFont: MPTC_FONTS.khmerOsMoulLight,
        x: 1239.5,
        strokeLine: 0.1,
    }

]


    const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);


    //  dynamic re-position  
    for (let i = 0; i < positionLable.length; i++) {
        let textWidth = getTextMaxWidth(ctx, positionLable[i]);
        if (textWidth.width > thressHoldTextMaxWidth) {
            positionLable[i].textMaxWidth = thressHoldTextMaxWidth;
            positionLable[i].x += (textWidth.width - thressHoldTextMaxWidth) / 2;
        }
    }
    MPTC_TEXTS= [...MPTC_TEXTS, positionLable]

    for (const text of MPTC_TEXTS) {
        if (text.length > 0) {
            for (const index in text) {
                const textItem = text[index];
                let lastItem;
                if (index > 0) lastItem = text[index - 1];

                if (!textItem.x) {
                    const lastFont = resolveFont(
                        MPTC_FONTS.khmerOsMoulLight,
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
                    MPTC_FONTS.khmerOsMoulLight,
                    certificateInfo
                );
            }
        } else drawTextItem(canvas, ctx, text,MPTC_FONTS.khmerOsMoulLight, certificateInfo);
    }


    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 1923, 2881, 297);
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
        y: textItem.y ,
        textColor: textItem.textColor || '#0033ff',
        align: textItem.align,
        font: resolveFont(FONTS[0].name, 24, textItem),
        strokeLine: textItem.strokeLine,
        strokeColor:  textItem.textColor,
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


const getTextMaxWidth = (ctx, textItem) => {
    ctx.font = resolveFont(textItem.textFont, 24, textItem);
    const kmTargetMatric = ctx.measureText(textItem.text);
    return kmTargetMatric;
};

