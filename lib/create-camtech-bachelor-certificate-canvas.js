import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";
import dayjs from "dayjs";

export async function createCamTechBachelorCertificateCanvas(
    certificateInfo = {},
    qrcodeContent
) {
    const CAMTECH_TEXT_COLORS = "#134070";

    const CAMTECH_FONTS = "Bell MT";

    const CAMTECH_TEMPLATE_IMAGE = "camtech-certificate.jpg";

    const name = _.get(certificateInfo, "recipient.name", "").toUpperCase();

    let CAMTECH_TEXTS = [
        {
            dataKeys: ["recipient.name"],
            text: name,
            textSize: 100,
            textColor: CAMTECH_TEXT_COLORS,
            textFont: CAMTECH_FONTS,
            y: 1589,
            align: "center",
            textStyle: "bold",
        },
        {
            dataKeys: ["certificate.awardedDate"],
            text: `Awarded on ${dayjs(
                certificateInfo.certificate.awardedDate
            ).format("DD MMMM YYYY")}`,
            textSize: 58,
            textColor: CAMTECH_TEXT_COLORS,
            textFont: CAMTECH_FONTS,
            y: 2199,
            align: "center",
            textStyle: "italic",
        },
    ];

    let DEGREE_TEXTS = [
        {
            dataKeys: ["certificate.degree", "certificate.major"],
            text: `${certificateInfo.certificate.degree} in ${certificateInfo.certificate.major}`,
            textSize: 98,
            textFont: CAMTECH_FONTS,
            align: "center",
            textStyle: "italic",
        },
    ];

    const getTextMaxWidth = (ctx, textItem) => {
        ctx.font = resolveFont(textItem.textFont, textItem.textSize, textItem);
        const targetMatric = ctx.measureText(textItem.text);
        return targetMatric;
    };

    const bg = await createTemplateImage(CAMTECH_TEMPLATE_IMAGE);
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
    const degreeSize = adjustFontSize(ctx, DEGREE_TEXTS[0], 2200);

    DEGREE_TEXTS = [
        {
            dataKeys: ["certificate.degree", "certificate.major"],
            text: `${certificateInfo.certificate.degree} in ${certificateInfo.certificate.major}`,
            textSize: degreeSize,
            textColor: CAMTECH_TEXT_COLORS,
            textFont: CAMTECH_FONTS,
            y: 1954,
            align: "center",
            textStyle: "italic",
        },
    ];

    CAMTECH_TEXTS = [...CAMTECH_TEXTS, ...DEGREE_TEXTS]
    // Draw Caption
    for (const text of CAMTECH_TEXTS) {
        if (text.dataKeys && text.dataKeys.length > 0) {
            for (const key of text.dataKeys)
                text.text = text.text.replace(
                    `{${key}}`,
                    _.get(certificateInfo, key, "")
                );
        }

        drawText(canvas, ctx, text.text, {
            x: text.x,
            y: text.y,
            textColor: text.textColor || CAMTECH_TEXT_COLORS,
            align: text.align,
            font: resolveFont(CAMTECH_FONTS, 24, text),
        });
    }

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 212, 2899, 320);
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
