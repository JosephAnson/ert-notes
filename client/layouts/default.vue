<template>
  <main>
    <v-navbar />

    <div class="documentation">
      <nuxt />
    </div>

    <v-footer />
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VNavbar from '~/components/Navbar.vue';
import VFooter from '~/components/Footer.vue';
import routes from '~/assets/data/routes';
import { BaseLayout } from '~/types/layout';

@Component<BaseLayout>({
  components: {
    VNavbar,
    VFooter
  },
  head(): any {
    const routePath = this.$route.path;
    const routeItem = this.routes.get(routePath);

    if (routeItem) {
      return {
        title: routeItem.title,
        titleTemplate: '%s | ERT Notes',
        meta: [
          // hid is used as unique identifier. Do not use `vmid` for it as it will not work
          {
            hid: 'description',
            name: 'description',
            content: routeItem.description
          }
        ]
      } as any;
    }
  }
})
export default class Default extends Vue implements BaseLayout {
  routes = routes;
}
</script>
