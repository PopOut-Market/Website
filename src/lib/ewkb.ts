export type LatLng = { lat: number; lng: number };

function toBytes(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  if (clean.length % 2 !== 0) {
    throw new Error("Invalid EWKB hex length");
  }

  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = Number.parseInt(clean.slice(i, i + 2), 16);
  }
  return bytes;
}

export function parseEwkbPoint(hex: string | null | undefined): LatLng | null {
  if (!hex || typeof hex !== "string") return null;

  try {
    const bytes = toBytes(hex);
    if (bytes.length < 21) return null;

    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const littleEndian = view.getUint8(0) === 1;
    const typeRaw = view.getUint32(1, littleEndian);

    const hasSrid = (typeRaw & 0x20000000) !== 0;
    const geomType = typeRaw & 0x000000ff;
    if (geomType !== 1) return null;

    let offset = 5;
    if (hasSrid) {
      if (bytes.length < 25) return null;
      offset += 4;
    }

    const x = view.getFloat64(offset, littleEndian);
    const y = view.getFloat64(offset + 8, littleEndian);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;

    return { lat: y, lng: x };
  } catch {
    return null;
  }
}
