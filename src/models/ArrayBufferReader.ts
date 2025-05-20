export default class ArrayBufferReader {
  dv: DataView
  offset: number

  constructor(input: ArrayBuffer) {
    this.offset = 0
    this.dv = new DataView(input)
  }

  getOffset(): number {
    return this.offset
  }

  setOffset(offset: number): void {
    if (offset < 0)
      throw new Error('Offset cannot be negative')

    this.offset = offset
  }

  readUInt8(): number {
    const res = this.dv.getUint8(this.offset)
    this.offset++
    return res
  }

  readUInt16(): number {
    const res = this.dv.getUint16(this.offset, true)
    this.offset += 2
    return res
  }

  readUInt32(): number {
    const res = this.dv.getUint32(this.offset, true)
    this.offset += 4
    return res
  }

  readUInt64(): bigint {
    const res = this.dv.getBigUint64(this.offset, true)
    this.offset += 8
    return res
  }

  readInt8(): number {
    const res = this.dv.getInt8(this.offset)
    this.offset++
    return res
  }

  readInt16(): number {
    const res = this.dv.getInt16(this.offset, true)
    this.offset += 2
    return res
  }

  readInt32(): number {
    const res = this.dv.getInt32(this.offset, true)
    this.offset += 4
    return res
  }

  readInt64(): bigint {
    const res = this.dv.getBigInt64(this.offset, true)
    this.offset += 8
    return res
  }

  readFloat32(): number {
    const res = this.dv.getFloat32(this.offset, true)
    this.offset += 4
    return res
  }

  readFloat64(): number {
    const res = this.dv.getFloat64(this.offset, true)
    this.offset += 8
    return res
  }

  readBytes(length: number): Uint8Array {
    if (length < 0)
      throw new Error('Length cannot be negative')

    const res = new Uint8Array(this.dv.buffer, this.offset, length)
    this.offset += length
    return res
  }

  readString(length: number, encoding: string = 'utf-8'): string {
    if (length < 0)
      throw new Error('Length cannot be negative')

    const res = new Uint8Array(this.dv.buffer, this.offset, length)
    this.offset += length

    // Convert bytes to string
    return new TextDecoder(encoding).decode(res)
  }

  readCString(encoding: string = 'utf-8'): string {
    const bytes = []

    let byte
    while (this.offset < this.dv.byteLength && (byte = this.dv.getUint8(this.offset)) !== 0x00) {
      bytes.push(byte)
      this.offset++
    }

    // Convert bytes to string
    return new TextDecoder(encoding).decode(new Uint8Array(bytes))
  }
}
