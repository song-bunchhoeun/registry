import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText, loadRemoteResource } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createNIEStudentCardCanvas(certificateInfo = {}, qrcodeContent) {
    const MPTC_TEXT_COLORS = {
        black: '#000000',
        blue: '#2c19bd',
    };

    const MPTC_FONTS = {
        primary: 'Khmer OS Muol Light',
        secondary: 'Khmer OS Siemreap',
        thirdly: 'Times New Roman'
    };
    const MPTC_TEMPLATE_IMAGE = 'nie-id-card-template.png'
    const MPTC_TEXTS = [
        {
            dataKeys: ['certificate.name','certificate.generationNumber'],
            text: '{certificate.name} ជំនាន់ទី{certificate.generationNumber}',
            textSize: 74,
            textStyle: 'meduim',
            textColor: MPTC_TEXT_COLORS.blue,
            textFont: MPTC_FONTS.primary,
            x: 876,
            y: 543,
            align: 'left',

        },
        {
            dataKeys: ['certificate.major'],
            text: '{certificate.major}',
            textSize: 74,
            textStyle: 'meduim',
            textColor: MPTC_TEXT_COLORS.blue,
            textFont: MPTC_FONTS.primary,
            x: 876,
            y: 686, 
            align: 'left',

        },
        {
            dataKeys: ['recipient.yearOfStudy'],
            text: 'ឆ្នាំសិក្សា {recipient.yearOfStudy}',
            textSize: 74,
            textStyle: 'normal',
            textColor: MPTC_TEXT_COLORS.blue,
            textFont: MPTC_FONTS.secondary,
            x: 876,
            y: 840,
            align: 'left',

        },
        {
            dataKeys: ['recipient.nameKh'],
            text: '{recipient.nameKh}',
            textSize: 74,
            textStyle: 'meduim',
            textColor: MPTC_TEXT_COLORS.blue,
            textFont: MPTC_FONTS.primary,
            x: 876,
            y: 990,
            align: 'left',
        },
        {
            dataKeys: ['recipient.nameEn'],
            text: '{recipient.nameEn}',
            textSize: 74,
            textStyle: 'meduim',
            textColor: MPTC_TEXT_COLORS.blue,
            textFont: MPTC_FONTS.thirdly,
            x: 878,
            y: 1141,
            align: 'left',

        },
        {
            dataKeys: ['recipient.dateOfBirthKh'],
            text: '{recipient.dateOfBirthKh}',
            textSize: 74,
            textStyle: 'normal',
            textColor: MPTC_TEXT_COLORS.blue,
            textFont: MPTC_FONTS.secondary,
            x: 876,
            y: 1286,
            align: 'left',

        },
        {
            dataKeys: ['certificate.signatureDate'],
            text: '{certificate.signatureDate}',
            textSize: 53,
            textStyle: 'normal',
            textColor: MPTC_TEXT_COLORS.blue,
            textFont: MPTC_FONTS.secondary,
            x: 2169,
            y: 1319,
            align: 'center',

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
        await drawQrCodeStandard(qrcodeContent, ctx, 2171, 737, 400);
        // 
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


export async function drawTowStyleSameLine(text1Style = {}, text1Color, text1Content, text2Style = {}, text2Color, text2Content, x, y, MPTC_FONTS, ctx, canvas) {
    ctx.font = `${text1Style.textStyle} ${text1Style.textSize}px ${text1Style.textFont}`;
    let text1Width = ctx.measureText(text1Content).width;
    ctx.font = `${text2Style.textStyle} ${text2Style.textSize}px ${text2Style.textFont}`;
    drawText(canvas, ctx, text1Content, {
        x: x,
        y: y,
        textColor: text1Color,
        align: 'left',
        font: resolveFont(MPTC_FONTS.primary, 50, text1Style),
    });

    drawText(canvas, ctx, text2Content, {
        x: x + text1Width,
        y: y,
        textColor: text2Color,
        align: 'left',
        font: resolveFont(MPTC_FONTS.primary, 50, text2Style),
    });

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
