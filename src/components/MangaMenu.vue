<template>
  <v-menu>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon><slot>mdi-dots-vertical</slot></v-icon>
      </v-btn>
    </template>
    <v-list>
        <v-list-item>
          <v-list-item-title>{{ manga.name }}</v-list-item-title>
        </v-list-item>
        <v-divider/>
        <v-list-item @click="test">
          <v-list-item-content>
            <v-list-item-title>
              Download
            </v-list-item-title>
            <v-list-item-subtitle>
              The last chapter {{ lastChapter }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon>mdi-download</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
  </v-menu>
</template>
<script lang="ts">
import Vue from 'vue'
import { ipcRenderer } from "electron"
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapGetters} = createNamespacedHelpers('download') 
export default Vue.extend({
  name:"MangaMenu",
  props: {
    sourceKey: 
    {
      type: String,
      required: true
    },
    mangaKey: 
    {
      type: String,
      required: true
    }

  },
  data: () => ({
    //manga:0
  }),
  computed: {
    ...mapState(['downloadsState']),
    manga():any {
      return this.$store.getters['getManga'](this.sourceKey,this.mangaKey )
    },
    chapterAvailable():number[] {
      const manga: {
        chapters: {
          [chapter:number]: {
            chapter:number,
            available:boolean
          }
        }
      } = this.manga
      return Object.values(manga.chapters).filter((e) => e.available).map((e)=> e.chapter)
    },
    lastChapter():number {
      try {
        return Math.max(...this.chapterAvailable)
      } catch(e) {
        return -1
      }
    }
  },
  methods : {
    test() {
      ipcRenderer.send('download-chapter', {source_key: this.sourceKey,manga_key: this.mangaKey,chapter:this.lastChapter,process:'mdla'})
    }
  },

  mounted() {
    console.log(Object.keys(this.downloadsState))
  }
  
})
</script>

