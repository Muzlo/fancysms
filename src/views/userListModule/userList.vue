<template>
<div class="clearfix">
    <div class="clearfix">
        <el-button type="primary" size="mini" class="fr" @click="addUserFn">添加用户</el-button>
    </div>
      
  <el-form ref="form" :model="searchForm" label-width="80px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="用户名称">
          <el-input v-model="searchForm.userName"></el-input>
        </el-form-item>
      </el-col>
      <el-button icon="el-icon-search" type="primary" @click="getTableData">查询</el-button>
    </el-row>
</el-form>

    <el-divider>用户列表</el-divider>
    
    <el-table
        border
        :data="tableList" 
        style="width: 100%">

        <el-table-column fixed label="用户名" prop="customerName" align="center"></el-table-column>
        <el-table-column fixed label="用户代码" prop="customerCode" align="center"></el-table-column>

        <el-table-column fixed label="用户状态" prop="smsUserStatus" align="center">
            <template v-slot="scope">
                <span v-if="scope.row.smsUserStatus==0">离线</span>
                <span v-else-if="scope.row.smsUserStatus==1">在线</span>
                <span v-else-if="scope.row.smsUserStatus==9">注销</span>
            </template>
        </el-table-column>

        <el-table-column label="创建时间" align="center" width="200">
        <template slot-scope="scope">
            {{scope.row.crtTime | untreatedTime |formatDateTime}}
        </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" width="200">
        <template slot-scope="scope">
            {{scope.row.updTime | untreatedTime |formatDateTime}}
        </template>
        </el-table-column>

        <el-table-column align="right" fixed="right">
        <template slot="header" slot-scope="scope">
            <el-input
            v-model="keySearch"
            size="mini"
            placeholder="输入用户代码搜索"/>
        </template>
        <template slot-scope="scope">
            <el-button
            size="mini"
            type="warning"
            @click="updUser(scope.row)">修改</el-button>
        </template>
        </el-table-column>
    </el-table>

<pagination @handleSizeChangeEmit="handleSizeChange" @handleCurrentChangeEmit="handleCurrentChange" :total="totalElements" :currentPage="currentPage" :pageSize="pageSize" :pageSizes="pageSizes"/>

<publicForm :otherInfo="otherInfo" :width="formWidth" :formTitle="formTitle" :form="form" :formRules="formRules" :url="url" @resetFormEmit="resetForm">
    <div slot="formContent">
        
        
        <el-form-item label="用户名" prop="userName">
            <el-input v-model.trim="form.userName"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="userPassword">
            <el-input v-model.trim="form.userPassword"></el-input>
        </el-form-item>

        <el-form-item label="用户状态" prop="userStatus">
            <el-select v-model="form.userStatus" placeholder="请选择" class="w100">
                <el-option label="离线" value='0'></el-option>
                <el-option label="在线" value='1'></el-option>
                <el-option label="注销" value='9'></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="所属客户" prop="customerId">
            <el-select v-model="form.customerId" placeholder="请选择" class="w100">
                <el-option v-for="item in userListData" :key="item.id" :label="item.customerName" :value="item.customerCode"></el-option>
            </el-select>
        </el-form-item>

        <!-- <el-form-item label="客户类型" prop="customerType">
            <el-select v-model="form.customerType" placeholder="请选择" class="w100">
                <el-option label="预付" value="00"></el-option>
                <el-option label="对账" value="01"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="计费类型" prop="consumeType">
            <el-select v-model="form.consumeType" placeholder="请选择" class="w100">
                <el-option label="按验证码计费" value="00"></el-option>
                <el-option label="按业务号码计费" value="01"></el-option>
            </el-select>
        </el-form-item> -->
    </div>
</publicForm>

</div>
</template>


<script>

import pagination from "../../components/customerModule/pagination";
import publicForm from "../../components/customerModule/publicForm";
import {userList,addUser,updUser,customerList} from "../../api/api.js";
import "../../common/js/formatDateTime";
export default {
    name:"userList",
    data(){
      return {
        tableData:[],
        keySearch:"",
        currentPage:1,//当前页
        pageSize:30, //默认每页1条数据
        pageSizes:[30, 50, 100],//每页显示页码
        searchForm:{},//页面表单
        form:{},//弹层表单
        formWidth:"400px",
        formTitle:"添加用户",
        //验证表单
        formRules: {
            customerId: [
                { required: true, message: "不能为空", trigger: "blur" }
            ],
            userName: [
                { required: true, message: "不能为空", trigger: "blur" }
            ],
            userPassword: [
                { required: true, message: "不能为空", trigger: "blur" }
            ],
            userStatus: [
                { required: true, message: "不能为空", trigger: "blur" }
            ],
            
        },
        //接口地址
        url:{
            "addUrl":addUser,
            "updUrl":updUser,
            "delUrl":``,
        },
        otherInfo:'-1',//标记 '0'新增 '1'修改
        totalElements:null,
        userListData:null,
      }
    },
    components:{pagination,publicForm},
    created(){
        this.userListDataFn();
    },
    computed:{
        tableList(){
            return this.tableData.filter(item=>{
               if(item.customerCode.includes(this.keySearch)){
                   return item;
               }
               this.currentPage = 1;
            })
        }
    },
    methods:{
        ////获取客户列表
        async userListDataFn() {
            let paramsObj = {
                pageNo:this.currentPage,
                pageSize:this.pageSize,
            };

            try {
            let data = await this.$axios.post(
                customerList,
                this._qs.stringify(paramsObj)
            );
            if (data.status == 0) {
                this.userListData=data.data.content;
            } else {
                this.$message.error(data.message);
            }
            } catch (err) {
            this.$message.error("服务器异常，请稍后再试！");
            }
      },
      handleSizeChange(val) {
          this.pageSize = val;
          this.currentPage = 1;
          this.getTableData();
      },
      handleCurrentChange(val) {
          this.currentPage=val;
          this.getTableData();
      },
      resetForm(data){
          let formOtherInfo={

          }
          this.form={...formOtherInfo,...data};
      },
      addUserFn(){
          this.$store.commit('dialogVisible/dialogVisibleMutations',true);
          this.otherInfo='0';
          this.formTitle="添加用户";
      },
      updUser(data){
          console.log(data)
          this.$store.commit('dialogVisible/dialogVisibleMutations',true);
          this.otherInfo='1';
          this.formTitle="修改用户";
          this.form={
              customerId:data.id,
              userName:data.smsUserName,
              userPassword:data.smsUserPassword,
              userStatus:data.smsUserStatus+''
          }

      },

    async getTableData() {
        let paramsObj = {
            pageNo:this.currentPage,
            pageSize:this.pageSize,
            ...this.searchForm
        };

        try {
          let data = await this.$axios.post(
            userList,
            this._qs.stringify(paramsObj)
          );
          if (data.status == 0) {
              this.tableData=data.data.content;
              this.totalElements=data.data.totalElements;
          } else {
            this.$message.error(data.message);
          }
        } catch (err) {
          this.$message.error("服务器异常，请稍后再试！");
        }
      },


    }
}
</script>

<style scoped>

</style>