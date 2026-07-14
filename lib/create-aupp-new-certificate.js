import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createAUPPNewCertificateCanvas(certificateInfo = {}, qrcodeContent) {
    const AUPP_TEXT_COLORS = {
        black: '#000000',
    };

    const AUPP_FONTS = {
        primary: 'DS CaslonGotisch'
    };

    const AUPP_TEMPLATE_IMAGE = 'aupp-new-background.jpg'
    let AUPP_TEXTS = [
        {
            dataKeys: ['recipient.name'],
            text: '{recipient.name}',
            textSize: 190,
            textFont: AUPP_FONTS.primary,
            y: 838,
            textColor: AUPP_TEXT_COLORS.black,
            align: 'center',
        },
        {
            dataKeys: ['certificate.degree'],
            text: '{certificate.degree}',
            textSize: 160,
            textFont: AUPP_FONTS.primary,
            textColor: AUPP_TEXT_COLORS.black,
            y: 1305.9,
            align: 'center',
        },
        {
            dataKeys: ['certificate.major'],
            text: '{certificate.major}',
            textSize: 95,
            textFont: AUPP_FONTS.primary,
            textColor: AUPP_TEXT_COLORS.black,
            y: 1497,
            align: 'center',
        },
        {
            dataKeys: ['certificate.signatureDate'],
            text: 'this {certificate.signatureDate}.',
            textSize: 71,
            textFont: AUPP_FONTS.primary,
            textColor: AUPP_TEXT_COLORS.black,
            y: 2053,
            align: 'center'
        },
    ];

    if (certificateInfo.certificate.minor && certificateInfo.certificate.minor !== "null") {
        AUPP_TEXTS.push(
            {
                dataKeys: ['certificate.minor'],
                text: 'Minor in {certificate.minor}',
                textFont: AUPP_FONTS.primary,
                textColor: AUPP_TEXT_COLORS.black,
                textSize: 95,
                y: 1707,
                align: 'center',
            })
    }
    if (certificateInfo.certificate.honor && certificateInfo.certificate.honor !== "null") {
        AUPP_TEXTS.push(
            {
                dataKeys: ['certificate.honor'],
                text: '{certificate.honor}',
                textSize: 71,
                textFont: AUPP_FONTS.primary,
                textColor: AUPP_TEXT_COLORS.black,
                y: 2232.3,
                align: 'center'
            },)
    }
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

        await drawQrCodeStandard(qrcodeContent, ctx, 3298, 2370, 368);
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
