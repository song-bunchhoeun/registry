import path from "node:path";
import { loadImage, GlobalFonts } from "@napi-rs/canvas";

export async function createTemplateImage(
  filename = "certificate-bacii-stamp.png",
) {
  const templatePath = path.join(process.cwd(), "assets", filename);
  return loadImage(templatePath);
}

export function registerFonts() {
  GlobalFonts.loadFontsFromDir(path.join(process.cwd(), "assets", "fonts"));
}

/**
 *
 * @param {string} url
 */
export async function loadRemoteResource(url) {
  try {
    const result = await loadImage(url);
    return result;
  } catch (e) {
    return null;
  }
}

export function drawText(canvas, ctx, text, options = {}) {
  if (typeof text !== "string" || text.length === 0) return;

  options.margin = options.margin || 0;
  options.align = options.align || "left";
  ctx.fillStyle = options.textColor || "black";

  let textOffsetX = 0;
  let textOffsetY = options.y || 0;
  let textWidth = 0;

  ctx.font = options.font || "12px Arial, sans-serif";

  if (options.textMaxWidth && options.letterSpacing === "dynamic") {
    ctx.letterSpacing = "10px";
    const width10px = ctx.measureText(text).width;

    ctx.letterSpacing = "20px";
    const width20px = ctx.measureText(text).width;

    const spacingMultiplier = Math.round((width20px - width10px) / 10);
    const baseWidth = width10px - (spacingMultiplier * 10);

    if (spacingMultiplier > 1) {
      const spaceDifference = options.textMaxWidth - baseWidth;
      const dynamicSpacing = spaceDifference / (spacingMultiplier - 1);

      ctx.letterSpacing = `${dynamicSpacing}px`;
      textWidth = options.textMaxWidth;
    } else {
      ctx.letterSpacing = "0px";
      textWidth = ctx.measureText(text).width;
    }
  } else if (options.letterSpacing !== undefined) {
    ctx.letterSpacing = `${options.letterSpacing}px`;
    textWidth = ctx.measureText(text).width;
  } else {
    ctx.letterSpacing = "0px";
    textWidth = ctx.measureText(text).width;
  }

  if (options.align === "center") {
    textOffsetX = (canvas.width - textWidth) / 2;
  }

  if (options.align === "right") {
    textOffsetX = canvas.width - textWidth - options.margin;
  }

  if (options.align === "left") {
    textOffsetX += options.margin;
  }

  if (options.x !== undefined) {
    textOffsetX = options.x;

    if (options.align === "center") {
      textOffsetX -= textWidth / 2;
    }

    if (options.align === "right") {
      textOffsetX = options.x - textWidth;
    }
  }

  if (options.strokeLine > 0 && options.strokeColor) {
    ctx.strokeStyle = options.strokeColor;
    ctx.lineWidth = options.strokeLine;
    ctx.strokeText(text, textOffsetX, textOffsetY);
  }

  ctx.fillText(text, textOffsetX, textOffsetY);

  return {
    textWidth,
    textOffsetX,
    textOffsetY,
  };
}
export function drawTexts(canvas, ctx, options = {}, ...texts) {
  options.align = options.align || "left";
  options.margin = options.margin || 0;
  options.gap = options.gap || 0;

  const items = [];

  // layout
  ctx.save();

  const totalGapSize = options.gap * (texts.length - 1);
  let totalWidth = totalGapSize;

  for (const textBlock of texts) {
    ctx.font = textBlock.font;
    const w = ctx.measureText(textBlock.text).width;

    items.push({
      textBlock,
      textWidth: w,
    });

    totalWidth += w;
  }

  ctx.restore();

  // draw
  let offset = 0;

  if (options.align === "center") {
    offset = (canvas.width - totalWidth) / 2;
  }

  if (options.align === "right") {
    offset = canvas.width - totalWidth;
    offset -= options.margin;
  }

  if (options.x) {
    offset = options.x;
    offset += options.margin;

    if (options.align === "center") {
      offset -= totalWidth / 2;
    }
  }

  if (options.align === "left") {
    offset += options.margin;
  }

  for (const item of items) {
    ctx.font = item.textBlock.font;
    ctx.fillStyle = item.textBlock.textColor;
    ctx.fillText(item.textBlock.text, offset, options.y || 0);
    offset += item.textWidth + options.gap;
  }
}

const segmenter = new Intl.Segmenter(undefined, {
  granularity: "word",
});

function* wordTokenizer(text) {
  let pending = "";
  for (const segment of segmenter.segment(text)) {
    if (segment.segment.endsWith("\u17d2")) {
      pending = segment.segment;
      continue;
    }
    yield pending + segment.segment;
    pending = "";
  }

  if (pending) {
    yield pending;
  }
}

export function drawWrapTexts(
  ctx,
  { lineHeight, left, top, width, textAlignment, spans },
) {
  const segments = [];
  let maxFontSize = 0;

  for (const _span of spans) {
    const span = {
      text: "",
      fontSize: 102,
      fontFamily: "Khmer OS Battambang",
      fillStyle: "black",
      fontWeight: "500",
      ..._span,
    };

    if (span.fontSize > maxFontSize) {
      maxFontSize = span.fontSize;
    }

    for (const item of wordTokenizer(span.text)) {
      segments.push({
        segment: item,
        ...span,
      });
    }
  }
  // draw text
  width += left;

  const safeMargin = 0;
  const maxWidth = width - safeMargin * 2;

  let textLeftOffset = safeMargin + left; // 1754
  let textTopOffset = safeMargin + top; // 1500

  const viewGroups = [];
  let views = [];
  let line = 0;

  for (const { segment, ...opts } of segments) {
    ctx.font =
      `${opts.fontWeight} ${opts.fontSize}px ${opts.fontFamily}`.trim();

    // handle for droping new line
    if (segment == "\n") {
      viewGroups.push({
        views,
        width: textLeftOffset - safeMargin * 2,
      });

      views = [];
      textLeftOffset = safeMargin + left; // 0 + 1794 = 1794
      textTopOffset += maxFontSize * lineHeight; // maxFontSize: 0*1.5 = 0 = 1754
      continue;
    }
    const measurement = ctx.measureText(segment);

    if (textLeftOffset + measurement.width - safeMargin > maxWidth) {
      viewGroups.push({
        views,
        width: textLeftOffset - safeMargin * 2,
      });

      textLeftOffset = safeMargin + left;
      textTopOffset += maxFontSize * lineHeight;
      line += 1;
      views = [];
    }

    // starting whitespace
    if (textLeftOffset - safeMargin == 0 && segment.trim().length == 0) {
      continue;
    }

    views.push({
      segment,
      textLeftOffset,
      textTopOffset,
      line,
      ...opts,
    });

    textLeftOffset += measurement.width;
  }

  viewGroups.push({
    views,
    width: textLeftOffset - safeMargin * 2,
  });

  return {
    height() {
      return textTopOffset - top + maxFontSize;
    },
    draw() {
      for (let i = 0; i < viewGroups.length; i++) {
        const group = viewGroups[i];
        let leftOffset = 0;
        let localMaxFontSize = 0;

        for (const view of group.views) {
          if (localMaxFontSize < view.fontSize) {
            localMaxFontSize = view.fontSize;
          }
        }

        const alignment = Array.isArray(textAlignment)
          ? textAlignment[i] ||
          textAlignment[textAlignment.length - 1] ||
          "left"
          : textAlignment || "left";

        if (alignment === "center") {
          leftOffset = (maxWidth - group.width - safeMargin) / 2;
        } else if (alignment === "right") {
          leftOffset = maxWidth - group.width - safeMargin;
        }

        for (const view of group.views) {
          ctx.font =
            `${view.fontWeight} ${view.fontSize}px ${view.fontFamily}`.trim();
          ctx.fillStyle = view.fillStyle;

          let topOffset = 0;
          if (view.fontSize !== localMaxFontSize) {
            topOffset = (localMaxFontSize - view.fontSize) / 2;
          }

          ctx.fillText(
            view.segment,
            leftOffset + view.textLeftOffset,
            topOffset + view.textTopOffset,
          );
        }
      }
    },
  };
}

export function drawSpaceWrapTexts(
  ctx,
  { lineHeight = 1.5, left = 0, top = 0, width, textAlignment = "left", spans },
) {
  const segments = [];
  let maxFontSize = 0;

  for (const _span of spans) {
    const span = {
      text: "",
      fontSize: 102,
      fontFamily: "Khmer OS Battambang",
      fillStyle: "black",
      fontWeight: "500",
      ..._span,
    };

    if (span.fontSize > maxFontSize) maxFontSize = span.fontSize;

    const words = span.text.split(/(\s+)/);
    for (const word of words) {
      if (!word) continue;
      segments.push({
        segment: word,
        ...span,
      });
    }
  }

  const safeMargin = 0;
  const maxWidth = width;
  let textLeftOffset = left + safeMargin;
  let textTopOffset = top + safeMargin;

  const viewGroups = [];
  let views = [];
  let line = 0;

  for (const { segment, ...opts } of segments) {
    ctx.font =
      `${opts.fontWeight} ${opts.fontSize}px ${opts.fontFamily}`.trim();
    const measurement = ctx.measureText(segment);

    if (
      segment.trim().length > 0 &&
      textLeftOffset + measurement.width > left + maxWidth
    ) {
      viewGroups.push({ views, width: textLeftOffset - left - safeMargin });

      textLeftOffset = left + safeMargin;
      textTopOffset += maxFontSize * lineHeight;
      line += 1;
      views = [];
    }

    if (textLeftOffset === left + safeMargin && segment.trim().length === 0)
      continue;

    views.push({
      segment,
      textLeftOffset,
      textTopOffset,
      line,
      ...opts,
    });

    textLeftOffset += measurement.width;
  }

  viewGroups.push({ views, width: textLeftOffset - left - safeMargin });

  return {
    height() {
      return textTopOffset - top + maxFontSize;
    },
    draw() {
      for (let i = 0; i < viewGroups.length; i++) {
        const group = viewGroups[i];
        let leftOffset = 0;
        let localMaxFontSize = 0;

        for (const view of group.views) {
          if (view.fontSize > localMaxFontSize)
            localMaxFontSize = view.fontSize;
        }

        const alignment = Array.isArray(textAlignment)
          ? textAlignment[i] ||
          textAlignment[textAlignment.length - 1] ||
          "left"
          : textAlignment || "left";

        if (alignment === "center") {
          leftOffset = (maxWidth - group.width) / 2;
        } else if (alignment === "right") {
          leftOffset = maxWidth - group.width;
        }

        for (const view of group.views) {
          ctx.font =
            `${view.fontWeight} ${view.fontSize}px ${view.fontFamily}`.trim();
          ctx.fillStyle = view.fillStyle;

          const topOffset = (localMaxFontSize - view.fontSize) / 2;
          ctx.fillText(
            view.segment,
            leftOffset + view.textLeftOffset,
            topOffset + view.textTopOffset,
          );
        }
      }
    },
  };
}

export function drawJustifyWrapTexts(
  ctx,
  { lineHeight, left, top, width, textAlignment, spans },
) {
  const segments = [];
  let maxFontSize = 0;
  let segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });

  for (const _span of spans) {
    const span = {
      text: "",
      fontSize: 102,
      fontFamily: "Khmer OS Battambang",
      fillStyle: "black",
      fontWeight: "500",
      strokeLine: 0,
      strokeColor: null,
      ..._span,
    };

    if (span.fontSize > maxFontSize) {
      maxFontSize = span.fontSize;
    }

    for (const item of segmenter.segment(span.text)) {
      segments.push({
        segment: item.segment,
        ...span,
      });
    }
  }

  width += left;
  const safeMargin = 0;
  const maxWidth = width - safeMargin * 2;
  let textLeftOffset = safeMargin + left;
  let textTopOffset = safeMargin + top;
  const viewGroups = [];
  let views = [];
  let line = 0;

  for (const { segment, ...opts } of segments) {
    ctx.font =
      `${opts.fontWeight} ${opts.fontSize}px ${opts.fontFamily}`.trim();

    if (segment == "\n") {
      viewGroups.push({
        views,
        width: textLeftOffset - safeMargin * 2,
      });
      views = [];
      textLeftOffset = safeMargin + left;
      textTopOffset += maxFontSize * lineHeight;
      continue;
    }
    const measurement = ctx.measureText(segment);

    if (textLeftOffset + measurement.width - safeMargin > maxWidth) {
      viewGroups.push({
        views,
        width: textLeftOffset - safeMargin * 2,
      });
      textLeftOffset = safeMargin + left;
      textTopOffset += maxFontSize * lineHeight;
      line += 1;
      views = [];
    }

    if (textLeftOffset - safeMargin == 0 && segment.trim().length == 0) {
      continue;
    }

    views.push({
      segment,
      textLeftOffset,
      textTopOffset,
      line,
      ...opts,
    });

    textLeftOffset += measurement.width;
  }

  viewGroups.push({
    views,
    width: textLeftOffset - safeMargin * 2,
  });

  return {
    height() {
      return textTopOffset - top + maxFontSize;
    },
    draw() {
      for (const group of viewGroups) {
        let leftOffset = 0;
        let localMaxFontSize = 0;

        for (const view of group.views) {
          if (localMaxFontSize < view.fontSize) {
            localMaxFontSize = view.fontSize;
          }
        }

        if (textAlignment === "center") {
          leftOffset = (maxWidth - group.width - safeMargin) / 2;
        }

        if (textAlignment === "right") {
          leftOffset = maxWidth - group.width - safeMargin;
        }

        // Add justification logic
        if (textAlignment === "justify" && group.views.length > 1) {
          const lastView = group.views[group.views.length - 1];
          const extraSpace =
            maxWidth -
            lastView.textLeftOffset -
            ctx.measureText(lastView.segment).width;
          const totalSegments = group.views.length - 1; // excluding last segment
          const spaceBetween = extraSpace / totalSegments;

          for (let i = 0; i < group.views.length; i++) {
            const view = group.views[i];
            ctx.font =
              `${view.fontWeight} ${view.fontSize}px ${view.fontFamily}`.trim();
            ctx.fillStyle = view.fillStyle;

            let topOffset = 0;
            if (view.fontSize !== localMaxFontSize) {
              topOffset = (localMaxFontSize - view.fontSize) / 2;
            }

            ctx.fillText(
              view.segment,
              leftOffset + view.textLeftOffset + i * spaceBetween,
              topOffset + view.textTopOffset,
            );

            if (view.strokeLine) {
              ctx.lineWidth = view.strokeLine;
              ctx.strokeStyle = view.strokeColor;
              ctx.strokeText(
                view.segment,
                leftOffset + view.textLeftOffset + i * spaceBetween,
                topOffset + view.textTopOffset,
              );
            }
          }
        } else {
          for (const view of group.views) {
            ctx.font =
              `${view.fontWeight} ${view.fontSize}px ${view.fontFamily}`.trim();
            ctx.fillStyle = view.fillStyle;

            let topOffset = 0;
            if (view.fontSize !== localMaxFontSize) {
              topOffset = (localMaxFontSize - view.fontSize) / 2;
            }

            ctx.fillText(
              view.segment,
              leftOffset + view.textLeftOffset,
              topOffset + view.textTopOffset,
            );

            if (view.strokeLine) {
              ctx.lineWidth = view.strokeLine;
              ctx.strokeStyle = view.strokeColor;
              ctx.strokeText(
                view.segment,
                leftOffset + view.textLeftOffset,
                topOffset + view.textTopOffset,
              );
            }
          }
        }
      }
    },
  };
}

export function limitTextByWidth(ctx, textItem, maxWidth) {
  ctx.font = `${textItem.textSize}px ${textItem.textFont}`;

  const text = textItem.text;

  let start = 0;
  let end = text.length;

  while (start < end) {
    const mid = (start + end + 1) >> 1;
    const slice = text.slice(0, mid);

    if (ctx.measureText(slice).width <= maxWidth) {
      start = mid;
    } else {
      end = mid - 1;
    }
  }

  return text.slice(0, start);
}

export function drawPreview(canvas, ctx, options = {}) {
  const {
    rotate = -45,
    opacity = 0.5,
    color = "gray",
    text = "Preview",
    fontSize: customFontSize,
    fontFamily: customFontFamily,
  } = options;

  const fontSize = customFontSize || canvas.width * 0.1;
  const fontFamily = customFontFamily || "Arial, sans-serif";
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;

  const textWidth = ctx.measureText(text).width;

  ctx.save();
  ctx.globalAlpha = opacity;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  ctx.translate(centerX, centerY);

  const rotationAngle = (Math.PI / 180) * rotate;
  ctx.rotate(rotationAngle);

  ctx.fillText(text, 0, 0);

  ctx.restore();

  return {
    textWidth,
  };
}

/**
 * Draws text on canvas with ordinal suffixes (st/nd/rd/th) as superscript.
 * Pass `superscriptMod: { fontSize, offsetY }` on any MPTC_TEXTS entry to override defaults.
 *
 * @example — default
 * { ..., y: 2136, draw: withSuperscript(ctx, canvas) }
 *
 * @example — with overrides
 * { ..., y: 2136, draw: withSuperscript(ctx, canvas), superscriptMod: { fontSize: 40, offsetY: -10 } }
 */
export const withSuperscript = (ctx, canvas) => (text, opts) => {
  const { fontSize, offsetY = 0 } = opts.superscriptMod ?? {};
  const font = fontSize
    ? opts.font.replace(/\d+px/, `${fontSize}px`)
    : opts.font;
  const size = parseInt(font.match(/(\d+)px/)?.[1] ?? 16);
  const suffixFont = font.replace(/\d+px/, `${Math.round(size * 0.6)}px`);
  const raise = Math.round(size * 0.45);
  const y = opts.y + offsetY;

  const segments = text.split(/(\d+(?:st|nd|rd|th))/gi).flatMap((part) => {
    const m = part.match(/^(\d+)(st|nd|rd|th)$/i);
    return m
      ? [
        { text: m[1], s: false },
        { text: m[2], s: true },
      ]
      : [{ text: part, s: false }];
  });

  const totalWidth = segments.reduce((sum, s) => {
    ctx.font = s.s ? suffixFont : font;
    return sum + ctx.measureText(s.text).width;
  }, 0);

  let x =
    opts.align === "center" ? (canvas.width - totalWidth) / 2 : (opts.x ?? 0);
  ctx.fillStyle = opts.fillStyle ?? "#0033ff";

  for (const s of segments) {
    ctx.font = s.s ? suffixFont : font;
    ctx.fillText(s.text, x, s.s ? y - raise : y);
    x += ctx.measureText(s.text).width;
  }
};

export function drawTextWithLetterSpacing(canvas, ctx, text, options) {
  if (!options.letterSpacing) return drawText(canvas, ctx, text, options);

  ctx.font = options.font || "12px Arial, sans-serif";
  ctx.fillStyle = options.textColor || "black";

  if ("letterSpacing" in ctx) {
    const orig = ctx.letterSpacing;
    ctx.letterSpacing = `${options.letterSpacing}px`;
    drawText(canvas, ctx, text, options);
    ctx.letterSpacing = orig;
    return;
  }

  const chars = Array.from(new Intl.Segmenter("km", { granularity: "grapheme" }).segment(text)).map(s => s.segment);
  const widths = chars.map(c => ctx.measureText(c).width);
  const totalW = widths.reduce((sum, w) => sum + w, 0) + (chars.length - 1) * options.letterSpacing;

  let x = options.x || 0;
  if (options.align === "center") x = (options.x || canvas.width / 2) - totalW / 2;
  else if (options.align === "right") x = (options.x || canvas.width) - totalW;
  else if (options.align === "left") x += options.margin || 0;

  chars.forEach((char, i) => {
    ctx.fillText(char, x, options.y);
    if (options.strokeLine) {
      ctx.lineWidth = options.strokeLine;
      ctx.strokeStyle = options.strokeColor;
      ctx.strokeText(char, x, options.y);
    }
    x += widths[i] + options.letterSpacing;
  });
}
