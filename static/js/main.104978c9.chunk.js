(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{182:function(e,t,a){e.exports=a(363)},363:function(e,t,a){"use strict";a.r(t);var n,i,r=a(0),c=a.n(r),l=a(9),u=a.n(l),o=a(14),d=a(24),s=Object(r.createContext)({menus:[],update:function(){}}),p="A SPACE ODYSSEY  \ud83d\udef0",f=function(){var e=Object(r.useContext)(s);return c.a.createElement("div",{style:{borderRight:"1px solid #ececec",height:"100%"}},c.a.createElement("p",{style:{fontWeight:"bold"}},p),e?e.menus.map(function(e){return c.a.createElement(d.a,{key:e.key,to:e.url},c.a.createElement("div",{style:{padding:"16px"}},e.name.replace("//GROUP","____").replace("//TAG","_")))}):null)},E=a(81),m=a.n(E),_=a(367),h=a(27),y=a(366),b=a(368),v=a(23),O=a(70),g=a(179);!function(e){e.SPACE="SPACE",e.TAG="TAG",e.GROUP="GROUP",e.GROUPXGROUP="GROUPXGROUP"}(n||(n={})),function(e){e.USER="USER",e.ROLE="ROLE",e.DATA="DATA",e.RESOURCE="RESOURCE"}(i||(i={}));var k=window.localStorage,j=function(e){var t=function(){var t=k.getItem(n[e]);return t?JSON.parse(t):[]},a=t();return new Proxy(a,{get:function(e,n){return a=t(),Reflect.get(a,n)},set:function(t,i,r){return Reflect.set(a,i,r),k.setItem(n[e],JSON.stringify(a)),!0}})},A=function(e){return{add:function(t){return function(e,t){return j(e).push(t),!0}(e,t)},del:function(t){return function(e,t){var a=j(e),n=a.findIndex(t);return n>-1&&(a.splice(n,1),!0)}(e,t)},update:function(t,a){return function(e,t,a){var n=j(e),i=n.findIndex(t);if(i>-1){var r=a(n[i]);return n[i]=r,r}}(e,t,a)},query:function(t){return function(e,t){return j(e).find(t)}(e,t)},list:function(t){return function(e,t){return j(e).filter(t)}(e,t)}}};A.TABLE=n;var S=A,R=function(e){return Math.max.apply(Math,[0].concat(Object(g.a)(S(e).list(function(e){return!0}).map(function(e){return e.id}))))},C=function e(){Object(O.a)(this,e),this.id=e.id,this.alias=""};C.id=R(n.SPACE);var x=function e(){Object(O.a)(this,e),this.id=e.id,this.alias="",this.space_id=0,this.type=i.USER,this.space_alias=""};x.id=R(n.TAG);var P=function e(){Object(O.a)(this,e),this.id=e.id,this.alias="",this.path="",this.is_root=!1,this.type=i.USER,this.tag_id=0,this.tag_alias="",this.space_id=0,this.space_alias="",this.children=[]};P.id=R(n.GROUP);var w=function e(){Object(O.a)(this,e),this.id=e.id,this.group_id=0,this.link_group_id=0};w.id=R(n.GROUPXGROUP);var U=function(e,t){var a=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return"[object Object]"!==Object.prototype.toString.call(e)||0===Object.keys(e).length?a:!!Object.keys(e).reduce(function(a,n){return!1!==a&&e[n]===t[n]},null)},I=S(S.TABLE.GROUP),T=S(S.TABLE.GROUPXGROUP),G=function(e){var t=e,a=T.list(function(t){return t.group_id===e.id}).map(function(e){return I.query(function(t){return t.id===e.link_group_id})}).reduce(function(e,t){var a=e[t.tag_alias];return a?a.push(t.path):e[t.tag_alias]=[t.path],e},{});t.links=a},L=function e(t){var a=I.list(function(e){var a=e.path!==t.path,n=e.path.startsWith(t.path),i=/#.*#/.test(e.path.replace(t.path,""));return a&&n&&!i});Array.isArray(a)&&(a.forEach(function(t){G(t),e(t)}),t.children=a)},q=function(e){console.log("group",e);var t=I.query(function(t){return U(e,t,!1)});return t?(G(t),L(t),t):null},D=function(e){return console.log("group",e),I.list(function(t){return U(e,t,!1)}).map(function(e){return G(e),L(e),e})},F=function(e,t){var a=Object(v.a)({},new P,e),n=a.links;return delete a.links,a.id=++P.id,a.path=t.path?"".concat(t.path).concat(a.id,"#"):"ROOT".concat(a.id,"#"),a.space_id=t.space_id,a.space_alias=t.space_alias,a.tag_id=t.tag_id,a.tag_alias=t.tag_alias,a.type=t.type,B(n,a.id),I.add(a),a.id},B=function(e,t){if(e){var a=Object.keys(e).reduce(function(t,a){var n=e[a]||[];return t.concat(n.map(function(e){var t;return null===(t=q({path:e}))||void 0===t?void 0:t.id}))},[]).reduce(function(e,t){return e[t]="append",e},{});T.query(function(e){return e.group_id===t&&(a[e.link_group_id]?delete a[e.link_group_id]:T.del(function(a){return a.group_id===t&&a.link_group_id===e.link_group_id||a.group_id===e.link_group_id&&a.link_group_id===e.group_id})),!1}),Object.keys(a).forEach(function(e){var a=new w;a.id=++w.id,a.group_id=t,a.link_group_id=+e,T.add(a);var n=new w;n.id=++w.id,n.group_id=+e,n.link_group_id=t,T.add(n)})}},V=function(e){var t=I.query(function(t){return U(e,t,!1)});if(t)return I.list(function(e){return e.path.startsWith(t.path)}).forEach(function(e){T.del(function(t){return t.group_id===e.id||t.link_group_id===e.id})}),I.del(function(e){return!e.is_root&&e.path.startsWith(t.path)})},W=function(e){var t={};e.id&&(t.id=e.id),e.tag_id&&(t.tag_id=e.tag_id),e.space_id&&(t.space_id=e.space_id);var a=I.update(function(e){return U(t,e,!1)},function(t){return Object(v.a)({},t,e)});if(a){var n=q({id:a.id});e.links&&!m.a.isEqual(e.links,null===n||void 0===n?void 0:n.links)&&B(e.links,a.id)}},H=S(S.TABLE.TAG),J=S(S.TABLE.SPACE),K=function(e){return H.list(function(t){return U(e,t,!0)})},M=function(e){var t={};e.id&&(t.id=e.id),e.space_id&&(t.space_id=e.space_id);var a=H.update(function(t){return U({id:e.id},t,!1)},function(t){return Object(v.a)({},t,e)});a&&D({tag_id:a.id}).forEach(function(e){W({id:e.id,tag_id:a.id,type:a.type,tag_alias:a.alias})})},X=S(S.TABLE.SPACE),Y=function(e){return X.list(function(t){return U(e,t,!0)})},N=_.a.Item,$={labelCol:{span:8},wrapperCol:{span:16}},z=function(){var e=Object(r.useContext)(s),t=Object(r.useState)([]),a=Object(o.a)(t,2),n=a[0],i=a[1],l=_.a.useForm(),u=Object(o.a)(l,1)[0],p=Object(r.useCallback)(function(){var t=Y();i(t),e.update()},[e]);Object(r.useEffect)(function(){p()},[p]);var f=Object(r.useCallback)(function(e){console.log("values",e),e.id?function(e){var t=X.update(function(t){return U({id:e.id},t,!1)},function(t){return Object(v.a)({},t,e)});t&&K({space_id:t.id}).forEach(function(e){M({space_id:t.id,space_alias:t.alias})})}(e):function(e){var t=Object(v.a)({},new C,e);t.id=++C.id,X.add(t),t.id}(e),p()},[p]);return c.a.createElement("div",{style:{display:"flex"}},c.a.createElement("div",{style:{flex:1}},c.a.createElement("div",null,c.a.createElement(h.a,{type:"primary",onClick:function(){u.setFieldsValue({alias:"",id:""})}},"\u65b0\u589e")),c.a.createElement(y.a,{rowKey:"id",dataSource:n,columns:[{key:"id",dataIndex:"id",title:"ID"},{key:"alias",dataIndex:"alias",title:"ALIAS"},{key:"__op__",render:function(e){return c.a.createElement("div",null,c.a.createElement(h.a,{onClick:function(){var t;t={id:e.id},X.del(function(e){return U(t,e,!1)}),p()},type:"dashed"},"\u5220\u9664"),c.a.createElement(h.a,{type:"primary",onClick:function(){u.setFieldsValue(e)}},"\u4fee\u6539"),c.a.createElement(d.a,{to:"/ace/tag/".concat(e.id)},c.a.createElement(h.a,null,"\u7f16\u8f91TAG")))}}]})),c.a.createElement("div",{style:{flex:1}},c.a.createElement("h3",null,"\u7f16\u8f91\u533a"),c.a.createElement(_.a,Object.assign({},$,{form:u,onFinish:f}),c.a.createElement(N,{name:"id",label:"ID",required:!0},c.a.createElement(b.a,{disabled:!0})),c.a.createElement(N,{name:"alias",label:"ALIAS",required:!0},c.a.createElement(b.a,null)),c.a.createElement(h.a,{type:"primary",htmlType:"submit"},"\u4fdd\u5b58"))))},Q=a(91),Z=_.a.Item,ee=Q.default.Group,te={labelCol:{span:8},wrapperCol:{span:16}},ae=function(){var e=Object(r.useState)([]),t=Object(o.a)(e,2),a=t[0],n=t[1],l=Object(r.useContext)(s),u=Object(d.c)(),p=_.a.useForm(),f=Object(o.a)(p,1)[0],E=Object(r.useCallback)(function(){n(K({space_id:+u.space_id})),l.update()},[l,u.space_id]);Object(r.useEffect)(function(){E()},[E]);var m=Object(r.useCallback)(function(e){console.log("values",e),e.space_id=+u.space_id,e.id?M(e):function(e){var t=Object(v.a)({},new x,e);t.space_alias=J.query(function(t){return t.id===e.space_id}).alias,t.alias=e.alias,t.id=++x.id,H.add(t);var a=new P;a.alias=e.alias,a.children=[],a.is_root=!0,F(a,{space_alias:t.space_alias,space_id:t.space_id,tag_id:t.id,tag_alias:t.alias,type:t.type}),t.id}(e),E()},[u.space_id,E]);return c.a.createElement("div",{style:{display:"flex"}},c.a.createElement("div",{style:{flex:1}},c.a.createElement("div",null,c.a.createElement(h.a,{type:"primary",onClick:function(){f.setFieldsValue({alias:"",id:""})}},"\u65b0\u589e")),c.a.createElement(y.a,{rowKey:"id",dataSource:a,columns:[{key:"id",dataIndex:"id",title:"ID"},{key:"alias",dataIndex:"alias",title:"ALIAS"},{key:"type",dataIndex:"type",title:"TYPE"},{key:"space_alias",dataIndex:"space_alias",title:"SPACE_ALIAS"},{key:"__op__",render:function(e){return c.a.createElement("div",null,c.a.createElement(h.a,{onClick:function(){!function(e){var t=H.query(function(t){return U(e,t,!1)});if(t)V({tag_id:t.id}),H.del(function(e){return e.id===t.id})}({id:e.id}),E()},type:"dashed"},"\u5220\u9664"),c.a.createElement(h.a,{type:"primary",onClick:function(){f.setFieldsValue(e)}},"\u4fee\u6539"),c.a.createElement(d.a,{to:"/ace/group/".concat(u.space_id,"/").concat(e.id)},c.a.createElement(h.a,null,"\u7f16\u8f91GROUP")))}}]})),c.a.createElement("div",{style:{flex:1}},c.a.createElement("h3",null,"\u7f16\u8f91\u533a"),c.a.createElement(_.a,Object.assign({},te,{form:f,onFinish:m}),c.a.createElement(Z,{name:"id",label:"ID",required:!0},c.a.createElement(b.a,{disabled:!0})),c.a.createElement(Z,{name:"alias",label:"ALIAS",required:!0},c.a.createElement(b.a,null)),c.a.createElement(Z,{name:"type",label:"TYPE",required:!0},c.a.createElement(ee,{options:[{label:i.USER,value:i.USER},{label:i.ROLE,value:i.ROLE},{label:i.DATA,value:i.DATA},{label:i.RESOURCE,value:i.RESOURCE}]})),c.a.createElement(h.a,{type:"primary",htmlType:"submit"},"\u4fdd\u5b58"))))},ne=a(364),ie=a(365),re=a(370),ce=a(369),le=function(e){var t=e.value,a=e.onChange,n=e.tree,i=Object(r.useState)([]),l=Object(o.a)(i,2),u=l[0],d=l[1],s=Object(r.useState)(!0),p=Object(o.a)(s,2),f=p[0],E=p[1];Object(r.useEffect)(function(){Array.isArray(t)&&d(t)},[t]);return c.a.createElement(ce.a,{checkable:!0,onExpand:function(e){console.log("onExpand",e),d(e),E(!1)},expandedKeys:u,autoExpandParent:f,onCheck:function(e){console.log("onCheck",e),a&&a(e)},checkedKeys:t,treeData:n})},ue=_.a.Item,oe={labelCol:{span:8},wrapperCol:{span:16}},de=function(){var e=Object(r.useState)([]),t=Object(o.a)(e,2),a=t[0],n=t[1],l=Object(r.useState)({}),u=Object(o.a)(l,2),s=u[0],p=u[1],f=Object(d.c)(),E=_.a.useForm(),m=Object(o.a)(E,1)[0],y=Object(r.useRef)(),O=Object(r.useState)(),g=Object(o.a)(O,2),k=g[0],j=g[1],A=Object(r.useCallback)(function(){var e=q({space_id:+f.space_id,tag_id:+f.tag_id,is_root:!0});n([function e(t){return t.title=c.a.createElement(ne.a,{gutter:16},c.a.createElement(ie.a,null,c.a.createElement("div",null,t.alias)),c.a.createElement(ie.a,null,c.a.createElement(h.a,{type:"link",onClick:function(e){e.stopPropagation(),V({id:t.id}),A()}},"\u5220\u9664")),c.a.createElement(ie.a,null,c.a.createElement(h.a,{type:"link",onClick:function(e){e.stopPropagation(),m.setFieldsValue(t)}},"\u67e5\u770b")),c.a.createElement(ie.a,null,c.a.createElement(h.a,{type:"link",onClick:function(e){e.stopPropagation(),y.current=t,j(t),m.setFieldsValue({})}},"\u6dfb\u52a0\u5b50\u8282\u70b9"))),t.key=t.path,t.children=Array.isArray(t.children)?t.children.map(function(t){return e(t)}):[],t}(e||{})])},[m,f.space_id,f.tag_id]);Object(r.useEffect)(function(){A()},[A]);var S=Object(r.useCallback)(function(e){if(console.log("values",e),e.id)W(Object(v.a)({},e,{space_id:+f.space_id,tag_id:+f.tag_id}));else{if(!y.current)return re.a.error("\u8bf7\u5148\u9009\u62e9\u7236\u8282\u70b9");F(Object(v.a)({},e,{space_id:+f.space_id,tag_id:+f.tag_id}),y.current)}A()},[f.space_id,f.tag_id,A]),R=Object(r.useCallback)(function(){if(a[0]){var e=function(e){switch(e){case i.USER:return[i.DATA,i.ROLE];case i.DATA:return[i.USER];case i.RESOURCE:return[i.ROLE];case i.ROLE:return[i.USER,i.RESOURCE];default:return[]}}(a[0].type).reduce(function(e,t){var a=D({type:t,is_root:!0}).reduce(function(e,t){if(!t)return[];var a=function e(t,a){return a.forEach(function(e){t[e.after]=t[e.before]}),t.children=Array.isArray(t.children)?t.children.map(function(t){return e(t,a)}):[],t}(t,[{before:"alias",after:"title"},{before:"path",after:"key"}]);return e[t.alias]=[a],e},{});return e[t]=a,e},{});p(e)}},[a]);return Object(r.useEffect)(function(){R()},[R]),c.a.createElement("div",{style:{display:"flex"}},c.a.createElement("div",{style:{flex:1}},c.a.createElement(ce.a,{autoExpandParent:!0,defaultExpandAll:!0,showLine:!0,treeData:a})),c.a.createElement("div",{style:{flex:1}},c.a.createElement("h3",null,"\u7f16\u8f91\u533a"),c.a.createElement("div",null,c.a.createElement("h4",null,"\u5f53\u524d\u7236\u8282\u70b9: ",null===k||void 0===k?void 0:k.alias," / ",null===k||void 0===k?void 0:k.path)),c.a.createElement(_.a,Object.assign({},oe,{form:m,onFinish:S}),c.a.createElement(ue,{name:"id",label:"ID",required:!0},c.a.createElement(b.a,{disabled:!0})),c.a.createElement(ue,{name:"path",label:"PATH",required:!0},c.a.createElement(b.a,{disabled:!0})),c.a.createElement(ue,{name:"alias",label:"ALIAS",required:!0},c.a.createElement(b.a,null)),Object.keys(s).map(function(e){return c.a.createElement("div",{key:e},c.a.createElement("h2",null,e),c.a.createElement("div",null,Object.keys(s[e]).map(function(t){return c.a.createElement(ue,{key:t,name:["links",t],label:t},c.a.createElement(le,{tree:s[e][t]}))})))}),c.a.createElement(h.a,{type:"primary",htmlType:"submit"},"\u4fdd\u5b58"))))},se=function(e){return function(){var t=Y().map(function(e){return{key:e.id.toString(),name:"\ud83d\udef8_".concat(e.alias),url:"/ace/tag/".concat(e.id)}}),a=K().map(function(e){return{key:e.id.toString(),name:"\ud83d\ude80____".concat(e.alias),url:"/ace/group/".concat(e.space_id,"/").concat(e.id)}});e(function(e){var n=e.concat(t).concat(a);return m.a.uniqBy(n,function(e){return e.key})})}},pe=function(e){return c.a.createElement("div",null,"Home")};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a(362);u.a.render(c.a.createElement(function(){var e=Object(r.useState)([{key:"HOME",name:"HOME",url:"/ace"},{key:"SPACE",name:"SPACE",url:"/ace/space"}]),t=Object(o.a)(e,2),a=t[0],n=t[1];return Object(r.useEffect)(function(){se(n)()},[]),c.a.createElement(s.Provider,{value:{menus:a,update:se(n)}},c.a.createElement("div",{style:{height:"100vh",display:"flex",flexDirection:"column"}},c.a.createElement("div",{style:{padding:"8px",boxShadow:"0px 0px 12px #cecece"}},c.a.createElement("h2",null,"\ud83d\ude92 Access Control Evolved")),c.a.createElement("div",{style:{flex:1,display:"flex",padding:"16px"}},c.a.createElement("div",{style:{width:"200px",height:"100vh"}},c.a.createElement(f,null)),c.a.createElement("div",{style:{height:"100vh",width:"100%",padding:"0 8px"}},c.a.createElement(d.b,{basepath:"/ace"},c.a.createElement(pe,{path:"/"}),c.a.createElement(z,{path:"/space"}),c.a.createElement(ae,{path:"/tag/:space_id"}),c.a.createElement(de,{path:"/group/:space_id/:tag_id"}))))))},null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[182,1,2]]]);
//# sourceMappingURL=main.104978c9.chunk.js.map