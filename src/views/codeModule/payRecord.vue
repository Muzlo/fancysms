<template>
  <div>
  
  <el-form ref="form" :model="form" label-width="80px">

    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="卡号">
          <el-input v-model="form.billNo" placeholder="请输入卡号"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="开始时间">
          <el-date-picker type="date" value-format="yyyy-MM-dd"  placeholder="选择日期" v-model="form.startDate" style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="结束时间">
          <el-date-picker type="date" value-format="yyyy-MM-dd"  placeholder="选择日期" v-model="form.endDate" style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-button style="margin:0 auto 15px;display:block;" icon="el-icon-search" type="primary" @click="tableFn">查询</el-button>

  </el-form>




<el-table border :stripe="true" :data="tableList" style="width: 100%">
    <el-table-column fixed label="应用名称" prop="appName" width="100" align="center"></el-table-column>
    <el-table-column label="随机号码" prop="billNo" align="center" width="200"></el-table-column>
    <el-table-column label="随机号码获取时间" align="center" width="200">
      <template slot-scope="scope">
        {{scope.row.billGetTime | untreatedTime |formatDateTime}}
      </template>
    </el-table-column>
    <el-table-column label="验证码" prop="verifCode" align="center"></el-table-column>
    <el-table-column label="验证码获取时间" align="center" width="200">
      <template slot-scope="scope">
        {{scope.row.verifCodeGetTime | untreatedTime |formatDateTime}}
      </template>
    </el-table-column>

    <!-- <el-table-column label="状态" align="center">
      <template slot-scope="scope">
        <span v-if="scope.row.consumeStatus">true</span>
        <span v-else>false</span>
      </template>
    </el-table-column> -->

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

    <el-table-column align="right" fixed="right" width="200">
      <template slot="header" slot-scope="scope">
        <el-input v-model="keySearch" size="mini" placeholder="输入随机号码搜索"/>
      </template>
    </el-table-column>
</el-table>

    <pagination class="fr"
      :total="totalElements"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      @handleSizeChangeEmit="handleSizeChange"
      @handleCurrentChangeEmit="handleCurrentChange"
    />

  </div>
</template>

<script>
import pagination from "../../components/codeModule/pagination";
import { shijianchuo ,timerBaseFn } from "../../common/js/formatDateTime";
import {consumeList} from "../../api/api.js";
export default {
    name:"payRecord",
    data(){
        return {
          form:{
            endDate:null
          },
          tableData: [],
          currentPage: 1, //当前第一页
          pageSize: 30, //默认每页30条数据
          pageSizes: [30, 50, 100], //设置每页显示多少条
          keySearch: "",
          totalElements:null,//总条数
        }
    },
    components: {pagination},
    created() {
      this.form.endDate=timerBaseFn(new Date())
    },
    computed: {
      //复制一份表格数据
      tableList() {
        return this.tableData.filter(item => {
          if (item.billNo.includes(this.keySearch)) {
            return item;
          }
          this.currentPage = 1;
        });
      }
    },
    methods:{
      handleSizeChange(data) {
        this.pageSize = data;
        this.currentPage = 1;
        this.tableFn();
      },
      handleCurrentChange(data) {
        this.currentPage = data;
        this.tableFn();
      },
      async tableFn() {
        let paramsObj = {
            pageNo:this.currentPage,
            pageSize:this.pageSize,
            ...this.form
        };
        try {
          let data = await this.$axios.post(
            consumeList,
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
    },

}
</script>

<style>

</style>