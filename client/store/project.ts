import { Module, VuexModule, getModule } from 'vuex-module-decorators';
import { store } from '~/store/index';

@Module({
  name: 'ProjectStore',
  dynamic: true,
  store
})
export class ProjectStore extends VuexModule {
  projectID = '2ffb24ed-7494-4ed0-97c0-2b2e509d524b';
}

export default getModule(ProjectStore);
