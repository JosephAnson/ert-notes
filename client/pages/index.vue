<template>
  <div class="page-homepage section">
    <section id="ERT-Editor" class="container">
      <div class="box">
        <div class="columns">
          <div class="column">
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
                <div
                  v-for="group in groups"
                  :key="group.id"
                  class="groups__items box is-dark"
                >
                  <article class="media">
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
                          :value="group.description"
                          @change="group.description.value = $event"
                        ></ert-editor>
                      </b-field>
                    </div>
                    <div class="media-right">
                      <button class="delete" @click="removeGroup"></button>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="level">
              <div class="level-left">
                <h3 class="title is-4">String Preview</h3>
              </div>
              <div class="level-right">
                <b-button type="is-primary" @click="copyErtString">
                  Copy ERT String
                </b-button>
              </div>
            </div>
            <pre class="box is-white" v-html="ertString"></pre>
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
import { Editor, Group, GroupType, TemplateOption } from '~/pages/types';
import ErtEditor from '~/components/ERT-Editor.vue';

@Component({
  components: {
    draggable,
    ErtEditor
  }
})
export default class HomePage extends Vue {
  defaultTemplateOption = TemplateOption.Default;
  templateOptions = TemplateOption;
  templateOption: TemplateOption = this.defaultTemplateOption;
  editor: Editor = { value: '', editor: null };

  groupType = GroupType;
  groups: Group[] = [];

  get preview() {
    let preview = this.editor.value + '\n';

    for (const group of this.groups) {
      preview += group.description.value;
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
    this.$buefy.toast.open('Copied to clipboard!');
  }

  addGroup() {
    this.groups.push({
      id: Guid.create(),
      type: GroupType.PLAYER,
      players: [],
      description: {
        value: '',
        editor: null
      }
    });
  }

  removeGroup(group: Group) {
    const index = this.groups.indexOf(group);
    this.groups.slice(index, 1);
  }

  createERTGroupString(group: Group) {
    const ertString = this.createERTString(group.description);
    switch (group.type) {
      case GroupType.HEALER:
        return `{H}\n${ertString}{/H}`;
      case GroupType.DAMAGE:
        return `{D}\n${ertString}{/D}`;
      case GroupType.TANK:
        return `{T}\n${ertString}{/T}`;
      case GroupType.PLAYER:
        return `{p:${group.players.join(',')}}\n${ertString}{/p}`;
    }
  }

  createERTString(editor: Editor) {
    let previewString = '';

    if (editor.editor !== null) {
      const contents = editor.editor.getContents().ops;

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
        this.editor.editor.setText(
          'Fight summary\n\n\n' +
            'All Phases\n\n\n' +
            'Phase 1\n\n\n' +
            'Phase 2\n\n\n' +
            'Phase 3\n\n\n'
        );

        break;
      case TemplateOption.Custom:
        this.editor.editor.setText('');
        break;
    }
  }

  mounted() {
    this.createSteps(this.defaultTemplateOption);
  }
}
</script>
