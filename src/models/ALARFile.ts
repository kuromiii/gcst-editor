interface ALARFile {
  /**
   * The ID of the file, which is used to reference files in some tables
   */
  id: number

  /**
   * The offset of the beginning of the file data
   */
  offset: number

  /**
   * The size of the file in bytes
   */
  size: number

  /**
   * Unknown, seems to always be 0x01000080
   */
  unknown: number

  /**
   * The name of the file
   */
  name: string
}

export type { ALARFile }
