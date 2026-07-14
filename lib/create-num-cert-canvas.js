import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText, loadRemoteResource } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createNUMCertCanvas(certificateInfo = {}, qrcodeContent) {
    const MPTC_TEXT_COLORS = {
        black: '#000000',
        blue: '#014283',
    };

    const MPTC_FONTS = {
        primary: 'Khmer OS Muol Light',
        secondary: 'Khmer OS Siemreap',
        thirdly: 'Times New Roman',
        fourty: 'Khmer OS Metal Chrieng'
    };
    const MPTC_TEMPLATE_IMAGE = 'certificate-num-bachelor-cert-lg.png'
    let MPTC_TEXTS = [
        {
            dataKeys: ['recipient.nameKm'],
            text: '{recipient.nameKm}',
            textSize: 58,
            textStyle: 'medium',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.primary,
            x: 760,
            y: 1348,
            align: 'left',

        },
        {
            dataKeys: ['certificate.dateOfBirthKm'],
            text: '{certificate.dateOfBirthKm}',
            textSize: 52,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 760,
            y: 1454,
            align: 'left'
        }, {
            dataKeys: ['certificate.programKm'],
            text: '{certificate.programKm}',
            textSize: 48,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.primary,
            textStyle: 'medium',
            x: 760,
            y: 1566,
            align: 'left'
        }, {
            dataKeys: ['certificate.majorKm'],
            text: '{certificate.majorKm}',
            textSize: 52,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.fourty,
            textStyle: 'bold',
            x: 770,
            y: 1670,
            align: 'left'
        }, {
            dataKeys: ['certificate.examDateKm'],
            text: '{certificate.examDateKm}',
            textSize: 48,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            textStyle: 'medium',
            x: 1420,
            y: 1776,
            align: 'left'
        },
        {
            dataKeys: ['certificate.issueLunarDateKm'],
            text: '{certificate.issueLunarDateKm}',
            textSize: 48,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 690,
            y: 1876,
            align: 'left'
        },
        {
            dataKeys: ['recipient.name'],
            text: '{recipient.name}',
            textSize: 52,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.thirdly,
            textStyle: 'bold',
            x: 2650,
            y: 1348,
            align: 'left'
        },
        {
            dataKeys: ['certificate.dateOfBirth'],
            text: '{certificate.dateOfBirth}',
            textSize: 52,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.thirdly,
            textStyle: 'medium',
            x: 2650,
            y: 1454,
            align: 'left'
        },
        // {
        //     dataKeys: ['certificate.program'],
        //     text: '{certificate.program}',
        //     textSize: 54,
        //     textColor: MPTC_TEXT_COLORS.black,
        //     textFont: MPTC_FONTS.thirdly,
        //     textStyle: 'bold',
        //     x: 2650,
        //     y: 1566,
        //     align: 'left'
        // },
        {
            dataKeys: ['certificate.major'],
            text: '{certificate.major}',
            textSize: 52,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.thirdly,
            textStyle: 'medium',
            x: 2650,
            y: 1670,
            align: 'left'
        },
        {
            dataKeys: ['certificate.examDate'],
            text: '{certificate.examDate}',
            textSize: 52,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.thirdly,
            x: 3100,
            y: 1780,
            align: 'left'
        }, {
            dataKeys: ['certificate.issueDate'],
            text: '{certificate.issueDate}',
            textSize: 52,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.thirdly,
            textStyle: 'medium',
            x: 2824,
            y: 1954,
            align: 'left'
        }, {
            dataKeys: ['certificate.number'],
            text: '{certificate.number}',
            textSize: 52,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.thirdly,
            x: 1980,
            y: 1954,
            align: 'left'
        }
    ];
    let numDegree = [
        {
            dataKeys: ['certificate.program'],
            text: '{certificate.program}',
            textSize: 46.5,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.thirdly,
            textStyle: 'bold',
            x: 2650,
            y: 1566,
            align: 'left'
        },
    ]
    if (certificateInfo.certificate.program === "Bachelor of Business Administration (International Program)") {
        numDegree[0].textSize = 54 - 15;
    }

    MPTC_TEXTS = [...MPTC_TEXTS, ...numDegree];

    const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);

    // draw Issue Date
    let splitIssueDate = "";
    splitIssueDate = certificateInfo.certificate.issueDateKm?.split(" ");
    let textYear = {
        textSize: 50,
        textStyle: 'nomal',
        textFont: MPTC_FONTS.secondary
    }
    // Date
    drawText(canvas, ctx, splitIssueDate[0], {
        // x: 441,
        x: 1030,
        y: 1978,
        textColor: MPTC_TEXT_COLORS.black,
        align: 'left',
        font: resolveFont(MPTC_FONTS.primary, 21, textYear),
    });
    // month 
    drawText(canvas, ctx, splitIssueDate[1], {
        x: 1280,
        y: 1978,
        textColor: MPTC_TEXT_COLORS.black,
        align: 'center',
        font: resolveFont(MPTC_FONTS.primary, 21, textYear),
    });
    // year 
    drawText(canvas, ctx, splitIssueDate[2], {
        x: 1582,
        y: 1978,
        textColor: MPTC_TEXT_COLORS.black,
        align: 'center',
        font: resolveFont(MPTC_FONTS.primary, 21, textYear),
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
    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 3320, 2050, 370);
    }

    // draw profile photo
    if (certificateInfo.certificate.photoUrl) {
        const profileImage = await loadRemoteResource(certificateInfo.certificate.photoUrl);
        if (profileImage) {
            const maxImgBoxWidth = 530;
            const maxImgBoxHeight = 530;

            // get the scale
            // it is the min of the 2 ratios
            let scale_factor = Math.min(maxImgBoxWidth / profileImage.width, maxImgBoxHeight / profileImage.height);

            // Lets get the new width and height based on the scale factor
            let newWidth = profileImage.width * scale_factor;
            let newHeight = profileImage.height * scale_factor;
            // const profileHeight = profileMaxWidth / (profileImage.width / profileImage.height);
            const profileX = (bg.width / 2) - (newWidth / 2);
            const profileY = 1990;
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
