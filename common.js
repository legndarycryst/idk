
/*
This script is used in most pages of this website
*/

const {floor, ceil, abs, round} = Math

var script = document.createElement("script")
script.src = "//cdn.jsdelivr.net/npm/sweetalert2@11"
document.body.appendChild(script)

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const publicVapidKey = 'BC97-wjdng136e_0JIJV3CHzcPKzfJsaCMscJrkoB1GMuyOJY8AvJg70WmGY5io5mPUEaBEbHrizKUvqqFagd5g';

async function subscribe() {
  if(!swRegister) return Swal.fire({
    title:"Wait!",
    text: 'Please wait for service worker to register.',
    icon: 'error',
  })
  if(subscription) return Swal.fire({
    title:"Wait!",
    text: 'You already subscribed.',
    icon: 'error',
  })
  subscription = await swRegister.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  })
  await fetch('/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
async function sameSubscribe(){
  if(!subscription) return console.error("no subscription")
  await fetch('/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

let swRegister, subscription
if(navigator.serviceWorker) navigator.serviceWorker.register('/sw.js', {
  scope: '/'
}).then(r => {
  swRegister = r
  windowLoadedForPush++
  mentionNotifications()
})

var script = document.createElement("script")
script.src = "/assets/localforage.js"
document.body.appendChild(script)

let windowLoadedForPush = 0, localforageScript = script
localforageScript.addEventListener("load", function(){
  windowLoadedForPush++
  mentionNotifications()
});
async function mentionNotifications(){
  if(windowLoadedForPush !== 2) return console.log("not mention notifs "+windowLoadedForPush)
  console.log("mention notifs")
  if(await localforage.getItem("noNotifs")) return
  if (await localforage.getItem("notifs")) {
    subscription = await swRegister.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    })
  }else{
    Swal.fire({
      title:"Notifcations!",
      text:"Please consider allowing notifications, so that we can alert you of new maps, and even chat features in the future!",
      toast: true,
      denyButtonText:"No thank you!",
      confirmButtonText:"Yes please!",
      showConfirmButton:true,
      showDenyButton:true,
      position: 'top-right',
    }).then(async result => {
      if (result.isConfirmed) {
        await localforage.setItem("notifs", "true")
        await subscribe()
        Swal.fire({
          title:"Notifcations!",
          text: 'Thank you for enabling notifications!' ,
          icon: 'success',
        })
      }else if(result.isDenied){
        await localforage.setItem("noNotifs", "true")
        Swal.fire({
          title:"Notifcations!",
          text: "Ok! We respect your privacy, so we will not ask again",
          icon: 'error',
        })
      }
    })
  }  
}


//====================NAVBAR===============
var navbar = document.createElement("div");
navbar.setAttribute("class", "navbar");

navbar.innerHTML = `
  <a class="logo" href="/"><!--<img src="/minekhan/assets/images/minekhan.png" height="15px">-->thingmaker.us.eu.org</a>
  <div class="search-container">
    <form action="/search">
      <input type="text" placeholder="Search..." name="q">
<button type="submit">ðŸ”Ž</button>
    </form>
  </div>

  <a href="/posts" nav="posts">Posts</a>
  <a href="/minekhan">MineKhan</a>
  <a href="/maps/browse">Maps</a>
  <div class="dropdown">
    <a class="dropdown-name">Upload</a>
    <div class="dropdown-content">
      <a href="/maps/new">Upload Map</a>
      <a href="/maps/newrp">Upload Resource Pack</a>
    </div>
  </div>
  <a href="/wiki">Wiki</a>

  <span id="adminNav"></span>

  <a class="right" id="loggedIn" href="/login">Log in</a>
  <div class="dropdown" id="usernameDropdown" style="display:none; float:right;">
    <a class="dropdown-name"></a>
    <div class="dropdown-content">
      <a href="/account">Account</a>
      <a id="usernameDropdown-profile">Profile</a>
    </div>
  </div>
  <a class="right" id="notifs" href="/notifs">Notifications</a>
`
document.body.prepend(navbar)

var style=document.createElement("style")
style.innerHTML = `
.navbar{
  background:var(--black);
  /*height:47px;*/
  position:sticky;
  top:0;
  z-index:10;
}
.navbar:after{
  content:"";
  display:block;
  clear:both;
}
body[theme=dark] .navbar{
  background:#444;
}
.navbar a{
  float: left;
  display: block;
  color: white;
  text-align: center;
  padding: 14px 20px;
  text-decoration: none;
  cursor:pointer;
}
body[theme=dark] .navbar a{
  color:white;
}
/* Right-aligned link */
.navbar .right {
  float: right;
}
.navbar .logo{
  background:var(--theme);
}
.navbar .search-container{
  /*padding: 6px 10px;
  margin:8px 20px;*/
  padding:4px;
  float:left;
  display:inline-block;
}
/* Change color on hover */
.navbar a:hover {
  background-color: #ddd;
  color: black;
}
body[theme=dark] .navbar a:hover{
  background:#111;
}
.navbar .dropdown{
  display:inline-block;
  background:inherit;
}
.navbar .dropdown > a{
  display:block;
}
.navbar .dropdown .dropdown-name{
  
}
.navbar .dropdown .dropdown-content{
  display:none;
  position:absolute;
  z-index:1;
  background:inherit;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
}
.navbar .dropdown .dropdown-content a{
  display:block;
  width:100%;
  float:none;
}
.navbar .dropdown:hover .dropdown-content{
  display:block;
}
`
document.head.appendChild(style)

//================LOGGEDIN==============
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function loggedIn(){
  /*return fetch("/server/account", {
    credentials: 'include',
  })*/
  return{then:()=>({then:r=>{r({"type":"account","pid":1649676967674,"username":"shubbleYT","password":"$2b$10$rgdHY3FkCC.3aYFmnUnJyeQZ0gB9FjqhDV/lluLd4WubZVQ3QXsAa","email":"mypetpigslokiandthor@gmail.com","pfp":"https://yt3.googleusercontent.com/5aHr6tAuhcmBIK1yDJ-na9IUyguG3QbwoclFu5eT-JBE8s5h3APQjyzl3G2SO_ht_dpd3-kSmw=s176-c-k-c0x00ffffff-no-rj","timestamp":1649676969060,"ip":["96.4.112.49","24.158.114.75","96.4.112.48","34.105.111.97","64.44.148.248","209.127.116.148","34.148.40.158","172.93.151.180","174.239.51.40","174.212.167.23","174.239.55.14","96.38.120.127","47.13.5.179","96.38.96.141","174.212.164.220","96.38.120.145","96.38.121.23","174.212.171.197","47.13.4.238","96.38.122.108","96.38.121.62","96.4.112.39","174.239.52.76","47.13.4.82"],"skin":"data:image/png;base64,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","bg":"https://yt3.ggpht.com/qaNjh0fI3OqbX-iYfCoi7dtAaSX8sGy5gQPR8bL1bKG9mHVpLj_58KdkgohU9EbXIPU9mofc=w1060-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj","bio":"","notifs":[{"notif":"Fire_Fox commented at \<a href='/website/post.html?id=1652454161796#comment1652461515828'\>multiplayer is not working\</a\>","id":1652461515828,"read":true},{"notif":"2-people deleted your post: script","id":1652476327275,"read":true},{"notif":"Intel_Edits_ commented at \<a href='/website/post.html?id=1652454161796#comment1652481271727'\>multiplayer is not working\</a\>","id":1652481271733,"read":true},{"notif":"Fire_Fox commented at \<a href='/website/post.html?id=1652454161796#comment1652486364666'\>multiplayer is not working\</a\>","id":1652486364669,"read":true},{"notif":"sup6666 commented at \<a href='/website/post.html?id=1652454161796#comment1653511299016'\>multiplayer is not working\</a\>","id":1653511299017,"read":true},{"notif":"TEXAN7 commented at \<a href='/website/post.html?id=1654198920488#comment1654216866970'\>HAHA Google\</a\>","id":1654216867006,"read":true},{"notif":"sup6666 commented at \<a href='/website/post.html?id=1654198920488#comment1654291647981'\>HAHA Google\</a\>","id":1654291647982,"read":true},{"notif":"Fire_Fox commented at \<a href='/website/post.html?id=1654198920488#comment1654380790083'\>HAHA Google\</a\>","id":1654380790083,"read":true},{"notif":"Fire_Fox commented at \<a href='/website/post.html?id=1654198920488#comment1654380885278'\>HAHA Google\</a\>","id":1654380885279,"read":true},{"notif":"TEXAN7 commented at \<a href='/website/post.html?id=1654198920488#comment1654384508397'\>HAHA Google\</a\>","id":1654384508398,"read":true},{"notif":"TEXAN7 commented at \<a href='/website/post.html?id=1654617576274#comment1654631873487'\>help\</a\>","id":1654631873490,"read":true},{"notif":"Am_Butter commented at \<a href='/website/post.html?id=1654617576274#comment1654634822667'\>help\</a\>","id":1654634822667,"read":true},{"notif":"Am_Butter commented at \<a href='/website/post.html?id=1654617576274#comment1654634877266'\>help\</a\>","id":1654634877266,"read":true},{"notif":"NotaGuy commented at \<a href='/website/post.html?id=1652454161796#comment1654962305864'\>multiplayer is not working\</a\>","id":1654962305866,"read":true},{"notif":"2-people deleted your post: redstone comparator","id":1661810034406,"read":true},{"notif":"2-people deleted your post: redstone comparator","id":1661810045951,"read":true},{"notif":"2-people deleted your post: redstone comparator","id":1661810061115,"read":true},{"notif":"2-people deleted your post: help","id":"1662524079634714391","read":true},{"notif":"2-people deleted your post: redstone comparator","id":"1662525014670460766","read":true},{"notif":"2-people deleted your post: `title`","id":"1662525109332815904","read":true},{"notif":"2-people commented at \<a href='/website/post.html?id=1663336172646403731#comment1663362424225633068'\>what is this\</a\>","id":"1663362424499663881","read":true},{"notif":"2-people deleted your post: add Ender chest's to minekhan","id":"1664229066725881207","read":true},{"notif":"LordPython404 commented at \<a href='/website/post.html?id=1664210899944843559#comment1664492464868706995'\>add Ender chest's to minekhan\</a\>","id":"1664492465347979931","read":true},{"notif":"LordPython404 commented at \<a href='/website/post.html?id=1664210899944843559#comment1664492467844818715'\>add Ender chest's to minekhan\</a\>","id":"1664492468138527604","read":true},{"notif":"2-people commented at \<a href='/website/post.html?id=1664978492851121780#comment1665007117316861130'\>add coral\</a\>","id":"1665007117468113772","read":true},{"notif":"Austin007 commented at \<a href='/website/post.html?id=1664244618471944898#comment1665120521010276047'\>Someone is going to hack MineKhan\</a\>","id":"1665120521174227110","read":true},{"notif":"2-people deleted your post: nocom.","id":"1665373923000240347","read":true},{"notif":"2-people deleted your post: what is this","id":"166537418794957342","read":true},{"notif":"Notch commented at \<a href='/post?id=1666969151729921884#comment1667220456705192392'\>@2-people how do you become admin?\</a\>","id":"1667220456798838621","read":true},{"notif":"Notch deleted your post: @2-people and @2-people-2 STOP deleting my posts ","id":"166722047077921041","read":true},{"notif":"Notch commented at \<a href='/post?id=1666969151729921884#comment166741028610829345'\>@2-people how do you become admin?\</a\>","id":"1667410286208268242","read":true},{"notif":"Notch commented at \<a href='/post?id=1667564522383924194#comment1667622998886605013'\>@2-people why does this happen any time i fork it?\</a\>","id":"1667622999027395123","read":true},{"notif":"2-people commented at \<a href='/post?id=1667564522383924194#comment1667664907163133487'\>@2-people why does this happen any time i fork it?\</a\>","id":"1667664907243739865","read":true},{"notif":"2-people commented at \<a href='/post?id=1667836578503475434#comment1667858694624419914'\>@2-people why is this happening\</a\>","id":"1667858694734687544","read":true},{"notif":"Notch commented at \<a href='/post?id=1668096739319980307#comment1668216726499686458'\>well this sucks\</a\>","id":"166821672663588429","read":true},{"notif":"angelolw commented at \<a href='/post?id=1668096739319980307#comment166846375119087427'\>well this sucks\</a\>","id":"1668463751843350601","read":true},{"notif":"angelolw commented at \<a href='/post?id=1668096739319980307#comment166846375360370807'\>well this sucks\</a\>","id":"1668463753897570849","read":true},{"notif":"idk68 commented at \<a href='/post?id=1666872289060117093#comment1670181174288508631'\>plz add this\</a\>","id":"1670181174462638136","read":true},{"notif":"I commented at \<a href='/post?id=1666872289060117093#comment1670697783943238194'\>plz add this\</a\>","id":"16706977841653750","read":true},{"notif":"Light_FN commented at \<a href='/post?id=1666792466543539464#comment1673286672720746261'\>what happend to the minekhan block maker @2-people ?\</a\>","id":"1673286672890599251","read":true},{"notif":"Light_FN commented at \<a href='/post?id=1666792466543539464#comment1673286694736682375'\>what happend to the minekhan block maker @2-people ?\</a\>","id":"1673286695052459739","read":true},{"notif":"2-people commented at \<a href='/post?id=1666792466543539464#comment1673287080242733261'\>what happend to the minekhan block maker @2-people ?\</a\>","id":"1673287080568105394","read":true},{"notif":"I commented at \<a href='/post?id=1680696971557463773#comment168107100617498655'\>redstone bug\</a\>","id":"1681071006230700590","read":true},{"notif":"2-people deleted your post: /setblock command broken","id":"1681099913202464549","read":true},{"notif":"TomMustBe12 commented at \<a href='/post?id=1681142175677687094#comment1681142459516350541'\>TomMustBe12 is back :(\</a\>","id":"1681142459557348323","read":true},{"notif":"TomMustBe12 commented at \<a href='/post?id=1681142175677687094#comment1681142496380724971'\>TomMustBe12 is back :(\</a\>","id":"1681142496427635516","read":true},{"notif":"I commented at \<a href='/post?id=1681127089510963387#comment168124424147562638'\>lol\</a\>","id":"1681244241606483915","read":true},{"notif":"I commented at \<a href='/post?id=1681131692359263040#comment1681244278236664491'\>water it the nether\</a\>","id":"1681244278337446072","read":true},{"notif":"I commented at \<a href='/post?id=1681142175677687094#comment1681244472650581615'\>TomMustBe12 is back :(\</a\>","id":"1681244479382806580","read":true},{"notif":"I commented at \<a href='/post?id=1681212516457547383#comment1681244507889960498'\>-_-\</a\>","id":"1681244509409578792","read":true},{"notif":"2-people deleted your post: minekhan but its a post","id":"1681252352544367769","read":true},{"notif":"2-people deleted your post: -_-","id":"1681252427807134579","read":true},{"notif":"2-people deleted your post: lol","id":"168125244334349902","read":true},{"notif":"sadlyitsnotme commented at \<a href='/post?id=1681142175677687094#comment1681325012245555781'\>TomMustBe12 is back :(\</a\>","id":"1681325012319426823","read":true},{"notif":"2-people deleted your post: WHY IS THE TIMER BACK","id":"1681358864960689468","read":true},{"notif":"2-people commented at \<a href='/post?id=1681407001578172150#comment1681425126046331388'\>What is the current host site for minekhan?\</a\>","id":"1681425126092840146","read":true},{"notif":"I commented at \<a href='/post?id=1681407001578172150#comment1681433147427119153'\>What is the current host site for minekhan?\</a\>","id":"1681433147483549208","read":true},{"notif":"I commented at \<a href='/post?id=1681389999879738100#comment1681433357783947333'\>add end_portal_open sound\</a\>","id":"1681433357843604598","read":true},{"notif":"2-people deleted your post: What is the current host site for minekhan?","id":"1681506346409485301","read":true},{"notif":"I commented at \<a href='/post?id=1681738596902817012#comment1681768981166454959'\>timeLoop()\</a\>","id":"1681768981213933268","read":true},{"notif":"I commented at \<a href='/post?id=1681484241015939905#comment1681768999334316341'\>minekhan is not on https://web.archive.org???\</a\>","id":"1681768999403486816","read":true},{"notif":"I commented at \<a href='/post?id=1681481994682622333#comment1681769017689697185'\>I made a new Mod for minekhan\</a\>","id":"1681769017747646984","read":true},{"notif":"Average_Man commented at \<a href='/post?id=1682003111701461996#comment1682090044914792053'\>GUYS I FOUND THE CODE FOR THE TIMER\</a\>","id":"1682090044972191417","read":true},{"notif":"2-people deleted your post: file","id":"1682111840878972741","read":true},{"notif":"sergsssggssf commented at \<a href='/post?id=1681484241015939905#comment1682351733347394706'\>minekhan is not on https://web.archive.org???\</a\>","id":"1682351733395946464","read":true},{"notif":"sergsssggssf commented at \<a href='/post?id=1682003111701461996#comment1682351788515979908'\>GUYS I FOUND THE CODE FOR THE TIMER\</a\>","id":"1682351788572497204","read":true},{"notif":"TheWardimond2 commented at \<a href='/post?id=1682085788550166187#comment1682452606098255620'\>how???\</a\>","id":"1682452606154520735","read":true},{"notif":"ameliagamer commented on \<a href='/user?user=shubbleYT#comment1682603464584989234'\>your profile\</a\>","id":"1682603464584464027","read":true},{"notif":"2-people deleted your post: how???","id":"lh1309emeb0k","read":true},{"notif":"2-people deleted your post: GUYS I FOUND THE CODE FOR THE TIMER","id":"lh130rphbwmp","read":true},{"notif":"2-people commented at \<a href='/post?id=lh0kpmorfv1f#commentlh136tl5kxms'\>piston bug\</a\>","id":"lh136tns7zni","read":true},{"notif":"I commented at \<a href='/post?id=lh0kpmorfv1f#commentlh3pcvqm2h56'\>piston bug\</a\>","id":"lh3pcvs6b7sq","read":true},{"notif":"I commented at \<a href='/post?id=lh0og5oi19cl#commentlh3pdkoz6xrc'\>what is this???? @2-people\</a\>","id":"lh3pdkredetd","read":true},{"notif":"I commented at \<a href='/post?id=lh0og5oi19cl#commentlh3pfxc73aa5'\>what is this???? @2-people\</a\>","id":"lh3pfxecndw","read":true},{"notif":"I commented at \<a href='/post?id=1681481994682622333#commentlh3phx253l9r'\>I made a new Mod for minekhan\</a\>","id":"lh3phx4f2098","read":true},{"notif":"I commented at \<a href='/post?id=1681484241015939905#commentlh3pk1xwiw5i'\>minekhan is not on https://web.archive.org???\</a\>","id":"lh3pk1zi7dxf","read":true},{"notif":"2-people deleted your post: @2-people why","id":"lh3q6p622iqw","read":true},{"notif":"2-people commented at \<a href='/post?id=lh50jzcp9n9h#commentlh5dllru3ep7'\>@2-people add this \</a\>","id":"lh5dllttl7au","read":true},{"notif":"2-people deleted your post: update list","id":"lh6v08a5l96r","read":true},{"notif":"2-people deleted your post: piston bug","id":"lh6v0qswk2r4","read":true},{"notif":"2-people commented at \<a href='/post?id=lh6c5lyxfr7n#commentlh6x3jc7iw5m'\>i found a new piston bug\</a\>","id":"lh6x3jezcfuo","read":true},{"notif":"I commented at \<a href='/post?id=lh92sh9xmo8#commentlhmcsog58uij'\>help \</a\>","id":"lhmcsoiphzp8","read":true},{"notif":"I commented at \<a href='/post?id=lhaiqg5w65i6#commentlhmctf0e916y'\>add this little bit of code to minekhan\</a\>","id":"lhmctf3047fy","read":true},{"notif":"I commented at \<a href='/post?id=lhexoawtbgto#commentlhmcyk1q8lr3'\>can admin's edit our posts?\</a\>","id":"lhmcyk3ogt55","read":true},{"notif":"I commented at \<a href='/post?id=lhexoawtbgto#commentlhmczoxi1v1o'\>can admin's edit our posts?\</a\>","id":"lhmczoz4gvu2","read":true},{"notif":"I commented at \<a href='/post?id=lhexoawtbgto#commentlhmd0c8y8dst'\>can admin's edit our posts?\</a\>","id":"lhmd0cdlkfcr","read":true},{"notif":"I commented at \<a href='/post?id=lhgc3cw4i5be#commentlhmd27k5d8ga'\>we need this\</a\>","id":"lhmd27mvk8bs","read":true},{"notif":"2-people commented at \<a href='/post?id=lhgc3cw4i5be#commentlhme423q84dz'\>we need this\</a\>","id":"lhme425ii1q1","read":true},{"notif":"2-people deleted your post: add this little bit of code to minekhan","id":"li0xfqtikcof","read":true},{"notif":"Notch commented at \<a href='/post?id=lhexoawtbgto#commentli17kiimbg2n'\>can admin's edit our posts?\</a\>","id":"li17kik71xii","read":true},{"notif":"2-people commented at \<a href='/post?id=li554vpwilcm#commentli55c4oqf46q'\>about the first post\</a\>","id":"li55c4qe5f5f","read":true},{"notif":"TomMustBe12 commented at \<a href='/post?id=li554vpwilcm#commentli6dg3r927fo'\>about the first post\</a\>","id":"li6dg3trgou","read":true},{"notif":"TomMustBe12 commented at \<a href='/post?id=li6uehzk5udu#commentli6v8e696ygk'\>I know how to help Minekhan grow again in popularity\</a\>","id":"li6v8e7vel16","read":true},{"notif":"TomMustBe12 deleted your post: I know how to help Minekhan grow again in popularity","id":"li6v8kopcy6t","read":true},{"notif":"2-people commented at \<a href='/post?id=li6tqf0dg5y2#commentli6y8dej52x8'\>Umm\</a\>","id":"li6y8dg4gc8t","read":true},{"notif":"2-people deleted your post: Umm","id":"li7nd6671bcp","read":true},{"notif":"2-people commented at \<a href='/post?id=li7n8r9ob3e8#commentli7ndk4a1347'\>I can't chat from mobile \</a\>","id":"li7ndk6gk8bv","read":true},{"notif":"2-people commented at \<a href='/post?id=li7n8r9ob3e8#commentli7okrh031qo'\>I can't chat from mobile \</a\>","id":"li7okrieaqz4","read":true},{"notif":"2-people commented at \<a href='/post?id=li8b796mesgx#commentli8c1ocokwus'\>@TomMustBe12 it worked on 2-people\</a\>","id":"li8c1oev335w","read":true},{"notif":"2-people commented at \<a href='/post?id=li96fi1qkw1y#commentli98ewg060xq'\>how to add a user as admin?\</a\>","id":"li98ewhhkbj","read":true},{"notif":"2-people deleted your post: I saw this in the minekhan log","id":"li9gd1jt67h","read":true},{"notif":"2-people deleted your post: help ","id":"li9gdgowa35k","read":true},{"notif":"2-people commented at Add this","id":"lieu57fhh9kd","actions":[{"action":"open:/post?id=liesndu9mil#commentlieu57de1sqm","title":"Open"}],"read":true},{"notif":"ThatLemonGamer commented at ðŸŒˆHappy Pride month ðŸŒˆ","id":"lifa9tq5hexh","actions":[{"action":"open:/post?id=lieind5oda97#commentlifa9tn9dt96","title":"Open"}],"read":true},{"notif":"netherBuilder commented on your profile","id":"lii42ef58adq","actions":[{"action":"open:/user?user=shubbleYT#commentlii42ef5j8i8","title":"Open"}],"read":true},{"notif":"2-people deleted your post: @2-people why is this happening","id":"lijd8ipver6k","read":true},{"notif":"2-people deleted your post: I can't chat from mobile ","id":"lilxe95l6cf8","read":true},{"notif":"Spammer17 commented at I think I have more posts here than anyone ","id":"limcbcly8pmw","actions":[{"action":"open:/post?id=lil3nd7sh2og#commentlimcbck67emq","title":"Open"}],"read":true},{"notif":"Spammer17 commented at ðŸŒˆHappy Pride month ðŸŒˆ","id":"limcd3z81evp","actions":[{"action":"open:/post?id=lieind5oda97#commentlimcd3xgkxcf","title":"Open"}],"read":true},{"notif":"7SevemS7 commented at you might want to fix this","id":"liw4m7sj9mf8","actions":[{"action":"open:/post?id=liuw41z552h1#commentliw4m7r44tyx","title":"Open"}],"read":true},{"notif":"I commented at ðŸŒˆHappy Pride month ðŸŒˆ","id":"ljbw03s6abzt","actions":[{"action":"open:/post?id=lieind5oda97#commentljbw03pgfxp9","title":"Open"}],"read":true},{"notif":"I commented at Can any one help me with this?","id":"ljbw1xv7dpd6","actions":[{"action":"open:/post?id=lif1nkj4crco#commentljbw1xsscdp4","title":"Open"}],"read":true},{"notif":"I mentioned you at I think I have more posts here than anyone ","id":"ljbw2qi3gl8q","actions":[{"action":"open:/post?id=lil3nd7sh2og#commentljbw2qflhvqp","title":"Open"}],"read":true},{"notif":"I commented at you might want to fix this","id":"ljbw9bpqf8w9","actions":[{"action":"open:/post?id=liuw41z552h1#commentljbw9bof159p","title":"Open"}],"read":true},{"notif":"I commented at Can any one help me with this?","id":"ljbwdupq78qd","actions":[{"action":"open:/post?id=lif1nkj4crco#commentljbwdunm29cd","title":"Open"}],"read":true},{"notif":"I commented at Can any one help me with this?","id":"ljbwe8jy78va","actions":[{"action":"open:/post?id=lif1nkj4crco#commentljbwe8hqbbah","title":"Open"}],"read":true},{"notif":"2-people deleted your post: you might want to fix this","id":"ljf2iw9c8svs","read":true},{"notif":"2-people commented at question","id":"ljq9fm2geo7g","actions":[{"action":"open:/post?id=ljq99tlm7g29#commentljq9fm0pf82c","title":"Open"}],"read":true},{"notif":"2-people deleted your post: what is this???? @2-people","id":"ljrnxe1u5eu4","read":true},{"notif":"Notch commented at About the code for admin","id":"ljzofxjb4cix","actions":[{"action":"open:/post?id=ljqupl34gzjo#commentljzofxhnbk33","title":"Open"}],"read":true},{"notif":"Notch commented at question","id":"ljzoh4yhk0gf","actions":[{"action":"open:/post?id=ljq99tlm7g29#commentljzoh4wf7bg0","title":"Open"}],"read":true},{"notif":"gouling mentioned you at How do you get the Ender dragon's spawn egg?","id":"lk0l4zbh768i","actions":[{"action":"open:/post?id=ljtgkv3ld6ub#commentlk0l4z9q33z6","title":"Open"}],"read":true},{"notif":"gouling commented at who thinks there should be a discord server for minekan","id":"lk9rsi3ggpqk","actions":[{"action":"open:/post?id=lk9c403ohsgk#commentlk9rshzb98ym","title":"Open"}],"read":true},{"notif":"Loco commented at who thinks there should be a discord server for minekan","id":"lkcorcryfv0s","actions":[{"action":"open:/post?id=lk9c403ohsgk#commentlkcorcq93q24","title":"Open"}],"read":true},{"notif":"Sami-Lask commented at who thinks there should be a discord server for minekan","id":"lkd6eut254uc","actions":[{"action":"open:/post?id=lk9c403ohsgk#commentlkd6eurbdzkp","title":"Open"}],"read":true},{"notif":"gouling mentioned you at How do you get the Ender dragon's spawn egg?","id":"lkm6rxwo7402","actions":[{"action":"open:/post?id=ljtgkv3ld6ub#commentlkm6rxuj3e2q","title":"Open"}],"read":true},{"notif":"gouling mentioned you at A strange terrain","id":"lleagosvhouy","actions":[{"action":"open:/post?id=lldbuarsec1f#commentlleagom8ab32","title":"Open"}],"read":true},{"notif":"Valve commented at Post fix (idea)","id":"llfnd02g9wbu","actions":[{"action":"open:/post?id=ll3ztm5kgj8#commentllfnczzc5pl","title":"Open"}],"read":true},{"notif":"Valve commented on your profile","id":"llfosvgtjlz7","actions":[{"action":"open:/user?user=shubbleYT#commentllfosvgt5ur0","title":"Open"}],"read":true},{"notif":"Valve commented on your profile","id":"llfov18paw7k","actions":[{"action":"open:/user?user=shubbleYT#commentllfov18p23v4","title":"Open"}],"read":true},{"notif":"Valve commented at ðŸŒˆHappy Pride month ðŸŒˆ","id":"llfq37s0iwyj","actions":[{"action":"open:/post?id=lieind5oda97#commentllfq37q9hro1","title":"Open"}],"read":true},{"notif":"Valve commented at ðŸŒˆHappy Pride month ðŸŒˆ","id":"llfq4f6i82zu","actions":[{"action":"open:/post?id=lieind5oda97#commentllfq4f4e60fw","title":"Open"}],"read":true},{"notif":"Valve commented at how is this not get muted or  banned","id":"llgzoqbthx00","actions":[{"action":"open:/post?id=llgr101ml7j1#commentllgzoq9ul07j","title":"Open"}],"read":true},{"notif":"Valve commented on your profile","id":"llh79hkdcagp","actions":[{"action":"open:/user?user=shubbleYT#commentllh79hkd1uf2","title":"Open"}],"read":true},{"notif":"Sami-Lask commented at how is this not get muted or  banned","id":"llhazpc479um","actions":[{"action":"open:/post?id=llgr101ml7j1#commentllhazpa3367d","title":"Open"}],"read":true},{"notif":"gouling commented at ðŸŒˆHappy Pride month ðŸŒˆ","id":"llkxbiihhrvg","actions":[{"action":"open:/post?id=lieind5oda97#commentllkxbig88fjo","title":"Open"}],"read":true},{"notif":"GhOsT commented at how is this not get muted or  banned","id":"llwnw9uo5ox3","actions":[{"action":"open:/post?id=llgr101ml7j1#commentllwnw9spldau","title":"Open"}],"read":true},{"notif":"GhOsT commented at how is this not get muted or  banned","id":"llwnw9v29w6t","actions":[{"action":"open:/post?id=llgr101ml7j1#commentllwnw9v2jeb2","title":"Open"}],"read":true}],"lastActive":1693930323139,"votes":{"shubbleYT":1,"gouling":1,"Itss_Edison":1,"netherBuilder":-1,"TomMustBe12":-1,"Loco":1,"Valve":1},"comments":[{"username":"ameliagamer","comment":"hi do you have a discord?\n\n","id":"1682603464584989234","timestamp":1682603464584},{"username":"shubbleYT","comment":"@ameliagamer yes i do :)","id":"168260874349154868","timestamp":1682608743491},{"username":"shubbleYT","comment":"@ameliagamer here is the link to my discord server :) \<a href='https://discord.gg/483D9Y4MKF'\>EmpiresSmp0 discord\</a\>","id":"1682609113944295707","timestamp":1682609113944},{"username":"netherBuilder","comment":"you are not \"shubbleYT\"","id":"lii42ef5j8i8","timestamp":1685924749697},{"username":"shubbleYT","comment":"@netherBuilder and?","id":"liiz9f73ds1m","timestamp":1685977145391},{"username":"Valve","comment":"yo, hey shubble. whats your discord?","id":"llfosvgt5ur0","timestamp":1692308525645},{"username":"Valve","comment":"i wanna add u :D","id":"llfov18p23v4","timestamp":1692308626441},{"username":"shubbleYT","comment":"@Valve my discord user name is legndarycryst4","id":"llgqq4zsw6a","timestamp":1692372223432},{"username":"Valve","comment":"im glad to have a friend who's not offline, i added my friend, but hes never online.","id":"llh79hkd1uf2","timestamp":1692400000045}],"subscriptions":[{"endpoint":"https://fcm.googleapis.com/fcm/send/eWW8N4JMR2A:APA91bF6GR-aBqlKOVcsMDsoAQBFaNIAOHPqlFH5bLpFZ0v_arCa-fU7vWVw5clSTlczmleKcL5W58t9BjhI0hpeFe4DD975ceu1_PVzpEJS-X8xf4TRlwaOnhrBWnJwvkYxNJsm2H0r","expirationTime":null,"keys":{"p256dh":"BFyjiiSJcvB8-sMXDRx11BldZD2fFlzDhAFQ41tgR_O6oDxqgOHwD005eJtzJ0JDTC0FlaP37Tz5644K5YZu_TM","auth":"yEUiGBw-D80w7LKxS79l7A"}}],"profanityFilter":true});return{catch:()=>{}}}})}
}
function findUnread(n){
  var a = 0
  for(var i=0; i<n.length; i++){
    if(!n[i].read) a++
  }
  if(a > 0) return a
}
function addBanner(text, bg = "white", color = "black"){
  var div = document.createElement("div")
  div.style.padding = "10px"
  div.style.background = bg
  div.style.color = color
  div.style.borderBottom = "1px solid black"
  div.style.boxShadow = "0px 0px 15px 3px black"
  div.innerHTML = text
  document.body.prepend(div)
}

let userInfo
var el = document.getElementById("loggedIn")
var notifs = document.getElementById("notifs")
notifs.style.display = "none"
loggedIn().then(data => data.json()).then(r => {
  userInfo = r
  var logged = r && r.username
  if(el && logged){
    var usernameEl = document.querySelector("#usernameDropdown .dropdown-name")
    if(usernameEl){
      el.style.display = "none"
      document.getElementById("usernameDropdown").style.display = "block"
      usernameEl.innerHTML = logged
      usernameEl.href = "/account"
      document.querySelector("#usernameDropdown-profile").href="/user?user="+escape(logged)
    }else{
      el.innerHTML = logged
      el.href = "/account"
    }
    notifs.style.display = ""
    if(r.notifs){
      var amount = findUnread(r.notifs)
      notifs.innerHTML += amount ? (" ("+amount+")") : ""
    }
    if(r.admin){
      document.querySelector("#adminNav").innerHTML = `
<a href="/admin/users.html">Users</a>
<a href="/admin/log.html">Log</a>
`
    }
  }
}).catch(function(e){
  console.log(e)
  addBanner("Something went wrong when fetching","var(--red)")
})
/*
var logged = getCookie("username")
if(logged){
  el.innerHTML = logged
}*/

var script = document.createElement("script")
script.src = "/common.js"
document.body.appendChild(script)

//===============FOOTER=============
var div = document.createElement("div")
div.innerHTML = `
<div>
  <b>Contact thingMaker</b>
  <ul>
    <li><a href="https://scratch.mit.edu/users/2-people">Scratch</a></li>
    <li><a href="https://replit.com/@thingMaker">Replit</a></li>
    <li><a href="/user?user=2-people">MineKhan</a></li>
    <li><a href="mailto:aarontao950@gmail.com">Gmail (email)</a></li>
  </ul>
</div>
`
div.classList.add("footer")
document.body.appendChild(div)

div = document.createElement("div")
div.className = "footerPlaceholder"
document.body.appendChild(div)

var style=document.createElement("style")
style.innerHTML = `
.footer {
  padding: 20px;
  display:flex;
  background: #ddd;
  justify-content:center;
  flex-direction:row;
  position:absolute;
  bottom:0;
  width:100%;
  height:200px;
  overflow:auto;
}
body[theme=dark] .footer{
  background:#171717;
}
.footer > div{
  margin:0px 20px;
}
.footer > div > ul{
  list-style-type: none;
  margin: 0;
  padding: 0;
}
.footer > div > ul li{
  margin:10px 0px;
}
.footer > div{
  text-align:center;
}
.footerPlaceholder{
  height:200px;
}
`
document.head.appendChild(style)

//=========THEME===========
var globTheme
async function updateTheme(theme){
  theme = theme || (await localforage.getItem("theme"))
  document.body.setAttribute("theme", theme)
  document.body.setAttribute("theme2", "")
  if(theme === "glow"){
    document.body.setAttribute("theme", "dark")
    document.body.setAttribute("theme2", "glow")
  }
  globTheme = theme
}
localforageScript.addEventListener("load",() => updateTheme())

function timeDiffString(millis){
  const SECOND = 1000
  const MINUTE = SECOND * 60
  const HOUR = MINUTE * 60
  const DAY = HOUR * 24
  const YEAR = DAY * 365

  if (millis < SECOND) {
    return "just now"
  }

  let years = floor(millis / YEAR)
  millis -= years * YEAR

  let days = floor(millis / DAY)
  millis -= days * DAY

  let hours = floor(millis / HOUR)
  millis -= hours * HOUR

  let minutes = floor(millis / MINUTE)
  millis -= minutes * MINUTE

  let seconds = floor(millis / SECOND)

  if (years) {
    return `${years} year${years > 1 ? "s" : ""} and ${days} day${days !== 1 ? "s" : ""} ago`
  }
  if (days) {
    return `${days} day${days > 1 ? "s" : ""} and ${hours} hour${hours !== 1 ? "s" : ""} ago`
  }
  if (hours) {
    return `${hours} hour${hours > 1 ? "s" : ""} and ${minutes} minute${minutes !== 1 ? "s" : ""} ago`
  }
  if (minutes) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  }
  return `${seconds} second${seconds > 1 ? "s" : ""} ago`
}
function timeString(time){
  return timeDiffString(Date.now() - time) + " | " + (new Date(time).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }))
}
async function getLocalTime(time){
  return await fetch(`https://thingmaker.us.eu.org/server/getLocalTime?time=${Date.now()}${time ? "&convert="+time : ""}`).then(r => r.json()).then(r => {
    if(r.success){
      return r.time || r.diff
    }else{
      console.error(r.message)
      alert(r.message)
    }
  })
}
async function getLocalTimeString(time){
  time = await getLocalTime(time)
  return timeString(time)
}

function enableUserPopup(el,user){
  var hoveringEl = false, hoveringPopup = false
  el.addEventListener("mouseover", function(e){
    hoveringEl = true
    var popup = el.previousElementSibling
    if(popup && popup.classList.contains("popup")) return
    popup = document.createElement("div")
    popup.className = "popup"
    var popupContent = document.createElement("span")
    popup.appendChild(popupContent)
    popupContent.innerHTML = `<h3 class="skeletonText" style="width:200px;">&nbsp;</h3><br><span class="skeletonText" style="width:300px;">&nbsp;</span><br><span class="skeletonText" style="width:100px;">&nbsp;</span>`
    el.parentNode.insertBefore(popup, el);
    popup.addEventListener("mouseover", function(e){
      hoveringPopup = true
    })
    popup.addEventListener("mouseout", function(e){
      hoveringPopup = false
      setTimeout(function(){
        if(!hoveringPopup && !hoveringEl){
          popup.remove()
        }
      },1000)
    })
    fetch(`https://thingmaker.us.eu.org/server/account/${user}`).then(r => r.json()).then(r => {
      if(!r){
        return popupContent.innerHTML = "User doesn't exist: "+user
      }
      popupContent.innerHTML = `${r.bg ? '<div class="bg"></div>' : ''}
      <div class="userContent">
      <a href="https://thingmaker.us.eu.org/user?user=${r.username}"><h3 style="display:inline-block;">
      <img class="pfp" style="width:30px;height:30px;border-radius:100%;border:1px solid gray;vertical-align:middle;">
      ${r.username}</h3></a><div class='popupVotes' style="margin-left:16px;display:inline-block;"></div><br>
      ${r.bio ? "@"+r.username+" - "+r.bio.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;") : ""}<br>
      ${r.lastActive ? "Last active: "+timeString(r.lastActive) : ""}</div>`
      if(r.bg) popupContent.querySelector(".bg").backgroundImage = 'url('+r.bg+')'
      popupContent.querySelector(".pfp").src = r.pfp
      makeVotes(popupContent.querySelector(".popupVotes"),r, userInfo && userInfo.username)
    })
  })
  el.addEventListener("mouseout", function(e){
    hoveringEl = false
    var popup = el.previousElementSibling
    if(!popup || !popup.classList.contains("popup")) return
    setTimeout(function(){
      if(!hoveringEl && !hoveringPopup){
        popup.remove()
        hoveringPopup = false
      }
    },1000)
  })
}

function makeVotes(el,data,yourUsername){
  let username = data.username
  el.innerHTML = `
<span class="allVotes" style="margin-right:16px;font-size:16px;vertical-align:middle;"></span>
<button class="vote_1 small">+1</button>
<button class="vote_0 small">0</button>
<button class="vote_-1 small">-1</button>
<span class="helpBtn">
?
<div class="popup">
  <span style="padding:8px;">
    If a user has 10 or more votes, they can create and edit wiki pages.
  </span>
</div>
</span>
`
  let voteEl = el.querySelector(".allVotes")
  let otherVotes = 0, yourVote = 0
  let votes = 0
  if(data.votes){
    for(let i in data.votes){
      votes += data.votes[i]
      if(i !== yourUsername) otherVotes += data.votes[i]
      else yourVote = data.votes[i]
    }
  }
  function updateVotes(){
    voteEl.textContent = votes + (votes >= 10 ? " âœ…" : "")
    voteEl.style.color = votes >= 10 ? "green" : (votes < 0 ? "red" : "")
  }
  updateVotes()
  el.querySelector(".vote_"+yourVote).classList.add("selected")
  function vote(amount){
    fetch("https://thingmaker.us.eu.org/server/voteUser/"+username, {
      credentials:'include',
      method: 'POST',
      body: JSON.stringify({vote:amount})
    }).then(d => d.json()).then(d => {
      if(d.success){
        el.querySelector(".vote_"+yourVote).classList.remove("selected")
        yourVote = amount
        votes = otherVotes+yourVote
        updateVotes()
        el.querySelector(".vote_"+yourVote).classList.add("selected")
      }else{
        alert(d.message)
      }
    })
  }
  el.querySelector(".vote_1").onclick = () => vote(1)
  el.querySelector(".vote_0").onclick = () => vote(0)
  el.querySelector(".vote_-1").onclick = () => vote(-1)
}

function formatGetAttributesInString(str){
  var arr = []
  var attribute = "", value = ""
  var inQuotes = false, quoteType = null
  var isValue = false
  for(var l of str){
    if((!inQuotes || l === quoteType) && (l === "'" || l === '"')){
      inQuotes = !inQuotes
      quoteType = l
      if(!inQuotes){
        if(attribute) arr.push([attribute.toLowerCase(),value])
        attribute = value = ""
        isValue = false
        quoteType = null
      }
    }else if(!inQuotes && l === " "){
      if(attribute) arr.push([attribute.toLowerCase(),value.toLowerCase()])
      attribute = value = ""
      isValue = false
      quoteType = null
    }else if(!inQuotes && !(isValue && value) && l === "="){
      isValue = true
    }else{
      if(isValue) value += l
      else attribute += l
    }
  }
  if(attribute) arr.push([attribute.toLowerCase(),value.toLowerCase()])
  return arr
}
function formatGetElementsInString(str){
  var main = []
  var element = {elements:main}
  while(str){
    var isText = true
    if(str[0] === "<"){
      var i = 0
      var j = str.indexOf(">")
      if(j === -1){
        isText = true
      }else if(str[i+1] === "/"){
        var tagName = str.substring(i+2,j).toLowerCase()
        if(tagName === element.tagName){
          element = element.parent
          isText = false
        }
      }else if(!formatUnparsedElements.includes(element.tagName)){
        var preclose = (str[j-1] === "/") ? 1 : 0
        var attributeStart = str.indexOf(" ")
        if(attributeStart > j) attributeStart = -1
        var tagEnd = attributeStart === -1 ? j-preclose : attributeStart+i
        attributeStart = attributeStart === -1 ? j-preclose : attributeStart+i+1
        var tagName = str.substring(i+1,tagEnd).toLowerCase()
        var parent = element
        var attributes = formatGetAttributesInString(str.substring(attributeStart,j-preclose))
        element = {tagName,attributes,elements:[],parent}
        parent.elements.push(element)
        if(formatUnclosedElements.includes(tagName) || preclose){
          element = parent
        }
        isText = false
      }
      if(!isText) str = str.substring(j+1,str.length)
    }
    if(isText){
      var i = str.substring(1,str.length).indexOf("<")
      if(i === -1) i = str.length
      else i++
      let str2 = str.substring(0,i)
      if(!formatUnparsedElements.includes(element.tagName)) str2 = str2.replace(/</g,"&lt;").replace(/>/g,"&gt;")
      element.elements.push(str2)
      str = str.substring(i,str.length)
    }
  }
  return main
}
var formatSafeElements = ["h1","h2","h3","h4","h5","h6","p","img","video","audio","a","ul","ol","li","pre","code","br","image-recipe","mc-recipe","font","b","i","big","center","small","span","strike","strong","sub","sup","table","tbody","td","tfoot","th","thead","tr","hr"]
var formatSafeAttributes = ["align","alt","width","height","href","src","media","title","style","target",'inline',"controls","loop"]
var formatUnclosedElements = ["img","br","hr"]
var formatUnparsedElements = ["pre","code"]
function formatConvertToSafeHtml(elements,addTo){
  for(var e of elements){
    if(typeof e === "string"){
      addTo.insertAdjacentHTML("beforeend",e)
      continue
    }else if(e instanceof HTMLElement){
      addTo.appendChild(e)
      continue
    }
    if(!formatSafeElements.includes(e.tagName)) e.tagName = "span"
    let element = document.createElement(e.tagName)
    addTo.appendChild(element)
    for(let a of e.attributes){
      if(!formatSafeAttributes.includes(a[0]) && !(a[0] === "id" && a[1].startsWith("heading_"))) continue
      element.setAttribute(a[0],a[1])
    }
    if(formatUnclosedElements.includes(e.tagName)) continue
    formatConvertToSafeHtml(e.elements,element)
  }
  return addTo
}
function formatGetElementsByTagName(e,tag, arr = []){
  if(e) for(var i of e){
    if(i.tagName === tag) arr.push(i)
    formatGetElementsByTagName(i.elements,tag,arr)
  }
  return arr
}
function formatGetAttribute(e,a){
  for(var i of e.attributes){
    if(i[0] === a) return i[1]
  }
  return null
}
function formatGetAttributeArr(e,a){
  for(var i of e.attributes){
    if(i[0] === a) return i
  }
}

let notLetterRegex = /[^a-zA-Z]/g, headingNames = ["h1","h2","h3","h4","h5","h6"]
function formatTextInElements(arr){
  let str = ""
  for(var i=0; i<arr.length; i++){
    if(typeof arr[i] === "string"){
      var m = arr[i]
      str += m+" "
      if(userInfo ? userInfo.profanityFilter : true) for(var obj of remove){ //remove bad words
        m = m.replace(obj.replace, "<span style='color:red; background:black;'>"+obj.with+"</span>")
      }
      //m = m.replace(/ /g, "&nbsp;")
      //m = m.replace(/\n/g, "<br>"
      m = m.replace(/@([^ \n]*)/g, "<a href='/user?user=$1'>@$1</a>")
      m = m.replace(
        /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal|io))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi
        , "<a href='$1'>$1</a>")
      arr[i] = m
    }else{
      let c = formatTextInElements(arr[i].elements)
      if(headingNames.includes(arr[i].tagName)){
        let has
        for(let j of arr[i].attributes){
          if(j[0] === "id"){
            has = j
            break
          }
        }
        if(has) has[1] = "heading_"+c
        else arr[i].attributes.push(["id","heading_"+c])
      }
    }
  }
  return str.substring(0,str.length-1).replace(notLetterRegex,"-")
}

let remove = (function(){ //wow, this is a really advanced filter
  var arr = [
    {replace:["k","c","u","f"].reverse().join(""), optional:["c"]},
    {replace:["t","n","u","c"].reverse().join(""), optional:["u"]},
    {replace:"stupid", with:"very not smart", optional:["u","i"]},
    {replace:"dumby", with:"not smart", optional:["b","y"],noEnd:"p"},
  ]
  var between = "[THELETTER \\\-_\*.,|`~\\/\\\\!&\?\\\[\\\]'\":;]*" //there might be characters between, like this: b.a.d
  var subs = {
    i:["1","!","|","l"],
    u:["v","Âµ"],
    f:["Æ’"],
    v:["\\\/"]
  } //letters could be replaced like this: stvpid
  arr.forEach((obj, i) => {
    var str = "", value, witH
    if(typeof obj === "string") value = obj, witH = "bad"
    else value = obj.replace, witH = obj.with || "bad"
    if(obj.noStart) str += "(?<!"+obj.noStart+")" //negative look behind
    for(var j=0; j<value.length; j++){
      var letter = value[j], group = value[j]
      if(subs[letter]){
        group = "("+letter+"|"+subs[letter].join("|")+")"
        letter += subs[letter].join("")
      }
      if(obj.optional && obj.optional.includes(value[j])) group = ""
      if(j+1 === value.length) str += group
      else str += group + between.replace("THELETTER",letter)
    }
    if(obj.noEnd) str += "(?!"+obj.noEnd+")"
    arr[i] = {original:value,replace:new RegExp("("+str+")", "gi"),with:witH}
  })
  return arr
})()

let assetsUrl = "https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.19.2/assets/minecraft/textures/"
function format(m){
  m = m.replace(/{{ASSETS_URL}}/g,assetsUrl)
  var elements = formatGetElementsInString(m)

  prismHilite(elements)
  var r = formatGetElementsByTagName(elements,"image-recipe")
  for(var i=0; i<r.length; i++){
    var a = r[i].elements.join("").split("\n")
    a.pop(); a.shift() //remove first and last
    r[i].elements = a.map(v => v ? `<img src="${assetsUrl}${v}.png">` : "<div></div>")
  }
  r = formatGetElementsByTagName(elements,"font")
  for(var i=0; i<r.length; i++){
    var font = formatGetAttribute(r[i],"font")
    if(font){
      var s = formatGetAttributeArr(r[i],"style") || ["style",""]
      s += "fontFamily:"+font+";"
    }
  }
  formatTextInElements(elements)
  m = formatConvertToSafeHtml(elements,document.createElement("div")).innerHTML

  return m
  //return md.render(m).replace(/\n$/,"")
}
function prismHilite(el){
  if(!window.Prism) return
  var pres = [...formatGetElementsByTagName(el,"pre"),...formatGetElementsByTagName(el,"code")]
  for(var i=0; i<pres.length; i++){
    var pre = pres[i]
    var lang = formatGetAttribute(pre,"codeType")
    var notcode = formatGetAttribute(pre,"notcode")
    if(!lang) lang = "javascript"
    if(Prism.languages[lang] && notcode === null){
      pre.elements = [Prism.highlight(pre.elements.join(""), Prism.languages[lang], lang).replace(/\./g,"&period;")]
    }
  }
}

const sanitizer = document.createElement('div')
function sanitize(text) {
  sanitizer.textContent = text
  return sanitizer.innerHTML
}

var prismVersion = "1.24.1"

var script = document.createElement("script")
script.src = "https://cdnjs.cloudflare.com/ajax/libs/prism/"+prismVersion+"/prism.min.js"
document.head.appendChild(script)

var prismTheme = localStorage.getItem("theme") === "dark" ? "prism-dark" : "prism"
var link = document.createElement("link")
link.rel = "stylesheet"
link.href = "https://cdnjs.cloudflare.com/ajax/libs/prism/"+prismVersion+"/themes/"+prismTheme+".min.css"
document.head.appendChild(link)

var style = document.createElement('style')
style.innerHTML = `
.format pre, .format code{
  padding:10px;
  background:#f8f4f4;
  color:black;
  white-space:pre-wrap;
  display: block;
  font-family: monospace;
  margin: 1em 0px;
}
.format pre[inline], .format code[inline]{
  display: inline-block;
  padding: 0 2px;
  margin: 0;
}
body[theme=dark] .format pre, body[theme=dark] .format code{
  color:white;
  background:black;
}

.format img, .format video{
  max-width:100%;
}

mc-recipe, image-recipe{
  display: flex;
  flex-wrap: wrap;
  width:144px;
  image-rendering:pixelated;
  outline:2px solid black;
}
mc-recipe > *, image-recipe > *{
  width:48px;
  height:48px;
  outline:1px solid black;
}

@font-face{
  font-family:mojangles;
  src:url('https://thingmaker.us.eu.org/minekhan/mojangles.ttf');
}
`
document.head.appendChild(style)
