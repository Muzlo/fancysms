<template>


    <el-dialog @close="closeFn" :title="formTitle" :visible.sync="dialogVisibleFn" :width="width">
      <el-form
        size="mini"
        ref="apiUserForm"
        :rules="formRules"
        :model="form"
        label-width="120px"
        :inline="inline"
      >
        <slot name="formContent"></slot>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleHidden">取 消</el-button>
        <el-button :disabled='disabledBtn' type="primary" @click="formSubmitFn('apiUserForm');">确 定</el-button>
      </span>
    </el-dialog>


</template>

<script>

export default {
  name:"publicForm",
  props:{
    formTitle:{},
    formRules:{},
    form:{},
    otherInfo:{},
    url:{},
    width:{},
    inline:{},
    disabledBtn:{}
  },
  data(){
    return {

    }
  },
  computed: {

    dialogVisibleFn: {
      get: function() {
        return this.$store.state.dialogVisible.dialogVisible
      },
      set: function() {
        this.$store.commit('dialogVisible/dialogVisibleMutations',false)
      }
    }


  },
  methods:{
      closeFn(){
        this.$emit("resetFormEmit",{})
      },
      dialogVisibleHidden(){
        this.$store.commit('dialogVisible/dialogVisibleMutations',false)
      },
      //表单确定
      formSubmitFn(formName){
          this.$refs[formName].validate((valid) => {
              if (valid) {
                  this.formSubmit();
              } else {
                  console.log('error submit!!');
                  return false;
              }
          });
      },
      //表单提交
      formSubmit() {
          if(this.otherInfo=="1"){ //修改
              this.publicHandle(this.url.updUrl,'post');
          }else if(this.otherInfo=="0"){ //新增
              this.publicHandle(this.url.addUrl,'post');
          }
 
      },
      //新增 更新 删除 公共函数
      async publicHandle(url,method){
          try {
              const data = await this.$axios[method](url,
              this._qs.stringify(this.form)
              );
              data.errcode==0?this.$message.success(data.errmsg) : this.$message.error(data.errmsg)
          } catch (err) {
              this.$message.error("服务器异常，请稍后再试！");
          }
          this.$store.commit('dialogVisible/dialogVisibleMutations',false)
      },
      
  }
}
</script>

<style>

</style>