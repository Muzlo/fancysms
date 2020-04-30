<template>
  <div>
  
  <el-form ref="ruleForm" :model="ruleForm" label-width="80px" status-icon :rules="rules">

        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="ruleForm.oldPassword" placeholder="请输入旧密码" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="ruleForm.newPassword" placeholder="请输入新密码" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="ruleForm.checkPass" placeholder="再次输入新密码" autocomplete="off"></el-input>
        </el-form-item>

      <el-button style="display: block;margin:0 auto;" type="primary" @click="save('ruleForm')">保 存</el-button>



  </el-form>

  </div>
</template>

<script>

import {modifyPassword} from "../../api/api.js";
export default {
    name:"modifyPassword",
    //data(){
        //return {
        //   form:{},
        //   rules:{
        //     oldPassword: [
        //       { required: true, message: '必填', trigger: 'blur' }
        //     ],
        //     newPassword: [
        //       { required: true, message: '必填', trigger: 'blur' }
        //     ],
        //   }
        // }
    //},

    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入新密码'));
        } else if (value !== this.ruleForm.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          oldPassword:'',
          newPassword: '',
          checkPass: ''
        },
        rules: {
          oldPassword:[
            { required: true, message: '必填', trigger: 'blur' }
          ],
          newPassword: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
        }
      };
    },

    components: {},
    created() {},
    computed: {},
    methods:{

      save(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let paramsObj = {
                oldPassword:this.ruleForm.oldPassword,
                newPassword:this.ruleForm.newPassword,
            };
            try {
              let data = await this.$axios.post(
                modifyPassword,
                this._qs.stringify(paramsObj)
              );
              data.status == 0 ? this.$message.success(data.message) : this.$message.error(data.message);
            } catch (err) {
              this.$message.error("服务器异常，请稍后再试！");
            }
          } else {
            return false;
          }
        });
      },



    },

}
</script>

<style>

</style>