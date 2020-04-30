import { baseURL } from "../common/js/ipconfig.js";
<<<<<<< HEAD

=======
>>>>>>> 0506
const getAppsList=`${baseURL.ip1}/sms/getAppsList`//获取应用列表
const getBillNo=`${baseURL.ip1}/sms/getBillNo` //获取随机号码
const getVerifCode=`${baseURL.ip1}/sms/getVerifCode` //获取验证码
const login=`${baseURL.ip1}/sms/login` //系统登录
const logout=`${baseURL.ip1}/sms/logout` //系统退出
const consumeList=`${baseURL.ip1}/sms/consumeList` //消费记录查询
const customerList=`${baseURL.ip1}/sms/customerList` //客户信息查询(仅对繁睿开放)
const addCustomer=`${baseURL.ip1}/sms/addCustomer` //新增客户(仅对繁睿开放)
const updCustomer=`${baseURL.ip1}/sms/updCustomer` //修改客户(仅对繁睿开放)
const rechargeList=`${baseURL.ip1}/sms/rechargeList` //充值记录查询
const userList=`${baseURL.ip1}/sms/userList` //获取用户列表
const addUser=`${baseURL.ip1}/sms/addUser` //新增用户
const updUser=`${baseURL.ip1}/sms/updUser` //修改用户
const customerAppsList=`${baseURL.ip1}/sms/customerAppsList`//获取客户应用列表
const modifyPassword=`${baseURL.ip1}/sms/modifyPassword`//修改密码
const appointBillNo=`${baseURL.ip1}/sms/appointBillNo`//指定号码分配
const releaseBillNo=`${baseURL.ip1}/sms/releaseBillNo` //回收号码



export {
    getAppsList,getBillNo,getVerifCode,login,logout,
    consumeList,customerList,addCustomer,updCustomer,
    rechargeList,userList,addUser,updUser,customerAppsList,modifyPassword,
    appointBillNo,releaseBillNo
}