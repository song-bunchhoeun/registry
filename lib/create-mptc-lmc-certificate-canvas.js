import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, drawWrapTexts } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createMptcLmcCertificateCanvas(
    certificateInfo = {},
    qrcodeContent
) {
    const MPTC_TEXT_COLORS = {
        gold: "#B98228",
        blue: "#49536C",
    };

    const MPTC_FONTS = {
        GreatVibes: "Great Vibes",
        PTSerif: "PT Serif",
    };
    const MPTC_TEMPLATE_IMAGE = "mptc-lmc-certificate.jpg";

    const name = _.get(certificateInfo, "recipient.name", "")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());

    let MPTC_TEXTS = [];

    MPTC_TEXTS = [
        {
            dataKeys: ["recipient.name"],
            text: name,
            textSize: 205,
            textColor: MPTC_TEXT_COLORS.gold,
            textFont: MPTC_FONTS.GreatVibes,
            y: 1877.3,
            align: "center",
        },
    ];

    if (certificateInfo.certificate.type === "organizing") {
        MPTC_TEXTS = [
            ...MPTC_TEXTS,
            {
                dataKeys: ["certificate.courseDate"],
                text: "held on {certificate.courseDate}",
                textSize: 60,
                textColor: MPTC_TEXT_COLORS.blue,
                textFont: MPTC_FONTS.PTSerif,
                y: 2308.4,
                align: "center",
            },
            {
                dataKeys: ["certificate.locateAt"],
                text: "in {certificate.locateAt}.",
                textSize: 58,
                textColor: MPTC_TEXT_COLORS.blue,
                textFont: MPTC_FONTS.PTSerif,
                y: 2394.4,
                align: "center",
            },
        ];
    } else if (certificateInfo.certificate.type === "trainer") {
        MPTC_TEXTS = [
            ...MPTC_TEXTS,
            {
                dataKeys: ["certificate.course"],
                text: `\u201C${certificateInfo.certificate.course}\u201D`,
                textSize: 62,
                textColor: MPTC_TEXT_COLORS.blue,
                textFont: MPTC_FONTS.PTSerif,
                textStyle: "bold",
                y: 2235.8,
                align: "center",
            },
            {
                dataKeys: ["certificate.courseDate"],
                text: "held on {certificate.courseDate}",
                textSize: 62,
                textColor: MPTC_TEXT_COLORS.blue,
                textFont: MPTC_FONTS.PTSerif,
                y: 2330,
                align: "center",
            },
            {
                dataKeys: ["certificate.locateAt"],
                text: "in {certificate.locateAt}.",
                textSize: 62,
                textColor: MPTC_TEXT_COLORS.blue,
                textFont: MPTC_FONTS.PTSerif,
                y: 2421.8,
                align: "center",
            },
        ];
    } else {
        MPTC_TEXTS = [
            ...MPTC_TEXTS,
            {
                dataKeys: [],
                text: "for participating in the",
                textSize: 60,
                textColor: MPTC_TEXT_COLORS.blue,
                textFont: MPTC_FONTS.PTSerif,
                y: 2140.8,
                align: "center",
            },
            {
                dataKeys: ["certificate.course"],
                text: `\u201C${certificateInfo.certificate.course}\u201D`,
                textSize: 62,
                textColor: MPTC_TEXT_COLORS.blue,
                textFont: MPTC_FONTS.PTSerif,
                textStyle: "bold",
                y: 2235.2,
                align: "center",
            },
            {
                dataKeys: ["certificate.courseDate"],
                text: "held on {certificate.courseDate}",
                textSize: 62,
                textColor: MPTC_TEXT_COLORS.blue,
                textFont: MPTC_FONTS.PTSerif,
                y: 2329,
                align: "center",
            },
            {
                dataKeys: ["certificate.locateAt"],
                text: "in {certificate.locateAt}.",
                textSize: 62,
                textColor: MPTC_TEXT_COLORS.blue,
                textFont: MPTC_FONTS.PTSerif,
                y: 2423.4,
                align: "center",
            },
        ];
    }

    const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bg, 0, 0);

    if (certificateInfo.certificate.type === "organizing") {
        drawWrapTexts(ctx, {
            top: 2136.8,
            left: 0,
            width: 2481,
            textAlignment: "center",
            lineHeight: 1,
            spans: [
                {
                    dataKeys: [],
                    text: "in recognition of their valuable contribution as an",
                    fontSize: 60,
                    fontFamily: MPTC_FONTS.PTSerif,
                    fillStyle: MPTC_TEXT_COLORS.blue,
                },
                {
                    dataKeys: ["certificate.type"],
                    text: " Organizing Committee",
                    fontSize: 60,
                    fillStyle: MPTC_TEXT_COLORS.blue,
                    fontFamily: MPTC_FONTS.PTSerif,
                    fontWeight: "bold",
                },
            ],
        }).draw();

        drawWrapTexts(ctx, {
            top: 2226,
            left: 0,
            width: 2481,
            textAlignment: "center",
            lineHeight: 1,
            spans: [
                {
                    dataKeys: [],
                    text: "in the ",
                    fontSize: 60,
                    fontFamily: MPTC_FONTS.PTSerif,
                    fillStyle: MPTC_TEXT_COLORS.blue,
                },
                {
                    dataKeys: ["certificate.course"],
                    text: `\u201C${certificateInfo.certificate.course}\u201D`,
                    fontSize: 60,
                    fillStyle: MPTC_TEXT_COLORS.blue,
                    fontFamily: MPTC_FONTS.PTSerif,
                    fontWeight: "bold",
                },
            ],
        }).draw();
    } else if (certificateInfo.certificate.type === "trainer") {
        drawWrapTexts(ctx, {
            top: 2136.8,
            left: 0,
            width: 2481,
            textAlignment: "center",
            lineHeight: 1,
            spans: [
                {
                    dataKeys: [],
                    text: "in recognition of their valuable contribution as a",
                    fontSize: 62,
                    fontFamily: MPTC_FONTS.PTSerif,
                    fillStyle: MPTC_TEXT_COLORS.blue,
                },
                {
                    dataKeys: ["certificate.type"],
                    text: " Trainer",
                    fontSize: 62,
                    fillStyle: MPTC_TEXT_COLORS.blue,
                    fontFamily: MPTC_FONTS.PTSerif,
                    fontWeight: "bold",
                },
                {
                    dataKeys: [],
                    text: " in the",
                    fontSize: 62,
                    fillStyle: MPTC_TEXT_COLORS.blue,
                    fontFamily: MPTC_FONTS.PTSerif,
                },
            ],
        }).draw();
    }

    for (const text of MPTC_TEXTS) {
        const value = _.get(certificateInfo, text.key, "");
        if (value !== "null" && value !== null) {
            if (text.dataKeys && text.dataKeys.length > 0) {
                for (const key of text.dataKeys)
                    text.text = text.text.replace(
                        `{${key}}`,
                        _.get(certificateInfo, key, "")
                    );
            }

            if (text.text === "null" || text.text === null) continue;

            drawText(canvas, ctx, text.text, {
                x: text.x,
                y: text.y,
                textColor: text.textColor || MPTC_TEXT_COLORS.black,
                align: text.align,
                font: resolveFont(MPTC_FONTS.primary, 24, text),
            });
        }
    }

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 1808.6, 2808, 315);
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
