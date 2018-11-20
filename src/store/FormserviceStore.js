// initial state
export const state = () => {
  return {

    // dataId -> Array[{ name <String>, source <String>, data <Object> }]
    // Data is referred to with !
    dataIndex: {
      '!test' : {
        name: '!test',
        source: 'testdata://',
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
            tTenantPCode: '1234'
          }
        ]
      }
    },

    // schemaId -> Array[Object]
    // Data is referred to with @
    schemaIndex: [ ],

    // viewId -> Array[Object]
    // Data is referred to with #
    viewIndex: [ ],

    // original-document-id -> { userId, docID }
    documentMap: {
      // '1ESlBwmpaCcKm7prdeCKJfVXn6hhddXn7Y6c3XLcYgis': {
      //   docID: '161rGTvEyrk2XKUmHnf54Lh1RRntvG-q_E2s4hZrx_wA', userID: null
      // },
      '1sPBBmWIVvj-ytaAgfer0-j_3eHRXba6UMIo86Ov_ml4': {
        docID: '1GtiF5fM72nok7uXCrOSX13h1DciyxY78bwoqYsIIf6Y', userID: null
      },
      '16qDqMZdIX7VY7Ka4n4k14PuVhlu5KBxv03WOeytFNl4': {
        docID: '1RB5z_EHJhqdA35NFuE9Pf-LpMnwp5soEaPcS1urg8Aw', userID: null
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

  getData: (state) => (recordPath, path) => {
    console.log(`/------------------------------------------`);
    console.log(`GETTER getData(${recordPath}, ${path})`);
    // let replacement = state.documentMap[docID]
    // if (replacement && state.refreshCounter > 1) {
    //   console.log(`Found replacement document ${replacement.docID}`);
    //   return replacement.docID
    // }
    let fullPath = path.startsWith('!') ? path : `${recordPath}.${path}`
    let parts = parseDataPath(fullPath)
    // console.log(`parts=`, parts);

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
      return null // Error already reported
    } else if (parts.length === 0) {
      console.error(`Invalid data path (${fullPath}): no path specified!`);
    }

    let data = findData(state.dataIndex, parts, 0)
    return data


    // return 'Jumbobat'
  }

}

function parseDataPath (path) {
  console.log(`--- parseDataPath(${path})`);
  path = path.trim()
  if (!path.startsWith('!')) {
    console.error(`Invalid data path (${path}): must start with '!'.`);
    return null
  } else if (path === '!') {
    console.error(`Invalid data path (${path}): must have a name.`);
    return null
  }

  // let p = path.substring(1)
  let p = path
  let parts = [ ]
  for ( ; ; ) {
    // Check for nothing left (after a trainling dot)
    if (p === '') {
      return parts
    }

    let pos = p.indexOf('.')
    if (pos < 0) {

      // There is no next dot. Everything left is a part spec.
      let part = parseDataPart(p)
      if (part) {
        parts.push(part)
        return parts
      } else {
        return null // error already reported
      }
    } else if (pos === 0) {
      // Have multiple consecutive dots, ignore this one.
      p = p.substring(1)
    } else {

      // Parse up to the next dot
      let spec = p.substring(0, pos)
      p = p.substring(pos)
      let part = parseDataPart(spec)
      if (part) {
        parts.push(part)
      } else {
        return null // error already reported
      }

    }
  }
}

// Parse a specification of the form <name> or <name>[index].
function parseDataPart (spec) {

  // Check for '['
  spec = spec.trim()
  let openBracketPos = spec.indexOf('[')
  if (openBracketPos < 0) {

    // Default index of 0
    console.log(`parseDataPart: default index: ${spec}`)
    return { name: spec, index: -1}
  } else {

    // Specify an index
    console.log(`parseDataPart: with index: ${spec}`);
    let name = spec.substring(0, openBracketPos)
    let indexSpec = spec.substring(openBracketPos)
    console.log(`indexSpec=${indexSpec}`)
    // Check for ']'
    let closeBracketPos = indexSpec.indexOf(']')
    if (closeBracketPos < 0) {
      console.error(`Invalid path component(${spec}), expected ']'`);
      return null
    } else if (closeBracketPos != indexSpec.length - 1) {
      console.error(`Invalid path component(${spec}), unexpected char after ']'`);
      // console.log(`closeBracketPos=${closeBracketPos}, indexSpec.length - 1`);
      return null
    }
    // Convert to a number
    indexSpec = indexSpec.substring(1, closeBracketPos).trim()
    console.log(`indexSpec=${indexSpec}`)
    let index = parseInt(indexSpec)
    if (isNaN(index)) {
      console.error(`Invalid path component(${spec}), non-integer index.`)
    }
    return { name, index }
  }
}

function findData (parentObject, parts, level) {
  // console.log(`||||| findData. parentObject=`, parentObject);
  // console.log(`||||| findData. parts=`, parts);
  // console.log(`||||| findData. level=`, level);
  let name = parts[level].name
  let index = parts[level].index
  let isFinalPart = (level >= parts.length - 1)
  console.log(`||||| findData ${name}[${index}] in`, parentObject);

  let obj = parentObject[name]
  if (level === 0) {
    obj = obj.data
  }
  if (typeof(obj) === 'undefined') {
    console.error(`NOIT FOUDD ZAZWDDSD`, name);
    return null
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
        return null
      }
      obj = obj[index]
      console.log(`array record at ${index} is `, obj);

      if (isFinalPart) {
        return obj
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
      return null
    }
    if (isFinalPart) {
      return obj
    } else {
      // Move on the the next part of the path
      return findData(obj, parts, level + 1)
    }
  }

  // let index = parts[level].index
  return 'chickenSuzz'
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

  mapDocument(state, { originalDocumentID, replacementDocumentID, userID }) {
    console.log(`MUTATION mapDocument ${originalDocumentID} -> ${replacementDocumentID}`);
    state.documentMap[originalDocumentID] = {
      docID: replacementDocumentID,
      userID: null
    }
    console.log(`map is now`, state.documentMap);
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
