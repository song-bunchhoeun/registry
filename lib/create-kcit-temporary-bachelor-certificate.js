import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText, loadRemoteResource } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createKCITTemporaryBachelorCertificate(certificateInfo = {}, qrcodeContent) {
    const MPTC_TEXT_COLORS = {
        black: '#000000',
        blue: '#014283',
        lightBlue: '#0000FF'
    };

    const MPTC_FONTS = {
        primary: 'Khmer OS Muol Light',
        secondary: 'Khmer OS Battambang',
        thirdly: 'Cambria',
        fourty: 'Khmer OS System'
    };

    const MPTC_TEMPLATE_IMAGE = 'kcit-temporary-bachelor-certificate-no-stamps-v3.png'

    const dateOfBirthKm = certificateInfo.recipient.dateOfBirthKm.split(" ");
    const examDateKm = certificateInfo.certificate.examDateKm.split(" ");
    const signatureLunarDateKm = certificateInfo.certificate.signatureLunarDateKm.split(" ");
    const signatureDateKm = certificateInfo.certificate.signatureDateKm.split(" ");
    const qrcodeTexts = [
        "សូមស្កេនដើម្បី",
        "ផ្ទៀងផ្ទាត់ភាពត្រឹមត្រូវ",
        "https://www.verify.gov.kh"
    ];
    const numberKm = _.get(certificateInfo, "certificate.numberKm")
    const nameKm = _.get(certificateInfo, "recipient.nameKm");
    const name = _.get(certificateInfo, "recipient.name");
    const degreeKm = _.get(certificateInfo, "certificate.degreeKm");

    let nameData = [
        {
            dataKeys: ['recipient.nameKm'],
            text: nameKm,
            textSize: 48,
            textFont: MPTC_FONTS.primary,
        },
        {
            dataKeys: ['recipient.name'],
            text: name,
            textSize: 54,
            textFont: MPTC_FONTS.thirdly,
        },
    ];

    const getTextMaxWidth = (ctx, textItem) => {
        ctx.font = resolveFont(textItem.textFont, textItem.textSize, textItem);
        const targetMatric = ctx.measureText(textItem.text);
        return targetMatric;
    };

    const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bg, 0, 0);

    const adjustFontSize = (ctx, dataItem, textMaxWidth) => {
        let fontSize = dataItem.textSize;
        let getTextWidth = getTextMaxWidth(ctx, {
            ...dataItem,
            textSize: fontSize,
        });
        while (getTextWidth.width > textMaxWidth && fontSize > 0) {
            fontSize--;
            getTextWidth = getTextMaxWidth(ctx, {
                ...dataItem,
                textSize: fontSize,
            });
        }
        return fontSize;
    };

    const nameKmFontSize = adjustFontSize(ctx, nameData[0], 400);
    const nameFontSize = adjustFontSize(ctx, nameData[1], 520);

    drawWrapTexts(ctx, {
        top: 700,
        left: 117,
        width: 980,
        textAlignment: 'center',
        lineHeight: 2.2,
        spans: [
            {
                text: 'លេខ:   ',
                fontSize: 45,
                fontFamily: { name: "Khmer OS Battambang" },
                fontFamily: MPTC_FONTS.secondary,
                fillStyle: MPTC_TEXT_COLORS.lightBlue,
                fontWeight: '500',
                strokeLine: 0.5,
                strokeColor: MPTC_TEXT_COLORS.lightBlue,
            },
            {
                text: numberKm,
                fontSize: 45,
                fontFamily: MPTC_FONTS.secondary,
                fillStyle: MPTC_TEXT_COLORS.blue,
                strokeLine: 1,
                strokeColor: MPTC_TEXT_COLORS.blue,
            },
            {
                text: '   វបកឈ.',
                fontSize: 45,
                fontFamily: MPTC_FONTS.secondary,
                fillStyle: MPTC_TEXT_COLORS.lightBlue,
                fontWeight: '600'
            },
        ]
    }).draw()

    const MPTC_TEXTS = [
        {
            dataKeys: ['recipient.nameKm'],
            text: nameKm,
            textSize: nameKmFontSize,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.primary,
            x: 763,
            y: 1286,
            align: 'left',
        },
        {
            dataKeys: ['recipient.name'],
            text: name,
            textSize: nameFontSize,
            textStyle: 'bold',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.thirdly,
            x: 1447,
            y: 1286,
            align: 'left',
        },
        {
            dataKeys: ['recipient.genderKm'],
            text: '{recipient.genderKm}',
            textSize: 47,
            textStyle: 'bold',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 763,
            y: 1389,
            align: 'left',
        },
        {
            dataKeys: ['recipient.nationalityKm'],
            text: '{recipient.nationalityKm}',
            textSize: 46,
            textStyle: 'bold',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 1351,
            y: 1388,
            align: 'left',
        },
        {
            dataKeys: ['recipient.ethnicityKm'],
            text: '{recipient.ethnicityKm}',
            textSize: 46,
            textStyle: 'bold',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 1779,
            y: 1388,
            align: 'left',
        },
        {
            dataKeys: ['recipient.dateOfBirthKm'],
            text: 'ថ្ងៃទី',
            textSize: 47,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 763,
            y: 1491,
            align: 'left',
        },
        {
            dataKeys: ['recipient.dateOfBirthKm'],
            text: dateOfBirthKm[0],
            textSize: 47,
            textStyle: 'bold',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 845,
            y: 1491,
            align: 'left',
        },
        {
            dataKeys: ['recipient.dateOfBirthKm'],
            text: 'ខែ',
            textSize: 47,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 975,
            y: 1491,
            align: 'left',
        },
        {
            dataKeys: ['recipient.dateOfBirthKm'],
            text: dateOfBirthKm[1],
            textSize: 47,
            textStyle: 'bold',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 1030,
            y: 1491,
            align: 'left',
        },
        {
            dataKeys: ['recipient.dateOfBirthKm'],
            text: 'ឆ្នាំ',
            textSize: 47,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 1196,
            y: 1492,
            align: 'left',
        },
        {
            dataKeys: ['recipient.dateOfBirthKm'],
            text: dateOfBirthKm[2],
            textSize: 47,
            textStyle: 'bold',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 1250,
            y: 1492,
            align: 'left',
        },
        {
            dataKeys: ['recipient.placeOfBirthKm'],
            text: '{recipient.placeOfBirthKm}។',
            textSize: 47,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 763,
            y: 1595,
            align: 'left',
        },
        {
            dataKeys: ['recipient.fatherNameKm'],
            text: '{recipient.fatherNameKm}',
            textSize: 47,
            textStyle: 'bold',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 763,
            y: 1696,
            align: 'left',
        },
        {
            dataKeys: ['recipient.fatherJobKm'],
            text: '{recipient.fatherJobKm}',
            textSize: 47,
            textStyle: 'bold',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 1352,
            y: 1696,
            align: 'left',
        },
        {
            dataKeys: ['recipient.motherNameKm'],
            text: '{recipient.motherNameKm}',
            textSize: 47,
            textStyle: 'bold',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 763,
            y: 1799,
            align: 'left',
        },
        {
            dataKeys: ['recipient.motherJobKm'],
            text: '{recipient.motherJobKm}',
            textSize: 47,
            textStyle: 'bold',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 1352,
            y: 1799,
            align: 'left',
        },
        // Current addesss
        {
            dataKeys: ['recipient.currentAddressKm'],
            text: '{recipient.currentAddressKm}។',
            textSize: 47,
            textStyle: 'medium',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary, 
            x: 763,
            y: 1903,
            align: 'left',
        },
        {
            dataKeys: ['certificate.degreeKm'],
            text: degreeKm,
            textSize: 42,
            textStyle: 'medium',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.primary,
            x: 1891,
            y: 1991,
            align: 'center',
        },
        {
            dataKeys: ['certificate.generationKm'],
            text: '{certificate.generationKm}',
            textSize: 41,
            textStyle: 'medium',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.primary,
            x: 2265,
            y: 1988,
            align: 'left',
        },
        {
            dataKeys: ['certificate.majorKm'],
            text: '{certificate.majorKm}',
            textSize: 46,
            textStyle: 'medium',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.primary,
            x: 784,
            y: 2082,
            align: 'left',
        },
        {
            dataKeys: ['certificate.examDateKm'],
            text: examDateKm[0] + ' - ' + examDateKm[1] + ' - ' + examDateKm[2],
            textSize: 45.7,
            textStyle: 'bold',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 784,
            y: 2186,
            align: 'left',
        },
        {
            dataKeys: ['certificate.signatureLunarDateKm'],
            text: signatureLunarDateKm[0] + ' ' + signatureLunarDateKm[1] + '  ' + signatureLunarDateKm[2] + ' ' + signatureLunarDateKm[3] + ' ' + signatureLunarDateKm[4] + ' ' + signatureLunarDateKm[5],
            textSize: 46,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 1672,
            // x: 1067,
            // y: 2400,
            y: 2509,
            align: 'center',
        },
        {
            dataKeys: ['certificate.signatureDateKm'],
            text: 'កំពង់ឈើទាល​ ថ្ងៃទី' + signatureDateKm[0] + ' ខែ' + signatureDateKm[1] + ' ឆ្នាំ' + signatureDateKm[2],
            textSize: 46,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 1672,
            // x: 1644,
            y: 2594,
            align: 'center',
        },
        {
            dataKeys: ['certificate.signatureDateKm'],
            text: 'នាយកវិទ្យាស្ថាន',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.primary,
            x: 1464,
            // x: 1644,
            y: 2684,
            align: 'left',
        },
        {
            dataKeys: ['certificate.degreeKm'],
            text: qrcodeTexts[0],
            textSize: 38,
            textStyle: 'bold',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.fourty,
            x: 598,
            y: 3160,
            align: 'left',
        },
        {
            dataKeys: ['certificate.degreeKm'],
            text: qrcodeTexts[1],
            textSize: 38,
            textStyle: 'bold',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.fourty,
            x: 598,
            y: 3227,
            align: 'left',
        },
        {
            dataKeys: ['certificate.degreeKm'],
            text: qrcodeTexts[2],
            textSize: 38,
            textStyle: 'bold',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.fourty,
            x: 598,
            y: 3292,
            align: 'left',
        },
    ];

    if (certificateInfo.certificate.type === "សម័យប្រឡងបញ្ចប់") {
        MPTC_TEXTS.push(
            {
                dataKeys: ['certificate.type'],
                text: 'សម័យប្រឡងបញ្ចប់',
                textFont: MPTC_FONTS.secondary,
                textColor: MPTC_TEXT_COLORS.black,
                textSize: 46.1,
                x: 237,
                y: 2183,
                align: 'left',
            }
        )
    } else {
        MPTC_TEXTS.push(
            {
                dataKeys: ['certificate.type'],
                text: 'សម័យការពារសារណាបទ',
                textFont: MPTC_FONTS.secondary,
                textColor: MPTC_TEXT_COLORS.black,
                textSize: 46.1,
                x: 237,
                y: 2183,
                align: 'left',
            }
        )
    }

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
        await drawQrCodeStandard(qrcodeContent, ctx, 237, 2897, 322);
    }

    // draw profile photo
    if (certificateInfo.recipient.photoUrl) {
        const profileImage = await loadRemoteResource(certificateInfo.recipient.photoUrl);
        if (profileImage) {
            const maxImgBoxWidth = 406;
            const maxImgBoxHeight = 524;

            // get the scale
            // it is the min of the 2 ratios
            let scale_factor = Math.min(maxImgBoxWidth / profileImage.width, maxImgBoxHeight / profileImage.height);

            // Lets get the new width and height based on the scale factor
            let newWidth = profileImage.width * scale_factor;
            let newHeight = profileImage.height * scale_factor;

            // const profileHeight = profileMaxWidth / (profileImage.width / profileImage.height);
            const profileX = 2013;
            const profileY = 1038;
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

export function drawWrapTexts(
    ctx,
    { lineHeight, left, top, width, textAlignment, spans }
) {
    const segments = [];
    let maxFontSize = 0;
    let segmenter = new Intl.Segmenter(undefined, { granularity: 'word' });

    for (const _span of spans) {
        const span = {
            text: '',
            fontSize: 102,
            fontFamily: 'Khmer OS Battambang',
            fillStyle: 'black',
            fontWeight: '500',
            strokeColor: null,
            strokeLine: 0,
            ..._span
        };

        if (span.fontSize > maxFontSize) {
            maxFontSize = span.fontSize;
        }

        for (const item of segmenter.segment(span.text)) {
            segments.push({
                segment: item.segment,
                ...span
            });
        }
    }

    width += left;
    const safeMargin = 0;
    const maxWidth = width - safeMargin * 2;
    let textLeftOffset = safeMargin + left;
    let textTopOffset = safeMargin + top;
    const viewGroups = [];
    let views = [];
    let line = 0;

    for (const { segment, ...opts } of segments) {
        ctx.font =
            `${opts.fontWeight} ${opts.fontSize}px ${opts.fontFamily}`.trim();

        if (segment == '\n') {
            viewGroups.push({
                views,
                width: textLeftOffset - safeMargin * 2
            });

            views = [];
            textLeftOffset = safeMargin + left;
            textTopOffset += maxFontSize * lineHeight;
            continue;
        }
        const measurement = ctx.measureText(segment);

        if (textLeftOffset + measurement.width - safeMargin > maxWidth) {
            viewGroups.push({
                views,
                width: textLeftOffset - safeMargin * 2
            });

            textLeftOffset = safeMargin + left;
            textTopOffset += maxFontSize * lineHeight;
            line += 1;
            views = [];
        }

        if (textLeftOffset - safeMargin == 0 && segment.trim().length == 0) {
            continue;
        }

        views.push({
            segment,
            textLeftOffset,
            textTopOffset,
            line,
            ...opts
        });

        textLeftOffset += measurement.width;
    }

    viewGroups.push({
        views,
        width: textLeftOffset - safeMargin * 2
    });

    return {
        height() {
            return textTopOffset - top + maxFontSize;
        },
        draw() {
            for (const group of viewGroups) {
                let leftOffset = 0;
                let localMaxFontSize = 0;

                for (const view of group.views) {
                    if (localMaxFontSize < view.fontSize) {
                        localMaxFontSize = view.fontSize;
                    }
                }

                if (textAlignment === 'center') {
                    leftOffset = (maxWidth - group.width - safeMargin) / 2;
                }

                if (textAlignment === 'right') {
                    leftOffset = maxWidth - group.width - safeMargin;
                }

                for (const view of group.views) {
                    ctx.font =
                        `${view.fontWeight} ${view.fontSize}px ${view.fontFamily}`.trim();

                    // Handle text stroke if strokeLine is greater than 0
                    if (view.strokeLine > 0) {
                        ctx.strokeStyle = view.strokeColor || 'black';
                        ctx.lineWidth = view.strokeLine;
                        ctx.strokeText(view.segment, leftOffset + view.textLeftOffset, view.textTopOffset);
                    }

                    // Fill the text
                    ctx.fillStyle = view.fillStyle;
                    let topOffset = 0;
                    if (view.fontSize !== localMaxFontSize) {
                        topOffset = (localMaxFontSize - view.fontSize) / 2;
                    }
                    ctx.fillText(
                        view.segment,
                        leftOffset + view.textLeftOffset,
                        topOffset + view.textTopOffset
                    );
                }
            }
        }
    };
}