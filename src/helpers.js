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

export async function search (input, page) {
  const res = await axios.get('/api/search', { params: { input, page } })
  return res.data
}
export const Search = debouncePromise(search, 300)

export async function save (options) {
  const res = await axios.post('/api/save', { options }, { 'Content-Type': 'application/json' })
  return res.data
}
export const Save = debouncePromise(save, 300)
