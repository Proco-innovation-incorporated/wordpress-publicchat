<template>
  <div class="user-list" :style="{background: userListColor.userList.bg}">
    <table style="padding-top: 5px;">
      <tbody>
        <tr v-for="user in participants" :key="user.id">
          <td style="text-align: center;">
            <img :src="user.imageUrl" class="img-msg" />
          </td>
          <td class="user-element" :style="{color: userListColor.userList.text}">
            {{ user.name }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    participants: {
      type: Array,
      required: true
    },
    colors: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    userListColor() {
      const defaultColors = {
        userList: {
          bg: '#FFFFFF',
          text: '#000000'
        }
      }
      return Object.assign(defaultColors, this.colors)
    }
  }
}
</script>

<style scoped>

</style>
