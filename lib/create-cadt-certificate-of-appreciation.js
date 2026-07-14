import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';
import { drawWrapTexts } from "./shared";

export async function createCadtCertificateOfAppreciation(
    certificateInfo = {},
    qrcodeContent
) {
    const MPTC_TEXT_COLORS = {
        black: '#00090A',
        blue: '#14407e',
        red: '#f00000'
    };

    const MPTC_FONTS = {
        primary: 'Kantumruy Pro',
        secondary: 'Google Sans',
    };

    const MPTC_TEMPLATE_IMAGE = 'cadt-letter-of-appreciation-2024.png';

    const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);

    const singleNameWrap = drawWrapTexts(ctx, {
        top: 1510.2,
        left: 210,
        width: 2050,
        textAlignment: 'center',
        lineHeight: 1.3,
        spans: [
            {
                dataKeys: ['recipient.name'],
                text: certificateInfo.recipient.name,
                fontSize: 114,
                fontFamily: MPTC_FONTS.primary,
                fillStyle: MPTC_TEXT_COLORS.blue,
                fontWeight: 'bold'
            }
        ]
    });

    const multiNameWrap = drawWrapTexts(ctx, {
        top: 1455,
        left: 210,
        width: 2050,
        textAlignment: 'center',
        lineHeight: 1.3,
        spans: [
            {
                dataKeys: ['recipient.name'],
                text: certificateInfo.recipient.name,
                fontSize: 58,
                fontFamily: MPTC_FONTS.primary,
                fillStyle: MPTC_TEXT_COLORS.blue,
                fontWeight: 'bold'
            }
        ]
    });

    singleNameWrap.height() <= 114 ? singleNameWrap.draw() : multiNameWrap.draw();

    const recognitionNormal = drawWrapTexts(ctx, {
        top: 1650,
        left: 440,
        width: 1600,
        textAlignment: 'center',
        lineHeight: 2,
        spans: [
            {
                dataKeys: [''],
                text: `In Grateful Recognition of Your Outstanding\n Contribution as ${certificateInfo.recipient.role} in the Training on`,
                fontSize: 56.5,
                fontFamily: MPTC_FONTS.secondary,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontWeight: '500'
            }
        ]
    });

    const recognitionCorperate = drawWrapTexts(ctx, {
        top: 1650,
        left: 536,
        width: 1400,
        textAlignment: 'center',
        lineHeight: 2,
        spans: [
            {
                dataKeys: [''],
                text: `In Grateful Recognition for Your Outstanding\n Partnership in Organizing the Training on`,
                fontSize: 56.5,
                fontFamily: MPTC_FONTS.secondary,
                fillStyle: MPTC_TEXT_COLORS.black,
                fontWeight: '500'
            }
        ]
    });

    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 0.5;
    ctx.shadowOffsetY = 0.5;



    certificateInfo.recipient.role.toLowerCase() === "a corporate partner".toLowerCase()
    ? recognitionCorperate.draw()
    : recognitionNormal.draw();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 1991, 2945, 268);
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
    const logoPath = path.join(process.cwd(), 'assets', 'qr-bg-v2.png');
    const qrcodeLogoImage = await loadImage(logoPath);
    const gapSize = (width * 10) / 120;
    const qrcodeSize = width - gapSize * 2;
    const height = (width * 148) / 120;
    ctx.drawImage(qrcodeLogoImage, x, y, width, height);

    const qrcodeBuffer = await QRCode.toBuffer(qrcodeContent, {
        margin: 0,
        width: qrcodeSize
    });
    const qrcodeImage = await loadImage(qrcodeBuffer);
    ctx.drawImage(qrcodeImage, x + gapSize, y + gapSize);
}
