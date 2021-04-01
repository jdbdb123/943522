/*
软件名称:文创阅读 复制链接到微信打开
更新时间：2021-03-29 @肥皂
脚本说明：文创阅读自动阅读
脚本为自动完成文创阅读的阅读任务
每日收益暂时不清楚，阅读单价目前为1分，一毛就可提现，支付宝秒到，需每日手动阅读通过微信鉴权，防止黑号，不会与其他的阅读脚本产生冲突，如番茄看看，云扫码，微客众智，66阅读，可一起跑脚本

复制链接到微信打开 注册需填写邀请人id和昵称
欢迎一起读文章，文章任务多，满0.1元可提现，提现秒到账，（邀请人ID 23501  ，昵称  干饭人），点链接进入   http://i0k.cn/5nOu8

本脚本以学习为主！
使用方法:复制上方链接进入，需填写邀请信息，点击阅读1开始阅读，获得阅读数据，自动提现请到boxjs中填写支付宝的提现信息
3.29修复域名变化导致的无法抓包和跑脚本的问题，请更换重写和mitm
TG电报群: https://t.me/hahaha8028

boxjs地址 :  
https://raw.githubusercontent.com/age174/-/main/feizao.box.json

文创阅读
圈X配置如下，其他软件自行测试，定时可以多设置几次，没任务会停止运行的
[task_local]
#文创阅读
5 9-22 * * * https://raw.githubusercontent.com/age174/-/main/wcyd.js, tag=文创阅读, img-url=https://ae01.alicdn.com/kf/Ua6bd9417d492473f8ca0c3110b2176307.jpg, enabled=true

[rewrite_local]
#文创阅读
http://qcjesnfs.bar/hfTask/startRead url script-request-header https://raw.githubusercontent.com/age174/-/main/wcyd.js

#loon
http://qcjesnfs.bar/hfTask/startRead script-path=https://raw.githubusercontent.com/age174/-/main/wcyd.js, requires-header=true, timeout=10, tag=文创阅读

#surge
文创阅读 = type=http-request,pattern=http://qcjesnfs.bar/hfTask/startRead,requires-header=1,max-size=0,script-path=https://raw.githubusercontent.com/age174/-/main/wcyd.js,script-update-interval=0

[MITM]
hostname = qcjesnfs.bar

*/


const $ = new Env('文创阅读');
let status;
status = (status = ($.getval("wcydstatus") || "1") ) > 1 ? `${status}` : ""; // 账号扩展字符
let wcydurlArr = [], wcydhdArr = [],wcydcount = ''
let wcydurl = $.getdata('wcydurl')
let wcydhd = $.getdata('wcydhd')
let zfb = ($.getval('zfb') || '');//提现支付宝账号
let name = ($.getval('name') || '');//提现支付宝用户名
let txje = ($.getval('txje') || '0.1');//自定义提现金额

if ($.isNode()) {
  if (process.env.WCYD_URL && process.env.WCYD_URL.indexOf('\n') > -1) {
   wcydurlArr = process.env.WCYD_URL.split('\n');
   console.log(`您选择的是用换行隔开\n`)
  } else {
   wcydurlArr = process.env.WCYD_URL.split()
  };

  
  if (process.env.WCYD_HD && process.env.WCYD_HD.indexOf('\n') > -1) {
   wcydhdArr = process.env.WCYD_HD.split('\n');
   console.log(`您选择的是用换行隔开\n`)
  } else {
   wcydhdArr = process.env.WCYD_HD.split()
  };
  
    console.log(`============ 脚本执行-国际标准时间(UTC)：${new Date().toLocaleString()}  =============\n`)
    console.log(`============ 脚本执行-北京时间(UTC+8)：${new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toLocaleString()}  =============\n`)
 }  else {wcydurlArr.push($.getdata('wcydurl'))
    wcydhdArr.push($.getdata('wcydhd'))
    let wcydcount = ($.getval('wcydcount') || '1');
  for (let i = 2; i <= wcydcount; i++) {
    wcydurlArr.push($.getdata(`wcydurl${i}`))
    wcydhdArr.push($.getdata(`wcydhd${i}`))
  }
}


!(async () => {
if (!wcydhdArr[0]) {
    $.msg($.name, '【提示】请先获取一cookie')
    return;
  }
    console.log(`------------- 共${wcydhdArr.length}个账号-------------\n`)
      for (let i = 0; i < wcydhdArr.length; i++) {
        if (wcydhdArr[i]) {
         
          wcydurl = wcydurlArr[i];
          wcydhd = wcydhdArr[i];
          $.index = i + 1;
          console.log(`\n开始【文创阅读${$.index}】`)
          await wcyd1();
          

  }
}

})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())
//文创阅读数据获取


function wcydck() {
   if ($request.url.indexOf("startRead") > -1) {
 const wcydurl = $request.url
  if(wcydurl)     $.setdata(wcydurl,`wcydurl${status}`)
    $.log(wcydurl)
  const wcydhd = JSON.stringify($request.headers)
        if(wcydhd)    $.setdata(wcydhd,`wcydhd${status}`)
$.log(wcydhd)
   $.msg($.name,"",'文创阅读'+`${status}` +'数据获取成功！')
  }
}



//文创阅读key
function wcyd1(timeout = 0) {
  return new Promise((resolve) => {

let url = {
        url : 'http://qcjesnfs.bar/hfTask/startRead',
        headers : JSON.parse(wcydhd),
        body : 'isM6=2',
}
      $.post(url, async (err, resp, data) => {

        try {
          //console.log(data)
    const result = JSON.parse(data)
        if(result.code == 0){
console.log('\n文创阅读获取任务信息成功,阅读任务链接:\n'+result.msg)
await $.wait(9000); 
await wcydlb();      
        
} else {
console.log('文创阅读获取任务信息失败'+result.msg)

}
        } catch (e) {
          //$.logErr(e, resp);
        } finally {
          resolve()
        }
    },timeout)
  })
}


//文创阅读提交
function wcydlb(timeout = 0) {
  return new Promise((resolve) => {

let url = {
        url : "http://qcjesnfs.bar/hfTask/read",
        headers : JSON.parse(wcydhd),
        body : '',
       
}
      $.post(url, async (err, resp, data) => {

        try {
    const result = JSON.parse(data)

        if(result.code == 0){

        console.log('\n文创阅读提交任务:'+result.msg)
        await wcydyd();

} else {
       console.log('\n文创阅读提交任务失败'+result.msg)
}
   
        } catch (e) {
          //$.logErr(e, resp);
        } finally {
          resolve()
        }
    },timeout)
  })
}


//文创阅读信息
function wcydyd(timeout = 0) {
  return new Promise((resolve) => {
let url = {
        url : "http://qcjesnfs.bar/hfTask/getUser",
        headers : JSON.parse(wcydhd),
        body :'',
}
      $.post(url, async (err, resp, data) => {

        try {
           
    const result = JSON.parse(data)
        if(result.id !== 0){
        console.log('\n文创阅读用户信息获取成功\n用户名:'+result.weixin+'\n当前余额:'+result.amount)
if(result.amount >= txje){
$.log('\n文创阅读检测到当前余额可提现，前去提现')
await wcydtx();

}
       await $.wait(1000);
       await wcyd1();
} else {
       console.log('\n文创阅读用户信息获取失败 '+data)

}
   
        } catch (e) {
          //$.logErr(e, resp);
        } finally {
          resolve()
        }
    },timeout)
  })
}


//文创阅读提现
function wcydtx(timeout = 0) {
  return new Promise((resolve) => {

let url = {
        url : "http://qcjesnfs.bar/hfTask/cash",
        headers : JSON.parse(wcydhd),
        body : `wx=&zfb=${zfb}&name=${name}`,
}
      $.post(url, async (err, resp, data) => {
        try {
           
    const result = JSON.parse(data)
        if(result.code == 0){

        console.log('\n文创阅读提现'+result.msg)
        
} else {
       console.log('\n文创阅读提现 '+result.msg)
}
   
        } catch (e) {
          //$.logErr(e, resp);
        } finally {
          resolve()
        }
    },timeout)
  })
}



function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
