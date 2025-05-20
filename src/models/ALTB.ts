import type { ALRD } from './ALRD'

interface ALTB {
  /**
   * Unknown but not size or checksum related, seems to always be 1
   */
  unknown1: number

  /**
   * Offset where the name of the table is located
   * Can be either 0x1C or 0x14
   */
  tableNameOffset: number

  /**
   * Number of entries in the table
   */
  entryCount: number

  /**
   * Offset of the ALRD header
   */
  alrdHeaderOffset: number

  /**
   * Offset of the first ALRD entry
   */
  alrdEntriesOffset: number

  /**
   * Length of a ALRD entry
   */
  alrdEntryLength: number

  /**
   * Unknown but not size or checksum related, seems to always be 0
   */
  unknown2: number

  /**
   * Length of the text section
   */
  textSectionLength: number

  /**
   * Offset of the text section
   */
  textSectionOffset: number

  /**
   * Name of the table
   */
  tableName: string

  /**
   * ALRD
   */
  alrd: ALRD
}

export type { ALTB }
