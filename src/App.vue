<template>
  <v-app>
    <v-navigation-drawer
      app
      right
      :value="drawer && Object.keys(downloadsState).length>0"
    >
      <v-subheader>Processing</v-subheader>
      <v-list>
        <v-scale-transition group leave-absolute>
        <list-item-download-viewver v-for="(n,key,index) in downloadsState" :downloadKey="key" :key="key+index"/>
        </v-scale-transition>
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer
      app
      clipped
      permanent
    >
      <v-fab-transition>
        <v-btn
          v-if="Object.values(downloadsState).length>0"
          color="pink"
          fab
          dark
          small
          absolute
          bottom
          right
          @click="drawer = !drawer"
          class="mb-7"
        >
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </v-fab-transition>
      <v-list dense flat>
        <v-subheader>Sources</v-subheader>
          <v-list-item
            v-for="n in sources"
            :key="n.key"
            active-class="primary"
            link
            :to="`/source/${n.key}`"
          >
            <v-list-item-icon><v-icon>mdi-book</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ n.site }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-spacer />
          <v-list-item to="/">
            HOME
          </v-list-item>
          <v-list-item to="/about">
            ABOUT
          </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-dialog v-model="dialog_processing" persistent max-width="290">
      <v-card>
        <v-card-title>Wait plzzzzzzzzz</v-card-title>
        <v-card-text>
          <v-progress-circular indeterminate/>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-content>
        <router-view @dialog-processing="dialogProcessing"/>
      <v-btn @click="notifyy">gfhj</v-btn>
    </v-content>
    
    <notifications group="foo" position="bottom right" animation-type="velocity">
      <template slot="body" slot-scope="props">
        <v-alert :type="props.item.type" border="left">
          <a class="title">
            {{props.item.title}}
          </a>
          <a class="close" @click="props.close">
            <i class="fa fa-fw fa-close"></i>
          </a>
          <div v-html="props.item.text"></div>
        </v-alert>
      </template>
    </notifications>
    <v-footer app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'
import ListItemDownloadViewver from '@/components/ListItemDownloadViewver.vue'
import { mapState, createNamespacedHelpers } from 'vuex'
import {ipcRenderer,remote} from "electron"

const Velocity = require('velocity-animate')

const mapStateDownload = createNamespacedHelpers('download').mapState

export default Vue.extend({
  name: 'App',

  components: {
    HelloWorld,
    ListItemDownloadViewver
  },

  data: () => ({
    drawer:false,
    model: 1,
    dialog_processing:false,
    test_text: true
  }),
  methods: {
    dialogProcessing(e:boolean) {
      this.dialog_processing = e
    },
    notifyy() {
      ipcRenderer.send('new')
    },
    beforeEnter(el:any) {
      el.style.opacity = 0
      el.style.scale = 0
    },
    beforeLeave(el:any) {
      el.style.opacity = 1
      el.style.scale = 1
    },
    enter(el:HTMLBaseElement, done:any) {
      Velocity(el, { opacity: 1, scale: 1 }, { duration: 300, complete: done })
    },
    leave(el:HTMLBaseElement, done:any) {
      Velocity(el, { opacity: 0, scale: 0 }, { duration: 300, complete: done })
    }
  },
  computed: {
    ...mapState(["sources"]),
    ...mapStateDownload(['downloadsState'])
  },
  mounted() {
    console.log("mounted")
  },
  created() {
    this.$vuetify.theme.dark = true
  }
});
</script>
<style>
/* Les animations d'entrée (« enter ») et de sortie (« leave »)  */
/* peuvent utiliser différentes fonctions de durée et de temps.  */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
