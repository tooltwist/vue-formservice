<template lang="pug">
  div#app
    img.is-pulled-left(src="../assets/logo.png")
    br
    h1.title.is-3.has-text-left
      | Standalone Widget
      br
      a.other-mode(href="/in-layout") Use this widget in a layout

    hr
    content-whatever(:element="{ myProperty: 'Hello' }")
    hr
</template>

<script>

export default {
  name: 'app',
  components: {
    //HelloWorld
  },
  data () {
    return {
      // NEW
      leftPane: true,
      editable: true,
      anchor: 'mbc.test.layout',
      /*
      editable: Boolean,
      anchor: {
        required: false,
        type: String
      },
      layout: {
        required: false,
        type: Object
      }
      */



      // OLD
      editcontext: {
        showLeftPane: false,
        pageEditMode: 'view'
      },

      typeN: 'crowdhound',
      anchorN: 'mbc.test.layout',

      contentdata: { },

      layoutZ: [
        {
          type: 'section',
          children: [
            {
                "type": "froala",
                "text": "<h1><span style=\"font-size: 48px;\">$ Cost of Time</span></h1>",
                "id": 1664717185,
                "children": []
            }
          ]
        },
        {
          type: 'section',
          'padding-top': '0px',
          // 'padding-bottom': '50px',
          // 'padding-right': '250px',
          // 'background-color': 'cyan',
          children: [
            {
              type: 'container',
              mode: 'hero',
              children: [
                {
                  type: 'text',
                  text: 'Here we have some small purple text.',
                  'font-size': '12px',
                  'color': 'purple'
                }
              ]
            },
          ]
        }
      ] // layoutZ
    }
  },
  created() {
    console.log('this.$store: ', this.$store);
  },
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

.other-mode {
  font-size: 13px;
}
</style>
