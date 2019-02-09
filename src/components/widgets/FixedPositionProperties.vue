<template lang="pug">
  .c-fixed-position-properties(:class="propertyClass")
    .my-heading Position and Size
    div
      table.big-table
        tr
          td.big-cell
            // Position
            table.my-table
              tr.top-row
                td
                td.up-arrow-cell
                  img.up-arrow(src="../../assets/icons/icons8-sort-up-24.png", @click="y--")
                td
              tr
                td.left-arrow-cell
                  img.left-arrow(src="../../assets/icons/icons8-sort-left-24.png", @click="x--")
                td.my-box-container-td
                  div.my-box
                    .my-label x:
                    input(v-model="x").my-input
                    br
                    .my-label y:
                    input(v-model="y").my-input
                td.right-arrow-cell
                  img.right-arrow(src="../../assets/icons/icons8-sort-right-24.png", @click="x++")

              tr.bottom-row
                td
                td.down-arrow-cell
                  img.down-arrow(src="../../assets/icons/icons8-sort-down-24.png", @click="y++")
                td
          td.big-cell
            // Dimensions
            table.my-table
              tr.top-row
                td
                td.up-arrow-cell
                  img.up-arrow(src="../../assets/icons/icons8-sort-up-24.png", @click="height--")
                td
              tr
                td.left-arrow-cell
                  img.left-arrow(src="../../assets/icons/icons8-sort-left-24.png", @click="width--")
                td.my-box-container-td
                  div.my-box
                    .my-label w:
                    input(v-model="width").my-input
                    br
                    .my-label h:
                    input(v-model="height").my-input
                td.right-arrow-cell
                  img.right-arrow(src="../../assets/icons/icons8-sort-right-24.png", @click="width++")

              tr.bottom-row
                td
                td.down-arrow-cell
                  img.down-arrow(src="../../assets/icons/icons8-sort-down-24.png", @click="height++")
                td
</template>

<script>
import PropertyMixins from 'vue-contentservice/src/mixins/PropertyMixins'
import EditMixins from '../../mixins/EditMixins'

export default {
  mixins: [ PropertyMixins, EditMixins ],
  computed: {
    x: {
      get () {
        let value = this.element['_fixed_x']
        return value ? value : ''
      },
      set (value) {
        if (value > 0) {
          this.$content.setProperty({ vm: this, element: this.element, name: '_fixed_x', value })
        }
      }
    },
    y: {
      get () {
        let value = this.element['_fixed_y']
        return value ? value : ''
      },
      set (value) {
        if (value > 0) {
          this.$content.setProperty({ vm: this, element: this.element, name: '_fixed_y', value })
        }
      }
    },
    width: {
      get () {
        let value = this.element['width']
        return value ? value : ''
      },
      set (value) {
        if (value > 0) {
          this.$content.setProperty({ vm: this, element: this.element, name: 'width', value })
        }
      }
    },
    height: {
      get () {
        let value = this.element['height']
        return value ? value : ''
      },
      set (value) {
        if (value > 0) {
          this.$content.setProperty({ vm: this, element: this.element, name: 'height', value })
        }
      }
    },
  },
  methods: {
    adjustX (delta) {
      let x = this.x
      if (typeof(x) === 'string') {
        x = parseInt(x)
      }
      this.x = x + delta
    },
    adjustY (delta) {
      let x = this.y
      if (typeof(x) === 'string') {
        x = parseInt(x)
      }
      this.y = x + delta
    }
  }
}
</script>

<style lang="scss" scoped>
  /* .c-property-value {
    input.input {
      margin-top: 2px;
      font-size: 9px;
    }
  } */

  .c-fixed-position-properties {
    .my-heading {
      padding-top: 5px;
      font-size: 13px;
    }

    .my-box-container-td {
      background-color: pink;
      min-width: 61px;
    }

    .my-box {
      display: inline-block;
      padding-left: 8px;
      padding-right: 8px;
      padding-bottom: 3px;
      padding-top: 3px;
      border: solid 1px #ddd;
      border-radius: 3px;
      font-size: 12px;

      .my-label {
        display: inline-block;
        width: 13px;
      }
      .my-input {
        width: 30px;
      }
    }

    .up-arrow-cell {
      text-align: center;
      position: relative;
      .up-arrow {
        position: absolute;
        bottom: -6px;
        left: 18px;
        width: 24px;
        height: 24px;
      }
    }

    .down-arrow-cell {
      text-align: center;
      position: relative;
      .down-arrow {
        position: absolute;
        top: -6px;
        left: 18px;
        width: 24px;
        height: 24px;
      }
    }

    .left-arrow-cell {
      text-align: center;
      width: 24px;
      position: relative;

      img.left-arrow {
        position: absolute;
        top: 10px;
        right: -5px;
        width: 24px;
        height: 24px;
      }
    }

    .right-arrow-cell {
      text-align: center;
      width: 24px;
      position: relative;

      .right-arrow {
        position: absolute;
        top: 10px;
        left: -5px;
        width: 24px;
        height: 24px;
      }
    }



    .big-table {
      width: 100%;
      .big-cell {
        text-align: center;
      }
    }

    .top-row {
      height: 24px;
    }
    .bottom-row {
      height: 24px;
    }
  }

</style>
