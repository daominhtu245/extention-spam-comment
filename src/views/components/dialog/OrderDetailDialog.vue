<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="600px"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Nâng cấp VIP</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
                Bạn vui lòng chuyển khoản với nội dung như hướng dẫn dưới đây. Giao dịch sẽ được xử lý tự động trong 1-5 phút (nếu chuyển sai nội dung -10% phí và liên hệ Admin để được hỗ trợ)
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click="onClickCloseButton"
        >
          Đóng
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapMutations, mapActions, mapState } from 'vuex';
  import RepositoryFactory from '@/repositories/RepositoryFactory';
  import { status as responseStatus } from '@/config/response';

  const UserRepository = RepositoryFactory.get('user');
  const ExtensionRepository = RepositoryFactory.get('extension');

  export default {
    name: 'OrderDetailDialog',
    data () {
      return {
        content: null,
      }
    },
    created() {
      this.getUser();
    //   this.getPrices();
    },
    computed: {
      ...mapState(['user', 'loading']),
    },

    props: {
      dialog: {
        type: Boolean,
        default: () => (false),
      },

      onClickCloseButton: {
        type: Function,
      },

      onClickSaveButton: {
        type: Function,
      }
    },
    methods: {
      ...mapMutations({
        setUser: 'SET_USER',
        setLoading: 'SET_LOADING',
        setVersion: 'SET_VERSION'
      }),
      ...mapActions({
        handleResponseError: 'handleResponseError'
      }),
      setUserData(response) {
        if (response.status == responseStatus.success) {
          this.setUser(response.data);
          this.setVersion(response);
          return;
        }
        this.handleResponseError(response);
      },
      setPricesData(response) {
        if (response.status == responseStatus.success && response.data) {
          this.prices = response.data;
          this.price = response.data.length ? response.data[0] : null;
          return;
        }

        this.handleResponseError(response);
      },
      getUser() {
        this.user.id || (this.setLoading(true), UserRepository.get().then((response) => this.setUserData(response)).finally(() => {
          this.setLoading(false)
        }));
      }
    //   getPrices() {
    //     this.setLoading(true);
    //     ExtensionRepository.getPrices().then((response) => this.setPricesData(response)).finally(() => {
    //       this.setLoading(false)
    //     });
    //   }
    }
  }
</script>
