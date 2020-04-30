<template>
  <div>
        <appListComponent @appValEmitFn="getAppVal"></appListComponent>
        <el-button class="ml-15" type="primary" :disabled="getNumberBtn" @click="getNumberFn">获取号码</el-button>
        <el-input class="ml-15" style="width:200px;display:inline-block;" v-model.trim="appointBillNoMsisdn" placeholder="请输入随机号码"></el-input>
        <el-button class="ml-15" type="primary" :disabled="appointBillNoBtn" @click="appointBillNoFn">分配号码</el-button>
        <el-button class="ml-15" type="primary" :disabled="releaseBillNoBtn" @click="releaseBillNoFn">回收号码</el-button>
        <div v-show="alertShow">
          <el-alert
            v-if="alertSuccess"
            show-icon
            class="mt-15"
            :title="alertTitle"
            type="success"
            :description="descriptionTitle"
          ></el-alert>
        </div>

        <el-alert
          v-if="codeAlert"
          show-icon
          class="mt-15"
          :title="verificationCodeMsg"
          type="success"
        ></el-alert>

        <el-divider content-position="center">查询结果</el-divider>

        <el-row :gutter="20" class="mt-15">
          <el-col :span="6">
            <p class="getCodeTitle">获取到的随机号码</p>
            <div class="grid-content" v-bind:style="gridContentHeight" v-if="billNoList.length">
              <ul class="infinite-list">
                <li
                  v-for="(item,index) in billNoList"
                  :key="index"
                  class="infinite-list-item"
                >{{item}}</li>
              </ul>
            </div>
            <div class="grid-content text-c mt-15" v-bind:style="gridContentHeight" v-else>暂无数据</div>
          </el-col>
          <el-col :span="9">
            <p class="getCodeTitle">自动实时获取验证码</p>

            <div
              class="grid-content"
              v-bind:style="gridContentHeight"
              v-if="verificationCodeList.length"
            >
              <ul class="infinite-list">
                <li
                  v-for="(item,index) in verificationCodeList"
                  :key="index"
                  class="infinite-list-item"
                >分配号码:{{ item.billNo }} 验证码:{{item.verificationCode}}</li>
              </ul>
            </div>
            <div class="grid-content text-c mt-15" v-bind:style="gridContentHeight" v-else>暂无数据</div>
          </el-col>

          <el-col :span="9">
            <div class="clearfix" style="background-color: #f2f2f3;">
              <el-col :span="18">
                <el-input
                  style="margin-bottom:6px;margin-top:5px;"
                  placeholder="请输入卡号查询验证码"
                  prefix-icon="el-icon-search"
                  v-model="cardNumber"
                ></el-input>
              </el-col>
              <el-col :span="6">
                <el-button
                  style="margin-bottom:6px;margin-top:9px;"
                  size="small"
                  type="primary"
                  @click="tableFn"
                >查询</el-button>
              </el-col>
            </div>
            <div class="grid-content" v-bind:style="gridContentHeight" v-if="tableData.length">
              <ul class="infinite-list">
                <li
                  v-for="item in tableData"
                  :key="item.id"
                  class="infinite-list-item"
                >分配号码:{{ item.billNo }} 验证码:{{item.verifCode}}</li>
              </ul>
            </div>

            <div class="grid-content text-c mt-15" v-bind:style="gridContentHeight" v-else>暂无数据</div>
          </el-col>
        </el-row>

  </div>
</template>

<script>
import appListComponent from '../../components/codeModule/appList'
import { baseURL } from "../../common/js/ipconfig";
import {getBillNo,getVerifCode,consumeList,releaseBillNo,appointBillNo} from "../../api/api.js";
var ajaxServiceUrl = baseURL.ws1;
var ws; //websocket实例
var lockReconnect = false; //避免重复连接

export default {
  name: "getCode",
  data() {
    return {
      appVal: null,
      alertShow: false,
      alertSuccess: null,
      descriptionTitle:"手机区号选择中国台湾（+886）！请在15分钟之内完成业务操作！",
      alertTitle: "",
      codeAlert: false,
      verificationCode: null,
      verificationCodeMsg: null,
      verificationCodeList: [],
      billNo: null,
      billNoList: [],
      windowHeight: "", //窗口高度
      tableData: [],
      cardNumber: null,
      appointBillNoMsisdn:'',

    };
  },
  created() {
    this.createWebSocket(ajaxServiceUrl);
  },
  destroyed() {},
  components:{appListComponent},
  mounted() {
    this.windowHeight = document.documentElement.clientHeight;
    window.onresize = () => {
      this.windowHeight = document.documentElement.clientHeight;
    };
  },
  computed: {
    appointBillNoBtn(){
      return this.appointBillNoMsisdn.length !=0 && this.appVal != null ? false : true;
    },
    releaseBillNoBtn(){
      return this.appointBillNoMsisdn.length != 0 ? false : true;
    },
    getNumberBtn() {
      return this.appVal != null ? false : true;
    },
    gridContentHeight() {
      return {
        height: this.windowHeight - 300 + "px"
      };
    }
  },
  methods: {
    getAppVal(data){
      this.appVal=data;
    },
    async tableFn() {
      if (this.cardNumber) {
        let paramsObj = {
          billNo: this.cardNumber,
          pageNo: 1,
          pageSize: 50
        };
        try {
          let data = await this.$axios.post(
            consumeList,
            this._qs.stringify(paramsObj)
          );
          if (data.status == 0) {
            this.tableData = data.data.content;
          } else {
            this.$message.error(data.message);
          }
        } catch (err) {
          this.$message.error("服务器异常，请稍后再试！");
        }
      } else {
        this.$message.error("卡号必填！");
      }
    },
    createWebSocket(url) {
      try {
        ws = new WebSocket(url);
        this.initEventHandle();
      } catch (e) {
        this.reconnect(ajaxServiceUrl);
      }
    },
    initEventHandle() {
      ws.onclose = () => {
        console.log("onclose");
        this.reconnect(ajaxServiceUrl);
      };
      ws.onerror = () => {
        console.log("onerror");
        this.reconnect(ajaxServiceUrl);
      };
      ws.onopen = () => {
        console.log("connected");

        var data = {
          msgtype: "token",
          msgvalue: localStorage.getItem("fancysmsToken")
        };
        ws.send(JSON.stringify(data));
        //心跳检测重置
        this.heartCheckFn()
          .reset()
          .start();
      };
      ws.onmessage = event => {
        if (event.data.length > 4) {
          var obj = JSON.parse(event.data);
          let verificationCodeJson = {
            billNo: obj.msisdn,
            verificationCode: obj.verification_code,
            appId: obj.app_id
          };
          this.verificationCodeList.unshift(verificationCodeJson);
          let appName;
          switch (obj.app_id) {
            case 2:
              appName = "微信";
              break;
            case 4:
              appName = "支付宝";
              break;
            case 10:
              appName = "京东";
              break;
            case 12:
              appName = "拼多多";
              break;
            case 30:
              appName = "抖音";
              break;
          }
          this.codeAlert = true;
          this.verificationCodeMsg =
            "您的" + appName + "验证码是：" + obj.verification_code;
        }
      };
    },

    reconnect(url) {
      if (lockReconnect) return;
      lockReconnect = true;

      setTimeout(() => {
        this.createWebSocket(url);
        lockReconnect = false;
      }, 2000);
    },
    heartCheckFn() {
      //心跳检测
      var heartCheck = {
        timeout: 60000, //60秒
        timeoutObj: null,
        serverTimeoutObj: null,
        reset: function() {
          clearTimeout(this.timeoutObj);
          clearTimeout(this.serverTimeoutObj);
          return this;
        },
        start: function() {
          var self = this;
          this.timeoutObj = setTimeout(function() {
            //这里发送一个心跳，后端收到后，返回一个心跳消息，
            //onmessage拿到返回的心跳就说明连接正常
            var data = {
              msgtype: "heartCheck",
              msgvalue: ""
            };
            ws.send(JSON.stringify(data));
            self.serverTimeoutObj = setTimeout(function() {
              //如果超过一定时间还没重置，说明后端主动断开了
              ws.close(); //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            }, self.timeout);
          }, this.timeout);
        }
      };
      return heartCheck;
    },

    async getNumberFn() {
      try {
        let data = await this.$axios.post(
          getBillNo,
          this._qs.stringify({
            apps: this.appVal
          })
        );
        if (data.status == 0) {
          this.alertShow = true;
          this.alertSuccess = true;
          this.alertTitle = "您的分配号码是：" + data.data;
          this.billNo = data.data;
          this.billNoList.unshift(this.billNo);
        } else {
          this.$message.error(data.message);
        }
      } catch (err) {
        this.$message.error("网络异常，请稍候再试！");
      }
    },
    //分配号码
    async appointBillNoFn(){
      let paramsObj={
        apps:this.appVal,
        msisdn:this.appointBillNoMsisdn
      }
      try {
        let data = await this.$axios.post(
          appointBillNo,
          this._qs.stringify(paramsObj)
        );
        data.status == 0 ? this.$message.success(data.message) : this.$message.error(data.message);
      } catch (err) {
        this.$message.error("网络异常，请稍候再试！");
      }
    },
    //回收号码
    async releaseBillNoFn(){
      let paramsObj={
        billNo:this.appointBillNoMsisdn
      }
      try {
        let data = await this.$axios.post(
          releaseBillNo,
          this._qs.stringify(paramsObj)
        );
        data.status == 0 ? this.$message.success(data.message) : this.$message.error(data.message);
      } catch (err) {
        this.$message.error("网络异常，请稍候再试！");
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    next();
  }
};
</script>

<style scoped>
.grid-content::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.grid-content::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
  border-radius: 2px;
}
.grid-content::-webkit-scrollbar-thumb {
  background: #bfbfbf;
  border-radius: 10px;
}
.grid-content::-webkit-scrollbar-thumb:hover {
  background: #999;
}
.grid-content::-webkit-scrollbar-corner {
  background: #179a16;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
  overflow: auto;
}

.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: #e8f3fe;
  color: #7dbcfc;
}

.getCodeTitle {
  text-align: center;
  font-size: 16px;
  background-color: #f2f2f3;
  padding: 15px 0;
}
</style>