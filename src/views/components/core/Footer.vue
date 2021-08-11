<template>
  <v-footer
    id="dashboard-core-footer"
  >
    <v-container>
      <v-row
        align="center"
        no-gutters
      >
        <v-col
          v-for="(link, i) in links"
          :key="i"
          class="text-center mb-sm-0 mb-5"
          cols="auto"
        >
          <a
            :href="link.href"
            class="mr-0 grey--text text--darken-3"
            rel="noopener"
            target="_blank"
            v-text="link.text"
          />
        </v-col>

        <v-spacer class="hidden-sm-and-down" />

        <v-bottom-navigation>
          <a v-for="link in contact" :href="link.link" target="_blank" class="pa-0">
            <v-btn  value="recent" class="ma-2 text-sm-h4" :style="{borderRadius: '5px', color: link['color'] + '!important', backgroundColor: link['background-color']}">
              <span>{{ link.label }}</span>
            </v-btn>
          </a>
        </v-bottom-navigation>
      </v-row>
      <v-col
              cols="12"
              md="auto"
      >

        <div class="body-1 font-weight-light pt-6 pt-md-0 text-center">
          &copy; {{ (new Date()).getFullYear() }} by <a href="http://amaiteam.com">Amaiteam</a>
        </div>
      </v-col>
    </v-container>
  </v-footer>
</template>

<script>
  export default {
    name: 'DashboardCoreFooter',

    data: () => ({
      links: [
        // {
        //   href: '#',
        //   text: 'Creative Tim',
        // },
        // {
        //   href: '#',
        //   text: 'About Us',
        // },
        // {
        //   href: '#',
        //   text: 'Blog',
        // },
        // {
        //   href: '#',
        //   text: 'Licenses',
        // },
      ],
      contact: []
    }),

    created() {
      this.getContact();
    },

    methods: {
      async getContact () {
        const response = await fetch(process.env.BASE_EXTENSION + '/gc?name=Auto Post Into Group');
        const rp = await response.json();
        this.contact = rp.data;
      },
    },
  }
</script>

<style lang="sass">
  #dashboard-core-footer
    a
      font-size: .825rem
      font-weight: 500
      text-decoration: none
      text-transform: uppercase
</style>
