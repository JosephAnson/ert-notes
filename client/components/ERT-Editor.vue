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
            <b-button @click="openSpellOccurenceDialog">
              Spell Occurrence
            </b-button>
          </div>
          <div class="column is-narrow">
            <b-button class="ql-clean"> Clear </b-button>
          </div>
        </div>
      </div>

      <div class="block is-small">
        <b-field v-if="players.length">
          <div class="control box is-black is-small content">
            <a
              v-for="player in players"
              :key="player.id"
              :class="
                'has-wow-text-' + player.class.replace(' ', '-').toLowerCase()
              "
              @click.prevent="createPlayerSnippet(player)"
            >
              {{ player.name }}
            </a>
          </div>
        </b-field>
      </div>
    </div>

    <b-modal
      :active.sync="isComponentModalActive"
      has-modal-card
      trap-focus
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-modal
    >
      <template>
        <div class="modal-card animation-content">
          <section class="modal-card-body is-titleless">
            <div class="media">
              <div class="media-content">
                <b-field label="Enter the Time after spell cast? {00:10}">
                  <b-input
                    v-model="spellOccurrence.timeAfterSpellStarted"
                  ></b-input>
                </b-field>
                <b-field label="Enter the spell id?">
                  <b-numberinput
                    v-model="spellOccurrence.spellId"
                    icon-pack="fa"
                  ></b-numberinput>
                </b-field>
                <b-field label="Enter the cast number?">
                  <b-numberinput
                    v-model="spellOccurrence.occurrence"
                    icon-pack="fa"
                  ></b-numberinput>
                </b-field>
              </div>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button class="button" @click="isComponentModalActive = false">
              Cancel
            </button>
            <button
              class="button is-primary"
              @click="createSpellOccurenceSnippet"
            >
              Done
            </button>
          </footer>
        </div>
      </template>
    </b-modal>

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

  isComponentModalActive = false;

  currentRange = null;

  spellOccurrence = {
    timeAfterSpellStarted: '00:10',
    occurrence: 1,
    spellId: 306111
  };

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

  setCurrentPosition() {
    this.currentRange = this.value.editorRef.getSelection();
  }

  openSpellOccurenceDialog() {
    const quill = this.value.editorRef;
    this.currentRange = quill.getSelection();

    this.isComponentModalActive = true;
  }

  createSpellOccurenceSnippet() {
    const quill = this.value.editorRef;

    if (this.currentRange) {
      quill.setSelection(this.currentRange);
    }

    const range = quill.getSelection();

    if (range) {
      this.$buefy.toast.open(
        `Snippet entered is: {time:0:30,SCS:${this.spellOccurrence.spellId}:${this.spellOccurrence.occurrence}}`
      );
      const insertString = `{time:${this.spellOccurrence.timeAfterSpellStarted},SCS:${this.spellOccurrence.spellId}:${this.spellOccurrence.occurrence}}`;

      quill.insertText(range.index, insertString);
      quill.setSelection(range.index + insertString.length, 0);

      this.isComponentModalActive = false;
    } else {
      this.showSelectEditorToast();
    }
  }

  createPlayerSnippet(player: Player) {
    const quill = this.value.editorRef;

    if (this.currentRange) {
      quill.setSelection(this.currentRange);
    }

    const range = quill.getSelection();

    if (range) {
      const insertString = player.name;

      quill.insertText(range.index, ' ' + insertString, {
        color: wowColors[player.class]
      });
      quill.setSelection(range.index + insertString.length + 1, 0);
    } else {
      this.showSelectEditorToast();
    }
  }

  @Watch('newValue', { immediate: true, deep: true })
  onEditorChanged() {
    this.$emit('change', this.newValue);
  }

  isHexColor(color: string) {
    return /^#[0-9A-F]{6}$/i.test('#' + color);
  }

  setQuillOnEditor(quill: Quill) {
    this.value.editorRef = quill;

    quill.root.addEventListener('blur', () => {
      this.setCurrentPosition();
    });

    quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
      const ops = [];
      delta.ops.forEach((op) => {
        if (op.insert && typeof op.insert === 'string') {
          const splitText = op.insert.split(/\|cff([\S\w\s\d]+?)\|r/gim);

          for (const string of splitText) {
            // eslint-disable-next-line no-console
            console.log('string', string);
            const color = string.substring(0, 6);
            // eslint-disable-next-line no-console
            console.log('color', color);
            if (this.isHexColor(color)) {
              ops.push({
                insert: string.substring(6), // Add text after color
                attributes: { color: '#' + color }
              });
            } else {
              ops.push({
                insert: string
              });
            }
          }
        }
      });
      delta.ops = ops;
      return delta;
    });
  }
}
</script>
