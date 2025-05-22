import type { ALARFile } from './ALARFile'

interface ALAR {
  /**
   * Type, seems to always be 2 for gcst
   */
  type: number

  /**
   * Unknown, seems to always be 61 for gcst
   */
  unknown: number

  /**
   * The number of files in the archive
   */
  fileCount: number

  /**
   * The ID of the first file in the archive
   */
  firstFileId: number

  /**
   * The ID of the last file in the archive
   */
  lastFileId: number

  /**
   * List of files
   */
  files: ALARFile[]
}

export type { ALAR }
