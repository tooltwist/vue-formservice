<template lang="pug">

  .c-responsive-form(:class="editModeClass")
    //.content-section(v-bind:class="[(pageEditMode=='debug') ? 'my-outline' : '']")

    // Debug mode
    .my-design-mode(v-if="isDesignMode", v-on:click.stop="mSelectMe")
      .c-layout-mode-heading
        edit-bar-icons(:element="element")
        | form - {{absoluteDataPath}}
      div
        content-children.my-content(:element="element", :context="newContext")

    // Edit mode
    .my-edit-mode(v-else-if="isEditMode", @click.stop="mSelectMe")
      //.section.section(v-else-if="pageEditMode==='edit'", v-on:click.stop="mSelectMe")
      content-children(:element="element", :context="newContext")

    // Live
    template(v-else)
      form(autocomplete="false")
        input(type="hidden" autocomplete="false")
        content-children(:element="element", :context="newContext")
        | {{dummyActualValue}}
</template>

<script>
import ContentMixins from 'vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from 'vue-contentservice/src/mixins/CutAndPasteMixins'
import EditMixins from '../../mixins/EditMixins'
import FormserviceMixins from '../../mixins/FormserviceMixins'

export default {
  name: 'responsive-form',
  props: {

    // This element describes the layouts
    // (not the record being edited)
    element: {
      type: Object,
      required: true
    },

    // The context provides a means for a container to pass information down to
    // the elements it's contains, to provide elements context within the
    // hierarchy of elements. Why?
    // During editing there can only be one currently-being-edited layout,
    // and the store provides context about the single element being editing.
    // During normal rendering there may be multiple layouts on a page, but
    // the store only saves a single state, so the store cannot be used.
    // In cases where a container and it's children need to know a bit about
    // each other, this context can contain that non-editing-related context.
    context: {
      type: Object,
      required: true
    },
  },
  mixins: [ ContentMixins, CutAndPasteMixins, EditMixins, FormserviceMixins ],

  computed: {

    absoluteDataPath: function ( ) {
      let dataset = this.element['dataset']
      return this.mAbsolutePath(dataset)
    },

    //  Our form will need it's own context object cloned
    //  from the context we received, but with extra information.
    newContext: {
      get () {
        // console.error(`******* newContext(): old=`, this.context);

        if (this.context && this.context.formservice) {
          // console.log(`- need to clone existing context`)

          // This is a form inside a form
          // Dataset is inherited if not overridden
          let parentFormservice = this.context.formservice

          let newContext = this.cloneContextZZZ(this.context)
          newContext.name = this.element['name'] ? this.element['name'] : ''
          newContext.dataPath = this.absoluteDataPath,
          newContext.parentFormservice = this.context.formservice
          // console.error(`WAAA WAAA WAAA`);
          // console.error(`WAAA WAAA WAAA`);
          // console.log(`new context is`, newContext);
          return newContext

        } else {

          // Not a form inside a form
          // console.log(`- need an initial context`)

          // Create the context for the fields within this form.
          let newContext = { }
          let name = this.element['name']
          let dataset = this.element['dataset']
          let dataPath = (dataset) ? `${dataset}` : '!mock'
          newContext.formservice = {
            name,
            // dataset,
            dataPath,
            parentFormservice: null
          }
          // console.log(`new context is`, newContext);
          return newContext
        }
      } // - newContext.get
    }, //- newContext

    name: {
      get () {
        let value = this.element['name']
        return value ? value : ''
      }
    },

    dataset: {
      get () {
        let value = this.element['dataset']
        return value ? value : ''
      }
    },

    boxStyle: function ( ) {
      let style = this.element['style'] + ';'
      // width
      try {
        let num = parseInt(this.element['width'])
        if (num >= 20) {
          style += `width:${num}px;`
        }
      } catch (e) { }

      // height
      try {
        let num = parseInt(this.element['height'])
        if (num >= 20) {
          style += `height:${num}px;`
        }
      } catch (e) { }
      // console.log(`boxStyle=`, style)
      return style
    },

    // This function does not actually return anything useful.
    // It's purpose is to access the object this form accesses,
    // so that it's created if it does not already exist.
    dummyActualValue: function ( ) {
      console.log(`dummyActualValue()`);
      return ''
    }
  },//- computed

  methods: {
    cloneContextZZZ (context) {
      return { }
    },
  },//- methods

  created: function () {

    // Sanity check
    if (!this.$content) {
      console.error(`ContentFromservice.created(): this.$content not defined: has ContentService been initialised?`);
      this.sane = false
      return
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/css/content-variables.scss';

  $frame-color: lightblue;
  $text-color: blue;

  .c-layout-mode-heading {
    // This overrides the definition in content-editor.scss
    background-color: $frame-color;
    color: $text-color;
  }

  .c-edit-mode-debug {
    border-left: dashed 2px $frame-color;
    border-bottom: dashed 2px $frame-color;
    border-right: dashed 2px $frame-color;
    margin: 1px;

    background-color: #f0f0f7;

    &.c-selected {
      //border-color: $c-editbar-color;
      border-color: $c-editbar-color;
    }
  }

  .my-content {
    background-color: white;
  }
</style>
