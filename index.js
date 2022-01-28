// Initialize js 
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('body').addEventListener('click', main());      
});
function main() {
    // divs in index.html that are used
    var input   = document.querySelector('#url'),
        form    = document.querySelector('#form'),
        text    = document.querySelector(".text"),
        loader  = document.querySelector("#loader"),
        download= document.querySelector("p#downloading");
        error   = document.querySelector("#error"),
        link    = document.querySelector("a#download");


    form.addEventListener('submit', function(e){
        e.preventDefault(); 
        
        // check if content is url or is it empty
        if(!validator(input.value)) return;
        
        // remove error class if last call was unsuccessful
        text.style.display = 'none';
        download.style.display = 'none';
        error.style.display = 'none';
        loader.style.display = 'block';

        if(!ajaxRequest(input.value)){
            loader.style.display = 'none';
            error.style.display = 'block';
            error.textContent = "Can't set up connection to server";
            return false;
        }
    });
    
    function ajaxRequest(content){
        // create class for connection
        var Connection = class{
            constructor(){
                this.path   = 'http://83.8.17.84/SpotifyDownloader/';
                this.port   = '80';
                this.method = 'GET';
            }
        }
        const   conn    = new Connection(),
                ajax    = new XMLHttpRequest(),
                date    = new Date(),
                csrf    = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
                url     = conn.path + "?url=" + content + "&csrf=" + csrf;

        ajax.onreadystatechange = function() {
            // on success
            if (this.readyState == 4 && this.status == 200) {
                loader.style.display = 'none';
                download.style.display = 'block';
                
                var retrievedSongs = JSON.parse(this.responseText), // parsed json from php repsonse
                    historySongs = [];   // it's all the songs that should be in history panel

                // go through each song and create anchor to each, also downloads it all.
                for(var i = 0; i < retrievedSongs.length; i++){
                    songUrl = conn.path + retrievedSongs[i]['path'] + retrievedSongs[i]['filename'];
                    // create temporary array to hold the current song into history panel
                    var musicFile = []; 
                    musicFile[0] = songUrl;
                    musicFile[1] = retrievedSongs[i]['filename'];
                    historySongs.push(musicFile);

                    // donwload song
                    chrome.downloads.download({url: songUrl});
                }

                chrome.storage.local.set({ "songs": historySongs }, function(){});
            }
            // on error
            if(this.readyState == 4 && this.status !== 200) {
                loader.style.display = 'none';
                error.style.display = 'block';
                error.textContent = (this.responseText == '') ? this.responseText : 'Unknown error occured while downloading';
                return false;
            }
        };
        
        ajax.open(conn.method, url, true);
        ajax.send();
        return true;
    }

    // validate request
    function validator(checkedUrl){
        if(checkedUrl == ''){
            text.style.display = 'none';
            error.style.display = 'block';
            error.textContent = "Pass any link!";
            return false;
        }
        if(checkedUrl.indexOf('https://open.spotify') !== 0){
            text.style.display = 'none';
            error.style.display = 'block';
            error.textContent = "Pass right spotify link!";
            return false;
        }
        return true;
    }

    // switch button and shown divs. Toggles between normal donwloader and history of downloads 
    document.querySelector('#changeView').addEventListener('click', function(){
        if(document.querySelector('#toggler').textContent == 'History'){
            document.querySelector('#toggler').textContent = "Downloader";
            document.querySelector("#default").style.display = "none";
            document.querySelector("#history").style.display = "block";
            fillHistory();
        }
        else{
            document.querySelector('#toggler').textContent = 'History';
            document.querySelector("#default").style.display = "block";
            document.querySelector("#history").style.display = "none";
            clearHistory();
        }
    });

    // fill ul tag with a hrefs to download files
    function fillHistory(){
        // fetch data from local storage 
        chrome.storage.local.get("songs", function(data){
            var song = data['songs'];
            // run through each song
            for(var i = 0; i < song.length; i++){
                // index 0 stands for URL, 1 for filename
                // console.log(song[i][1]);
                var path = song[i][0],
                    filename = song[i][1];
                document.querySelector("#songsWall").innerHTML += "<li><a target='_blank' class='song' href='" + path + "'>" + filename + "</a></li>"
            }
        });
    }

    // clear li tags from history div
    function clearHistory(){
        document.querySelector('#songsWall').innerHTML = '';
    }
    
    // onclick callback for downloading file again
    if(document.querySelector("#history").style.display = "block"){
        document.querySelector('a.song').addEventListener('click',function(e){
            e.preventDefault();
            songUrl = this.getAttribute('href');
            chrome.downloads.download({url: songUrl});
        });
    }
    
}
