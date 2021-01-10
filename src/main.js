import Vue from 'vue';
//引入vuex
import vuex from 'vuex';
import App from './App.vue';
import iviewui from 'view-design';
import storeObj from './store/index.js';

//使用插件，use表示“使用”
Vue.use(iviewui);
Vue.use(vuex);

//创建出真正的store，必须写在use语句之后
const store = new vuex.Store(storeObj);

//Vue的起步语法
new Vue({
    el:'#app',
    //render表示渲染，h函数表示创建节点
    render(h){
        return h(App);
    },
    //挂载store
    store
});