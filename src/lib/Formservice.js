/*
 *  Client API for Formservice
 *  See https://formservice.io
 */
import axios from 'axios'
import axiosError from './axiosError.js'
import { assert, inBrowser } from '../components/misc'
import { describe } from '../lib/navigation.js'


// IF_WE_CALL_AN_API
const DEFAULT_ENDPOINT = 'api.mysite.com'


class Formservice {

  constructor (options) {
    if (!options) {
      console.error(`Formservice was passed null options, so will be disabled.`)
      this.disabled = true
      return
    }
    this.disabled = false

    // IF_WE_CALL_AN_API
    this.host = options.host ? options.host : DEFAULT_ENDPOINT
    this.port = options.port ? options.port : 80
    this.version = options.version ? options.version : '2.0'
    this.apikey = options.apikey

    // Remember the options
    this.options = options

    this.zzzSnurg = 123
  }

  init (app /* Vue component instance */) {
    console.log('&&& Formservice.init')

    process.env.NODE_ENV !== 'production' && assert(
      install.installed,
      `not installed. Make sure to call \`Vue.use(Formservice)\` ` +
      `before creating root instance.`
    )
  }

  //----------------------------------------------------------------------------//
  //                         IF WE CALL AN API - start                          //
  //----------------------------------------------------------------------------//
  endpoint () {
    // console.log('endpoint():', this)
    const protocol = this.protocol ? this.protocol : 'http'
    const endpoint = `${protocol}://${this.host}:${this.port}/api/${this.version}/${this.apikey}`
    return endpoint
  }

  //
  //  Operation (String):
  //    find - just look for the value
  //    find-or-create - if not found, create it
  //    save - create or overwrite the value
  //    delete - remove the value
  //
  //  Path must be absolute (starting with a !)

  //  updatePath - create all nodes down to, but excluding the final
  //  node in the path (operation says what to do with the final node).
  //
  //  value:
  //    "array" - Same as [].
  //    "record" or "object" - Same as {}.
  //     null - the field is created as null
  //  If this parameter is not specified or 'undefined' then null is used.
  //
  //  Debug - print out messages along the way
  //
  find({ vm, path, debug }) {
    if (debug) {
      console.error(`Formservice.find(${path})`);
    }
    return this.store.getters.seek({vm, operation: 'find', path, debug})
  }
  findOrCreate({vm, path, updatePath, value, debug }) {
    if (debug) {
      console.error(`Formservice.findOrCreate(${path}, updatePath=${updatePath}, value=${describe(value)}):`, value);
    }
    return this.store.getters.seek({vm, operation: 'find-or-create', path, updatePath, value, debug })
  }
  save({vm, path, updatePath, value, debug }) {
    if (debug) {
      console.error(`Formservice.save(${path}, updatePath=${updatePath}, value=${describe(value)}):`, value);
    }
    return this.store.getters.seek({vm, operation: 'save', path, updatePath, value, debug })
  }
  delete({vm, path, debug}) {
    if (debug) {
      console.error(`Formservice.delete(${path}`)
    }
    return this.store.getters.seek({vm, operation: 'delete', path, debug})
  }
  // seek(params) {
  //   alert(`Formservice.seek is deprecated`)
  //   return null
  // }

  // Obsolete?
  getData (path, defaultValue) {
    if (path.includes('harry')) {
      console.log(`FormserviceLib.getData(${path}, ${defaultValue})`);
      console.log(`typeof(defaultValue)=${typeof(defaultValue)}`);
    }
    // if (!path) {
    //   return null
    // }
    return this.store.getters.getData(path, defaultValue)
  }

  setValue (recordPath, path, value, type) {
    console.error(`Formservice.setValue(${recordPath}, ${path}, '${value}', ${type})`);
    if (!path) {
      return null
    }
    return this.store.dispatch('setValue', { recordPath, path, value, type })
  }

  // Convenience function - ask the store to save a specific dataset
  // Same parameters as the store action
  saveDataset({ path, url }) {
    this.store.dispatch('saveDatasetAction', { vm: this, path, url })
  }


  /*
   *  Call an API
   */
  myApiCall (vm, { param1, param2 }) {

    console.log(`Formservice.js:update()`, element)
    console.log(`element.description.length=`, element.description.length)

    return new Promise((resolve, reject) => {

      if (this.options.debug) {
        console.log('myApiCall()');
      }
      if (this.disabled) {
        return reject(new Error('Formservice disabled'));
      }

      let url = `${this.endpoint()}/some/path/here`;
      let params = { param1, param2 }
      axios({
        method: 'put',
        url,
        headers: {
          // 'Authorization': 'Bearer ' + this.loginservice.jwt,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: params
      })
        .then(response => {
          // JSON responses are automatically parsed.
          //console.log(`RESPONSE IS`, response.data)
          // let reply = response.data
          return resolve('ok');
        })
        .catch(e => {
          axiosError(vm, url, params, e)
          reject(e)
        })
    })//- promise
  }// myApiCall()

  //----------------------------------------------------------------------------//
  //                         IF WE CALL AN API - end                          //
  //----------------------------------------------------------------------------//
}

Formservice.version = '__VERSION__'
if (inBrowser && window.Vue) {
  window.Vue.use(Formservice)
}

export default Formservice
