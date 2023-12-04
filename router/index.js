// index.js
import Vue from 'vue';
import VueRouter from 'vue-router';
import FormIndex from '../pages/index.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'FormIndex',
    component: FormIndex,
  },
];


export default router;
