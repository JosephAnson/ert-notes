<template>
  <quill-editor
    ref="editor"
    v-model="newValue"
    type="textarea"
    :options="editorOption"
    @ready="createToolbarOptions"
  ></quill-editor>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Quill from 'quill';
import { markers, textColors } from '~/shared/config';

interface Editor {
  value: string;
  editor: Quill | null;
}

@Component
export default class ErtEditor extends Vue {
  @Prop(Object) value!: Editor;

  newValue = this.value.value;

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

  $refs!: any;

  @Watch('newValue', { immediate: true, deep: true })
  onEditorChanged() {
    this.$emit('change', this.newValue);
  }

  createToolbarOptions(quill: Quill) {
    this.value.editor = quill;

    const toolbar = quill.getModule('toolbar');

    for (const marker of markers) {
      toolbar.addHandler(marker.name, null);

      const customButton = this.$refs.editor.$el.querySelector(
        '.ql-' + marker.name
      );

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
}
</script>
