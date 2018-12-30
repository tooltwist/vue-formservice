import Vue from 'vue'
import axios from 'axios'
import axiosError from '../lib/axiosError.js'

import { parseDataPath, pathFromParts, pathSpaces, describe } from '../lib/navigation.js'

let TESTHACK = false
// TESTHACK = true

// Variables to describe what we are looking for, or have,
// at various stages of seeking for and setting values.
const NOTHING = 101
const PROPERTY = 102
const RECORD = 103
const ARRAY = 104
const ELEMENT_IN_ARRAY = 105
const WHATEVER = 106


const NOTFOUND = { error: 'NOTFOUND', data: null }
const SUCCESS = { error: null, data: null }


// initial state
export const state = () => {
  return {

    //
    datasetIndex : {
      'adlform' : {
        name: 'adlform',
        source: 'testdata://adlform',
        data: {
        },
        schema: { },
        layout: { }
      },

      'test1' : {
        name: 'test1',
        source: 'testdata://test1',
        data: {
          a: {
            string: 'hello',
            num: 123,
            record: {
              val1: 1,
              val2: 2,
              val3: 'three'
            },
            array: [
              {},
              {},
              {
                val1: 1,
                val2: 2,
                val3: 'three'
              }
            ]
          }
        },
        schema: { },
        layout: { }
      },

      /*
       *  Each parcel contains: name, schema, layout, and data
      */
      'test2' : {
        name: 'test2',
        source: 'testdata://mytestdata-number-2',
        data: {
          firstname: 'Mary',
          lastname: 'Jones',
          //ZZZZZ
          tTenantName: 'Madam Tenant',
          tTenantAdd1: 'First House',
          tTenantAdd2: 'Down the Road',
          tTenantAdd3: 'And around the corner',
          tTenantPCode: '1234',
          x: 'x-value',
        },

        schema: null,

        layout: null
      },

      'test3' : {
        name: 'test3',
        source: 'testdata://mytestdata-set2',
        data: {
          firstname: 'William',
          lastname: 'Wonker',
          address1: '343 Hennessy Road',
          address2: 'Room B, Floor 4',
          city: 'Wanchai',
          postcode: '',
          country: 'Hong Kong',
        },

        schema: null,

        layout: null
      },

      'test4' : {
        name: 'test4',
        source: 'testdata://test4',
        data: {
          a: {
            string: 'hello',
            num: 123,
            record: {
              val1: 1,
              val2: 'two'
            },
            array: [
              { first: true },
              { seq: 'two' },
              {
                val1: 'one',
                val2: 2
              }
            ]
          }
        },
        schema: { },
        layout: { }
      },

      'states' : {
        name: 'states',
        source: 'testdata://test4',
        data: {
          list: [
            {
              "value": 'NSW',
              "description": 'New South Wales'
            },
            {
              "value": 'NT',
              "description": 'Northern Territory'
            },
            {
              "value": 'QLD',
              "description": 'Queensland'
            },
            {
              "value": 'SA',
              "description": 'South Australia'
            },
            {
              "value": 'TAS',
              "description": 'Tasmania'
            },
            {
              "value": 'VIC',
              "description": 'Victoria'
            },
            {
              "value": 'WA',
              "description": 'Western Australia'
            },
          ]//- list
        },//- data
        schema: { },
        layout: { }
      },//- states

      inspectionTypes: {
        name: 'inspectionTypes',
        source: 'testdata://inspectionTypes',
        data: {
          list: [
            {
              "value": 'A',
              "description": 'Type A inspection'
            },
            {
              "value": 'B',
              "description": 'Type B inspection'
            },
          ]
        },
        schema: { },
        layout: { }
      },//- inspectionTypes

      inspectionReportForms: {
        name: 'inspectionTypes',
        source: 'testdata://inspectionTypes',
        data: {
          list: [
            {
              "value": 'X',
              "description": 'Report X'
            },
            {
              "value": 'Y',
              "description": 'Report Y'
            },
            {
              "value": 'Z',
              "description": 'Report Z'
            },
          ]
        },
        schema: { },
        layout: { }
      },//- inspectionReportForms

      rentalPeriods: {
        name: 'leasePeriod',
        source: 'testdata://inspectionTypes',
        data: {
          list: [
            {
              "value": 'week',
              "description": 'Week'
            },
            {
              "value": 'fortnight',
              "description": 'Fortnight'
            },
            {
              "value": 'month',
              "description": 'Month'
            },
            {
              "value": 'year',
              "description": 'Year'
            },
          ]
        },
        schema: { },
        layout: { }
      },//- rentPeriod

    }, //- datasetIndex

    // Refresh for some components can be activated by incrementing this counter.
    refreshCounter: 1,

    // Set to true while we are waiting for the server to scan a document
    // and generate derived documents.
    // currentlyScanning: false,
    // scanMessage: ''

  }
}



/********************************************
 *
 *                 GETTERS
 *
 ********************************************/
export const getters = {

  // Returns { data: Object, error: String }
  getData: (state) => (recordPath, defaultValue) => {
    if (recordPath.includes('harry')) {
      console.log(`/------------------------------------------`);
      console.log(`GETTER getData(${recordPath}, defaultValue=${defaultValue})`);
    }

    let fullPath = `${recordPath}`
    let parts = parseDataPath(fullPath)
    if (recordPath.includes('harry')) {
      console.log(`parts is `, parts);
    }

    // Hack test cases for path parsing. During development only.
    // console.log(`parts=`, parseDataPath('~harry'))
    // console.log(`parts=`, parseDataPath(' ! '))
    // console.log(`parts=`, parseDataPath(' ! wally '))
    // console.log(`parts=`, parseDataPath('!first.second[123]'))
    // console.log(`parts=`, parseDataPath(' ! first . second [ 123 ]'))
    // console.log(`parts=`, parseDataPath('!first['))
    // console.log(`parts=`, parseDataPath('!first[123'))
    // console.log(`parts=`, parseDataPath('!first[123]'))
    // console.log(`parts=`, parseDataPath('!first[123]abc'))
    // console.log(`parts=`, parseDataPath('!first[abc]'))
    // console.log(`parts=`, parseDataPath('!first[123].second[456]'))
    // console.log(`parts=`, parseDataPath('!first[123]..second[456]'))
    // console.log(`parts=`, parseDataPath('!first[123].second[456].'))
    if (parts === null) {
      return null // Parse error already reported
    } else if (parts.length === 0) {
      console.error(`Invalid data path (${fullPath}): no path specified!`);
    }

    // Check the top level refers to a parcel
    let datasetName = parts[0].name
    let datasetIndex = parts[0].index

    if (!datasetName.startsWith('!')) {
      return { data: null, error: `Path must start with ! (${fullPath})`}
    }
    while (datasetName.startsWith('!')) {
      datasetName = datasetName.substring(1)
    }

    // If we ask for mock data, we always get question marks
    if (datasetName === 'mock') {
      return { data: '???', error: null }
    }

    let parcel = state.datasetIndex[datasetName]

    // Check the package was found
    if (typeof(parcel) === 'undefined') {
      return { data: null, error: `Unknown dataset: !${datasetName}`}
    }

    // Are we looking for an array?
    let data = parcel.data
    if (datasetIndex >= 0) {

      // FUTURE: MAY DISABLE ARRAYS AT TOP LEVEL

      // Looking for an element in an array
      if (Array.isArray(parcel.data)) {

        // We have an array - good
        if (datasetIndex >= parcel.data.length) {
          console.log(`result: Array overflow: !${datasetName}[${datasetIndex}]`)
          return { data: null, error: `Array overflow: !${datasetName}[${datasetIndex}]`}
        }
        // Have the record in the array
        if (parts.length === 1) {
          // console.log(`result: found record in array (top of dataset)`)
          return { data: parcel.data[datasetIndex], error: null }
        } else {
          console.log(`found record in array. Now look for children`);
          // console.error(`$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$`, data[datasetIndex]);
          let result = findData(data[datasetIndex], parcel.parts, 1, defaultValue)
          // console.log(`result: Found ${fullPath}`, result)
          return result
        }
      } else {

        // We're looking for an element inan array, but this is not an array!
        console.log(`result: Not an array: !${datasetName}[${datasetIndex}]`)
        return { data: null, error: `Not an array: !${datasetName}[${datasetIndex}]`}
      }
    } else {

      // Not looking for an element in an array
      // Hopefully we don't have an array.
      if (Array.isArray(parcel.data)) {

        // We aren't after an element in an array, but this IS an array!
        console.log(`result: Did not expect an array: !${datasetName}`)
        return { data: null, error: `Did not expect an array: !${datasetName}`}
      } else {

        // We have a field or object.
        if (parts.length === 1) {

          // We're only looking for the dataset
          // console.log(`result: Found record (top of dataset)`)
          return { data: parcel.data, error: null }
        } else {

          // console.log(`Found record. Now look for children`)
          let result = findData(parcel.data, parts, 1, defaultValue)
          // console.log(`result: found ${fullPath}`, result);
          return result
        }
      }
    }

    // Cannot get here
  },//- getData


  //      ___  ___  ___| | __
  //     / __|/ _ \/ _ \ |/ /
  //     \__ \  __/  __/   <
  //     |___/\___|\___|_|\_\
  //
  // Note that an array index is not allowed:
  // - on the first part of the path (the dataset).
  // - on the last part, when adding a non-record.
  // seek: (state) => (params) => {
  //   let { vm, operation, path, updatePath, value, debug } = params
  seek: (state) => ({ vm, operation, path, updatePath, value, debug }) => {
    // console.log(`FormserviceStore.seek(op=${operation}, ${path}, updatePath=${updatePath}, value=${describe(value)})`, value);

    if (debug) {
      console.log(`/----------`);
      console.error(`GETTER FormserviceStore.seek(op=${operation}, ${path}, updatePath=${updatePath}, value=${describe(value)}):`, value);
    }

    // Check for inconsistencies
    if (operation === 'find' || operation === 'delete') {
      if (value) {
        console.error(`Warning: inconsistent: value provided when operation is ${operation}`);
        value = undefined
      }
    }
    if (operation === 'find-or-create' || operation === 'save') {
      if (!value && value != '') {
        let err = `No value provided when operation is ${operation}`
        console.error(`Error: ${err}`);
        return {
          error: `Internal error: Missing 'value' parameter`,
          data: null,
          commentary: err
        }
      }
    }


if (TESTHACK) {
  console.error('00000000000000000000');
  console.error('00000000000000000000');
  console.error('00000000000000000000');
  console.error('00000000000000000000');

  operation = 'find'
  operation = 'find-or-create'
  operation = 'save'
  operation = 'delete'
  // updatePath = false
  updatePath = true

  // HACK FOR TESTING
  // path = "!test1.a"
  path = "!test4.a.unknown"
  path = "!test4.a.string"
  path = "!test4.a.num"
  path = "!test4.a.array[0]"
  path = "!test4.a.array[2].val1"
  path = "!test4.a.array[2].val3"
  path = "!test4.a.array[9]"
  path = "!test4.a.record.val1"
  path = "!test4.a.newThing.stuff"
  path = "!test4.a.newThing[2].stuff.x.y[2].z23"

  path = "!test4.a.array[12].val1"
  // path = "!test4.a.b[2].c"
  // path = "!test4.a[1].b"
  // path = "!test4.a[1].b[2]"
  // path = "!test4.a[1].b[2].c"

  // path = "!test4.a[3].b"
  // path = "!test4.a[3]"
  // path = "!test4.a[3].b[6]"
  // path = "!test4.a[3].one.step[3].at.a.time[6]"

  value = { harry: 'smiggens'}
  // value = 'smiggens'
  // value = undefined


  console.error(`BEFORE WE START.`);
  let data = state.datasetIndex['test4'].data
  let json = JSON.stringify(data, null, 2)
  console.log(`!test4:`, json)

  console.error(`PATH: ${path}`);
  console.error(`VALUE: ${describe(value)}`, value);
}


    // Okay, now lets start looking...
    let parts = parseDataPath(path)
    // if (debug) {
    //   console.log(`seek: parts is `, parts);
    // }

    // Check the path is valid
    if (parts === null) {
      return null // Parse error already reported
    } else if (parts.length === 0) {
      console.error(`Invalid data path (${path}): no path specified!`);
    }

    // Check the first part is not an array reference
    if (parts[0].index >= 0) {
      return { error: `Unexpected array reference ${pathFromParts(parts, 0)}`, data: null }
    }

    // Check the top level refers to a parcel
    let datasetName = parts[0].name
    let datasetIndex = parts[0].index

    if (!datasetName.startsWith('!')) {
      return { data: null, error: `Path must start with ! (${datasetName})`}
    }
    while (datasetName.startsWith('!')) {
      datasetName = datasetName.substring(1)
    }

    // If we ask for mock data, we always get question marks
    if (datasetName === 'mock') {
      return { data: '???', error: null }
    }

    if (!state.datasetIndex.hasOwnProperty(datasetName)) {
      return { data: null, error: `Unknown dataset: !${datasetName}`}
    }
    let parcel = state.datasetIndex[datasetName]

    // Are we just looking for the dataset?
    let data = parcel.data
    if (parts.length === 1) {

      // We're only looking for the dataset
      // console.log(`result: Found record (top of dataset)`)
      return { data: parcel.data, error: null }
    } else {

      let result
      switch (operation) {
        case 'find':
          result = seek_for_find({vm, operation, parent: parcel.data, parts, level: 1, debug })
          break

        case 'find-or-create':
          result = seek_for_find_or_create({vm, operation, parent: parcel.data, parts, level: 1, updatePath, value, debug })
          break

        case 'save':
          result = seek_for_save({vm, operation, parent: parcel.data, parts, level: 1, updatePath, value, debug })
          break

        case 'delete':
          result = seek_for_delete({vm, operation, parent: parcel.data, parts, level: 1, debug })
          break
        default:
          console.error(`seek: unknown operation ${operation}`);
      }
       if (TESTHACK) {
         console.error(`FINISHED. result=`, result);
         let data = state.datasetIndex['test4'].data
         let json = JSON.stringify(data, null, 2)
         console.log(`!test4:`, json)
       }
       return result
    }
  }
}//- getters

find: (state) => ({ vm, path, debug }) => {
  if (debug) {
    console.log(`/----------`);
    console.error(`GETTER FormserviceStore.find(${path}})`);
  }

  // Okay, now lets start looking...
  let parts = parseDataPath(path)
  // if (debug) {
  //   console.log(`seek: parts is `, parts);
  // }

  // Check the path is valid
  if (parts === null) {
    //ZZZZ Return { error, data }
    return null // Parse error already reported
  } else if (parts.length === 0) {
    return { error: `Invalid path (${path}): no path specified`, data: null }
  }

  // Check the first part is not an array reference
  if (parts[0].index >= 0) {
    return { error: `Unexpected array reference ${pathFromParts(parts, 0)}`, data: null }
  }

  // Check the top level refers to a parcel
  let datasetName = parts[0].name
  let datasetIndex = parts[0].index

  if (!datasetName.startsWith('!')) {
    return { data: null, error: `Path must start with ! (${datasetName})`}
  }
  while (datasetName.startsWith('!')) {
    datasetName = datasetName.substring(1)
  }

  // If we ask for mock data, we always get question marks
  if (datasetName === 'mock') {
    return { data: '???', error: null }
  }

  if (!state.datasetIndex.hasOwnProperty(datasetName)) {
    return { data: null, error: `Unknown dataset: !${datasetName}`}
  }
  let parcel = state.datasetIndex[datasetName]

  // Are we just looking for the dataset?
  let data = parcel.data
  if (parts.length === 1) {

    // We're only looking for the dataset
    // console.log(`result: Found record (top of dataset)`)
    return { data: parcel.data, error: null }
  }

  let result = seek_for_find({vm, operation, parent: parcel.data, parts, level: 1, debug })
  if (TESTHACK) {
    console.error(`FINISHED. result=`, result);
    let data = state.datasetIndex['test4'].data
    let json = JSON.stringify(data, null, 2)
    console.log(`!test4:`, json)
  }
  return result
}//- getters


// Recursively seek until we either find what we need, or we find some
// part of the path missing. At that time we'll decide what we need to do.
function seek_for_find({vm, parent, parts, level, debug}) {
  if (debug) {
    console.error(`seek_for_find(parts, level=${level})`);
    console.log(`${pathFromParts(parts)}`);
    console.log(`${pathFromParts(parts, level)}  <--`);
  }

  let scenario = (str) => { if (debug) console.log(`scenario find ${str}`); }

  let isFinalPart = (level === (parts.length - 1))
  let name = parts[level].name
  let index = parts[level].index

  let have = whatWeHave(parent, name)

  // Paths for FIND
  //            path    final
  //         ---------  -----
  //  !test1.aaa.bbb[n].ccc   <--- whatever
  //          ^   ^        ^
  //          |   |        +-- may have index
  // record --+   +- element-in-array
  //
  let need
  if (isFinalPart) {

    /*
     *  FINAL PART
     */
    if (index < 0) {

      // No index (like 'ccc')
      // Need WHATEVER
      if (have == NOTHING) {
        scenario('find 1 (final, missing property)')
        return NOTFOUND
      }
      let whatever = parent[name]
      scenario('find 2 (final, found)')
      return { error: null, data: whatever }

    } else {

      // Have an index on final element (like 'ccc[n]')
      // Need ELEMENT_IN_ARRAY
      if (have !== ARRAY) {
        scenario('find 3 (final, not an array)')
        return NOTFOUND
      }
      let arr = parent[name]
      if (index >= arr.length) {
        // Index is beyond the end of the array
        scenario('find 4 (final, beyond end of array)')
        return NOTFOUND
      }
      // Have element in the array - move on to the next level in the path
      let recordInArray = arr[index]
      scenario('find 5 (final, found record in array)')
      return { error: null, data: recordInArray}
    }
  } else {

    /*
     *  BEFORE FINAL PART
     */
    if (index < 0) {
      // No index in this part of path (like 'aaa' above)
      // Need RECORD
      if (have !== RECORD) {
        // No way to get to the next level
        scenario('find 6 (path, not a record)')
        return NOTFOUND
      }
      let record = parent[name]
      scenario('find 7 (path, found record, next level...)')
      return seek_for_find({vm, parent: record, parts, level: level+1, debug })

    } else {
      // Have index in this part of path (like 'bbb[n]' above)
      // Need ELEMENT_IN_ARRAY
      if (have !== ARRAY) {
        scenario('find 8 (path, not an array)')
        return NOTFOUND
      }
      let array = parent[name]
      if (index >= array.length) {
        // Beyond end of array
        scenario('find 9 (path, beyond end of array)')
        return NOTFOUND
      }
      let recordInArray = array[index]
      scenario('find 10 (path, found record in array)')
      return seek_for_find({vm, parent: recordInArray, parts, level: level+1, debug })
    }
  }
}


// Recursively seek until we either find what we need, or we find some
// part of the path missing. At that time we'll decide what we need to do.
function seek_for_find_or_create({vm, parent, parts, level, updatePath, value, debug}) {
  if (debug) {
    console.error(`seek_for_find_or_create(parts, level=${level}, updatePath=${updatePath}, value="${describe(value)}")`, value);
    console.log(`${pathFromParts(parts)}`);
    console.log(`${pathFromParts(parts, level)}  <--`);
  }

  let scenario = (str) => { if (debug) console.log(`scenario ${str}`); }

  let isFinalPart = (level === (parts.length - 1))
  let name = parts[level].name
  let index = parts[level].index

  let have = whatWeHave(parent, name)

  // Paths for FIND_OR_CREATE
  //
  //            path    final
  //         ---------  -----
  //  !test1.aaa.bbb[n].ccc
  //          ^   ^      ^
  //          |   |      +-- whatever
  // record --+   +- element-in-array
  //
  //  !test1.aaa.bbb[n].ccc[m]
  //          ^   ^       ^
  //          |   |       +-- record
  // record --+   +- element-in-array
  //
  if (isFinalPart) {

    /*
     *  FINAL PART
     */
    if (index < 0) {

      /*
       *  No index on final part (like 'ccc')
       *  Need WHATEVER
       */
      if (have == NOTHING) {
        // Set new property
        scenario('foc 1 (final nothing)')
        vm.$formservice.store.dispatch('setValueFromSeekAction', {vm, parent, name, index, value: value, debug})
        return { error: null, data: value }
      }
      // Have existing property
      scenario('foc 2 (final found)')
      let whatever = parent[name]
      return { error: null, data: whatever }

    } else {

      /*
       *  Have an index on final part (like 'ccc[m]')
       *  Need ELEMENT_IN_ARRAY
       */
      if (describe(value) != 'record') {
        scenario('foc 3a (final, attempt to store non-record into array)')
        return { error: `Attempt to store non-record (${describe(value)}) into an array ${pathFromParts(parts)}`, data: null}
      }
      if (have === NOTHING) {
        // Create a new array
        scenario('foc 3b (final array missing)')
        let newArray = [ value ]
        vm.$formservice.store.dispatch('setValueFromSeekAction', {vm, parent, name, index: -1, value: newArray, debug})
        return { error: null, data: value }
      }
      if (have !== ARRAY) {

        // There is already something there, that is not an array
        if (updatePath) {
          // Create a completely new array
          scenario('foc 4 (final replace array)')
          let newArray = [ value ]
          vm.$formservice.store.dispatch('setValueFromSeekAction', {vm, parent, name, index: -1, value: newArray, debug})
          return { error: null, data: value }
        }

        // Can't get record when we don't have an array
        scenario('foc 5 (final not array)')
        return NOTFOUND
      }

      // Have an array, now see if we have an element at 'index'
      let array = parent[name]
      if (index < array.length) {
        // Found record in the array
        scenario('foc 6 (final found record in array)')
        let elementInArray = array[index]
        return { error: null, data: elementInArray}
      }

      // Not found [index is beyond the end of the array] so add our new value.
      // The mutation will increase the array size as required
      scenario('foc 7 (final add to array)')
      vm.$formservice.store.dispatch('setValueFromSeekAction', {vm, parent, name, index, value: value, debug})
      return { error: null, data: value}
    }
  } else {

    /*
     *  BEFORE FINAL PART
     */
    if (index < 0) {

      /*
       *  No index in this part of path (like 'aaa' above)
       *  Need RECORD
       */
      if (have !== RECORD) {

        if (updatePath) {
          // Replace this non-record property with a new record, containing
          // our required path down to the final value.
          scenario('foc 8 (path, create new record)')
          let newRecord = constructPropertyValue({parts, level: level, value, debug })
          vm.$formservice.store.dispatch('setValueFromSeekAction', {vm, parent, name, index, value: newRecord, debug})
          return { error: null, data: value }
        }
        // No way to get to the next level
        scenario('foc 9 (path, record not found)')
        return NOTFOUND
      }
      // Found this part of the path. Move on to the next level.
      let record = parent[name]
      scenario('foc 10 (path, record found, next level...)')
      return seek_for_find_or_create({vm, parent: record, parts, level: level+1, updatePath, value, debug })

    } else {
      /*
       *  Have index in this part of path (like 'bbb[n]' above)
       *  Need ELEMENT_IN_ARRAY
       */
      if (have !== ARRAY) {
        if (updatePath) {
          // Replace this non-array property with a completely new
          // array containing our required path and final value.
          scenario('foc 11 (path, create new array)')
          let newArray = constructPropertyValue({parts, level: level, value, debug })
          console.log(`newArray is ${JSON.stringify(newArray,null,2)}`);
          // Let the mutation add the array as a property. We use index=-1 because we have the whole array already
          vm.$formservice.store.dispatch('setValueFromSeekAction', {vm, parent, name, index: -1, value: newArray, debug})
          return { error: null, data: value }
        }
        // Not an array - no way down to our required value
        scenario('foc 12 (path, array not found)')
        return NOTFOUND
      }

      // Have an array
      let array = parent[name]
      if (index < array.length) {
        // Have element in the array. Move down to the next level.
        let elementInArray = array[index]
        scenario('foc 13 (path, found record in array, next level...)')
        return seek_for_find_or_create({vm, parent: elementInArray, parts, level: level+1, updatePath, value, debug })
      }

      // Element is beyond end of array
      if (updatePath) {
        // Add a new element into the array
        scenario('foc 14 (path, add element into array)')
        let newRecord = constructPropertyValue({parts, level: level, value, debug, recordOnly: true })
        console.error(`newRecord is `, newRecord);
        vm.$formservice.store.dispatch('setValueFromSeekAction', {vm, parent, name, index, value: newRecord, debug})
        return { error: null, data: value }
      }
      scenario('foc 15 (path, past end of array)')
      return NOTFOUND
    }
  }
}


// Recursively seek until we either find what we need, or we find some
// part of the path missing. At that time we'll decide what we need to do.
function seek_for_save({vm, parent, parts, level, updatePath, value, debug}) {
  if (debug) {
    console.error(`seek_for_save(parts, level=${level}, updatePath=${updatePath}, value="${describe(value)}")`, value);
    console.log(`${pathFromParts(parts)}`);
    console.log(`${pathFromParts(parts, level)}  <--`);
  }

  let scenario = (str) => { if (debug) console.log(`scenario save ${str}`); }

  let isFinalPart = (level === (parts.length - 1))
  let name = parts[level].name
  let index = parts[level].index

  let have = whatWeHave(parent, name)

  // Paths for SAVE
  //
  //            path    final
  //         ---------  -----
  //  !test1.aaa.bbb[n].ccc
  //          ^   ^      ^
  //          |   |      +-- value can be whatever
  // record --+   +- element-in-array
  //
  //  !test1.aaa.bbb[n].ccc[m]
  //          ^   ^       ^
  //          |   |       +-- value must be record
  // record --+   +- element-in-array
  //
  let need
  if (isFinalPart) {

    /*
     *  FINAL PART
     */
    if (index < 0) {

      /*
       *  No index on final part (like 'ccc')
       *  Set the property (may overwrite previous value)
       */
      scenario(`save 1 (final, set property ${name})`)
      vm.$formservice.store.dispatch('setValueFromSeekAction', {vm, parent, name, index, value: value, debug})
      return SUCCESS

    } else {

      /*
       *  Have an index on final part (like 'ccc[m]')
       *  Need ELEMENT_IN_ARRAY
       */
      // Check that value is a record
      if (describe(value) != 'record') {
        scenario(`save 2 (final, trying to store non-record in array)`)
        return { error: `Attempt to store non-record (${describe(value)}) into an array ${pathFromParts(parts)}`, data: null}
      }
      if (have !== ARRAY) {

        // There is already something there, but it is not an array
        if (updatePath) {
          // Create a completely new array
          scenario(`save 3 (final, create new array)`)
          let newArray = [ value ]
          vm.$formservice.store.dispatch('setValueFromSeekAction', {vm, parent, name, index: -1, value: newArray, debug})
          return SUCCESS
        }

        // Can't save recordInArray when we don't have an array
        scenario(`save 4 (final, not an array)`)
        return NOTFOUND
      }

      // Have an array, set the record in the array.
      // The mutation will increase the array size as required
      scenario(`save 5 (final, set record in array)`)
      vm.$formservice.store.dispatch('setValueFromSeekAction', {vm, parent, name, index, value: value, debug})
      return SUCCESS
    }
  } else {

    /*
     *  BEFORE FINAL PART
     */
    if (index < 0) {

      /*
       *  No index in this part of path (like 'aaa' above)
       *  Need RECORD
       */
      if (have !== RECORD) {
        if (updatePath) {
          // Replace this non-record property with a new record, containing
          // our required path down to the final value.
          scenario(`save 6 (path, setting new record)`)
          let newRecord = constructPropertyValue({parts, level: level, value, debug })
          vm.$formservice.store.dispatch('setValueFromSeekAction', {vm, parent, name, index, value: newRecord, debug})
          return SUCCESS
        }
        // No way to get to the next level
        scenario(`save 7 (path, record not found)`)
        return NOTFOUND
      }
      // Found this part of the path. Move on to the next level.
      scenario(`save 8 (path, record found, on to next level...)`)
      let record = parent[name]
      return seek_for_save({vm, parent: record, parts, level: level+1, updatePath, value, debug })

    } else {
      /*
       *  Have index in this part of path (like 'bbb[n]' above)
       *  Need ELEMENT_IN_ARRAY
       */
      if (have !== ARRAY) {
        if (updatePath) {
          // Replace this non-array property with a completely
          // array containing our required path and final value.
          scenario(`save 9 (path, creating new array)`)
          let newArray = constructPropertyValue({parts, level: level, value, debug })
          vm.$formservice.store.dispatch('setValueFromSeekAction', {vm, parent, name, index, value: newArray, debug})
          return SUCCESS
        }
        // Not an array - no way down to our required value
        scenario(`save 10 (path, array not found [undefined, or not an array])`)
        return NOTFOUND
      }

      // Have an array
      let array = parent[name]
      if (index < array.length) {
        // Have element in the array. Move down to the next level.
        scenario(`save 11 (path, found record in array, on to next level...)`)
        let elementInArray = array[index]
        return seek_for_save({vm, parent: elementInArray, parts, level: level+1, updatePath, value, debug })
      }

      // Element is beyond end of array
      if (updatePath) {
        // Add a new element into the array
        scenario(`save 12 (path, add new record to array)`)
        let newRecord = constructPropertyValue({parts, level: level, value, debug, recordOnly: true })
        console.error(`newRecord=`, newRecord)
        vm.$formservice.store.dispatch('setValueFromSeekAction', {vm, parent, name, index, value: newRecord, debug})
        return SUCCESS
      }
      scenario(`save 13 (path, beyond end of array)`)
      return NOTFOUND
    }
  }
}


// Recursively seek until we either find what we need, or we find some
// part of the path missing. At that time we'll decide what we need to do.
function seek_for_delete({vm, parent, parts, level, debug }) {
  if (debug) {
    console.error(`seek_for_delete(parts, level=${level}")`);
    console.log(`${pathFromParts(parts)}`);
    console.log(`${pathFromParts(parts, level)}  <--`);
  }
  let scenario = (str) => { if (debug) console.log(`scenario delete ${str}`); }

  let isFinalPart = (level === (parts.length - 1))
  let name = parts[level].name
  let index = parts[level].index

  let have = whatWeHave(parent, name)

  // Paths for SAVE
  //            path    final
  //         ---------  -----
  //  !test1.aaa.bbb[n].ccc   <--- whatever
  //          ^   ^        ^
  //          |   |        +-- may have index
  // record --+   +- element-in-array
  //
  let need
  if (isFinalPart) {

    /*
     *  FINAL PART
     */
    if (index < 0) {

      // No index (like 'ccc')
      if (have === NOTHING) {
        scenario(`delete 1 (final, nothing to delete)`)
        return NOTFOUND
      }
      scenario(`delete 2 (final, deleting property)`)
      vm.$formservice.store.dispatch('deleteValueFromSeekAction', {vm, parent, name, index, debug})
      return SUCCESS

    } else {

      // Have an index on final element (like 'ccc[m]')
      // Need ELEMENT_IN_ARRAY
      if (have !== ARRAY) {
        scenario(`delete 3 (final, not an array)`)
        return NOTFOUND
      }

      // Have an array, now
      let array = parent[name]
      if (index >= array.length) {
        scenario(`delete 4 (final, beyond end of array)`)
        return NOTFOUND
      }
      scenario(`delete 5 (final, deleting record in array)`)
      vm.$formservice.store.dispatch('deleteValueFromSeekAction', {vm, parent, name, index, debug})
      return SUCCESS
    }
  } else {

    /*
     *  BEFORE FINAL PART
     */
    if (index < 0) {
      // No index in this part of path (like 'aaa' above)
      // Need RECORD
      if (have !== RECORD) {
        // No way to get to the next level
        scenario(`delete 6 (path, not a record)`)
        return NOTFOUND
      }
      scenario(`delete 7 (path, found record, on to next level)`)
      let record = parent[name]
      return seek_for_delete({vm, parent: record, parts, level: level+1, debug })

    } else {
      // Have index in this part of path (like 'bbb[n]' above)
      // Need ELEMENT_IN_ARRAY
      if (have !== ARRAY) {
        scenario(`delete 8 (path, not an array)`)
        return NOTFOUND
      }

      // Have an array
      let array = parent[name]
      if (index < array.length) {
        // Have element in array
        scenario(`delete 9 (path, found record in array, on to next level)`)
        let elementInArray = array[index]
        return seek_for_delete({vm, parent: elementInArray, parts, level: level+1, debug })
      }

      // Beyond end of array
      scenario(`10 (path, beyond end of array)`)
      return NOTFOUND
    }
  }
}



function whatWeHave (parent, name) {
  // console.log(`whatWeHave. parent=`, parent);
  // console.log(`whatWeHave. name=`, name);
  // console.log(`parent json is ${JSON.stringify(parent, null, 4)}`)

  // console.log(`it is`, parent[name]);
  // console.log(`it is`, typeof(parent[name]));


  // Let's see what we have
  // if (parent[name] === undefined) {
  //   console.log(`not in record`)
  if (!parent.hasOwnProperty(name)) {
    return NOTHING
  } else if (Array.isArray(parent[name])) {
    return ARRAY
  } else if (typeof(parent[name]) === 'object') {
    return RECORD
  }
  return PROPERTY
}


// // Recursively seek until we either find what we need, or we find some
// // part of the path missing. At that time we'll decide what we need to do.
// // OBSOLETE
// function seek_and_you_will_find({vm, operation, parent, parts, level, updatePath, value, debug }) {
//   if (debug) {
//     console.error(`seek_and_you_will_find(op=${operation}, parts, level=${level}, updatePath=${updatePath}, value=${describe(value)})`, value);
//     console.log(`${pathFromParts(parts)}`);
//     console.log(`${pathFromParts(parts, level)}  <--`);
//   }
//
//   let isFinalPart = (level === (parts.length - 1))
//
//   // See if the named item exists
//   let name = parts[level].name
//   let index = parts[level].index
//   let obj = null
//   if (!parent.hasOwnProperty(name)) {
//
//     // Not found
//     console.log(`missing ${name}`);
//
//     // See if we need to construct something
//     if (isFinalPart && typeof(value) !== 'undefined') {
//
//       // This is the final part, and we have a value to set
//       if (debug) {
//         console.log(`Scenario A - construct ${name} - final part`);
//       }
//       // Get the value, record, or array for this final property
//       // If this property is an array, the entire array will be
//       // created by constructPropertyValue()
//       let hierarchy = constructPropertyValue({parts, level: level, value, debug })
//       console.log(`Have new value for ${name}:`, hierarchy);
//       if (debug) {
//         console.log(`Set ${pathFromParts(parts, level, true)} to `, hierarchy);
//       }
//       // Patch up the data behind the scenes
//       vm.$formservice.store.dispatch('setValueFromSeekAction', {vm, parent, name, index: -1, value: hierarchy, debug})
//       return { error: null, data: value}
//     }
//     if (!isFinalPart && updatePath) {
//
//       // This is before the final part, and we are creating the path as we go
//       if (debug) {
//         console.log(`Scenario B - construct ${name} - creating path`);
//       }
//       // Get the value, record, or array for this final property
//       // If this property is an array, the entire array will be
//       // created by constructPropertyValue()
//       let hierarchy = constructPropertyValue({parts, level: level, value, debug })
//       console.log(`Have new value for ${name}:`, hierarchy);
//       if (debug) {
//         console.log(`Set ${pathFromParts(parts, level, true)} to `, hierarchy);
//       }
//       // Patch up the data behind the scenes
//       vm.$formservice.store.dispatch('setValueFromSeekAction', {vm, parent, name, index: -1, value: hierarchy, debug})
//       return { error: null, data: value}
//     }
//
//     // Not found, and we don't want to create it
//     if (debug) {
//       console.log(`Scenario C - ${name} not found`);
//     }
//     return { error: null, data: null }
//   } else {
//
//     // Is found. Is it the right type?
//
//     let isArray = Array.isArray(parent[name])
//     let needArrayElement = (index >= 0)
//
//     // See what we need
//     let need
//     if (index < 0) {
//       need = isFinalPart ? WHATEVER : RECORD
//     } else {
//       need = ELEMENT_IN_ARRAY
//     }
//
//     // Let's see what we have
//     let have
//     if (!parent.hasOwnProperty(name)) {
//       have = NOTHING
//     } else if (Array.isArray(parent[name])) {
//       have = ARRAY
//     } else if (typeof(parent[name]) === 'object')
//       have = RECORD
//     } else {
//       have = PROPERTY
//     }
//
//
//     // Okay, let's see if we can get the required path
//     if (need === ELEMENT_IN_ARRAY) {
//
//       // See what we have
//       switch (have) {
//         case NOTHING:
//           return upset_needElementInArray_haveNothing{vm, operation, parent, parts, level, updatePath, value, debug })
//
//         case ARRAY:
//           let arr = parent[name]
//           if (index >= arr.length) {
//             return upset_needElementInArray_pastEndOfArray{vm, operation, parent, parts, level, updatePath, value, debug })
//           }
//           // We found the required element in the array
//           // Continue on to the next level...
//           let recordInArray = arr[index]
//           if (isFinalPart) {
//             return foundIt()
//           }
//           return seek_and_you_will_find({vm, operation, parent: obj, parts, level: level + 1, updatePath, value, debug })
//
//         case RECORD:
//           return upset_needElementInArray_haveRecord{vm, operation, parent, parts, level, updatePath, value, debug })
//
//         case PROPERTY:
//           return upset_needElementInArray_haveNothing{vm, operation, parent, parts, level, updatePath, value, debug })
//       }
//
//     } else if (need === RECORD) {
//
//       // See what we have
//       switch (have) {
//         case NOTHING:
//           return upset_needRecord_haveNothing{vm, operation, parent, parts, level, updatePath, value, debug })
//
//         case ARRAY:
//           return upset_needRecord_haveArray{vm, operation, parent, parts, level, updatePath, value, debug })
//
//         case RECORD:
//           // All good, record found
//           whatWeFound = parent[name]
//           // continue on to the next level...
//           break
//
//         case PROPERTY:
//           return upset_needRecord_haveArray{vm, operation, parent, parts, level, updatePath, value, debug })
//       }
//
//     } else { // need === WHATEVER
//
//       // We are in the final part. This is the thing we want to operate on
//       switch (have) {
//         case NOTHING:
//           foundIt_nothing()
//           break;
//
//         case ARRAY:
//           // If past end of array:
//           //
//           // If in array:
//           break;
//
//         case RECORD:
//         case PROPERTY:
//           //
//       }
//
//     }
//
//     if (isArray && needArrayElement) {
//
//       // 1. We are looking for a specific element in an array, and
//       // 2. We have an array!
//       let arr = parent[name]
//       if (index >= arr.length) {
//
//         // Array is too short
//         console.log(`Array is too short`);
//         if (isFinalPart) {
//
//           // Final value beyond end of array
//           // Add it if possible
//           if (debug) {
//             console.log(`Scenario D1 - ${name}[${index}]: final value beyond end of array`);
//           }
//           if (value) {
//
//             // Final part - array too short, have final value
//             if (debug) {
//               console.log(`D1a - Set value with mutation`);
//             }
//             // The mutation will increase the array size
//             // mutation (parent, name, index, value)
//             // Patch up the data behind the scenes
//             vm.$formservice.store.dispatch('setValueFromSeekAction', {vm, parent, name, index, value: value, debug})
//             return { error: null, data: value}
//           } else {//- !value
//
//             // Final part - array too short, but don't have value
//             console.log(`D1b - No value to set`);
//             return { error: null, data: value}
//           }
//
//         } else {//- !finalPart
//
//           // Before the final part - array too short, create new record
//           if (debug) {
//             console.log(`Scenario D2 - ${name}[${index}]: beyond end of array`);
//           }
//           let hierarchy = constructPropertyValue({parts, level: level, value, debug })
//           console.log(`Have new value for ${name}[${index}]:`, hierarchy);
//           // Mutation will increase array size
//           // mutation (parent, name, index, hierarchy)
//           vm.$formservice.store.dispatch('setValueFromSeekAction', {vm, parent, name, index, value: hierarchy, debug})
//           return { error: null, data: value}
//         }
//       } else {//- after end of array
//
//         // Found in array
//         if (debug) {
//           console.log(`Scenario D3 - ${name}[${index}] found`);
//         }
//         obj = arr[index]
//       }
//     } else if (!isArray && !needArrayElement) {
//
//       // 1. We have a property that is not an array, and
//       // 2. We are not looking for an element in an array
//       if (debug) {
//         console.log(`Scenario E - ${name} found in record`);
//       }
//       obj = parent[name]
//     } else if (needArrayElement) {
//
//       // Looking for an array, but found a property
//       // 1. We are looking for a specific element in an array, and
//       // 2. This is a property, not an array.
//       switch (operation) {
//         case 'find':
//         case 'delete':
//           // Required value not found
//           if (debug) {
//             console.log(`Scenario E1 - ${name}[${index}] not found`);
//           }
//           return { error: null, data: null };
//
//         case 'find-or-create':
//         case 'save':
//           if (debug) {
//             console.log(`Scenario E2 - ${name}[${index}] is being replaced`);
//           }
//           console.error(`WARNING: replacing an existing property with an array ${pathFromParts(parts, length, true)}`}
//           let hierarchy = constructPropertyValue({parts, level: level, value, debug })
//           console.log(`Have new value for ${name}[${index}]:`, hierarchy);
//           // Mutation will increase array size
//           // mutation (parent, name, index, hierarchy)
//           vm.$formservice.store.dispatch('setValueFromSeekAction', {vm, parent, name, index: -1, value: hierarchy, debug})
//           return { error: null, data: value}
//       }
//     } else { // isArray && !needArrayElement
//
//       // Found an array, but we aren't specifically looking for an element in an array.
//       switch (operation) {
//         case 'find':
//           // Array is okay
//           obj = parent[name]
//           // Carry on
//           break;
//
//
//         case 'delete':
//           // Required value not found
//           if (debug) {
//             console.log(`Scenario E1 - ${name}[${index}] not found`);
//           }
//           return { error: null, data: null };
//
//         case 'find-or-create':
//         case 'save':
//           if (debug) {
//             console.log(`Scenario E2 - ${name}[${index}] is being replaced`);
//           }
//
//
//       // Either converting an array to a value, or visa versa
//       //ZZZZZ Need to handle clobbering
//       if (isArray) {
//         return { error: 'trying to replace an existing array with a value', data: null }
//       } else {
//       }
//     }
//   }
//
//   // We have an object, either a record in an array, or a property
//   console.log(`Checking obj`, obj);
//   if (isFinalPart) {
//     if (debug) {
//       console.log(`Scenario F - found target`);
//     }
//     return { error: null, data: obj }
//   }
//
//   // We found what we need at this level. Let's move on.
//   return seek_and_you_will_find({vm, operation, parent: obj, parts, level: level + 1, updatePath, value, debug })
// }

// // Can't find property
// let property = prostheticProperty(parts, level)
// commit('setProperty', { parent: data, name: parts[level].name, property })
//
// // Can't find list
// commit('insertIntoList', { parent: data, name: parts[level].name, property })
//
// // Item not in list
// commit('insertIntoList', { parent: data, name: parts[level].name, property })
//
// // This gets the value of the property, but it
// // does not set the property in the parent record.
// function constructFinalProperty({vm, parent, parts, level, value, debug }) {
//   return value
// }



//
// When you find something missing, call this to create it.
// The returned object can be inserted into the record or array
// where it belongs with a single mutation call.
//
// vvvvv existing
// a.b.c.x.y[5].z
//       ^^^^^^^^ construct this
//
// vvvvv existing
// a.b.c[3].x.y[5].z
//          ^^^^^^^^ construct this


// Note that this function creates the value of a property,
// but DOES NOT SET THE PROPERTY in the parent object.
function constructPropertyValue({parts, level, value, recordOnly, debug }) {
  if (debug) {
    console.error(`constructPropertyValue(${pathFromParts(parts)}, ${level}, ${describe(value)}, recordOnly=${recordOnly})`, value)
    console.log(`Get value for ${pathFromParts(parts, level)}:`);
  }

  //         v-- is second last
  // a.b.c.x.y.z
  //           ^-- is last
  let isLast = (level === (parts.length - 1))
  let is2ndLast = (level === (parts.length - 2))


  // if (isLast) {
  //   // a.b.c.x.y
  //   //         ^ return the specified value
  //   let name = parts[level].name
  //   return { name, value }
  // }

  if (parts[level].index < 0) {
    /*
     *  This level is a Record
     */
    if (isLast) {
      if (debug) {
        //  a.b.c.x.y
        //          ^ return value
        // Note: does not set y`);
        console.log(`construct scenario 1`);
        console.log(`${pathFromParts(parts)}\n${pathSpaces(parts, level)}^---`)
        console.log(`return value`, value);
      }
      return value
    } else {
      // a.b.c[5].x.y
      //          ^^^ return record { y: ... }
      // Note: does not set 'x'

      let nameY = parts[level + 1].name
      if (debug) {
        console.log(`construct scenario 2 (A or B)`);
        console.log(`${pathFromParts(parts)}\n${pathSpaces(parts, level)}^---`)
        console.log(`return record { ${nameY}: ... }`);
      }
      let valueY = constructPropertyValue({parts, level: level + 1, value, recordOnly: false, debug})
      if (valueY === undefined) {
        // We're creating the path, but not the final value
        // Y must have been the final part of the path, and no value was provided.
        if (debug) {
          console.log(`construct scenario 2A - no value provided for ${nameY}`);
        }
        return { }
      } else {

        // Have a value for Y
        if (debug) {
          console.log(`construct scenario 2B - found a value for ${nameY}`);
        }
        let recordX = { }
        recordX[nameY] = valueY
        return recordX
      }
    }//- !isLast
  } else {

    /*
     *  This level is a List (Array)
     */
    // Create a nice new list, containing the minimum number of [empty] records.

    if (isLast) {
      // a.b.c.x.y[n]
      //          ^^^ create a list [{}, {},... value] (value must be an object)
      // Note: does not set y.
      if (typeof(value) === 'undefined') {
        // We'll just add an empty new record
        if (debug) {
          console.log(`construct scenario 3A - no value specified`);
          console.log(`${pathFromParts(parts)}\n${pathSpaces(parts, level, true)}^---`)
          console.log(`return [{}, {},...]`)
        }
        value = { }
      } else if (typeof(value) !== 'object' || Array.isArray(value)) {
        // This should not happen. Should be already checked.
        throw new Error('Internal error hs77y29: trying to set non-object')
      } else {

        // We'll use the supplied value as the new record
        if (debug) {
          console.log(`construct scenario 3B - value specified`);
          console.log(`${pathFromParts(parts)}\n${pathSpaces(parts, level, true)}^---`)
          console.log(`return [{}, {},..., value] (value is an object)`)
        }
      }

      // Maybe we don't want the entire array (list)
      if (recordOnly) {
        console.error(`MAGIC MAGIC LET THERE BE MAGIC`);
        return value
      }

      // Create the list
      let n = parts[level].index
      let listX = [ ]
      for (var i = 0; i < n; i++) {
        listX.push({ })
      }
      listX.push(value)
      return listX
    } else { // !isLast

      // a.b.c[n].x.y
      //      ^^^^^++ create a list [... { x: ... }]
      // Note: does not set c.
      //
      // a.b.c.x[n].y
      //        ^^^^^ create a list [... { y: ... }]
      // Note: does not set x.

      if (recordOnly) {

        // Return the new record only (that belongs in an array)
        let nameY = parts[level+1].name
        console.log(`construct scenario 4`);
        console.log(`${pathFromParts(parts)}\n${pathSpaces(parts, level, true)}^---`)
        console.log(`create a record { ${nameY}: ... }`)
        let valueY = constructPropertyValue({parts, level: level + 1, value, recordOnly: false, debug})
        console.error(`YOYOYOYOYOYOYOYOYO`, valueY);
        let newRecord = { }
        newRecord[nameY] = valueY
        console.error(`YOYOYOYOYOYOYOYOYO`, newRecord);
        return newRecord

      } else {

        // Return a new array, including the new record

        // Set the 'y' value in record 'x'
        let nameY = parts[level+1].name
        console.log(`construct scenario 5 (A or B)`);
        console.log(`${pathFromParts(parts)}\n${pathSpaces(parts, level, true)}^---`)
        console.log(`create a list [..., {${nameY}: ...}]`)
        let valueY = constructPropertyValue({parts, level: level + 1, value, recordOnly: false, debug})

        // Create the new array, containing the new record
        let n = parts[level].index
        let listX = [ ]
        for (var i = 0; i <= n; i++) {
          listX.push({ })
        }
        let record = listX[n]

        // If we have a value, put it in the new record in the new array
        if (valueY === undefined) {
          console.log(`construct scenario 5A - no value was provided for ${nameY}`);
          // We're creating the path, but not the final value.
          // Y must have been the final part of the path, and no value was provided.
        } else {
          console.log(`construct scenario 5B - found value for ${nameY}`);
          record[nameY] = valueY
        }
        return listX
      }
    }//- !isLast
  }
}



// function constructListProperty({vm, parent, parts, level, value, debug }) {
// /* We're creating an array
//  *
//  *    [
//  *      ...
//  *      {
//  *        y: only set if value provided
//  *      }
//  *    ]
//  */
// }
//
//
//
// function prosthetic({vm, parent, parts, level, value, debug }) {
//
//   if (level === parts.length - 1) {
//     // Final part of path - the actual record or value (not an array)
//     if (parts[level].index < 0) {
//       // a.b.c.x.y
//       //         ^ creating this
//     } else {
//       // a.b.c.x[5].y
//       //        ^^^^^ creating this
//       /* We're creating an array
//        *
//        *    [
//        *      ...
//        *      {
//        *        y: only set if value provided
//        *      }
//        *    ]
//        */
//       let list =
//     }
//
//   } else {
//
//   if (parts[level].index < 0) {
//     // a.b.c.x.y
//     //       ^^^ creating this
//   } else {
//     // a.b.c[5].x.y
//     //      ^^^^^^^ creating this
//     /* We're creating an array
//      *
//      *    [
//      *      ...
//      *      value|record,
//      *    ]
//      */
//     let list =
//   }
//
//   let node = prosthetic({vm, parent, parts, level + 1, updatePath, debug })
//
//   if ()
// }
// function prostheticList({vm, parent, parts, level, updatePath, debug }) {
//   let list = [ ]
//
// }
//
// //mutations
//
//
// function seek_parent({commit}, {vm, data, parts, level, updatePath, debug }) {
//   if (debug) {
//     console.log(`seek_parent(${pathFromParts(parts, level)})`);
//   }
//
//   // See if we have what we need
//   let name = parts[level]
//   let index = parts[level]
//
//   // Non-leaf parts will always be either an array or object (record).
//   if (index >= 0) {
//
//     // Require: Record in a list
//     // See if we have a list with the required record in it.
//     if (!data.hasOwnProperty(name)) {0
//
//       // Require: Record in a list
//       // Actual: We don't have a list (or property)
//       if (updatePath) {
//         commit('save', { parent: data, name, index, value: [ ] })
//         return {
//           error: null,
//           record: data,
//           index
//           data: null,
//           commentary: 'Created new list, but did not add anything to the list.'
//         }
//       }
//       return {
//         error: null,
//         data: null,
//         commentary: 'Unknown list ${pathFromParts(parts, level)}'
//       }
//
//     } else if (Array.isArray(data[name])) {
//
//       // Require: Record in a list
//       // Actual: We have a list.
//       let arr = data[name]
//       if (index >= arr.length) {
//         // Actual: The required item is not in the list.
//         return {
//           error: null,
//           data: null,
//           commentary: '${pathFromParts(parts, level)} beyond and of array (${arr.length} records)'
//         }
//       } else {
//         // Actual: The required record is beyond the end of the list.
//           let itemInArray = arr[index]
//           return {
//             error: null,
//             data: itemInArray,
//           commentary: 'Found ${pathFromParts(parts, level)}'
//         }
//       }
//     } else {
//
//       // Require: Record in a list
//       // Actual: The list is not a list.
//       // Maybe we need to convert it (and throw away the old value - yikes)
//       if (updatePath) {
//         console.error(`WARNING: non-list to a list ${pathFromParts(parts, level, true)}`);
//         commit('save', { parent: data, name, index, value: [ ] })
//         return {
//           error: null,
//           data: null,
//           commentary: 'WARNING: Converted non-list to a list (${pathFromParts(parts, level, true)}), but did not add anything to the list.'
//         }
//       }
//       return {
//         error: null,
//         data: null,
//         commentary: 'Requested item is not a list: ${pathFromParts(parts, level, true)}'
//       }
//     }
//
//   } else { // !itemInArray
//
//     // Require: a named property in the current record
//     if (!data.hasOwnProperty(name)) {
//
//       // Actual: Property not found in record
//       return {
//         error: null,
//         data: null,
//         commentary: '${pathFromParts(parts, level)} not found'
//       }
//     } else {
//
//       // Actual: Property found in record
//       return {
//         error: null,
//         data: data[name],
//         commentary: 'Found ${pathFromParts(parts, level)}'
//       }
//     }
//   }
// }//- Seek parent
//
//
// function seek_findOnly({commit}, {vm, operation, data, parts, level, updatePath, value, debug }) {
//   if (debug) {
//     console.log(`seekPath(${pathFromParts(parts, level)})`);
//   }
//
//   // See if we have what we need
//   let name = parts[level]
//   let itemInArray = (index >= 0)
//   let index = parts[level]
//
//   // We treat the final part (leaf) different to the parts in the hierarchy.
//   // Non-leaf parts will always be either an array or object (record).
//   let isFinalPart = (level === (parts.length - 1))
//   if (isFinalPart) {
//
//     /*
//      *  Looking after the final part.
//      *  This is where we find our answer!
//      */
//     if (itemInArray) {
//
//       // Require: Record in a list
//       // See if we have a list with the required record in it.
//       if (!data.hasOwnProperty(name)) {
//
//         // Require: Record in a list
//         // Actual: We don't have a list
//         if (updatePath) {
//           commit('save', { parent: data, name, index, value: [ ] })
//           return {
//             error: null,
//             record: data,
//             index
//             data: null,
//             commentary: 'Created new list, but did not add anything to the list.'
//           }
//         }
//         return {
//           error: null,
//           data: null,
//           commentary: 'Unknown list ${pathFromParts(parts, level)}'
//         }
//
//       } else if (Array.isArray(data[name])) {
//
//         // Require: Record in a list
//         // Actual: We have a list.
//         let arr = data[name]
//         if (index >= arr.length) {
//           // Actual: The required item is not in the list.
//           return {
//             error: null,
//             data: null,
//             commentary: '${pathFromParts(parts, level)} beyond and of array (${arr.length} records)'
//           }
//         } else {
//           // Actual: The required record is beyond the end of the list.
//           let itemInArray = arr[index]
//           return {
//             error: null,
//             data: itemInArray,
//             commentary: 'Found ${pathFromParts(parts, level)}'
//           }
//         }
//       } else {
//
//         // Require: Record in a list
//         // Actual: The list is not a list.
//         // Maybe we need to convert it (and throw away the old value - yikes)
//         if (updatePath) {
//           console.error(`WARNING: non-list to a list ${pathFromParts(parts, level, true)}`);
//           commit('save', { parent: data, name, index, value: [ ] })
//           return {
//             error: null,
//             data: null,
//             commentary: 'WARNING: Converted non-list to a list (${pathFromParts(parts, level, true)}), but did not add anything to the list.'
//           }
//         }
//         return {
//           error: null,
//           data: null,
//           commentary: 'Requested item is not a list: ${pathFromParts(parts, level, true)}'
//         }
//       }
//
//     } else { // !itemInArray
//
//       // Require: a named property in the current record
//       if (!data.hasOwnProperty(name)) {
//
//         // Actual: Property not found in record
//         return {
//           error: null,
//           data: null,
//           commentary: '${pathFromParts(parts, level)} not found'
//         }
//       } else {
//
//         // Actual: Property found in record
//         return {
//           error: null,
//           data: data[name],
//           commentary: 'Found ${pathFromParts(parts, level)}'
//         }
//       }
//     }
//   } else {
//
//     /*
//      *  This is not the final part.
//      *
//      *  e.g.  If path is a.b.c, we are looking for
//      *        b, and then will move on to look for c.
//      */
//      if (itemInArray) {
//        // Require: record in array
//        // See if we have a list with the required record in it.
//        if (!data.hasOwnProperty(name)) {
//        }
//      } else {
//
//        // Require: record or array in this parent.
//        // We know it should be a record, because it contains other
//        // fields (i.e. this is not the final part of the path).
//
//      }
//   }
//
// function seekPath({commit}, {vm, operation, data, parts, level, updatePath, value, debug }) {
//   if (debug) {
//     console.log(`seekPath(${pathFromParts(parts, level)})`);
//   }
//
//   // See if we have what we need
//   let name = parts[level]
//   let index = parts[level]
//
//   // We treat the final part (leaf) different to the parts in the hierarchy.
//   // Non-leaf parts will always be either an array or object (record).
//   let isFinalPart = (level === (parts.length - 1))
//   if (isFinalPart) {
//
//     /*
//      *  Looking after a leaf (final value).
//      */
//     let needArrayElement = (index >= 0)
//
//     if (needArrayElement) {
//
//       // Record in a list
//
//       if (!data.hasOwnProperty(name)) {
//         // We don't have the list (array)
//         // Final part not defined - create a new array
//
//       } else if (Array.isArray(data[name])) {
//         // We have the list.
//       } else {
//         // Have the field, but it's not an array
//
//       }
//
//     } else {
//
//       // We don't need an array, so we can get/set/delete values directly.
//       if (!data.hasOwnProperty(name)) {
//         // Final part not defined
//       } else if (Array.isArray(data[name])) {
//         // Have an array, where
//       } else {
//         // Have a value
//       }
//
//     }
//
//       // Final part, have
//
//
//       if (index) {
//         // Leaf in array
//         // If we are inserting, must be a
//         seek_final_array
//       } else {
//         seek_final_record
//       }
//     } else {
//       // seek_final_missing
//
//     }
//
//       // Found leaf
//       switch (operation) {
//         case 'find':
//         case 'find-or-create':
//           console.log(`201 - found`);
//           return { error: null, data: data[name]};
//
//         case 'save':
//           console.log(`202 - save`);
//           commit('save', { parent: data, name, index, value })
//           return
//
//         case 'delete':
//         console.log(`202 - save`);
//           commit('delete', { parent: data, name, index })
//           return { data: null, error: null }
//
//         default:
//           return { data: null, error: `Unknown operation ${operation}` }
//       }
//   }
//
//
//
//
//   if (!data.hasOwnProperty(name)) {
//
//     if (isFinalPart) {
//       // If the final part is in an array, and we
//     } else {
//
//     }
//
//     /*
//      *  Node is not found
//      */
//     if (index) {
//
//     }
//     switch (operation) {
//       case 'find':
//       case 'find-or-create':
//         return { error: null, data: data[name]};
//
//       case 'save':
//         commit('save', { parent: data, name, index })
//         return
//
//       case 'delete':
//         commit('save', { parent: data, name, index })
//         return
//     }
//   } else if (index >= 0) {
//
//     // Found node. Require an array element.
//     switch (operation) {
//       case 'find':
//       case 'find-or-create':
//         return { error: null, data: data[name]};
//
//       case 'save':
//       case 'delete':
//     }
//   } else {
//
//     // Found exactly what we're looking for.
//     let target = data[name]
//     switch (operation) {
//       case 'find':
//       case 'find-or-create':
//         return { error: null, data: data[name]};
//
//       case 'save':
//       case 'delete':
//     }
//
//   }
//
//
//       // We have the required value
//     }
//     // Value is found
//     switch (operation) {
//       case 'find':
//       case 'find-or-create':
//         return { error: null, data: data[name]};
//
//       case 'save':
//       case 'delete':
//     }
//   }
// }



// Returns { data: Object, error: String }
function findData (parentObject, parts, level, defaultValue) {
  let name = parts[level].name
  let index = parts[level].index
  let isFinalPart = (level >= parts.length - 1)
  // console.log(`||||| findData ${name}[${index}] ${isFinalPart ? '(final)' : ''} in`, parentObject);

  let isHarry = false
  parts.forEach(part => { if (part.name.includes('harry')) isHarry = true; })

  if (isHarry) {
    console.log(`||||| findData ${name}[${index}] ${isFinalPart ? '(final)' : ''} in`, parentObject);
  }


  // See if this is the start of an absolute path
  if (name.startsWith('!')) {
    return { data: null, error: `Invalid path: ${pathFromParts(parts, level)}`}
  }

  // Not an absolute path - find the field within parentObject
  let obj = parentObject[name]


  // Did we find anything?
  if (typeof(obj) === 'undefined') {
    if (isHarry) {
      console.log(`- value ${name}[${index}] ${isFinalPart ? '(final)' : ''} was not found`);
    }

    // If this is actual value missing (not a record or array that contains it)
    // then we might want to define it now, with a null value.
    // console.log(`cif=${defaultValue}, level=${level}, parts.length=${parts.length}`);
    if (isFinalPart) {
    // if (level === parts.length - 1) {
      // console.log(`Final part of path is missing`);
      // This is the final attribute, and it's missing.
      // Perhaps we need to define it now?
      if (typeof(defaultValue) != 'undefined') {
        // console.log(`Defining ${name} with default value ${defaultValue}`);
        // console.log(`parentObject is`, parentObject);
        Vue.set(parentObject, name, defaultValue)
        return {data: defaultValue, error: null }
      }
      return {data: null, error: null }
    } else {

      // We are after a value within an unknown record. If we are given a
      // default value for the final property, we'll need to create this
      // record now, to place it in.
      if (typeof(defaultValue) != 'undefined') {

        console.log(`Defining empty object ${name}`);
        obj = (index >= 0) ? [ { } ] : { }
        Vue.set(parentObject, name, obj)
        // continue on to below...
      } else {

        // Unknown field within the parent object
        return {data: null, error: `Unknown data ${pathFromParts(parts, level)} ZZZZ` }
      }
    }

  } //- object undefined

  if (isHarry) {
    console.log(`- found part ${name}`, obj);
  }


  if (Array.isArray(obj)) {

      /*
       *  Array
       */
      let arr = obj
      // See if we need a specific record in the array.
      if (index < 0) {
        // No index was specified. If this is the final part of the
        // path we can return the array. If not, we'll assume an
        // index of zero.
        if (isFinalPart) {
          return { data: arr, error: null }
        } else {
          console.log(`Assuming an index of zero for ${name}`);
          index = 0
        }
      }

      // Find the record at the required index
      while (arr.length <= index) {
        console.log(`Adding empty object to array`);
        arr.push({ })
      }
      // if (index >= obj.length) {
      //   console.log(`Invalid path ${pathFromParts(parts, level)}: array overflow`);
      //   return { data: null, error: `Array overflow: ${pathFromParts(parts, level)}` }
      // }
      obj = arr[index]
      console.log(`array record at ${index} is `, obj);

      if (isFinalPart) {
        return { data: obj, error: null }
      } else {
        // Move on the the next part of the path
        return findData(obj, parts, level + 1, defaultValue)
      }
  } else {

    /*
     *  Single Record
     */
    // Check we aren't asking for a specific record in an array.
    if (index >= 0) {
      console.error(`Invalid path ${pathFromParts(parts, level)}: is not an array`);
      return { data: null, error: `Expected an array: ${pathFromParts(parts, level)}` }
    }
    if (isFinalPart) {
      return { data: obj, error: null }
    } else {
      // Move on the the next part of the path
      if (isHarry) { console.log(`- found object is ${typeof(obj)}`);}
      if (typeof(obj) != 'object') {
        // How can we find a child, if this isn't an object?
        // Replace the current value with an empty record (object)
        console.error(`${pathFromParts(parts, level)} is type '${typeof(obj)}' - expected an object\nThis will be overwritten.`);
        obj = { }
        Vue.set(parentObject, name, obj)
      }
      return findData(obj, parts, level + 1, defaultValue)
    }
  }
  // Cannot get here
}

/********************************************
 *
 *                 ACTIONS
 *
 ********************************************/
// see https://vuex.vuejs.org/guide/actions.html
export const actions = {
  // scanDocument ({ commit, state }, { vm, docID }) {
  //   console.log(`In Action docservice/scanDocument(docID=${docID})`)
  //
  //   commit('scanState', { currentlyScanning: true, message: 'scanning...'})
  //   vm.$docservice.scanDocument(vm, docID)
  //     .then(result => {
  //       commit('scanState', { currentlyScanning: true, message: 'updating...'})
  //       console.log(`result of save:`, result)
  //
  //       // Wait a while, to give the Google permissions time to propagate
  //       setTimeout(() => {
  //         // console.log(`result of save:`, result.data)
  //         result.forEach(obj => {
  //           console.log(`obj is `, obj);
  //           let originalDocumentID = obj.originalDocumentID
  //           let replacementDocumentID = obj.replacementDocumentID
  //           let userID = null
  //           commit('mapDocument', { originalDocumentID, replacementDocumentID, userID })
  //         })
  //         commit('scanState', { currentlyScanning: false })
  //         commit('refreshMutation', { })
  //       }, 5000)
  //     })
  //     .catch(e => {
  //       commit('scanState', { currentlyScanning: false, message: 'error' })
  //       let desc = `Error scanning document`
  //       console.log(desc, e)
  //       //state.saveMsg = ERROR
  //       // commit('setSaveMsg', { msg: ERROR })
  //       /* handleError(this, desc, params, e) */
  //       //this.selectError = true
  //     })//- axios
  //   // }, SAVE_INTERVAL)
  // },//- scanDocument

  setValueFromSeekAction({commit, state}, {vm, parent, name, index, value, debug}) {
    console.log(`setValueFromSeekAction(name=${name}, index=${index}, value=${describe(value)}`, value)
    commit('setValueFromSeekMutation', { vm, parent, name, index, value, debug })
  },

  deleteValueFromSeekAction({commit, state}, {vm, parent, name, index, debug}) {
    console.log(`deleteValueFromSeekAction(name=${name}, index=${index})`);
    commit('deleteValueFromSeekMutation', {vm, parent, name, index, debug})
  },

  setValue ({ commit, state }, { recordPath, path, value, type }) {
    console.log(`ACTION FormserviceStore.setValue(${recordPath}, ${path}, ${value}, type)`);
    commit('setValueMutation', { recordPath, path, value, type })
  },

  /*
   *  Save a dataset
   */
  saveDatasetAction ({ commit, state }, { vm, path, url }) {
    console.log(`ACTION FormserviceStore.saveDatasetAction(${path}, ${url})`)

    // We might have been passed a path - that's okay - strip off any prefix
    while (path.startsWith('!')) {
      path = path.substring(1)
    }

    let parts = parseDataPath(path)
    console.log(`parts=`, parts);
    if (parts === null) {
      return { data: null, error: `saveDataset: Invalid data path ${path}`} // Parse error already reported
    } else if (parts.length === 0) {
      return { data: null, error: `saveDataset: Invalid data path (${path}): no path specified!` }
    }

    // Check there is actually a name
    let datasetName = parts[0].name
    if (datasetName === '') {
      console.error(`Empty dataset name`);
      return
    }

    // let

    // Find the dataset
    let dataset = state.datasetIndex[datasetName]
    if (!dataset) {
      console.error(`Unknown dataset ${datasetName}`);
console.log(`Index is`, state.datasetIndex);
      return
    }

    console.log(`Saving dataset ${datasetName}.`)
    console.log(` Source=${dataset.source}`)
    console.log(` Data is:`)
    let json = JSON.stringify(dataset.data, null, 2)
    console.log(json);

    if (url) {
      console.log(`Will save to ${url}`);
      axios({
        method: 'post',
        url,
        headers: {
          // 'Authorization': 'Bearer ' + this.$contentservice.jwt,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: json
      })
        .then(response => {
          // JSON responses are automatically parsed.
          console.log(`RESPONSE IS`, response.data)
          // let reply = response.data
          // return resolve('ok');
        })
        .catch(e => {
          axiosError(vm, url, element, e)
          reject(e)
        })
    }



/*
    let parts = parseDataPath(path)
    console.log(`parts=`, parts);

    // Hack test cases for path parsing. During development only.
    // console.log(`parts=`, parseDataPath('~harry'))
    // console.log(`parts=`, parseDataPath(' ! '))
    // console.log(`parts=`, parseDataPath(' ! wally '))
    // console.log(`parts=`, parseDataPath('!first.second[123]'))
    // console.log(`parts=`, parseDataPath(' ! first . second [ 123 ]'))
    // console.log(`parts=`, parseDataPath('!first['))
    // console.log(`parts=`, parseDataPath('!first[123'))
    // console.log(`parts=`, parseDataPath('!first[123]'))
    // console.log(`parts=`, parseDataPath('!first[123]abc'))
    // console.log(`parts=`, parseDataPath('!first[abc]'))
    // console.log(`parts=`, parseDataPath('!first[123].second[456]'))
    // console.log(`parts=`, parseDataPath('!first[123]..second[456]'))
    // console.log(`parts=`, parseDataPath('!first[123].second[456].'))
    if (parts === null) {
      return { data: null, error: `Invalid data path ${path}`} // Parse error already reported
    } else if (parts.length === 0) {
      return { data: null, error: `Invalid data path (${path}): no path specified!` }
    }

console.log(`ok 7`);
    // Check the top level refers to a parcel
    // if (!parts[0].name.startsWith('!')) {
    //   return { data: null, error: `Path must start with ! (${fullPath})`}
    // }
    let datasetName = parts[0].name

    // If we ask for mock data, we always get question marks
    if (datasetName === 'mock') {
      // Mock data, nothing to save
      return { data: '???', error: null }
    }
    let datasetIndex = parts[0].index
    console.log(`ok 8 ${datasetName}[${datasetIndex}]`)

    let parcel = state.datasetIndex[datasetName]
    console.log(`ok 9 parcel=`, parcel);

    // Check the package was found
    if (typeof(parcel) === 'undefined') {
      return { data: null, error: `Unknown dataset: !${datasetName}`}
    }
    console.log(`parcel.data is `, parcel.data);

    // Are we looking for an array?
    let data = parcel.data
    let objectToSave
    if (datasetIndex >= 0) {
      if (Array.isArray(data)) {
        // Have an array
        console.error(`$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$`, data[datasetIndex]);
        if (datasetIndex >= data.length) {
          return { data: null, error: `Array overflow: !${datasetName}[${datasetIndex}]`}
        }
        objectToSave = data[datasetIndex]
      } else {
        // We don't have the array we expected
        return { data: null, error: `Not an array: !${datasetName}[${datasetIndex}]`}
      }
    } else {
      // Expecting a record
      if (Array.isArray(data)) {
        // Bad - we exected an object but got an array
        return { data: null, error: `Did not expect an array: !${datasetName}`}
      } else {
        // Good - we have the record we expected
        objectToSave = parcel.data
      }
    }
*/

  }

}




/********************************************
 *
 *                 MUTATIONS
 *
 ********************************************/
export const mutations = {

  // // Calling this mutation will trigger redrawing of any components
  // // that monitor the value of 'refreshCounter'.
  refreshMutation (state, { }) {
    console.log('In Mutation refreshMutation()', state.refreshCounter)
    state.refreshCounter++
  },


  setValueFromSeekMutation(state, {parent, name, index, value, debug}) {
    if (debug) {
      console.log(`setValueFromSeekMutation(name=${name}, index=${index}, value=${describe(value)}`, value)
    }

    // console.log(`KOOOKOOO 1`);
    if (index < 0) {
      // Set the property in the record
      if (debug) {
        console.log(`Set property ${name} to ${describe(value)}`, value);
      }
      // parent[name] = value
      // console.log(`KOOOKOOO 2`);
      Vue.set(parent, name, value)
    } else {
      // console.log(`KOOOKOOO 3`);
      // Set a value in an array
      if (!Array.isArray(parent[name])) {
        // console.log(`KOOOKOOO 4`);
        // Need to create a new array.
        // Note that this will clobber any non-array property with the same name.
        if (debug) {
          console.log(`Create property ${name} as empty array`)
        }
        // parent[name] = [ ]
        Vue.set(parent, name, [ ])
        // console.log(`KOOOKOOO 5`);
      }
      // console.log(`KOOOKOOO 6`);

      // Check the array is long enough
      let arr = parent[name]
      // console.log(`KOOOKOOO 7`);
      while (arr.length < index) {
        // console.log(`KOOOKOOO 8`);
        console.log(`- add empty record to ${name}[${arr.length}]`);
        arr.push({ })
        //arr.$set(arr.length, { })
      }
      // console.log(`KOOOKOOO 9 ${typeof(arr)}`, arr);
      if (debug) {
        console.log(`Set property ${name}[${index}] to ${describe(value)}`, value);
      }
      //arr[index] = value
      // arr.$set(index, value)
      Vue.set(arr, index, value)
      // console.log(`KOOOKOOO 10`);
    }

    // Update the refresh counter
    state.refreshCounter++

    // Done. Now dump some debug.
    if (debug) {
      if (TESTHACK) {
        let data = state.datasetIndex['test4'].data
        let json = JSON.stringify(data, null, 2)
        console.log(`!test4:`, json)
      } else {
        // let data = state.datasetIndex['test1'].data
        // let json = JSON.stringify(data, null, 2)
        // console.log(`!test1:`, json)
      }
    }
  },


  deleteValueFromSeekMutation(state, {vm, parent, name, index, debug}) {
    if (debug) {
      console.log(`deleteValueFromSeekMutation(name=${name}, index=${index})`);
    }

    if (index < 0) {
      // Delete property
      // https://vuejs.org/v2/api/#Vue-delete
      console.log(`- delete property ${name}`);
      Vue.delete(parent, name)
    } else {
      // Delete record in array
      // https://vuejs.org/v2/api/#Vue-delete
      let arr = parent[name]
      console.log(`- isArray=${Array.isArray(arr)}`);
      console.log(`- delete element ${index} from array`, arr);
      if (index < arr.length) {
        Vue.delete(arr, index)
      }
    }
    state.refreshCounter++
  },

  // DEPRECATED
  setValueMutation (state, { recordPath, path, value, type }) {
    console.log(`MUTATION setValueMutation(${recordPath}, ${path}, ${value} (${typeof(value)}), ${type} (${typeof(type)}) )`);

    // If the path contains multiple parts, shift all but
    // the last across to recordPath.
    let pos = path.lastIndexOf('.')
    if (pos > 0) {
      console.log(`Altering from recordPath=${recordPath}, path=${path}`);
      let toShift = path.substring(0, pos)
      if (toShift.startsWith('!')) {
        // The input field defines an absolute path
        recordPath = toShift
      } else {
        // Record within the relative path
        recordPath += `.${toShift}`
      }
      path = path.substring(pos + 1)
      console.log(`           to recordPath=${recordPath}, path=${path}`);
    }

    // Let's find the record
    console.log(`0. find ${recordPath}`);
    let reply = this.getters.getData(recordPath, { })
    console.log(`1. reply is `, reply);
    if (reply.error) {
      console.error(`2. error is ${reply.error}`);
      return
    }

    // Does the field already exist?
    //findData (record, attribute, level)
    let record = reply.data
    let attribute = path
    if (record.hasOwnProperty(attribute)) {
      let ovalue = record[attribute]
      console.log(`Attribute ${attribute} already exists: ${ovalue} (${typeof(ovalue)})`)
    } else {
      console.log(`New attribute ${attribute}`);
    }
    // if (typeof(ovalue) === 'undefined') {
    //   console.log(`New attribute ${attribute}`);
    // } else {
    //   console.log(`Attribute ${attribute} already exists: ${ovalue} (${typeof(ovalue)})`)
    // }
    record[attribute] = value
    console.log(`Now set to ${record[attribute]} (${typeof(record[attribute])})`);
    state.refreshCounter++
  },

  // scanState(state, { currentlyScanning, message }) {
  //   state.currentlyScanning = currentlyScanning
  //   state.scanMessage = currentlyScanning ? message : ''
  // }

}//- mutations


export const namespaced = true




export default {
  "namespaced": true,
  state,
  mutations,
  getters,
  actions,
}
