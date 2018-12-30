<template lang="pug">

  .c-adl-inspection-areas(:class="editModeClass")
    span(v-if="extraDebug")
      | &lt;form-label&gt;
      br

    // Debug mode
    .my-design-mode(v-if="isDesignMode && false", @click.stop="selectThisElement2")
      .c-layout-mode-heading
        edit-bar-icons(:element="element")
        | inspection areas - {{absoluteDataPath}}
      .container
        //.label(:style="myStyle", :class="myClass") {{label}}
        .my-dummy-address.has-text-left
          .field-body
            .field(style="flex-shrink: 0.1; flex-grow: 0.1;")
              label.label Unit No.
              .control
                input.input(type="text", disabled)
            .field(style="flex-shrink: 0.1; flex-grow: 0.1;")
              label.label Street No.
              .control
                input.input(type="text", disabled)
            .field(style="flex-shrink: 4; flex-grow: 4;")
              label.label Street Name
              .control.is-expanded
                input.input(type="text", disabled)
          .field-body
            .field.is-expanded
              label.label Suburb / Locality
              .control.is-expanded
                input.input(type="text", disabled)
            .field(style="flex-shrink: 0.3; flex-grow: 0.3;")
              label.label State
              .control
                input.input(type="text", disabled)
            .field(style="flex-shrink: 0.1; flex-grow: 0.1;")
              label.label Post code
              .control
                input.input(type="number", disabled)

    // Editing
    .my-edit-mode(v-else-if="isDesignMode || isEditMode", @click.stop="selectThisElement2")
      //.container
      .my-inspection-areas
        .valign
          | Inspection Areas


    // Live mode
    .has-text-left(v-else)
      // Accordians
      // See https://siongui.github.io/2018/01/29/css-only-bulma-accordion-collapsible-content/
      input(type="radio" id="panel-close" name="accordion-select")
      input(v-for="(area, index) in cAreas.areas" type="radio" :id="`panel-${index}`" name="accordion-select")

      //button.button.is-outline(for="panel-close") Close Areas
      //br
      //br
      .panel.my-close-panel
        label.panel-heading.has-text-centered(for="panel-close") close areas
        //.panel-block.body-close
        //  Content Body Close
      .panel.my-area-panel(v-for="(area, index) in cAreas.areas")
        label.panel-heading(:for="`panel-${index}`")
          | {{area.name}}
        .panel-block(:class="`body-${index}`")
          //Content.is-fullwidth
          table.table.is-fullwidth
            tbody
              tr(v-for="inclusion in area.inclusions")
                td
                  .my-inclusion-name {{inclusion.name}}
                  .my-inclusion-description {{inclusion.description}}
                td
                  | N S U
                td
                  .is-pulled-right
                    button.button.my-inclusion-button.is-small.is-rounded.is-info Add photos
                    br
                    button.button.my-inclusion-button.is-small.is-rounded.is-primary Delete inclusion
</template>

<script>
import ContentMixins from 'vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from 'vue-contentservice/src/mixins/CutAndPasteMixins'
import FormserviceMixins from '../../mixins/FormserviceMixins'
import WidgetMixins from '../../mixins/WidgetMixins'
import EditMixins from '../../mixins/EditMixins'

export default {
  name: 'adl-address',
  components: {
  },
  props: {
    element: {
      type: Object,
      required: true
    },

    context: {
      type: Object,
      required: true
    }
  },
  // mixins: [ WidgetMixins, FormserviceMixins, EditMixins ],
  mixins: [ WidgetMixins, ContentMixins, CutAndPasteMixins, FormserviceMixins, EditMixins ],
  data: function () {
    return {

    }
  },
  computed: {

    absoluteDataPath: function ( ) {
      let dataset = this.element['record']
      return this.mAbsolutePath(dataset)
    },

    label: {
      get () {
        let value = this.element['label']
        return value ? value : ''
      },
      // set (value) {
      //   this.$content.setProperty({ vm: this, element: this.element, name: 'label', value })
      // }
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

    a_unitNo: twoWayComputedAddressData('unitNo'),
    a_streetNo: twoWayComputedAddressData('streetNo'),
    a_streetName: twoWayComputedAddressData('streetName'),
    a_suburb: twoWayComputedAddressData('suburb'),
    a_state: twoWayComputedAddressData('state'),
    a_postcode: twoWayComputedAddressData('postcode'),
    a_country: twoWayComputedAddressData('country'),

    // myClass: function () {
    //   if (this.element.placeholder && this.element.placeholder.startsWith('tEntryTime')) {
    //     console.log(`inputClass()`, this.element);
    //   }
    //
    //   var obj = { }
    //   let classesForElement = this.element['class']
    //   if (classesForElement) {
    //     // console.log(`classesForElement=${classesForElement}`);
    //     classesForElement.split(' ').forEach(clas => {
    //       // console.log(`-- ${clas}`);
    //       let classname = clas.trim()
    //       if (classname) {
    //         obj[classname] = true
    //       }
    //     })
    //   } else {
    //     obj['form-label-default'] = true
    //   }
    //   if (this.element.placeholder && this.element.placeholder.startsWith('tEntryTime')) {
    //     console.log(`element=`, this.element);
    //     console.log(`obj=`, obj)
    //   }
    //   return obj
    // },
    //
    // myStyle: function ( ) {
    //   let style = this.element['style'] + ';'
    //   // width
    //   try {
    //     let num = parseInt(this.element['width'])
    //     if (num >= 20) {
    //       style += `width:${num}px;`
    //     }
    //   } catch (e) { }
    //
    //   // height
    //   try {
    //     let num = parseInt(this.element['height'])
    //     if (num >= 20) {
    //       style += `height:${num}px;`
    //     }
    //   } catch (e) { }
    //   // console.log(`inputStyle=`, style)
    //   return style
    // },

    cAreas: function ( ) {

      return {
        areas: [
          {
            name: 'Exterior',
            inclusions: [
              {
                name: 'Grounds / Gardens',
                description: 'Lorem Ipsum dolor sit amet, consectitur adipeolla soilim',
                status: 'satisfactory'
              },
              {
                name: 'Guttering / Downpipes',
                description: 'Lorem Ipsum dolor sit amet, consectitur adipeolla soilim',
                status: 'satisfactory'
              },
              {
                name: 'Walls / Windows / Doors',
                description: 'Lorem Ipsum dolor sit amet, consectitur adipeolla soilim',
                status: 'satisfactory'
              },
              {
                name: 'Eaves / Fascias',
                description: 'Lorem Ipsum dolor sit amet, consectitur adipeolla soilim',
                status: 'satisfactory'
              },
              {
                name: 'Gates / Fences',
                description: 'Lorem Ipsum dolor sit amet, consectitur adipeolla soilim',
                status: 'satisfactory'
              },
            ]
          },
          {
            name: 'Master Bedroom',
            inclusions: [
              {
                name: 'Curtains',
                description: 'Lorem Ipsum dolor sit amet, consectitur adipeolla soilim',
                status: 'satisfactory'
              },
              {
                name: 'Carpet',
                description: 'Lorem Ipsum dolor sit amet, consectitur adipeolla soilim',
                status: 'unsatisfactory'
              },
            ]
          }
        ] //- areas
      }

      // let attribute = this.element['attribute']
      // let dataset = this.element.dataset
      // // console.log(`dataset is ${dataset}`, this);
      // if (dataset) {
      //   let { data, error } = this.$formservice.find({vm: this, path: dataset})
      //   // console.error(`${dataset}=`, data)
      //   // console.error(`error=`, error)
      //   if (error) {
      //     console.error(`Dropdown for '${attribute}' (dataset=${dataset}): `, error)
      //     return [ ]
      //   }
      //   return data
      // }
      // console.error(`Property 'dataset' not set for Dropdown '${attribute}'`);
      // return [ ]
    },//- options

  },//- computed

  methods: {
    selectThisElement2: function () {
      console.log(`selectThisElement2() IN LABEL`, this.element)
      return this.selectThisElement()
    },

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
    },

    getAddressData: function ( ) {
      console.log(`getAddressData()`);
    },

    attributeAbsolutePath (attribute) {
      let record = this.element['record']
      // console.log(`record=${record}`)
      // console.log(`attribute=${attribute}`);
      let relativePath = attribute
      if (record) {
        relativePath = `${record}.${attribute}`
      }
      let path = this.mAbsolutePath(relativePath)
      // console.error(`path=${path}`);
      return path
    },




  },//- methods

}

function twoWayComputedAddressData(attribute) {

  return {
    get () {
      // console.error(`!!!!!!!!!!`);
      // console.error(`!!!!!!!!!!`);
      // console.error(`!!!!!!!!!!`);
      // console.log(`twoWayComputedAddressData.get(${attribute})`);

      // let record = this.element['record']
      // console.log(`record=${record}`)
      // console.log(`attribute=${attribute}`);
      //
      // let relativePath = attribute
      // if (record) {
      //   relativePath = `${record}.${attribute}`
      // }

      let {error, data} = this.$formservice.find({
        vm: this,
        // operation: 'find',
        path: this.attributeAbsolutePath(attribute),
        // updatePath: false,
        // value: [ ],
        debug: false
      })

      if (error && error !== 'NOTFOUND') {
        console.error(`Error: ${error}`);
        return null
      }
      // console.log(`  data is`, data);
      return data
    },
    set (value) {
      console.log(`twoWayComputedAddressData.set(${attribute}, ${value})`);
      let {error, data} = this.$formservice.save({
        vm: this,
        // operation: 'save',
        path: this.attributeAbsolutePath(attribute),
        updatePath: true,
        value: value,
        debug: false
      })
      if (error) {
        console.error(`Error: ${error}`);
        return null
      }
    }
  }
}//- twoWayComputedAddressData

</script>


<style lang="scss" scoped>
  @import '../../assets/css/content-variables.scss';

  $bg-default: #ffffe0;
  $border-color-default: #ccc;

  $bg-borderless: #ffff00;
  $border-color-borderless: #ccc;

  $frame-color: lightblue;
  $text-color: darkblue;
  $dummy-color: lightblue;
  $c-editbar-color: lightblue;

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

  .c-adl-inspection-areas {

    /*
     *  Design mode
     */
    &.c-edit-mode-debug {
      border-top: $c-input-layout-border-color-1;
      border-left: $c-input-layout-border-color-1;
      background-color: $c-input-layout-frame-color;
      border-bottom: $c-input-layout-border-color-2;
      border-right: $c-input-layout-border-color-2;

      padding-left: 2px;
      padding-right: 2px;
      margin: 1px;

      // background-color: #f0f0f7;

      // .c-layout-mode-heading {
      //   // This overrides the definition in content-editor.scss
      //   background-color: $frame-color;
      //   color: $text-color;
      // }

      &.c-selected {
        //border-color: $c-editbar-color;
        border-color: $c-editbar-color;
      }
    }//- design mode

    /*
     *  Edit mode
     */
    &.c-edit-mode-edit {

      .my-inspection-areas {
        border: solid 1px #d0d0d0;
        background-color: #f0f0f0;
        height: 350px;
        padding-top: 18px;
        padding-left: 30px;
        font-size: 24px;
        text-align: left;
        color: #aaa;
      }

      input.form-input-default {
        border-color: $border-color-default;
        font-family: $c-input-default-font-family;
        font-weight: $c-input-default-font-weight;
        font-size: $c-input-default-font-size;
        color: $c-input-default-color;
        //background-color: $c-input-default-background-color;
      }
      // &.form-input-borderless {
      //   input {
      //     border: dashed 1px $border-color-borderless;
      //     box-shadow: none;
      //   }
      // }
    }//- edit mode

    /*
     *  Live mode
     */
    &.c-edit-mode-view {

      .my-close-panel {
        //text-align: left;
        label {
          background-color: #fff;
        }
        margin-bottom: 5px;
      }

      .my-area-panel {
        margin-bottom: 5px;

        .my-area-name {

        }
        .my-inclusion-name {
          font-weight: bold;
        }
        .my-inclusion-description {
          font-size: 12px;
        }
        .my-inclusion-button {
          float: right;
          margin-bottom: 2px;
        }
      }




      input[name="accordion-select"], .panel-block {
        display: none;
      }
      label.panel-heading {
        cursor: pointer;
        display: block;
      }

      /* the magic */
      #panel-0:checked ~ .panel > .body-0,
      #panel-1:checked ~ .panel > .body-1,
      #panel-2:checked ~ .panel > .body-2,
      #panel-3:checked ~ .panel > .body-3,
      #panel-4:checked ~ .panel > .body-4,
      #panel-5:checked ~ .panel > .body-5,
      #panel-6:checked ~ .panel > .body-6,
      #panel-7:checked ~ .panel > .body-7,
      #panel-8:checked ~ .panel > .body-8,
      #panel-9:checked ~ .panel > .body-9,
      #panel-10:checked ~ .panel > .body-10,
      #panel-11:checked ~ .panel > .body-11,
      #panel-12:checked ~ .panel > .body-12,
      #panel-13:checked ~ .panel > .body-13,
      #panel-14:checked ~ .panel > .body-14,
      #panel-15:checked ~ .panel > .body-15,
      #panel-16:checked ~ .panel > .body-16,
      #panel-17:checked ~ .panel > .body-17,
      #panel-18:checked ~ .panel > .body-18,
      #panel-19:checked ~ .panel > .body-19,
      #panel-20:checked ~ .panel > .body-20 {
        display: flex;
      }

    }//- live mode
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
    font-size: 9px;
  }

  .form-label-bold-default {
    //color: #000000;
    color: #333;
    font-family: Arial;
    font-weight: bold;
    font-size: 9px;
  }

//form-checkbox-bold-default

  // .my-edit-mode {
  //   .my-label {
  //   }
  //   border: solid 1px #ccc;
  //   background-color: #f0f0f0;
  //   height: 120px;
  //   padding: 0px;
  //   //font-size: 30px;
  //   //font-family: Arial;
  //
  //   .valign {
  //     position: relative;
  //     text-align: left;
  //     margin-top: 25px;
  //     //margin-left: 25px;
  //     // top: 120px;
  //     font-size: 1.5em;
  //     font-family: Arial;
  //     font-weight: lighter;
  //     color: #a0a0a0;
  //
  //     .modeDescription {
  //       font-size: 16px;
  //     }
  //     .modeError {
  //       font-size: 20px;
  //       color: $c-editbar-color;
  //       font-weight: bold;
  //       font-style: italic;
  //     }
  //   }
  // }

  .my-dummy-addressZ {
    border: solid 1px #ccc;
    background-color: #f0f0f0;
    height: 120px;
    padding: 0px;
    //font-size: 30px;
    //font-family: Arial;

    .valign {
      position: relative;
      text-align: left;
      margin-top: 25px;
      //margin-left: 25px;
      // top: 120px;
      font-size: 1.5em;
      font-family: Arial;
      font-weight: lighter;
      color: #a0a0a0;

      .modeDescription {
        font-size: 16px;
      }
      .modeError {
        font-size: 20px;
        color: $c-editbar-color;
        font-weight: bold;
        font-style: italic;
      }
    }
  }

  .my-design-mode {
    .my-label {
    }
    label {
      color: $dummy-color;
    }
  }

  .my-live-mode {
    .my-label {
    }
  }

</style>
