<template>
  <v-card class="px-0 py-0 mt-5 mb-0 pt-3">
    <!-- Title base on Selected Language -->
    <v-card-title class="pb-0 pt-0">1. {{ $t("edit_post") }}:</v-card-title>
    <!-- TEXT EDITOR -->
    <v-card-text class="pl-8 pt-3">
      <p>
        <i>{{ $t("note_content") }}</i>
      </p>
      <!-- Instructions -->
      <p class="green--text text--darken-4">
        {{ $t("command") }}: {group}: {{ $t("add_group_name") }}, {icon}:{{
          $t("add_icon_random")
        }}, {time}: {{ $t("add_time") }}, {A|B|C}:{{ $t("spin_label") }}.{{
          $t("sample_spin")
        }},
      </p>
      <p class="green--text text--darken-4">{@userID@}:{{ $t("tag_user") }}</p>
      <p style="color: red">
        {{ $t("warning_split") }}
      </p>
      <v-row class="pt-0" style="position: relative">
        <v-col
          cols="12"
          sm="12"
          class="pt-0 pb-4"
          v-for="(con, i) in content"
          :key="i"
          style="position: relative"
        >
          <!-- ADD ICON -->
          <v-switch
            :label="$t('label_split')"
            class="position-absolute btn-dynammic"
            depressed
            small
            @change="splitText($event, i)"
            style="color: green"
          ></v-switch>
          <!-- TEXT FIELD -->
          <textarea
            rows="5"
            class="content"
            :id="`content-${i}`"
            @focus="contentIndex = i"
            @input="updateContent($event, i)"
            placeholder="Content of comment"
          >
          </textarea>
          <v-icon
            x-large
            color="red darken-3"
            v-if="content.length > 1"
            style="vertical-align: super"
            @click="
              () => {
                content = content.filter((con, j) => j !== i);
                contentIndex = content.length - 1;
              }
            "
          >
            mdi-minus-box
          </v-icon>
        </v-col>
      </v-row>
      <!-- DYNAMIC TAG  -->
      <v-row>
        <v-col sm="12">
          <v-btn
            class="position-absolute mr-1"
            depressed
            small
            color="blue darken-3"
            @click="
              () => {
                content.push('');
                contentIndex = content.length - 1;
              }
            "
          >
            <v-icon>mdi-comment-plus-outline</v-icon>
            {{ $t("add_content") }}
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <!-- DINAMIC TAG ROW 1 -->
        <v-col sm="12" class="" v-if="content.length">
          <!-- ADD SPIN -->
          <v-btn
            class="position-absolute btn-dynamic"
            depressed
            small
            @click="addSpin()"
          >
            <v-icon style="margin-right: 10px">mdi-dice-5</v-icon>
            {{ $t("btn_add_spin") }}
          </v-btn>
          <!--  ADD RANDOM ICON -->
          <v-btn
            class="position-absolute btn-dynamic"
            depressed
            small
            @click="addIcon()"
          >
            <v-icon style="margin-right: 10px">mdi-emoticon-cool</v-icon>
            {{ $t("btn_add_icon_random") }}
          </v-btn>
          <!-- ADD GROUP NAME -->
          <v-btn
            class="position-absolute btn-dynamic"
            depressed
            small
            @click="addGroup()"
          >
            <v-icon style="margin-right: 10px">mdi-checkerboard</v-icon>
            {{ $t("btn_add_group") }}
          </v-btn>
          <!-- ADD CURRENT TIME -->
          <v-btn
            class="position-absolute btn-dynamic"
            depressed
            small
            @click="addTime()"
          >
            <v-icon style="margin-right: 10px">mdi-timer</v-icon>
            {{ $t("btn_add_time") }}
          </v-btn>
          <!-- ADD ICON -->
          <v-btn
            class="position-absolute btn-dynamic"
            depressed
            small
            @click="copyIcon"
          >
            <v-icon style="margin-right: 10px">mdi-emoticon-tongue</v-icon>
            {{ $t("btn_copy_icon") }}
          </v-btn>

          <!-- ADD RANDOM TEXT -->
          <v-btn
            class="position-absolute btn-dynamic"
            depressed
            small
            @click="addRandomText()"
          >
            <v-icon style="margin-right: 10px">mdi-dice-5</v-icon>
            {{ $t("btn_random_text") }}
          </v-btn>
          <!-- TAG USER -->
          <v-btn
            class="position-absolute btn-dynamic"
            depressed
            small
            @click="tagUser()"
          >
            <v-icon style="margin-right: 10px">mdi-timer</v-icon>
            {{ $t("btn_tag_user") }}
          </v-btn>
        </v-col>
      </v-row>
      <!-- COPY ICON IFRAME -->
      <v-row v-if="showIcon" class="pt-10">
        <iframe
          src="https://iconfb.net/icon-fb/smileys.html"
          width="100%"
          height="400"
          frameborder="0"
          style=""
        ></iframe>
      </v-row>
      <v-col cols="12" style="display: flex; align-items: center">
        <!-- POST LIMIT -->
        <label for="post-limit" class="pb-1"
          >{{ $t("label_post_limit") }}
        </label>
        <div style="width: 170px">
          <v-text-field
            id="post-limit"
            class="position-absolute"
            style="margin-left: 5px"
            type="number"
            min="1"
            step="1"
            label="Số bài comment"
            dense
            @change="setLimitPost"
          ></v-text-field>
        </div>
      </v-col>
    </v-card-text>
    <!-- UPLOAD EDITOR -->
    <v-card-text class="pl-8 pt-8">
      <p>
        <i>{{ $t("note_message") }}</i>
      </p>
      <v-row>
        <!--image-->
        <v-row>
          <v-col cols="12" sm="2" class="pt-0 pb-0">
            <v-checkbox
              hide-details
              class="shrink mt-4"
              value="images"
              v-model="attachment"
              :label="$t('attach_image')"
            >
            </v-checkbox>
          </v-col>
          <v-col cols="12" sm="8" class="pt-0 pb-0">
            <v-file-input
              :label="$t('choice_image')"
              filled
              prepend-icon="mdi-camera"
              multiple
              chips
              v-model="images"
              accept="image/png, image/jpeg, image/bmp"
              :disabled="!attachment.includes('images')"
            ></v-file-input>
          </v-col>
        </v-row>
        <v-row>
          <!--link-->
          <v-col cols="12" sm="2" class="pt-1 pb-0">
            <v-checkbox
              hide-details
              class="shrink mt-4"
              value="link"
              v-model="attachment"
              :label="$t('attach_link')"
            >
            </v-checkbox>
          </v-col>
          <v-col cols="12" sm="8" style="position: relative">
            <v-row v-for="(lin, i) in link" :key="i">
              <v-col cols="12" sm="11" class="pt-0 pb-0">
                <v-text-field
                  hide-details
                  v-model="link[i]"
                  :label="$t('link_attach_post')"
                  prepend-icon="mdi-link"
                  :disabled="!attachment.includes('link')"
                  solo
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="1">
                <v-icon
                  v-if="link.length > 1"
                  :disabled="!attachment.includes('link')"
                  large
                  color="red darken-3"
                  @click="
                    () => {
                      link = link.filter((li, j) => j !== i);
                    }
                  "
                >
                  mdi-minus-box
                </v-icon>
              </v-col>
            </v-row>
            <div
              :style="{
                position: 'absolute',
                left: '45px',
                bottom: link.length > 1 ? '-12px' : '-24px',
              }"
            >
              <v-icon
                color="blue darken-3"
                large
                :disabled="!attachment.includes('link')"
                @click="
                  () => {
                    link.push('');
                  }
                "
                >mdi-plus-box
              </v-icon>
            </div>
          </v-col>
          <v-col
            cols="12"
            sm="2"
            :class="[
              'pt-2',
              'pb-0',
              link.length > 1 ? 'd-flex align-center' : '',
            ]"
          >
            <v-checkbox
              hide-details
              class="shrink mt-4"
              value="link"
              color="indigo"
              v-model="randomLink"
              :label="$t('random_link')"
              :disabled="!attachment.includes('link')"
            >
            </v-checkbox>
          </v-col>
        </v-row>
      </v-row>
      <v-row class="pt-2 mt-8">
        <v-radio-group v-model="choiceTime" row>
          <v-col cols="12" sm="12">
            <label>{{ $t("time_delay") }}</label>
          </v-col>
          <v-col cols="12" sm="2" class="pt-0 pb-0">
            <v-radio
              hide-details
              class="shrink mt-4"
              value="range"
              :label="$t('choice_time')"
            >
            </v-radio>
          </v-col>
          <v-col cols="12" sm="5" class="pt-0 pb-0">
            <v-select
              :items="items"
              item-text="text"
              item-value="value"
              :label="$t('min_time')"
              solo
              v-model="minTime"
              :disabled="choiceTime !== 'range'"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="5" class="pt-0 pb-0">
            <v-select
              :items="items"
              item-text="text"
              item-value="value"
              :label="$t('max_time')"
              solo
              v-model="maxTime"
              :disabled="choiceTime !== 'range'"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="2" class="pt-0 pb-0">
            <v-radio
              hide-details
              class="shrink mt-4"
              value="fill"
              :label="$t('fill_time')"
            >
            </v-radio>
          </v-col>
          <v-col cols="12" sm="5" class="pt-0 pb-0">
            <v-text-field
              class="pt-0"
              v-model="timeDelay"
              type="number"
              min="5"
              step="1"
              :label="$t('time_delay')"
              solo
              append-icon="mdi-timer-sand"
              :disabled="choiceTime !== 'fill'"
            ></v-text-field>
          </v-col>
        </v-radio-group>
      </v-row>
      <!-- Chế độ gửi -->
      <v-row class="pt-0">
        <v-col sm="12"><p style="color:green;font-weight:bold">{{$t("label_select_regime")}}</p></v-col>
       <v-col sm="12" style="margin:0px;padding:0px">
          <v-select
          :items="regimeOption"
          item-text="text"
          item-value="value"
          :label="$t('label_regime')"
          solo
          v-model="choiceRegime"
        ></v-select>
       </v-col>
        <!-- <v-radio-group
          v-model="choiceRegime"
          row
          class="mt-0"
          style="width: 100%"
        >
          <v-col cols="12" sm="12">
            <label>{{ $t("regime") }}</label>
          </v-col>
          <v-col cols="12" sm="4" class="pt-0 pb-0">
            <v-radio
              hide-details
              class="shrink mt-4"
              value="regime_text"
              :label="$t('regime_text')"
            >
            </v-radio>
          </v-col>
          <v-col cols="12" sm="4" class="pt-0 pb-0">
            <v-radio
              hide-details
              class="shrink mt-4"
              value="regime_text_file"
              :label="$t('regime_text_file')"
            >
            </v-radio>
          </v-col>
          <v-col cols="12" sm="4" class="pt-0 pb-0">
            <v-radio
              hide-details
              class="shrink mt-4"
              value="regime_file"
              :label="$t('regime_file')"
            >
            </v-radio>
          </v-col>
           <v-col cols="12" sm="2" class="pt-0 pb-0">
            <v-radio
              hide-details
              class="shrink mt-4"
              value="regime_text_link"
              :label="$t('regime_text_link')"
            >
            </v-radio>
          </v-col>
          <v-col cols="12" sm="4" class="pt-0 pb-0">
            <v-radio
              hide-details
              class="shrink mt-4"
              value="regime_text_link_file"
              :label="$t('regime_text_link_file')"
            >
            </v-radio>
          </v-col> -->
        <!-- </v-radio-group> -->
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from "vue";
import Toasted from "vue-toasted";
import { mapGetters, mapState } from "vuex";

Vue.use(Toasted);

export default {
  name: "CommentEditor",

  components: {},

  data() {
    return {
      postLimit: [
        { value: 1, text: "1 Post" },
        { value: 2, text: "2 Post" },
        { value: 3, text: "3 Post" },
        { value: 4, text: "4 Post" },
        { value: 5, text: "5 Post" },
      ],

      items: [
        { value: 10, text: "10s" },
        { value: 20, text: "20s" },
        { value: 30, text: "30s" },
        { value: 60, text: "60s" },
        { value: 100, text: "100s" },
      ],
      images: [],
      attachment: [],
      files: [],
      content: [""],
      showIcon: false,
      timeDelay: "",
      streamLink: [""],
      link: [""],
      contentIndex: 0,
      randomImage: true,
      randomFile: false,
      randomLink: false,
      randomStream: false,
      choiceTime: "range",
      minTime: "10",
      maxTime: "60",
      choiceRegime: ["Text"],
      regimeOption: [
        {
          value: ["Text"],
          text: "Text",
        },
        {
          value: ["Image"],
          text: "Image",
        },
        {
          value: ["Link"],
          text: "Link",
        },
        {
          value: ["Text", "Image"],
          text: "Text + Image",
        },
        {
          value: ["Text", "Link"],
          text: "Text + Link",
        },
        {
          value: ["Image", "Link"],
          text: "Image + Link",
        },
        {
          value: ["Text", "Image", "Link"],
          text: "Text + Image + Link",
        },
        {
          value: ["Random"],
          text: "Random",
        },
      ],
    };
  },

  computed: {
    ...mapState(["attachmentData"]),
  },

  watch: {
    choiceRegime() {
      this.$store.commit("set_regime", this.choiceRegime);
      console.log("Comment option: ", this.$store.state.regime);
    },

    images() {
      this.setFile("images");
    },

    files() {
      this.setFile("files");
    },

    streamLink() {
      this.setStream();
    },

    link() {
      this.setAttachmentData("link", this.link);
    },

    attachment() {
      this.$store.commit("set_attachment", this.attachment);

      if (this.attachment.includes("images") && this.images.length) {
        this.setFile("images");
      }
    },

    content() {
      this.$store.commit("set_content", this.content);
    },

    timeDelay() {
      if (this.choiceTime === "fill" && this.timeDelay >= 5) {
        this.$store.commit("set_time_delay", this.timeDelay);
      } else {
        this.$toasted.error(this.$t("error_fill_time"), { duration: 1000 });
      }
    },

    randomImage() {
      this.$store.commit("set_random_image", this.randomImage);
    },

    randomFile() {
      this.$store.commit("set_random_file", this.randomFile);
    },

    randomLink() {
      this.$store.commit("set_random_link", this.randomLink);
    },

    randomStream() {
      this.$store.commit("set_random_stream", this.randomStream);
    },

    choiceTime() {
      this.$store.commit("set_choice_time", this.choiceTime);
      if (this.choiceTime === "range" && this.minTime <= this.maxTime) {
        this.$store.commit("set_min_time", this.minTime);
        this.$store.commit("set_max_time", this.maxTime);
      }
      if (this.choiceTime === "fill" && this.timeDelay >= 5) {
        this.$store.commit("set_time_delay", this.timeDelay);
      }
    },

    minTime() {
      if (this.minTime <= this.maxTime) {
        this.$store.commit("set_min_time", this.minTime);
      } else {
        this.$toasted.error(this.$t("error_choice_time"), { duration: 1000 });
      }
    },

    maxTime() {
      if (this.minTime <= this.maxTime) {
        this.$store.commit("set_max_time", this.maxTime);
      } else {
        this.$toasted.error(this.$t("error_choice_time"), { duration: 1000 });
      }
    },
  },

  methods: {
    //   TEXT EDITOR
    updateContent(value, i) {
      this.content[i] = value.target.value;
      this.$store.commit("set_content", this.content);
    },

    addSpin() {
      this.content[this.contentIndex] += "{A|B|C}";
      document.getElementById(`content-${this.contentIndex}`).value =
        this.content[this.contentIndex];
      this.$store.commit("set_content", this.content);
    },

    addIcon() {
      this.content[this.contentIndex] += "{icon}";
      document.getElementById(`content-${this.contentIndex}`).value =
        this.content[this.contentIndex];
      this.$store.commit("set_content", this.content);
    },

    addTime() {
      this.content[this.contentIndex] += "{time}";
      document.getElementById(`content-${this.contentIndex}`).value =
        this.content[this.contentIndex];
      this.$store.commit("set_content", this.content);
    },

    addGroup() {
      this.content[this.contentIndex] += "{group}";
      document.getElementById(`content-${this.contentIndex}`).value =
        this.content[this.contentIndex];
      this.$store.commit("set_content", this.content);
    },

    splitText(value, i) {
      console.log(`Value: ${value} ----- Index: ${i}`);
      let content = this.content[i];
      if (content.charAt(0) == "{") {
        content = "|" + content;
      }
      let contentArray = content.split(/{|}/);
      content = "";
      for (let i = 0; i < contentArray.length; i++) {
        if (i % 2 == 0) {
          if (value) {
            content += contentArray[i].replaceAll("", "|");
          } else {
            content += contentArray[i].replaceAll("|", "");
          }
        } else {
          content += `{${contentArray[i]}}`;
        }
      }
      this.content[i] = content;
      document.getElementById(`content-${i}`).value =
        this.content[i];
      this.$store.commit("set_content", this.content);
    },

    addRandomText() {
      this.content[this.contentIndex] += "{random}";
      document.getElementById(`content-${this.contentIndex}`).value =
        this.content[this.contentIndex];
      this.$store.commit("set_content", this.content);
    },
    tagGroup() {
      this.content[this.contentIndex] += "{@groupId@}";
      document.getElementById(`content-${this.contentIndex}`).value =
        this.content[this.contentIndex];
      this.$store.commit("set_content", this.content);
    },
    tagUser() {
      this.content[this.contentIndex] += "{@userId@}";
      document.getElementById(`content-${this.contentIndex}`).value =
        this.content[this.contentIndex];
      this.$store.commit("set_content", this.content);
    },
    tagPage() {
      this.content[this.contentIndex] += "{@pageId@}";
      document.getElementById(`content-${this.contentIndex}`).value =
        this.content[this.contentIndex];
      this.$store.commit("set_content", this.content);
    },
    copyIcon() {
      this.showIcon = !this.showIcon;
    },

    setLimitPost(value) {
      this.$store.commit("set_limit_post", value);
      // console.log(`Limit comment at ${this.$store.state.limitPost} post`);
    },

    setFile(obj) {
      let fileData = [];
      for (let i = 0; i < this[obj].length; i++) {
        const file = this[obj][i];
        fileData.push({
          file: URL.createObjectURL(file),
          fileName: file.name,
          fileType: file.type,
        });
      }
      this.setAttachmentData(obj, fileData);
    },

    setStream() {
      if (this.streamLink.length) {
        try {
          let streams = [];
          for (let i = 0; i < this.streamLink.length; i++) {
            const streamLink = this.streamLink[i];
            const url = new URL(streamLink);
            const path = url.pathname.split("/");
            const id = path[path.length - 1];
            if (id == parseInt(id, 10)) {
              streams.push(path[path.length - 1]);
            } else {
              this.$toasted.error(this.$t("stream_link_wrong"), {
                duration: 2000,
              });
            }
          }
          this.setAttachmentData("stream", streams);
        } catch (e) {
          this.$toasted.error(this.$t("stream_link_wrong"), { duration: 2000 });
        }
      }
    },

    setAttachmentData(name, data) {
      let attachmentData = this.attachmentData;
      attachmentData[name] = data;
      this.$store.commit("set_attachment_data", attachmentData);
    },
  },
};
</script>

<style>
.content {
  width: 96%;
  border: 1px solid #454545;
  background-color: #f8f8f8;
  border-radius: 10px 10px 10px 10px;
  padding: 10px;
  outline: none;
}

.btn-dynamic {
  width: 170px;
  justify-content: right !important;
  padding: 15px !important;
  margin: 5px;
  background-color: dodgerblue !important;
  font-size: 0.7rem !important;
}

.upload-file {
  width: 100%;
}

.image-container {
  width: 100% !important;
  background-color: #faf7fb !important;
}
</style>