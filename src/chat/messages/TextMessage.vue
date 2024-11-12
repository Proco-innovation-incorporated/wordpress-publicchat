<template>
  <div class="sc-message--text" :style="messageColors">
    <template>
      <div
        class="sc-message--toolbox"
        :style="{ background: messageColors.backgroundColor }"
      >
        <button
          v-if="showEdition && me && message.id"
          :disabled="isEditing"
          @click="edit"
        >
          <IconBase
            :color="isEditing ? 'black' : messageColors.color"
            width="10"
            icon-name="edit"
          >
            <IconEdit />
          </IconBase>
        </button>
        <button
          v-if="showDeletion && me && message.id"
          @click="$emit('remove')"
        >
          <IconBase :color="messageColors.color" width="10" icon-name="remove">
            <IconCross />
          </IconBase>
        </button>
        <slot name="text-message-toolbox" :message="message" :me="me"> </slot>
      </div>
    </template>
    <slot
      :message="message"
      :messageText="messageText"
      :messageColors="messageColors"
      :me="me"
    >
      <p class="sc-message--text-content" v-html="message.data.text"></p>
      <p
        v-if="message.data.meta"
        class="sc-message--meta"
        :style="{ color: messageColors.color }"
      >
        {{ message.data.meta }}
      </p>
      <p v-if="message.isEdited" class="sc-message--edited">
        <IconBase width="10" icon-name="edited">
          <IconEdit />
        </IconBase>
        edited
      </p>
    </slot>
    <div class="sc-message-atachments">
      <div
        v-for="attachment in message.data.attachments"
        :class="[
          'attachment-name',
          { 'non-clickable-attachment': !attachment.url },
        ]"
        @click="downloadAttachment(attachment)"
      >
        {{ attachment.filename }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "../store/";
import IconBase from "./../components/IconBase.vue";
import IconEdit from "./../components/icons/IconEdit.vue";
import IconCross from "./../components/icons/IconCross.vue";
import { htmlEscape } from "escape-goat";
import Autolinker from "autolinker";
import fmt from "msgdown";
import store from "../store/";

export default {
  components: {
    IconBase,
    IconCross,
    IconEdit,
  },
  props: {
    message: {
      type: Object,
      required: true,
    },
    messageColors: {
      type: Object,
      required: true,
    },
    messageStyling: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const attachments = [
      "unknown.pdf",
      "unknown.unknown",
      "https://cdn-icons-png.flaticon.com/128/2659/2659360.png",
    ];

    const attachmentsIcons = (attachmentLink) => {
      return {
        default: "https://cdn-icons-png.flaticon.com/128/2258/2258853.png",
        pdf: "https://cdn-icons-png.flaticon.com/128/337/337946.png",
        png: attachmentLink,
        jpg: attachmentLink,
        jpeg: attachmentLink,
        svg: attachmentLink,
      };
    };

    const detectIconForAttachment = (attachmentLink) => {
      const attachmentExtension = attachmentLink.split(".").pop().split("?")[0];
      const attchmentIcon =
        attachmentsIcons(attachmentLink)[attachmentExtension] ??
        attachmentsIcons(attachmentLink).default;

      return attchmentIcon;
    };

    const downloadAttachment = (attachment) => {
      if (attachment.url) {
        var link = document.createElement("a");
        link.target = "_blank";
        link.href = attachment.url;
        link.download = "Download.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

    return {
      attachments,
      attachmentsIcons,
      detectIconForAttachment,
      downloadAttachment,
      ...mapState(["showDeletion", "showEdition"]),
    };
  },
  computed: {
    messageText() {
      const escaped = htmlEscape(this.message.data.text);

      try {
        return Autolinker.link(this.messageStyling ? fmt(escaped) : escaped, {
          className: "chatLink",
          truncate: { length: 50, location: "smart" },
        });
      } catch (e) {
        console.log(e);
      }

      return escaped;
    },
    me() {
      return this.message.author === "me";
    },
    isEditing() {
      return (
        (store.state.editMessage && store.state.editMessage.id) ===
        this.message.id
      );
    },
  },
  methods: {
    edit() {
      store.setState("editMessage", this.message);
    },
  },
};
</script>

<style scoped lang="scss">
.sc-message-atachments {
  img {
    cursor: pointer;
  }
}
</style>
