import Vue from 'vue'
import Vuex from 'vuex'
import RepositoryFactory from '@/repositories/RepositoryFactory'
import axios from 'axios'

const UserRepository = RepositoryFactory.get('user')
const GroupRepository = RepositoryFactory.get('group')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    contentText: [''],
    attachment: [],
    attachmentData: {},
    groups: [],
    groupsList: [],
    timeDelay: 5,
    randomImage: false,
    randomLink: false,
    randomStream: false,
    randomFile: false,
    choiceTime: 'range',
    minTime: 5,
    maxTime: 10,
    regime: 'regime_text'
  },

  getters: {
  },

  mutations: {
    set_content: (state, content) => {
      state.contentText = content
    },

    set_attachment: (state, content) => {
      state.attachment = content
    },

    set_attachment_data: (state, data) => {
      state.attachmentData = data
    },
    set_groups: (state, group) => {
      state.groups = group
    },
    list_groups: (state, groups) => {
      state.groupsList = groups
    },
    set_time_delay: (state, time) => {
      state.timeDelay = time
    },
    set_random_image: (state, random) => {
      state.randomImage = random
    },
    set_random_link: (state, random) => {
      state.randomLink = random
    },
    set_random_stream: (state, random) => {
      state.randomStream = random
    },
    set_random_file: (state, random) => {
      state.randomFile = random
    },
    set_choice_time: (state, choiceTime) => {
      state.choiceTime = choiceTime
    },
    set_min_time: (state, minTime) => {
      state.minTime = minTime
    },
    set_max_time: (state, maxTime) => {
      state.maxTime = maxTime
    },
    set_regime: (state, regime) => {
      state.regime = regime
    },
  },

  actions: {
    userProfile: ({ commit, dispatch }) => {
      return new Promise((resolve, reject) => {
        resolve(UserRepository.get())
      })
    },

    listGroup: ({ commit, dispatch }, token) => {
      return new Promise(async (resolve, reject) => {
        const pages = await GroupRepository.get(token)
        commit('list_groups', pages.data)
        resolve(pages)
      })
    },

    postGroup: ({ commit, dispatch }, data) => {
      return new Promise(async (resolve, reject) => {
        const groups = await GroupRepository.post(data)
        resolve(groups.data)
      })
    },
  },
})
