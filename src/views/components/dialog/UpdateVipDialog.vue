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
              <v-text-field
                label="UID"
                :value="user.id"
                :loading="loading"
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Tên"
                :value="user.name"
                :loading="loading"
                disabled
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
            >
              <v-select
                v-model="price"
                :items="prices"
                item-text="label"
                item-value="code"
                label="Thời gian *"
                required
                :loading="loading"
                :disabled="loading"
              ></v-select>
            </v-col>
            <v-col
              cols="12"
            >
              <v-select
                v-model="price"
                :items="prices"
                item-text="price"
                item-value="code"
                label="Tổng"
                required
                :loading="loading"
                :disabled="loading"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
        <small>* Các trường có dấu * là bắt buộc</small>
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
        <v-btn
          color="blue darken-1"
          text
          @click="handleOrder"
          :loading="updatevipLoading"
        >
          Đăng ký
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
  const OrderRepository = RepositoryFactory.get('order');

  export default {
    name: 'UpdateVipDialog',
    data () {
      return {
        updatevipLoading: false,
        price: null,
        prices: [],
      }
    },
    created() {
      this.getUser();
      this.getPrices();
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
          this.price = response.data.length ? response.data[0].code : null;
          return;
        }

        this.handleResponseError(response);
      },
      getUser() {
        this.user.id || (this.setLoading(true), UserRepository.get().then((response) => this.setUserData(response)).finally(() => {
          this.setLoading(false)
        }));
      },
      getPrices() {
        this.setLoading(true);
        ExtensionRepository.getPrices().then((response) => this.setPricesData(response)).finally(() => {
          this.setLoading(false)
        });
      },
      handleOrder() {
        if (this.price == null) {
          return;
        }

        this.updatevipLoading = true;
        OrderRepository.store(this.price).then((response) => {
            if (!response.data || !response.data.code) {
              return;
            }

            this.$router.push({ name: 'order-detail', params: {code: response.data.code} })
          }).finally(() => {
            this.updatevipLoading = false;
            this.onClickSaveButton();
          });
      }
    }
  }
</script>
