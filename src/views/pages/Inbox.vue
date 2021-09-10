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
  },

  data() {
    return {
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
        "🙂🙂",
        "😀",
        "😄",
        "😆",
        "😅",
        "😂",
        "🤣",
        "😊",
        "☺️",
        "😌",
        "😉",
        "😏",
        "😍",
        "😘",
        "😗",
        "😙",
        "😚",
        "🤗",
        "♥️",
        "💙",
        "😺",
        "😸",
        "😹",
        "😻",
        "😼",
        "😽",
        "🙀",
        "🌺",
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
        this.content = this.content.replaceAll(
          "{icon}",
          this.icons[Math.floor(Math.random() * this.icons.length)]
        );

        this.handleTime();
        this.handleRandomText();
        this.handleTag();
        this.handleSpin();
        return this.content;
      } catch (error) {
        console.log(error);
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
      console.log("TAG LIST:", this.$store.state.tagList);
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

    async startComment() {
      const listGroupId = this.$store.state.groups;
      const allGroup = this.$store.state.groupsList;

      if (listGroupId.length == 0) {
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
            console.log("Get Post !!!!");
            let comment = this.combineContent(group);
            let postList = await this.getGroupPost(group);
            //let postList = ["123"];
            postList.map((postId) => {
              // XÁC ĐỊNH GROUP ĐANG TÌM POST
              this.currentGroup = `<p style="color:#0084c6;font-weight:bold"> ${
                this.$t("find_post") + group.name
              }</p>`;
              //Start comment
              timeComment += step;
              let getCommentTimeout = setTimeout(() => {
                // console.log("Comment:", comment);
                //XÁC ĐỊNH GROUP ĐANG COMMENT
                this.currentGroup = `<p style="color:#4caf50;font-weight:bold"> ${
                  this.$t("create_comment") + group.name
                }</p>`;

                this.postComment(postId, comment, group);
              }, timeComment * 1000);
              this.onSendding.push(getCommentTimeout);
            });
          }, timeGetPost * 1000);
          this.onSendding.push(getPostTimeout);
        }
      }
    },

    async stopComment() {
      for (let i = 0; i < this.onSendding.length; i++) {
        clearTimeout(this.onSendding[i]);
      }
      this.progressBar = 0;
      this.sendding = 0;
      this.onSendding = [];
      this.isProgressing = false;
      this.currentGroup = `<p style="color:red;font-weight:bold"> ${
        this.$t("cancel_comment_process")
      }</p>`;
    },

    async postComment(postId, comment, group) {
      // Handle Upload Attachment
      let attachmentArray = this.attachment;
      if (this.regime === "regime_text") {
        attachmentArray = ["text"];
      } else if (this.regime === "regime_text_file") {
        attachmentArray = ["text"].concat(
          this.attachment.filter((item) => ["files", "images"].includes(item))
        );
      } else if (
        this.regime === "regime_file" &&
        this.attachmentData["images"]
      ) {
        attachmentArray =
          this.attachmentData["images"].length > 0 ? ["images"] : ["text"];
        console.log(
          "Attachment State Length:",
          this.attachmentData["images"].length
        );
      }
      const attachment =
        attachmentArray[Math.floor(Math.random() * attachmentArray.length)];
      let attachmentData = null;
      if (attachment === "images") {
        const dt = this.attachmentData["images"];
        attachmentData = [dt[Math.floor(Math.random() * dt.length)]];
      }
      console.log("Attachment Type: ", attachment);
      console.log("ATTACHMENT DATA: ", attachmentData);

      if (attachment === "text") {
        attachmentData = null;
      }
      this.$store
        .dispatch("comment", {
          postId: postId,
          comment: comment,
          tagList: this.$store.state.tagList,
          attachment: attachment,
          attachmentData: attachment === "images" ? [attachmentData[0]] : null,
        })
        .then(async (result) => {
          if (this.sendding > 0) {
            this.sendding -= 1;
          }
          if (result.isError) {
            this.error++;
            this.logger +=
              '<p style="color: #ff312a">' +
              this.$t("error_post") +
              ' <a style="color: #1e55e3" href="https://www.facebook.com/groups/' +
              group.id +
              '" target="_blank">' +
              group.name +
              "</a>: " +
              result.description +
              "</p>";
          } else {
            this.success++;
            this.logger +=
              '<p style="color: #008037">' +
              this.$t("success_post") +
              ' <a style="color: #1e55e3" href="https://www.facebook.com/groups/' +
              group.id +
              '" target="_blank">' +
              group.name +
              "</a>," +
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


