<template>
  <v-dialog
    v-model="dialogModel"
    persistent
    max-width="290"
  >
    <v-card>
      <v-card-title class="headline">
        Bạn chưa đăng nhập Facebook!
      </v-card-title>
      <v-card-text>Vui lòng đăng nhập facebook để sử dụng tính năng lọc bạn bè của extension.</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green darken-1"
          text
          @click="onClickButton"
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'LoginNotyDialog',

    props: {
      dialog: {
        type: Boolean,
        default: () => (false),
      },
    },
    watch: {
      dialog: function (newVal, oldVal) {
        this.dialogModel = newVal;
      }
    },
    data() {
      return {
        dialogModel: this.dialog
      };
    },
    methods: {
      onClickButton() {
        this.dialogModel = false;
        window.open("https://facebook.com");
      },
    }
  }
</script>
