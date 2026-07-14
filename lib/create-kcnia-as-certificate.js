import { Image, createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";
import axios from "axios";
import sharp from "sharp";
import { drawWrapTexts } from "./shared";

export async function createKCNIAAssociateCert(
    certificateInfo = {},
    qrcodeContent
) {
    const DATA = {
        BACKGROUND: {
            pngFilename: "kcnia-as.jpg",
        },
        FONTS: [
            { name: "Khmer OS Battambang", filename: "KhmerOS_battambang.ttf" },
            { name: "Khmer OS Muol Light", filename: "KhmerOSmuollight.ttf" },
            { name: "Times New Roman", filename: "times.ttf" },
        ],
        TEXTS: [],
        QRCODE: { width: 244, height: 300.93333333333334, x: 302, y: 1537 },
    };

    const MPTC_TEXT_COLORS = {
        black: "#000000",
        pink: "#FF204E",
    };

    const dateKmIndex1 = _.get(
        certificateInfo,
        "certificate.logDateKm",
        ""
    ).split(" ")[1];

    const dateKmIndex2 = _.get(
        certificateInfo,
        "certificate.logDateKm",
        ""
    ).split(" ")[2];

    const splitZeroKm = () => {
        const date = _.get(certificateInfo, "certificate.logDateKm", "").split(
            " "
        )[0];
        return date.replace(/០/g, "");
    };

    const dateIndex1 = _.get(certificateInfo, "certificate.logDate", "").split(
        " "
    )[1];

    const dateIndex2 = _.get(certificateInfo, "certificate.logDate", "").split(
        " "
    )[2];

    const splitZero = () => {
        const date = _.get(certificateInfo, "certificate.logDate", "").split(
            " "
        )[0];
        return date.replace(/0/g, "");
    };

    const KM_TEXTS = [
        {
            dataKeys: ["certificate.logDateKm"],
            text: `ចុះ${splitZeroKm()} ${dateKmIndex1} ${dateKmIndex2}`,
            textSize: 44,
            textFont: DATA.FONTS[0],
            textColor: MPTC_TEXT_COLORS.black,
            x: 1057.5,
            y: 1140,
        },
        {
            dataKeys: ["recipient.nameKm"],
            text: "{recipient.nameKm}",
            textSize: 45,
            textFont: DATA.FONTS[1],
            textColor: MPTC_TEXT_COLORS.black,
            x: 635.6,
            y: 1231.5,
        },
        {
            dataKeys: ["recipient.dateOfBirthKm"],
            text: "{recipient.dateOfBirthKm}",
            textSize: 45,
            textFont: DATA.FONTS[0],
            textColor: MPTC_TEXT_COLORS.black,
            x: 635.6,
            y: 1321.8,
        },
        {
            dataKeys: ["recipient.placeOfBirthKm"],
            text: "{recipient.placeOfBirthKm}",
            textSize: 45,
            textFont: DATA.FONTS[0],
            textColor: MPTC_TEXT_COLORS.black,
            x: 635.6,
            y: 1411.8,
        },
        {
            dataKeys: ["certificate.degreeKm"],
            text: "{certificate.degreeKm}",
            textSize: 45,
            textFont: DATA.FONTS[1],
            textColor: MPTC_TEXT_COLORS.black,
            x: 635.6,
            y: 1592.5,
        },
    ];

    const EN_TEXTS = [
        {
            dataKeys: ["certificate.logDate"],
            text: `${splitZero()} ${dateIndex1} ${dateIndex2}`,
            textSize: 49,
            textFont: DATA.FONTS[2],
            textColor: MPTC_TEXT_COLORS.black,
            x: 2856,
            y: 1141.5,
        },
        {
            dataKeys: ["recipient.name"],
            text: "{recipient.name}",
            textSize: 50,
            textFont: DATA.FONTS[2],
            textColor: MPTC_TEXT_COLORS.black,
            textStyle: "bold",
            x: 2347,
            y: 1231.6,
        },
        {
            dataKeys: ["recipient.dateOfBirth"],
            text: "{recipient.dateOfBirth}",
            textSize: 50,
            textFont: DATA.FONTS[2],
            textColor: MPTC_TEXT_COLORS.black,
            x: 2347,
            y: 1321.8,
        },
        {
            dataKeys: ["recipient.placeOfBirth"],
            text: "{recipient.placeOfBirth}",
            textSize: 50,
            textFont: DATA.FONTS[2],
            textColor: MPTC_TEXT_COLORS.black,
            x: 2347,
            y: 1411.8,
        },
        {
            dataKeys: ["certificate.degree"],
            text: "{certificate.degree}",
            textSize: 50,
            textFont: DATA.FONTS[2],
            textColor: MPTC_TEXT_COLORS.black,
            textStyle: "bold",
            x: 2014,
            y: 1592.5,
        },
    ];

    let DEGREE_TEXTS = [
        {
            dataKeys: ["certificate.majorKm"],
            text: "{certificate.majorKm}",
            textSize: 46,
            textFont: DATA.FONTS[1],
            textColor: MPTC_TEXT_COLORS.black,
        },
        {
            dataKeys: ["certificate.major"],
            text: "{certificate.major}",
            textSize: 50,
            textFont: DATA.FONTS[2],
            textColor: MPTC_TEXT_COLORS.black,
            textStyle: "bold",
        },
    ];

    const getTextMaxWidth = (ctx, textItem) => {
        ctx.font = resolveFont(textItem.textFont, textItem.textSize, textItem);
        const targetMatric = ctx.measureText(textItem.text);
        return targetMatric;
    };

    const bg = await createTemplateImage(DATA.BACKGROUND.pngFilename);
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

    const degreeKmFontSize = adjustFontSize(ctx, DEGREE_TEXTS[0], 870);
    const degreeFontSize = adjustFontSize(ctx, DEGREE_TEXTS[1], 1200);

    DEGREE_TEXTS = [
        {
            dataKeys: ["certificate.majorKm"],
            text: "{certificate.majorKm}",
            textSize: degreeKmFontSize,
            textFont: DATA.FONTS[1],
            textColor: MPTC_TEXT_COLORS.black,
            x: 635.6,
            y: 1681.5,
        },
        {
            dataKeys: ["certificate.major"],
            text: "{certificate.major}",
            textSize: degreeFontSize,
            textFont: DATA.FONTS[2],
            textColor: MPTC_TEXT_COLORS.black,
            textStyle: "bold",
            x: 2065,
            y: 1681.5,
        },
    ];

    DATA.TEXTS = [...DATA.TEXTS, ...KM_TEXTS, ...EN_TEXTS, ...DEGREE_TEXTS];

    const canvasWidth = bg.width;
    const numberTextWidth = 700;
    const centerOfCanvas = canvasWidth / 2;
    const numberTextCenter = centerOfCanvas - numberTextWidth / 2;

    drawWrapTexts(ctx, {
        top: 1777,
        left: numberTextCenter,
        width: numberTextWidth,
        textAlignment: "center",
        lineHeight: 1,
        spans: [
            {
                text: "លេខ",
                fontSize: 48,
                fontFamily: "Khmer OS Battambang",
                fillStyle: MPTC_TEXT_COLORS.black,
                fontWeight: "400",
            },
            {
                text: `/Nᵒ : ${certificateInfo.certificate.number}`,
                fontSize: 48,
                fontFamily: "Times New Roman",
                fillStyle: MPTC_TEXT_COLORS.black,
                fontWeight: "400",
            },
        ],
    }).draw();

    let profileX;
    let profileY;
    let sizeBy;
    // draw profile photo
    if (certificateInfo.recipient.photoUrl) {
        try {
            const response = await axios({
                url: certificateInfo.recipient.photoUrl,
                responseType: "arraybuffer",
            });
            const resBuffer = response.data;
            const img = sharp(resBuffer);
            const maxY = 1630;
            const maxImgBoxWidth = 270;
            const maxImgBoxHeight = 380;

            profileX = bg.width / 2 - 7;
            let imgSize = [];
            let resizedBuffer;

            const wImg = img.clone();
            const wToBuffer = await wImg
                .resize({ width: maxImgBoxWidth, fit: sharp.fit.contain })
                .jpeg({ quality: 100 })
                .toBuffer({ resolveWithObject: true });
            imgSize = [wToBuffer.info.width, wToBuffer.info.height];
            resizedBuffer = wToBuffer.data;
            sizeBy = "width";

            if (imgSize[1] > maxImgBoxHeight) {
                const hImg = img.clone();
                const hToBuffer = await hImg
                    .resize({ height: maxImgBoxHeight, fit: sharp.fit.contain })
                    .jpeg({ quality: 100 })
                    .toBuffer({ resolveWithObject: true });
                imgSize = [hToBuffer.info.width, hToBuffer.info.height];
                resizedBuffer = hToBuffer.data;
                sizeBy = "height";
            }

            profileY = maxY - imgSize[1];
            const image = new Image();
            image.src = resizedBuffer;
            profileX = profileX - imgSize[0] / 2;
            profileY -= 3;
            ctx.drawImage(image, profileX, profileY, imgSize[0], imgSize[1]);
        } catch (err) {
            console.log(err);
        }
    }

    // Draw Caption
    for (const text of DATA.TEXTS) {
        if (text.length > 0) {
            for (const index in text) {
                const textItem = text[index];
                let lastItem;
                if (index > 0) lastItem = text[index - 1];

                if (!textItem.x) {
                    const lastFont = resolveFont(
                        DATA.FONTS[0].name,
                        24,
                        lastItem
                    );
                    ctx.font = lastFont;
                    const lastItemMetric = ctx.measureText(lastItem.text);
                    textItem.x =
                        lastItem.x + lastItemMetric.width + textItem.addX;
                }

                if (!textItem.y) textItem.y = lastItem.y;

                drawTextItem(
                    canvas,
                    ctx,
                    textItem,
                    DATA.FONTS[0].name,
                    certificateInfo
                );
            }
        } else
            drawTextItem(
                canvas,
                ctx,
                text,
                DATA.FONTS[0].name,
                certificateInfo
            );
    }

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 1610, 1846, 295);
    }
    //{ canvas, profileX, profileY, sizeBy }
    return canvas;
}

const drawTextItem = (canvas, ctx, textItem, defaultFont, certificateInfo) => {
    if (textItem.dataKeys && textItem.dataKeys.length > 0) {
        for (const key of textItem.dataKeys)
            textItem.text = textItem.text.replace(
                `{${key}}`,
                _.get(certificateInfo, key, "")
            );
    }

    if (textItem.scale) {
        ctx.strokeStyle = textItem.strokeColor;
        ctx.lineWidth = textItem.strokeLine;
        ctx.fillStyle = textItem.textColor;
        ctx.font = resolveFont(defaultFont, 24, textItem);
        ctx.save(); // Save the current context settings
        ctx.scale(textItem.scale, 1); // Scale horizontally while maintaining vertical scale
        ctx.strokeText(textItem.text, textItem.x / textItem.scale, textItem.y);
        ctx.fillText(textItem.text, textItem.x / textItem.scale, textItem.y); // Divide x position by scale to offset the scaling effect
        ctx.restore();
    } else {
        drawText(canvas, ctx, textItem.text, {
            x: textItem.x,
            y: textItem.y,
            textColor: textItem.textColor || MPTC_TEXT_COLORS.black,
            align: textItem.align,
            font: resolveFont(defaultFont, 24, textItem),
            strokeLine: textItem.strokeLine || 0,
            strokeColor: textItem.strokeColor,
            textMaxWidth: textItem.textMaxWidth,
        });
    }
};

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
    const fontName = text.textFont ? text.textFont.name : defaultFont;

    font += text.textStyle ? text.textStyle + space : "";
    font += text.textSize ? text.textSize : defaultSize;
    font += "px" + space;
    font += fontName;
    return font;
}
