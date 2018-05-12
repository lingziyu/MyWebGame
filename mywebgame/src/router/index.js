import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import PIXI from  '@/components/Pixi'
import Bubble from '@/components/Bubble'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },{
      path: '/pixi',
      name: 'PIXI',
      component: PIXI
    },{
      path: '/bubble',
      name: 'Bubble',
      component: Bubble
    }
  ]
})
