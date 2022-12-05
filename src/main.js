import { createApp } from 'vue'
import App from './App.vue'
import { plugin as Slicksort } from 'vue-slicksort'

createApp(App).use(Slicksort).mount('#app')
