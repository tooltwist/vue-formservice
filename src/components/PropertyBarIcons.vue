<template lang="pug">
  .property-bar-icons
    // handle font-awesome 4 and 5
    // Clipboard. See https://www.npmjs.com/package/v-clipboard
    span(v-clipboard="myElementCutToClipboard" v-clipboard:success="clipboardSuccessHandler" v-clipboard:error="clipboardErrorHandler")
      | &nbsp;
      i.fa.fa-cut.fas.fa-cut
      | &nbsp;
    span(v-clipboard="myElementCopyToClipboard" v-clipboard:success="clipboardSuccessHandler" v-clipboard:error="clipboardErrorHandler")
      | &nbsp;
      i.fa.fa-files-o.fas.fa-copy
      | &nbsp;
    span(@click="downloadMyElement")
      | &nbsp;
      i.fa.fa-download.fas.fa-download
      | &nbsp;
    span(@click="deleteMyElement")
      | &nbsp;
      i.fa.fa-trash-o.fas.fa-trash-alt
      | &nbsp;
</template>

<script>
import PropertyMixins from 'vue-contentservice/src/mixins/PropertyMixins'
import CutAndPasteMixins from 'vue-contentservice/src/mixins/CutAndPasteMixins'

export default {
  name: 'property-bar-icons',
  mixins: [ PropertyMixins, CutAndPasteMixins ],
  props: {
    element: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .property-bar-icons {
    margin-top: 2px;
    position: absolute;
    // float: right;
    right: 3px;
    cursor: pointer;
    font-size: 10px;
  }
</style>
