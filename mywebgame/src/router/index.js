import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Test from  '@/components/Test'
import Bubble from '@/components/Bubble'
import * as PIXI from 'pixi.js'

PIXI.loader
  .add([
    "frog", "../assets/frog.png"
  ])

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },{
      path: '/test',
      name: 'Test',
      component: Test
    },{
      path: '/bubble',
      name: 'Bubble',
      component: Bubble
    }
  ]
})
