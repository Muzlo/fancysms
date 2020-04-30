// import Vue from 'vue'
// import qs from 'qs'
// import instance from '../../common/js/http';
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);
// Vue.prototype.$axios = instance
// Vue.prototype._qs = qs

// //处理字符串省市
// let dealProvinceCity=(data)=>{
//     let str = data.lst;
//     let provinceDeal = new Array();
//     str = str.split("</option>");
//     let len = str.length;
//     str.splice(len - 1, 1);
//     str.forEach((item, index) => {
//         let provinceDealJson = {};
//         provinceDealJson.name = item.split(">")[1];
//         provinceDeal[index] = provinceDealJson;
//     });
//     return provinceDeal;
// }

// //获取省份
// let getProvince=async ()=>{
//     try {
//         let data = await Vue.$axios.post("/fr/MyAgent/cardArea");
//         if (data.errcode == 0) {
//         this.province = dealProvinceCity(data);
//         }
//     } catch (err) {
//         Vue.$message.error("服务器异常，请稍后再试！")
//     }
// }

// //获取对应城市
// let citySearchFn=async(val)=>{
//     try {
//         let data = await Vue.$axios.post(
//         "/fr/MyAgent/cardCity",
//         Vue._qs.stringify({
//             area: val
//         })
//         );
//         if (data.errcode == 0) {
//         this.city = dealProvinceCity(data);
//         }
//     } catch (err) {
//         Vue.$message.error("服务器异常，请稍后再试！")
//     }
// }



// let fn=async()=>{

//     try {
//         let data = await Vue.$axios.post("/fr/MyAgent/cardArea");
//         if (data.errcode == 0) {
//             //this.province = dealProvinceCity(data);
//             console.log(dealProvinceCity(data))
//         }
//     } catch (err) {
//         console.log("error")
//         //Vue.$message.error("服务器异常，请稍后再试！")
//     }
// }


// export {fn}