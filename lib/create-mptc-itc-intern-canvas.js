import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createMPTCitcInternCertCanvas(certificateInfo = {}, qrcodeContent) {
    const MPTC_TEXT_COLORS = {
        black: '#000000',
        blue: '#004282',
    };


    const MPTC_FONTS = {
        khmer_OS_muol_light: 'Khmer OS Muol Light',
        nida_sowannaphum: 'NiDA Sowannaphum',
        google_sans: 'Google Sans',
    };

    const MPTC_TEMPLATE_IMAGE = 'certificate-mptc-itc-intern-no-stamp.png';


    const MPTC_TEXTS = [
        {
            dataKeys: ['recipient.nameKm'],
            text: '{recipient.nameKm}',
            textSize: 50,
            textStyle: 'nomal',
            textColor: MPTC_TEXT_COLORS.blue,
            y: 1528,
            align: 'center',
            textFont: MPTC_FONTS.khmer_OS_muol_light
        },
        {
            dataKeys: ['recipient.name'],
            text: '{recipient.name}',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.blue,
            y: 2063,
            align: 'center',
            textStyle: 'bold',
            textFont: MPTC_FONTS.google_sans
        },
        {
            dataKeys: ['recipient.position'],
            text: '{recipient.position}',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,
            y: 2154,
            align: 'center',
            textStyle: 'bold',
            textFont: MPTC_FONTS.google_sans
        },
        {
            dataKeys: ['recipient.positionKm'],
            text: '{recipient.positionKm}',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,
            y: 1624,
            align: 'center',
            strokeLine: 0.1,
            strokeColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.nida_sowannaphum
        },
        {
            dataKeys: ['certificate.dateKm'],
            text: '{certificate.dateKm} ប្រាកដមែន។',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,
            y: 1793,
            align: 'center',
            textFont: MPTC_FONTS.nida_sowannaphum,
            strokeLine: 0.1,
            strokeColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.nida_sowannaphum
        },
        {
            dataKeys: ['certificate.date'],
            text: '{certificate.date}',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,
            y: 2322,
            align: 'center', 
            textStyle: 'bold',
            textFont: MPTC_FONTS.google_sans
        },
        {
            dataKeys: ['certificate.signatureLunarDateKm'],
            text: '{certificate.signatureLunarDateKm}',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,
            align: 'center',
            y: 2415,
            textFont: MPTC_FONTS.nida_sowannaphum,
        },
        {
            dataKeys: ['certificate.signatureDateKm'],
            text: '{certificate.signatureDateKm}',
            textSize: 50,
            align: 'center',
            textColor: MPTC_TEXT_COLORS.black,
            textStyle: 'medium',
            y: 2509,
            textFont: MPTC_FONTS.nida_sowannaphum,
        },
        {
            dataKeys: ['certificate.signatureDate'],
            text: '{certificate.signatureDate}',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,
            align: 'center',
            y: 2586,
            textStyle: 'bold',
            textFont: MPTC_FONTS.google_sans
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
            font: resolveFont(MPTC_FONTS.khmer_OS_muol_light, 24, text),
            strokeLine: text.strokeLine,
            strokeColor: text.strokeColor,
        });
    }

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 1940, 2920, 268);
    }
    return canvas;
}

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
export async function createQRCodeLogoImage() {
    const logoPath = path.join(process.cwd(), 'assets', 'certificate-bacii-qrcode-logo.png');
    return loadImage(logoPath);
}
function font(name = fontConfig.khmer_OS_muol_light, size = 20) {
    return `${size}px ${name}, sans-serif`;
}
function fontBold(name = fontConfig.khmer_OS_muol_light, size = 20) {
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