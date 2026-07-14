import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText, loadRemoteResource } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createCadtBachelorCertCanvas(certificateInfo = {}, qrcodeContent) {
    const CADT_TEXT_COLORS = {
        black: '#000000',
        blue: '#12284C',
    };

    const CADT_FONTS = {
        primary: 'Niradei',
        secondary: 'Arial',
    };
    const CADT_TEMPLATE_IMAGE = 'certificate-cadt-bachelor.png';
    // const CADT_TEXTS = [];
    const CADT_TEXTS = [
        {
            dataKeys: ['recipient.dateOfBirthKm'],
            text: 'កើត{recipient.dateOfBirthKm}',
            textSize: 39,
            textStyle: 'normal',
            textColor: CADT_TEXT_COLORS.black,
            textFont: CADT_FONTS.primary,
            x: 584,
            y: 621,
            align: 'center',
        },
        {
            dataKeys: ['certificate.degreeKm'],
            text: '{certificate.degreeKm}',
            textSize: 44,
            textStyle: 'bold',
            textColor: CADT_TEXT_COLORS.blue,
            textFont: CADT_FONTS.primary,
            x: 587,
            y: 763,
            align: 'center',
        },
        {
            dataKeys: ['certificate.awardDateKm'],
            text: 'នៅ{certificate.awardDateKm}',
            textSize: 39,
            textStyle: 'normal',
            textColor: CADT_TEXT_COLORS.black,
            textFont: CADT_FONTS.primary,
            x: 585,
            y: 908,
            align: 'center',
        },
        {
            dataKeys: ['certificate.signatureDateKm'],
            text: '{certificate.signatureDateKm}',
            textSize: 39,
            textStyle: 'normal',
            textColor: CADT_TEXT_COLORS.black,
            textFont: CADT_FONTS.primary,
            x: 580,
            y: 1070,
            align: 'center',
        },
        {
            dataKeys: ['recipient.dateOfBirth'],
            text: 'born on {recipient.dateOfBirth}',
            textSize: 35,
            textStyle: 'normal',
            textColor: CADT_TEXT_COLORS.black,
            textFont: CADT_FONTS.primary,
            x: 1670,
            y: 618,
            align: 'center',
        },
        {
            dataKeys: ['certificate.degree'],
            text: '{certificate.degree}',
            textSize: 46,
            textStyle: 'bold',
            textColor: CADT_TEXT_COLORS.blue,
            textFont: CADT_FONTS.secondary,
            x: 1670,
            y: 763,
            align: 'center',
        },
        {
            dataKeys: ['certificate.awardDate'],
            text: 'for this degree on {certificate.awardDate}',
            textSize: 35,
            textStyle: 'normal',
            textColor: CADT_TEXT_COLORS.black,
            textFont: CADT_FONTS.primary,
            x: 1672,
            y: 905,
            align: 'center',
        },
        {
            dataKeys: ['certificate.signatureDate'],
            text: '{certificate.signatureDate}',
            textSize: 35,
            textStyle: 'normal',
            textColor: CADT_TEXT_COLORS.black,
            textFont: CADT_FONTS.primary,
            x: 1685,
            y: 1063,
            align: 'center',
        },
        {
            dataKeys: ['certificate.number'],
            text: '{certificate.number}',
            textSize: 30,
            textStyle: 'normal',
            textColor: CADT_TEXT_COLORS.black,
            textFont: CADT_FONTS.primary,
            x: 1172,
            y: 1505,
            align: 'left',
        },
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

    // Draw center nameKm

    let name1Style = {
        textSize: 38,
        textStyle: 'normal',
        textFont: CADT_FONTS.primary,
    };

    let name2Style = {
        textSize: 47,
        textStyle: 'bold',
        textFont: CADT_FONTS.primary,
    };
    drawCenterText(
        name1Style,
        CADT_TEXT_COLORS.black,
        'បញ្ជាក់ថា​ ',
        name2Style,
        CADT_TEXT_COLORS.blue,
        certificateInfo.recipient.nameKm,
        585,
        552,
        CADT_FONTS,
        ctx,
        canvas,
        bg
    );

    let nameEn1Style = {
        textSize: 35,
        textStyle: 'normal',
        textFont: CADT_FONTS.primary,
    };

    let nameEn2Style = {
        textSize: 42,
        textStyle: 'bold',
        textFont: CADT_FONTS.primary,
    };
    drawCenterText(
        nameEn1Style,
        CADT_TEXT_COLORS.black,
        'certifies that ',
        nameEn2Style,
        CADT_TEXT_COLORS.blue,
        certificateInfo.recipient.name,
        1668,
        552,
        CADT_FONTS,
        ctx,
        canvas,
        bg
    );

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 2020, 1290, 220);
    }

    // draw profile photo
    if (certificateInfo.recipient.photoUrl) {
        const profileImage = await loadRemoteResource(certificateInfo.recipient.photoUrl);
        if (profileImage) {
            const profileMaxWidth = 280;
            const profileHeight = profileMaxWidth / (profileImage.width / profileImage.height);
            const profileX = 1031;
            const profileY = 1110;
            ctx.drawImage(profileImage, profileX, profileY, profileMaxWidth, profileHeight);
        }
    }

    // draw photo stamp emboss
    const stampEmboss = await loadImage(path.join(process.cwd(), 'assets', 'cadt_stamp_emboss.png'));
    if (stampEmboss) {
        ctx.drawImage(stampEmboss, 1200, 1263 /* 1186 + 60 */, 310, 310);
    }

    return canvas;
}
export async function drawCenterText(
    text1Style = {},
    text1Color,
    text1Content,
    text2Style = {},
    text2Color,
    text2Content,
    x,
    y,
    ITC_FONTS,
    ctx,
    canvas,
    bg
) {
    ctx.font = `${text1Style.textStyle} ${text1Style.textSize}px ${text1Style.textFont}`;
    let text1Width = ctx.measureText(text1Content).width;
    ctx.font = `${text2Style.textStyle} ${text2Style.textSize}px ${text2Style.textFont}`;
    let text2Width = ctx.measureText(text2Content).width;
    let totalContentWidth = text1Width + text2Width;
    let spaceWidth = x * 2 - totalContentWidth;

    let mulTotalWidth = spaceWidth / 2;
    drawText(canvas, ctx, text1Content, {
        x: mulTotalWidth,
        y: y,
        textColor: text1Color,
        align: 'left',
        font: resolveFont(ITC_FONTS.primary, 50, text1Style),
    });

    drawText(canvas, ctx, text2Content, {
        x: mulTotalWidth + text1Width,
        y: y,
        textColor: text2Color,
        align: 'left',
        font: resolveFont(ITC_FONTS.primary, 50, text2Style),
    });
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
