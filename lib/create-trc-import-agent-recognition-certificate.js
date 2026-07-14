import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createTRCImportAgentRecognitionCertificate(
    certificateInfo = {},
    qrcodeContent
) {
    const TRC_TEXT_COLORS = {
        black: "#212121",
    };

    const TRC_FONTS = {
        khmer_mef2: "Khmer MEF2",
        khmer_mef1: "Khmer MEF1",
    };
    const TRC_TEMPLATE_IMAGE = "trc-regcognition-certificate.jpg";

    function padKhmerYear(durationKm) {
        const yearPart = durationKm.replace("ឆ្នាំ", "").trim();

        const padded = yearPart.length === 1 ? "០" + yearPart : yearPart;

        return padded + "ឆ្នាំ";
    }

    let TRC_TEXTS = [
        {
            dataKeys: ["certificate.number"],
            text: "លេខៈ {certificate.number}",
            textSize: 45,
            textStyle: "normal",
            textColor: TRC_TEXT_COLORS.black,
            textFont: TRC_FONTS.khmer_mef1,
            x: 477,
            y: 765,

        },
        {
            dataKeys: ["certificate.titleKm"],
            text: "{certificate.titleKm}",
            textSize: 50,
            textStyle: "normal",
            textColor: TRC_TEXT_COLORS.black,
            textFont: TRC_FONTS.khmer_mef2,
            y: 887,
            align: "center",
        },
        {
            dataKeys: [
                "certificate.durationKm",
                "certificate.expiredDateKm",
            ],
            text: `រយៈពេល${padKhmerYear(
                certificateInfo.certificate.durationKm
            )} គិតចាប់ពី${certificateInfo.certificate.expiredDateKm}`,
            textSize: 48,
            textStyle: "normal",
            textColor: TRC_TEXT_COLORS.black,
            textFont: TRC_FONTS.khmer_mef1,
            x: 875,
            y: 1587.7,

        },
        {
            dataKeys: [],
            text: "ក្រុមហ៊ុនត្រូវគោរពរាល់លក្ខខណ្ឌដែលមានភ្ជាប់ជាមួយវិញ្ញាបនបត្រនេះ។",
            textSize: 49,
            textStyle: "normal",
            textColor: TRC_TEXT_COLORS.black,
            textFont: TRC_FONTS.khmer_mef1,
            x: 875,
            y: 1674.3,

        },
        {
            dataKeys: ["certificate.signatureLunarDateKm"],
            text: "{certificate.signatureLunarDateKm}",
            textSize: 50,
            textStyle: "normal",
            textColor: TRC_TEXT_COLORS.black,
            textFont: TRC_FONTS.khmer_mef1,
            x: 2629,
            y: 1764,
            align: "center",
        },
        {
            dataKeys: ["certificate.signatureDateKm"],
            text: "{certificate.signatureDateKm}",
            textSize: 50,
            textStyle: "normal",
            textColor: TRC_TEXT_COLORS.black,
            textFont: TRC_FONTS.khmer_mef1,
            x: 2629,
            y: 1839,
            align: "center",
        },
        {
            dataKeys: [],
            text: "ប្រធាន",
            textSize: 50,
            textStyle: "normal",
            textColor: TRC_TEXT_COLORS.black,
            textFont: TRC_FONTS.khmer_mef2,
            x: 2558,
            y: 1930,
        },
        {
            dataKeys: [],
            text: "ថោង ចិន្ដា",
            textSize: 50,
            textStyle: "normal",
            textColor: TRC_TEXT_COLORS.black,
            textFont: TRC_FONTS.khmer_mef2,
            x: 2580,
            y: 2140,
        }
    ];

    const getTextMaxWidth = (ctx, textItem) => {
        ctx.font = resolveFont(textItem.textFont, textItem.textSize, textItem);
        const targetMatric = ctx.measureText(textItem.text);
        return targetMatric;
    };

    const bg = await createTemplateImage(TRC_TEMPLATE_IMAGE);
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

    let adjusted_text = [
        {
            dataKeys: ["certificate.companyNameKm"],
            text: certificateInfo.certificate.companyNameKm,
            textSize: 45,
            textStyle: "normal",
            textFont: TRC_FONTS.khmer_mef1,
        },
        {
            dataKeys: [],
            text: "ជាអក្សរឡាតាំង",
            textSize: 45,
            textStyle: "bold",
            textColor: TRC_TEXT_COLORS.black,
            textFont: TRC_FONTS.khmer_mef1,

        },
        {
            dataKeys: [],
            text: ":",
            textSize: 45,
            textStyle: "bold",
            textColor: TRC_TEXT_COLORS.black,
            textFont: TRC_FONTS.khmer_mef1,

        },
        {
            dataKeys: ["certificate.companyName"],
            text: certificateInfo.certificate.companyName,
            textSize: 58,
            textStyle: "normal",
            textFont: TRC_FONTS.khmer_mef1,
        },
        {
            dataKeys: ["certificate.companyAddressKm"],
            text: certificateInfo.certificate.companyAddressKm,
            textSize: 48,
            textStyle: "normal",
            textFont: TRC_FONTS.khmer_mef1,
        },
    ];

    const COMPANY_NAME_MAX_WIDTH = 2393;

    const labelWidth = getTextMaxWidth(ctx, adjusted_text[1]).width;
    const colonWidth = getTextMaxWidth(ctx, adjusted_text[2]).width;

    const remainingWidth = COMPANY_NAME_MAX_WIDTH - (labelWidth + colonWidth);

    const dynamicTextItem = {
        ...adjusted_text[0],
        text: adjusted_text[0].text + adjusted_text[3].text,
    };

    const companyFontSize = adjustFontSize(
        ctx,
        dynamicTextItem,
        remainingWidth
    );

    const companyAddressKmFontSize = adjustFontSize(
        ctx,
        adjusted_text[4],
        2253
    );

    adjusted_text = [
        {
            dataKeys: ["certificate.companyNameKm"],
            text: certificateInfo.certificate.companyNameKm,
            textSize: companyFontSize,
            textStyle: "normal",
            textColor: TRC_TEXT_COLORS.black,
            textFont: TRC_FONTS.khmer_mef1,
            x: 875,
            y: 1243,

        },
        {
            dataKeys: [],
            text: "ជាអក្សរឡាតាំង",
            textSize: 45,
            textStyle: "bold",
            textColor: TRC_TEXT_COLORS.black,
            textFont: TRC_FONTS.khmer_mef1,
            addX: 280,
            y: 1243,

        },
        {
            dataKeys: [],
            text: ":",
            textSize: 45,
            textStyle: "bold",
            textColor: TRC_TEXT_COLORS.black,
            textFont: TRC_FONTS.khmer_mef1,
            addX: 150,
            y: 1243,

        },
        {
            dataKeys: ["certificate.companyName"],
            text: certificateInfo.certificate.companyName,
            textSize: companyFontSize,
            textStyle: "normal",
            textColor: TRC_TEXT_COLORS.black,
            textFont: TRC_FONTS.khmer_mef1,
            addX: 13,
            y: 1243,

        },
        {
            dataKeys: ["certificate.companyAddressKm"],
            text: "អាសយដ្ឋាន " + certificateInfo.certificate.companyAddressKm,
            textSize: companyAddressKmFontSize,
            textStyle: "normal",
            textColor: TRC_TEXT_COLORS.black,
            textFont: TRC_FONTS.khmer_mef1,
            x: 875,
            y: 1329,

        },
        {
            dataKeys: ["certificate.titleKm"],
            text: "មាន" + certificateInfo.certificate.titleKm.replace("ទទួលស្គាល់", "") + "។",
            textSize: 48,
            textStyle: "normal",
            textColor: TRC_TEXT_COLORS.black,
            textFont: TRC_FONTS.khmer_mef1,
            x: 875,
            y: 1415.6,

        },
        {
            dataKeys: ["certificate.idNumber"],
            text: "{certificate.idNumber}",
            textSize: 48,
            textStyle: "normal",
            textColor: TRC_TEXT_COLORS.black,
            textFont: TRC_FONTS.khmer_mef1,
            x: 885,
            y: 1495,

        },
    ];

    TRC_TEXTS.push(...adjusted_text);

    let lastDrawn = null;
    for (const text of TRC_TEXTS) {
        if (text.dataKeys && text.dataKeys.length > 0) {
            for (const key of text.dataKeys) {
                text.text = text.text.replace(
                    `{${key}}`,
                    _.get(certificateInfo, key, "")
                );
            }
        }
        const font = resolveFont(TRC_FONTS.primary, text.textSize || 24, text);

        let drawX = text.x;
        if (text.addX && lastDrawn) {
            drawX = lastDrawn.x + lastDrawn.width + text.addX;
        }

        ctx.font = font;
        const metrics = ctx.measureText(text.text);
        const textWidth = metrics.width;

        drawText(canvas, ctx, text.text, {
            x: drawX,
            y: text.y,
            textColor: text.textColor || TRC_TEXT_COLORS.black,
            align: text.align,
            font,
        });

        lastDrawn = { x: drawX, width: textWidth };
    }

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 2723.7, 374, 316);
    } else {
        const qrBlank = await loadImage(
            path.join(process.cwd(), "assets", "qr-bg-v2-sample.png")
        );
        if (qrBlank) {
            ctx.drawImage(qrBlank, 2723.7, 374, 317, 393);
        }
    }
    return canvas;
}

export async function drawCenterText(
    text1Style = {},
    text1Color,
    text1Content,
    text2Style = {},
    text2Color,
    text2Content,
    y,
    TRC_FONTS,
    ctx,
    canvas,
    bg
) {
    ctx.font = `${text1Style.textStyle} ${text1Style.textSize}px ${text1Style.textFont}`;
    let text1Width = ctx.measureText(text1Content).width;
    ctx.font = `${text2Style.textStyle} ${text2Style.textSize}px ${text2Style.textFont}`;
    let text2Width = ctx.measureText(text2Content).width;
    let totalContentWidth = text1Width + text2Width;
    let spaceWidth = bg.width - totalContentWidth;

    let mulTotalWidth = spaceWidth / 2;
    drawText(canvas, ctx, text1Content, {
        x: mulTotalWidth,
        y: y,
        textColor: text1Color,
        align: "left",
        font: resolveFont(TRC_FONTS.secondary, 50, text1Style),
    });

    drawText(canvas, ctx, text2Content, {
        x: mulTotalWidth + text1Width,
        y: y,
        textColor: text2Color,
        align: "left",
        font: resolveFont(TRC_FONTS.primary, 50, text2Style),
    });
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
