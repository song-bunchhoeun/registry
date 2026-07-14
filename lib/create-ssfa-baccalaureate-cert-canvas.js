import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText, loadRemoteResource } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createSsfaBaccalaureateCertificate(certificateInfo = {}, qrcodeContent) {
    const TEXT_COLORS = {
        black: '#000000'
    };

    const logDateKm = _.get(certificateInfo, 'certificate.logDateKm', '');
    const logDate = _.get(certificateInfo, 'certificate.logDate', '');
    const examDateKm = _.get(certificateInfo, 'certificate.examDateKm', '');
    const dateOfBirthKm = _.get(certificateInfo, 'recipient.dateOfBirthKm', '');
    const dateOfBirth = _.get(certificateInfo, 'recipient.dateOfBirth', '');
    const ministerSignatureDateKm = _.get(certificateInfo, 'certificate.ministerSignatureDateKm', '');
    const directorSignatureDate = _.get(certificateInfo, 'certificate.directorSignatureDate', '');
    const nameKm = certificateInfo.recipient.nameKm;
    const name = certificateInfo.recipient.name;
    const faculty = certificateInfo.certificate.faculty;
    const major = certificateInfo.certificate.major;
    const placeOfBirth = certificateInfo.recipient.placeOfBirth;
    const DATA =
    {
        BACKGROUND: {
            pngFilename: "ssfa-baccalaureate-certificate.jpg",
            width: 2993,
            height: 2117
        },
        FONTS: [
            { name: "Khmer OS Muol Light Light" },
            { name: "Times New Roman" }
        ],
        TEXTS: [
            {
                key: "certificate.logNumberKm",
                dataKeys: ["certificate.logNumberKm"],
                text: "{certificate.logNumberKm}",
                textSize: 30,
                textColor: "#000000",
                textStyle: 'bold',
                textFont: {
                    name: "Khmer OS Muol Light"
                },
                x: 704.5,
                y: 857,
                align: "center"
            },
            {
                key: "certificate.day",
                dataKeys: ["certificate.day"],
                text: logDateKm.split(' ')[0],
                textSize: 30,
                textColor: "#000000",
                textStyle: 'bold',
                textFont: {
                    name: "Khmer OS Muol Light"
                },
                x: 1078,
                y: 857,
                align: "center"
            },
            {
                key: "certificate.month",
                dataKeys: ["certificate.month"],
                text: logDateKm.split(' ')[1],
                textSize: 30,
                textColor: "#000000",
                textStyle: 'bold',
                textFont: {
                    name: "Khmer OS Muol Light"
                },
                x: 1218,
                y: 857,
                align: "center"
            },
            {
                key: "certificate.year",
                dataKeys: ["certificate.year"],
                text: logDateKm.split(' ')[2],
                textSize: 30,
                textColor: "#000000",
                textStyle: 'bold',
                textFont: {
                    name: "Khmer OS Muol Light"
                },
                x: 1385,
                y: 857,
                align: "center"
            },
            {
                key: "certificate.academicYearKm",
                dataKeys: ["certificate.academicYearKm"],
                text: "{certificate.academicYearKm}",
                textSize: 30,
                textColor: "#000000",
                textStyle: "bold",
                textFont: {
                    name: "Khmer OS Muol Light"
                },
                x: 840,
                y: 977.3,
                align: "left",
            },
            {
                key: "certificate.day",
                dataKeys: ["certificate.day"],
                text: examDateKm.split(' ')[0],
                textSize: 30,
                textColor: "#000000",
                textStyle: 'bold',
                textFont: {
                    name: "Khmer OS Muol Light"
                },
                x: 653,
                y: 1037.3,
                align: "center"
            },
            {
                key: "certificate.month",
                dataKeys: ["certificate.month"],
                text: examDateKm.split(' ')[1],
                textSize: 30,
                textColor: "#000000",
                textStyle: 'bold',
                textFont: {
                    name: "Khmer OS Muol Light"
                },
                x: 824.2,
                y: 1037.3,
                align: "center"
            },
            {
                key: "certificate.year",
                dataKeys: ["certificate.year"],
                text: examDateKm.split(' ')[2],
                textSize: 30,
                textColor: "#000000",
                textStyle: 'bold',
                textFont: {
                    name: "Khmer OS Muol Light"
                },
                x: 1000,
                y: 1037.3,
                align: "center"
            },
            {
                key: "recipient.nameKm",
                dataKeys: ["recipient.nameKm"],
                text: "{recipient.nameKm}",
                textSize: 30,
                textColor: "#000000",
                textStyle: 'bold',
                textFont: {
                    name: "Khmer OS Muol Light"
                },
                x: 629,
                y: 1096.5,
                align: "left"
            },
            {
                key: "recipient.day",
                dataKeys: ["recipient.day"],
                text: dateOfBirthKm.split(' ')[0],
                textSize: 30,
                textColor: "#000000",
                textStyle: 'bold',
                textFont: {
                    name: "Khmer OS Muol Light"
                },
                x: 516,
                y: 1157,
                align: "center"
            },
            {
                key: "recipient.month",
                dataKeys: ["recipient.month"],
                text: dateOfBirthKm.split(' ')[1],
                textSize: 30,
                textColor: "#000000",
                textStyle: 'bold',
                textFont: {
                    name: "Khmer OS Muol Light"
                },
                x: 654,
                y: 1157,
                align: "center"
            },
            {
                key: "recipient.year",
                dataKeys: ["recipient.year"],
                text: dateOfBirthKm.split(' ')[2],
                textSize: 30,
                textColor: "#000000",
                textStyle: 'bold',
                textFont: {
                    name: "Khmer OS Muol Light"
                },
                x: 811,
                y: 1157,
                align: "center"
            },
            {
                key: "recipient.placeOfBirthKm",
                dataKeys: ["recipient.placeOfBirthKm"],
                text: "{recipient.placeOfBirthKm}",
                textSize: 30,
                textColor: "#000000",
                textStyle: 'bold',
                textFont: {
                    name: "Khmer OS Muol Light"
                },
                x: 1005,
                y: 1157,
                align: "left"
            },
            {
                key: "certificate.degreeKm",
                dataKeys: ["certificate.degreeKm"],
                text: "{certificate.degreeKm}",
                textSize: 30,
                textColor: "#000000",
                textStyle: 'bold',
                textFont: {
                    name: "Khmer OS Muol Light"
                },
                x: 1004,
                y: 1197 + 20,
                align: "left"
            },
            {
                key: "certificate.majorKm",
                dataKeys: ["certificate.majorKm"],
                text: "{certificate.majorKm}",
                textSize: 30,
                textColor: "#000000",
                textStyle: 'bold',
                textFont: {
                    name: "Khmer OS Muol Light"
                },
                x: 600,
                y: 1277.5,
                align: "center"
            },
            {
                key: "certificate.facultyKm",
                dataKeys: ["certificate.facultyKm"],
                text: "{certificate.facultyKm}",
                textSize: 30,
                textColor: "#000000",
                textStyle: 'bold',
                textFont: {
                    name: "Khmer OS Muol Light"
                },
                x: 1004,
                y: 1277.5,
                align: "left"
            },
            {
                key: "certificate.number",
                dataKeys: ["certificate.number"],
                text: "{certificate.number}",
                textSize: 30,
                textColor: "#000000",
                textStyle: 'bold',
                textFont: {
                    name: "Khmer OS Muol Light"
                },
                x: 1515,
                y: 1460,
                align: "left"
            },
            {
                key: "certificate.logNumber",
                dataKeys: ["certificate.logNumber"],
                text: "{certificate.logNumber}",
                textSize: 38,
                textColor: "#000000",
                textStyle: 'bold',
                textFont: {
                    name: "Times New Roman"
                },
                x: 2154 + 9,
                y: 844.2,
                align: "center"
            },
            {
                key: "certificate.day",
                dataKeys: ["certificate.day"],
                text: logDate.split(' ')[0],
                textSize: 38,
                textColor: "#000000",
                textStyle: 'bold',
                textFont: {
                    name: "Times New Roman"
                },
                x: 2340,
                y: 844.2,
                align: "center"
            },
            {
                key: "certificate.month",
                dataKeys: ["certificate.month"],
                text: logDate.split(' ')[1],
                textSize: 38,
                textColor: "#000000",
                textStyle: 'bold',
                textFont: {
                    name: "Times New Roman"
                },
                x: 2472,
                y: 844.2,
                align: "center"
            },
            {
                key: "certificate.year",
                dataKeys: ["certificate.year"],
                text: logDate.split(' ')[2],
                textSize: 38,
                textColor: "#000000",
                textStyle: 'bold',
                textFont: {
                    name: "Times New Roman"
                },
                x: 2623,
                y: 844.2,
                align: "center"
            },
            {
                key: "certificate.academicYear",
                dataKeys: ["certificate.academicYear"],
                text: "{certificate.academicYear}",
                textSize: 38,
                textColor: "#000000",
                textStyle: "bold",
                textFont: {
                    name: "Times New Roman"
                },
                x: 2340,
                y: 962,
                align: "left",
            },
            {
                key: "recipient.name",
                dataKeys: ["recipient.name"],
                text: "{recipient.name}",
                textSize: 38,
                textColor: "#000000",
                textStyle: 'bold',
                textFont: {
                    name: "Times New Roman"
                },
                x: 2015,
                y: 1020.5,
                align: "left"
            },
            {
                key: "recipient.day",
                dataKeys: ["recipient.day"],
                text: dateOfBirth.split(' ')[0],
                textSize: 38,
                textColor: "#000000",
                textStyle: 'bold',
                textFont: {
                    name: "Times New Roman"
                },
                x: 1839,
                y: 1080,
                align: "center"
            },
            {
                key: "recipient.month",
                dataKeys: ["recipient.month"],
                text: dateOfBirth.split(' ')[1],
                textSize: 38,
                textColor: "#000000",
                textStyle: 'bold',
                textFont: {
                    name: "Times New Roman"
                },
                x: 1986,
                y: 1080,
                align: "center"
            },
            {
                key: "recipient.year",
                dataKeys: ["recipient.year"],
                text: dateOfBirth.split(' ')[2],
                textSize: 38,
                textColor: "#000000",
                textStyle: 'bold',
                textFont: {
                    name: "Times New Roman"
                },
                x: 2149,
                y: 1080,
                align: "center"
            },
            {
                key: "certificate.degree",
                dataKeys: ["certificate.degree"],
                text: "{certificate.degree}",
                textSize: 38,
                textColor: "#000000",
                textStyle: 'bold',
                textFont: {
                    name: "Times New Roman"
                },
                x: 2000,
                y: 1139,
                align: "left"
            },
        ],
    }

    let nameData = [
        {
            key: "recipient.nameKm",
            dataKeys: ["recipient.nameKm"],
            text: nameKm,
            textSize: 30,
            textColor: "#000000",
            textStyle: 'bold',
            textFont: {
                name: "Khmer OS Muol Light"
            },
            x: 731,
            y: 1336.5,
            align: "center"
        },
        {
            key: "certificate.faculty",
            dataKeys: ["certificate.faculty"],
            text: faculty,
            textSize: 38,
            textColor: "#000000",
            textStyle: 'bold',
            textFont: {
                name: "Times New Roman"
            },
            x: 2482,
            y: 1200,
            align: "center"
        },
        {
            key: "certificate.major",
            dataKeys: ["certificate.major"],
            text: major,
            textSize: 38,
            textColor: "#000000",
            textStyle: 'bold',
            textFont: {
                name: "Times New Roman"
            },
            x: 2010,
            y: 1200,
            align: "center"
        },
        {
            key: "recipient.placeOfBirth",
            dataKeys: ["recipient.placeOfBirth"],
            text: placeOfBirth,
            textSize: 38,
            textColor: "#000000",
            textStyle: 'bold',
            textFont: {
                name: "Times New Roman"
            },
            x: 2477,
            y: 1080,
            align: "center"
        },
        {
            key: "recipient.name",
            dataKeys: ["recipient.name"],
            text: name,
            textSize: 38,
            textColor: "#000000",
            textStyle: 'bold',
            textFont: {
                name: "Times New Roman"
            },
            x: 2191,
            y: 1257,
            align: "center"
        },
    ]

    const bg = await createTemplateImage(DATA.BACKGROUND.pngFilename);
    const canvas = createCanvas(DATA.BACKGROUND.width, DATA.BACKGROUND.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);

    let newNameKmfontSize = decreaseByWidth(ctx, nameData[0], 329)
    nameData[0].textSize = newNameKmfontSize;

    let facultyWidth = '';
    facultyWidth = getTextMaxWidth(ctx, nameData[1])
    if (facultyWidth.width >= 410) {
        nameData[1].text = certificateInfo.certificate.faculty
        nameData[1].textSize = nameData[1].textSize - 8.5
    }

    let majorWidth = '';
    majorWidth = getTextMaxWidth(ctx, nameData[2])
    if (majorWidth.width >= 431) {
        nameData[2].text = certificateInfo.certificate.major
        nameData[2].textSize = nameData[2].textSize - 4
    }

    let placeOfBirthWidth = '';
    placeOfBirthWidth = getTextMaxWidth(ctx, nameData[3])
    if (placeOfBirthWidth.width >= 388 && placeOfBirthWidth.width <= 436) {
        nameData[3].text = certificateInfo.recipient.placeOfBirth
        nameData[3].textSize = nameData[3].textSize - 3
    } else if (placeOfBirthWidth.width >= 436) {
        nameData[3].text = certificateInfo.recipient.placeOfBirth
        nameData[3].textSize = nameData[3].textSize - 5.7
    }

    // handel longname 
    let prefixWidth = 391;
    let newfontSize = decreaseByWidth(ctx, nameData[4], prefixWidth)
    nameData[4].textSize = newfontSize;

    DATA.TEXTS = [...DATA.TEXTS, ...nameData]

    // Draw Caption 
    for (const text of DATA.TEXTS) {
        if (text.length > 0) {
            for (const index in text) {
                const textItem = text[index];
                let lastItem;
                if (index > 0) lastItem = text[index - 1];

                if (!textItem.x) {
                    const lastFont = resolveFont(DATA.FONTS[0].name, 24, lastItem);
                    ctx.font = lastFont;
                    const lastItemMetric = ctx.measureText(lastItem.text);
                    textItem.x = lastItem.x + lastItemMetric.width + textItem.addX;
                }

                if (!textItem.y) textItem.y = lastItem.y;

                drawTextItem(canvas, ctx, textItem, DATA.FONTS, certificateInfo);
            }
        } else drawTextItem(canvas, ctx, text, DATA.FONTS, certificateInfo);
    }

    // draw profile photo
    if (certificateInfo.recipient.photoUrl) {
        const profileImage = await loadRemoteResource(certificateInfo.recipient.photoUrl);
        if (profileImage) {
            const maxImgBoxWidth = 273;
            const maxImgBoxHeight = 350;

            // get the scale
            // it is the min of the 2 ratios
            let scale_factor = Math.min(maxImgBoxWidth / profileImage.width, maxImgBoxHeight / profileImage.height);

            // Lets get the new width and height based on the scale factor
            let newWidth = profileImage.width * scale_factor;
            let newHeight = profileImage.height * scale_factor;

            // const profileHeight = profileMaxWidth / (profileImage.width / profileImage.height);
            const profileY = 1528.4;
            ctx.drawImage(profileImage, 1503 - (newWidth / 2), profileY, newWidth, newHeight);
        }
    }

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 280, 1609, 210);
    }

    return canvas;
}

const drawTextItem = (canvas, ctx, textItem, FONTS, certificateInfo) => {
    if (textItem.dataKeys && textItem.dataKeys.length > 0) {
        for (const key of textItem.dataKeys)
            textItem.text = textItem.text.replace(`{${key}}`, _.get(certificateInfo, key, ''));
    }

    drawText(canvas, ctx, textItem.text, {
        x: textItem.x,
        y: textItem.y + 34,
        textColor: textItem.textColor || '#000000',
        align: textItem.align,
        font: resolveFont(FONTS[0].name, 24, textItem),
        textMaxWidth: textItem.textMaxWidth
    });
};

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
function resolveFont(defaultFont, defaultSize, textItem) {
    const space = ' ';
    let font = '';
    const fontName = textItem.textFont ? textItem.textFont.name : defaultFont;

    font += textItem.textStyle ? textItem.textStyle + space : '';
    font += textItem.textSize ? textItem.textSize : defaultSize;
    font += 'px' + space;
    font += fontName;
    return font;
}
const getTextMaxWidth = (ctx, textItem) => {
    ctx.font = resolveFont(textItem.textFont, 24, textItem);
    const kmTargetMatric = ctx.measureText(textItem.text);
    return kmTargetMatric;
};
function decreaseByWidth(ctx, textItem, prefixWidth) {
    let isLong = true
    while (isLong) {
        let textWidth = getTextMaxWidth(ctx, textItem);
        if (textWidth.width > prefixWidth) {
            textItem.textSize -= 1;
        } else {
            isLong = false
            break;
        }
    }

    return textItem.textSize;
};
