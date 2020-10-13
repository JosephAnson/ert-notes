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
              <b-input v-model="id"></b-input>
              <b-button type="is-primary" @click="loadProject">
                Load Project
              </b-button>
            </b-field>
          </div>
          <div class="level-item">
            <div class="buttons">
              <b-button type="is-primary" @click="saveData">
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
                          :confirm-key-codes="[13, 32, 188]"
                        ></b-taginput>
                      </b-field>
                      <b-field label="Tactic" horizontal>
                        <ert-editor
                          :value="group.editor"
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
          </div>
        </div>
        <div class="column is-6 is-relative">
          <div class="level">
            <div class="level-left">
              <h3 class="title is-4">String Preview</h3>
            </div>
            <div class="level-right">
              <div class="buttons">
                <b-button type="is-primary" @click="copyErtString">
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
  SaveDataDTO,
  TemplateOption
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

  async copyErtString() {
    await clipboard(this.ertString);
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

  removeGroup(group: Group) {
    const index = this.groups.indexOf(group);
    this.groups.splice(index, 1);
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
        if (contentItem.attributes && 'color' in contentItem.attributes) {
          previewString += `|cff${contentItem.attributes.color.replace(
            '#',
            ''
          )}${contentItem.insert}|r`;
        } else if (
          contentItem.insert &&
          typeof contentItem.insert !== 'string' &&
          'image' in contentItem.insert
        ) {
          const marker = markers.find(
            (item) => item.image === (contentItem.insert as any).image
          );

          previewString += `{${marker.name}}`;
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

  async saveData() {
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
      groups: currentGroups
    };

    await this.$axios.post('/api/project/update', {
      id: this.id,
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

  loadProject() {
    this.$router.replace('/' + this.id);
  }

  async mounted() {
    if (!this.id || !Guid.isGuid(this.id)) {
      this.id = Guid.create();
      await this.createSteps(this.defaultTemplateOption);
      await this.saveData();
      await this.$router.replace('/' + this.id);
    }
  }
}
</script>
