import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';
import {drawWrapTexts} from "./create-biu-np-bachelor-certificate";

export async function createMptcDslpTrainingCertificate(
    certificateInfo = {},
    qrcodeContent
) {
    const MPTC_TEXT_COLORS = {
        black: '#070707',
        blue: '#1b609b'
    };

    const MPTC_FONTS = {
        primary: 'Khmer OS Muol Light',
        secondary: 'Google Sans',
        thirdly: 'NiDA Sowannaphum'
    };
    const MPTC_TEMPLATE_IMAGE = 'mptc-dslp-training-of-trainers-certificate.jpg';

    const MPTC_TEXTS = [
        {
            dataKeys: ['recipient.nameKm'],
            text: '{recipient.nameKm}',
            textSize: 50,
            textStyle: 'nomal',
            textColor: MPTC_TEXT_COLORS.blue,
            y: 1553.2,
            align: 'center',
            textFont: MPTC_FONTS.primary
        },
        {
            dataKeys: ['recipient.name'],
            text: '{recipient.name}',
            textSize: 60,
            textColor: MPTC_TEXT_COLORS.blue,
            y: 2055.2,
            align: 'center',
            textStyle: 'bold',
            textFont: MPTC_FONTS.secondary
        }
    ];

    const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);
    // Draw Caption

    const drawDateLocationKm = drawWrapTexts(ctx, {
        top: 1830,
        left: 0,
        width: 2479,
        textAlignment: 'center',
        lineHeight: 1,
        spans: [
            {
                text: certificateInfo.certificate.dateKm + ` នៅ` + certificateInfo.certificate.locationKm + `។`,
                fontSize: 50,
                fontFamily: MPTC_FONTS.thirdly,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontWeight: '500'
            }
        ]
    })
    drawDateLocationKm.draw();

    const drawDateLocation = drawWrapTexts(ctx, {
        top: 2323.7,
        left: 0,
        width: 2479,
        textAlignment: 'center',
        lineHeight: 1,
        spans: [
            {
                text: certificateInfo.certificate.date + ` at the ` + certificateInfo.certificate.location + `.`,
                fontSize: 50,
                fontFamily: MPTC_FONTS.secondary,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontWeight: '500'
            }
        ]
    })
    drawDateLocation.draw();

    const drawLunarDateKm = drawWrapTexts(ctx, {
        top: 2454.2,
        left: 0,
        width: 2479,
        textAlignment: 'center',
        lineHeight: 1,
        spans: [
            {
                text: certificateInfo.certificate.ministerSignatureLunarDateKm,
                fontSize: 50,
                fontFamily: MPTC_FONTS.thirdly,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontWeight: '500'
            }
        ]
    })
    drawLunarDateKm.draw();

    const drawDateKm = drawWrapTexts(ctx, {
        top: 2541.3,
        left: 0,
        width: 2479,
        textAlignment: 'center',
        lineHeight: 1,
        spans: [
            {
                text: certificateInfo.certificate.ministerSignatureDateKm,
                fontSize: 50,
                fontFamily: MPTC_FONTS.thirdly,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontWeight: '500'
            }
        ]
    })
    drawDateKm.draw();

    const drawDate = drawWrapTexts(ctx, {
        top: 2629.8,
        left: 0,
        width: 2479,
        textAlignment: 'center',
        lineHeight: 1,
        spans: [
            {
                text: certificateInfo.certificate.ministerSignatureDate,
                fontSize: 50,
                fontFamily: MPTC_FONTS.secondary,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontWeight: '500'
            }
        ]
    })
    drawDate.draw();

    for (const text of MPTC_TEXTS) {
        if (text.dataKeys && text.dataKeys.length > 0) {
            for (const key of text.dataKeys)
                text.text = text.text.replace(
                    `{${key}}`,
                    _.get(certificateInfo, key, '')
                );
        }

        drawText(canvas, ctx, text.text, {
            x: text.x,
            y: text.y,
            textColor: text.textColor || '#000000',
            align: text.align,
            font: resolveFont(MPTC_FONTS.primary, 24, text)
        });
    }

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 1923.3, 2882.5, 300);
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
export async function createQRCodeLogoImage() {
    const logoPath = path.join(
        process.cwd(),
        'assets',
        'certificate-bacii-qrcode-logo.png'
    );
    return loadImage(logoPath);
}
// 'style size fontName' ex:'bold 20px Arial'
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
