import Vue from 'vue'
import axios from 'axios'
import axiosError from '../lib/axiosError.js'

import { parseDataPath } from '../lib/navigation.js'


// initial state
export const state = () => {
  return {

    //
    datasetIndex : {
      'test1' : {
        name: 'test1',
        source: 'testdata://test1',
        data: { },
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
      }


    },

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
    console.log(`/------------------------------------------`);
    console.log(`GETTER getData(${recordPath}, defaultValue=${defaultValue})`);

    let fullPath = `${recordPath}`
    let parts = parseDataPath(fullPath)

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
    if (!parts[0].name.startsWith('!')) {
      return { data: null, error: `Path must start with ! (${fullPath})`}
    }
    let datasetName = parts[0].name.substring(1)

    // If we ask for mock data, we always get question marks
    if (datasetName === 'mock') {
      return { data: '???', error: null }
    }
    let datasetIndex = parts[0].index

    let parcel = state.datasetIndex[datasetName]

    // Check the package was found
    if (typeof(parcel) === 'undefined') {
      return { data: null, error: `Unknown dataset: !${datasetName}`}
    }

    // Are we looking for an array?
    let data = parcel.data
    if (datasetIndex >= 0) {
      if (Array.isArray(data)) {
        if (datasetIndex >= data.length) {
          console.log(`result: Array overflow: !${datasetName}[${datasetIndex}]`)
          return { data: null, error: `Array overflow: !${datasetName}[${datasetIndex}]`}
        }
        // Have the record in the array
        if (parts.length === 1) {
          console.log(`result: found record in array (top of dataset)`)
          return data[datasetIndex]
        } else {
          console.log(`found record in array. Now look for children`);
          // console.error(`$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$`, data[datasetIndex]);
          let result = findData(data[datasetIndex], parts, 1, defaultValue)
          console.log(`result: Found ${fullPath}`, result)
          return result
        }
      } else {
        console.log(`result: Not an array: !${datasetName}[${datasetIndex}]`)
        return { data: null, error: `Not an array: !${datasetName}[${datasetIndex}]`}
      }
    }

    // Expecting a record
    if (Array.isArray(data)) {
      console.log(`result: Did not expect an array: !${datasetName}`)
      return { data: null, error: `Did not expect an array: !${datasetName}`}
    } else {
      // Have the record
      if (parts.length === 1) {
        console.log(`result: Found record (top of dataset)`)
        return parcel.data
      } else {
        console.log(`Found record. Now look for children`)
        let result = findData(parcel.data, parts, 1, defaultValue)
        console.log(`result: found ${fullPath}`, result);
        return result
      }
    }

    // Cannot get here
  },

}



// Returns { data: Object, error: String }
function findData (parentObject, parts, level, defaultValue) {
  let name = parts[level].name
  let index = parts[level].index
  let isFinalPart = (level >= parts.length - 1)
  // console.log(`||||| findData ${name}[${index}] ${isFinalPart ? '(final)' : ''} in`, parentObject);


  // See if this is the start of an absolute path
  if (name.startsWith('!')) {
    return { data: null, error: `Invalid path: ${pathFromParts(parts, level)}`}
  }

  // Not an absolute path - find the field within parentObject
  let obj = parentObject[name]


  // Did we find anything?
  if (typeof(obj) === 'undefined') {

    // If this is actual value missing (not a record or array that contains it)
    // then we might want to define it now, with a null value.
    console.log(`cif=${defaultValue}, level=${level}, parts.length=${parts.length}`);
    if (level === parts.length - 1) {
      console.log(`Final part of path is missing`);
      // This is the final attribute, and it's missing.
      // Perhaps we need to define it now?
      if (typeof(defaultValue) != 'undefined') {
        console.log(`Defining ${name} with default value ${defaultValue}`);
        Vue.set(parentObject, name, defaultValue)
        return {data: defaultValue, error: null }
      }
      return {data: null, error: null }
    }

    // Unknown field within the parent object
    return {data: null, error: `Unknown data ${pathFromParts(parts, level)} ZZZZ` }
  }

  console.log(`+++>>> found part ${name}`, obj);

  if (Array.isArray(obj)) {

      /*
       *  Array
       */
      // See if we need a specific record in the array.
      if (index < 0) {
        // No index was specified. If this is the final part of the
        // path we can return the array. If not, we'll assume an
        // index of zero.
        if (isFinalPart) {
          return obj
        } else {
          console.log(`Assuming an index of zero for ${name}`);
          index = 0
        }
      }

      // Find the record at the required index
      if (index >= obj.length) {
        console.log(`Invalid path ${pathFromParts(parts, level)}: array overflow`);
        return { data: null, error: `Array overflow: ${pathFromParts(parts, level)}` }
      }
      obj = obj[index]
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
      return findData(obj, parts, level + 1, defaultValue)
    }
  }
  // Cannot get here
}

function pathFromParts(parts, level) {
  console.log(`pathFromParts(parts, ${level})`, parts);
  let path = ''
  for (let i = 0; (level >= 0 && i <= level) && level < parts.length; i++) {
    let part = parts[i]
    if (i > 0) {
      path += '.'
    }
    path += part.name
    if (part.index >= 0) {
      path += `[${part.index}]`
    }
  }
  console.log(`--- ${path}`);
  return path
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

  setValueMutation (state, { recordPath, path, value, type }) {
    console.log(`MUTATION setValueMutation(${recordPath}, ${path}, ${value} (${typeof(value)}), type})`);
    let attribute = path

    // Let's find the record
    let record = this.getters.getData(recordPath, false)
    console.log(`record is `, record);

    // Does the field already exist?
    //findData (record, attribute, level)
    let ovalue = record[attribute]
    if (typeof(ovalue) === 'undefined') {
      console.log(`New attribute ${attribute}`);
    } else {
      console.log(`Attribute ${attribute} already exists: ${ovalue} (${typeof(ovalue)})`)
    }
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
