import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    paintingKey: 0, // 画作索引
    isStartGame: false, // 游戏状态
    posterUrl: '', // base64 格式图片
  },

  getters: {},

  mutations: {
    setPaintingKey(state, key) {
      this.commit('_dataTypeInspection', { data: key, expectType: 'number' })
      state.paintingKey = key
    },

    setIsStartGame(state, bool) {
      this.commit('_dataTypeInspection', { data: bool, expectType: 'boolean' })
      state.isStartGame = bool
    },

    setPosterUrl(state, str) {
      this.commit('_dataTypeInspection', { data: str, expectType: 'string' })
      state.posterUrl = str
    },

    /**
     * [内部]判断传入的数据，与期望数据类型是否吻合，如果不吻合抛出异常
     * @param {Any} data 需要判断类型的原始数据
     * @param {String} expectType 期望数据类型
     */
    _dataTypeInspection(store, { data, expectType }) {
      if (typeof data !== expectType) {
        throw new Error(
          `数据格式有有误：当前传入 ${typeof data} 类型，应传入 ${expectType} 类型`
        )
      }
    },
  },

  actions: {},
})

export default store
