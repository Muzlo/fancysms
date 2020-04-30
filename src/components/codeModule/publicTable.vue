<template>
    <el-table
      :height="tableHeight"
      border
      :data="tableList"
      :stripe="true"
      style="width: 100%;"
    >
      <slot name="tableContent"></slot>
    </el-table>
</template>

<script>
export default {
    name:"publicTable",
    props:{
        tableHeight:{},
        tableList:{},

    }
}
</script>

<style>

</style>