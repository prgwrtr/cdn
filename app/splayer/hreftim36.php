<script>
(function(){
var now=Math.floor((new Date()).getTime()/1e6).toString(36),
href=location.href,r=href.match(/[\?\&]t=([^\?\&#]+)/i),hv=null;
if(r!==null)hv=unescape(r[1]);
var p=href.indexOf("?"),q=href.indexOf("#"),hash="";
if(q>=0){href=href.slice(0, q);hash=href.slice(q);}
if(p<0){location.href=href+"?t="+now+hash;}
else if(hv===null){if(href.slice(-1)!=="&")href+="&";location.href=href+"t="+now+hash;}
else if(hv!=now){location.href=href.replace("t="+hv,"t="+now);}
})();
</script>
