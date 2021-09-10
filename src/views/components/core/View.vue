<template>
  <v-main class="blue lighten-5">
    <router-view />
    <v-btn
      v-scroll="onScroll"
      v-show="fab"
      fab
      dark
      fixed
      bottom
      right
      color="primary"
      @click="toTop"
    >
      <v-icon size="x-large">mdi-chevron-up</v-icon>
    </v-btn>
    <dashboard-core-footer />
  </v-main>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "DashboardCoreView",
  data: () => ({
    fab: false,
  }),
  computed: {
    ...mapState(["fb_login"]),
  },
  components: {
    DashboardCoreFooter: () => import("./Footer"),
  },
  methods: {
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 20;
    },
    toTop() {
      this.$vuetify.goTo(0);
    },
  },
};
</script>
