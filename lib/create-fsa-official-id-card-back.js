import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import {
    createTemplateImage,
} from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createFSAOfficialIDCardBack() {

    const FSA_TEMPLATE_IMAGE = 'fsa-official-id-card-back.jpg';

    const bg = await createTemplateImage(FSA_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);

    // Draw Caption
    return canvas;
}