//
//  Simple Grid, based on Bulma table classes
//  https://bulma.io/documentation/elements/table/

<template lang="pug">

  .c-form-grid(:class="editModeClass")
    .my-refreshCounter {{$formservice.store.state.refreshCounter}}
    //.content-section(v-bind:class="[(pageEditMode=='debug') ? 'my-outline' : '']")

    // Debug mode
    .my-design-mode(v-if="isDesignMode", v-on:click.stop="mSelectMe")
      .c-layout-mode-heading
        edit-bar-icons(:element="element")
        | grid - {{absoluteDataPath}}
      table.table.is-fullwidth
        thead
          tr
            th.my-column-label(v-for="(child, index) in columnsFromChildren", @click.stop.prevent="editColumnNo = index", :class="selectedClass(index)")
              | {{labelForColumn(index)}}

        tbody
          tr
            td(v-for="(child, volNo) in columnsFromChildren")
              panel-without-properties(:element="child", :context="context")
        //tfoot
        //  tr
        //    th Foot 1
        //    th Feet
        //    th Feets
      button.button.is-small.is-primary.is-outlined(@click.stop.prevent="addColumn") Add column
      br
      br

    // Edit mode
    .my-edit-mode(v-else-if="isEditMode", @click.stop.prevent="mSelectMe")
      table.table.is-fullwidth
        thead
          tr
            th.my-column-label(v-for="(child, index) in columnsFromChildren", @click.stop.prevent="editColumnNo = index", :class="selectedClass(index)")
              | {{labelForColumn(index)}}

        tbody
          tr
            td(v-for="(child, index) in columnsFromChildren")
              panel-without-properties(:element="child", :context="recordContext(index)")

    // Live
    template(v-else)
      table.table.is-fullwidth.my-grid-table
        thead
          tr
            //th ID
            th.my-column-label(v-for="(child, index) in columnsFromChildren")
              | {{labelForColumn(index)}}
            th

        tbody
          tr(v-for="(record, recNo) in recordList")
            //td {{ record._id }}
            td(v-for="(child, colNo) in columnsFromChildren")
              panel-without-properties(:element="child", :context="recordContext(recNo)")
            td
              //button.button.is-small.is-danger(@click.stop.prevent="deleteRecord(recNo)") x
              a.button.is-danger.is-outlined.is-small(@click.stop.prevent="deleteRecord(recNo)")
                span Delete
                span.icon.is-small
                  i.fa.fas.fa-times
        //tfoot

      .has-text-left(v-if="addButtonLabel")
        button.button.is-info.is-outlined.is-small(@click.stop.prevent="addRecord") {{addButtonLabel}}
        br
      // This dummy does a select that creates this grid's array
      | {{dummyActualValue}}
</template>

<script>
import ContentMixins from 'vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from 'vue-contentservice/src/mixins/CutAndPasteMixins'
import WidgetMixins from '../../mixins/WidgetMixins'
import FormserviceMixins from '../../mixins/FormserviceMixins'
import FormGridMixins from './FormGridMixins'
import EditMixins from '../../mixins/EditMixins'

export default {
  name: 'form-grid',
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
  mixins: [ ContentMixins, CutAndPasteMixins, WidgetMixins, FormserviceMixins, FormGridMixins, EditMixins ],

  computed: {

    absoluteDataPath: function ( ) {
      let dataset = this.element['record']
      return this.mAbsolutePath(dataset)
    },

    columnLabels: {
      get () {
        let value = this.element['columns']
        //value = 'A| Bee | Ceee'
        // console.log(`Getting labels ${value}`);
        if (!value) {
          return [ ]
        }
        let arr = [ ]
        value.split('|').forEach(l => {
          // console.log(` - ${l}`);
          let i = l.indexOf('=')
          if (i >= 0) {
            l = l.substring(0, i)
          }
          l = l.trim()
          arr.push(l ? l : '?')
        })
        return arr
      }
    },

    columnsFromChildren: {
      get () {
        if (this.element.children) {
          return this.element.children
        } else {
          // Should not be possible
          return [ ]
        }
      }
    },

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

    gridList: function ( ) {
      let recordPath = this.context.formservice.dataPath
      let record = this.record
      console.error(`gridList(). record=${record}`, record);

      // Ask for the first record. This will force the record list to be created.
      let path = `${recordPath}.${record}`
      let defaultValue = undefined
      let {data, error} = this.$formservice.getData(path, defaultValue)
      // console.log(`data is`, data);
      // console.log(`error is`, error);
      return [
        { a:1 },
        { a:2 },
        { a:3 },
        { a:4 },
      ]
    },

    record: WidgetMixins.computedProperty('record'),
    addButtonLabel: WidgetMixins.computedProperty('addButtonLabel'),

    recordList: function ( ) {
      // console.error(`recordList()`);

      // Access refreshCounter, so the cached value for this computed
      // value gets flushed any time the store gets changed.
      let rc = this.$formservice.store.state.refreshCounter

      // Get the list of records for this grid
      let listPath = this.mAbsolutePath(this.element.record)
      // console.log(`listPath=${listPath}`);
      // let { error, data } = this.$formservice.findOrCreate({
      let result = this.$formservice.findOrCreate({
        vm: this,
        // operation: 'find',
        operation: 'find-or-create',
        path: listPath,
        updatePath: true,
        value: [ ],
        debug: false
      })
      // console.error(`Result of foc RECORDLIST is`, result);
      if (result.error) {
        // Problem
        console.error(`Error getting record list:`, error);
        return [ ]
      } else {
        // All okay
        let list = result.data
        // console.error(`recordlist=(${typeof(list)})`, list);
        return list
      }
    },//- recordList

    // This function does not actually return anything useful.
    // It's purpose is to access the object this form accesses,
    // so that it's created if it does not already exist.
    dummyActualValue: function ( ) {
      // console.log(`dummyActualValue()`);
      return null
    },

  },//- computed

  methods: {

    //  Our form will need it's own context object cloned
    //  from the context we received, but with extra information.
    recordContext: function (index) {
      // console.error(`******* recordContext(${index}): old=`, this.context);

      // let recordPath = this.context.formservice.dataPath
      // let attribute = this.attribute
      //
      // if (attribute) {
      //   let path = `${recordPath}.${attribute}`


      if (this.context && this.context.formservice) {
        // console.log(`- need to clone existing context`)

        // This is a grid inside a form
        let listPath = this.mAbsolutePath(this.element.record)
        // console.log(`listPath=${listPath}`);

        let newDataPath = `${listPath}[${index}]`
        // console.log(`new datapath is ${newDataPath}`);


        // Dataset is inherited if not overridden
        let parentFormservice = this.context.formservice

        let newContext = this.cloneContextZZZ(this.context)

        newContext.formservice = {
          name,
          // dataset,
          dataPath: newDataPath,
          parentFormservice
        }
        // console.log(`new context for ${index} is:`, newContext);
        return newContext
      }
      return context
    }, //- newContext

    cloneContextZZZ (context) {
      return { }
    },

    labelForColumn(index) {
      let columns = this.parsedColumns
      if (index < columns.length) {
        return columns[index].label
      }
      return 'label'
    },

    selectedClass: function (index) {

      let current = this.editColumnNo // mixin
      // console.log(`selectedClass(${index}) vs ${current}`);
      return (index === current) ? { 'is-selected' : true } : { }
    },

    setEditColumn: function (index) {
      console.log(`setEditColumn(${index})`);
      this.$content.setProperty({ vm: this, element: this.element, name: 'editColumnIndex', value: index, save: false })
    },

    // Note: this works on the DESIGN, not editing data.
    addColumn: function ( ) {
      console.log(`addColumn()`);
      console.log(`${this.element.children.length} children`)
      let insertContent = {
        type: "contentservice.io",
        version: "1.0",
        source: "toolbox",
        layout: {
          type: 'panelWithoutProperties',
          children: [ ]
        }
      }
      this.$content.insertLayout({ vm: this, parent: this.element, position: -1, layout: insertContent })
    },

    deleteRecord: function (index) {
      let listPath = this.mAbsolutePath(this.element.record)
      let path = `${listPath}[${index}]`
      this.$formservice.delete({
        vm: this,
        // operation: 'delete',
        path,
        debug: false
      })
      // console.error(`new list is =(${typeof(list)})`, list);
      setTimeout(() => {
        console.log(`After deleting: ${JSON.stringify(this.recordList, null, 2)}`);
      }, 500)
    },

    // Note: this works on the DATASET, not the grid design.
    addRecord: function ( ) {
      console.error(`addRecord()`);
      let list = this.recordList
      let json1 = JSON.stringify(list, null, 2)

      // Work out the path for a new record in this list
      let listPath = this.mAbsolutePath(this.element.record)
      let newIndex = list.length
      listPath += `[${newIndex}]`

      // Create a default new record
      let record = {
        // _id: id
      }

      // Add a random ID
      // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
      // record._id = 'xxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*36|0,v=c=='x'?r:r&0x3|0x8;return v.toString(36);});

      // Add the new record
      this.$formservice.findOrCreate({
        vm: this,
        // operation: 'find-or-create',
        path: listPath,
        updatePath: true,
        value: record,
        debug: false
      })
      // console.error(`new list is =(${typeof(list)})`, list);
      setTimeout(() => {
        console.log(`After adding: ${JSON.stringify(this.recordList, null, 2)}`);
      }, 500)

      //
      // console.error(`gridList(). record=${record}`, record);
      //
      // // Ask for the first record. This will force the record list to be created.
      // let path = `${recordPath}.${record}`
      // let defaultValue = undefined
      // console.log(`call getData(${path})`);
      // let {data, error} = this.$formservice.getData(path, defaultValue)
      // console.error(`data is`, data);
      // console.error(`error is`, error);
      //
      // let newIndex = 0
      //
      // let path2 = `${recordPath}.${record}[${newIndex}]`
      // console.log(`call getData(${path2})`);
      // let {data2, error2} = this.$formservice.getData(path2, { })
      // console.error(`data is`, data2);
      // console.error(`error is`, error2);

    }
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

  .c-form-grid {

    .my-column-label {
      cursor: pointer;

      &.is-selecteZd {
        color: red;
      }
    }
    .my-refreshCounter {
      display: none;
    }

    /*
     *  Design mode
     */
    &.c-edit-mode-debug {
      border-left: dashed 2px $frame-color;
      border-bottom: dashed 2px $frame-color;
      border-right: dashed 2px $frame-color;
      margin: 1px;

      background-color: #f0f0f7;

      .c-layout-mode-heading {
        // This overrides the definition in content-editor.scss
        background-color: $frame-color;
        color: $text-color;
      }

      &.c-selected {
        //border-color: $c-editbar-color;
        border-color: $c-editbar-color;
      }
    }//- design mode

    /*
     *  Live mode
     */
    &.c-edit-mode-view {
      table {
        margin-bottom: 8px;
      }
    }
  }//- .c-form-grid
</style>
