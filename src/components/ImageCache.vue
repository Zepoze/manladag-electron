<template>
  <v-img :src="source" />
</template>
<script lang="ts">
import Vue from 'vue'
import { ipcRenderer, remote } from 'electron'
import fs,{ WriteStream } from 'fs'
import request from 'request'
import Path from 'path'
import FileType from 'file-type'

const cacheDir = Path.join(remote.app.getPath('cache'),remote.app.getName())
if(!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir)
}

export default Vue.extend({
  props: {
    src: {
      type: String,
      required: true
    },
    cacheKey: {
      type: String,
      required: true
    }
  },
  methods: {
  },
  computed: {
    source():string {
      const filename = Path.join(cacheDir, btoa(this.cacheKey))
      if(!fs.existsSync(filename)) {
        request.head(this.src, (err,res,body) => {
        fs.mkdtempSync
          const tmpfile = Path.join(remote.app.getPath('temp'), Path.basename(filename))
          if(err) throw err
          let ws = fs.createWriteStream(tmpfile)
          
          request(this.src).pipe(ws)

          const mime = FileType.fromFile(tmpfile).then((o) => {
            console.log(o)
            if(!o) throw new Error('no mime?')
            const base64 = fs.readFileSync(tmpfile, { encoding: 'base64' })
            fs.writeFileSync(filename, `data;${o.mime};${base64}`)
            fs.unlinkSync(tmpfile)
          })

        })
        return this.src
      } else {
       return this.src
        
      }
    }
  },
  mounted() {
    console.log(Path.join(remote.app.getPath('temp')))
  }
})
</script>
