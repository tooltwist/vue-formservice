<template lang="pug">

  .c-adl-address(:class="editModeClass")
    span(v-if="extraDebug")
      | &lt;form-label&gt;
      br

    // Debug mode
    .my-design-mode(v-if="isDesignMode", @click.stop="selectThisElement2")
      .c-layout-mode-heading
        edit-bar-icons(:element="element")
        | address - {{absoluteDataPath}}
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
    .my-edit-mode(v-else-if="isEditMode", @click.stop="selectThisElement2")
      .container
        .my-dummy-address
          .valign
            | Address


    // Live mode
    .box.has-text-left(v-else)

      .field.has-addons
        .control
          .button(@click="setManualAddress(false)", :class="manualAddress ? '' : 'is-primary'")
            | Find address
        .control
          .button(@click="setManualAddress(true)", :class="manualAddress ? 'is-primary' : ''")
            | Enter address

      .my-manual-address(v-show="manualAddress")
        // Manual address entry
        .field-body
          .field(style="flex-shrink: 0.1; flex-grow: 0.1;")
            label.label Unit No.
            .control
              input.input(type="text" placeholder="", v-model="a_unitNo")
          .field(style="flex-shrink: 0.1; flex-grow: 0.1;")
            label.label Street No.
            .control
              input.input(type="text", placeholder="", v-model="a_streetNo")
          .field(style="flex-shrink: 4; flex-grow: 4;")
            label.label Street Name
            .control.is-expanded
              input.input(type="text", placeholder="", v-model="a_streetName")

        .field-body
          .field.is-expanded
            label.label Suburb / Locality
            .control.is-expanded
              input.input(type="text" placeholder="", v-model="a_suburb")
          .field(style="flex-shrink: 0.3; flex-grow: 0.3;")
            label.label State
            .control
              //input.input(type="text" placeholder="", v-model="a_state")
              .select
                select(v-model="a_state")
                  option Select a state
                  option NSW
                  option NT
                  option QLD
                  option SA
                  option TAS
                  option VIC
                  option WA
          .field(style="flex-shrink: 0.1; flex-grow: 0.1;")
            label.label Post code
            .control
              input.input(type="number" placeholder="", v-model="a_postcode")

      //.box.has-background-white-ter(v-else)
      .my-autocomplete-address(v-show="!manualAddress")

        // See https://github.com/olefirenko/vue-google-autocomplete
        //vue-google-autocomplete.input(id="map", classname="Zform-control", placeholder="Start typing", v-on:placechanged="getAddressData")

        // See https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform
        .my-address-search(v-show="!manualAddress")
          // Search field
          .field.has-addons
            .control.is-expanded
              // In Chrome 71, having "address" in the placeholder causes chrome's
              // autofill to cover the dropdown list.
              input.input(ref="autocomplete", placeholder="e.g.   12A / 345 Higgins Road Berkville", :autocomplete="mAutocompleteDisabled", :junk="mAutocompleteDisabled")
            .control
              a.button.is-static.is-hidden-touch Search against known addresses

        .field-body
          .field(v-show="a_unitNo", style="flex-shrink: 0.1; flex-grow: 0.1;")
            label.label Unit No.
            .control
              input.input(type="text", disabled, v-model="a_unitNo")
          .field(style="flex-shrink: 0.1; flex-grow: 0.1;")
            label.label Street No.
            .control
              input.input(type="text", disabled, v-model="a_streetNo")
          .field(style="flex-shrink: 4; flex-grow: 4;")
            label.label Street Name
            .control.is-expanded
              input.input(type="text", disabled, v-model="a_streetName")

        .field-body
          .field.is-expanded
            label.label Suburb / Locality
            .control.is-expanded
              input.input(type="text", disabled, v-model="a_suburb")
          .field(style="flex-shrink: 0.3; flex-grow: 0.3;")
            label.label State
            .control
              input.input(type="text", disabled, v-model="a_state")
          .field(style="flex-shrink: 0.1; flex-grow: 0.1;")
            label.label Post code
            .control
              input.input(type="number", disabled, v-model="a_postcode")



      .my-live-mode.label(:style="mInputStyle", :class="mInputClass") {{label}}
</template>

<script>
import ContentMixins from 'vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from 'vue-contentservice/src/mixins/CutAndPasteMixins'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import FormserviceMixins from '../../mixins/FormserviceMixins'
import WidgetMixins from '../../mixins/WidgetMixins'
import EditMixins from '../../mixins/EditMixins'

export default {
  name: 'adl-address',
  components: {
    VueGoogleAutocomplete
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
      autocomplete: null, // Google API Object

      manualAddress: false,

      // Temporary values
      // tmp_unitNo: '',
      // tmp_streetNo: '',
      // tmp_streetName: '',
      // tmp_suburb: '',
      // tmp_state: '',
      // tmp_postcode: '',
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

  },
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


    // // This example displays an address form, using the autocomplete feature
    // // of the Google Places API to help users fill in the information.
    //
    // // This example requires the Places library. Include the libraries=places
    // // parameter when you first load the API. For example:
    // // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
    //
    // var placeSearch, autocomplete;
    // var componentForm = {
    //   street_number: 'short_name',
    //   route: 'long_name',
    //   locality: 'long_name',
    //   administrative_area_level_1: 'short_name',
    //   // country: 'long_name',
    //   postal_code: 'short_name'
    // };
    //
    // function fillInAddress() {
    //   // Get the place details from the autocomplete object.
    //   var place = autocomplete.getPlace();
    //
    //   for (var component in componentForm) {
    //     document.getElementById(component).value = '';
    //     document.getElementById(component).disabled = false;
    //   }
    //
    //   // Get each component of the address from the place details
    //   // and fill the corresponding field on the form.
    //   for (var i = 0; i < place.address_components.length; i++) {
    //     var addressType = place.address_components[i].types[0];
    //     if (componentForm[addressType]) {
    //       var val = place.address_components[i][componentForm[addressType]];
    //       document.getElementById(addressType).value = val;
    //     }
    //   }
    // }
    //
    // // Bias the autocomplete object to the user's geographical location,
    // // as supplied by the browser's 'navigator.geolocation' object.
    // function geolocate() {
    //   if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(function(position) {
    //       var geolocation = {
    //         lat: position.coords.latitude,
    //         lng: position.coords.longitude
    //       };
    //       var circle = new google.maps.Circle({
    //         center: geolocation,
    //         radius: position.coords.accuracy
    //       });
    //       autocomplete.setBounds(circle.getBounds());
    //     });
    //   }
    // }

    fillInAddress: function ( ) {
      console.log(`fillInAddress()`);
      // Get the place details from the autocomplete object.
      let place = this.autocomplete.getPlace();

      console.log(`Place is `, place);

      /*
        place: {
          address_components: [
            {
              long_name: "48"
              short_name: "48"
              types: ["street_number"]
            },
            ...
          ],
          ...
        }
      */

      // let recordPath = '!test1'
      let recordPath = this.context.formservice.dataPath
      console.log(`+++++++++`);
      console.log(`+++++++++`);
      console.log(`+++++++++`);
      console.log(`recordPath=${recordPath}`);
      // this.$formservice.setValue(recordPath, 'Property', { }, Object)
      // recordPath += '.Property'
      // this.$formservice.setValue(recordPath, 'Address_Line', { }, Object)
      // recordPath += '.Address_Line'

      // this.tmp_unitNo: '',

      place.address_components.forEach(component => {
        switch (component.types[0]) {
          case 'street_number':
            let streetNo = component['short_name']
            // this.tmpStreetNo = streetNo
            // let recordPath = this.context.formservice.dataPath
            // console.log(`datavalue.set('streetNo', ${streetNo}`);
            this.a_streetNo = streetNo
            // this.$formservice.setValue(recordPath, 'streetNo', streetNo, String)
            break
          case 'route':
            let street = component['long_name']
            this.a_streetName = street
            // console.error(`**** SETTING STREET NAME TO ${street}`);
            // this.$formservice.setValue(recordPath, 'street', street, String)
            break
          case 'locality':
            let suburb = component['long_name']
            this.a_suburb = suburb
            // this.$formservice.setValue(recordPath, 'suburb', suburb, String)
            break
          case 'administrative_area_level_1':
            let state = component['short_name']
            this.a_state = state
            // this.$formservice.setValue(recordPath, 'state', state, String)
            break
          case 'country':
            let country = component['long_name']
            this.a_country = country
            // this.$formservice.setValue(recordPath, 'country', value, String)
            break
          case 'postal_code':
            let postcode = component['short_name']
            this.a_postcode = postcode
            // this.$formservice.setValue(recordPath, 'postcode', postalcode, String)
            break
        }
      })

      // for (var component in componentForm) {
      //   document.getElementById(component).value = '';
      //   document.getElementById(component).disabled = false;
      // }
      //
      // // Get each component of the address from the place details
      // // and fill the corresponding field on the form.
      // for (var i = 0; i < place.address_components.length; i++) {
      //   var addressType = place.address_components[i].types[0];
      //   if (componentForm[addressType]) {
      //     var val = place.address_components[i][componentForm[addressType]];
      //     document.getElementById(addressType).value = val;
      //   }
      // }

      const maxpos = 9999999
      let search = this.$refs.autocomplete.value
      console.log(`search=${typeof(search)}, ${search}`);
      let pos1 = search.indexOf('/')
      let pos2 = search.indexOf('-')
      if (pos1 < 0) {
        pos1 = maxpos
      }
      if (pos2 < 0) {
        pos2 = maxpos
      }
      let pos = (pos1 < pos2) ? pos1 : pos2
      console.log(`pos1=${pos1}, pos2=${pos2}, pos=${pos}`);
      let unitNo = (pos < search.length) ? search.substring(0, pos) : ''
      // let unitNo2 = (pos < search.length) ? search.substring(0, pos) : '-'
      // console.log(`search=`, search);
      console.log(`unitNo=${unitNo}`);

      this.a_unitNo = unitNo
      // this.$formservice.setValue(recordPath, 'unitNo', unitNo, String)

    },

    setManualAddress: function (isManual) {
      this.manualAddress = isManual
    },

  },

  mounted: function () {
    // console.error(`OOOOOOOOO`);
    // console.error(`OO     OO`);
    // console.error(`OOOOOOOOO`);
    // console.log(`mounted `, this.context);

    // console.log(`AdlAddress.mounted()`);
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    // this.autocomplete = new google.maps.places.Autocomplete(
    //     /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
    //     {types: ['geocode']});

    // let input = document.getElementById('myAddressAutocomplete');
    // console.log(`input is`, input);
    var options = {
      types: ['geocode'],
      componentRestrictions: {country: 'au'}
    };

    // See:
    // https://medium.com/dailyjs/google-places-autocomplete-in-vue-js-350aa934b18d
    // https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform
    this.autocomplete = new google.maps.places.Autocomplete(this.$refs.autocomplete, options);

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    this.autocomplete.addListener('place_changed', this.fillInAddress);
  }
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

  $border-color-default: #ccc;
  $border-color-borderless: #ccc;




  // Used?
  $frame-color: #ffe9d5;
  $text-color: #700;

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

  .my-edit-mode {
    .my-label {
    }
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


  //--------------------------------------------------------------------
  // New stuff
  .c-adl-address {
    //margin-top: 6px;
    margin-bottom: 10px;


    /*
     *  Design mode
     */
    &.c-edit-mode-debug {
      border-left: dashed 2px $frame-color;
      border-bottom: dashed 2px $frame-color;
      border-right: dashed 2px $frame-color;
      padding-bottom: 30px;

      background-color: #f0f0f7;

      &.c-selected {
        //border-color: $c-editbar-color;
        border-color: $c-editbar-color;
      }
    }

    /*
     *  Live mode
     */
    &.c-edit-mode-view {
      margin-top: 8px;
      margin-bottom: 8px;

      label {
        margin-bottom: 1px;
      }

      .my-autocomplete-address {
        .my-address-search {
          .field {
            max-width: 900px;
          }
          input {
            border-color: $border-color-default;
            font-family: $c-input-default-font-family;
            font-weight: $c-input-default-font-weight;
            //font-size: $c-input-default-font-size;
            color: $c-input-default-color;
            background-color: $c-input-default-background-color;
            margin-bottom: 15px;
          }
        }
      }

      .my-manual-address {
        input, select {
          border-color: $border-color-default;
          font-family: $c-input-default-font-family;
          font-weight: $c-input-default-font-weight;
          font-size: $c-input-default-font-size;
          color: $c-input-default-color;
          background-color: $c-input-default-background-color;
          margin-bottom: 15px;
        }
      }
    }//- live mode

  }

</style>
