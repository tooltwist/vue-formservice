<template lang="pug">

  .sanity-error(@click.stop="selectThisElement")
    template(v-if="!sane_$content")
      | Contentservice has not been installed/initialized.
      br
      | (missing this.$content)
    template(v-else-if="!sane_context_formservice")
      | Please place this field inside a form.
      br
      | (missing this.context.formservice)
</template>

<script>
import ContentMixins from 'vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from 'vue-contentservice/src/mixins/CutAndPasteMixins'
import FormserviceMixins from '../mixins/FormserviceMixins'

export default {
  name: 'formservice-sanity-error',
  mixins: [ FormserviceMixins, CutAndPasteMixins, ContentMixins ],
  // mixins: [ FormserviceMixins ],
  props: {
    element: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  // Used if not in a valid form
  .sanity-error {
    color: red;
    font-family: courier;
    font-size: 11px;
  }
</style>
