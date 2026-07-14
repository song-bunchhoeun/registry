import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import {
    createTemplateImage,
    drawText,
    drawWrapTexts,
    drawSpaceWrapTexts,
    drawPreview,
    drawTextWithLetterSpacing,
} from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createPPCAOWSChamkarmornTourismLicenseCertificateCanvas(
    certificateInfo = {},
    qrcodeContent,
    preview,
) {

    const PPCA_TEXT_COLORS = {
        blue: "#0C267C",
    };

    const PPCA_FONTS = {
        khmerMuol: "Khmer Muol",
        siemreap: "Khmer OS Siemreap",
        khmerOSBattambang: "Khmer OS Battambang"
    };

    let PPCA_TEXTS = [
        {
            dataKeys: ["recipient.nameKm"],
            text: certificateInfo.recipient.nameKm,
            textSize: 50,
            textColor: PPCA_TEXT_COLORS.blue,
            textFont: PPCA_FONTS.khmerMuol,
        },
        {
            dataKeys: ["recipient.name"],
            text: certificateInfo.recipient.name,
            textSize: 47,
            textColor: PPCA_TEXT_COLORS.blue,
            textFont: PPCA_FONTS.khmerMuol,
            strokeLine: 0.8,
            strokeColor: PPCA_TEXT_COLORS.blue
        },
        {
            dataKeys: ["recipient.businessTypeKm"],
            text: certificateInfo.recipient.businessTypeKm,
            textSize: 50,
            textColor: PPCA_TEXT_COLORS.blue,
            textFont: PPCA_FONTS.khmerMuol,
        },
        {
            dataKeys: ["recipient.businessType"],
            text: certificateInfo.recipient.businessType,
            textSize: 48,
            textColor: PPCA_TEXT_COLORS.blue,
            textFont: PPCA_FONTS.khmerMuol,
            strokeLine: 0.8,
            strokeColor: PPCA_TEXT_COLORS.blue
        },
        {
            dataKeys: ["recipient.businessNameKm"],
            text: certificateInfo.recipient.businessNameKm,
            textSize: 50,
            textColor: PPCA_TEXT_COLORS.blue,
            textFont: PPCA_FONTS.khmerMuol,
        },
        {
            dataKeys: ["recipient.businessName"],
            text: certificateInfo.recipient.businessName,
            textSize: 48,
            textColor: PPCA_TEXT_COLORS.blue,
            textFont: PPCA_FONTS.khmerMuol,
            strokeLine: 0.8,
            strokeColor: PPCA_TEXT_COLORS.blue
        },
        {
            dataKeys: ["recipient.addressKm"],
            text: certificateInfo.recipient.addressKm,
            textSize: 41.5,
            textColor: PPCA_TEXT_COLORS.blue,
            textFont: PPCA_FONTS.siemreap,
        },
        {
            dataKeys: ["recipient.address"],
            text: certificateInfo.recipient.address,
            textSize: 41.5,
            textColor: PPCA_TEXT_COLORS.blue,
            textFont: PPCA_FONTS.khmerMuol,
            strokeLine: 0.8,
            strokeColor: PPCA_TEXT_COLORS.blue
        }
    ];

    const getTextMaxWidth = (ctx, textItem) => {
        ctx.font = resolveFont(textItem.textFont, textItem.textSize, textItem);
        const targetMatric = ctx.measureText(textItem.text);
        return targetMatric;
    };

    const canvas = createCanvas(3508, 2480);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 3508, 2480);

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

    const nameKmFontSize = adjustFontSize(ctx, PPCA_TEXTS.find(item =>
        item.dataKeys.includes("recipient.nameKm")
    ), 697)

    const nameFontSize = adjustFontSize(ctx, PPCA_TEXTS.find(item =>
        item.dataKeys.includes("recipient.name")
    ), 612)

    // This include businessTypeKm, businessType, businessNameKm, businessName, addressKm, and address
    const businessMaxWidth = 1632

    const businessTypeKmFontSize = adjustFontSize(ctx, PPCA_TEXTS.find(item =>
        item.dataKeys.includes("recipient.businessTypeKm")
    ), businessMaxWidth)

    const businessTypeFontSize = adjustFontSize(ctx, PPCA_TEXTS.find(item =>
        item.dataKeys.includes("recipient.businessType")
    ), businessMaxWidth)

    const businessNameKmFontSize = adjustFontSize(ctx, PPCA_TEXTS.find(item =>
        item.dataKeys.includes("recipient.businessNameKm")
    ), businessMaxWidth)

    const businessNameFontSize = adjustFontSize(ctx, PPCA_TEXTS.find(item =>
        item.dataKeys.includes("recipient.businessName")
    ), businessMaxWidth)

    const addressKmFontSize = adjustFontSize(ctx, PPCA_TEXTS.find(item =>
        item.dataKeys.includes("recipient.addressKm")
    ), businessMaxWidth)

    const addressFontSize = adjustFontSize(ctx, PPCA_TEXTS.find(item =>
        item.dataKeys.includes("recipient.address")
    ), businessMaxWidth)

    PPCA_TEXTS = [
        {
            dataKeys: ["recipient.nameKm"],
            text: certificateInfo.recipient.nameKm,
            textSize: nameKmFontSize,
            textColor: PPCA_TEXT_COLORS.blue,
            textFont: PPCA_FONTS.khmerMuol,
            x: 1468.5,
            y: 908,
            align: "left",
        },
        {
            dataKeys: ["recipient.genderKm"],
            text: certificateInfo.recipient.genderKm,
            textSize: 47,
            textColor: PPCA_TEXT_COLORS.blue,
            textFont: PPCA_FONTS.khmerMuol,
            x: 2331.5,
            y: 908,
            align: "left",
        },
        {
            dataKeys: ["recipient.nationalityKm"],
            text: certificateInfo.recipient.nationalityKm,
            textSize: 47,
            textColor: PPCA_TEXT_COLORS.blue,
            textFont: PPCA_FONTS.khmerMuol,
            x: 2763.6,
            y: 908,
            align: "left",
        },
        {
            dataKeys: ["recipient.name"],
            text: certificateInfo.recipient.name,
            textSize: nameFontSize,
            textColor: PPCA_TEXT_COLORS.blue,
            textFont: PPCA_FONTS.khmerMuol,
            x: 1468.5,
            y: 997.5,
            align: "left",
            strokeLine: 0.8,
            strokeColor: PPCA_TEXT_COLORS.blue
        },
        {
            dataKeys: ["recipient.gender"],
            text: certificateInfo.recipient.gender,
            textSize: 46,
            textColor: PPCA_TEXT_COLORS.blue,
            textFont: PPCA_FONTS.khmerMuol,
            x: 2331.5,
            y: 997.5,
            align: "left",
            strokeLine: 0.8,
            strokeColor: PPCA_TEXT_COLORS.blue
        },
        {
            dataKeys: ["recipient.nationality"],
            text: certificateInfo.recipient.nationality,
            textSize: 46,
            textColor: PPCA_TEXT_COLORS.blue,
            textFont: PPCA_FONTS.khmerMuol,
            x: 2816,
            y: 997.5,
            align: "left",
            strokeLine: 0.8,
            strokeColor: PPCA_TEXT_COLORS.blue
        },
        {
            dataKeys: ["recipient.businessTypeKm"],
            text: certificateInfo.recipient.businessTypeKm,
            textSize: businessTypeKmFontSize,
            textColor: PPCA_TEXT_COLORS.blue,
            textFont: PPCA_FONTS.khmerMuol,
            x: 1468.5,
            y: 1080,
            align: "left",
        },
        {
            dataKeys: ["recipient.businessType"],
            text: certificateInfo.recipient.businessType,
            textSize: businessTypeFontSize,
            textColor: PPCA_TEXT_COLORS.blue,
            textFont: PPCA_FONTS.khmerMuol,
            x: 1468.5,
            y: 1169,
            align: "left",
            strokeLine: 0.8,
            strokeColor: PPCA_TEXT_COLORS.blue
        },
        {
            dataKeys: ["recipient.businessNameKm"],
            text: certificateInfo.recipient.businessNameKm,
            textSize: businessNameKmFontSize,
            textColor: PPCA_TEXT_COLORS.blue,
            textFont: PPCA_FONTS.khmerMuol,
            x: 1468.5,
            y: 1251.2,
            align: "left",
        },
        {
            dataKeys: ["recipient.businessName"],
            text: certificateInfo.recipient.businessName,
            textSize: businessNameFontSize,
            textColor: PPCA_TEXT_COLORS.blue,
            textFont: PPCA_FONTS.khmerMuol,
            x: 1468.5,
            y: 1343,
            align: "left",
            strokeLine: 0.8,
            strokeColor: PPCA_TEXT_COLORS.blue
        },
        {
            dataKeys: ["recipient.addressKm"],
            text: certificateInfo.recipient.addressKm,
            textSize: addressKmFontSize,
            textColor: PPCA_TEXT_COLORS.blue,
            textFont: PPCA_FONTS.siemreap,
            x: 1468.5,
            y: 1425,
            align: "left",
        },
        {
            dataKeys: ["recipient.address"],
            text: certificateInfo.recipient.address,
            textSize: addressFontSize,
            textColor: PPCA_TEXT_COLORS.blue,
            textFont: PPCA_FONTS.khmerMuol,
            x: 1468.5,
            y: 1514.7,
            align: "left",
            strokeLine: 0.8,
            strokeColor: PPCA_TEXT_COLORS.blue
        },
        {
            dataKeys: ["certificate.validityKm"],
            text: certificateInfo.certificate.validityKm,
            textSize: 50,
            textColor: PPCA_TEXT_COLORS.blue,
            textFont: PPCA_FONTS.khmerMuol,
            x: 1468.5,
            y: 1598.2,
            align: "left",
        },
        {
            dataKeys: ["certificate.validity"],
            text: certificateInfo.certificate.validity,
            textSize: 48,
            textColor: PPCA_TEXT_COLORS.blue,
            textFont: PPCA_FONTS.khmerMuol,
            x: 1468.5,
            y: 1687,
            align: "left",
            strokeLine: 0.8,
            strokeColor: PPCA_TEXT_COLORS.blue
        },
        {
            dataKeys: ["certificate.signatureLunarDateKm"],
            text: certificateInfo.certificate.signatureLunarDateKm,
            textSize: 41,
            textColor: PPCA_TEXT_COLORS.blue,
            textFont: PPCA_FONTS.khmerOSBattambang,
            x: 2229.5,
            y: 1763,
            align: "center",
            strokeLine: 0.8,
            strokeColor: PPCA_TEXT_COLORS.blue
        },
        {
            dataKeys: ["certificate.signatureDateKm"],
            text: certificateInfo.certificate.signatureDateKm,
            textSize: 41,
            textColor: PPCA_TEXT_COLORS.blue,
            textFont: PPCA_FONTS.khmerOSBattambang,
            x: 2229.5,
            y: 1846,
            align: "center",
            strokeLine: 0.8,
            strokeColor: PPCA_TEXT_COLORS.blue
        },
    ];

    for (const text of PPCA_TEXTS) {
        if (text.length > 0) {
            for (const index in text) {
                const textItem = text[index];
                let lastItem;
                if (index > 0) lastItem = text[index - 1];

                if (!textItem.x) {
                    const lastFont = resolveFont(PPCA_FONTS.siemreap, 24, lastItem);
                    ctx.font = lastFont;
                    const lastItemMetric = ctx.measureText(lastItem.text);
                    textItem.x = lastItem.x + lastItemMetric.width + textItem.addX;
                }

                if (!textItem.y) textItem.y = lastItem.y;

                drawTextItem(
                    canvas,
                    ctx,
                    textItem,
                    PPCA_FONTS.siemreap,
                    certificateInfo
                );
            }
        } else drawTextItem(canvas, ctx, text, PPCA_FONTS.siemreap, certificateInfo);
    }

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 2876.5, 1892, 224);
    } else {
        const qrBlank = await loadImage(
            path.join(process.cwd(), "assets", "qr-bg-v2-sample.png"),
        );
        if (qrBlank) {
            ctx.drawImage(qrBlank, 2876.5, 1892, 224, 276.266);
        }
    }

    if (preview === true || preview === "true") {
        drawPreview(canvas, ctx, {
            rotate: -45,
            color: "#DCDCDC",
            text: "Preview",
            fontSize: "500",
            fontFamily: PPCA_FONTS.siemreap,
        });
    }

    // draw profile photo
    if (certificateInfo.recipient?.photoBase64) {
        try {
            const base64Image = certificateInfo.recipient.photoBase64;

            if (
                base64Image &&
                typeof base64Image === "string" &&
                base64Image.trim()
            ) {
                const dataUrl = base64Image.startsWith("data:")
                    ? base64Image
                    : `data:image/jpeg;base64,${base64Image}`;

                const profileImage = await loadImage(dataUrl);

                const profileMaxWidth = 371;
                const profileMaxHeight = 502;
                const profileX = 405;
                const profileY = 972.7;

                // Original image size
                const imgWidth = profileImage.width;
                const imgHeight = profileImage.height;

                // Scale to fit inside the box
                const scale = Math.min(
                    profileMaxWidth / imgWidth,
                    profileMaxHeight / imgHeight
                );

                const drawWidth = imgWidth * scale;
                const drawHeight = imgHeight * scale;

                // Center inside the box (equivalent to object-position: center)
                const drawX = profileX + (profileMaxWidth - drawWidth) / 2;
                const drawY = profileY + (profileMaxHeight - drawHeight) / 2;

                ctx.drawImage(
                    profileImage,
                    drawX,
                    drawY,
                    drawWidth,
                    drawHeight
                );
            }
        } catch (err) {
            console.error("Failed to load profile photo:", err);
        }
    }

    return canvas;
}

const drawTextItem = (canvas, ctx, textItem, defaultFont, certificateInfo) => {
    if (textItem.dataKeys && textItem.dataKeys.length > 0) {
        for (const key of textItem.dataKeys)
            textItem.text = textItem.text?.replace(
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
            textColor: textItem.textColor || MPTC_TEXT_COLORS.blue,
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
    width = 120,
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
