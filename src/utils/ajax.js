import axios from 'axios'

async function get(uri, opt) {
  try {
    const r = await axios.get(uri, opt)
    return r.data
  } catch (e) {
    console.error(`get <${uri}> err: ${e}`)
    return null
  }
}

async function post(uri, opt) {
  try {
    const r = await axios.post(uri, opt)
    return r.data
  } catch (e) {
    console.error(`post <${uri}> err: ${e}`)
    return null
  }
}

export default {
  get,
  post
}
