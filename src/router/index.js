import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('../views/Main.vue'),
        name: 'home1',
        redirect: '/home',
        children: [
          {
            path: '/home',
            name: 'home',
            component: () => import('../views/home/Home.vue')
          }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router