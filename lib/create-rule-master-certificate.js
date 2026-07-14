import { Image, createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import {
    createTemplateImage,
    drawText,
    drawWrapTexts,
    drawJustifyWrapTexts,
} from "./shared";
import QRCode from "qrcode";
import _ from "lodash";
import axios from "axios";
import sharp from "sharp";

export async function createRULEMasterCertificate(
    certificateInfo = {},
    qrcodeContent
) {
    const major = _.get(certificateInfo, "certificate.major", "");
    const specializedIn = _.get(certificateInfo, "certificate.specialized", "");
    const specializedInKm = _.get(
        certificateInfo,
        "certificate.specializedKm",
        ""
    );
    const majorKm = _.get(certificateInfo, "certificate.majorKm", "");
    const name = _.get(certificateInfo, "recipient.name", "");
    const gender = _.get(certificateInfo, "recipient.gender", "");
    const nameKm = _.get(certificateInfo, "recipient.nameKm", "");
    const genderKm = _.get(certificateInfo, "recipient.genderKm", "");
    const degreeKm = _.get(certificateInfo, "certificate.degreeKm", "");
    const degree = _.get(certificateInfo, "certificate.degree", "");
    const collaborationKm = _.get(
        certificateInfo,
        "certificate.collaborationKm",
        ""
    );
    const collaboration = _.get(
        certificateInfo,
        "certificate.collaboration",
        ""
    );
    const number = _.get(certificateInfo, "certificate.number", "");

    const isFinalExam = certificateInfo.certificate.type === 'Defense Thesis Committee' ? '' : 'សម័យប្រឡង '

    const DATA = {
        BACKGROUND: {
            pngFilename: "rule-master-certificate.jpg",
        },
        TEXTS: [],
    };

    const RULE_TEXT_COLORS = {
        black: "#000000",
        pink: "#F72798",
    };

    const RULE_FONTS = {
        primary: {name: "Khmer OS Content", filename: "KhmerOScontent.ttf"},
        secondary: {name: "Khmer OS Muol Light", filename: "KhmerOSmuollight.ttf"},
        thirdly: {name: "Arial Narrow", filename: "Arial Narrow.ttf"},
        fourly: {name: "Arial", filename: "Arial.ttf"},
    };

    const specificMajorKm = [
        'សហគ្រិនភាព និងគ្រប់គ្រងគម្រោង',
    ]

    const majorTextKm = specificMajorKm.includes(majorKm) ? `\n${majorKm}` : majorKm;

    const KM_TEXTS = [
        {
            dataKeys: ["certificate.logDateKm"],
            text: "បានឃើញកំណត់ហេតុចុះ{certificate.logDateKm} របស់គណៈកម្មការ",
            textSize: 36,
            textFont: RULE_FONTS.primary,
            textColor: RULE_TEXT_COLORS.black,
            x: 418.2,
            y: 1140,
            align: "left",
            strokeColor: RULE_TEXT_COLORS.black,
            strokeLine: 1,
        },
        {
            dataKeys: ["certificate.typeKm", "certificate.examDateKm"],
            text: "{certificate.typeKm}បញ្ចប់ការសិក្សា " +  "នា" + isFinalExam +"{certificate.examDateKm}",
            textSize: 36,
            textFont: RULE_FONTS.primary,
            textColor: RULE_TEXT_COLORS.black,
            x: 418.2,
            y: 1215.2,
            align: "left",
            strokeColor: RULE_TEXT_COLORS.black,
            strokeLine: 1,
        },
        {
            dataKeys: ["recipient.dateOfBirthKm", "recipient.placeOfBirthKm"],
            text: "កើត{recipient.dateOfBirthKm} នៅ{recipient.placeOfBirthKm}",
            textSize: 36,
            textFont: RULE_FONTS.primary,
            textColor: RULE_TEXT_COLORS.black,
            x: 418.2,
            y: 1390,
            align: "left",
            strokeColor: RULE_TEXT_COLORS.black,
            strokeLine: 1,
        },
        {
            dataKeys: [],
            text: "បានបំពេញគ្រប់លក្ខខណ្ឌរបស់សាកលវិទ្យាល័យ",
            textSize: 36,
            textFont: RULE_FONTS.primary,
            textColor: RULE_TEXT_COLORS.black,
            x: 418.2,
            y: 1463,
            align: "left",
            strokeColor: RULE_TEXT_COLORS.black,
            strokeLine: 1,
        },
        {
            dataKeys: [],
            text: "ប្រធានក្រុមប្រឹក្សាភិបាល",
            textSize: 41.5,
            textFont: RULE_FONTS.secondary,
            textColor: RULE_TEXT_COLORS.black,
            x: 974,
            y: 1769,
            align: "center",
            strokeColor: RULE_TEXT_COLORS.black,
            strokeLine: 0.5,
        },
        {
            dataKeys: [],
            text: "Chairman of the Board of Directors",
            textSize: 43,
            textFont: RULE_FONTS.fourly,
            textColor: RULE_TEXT_COLORS.black,
            x: 974,
            y: 1832,
            align: "center",
            textStyle: "bold",
        },
    ];

    let NAME_GENDER_KM = [
        [
            {
                dataKeys: [],
                text: "បញ្ជាក់ថា",
                textSize: 36,
                textFont: RULE_FONTS.primary,
                textColor: RULE_TEXT_COLORS.black,
                x: 418.2,
                y: 1300,
                align: "left",
                strokeColor: RULE_TEXT_COLORS.black,
                strokeLine: 1,
            },
            {
                dataKeys: ["recipient.nameKm"],
                text: nameKm,
                textSize: 50,
                textFont: RULE_FONTS.secondary,
                textColor: RULE_TEXT_COLORS.black,
                addX: 27,
                y: 1300,
                align: "left",
            },
            {
                dataKeys: ["recipient.genderKm"],
                text: `ភេទ  ${genderKm}`,
                textSize: 36,
                textFont: RULE_FONTS.primary,
                textColor: RULE_TEXT_COLORS.black,
                addX: 20,
                y: 1300,
                align: "left",
                strokeColor: RULE_TEXT_COLORS.black,
                strokeLine: 1,
            },
        ],
    ];

    const EN_TEXTS = [
        {
            dataKeys: ["certificate.logDate"],
            text: "having seen the minutes dated  {certificate.logDate}  of the",
            textSize: 45,
            textFont: RULE_FONTS.thirdly,
            textColor: RULE_TEXT_COLORS.black,
            x: 2065,
            y: 1152.3,
            align: "left",
            strokeColor: RULE_TEXT_COLORS.black,
            strokeLine: 1,
        },
        {
            dataKeys: ["certificate.type", "certificate.examDate"],
            text: "{certificate.type} for the session of {certificate.examDate}",
            textSize: 45,
            textFont: RULE_FONTS.thirdly,
            textColor: RULE_TEXT_COLORS.black,
            x: 2065,
            y: 1218.4,
            align: "left",
            strokeColor: RULE_TEXT_COLORS.black,
            strokeLine: 1,
        },
        {
            dataKeys: ["recipient.dateOfBirth", "recipient.placeOfBirth"],
            text: "born on {recipient.dateOfBirth} in {recipient.placeOfBirth}",
            textSize: 45,
            textFont: RULE_FONTS.thirdly,
            textColor: RULE_TEXT_COLORS.black,
            x: 2065,
            y: 1355,
            align: "left",
            strokeColor: RULE_TEXT_COLORS.black,
            strokeLine: 1,
        },
        {
            dataKeys: [],
            text: "has satisfied the requirements of the University",
            textSize: 45,
            textFont: RULE_FONTS.thirdly,
            textColor: RULE_TEXT_COLORS.black,
            x: 2065,
            y: 1429.2,
            align: "left",
            strokeColor: RULE_TEXT_COLORS.black,
            strokeLine: 1,
        },
        {
            dataKeys: ["certificate.rectorSignatureDate"],
            text: "Phnom Penh, {certificate.rectorSignatureDate}",
            textSize: 42,
            textFont: RULE_FONTS.thirdly,
            textColor: RULE_TEXT_COLORS.black,
            x: 2420,
            y: 1726,
            align: "left",
            strokeColor: RULE_TEXT_COLORS.black,
            strokeLine: 1,
        },
    ];

    const CERT_ID = [
        {
            dataKeys: ["certificate.number"],
            text: number,
            textSize: 40,
            textFont: RULE_FONTS.thirdly,
            textColor: RULE_TEXT_COLORS.black,
            y: 1702.3,
            x: 1775.5,
            align: "center",
            strokeColor: RULE_TEXT_COLORS.black,
            strokeLine: 1,
        },
    ];

    let NAME_GENDER_EN = [
        [
            {
                dataKeys: [],
                text: "certifies that ",
                textSize: 45,
                textFont: RULE_FONTS.thirdly,
                textColor: RULE_TEXT_COLORS.black,
                x: 2065,
                y: 1287,
                align: "left",
                strokeColor: RULE_TEXT_COLORS.black,
                strokeLine: 1,
            },
            {
                dataKeys: ["recipient.name"],
                text: name,
                textSize: 45,
                textFont: RULE_FONTS.thirdly,
                textColor: RULE_TEXT_COLORS.black,
                addX: 13,
                y: 1287,
                align: "left",
                textStyle: "bold",
                strokeColor: RULE_TEXT_COLORS.black,
                strokeLine: 1,
            },
            {
                dataKeys: ["recipient.gender"],
                text: `Sex ${gender}`,
                textSize: 45,
                textFont: RULE_FONTS.thirdly,
                textColor: RULE_TEXT_COLORS.black,
                addX: 35,
                y: 1287,
                align: "left",
                strokeColor: RULE_TEXT_COLORS.black,
                strokeLine: 1,
            },
        ],
    ];

    let modifiedSizeText = [
        {
            dataKeys: ["certificate.majorKm"],
            text: `${degreeKm} ${majorKm}`,
            textSize: 36,
            textFont: RULE_FONTS.secondary,
        },
        {
            dataKeys: ["certificate.major"],
            text: `${major}`,
            textSize: 43,
            textFont: RULE_FONTS.thirdly,
            textStyle: "bold",
        },
        {
            dataKeys: ["certificate.specialized"],
            text: specializedIn,
            textSize: 43,
            textFont: RULE_FONTS.thirdly,
            textStyle: "bold",
        },
        {
            dataKeys: ["certificate.specializedKm"],
            text: specializedInKm,
            textSize: 36,
            textFont: RULE_FONTS.secondary,
        },
        {
            dataKeys: ["certificate.collaborationKm"],
            text: collaborationKm,
            textSize: 36,
            textFont: RULE_FONTS.primary,
        },
        {
            dataKeys: ["certificate.collaboration"],
            text: collaboration,
            textSize: 45,
            textFont: RULE_FONTS.thirdly,
            textStyle: "bold",
        },
    ];

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

    const degreeKmFontSize = adjustFontSize(ctx, modifiedSizeText[0], 1095 * 2);
    const degreeFontSize = adjustFontSize(ctx, modifiedSizeText[1], 2090 - 300);
    const specializedFontSize = adjustFontSize(ctx, modifiedSizeText[2], 780);
    const specializedKmFontSize = adjustFontSize(ctx, modifiedSizeText[3], 945);
    const collaborationKmFontSize = adjustFontSize(
        ctx,
        modifiedSizeText[4],
        1095
    );
    const collaborationFontSize = adjustFontSize(
        ctx,
        modifiedSizeText[5],
        1025
    );

    const degreeWrapKm = drawWrapTexts(ctx, {
        top: 1540,
        left: 418.2,
        width: 1095,
        textAlignment: "left",
        lineHeight: 2,
        spans: [
            {
                text: "សម្រាប់ទទួលសញ្ញាបត្រ ",
                fontSize: 36,
                fontFamily: RULE_FONTS.primary.name,
                fillStyle: RULE_TEXT_COLORS.black,
                strokeColor: RULE_TEXT_COLORS.black,
                fontWeight: "bold",
            },
            {
                text:
                    `${degreeKm} ` +
                    majorTextKm +
                    (!specializedInKm && !collaborationKm ? "។" : ""),
                fontSize: degreeKmFontSize,
                fontFamily: RULE_FONTS.secondary.name,
                fillStyle: RULE_TEXT_COLORS.black,
            },
        ],
    });

    const specializedInWrapKm = drawWrapTexts(ctx, {
        top: degreeWrapKm.height() > 36 ? 1689.7 : 1614.7,
        left: 418.2,
        width: 1095,
        textAlignment: "left",
        lineHeight: 2,
        spans: [
            {
                text: specializedInKm && "ឯកទេស ",
                fontSize: 36,
                fontFamily: RULE_FONTS.primary.name,
                fillStyle: RULE_TEXT_COLORS.black,
                fontWeight: "bold",
            },
            {
                text:
                    ` ${specializedInKm}` +
                    (specializedInKm && !collaborationKm ? "។" : ""),
                fontSize: specializedKmFontSize,
                fontFamily: RULE_FONTS.secondary.name,
                fillStyle: RULE_TEXT_COLORS.black,
            },
        ],
    });

    const collaborationWrapKm = drawWrapTexts(ctx, {
        top: (() => {
            const degreeHeight = degreeWrapKm.height();
            const specExists = !!specializedInKm;
            const specHeight = specExists ? specializedInWrapKm.height() : 0;

            if (degreeHeight <= 36 && !specExists) {
                return 1614.7;
            }
            if (degreeHeight > 36 && !specExists) {
                return 1689.7;
            }
            if (degreeHeight <= 36 && specHeight <= 36) {
                return 1689.7;
            }
            if (degreeHeight > 36 && specHeight <= 36) {
                return 1764.7;
            }

            return 1614.7;
        })(),
        left: 418.2,
        width: 1095,
        textAlignment: "left",
        lineHeight: 2,
        spans: [
            {
                text: `${collaborationKm}` + (collaborationKm && "។"),
                fontSize: collaborationKmFontSize,
                fontFamily: RULE_FONTS.primary.name,
                fillStyle: RULE_TEXT_COLORS.black,
                fontWeight: "bold",
            },
        ],
    });

    degreeWrapKm.draw();
    specializedInWrapKm.draw();
    collaborationWrapKm.draw();

    const degreeWrapEn = drawJustifyWrapTexts(ctx, {
        top: 1492,
        left: 2065,
        width: 1050,
        textAlignment: "left",
        lineHeight: 1.4,
        spans: [
            {
                text: `for the award of the ${degree} in `,
                fontSize: 45,
                fontFamily: RULE_FONTS.thirdly.name,
                fillStyle: RULE_TEXT_COLORS.black,
                fontWeight: "600",
            },
            {
                text:
                    `${major}` + (!specializedIn && !collaboration ? "." : ""),
                fontSize: degreeFontSize,
                fontFamily: RULE_FONTS.thirdly.name,
                fillStyle: RULE_TEXT_COLORS.black,
                fontWeight: "bold",
                strokeLine: 1,
                strokeColor: RULE_TEXT_COLORS.black,
            },
        ],
    });

    const specializedInWrapEn = drawJustifyWrapTexts(ctx, {
        top: degreeWrapEn.height() > 45 ? 1616.2 : 1553.2,
        left: 2065,
        width: 1040,
        textAlignment: "left",
        lineHeight: 1.4,
        spans: [
            {
                text: specializedIn && "specializing in ",
                fontSize: 45,
                fontFamily: RULE_FONTS.thirdly.name,
                fillStyle: RULE_TEXT_COLORS.black,
                fontWeight: "bold",
            },
            {
                text:
                    `${specializedIn}` +
                    (specializedIn && !collaboration ? "." : ""),
                fontSize: specializedFontSize,
                fontFamily: RULE_FONTS.thirdly.name,
                fillStyle: RULE_TEXT_COLORS.black,
                fontWeight: "bold",
                strokeLine: 1,
                strokeColor: RULE_TEXT_COLORS.black,
            },
        ],
    });

    const collaborationWrapEn = drawWrapTexts(ctx, {
        top: (() => {
            const degreeHeight = degreeWrapEn.height();
            const specExists = !!specializedIn;
            const specHeight = specExists ? specializedInWrapEn.height() : 0;

            if (degreeHeight <= 45 && !specExists) {
                return 1553.2;
            }
            if (degreeHeight > 45 && !specExists) {
                return 1616.2;
            }
            if (degreeHeight < 45 && specHeight <= 45) {
                return 1679.2;
            }
            if (degreeHeight > 45 && specHeight <= 45) {
                return 1679.2;
            }
            return 1616.2;
        })(),
        left: 2065,
        width: 940,
        textAlignment: "left",
        lineHeight: 1.4,
        spans: [
            {
                text: `${collaboration}` + (collaboration && "."),
                fontSize: collaborationFontSize,
                fontFamily: RULE_FONTS.thirdly.name,
                fillStyle: RULE_TEXT_COLORS.black,
                fontWeight: "bold",
            },
        ],
    });

    degreeWrapEn.draw();
    specializedInWrapEn.draw();
    collaborationWrapEn.draw();

    const items = NAME_GENDER_KM[0];
    const totalWidth = items.reduce((sum, item) => {
        return sum + getTextMaxWidth(ctx, { ...item }).width;
    }, 0);

    const adjustedItems = [...items];
    if (totalWidth > 1090) {
        const fixedWidth =
            getTextMaxWidth(ctx, { ...items[0] }).width +
            getTextMaxWidth(ctx, { ...items[2] }).width;
        adjustedItems[1] = {
            ...items[1],
            textSize: adjustFontSize(ctx, items[1], 1060 - fixedWidth),
        };
    }

    const nameFontSizes = adjustedItems.map((item) => item.textSize);

    const itemsEn = NAME_GENDER_EN[0];
    const totalWidthEn = itemsEn.reduce((sum, item) => {
        return sum + getTextMaxWidth(ctx, { ...item }).width;
    }, 0);

    const adjustedItemsEn = [...itemsEn];
    if (totalWidthEn > 940) {
        const fixedWidthEn =
            getTextMaxWidth(ctx, { ...itemsEn[0] }).width +
            getTextMaxWidth(ctx, { ...itemsEn[2] }).width;
        adjustedItemsEn[1] = {
            ...itemsEn[1],
            textSize: adjustFontSize(ctx, itemsEn[1], 940 - fixedWidthEn),
        };
    }

    const nameFontSizesEn = adjustedItemsEn.map((item) => item.textSize);

    NAME_GENDER_KM = [
        [
            {
                dataKeys: [],
                text: "បញ្ជាក់ថា",
                textSize: 36,
                textFont: RULE_FONTS.primary,
                textColor: RULE_TEXT_COLORS.black,
                x: 418.2,
                y: 1300,
                align: "left",
                strokeColor: RULE_TEXT_COLORS.black,
                strokeLine: 1,
            },
            {
                dataKeys: ["recipient.nameKm"],
                text: nameKm,
                textSize: nameFontSizes[1],
                textFont: RULE_FONTS.secondary,
                textColor: RULE_TEXT_COLORS.black,
                addX: 27,
                y: 1300,
                align: "left",
            },
            {
                dataKeys: ["recipient.genderKm"],
                text: `ភេទ  ${genderKm}`,
                textSize: 36,
                textFont: RULE_FONTS.primary,
                textColor: RULE_TEXT_COLORS.black,
                addX: 20,
                y: 1300,
                align: "left",
                strokeColor: RULE_TEXT_COLORS.black,
                strokeLine: 1,
            },
        ],
    ];

    NAME_GENDER_EN = [
        [
            {
                dataKeys: [],
                text: "certifies that ",
                textSize: 45,
                textFont: RULE_FONTS.thirdly,
                textColor: RULE_TEXT_COLORS.black,
                x: 2065,
                y: 1287,
                align: "left",
                strokeColor: RULE_TEXT_COLORS.black,
                strokeLine: 1,
            },
            {
                dataKeys: ["recipient.name"],
                text: name,
                textSize: nameFontSizesEn[1],
                textFont: RULE_FONTS.thirdly,
                textColor: RULE_TEXT_COLORS.black,
                addX: 13,
                y: 1287,
                align: "left",
                textStyle: "bold",
                strokeColor: RULE_TEXT_COLORS.black,
                strokeLine: 1,
            },
            {
                dataKeys: ["recipient.gender"],
                text: `Sex ${gender}`,
                textSize: 45,
                textFont: RULE_FONTS.thirdly,
                textColor: RULE_TEXT_COLORS.black,
                addX: 35,
                y: 1287,
                align: "left",
                strokeColor: RULE_TEXT_COLORS.black,
                strokeLine: 1,
            },
        ],
    ];

    let profileX;
    let profileY;
    let imgSize = [];
    let sizeBy;

    // draw profile photo
    if (certificateInfo.recipient.photoUrl) {
        let resBuffer;
        try {
            const response = await axios({
                url: certificateInfo.recipient.photoUrl,
                responseType: "arraybuffer",
            });
            resBuffer = response.data;
            const rotatedBuffer = await jo.rotate(resBuffer, { quality: 100 });
            resBuffer = rotatedBuffer.buffer;
        } catch (err) {
            console.log(err);
        }

        const img = sharp(resBuffer, { failOn: "truncated" });
        const maxY = 2033.5;
        // const maxImgBoxWidth = 232;
        // const maxImgBoxHeight = 285;
        const maxImgBoxWidth = 265;
        const maxImgBoxHeight = 294;
        profileX = bg.width / 2;
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
    }

    DATA.TEXTS = [
        ...DATA.TEXTS,
        ...KM_TEXTS,
        ...NAME_GENDER_KM,
        ...EN_TEXTS,
        ...CERT_ID,
        ...NAME_GENDER_EN,
    ];

    // Draw Caption
    for (const text of DATA.TEXTS) {
        if (text.length > 0) {
            for (const index in text) {
                const textItem = text[index];
                let lastItem;
                if (index > 0) lastItem = text[index - 1];

                if (!textItem.x) {
                    const lastFont = resolveFont(
                        RULE_FONTS.primary,
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
                    RULE_FONTS.primary,
                    certificateInfo
                );
            }
        } else
            drawTextItem(
                canvas,
                ctx,
                text,
                RULE_FONTS.primary,
                certificateInfo
            );
    }

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 318, 1832.4, 268);
    }
    return canvas;
}

const getTextMaxWidth = (ctx, textItem) => {
    ctx.font = resolveFont(textItem.textFont, 24, textItem);
    const kmTargetMatric = ctx.measureText(textItem.text);
    return kmTargetMatric;
};

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
