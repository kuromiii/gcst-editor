<script setup lang="ts">
import type { ALTB } from '../models/ALTB'
import { computed, ref } from 'vue'
import { parse } from '../altb-parser'

const altb = ref<ALTB>()

const search = ref<string>('')

const filteredAltb = computed<Map<string, string>[]>(() => {
  const query = search.value.toLowerCase()

  return altb.value?.alrd.entries.filter((entry) => {
    // If search is empty, include all entries
    if (!query)
      return true

    // Check if any value in the map contains the search string
    for (const val of entry.values()) {
      if (val.toLowerCase().includes(query)) {
        return true
      }
    }

    return false
  }) ?? []
})

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

    altb.value = parse(e.target.result as ArrayBuffer)
    console.dir(altb.value)
  }
  reader.readAsArrayBuffer(file)
}
</script>

<template>
  <div class="container vh-navbar" @drop="onDrop($event)" @dragover.prevent @dragenter.prevent>
    <h1 class="mt-3">
      Table Editor
    </h1>

    <p v-if="altb">
      Loaded table <strong>{{ altb.tableName }}</strong> - {{ altb.entryCount }} entries
    </p>

    <div v-if="altb" class="col-lg-4">
      <div class="input-group">
        <input v-model="search" class="form-control" placeholder="Search" type="text" name="search">
      </div>
    </div>

    <div class="table-responsive mt-3">
      <table class="table table-hover">
        <thead>
          <tr>
            <th v-for="column in altb?.alrd.columns" scope="col">
              {{ column.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in filteredAltb">
            <td v-for="entryValue in entry.entries()">
              {{ entryValue[1] }}
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
