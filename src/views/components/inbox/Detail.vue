<template>
    <v-card class="px-0 py-0 mt-0 mb-0">
        <v-img height="150px" src="@/assets/cover.png" style="position: relative">
            <div style="position: absolute; top: 5px; right: 5px">
                <locale-switcher></locale-switcher>
            </div>
            <v-card-text class="white--text mt-8 d-flex justify-center">
                <div class="text-center">
                    <v-avatar size="70">
                        <img alt="user" :src="user.picture">
                    </v-avatar>
                    <p>{{ user.name }}</p>
                </div>

            </v-card-text>
        </v-img>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="4">
                    <v-icon small color="blue darken-2">
                        mdi-account-box
                    </v-icon>
                    {{ user.name }}
                </v-col>
                <v-col cols="12" sm="4">
                    <v-icon small color="blue darken-2">
                        mdi-calendar-today
                    </v-icon>
                    {{ user.birthday }}
                </v-col>
                <v-col cols="12" sm="4">
                    <v-icon small color="blue darken-2">
                        mdi-gender-transgender
                    </v-icon>
                    {{ user.gender }}
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
  import Toasted from 'vue-toasted';
  import Vue from 'vue';

  Vue.use(Toasted)

  export default {
    name: 'Detail',
    components: {
      LocaleSwitcher: () => import('../../components/core/LocaleSwitcher'),
    },
    data () {
      return {
        user: {
          name: 'User',
          picture: 'https://cdn.pixabay.com/photo/2020/06/24/19/12/cabbage-5337431_1280.jpg',
          gender: 'Gender'
        },
      }
    },
    created () {
      this.$store.dispatch('userProfile').then((response) => {
        this.user = response.data
      })
    }
  }
</script>

<style scoped>

</style>