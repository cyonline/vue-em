// import lookboardComponent from ''
const routes = [
    {
        path: '/lookBoard',
        name: 'lookBoard',
        component: () => import('../../views/lookBoard/index.vue')
    }
]

export default routes;