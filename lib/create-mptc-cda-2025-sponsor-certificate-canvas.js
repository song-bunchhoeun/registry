import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createMPTCCda2025SponsorCertificateCanvas(
    certificateInfo = {},
    qrcodeContent
) {
    const MPTC_TEXT_COLORS = '#231D1F';

    const MPTC_FONTS = {
        semiBoldXH: 'Haffer-TRIAL',
        lightXH: 'Haffer SQ TRIAL'
    };

    const MPTC_TEMPLATE_IMAGE = 'mptc-cda-2025-certificate-signed.jpg';

    const MPTC_TEXTS = [
        {
            text: 'Certificate of Appreciation',
            textSize: 170 - 5,
            textColor: MPTC_TEXT_COLORS,
            y: 1103.5,
            align: 'center',
            textFont: MPTC_FONTS.semiBoldXH
        },
        {
            text: 'This Certificate is Presented to',
            textSize: 92,
            textColor: MPTC_TEXT_COLORS,
            y: 1252,
            align: 'center',
            textFont: MPTC_FONTS.lightXH,
            textStyle: 'bold'
        },
        {
            dataKeys: ['recipient.name'],
            text: '{recipient.name}',
            textSize: 110,
            textColor: MPTC_TEXT_COLORS,
            y: 1632.5,
            align: 'center',
            textFont: MPTC_FONTS.semiBoldXH
        },
        {
            dataKeys: ['certificate.role'],
            text: '{certificate.role}',
            textSize: 80,
            textColor: MPTC_TEXT_COLORS,
            y: 1972,
            align: 'center',
            textFont: MPTC_FONTS.lightXH,
            textStyle: 'bold'
        },
        {
            dataKeys: ['certificate.eventName'],
            text: '{certificate.eventName}',
            textSize: 105,
            textColor: MPTC_TEXT_COLORS,
            y: 2082.5,
            align: 'center',
            textFont: MPTC_FONTS.lightXH,
            textStyle: 'bold'
        },
        {
            dataKeys: ['certificate.issuedDate'],
            text: '{certificate.issuedDate}',
            textSize: 60,
            textColor: MPTC_TEXT_COLORS,
            y: 2546,
            align: 'center',
            textFont: MPTC_FONTS.semiBoldXH
        }
    ];

    const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);

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
        await drawQrCodeStandard(qrcodeContent, ctx, 1960, 2833.5, 322);
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
