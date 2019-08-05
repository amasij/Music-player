const ipc = require('electron').ipcRenderer
const mm=require('music-metadata');
const {Howl,Howler}=require('howler');
 var jsdom=require('jsdom')
const{JSDOM}=jsdom;
global.document=document;
const $=jQuery=require('jquery');
LIBRARY=[];


// make `process.stdin` begin emitting "keypress" events

newTrackList=false;
trackList=[]
function loadPage(files,header) {
	
	
	newPlayList=[];
	newTrackList=true;
	newTrackListStarted=false;
	

var output='';
var count=0;
output=`
<h1 style="color:#808182;">${header}</h1><br>
`;
output+='<div class="row">';
imgID=[]

for(var i=0;i<files.length;i++)
{


		imgID.push(i);
		var index=files[i].lastIndexOf('\\')
		trackList.push({'name':files[i].substr(index+1,(files[i].length-index)-5),'path':files[i],'id':i})
		newPlayList.push({'name':files[i].substr(index+1,(files[i].length-index)-5),'path':files[i],'id':i})
	output+=`
	<div class="col-sm-2">
        <div class="card card-cascade" onmouseenter="marquee('card-${i}',true);" onmouseleave="marquee('card-${i}',false);" id="card-${i}" style="height:263.266px;">

        	<audio src="${newPlayList[i].path}" type="audio/mpeg" id="${i}-play-song"></audio>
        	<div class="image-container">
        		<div class="view view-cascade overlay">
  					<img src="" class="card-img-top" data="${files[i]}" id="img-${i}" class="img-fluid img-responsive">
  					<div class="mask rgba-white-slight"></div>
  				</div>
  				<div class="after" id="${i}-after">
	  				<div class="after-content" style="margin-top:80px;">
					  <span style="font-size:2em;cursor:pointer;" onclick="cardPreviousControl('${i}')"><i class="fas fa-fast-backward"></i></span>
					  <span style="font-size:2em;margin:0.5em;cursor:pointer;" onclick="setnewTrackListStarted();cardPlayControl(['${i}-play-song','${i}']);" id="${i}-play"><i class="far fa-play-circle"></i></span>
					  <span style="font-size:2em;margin:0.5em;cursor:pointer;display:none;" onclick="pauseSong(['${i}-play-song','${i}']);" id="${i}-pause" ><i class="far fa-pause-circle"></i></span>
					  <span style="font-size:2em;cursor:pointer;" onclick="cardNextControl('${i}')"><i class="fas fa-fast-forward"></i></i></span>
	  				</div>
  				</div>
  			</div>
  			<div class="card-body elegant-color white-text rounded-bottom">
  				<h5 class="card-title text-truncate" id="artist-${i}"></h5>
    			<p class="card-text text-truncate" style="height:19px;" id="song-name-${i}" data="${newPlayList[i].name}">${newPlayList[i].name}</p>
  			</div>
		</div>
    </div>
    `;
    count++;
	if(count%6==0)
	{
		if(count>0)
		output+='</div><br><div class="row">';
	}

}
document.getElementById('content').innerHTML=output;
$("#homebtn").css("display","block");
$("#search").css("display","block");
$(".opendir").css("display","block");
extractImage(imgID,true)
}

async function extractImage(fileIDs,setArtist)
{
	//alert(fileIDs)
	for(var i=0;i<fileIDs.length;i++)
	{
		
		var imgH=document.getElementById('img-'+fileIDs[i])
		if(setArtist)	var artist=document.getElementById('artist-'+fileIDs[i]);

		await mm.parseFile(imgH.getAttribute("data"),{native:true}).then(metadata=>{
	
	var format=metadata.common.picture[0].format;
	var data=metadata.common.picture[0].data;
	var src=`data:${format};base64,`+data.toString('base64');
	imgH.src=src;
	if(setArtist)artist.innerHTML=metadata.common.artist;
	
	


}).catch(err=>{
	imgH.src='default.jpg';
	if(setArtist)artist.innerHTML='Unknown';
});
	}
	
}

 $(".opendir").click(function(){
                ipc.send('opendir', '');
 });

 ipc.on('all-songs',function(event,arg){
 	openHomePlayList(arg);
 });

 ipc.on('show-result',function(event,arg){
 	var songpaths=[]
	var pathlist=arg;
	for(var i=0;i<arg.length;i++)songpaths.push(pathlist[i].path);
  loadPage(songpaths,'Search Results: ');
 });

 $("#homebtn").click(function(){
 	openHomePlayList(LIBRARY);
 	$("#homebtn").css("display","none");
 	$("#search").css("display","none");

 });
 function openHomePlayList(arg){

	 	var files=arg;
	 	LIBRARY=arg;
	 	var output='';
	 	var count=0;
	output+='<div class="row">';
var imgID=[];
for(var i=0;i<files.length;i++)
{
	var displayName=files[i].folderName.substr(files[i].folderName.lastIndexOf('\\')+1,files[i].folderName.length)
	
	imgID.push(i);	
	output+=`
	<div class="col-sm-2">
        <div class="card card-cascade" onmouseenter="marquee('card-${i}',true);" onmouseleave="marquee('card-${i}',false);" id="card-${i}" style="height:263.266px;cursor:pointer;" onclick="sendOpenPlayList(${i})">

        	
        	<div class="image-container">
        		<div class="view view-cascade overlay">
  					<img src="" class="card-img-top" data="${files[i].tracks[0].path}" id="img-${i}" class="img-fluid img-responsive">
  					<div class="mask rgba-white-slight"></div>
  				</div>
  				<div class="after" id="${i}-after">
	  				<div class="after-content" style="margin-top:80px;">
					
					  <span style="font-size:2em;margin:0.5em;cursor:pointer;"  id="${i}-play"><i class="far fa-play-circle"></i></span>
					  <span style="font-size:2em;margin:0.5em;cursor:pointer;display:none;" onclick="pauseSong(['${i}-play-song','${i}']);" id="${i}-pause" ><i class="far fa-pause-circle"></i></span>
					  
	  				</div>
  				</div>
  			</div>
  			<div class="card-body elegant-color white-text rounded-bottom">
  				<h5 class="card-title text-truncate" ></h5>
    			<p class="card-text text-truncate" style="height:19px;" id="song-name-${i}" data="${displayName}">${displayName}</p>
  			</div>
		</div>
    </div>
    `;
    count++;
	if(count%6==0)
	{
		if(count>0)
		output+='</div><br><div class="row">';
	}
	

}
document.getElementById('content').innerHTML=output;
$(".opendir").css("display","block");


extractImage(imgID,false)
};


ipc.on('test-res', function (event, arg) {
	var id=arg;
	var songpaths=[]
	var pathlist=LIBRARY[id].tracks;
	var displayName=LIBRARY[id].folderName.substr(LIBRARY[id].folderName.lastIndexOf('\\')+1,LIBRARY[id].folderName.length)
	for(var i=0;i<pathlist.length;i++)songpaths.push(pathlist[i].path);
  loadPage(songpaths,displayName);
})