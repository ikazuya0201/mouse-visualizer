(this["webpackJsonpmouse-visualizer"]=this["webpackJsonpmouse-visualizer"]||[]).push([[0],{326:function(e,t,n){},585:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),i=n(13),o=n.n(i),c=(n(326),n(100)),s=n(41),l=n(104),u=n(6);function d(e){var t=Object(r.useRef)(null),n=function(e){var t=new Set,n=e.split("\n"),r=Math.floor(n.length/2);return n.forEach((function(e,n){for(var a=0;a<e.length;a++)n%2===0?a%4===1&&"-"===e[a]&&t.add(JSON.stringify({x:Math.floor(a/4),y:r-Math.floor(n/2)-1,dir:"up"})):a%4===0&&"|"===e[a]&&t.add(JSON.stringify({x:Math.floor(a/4)-1,y:r-Math.floor(n/2)-1,dir:"right"}))})),[t,r]}(e.mazeString),a=Object(s.a)(n,2),i=a[0],o=a[1],c=50,l=[100,100+o*c],d=555.5555555555555,p=o*c+200,j=o*c+200;Object(r.useEffect)((function(){var n=t.current;if(null!==n){var r=n.getContext("2d");if(null!==r){r.clearRect(0,0,n.width,n.height);if(i.forEach((function(e){return t=JSON.parse(e),r.beginPath(),"up"===t.dir?(r.moveTo(l[0]+t.x*c,l[1]-(t.y+1)*c),r.lineTo(l[0]+(t.x+1)*c,l[1]-(t.y+1)*c),r.stroke()):(r.moveTo(l[0]+(t.x+1)*c,l[1]-t.y*c),r.lineTo(l[0]+(t.x+1)*c,l[1]-(t.y+1)*c),r.stroke()),void r.closePath();var t})),void 0!==e.results){var a=Math.floor(e.value*e.results.length/100);if(a<e.results.length){var s=e.results[a];!function(e,t,n){var a=[-.0185,-.024],i=[.0185,-.024],o=[0,.026],c=[.0185,.006],s=[-.0185,.006],u=Math.cos(n-Math.PI/2),p=Math.sin(n-Math.PI/2),j=[a,i,c,o,s,a],b=function(n){var r=function(e){return[e[0]*u-e[1]*p,e[0]*p+e[1]*u]}(n);return[e+r[0],t+r[1]]},x=function(e){return[l[0]+e[0]*d,l[1]-e[1]*d]};r.beginPath();for(var h=0;h<j.length-1;h++){var m=x(b(j[h])),g=x(b(j[h+1]));r.moveTo(m[0],m[1]),r.lineTo(g[0],g[1])}r.stroke(),r.closePath()}(s.x.x,s.y.x,s.theta.x)}}for(var u=0;u<2*o;u++){var p=25;r.fillText(u.toString(),l[0]+(u+1)*p-5,l[1]+p),r.fillText(u.toString(),l[0]+(u+1)*p-5,l[1]-c*o-p+5),r.fillText(u.toString(),l[0]-p,l[1]-(u+1)*p+5),r.fillText(u.toString(),l[0]+c*o+p-5,l[1]-(u+1)*p+5)}r.save()}}}));return Object(u.jsx)("div",{children:Object(u.jsx)("canvas",{width:p,height:j,style:{border:"1px solid #ddd"},className:"canvas",ref:t,onClick:function(t){var n=t.target.getBoundingClientRect(),r=t.clientX-n.left-l[0],a=l[1]-(t.clientY-n.top),s=Math.floor(r/c),u=Math.floor(a/c),d=r%c,p=a%c,j=[[d,"left"],[c-d,"right"],[p,"bottom"],[c-p,"top"]];j.sort((function(e,t){return e[0]<t[0]?-1:1}));var b=j[0][1],x=function(){switch(b){case"right":return{x:s,y:u,dir:"right"};case"top":return{x:s,y:u,dir:"up"};case"left":return 0===s?void 0:{x:s-1,y:u,dir:"right"};case"bottom":return 0==u?void 0:{x:s,y:u-1,dir:"up"};default:return}}();if(void 0!==x){var h=JSON.stringify(x);i.has(h)?i.delete(h):i.add(h),e.setMazeString(function(e,t){for(var n=[],r=0;r<t;r++){n.push([]);for(var a=0;a<t;a++)n[r].push({up:!1,right:!1})}e.forEach((function(e){var r=JSON.parse(e);r.x<0||r.y<0||r.x>=t||r.y>=t||("up"===r.dir?n[r.x][r.y].up=!0:n[r.x][r.y].right=!0)}));for(var i="",o=0;o<t;o++){for(var c=0;c<t;c++)n[c][t-o-1].up?i+="+---":i+="+   ";i+="+\n|";for(var s=0;s<t;s++)n[s][t-o-1].right?i+="   |":i+="    ";i+="\n"}for(var l=0;l<t;l++)i+="+---";return i+"+"}(i,o))}}})})}var p=n(193),j=n.n(p),b=n(278);function x(){return(x=Object(b.a)(j.a.mark((function e(t){var r,a,i;return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n.e(3).then(n.bind(null,671));case 2:r=e.sent,a=r.Simulator.new(JSON.stringify(t)),i=[];case 5:return e.prev=5,e.next=8,new Promise((function(e,n){setTimeout((function(){var r=[];try{for(var o=0;o<300;o++)r.push(JSON.parse(a.simulate_one_step()));(i=i.concat(r)).length>t.time_limit&&n("time limit exceeded")}catch(c){i=i.concat(r),n(c)}e()}))}));case 8:e.next=14;break;case 10:return e.prev=10,e.t0=e.catch(5),console.log(e.t0),e.abrupt("break",16);case 14:e.next=5;break;case 16:return e.abrupt("return",i);case 17:case"end":return e.stop()}}),e,null,[[5,10]])})))).apply(this,arguments)}var h=n(304),m=n(593),g=n(640),f=n(597),_=n(641),y=n(636),v=n(639),O=n(663),k=n(644),S=n(642),w=n(643),C=n(645),N=n(646),I={config:{start:{x:0,y:0,direction:"North"},return_goal:{x:0,y:0,direction:"South"},goals:[{x:15,y:14,direction:"SouthWest"},{x:15,y:14,direction:"SouthEast"},{x:15,y:16,direction:"NorthWest"},{x:15,y:16,direction:"NorthEast"}],search_initial_route:"Init",search_final_route:"Final",estimator_cut_off_frequency:50,period:.001,translational_kp:1,translational_ki:.05,translational_kd:.01,translational_model_gain:1,translational_model_time_constant:.3694,rotational_kp:1,rotational_ki:.2,rotational_kd:0,rotational_model_gain:10,rotational_model_time_constant:.1499,kx:40,kdx:4,ky:40,kdy:4,valid_control_lower_bound:.1,low_zeta:1,low_b:1,fail_safe_distance:.05,search_velocity:.3,max_velocity:1,max_acceleration:50,max_jerk:100,spin_angular_velocity:3.141592653589793,spin_angular_acceleration:31.41592653589793,spin_angular_jerk:125.66370614359172,run_slalom_velocity:.5},state:{current_node:{x:0,y:0,direction:"North"},robot_state:{x:{x:.045,v:0,a:0,j:0},y:{x:.045,v:0,a:0,j:0},theta:{x:1.5707963267948966,v:0,a:0,j:0}}},maze_string:"+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+\n|                           |   |   |                           |\n+   +---+---+---+   +---+   +---+---+   +---+   +---+---+---+   +\n|   |           |   |                       |   |           |   |\n+   +---+---+   +   +   +---+---+---+---+   +   +   +---+---+   +\n|           |   |   |                       |   |   |           |\n+   +---+   +---+   +---+---+---+---+---+---+   +---+   +---+   +\n|   |   |   |   |           |       |           |   |   |   |   |\n+   +---+   +---+---+---+---+---+---+   +---+   +---+   +---+   +\n|                   |                       |                   |\n+   +---+---+   +   +---+---+   +---+---+---+---+---+---+---+   +\n|   |       |   |   |       |   |   |       |       |           |\n+   +---+   +   +   +   +---+   +---+---+   +   +   +   +---+   +\n|       |   |   |   |   |               |   |   |   |   |       |\n+---+   +   +   +   +---+   +---+---+   +---+   +   +   +   +   +\n|   |   |   |       |   |   |       |   |   |       |   |   |   |\n+   +   +---+   +   +   +   +   +   +   +   +   +   +   +   +   +\n|   |   |       |   |   |   |           |   |   |   |   |   |   |\n+---+   +---+   +   +---+   +---+---+   +---+   +   +   +   +   +\n|       |   |   |   |   |               |   |   |   |   |       |\n+   +---+   +   +   +   +---+---+---+---+   +   +   +   +---+   +\n|   |       |       |           |           |       |           |\n+   +---+---+---+   +---+---+---+---+---+---+---+   +---+---+   +\n|               |                               |               |\n+   +---+---+   +   +---+   +---+---+   +---+   +---+---+---+   +\n|               |                               |   |       |   |\n+   +---+---+   +   +---+---+---+---+---+---+   +---+---+   +   +\n|   |   |   |       |           |           |           |   |   |\n+   +   +---+   +   +   +---+---+---+---+   +   +---+   +   +   +\n|   |   |       |   |   |               |   |           |   |   |\n+   +   +   +---+   +---+   +---+---+   +---+   +---+   +---+   +\n|   |   |                                       |   |           |\n+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+",time_limit:3e5},T=["North","NorthEast","East","SouthEast","South","SouthWest","West","NorthWest"],M={type:"object",title:"Input",properties:{config:{type:"object",properties:{start:{type:"object",properties:{x:{type:"integer"},y:{type:"integer"},direction:{type:"string",enum:T}},required:["x","y","direction"]},return_goal:{type:"object",properties:{x:{type:"integer"},y:{type:"integer"},direction:{type:"string",enum:T}},required:["x","y","direction"]},goals:{type:"array",items:{type:"object",properties:{x:{type:"integer"},y:{type:"integer"},direction:{type:"string",enum:T}},required:["x","y","direction"]}},search_initial_route:{type:"string",enum:["Init"]},search_final_route:{type:"string",enum:["Final"]},estimator_cut_off_frequency:{type:"number"},period:{type:"number"},translational_kp:{type:"number"},translational_ki:{type:"number"},translational_kd:{type:"number"},translational_model_gain:{type:"number"},translational_model_time_constant:{type:"number"},rotational_kp:{type:"number"},rotational_ki:{type:"number"},rotational_kd:{type:"number"},rotational_model_gain:{type:"number"},rotational_model_time_constant:{type:"number"},kx:{type:"number"},kdx:{type:"number"},ky:{type:"number"},kdy:{type:"number"},valid_control_lower_bound:{type:"number"},low_zeta:{type:"number"},low_b:{type:"number"},fail_safe_distance:{type:"number"},search_velocity:{type:"number"},max_velocity:{type:"number"},max_acceleration:{type:"number"},max_jerk:{type:"number"},spin_angular_velocity:{type:"number"},spin_angular_acceleration:{type:"number"},spin_angular_jerk:{type:"number"},run_slalom_velocity:{type:"number"}},required:["start","return_goal","goals","search_initial_route","search_final_route","estimator_cut_off_frequency","period","translational_kp","translational_ki","translational_kd","translational_model_gain","translational_model_time_constant","rotational_kp","rotational_ki","rotational_kd","rotational_model_gain","rotational_model_time_constant","kx","kdx","ky","kdy","valid_control_lower_bound","low_zeta","low_b","fail_safe_distance","search_velocity","max_velocity","max_acceleration","max_jerk","spin_angular_velocity","spin_angular_acceleration","spin_angular_jerk","run_slalom_velocity"]},state:{type:"object",properties:{current_node:{type:"object",properties:{x:{type:"integer"},y:{type:"integer"},direction:{type:"string",enum:T}},required:["x","y","direction"]},robot_state:{type:"object",properties:{x:{type:"object",properties:{x:{type:"number"},v:{type:"integer"},a:{type:"integer"},j:{type:"integer"}},required:["x","v","a","j"]},y:{type:"object",properties:{x:{type:"number"},v:{type:"integer"},a:{type:"integer"},j:{type:"integer"}},required:["x","v","a","j"]},theta:{type:"object",properties:{x:{type:"number"},v:{type:"integer"},a:{type:"integer"},j:{type:"integer"}},required:["x","v","a","j"]}},required:["x","y","theta"]}},required:["current_node","robot_state"]},maze_string:{type:"string"},time_limit:{type:"integer"}},required:["config","state","maze_string","time_limit"]};function z(e){return Object(u.jsx)(O.a,{nodeId:e.id,label:e.label,children:e.children})}function q(e){return Object(u.jsx)("div",{children:e.properties.map((function(e){return e.content}))})}function E(e){return Object(u.jsxs)("div",{children:[e.items&&e.items.map((function(e){return Object(u.jsxs)(y.a,{container:!0,direction:"row",alignItems:"center",children:[Object(u.jsx)(y.a,{item:!0,xs:8,children:e.children}),Object(u.jsx)(y.a,{item:!0,xs:4,children:Object(u.jsx)(v.a,{tabIndex:-1,onClick:e.onDropIndexClick(e.index),children:Object(u.jsx)(S.a,{})})})]},e.key)})),Object(u.jsx)(v.a,{onClick:e.onAddClick,children:Object(u.jsx)(w.a,{})})]})}var W={TextareaWidget:function(e){return Object(u.jsx)(m.a,{defaultValue:e.value,style:{width:"100%"},onChange:function(t){return e.onChange(t.target.value)}})},TextWidget:function(e){return Object(u.jsx)(g.a,{defaultValue:e.value,onChange:function(t){return e.onChange(t.target.value)}})},SelectWidget:function(e){return Object(u.jsx)(f.a,{defaultValue:e.value,onChange:function(t){return e.onChange(t.target.value)},children:e.options.enumOptions.map((function(e,t){var n=e.value,r=e.label;return Object(u.jsx)(_.a,{value:n,children:r},t)}))})}},P={maze_string:{"ui:widget":"textarea"}};function B(e){return Object(u.jsx)(k.a,{defaultCollapseIcon:Object(u.jsx)(C.a,{}),defaultExpandIcon:Object(u.jsx)(N.a,{}),children:Object(u.jsx)(h.a,{schema:M,formData:e.input,uiSchema:P,widgets:W,onSubmit:e.onSubmit,FieldTemplate:z,ObjectFieldTemplate:q,ArrayFieldTemplate:E})})}var F=n(303),J=n.n(F),L=n(4),D=n(647),R=n(661),H=n(22),V=n(648),A=n(649),G=n(650),X=n(652),Y=n(637),K=n(662),Q=n(660),U=n(651),Z=n(653),$=n(654),ee=n(655),te=n(656),ne=n(657),re=n(658),ae=300,ie=Object(D.a)((function(e){return Object(R.a)({root:{display:"flex"},appBar:{transition:e.transitions.create(["margin","width"],{easing:e.transitions.easing.sharp,duration:e.transitions.duration.leavingScreen})},appBarShift:{width:"calc(100% - ".concat(ae,"px)"),marginLeft:ae,transition:e.transitions.create(["margin","width"],{easing:e.transitions.easing.easeOut,duration:e.transitions.duration.enteringScreen})},menuButton:{marginRight:e.spacing(2)},hide:{display:"none"},drawer:{width:ae,flexShrink:0},drawerPaper:{width:ae},drawerHeader:Object(l.a)(Object(l.a)({display:"flex",alignItems:"center",padding:e.spacing(0,1)},e.mixins.toolbar),{},{justifyContent:"flex-end"}),content:{flexGrow:1,padding:e.spacing(3),transition:e.transitions.create("margin",{easing:e.transitions.easing.sharp,duration:e.transitions.duration.leavingScreen}),marginLeft:-300},contentShift:{transition:e.transitions.create("margin",{easing:e.transitions.easing.easeOut,duration:e.transitions.duration.enteringScreen}),marginLeft:0},nested:{paddingLeft:e.spacing(4)}})}));function oe(){var e=ie(),t=Object(H.a)(),n=a.a.useState(!1),i=Object(s.a)(n,2),o=i[0],p=i[1],j=Object(r.useState)(I),b=Object(s.a)(j,2),h=b[0],m=b[1],g=Object(r.useState)(0),f=Object(s.a)(g,2),_=f[0],O=f[1],k=Object(r.useState)(!1),S=Object(s.a)(k,2),w=S[0],C=S[1],T=Object(r.useState)([]),M=Object(s.a)(T,2),z=M[0],q=M[1],E=[.25,.5,.75,1,2,3,4,8],W=Object(r.useState)(3),P=Object(s.a)(W,2),F=P[0],D=P[1],R=Object(r.useState)(!1),ae=Object(s.a)(R,2),oe=ae[0],ce=ae[1];return Object(r.useEffect)((function(){var e=setInterval((function(){w&&z.length>0&&O((function(e){return Math.min(e+100/z.length*50*E[F],100)}))}),50);return function(){return clearInterval(e)}})),Object(u.jsxs)("div",{className:e.root,children:[Object(u.jsx)(V.a,{}),Object(u.jsx)(A.a,{position:"fixed",className:Object(L.a)(e.appBar,Object(c.a)({},e.appBarShift,o)),color:"inherit",children:Object(u.jsxs)(G.a,{children:[Object(u.jsx)(v.a,{color:"inherit","aria-label":"open drawer",onClick:function(){p(!0)},edge:"start",className:Object(L.a)(e.menuButton,o&&e.hide),children:Object(u.jsx)(U.a,{})}),Object(u.jsx)(X.a,{maxWidth:"xs",children:Object(u.jsx)(Y.a,{variant:"h6",noWrap:!0,children:"Micromouse Simulator"})}),Object(u.jsx)(X.a,{maxWidth:"xl",children:Object(u.jsxs)(y.a,{container:!0,spacing:2,children:[Object(u.jsx)(y.a,{item:!0,xs:10,children:Object(u.jsx)(K.a,{value:_,onChange:function(e,t){O(t)}})}),Object(u.jsx)(y.a,{item:!0,xs:2,children:Object(u.jsxs)(Y.a,{variant:"body1",children:["\xd7 ",E[F]]})})]})}),Object(u.jsxs)(X.a,{maxWidth:"xs",children:[Object(u.jsx)(v.a,{onClick:function(){F>0&&D(F-1)},children:Object(u.jsx)(Z.a,{})}),Object(u.jsx)(v.a,{color:"secondary",onClick:function(){return C(!1)},children:Object(u.jsx)($.a,{})}),Object(u.jsx)(v.a,{color:"primary",onClick:function(){return C(!0)},children:Object(u.jsx)(ee.a,{})}),Object(u.jsx)(v.a,{onClick:function(){F+1<E.length&&D(F+1)},children:Object(u.jsx)(te.a,{})}),Object(u.jsx)(v.a,{onClick:function(){O(0)},children:Object(u.jsx)(ne.a,{})})]})]})}),Object(u.jsxs)(Q.a,{className:e.drawer,variant:"persistent",anchor:"left",open:o,classes:{paper:e.drawerPaper},children:[Object(u.jsx)("div",{className:e.drawerHeader,children:Object(u.jsx)(v.a,{onClick:function(){p(!1)},children:"ltr"===t.direction?Object(u.jsx)(re.a,{}):Object(u.jsx)(N.a,{})})}),Object(u.jsx)(B,{input:h,onSubmit:function(e){ce(!0),m(e.formData),function(e){return x.apply(this,arguments)}(e.formData).then((function(e){q(e),O(0),ce(!1)})).catch((function(e){ce(!1),console.log(e)}))}})]}),Object(u.jsxs)("main",{className:Object(L.a)(e.content,Object(c.a)({},e.contentShift,o)),children:[Object(u.jsx)("div",{className:e.drawerHeader}),Object(u.jsx)(y.a,{container:!0,alignItems:"center",justify:"center",children:Object(u.jsxs)(y.a,{item:!0,xs:8,children:[Object(u.jsx)(J.a,{loaded:!oe,zIndex:1600}),Object(u.jsx)(d,{mazeString:h.maze_string,setMazeString:function(e){m(Object(l.a)(Object(l.a)({},h),{},{maze_string:e}))},results:z,value:_})]})})]})]})}var ce=function(e){e&&e instanceof Function&&n.e(4).then(n.bind(null,672)).then((function(t){var n=t.getCLS,r=t.getFID,a=t.getFCP,i=t.getLCP,o=t.getTTFB;n(e),r(e),a(e),i(e),o(e)}))};o.a.render(Object(u.jsx)(a.a.StrictMode,{children:Object(u.jsx)(oe,{})}),document.getElementById("root")),ce()}},[[585,1,2]]]);
//# sourceMappingURL=main.f5ee3051.chunk.js.map