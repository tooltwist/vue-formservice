/*
 *  Client API for Whatever
 *  See https://whatever.io
 */
import axios from 'axios'
import axiosError from './axiosError.js'
import { assert, inBrowser } from '../components/misc'

// IF_WE_CALL_AN_API
const DEFAULT_ENDPOINT = 'api.mysite.com'


class Whatever {

  constructor (options) {
    if (!options) {
      console.error(`Whatever was passed null options, so will be disabled.`)
      this.disabled = true
      return
    }
    this.disabled = false

    // IF_WE_CALL_AN_API
    this.host = options.host ? options.host : DEFAULT_ENDPOINT
    this.port = options.port ? options.port : 80
    this.version = options.version ? options.version : '2.0'
    this.apikey = options.apikey

    this.knownElementTypes = [ ]

    // Remember the options
    this.options = options
  }

  init (app /* Vue component instance */) {
    console.log('&&& Whatever.init')

    process.env.NODE_ENV !== 'production' && assert(
      install.installed,
      `not installed. Make sure to call \`Vue.use(Whatever)\` ` +
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

  /*
   *  Call an API
   */
  myApiCall (vm, { param1, param2 }) {

    console.log(`Whatever.js:update()`, element)
    console.log(`element.description.length=`, element.description.length)

    return new Promise((resolve, reject) => {

      if (this.options.debug) {
        console.log('myApiCall()');
      }
      if (this.disabled) {
        return reject(new Error('Whatever disabled'));
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

Whatever.version = '__VERSION__'
if (inBrowser && window.Vue) {
  window.Vue.use(Whatever)
}

export default Whatever
