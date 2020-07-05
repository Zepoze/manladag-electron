import { ipcMain,app, ipcRenderer } from 'electron'
import { ManladagSource } from '@manladag/source'
import fs from 'fs'
import Path from 'path'
import os from 'os'
import rimraf from 'rimraf'
import AdmZip from 'adm-zip'
const lelscanv:source = require('@manladag/lelscanv').Source
const scanmanga:source = require('@manladag/scanmanga').Source


const ManladagSources:{[key:string]: ManladagSource} = {}

const tm:sourceRender[] = ((tab:source[]) => tab.map( s => {
  const key = `${s.site}`
  ManladagSources[key] = new ManladagSource(s)
  return {
    site: s.site,
    url: s.url,
    mangas: (()=> {
      const tmp:{[key:string]:any} = {}
      const keys:string[] = Object.keys(s.mangas)
      Object.values(s.mangas).forEach((e,i) => {
        tmp[keys[i]] = {name: e.name,key: keys[i],chapters: {},processing:{ lastChapter:false,chapters:[]}, cover: 'https://picsum.photos/200' }
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

/*Object.values(ManladagSources).forEach((s) => {
  s.addOnDownloadChapterStartedListener(({ source, manga, chapter, numberPage }) => {
    console.log("download start")

  })
  s.addOnDownloadChapterFinishedListener(() => {
    console.log("download finish")
  })
  s.addOnDownloadChapterErrorListener(({path}) => {
    console.log("download error",path)
    rimraf.sync(path)
  })
})*/


ipcMain.on('download-chapter-set-listeners', (event, args) => {
  Object.values(ManladagSources).forEach((s) => {

    const tabEvent:string[] = [
      'download-page-started',
      'download-page-finished',
      'download-page-error',
      'download-chapter-started',
      'download-chapter-finished',
      'download-chapter-error',
    ]
    tabEvent.forEach((event) => {
      s.removeAllListeners(event)
    })
    s.addOnDownloadChapterStartedListener(({ source, manga, chapter, numberPage }) => {
      console.log("download start")
      console.log('reply start')
      event.reply('download-chapter-started', { source, manga, chapter, numberPage})
    })
    s.addOnDownloadChapterFinishedListener(({ source, manga, chapter }) => {
      console.log("download finish")
      event.reply('download-chapter-finished', { source, manga, chapter })
    })
    s.addOnDownloadChapterErrorListener(({path}) => {
      console.log("download error",path)
      rimraf.sync(path)
    })
    s.addOnDownloadPageStartedListener(({ source, manga, chapter }) => {
      event.reply('download-page-started', { source, manga, chapter })
    })
    s.addOnDownloadPageFinishedListener(({ source, manga, chapter }) => {
      event.reply('download-page-finished', { source, manga, chapter })
    })
    s.addOnDownloadPageErrorListener(() => {
      console.log('page error')
    })
  })
})

ipcMain.on("getSources",(event,args) => {
  event.returnValue = Sources
})

function getLastChapter(event:Electron.IpcMainEvent,{ source_key, manga_key}:any) {
  const ms = ManladagSources[source_key]
  event.reply('manga-processing-last-chapter', { source_key, manga_key, data: true})
  ms.getLastChapter(ms.mangas[manga_key])
  .then(
    (chapter) => {
      console.log(chapter)
      event.reply('chapterAvailable',{source_key,manga_key, chapter,available:true})
    }
  )
  .catch(
    (e) => {
      console.log('error')
      event.reply('notification-error-chapter',{
        text:`Impossible to get the last chapter of ${ms.mangas[manga_key].name} in ${ms.site}`,
        title: e.name === 'RequestError'? 'Network Error ?':'Error'
      })
    }
  ).finally(() => {
    event.reply('manga-processing-last-chapter', { source_key, manga_key, data: false})
  })
  
}

ipcMain.on("getLastChapter", getLastChapter)


ipcMain.on("getLastsChapters", function (event,tab:{ manga_keys:string[], source_key:string }[] ) {
  tab.forEach((e) => {
    e.manga_keys.forEach((mk) => {
      getLastChapter.call(null, event, { manga_key: mk, source_key:e.source_key })
    })
  })
})

ipcMain.on("test",(event,args) => {
  console.log('ipc test')
  console.log(args)
})

ipcMain.on("download-chapter",async (event,{source_key,manga_key,chapter,process='default'}) => {
  const ms = ManladagSources[source_key]
  let base = app.getPath('desktop')
  let path = Path.join(base,`${source_key}${manga_key}-${chapter}`)

  const tmpdir = fs.mkdtempSync(Path.join(os.tmpdir(),'manladag-'))
  
  event.reply('chapter-download-waiting-to-start', { source_key,manga_key, chapter, downloadKey: `${ms.site+ms.mangas[manga_key].name+chapter}` })
  await ManladagSources[source_key].downloadChapter(manga_key,chapter,tmpdir)
  
  switch(process) {
    case 'default':
      for(let i = 0;fs.existsSync(path);i++) path = Path.join(base,`${source_key}${manga_key}-${chapter} (${i})`)
      fs.renameSync(tmpdir,path)
      break
    case 'mdla':
      const infos = {
        Source: ms.site,
        Manga: ms.mangas[manga_key].name,
        Chapter: chapter,
        "Downloading Date": ((date:number) => {
          var d = new Date(date),
              month = '' + (d.getMonth() + 1),
              day = '' + d.getDate(),
              year = d.getFullYear();
      
          if (month.length < 2) 
              month = '0' + month;
          if (day.length < 2) 
              day = '0' + day;
      
          return [year, month, day].join('-');
        })(Date.now())
      }
      fs.writeFileSync(Path.join(tmpdir,'infos.json'),JSON.stringify(infos))
      const zip = new AdmZip()
      zip.addLocalFolder(tmpdir)
      path = Path.join(base,`${infos.Source}-${infos.Manga}-${infos.Chapter}.mdla`)
      for(let i = 0;fs.existsSync(path);i++) path = Path.join(base,`${infos.Source}-${infos.Manga}-${infos.Chapter} (${i}).mdla`)
      zip.writeZip(path)
      rimraf.sync(tmpdir)

  }




  console.log('realyfinish')
})

