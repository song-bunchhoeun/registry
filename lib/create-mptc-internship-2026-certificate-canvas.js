import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createMPTCInternship2026CertificateCanvas(
    certificateInfo = {},
    qrcodeContent
) {
    const MPTC_TEXT_COLORS = {
        black: '#000000',
        blue: '#1B4580',
    };

    const MPTC_FONTS = {
        muol: 'Khmer OS Muol Light',
        sowannaphum: 'NiDA Sowannaphum',
        google: 'Google Sans',
    };

    const MPTC_TEMPLATE_IMAGE =
        'mptc-internship-2026-pdf-background.jpg';

    const MPTC_TEXTS = [
        {
            dataKeys: ['recipient.nameKm'],
            text: '{recipient.nameKm}',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.blue,
            y: 1498,
            align: 'center',
            textFont: MPTC_FONTS.muol
        },
        {
            dataKeys: ['recipient.university'],
            text: '{recipient.university}',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,
            y: 1595,
            align: 'center',
            textFont: MPTC_FONTS.sowannaphum
        },
        {
            dataKeys: ['certificate.dateKm'],
            text: '{certificate.dateKm} ប្រាកដមែន។',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,
            y: 1764,
            align: 'center',
            textFont: MPTC_FONTS.sowannaphum
        },
        {
            dataKeys: ['recipient.name'],
            text: '{recipient.name}',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.blue,
            y: 2034,
            align: 'center',
            textStyle: 'bold',
            textFont: MPTC_FONTS.google
        },
        {
            dataKeys: ['recipient.universityKm'],
            text: '{recipient.universityKm}',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,
            y: 2125,
            align: 'center',
            strokeLine: 0.7,
            strokeColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.google
        },
        {
            dataKeys: ['certificate.date'],
            text: '{certificate.date}.',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,
            y: 2291,
            align: 'center',
            strokeLine: 0.7,
            strokeColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.google
        },

        {
            dataKeys: ['certificate.signatureLunarDateKm'],
            text: '{certificate.signatureLunarDateKm}',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,
            y: 2466,
            align: 'center',
            textFont: MPTC_FONTS.sowannaphum
        },
        {
            dataKeys: ['certificate.signatureDateKm'],
            text: '{certificate.signatureDateKm}',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,
            y: 2542,
            align: 'center',
            textFont: MPTC_FONTS.sowannaphum
        },
        {
            dataKeys: ['certificate.signatureDate'],
            text: '{certificate.signatureDate}',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,
            y: 2622,
            align: 'center',
            textStyle: 'medium',
            strokeLine: 0.7,
            strokeColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.google
        }
    ];

    const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);

    // Draw Caption
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
            font: resolveFont(MPTC_FONTS.sowannaphum, 24, text),
            strokeLine: text.strokeLine,
            strokeColor: text.strokeColor,
        });
    }

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 1936, 2916, 270);
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
