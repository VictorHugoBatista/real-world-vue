<template>
  <div class="notification-container">
    <NotificationBar
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import NotificationBar from "@/components/NotificationBar.vue";

export default {
  components: {
    NotificationBar
  },
  computed: {
    ...mapState("notification", ["notifications"])
  }
};
</script>

<style scoped>
.notification-container {
  bottom: 0;
  padding-right: 40px;
  position: fixed;
  right: 0;
}
</style>
