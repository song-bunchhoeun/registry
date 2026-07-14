import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import {
    createTemplateImage,
    drawText,
    drawWrapTexts,
    loadRemoteResource,
} from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createSSFADiplomaCertificateCanvas(
    certificateInfo = {},
    qrcodeContent
) {
    const SSFA_TEXT_COLORS = {
        black: "#000000",
    };

    const SSFA_FONTS = {
        muol: "Khmer OS Muol Light",
        time: "Times New Roman"
    }
    const SSFA_TEMPLATE_IMAGE = "ssfa-certificate.jpg"

    const logDateKm = _.get(certificateInfo, 'certificate.logDateKm', '');
    const logDate = _.get(certificateInfo, 'certificate.logDate', '');
    const examDateKm = _.get(certificateInfo, 'certificate.examDateKm', '');
    const dateOfBirthKm = _.get(certificateInfo, 'recipient.dateOfBirthKm', '');
    const dateOfBirth = _.get(certificateInfo, 'recipient.dateOfBirth', '');
    const ministerSignatureDateKm = _.get(certificateInfo, 'certificate.ministerSignatureDateKm', '');
    const directorSignatureDate = _.get(certificateInfo, 'certificate.directorSignatureDate', '');
    const nameKm = _.get(certificateInfo, 'recipient.nameKm', '');
    const name = _.get(certificateInfo, 'recipient.name', '');
    const faculty = _.get(certificateInfo, 'certificate.faculty', '');
    const major = _.get(certificateInfo, 'certificate.major', '');
    const placeOfBirth = _.get(certificateInfo, 'recipient.placeOfBirth', '');

    let SSFA_TEXTS = [
        {
            dataKeys: ["certificate.logNumberKm"],
            text: "{certificate.logNumberKm}",
            textSize: 25,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.muol,
            x: 589.5,
            y: 726,
            align: "center"
        },
        {
            dataKeys: [""],
            text: logDateKm.split(' ')[0],
            textSize: 25,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.muol,
            x: 892,
            y: 726,
            align: "center"
        },
        {
            dataKeys: [""],
            text: logDateKm.split(' ')[1],
            textSize: 25,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.muol,
            x: 1009,
            y: 726,
            align: "center"
        },
        {
            dataKeys: [""],
            text: logDateKm.split(' ')[2],
            textSize: 25,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.muol,
            x: 1150,
            y: 726,
            align: "center"
        },
        {
            dataKeys: ["certificate.academicYearKm"],
            text: "{certificate.academicYearKm}",
            textSize: 25,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: "bold",
            textFont: SSFA_FONTS.muol,
            x: 650,
            y: 822,
            align: "left",
        },
        {
            dataKeys: [""],
            text: examDateKm.split(' ')[0],
            textSize: 25,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.muol,
            x: 548,
            y: 870,
            align: "center"
        },
        {
            dataKeys: [""],
            text: examDateKm.split(' ')[1],
            textSize: 25,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.muol,
            x: 689.5,
            y: 870,
            align: "center"
        },
        {
            dataKeys: [""],
            text: examDateKm.split(' ')[2],
            textSize: 25,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.muol,
            x: 831,
            y: 870,
            align: "center"
        },
        {
            dataKeys: ["recipient.nameKm"],
            text: "{recipient.nameKm}",
            textSize: 25,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.muol,
            x: 521.5,
            y: 916.5,
            align: "left"
        },
        {
            dataKeys: [""],
            text: dateOfBirthKm.split(' ')[0],
            textSize: 25,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.muol,
            x: 436,
            y: 965,
            align: "center"
        },
        {
            dataKeys: [""],
            text: dateOfBirthKm.split(' ')[1],
            textSize: 25,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.muol,
            x: 550,
            y: 965,
            align: "center"
        },
        {
            dataKeys: [""],
            text: dateOfBirthKm.split(' ')[2],
            textSize: 25,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.muol,
            x: 677.5,
            y: 965,
            align: "center"
        },
        {
            dataKeys: ["recipient.placeOfBirthKm"],
            text: "{recipient.placeOfBirthKm}",
            textSize: 25,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.muol,
            x: 832,
            y: 965,
            align: "left"
        },
        {
            dataKeys: ["certificate.degreeKm"],
            text: "{certificate.degreeKm}",
            textSize: 25,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.muol,
            x: 832,
            y: 1014,
            align: "left"
        },
        {
            dataKeys: ["certificate.majorKm"],
            text: "{certificate.majorKm}",
            textSize: 25,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.muol,
            x: 512,
            y: 1061,
            align: "center"
        },
        {
            dataKeys: ["certificate.facultyKm"],
            text: "{certificate.facultyKm}",
            textSize: 25,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.muol,
            x: 832,
            y: 1061,
            align: "left"
        },
        {
            dataKeys: ["certificate.number"],
            text: "{certificate.number}",
            textSize: 25,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.muol,
            x: 1246,
            y: 1223,
            align: "left"
        },
        {
            dataKeys: ["certificate.logNumber"],
            text: "{certificate.logNumber}",
            textSize: 32,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.time,
            x: 1776,
            y: 717,
            align: "center"
        },
        {
            dataKeys: [""],
            text: logDate.split(' ')[0],
            textSize: 32,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.time,
            x: 1920.5,
            y: 717,
            align: "center"
        },
        {
            dataKeys: [""],
            text: logDate.split(' ')[1],
            textSize: 32,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.time,
            x: 2027,
            y: 717,
            align: "center"
        },
        {
            dataKeys: [""],
            text: logDate.split(' ')[2],
            textSize: 32,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.time,
            x: 2154,
            y: 717,
            align: "center"
        },
        {
            dataKeys: ["certificate.academicYear"],
            text: "{certificate.academicYear}",
            textSize: 32,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: "bold",
            textFont: SSFA_FONTS.time,
            x: 1860,
            y: 810,
            align: "left",
        },
        {
            dataKeys: ["recipient.name"],
            text: "{recipient.name}",
            textSize: 32,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.time,
            x: 1630,
            y: 857,
            align: "left"
        },
        {
            dataKeys: [""],
            text: dateOfBirth.split(' ')[0],
            textSize: 32,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.time,
            x: 1510,
            y: 905,
            align: "center"
        },
        {
            dataKeys: [""],
            text: dateOfBirth.split(' ')[1],
            textSize: 32,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.time,
            x: 1634,
            y: 905,
            align: "center"
        },
        {
            dataKeys: [""],
            text: dateOfBirth.split(' ')[2],
            textSize: 32,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.time,
            x: 1769,
            y: 905,
            align: "center"
        },
        {
            dataKeys: ["certificate.degree"],
            text: "{certificate.degree}",
            textSize: 32,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.time,
            x: 1640,
            y: 951,
            align: "left"
        },
    ]

    let nameData = [
        {
            dataKeys: ["recipient.nameKm"],
            text: nameKm,
            textSize: 25,
            textStyle: 'bold',
            textFont: SSFA_FONTS.muol,
        },
        {
            dataKeys: ["certificate.faculty"],
            text: faculty,
            textSize: 32,
            textStyle: 'bold',
            textFont: SSFA_FONTS.time,
        },
        {
            dataKeys: ["certificate.major"],
            text: major,
            textSize: 32,
            textStyle: 'bold',
            textFont: SSFA_FONTS.time,
        },
        {
            dataKeys: ["recipient.placeOfBirth"],
            text: placeOfBirth,
            textSize: 32,
            textStyle: 'bold',
            textFont: SSFA_FONTS.time,
        },
        {
            dataKeys: ["recipient.name"],
            text: name,
            textSize: 32,
            textStyle: 'bold',
            textFont: SSFA_FONTS.time,
        },
    ]

    const getTextMaxWidth = (ctx, textItem) => {
        ctx.font = resolveFont(textItem.textFont, textItem.textSize, textItem);
        const targetMatric = ctx.measureText(textItem.text);
        return targetMatric;
    };

    const bg = await createTemplateImage(SSFA_TEMPLATE_IMAGE);
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
            fontSize -= 0.1;
            getTextWidth = getTextMaxWidth(ctx, {
                ...dataItem,
                textSize: fontSize,
            });
        }
        return fontSize;
    };

    const nameKmFontSize = adjustFontSize(ctx, nameData[0], 280);
    const facultyFontSize = adjustFontSize(ctx, nameData[1], 323);
    const majorFontSize = adjustFontSize(ctx, nameData[2], 373);
    const placeOfBirthFontSize = adjustFontSize(ctx, nameData[3], 330);
    const nameFontSzie = adjustFontSize(ctx, nameData[4], 333);

    nameData = [
        {
            dataKeys: ["recipient.nameKm"],
            text: nameKm,
            textSize: nameKmFontSize,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.muol,
            x: 610,
            y: 1108.5,
            align: "center"
        },
        {
            dataKeys: ["certificate.faculty"],
            text: faculty,
            textSize: facultyFontSize,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.time,
            x: 2034.5,
            y: 1000,
            align: "center"
        },
        {
            dataKeys: ["certificate.major"],
            text: major,
            textSize: majorFontSize,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.time,
            x: 1655,
            y: 1000,
            align: "center"
        },
        {
            dataKeys: ["recipient.placeOfBirth"],
            text: placeOfBirth,
            textSize: placeOfBirthFontSize,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.time,
            x: 2031,
            y: 905,
            align: "center"
        },
        {
            dataKeys: ["recipient.name"],
            text: name,
            textSize: nameFontSzie,
            textColor: SSFA_TEXT_COLORS.black,
            textStyle: 'bold',
            textFont: SSFA_FONTS.time,
            x: 1800,
            y: 1045,
            align: "center"
        },
    ]

    SSFA_TEXTS = [...SSFA_TEXTS, ...nameData]

    for (const text of SSFA_TEXTS) {
        if (text.dataKeys && text.dataKeys.length > 0) {
            for (const key of text.dataKeys)
                text.text = String(text.text || "").replace(
                    `{${key}}`,
                    _.get(certificateInfo, key, "")
                );
        }

        drawText(canvas, ctx, text.text, {
            x: text.x,
            y: text.y,
            textColor: text.textColor || SSFA_TEXT_COLORS.black,
            align: text.align,
            font: resolveFont(SSFA_FONTS.time, 24, text),
        });
    }

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 255, 1304, 175);
    }

    // draw profile photo
    if (certificateInfo.recipient.photoUrl) {
        const profileImage = await loadRemoteResource(certificateInfo.recipient.photoUrl);
        if (profileImage) {
            const maxImgBoxWidth = 220;
            const maxImgBoxHeight = 290;

            // get the scale
            // it is the min of the 2 ratios
            let scale_factor = Math.min(maxImgBoxWidth / profileImage.width, maxImgBoxHeight / profileImage.height);

            // Lets get the new width and height based on the scale factor
            let newWidth = profileImage.width * scale_factor;
            let newHeight = profileImage.height * scale_factor;

            // const profileHeight = profileMaxWidth / (profileImage.width / profileImage.height);
            const profileY = 1247;
            ctx.drawImage(profileImage, 1240 - (newWidth / 2), profileY, newWidth, newHeight);
        }
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
    const logoPath = path.join(process.cwd(), "assets", "qr-bg-v2.png");
    const qrcodeLogoImage = await loadImage(logoPath);
    const gapSize = (width * 10) / 120; //
    const qrcodeSize = width - gapSize * 2; // exclude margin x,y
    const height = (width * 148) / 120;
    ctx.drawImage(qrcodeLogoImage, x, y, width, height);
    const qrcodeBuffer = await QRCode.toBuffer(qrcodeContent, {
        margin: 0,
        width: qrcodeSize,
    });
    const qrcodeImage = await loadImage(qrcodeBuffer);
    ctx.drawImage(qrcodeImage, x + gapSize, y + gapSize);
}
// 'style size fontName' ex:'bold 20px Arial'
function resolveFont(defaultFont, defaultSize, text) {
    const space = " ";
    let font = "";
    const fontName = text.textFont ? text.textFont : defaultFont;

    font += text.textStyle ? text.textStyle + space : "";
    font += text.textSize ? text.textSize : defaultSize;
    font += "px" + space;
    font += fontName;

    return font;
}
