import {
    createApp,
    h,
    // Vue
} from 'vue'
// import App from './App.vue'
import CardFlip from './components/CardFlip.vue'
import VirtualKeyboard from './components/VirtualKeyboard'
import ChooseComponent from './components/ChooseComponent'

import "@/assets/global.css"

const NotFoundComponent = {
    template: '<p>Page not found</p>'
}

const routes = {
    '/': ChooseComponent,
    '/card': CardFlip,
    '/virtual-keyboard': VirtualKeyboard
}


createApp({
    data: () => ({
        currentRoute: window.location.pathname
    }),

    computed: {
        CurrentComponent() {
            return routes[this.currentRoute] || NotFoundComponent
        }
    },

    render() {
        return h(this.CurrentComponent)
    },
    el: '#app',
    components: { CardFlip, VirtualKeyboard, ChooseComponent }

}).mount("#app")