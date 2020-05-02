declare interface sourceRender {
    site:string,
    url:string,
    mangas: {
      [key:string]: {
        name:string,
        key:string,
        chapters:{
          [chapter:number]: {
            available:boolean,
            chapter:number
          }
        },
        processing: {
          lastChapter:boolean,
          chapters:number[]
        }
      }
    },
    key:string
  }

  declare interface downloadsState {
    [downloadKey:string]: {
      state:0|1|2|3|4,
      source_key:string,
      manga_key:string,
      chapter:number,
      //'waiting-to-start'|'started'|'page-downloading'|'finished'|'error'
      numberPage?:number,
      numberPageDownloaded?:number,
      message?:string
    }
  }