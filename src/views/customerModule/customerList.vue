<template>
<div class="clearfix">
    <div class="clearfix">
        <el-button type="primary" size="mini" class="fr" @click="addCustomer">新增客户</el-button>
    </div>

      
  <el-form ref="form" :model="searchForm" label-width="80px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="客户代码">
            <el-input v-model="searchForm.customerCode"></el-input>
          <!-- <el-select clearable filterable v-model="searchForm.customerCode" placeholder="请选择">
              <el-option v-for="item in customerList" :key="item.id" :label="item.customerCode" :value="item.customerCode"></el-option>
          </el-select> -->
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="客户名称">
            <el-input v-model="searchForm.customerName"></el-input>
          <!-- <el-select clearable filterable v-model="searchForm.customerName" placeholder="请选择">
              <el-option v-for="item in customerList" :key="item.id" :label="item.customerName" :value="item.customerName"></el-option>
          </el-select> -->
        </el-form-item>
      </el-col>
      <el-button icon="el-icon-search" type="primary" @click="getTableData">查询</el-button>
    </el-row>
</el-form>

    <el-divider>客户列表</el-divider>
    
    <el-table
        border
        :data="tableList" 
        style="width: 100%">

        <el-table-column fixed label="客户代码" prop="customerCode" align="center"></el-table-column>
        <el-table-column fixed label="客户名" prop="customerName" align="center"></el-table-column>
        <el-table-column label="客户类型" align="center">
            <template slot-scope="scope">
                <el-tag effect="dark" v-if="scope.row.customerType=='00'">预付</el-tag>
                <el-tag type="success" effect="dark" v-else-if="scope.row.customerType=='01'">对账</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="客户消费类型" align="center">
            <template slot-scope="scope">
                <el-tag effect="dark" v-if="scope.row.customerConsumeType=='00'">按验证码计费</el-tag>
                <el-tag type="success" effect="dark" v-else-if="scope.row.customerConsumeType=='01'">按业务号码计费</el-tag>
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
            placeholder="输入客户代码搜索"/>
        </template>
        <template slot-scope="scope">
            <el-button
            size="mini"
            type="warning"
            @click="updCustomer(scope.row)">修改</el-button>
        </template>
        </el-table-column>
    </el-table>

<pagination @handleSizeChangeEmit="handleSizeChange" @handleCurrentChangeEmit="handleCurrentChange" :total="totalElements" :currentPage="currentPage" :pageSize="pageSize" :pageSizes="pageSizes"/>

<publicForm :otherInfo="otherInfo" :width="formWidth" :formTitle="formTitle" :form="form" :formRules="formRules" :url="url" @resetFormEmit="resetForm">
    <div slot="formContent">
        
        <el-form-item label="客户代码" prop="customerCode">
            <el-input v-model.trim="form.customerCode"></el-input>
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
            <el-input v-model.trim="form.customerName"></el-input>
        </el-form-item>
        <el-form-item label="客户类型" prop="customerType">
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
        </el-form-item>
    </div>
</publicForm>

</div>
</template>


<script>

import pagination from "../../components/customerModule/pagination";
import publicForm from "../../components/customerModule/publicForm";
import {customerList,addCustomer,updCustomer} from "../../api/api.js";
import "../../common/js/formatDateTime";
export default {
    name:"customerList",
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
        formTitle:"新增客户",
        //验证表单
        formRules: {
            customerCode: [
                { required: true, message: "不能为空", trigger: "blur" }
            ],
            customerName: [
                { required: true, message: "不能为空", trigger: "blur" }
            ],
            customerType: [
                { required: true, message: "不能为空", trigger: "blur" }
            ],
            consumeType: [
                { required: true, message: "不能为空", trigger: "blur" }
            ],
            
        },
        //接口地址
        url:{
            "addUrl":addCustomer,
            "updUrl":updCustomer,
            "delUrl":``,
        },
        otherInfo:'-1',//标记 '0'新增 '1'修改
        totalElements:null,
        customerList:[],
      }
    },
    components:{pagination,publicForm},
    created(){
       // this.getSelectData()
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
      addCustomer(){
          this.$store.commit('dialogVisible/dialogVisibleMutations',true);
          this.otherInfo='0';
          this.formTitle="新增客户";
      },
      updCustomer(data){
          console.log(data)
          this.$store.commit('dialogVisible/dialogVisibleMutations',true);
          this.otherInfo='1';
          this.formTitle="修改客户";
          this.form={
              customerCode:data.customerCode,
              customerName:data.customerName,
              customerType:data.customerType,
              consumeType:data.customerConsumeType
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
            customerList,
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

      
    // async getSelectData() {
    //     let paramsObj = {
    //         pageNo:this.currentPage,
    //         pageSize:this.pageSize,
    //     };

    //     try {
    //       let data = await this.$axios.post(
    //         customerList,
    //         this._qs.stringify(paramsObj)
    //       );
          
    //       if (data.status == 0) {
    //           console.log(data)
    //         this.customerList=data.data.content;
    //       } else {
    //         this.$message.error(data.message);
    //       }
    //     } catch (err) {
    //       this.$message.error("服务器异常，请稍后再试！");
    //     }
    //   },


    }
}
</script>

<style scoped>

</style>