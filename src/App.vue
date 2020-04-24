<template>
  <v-app>
    <v-navigation-drawer
      app
      v-model="drawer"
      clipped
    >
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

    <v-app-bar
      app
      clipped-left
      color="primary"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-content>
        <router-view />
    </v-content>

    <v-footer app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import { mapState } from 'vuex'
import {ipcRenderer,remote} from "electron"

export default Vue.extend({
  name: 'App',

  components: {
    HelloWorld,
  },

  data: () => ({
    drawer:false,
    model: 1
  }),
  computed: {
    ...mapState(["sources"])
  },
  mounted() {
    
    ipcRenderer.on('chapterAvailable',(event,args) => {
      this.$nextTick(()=> {
        this.$store.commit('addAvailableChapter',args)
      })
    })
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
