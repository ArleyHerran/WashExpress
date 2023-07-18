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
        path: '/Home',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
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
      next('/Home');
     // console.log("logueadoo");
      
    } else {
      next();
    }
  });


export default router
