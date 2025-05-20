import type { ALRDColumn } from './models/ALRDColumn'
import type { ALTB } from './models/ALTB'
import ArrayBufferReader from './models/ArrayBufferReader'

function toUInt32(bytes: Uint8Array, offset = 0): number {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  return view.getUint32(offset, true)
}

function toFloat32(bytes: Uint8Array, offset = 0): number {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  return view.getFloat32(offset, true)
}

export function parse(input: ArrayBuffer): ALTB {
  const abr = new ArrayBufferReader(input)

  // -------------- Parse ALTB

  const altbMagic = abr.readBytes(4)

  if (altbMagic[0] !== 0x41 || altbMagic[1] !== 0x4C || altbMagic[2] !== 0x54 || altbMagic[3] !== 0x42) {
    throw new Error('File is not a ALTB file')
  }

  const unk = abr.readUInt8()
  const tableNameOffset = abr.readUInt8()
  const entryCount = abr.readUInt16()
  const alrdHeaderOffset = abr.readUInt16()
  const alrdEntriesOffset = abr.readUInt16()
  const alrdEntryLength = abr.readUInt16()
  const unk2 = abr.readUInt16()

  if (tableNameOffset === 0x1C)
    abr.readUInt32() // idk what this is but it equals TextSectionOffset - TextSectionLength

  // CameraCorrect.atb does not have a text section
  let textSectionLength = 0
  let textSectionOffset = input.byteLength
  if (tableNameOffset === 0x14) {
    textSectionLength = abr.readUInt32()
    textSectionOffset = abr.readUInt32()
  } else if (tableNameOffset === 0x1C) { // wtf
    textSectionOffset = abr.readUInt32()
    textSectionLength = abr.readUInt32()
  }

  const tableName = abr.readString(4)

  // -------------- Parse ALRD Header

  const alrdMagic = abr.readBytes(4)

  if (alrdMagic[0] !== 0x41 || alrdMagic[1] !== 0x4C || alrdMagic[2] !== 0x52 || alrdMagic[3] !== 0x44) {
    throw new Error('Expecting a ALRD record, got something else')
  }

  const alrdUnk1 = abr.readUInt8()
  const alrdUnk2 = abr.readUInt8()
  const columnCount = abr.readUInt16()
  const entryLength = abr.readUInt16()

  if (alrdEntryLength !== entryLength) {
    throw new Error('ALRD entry size does not match the entry size defined in the ALTB header')
  }

  // -------------- Parse ALRD Columns

  let columns: ALRDColumn[] = []
  const unusedColumns: ALRDColumn[] = []

  while (abr.getOffset() < alrdEntriesOffset) {
    const columnOffset = abr.readUInt16()
    const columnUnknown = abr.readUInt16()

    const nameLength = abr.readUInt8()
    const captionLength = abr.readUInt8()

    const columnName = abr.readString(nameLength)
    abr.readUInt8() // Null terminator

    const columnCaption = abr.readString(captionLength)
    abr.readUInt8() // Null terminator

    // We need to realign
    while (abr.getOffset() % 4 !== 0)
      abr.readUInt8()

    // TODO: Ugly hack because idk what the fuck the bytes after the caption are for
    const garbage = abr.readUInt8()
    if (garbage === 0xFF || garbage === 0x07)
      abr.readBytes(3)
    else
      abr.setOffset(abr.getOffset() - 1)

    // Yet another ugly hack
    if (nameLength === 0)
      continue

    // TODO: this is dogshit because it assumes the first column is never unused
    if (columnOffset === 0 && columns.length !== 0) {
      unusedColumns.push({
        offset: columnOffset,
        unknown: columnUnknown,
        name: columnName,
        caption: columnCaption,
      })
    }
    else {
      columns.push({
        offset: columnOffset,
        unknown: columnUnknown,
        name: columnName,
        caption: columnCaption,
      })
    }
  }

  columns = columns.sort((col1, col2) => col1.offset - col2.offset)
  console.dir(columns)

  // -------------- Parse ALRD Values

  const entries = []

  while (abr.getOffset() < textSectionOffset) {
    const entry = new Map<string, string>()

    for (let i = 0; i < columns.length; i++) {
      // Value might not always be 4-byte long, so only read the correct amount of bytes
      let valueLength = 0
      if (i === (columns.length - 1))
        valueLength = alrdEntryLength - columns[i].offset
      else
        valueLength = columns[i + 1].offset - columns[i].offset

      const value = abr.readBytes(valueLength)

      // TODO: this is complete dogshit
      if (columns[i].unknown == 32 || columns[i].unknown == 98 || columns[i].unknown == 7524) {
        // String
        const currentPosition = abr.getOffset()

        abr.setOffset(textSectionOffset + toUInt32(value))
        const strValue = abr.readCString()
        abr.setOffset(currentPosition)

        entry.set(columns[i].name, strValue)
      }
      else if (columns[i].unknown == 2049 || columns[i].unknown == 261 || columns[i].unknown == 1633 || columns[i].unknown == 2056) {
        // Number (idk which byte length, seems to work with many)

        if (valueLength == 4)
          entry.set(columns[i].name, `${toUInt32(value)}`)
        else
          entry.set(columns[i].name, `${value}`) // todo
      }
      else if (columns[i].unknown == 3076) {
        // Float

        if (valueLength == 4)
          entry.set(columns[i].name, `${toFloat32(value)}`)
        else
          entry.set(columns[i].name, `${value}`) // todo
      }
      else {
        console.log('Column', columns[i].name)
        console.log('Missing handle type', columns[i].unknown)
      }
    }

    entries.push(entry)
  }

  return {
    unknown1: unk,
    tableNameOffset,
    entryCount,
    alrdHeaderOffset,
    alrdEntriesOffset: alrdHeaderOffset,
    alrdEntryLength,
    unknown2: unk2,
    textSectionLength,
    textSectionOffset,
    tableName,
    alrd: {
      unknown1: alrdUnk1,
      unknown2: alrdUnk2,
      columnCount,
      entryLength,
      columns,
      unusedColumns,
      entries,
    },
  }
}
