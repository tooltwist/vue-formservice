<template lang="pug">

  //div(style="background-color:red")
  .c-form-line(:class="editModeClass", :style="componentStyle")
    span(v-if="extraDebug")
      | &lt;form-line&gt;
      br

    // Editing
    template(v-if="isDesignMode || isEditMode")
      svg.my-svg-edit.highlight-when-selected(:style="svgStyle", :viewBox="viewBox", xmlns="http://www.w3.org/2000/svg", @click.stop="selectThisElement")
        line(v-if="lineType==='dotted'", x1="0", y1="0", :x2="width", :y2="height", :stroke="lineColor", stroke-dasharray="2", :stroke-width="lineWidth")
        line(v-else-if="lineType==='dashed'", x1="0", y1="0", :x2="width", :y2="height", :stroke="lineColor", stroke-dasharray="4 1", :stroke-width="lineWidth")
        line(v-else, x1="0", y1="0", :x2="width", :y2="height", :stroke="lineColor", :stroke-width="lineWidth")
        //line(v-else, x1="1", y1="1", :x2="9", :y2="9", stroke="black", :stroke-width="lineWidth")
        //line(v-else, :style="lineStyle", x1="3", y1="0", :x2="width", :y2="height")

    // Live mode
    template(v-else)
      svg.my-svg-live(:style="svgStyle", :viewBox="viewBox", xmlns="http://www.w3.org/2000/svg")
        line(v-if="lineType==='dotted'", x1="0", y1="0", :x2="width", :y2="height", :stroke="lineColor", stroke-dasharray="2", :stroke-width="lineWidth")
        line(v-else-if="lineType==='dashed'", x1="0", y1="0", :x2="width", :y2="height", :stroke="lineColor", stroke-dasharray="4 1", :stroke-width="lineWidth")
        //line(v-else, x1="0", y1="0", :x2="width", :y2="height", :stroke="lineColor", :stroke-width="lineWidth")
        //line(v-else, x1="1", y1="1", :x2="9", :y2="9", stroke="black", :stroke-width="lineWidth")
        line(v-else, x1="0", y1="0", :x2="width", :y2="height", :style="`stroke:${lineColor};stroke-width:${lineWidth};`", stroke-linecap="round")
        //line(v-else, x1="0", y1="0", :x2="width", :y2="height", :style="`stroke:rgb(255,0,0);stroke-width:2;`")
</template>

<script>
import ContentMixins from '@tooltwist/vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from '@tooltwist/vue-contentservice/src/mixins/CutAndPasteMixins'
import FormserviceMixins from '../../mixins/FormserviceMixins'

export default {
  name: 'form-line',
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

    style: {
      get () {
        let value = this.element['style']
        return value ? value : ''
      },
      // set (value) {
      //   this.$content.setProperty({ vm: this, element: this.element, name: 'style', value })
      // }
    },

    x: function () {
      let value = this.element['x']
      return value ? value : 0
    },

    y: function () {
      let value = this.element['y']
      return value ? value : 0
    },

    width: function () {
      let value = this.element['width']
      console.log(`SLOB ${value}, ${typeof(value)}`);
      if (typeof(value) === 'string') {
        console.log(`SLOC is STRING`);
        value = parseInt(value)
        if (isNaN(value)) {
          value = 20
        }
      }
      console.log(`SLOD ${value}, ${typeof(value)}`);
      return value
    },

    height: function () {
      let value = this.element['height']
      if (typeof(value) === 'string') {
        value = parseInt(value)
        if (isNaN(value)) {
          value = 20
        }
      }
      return value
    },

    lineType: function () {
      let value = this.element['lineType']
      switch (value) {
        case 'dotted':
        case 'dashed':
          return value
        default:
          return 'solid'
      }
    },

    lineColor: function () {
      // return '#8f8f8f'
      let value = this.element['lineColor']
      return value ? value : 'black'
    },

    lineWidth: function () {
      //return 1
      let value = this.element['lineWidth']
      let lineWidth = 1
      if (typeof(value) === 'string') {
        let num = parseInt(value)
        if (!isNaN(num) && num > 0) {
          lineWidth = num
        }
      }
      return lineWidth
    },

    componentStyle: function ( ) {
      // return {
      //   width: this.lineWidth + this.width + this.lineWidth,
      //   height: this.lineWidth + this.height + this.lineWidth,
      // }
      const w = this.lineWidth + this.width + this.lineWidth
      const h = this.lineWidth + this.height + this.lineWidth
      return `position:relative; top:0px; left:0px; width:${w}px; height:${h}px;`
    },

    svgStyle: function ( ) {
      const top = -this.lineWidth
      const left = -this.lineWidth
      const w = this.lineWidth + this.width + this.lineWidth
      const h = this.lineWidth + this.height + this.lineWidth
      console.log(`&& svgStyle(${this.lineWidth} + ${this.width} + ${this.lineWidth})`);
      return `position:absolute;top:${top};left:${left};width:${w}px;height:${h}px;`
    },

    lineStyle: function ( ) {
      return `stroke:rgb(255,0,0);stroke-width:2;`
    },

    // Return the coordinates to use for the svg. We'll leave dimensions
    // unscaled (i.e. still pixels), but the width of the line means it can
    // display above and left of the (0, 0) position. Similarly it can extend
    // beyond (width, height). To allow those overshoots to display we add
    // extra space around the sides and re-position the box so the line is
    // still in the correct position. We could use a half line width, but
    // we'll use a whole line width to avoid risk of maths artifacts.
    // Note this makes 0,0 slightly offset from top and left.
    viewBox: function ( ) {
      const left = -this.lineWidth
      const top = -this.lineWidth
      const viewableWidth = this.lineWidth + this.width + this.lineWidth
      const viewableHeight = this.lineWidth + this.height + this.lineWidth
      console.log(`### viewBox{ ${left}, ${top}, ${viewableWidth}, ${viewableHeight}`);
      return `${left} ${top} ${viewableWidth} ${viewableHeight}`
    },

  }
}

</script>


<style lang="scss" scoped>
  @import '../../assets/css/content-variables.scss';

  .c-form-line {

    /*
     *  Edit and debug modes
     */
    &.c-edit-mode-debug, &.c-edit-mode-edit {
      display: block;
      position: relative;
      top: 0px;
      left: 0px;
      cursor: pointer;
      border: none;


      .my-svg-edit {
        position: absolute;
        background-color: rgba(255, 215, 0, 0.4);// orange
        border: none;
      }
    }

    /*
     *  Live mode
     */
    &.c-edit-mode-view {
      display: block;
      position: relative;
      top: 0px;
      left: 0px;

      .my-svg-live {
        position: absolute;
        border: none;
      }
    }
  }
</style>
