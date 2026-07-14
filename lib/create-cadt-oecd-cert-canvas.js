import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText, loadRemoteResource } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createCadtOECDCertCanvas(certificateInfo = {}, qrcodeContent) {
    const CADT_TEXT_COLORS = {
        black: '#333230',
        blue: '#014283',
    };

    const CADT_FONTS = {
        primary: 'The Seasons'
    };
    const CADT_TEMPLATE_IMAGE = 'certificate-dg-cadt-oecd-signature.png';
    const CADT_TEXTS = [
       {
            dataKeys: ['recipient.name'],
            text: '{recipient.name}',
            textSize: 190,
            // textStyle: 'bold',
            textColor: CADT_TEXT_COLORS.black,
            textFont: CADT_FONTS.primary,
            y: 1410,
            align: 'center',
        }
    ];

    const bg = await createTemplateImage(CADT_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);

    
    // Draw Caption 
    for (const text of CADT_TEXTS) {

        if (text.dataKeys && text.dataKeys.length > 0) {
            for (const key of text.dataKeys) text.text = text.text.replace(`{${key}}`, _.get(certificateInfo, key, ''));
        }

        drawText(canvas, ctx, text.text, {
            x: text.x,
            y: text.y,
            textColor: text.textColor || CADT_TEXT_COLORS.black,
            align: text.align,
            font: resolveFont(CADT_FONTS.primary, 24, text),
        });
    }


   if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 2749, 1708, 343);
    }


    // draw profile photo
    if (certificateInfo.certificate.photoUrl) {
        const profileImage = await loadRemoteResource(certificateInfo.certificate.photoUrl);
        if (profileImage) {
            const profileMaxWidth = 300;
            const profileHeight = profileMaxWidth / (profileImage.width / profileImage.height);
            const profileX = 1060;
            const profileY = 1119;
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
