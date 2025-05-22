import type { ALAR } from './models/ALAR'
import type { ALARFile } from './models/ALARFile'
import ArrayBufferReader from './models/ArrayBufferReader'

export function parse(input: ArrayBuffer): ALAR {
  const abr = new ArrayBufferReader(input)

  // -------------- Parse ALAR

  const alarMagic = abr.readBytes(4)
  if (alarMagic[0] !== 0x41 || alarMagic[1] !== 0x4C || alarMagic[2] !== 0x41 || alarMagic[3] !== 0x52) {
    throw new Error('File is not a ALAR file')
  }

  const type = abr.readUInt8()
  const unk = abr.readUInt8()
  const fileCount = abr.readUInt16()
  const firstFileId = abr.readUInt32()
  const lastFileId = abr.readUInt32()

  const files: ALARFile[] = []

  for (let i = 0; i < fileCount; i++) {
    const fileId = abr.readUInt32()
    const fileOffset = abr.readUInt32()
    const fileSize = abr.readUInt32()
    const fileUnknown = abr.readUInt32() // Seems to always be 0x01000080

    const currentPosition = abr.getOffset()

    abr.setOffset(fileOffset - 0x22)
    const fileName = abr.readCString() // Max name length is 0x20
    // TODO: there are two bytes after the name which are not size or checksum related

    abr.setOffset(fileOffset)
    const fileContents = abr.readBytes(fileSize)

    files.push({
      id: fileId,
      offset: fileOffset,
      size: fileSize,
      unknown: fileUnknown,
      name: fileName,
      content: fileContents,
    })

    abr.setOffset(currentPosition)
  }

  return {
    type,
    unknown: unk,
    fileCount,
    firstFileId,
    lastFileId,
    files,
  }
}
