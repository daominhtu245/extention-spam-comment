<template>
    <v-card class="px-0 py-0 mt-5 mb-0">
        <v-card-title>1. {{ $t('choice_group') }}:</v-card-title>
        <v-card-text class="pb-0 pt-3 pl-8">
            <v-textarea
                    hide-details
                    filled
                    name="input-7-4"
                    :label="$t('fill_group')"
                    v-model="fillGroups"
                    rows="5"
            ></v-textarea>
            <p class="mb-0 pa-2">{{ $t('or') }}</p>
            <v-autocomplete
                    v-model="groups"
                    :items="items"
                    item-text="label"
                    item-value="id"
                    dense
                    chips
                    small-chips
                    :label="$t('choice_group_holder')"
                    multiple
                    solo
            ></v-autocomplete>
        </v-card-text>
    </v-card>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
    name: 'ChoiceGroup',
    data () {
      return {
        items: [],
        itemsCopy: [],
        searchTerm: "",
        groups: [],
        fillGroups: ''
      }
    },

      computed: {
        ...mapState(['groupsList']),
      },
    created () {
      this.getPage();
    },

    watch: {
      groupsList() {
        this.items = JSON.parse(JSON.stringify(this.groupsList));
      },

      groups() {
        this.updateGroup()
      },

      fillGroups() {
        this.updateGroup()
      }
    },

    methods: {
      updateGroup() {
        const filledGroup = this.fillGroups.split('\n');
        const groupChoice = this.groups.concat(filledGroup).filter(item => item !== '')
        this.$store.commit('set_groups', this.items.filter(item => groupChoice.includes(item.id)))
      },

      getPage() {
        this.$store.dispatch('listGroup')
      }
    }
  }
</script>

<style scoped>

</style>