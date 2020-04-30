<template>
  
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      class="mt-15 mb-15 fr"
      
    ></el-pagination>

</template>

<script>
export default {
    props:{
        total:{},
        currentPage:{},
        pageSize:{},
        pageSizes:{}
    },
    data(){
        return {
            
        }
    },
    created(){},
    computed:{},
    methods:{
        //每页显示条数
        handleSizeChange(val) {
            this.$emit("handleSizeChangeEmit",val)
        },
        //点击页码
        handleCurrentChange(val){
            this.$emit("handleCurrentChangeEmit",val)
        },
    }

}
</script>

<style>

</style>