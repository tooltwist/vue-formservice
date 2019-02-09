<template lang="pug">
  div#app
    .above-my-content
      adl-header
    //img.is-pulled-left(src="../assets/logo.png")
      br
      h1.title.is-3.has-text-left
        | ADL Forms - Practice 5
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
import axios from 'axios'
import axiosError from '../lib/axiosError.js'

export default {
  name: 'app',
  components: {
    'adl-menu': ADLMenu,
    'adl-header': ADLHeader,
  },
  data () {
    return {
      editable: true,
      contentId: 'formservice.adl.pdf1',

    }
  },
  methods: {
    patchAddress: function (address) {
      console.error(`patchAddress:`, address);

      // Line 1
      address.line1 = ''
      if (address.unitNo) {
        address.line1 += `${address.unitNo}/`
      }
      address.line1 += `${address.streetNo} ${address.streetName}`

      // Line 2
      address.line2 = `${address.suburb} ${address.state}`

      // Single line address
      address.singleLine = ''
      if (address.unitNo) {
        address.singleLine += `${address.unitNo}/`
      }
      address.singleLine += `${address.streetNo} ${address.streetName},`
      address.singleLine += ` ${address.suburb} ${address.state}`
    }
  },
  created: function ( ) {
    console.error(`LOAD IT UP`);
    // , @click.stop="selectThisElement2"
    let url = `http://127.0.0.1:4000/api2/APIKEY/1.0/AU_QLD_RE_PM_T24/abandon-term-notice-SQ75833ZN8S`
    // let params = { param1, param2 }
    axios({
      method: 'get',
      url,
      headers: {
        // 'Authorization': 'Bearer ' + this.loginservice.jwt,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // data: params
    })
      .then(response => {
        // JSON responses are automatically parsed.
        console.log(`RESPONSE IS`, response.data)
        let path = `!adlform.abandon`
        let data = response.data.inspectionReport

        // Patch the data
        this.patchAddress(data.rentalAddress)
        this.patchAddress(data.issuerAddress)


        this.$formservice.save({ vm: this, path, updatePath: true, value: data, debug: false })
      })
      .catch(e => {
        axiosError(this, url, { }, e)
        // reject(e)
      })

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
