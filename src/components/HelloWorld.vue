<template>
  <div class="container">
  <input class="search" type="text" v-model="searchInput" @input="onSearch(searchInput)"/>
  <SlickList axis="y" v-model:list="options" class="list" @scroll="onScroll" :distance="5" :lockToContainerEdges="locked">
    <SlickItem v-for="(option, i) in options" :key="option" :index="i"  @click="onClick(option)" :class="{item: true,selected: option.selected}">
      {{ option.name }}
    </SlickItem>
  </SlickList>
  </div>
</template>

<script>
import { SlickList, SlickItem } from 'vue-slicksort'
import { Search, Save } from '../helpers.js'

export default {
  name: 'HelloWorld',
  components: {
    SlickList,
    SlickItem
  },
  data () {
    return {
      options: [],
      searchInput: '',
      page: 0,
      locked: false
    }
  },
  async mounted () {
    await this.updateOptions()
  },
  methods: {
    onScroll ({ target: { scrollTop, clientHeight, scrollHeight } }) {
      if (scrollTop + clientHeight >= scrollHeight) {
        this.nextPage()
      }
    },
    onClick (option) {
      option.selected = !option.selected
      Save(this.options)
    },
    async onSearch (query) {
      this.locked = query !== ''
      this.searchInput = query
      this.page = 0
      this.options = []
      await this.updateOptions()
    },
    async nextPage () {
      await this.updateOptions()
    },
    async updateOptions () {
      try {
        const options = await Search(this.searchInput, this.page)
        this.options.push(...options)
        if (options.length > 0) {
          this.page += 1
        }
      } catch (e) {
        if (e) throw e
      }
    }
  },
  watch: {
    options: {
      async handler (newValue, oldValue) {
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue) && this.searchInput === '') {
          try {
            Save(this.options)
          } catch (e) {
            if (e) {
              throw e
            }
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
$item-height: 30px;
$item-margin: 5px;
$items-per-screen: 15;
.container{
  width: 400px;
}
.search{
  width: 100%;
  margin-bottom: 5px;
  box-sizing: border-box;
}
.list{
  width: 100%;
  height: ($item-height+$item-margin)*$items-per-screen;
  border-radius: 10px;
  background: green;
  overflow-y: scroll;
}
.item{
  height: $item-height;
  margin: $item-margin;
  width: calc(100% - 2*$item-margin);
  display: flex;
  align-items: center;
  justify-content: center;;
  background: lightblue;
  border-radius: 5px;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
}
.selected{
  background: lightcoral;
}
</style>
