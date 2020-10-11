<template>
  <nav class="navbar-main is-dark is-spaced navbar is-fixed-top">
    <div class="container">
      <div class="navbar-brand">
        <nuxt-link
          to="/"
          class="navbar-item"
          title="ERT: ERT Note creator for WoW"
        >
          ERT Notes
        </nuxt-link>

        <a
          class="navbar-item"
          href="https://github.com/BulmaBuildingBlocks/BulmaBuildingBlocks"
          target="_blank"
          rel="noopener noreferrer nofollow"
          title="Github"
        >
          <b-icon icon="github-circle" />
        </a>

        <span
          class="navbar-burger burger"
          :class="{ 'is-active': isMenuActive }"
          @click="isMenuActive = !isMenuActive"
        >
          <span />
          <span />
          <span />
        </span>
      </div>

      <div
        class="navbar-menu is-shadowless"
        :class="{ 'is-active': isMenuActive }"
      >
        <div class="navbar-end">
          <div class="navbar-item has-dropdown is-hoverable">
            <div class="navbar-link">Info</div>

            <div class="navbar-dropdown">
              <strong class="navbar-item is-version">
                <div class="tags has-addons is-fullwidth">
                  <span class="tag">Version</span>
                  <span class="tag is-primary">{{ version }}</span>
                </div>
              </strong>
              <hr class="navbar-divider" />
              <a
                class="navbar-item"
                href="https://github.com/BulmaBuildingBlocks/BulmaBuildingBlocks/blob/master/CHANGELOG.md"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                Changelogs
              </a>
            </div>
          </div>

          <div class="navbar-item">
            <a class="button is-outlined is-fullwidth-mobile" @click="tweet">
              <b-icon pack="fab" icon="twitter" />
              <span>Tweet</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import packageJson from '@@/package.json';

@Component
export default class Navbar extends Vue {
  isMenuActive = false;
  version = packageJson.version;

  tweet(): void {
    const width = 575;
    const height = 400;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    const url = `https://twitter.com/share?url=${encodeURIComponent(
      document.location.protocol + '//' + document.location.host
    )}&text=ERT Notes: Quick build ERT Notes to use in WoW&hashtags=ERTNotes&via=JosephLeeAnson`;
    const opts = `status=1,width=${width},height=${height},top=${top},left=${left}`;

    window.open(url, '', opts);
  }
}
</script>
