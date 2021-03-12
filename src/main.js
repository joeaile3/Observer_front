import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Register from "@/components/Register";
import Vuelidate from 'vuelidate';
import axios from 'axios';

axios.defaults.baseURL='http://observer_back.test/'

Vue.use(VueRouter);
Vue.use(Vuelidate);
Vue.config.productionTip = false

const Dashboard=()=>import('@/components/Dashboard') ;
const Login=()=>import('@/components/Login') ;
const router= new VueRouter({
routes:[{
  path: '/',
  name:'register',
  component: Register
    },
    {
      path: '/dashboard',
    name:'dashboard',
    component: Dashboard
    },
  {
    path: '/login',
    name:'login',
    component: Login
  }
    ],
  mode:"history"

}
);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
