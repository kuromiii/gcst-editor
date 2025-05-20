import type { ALRDColumn } from './ALRDColumn'

interface ALRD {
  /**
   * Unknown, seems to always be 1
   */
  unknown1: number

  /**
   * Unknown
   */
  unknown2: number

  /**
   * Number of columns in the ALRD
   */
  columnCount: number

  /**
   * Length of a ALRD entry
   */
  entryLength: number

  /**
   * List of columns
   */
  columns: ALRDColumn[]

  /**
   * List of unused columns
   */
  unusedColumns: ALRDColumn[]

  /**
   * List of entries
   */
  entries: Map<string, string>[]
}

export type { ALRD }
