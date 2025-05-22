<script setup lang="ts">
import type { ALAR } from '../models/ALAR'
import type { ALARFile } from '../models/ALARFile'
import { computed, ref } from 'vue'
import { parse } from '../alar-parser'

const alar = ref<ALAR>()

const search = ref<string>('')

const filteredAlarFiles = computed<ALARFile[]>(() => {
  const query = search.value.toLowerCase()

  return alar.value?.files.filter((file) => {
    // If search is empty, include all entries
    if (!query)
      return true

    // Check if any value in the map contains the search string
    if (file.name.toLowerCase().includes(query) || file.id.toString().includes(query)) {
      return true
    }

    return false
  }) ?? []
})

function downloadFile(file: ALARFile): void {
  const blob = new Blob([file.content], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = file.name
  document.body.appendChild(a)
  a.click()

  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function onDrop(e: DragEvent) {
  e.stopPropagation()
  e.preventDefault()

  const dt = e.dataTransfer
  const files = dt?.files

  if (files?.length !== 1) {
    console.error('No files or more than one file was given as input. Please only input one file.')
    return
  }

  const file = files[0]

  const reader = new FileReader()
  reader.onload = (e) => {
    if (e?.target?.result == null) {
      console.error('Cannot read input file.')
      return
    }

    alar.value = parse(e.target.result as ArrayBuffer)
    console.dir(alar.value)
  }
  reader.readAsArrayBuffer(file)
}
</script>

<template>
  <div class="container vh-navbar" @drop="onDrop($event)" @dragover.prevent @dragenter.prevent>
    <h1 class="mt-3">
      Archive Editor
    </h1>

    <p v-if="alar">
      Loaded archive - {{ alar.fileCount }} files
    </p>

    <div v-if="alar" class="col-lg-4">
      <div class="input-group">
        <input v-model="search" class="form-control" placeholder="Search" type="text" name="search">
      </div>
    </div>

    <div class="table-responsive mt-3">
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">
              File ID
            </th>
            <th scope="col">
              File Name
            </th>
            <th scope="col">
              File Offset
            </th>
            <th scope="col">
              File Size
            </th>
            <th scope="col">
              Unknown
            </th>
            <th scope="col" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="alarFile in filteredAlarFiles">
            <td>
              {{ alarFile.id }}
            </td>
            <td>
              {{ alarFile.name }}
            </td>
            <td>
              {{ alarFile.offset }}
            </td>
            <td>
              {{ alarFile.size }}
            </td>
            <td>
              {{ alarFile.unknown }}
            </td>
            <td>
              <button type="button" class="btn btn-primary" @click="downloadFile(alarFile)">
                Download
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.vh-navbar {
    height: 92vh !important;
}
</style>
