<template>
    <v-card class="px-0 py-0 mt-5 mb-0 pt-3">
        <v-card-title class="pb-0 pt-0">2. {{ $t('edit_post') }}:</v-card-title>
        <v-card-text class="pl-8 pt-3">
            <p><i>{{ $t('note_content') }}</i></p>
            <p class="green--text text--darken-4">
                {{ $t('command') }}: @group: {{ $t('add_group_name') }}, {icon}: {{ $t('add_icon_random') }}, {time}: {{ $t('add_time') }}, {A|B|C}: {{
                $t('spin_label') }}. {{ $t('sample_spin') }}
            </p>
            <v-row class="pt-0" style="position: relative">
                <v-col cols="12" sm="12" class="pt-0 pb-4" v-for="(con, i) in content" :key="i"
                       style="position: relative">
                    <textarea
                            rows="5"
                            style="width: 96%; border: 1px solid #454545;
                            background-color: #f8f8f8; border-radius: 15px 15px 0 0; padding-left: 20px"
                            :id="`content-${i}`"
                            @focus="contentIndex = i"
                            @input="updateContent($event, i)"
                    >
                    </textarea>
                    <v-icon x-large color="red darken-3" v-if="content.length > 1" style="vertical-align: super;"
                            @click="() => {content = content.filter((con,j) => j !== i); contentIndex = content.length - 1}">
                        mdi-minus-box
                    </v-icon>
                </v-col>
                <div style="text-align: right; position: absolute; right: 8px; bottom: -20px;" v-if="content.length">
                    <v-btn
                            class="position-absolute mr-1"
                            depressed
                            small
                            color="orange darken-3"
                            @click="addSpin()"
                    >
                        <v-icon>mdi-dice-5</v-icon>
                        {{ $t('btn_add_spin') }}
                    </v-btn>
                    <v-btn
                            class="position-absolute mr-1"
                            depressed
                            small
                            color="brown darken-3"
                            @click="addIcon()"
                    >
                        <v-icon>mdi-emoticon-cool</v-icon>
                        {{ $t('btn_add_icon_random') }}
                    </v-btn>
                    <v-btn
                            class="position-absolute mr-1"
                            depressed
                            small
                            color="pink darken-2"
                            @click="addGroup()"
                    >
                        <v-icon>mdi-checkerboard</v-icon>
                        {{ $t('btn_add_group') }}
                    </v-btn>
                    <v-btn
                            class="position-absolute mr-1"
                            depressed
                            small
                            color="blue-grey darken-3"
                            @click="addTime()"
                    >
                        <v-icon>mdi-timer</v-icon>
                        {{ $t('btn_add_time') }}
                    </v-btn>
                    <v-btn
                            class="position-absolute mr-1"
                            depressed
                            small
                            color="red darken-3"
                            @click="copyIcon"
                    >
                        <v-icon>mdi-emoticon-tongue</v-icon>
                        {{ $t('btn_copy_icon') }}
                    </v-btn>
                </div>
                <div style="position: absolute; left: 12px; bottom: -20px;">
                    <v-btn
                            class="position-absolute mr-1"
                            depressed
                            small
                            color="blue darken-3"
                            @click="() => {content.push(''); contentIndex = content.length - 1}"
                    >
                        <v-icon>mdi-comment-plus-outline</v-icon>
                        {{ $t('add_content') }}
                    </v-btn>
                </div>
            </v-row>
            <v-row v-if="showIcon" class="pt-10">
                <iframe src="https://iconfb.net/icon-fb/smileys.html" width="100%" height="400" frameborder="0"
                        style=""></iframe>
            </v-row>
        </v-card-text>
        <v-card-text class="pl-8 pt-8">
            <p><i>{{ $t('note_message') }}</i></p>
            <v-row>
                <!--image-->
                <v-col cols="12" sm="2" class="pt-0 pb-0">
                    <v-checkbox hide-details
                                class="shrink mt-4"
                                value="images"
                                v-model="attachment"
                                :label="$t('attach_image')">
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
                <v-col cols="12" sm="2" class="pt-0 pb-0">
                    <v-checkbox hide-details
                                class="shrink mt-4"
                                value="image"
                                color="indigo"
                                v-model="randomImage"
                                :disabled="!attachment.includes('images')"
                                :label="$t('random_image')">
                    </v-checkbox>
                </v-col>

                <!--file-->
                <v-col cols="12" sm="2" class="pt-0 pb-0">
                    <v-checkbox hide-details
                                class="shrink mt-4"
                                value="files"
                                v-model="attachment"
                                :label="$t('attach_file')">
                    </v-checkbox>
                </v-col>
                <v-col cols="12" sm="8" class="pt-0 pb-0">
                    <v-file-input
                            :label="$t('choice_file')"
                            filled
                            prepend-icon="mdi-cloud-upload"
                            chips
                            v-model="files"
                            :disabled="!attachment.includes('files')"
                            accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed,
                                text/plain,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,
                                application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            multiple
                    ></v-file-input>
                </v-col>
                <v-col cols="12" sm="2" class="pt-0 pb-0">
                    <v-checkbox hide-details
                                class="shrink mt-4"
                                value="image"
                                color="indigo"
                                v-model="randomFile"
                                :disabled="!attachment.includes('files')"
                                :label="$t('random_file')">
                    </v-checkbox>
                </v-col>

                <!--link-->
                <v-col cols="12" sm="2" class="pt-1 pb-0">
                    <v-checkbox hide-details
                                class="shrink mt-4"
                                value="link"
                                v-model="attachment"
                                :label="$t('attach_link')">
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
                            <v-icon v-if="link.length > 1" :disabled="!attachment.includes('link')" large
                                    color="red darken-3" @click="() => { link = link.filter((li,j) => j !== i) }">
                                mdi-minus-box
                            </v-icon>
                        </v-col>
                    </v-row>
                    <div :style="{position: 'absolute', left: '45px', bottom: link.length > 1 ? '-12px' : '-24px'}">
                        <v-icon color="blue darken-3" large :disabled="!attachment.includes('link')"
                                @click="() => { link.push('')}">mdi-plus-box
                        </v-icon>
                    </div>
                </v-col>
                <v-col cols="12" sm="2" :class="['pt-2', 'pb-0', link.length > 1 ? 'd-flex align-center' : '']">
                    <v-checkbox hide-details
                                class="shrink mt-4"
                                value="link"
                                color="indigo"
                                v-model="randomLink"
                                :label="$t('random_link')"
                                :disabled="!attachment.includes('link')">
                    </v-checkbox>
                </v-col>


                <!--stream-->
                <v-col cols="12" sm="2" class="mt-8 pt-1 pb-0">
                    <v-checkbox hide-details
                                class="shrink mt-4"
                                value="stream"
                                v-model="attachment"
                                :label="$t('share_stream')">
                    </v-checkbox>
                </v-col>
                <v-col cols="12" sm="8" class="mt-8" style="position: relative">
                    <v-row v-for="(lin, i) in streamLink" :key="i">
                        <v-col cols="12" sm="11" class="pt-0 pb-0">
                            <v-text-field
                                    hide-details
                                    v-model="streamLink[i]"
                                    :label="$t('link_stream')"
                                    prepend-icon="mdi-link"
                                    :disabled="!attachment.includes('stream')"
                                    solo
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="1">
                            <v-icon v-if="streamLink.length > 1" :disabled="!attachment.includes('stream')" large
                                    color="red darken-3"
                                    @click="() => { streamLink = streamLink.filter((li,j) => j !== i) }">mdi-minus-box
                            </v-icon>
                        </v-col>
                    </v-row>
                    <div :style="{position: 'absolute', left: '45px', bottom: streamLink.length > 1 ? '-12px' : '-24px'}">
                        <v-icon color="blue darken-3" large :disabled="!attachment.includes('stream')"
                                @click="() => { streamLink.push('')}">mdi-plus-box
                        </v-icon>
                    </div>
                </v-col>
                <v-col cols="12" sm="2"
                       :class="['mt-8', 'pt-2', 'pb-0', streamLink.length > 1 ? 'd-flex align-center' : '']">
                    <v-checkbox hide-details
                                class="shrink mt-4"
                                value="link"
                                color="indigo"
                                v-model="randomStream"
                                :label="$t('random_link')"
                                :disabled="!attachment.includes('stream')"
                    >
                    </v-checkbox>
                </v-col>
            </v-row>
            <v-row class="pt-2 mt-8">
                <v-radio-group v-model="choiceTime" row>
                    <v-col cols="12" sm="12">
                        <label>{{ $t('time_delay') }}</label>
                    </v-col>
                    <v-col cols="12" sm="2" class="pt-0 pb-0">
                        <v-radio hide-details
                                    class="shrink mt-4"
                                    value="range"
                                    :label="$t('choice_time')">
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
                        <v-radio hide-details
                                    class="shrink mt-4"
                                    value="fill"
                                    :label="$t('fill_time')">
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
            <v-row class="pt-0">
                <v-radio-group v-model="choiceRegime" row class="mt-0" style="width: 100%">
                    <v-col cols="12" sm="12">
                        <label>{{ $t('regime') }}</label>
                    </v-col>
                    <v-col cols="12" sm="1" class="pt-0 pb-0">
                        <v-radio hide-details
                                 class="shrink mt-4"
                                 value="regime_text"
                                 :label="$t('regime_text')">
                        </v-radio>
                    </v-col>
                    <v-col cols="12" sm="2" class="pt-0 pb-0">
                        <v-radio hide-details
                                 class="shrink mt-4"
                                 value="regime_text_file"
                                 :label="$t('regime_text_file')">
                        </v-radio>
                    </v-col>
                    <v-col cols="12" sm="2" class="pt-0 pb-0">
                        <v-radio hide-details
                                 class="shrink mt-4"
                                 value="regime_text_link"
                                 :label="$t('regime_text_link')">
                        </v-radio>
                    </v-col>
                    <v-col cols="12" sm="4" class="pt-0 pb-0">
                        <v-radio hide-details
                                 class="shrink mt-4"
                                 value="regime_text_link_file"
                                 :label="$t('regime_text_link_file')">
                        </v-radio>
                    </v-col>
                </v-radio-group>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
  import Vue from 'vue'
  import Toasted from 'vue-toasted'
  import { mapGetters, mapState } from 'vuex'

  Vue.use(Toasted)

  export default {
    name: 'EditMessage',

    components: {},

    data () {
      return {
        items: [
          { value: 10, text: '10s' },
          { value: 20, text: '20s' },
          { value: 30, text: '30s' },
          { value: 60, text: '60s' },
          { value: 100, text: '100s' },
        ],
        images: [],
        attachment: [],
        files: [],
        content: [''],
        showIcon: false,
        timeDelay: '',
        streamLink: [''],
        link: [''],
        contentIndex: 0,
        randomImage: false,
        randomFile: false,
        randomLink: false,
        randomStream: false,
        choiceTime: 'range',
        minTime: '10',
        maxTime: '60',
        choiceRegime: 'regime_text'
      }
    },

    computed: {
      ...mapState(['attachmentData']),
    },

    watch: {
      choiceRegime () {
        this.$store.commit('set_regime', this.choiceRegime)
      },

      images () {
        this.setFile('images')
      },

      files () {
        this.setFile('files')
      },

      streamLink () {
        this.setStream()
      },

      link () {
        this.setAttachmentData('link', this.link)
      },

      attachment () {
        this.$store.commit('set_attachment', this.attachment)

        if (this.attachment.includes('images') && this.images.length) {
          this.setFile('images')
        }

        if (this.attachment.includes('files') && this.files.length) {
          this.setFile('files')
        }

        if (this.attachment === 'link' && this.link.length) {
          this.setAttachmentData('link', this.link)
        }

        if (this.attachment === 'stream' && this.streamLink.length) {
          this.setStream()
        }
      },

      content () {
        this.$store.commit('set_content', this.content)
      },

      timeDelay () {
        if (this.choiceTime === 'fill' && this.timeDelay >= 5) {
          this.$store.commit('set_time_delay', this.timeDelay)
        } else {
          this.$toasted.error(this.$t('error_fill_time'), {duration: 1000})
        }
      },

      randomImage () {
        this.$store.commit('set_random_image', this.randomImage)
      },

      randomFile () {
        this.$store.commit('set_random_file', this.randomFile)
      },

      randomLink () {
        this.$store.commit('set_random_link', this.randomLink)
      },

      randomStream () {
        this.$store.commit('set_random_stream', this.randomStream)
      },

      choiceTime() {
        this.$store.commit('set_choice_time', this.choiceTime)
        if (this.choiceTime === 'range' && this.minTime <= this.maxTime) {
          this.$store.commit('set_min_time', this.minTime)
          this.$store.commit('set_max_time', this.maxTime)
        }
        if (this.choiceTime === 'fill' && this.timeDelay >= 5) {
          this.$store.commit('set_time_delay', this.timeDelay)
        }
      },

      minTime() {
        if (this.minTime <= this.maxTime) {
          this.$store.commit('set_min_time', this.minTime)
        } else {
          this.$toasted.error(this.$t('error_choice_time'), {duration: 1000})
        }
      },

      maxTime() {
        if (this.minTime <= this.maxTime) {
          this.$store.commit('set_max_time', this.maxTime)
        } else {
          this.$toasted.error(this.$t('error_choice_time'), {duration: 1000})
        }
      }
    },

    methods: {
      updateContent (value, i) {
        this.content[i] = value.target.value
        this.$store.commit('set_content', this.content)
      },

      addSpin () {
        this.content[this.contentIndex] += '{A|B|C}'
        document.getElementById(`content-${this.contentIndex}`).value = this.content[this.contentIndex]
        this.$store.commit('set_content', this.content)
      },

      addIcon () {
        this.content[this.contentIndex] += '{icon}'
        document.getElementById(`content-${this.contentIndex}`).value = this.content[this.contentIndex]
        this.$store.commit('set_content', this.content)
      },

      addTime () {
        this.content[this.contentIndex] += '{time}'
        document.getElementById(`content-${this.contentIndex}`).value = this.content[this.contentIndex]
        this.$store.commit('set_content', this.content)
      },

      addGroup () {
        this.content[this.contentIndex] += '@group'
        document.getElementById(`content-${this.contentIndex}`).value = this.content[this.contentIndex]
        this.$store.commit('set_content', this.content)
      },

      copyIcon () {
        this.showIcon = !this.showIcon
      },

      setFile (obj) {
        let fileData = []
        for (let i = 0; i < this[obj].length; i++) {
          const file = this[obj][i]
          fileData.push({
            file: URL.createObjectURL(file),
            fileName: file.name,
            fileType: file.type,
          })
        }
        this.setAttachmentData(obj, fileData)
      },

      setStream () {
        if (this.streamLink.length) {
          try {
            let streams = []
            for (let i = 0; i < this.streamLink.length; i++) {
              const streamLink = this.streamLink[i]
              const url = new URL(streamLink)
              const path = url.pathname.split('/')
              const id = path[path.length - 1]
              if (id == parseInt(id, 10)) {
                streams.push(path[path.length - 1])
              } else {
                this.$toasted.error(this.$t('stream_link_wrong'), { duration: 2000 })
              }
            }
            this.setAttachmentData('stream', streams)
          } catch (e) {
            this.$toasted.error(this.$t('stream_link_wrong'), { duration: 2000 })
          }
        }
      },

      setAttachmentData (name, data) {
        let attachmentData = this.attachmentData
        attachmentData[name] = data
        this.$store.commit('set_attachment_data', attachmentData)
      }
    }
  }
</script>

<style>
    .upload-file {
        width: 100%;
    }

    .image-container {
        width: 100% !important;
        background-color: #faf7fb !important;
    }
</style>