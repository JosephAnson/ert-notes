<template>
  <div>
    <div class="editor-toolbar box is-light is-bordered is-marginless is-small">
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

      <div class="block is-small">
        <b-field v-if="players.length">
          <b-field>
            <b-autocomplete
              v-model="selectedName"
              size="is-small"
              placeholder="e.g. Player Name"
              keep-first
              open-on-focus
              :data="filteredPlayers(selectedName)"
              field="name"
              @select="(option) => (selectedPlayer = option)"
            >
            </b-autocomplete>
            <b-button
              type="is-primary"
              size="is-small"
              @click="createPlayerSnippet"
            >
              Add
            </b-button>
          </b-field>
        </b-field>
      </div>
    </div>

    <quill-editor
      ref="editor"
      v-model="newValue"
      class="editor-editor"
      type="textarea"
      :options="editorOption"
      @ready="setQuillOnEditor"
    ></quill-editor>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Quill from 'quill';
import { Marker, markers, textColors, wowColors } from '~/shared/config';
import { Guid } from '~/shared/guid';
import { Editor, Player } from '~/pages/types';

@Component
export default class ErtEditor extends Vue {
  @Prop(Object) value!: Editor;
  @Prop({ type: Array, default: [] }) players!: Player[];

  editorID = Guid.createWithoutSlash();

  newValue = this.value.value || '';

  textColors = textColors;
  markers = markers;

  selectedName = '';
  selectedPlayer: Player | null = null;

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

  filteredPlayers(text) {
    return this.players.filter((player) => {
      return player.name.toString().toLowerCase().includes(text.toLowerCase());
    });
  }

  createMarker(marker: Marker) {
    const quill = this.value.editorRef;
    const range = quill.getSelection();
    if (range) {
      quill.insertEmbed(range.index, 'image', marker.image);
      quill.setSelection(range.index + 1, 0);
    } else {
      this.showSelectEditorToast();
    }
  }

  createTimeSnippet() {
    const quill = this.value.editorRef;
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
    const quill = this.value.editorRef;
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
          const insertString = '{spell:' + value + '}';

          quill.insertText(range.index, insertString);
          quill.setSelection(range.index + insertString.length, 0);
        }
      });
    } else {
      this.showSelectEditorToast();
    }
  }

  createPlayerSnippet() {
    const quill = this.value.editorRef;
    const range = quill.getSelection();

    if (range) {
      const insertString = this.selectedPlayer.name;

      quill.insertText(range.index, insertString, {
        color: wowColors[this.selectedPlayer.class]
      });
      quill.setSelection(range.index + insertString.length, 0);
    } else {
      this.showSelectEditorToast();
    }
  }

  @Watch('newValue', { immediate: true, deep: true })
  onEditorChanged() {
    this.$emit('change', this.newValue);
  }

  setQuillOnEditor(quill: Quill) {
    this.value.editorRef = quill;
  }
}
</script>
