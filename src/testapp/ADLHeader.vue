<template lang="pug">
.adl-header
  .bar1
    .my-left-stuff
      img(src="../assets/adlforms/logo.png")
    .my-right-stuff
      | Digital Reign Form Editor
  .bar2
    adl-menu
</template>

<script>
import ADLMenu from './ADLMenu.vue'

export default {
  components: {
    'adl-menu': ADLMenu,
  },
  data: function ( ) {
    return {
      visible: true,
      userAvatar: '',
      isActive: true,
      haveLoginservice: true,
    }
  },
  // props: ["visible"],
  methods: {
    toggleMobileMenu: function ( ) {
    },
    doLogout: function ( ) {

    },
  }

}
</script>

<style lang="scss" scoped>
.adl-header {
  .bar1 {
    background-color: yellow;
    text-align: left;
    height: 53px;
    background-color: #368b92;

    .my-left-stuff {
      display: inline-block;
      position: relative;
      top: 0px;
      height: 53px;
      width: 200px;
      text-align: center;
      background-color: white;
      margin: 0px;
      border-bottom: solid 1px #368b92;
      img {
        // position: relative;
        // top: 10px;
        height: 33px;
        margin-top: 10px;
      }
    }
    .my-right-stuff {
      display: inline-block;
      position: relative;
      top: -11px;
      height: 53px;
      color: white;
      padding-left: 20px;
      font-size: 16px;
      //font-family: 'Avenir', Helvetica, Arial, sans-serif;
    }

  }//- .bar1

  .bar2 {
    height: 25px;
    background-color: #a3cacd;
    text-align: left;
    padding-left: 179px;
    border-bottom: solid 1px #368b92;
  }//- .bar2
}

// .logo-wrapper {
//   display: inline-block;
//   padding-top: 1px;
//   img {
//     height: 53px;
//   }
// }
//
// @media screen and (min-width: 1088px) {
//   .navbar-burger.desktop {
//     display: inline-block;
//     height: 56px;
//     width: 56px;
//     overflow: hidden;
//     background-color: transparent;
//     color: #fff;
//     &:hover {
//       background-color: #368b92;
//     }
//   }
// }
</style>
