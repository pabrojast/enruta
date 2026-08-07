import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function buildTextPdf(params: {
  title: string;
  subtitle?: string;
  sections: { heading: string; body: string }[];
  footer?: string;
}): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page = doc.addPage([595, 842]); // A4
  const margin = 50;
  const maxWidth = 595 - margin * 2;
  let y = 792;

  const ensureSpace = (needed: number) => {
    if (y - needed < margin) {
      page = doc.addPage([595, 842]);
      y = 792;
    }
  };

  const drawWrapped = (
    text: string,
    size: number,
    bold = false,
    color = rgb(0.1, 0.1, 0.12),
  ) => {
    const f = bold ? fontBold : font;
    const words = text.replace(/\r/g, "").split(/\s+/);
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      const width = f.widthOfTextAtSize(test, size);
      if (width > maxWidth && line) {
        ensureSpace(size + 6);
        page.drawText(line, { x: margin, y, size, font: f, color });
        y -= size + 4;
        line = word;
      } else {
        line = test;
      }
    }
    if (line) {
      ensureSpace(size + 6);
      page.drawText(line, { x: margin, y, size, font: f, color });
      y -= size + 6;
    }
  };

  drawWrapped(params.title, 18, true, rgb(0.05, 0.08, 0.15));
  if (params.subtitle) {
    drawWrapped(params.subtitle, 11, false, rgb(0.3, 0.35, 0.4));
    y -= 8;
  }
  drawWrapped(
    "ENRUTA — Descubre tu norte · Resultados orientativos",
    9,
    false,
    rgb(0.4, 0.45, 0.5),
  );
  y -= 12;

  for (const section of params.sections) {
    ensureSpace(40);
    drawWrapped(section.heading, 12, true, rgb(0.08, 0.45, 0.42));
    y -= 2;
    for (const para of section.body.split("\n")) {
      if (!para.trim()) {
        y -= 6;
        continue;
      }
      drawWrapped(para, 10);
    }
    y -= 10;
  }

  if (params.footer) {
    ensureSpace(40);
    y -= 8;
    drawWrapped(params.footer, 8, false, rgb(0.45, 0.45, 0.5));
  }

  return doc.save();
}
