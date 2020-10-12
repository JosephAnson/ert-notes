<template>
  <div>
    <div ref="toolbar" class="toolbar">
      <div class="columns">
        <div class="column">
          <select class="ql-color">
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
            @click="createMarker(marker)"
          >
          </b-button>
          <b-button @click="createTimeSnippet">
            Time Snippet
          </b-button>
          <b-button @click="createSpellSnippet">
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

interface Editor {
  value: string;
  editor: Quill | null;
}

@Component
export default class ErtEditor extends Vue {
  @Prop(Object) value!: Editor;

  newValue = this.value.value;

  textColors = textColors;
  markers = markers;

  editorOption = {
    // Some Quill options...
    theme: 'snow',
    modules: {
      toolbar: {
        container: '.toolbar'
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
    }
  }

  createTimeSnippet() {
    const quill = this.value.editor;
    const range = quill.getSelection();

    this.$buefy.dialog.prompt({
      message: `Enter a time?`,
      inputAttrs: {
        placeholder: 'e.g. 10:00'
      },
      trapFocus: true,
      onConfirm: (value) => {
        this.$buefy.toast.open(`Time entered is: ${value}`);

        if (range) {
          quill.insertText(range.index, '{time:' + value + '}');
          quill.setSelection(range.index + value.length + 7, 0);
        }
      }
    });
  }

  createSpellSnippet() {
    const quill = this.value.editor;
    const range = quill.getSelection();
    if (range) {
      quill.insertText(range.index, '{spell:}');
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
