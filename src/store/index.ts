import Vue from 'vue'
import Vuex from 'vuex'
import { ipcRenderer } from "electron"
//const sm = require('@manladag/scanmanga').Source
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sources: ipcRenderer.sendSync('getSources')
  },
  mutations: {
    getSources(state, s) {
      state.sources = s
    },
    addAvailableChapter(state,{source_key,manga_key,chapter}) {
      state.sources[source_key].mangas[manga_key].chapters.push(chapter)
    }
  },
  actions: {
  },
  modules: {
  }
})
