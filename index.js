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

        ajaxRequest(input.value);
    });
    
    function ajaxRequest(content){
        // create class for connection
        var Connection = class{
            constructor(){
                this.path   = 'http://83.8.153.120/tester/';
                this.port   = '80';
                this.method = 'GET';
            }
        }
        const   conn    = new Connection(),
                ajax    = new XMLHttpRequest(),
                date    = new Date(),
                csrf    = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
                url     = conn.path + "?url=" + content + "&csrf=" + csrf;

        ajax.onreadystatechange = function() {
            // on success
            if (this.readyState == 4 && this.status == 200) {
                var musicUrl = conn.path + this.responseText;
                loader.style.display = 'none';
                download.style.display = 'block';
                link.setAttribute('href', musicUrl);
                ((musicUrl) => {
                    const ahref = document.createElement('a');
                    ahref.href = musicUrl;
                    ahref.download = FILE_NAME;
                    document.body.appendChild(ahref);
                    ahref.click();
                    document.body.removeChild(ahref);
                });
            }
            // on error
            if(this.readyState == 4 && this.status !== 200) {
                loader.style.display = 'none';
                error.style.display = 'block';
                error.textContent = this.responseText;
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

    // clicking on download button must be handled by js, because otherwise it doesn't open at all
    link.addEventListener('click', function(){
        var href = link.getAttribute('href');
        window.open(href);
    })
}