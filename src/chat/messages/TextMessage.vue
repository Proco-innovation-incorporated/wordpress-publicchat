<template>
  <div class="sc-message--text bborie-text-message" :style="messageColors">
    <slot
      :message="message"
      :messageColors="messageColors"
      :me="me"
    >
      <p
        class="sc-message--text-content bborie-text-message-content"
        v-html="message.data.text"
      >
      </p>
      <p
        v-if="message.data.meta"
        class="sc-message--meta"
        :style="{ color: messageColors.color }"
      >
        {{ message.data.meta }}
      </p>
    </slot>
    <!-- disabled for public chat
    <div class="sc-message--atachments">
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
    -->
  </div>
</template>

<script>
import { mapState } from "../store/";
import IconBase from "./../components/IconBase.vue";
import IconEdit from "./../components/icons/IconEdit.vue";
import IconCross from "./../components/icons/IconCross.vue";
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
.sc-message--attachments {
  img {
    cursor: pointer;
  }
}
</style>
