// Initialize js 
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('body').addEventListener('click', main());      
});
function main() {
    // divs in index.html that are used
    var input   = document.querySelector('#url'),
        form    = document.querySelector('#form'),
        respond = document.querySelector('#respond');
    
    form.addEventListener('submit', function(e){
        e.preventDefault(); 

        // remove error class if last call was unsuccessful
        respond.classList.remove('error');

        // check if content is url or is it empty
        if(!validator(input.value)) return;
        try{
            if(!ajaxRequest(input.value)) throw ("cos sie zjebalo");
        } catch(e){
            respond.classList.add('error');
            respond.textContent = e;
        }
    });
    
    // AJAX call
    function ajaxRequest(content){
        // create class for connection
        var Connection = class{
            constructor(){
                this.url    = 'http://mc.test/test';
                this.port   = '30000';
                this.param  = 'url';
                this.method = 'get';
            }
        }
        const   conn    = new Connection(),
                ajax    = new XMLHttpRequest();

        ajax.onreadystatechange = function() {
            // on success
            if (this.readyState == 4 && this.status == 200) {
                respond.textContent = this.responseText;
            }
            // on error
            if(this.status !== 200) {
                respond.textContent = this.responseText;
                return;
            }
        };
        ajax.open(conn.method, conn.url + '?' + conn.param + "=" + content, true);
        ajax.send();
        return true;
    }

    // validate request
    function validator(checkedUrl){
        if(checkedUrl == ''){
            respond.textContent = "Pass any link!";
            respond.classList.add('error');
            return false;
        }
        if(checkedUrl.indexOf('http://') !== 0){
            respond.textContent = "Pass right link!";
            respond.classList.add('error');
            return false;
        }
        return true;
    }

}


