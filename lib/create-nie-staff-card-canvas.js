import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText, loadRemoteResource } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createNIEStaffCardCanvas(certificateInfo = {}, qrcodeContent) {
    const NIE_TEXT_COLORS = {
        black: '#000000',
        blue: '#2c19bd',
    };

    const NIE_FONTS = {
        primary: 'Khmer OS Muol Light',
        secondary: 'Times New Roman',
        third: 'Khmer OS Siemreap',
    };
    const NIE_TEMPLATE_IMAGE = 'nie-id-card-template.png'
    const NIE_TEXTS = [
        {
            dataKeys: ['recipient.nameKh'],
            text: '{recipient.nameKh}',
            textSize: 74,
            textStyle: 'normal',
            textColor: NIE_TEXT_COLORS.blue,
            textFont: NIE_FONTS.primary,
            x: 874,
            y: 684,
        },
        {
            dataKeys: ['recipient.nameEn'],
            text: '{recipient.nameEn}',
            textSize: 74,
            textStyle: 'normal',
            textColor: NIE_TEXT_COLORS.blue,
            textFont: NIE_FONTS.secondary,
            x: 874,
            y: 840,
        },
        {
            dataKeys: ['recipient.dateOfBirthKh'],
            text: '{recipient.dateOfBirthKh}',
            textSize: 74,
            textStyle: 'normal',
            textColor: NIE_TEXT_COLORS.blue,
            textFont: NIE_FONTS.third,
            x: 874,
            y: 990,
        },
        {
            dataKeys: ['certificate.role','certificate.specialized'],
            text: '{certificate.role} {certificate.specialized}',
            textSize: 74,
            textStyle: 'normal',
            textColor: NIE_TEXT_COLORS.blue,
            textFont: NIE_FONTS.primary,
            x: 874,
            y: 1138,
        },
        {
            dataKeys: ['certificate.signatureDate'],
            text: '{certificate.signatureDate}',
            textSize: 53,
            textStyle: 'normal',
            textColor: NIE_TEXT_COLORS.blue,
            textFont: NIE_FONTS.third,
            align: 'center',
            x: 2169,
            y: 1319,
        },
    ];

    const bg = await createTemplateImage(NIE_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);

    // Draw Caption 
    for (const text of NIE_TEXTS) {

        if (text.dataKeys && text.dataKeys.length > 0) {
            for (const key of text.dataKeys) text.text = text.text.replace(`{${key}}`, _.get(certificateInfo, key, ''));
        }

        drawText(canvas, ctx, text.text, {
            x: text.x,
            y: text.y,
            textColor: text.textColor || NIE_TEXT_COLORS.black,
            align: text.align,
            font: resolveFont(NIE_FONTS.primary, 24, text),
        });
    }
    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 2171, 737, 400);
    }

    // draw profile photo
    if (certificateInfo.recipient.photoUrl) {
        const profileImage = await loadRemoteResource(certificateInfo.recipient.photoUrl);
        if (profileImage) {
            const profileMaxWidth = 556;
            const profileHeight = profileMaxWidth / (profileImage.width / profileImage.height);
            const profileX = 158;
            const profileY = 571;
            ctx.drawImage(profileImage, profileX, profileY, profileMaxWidth, profileHeight);
        }
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
