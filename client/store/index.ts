import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import { ProjectStore } from '~/store/project';
import { App } from '~/store/app';
import config from '~~/app.config';

Vue.use(Vuex);

export interface RootState {
  App: App;
  Project: ProjectStore;
}

const plugins: any = [];

if (config.get('env') !== 'production') {
  plugins.push(createLogger({ collapsed: false }));
}

export const store = new Vuex.Store<RootState>({
  /*
  Ideally if all your modules are dynamic
  then your store is registered initially
  as a completely empty object
  */
  plugins
});

export const createStore = store;
