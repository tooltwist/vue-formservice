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

    // Create the initial list of hook functions.
    this.hooks = {

      'capitalize': function(value, parameters, context) {
        let startWord = true
        let result = ''
        for (let i = 0; i < value.length; i++) {
          let ch = value.charAt(i)
          if (ch===' ' || ch==='\t') {
            startWord = true
            result += ch
          } else {
            if (startWord) {
              result += (''+ch).toUpperCase()
              startWord = false
            } else {
              result += (''+ch).toLowerCase()
            }
          }
        }
        if (result !== value) {
          return { newValue: result }
        }
        return { }
      },

      // Parameter characters:
      // '-' = allow negative numbers
      // '.' = allow decimals
      '#numeric': function(value, parameters, context) {
        let result = ''
        for (let i = 0; i < value.length; i++) {
          let ch = value.charAt(i)

          if (
            (ch >= '0' && ch <= '9')
            || (ch==='-' && i===0 && parameters.includes('-'))
            || (ch==='.' && i > 0 && parameters.includes('.') && value.indexOf('.')===i) // no prior '.'
          ) {
            result += ch
          }
        }
        if (result !== value) {
          return { newValue: result }
        }
        return { }
      },

    }//- hooks
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
    path = adjustPathForUnspecifiedArrayIndexes(vm, path, debug)
    return this.store.getters.seek({vm, operation: 'find', path, debug})
  }
  findOrCreate({vm, path, updatePath, value, debug }) {
    if (debug) {
      console.error(`Formservice.findOrCreate(${path}, updatePath=${updatePath}, value=${describe(value)}):`, value);
    }
    path = adjustPathForUnspecifiedArrayIndexes(vm, path, debug)
    return this.store.getters.seek({vm, operation: 'find-or-create', path, updatePath, value, debug })
  }
  save({vm, path, updatePath, value, debug }) {
    if (debug) {
      console.error(`Formservice.save(${path}, updatePath=${updatePath}, value=${describe(value)}):`, value);
    }
    path = adjustPathForUnspecifiedArrayIndexes(vm, path, debug)
    return this.store.getters.seek({vm, operation: 'save', path, updatePath, value, debug })
  }
  delete({vm, path, debug}) {
    if (debug) {
      console.error(`Formservice.delete(${path}`)
    }
    path = adjustPathForUnspecifiedArrayIndexes(vm, path, debug)
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

  // Call the hooks for a form field
  runHooks (event, validators, value, hookContext) {
    console.log(`*** runHooks(${event}, value=${value}, hookContext)`)

    // Validate the value
    //  default is leaving the field (onblur)
    //  # for each character (onchange)
    //  @ before saving page
    hookContext.event = event

    const NO_ERROR = hookContext.NO_ERROR = 0
    const WARNING = hookContext.WARNING = 10
    const ERROR = hookContext.ERROR = 20

    let highestLevelSoFar = -1 // No error
    let message = null
    let latestValue = null

    // Iterate through the required hooks for all event types.
    let arr = validators.split(',')
    for (let i = 0; i < arr.length; i++) {

      // handle <hookname> or <hookname>(<parameters>)
      let name = arr[i].trim()
      // console.log(`hook=${name}.`);
      let parameters = ''
      let pos = name.indexOf('(')
      if (pos > 0) {
        parameters = name.substring(pos + 1).trim()
        name = name.substring(0, pos)
        if (parameters.endsWith(')')) {
          parameters = parameters.substring(0, parameters.length - 1)
        }
      }
      // console.log(`name=${name}`);
      // console.log(`parameters=${parameters}`);

      // See if this hook is for this event
      let firstChar = name.charAt(0)
      // console.log(`  --> ${firstChar}`);
      if (firstChar === '#') {
        // Call for every character entered (onchange)
        if (event !== 'change') { continue; }
      } else if (firstChar === '@') {
        // Call on form save
        if (event !== 'save') { continue; }
      } else {
        // Call when leaving the field
        if (event !== 'blur') { continue; }
      }

      // Need to call this hook
      let fn = this.hooks[name]
      // console.log(`fn=${fn}`);
      if (!fn) {
        message = `Unknown hook function [${name}]`
        return { errorLevel: 'error', errorMessage: message, newValue: null }
      }

      // Call the hook function
      console.log(`Calling hook ${name}(${value}, parameters=${parameters}, context)`);
      let { errorLevel, newValue, errorMessage } = fn(value, parameters, hookContext)
      console.log(`- returned errorLevel=${errorLevel}, newValue=${newValue}, errorMessage=${errorMessage}`);
      if (!errorLevel) {
        errorLevel = NO_ERROR
      }

      // Check if the value was changed by the hook. If it
      // has we'll pass the new value on to subsequent hooks.
      if (newValue) {
        console.log(`Replacing value with ${newValue}`);
        value = newValue
        latestValue = newValue
      }

      // We'll report the highest level error. If it's an
      // error we won't carry on and call any more hooks.
      if (errorLevel > highestLevelSoFar) {
        highestLevelSoFar = errorLevel
        message = errorMessage
        if (errorLevel === ERROR) {
          break
          // return { errorLevel: 'error', errorMessage }
        }
      }
    } // Next

    let errorLevel = null
    if (highestLevelSoFar === NO_ERROR) {
      errorLevel = ''
      message = ''
    } else if (highestLevelSoFar === WARNING) {
      errorLevel = 'warning'
    } else if (highestLevelSoFar === ERROR) {
      errorLevel = 'error'
    }
    return { errorLevel, errorMessage: message, newValue: latestValue }
  }//- runHooks

  /*
   *  Register a function by name.
   */
  registerHook(name, func) {
    this.hooks[name] = func
  }
}

/*
 *  If a path is specified as a.b.c[].d, then work out what the
 *  missing array index should be.
 */
function adjustPathForUnspecifiedArrayIndexes(vm, path, debug){
  if (path.indexOf('[]') >= 0) {
    if (debug) {
      console.error('findOrCreate() GOT AN INDEXLESS ARRAY: ${path}');
    }

    //  If we have an array without an index ("[]"), then:
    //  1. look an ancestor element that repeats on that array, and use it's index.
    //  2. Default to 0
    for ( ; ; ) {
      let pos = path.indexOf('[]')
      if (pos < 0) {
        break
      }
      let before = path.substring(0, pos + 1)
      let after = path.substring(pos + 1)
      path = `${before}0${after}`
      if (debug) {console.log(`new path is ${path}`);}
    }
    if (debug) {
      console.error(`new path=${path}`);
      console.log(`vm.element=`, vm.element);
    }

    // console.log(`store is`, vm.$content.store);
    // let elementId = vm.element.id
    // let xyz = vm.$content.store.getters.getPathToElement(elementId)
    // console.log(`xyz=`, xyz);
  }
  return path
}


Formservice.version = '__VERSION__'
if (inBrowser && window.Vue) {
  window.Vue.use(Formservice)
}

export default Formservice
