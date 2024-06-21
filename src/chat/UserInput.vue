<template>
  <div>
    <Suggestions :suggestions="suggestions" :colors="colors" @sendSuggestion="_submitSuggestion" />
    <div v-if="file" class="file-container" :style="{
        backgroundColor: colors.userInput.text,
        color: colors.userInput.bg
    }">
      <span class="icon-file-message"><img :src="icons.file.img" :alt="icons.file.name" height="15" /></span>
      {{ file.name }}
      <span class="delete-file-message" @click="cancelFile()"><img :src="icons.closeSvg.img" :alt="icons.closeSvg.name"
          height="10" title="Remove the file" /></span>
    </div>
    <form class="sc-user-input" :class="{ active: inputActive }" :style="{ background: colors.userInput.bg }">
      <div ref="userInput" role="button" tabIndex="0" contentEditable="true" :placeholder="placeholder"
        class="sc-user-input--text" :style="{ color: colors.userInput.text }" @focus="setInputActive(true)"
        @blur="setInputActive(false)" @keydown="handleKey" @focusUserInput="focusUserInput()"></div>
      <div class="sc-user-input--buttons">
        <div v-if="showEmoji && !isEditing" class="sc-user-input--button">
          <EmojiIcon :on-emoji-picked="_handleEmojiPicked" :color="colors.userInput.text" />
        </div>
<!--        v-if="showEmoji && !isEditing"-->
        <div  @click="_handleEmojiPicked('👍')" class="sc-user-input--button">
          👍
        </div>
<!--        v-if="showEmoji && !isEditing"-->
        <div  @click="_handleEmojiPicked('👎')" class="sc-user-input--button">
          👎
        </div>
        <div v-if="showFile && !isEditing" class="sc-user-input--button">
          <FileIcons :on-change="_handleFileSubmit" :color="colors.userInput.text" />
        </div>
        <div v-if="isEditing" class="sc-user-input--button">
          <UserInputButton :color="colors.userInput.text" tooltip="Cancel" @click.native.prevent="_editFinish">
            <IconCross />
          </UserInputButton>
        </div>
        <div class="sc-user-input--button">
          <UserInputButton v-if="isEditing" :color="colors.userInput.text" tooltip="Edit"
            @click.native.prevent="_editText">
            <IconOk />
          </UserInputButton>
          <UserInputButton v-else :color="colors.userInput.text" tooltip="Send" @click.native.prevent="_submitText">
            <IconSend />
          </UserInputButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import EmojiIcon from './icons/EmojiIcon.vue'
import FileIcons from './icons/FileIcons.vue'
import UserInputButton from './UserInputButton.vue'
import Suggestions from './Suggestions.vue'
import FileIcon from './assets/file.svg'
import CloseIconSvg from './assets/close.svg'
import store from './store/'
import IconCross from './components/icons/IconCross.vue'
import IconOk from './components/icons/IconOk.vue'
import IconSend from './components/icons/IconSend.vue'
import {emitter} from "./event/index.js";

export default {
  components: {
    EmojiIcon,
    FileIcons,
    UserInputButton,
    Suggestions,
    IconCross,
    IconOk,
    IconSend
  },
  props: {
    icons: {
      type: Object,
      default: function () {
        return {
          file: {
            img: FileIcon,
            name: 'default'
          },
          closeSvg: {
            img: CloseIconSvg,
            name: 'default'
          }
        }
      }
    },
    showEmoji: {
      type: Boolean,
      default: () => false
    },
    suggestions: {
      type: Array,
      default: () => []
    },
    showFile: {
      type: Boolean,
      default: () => false
    },
    onSubmit: {
      type: Function,
      required: true
    },
    placeholder: {
      type: String,
      default: 'Write something...'
    },
    colors: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      file: null,
      inputActive: false
    }
  },
  computed: {
    editMessageId() {
      return this.isEditing && store.state.editMessage.id
    },
    isEditing() {
      return store.state.editMessage && store.state.editMessage.id
    }
  },
  watch: {
    editMessageId(m) {
      if (store.state.editMessage != null && store.state.editMessage != undefined) {
        this.$refs.userInput.focus()
        this.$refs.userInput.textContent = store.state.editMessage.data.text
      } else {
        this.$refs.userInput.textContent = ''
      }
    }
  },
  mounted() {
    emitter.$on('focusUserInput', () => {
      if (this.$refs.userInput) {
        this.focusUserInput()
      }
    })
  },
  methods: {
    cancelFile() {
      this.file = null
    },
    setInputActive(onoff) {
      this.inputActive = onoff
    },
    handleKey(event) {
      if (event.keyCode === 13 && !event.shiftKey) {
        if (!this.isEditing) {
          this._submitText(event)
        } else {
          this._editText(event)
        }
        this._editFinish()
        event.preventDefault()
      } else if (event.keyCode === 27) {
        this._editFinish()
        event.preventDefault()
      }

      this.$emit('onType')
    },
    focusUserInput() {
      this.$nextTick(() => {
        this.$refs.userInput.focus()
      })
    },
    _submitSuggestion(suggestion) {
      this.onSubmit({author: 'me', type: 'text', data: {text: suggestion}})
    },
    _checkSubmitSuccess(success) {
      if (Promise !== undefined) {
        Promise.resolve(success).then(
          function (wasSuccessful) {
            if (wasSuccessful === undefined || wasSuccessful) {
              this.file = null
              this.$refs.userInput.innerHTML = ''
            }
          }.bind(this)
        )
      } else {
        this.file = null
        this.$refs.userInput.innerHTML = ''
      }
    },
    _submitText(event) {
      const text = this.$refs.userInput.textContent
      const file = this.file
      if (file) {
        this._submitTextWhenFile(event, text, file)
      } else {
        if (text && text.length > 0) {
          this._checkSubmitSuccess(
            this.onSubmit({
              author: 'me',
              type: 'text',
              data: {text}
            })
          )
        }
      }
    },
    _submitTextWhenFile(event, text, file) {
      if (text && text.length > 0) {
        this._checkSubmitSuccess(
          this.onSubmit({
            author: 'me',
            type: 'file',
            data: {text, file}
          })
        )
      } else {
        this._checkSubmitSuccess(
          this.onSubmit({
            author: 'me',
            type: 'file',
            data: {file}
          })
        )
      }
    },
    _editText(event) {
      const text = this.$refs.userInput.textContent
      if (text && text.length) {
        this.$emit('edit', {
          author: 'me',
          type: 'text',
          id: store.state.editMessage.id,
          data: {text}
        })
        this._editFinish()
      }
    },
    _handleEmojiPicked(emoji) {
      this._checkSubmitSuccess(
        this.onSubmit({
          author: 'me',
          type: 'emoji',
          data: {emoji}
        })
      )
    },
    _handleFileSubmit(file) {
      this.file = file
    },
    _editFinish() {
      store.setState('editMessage', null)
    }
  }
}
</script>

<style scoped>
</style>
