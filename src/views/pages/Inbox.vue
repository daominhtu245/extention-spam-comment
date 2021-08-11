<template>
    <v-container
            id="filter-friend"
            fluid
            tag="section"
    >
        <detail></detail>
        <choice-group></choice-group>
        <edit-message></edit-message>
        <v-dialog
                v-model="dialog"
                width="1400"
        >
            <v-card>
                <v-card-title class="grey lighten-5">
                    <v-progress-linear
                            color="purple darken-4"
                            :value="percent"
                            striped
                            height="25"
                            text-color="white"
                    >
                        <template v-slot:default="{ value }">
                            <strong style="color: #fff">{{ Math.ceil(value) }}%</strong>
                        </template>
                    </v-progress-linear>
                    <p>
                        <v-chip
                                large
                                label
                                color="grey darken-3"
                                class="ma-2"
                                text-color="white"
                        >
                            {{ $t('total') }}: {{ groupsStart.length }}
                        </v-chip>
                        <v-chip
                                large
                                label
                                class="ma-2"
                                color="green darken-4"
                                text-color="white"
                        >
                            {{ $t('success') }}: {{ groupsDone.length }}
                        </v-chip>
                        <v-chip
                                large
                                label
                                class="ma-2"
                                color="deep-orange darken-4"
                                text-color="white"
                        >
                            {{ $t('error') }}: {{ groupsError.length }}
                        </v-chip>
                        <v-chip
                                large
                                label
                                class="ma-2"
                                color="blue-grey darken-4"
                                text-color="white"
                        >
                            {{ $t('remain') }}: {{ groupsStart.length - numGroupPost }}
                        </v-chip>
                        <span style="font-size: 14px" class="font-weight-bold">{{ $t('status') }}:</span>
                        <v-chip
                                class="ma-2"
                                :color="statusInboxList[statusPost]['color']"
                                text-color="white"
                        >
                            {{ statusInboxList[statusPost]['label'] }}
                        </v-chip>
                    </p>
                </v-card-title>

                <v-card-text class="pb-2 pt-1">
                    <v-row>
                        <v-col cols="12" sm="12" class="pt-0 pb-5" style="position: relative">
                            <p v-html="logger"
                               style="height: 300px;overflow: auto;background-color: rgb(243 243 243)"></p>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-text class="pt-0">
                    <v-progress-linear
                            v-for="(group, index) in groupsProcessing"
                            :key="index"
                            :color="group.color"
                            :value="group.percent"
                            striped
                            rounded
                            height="14"
                            class="mb-2"
                    >
                        <template v-slot:default="{ value }">
                            <strong style="font-size: 11px">{{ group.name }} ({{ Math.ceil(value) }}%)</strong>
                        </template>
                    </v-progress-linear>
                </v-card-text>

                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="font-weight-bold"
                           color="deep-orange darken-3"
                           @click="stopPost"
                           v-if="loading1 && groupsStart != '' && statusPost == 'processing'"
                    >
                         <span class="custom-loader mr-1">
                            <v-icon light>mdi-stop</v-icon>
                        </span>
                        {{ $t('stop') }}
                    </v-btn>

                    <v-btn class="font-weight-bold"
                           color="red darken-4"
                           @click="cancelPost"
                           v-if="loading1 && groupsStart != '' && statusPost == 'processing'"
                    >
                         <span class="mr-1">
                            <v-icon light>mdi-close-box</v-icon>
                        </span>
                        {{ $t('cancel') }}
                    </v-btn>

                    <v-btn class="font-weight-bold"
                           v-if="loading1 && groupsStart != '' && statusPost != 'processing'"
                           color="teal darken-4"
                           @click="startPost"
                    >
                        {{ $t('start') }}
                        <v-icon right dark>
                            mdi-airplane
                        </v-icon>
                    </v-btn>

                    <v-btn class="font-weight-bold"
                           v-if="!loading1 && groupsStart != ''"
                           color="teal darken-4"
                           @click="continuePost"
                    >
                        {{ $t('continue') }}
                        <v-icon right dark>
                            mdi-play
                        </v-icon>
                    </v-btn>

                    <v-btn class="font-weight-bold"
                           v-if="groupsStart != '' && groupsStart != '' && statusPost == 'processing'"
                           color="teal darken-4"
                           @click="dialog = false"
                    >
                        {{ $t('play_background') }}
                        <v-icon right dark>
                            mdi-arrow-down-bold-circle
                        </v-icon>
                    </v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-btn class="font-weight-bold"
               v-if="statusPost === 'stop' || statusPost === 'done'"
               color="blue darken-4"
               x-large
               fixed
               bottom
               right
               style="z-index: 99; bottom: 80px; right: 0"
               elevation="7"
               @click="startPost"
        >
            {{ $t('start_post') }}
            <v-icon right dark>
                mdi-airplane
            </v-icon>
        </v-btn>
        <v-btn class="font-weight-bold"
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
            {{ $t('view_process') }}
            <v-icon right dark>
                mdi-eye
            </v-icon>
        </v-btn>

    </v-container>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  import { downloadTextArea, getRndInteger, blobToDataURL } from '../../helper/util'

  export default {
    name: 'Inbox',
    components: {
      Detail: () => import('../components/inbox/Detail'),
      EditMessage: () => import('../components/inbox/EditMessage'),
      ChoiceGroup: () => import('../components/inbox/ChoiceGroup'),
    },

    created () {
      this.statusInboxList = {
        wait: {
          color: 'teal darken-3',
          label: this.$t('wait')
        },
        processing: {
          color: 'blue darken-3',
          label: this.$t('process')
        },
        done: {
          color: 'green darken-3',
          label: this.$t('done')
        },
        stop: {
          color: 'red darken-3',
          label: this.$t('stop')
        },
      }
    },

    data () {
      return {
        logger: '',
        numSend: 0,
        statusPost: 'stop',
        dialog: false,
        groupsStart: [],
        groupsDone: [],
        groupsError: [],
        groupsProcessing: [],
        numGroupPost: 0,
        content: '',
        icons: ['🙂🙂', '😀', '😄', '😆', '😅', '😂', '🤣', '😊', '☺️', '😌', '😉', '😏', '😍', '😘', '😗', '😙', '😚', '🤗', '♥️', '💙', '😺', '😸', '😹',
          '😻', '😼', '😽', '🙀', '🌺'],
        statusInboxList: {
          wait: {
            color: 'teal darken-3',
            label: 'Wait'
          },
          processing: {
            color: 'blue darken-3',
            label: 'Processing'
          },
          done: {
            color: 'green darken-3',
            label: 'Done'
          },
          stop: {
            color: 'red darken-3',
            label: 'Stop'
          },
        },
        loading1: false,
        timeRemain: 0
      }
    },

    beforeDestroy () {
    },

    computed: {
      ...mapState(['contentText', 'attachment', 'attachmentData', 'groups', 'timeDelay', 'randomImage', 'randomLink',
        'randomStream', 'randomFile', 'choiceTime', 'minTime', 'maxTime', 'regime']),

      percent () {
        const total = this.groupsStart.length
        return total !== 0 ? Math.floor(this.numGroupPost / total * 100) : 0
      },
    },

    watch: {},

    methods: {
      combineContent (group) {
        const contentChoice = this.contentText[Math.floor(Math.random() * this.contentText.length)]

        this.content = contentChoice.replaceAll('@group', group.name)
        this.content = this.content.replaceAll('{icon}', this.icons[Math.floor(Math.random() * this.icons.length)])

        const today = new Date()
        const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
        this.content = this.content.replaceAll('{time}', time)

        const spins = this.content.match(/\{((()[^\}])*)\}/gm)
        if (spins) {
          for (let i = 0; i < spins.length; i++) {
            const spin = spins[i]
            const spinSplit = spin.replaceAll('{', '').replaceAll('}', '').split('|')
            const spinGet = spinSplit[Math.floor(Math.random() * spinSplit.length)]
            this.content = this.content.replaceAll(spin, spinGet)
          }
        }
      },

      continuePost () {
        this.statusPost = 'processing'
        this.loading1 = true
      },

      async startPost () {
        if (this.groups.length == 0) {
          alert(this.$t('pls_choice_post'))
          return
        }
        if (this.maxTime < this.minTime && this.choiceTime === 'range') {
          alert(this.$t('pls_time'))
          return
        }

        this.statusPost = 'processing'
        this.loading1 = true
        this.dialog = true
        this.groupsProcessing = []
        this.numGroupPost = 0
        this.groupsDone = []
        this.groupsError = []
        this.groupsStart = this.groups
        this.logger = ''
        for (let i = 0; i < this.groupsStart.length; i++) {
          if (this.statusPost == 'stop' || this.statusPost == 'done') {
            break
          }
          if (this.statusPost == 'wait') {
            i--
            await new Promise(r => setTimeout(r, 1000))
            continue
          }

          this.numGroupPost++
          const group = this.groupsStart[i]
          this.groupsProcessing.push({
            id: group.id,
            name: group.name,
            percent: 50,
            color: 'blue'
          })

          this.combineContent(group)
          this.postGroup(group)
          const time = this.choiceTime === 'range' ? getRndInteger(this.minTime, this.maxTime) : this.timeDelay
          await new Promise(r => setTimeout(r, time * 1000))
        }
        await new Promise(r => setTimeout(r, 2000))
        this.statusPost = 'done'
      },

      stopPost () {
        this.statusPost = 'wait'
        this.loading1 = false
      },

      cancelPost () {
        this.statusPost = 'stop'
        this.loading1 = true
      },

      async postGroup (group) {
        let attachmentArray = this.attachment
        if (this.regime === 'regime_text') {
          attachmentArray = ['text']
        } else if (this.regime === 'regime_text_file') {
          attachmentArray = ['text'].concat(this.attachment.filter(item => ['files', 'images'].includes(item)))
        } else if (this.regime === 'regime_text_link') {
          attachmentArray = ['text'].concat(this.attachment.filter(item => ['link', 'stream'].includes(item)))
        } else if (this.regime === 'regime_text_link_file') {
          attachmentArray = ['text'].concat(this.attachment)
        }


        const attachment = attachmentArray[Math.floor(Math.random() * attachmentArray.length)]
        let attachmentData = null
        if (attachment === 'images') {
          const dt = this.attachmentData['images']
          attachmentData = this.randomImage ? [dt[Math.floor(Math.random() * dt.length)]] : dt
        }

        if (attachment === 'files') {
          const dt = this.attachmentData['files']
          attachmentData = this.randomFile ? dt[Math.floor(Math.random() * dt.length)] : dt[0]
        }

        if (attachment === 'link') {
          const dt = this.attachmentData['link']
          attachmentData = this.randomLink ? dt[Math.floor(Math.random() * dt.length)] : dt[0]
        }

        if (attachment === 'stream') {
          const dt = this.attachmentData['stream']
          attachmentData = this.randomStream ? dt[Math.floor(Math.random() * dt.length)] : dt[0]
        }

        if (attachment === 'text') {
          attachmentData = null
        }
        console.log(attachment, attachmentData)

        this.$store.dispatch('postGroup', {
          attachment: attachment,
          attachmentData: attachmentData,
          content: this.content,
          group: group,
        }).then(async (result) => {
          for (let i = 0; i < this.groupsProcessing.length; i++) {
            const groupProcess = this.groupsProcessing[i]
            if (groupProcess.id == group.id) {
              if (result.error) {
                this.groupsProcessing[i].percent = 100
                this.groupsProcessing[i].color = 'red'
                this.logger += '<p style="color: #ff312a">' + this.$t('error_post') + ' <a style="color: #1e55e3" href="https://www.facebook.com/groups/' + group.id + '" target="_blank">' + group.name + '</a></p>'
                this.groupsError.push(group)
              } else {
                this.groupsProcessing[i].percent = 100
                this.groupsProcessing[i].color = 'green'
                this.logger += '<p style="color: #008037">' + this.$t('success_post') + ' <a style="color: #1e55e3" href="https://www.facebook.com/groups/' + group.id + '" target="_blank">' + group.name + '</a>,' +
                  ' ' + this.$t('view') + '  <a style="color: #1e55e3" href="' + result.url + '" target="_blank">' + this.$t('post') + '</a></p>'
                this.groupsDone.push(group)
              }
              await new Promise(r => setTimeout(r, 200))
              this.groupsProcessing = this.groupsProcessing.filter((cus, index) => cus.id != group.id)
              break
            }
          }
        })
      },

    },
  }
</script>
<style lang="css">
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


