<template>
  <el-select v-model="appVal" placeholder="请选择应用" @change="appValFn">
    <el-option v-for="item in appList" :key="item.id" :label="item.appsName" :value="item.appsId"></el-option>
  </el-select>
</template>

<script>
import {getAppsList,customerAppsList} from "../../api/api.js";

export default {
  data() {
    return {
      appList: [],
      appVal: null
    };
  },
  mounted(){
      this.getAppList();
  },
  methods:{
    appValFn(val){
        return this.$emit("appValEmitFn",val)
    },
    getAppList() {
      try {
        let userName = JSON.parse(localStorage.getItem("userLoginInfo"))
          .userName;
        let data;
        let paramsObj = {};
        let handlerFn = async (url, paramsObj) => {
          data = await this.$axios.post(url, this._qs.stringify(paramsObj));
          data.status == 0
            ? (this.appList = data.data)
            : this.$message.error(data.message);
        };
        if (userName == "admin") {
          handlerFn(getAppsList, paramsObj);
        } else {
          handlerFn(customerAppsList, paramsObj);
        }
      } catch (err) {
        this.$message.error("网络异常，请稍候再试！");
      }
    }
  }
};
</script>

<style>
</style>