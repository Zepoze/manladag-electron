import Vue from 'vue'
import Vuex from 'vuex'
import download from './downloadChapter'
import { ipcRenderer } from "electron"
//const sm = require('@manladag/scanmanga').Source
Vue.use(Vuex)

const Store = new Vuex.Store({
  state: {
    sources: ipcRenderer.sendSync('getSources') as {[key:string]:sourceRender},
    test: 3
  },
  mutations: {
    getSources(state, s) {
      state.sources = s
    },
    addAvailableChapter(state,{source_key,manga_key,chapter,available}) {
      Vue.set(state.sources[source_key].mangas[manga_key].chapters,chapter,{available, chapter})
    }
  },
  actions: {
  },
  getters: {
    getManga:(state) => (source_key:string,manga_key:string) => {
      return state.sources[source_key].mangas[manga_key]
    },
    getSource:(state) => (source_key:string) => {
      return state.sources[source_key]
    }
  },
  modules: {
    download
  }
})

ipcRenderer.on('chapterAvailable',(event,args) => {
  Store.commit('addAvailableChapter',args)
  //console.log(args)
})

ipcRenderer.on('notification-error-chapter', (event,{title, text, type, duration}) => {
  Vue.notify({
    title,
    text,
    type:'error',
    group:'foo',
    duration: 20000
  })
})

ipcRenderer.send('download-chapter-set-listeners')

export default Store