const routes = [
    // {
    //     path: '/',
    //     redirect: 'engineerLookBoard/group',
    // },
    {
        path: 'engineerLookBoard',
        name: 'engineerLookBoard',
        component: () => import('@/views/lookBoard/index.vue'),
        children: [
            
            {
                path: 'group',
                name: 'engineerLookBoard-group',
                component: () => import('@/views/lookBoard/engineerLookBoard/group.vue'),
            },
            {
                path: 'company',
                name: 'engineerLookBoard-company',
                component: () => import('@/views/lookBoard/engineerLookBoard/company.vue'),
            }, {
                path: 'project',
                name: 'engineerLookBoard-project',
                component: () => import('@/views/lookBoard/engineerLookBoard/project.vue'),
            },
            {
                path: 'person',
                name: 'engineerLookBoard-person',
                component: () => import('@/views/lookBoard/engineerLookBoard/person.vue'),
            }
        ]
    },
    // {
    //     path: '**',
    //     redirect: 'engineerLookBoard',
    // },


]

export default routes;