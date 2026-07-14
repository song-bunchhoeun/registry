import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText, loadRemoteResource } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createNIPHMasterCertCanvas(certificateInfo = {}, qrcodeContent) {
    const MPTC_TEXT_COLORS = {
        black: '#000000',
        blue: '#014283',
    };

    const MPTC_FONTS = {
        primary: 'Khmer OS Muol Light',
        secondary: 'Khmer OS System',
        thirdly: 'Times New Roman'
    };
    const MPTC_TEMPLATE_IMAGE = 'certificate-niph-master-degree.png'
    const MPTC_TEXTS = [
        {
            dataKeys: ['certificate.logDateKh'],
            text: '{certificate.logDateKh}',
            textSize: 23,
            textStyle: 'medium',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 532,
            y: 442,
            align: 'left',

        },
        {
            dataKeys: ['recipient.name'],
            text: 'ជាន់ខ្ពស់ នៅវិទ្យាស្ថានជាតិសុខភាពសាធារណៈ',
            textSize: 23,
            textStyle: 'medium',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 186,
            y: 487,
            align: 'left',

        },
        {
            dataKeys: ['recipient.nameKh'],
            text: '{recipient.nameKh}',
            textSize: 25,
            textStyle: 'medium',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.primary,
            x: 390,
            y: 538,
            align: 'left',

        },
        {
            dataKeys: ['certificate.dobKh'],
            text: '{certificate.dobKh}',
            textSize: 23,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 334,
            y: 590,
            align: 'left'
        }
        , {
            dataKeys: ['certificate.nameKh'],
            text: '{certificate.nameKh}',
            textSize: 24,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.primary,
            textStyle: 'medium',
            x: 720,
            y: 641,
            align: 'left'
        },
        {
            dataKeys: ['certificate.nameEn'],
            text: '({certificate.nameEn})',
            textSize: 26,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.thirdly,
            textStyle: 'bold',
            x: 191,
            y: 689,
            align: 'left'
        }, {
            dataKeys: ['certificate.ministerSignatureLunarDate'],
            text: '{certificate.ministerSignatureLunarDate}',
            textSize: 23,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x:430,
            y: 791,
            align: 'center'
        },
        {
            dataKeys: ['certificate.number'],
            text: '{certificate.number}',
            textSize: 18,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            textStyle: 'bold',
            x: 820,
            y: 792,
            align: 'left'
        },
        {
            dataKeys: ['certificate.number'],
            text: 'គណៈកម្មការវាយតម្លៃនិសិ្សតថ្នាក់បរិញ្ញាបត្រ',
            textSize: 23,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 1087,
            y: 440,
            align: 'left'
        },
        {
            dataKeys: ['certificate.examDateKh'],
            text: '{certificate.examDateKh}',
            textSize: 23,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 1218,
            y: 487,
            align: 'left'
        },
        {
            dataKeys: ['recipient.nameEn'],
            text: '{recipient.nameEn}',
            textSize: 28,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.thirdly,
            textStyle: 'bold',
            x: 1000,
            y: 539,
            align: 'left'
        },
        {
            dataKeys: ['recipient.genderKh'],
            text: '{recipient.genderKh}',
            textSize: 23,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 1498,
            y: 539,
            align: 'left'
        },
        {
            dataKeys: ['recipient.placeOfBirthKh'],
            text: '{recipient.placeOfBirthKh}',
            textSize: 23,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 1218,
            y: 590,
            align: 'left'
        },

        {
            dataKeys: ['certificate.generationNumber'],
            text: '{certificate.generationNumber}',
            textSize: 23,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 1525,
            y: 691,
            align: 'left'
        }, {
            dataKeys: ['certificate.directorSignatureLunarDate'],
            text: '{certificate.directorSignatureLunarDate}',
            textSize: 23,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 1290,
            y: 775,
            // y: 777,

            align: 'center'
        },
        {
            dataKeys: ['recipient.studentId'],
            text: '{recipient.studentId}',
            textSize: 23,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.thirdly,
            textStyle:'bold',
            x: 1530,
            y: 1190,
            align: 'left'
        },

    ];

    const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);

    // draw priminister of health Issue Date
    let splitIssueDate = "";
    splitIssueDate = certificateInfo.certificate.ministerSignatureDate?.split(" ");
    let textYear = {
        textSize: 23,
        textStyle: 'nomal',
        textFont: MPTC_FONTS.secondary
    }
    // Date
    drawText(canvas, ctx, splitIssueDate[0], {
        // x: 441,
        x: 387,
        y: 834,
        textColor: MPTC_TEXT_COLORS.black,
        align: 'left',
        font: resolveFont(MPTC_FONTS.primary, 21, textYear),
    });
    // month 
    drawText(canvas, ctx, splitIssueDate[1], {
        x: 492,
        y: 834,
        textColor: MPTC_TEXT_COLORS.black,
        align: 'left',
        font: resolveFont(MPTC_FONTS.primary, 21, textYear),
    });
    // year 
    drawText(canvas, ctx, splitIssueDate[2], {
        x: 596,
        y: 834,
        textColor: MPTC_TEXT_COLORS.black,
        align: 'left',
        font: resolveFont(MPTC_FONTS.primary, 21, textYear),
    });

    // draw director Issue Date
    let directorIssueDate = "";
    directorIssueDate = certificateInfo.certificate.directorSignatureDate?.split(" ");
    let textdirector = {
        textSize: 23,
        textStyle: 'nomal',
        textFont: MPTC_FONTS.secondary
    }
    // Date
    drawText(canvas, ctx, directorIssueDate[0], {
        x: 1235,
        y: 817,
        textColor: MPTC_TEXT_COLORS.black,
        align: 'left',
        font: resolveFont(MPTC_FONTS.primary, 21, textdirector),
    });
    // month 
    drawText(canvas, ctx, directorIssueDate[1], {
        x: 1342,
        y: 817,
        textColor: MPTC_TEXT_COLORS.black,
        align: 'left',
        font: resolveFont(MPTC_FONTS.primary, 21, textdirector),
    });
    // year 
    drawText(canvas, ctx, directorIssueDate[2], {
        x: 1447,
        y: 817,
        textColor: MPTC_TEXT_COLORS.black,
        align: 'left',
        font: resolveFont(MPTC_FONTS.primary, 21, textdirector),
    });









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


    // draw major en
    let dobStyleKh = {
        textSize: 23,
        textStyle: 'normal',
        textFont: MPTC_FONTS.secondary
    }

    let dobStyleEn = {
        textSize: 23,
        textStyle: 'normal',
        textFont: MPTC_FONTS.thirdly
    }
    drawTowStyleSameLine(dobStyleKh, MPTC_TEXT_COLORS.black, `${certificateInfo.recipient.dateOfBirthKh}    `, dobStyleEn, MPTC_TEXT_COLORS.black, `(${certificateInfo.recipient.dateOfBirthEn})`, 334, 590, MPTC_FONTS, ctx, canvas)



    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 1424, 862, 158);
        // 
    }

    // draw profile photo
    if (certificateInfo.recipient.photoUrl) {
        const profileImage = await loadRemoteResource(certificateInfo.recipient.photoUrl);
        if (profileImage) {
            const newHeight = 254;
            const newWidth = 200;
            const profileX = 847 - (newWidth / 2);
            const profileY = 808;
            ctx.drawImage(profileImage, profileX, profileY, newWidth, newHeight);
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