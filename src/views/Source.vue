<template>
  <v-container fluid :class="['my-transition-opacity',opacity?'so-opacity':'no-opacity']" :disabled="opacity">
    <v-row no-gutters>
      <div class="display-3 primary--text font-weight-black pt-2"> {{ s.site }}</div>
    </v-row><v-row no-gutters>
      <div class="font-weight-light py-8"> Actually {{ Object.keys(s.mangas).length }} mangas on it<v-spacer/><a class="primary--text">Visit the website</a></div></div>
    </v-row>
    <v-divider />
    <v-row>
      <template v-for="(n) in s.mangas">
      <v-col class="mx-auto ma-3 secondary" :key="n.key" cols="4">
        <v-card class="mx-auto" height="100%" :width="200">
          <v-img
            :src="require('../assets/logo.svg')"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          >
            <v-card-title>{{n.name}}</v-card-title>
          </v-img>
            <v-card-title><v-icon>mdi-book-open-variant</v-icon> {{n.name}}</v-card-title><v-card-subtitle> {{ ((max=Math.max(...n.chapters))>=0)? max : 'bruh'}}</v-card-subtitle>
        </v-card>
      </v-col>
      </template>
    </v-row>
    <v-row> {{teste}}</v-row>
    <v-spacer/>
    <v-row no-gutters>
      <v-btn @click="getLast(s.key,Object.keys(s.mangas)[0])">getLast</v-btn>
    </v-row>
    <v-row>
      <v-btn @click="test()">test</v-btn>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from 'vue'
import { ipcRenderer } from 'electron'
import { constants } from 'perf_hooks';
import { setTimeout } from 'timers';
export default Vue.extend({
  data: () => ({
    source: {
      site: "Test"
    },
    teste: "fghjk",
    opacity:false
  }),
  methods: {
    getLast(source_key:string,manga_key:string) {
      this.$nextTick(()=> {
        ipcRenderer.send('getLastChapter',{source_key,manga_key})
      })
      
    },
    test() {
      this.teste = "dfghjklm"
      console.log("test")
    },
    fetchInfo(source_key:string) {
      const s:any = this.$store.state.sources[source_key]
      Object.values(s.mangas).forEach((e:any) => {
        console.log(s.key,e.key)
        if(e.chapters.length==0) this.getLast(s.key,e.key)
      })
    }
  },
  computed: {
    s() {
      return this.$store.state.sources[this.$route.params.keysource]
    }
  },
  beforeRouteUpdate(to,from,next) {
    
    this.opacity = false
    console.log(this.$store.state.sources[to.params.keysource])
    this.fetchInfo(to.params.keysource)

    setTimeout(()=> {
      this.opacity = true
      next()
    },700)
  },
  
  mounted() {

    setTimeout(()=> this.opacity = true,700)
    console.log('mounted')
    this.fetchInfo(this.$route.params.keysource)
  }
})
</script>
<style>
.my-transition-opacity {
  transition-property: opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;
}
.so-opacity {
  opacity: 1;
}
.no-opacity {
  opacity: 0;
}
</style>

