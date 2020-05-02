<template>
<transition
        v-on:before-enter="beforeEnter"
        v-on:before-leave="beforeLeave"
        v-on:enter="enter"
        v-on:leave="leave"
        v-bind:css="false"
      >
  <v-tooltip left>
    <template v-slot:activator="{on }">
      <v-list-item>
        <v-list-item-icon>
          <v-progress-circular v-if="downloadState.state == 0" indeterminate />
          <v-icon v-else-if="downloadState.state == 2">mdi-download</v-icon>
          <v-btn icon v-else-if="downloadState.state == 3" @click="suppr()">
            <v-icon>mdi-window-close</v-icon>
          </v-btn>
        </v-list-item-icon>
        <v-list-item-content v-on="on">
          <v-list-item-title class="mb-3 primary--text" > {{ manga.name }} {{ downloadState.chapter }}</v-list-item-title>
          <v-progress-linear v-if="downloadState.numberPage" :value="(downloadState.numberPageDownloaded/downloadState.numberPage)*100"/>
          <v-spacer/>
          <v-list-item-subtitle v-if="downloadState.state >0 && downloadState.state<4">{{ downloadState.numberPageDownloaded }}/{{ downloadState.numberPage }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
    <span>Download chapter {{ downloadState.chapter }} of {{ manga.name }} on {{ source.site }} </span>
  </v-tooltip>
</transition>
</template>
<script lang="ts">
import Vue from 'vue'
import { createNamespacedHelpers, mapGetters } from 'vuex'
import downloadChapter from '@/store/downloadChapter';
const downloadStoreModule = createNamespacedHelpers('download')


const Velocity = require('velocity-animate')


export default Vue.extend({
  props: {
    downloadKey:{
      type: String,
      required: true
    }
  },
  computed: {
    ...downloadStoreModule.mapGetters(['getDownloadState']),
    ...mapGetters(['getManga','getSource']),
    downloadState():downloadsState {
      return this.getDownloadState(this.downloadKey)
    },
    manga():sourceRender['mangas'] {
      return this.getManga(this.downloadState.source_key,this.downloadState.manga_key)
    },
    source():sourceRender {
      return this.getSource(this.downloadState.source_key)
    }
  },
  methods: {
    ...downloadStoreModule.mapMutations(['delete']),
    suppr() {
      this.delete(this.downloadKey)
    },
    beforeEnter(el:HTMLBaseElement) {
      el.style.marginLeft = '100'
    },
    beforeLeave(el:any) {
    },
    enter(el:HTMLBaseElement, done:any) {
      Velocity(el, { marginLeft: 1 }, { duration: 300, complete: done })
    },
    leave(el:HTMLBaseElement, done:any) {
      Velocity(el, { marginLeft:30 }, { duration: 300, complete: done })
    }
  }
})
</script>

