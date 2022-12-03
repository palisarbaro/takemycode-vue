<template>
  <div style="width: 800px">
   <Multiselect
      :loading="loading"
      :disabled="disabled"
      v-model="selected"
      @bottomReached="nextPage"
      :multiple="true"
      :options="options"
      @search-change="onSearch"
      >
    </Multiselect>
  </div>
</template>

<script>
import Multiselect from './my-multiselect/src/Multiselect.vue'
import { debouncePromise, search, getSelected, postSelected } from '../helpers.js'
const Search = debouncePromise(search, 300)
export default {
  name: 'HelloWorld',
  components: {
    Multiselect
  },
  async mounted () {
    await this.updateOptions()
    this.selected.push(...await getSelected())
    this.loading = false
    this.disabled = false
  },
  data () {
    return {
      selected: [],
      options: [],
      searchInput: '',
      page: 0,
      loading: true,
      disabled: true
    }
  },
  methods: {
    async onSearch (query) {
      this.searchInput = query
      this.page = 0
      this.options = []
      await this.updateOptions()
    },
    async nextPage () {
      await this.updateOptions()
    },
    async updateOptions () {
      this.loading = true
      try {
        const options = await Search(this.searchInput, this.page)
        this.options.push(...options)
        if (options.length > 0) {
          this.page += 1
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  },
  watch: {
    selected: {
      async handler (newValue, oldValue) {
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          // console.log('selected', Array.from(this.selected.values()))
          this.loading = true
          try {
            await postSelected(this.selected)
          } catch (e) {
            console.log(e)
          } finally {
            this.loading = false
          }
        }
      },
      deep: true,
      immidiate: true
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
