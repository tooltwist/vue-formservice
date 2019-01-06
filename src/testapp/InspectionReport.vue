<template lang="pug">
  div#app
    .above-my-content
      adl-header
    //br
    //hr
    //.my-header
      //img.is-pulled-left(src="../assets/logo.png")
      img.is-pulled-left(src="../assets/adlforms/logo.png")
      br
      h1.title.is-3.has-text-left
        | ADL Forms - Inspection Report
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
      contentId: 'formservice.adl.inspectionReport',

    }
  }
}
</script>

<style lang="scss" scoped>
//$border-color: #eee;

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

// .other-mode {
//   font-size: 13px;
// }
//
// .my-box {
//   display: block;
//   border: solid 2px blue;
//   width: 200px;
//   height: 120px;
//   margin-bottom: 10px;
// }
</style>
