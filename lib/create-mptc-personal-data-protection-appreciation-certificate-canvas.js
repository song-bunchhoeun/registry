import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawWrapTexts } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createMptcPersonalDataProtectionAppreciationCertificateCanvas(
    certificateInfo = {},
    qrcodeContent
) {
    const MPTC_TEXT_COLORS = {
        black: "#000000",
        blue: "#004282",
    };

    const nameKm = _.get(certificateInfo, "recipient.nameKm", "").split(" ");

    const MPTC_FONTS = {
        muolLight: "Khmer OS Muol Light",
        sowannaphum: "NiDA Sowannaphum",
        google: "Google Sans",
    };

    const MPTC_TEMPLATE_IMAGE = "mptc-certificate-appreciation-2025-signed.jpg";

    const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bg, 0, 0);

    // left part
    drawWrapTexts(ctx, {
        top: 829.7,
        left: 0,
        width: 1930,
        textAlignment: "center",
        lineHeight: 1,
        spans: [
            {
                text: "ជូនចំពោះ",
                fontSize: 53,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontFamily: MPTC_FONTS.sowannaphum,
            },
        ],
    }).draw();

    const name = nameKm.slice(1).join(" "); 

    drawWrapTexts(ctx, {
        top: 934.8,
        left: 0,
        width: 1948,
        textAlignment: "center",
        lineHeight: 1,
        spans: [
            {
                text: nameKm[0],
                fontSize: 53,
                fillStyle: MPTC_TEXT_COLORS.blue,
                fontFamily: MPTC_FONTS.muolLight,
            },
            {
                text: ` ${name}`,
                fontSize: 53,
                fillStyle: MPTC_TEXT_COLORS.blue,
                fontFamily: MPTC_FONTS.google,
                fontWeight: "bold"
            },
        ],
    }).draw();

    drawWrapTexts(ctx, {
        top: 1037,
        left: 0,
        width: 1948,
        textAlignment: "center",
        lineHeight: 1,
        spans: [
            {
                text: `ដែលបានចូលរួមជា${certificateInfo.certificate.typeKm}ក្នុង`,
                fontSize: 50,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontFamily: MPTC_FONTS.sowannaphum,
            },
        ],
    }).draw();

    drawWrapTexts(ctx, {
        top: 1132.7,
        left: 0,
        width: 1948,
        textAlignment: "center",
        lineHeight: 1,
        spans: [
            {
                text: "សិក្ខាសាលាបណ្ដុះបណ្ដាល ស្ដីពី",
                fontSize: 50,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontFamily: MPTC_FONTS.sowannaphum,
            },
        ],
    }).draw();

    drawWrapTexts(ctx, {
        top: 1229.3,
        left: 0,
        width: 1930,
        textAlignment: "center",
        lineHeight: 1,
        spans: [
            {
                text: "\u201C",
                fontSize: 50,
                fontFamily: MPTC_FONTS.google,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontWeight: "bold",
            },
            {
                text: certificateInfo.certificate.themeKm,
                fontSize: 50,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontFamily: MPTC_FONTS.sowannaphum,
                fontWeight: "bold",
            },
            {
                text: "\u201D",
                fontSize: 50,
                fontFamily: MPTC_FONTS.google,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontWeight: "bold",
            },
        ],
    }).draw();

    drawWrapTexts(ctx, {
        top: 1323.9,
        left: 0,
        width: 1930,
        textAlignment: "center",
        lineHeight: 1,
        spans: [
            {
                text: certificateInfo.certificate.dateKm,
                fontSize: 50,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontFamily: MPTC_FONTS.sowannaphum,
            },
        ],
    }).draw();

    drawWrapTexts(ctx, {
        top: 1421.9,
        left: 0,
        width: 1930,
        textAlignment: "center",
        lineHeight: 1,
        spans: [
            {
                text: `នៅ${certificateInfo.certificate.locationKm}។`,
                fontSize: 50,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontFamily: MPTC_FONTS.sowannaphum,
            },
        ],
    }).draw();

    //right part
    drawWrapTexts(ctx, {
        top: 823.3,
        left: 782,
        width: 3508,
        textAlignment: "center",
        lineHeight: 1,
        spans: [
            {
                text: `Presented to`,
                fontSize: 50,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontFamily: MPTC_FONTS.google,
            },
        ],
    }).draw();

    drawWrapTexts(ctx, {
        top: 926.9,
        left: 782,
        width: 3508,
        textAlignment: "center",
        lineHeight: 1,
        spans: [
            {
                text: certificateInfo.recipient.name,
                fontSize: 50,
                fillStyle: MPTC_TEXT_COLORS.blue,
                fontFamily: MPTC_FONTS.google,
                fontWeight: "bold"
            },
        ],
    }).draw();

    drawWrapTexts(ctx, {
        top: 1030.2,
        left: 782,
        width: 3508,
        textAlignment: "center",
        lineHeight: 1,
        spans: [
            {
                text: "in grateful recognition of your outstanding contribution",
                fontSize: 50,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontFamily: MPTC_FONTS.google,
            },
        ],
    }).draw();

    drawWrapTexts(ctx, {
        top: 1127.3,
        left: 782,
        width: 3508,
        textAlignment: "center",
        lineHeight: 1,
        spans: [
            {
                text: `as ${certificateInfo.certificate.type} in the Training Workshop on`,
                fontSize: 50,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontFamily: MPTC_FONTS.google,
            },
        ],
    }).draw();

    drawWrapTexts(ctx, {
        top: 1222.8,
        left: 782,
        width: 3508,
        textAlignment: "center",
        lineHeight: 1,
        spans: [
            {
                text: `\u0022${certificateInfo.certificate.theme}\u0022`,
                fontSize: 50,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontFamily: MPTC_FONTS.google,
                fontWeight: "bold",
            },
        ],
    }).draw();

    drawWrapTexts(ctx, {
        top: 1318.8,
        left: 782,
        width: 3508,
        textAlignment: "center",
        lineHeight: 1,
        spans: [
            {
                text: `${certificateInfo.certificate.date} at the`,
                fontSize: 50,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontFamily: MPTC_FONTS.google,
            },
        ],
    }).draw();

    drawWrapTexts(ctx, {
        top: 1414.8,
        left: 782,
        width: 3508,
        textAlignment: "center",
        lineHeight: 1,
        spans: [
            {
                text: `${certificateInfo.certificate.location}.`,
                fontSize: 50,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontFamily: MPTC_FONTS.google,
            },
        ],
    }).draw();

    //center part
    drawWrapTexts(ctx, {
        top: 1520,
        left: 0,
        width: 3508,
        textAlignment: "center",
        lineHeight: 1,
        spans: [
            {
                text: certificateInfo.certificate.signatureLunarDateKm,
                fontSize: 50,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontFamily: MPTC_FONTS.sowannaphum,
            },
        ],
    }).draw();

    drawWrapTexts(ctx, {
        top: 1602.6,
        left: 0,
        width: 3508,
        textAlignment: "center",
        lineHeight: 1,
        spans: [
            {
                text: certificateInfo.certificate.signatureDateKm,
                fontSize: 50,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontFamily: MPTC_FONTS.sowannaphum,
            },
        ],
    }).draw();

    drawWrapTexts(ctx, {
        top: 1686.7,
        left: 0,
        width: 3508,
        textAlignment: "center",
        lineHeight: 1,
        spans: [
            {
                text: certificateInfo.certificate.signatureDate,
                fontSize: 50,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontFamily: MPTC_FONTS.google,
            },
        ],
    }).draw();
    drawWrapTexts(ctx, {
        top: 1765,
        left: 0,
        width: 3508,
        textAlignment: "center",
        lineHeight: 1,
        spans: [
            {
                text: "រដ្ឋមន្ត្រី",
                fontSize: 50,
                fontFamily: MPTC_FONTS.muolLight,
                fillStyle: MPTC_TEXT_COLORS.black,
            },
        ],
    }).draw();

    drawWrapTexts(ctx, {
        top: 1845.2,
        left: 0,
        width: 3508,
        textAlignment: "center",
        lineHeight: 1,
        spans: [
            {
                text: "Minister",
                fontSize: 50,
                fontFamily: MPTC_FONTS.google,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontWeight: "bold",
            },
        ],
    }).draw();

    drawWrapTexts(ctx, {
        top: 2228.2,
        left: 1748.5,
        width: 3508,
        textAlignment: "left",
        lineHeight: 1,
        spans: [
            {
                text: "ជា វ៉ាន់ដេត",
                fontSize: 50,
                fontFamily: MPTC_FONTS.muolLight,
                fillStyle: MPTC_TEXT_COLORS.black,
            },
        ],
    }).draw();

    drawWrapTexts(ctx, {
        top: 2307.2,
        left: 1746,
        width: 3508,
        textAlignment: "left",
        lineHeight: 1,
        spans: [
            {
                text: "Chea Vandeth",
                fontSize: 50,
                fontFamily: MPTC_FONTS.google,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontWeight: "bold",
            },
        ],
    }).draw();

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 2908.7, 1807, 309);
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
