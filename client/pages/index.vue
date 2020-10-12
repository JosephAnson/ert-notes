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

const markers = [
  'skull',
  'cross',
  'circle',
  'star',
  'square',
  'triangle',
  'diamond',
  'moon'
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
            color: [
              '#6002ee',
              '#90ee02',
              '#d602ee',
              '#ee6002',
              '#18ffff',
              '#69f0ae',
              '#ff5252'
            ]
          }
        ],
        markers,
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
      toolbar.addHandler(marker, null);

      const customButton = document.querySelector('.ql-' + marker);

      if (customButton) {
        customButton.addEventListener('click', function () {
          const range = quill.getSelection();
          if (range) {
            quill.insertEmbed(
              range.index,
              'image',
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              require(`~/static/markers/${marker}.png?url`)
            );
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
          typeof contentItem.insert !== 'string'
        ) {
          const imageUrlArray = (contentItem.insert as any).image.split('/');
          const markerName = imageUrlArray[imageUrlArray.length - 1].replace(
            '.png',
            ''
          );

          previewString += `{${markerName}}`;
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
