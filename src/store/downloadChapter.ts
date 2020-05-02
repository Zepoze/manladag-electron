import Vue from 'vue'
import Store from '.'
import { ipcRenderer } from 'electron'
export default {
  namespaced:true,
  state: {
    downloadsState:{} as downloadsState
  },
  mutations:{
    waitingToStart(state:any, { source_key, manga_key, chapter, downloadKey }:any) {
      Vue.set(state.downloadsState, downloadKey, { state: 0, source_key, manga_key, chapter })
    },
    chapterStarted(state:any, { numberPage, downloadKey }:any) {
      Vue.set(state.downloadsState, downloadKey, { ...state.downloadsState[downloadKey], state: 1, numberPage, numberPageDownloaded:0 })
    },
    chapterFinished(state:any, { downloadKey }:any) {
      Vue.set(state.downloadsState, downloadKey, { ...state.downloadsState[downloadKey], state: 3})
    },
    pageStarted(state:any, { downloadKey }:any) {
      let numberPageDownloaded:number = state.downloadsState[downloadKey].numberPageDownloaded+1
      Vue.set(state.downloadsState, downloadKey, { 
        ...state.downloadsState[downloadKey],
        state: 2,
        message:`download of page ${numberPageDownloaded} start`
      })
    },
    pageFinished(state:any, { downloadKey }:any) {
      let numberPageDownloaded:number = state.downloadsState[downloadKey].numberPageDownloaded++
      Vue.set(state.downloadsState, downloadKey, { 
        ...state.downloadsState[downloadKey],
        state: 2,
        message:`download of page ${numberPageDownloaded} finished`
      })
    },
    delete(state:any, downloadKey:string) {
      Vue.delete(state.downloadsState,downloadKey)
    }
  },
  getters: {
    getDownloadState: (state:any) => (key:string) => {
      return state.downloadsState[key]
    }
  }
}

ipcRenderer.on('chapter-download-waiting-to-start',(event,args) => {
  Store.commit('download/waitingToStart', args)
})
ipcRenderer.on('download-chapter-started',(event,{ source, manga, chapter, numberPage }) => {
  console.log('download state started')
  Store.commit('download/chapterStarted', { downloadKey: source+manga+chapter, numberPage })
})
ipcRenderer.on('download-chapter-finished',(event,{ source, manga, chapter }) => {
  console.log('download state finished')
  Store.commit('download/chapterFinished', { downloadKey: source+manga+chapter })
})

ipcRenderer.on('download-page-started',(event,{ source, manga, chapter }) => {
  Store.commit('download/pageStarted', { downloadKey: source+manga+chapter })
})
ipcRenderer.on('download-page-finished',(event,{ source, manga, chapter }) => {
  Store.commit('download/pageFinished', { downloadKey: source+manga+chapter })
})