<template>
  <BubbleChat
    :always-scroll-to-bottom="alwaysScrollToBottom"
    :close="closeChat"
    :colors="colors"
    :is-open="isChatOpen"
    :message-list="messageList"
    :message-styling="messageStyling"
    :new-messages-count="newMessagesCount"
    :on-message-was-sent="onMessageWasSent"
    :open="openChat"
    :participants="participants"
    :show-close-button="true"
    :show-launcher="true"
    :show-emoji="true"
    :show-file="false"
    :show-typing-indicator="showTypingIndicator"
    :show-edition="true"
    :show-deletion="true"
    :title="'WSI Helper'"
    :title-image-url="titleImageUrl"
    :disable-user-list-toggle="false"
    @onType="handleOnType"
    @edit="editMessage"
    @remove="removeMessage"
  >
    <template v-slot:text-message-toolbox="scopedProps">
      <button
        v-if="!scopedProps.me && scopedProps.message.type === 'text'"
        @click.prevent="like(scopedProps.message.id)"
      >
        👍
      </button>
    </template>
    <template v-slot:text-message-body="scopedProps">
      <p class="sc-message--text-content" v-html="scopedProps.messageText"></p>
      <p
        v-if="scopedProps.message.data.meta"
        class="sc-message--meta"
        :style="{color: scopedProps.messageColors.color}"
      >
        {{ scopedProps.message.data.meta }}
      </p>
      <p
        v-if="scopedProps.message.isEdited || scopedProps.message.liked"
        class="sc-message--edited"
      >
        <template v-if="scopedProps.message.isEdited">✎</template>
        <template v-if="scopedProps.message.liked">👍</template>
      </p>
    </template>
    <template v-slot:system-message-body="{message}"> [System]: {{ message.text }} </template>
  </BubbleChat>
</template>

<script>
import messageHistory from "./messageHistory.js";
import chatParticipants from './chatProfiles'
import availableColors from './colors'
import { emitter } from "./chat/event/index.js";
import {sendSocketMessage} from "./chat/store/index.js";
import * as emoji from 'node-emoji'
function getMediaMessage(author, id, file) {
  return {
    type: 'file',
    author: author,
    id: id + Math.random(),
      data: {
      // text: `What about this one instead?? `,
      file: {
        url: file
      },
      // meta: '✓✓ Read'
    }
  }
}
function tryToGetMediaFromMessage(message) {
  const imageRegex = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif))/gi;
  const fileRegex = /(https?:\/\/[^\s]+\.(?:pdf|docx|doc|xls|xlsx))/gi;

  const imageLinks = message.data.text.match(imageRegex);
  const fileLinks = message.data.text.match(fileRegex);

  const listOfArray = [
    ...(imageLinks || []),
    ...(fileLinks || [])
  ];

  return listOfArray.map(item => {
    return getMediaMessage(message.author, message.message, item);
  })
}

export default {
  name: 'App',
  data() {
    return {
      participants: chatParticipants,
      titleImageUrl: 'https://avatars.slack-edge.com/2023-11-08/6167902866547_40bae925c2a284f1ae73_88.jpg',
      messageList: messageHistory.map(item => {
        const countOfPArsed = tryToGetMediaFromMessage(item)
        return countOfPArsed.length ? [item].concat(countOfPArsed) : [item]
      }).flat(),
      newMessagesCount: 0,
      isChatOpen: false,
      showTypingIndicator: '',
      colors: null,
      availableColors,
      chosenColor: null,
      alwaysScrollToBottom: true,
      messageStyling: true,
      userIsTyping: false
    }
  },
  computed: {
    linkColor() {
      return this.chosenColor === 'dark' ? this.colors.sentMessage.text : this.colors.launcher.bg
    },
    backgroundColor() {
      return this.chosenColor === 'dark' ? this.colors.messageList.bg : '#fff'
    }
  },
  created() {
    this.setColor('blue')
  },
  mounted() {
    emitter.$on('onmessage', (event) => {
      if(event.msg_type === 'system' && !event.success) {
        Object.assign({}, {
          type: 'system',

          data: {
            text: event.response
          },
          author: `bot`
        }, {id: event.id})
        this.showTypingIndicator = '';
      }
      if(!event.msg_type || event.msg_type === 'bot') {
        const message = Object.assign({}, {
          type: 'text',
          data: {
            text: event.response
          },
          author: `bot`
        }, {id: event.id})
        const messages = tryToGetMediaFromMessage(message)
        this.messageList = [
          ...this.messageList,
          message,
          ...messages,
          ...(event.media_urls?.map((i) => getMediaMessage(`bot`, event.id, i.url)) || [])
        ]
        this.showTypingIndicator = '';
      }
    })
    this.messageList.forEach((x) => (x.liked = false))
  },
  methods: {
    onMessageWasSent(message) {

      if(message.type === 'emoji') {
        const obj = emoji.which(message.data.emoji);
        sendSocketMessage(obj)
      } else {
        sendSocketMessage(message.data.text)
      }
      this.showTypingIndicator = true;
      this.messageList = [...this.messageList, Object.assign({}, message, {id: Math.random()})]
    },
    openChat() {
      this.isChatOpen = true
      this.newMessagesCount = 0
    },
    closeChat() {
      this.isChatOpen = false
    },
    setColor(color) {
      this.colors = this.availableColors[color]
      this.chosenColor = color
    },
    showStylingInfo() {
      this.$modal.show('dialog', {
        title: 'Info',
        text:
          'You can use *word* to <strong>boldify</strong>, /word/ to <em>emphasize</em>, _word_ to <u>underline</u>, `code` to <code>write = code;</code>, ~this~ to <del>delete</del> and ^sup^ or ¡sub¡ to write <sup>sup</sup> and <sub>sub</sub>'
      })
    },
    messageStylingToggled(e) {
      this.messageStyling = e.target.checked
    },
    handleOnType() {
      emitter.$emit('onType')
      this.userIsTyping = true
    },
    editMessage(message) {
      const m = this.messageList.find((m) => m.id === message.id)
      m.isEdited = true
      m.data.text = message.data.text
    },
    removeMessage(message) {
      if (confirm('Delete?')) {
        const m = this.messageList.find((m) => m.id === message.id)
        m.type = 'system'
        m.data.text = 'This message has been removed'
      }
    },
    like(id) {
      const m = this.messageList.findIndex((m) => m.id === id)
      var msg = this.messageList[m]
      msg.liked = !msg.liked
      this.$set(this.messageList, m, msg)
    }
  }
}
</script>

<style scoped>
@import "normalize.css";

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

a {
  font-weight: 500;
  color: #393db0;
  text-decoration: inherit;
}
a:hover {
  color: #2d308c;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

.card {
  padding: 2em;
}

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

@media (prefers-color-scheme: light) {
  a:hover {
    color: #0E142CFF;
  }
  button {
    background-color: #f9f9f9;
  }
}

</style>
