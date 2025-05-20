import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import TableEditorView from '../views/TableEditorView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/tableeditor', component: TableEditorView },
]

export const router = createRouter({
  history: createWebHistory('/gcst-editor/'),
  routes,
})
