<template>
  <v-container id="filter-friend" fluid tag="section">
    <!-- HEADER -->
    <v-row>
      <v-card class="px-0 py-0 mt-5 pb-3 mb-0 pt-3" style="width: 100%">
        <v-card-title style="justify-content: center">
          AUTO COMMENT TOOLS
        </v-card-title>
      </v-card>
      <dashboard-core-drawer> </dashboard-core-drawer>
    </v-row>
    <!-- CONTENT -->
    <v-row>
      <v-col md="12" sm="12" style="height: 100%">
        <comment-editor></comment-editor>
      </v-col>
      <v-col md="12" sm="12" style="height: 100%">
        <group-table></group-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="12">
        <v-card
          class="px-0 py-0 mt-5 mb-0 pt-3"
          style="padding: 10px !important"
        >
          <!-- START / STOP BUTTON -->
          <v-row style="margin: 15px; justify-content: center">
            <v-btn
              depressed
              color="primary"
              @click="startComment"
              :disabled="isProgressing"
            >
              Start Comment</v-btn
            >
            <v-btn
              depressed
              color="error"
              @click="stopComment"
              :disabled="!isProgressing"
            >
              Stop!</v-btn
            >
          </v-row>

          <!-- SELECT PAGE TO USE -->
          <v-row style="margin: 15px; justify-content: center">
            <v-col
              sm="12"
              style="
                padding: 0px;
                margin: 0px;
                display: flex;
                justify-content: center;
                align-items: baseline;
              "
            >
              <v-checkbox
                hide-details
                class="shrink mt-4"
                value="images"
                v-model="autoSkip"
              >
              </v-checkbox>
              <p>{{ $t("auto_skip") }}</p>
            </v-col>
            <v-col sm="12" style="padding: 0px; margin: 0px">
              <p
                style="
                  padding: 0px;
                  margin: 0px;
                  font-weight: bold;
                  color: green;
                "
              >
                {{ $t("use_page") }}
              </p>
            </v-col>
            <v-col sm="12" style="padding: 0px; margin: 0px">
              <v-select
                style="padding: 0px; margin: 0px"
                :items="accountList"
                item-text="name"
                item-value="id"
                attach
                chips
                label="Select Page"
                multiple
                @change="setSelectedPage"
              >
              </v-select>
            </v-col>
          </v-row>

          <!-- Current GROUP -->
          <v-row
            v-html="currentGroup"
            style="margin: 15px; justify-content: center"
          >
            {{ currentGroup }}
          </v-row>
          <!-- Progress Bar -->
          <v-row style="margin: 15px; justify-content: center">
            <v-progress-linear
              color="light-green darken-4"
              height="30"
              striped
              :buffer-value="progressBar"
              stream
            ></v-progress-linear>
          </v-row>
          <!-- Progress Table -->
          <v-row style="margin: 15px; justify-content: center">
            <table border="1">
              <thead class="progress-table-header">
                <tr>
                  <th style="color: blue">On Progress</th>
                  <th style="color: green">Finish</th>
                  <th style="color: red">Error</th>
                </tr>
              </thead>
              <tbody class="progress-table-body">
                <tr>
                  <td style="color: blue">{{ sendding }}</td>
                  <td style="color: green">{{ success }}</td>
                  <td style="color: red">{{ error }}</td>
                </tr>
              </tbody>
            </table>
          </v-row>
          <div v-html="logger" style="margin: 15px; justify-content: center">
            {{ logger }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- FIXED BUTTON TO TOP -->
    <v-btn
      class="font-weight-bold"
      v-if="statusPost === 'processing' || statusPost === 'wait'"
      color="blue darken-3"
      x-large
      fixed
      bottom
      right
      style="z-index: 99; bottom: 80px; right: 0"
      elevation="7"
      @click="dialog = true"
    >
      {{ $t("view_process") }}
      <v-icon right dark> mdi-eye </v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import {
  downloadTextArea,
  getRndInteger,
  blobToDataURL,
} from "../../helper/util";
import CommentEditor from "../components/comment/CommentEditor.vue";
import GroupTable from "../components/comment/GroupTable.vue";

export default {
  name: "Inbox",
  components: {
    CommentEditor: () => import("../components/comment/CommentEditor"),
    GroupTable: () => import("../components/comment/GroupTable"),
    DashboardCoreDrawer: () => import("../components/core/Drawer"),
    DashboardCoreAppBar: () => import("../components/core/AppBar"),
  },

  created() {
    this.statusInboxList = {
      wait: {
        color: "teal darken-3",
        label: this.$t("wait"),
      },
      processing: {
        color: "blue darken-3",
        label: this.$t("process"),
      },
      done: {
        color: "green darken-3",
        label: this.$t("done"),
      },
      stop: {
        color: "red darken-3",
        label: this.$t("stop"),
      },
    };
    this.getAccountList();
  },

  data() {
    return {
      autoSkip: false,
      selectedPage: [],
      isProgressing: false,
      progressBar: 0,
      logger: "",
      //count comment
      numSend: 0,
      sendding: 0,
      success: 0,
      error: 0,
      onSendding: [],
      currentGroup: "",
      statusPost: "stop",
      dialog: false,
      content: "",
      icons: [
        "🙂",
        "🙂",
        "😀",
        "😄",
        "😆",
        "😅",
        "😂",
        "🤣",
        "😊",
        "😌",
        "😉",
        "😏",
        "😍",
        "😘",
        "😗",
        "😙",
        "😚",
        "🤗",
        "💙",
        "😺",
        "😸",
        "😹",
        "😻",
        "😼",
        "😽",
        "🙀",
        "🌺",
        "🔰",
      ],
      statusInboxList: {
        wait: {
          color: "teal darken-3",
          label: "Wait",
        },
        processing: {
          color: "blue darken-3",
          label: "Processing",
        },
        done: {
          color: "green darken-3",
          label: "Done",
        },
        stop: {
          color: "red darken-3",
          label: "Stop",
        },
      },
      loading1: false,
      timeRemain: 0,
      accountList: [],
      errorCount: [],
    };
  },

  beforeDestroy() {},

  computed: {
    ...mapState([
      "contentText",
      "attachment",
      "attachmentData",
      "groups",
      "timeDelay",
      "randomImage",
      "randomLink",
      "randomStream",
      "randomFile",
      "choiceTime",
      "minTime",
      "maxTime",
      "regime",
      "customPostList",
      "isFocusMode",
    ]),
  },

  watch: {},

  methods: {
    combineContent(group) {
      try {
        const contentChoice =
          this.contentText[Math.floor(Math.random() * this.contentText.length)];
        // HANDLE GROUP NAME
        this.content = contentChoice.replaceAll("{group}", group.name);
        // HANDLE RANDOM ICON
        // this.content = this.content.replaceAll(
        //   "{icon}",
        //   this.icons[Math.floor(Math.random() * this.icons.length)]
        // );
        while (this.content.indexOf("{icon}") > -1) {
          this.content = this.content.replace(
            "{icon}",
            this.icons[Math.floor(Math.random() * this.icons.length)]
          );
        }
        this.handleTime();
        this.handleRandomText();
        this.handleTag();
        this.handleSpin();
        return this.content;
      } catch (error) {
        console.log("Combine Content Fail:", error);
      }
    },
    handleTime() {
      const today = new Date();
      const time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      this.content = this.content.replaceAll("{time}", time);
    },

    handleRandomText() {
      let stringLength = 7;
      let randomString = "";
      let characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
      for (let i = 0; i < stringLength; i++) {
        randomString += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      this.content = this.content.replaceAll("{random}", randomString);
    },

    async handleTag() {
      const tags = this.content.match(/\{@((()[^\}])*@)\}/gm);
      let tagList = [];
      if (tags) {
        for (let i = 0; i < tags.length; i++) {
          const tag = tags[i];
          const result = tag.replaceAll("{@", "").replaceAll("@}", "");
          tagList.push(result);
          this.content = this.content.replaceAll(tag, result);
        }
      }
      await this.$store.commit("set_tag_list", tagList);
    },

    handleSpin() {
      const spins = this.content.match(/\{((()[^\}])*)\}/gm);
      if (spins) {
        for (let i = 0; i < spins.length; i++) {
          const spin = spins[i];
          const spinSplit = spin
            .replaceAll("{", "")
            .replaceAll("}", "")
            .split("|");
          const spinGet =
            spinSplit[Math.floor(Math.random() * spinSplit.length)];
          this.content = this.content.replaceAll(spin, spinGet);
        }
      }
    },

    //Get post to spam comment
    async getGroupPost(group) {
      let post = await this.$store.dispatch("getGroupPost", {
        groupId: group.id,
        limit: this.$store.state.limitPost,
      });
      return post.data;
    },
    //Set isStart to background
    async setIsStart(value) {
      let post = await this.$store.dispatch("setIsStart", {
        value: value,
      });
      return post.data;
    },
    async startComment() {
      let listGroupId = this.$store.state.groups;
      let allGroup = this.$store.state.groupsList;
      let customListGroup = this.$store.state.customGroupList;
      let customListId = customListGroup.map((group) => group.id);
      allGroup = allGroup.concat(customListGroup);
      listGroupId = listGroupId.concat(customListId);
      if (listGroupId.length == 0 && !this.isFocusMode) {
        alert(this.$t("pls_choice_post"));
        return;
      }
      if (this.maxTime < this.minTime && this.choiceTime === "range") {
        alert(this.$t("pls_time"));
        return;
      }
      // Time delay for each comment
      let timeGetPost = 0,
        timeComment = 0;
      // PROGRESS CONTROL
      this.errorCount = [];
      this.isProgressing = true;
      this.sendding = listGroupId.length * this.$store.state.limitPost;
      this.numSend = this.sendding;
      this.error = 0;
      this.success = 0;
      this.logger = "";
      this.progressBar = 0;
      this.currentGroup = `<p style="color:#9c27b0;font-weight:bold"> ${this.$t(
        "start_comment_process"
      )}</p>`;
      this.setIsStart(true);
      switch (this.isFocusMode) {
        case true:
          if (this.customPostList.length <= 0) {
            alert("Empty Post List");
            this.stopComment();
            return;
          }
          this.sendding =
            this.customPostList.length * this.$store.state.limitPost;
          this.numSend = this.sendding;
          for (const group of this.customPostList) {
            let step = parseInt(
              this.choiceTime === "range"
                ? getRndInteger(this.minTime, this.maxTime)
                : this.timeDelay
            );
            timeGetPost += step;
            for (let i = 0; i < this.$store.state.limitPost; i++) {
              let getPostTimeout = setTimeout(async () => {
                let postList = group.postId;
                // IF FIND POST FAIL
                if (postList.length == 0) {
                  this.skipEmptyPost(group);
                } else {
                  postList.map((postId) => {
                    let comment = this.combineContent(group);
                    // XÁC ĐỊNH GROUP ĐANG TÌM POST
                    this.currentGroup = `<p style="color:#0084c6;font-weight:bold"> ${
                      this.$t("find_post") + group.name
                    }</p>`;
                    //Start comment
                    timeComment += step;
                    let getCommentTimeout = setTimeout(() => {
                      //XÁC ĐỊNH GROUP ĐANG COMMENT
                      this.currentGroup = `<p style="color:#4caf50;font-weight:bold"> ${
                        this.$t("create_comment") + group.name
                      }</p>`;

                      this.postComment(postId, comment, group);
                    }, timeComment * 1000);
                    this.addOnSendding(group.id, "comment", getCommentTimeout);
                  });
                }
              }, timeGetPost * 1000);
              this.addOnSendding(group.id, "post", getPostTimeout);
            }
          }
          break;

        default:
          for (const group of allGroup) {
            if (listGroupId.indexOf(group.id) > -1) {
              // GET POST OF GROUP LOOP
              let step = parseInt(
                this.choiceTime === "range"
                  ? getRndInteger(this.minTime, this.maxTime)
                  : this.timeDelay
              );
              timeGetPost += step;
              let getPostTimeout = setTimeout(async () => {
                let postList = await this.getGroupPost(group);
                if (postList.length == 0) {
                  this.skipEmptyPost(group);
                } else {
                  postList.map((postId) => {
                    let comment = this.combineContent(group);
                    // XÁC ĐỊNH GROUP ĐANG TÌM POST
                    this.currentGroup = `<p style="color:#0084c6;font-weight:bold"> ${
                      this.$t("find_post") + group.name
                    }</p>`;
                    //Start comment
                    timeComment += step;
                    let getCommentTimeout = setTimeout(() => {
                      //XÁC ĐỊNH GROUP ĐANG COMMENT
                      this.currentGroup = `<p style="color:#4caf50;font-weight:bold"> ${
                        this.$t("create_comment") + group.name
                      }</p>`;

                      this.postComment(postId, comment, group);
                    }, timeComment * 1000);
                    this.addOnSendding(group.id, "comment", getCommentTimeout);
                  });
                }
              }, timeGetPost * 1000);
              this.addOnSendding(group.id, "post", getPostTimeout);
            }
          }
          break;
      }
    },

    addOnSendding(groupId, type, timeOutId) {
      this.onSendding.push({
        group: groupId,
        type: type,
        timeOutId: timeOutId,
      });
    },

    async getAccountList() {
      let accountLists = await this.$store.dispatch("listAccount", "");
      this.accountList = accountLists;
    },

    setErrorCount(groupId) {
      if (this.errorCount.indexOf(groupId) < 0) {
        this.errorCount.push(groupId);
        return false;
      } else {
        let count = 0;
        for (const groupID of this.errorCount) {
          if (groupID == groupId) {
            count++;
          }
        }
        if (count == 2) {
          this.stopCommentInGroup(groupId);
          return true;
        } else {
          this.errorCount.push(groupId);
          return false;
        }
      }
    },

    skipEmptyPost(group) {
      this.currentGroup = `<p style="color:red;font-weight:bold"> ${
        this.$t("find_post_fail") + group.name
      }</p>`;
      this.logger += `<p style="color:red;font-weight:bold"> ${
        this.$t("find_post_fail") + group.name
      }</p>`;
      this.sendding -= this.$store.state.limitPost;
      this.error += parseInt(this.$store.state.limitPost);
      if (this.sendding < 0) {
        this.sendding = 0;
      }
      this.progressBar =
        (1 - parseFloat(this.sendding) / parseFloat(this.numSend)) * 100;
      if (this.progressBar == 100) {
        this.setIsStart(false)
        this.isProgressing = false;
      }
    },

    stopCommentInGroup(groupId) {
      for (let i = 0; i < this.onSendding.length; i++) {
        if (this.onSendding[i].group == groupId) {
          clearTimeout(this.onSendding[i].timeOutId);
        }
      }
      let limit = this.$store.state.limitPost;
      this.error += limit - 3;
      this.sendding -= limit - 3;
      if (this.sendding < 0) {
        this.sendding = 0;
        this.error = this.numSend - this.success;
      }
      this.progressBar =
        (1 - parseFloat(this.sendding) / parseFloat(this.numSend)) * 100;
    },

    async stopComment() {
      for (let i = 0; i < this.onSendding.length; i++) {
        clearTimeout(this.onSendding[i].timeOutId);
      }
      console.log("COOKIE ON STOP: ", document.cookie);
      this.progressBar = 0;
      this.sendding = 0;
      this.onSendding = [];
      this.errorCount = [];
      this.isProgressing = false;
      this.currentGroup = `<p style="color:red;font-weight:bold"> ${this.$t(
        "cancel_comment_process"
      )}</p>`;
      this.setIsStart(false);
    },
    setSelectedPage(value) {
      this.selectedPage = value;
    },

    async postComment(postId, comment, group) {
      // Handle Upload Attachment
      let attachment = "text";
      if (this.regime.includes("Random")) {
        this.$store.commit("set_regime", ["Random"]);
        let regimeOption = ["Text", "Image", "Link"];
        let regimeLength = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
        for (let i = 0; i < regimeLength; i++) {
          let selectedIndex = Math.floor(Math.random() * regimeOption.length);
          this.regime.push(regimeOption[selectedIndex]);
          regimeOption.splice(selectedIndex, 1);
        }
      }
      //Hande Text
      if (!this.regime.includes("Text")) {
        comment = " ";
      }
      // Handle Image
      if (this.regime.includes("Image") && this.attachmentData["images"]) {
        attachment =
          this.attachmentData["images"].length > 0 ? "images" : "text";
      }
      let attachmentData = null;
      if (attachment == "images") {
        const dt = this.attachmentData["images"];
        attachmentData = [dt[Math.floor(Math.random() * dt.length)]];
      } else {
        attachmentData = null;
      }
      // Handle Link
      if (this.regime.includes("Link") && this.attachmentData["link"]) {
        const dt = this.attachmentData["link"];
        comment += " ";
        comment += this.randomLink
          ? dt[Math.floor(Math.random() * dt.length)]
          : dt[0];
      }
      let pageId = null;
      let selectedPage = null;
      if (this.selectedPage.length > 0) {
        pageId =
          this.selectedPage[
            Math.floor(Math.random() * this.selectedPage.length)
          ];
        selectedPage = this.accountList.filter((value, index) => {
          return value.id == pageId;
        });
      }
      this.$store
        .dispatch("comment", {
          postId: postId,
          comment: comment,
          tagList: this.$store.state.tagList,
          attachment: attachment,
          attachmentData: attachment === "images" ? [attachmentData[0]] : null,
          pageId: pageId,
        })
        .then(async (result) => {
          let now = new Date();
          let currentTime =
            now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
          if (this.sendding > 0) {
            this.sendding -= 1;
          }
          if (result.isError) {
            console.log("Sent Comment Error:", result);
            this.error++;
            this.logger +=
              '<p style="color: #ff312a">' +
              currentTime +
              " " +
              this.$t("error_post") +
              ' <a style="color: #1e55e3" href="https://www.facebook.com/' +
              postId +
              '" target="_blank">' +
              group.name +
              "</a> , by " +
              (selectedPage ? selectedPage[0].name : "User") +
              ": " +
              result.description +
              "</p>";
            let isSkip = this.autoSkip ? this.setErrorCount(group.id) : false;
            if (isSkip) {
              this.logger +=
                '<p style="color: #ff312a">' +
                currentTime +
                " " +
                this.$t("skip_group") +
                ' <a style="color: #1e55e3" href="https://www.facebook.com/' +
                group.id +
                '" target="_blank">' +
                group.name +
                "</a> !!!!! " +
                "</p>";
            }
          } else {
            this.success++;
            this.logger +=
              '<p style="color: #008037">' +
              currentTime +
              " " +
              this.$t("success_post") +
              ' <a style="color: #1e55e3" href="https://www.facebook.com/' +
              group.id +
              '" target="_blank">' +
              group.name +
              "</a>, by " +
              (selectedPage ? selectedPage[0].name : "User") +
              " " +
              this.$t("view") +
              '  <a style="color: #1e55e3" href="' +
              result.comment_link +
              '" target="_blank">' +
              this.$t("post") +
              "</a></p>";
          }
          this.progressBar =
            (1 - parseFloat(this.sendding) / parseFloat(this.numSend)) * 100;
          if (this.progressBar == 100) {
            this.currentGroup = `<p style="color:#2bb734"> ${this.$t(
              "complete_comment"
            )}</p>`;
            this.isProgressing = false;
            this.setIsStart(false);
          }
        });
    },
  },
};
</script>
<style lang="css">
.progress-table-header tr th {
  font-size: 1rem !important;
  font-weight: bold !important;
  padding: 15px;
  width: 150px;
}
.progress-table-body tr td {
  font-size: 1rem;
  font-weight: bold;
  padding: 15px;
  text-align: center;
}

.v-dialog {
  position: absolute;
  top: 0;
}

.v-chip__content {
  font-size: 14px;
}

.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}

@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>


