import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createMPTCCyberIncidentResponseCertificateCanvas(
    certificateInfo = {},
    qrcodeContent
) {
    const MPTC_TEXT_COLORS = {
        blue: '#004282'
    };

    const MPTC_FONTS = {
        khmerDigital: 'Khmer Digital',
    };
    const MPTC_TEMPLATE_IMAGE = 'mptc-certificate-workshop-cyber.jpg';

    let MPTC_TEXTS = [
        {
            dataKeys: ['recipient.name'],
            text: '{recipient.name}',
            textSize: 146,
            textColor: MPTC_TEXT_COLORS.blue,
            y: 1228,
            align: 'center',
            textStyle: '800',
            textFont: MPTC_FONTS.khmerDigital,
        },
    ];

    const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);

    for (const text of MPTC_TEXTS) {
        const value = _.get(certificateInfo, text.key, '');
        if (value !== 'null' && value !== null) {
            if (text.dataKeys && text.dataKeys.length > 0) {
                for (const key of text.dataKeys)
                    text.text = text.text.replace(
                        `{${key}}`,
                        _.get(certificateInfo, key, '')
                    );
            }

            if (text.text === 'null' || text.text === null) continue;

            drawText(canvas, ctx, text.text, {
                x: text.x,
                y: text.y,
                textColor: text.textColor || MPTC_TEXT_COLORS.blue,
                align: text.align,
                font: resolveFont(MPTC_FONTS.khmerDigital, 24, text)
            });
        }
    }

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 2883, 1773, 336);
    } else {
        const qrBlank = await loadImage(
            path.join(process.cwd(), "assets", "qr-bg-v2-sample.png")
        );
        if (qrBlank) {
            ctx.drawImage(qrBlank, 2883, 1773, 336, 414.4);
        }
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
