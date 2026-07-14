import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText, loadRemoteResource } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createNUBBMasterDegreeCanvas(certificateInfo = {}, qrcodeContent) {
    const NUBB_TEXT_COLORS = {
        black: '#000000',
        blue: '#014283'
    };

    const NUBB_FONTS = {
        primary: 'Khmer OS Muol Light',
        secondary: 'Khmer OS Siemreap',
        thirdly: 'Century',
        fourly: 'Times New Roman',
    };
    const NUBB_TEMPLATE_IMAGE = 'nubb-master-certificate.png'
    // 'certificate-nubb-bachelor-with-stamp.png'
    const NUBB_TEXTS = [
        {
            dataKeys: ['certificate.logDateKm'],
            text: '{certificate.logDateKm}',
            textSize: 34,
            textStyle: 'normal',
            textColor: NUBB_TEXT_COLORS.black,
            textFont: NUBB_FONTS.secondary,
            x: 832,
            y: 1143,
        },
        {
            dataKeys: ['certificate.logDate'],
            text: '{certificate.logDate}',
            textSize: 37,
            textStyle: 'normal',
            textColor: NUBB_TEXT_COLORS.black,
            textFont: NUBB_FONTS.fourly,
            x: 2621,
            y: 1149,
        },
        {
            dataKeys: ['recipient.nameKm'],
            text: '{recipient.nameKm}',
            textSize: 37,
            textStyle: 'normal',
            textColor: NUBB_TEXT_COLORS.black,
            textFont: NUBB_FONTS.primary,
            x: 573,
            y: 1270,
        },
        {
            dataKeys: ['recipient.genderKm'],
            text: '{recipient.genderKm}',
            textSize: 36,
            textStyle: 'normal',
            textColor: NUBB_TEXT_COLORS.black,
            textFont: NUBB_FONTS.secondary,
            x: 1242,
            y: 1265,
        },
        {
            dataKeys: ['recipient.name'],
            text: '{recipient.name}',
            textSize: 38,
            textStyle: 'normal',
            textColor: NUBB_TEXT_COLORS.black,
            textFont: NUBB_FONTS.fourly,
            x: 2160,
            y: 1268,
        },
        {
            dataKeys: ['recipient.gender'],
            text: '{recipient.gender}',
            textSize: 38,
            textStyle: 'normal',
            textColor: NUBB_TEXT_COLORS.black,
            textFont: NUBB_FONTS.fourly,
            x: 2820,
            y: 1268,
        },
        {
            dataKeys: ['recipient.dateOfBirthKm'],
            text: '{recipient.dateOfBirthKm}',
            textSize: 38,
            textStyle: 'normal',
            textColor: NUBB_TEXT_COLORS.black,
            textFont: NUBB_FONTS.primary,
            x: 573,
            y: 1327,
        },
        {
            dataKeys: ['recipient.dateOfBirth'],
            text: '{recipient.dateOfBirth}',
            textSize: 38,
            textStyle: 'normal',
            textColor: NUBB_TEXT_COLORS.black,
            textFont: NUBB_FONTS.fourly,
            x: 2160,
            y: 1325,
        },
        {
            dataKeys: ['certificate.degreeKm'],
            text: '{certificate.degreeKm}',
            textSize: 33,
            textStyle: 'normal',
            textColor: NUBB_TEXT_COLORS.black,
            textFont: NUBB_FONTS.primary,
            x: 739,
            y: 1453,
        },
        {
            dataKeys: ['certificate.degree'],
            text: '{certificate.degree}',
            textSize: 39,
            textStyle: 'normal',
            textColor: NUBB_TEXT_COLORS.black,
            textFont: NUBB_FONTS.fourly,
            x: 2251,
            y: 1454,
        },
        {
            dataKeys: ['certificate.majorKm'],
            text: '{certificate.majorKm}',
            textSize: 37,
            textColor: NUBB_TEXT_COLORS.black,
            textFont: NUBB_FONTS.primary,
            textStyle: 'normal',
            x: 573,
            y: 1511,
        },
        {
            dataKeys: ['certificate.major'],
            text: '{certificate.major}',
            textSize: 38,
            textColor: NUBB_TEXT_COLORS.black,
            textFont: NUBB_FONTS.fourly,
            textStyle: 'normal',
            x: 2160,
            y: 1510,
        },
        {
            dataKeys: ['certificate.rectorSignatureDate'],
            text: '{certificate.rectorSignatureDate}',
            textSize: 36,
            textStyle: 'normal',
            textColor: NUBB_TEXT_COLORS.black,
            textFont: NUBB_FONTS.fourly,
            x: 2499,
            y: 1679,
        },
        {
            dataKeys: ['certificate.number'],
            text: '{certificate.number}',
            textSize: 38,
            textStyle: 'normal',
            align: 'center',
            textColor: NUBB_TEXT_COLORS.black,
            textFont: NUBB_FONTS.fourly,
            x: 1721,
            y: 1683,
        }
    ];

    const bg = await createTemplateImage(NUBB_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);

    // Split and Draw Khmer Isuse Date
    const isuseDate = certificateInfo.certificate.chairmanSignatureDate?.split(' ');
    let x = 797;
    // 787
    for (const date of isuseDate) {
        const text = {
            text: date,
            textSize: 35,
            textColor: NUBB_TEXT_COLORS.black,
            textFont: NUBB_FONTS.secondary,
            x: x,
            y: 1678,
        }
        drawText(canvas, ctx, text.text, {
            x: text.x,
            y: text.y,
            textColor: text.textColor || NUBB_TEXT_COLORS.black,
            align: text.align,
            font: resolveFont(NUBB_FONTS.primary, 24, text),
        });
        x += 223;
    }

    // Draw Caption 
    for (const text of NUBB_TEXTS) {

        if (text.dataKeys && text.dataKeys.length > 0) {
            for (const key of text.dataKeys) text.text = text.text.replace(`{${key}}`, _.get(certificateInfo, key, ''));
        }

        drawText(canvas, ctx, text.text, {
            x: text.x,
            y: text.y,
            textColor: text.textColor || NUBB_TEXT_COLORS.black,
            align: text.align,
            font: resolveFont(NUBB_FONTS.primary, 24, text),
        });
    }
    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 401, 1731, 270);
    }

    // draw profile photo
    if (certificateInfo.recipient.photoUrl) {
        const profileImage = await loadRemoteResource(certificateInfo.recipient.photoUrl);
        if (profileImage) {
            const maxImgBoxWidth = 400;
            const maxImgBoxHeight = 400;

            // get the scale
            // it is the min of the 2 ratios
            let scale_factor = Math.min(maxImgBoxWidth / profileImage.width, maxImgBoxHeight / profileImage.height);

            // Lets get the new width and height based on the scale factor
            let newWidth = profileImage.width * scale_factor;
            let newHeight = profileImage.height * scale_factor;

            // const profileHeight = profileMaxWidth / (profileImage.width / profileImage.height);
            const profileX = (bg.width / 2) - (newWidth / 2);
            const profileY = 1701;
            ctx.drawImage(profileImage, profileX, profileY, newWidth, newHeight);
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
