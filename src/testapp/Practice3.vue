<template lang="pug">
  div#app
    .above-my-content
      adl-header
    //img.is-pulled-left(src="../assets/logo.png")
      br
      h1.title.is-3.has-text-left
        | ADL Forms - Practice 3
        br
        adl-menu

    // Page content
    content-layout-editor.my-content(:editable="editable", :contentId="contentId")

    // Footer
    .below-my-content
      | Page Footer
</template>

<script>
import ADLMenu from './ADLMenu.vue'
import ADLHeader from './ADLHeader.vue'

export default {
  name: 'app',
  components: {
    'adl-menu': ADLMenu,
    'adl-header': ADLHeader,
  },
  data () {
    return {
      editable: true,
      contentId: 'formservice.adl.practice3',

    }
  }
}
</script>

<style lang="scss" scoped>

// Positioning of the footer
$above-content-size: 78;
$below-content-size: 0;

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;

}
.above-my-content {
  height: #{$above-content-size}px;
  padding: 0px;
}
.my-content {
  height: calc(100vh - #{$above-content-size + $below-content-size}px);
}

</style>
