<template>
  <div class="page-homepage section">
    <section class="container">
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
              <quill-editor
                v-model="editor.value"
                type="textarea"
                :options="editorOption"
                @ready="editorReady"
              ></quill-editor>
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
            <div class="box is-light" v-html="preview"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import draggable from 'vuedraggable';
import Quill from 'quill';
import clipboard from 'copy-to-clipboard';

enum TemplateOption {
  Default = 'Default',
  Custom = 'Custom'
}

interface Editor {
  value: string;
  editor: Quill | null;
}

interface Marker {
  name: string;
  image: string;
}

const markers: Marker[] = [
  { name: 'skull', image: require(`~/static/markers/skull.png?url`) },
  { name: 'cross', image: require(`~/static/markers/cross.png?url`) },
  { name: 'circle', image: require(`~/static/markers/circle.png?url`) },
  { name: 'star', image: require(`~/static/markers/star.png?url`) },
  { name: 'square', image: require(`~/static/markers/square.png?url`) },
  { name: 'triangle', image: require(`~/static/markers/triangle.png?url`) },
  { name: 'diamond', image: require(`~/static/markers/diamond.png?url`) },
  { name: 'moon', image: require(`~/static/markers/moon.png?url`) }
];

const textColors = [
  '#000000',
  '#434343',
  '#666666',
  '#999999',
  '#b7b7b7',
  '#cccccc',
  '#d9d9d9',
  '#efefef',
  '#f3f3f3',
  '#ffffff',
  '#980000',
  '#ff0000',
  '#ff9900',
  '#ffff00',
  '#00ff00',
  '#00ffff',
  '#4a86e8',
  '#0000ff',
  '#9900ff',
  '#ff00ff',
  '#e6b8af',
  '#f4cccc',
  '#fce5cd',
  '#fff2cc',
  '#d9ead3',
  '#d0e0e3',
  '#c9daf8',
  '#cfe2f3',
  '#d9d2e9',
  '#ead1dc',
  '#dd7e6b',
  '#ea9999',
  '#f9cb9c',
  '#ffe599',
  '#b6d7a8',
  '#a2c4c9',
  '#a4c2f4',
  '#9fc5e8',
  '#b4a7d6',
  '#d5a6bd',
  '#cc4125',
  '#e06666',
  '#f6b26b',
  '#ffd966',
  '#93c47d',
  '#76a5af',
  '#6d9eeb',
  '#6fa8dc',
  '#8e7cc3',
  '#c27ba0',
  '#a61c00',
  '#cc0000',
  '#e69138',
  '#f1c232',
  '#6aa84f',
  '#45818e',
  '#3c78d8',
  '#3d85c6',
  '#674ea7',
  '#a64d79',
  '#85200c',
  '#990000',
  '#b45f06',
  '#bf9000',
  '#38761d',
  '#134f5c',
  '#1155cc',
  '#0b5394',
  '#351c75',
  '#741b47',
  '#5b0f00',
  '#660000',
  '#783f04',
  '#7f6000',
  '#274e13',
  '#0c343d',
  '#1c4587',
  '#073763',
  '#20124d',
  '#4c1130'
];

@Component({
  components: {
    draggable
  }
})
export default class HomePage extends Vue {
  defaultTemplateOption = TemplateOption.Default;
  templateOptions = TemplateOption;
  templateOption: TemplateOption = this.defaultTemplateOption;
  editor: Editor = { value: '', editor: null };

  editorOption = {
    // Some Quill options...
    theme: 'snow',
    modules: {
      toolbar: [
        [
          {
            color: textColors
          }
        ],
        markers.map((item) => item.name),
        ['clean']
      ]
    }
  };

  get preview() {
    return this.editor.value + '\n';
  }

  editorReady(quill: Quill) {
    this.editor.editor = quill;

    const toolbar = quill.getModule('toolbar');

    for (const marker of markers) {
      toolbar.addHandler(marker.name, null);

      const customButton = document.querySelector('.ql-' + marker.name);

      if (customButton) {
        customButton.addEventListener('click', function () {
          const range = quill.getSelection();
          if (range) {
            quill.insertEmbed(range.index, 'image', marker.image);
          }
        });
      }
    }
  }

  async copyErtString() {
    const ERTNote = this.createERTTextString(this.editor);

    await clipboard(ERTNote);
    this.$buefy.toast.open('Copied to clipboard!');
  }

  createERTTextString(editor: Editor) {
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

      previewString += '\n';
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
            'Phase 3\n\n\n' +
            'Tanks CD rotation (Possibly only show for tanks and healers)\n\n\n' +
            'Healer CD Rotation (Possibly only show for tanks and healers)\n\n\n'
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
