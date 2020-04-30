export default {
    namespaced: true,//必须加它不然报错
    state: {
      dialogVisible: false
    },
    mutations: {
      'dialogVisibleMutations': function (state, val){
        state.dialogVisible=val;
      }
    },
    actions: {
      'dialogVisibleActions': function ({commit}, s){
        commit('mod_a.setStr', s);
      }
    }
  }
