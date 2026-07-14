import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createMOPNSPParticipationCertificateCanvas(
    certificateInfo = {},
    qrcodeContent
) {
    const MOP_TEXT_COLORS = {
        black: '#000000',
    };

    const MOP_FONTS = {
        moul: 'Moul',
        noto_serif_khmer: 'Noto Serif Khmer',
        archivo_black: 'Archivo Black',
        ibm_plex_sans: 'IBM Plex Sans Bold',
        ibm_plex_serif: 'IBM Plex Serif'
    };
    
    const MOP_TEMPLATE_IMAGE = 'mop-nsps-participation-pdf-background.jpg';

    const MOP_TEXTS = [
        {
            dataKeys: ['recipient.nameKm'],
            text: '{recipient.nameKm}',
            textSize: 115,
            textColor: MOP_TEXT_COLORS.black,
            y: 1240,
            align: 'center',
            textFont: MOP_FONTS.moul
        },
        {
            dataKeys: ['certificate.courseKm'],
            text: '"{certificate.courseKm}"',
            textSize: 80,
            textColor: MOP_TEXT_COLORS.black,
            y: 1508,
            align: 'center',
            textStyle: 'bold',
            textFont: MOP_FONTS.noto_serif_khmer
        },
        {
            dataKeys: ['certificate.dateKm'],
            text: 'ចាប់ពី{certificate.dateKm}',
            textSize: 70,
            textColor: MOP_TEXT_COLORS.black,
            y: 1635,
            align: 'center',
            textFont: MOP_FONTS.noto_serif_khmer
        },
        {
            dataKeys: ['recipient.name'],
            text: '{recipient.name}',
            textSize: 95,
            textColor: MOP_TEXT_COLORS.black,
            y: 1917,
            align: 'center',
            textFont: MOP_FONTS.archivo_black
        },
        {
            dataKeys: ['certificate.course'],
            text: '\u201C{certificate.course}\u201D',
            textSize: 80,
            textColor: MOP_TEXT_COLORS.black,
            y: 2165,
            align: 'center',
            textStyle: 'bold',
            textFont: MOP_FONTS.ibm_plex_sans
        },
        {
            dataKeys: ['certificate.date'],
            text: 'from {certificate.date}',
            textSize: 64,
            textColor: MOP_TEXT_COLORS.black,
            y: 2288,
            align: 'center',
            textFont: MOP_FONTS.ibm_plex_serif
        },
        {
            dataKeys: ['certificate.signatureDateKm'],
            text: '{certificate.signatureDateKm}',
            textSize: 70,
            textColor: MOP_TEXT_COLORS.black,
            align: 'center',
            y: 2435,
            textFont: MOP_FONTS.noto_serif_khmer
        },
        {
            dataKeys: ['certificate.signatureDate'],
            text: '{certificate.signatureDate}',
            textSize: 65,
            textColor: MOP_TEXT_COLORS.black,
            align: 'center',
            y: 2542,
            textFont: MOP_FONTS.ibm_plex_serif
        },
    ];

    const bg = await createTemplateImage(MOP_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);
    // Draw Caption

    for (const text of MOP_TEXTS) {
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
            font: resolveFont(MOP_FONTS.moul, 24, text)
        });
    }

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 1882, 2829, 280);
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
