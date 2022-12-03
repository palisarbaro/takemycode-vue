import axios from 'axios'

export function debouncePromise (func, ms) {
  let timer = null
  let _reject = () => {}
  return function () {
    return new Promise((resolve, reject) => {
      clearTimeout(timer)
      _reject()
      timer = setTimeout(() => func(...arguments).then(x => resolve(x)).catch(x => reject(x)), ms)
      _reject = reject
    })
  }
}

export async function wait (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const headers = {
  'Content-Type': 'application/json'
}

export async function search (input, page) {
  const res = await axios.get('/api/search', { params: { input, page } })
  return res.data
}
export async function getSelected () {
  const res = await axios.get('/api/selected')
  return res.data
}

export async function postSelected (selected) {
  const res = await axios.post('/api/selected', { selected }, headers)
  return res.data
}
