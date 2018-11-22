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
      contentId: 'formservice.adl.AUQLDREPMT24-AbandonmentTerminationNotice',
    }
  }
}
</script>

<style lang="scss" scoped>

$border-color: #eee;


// Positioning of the footer
$above-triple-pane-size: 130;
$below-triple-pane-size: 80;


// Positioning of the footer
$above-triple-pane-size: 100;
$below-triple-pane-size: 80;


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
.above-my-triple-pane {
  // display: block;
  // top: 0px;
  height: #{$above-triple-pane-size}px;
  padding: 0px;
}
.my-triple-pane {
  //height: $a3-footer-size;
  //min-height: calc(100vh - #{$above-triple-pane-size}px);
  height: calc(100vh - #{$above-triple-pane-size + $below-triple-pane-size}px);
}




.my-triple-pane {
  border: solid 1px $border-color;
  //height: 400px;
  // border-top: solid 1px #666;
  // border-bottom: solid 1px #666;
  // border-left: solid 1px #ccc;
  // border-right: solid 1px #ccc;
}

.other-mode {
  font-size: 13px;
}

.my-box {
  display: block;
  border: solid 2px blue;
  width: 200px;
  height: 120px;
  margin-bottom: 10px;
}
</style>
