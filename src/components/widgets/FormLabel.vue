<template lang="pug">

  .c-content-formlabel(:class="editModeClass")
    span(v-if="extraDebug")
      | &lt;form-label&gt;
      br

    // Debug mode
    //.my-design-mode(v-if="isDesignMode && false", @click.stop="selectThisElement")
      //.c-layout-mode-heading
        edit-bar-icons(:element="element")
        | label
      .my-label(:style="myStyle", :class="myClass")
        span(v-html="label")

    // Editing
    template(v-if="isDesignMode || isEditMode")
      span.my-label(:style="myStyle", :class="myClass", v-html="label", @click.stop="selectThisElement")

    // Live mode
    template(v-else)
      .my-label(:style="myStyle", :class="myClass", v-html="label")
</template>

<script>
import ContentMixins from 'vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from 'vue-contentservice/src/mixins/CutAndPasteMixins'
import FormserviceMixins from '../../mixins/FormserviceMixins'

export default {
  name: 'form-label',
  props: {
    element: {
      type: Object,
      required: true
    }
  },
  mixins: [ ContentMixins, CutAndPasteMixins, FormserviceMixins ],
  data: function () {
    return {
    }
  },
  computed: {

    label: {
      get () {
        let value = this.element['label']
        // return value ? value : ''
        return value ? convertLabel(value) : ''
      }
    },

    style: {
      get () {
        let value = this.element['style']
        return value ? value : ''
      },
      // set (value) {
      //   this.$content.setProperty({ vm: this, element: this.element, name: 'style', value })
      // }
    },

    myClass: function () {
      if (this.element.placeholder && this.element.placeholder.startsWith('tEntryTime')) {
        console.log(`inputClass()`, this.element);
      }

      var obj = { }
      let classesForElement = this.element['class']
      if (classesForElement) {
        // console.log(`classesForElement=${classesForElement}`);
        classesForElement.split(' ').forEach(clas => {
          // console.log(`-- ${clas}`);
          let classname = clas.trim()
          if (classname) {
            obj[classname] = true
          }
        })
      } else {
        obj['form-label-default'] = true
      }
      if (this.element.placeholder && this.element.placeholder.startsWith('tEntryTime')) {
        console.log(`element=`, this.element);
        console.log(`obj=`, obj)
      }
      return obj
    },

    myStyle: function ( ) {
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
      // console.log(`inputStyle=`, style)
      return style
    },

  },
  methods: {
    labelClass: function (field) {
      console.log(`fieldClass()`, field);

      if (field.classname) {
        return field.classname
      }
      return null
    },

    labelStyle: function (field) {
      console.log(`fieldStyle()`, field);
      // return { }
      return {
        // 'background-color': 'red',
        // color: 'white',
        left: `${field.x}px`,
        top: `${field.y}px`,
      }
    }

  }
}

function convertLabel(v) {
  // Convert the label
  // ^B...^b   (bold)
  // ^I...^i   (italics)
  let label = ''
  while (v) {

    let pos = findFirstString(v, ['^B', '^I'])
    if (pos < 0) {
      label += v
      break
    }

    label += v.substring(0, pos)
    v = v.substring(pos)

    if (v.startsWith('^B')) {
      // Find end of bold section
      let end = v.indexOf('^b')
      if (end >= 0) {
        let boldStuff = v.substring(2, end)
        v = v.substring(end + 2)
        label += `<b>${convertLabel(boldStuff)}</b>`
      } else {
        // No end, ignore this bold
        v = v.substring(2)
      }
    }
    else if (v.startsWith('^I')) {
      // Find end of italic section
      let end = v.indexOf('^i')
      if (end >= 0) {
        let italicStuff = v.substring(2, end)
        v = v.substring(end + 2)
        label += `<i>${convertLabel(italicStuff)}</i>`
      } else {
        // No end, ignore this italics
        v = v.substring(2)
      }
    }
  }
  return label
}


// Find the first matching pattern.
// Returns { pos, pattern }
// Returns { pos:-1, pattern:null } if none found
function findFirstString(string, patterns /*[String]*/) {
  // console.error(`findFirstString(${string})`, patterns);
  let bestPos = -1
  patterns.forEach((pattern) => {
    let pos = string.indexOf(pattern)
    if (pos >= 0 && (bestPos < 0 || pos < bestPos)) {
      // console.error(`- have natch ${pattern}`)
      bestPos = pos
    }
  })
  return bestPos
}
</script>


<style lang="scss" scoped>
  @import '../../assets/css/content-variables.scss';

  .c-content-formlabel {
    $frame-color: lightblue;
    $text-color: darkblue;

    // .c-edit-mode-debug {
    //   border-left: dashed 2px $frame-color;
    //   border-bottom: dashed 2px $frame-color;
    //   border-right: dashed 2px $frame-color;
    //   margin: 1px;
    //
    //   .container {
    //     width: 90% !important;
    //   }
    // }

    .c-layout-mode-heading {
      // This overrides the definition in content-editor.scss
      background-color: $frame-color;
      color: $text-color;
    }


    .c-label {
      position: absolute;
      //background-color: pink;
    }

    .form-label-default {
      //color: #000000;
      color: #333;
      font-family: Arial;
      font-weight: normal;
      font-size: 12px;
      line-height: 130%;
    }

    .form-label-bold-default {
      //color: #000000;
      color: #333;
      font-family: Arial;
      font-weight: bold;
      font-size: 12px;
    }

    /*
     *  Design mode
     */
    &.c-edit-mode-debug {
      .my-label {
        display: block;
        text-align: left;
        border: solid 1px red;
      }
    }

    /*
     *  Edit mode
     */
    &.c-edit-mode-edit {
      .my-label {
        display: block;
        text-align: left;
      }
    }

    /*
     *  Live mode
     */
    &.c-edit-mode-view {
      .my-label {
        display: block;
        text-align: left;
      }
    }
  }
</style>
