import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createAUPPPostgraduateCertificateCanvas(certificateInfo = {}, qrcodeContent) {
    const AUPP_TEXT_COLORS = {
        dark_blue: '#2B3462',
        blue: '#365CA4',
        black: '#000000',
    };

    const AUPP_FONTS = {
        oleo: 'Oleo Script',
        signika: 'Signika',
        montserrat: 'Montserrat'
    };

    const AUPP_TEMPLATE_IMAGE = 'aupp-postgraduation-background-pdf.jpg'

    let AUPP_TEXTS = [
        {
            dataKeys: ['recipient.name'],
            text: '{recipient.name}',
            textSize: 125,
            textFont: AUPP_FONTS.oleo,
            y: 1110,
            textColor: AUPP_TEXT_COLORS.dark_blue,
            align: 'center',
        },
        ...(certificateInfo.certificate?.courses || []).map((_, i) => ({
            dataKeys: [`certificate.courses[${i}].code`, `certificate.courses[${i}].name`],
            text: `{certificate.courses[${i}].code}: {certificate.courses[${i}].name}`,
            textSize: 57,
            textFont: AUPP_FONTS.signika,
            textColor: AUPP_TEXT_COLORS.blue,
            x: 1720,
            y: 1400 + (i * 78),
            textStyle: 'bold',
            align: 'center',
        })),
        {
            dataKeys: ['certificate.signatureDate'],
            text: '{certificate.signatureDate}',
            textSize: 50,
            textFont: AUPP_FONTS.montserrat,
            textColor: AUPP_TEXT_COLORS.black,
            y: 2017,
            textStyle: 'bold',
            align: 'center',
        },
    ];

    const bg = await createTemplateImage(AUPP_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);

    for (const text of AUPP_TEXTS) {
        if (text.dataKeys && text.dataKeys.length > 0) {
            for (const key of text.dataKeys) text.text = text.text.replace(`{${key}}`, _.get(certificateInfo, key, ''));
        }

        drawText(canvas, ctx, text.text, {
            y: text.y,
            x: text.x,
            textColor: text.textColor || AUPP_TEXT_COLORS.black,
            align: text.align,
            font: resolveFont(AUPP_FONTS.primary, 24, text),
        });
    }
    if (qrcodeContent) {

            await drawQrCodeStandard(qrcodeContent, ctx, 2939, 1800, 368);
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
