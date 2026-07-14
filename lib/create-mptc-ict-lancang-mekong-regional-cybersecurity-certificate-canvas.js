import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText, drawWrapTexts } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createMPTCICTLancangRegionalCybersecurityCertificateCanvas(
    certificateInfo = {},
    qrcodeContent
) {
    const MPTC_TEXT_COLORS = {
        orange: '#F48120',
        blue: '#004281',
        white: '#FFFFFF'
    };

    const MPTC_FONTS = {
        rajdhani: 'Rajdhani',
        khmerDigital: 'Khmer Digital',
    };

    const MPTC_TEMPLATE_IMAGE = 'mptc-ict-lancang-mekong-forum-bg.jpg';

    const isSpeaker = _.get(certificateInfo, 'certificate.type', '').toLowerCase() === "speaker";

    const MPTC_TEXTS = [
        {
            text: isSpeaker ? "CERTIFICATE OF APPRECIATION" : "CERTIFICATE OF PARTICIPATION",
            textSize: 125,
            textColor: MPTC_TEXT_COLORS.white,
            y: 931,
            align: 'center',
            textFont: MPTC_FONTS.rajdhani,
            textStyle: "bold"
        },
        {
            text: isSpeaker ? "This certificate is honorably" : "This certificate is proudly",
            textSize: 70.83,
            textColor: MPTC_TEXT_COLORS.blue,
            y: 1135,
            align: 'center',
            textFont: MPTC_FONTS.khmerDigital
        },
        {
            text: "Presented to",
            textSize: 70.83,
            textColor: MPTC_TEXT_COLORS.blue,
            y: 1286.5,
            align: 'center',
            textFont: MPTC_FONTS.khmerDigital
        },
        {
            dataKeys: ['recipient.name'],
            text: '{recipient.name}',
            textSize: 166,
            textColor: MPTC_TEXT_COLORS.orange,
            y: 1583.5,
            align: 'center',
            textFont: MPTC_FONTS.rajdhani,
            textStyle: "bold"
        },
        {
            dataKeys: ['certificate.course'],
            text: '"{certificate.course}"',
            textSize: 70.83,
            textColor: MPTC_TEXT_COLORS.blue,
            y: 1973.2,
            align: 'center',
            textFont: MPTC_FONTS.khmerDigital,
            textStyle: "bold"
        },
        {
            dataKeys: ['certificate.heldOn'],
            text: '{certificate.heldOn} at',
            textSize: 70.83,
            textColor: MPTC_TEXT_COLORS.blue,
            y: 2125.5,
            align: 'center',
            textFont: MPTC_FONTS.khmerDigital,
        },
        {
            dataKeys: ['certificate.heldAt'],
            text: '{certificate.heldAt}',
            textSize: 70.83,
            textColor: MPTC_TEXT_COLORS.blue,
            y: 2276,
            align: 'center',
            textFont: MPTC_FONTS.khmerDigital,
        },
        {
            dataKeys: ['certificate.ministerSignatureDate'],
            text: '{certificate.ministerSignatureDate}',
            textSize: 70.83,
            textColor: MPTC_TEXT_COLORS.blue,
            y: 2450,
            align: 'center',
            textFont: MPTC_FONTS.khmerDigital
        },
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

    drawWrapTexts(ctx, {
        top: 1785,
        left: 0,
        width: 2480,
        textAlignment: 'center',
        lineHeight: 1,
        spans: [
            {
                text: isSpeaker ? "In sincere appreciation for their contribution as a " : "For their valuable participation in the ",
                fontSize: isSpeaker ? 58.33 : 70.83,
                fontFamily: MPTC_FONTS.khmerDigital,
                fillStyle: MPTC_TEXT_COLORS.blue,
            },
            ...(isSpeaker ? [
                {
                    text: "Guest Speaker ",
                    fontSize: 58.33,
                    fontFamily: MPTC_FONTS.khmerDigital,
                    fillStyle: MPTC_TEXT_COLORS.blue,
                    fontWeight: 'bold'
                },
                {
                    text: "at the",
                    fontSize: 58.33,
                    fontFamily: MPTC_FONTS.khmerDigital,
                    fillStyle: MPTC_TEXT_COLORS.blue,
                }
            ] : [])
        ]
    }).draw()

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 1785, 2733.5, 310);
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
