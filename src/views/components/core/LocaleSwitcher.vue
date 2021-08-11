<template>
    <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                    color="primary"
                    dark
                    v-bind="attrs"
                    v-on="on"
            >
                {{ locale }}
            </v-btn>
        </template>
        <v-list>
            <v-list-item
                    v-for="(item, index) in items"
                    :key="index"
                    @click="switchLocale(item)"
            >
                <v-list-item-title >{{ item.title }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>
<script>
  export default {
    name: 'LocaleSwitcher',
    created() {
      let locale = JSON.parse(localStorage.getItem('lang')) ||  { title: 'Việt Nam', value: 'vi'};
      this.$i18n.locale = locale.value;
      this.locale = locale.title;
    },
    data() {
      return {
        locales: process.env.VUE_APP_I18N_SUPPORTED_LOCALE.split(','),
        locale: '',
        items: [
          { title: 'Việt Nam', value: 'vi'},
          { title: 'English', value: 'en'},
          { title: 'Portugal', value: 'po'},
          { title: 'Indonesia', value: 'in'},
          { title: 'France', value: 'fr'},
          { title: 'Germany', value: 'ge'},
        ],
      }
    },

    methods: {
      switchLocale(locale) {
        if (this.$i18n.locale !== locale.value) {
          this.$i18n.locale = locale.value;
          this.locale = locale.title;
          localStorage.setItem('lang', JSON.stringify(locale));
        }
      }
    },
  }
</script>

<style scoped>
    .v-list-item {
        cursor: pointer;
    }
    .v-list-item:hover {
        background-color: #cccccc;
    }
</style>