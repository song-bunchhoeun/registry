import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createMOCCertificateOfIncorporation(certificateInfo = {}, qrcodeContent) {
    const DATA = {
        BACKGROUND: 'moc-certificate-of-incorporation.png',
        FONTS: [
            { name: 'Khmer OS Muol Light', filename: 'KhmerOSmuollight.ttf' },
            { name: 'Khmer OS Siemreap', filename: 'KhmerOSsiemreap.ttf' },
            { name: 'Times New Roman', filename: 'times.ttf' },
        ],
        TEXTS: [
            {
                key: 'certificate.nameKm',
                dataKeys: [''],
                text: ':',
                textSize: 22,
                textFont: { name: 'Khmer OS Siemreap' },
                textColor: '#000000',
                textStyle: '600',
                x: 664,
                y: 550 + 20,
                align: 'left',
            },
            {
                key: 'certificate.name',
                dataKeys: [''],
                text: ':',
                textSize: 22,
                textFont: { name: 'Khmer OS Siemreap' },
                textColor: '#000000',
                textStyle: '600',
                x: 664,
                y: 600 + 18,
                align: 'left',
            },
            {
                key: 'certificate.registrationNumber',
                dataKeys: [''],
                text: ':',
                textSize: 22,
                textFont: { name: 'Khmer OS Siemreap' },
                textColor: '#000000',
                textStyle: '600',
                x: 664,
                y: 656 + 20,
                align: 'left',
            },
            {
                key: 'certificate.registrationNumber',
                dataKeys: [''],
                text: ':',
                textSize: 22,
                textFont: { name: 'Khmer OS Siemreap' },
                textColor: '#000000',
                textStyle: '600',
                x: 664,
                y: 705 + 20,
                align: 'left',
            },
            {
                key: 'certificate.incorporationDateKm',
                dataKeys: [''],
                text: ':',
                textSize: 22,
                textFont: { name: 'Khmer OS Siemreap' },
                textColor: '#000000',
                textStyle: '600',
                x: 664,
                y: 770 + 16,
                align: 'left',
            },
            {
                key: 'certificate.incorporationDateEn',
                dataKeys: [''],
                text: ':',
                textSize: 22,
                textFont: { name: 'Khmer OS Siemreap' },
                textColor: '#000000',
                textStyle: '600',
                x: 664,
                y: 811 + 20,
                align: 'left',
            },
            {
                key: 'certificate.incorporationTypeKm',
                dataKeys: [''],
                text: ':',
                textSize: 22,
                textFont: { name: 'Khmer OS Siemreap' },
                textColor: '#000000',
                textStyle: '600',
                x: 664,
                y: 872 + 16,
                align: 'left',
            },
            {
                key: 'certificate.incorporationType',
                dataKeys: [''],
                text: ':',
                textSize: 22,
                textFont: { name: 'Khmer OS Siemreap' },
                textColor: '#000000',
                textStyle: '600',
                x: 664,
                y: 916 + 20,
                align: 'left',
            },

            // TEXT
            {
                key: 'certificate.number',
                dataKeys: ['certificate.number'],
                text: 'លេខ(No) {certificate.number}',
                textSize: 24,
                textFont: { name: 'Khmer OS Siemreap' },
                textColor: '#000000',
                textStyle: '600',
                x: 321,
                y: 412 + 18,
                align: 'center',
            },
            {
                key: 'certificate.nameKm',
                dataKeys: ['certificate.nameKm'],
                text: '{certificate.nameKm}',
                textSize: 22,
                textFont: { name: 'Khmer OS Muol Light' },
                textColor: '#000000',
                x: 730,
                y: 550 + 22,
                align: 'left',
            },
            {
                key: 'certificate.name',
                dataKeys: ['certificate.name'],
                text: '{certificate.name}',
                textSize: 22,
                textFont: { name: 'Times New Roman' },
                textColor: '#000000',
                textStyle: '600',
                x: 730,
                y: 600 + 18,
                align: 'left',
            },
            {
                key: 'certificate.registrationNumberKm',
                dataKeys: ['certificate.registrationNumberKm'],
                text: '{certificate.registrationNumberKm}',
                textSize: 22,
                textFont: { name: 'Khmer OS Siemreap' },
                textColor: '#000000',
                textStyle: '600',
                x: 730,
                y: 656 + 22,
                align: 'left',
            },
            {
                key: 'certificate.registrationNumber',
                dataKeys: ['certificate.registrationNumber'],
                text: '{certificate.registrationNumber}',
                textSize: 22,
                textFont: { name: 'Khmer OS Siemreap' },
                textColor: '#000000',
                textStyle: '600',
                x: 730,
                y: 705 + 22,
                align: 'left',
            },
            {
                key: 'certificate.incorporationDateKm',
                dataKeys: ['certificate.incorporationDateKm'],
                text: '{certificate.incorporationDateKm}',
                textSize: 22,
                textFont: { name: 'Khmer OS Siemreap' },
                textColor: '#000000',
                textStyle: '600',
                x: 730,
                y: 770 + 20,
                align: 'left',
            },
            {
                key: 'certificate.incorporationDateEn',
                dataKeys: ['certificate.incorporationDateEn'],
                text: '{certificate.incorporationDateEn}',
                textSize: 22,
                textFont: { name: 'Khmer OS Siemreap' },
                textColor: '#000000',
                textStyle: '600',
                x: 730,
                y: 811 + 22,
                align: 'left',
            },
            {
                key: 'certificate.incorporationTypeKm',
                dataKeys: ['certificate.incorporationTypeKm'],
                text: '{certificate.incorporationTypeKm}',
                textSize: 22,
                textFont: { name: 'Khmer OS Siemreap' },
                textColor: '#000000',
                textStyle: '600',
                x: 730,
                y: 872 + 18,
                align: 'left',
            },
            {
                key: 'certificate.incorporationType',
                dataKeys: ['certificate.incorporationType'],
                text: '{certificate.incorporationType}',
                textSize: 22,
                textFont: { name: 'Times New Roman' },
                textColor: '#000000',
                textStyle: '600',
                x: 730,
                y: 916 + 18,
                align: 'left',
            },
            {
                key: 'certificate.signatureDateKm',
                dataKeys: ['certificate.signatureDateKm'],
                text: 'រាជធានីភ្នំពេញ, {certificate.signatureDateKm}',
                textSize: 22,
                textFont: { name: 'Khmer OS Siemreap' },
                textColor: '#000000',
                textStyle: '600',
                x: 1596,
                y: 916,
                align: 'center',
            },
            {
                key: 'certificate.signatureDateEn',
                dataKeys: ['certificate.signatureDateEn'],
                text: 'PHNOM PENH, {certificate.signatureDateEn}',
                textSize: 18,
                textFont: { name: 'Times New Roman' },
                textColor: '#000000',
                textStyle: '600',
                x: 1596,
                y: 948,
                align: 'center',
            },
        ],
        QRCODE: { width: 160, height: 197.33333333333334, x: 900, y: 1035 },
    };

    const bg = await createTemplateImage(DATA.BACKGROUND);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);

    for (const text of DATA.TEXTS) {
        if (text.dataKeys && text.dataKeys.length > 0) {
            for (const key of text.dataKeys) text.text = text.text.replace(`{${key}}`, _.get(certificateInfo, key, ''));
        }

        drawText(canvas, ctx, text.text, {
            y: text.y,
            x: text.x,
            textColor: text.textColor || '#000000',
            align: text.align,
            font: resolveFont(DATA.FONTS[0].name, 24, text),
        });
    }
    if (qrcodeContent) {
        const qrX = bg.width / 2 - DATA.QRCODE.width / 2 + 32;
        await drawQrCodeStandard(qrcodeContent, ctx, qrX, DATA.QRCODE.y, DATA.QRCODE.width);
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
    const logoPath = path.join(process.cwd(), 'assets', 'certificate-bacii-qrcode-logo.png');
    return loadImage(logoPath);
}

function resolveFont(defaultFont, defaultSize, text) {
    const space = ' ';
    let font = '';
    const fontName = text.textFont.name ? text.textFont.name : defaultFont;

    font += text.textStyle ? text.textStyle + space : '';
    font += text.textSize ? text.textSize : defaultSize;
    font += 'px' + space;
    font += fontName;

    return font;
}
