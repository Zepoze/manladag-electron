module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  "pluginOptions": {
    electronBuilder: {
      mainProcessWatch: ['src/background.ts', 'src/manladagProcess.ts']
    }
  }
}