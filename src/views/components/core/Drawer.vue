<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    :expand-on-hover="expandOnHover"
    :right="$vuetify.rtl"
    mobile-breakpoint="960"
    app
    width="260"
    v-bind="$attrs"
  >
    <template v-slot:img="props">
      <v-img
        :gradient="`to bottom, rgb(101 181 220 / 36%), rgb(46 155 232)`"
        v-bind="props"
      />
    </template>

    <v-divider class="mb-1" />

    <v-list dense nav>
      <v-list-item>
        <v-list-item-avatar class="align-self-center" color="white" contain>
          <v-img src="@/assets/logo.png" max-height="30" />
        </v-list-item-avatar>
        <div class="d-flex flex-column">
          <v-list-item-content class="pa-0 pb-1">
            <v-list-item-title class="display-1" v-text="profile.title" />
          </v-list-item-content>
        </div>
      </v-list-item>
    </v-list>

    <v-divider class="mb-2" />

    <v-list expand nav>
      <div />
      <template v-for="(item, i) in computedItems">
        <base-item-group v-if="item.children" :key="`group-${i}`" :item="item">
        </base-item-group>
        <base-item v-else :key="`item-${i}`" :item="item" />
      </template>
      <div />
    </v-list>
    <a v-for="image in banner" :href="image.link" target="_blank">
      <v-img
        style="margin: 3px"
        :lazy-src="image.image"
        :src="image.image"
      ></v-img>
    </a>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "DashboardCoreDrawer",

  props: {
    expandOnHover: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    items: [
      {
        title: " Auto Spam Fanpage",
        icon: "mdi-account-search",
        to: "/inbox",
      },
    ],
    profile: {
      avatar: true,
      title: " Auto Spam Fanpage",
    },
    banner: [],
    contact: [],
  }),

  created() {
    this.getBanner();
  },

  computed: {
    ...mapState(["barColor", "barImage"]),
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.commit("SET_DRAWER", val);
      },
    },
    computedItems() {
      return this.items.map(this.mapItem);
    },
  },

  methods: {
    mapItem(item) {
      return {
        ...item,
        children: item.children ? item.children.map(this.mapItem) : undefined,
        title: this.$t(item.title),
      };
    },

    async getBanner() {
      console.log("Trigger get Banner: ",process.env.BASE_EXTENSION);
      const response = await fetch(
        process.env.BASE_EXTENSION + "/gb?name=Auto Post Into Group"
      );
      const rp = await response.json();
      this.banner = rp.data;
    },

    logout() {
      this.$store.dispatch("logout");
      this.$router.push("login");
    },
  },
};
</script>

<style lang="sass">
body
  font-size: 100%

  .v-data-table
    th
      font-size: 1.1em !important
      font-weight: bold !important

      #core-navigation-drawer
        .v-list-group__header.v-list-item--active:before
          opacity: .24

          .v-list-item
            &__icon--text,
            &__icon:first-child
              justify-content: center
              text-align: center
              width: 20px

              +ltr()
                margin-right: 24px
                margin-left: 12px !important

                +rtl()
                  margin-left: 24px
                  margin-right: 12px !important

            .v-list--dense
              .v-list-item
                &__icon--text,
                &__icon:first-child
                  margin-top: 10px

            .v-list-group--sub-group
              .v-list-item
                +ltr()
                  padding-left: 8px

                  +rtl()
                    padding-right: 8px

                .v-list-group__header
                  +ltr()
                    padding-right: 0

                    +rtl()
                      padding-right: 0

                    .v-list-item__icon--text
                      margin-top: 19px
                      order: 0

                    .v-list-group__header__prepend-icon
                      order: 2

                      +ltr()
                        margin-right: 8px

                        +rtl()
                          margin-left: 8px
</style>
