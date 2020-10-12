<template>
  <div>
    <div
      ref="toolbar"
      :class="['toolbar' + editorID]"
      class="toolbar ql-snow ql-toolbar"
    >
      <div class="columns">
        <div class="column">
          <select class="ql-color ql-picker ql-color-picker">
            <option
              v-for="color in textColors"
              :key="color"
              :value="color"
              :style="{ background: color }"
            ></option>
          </select>
          <b-button
            v-for="marker in markers"
            :key="marker.name"
            :class="['ql-' + marker.name, 'ql-button']"
            @click.stop="createMarker(marker)"
          >
          </b-button>
          <b-button @click.stop="createTimeSnippet">
            Time Snippet
          </b-button>
          <b-button @click.stop="createSpellSnippet">
            Spell Snippet
          </b-button>
        </div>
        <div class="column is-narrow">
          <b-button class="ql-clean"> Clear </b-button>
        </div>
      </div>
    </div>

    <quill-editor
      ref="editor"
      v-model="newValue"
      type="textarea"
      :options="editorOption"
      @ready="setQuillOnEditor"
    ></quill-editor>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Quill from 'quill';
import { Marker, markers, textColors } from '~/shared/config';
import { Guid } from '~/shared/guid';

interface Editor {
  value: string;
  editor: Quill | null;
}

@Component
export default class ErtEditor extends Vue {
  @Prop(Object) value!: Editor;

  editorID = Guid.createWithoutSlash();

  newValue = this.value.value;

  textColors = textColors;
  markers = markers;

  editorOption = {
    // Some Quill options...
    theme: 'snow',
    modules: {
      toolbar: {
        container: '.toolbar' + this.editorID
      }
    }
  };

  $refs!: any;

  createMarker(marker: Marker) {
    const quill = this.value.editor;
    const range = quill.getSelection();
    if (range) {
      quill.insertEmbed(range.index, 'image', marker.image);
      quill.setSelection(range.index + 1, 0);
    } else {
      this.showSelectEditorToast();
    }
  }

  createTimeSnippet() {
    const quill = this.value.editor;
    const range = quill.getSelection();

    if (range) {
      this.$buefy.dialog.prompt({
        message: `Enter a time?`,
        inputAttrs: {
          placeholder: 'e.g. 10:00'
        },
        trapFocus: true,
        onConfirm: (value) => {
          this.$buefy.toast.open(`Time entered is: ${value}`);

          quill.insertText(range.index, '{time:' + value + '}');
          quill.setSelection(range.index + value.length + 7, 0);
        }
      });
    } else {
      this.showSelectEditorToast();
    }
  }

  showSelectEditorToast() {
    this.$buefy.toast.open({
      message: `Select where you want to insert!`,
      type: 'is-danger'
    });
  }

  createSpellSnippet() {
    const quill = this.value.editor;
    const range = quill.getSelection();

    if (range) {
      this.$buefy.dialog.prompt({
        message: `Enter a spell id:`,
        inputAttrs: {
          placeholder: 'Add in a spell id'
        },
        trapFocus: true,
        onConfirm: (value) => {
          this.$buefy.toast.open(`Spell entered is: ${value}`);

          quill.insertText(range.index, '{spell:' + value + '}');
          quill.setSelection(range.index + value.length + 8, 0);
        }
      });
    } else {
      this.showSelectEditorToast();
    }
  }

  @Watch('newValue', { immediate: true, deep: true })
  onEditorChanged() {
    this.$emit('change', this.newValue);
  }

  setQuillOnEditor(quill: Quill) {
    this.value.editor = quill;
  }
}
</script>
