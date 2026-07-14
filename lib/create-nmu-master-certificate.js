import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, loadRemoteResource } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createNMUMasterCertificate(
    certificateInfo = {},
    qrcodeContent
) {
    const NMU_TEXT_COLORS = {
        black: "#0F0F0F",
    };

    const NMU_FONTS = {
        khmer_OS_muol_light: "Khmer OS Muol Light",
        siemReap: "Khmer OS Siemreap",
        times: "Times New Roman",
    };

    const NMU_TEMPLATE_IMAGE = "nmu-certificate.jpg";

    let NMU_TEXTS = [
        {
            dataKeys: ["certificate.logDateKm"],
            text: "{certificate.logDateKm}",
            textSize: 37,
            textStyle: "bold",
            textColor: NMU_TEXT_COLORS.black,
            x: 820,
            y: 1142,
            align: "left",
            textFont: NMU_FONTS.siemReap,
        },
        {
            dataKeys: ["certificate.logDate"],
            textSegments: [
                { text: "{certificate.logDate}", style: "bold" },
                { text: " of the", style: "normal" },
            ],
            textSize: 41,
            textColor: NMU_TEXT_COLORS.black,
            x: 2398,
            y: 1138.3,
            align: "left",
            textFont: NMU_FONTS.times,
        },
        {
            dataKeys: ["recipient.genderKm"],
            text: "{recipient.genderKm}",
            textSize: 37,
            textStyle: "bold",
            textColor: NMU_TEXT_COLORS.black,
            x: 1190.6,
            y: 1281.8,
            align: "left",
            textFont: NMU_FONTS.siemReap,
        },
        {
            dataKeys: ["recipient.gender"],
            text: "{recipient.gender}",
            textSize: 41,
            textColor: NMU_TEXT_COLORS.black,
            x: 2555,
            y: 1276,
            align: "left",
            textStyle: "bold",
            textFont: NMU_FONTS.times,
        },
        {
            dataKeys: ["recipient.dateOfBirthKm"],
            text: "{recipient.dateOfBirthKm}",
            textSize: 37,
            textColor: NMU_TEXT_COLORS.black,
            x: 523.8,
            y: 1351,
            align: "left",
            textStyle: "bold",
            textFont: NMU_FONTS.siemReap,
        },
        {
            dataKeys: ["recipient.dateOfBirth"],
            text: "{recipient.dateOfBirth}",
            textSize: 41,
            textColor: NMU_TEXT_COLORS.black,
            x: 1940.8,
            y: 1347.5,
            align: "left",
            textStyle: "bold",
            textFont: NMU_FONTS.times,
        },
        {
            dataKeys: ["certificate.degreeKm"],
            text: "{certificate.degreeKm}",
            textSize: 37,
            textColor: NMU_TEXT_COLORS.black,
            x: 745,
            y: 1488.4,
            align: "left",
            textStyle: "normal",
            textFont: NMU_FONTS.khmer_OS_muol_light,
        },
        {
            dataKeys: ["certificate.degree"],
            text: "{certificate.degree}",
            textSize: 42,
            textColor: NMU_TEXT_COLORS.black,
            x: 2083.1,
            y: 1478.4,
            align: "left",
            textStyle: "bold",
            textFont: NMU_FONTS.times,
        },
        {
            dataKeys: ["certificate.majorKm"],
            text: "{certificate.majorKm}",
            textSize: 37,
            textColor: NMU_TEXT_COLORS.black,
            x: 541.6,
            y: 1557.5,
            align: "left",
            textStyle: "normal",
            textFont: NMU_FONTS.khmer_OS_muol_light,
        },
        {
            dataKeys: ["certificate.major"],
            text: "{certificate.major}",
            textSize: 42,
            textColor: NMU_TEXT_COLORS.black,
            x: 1851.3,
            y: 1546.4,
            align: "left",
            textStyle: "bold",
            textFont: NMU_FONTS.times,
        },
        {
            dataKeys: ["certificate.chairmanSignatureLunarDateKm"],
            text:
                certificateInfo.certificate.chairmanSignatureLunarDateKm !== ""
                    ? "{certificate.chairmanSignatureLunarDateKm}"
                    : "ថ្ងៃ............................. ខែ............ ឆ្នាំ........................... ព.ស. ........",
            textSize: 37,
            textColor: NMU_TEXT_COLORS.black,
            x: 950,
            y: 1693.5,
            align: "center",
            textStyle: "normal",
            textFont: NMU_FONTS.siemReap,
        },
        {
            dataKeys: ["certificate.chairmanSignatureDateKm"],
            text:
                certificateInfo.certificate.chairmanSignatureDateKm !== ""
                    ? "{certificate.chairmanSignatureDateKm}"
                    : "រាជធានីភ្នំពេញ ថ្ងៃទី.......... ខែ......... ឆ្នាំ.........",
            textSize: 37,
            textColor: NMU_TEXT_COLORS.black,
            x: 950,
            y: 1762.2,
            align: "center",
            textStyle: "normal",
            textFont: NMU_FONTS.siemReap,
        },
        {
            dataKeys: ["certificate.rectorSignatureDate"],
            text:
                certificateInfo.certificate.rectorSignatureDate !== ""
                    ? "{certificate.rectorSignatureDate}"
                    : "Banteay Meanchey, .........................., ............",
            textSize: 37,
            textColor: NMU_TEXT_COLORS.black,
            x: 2513.1,
            y: 1701,
            align: "center",
            textStyle: "normal",
            textFont: NMU_FONTS.time,
        },
        {
            text: "លេខ......................ស.ជ.ម",
            textSize: 38,
            textColor: NMU_TEXT_COLORS.black,
            x: 1759,
            y: 1722.5,
            textStyle: "normal",
            align: "center",
            textFont: NMU_FONTS.siemReap,
        },
        {
            dataKeys: ["certificate.number"],
            text: "{certificate.number}",
            textSize: 41,
            textColor: NMU_TEXT_COLORS.black,
            x: 1743,
            y: 1714.6,
            align: "center",
            textStyle: "normal",
            textFont: NMU_FONTS.time,
        },
    ];

    let NMU_NAME_TEXT = [
        {
            dataKeys: ["recipient.nameKm"],
            text: certificateInfo.recipient.nameKm,
            textSize: 37,
            textStyle: "nomal",
            textColor: NMU_TEXT_COLORS.black,
            x: 550.5,
            y: 1281.8,
            align: "left",
            textFont: NMU_FONTS.khmer_OS_muol_light,
        },
        {
            dataKeys: ["recipient.name"],
            text: certificateInfo.recipient.name,
            textSize: 41,
            textColor: NMU_TEXT_COLORS.black,
            x: 1991.7,
            y: 1277.5,
            align: "left",
            textStyle: "bold",
            textFont: NMU_FONTS.times,
        },
    ];

    const getTextMaxWidth = (ctx, textItem) => {
        ctx.font = resolveFont(textItem.textFont, textItem.textSize, textItem);
        const targetMatric = ctx.measureText(textItem.text);
        return targetMatric;
    };

    const bg = await createTemplateImage(NMU_TEMPLATE_IMAGE);
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

    const nameKmFontSize = adjustFontSize(ctx, NMU_NAME_TEXT[0], 510);
    const nameFontSize = adjustFontSize(ctx, NMU_NAME_TEXT[1], 437);

    NMU_NAME_TEXT = [
        {
            dataKeys: ["recipient.nameKm"],
            text: certificateInfo.recipient.nameKm,
            textSize: nameKmFontSize,
            textStyle: "nomal",
            textColor: NMU_TEXT_COLORS.black,
            x: 550.5,
            y: 1281.8,
            align: "left",
            textFont: NMU_FONTS.khmer_OS_muol_light,
        },
        {
            dataKeys: ["recipient.name"],
            text: certificateInfo.recipient.name,
            textSize: nameFontSize,
            textColor: NMU_TEXT_COLORS.black,
            x: 1991.7,
            y: 1277.5,
            align: "left",
            textStyle: "bold",
            textFont: NMU_FONTS.times,
        },
    ];
    // Draw Caption
    NMU_TEXTS = [...NMU_TEXTS, ...NMU_NAME_TEXT];

    for (const text of NMU_TEXTS) {
        if (text.textSegments) {
            let cursorX = text.x;

            for (const segment of text.textSegments) {
                let content = segment.text;

                if (text.dataKeys && text.dataKeys.length > 0) {
                    for (const key of text.dataKeys) {
                        content = content.replace(
                            `{${key}}`,
                            _.get(certificateInfo, key, "")
                        );
                    }
                }

                const font = resolveFont(
                    text.textFont || NMU_FONTS.times,
                    text.textSize,
                    { ...text, textStyle: [segment.style] }
                );

                ctx.font = font;

                drawText(canvas, ctx, content, {
                    x: cursorX,
                    y: text.y,
                    textColor: text.textColor,
                    align: "left",
                    font,
                    strokeLine: text.strokeLine,
                    strokeColor: text.strokeColor,
                });

                cursorX += ctx.measureText(content).width;
            }
        } else {
            if (text.dataKeys && text.dataKeys.length > 0) {
                for (const key of text.dataKeys) {
                    text.text = text.text.replace(
                        `{${key}}`,
                        _.get(certificateInfo, key, "")
                    );
                }
            }

            drawText(canvas, ctx, text.text, {
                x: text.x,
                y: text.y,
                textColor: text.textColor || NMU_TEXT_COLORS.black,
                align: text.align,
                font: resolveFont(
                    text.textFont || NMU_FONTS.times,
                    text.textSize,
                    text
                ),
                strokeLine: text.strokeLine,
                strokeColor: text.strokeColor,
            });
        }
    }

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 2889, 1773.3, 298);
    }

    if (certificateInfo.recipient.photoBase64) {
        const profileImage = await loadRemoteResource(
            certificateInfo.recipient.photoBase64
        );
        if (profileImage) {
            const profileMaxWidth = 369;
            const profileHeight = 436;
            const profileX = 1568.5;
            const profileY = 1736;
            ctx.drawImage(
                profileImage,
                profileX,
                profileY,
                profileMaxWidth,
                profileHeight
            );
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
export async function createQRCodeLogoImage() {
    const logoPath = path.join(
        process.cwd(),
        "assets",
        "certificate-bacii-qrcode-logo.png"
    );
    return loadImage(logoPath);
}

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
