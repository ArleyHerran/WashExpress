// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Login.vue'),
        meta:{
          requireAuth:false
        }
      },
      {
        path: '/Dasboard',
        name: 'Dasboard',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Dasboard.vue'),
        meta:{
          requireAuth:true
        }
      },
      {
        path: '/Turnos',
        name: 'Turnos',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Turnos.vue'),
        meta:{
          requireAuth:true
        }
      },
      {
        path: '/Historia',
        name: 'Historia',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Historia.vue'),
        meta:{
          requireAuth:true
        }
      },
     
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})



router.beforeEach((to,from ,next)=>{
  const needAuth=to.meta.requireAuth;
  const usuarioGuardado = localStorage.getItem('usuario');
  const usuarioObjeto = JSON.parse(usuarioGuardado);
    const user = usuarioObjeto!=null;
//console.log(usuarioObjeto)
    if (!user && needAuth) {
      next('');
      //console.log("tiene que loguear");
     
    } else if (user && !needAuth) {
      next('/Dasboard');
     // console.log("logueadoo");
      
    } else {
      next();
    }
  });


export default router
