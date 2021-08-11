import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import('@/views/layouts/Master'),
      redirect: `/inbox`,
      children: [
        {
          name: 'inbox',
          path: 'inbox',
          component: () => import('@/views/pages/Inbox'),
        },
      ],
    },
  ],
})
