<template>
  <v-card class="px-0 py-0 mt-5 mb-0 pt-3">
    <v-card-title>
      2. {{ $t("select_group") }}
      <v-spacer></v-spacer>
    </v-card-title>
    <v-row style="padding: 10px">
      <v-col md="6" sm="12">
        <v-select
          :items="memberFilter"
          label="Standard"
          @change="fillerGroupByMember($event)"
        ></v-select>
      </v-col>
      <v-col md="6" sm="12">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-col>
    </v-row>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="validGroup"
      :single-select="singleSelect"
      :search="search"
      item-key="id"
      show-select
      class="elevation-1"
      @item-selected="selectSingleGroup($event)"
      @toggle-select-all="selectAllGroup($event)"
    >
      <template #item.cover="{ value }">
        <img :src="value" class="group-cover" alt="" />
      </template>
      <template #item.id="{ value }">
        <a
          :href="`https://facebook.com/` + value"
          target="_blank"
          class="group-cover"
          alt=""
        >
          {{ value }}</a
        >
      </template>
    </v-data-table>
    <v-card-title>
      3. {{ $t("add_custom_group") }}
      <v-spacer></v-spacer>
    </v-card-title>
    <v-textarea
      style="margin: 15px"
      :placeholder="$t('label_add_custom_group')"
      @change="selectCustomId"
    >
    </v-textarea>
  </v-card>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "GroupTable",
  data() {
    return {
      singleSelect: false,
      selected: [],
      headers: [
        {
          text: "COVER",
          align: "start",
          sortable: false,
          value: "cover",
        },
        { text: "NAME", value: "name" },
        { text: "PRIVACY", value: "privacy" },
        { text: "MEMBER", value: "memberCount" },
        { text: "ID", value: "id" },
      ],
      memberFilter: [
        {
          text: " 10 Member",
          value: 10,
        },
        {
          text: " 100 Member",
          value: 100,
        },
        {
          text: " 1000 Member",
          value: 1000,
        },
        {
          text: " 10000 Member",
          value: 10000,
        },
      ],
      groups: [
        {
          cover:
            "https://c8.alamy.com/comp/2BHG705/colourful-conceptual-images-2BHG705.jpg",
          name: "THIS IS GROUP NAME",
          memberCount: 9999,
          id: "2734123487128977",
        },
      ],
      items: [],
      itemsCopy: [],
      search: "",
      groups: [],
      validGroup: [],
      selectedList: [],
      fillGroups: "",
    };
  },

  computed: {
    ...mapState(["groupsList"]),
  },
  async created() {
    await this.getPage();
  },

  watch: {
    groupsList() {
      this.items = JSON.parse(JSON.stringify(this.groupsList));
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        this.groups.push({
          cover: item.cover?.source,
          name: item.name,
          id: item.id,
          memberCount: item.member_count,
          privacy: item.privacy,
        });
      }
      this.validGroup = this.groups;
    },

    groups() {
      this.updateGroup();
    },

    fillGroups() {
      this.updateGroup();
    },
  },

  methods: {
    //Select new group to add in list
    updateGroup() {
      // const filledGroup = this.fillGroups.split("\n");
      // const groupChoice = this.groups
      //   .concat(filledGroup)
      //   .filter((item) => item !== "");
      // console.log("Selected group: ", filledGroup);
      // console.log("New selected group: ", groupChoice);
      // this.$store.commit(
      //   "set_groups",
      //   this.items.filter((item) => groupChoice.includes(item.id))
      // );
    },
    // Lấy các group
    async getPage() {
      await this.$store.dispatch("listGroup");
    },
    // Lọc group theo member count
    fillerGroupByMember(value) {
      this.validGroup = [];
      for (let i = 0; i < this.groups.length; i++) {
        const group = this.groups[i];
        if (group.memberCount >= value) {
          this.validGroup.push(group);
        }
      }
    },
    // Chọn 1 group
    async selectSingleGroup(value) {
      const selectedGroup = value.item;
      console.log(value);
      //value = true => checked
      if (value.value) {
        this.selectedList.push(selectedGroup.id);
      } else {
        const REMOVE_INDEX = this.selectedList.indexOf(selectedGroup.id);
        this.selectedList.splice(REMOVE_INDEX, 1);
      }
      this.$store.commit("set_groups", this.selectedList);
    },
    // Chọn select all group
    selectAllGroup(value) {
      console.log(value);
      const selectedArray = value.items;
      //value = true => checked
      if (value.value) {
        for (const group of selectedArray) {
          if (this.selectedList.indexOf(group.id) == -1) {
            this.selectedList.push(group.id);
          }
        }
      } else {
        for (const group of selectedArray) {
          const REMOVE_INDEX = this.selectedList.indexOf(group.id);
          if (REMOVE_INDEX > -1) {
            this.selectedList.splice(REMOVE_INDEX, 1);
          }
        }
      }
      this.$store.commit("set_groups", this.selectedList);
    },
    //Nhập Id tùy chọn
    selectCustomId(value) {
      value = value.replaceAll(/(\r\n|\n|\r)/gm, " ");
      console.log("Raw custom group:",value);
      let validChar = [" ", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
      for (let i = 0; i < value.length; i++) {
        if (!validChar.includes(value[i])) {
          alert(this.$t("invalid_group_id") + i);
          return;
        }
      }
      let idArray = value.replaceAll(/\s+/g, " ");
      idArray = idArray.split(" ");
      let customListGroup = idArray.map((id) => {
        return { id: id, name: id };
      });
      this.$store.commit("set_custom_groupList", customListGroup);
      console.log("Custom Group:", this.$store.state.customGroupList);
    },
  },
};
</script>
<style >
.group-cover {
  width: 200px;
  height: 100px;
}

@media only screen and (max-width: 500px) {
  .group-cover {
    display: none;
  }
}

.v-data-table-header tr th span {
  color: black;
  font-size: 1rem;
  font-weight: bold;
}
</style>