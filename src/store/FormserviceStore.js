import { parseDataPath } from '../lib/navigation.js'


// initial state
export const state = () => {
  return {

    //
    datasetIndex : {
      /*
       *  Each parcel contains: name, schema, layout, and data
      */
      'test1' : {
        name: 'test1',
        source: 'testdata://mytestdata',
        data: [
          {
            firstname: 'Fred',
            lastname: 'Bloggs'
          },
          {
            firstname: 'Mary',
            lastname: 'Jones',
            //ZZZZZ
            tTenantName: 'Madam Tenant',
            tTenantAdd1: 'First House',
            tTenantAdd2: 'Down the Road',
            tTenantAdd3: 'And around the corner',
            tTenantPCode: '1234',
            x: 'x-value',
          }
        ],

        schema: null,

        layout: null
      },

      'test2' : {
        name: 'test2',
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
    currentlyScanning: false,
    scanMessage: ''

  }
}



/********************************************
 *
 *                 GETTERS
 *
 ********************************************/
export const getters = {
  // replacementDocID: (state) => (docID, userID) => {
  //   console.log(`GETTER replacementDocID(${docID}, ${userID})`);
  //   let replacement = state.documentMap[docID]
  //   if (replacement && state.refreshCounter > 1) {
  //     console.log(`Found replacement document ${replacement.docID}`);
  //     return replacement.docID
  //   }
  //   return docID
  // }

  // Returns { data: Object, error: String }
  getData: (state) => (recordPath, path) => {
    console.log(`/------------------------------------------`);
    console.log(`GETTER getData(${recordPath}, ${path})`);
    // let replacement = state.documentMap[docID]
    // if (replacement && state.refreshCounter > 1) {
    //   console.log(`Found replacement document ${replacement.docID}`);
    //   return replacement.docID
    // }
    // let fullPath = path.startsWith('!') ? path : `${recordPath}.${path}`
    let fullPath = `${recordPath}.${path}`
    let parts = parseDataPath(fullPath)
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
      return null // Parse error already reported
    } else if (parts.length === 0) {
      console.error(`Invalid data path (${fullPath}): no path specified!`);
    }

console.log(`ok 7`);
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
    if (datasetIndex >= 0) {
      if (Array.isArray(data)) {
        if (datasetIndex >= data.length) {
          return { data: null, error: `Array overflow: !${datasetName}[${datasetIndex}]`}
        }
        console.error(`$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$`, data[datasetIndex]);
        return findData(data[datasetIndex], parts, 1)
      } else {
        return { data: null, error: `Not an array: !${datasetName}[${datasetIndex}]`}
      }
    }

    // Expecting a record
    if (Array.isArray(data)) {
      return { data: null, error: `Did not expect an array: !${datasetName}`}
    } else {
      return findData(parcel.data, parts, 1)
    }

    // Cannot get here
  }

}

// Returns { data: Object, error: String }
function findData (parentObject, parts, level) {
  // console.log(`||||| findData. parentObject=`, parentObject);
  // console.log(`||||| findData. parts=`, parts);
  // console.log(`||||| findData. level=`, level);

  let name = parts[level].name
  let index = parts[level].index
  let isFinalPart = (level >= parts.length - 1)
  // console.log(`||||| findData ${name}[${index}] ${isFinalPart ? '(final)' : ''} in`, parentObject);


  // See if this is the start of an absolute path
  // let obj = null
  if (name.startsWith('!')) {
    return { data: null, error: `Invalid path: ${pathFromParts(parts, level)}`}
  }

  // Not an absolute path - find the field within parentObject
  let obj = parentObject[name]


  // Did we find anything?

  // if (level === 0) {
  //   obj = obj.data
  // }
  if (typeof(obj) === 'undefined') {

    // Unknown field within the parent object
    // console.error(`NOIT FOUDD ZAZWDDSD`, name);
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
        return findData(obj, parts, level + 1)
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
      return findData(obj, parts, level + 1)
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
  scanDocument ({ commit, state }, { vm, docID }) {
    console.log(`In Action docservice/scanDocument(docID=${docID})`)

    commit('scanState', { currentlyScanning: true, message: 'scanning...'})
    vm.$docservice.scanDocument(vm, docID)
      .then(result => {
        commit('scanState', { currentlyScanning: true, message: 'updating...'})
        console.log(`result of save:`, result)

        // Wait a while, to give the Google permissions time to propagate
        setTimeout(() => {
          // console.log(`result of save:`, result.data)
          result.forEach(obj => {
            console.log(`obj is `, obj);
            let originalDocumentID = obj.originalDocumentID
            let replacementDocumentID = obj.replacementDocumentID
            let userID = null
            commit('mapDocument', { originalDocumentID, replacementDocumentID, userID })
          })
          commit('scanState', { currentlyScanning: false })
          commit('refreshMutation', { })
        }, 5000)
      })
      .catch(e => {
        commit('scanState', { currentlyScanning: false, message: 'error' })
        let desc = `Error scanning document`
        console.log(desc, e)
        //state.saveMsg = ERROR
        // commit('setSaveMsg', { msg: ERROR })
        /* handleError(this, desc, params, e) */
        //this.selectError = true
      })//- axios
    // }, SAVE_INTERVAL)
  },//- scanDocument


  /*
   *  Save a dataset
   */
  saveDatasetAction ({ commit, state }, { vm, path }) {
    console.log(`ACTION FormserviceStore.saveDatasetAction(${path})`)

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

    // Find the dataset
    let dataset = state.datasetIndex[datasetName]
    if (!dataset) {
      console.error(`Unknown dataset ${datasetName}`);
console.log(`Index is`, state.datasetIndex);
      return
    }

    console.log(`Saving dataset ${datasetName}. Source=${dataset.source}. Data is `, dataset.data)









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

  // Calling this mutation will trigger redrawing of any components
  // that monitor the value of 'refreshCounter'.
  refreshMutation (state, { }) {
    console.log('In Mutation refreshMutation()', state.refreshCounter)
    state.refreshCounter++
  },


  scanState(state, { currentlyScanning, message }) {
    state.currentlyScanning = currentlyScanning
    state.scanMessage = currentlyScanning ? message : ''
  }


}//- mutations


export const namespaced = true




export default {
  "namespaced": true,
  state,
  mutations,
  getters,
  actions,
}
