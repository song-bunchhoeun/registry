import { createCanvas, loadImage, Image } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, loadRemoteResource, drawPreview } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";
import { drawWrapTexts } from "./create-biu-np-bachelor-certificate";
import axios from "axios";
import sharp from "sharp";
import jo from "jpeg-autorotate";

export async function createRUABachelorCertificate(
    certificateInfo = {},
    qrcodeContent,
    preview
) {
    const MPTC_TEXT_COLORS = {
        black: "#010101",
    };

    const MPTC_FONTS = {
        primary: "Khmer OS Muol Light",
        secondary: "Times New Roman",
        thirdly: "Algerian",
        fourly: "Khmer OS Battambang",
    };
    const MPTC_TEMPLATE_IMAGE = "RUA-Bachelor-background.jpg";

    function removeLeadingZero(date) {
        return date.replace(/^[0០]/, "");
    }

    const MPTC_TEXTS = [
        {
            dataKeys: ["certificate.logDateKm"],
            text:
                "តាមសេចក្តីសម្រេចរបស់គណៈកម្មការរដ្ឋ ចុះថ្ងៃទី" +
                removeLeadingZero(certificateInfo.certificate.logDateKm),
            textSize: 46,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.fourly,
            x: 278,
            y: 1039.7,
            align: "left",
            strokeLine: 0.2,
            strokeColor: MPTC_TEXT_COLORS.black,
        },
        {
            dataKeys: ["certificate.logDate"],
            text: removeLeadingZero(certificateInfo.certificate.logDate),
            textSize: 45,
            textStyle: "normal",
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 2859.5,
            y: 1034.7,
            align: "left",
        },
        {
            dataKeys: ["recipient.nameKm"],
            text: "{recipient.nameKm}",
            textSize: 45,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.primary,
            x: 632.3,
            y: 1136.3,
            align: "left",
        },
        {
            dataKeys: ["recipient.dateOfBirthKm"],
            text: removeLeadingZero(certificateInfo.recipient.dateOfBirthKm),
            textSize: 45,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.fourly,
            x: 632.3,
            y: 1231,
            align: "left",
        },
        {
            dataKeys: ["recipient.placeOfBirthKm"],
            text: "{recipient.placeOfBirthKm}",
            textSize: 45,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.fourly,
            x: 632.3,
            y: 1328.7,
            align: "left",
        },
        {
            dataKeys: ["certificate.degreeKm"],
            text: "{certificate.degreeKm}",
            textSize: 45,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.primary,
            x: 632.3,
            y: 1502,
            align: "left",
        },
        {
            dataKeys: ["recipient.dateOfBirth"],
            text: removeLeadingZero(certificateInfo.recipient.dateOfBirth),
            textSize: 48,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 2368.6,
            y: 1226,
            align: "left",
        },
        {
            dataKeys: ["recipient.placeOfBirth"],
            text: "{recipient.placeOfBirth}",
            textSize: 45,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 2368.6,
            y: 1323.3,
            align: "left",
        },
    ];

    const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bg, 0, 0);

    const majorKm = _.get(certificateInfo, "certificate.majorKm");
    const major = _.get(certificateInfo, "certificate.major");
    const number = _.get(certificateInfo, "certificate.number");
    const name = _.get(certificateInfo, "recipient.name");
    const degree = _.get(certificateInfo, "certificate.degree");

    const nameWrap = drawWrapTexts(ctx, {
        top: 1132.3,
        left: 2368.6,
        width: 770,
        textAlignment: "left",
        lineHeight: 1,
        spans: [
            {
                text: name,
                fontSize: 52,
                fontFamily: MPTC_FONTS.thirdly,
                fillStyle: MPTC_TEXT_COLORS.black,
            },
        ],
    }).draw();

    const degreeWrap = drawWrapTexts(ctx, {
        top: 1508.7,
        left: 2014,
        width: 1100,
        textAlignment: "left",
        lineHeight: 1,
        spans: [
            {
                text: degree,
                fontSize: 52,
                fontFamily: MPTC_FONTS.thirdly,
                fillStyle: MPTC_TEXT_COLORS.black,
            },
        ],
    }).draw();

    const majorKmWrap = drawWrapTexts(ctx, {
        top: 1587.2,
        left: 632.3,
        width: 823,
        textAlignment: "left",
        lineHeight: 1.8,
        spans: [
            {
                text: majorKm,
                fontSize: 45,
                fontFamily: MPTC_FONTS.primary,
                fillStyle: MPTC_TEXT_COLORS.black,
            },
        ],
    });

    const majorKmIntegratedWrap = drawWrapTexts(ctx, {
        top: 1587.2,
        left: 632.3,
        width: 823,
        textAlignment: "left",
        lineHeight: 1.8,
        spans: [
            {
                text: majorKm,
                fontSize: 45,
                fontFamily: MPTC_FONTS.primary,
                fillStyle: MPTC_TEXT_COLORS.black,
            },
        ],
    });

    const majorKmHeight = majorKmWrap.height();

    const majorKmFirstHeight = 45;

    if (majorKmHeight > majorKmFirstHeight) {
        majorKmIntegratedWrap.draw();
    } else {
        majorKmWrap.draw();
    }

    const majorWrap = drawWrapTexts(ctx, {
        top: 1610,
        left: 2066.7,
        width: 1225,
        textAlignment: "left",
        lineHeight: 1.9,
        spans: [
            {
                text: major.toUpperCase(),
                fontSize: 50,
                fontFamily: MPTC_FONTS.secondary,
                fillStyle: MPTC_TEXT_COLORS.black,
            },
        ],
    });

    const majorHeight = majorWrap.height();
    majorWrap.draw();

    const majorFirstHeight = 48;

    drawWrapTexts(ctx, {
        top: 1704.5,
        left: 1563,
        width: 400,
        textAlignment: "center",
        lineHeight: 1.7,
        spans: [
            {
                text: `លេខ`,
                fontSize: 45,
                fontFamily: MPTC_FONTS.fourly,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontWeight: "500",
            },
            {
                text: `/Ref: `,
                fontSize: 45,
                fontFamily: MPTC_FONTS.secondary,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontWeight: "500",
            },
            {
                text: number,
                fontSize: 45,
                fontFamily: MPTC_FONTS.primary,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontWeight: "500",
            },
        ],
    }).draw();

    const ALL_MPTC_TEXTS = [
        ...MPTC_TEXTS,
        {
            text: "រាជធានីភ្នំពេញ ថ្ងៃទី...............ខែ...............ឆ្នាំ២០២...",
            textSize: 45,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.fourly,
            x: 485.6,
            y: majorKmHeight <= majorKmFirstHeight ? 1760.2 : 1840.2,
            align: "left",
            strokeLine: 0.5,
            strokeColor: MPTC_TEXT_COLORS.black,
        },
        {
            dataKeys: [],
            text: `រដ្ឋមន្ត្រី`,
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.primary,
            textStyle: "normal",
            x: 940,
            y: majorKmHeight <= majorKmFirstHeight ? 1840 : 1920,
            align: "center",
        },
        {
            dataKeys: [],
            text: `Minister`,
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 940,
            y: majorKmHeight <= majorKmFirstHeight ? 1920.5 : 2000.5,
            align: "center",
            strokeLine: 0.5,
            strokeColor: MPTC_TEXT_COLORS.black,
        },
        {
            dataKeys: ["certificate.rectorSignatureDate"],
            text:
                "Phnom Penh " +
                removeLeadingZero(
                    certificateInfo.certificate.rectorSignatureDate
                ),
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 2490,
            y: majorHeight <= majorFirstHeight ? 1705.2 : 1795.2,
            align: "center",
            strokeLine: 0.5,
            strokeColor: MPTC_TEXT_COLORS.black,
        },
        {
            dataKeys: [],
            text: `សាកលវិទ្យាធិការ`,
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.primary,
            textStyle: "normal",
            x: 2487,
            y: majorHeight <= majorFirstHeight ? 1800 : 1890,
            align: "center",
        },
        {
            dataKeys: [],
            text: `Rector`,
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 2510,
            y: majorHeight <= majorFirstHeight ? 1867 : 1960,
            align: "center",
            strokeLine: 0.5,
            strokeColor: MPTC_TEXT_COLORS.black,
        },
    ];

    // Draw Caption
    for (const text of ALL_MPTC_TEXTS) {
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
        } else drawTextItem(canvas, ctx, text, MPTC_FONTS[0], certificateInfo);
    }

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 1608, 1791, 320);
    }

    if (preview === true || preview === "true") {
        drawPreview(canvas, ctx, {
            rotate: -45,
            color: "#DCDCDC",
            text: "Preview",
            fontFamily: certificateInfo.previewFontFamily,
        });
    }

    let profileX;
    let profileY;
    let imgSize = [];
    let sizeBy;

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
        const maxImgBoxWidth = 311;
        const maxImgBoxHeight = 355;
        profileX = 1752.5;
        profileY = 1304.5;
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

        profileY = profileY - imgSize[1] / 2
        const image = new Image();
        image.src = resizedBuffer;
        profileX = profileX - imgSize[0] / 2;
        ctx.drawImage(image, profileX, profileY, imgSize[0], imgSize[1]);
    }

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
    const fontName = text.textFont ? text.textFont : defaultFont;

    font += text.textStyle ? text.textStyle + space : "";
    font += text.textSize ? text.textSize : defaultSize;
    font += "px" + space;
    font += fontName;
    return font;
}