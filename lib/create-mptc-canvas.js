import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createMPTCCertCanvas(certificateInfo = {}, qrcodeContent) {
    const MPTC_TEXT_COLORS = {
        black: '#000000',
        blue: '#014283',
    };

    const MPTC_FONTS = {
        primary: 'Khmer OS Muol Light',
        secondary: 'NiDA Sowannaphum',
        thirdly: 'NiDA Funan',
        fouthly: 'Google Sans Bold',
        fifthly: 'Google Sans Medium',
        sixly: 'Arial'
    };

    const MPTC_TEMPLATE_IMAGE = qrcodeContent ? 'certificate-mptc-recognition-with-qr.png' : 'certificate-mptc-recognition-no-qr.png';

    const MPTC_TEXTS = [
        {
            dataKeys: ['recipient.name'],
            text: '{recipient.name}',
            textSize: 32,
            textStyle: 'bold',
            textColor: MPTC_TEXT_COLORS.blue,
            y: 1000,
            align: 'center',
            textFont: MPTC_FONTS.primary
        },
        {
            dataKeys: ['recipient.nameEn'],
            text: '{recipient.nameEn}',
            textSize: 32,
            textColor: MPTC_TEXT_COLORS.blue,
            textStyle: 'bold',
            y: 1255,
            align: 'center',
            textFont: MPTC_FONTS.fouthly
        },
        {
            dataKeys: ['certificate.prize'],
            text: '{certificate.prize}',
            textSize: 32,
            textStyle: 'bold',
            x: 630,
            y: 1313,
            align: 'left',
            textFont: MPTC_FONTS.fouthly
        },
        {
            dataKeys: ['certificate.prizeKh'],
            text: '{certificate.prizeKh}',
            textSize: 28,
            x: 700,
            y: 1060,
            align: 'left',
            textFont: MPTC_FONTS.primary
        },
        {
            dataKeys: ['certificate.number'],
            text: '{certificate.number}',
            textSize: 24,
            textStyle: 'bold',
            textColor: MPTC_TEXT_COLORS.blue,
            x: 266,
            y: 1892,
            align: 'left',
            textFont: MPTC_FONTS.fifthly
        },
    ];

    const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);
    // Draw Caption 
    
    for (const text of MPTC_TEXTS) {
        if (text.dataKeys && text.dataKeys.length > 0) {
            for (const key of text.dataKeys) text.text = text.text.replace(`{${key}}`, _.get(certificateInfo, key, ''));
        }

        drawText(canvas, ctx, text.text, {
            x: text.x,
            y: text.y,
            textColor: text.textColor || MPTC_TEXT_COLORS.black,
            align: text.align,
            font: resolveFont(MPTC_FONTS.primary, 24, text),
        });
    }

    if (qrcodeContent) {
        const qrcodeSize = 174;
        const gapSize = 18;
        const qrcodeBuffer = await QRCode.toBuffer(qrcodeContent, { margin: 0, width: qrcodeSize });
        const qrcodeImage = await loadImage(qrcodeBuffer);
        const qrcodeCoordinate = [1025, 1644]
        ctx.drawImage(qrcodeImage, qrcodeCoordinate[0], qrcodeCoordinate[1]);
    }
    return canvas;
}
export async function createQRCodeLogoImage() {
    const logoPath = path.join(process.cwd(), 'assets', 'certificate-bacii-qrcode-logo.png');
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
    const fontName = text.textFont ? text.textFont : defaultFont;

    font += text.textStyle ? text.textStyle + space : '';
    font += text.textSize ? text.textSize : defaultSize;
    font += 'px' + space;
    font += fontName;

    return font;
}
