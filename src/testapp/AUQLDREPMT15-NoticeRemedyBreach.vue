<template lang="pug">
  div#app
    img.is-pulled-left(src="../assets/logo.png")
    br
    h1.title.is-3.has-text-left
      | ADL Forms
      br
      adl-menu

    // Page content
    content-layout-editor.my-triple-pane(:editable="editable", :contentId="contentId")

    // Footer
    | Page Footer
</template>



<script>
import ADLMenu from './ADLMenu.vue'

export default {
  name: 'app',
  components: {
    'adl-menu': ADLMenu
  },
  data () {
    return {
      editable: true,
      contentId: 'formservice.adl.AUQLDREPMT15-NoticeRemedyBreach',
    }
  }
}
</script>



<style lang="scss" scoped>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;

  img {
    margin: 10px;
    height: 80px;
    float: left;
  }
}
</style>
