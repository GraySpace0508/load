(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-2ced"],{"2BKr":function(t,e,n){"use strict";n.r(e);var i=n("TsPW"),r={data:function(){return{carFlowId:"",data:{},bigImage:"",baseUrl:"http://cloud.ivics-hn.com//services"}},created:function(){this.$route.query.id&&(this.carFlowId=this.$route.query.id,this.getData())},methods:{getData:function(){var t=this;Object(i.x)(this.carFlowId).then(function(e){t.data=e.data})},getImageTime:function(t){if(console.log(t),t){var e=t.split(" ")[0];return e=(e=e.replace("-","")).replace("-","")}return""}}},s=(n("3xlf"),n("KHd+")),a=Object(s.a)(r,function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"app-container"},[n("el-row",{attrs:{gutter:20}},[n("el-col",{attrs:{span:12}},[n("div",{staticClass:"violation-detail"},[n("label",[t._v("车牌")]),n("span",[t._v(t._s(t.data.plateNo))])])]),t._v(" "),n("el-col",{attrs:{span:12}},[n("div",{staticClass:"violation-detail"},[n("label",[t._v("违章抓拍点")]),n("span",[t._v(t._s(t.data.positition?t.data.positition.name:""))])])]),t._v(" "),n("el-col",{attrs:{span:12}},[n("div",{staticClass:"violation-detail"},[n("label",[t._v("违章原因")]),n("span",[t._v(t._s(t.data.reason))])])]),t._v(" "),n("el-col",{attrs:{span:12}},[n("div",{staticClass:"violation-detail"},[n("label",[t._v("违章时间")]),n("span",[t._v(t._s(t.data.time))])])]),t._v(" "),n("el-col",{attrs:{span:12}},[n("div",{staticClass:"violation-detail"},[n("label",[t._v("车速")]),n("span",[t._v(t._s(t.data.speed))])])]),t._v(" "),n("el-col",{attrs:{span:12}},[n("div",{staticClass:"violation-detail"},[n("label",[t._v("违章编码")]),n("span",[t._v(t._s(t.data.carsFlowId))])])]),t._v(" "),n("el-col",{attrs:{span:12}},[n("div",{staticClass:"violation-detail"},[n("label",[t._v("限速")]),n("span",[t._v(t._s(t.data.limitSpeed))])])]),t._v(" "),n("el-col",{attrs:{span:12}})],1),t._v(" "),n("h2",{staticStyle:{"margin-top":"30px","margin-bottom":"15px"}},[t._v("抓拍图片")]),t._v(" "),n("el-row",{staticStyle:{display:"flex","flex-flow":"row"},attrs:{gutter:20}},t._l(t.data.images,function(e,i){return t.data.images?n("el-col",{key:i,staticStyle:{"margin-bottom":"15px",display:"flex",flex:"1","align-items":"center","justify-content":"center",background:"#f5f5f5","margin-right":"10px"},attrs:{span:12}},[n("img",{staticStyle:{"max-width":"100%",cursor:"pointer"},attrs:{title:"查看大图",preview:"0",src:t.baseUrl+"/images/"+t.getImageTime(e.imagesTime)+"/"+e.imagesId+"."+e.imagesType,alt:""}})]):t._e()}),1)],1)},[],!1,null,null,null);e.default=a.exports},"3xlf":function(t,e,n){"use strict";var i=n("dnfy");n.n(i).a},TsPW:function(t,e,n){"use strict";n.d(e,"i",function(){return r}),n.d(e,"n",function(){return s}),n.d(e,"l",function(){return a}),n.d(e,"m",function(){return o}),n.d(e,"q",function(){return c}),n.d(e,"y",function(){return u}),n.d(e,"x",function(){return l}),n.d(e,"j",function(){return d}),n.d(e,"r",function(){return p}),n.d(e,"a",function(){return f}),n.d(e,"u",function(){return v}),n.d(e,"z",function(){return m}),n.d(e,"d",function(){return b}),n.d(e,"t",function(){return g}),n.d(e,"s",function(){return h}),n.d(e,"b",function(){return _}),n.d(e,"A",function(){return j}),n.d(e,"e",function(){return O}),n.d(e,"o",function(){return w}),n.d(e,"p",function(){return y}),n.d(e,"h",function(){return x}),n.d(e,"v",function(){return I}),n.d(e,"c",function(){return C}),n.d(e,"B",function(){return T}),n.d(e,"f",function(){return k}),n.d(e,"k",function(){return S}),n.d(e,"w",function(){return F}),n.d(e,"g",function(){return q});var i=n("t3Un");function r(t){return Object(i.a)({url:"/services/statistics/camera",method:"get",params:t})}function s(t){return Object(i.a)({url:"/services/statistics/cars/violation",method:"get",params:t})}function a(t){return Object(i.a)({url:"/services/statistics/cars/flow/group/hours",method:"get",params:t})}function o(t){return Object(i.a)({url:"/services/statistics/cars/flow/group/minute",method:"get",params:t})}function c(t){return Object(i.a)({url:"/services/statistics/positition/camera",method:"get",params:t})}function u(t){return Object(i.a)({url:"/services/cars/flow/simple",method:"post",data:t})}function l(t){return Object(i.a)({url:"/services/cars/flow/"+t,method:"get"})}function d(t){return Object(i.a)({url:"/services/cameras",method:"get",params:t})}function p(t){return Object(i.a)({url:"/services/posititions",method:"get",params:t})}function f(t){return Object(i.a)({url:"/services/posititions",method:"post",data:t})}function v(t){return Object(i.a)({url:"/services/posititions/"+t,method:"get"})}function m(t){return Object(i.a)({url:"/services/posititions",method:"put",data:t})}function b(t){return Object(i.a)({url:"/services/posititions/"+t,method:"delete"})}function g(t){return Object(i.a)({url:"/services/posititions/conditon",method:"get",params:t})}function h(t){return Object(i.a)({url:"/services/posititions/"+t.posititionId+"/cameras",method:"get",params:t})}function _(t){return Object(i.a)({url:"/services/posititions/"+t.posititionId+"/cameras",method:"post",data:t})}function j(t){return Object(i.a)({url:"/services/posititions/"+t.posititionId+"/cameras",method:"put",data:t})}function O(t){return Object(i.a)({url:"/services/posititions/"+t.posititionId+"/cameras/"+t.cameraId,method:"delete"})}function w(t){return Object(i.a)({url:"/services/geos/"+t,method:"get"})}function y(t){return Object(i.a)({url:"/services/geos/positition/"+t,method:"get"})}function x(t){return Object(i.a)({url:"/services/attributions",method:"get"})}function I(){return Object(i.a)({url:"/services/posititiontypes",method:"get"})}function C(t){return Object(i.a)({url:"/services/posititiontypes",method:"post",data:t})}function T(t){return Object(i.a)({url:"/services/posititiontypes/"+t.posititionTypeId,method:"put",data:t})}function k(t){return Object(i.a)({url:"/services/posititiontypes/"+t,method:"delete"})}function S(t){return Object(i.a)({url:"/services/carsflows/count",method:"get",params:t})}function F(t){return Object(i.a)({url:"/services/userplates",method:"get",params:t})}function q(t){return Object(i.a)({url:"/services/userplates/"+t,method:"delete"})}},dnfy:function(t,e,n){}}]);