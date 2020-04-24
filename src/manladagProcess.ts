import { ipcMain } from 'electron'
import { ManladagSource } from '@manladag/source'

interface sourceRender {
  site:string,
  url:string,
  mangas: {
    [key:string]: {
      name:string,
      key:string,
      chapters:number[]
    }
  },
  key:string
}

const lelscanv:source = require('@manladag/lelscanv').Source
const scanmanga:source = require('@manladag/scanmanga').Source


const ManladagSources:{[key:string]: ManladagSource} = {}

const tm:sourceRender[] = ((tab:source[]) => tab.map( s => {
  const key = `${s.site}-${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`
  ManladagSources[key] = new ManladagSource(s)
  return {
    site: s.site,
    url: s.url,
    mangas: (()=> {
      const tmp:{[key:string]:any} = {}
      const keys:string[] = Object.keys(s.mangas)
      Object.values(s.mangas).forEach((e,i) => {
        tmp[keys[i]] = {name: e.name,key: keys[i],chapters: [] }
      })
      return tmp
    })(),
    key
  }
}))([lelscanv,scanmanga])

const Sources: {[key:string]:sourceRender} = {}

tm.forEach((e)=> {
  Sources[e.key] = e
})





ipcMain.on("getSources",(event,args) => {
  event.returnValue = Sources
})

ipcMain.on("getLastChapter", async (event,{ source_key, manga_key}) => {
  const ms = ManladagSources[source_key]
  const chap = ms.getLastChapter(ms.mangas[manga_key])
  event.reply('chapterAvailable',{source_key,manga_key, chapter:await chap})
})