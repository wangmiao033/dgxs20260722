#!/usr/bin/env python3
from __future__ import annotations

import csv
import struct
import subprocess
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "hero_work" / "hero_icons_astc_source"
ASTC_DIR = SOURCE / "astc"
OUT_DIR = ROOT / "hero_output"
RAW_DIR = OUT_DIR / "rgba"
PNG_DIR = OUT_DIR / "png"
CONTACT_DIR = OUT_DIR / "contact_sheets"
DECODER = ROOT / "build" / "decode_astc"


def read_u24(data: bytes, offset: int) -> int:
    return data[offset] | (data[offset + 1] << 8) | (data[offset + 2] << 16)


def make_contact_sheet(images: list[Path], output: Path, page_size: int = 24) -> None:
    if not images:
        return
    thumb = 150
    label_h = 30
    cols = 6
    for page_no, start in enumerate(range(0, len(images), page_size), 1):
        page = images[start : start + page_size]
        rows = (len(page) + cols - 1) // cols
        sheet = Image.new("RGBA", (cols * thumb, rows * (thumb + label_h)), "white")
        for index, path in enumerate(page):
            image = Image.open(path).convert("RGBA")
            fitted = ImageOps.contain(image, (thumb - 8, thumb - 8))
            x = (index % cols) * thumb + (thumb - fitted.width) // 2
            y = (index // cols) * (thumb + label_h) + (thumb - fitted.height) // 2
            sheet.alpha_composite(fitted, (x, y))
            # Keep labels as filename strips; Chinese fonts are not required here.
            label = path.stem[:18]
            from PIL import ImageDraw
            draw = ImageDraw.Draw(sheet)
            draw.text(((index % cols) * thumb + 6, (index // cols) * (thumb + label_h) + thumb + 5), label, fill="black")
        target = output.with_name(f"{output.stem}-{page_no:02d}.png")
        sheet.convert("RGB").save(target, quality=95)


def main() -> None:
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    PNG_DIR.mkdir(parents=True, exist_ok=True)
    CONTACT_DIR.mkdir(parents=True, exist_ok=True)

    rows: list[list[object]] = []
    pngs: list[Path] = []
    for astc_path in sorted(ASTC_DIR.glob("*.astc")):
        header = astc_path.read_bytes()[:16]
        if len(header) != 16 or header[:4] != bytes([0x13, 0xAB, 0xA1, 0x5C]):
            raise RuntimeError(f"Invalid ASTC file: {astc_path}")
        width = read_u24(header, 7)
        height = read_u24(header, 10)
        raw_path = RAW_DIR / f"{astc_path.stem}.rgba"
        result = subprocess.run(
            [str(DECODER), str(astc_path), str(raw_path)],
            check=True,
            capture_output=True,
            text=True,
        )
        rgba = raw_path.read_bytes()
        expected = width * height * 4
        if len(rgba) != expected:
            raise RuntimeError(f"Decoded size mismatch for {astc_path.name}: {len(rgba)} != {expected}")
        image = Image.frombytes("RGBA", (width, height), rgba)
        # Unity Texture2D data is conventionally vertically inverted for normal image display.
        image = ImageOps.flip(image)
        png_path = PNG_DIR / f"{astc_path.stem}.png"
        image.save(png_path, optimize=True)
        pngs.append(png_path)
        rows.append([astc_path.stem, width, height, astc_path.stat().st_size, png_path.stat().st_size, result.stdout.strip()])

    with (OUT_DIR / "decoded_manifest.csv").open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.writer(handle)
        writer.writerow(["texture_id", "width", "height", "astc_bytes", "png_bytes", "decoder_output"])
        writer.writerows(rows)

    make_contact_sheet(pngs, CONTACT_DIR / "hero-icons-contact-sheet.png")
    print(f"Decoded {len(pngs)} hero icon textures")


if __name__ == "__main__":
    main()
