<template>
  <div class="page-homepage section">
    <section id="ERT-Editor" class="container">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <h3 class="title is-4">Ert Notes</h3>
          </div>
          <div class="level-item">
            <b-button type="is-primary" @click="newProject">
              New Project
            </b-button>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <b-field class="editor-load-project">
              <b-input
                v-model="id"
                icon-pack="fa"
                icon-right="copy"
                icon-right-clickable
                @icon-right-click="copyToClipboard(id)"
              ></b-input>
              <b-button type="is-primary" @click="loadProject">
                Load Project
              </b-button>
            </b-field>
          </div>
          <div class="level-item">
            <div class="buttons">
              <b-button type="is-primary" @click="copyProject">
                Copy Project
              </b-button>
            </div>
          </div>
          <div class="level-item">
            <div class="buttons">
              <b-button type="is-primary" @click="saveData(id)">
                Save
              </b-button>
            </div>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column is-6">
          <div class="level">
            <div class="level-left">
              <h3 class="title is-4">Create</h3>
            </div>
            <div class="level-right">
              <b-field label="Template" horizontal>
                <b-select v-model="templateOption" @input="createSteps">
                  <option
                    v-for="(option, key) in templateOptions"
                    :key="option"
                    :value="option"
                  >
                    {{ key }}
                  </option>
                </b-select>
              </b-field>
            </div>
          </div>
          <div class="note__editor box is-light">
            <b-field label="General Tactic">
              <ert-editor
                class="block"
                :value="editor"
                :players="players"
                @change="editor.value = $event"
              ></ert-editor>
            </b-field>
            <div class="box groups">
              <div class="notification">
                Add groups to show messages only to certain players
              </div>
              <div class="groups__actions buttons">
                <b-button type="is-primary" @click="addGroup">
                  Add Group
                </b-button>
              </div>
              <draggable v-model="groups" group="groups" handle=".handle">
                <div
                  v-for="group in groups"
                  :key="group.id"
                  class="groups__items box is-dark"
                >
                  <article class="media">
                    <div class="media-left">
                      <b-icon
                        icon="align-justify"
                        pack="fas"
                        class="handle"
                      ></b-icon>
                    </div>
                    <div class="media-content">
                      <b-field label="Type" horizontal>
                        <b-select v-model="group.type">
                          <option v-for="type in groupType" :key="type">
                            {{ type }}
                          </option>
                        </b-select>
                      </b-field>
                      <b-field
                        v-if="group.type === groupType.PLAYER"
                        label="Players"
                        horizontal
                      >
                        <b-taginput
                          v-model="group.players"
                          :data="playerNames"
                          autocomplete
                          allow-new
                          open-on-focus
                          :confirm-key-codes="[13, 32, 188]"
                          @typing="getFilteredPlayers"
                        ></b-taginput>
                      </b-field>
                      <b-field label="Tactic" horizontal>
                        <ert-editor
                          :value="group.editor"
                          :players="players"
                          @change="group.editor.value = $event"
                        ></ert-editor>
                      </b-field>
                    </div>
                    <div class="media-right">
                      <button
                        class="delete"
                        @click="removeGroup(group)"
                      ></button>
                    </div>
                  </article>
                </div>
              </draggable>
            </div>

            <div class="box players">
              <div class="notification">
                List all players to show auto complete features
              </div>
              <div class="groups__actions buttons">
                <b-field label="Player">
                  <b-field grouped>
                    <b-field expanded>
                      <b-input v-model="playerName" expanded></b-input>
                    </b-field>
                    <b-field>
                      <b-select v-model="playerClass">
                        <option v-for="type in wowClasses" :key="type">
                          {{ type }}
                        </option>
                      </b-select>
                    </b-field>
                    <b-button
                      type="is-primary"
                      @click="addPlayer(playerName, playerClass)"
                    >
                      Add
                    </b-button>
                  </b-field>
                </b-field>
              </div>
              <draggable v-model="players" group="players" handle=".handle">
                <div
                  v-for="player in players"
                  :key="player.id"
                  class="player__items block is-small"
                >
                  <article class="media">
                    <div class="media-left">
                      <b-icon
                        icon="align-justify"
                        pack="fas"
                        class="handle"
                      ></b-icon>
                    </div>
                    <div class="media-content">
                      <b-field label="Player" horizontal>
                        <b-field expanded>
                          <b-input v-model="player.name" expanded></b-input>
                        </b-field>
                        <b-field>
                          <b-select v-model="player.class">
                            <option v-for="type in wowClasses" :key="type">
                              {{ type }}
                            </option>
                          </b-select>
                        </b-field>
                      </b-field>
                    </div>
                    <div class="media-right">
                      <button
                        class="delete"
                        @click="removePlayer(player)"
                      ></button>
                    </div>
                  </article>
                </div>
              </draggable>
            </div>
          </div>
        </div>
        <div class="column is-6 is-relative">
          <div class="level">
            <div class="level-left">
              <h3 class="title is-4">String Preview</h3>
            </div>
            <div class="level-right">
              <div class="buttons">
                <b-button type="is-primary" @click="copyToClipboard(ertString)">
                  Copy ERT String
                </b-button>
              </div>
            </div>
          </div>
          <div class="preview is-sticky">
            <pre class="box is-white" v-html="ertString"></pre>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column is-6">
          <div class="notification is-warning">
            Save the note and share the url to work on it together, must refresh
            page to see new changes
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import draggable from 'vuedraggable';
import clipboard from 'copy-to-clipboard';
import { markers } from '~/shared/config';
import { Guid } from '~/shared/guid';
import {
  Editor,
  Group,
  GroupType,
  Player,
  SaveDataDTO,
  TemplateOption,
  WowClasses
} from '~/pages/types';
import ErtEditor from '~/components/ERT-Editor.vue';
import { IsJsonString } from '~/shared/utils';

@Component({
  components: {
    draggable,
    ErtEditor
  }
})
export default class HomePage extends Vue {
  id = null;

  defaultTemplateOption = TemplateOption.Default;
  templateOptions = TemplateOption;
  templateOption: TemplateOption = this.defaultTemplateOption;
  editor: Editor = { value: '', editorRef: null };

  groupType = GroupType;
  groups: Group[] = [];

  wowClasses = WowClasses;
  playerName = '';
  playerClass = WowClasses.deathknight;
  players: Player[] = [];

  get preview() {
    let preview = this.editor.value + '\n';

    for (const group of this.groups) {
      preview += group.editor.value;
    }

    return preview;
  }

  get ertString() {
    let ERTNote = this.createERTString(this.editor);

    for (const group of this.groups) {
      ERTNote += this.createERTGroupString(group);
    }

    return ERTNote;
  }

  playerNames = this.players.map((player) => player.name);

  getFilteredPlayers(text) {
    this.playerNames = this.players
      .filter((player) => {
        return player.name
          .toString()
          .toLowerCase()
          .includes(text.toLowerCase());
      })
      .map((player) => player.name);
  }

  async copyToClipboard(string: string) {
    await clipboard(string);
    this.$buefy.toast.open({
      message: 'Copied to clipboard!',
      type: 'is-primary'
    });
  }

  addGroup() {
    this.groups.push({
      id: Guid.create(),
      type: GroupType.PLAYER,
      players: [],
      editor: {
        value: '',
        editorRef: null
      }
    });
  }

  addPlayer(playerName, playerClass) {
    this.players.push({
      id: Guid.create(),
      name: playerName,
      class: playerClass
    });
  }

  removeGroup(group: Group) {
    const index = this.groups.indexOf(group);
    this.groups.splice(index, 1);
  }

  removePlayer(player: Player) {
    const index = this.players.indexOf(player);
    this.players.splice(index, 1);
  }

  createERTGroupString(group: Group) {
    const ertString = this.createERTString(group.editor);
    switch (group.type) {
      case GroupType.HEALER:
        return `{H}\n${ertString}{/H}\n`;
      case GroupType.DAMAGE:
        return `{D}\n${ertString}{/D}\n`;
      case GroupType.TANK:
        return `{T}\n${ertString}{/T}\n`;
      case GroupType.PLAYER:
        return `{p:${group.players.join(',')}}\n${ertString}{/p}\n`;
    }
  }

  createERTString(editor: Editor) {
    let previewString = '';

    if (editor.editorRef) {
      const contents = editor.editorRef.getContents().ops;

      for (const contentItem of contents) {
        if (
          contentItem.insert &&
          typeof contentItem.insert !== 'string' &&
          'image' in contentItem.insert
        ) {
          const imgURL = (contentItem.insert as any).image
            .replace('http://localhost:3000', '')
            .replace('https://ert-notes.herokuapp.com', '');

          const marker = markers.find((item) => item.image === imgURL);

          if (marker && 'name' in marker) {
            previewString += `{${marker.name}}`;
          }
        } else if (
          contentItem.attributes &&
          'color' in contentItem.attributes
        ) {
          previewString += `|cff${contentItem.attributes.color.replace(
            '#',
            ''
          )}${contentItem.insert}|r`;
        } else {
          previewString += contentItem.insert;
        }
      }
    }

    return previewString;
  }

  createSteps(type: TemplateOption) {
    switch (type) {
      case TemplateOption.Default:
        this.editor.editorRef.setText(
          'Fight summary\n\n\n' +
            'All Phases\n\n\n' +
            'Phase 1\n\n\n' +
            'Phase 2\n\n\n' +
            'Phase 3\n\n\n'
        );

        break;
      case TemplateOption.Empty:
        this.editor.editorRef.setText('');
        break;
    }
  }

  async saveData(id: Guid) {
    const currentGroups: Group[] = [];

    this.groups.map((item) => {
      currentGroups.push({
        id: item.id,
        players: item.players,
        type: item.type,
        editor: {
          value: item.editor.value,
          editorRef: null
        }
      });
    });

    const state: SaveDataDTO = {
      editor: {
        value: this.editor.value,
        editorRef: null
      },
      groups: currentGroups,
      players: this.players || []
    };

    await this.$axios.post('/api/project/update', {
      id,
      data: JSON.stringify(state)
    });

    await this.$buefy.notification.open({
      message: 'Saved',
      type: 'is-success'
    });
  }

  res = {};

  async asyncData({ $axios, params }) {
    if (Guid.isGuid(params.id)) {
      const res = await $axios.$post('/api/project/get', {
        id: params.id
      });

      if (IsJsonString(res.data)) {
        const data: SaveDataDTO = JSON.parse(res.data) as SaveDataDTO;

        return {
          editor: data.editor,
          groups: data.groups,
          players: data.players || [],
          res: data,
          id: params.id
        };
      }
    }

    return { id: params.id };
  }

  newProject() {
    const newGuid = Guid.create();
    this.id = newGuid;

    this.$router.replace('/' + newGuid);
  }

  async copyProject() {
    const newID = Guid.create();
    await this.saveData(newID);
    await this.$router.push('/' + newID);
  }

  loadProject() {
    this.$router.replace('/' + this.id);
  }

  async mounted() {
    if (!this.id || !Guid.isGuid(this.id)) {
      this.id = Guid.create();
      await this.createSteps(this.defaultTemplateOption);
      await this.saveData(this.id);
      await this.$router.replace('/' + this.id);
    }
  }
}
</script>
