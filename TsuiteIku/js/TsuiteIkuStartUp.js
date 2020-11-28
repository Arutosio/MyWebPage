import Post from '../ViewModel/Post.js.js';

//export default - serve per consentire l'import su unaltro file js
export default class GetterJson {
    constructor(domain, data) {
        this.domain = domain;
        this.data = data
    }

    async GetNewPosts(isAdultContent) {
        let url = this.domain + "/Post";
        if (isAdultContent) {
            url = url + "?isAdultContent=TRUE";
        }
        return await GetterJson.RequestJsonAsync("GET", url, this.data);
    }

    async GetOldPosts(lastPostId, isAdultContent) {
        let url = this.domain + "/Post/Under?lastolder=" + lastPostId;
        if (isAdultContent) {
            url = url + "&isAdultContent=TRUE";
        }
        return await GetterJson.RequestJsonAsync("GET", url, this.data);
    }

    //richiesta per la ricerca
    async GetPostsSearch(postID) {
        let url = this.domain + "/Post";
        url = url + "/Detail?id=" + postID;
        return await GetterJson.RequestJsonAsync("GET", url, this.data);
    }

    //VISUALIZZAZIONE SOLO POST ADULTI
    async GetNewPostsAdult() {
        let url = this.domain + "/Post/Adult";
        return await GetterJson.RequestJsonAsync("GET", url, this.data);
    }

    async GetOldPostsAdult(lastPostId) {
        let url = this.domain + "/Post/Adult/Under?lastolder=" + lastPostId;
        return await GetterJson.RequestJsonAsync("GET", url, this.data);
    }

    static async RequestJsonAsync(method, url, data) {
        //data e un json che contiene delle informazioni tipo credenziali email, pass
        // nel nostro caso non ci serve.
        return await new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.responseType = "json"
            if (data) {
                xhr.setRequestHeader("Content-Type", "application/json")
            }
            xhr.onload = () => {
                if (xhr.status >= 400) {
                    reject(xhr.response);
                } else {
                    resolve(xhr.response);
                }
            };
            xhr.onerror = function () {
                reject(new TypeError('Network request failed'));
            };

            xhr.ontimeout = function () {
                reject(new TypeError('Network request failed'));
            };
            xhr.onreadystatechange = function () {
                // if (xhr.readyState == 4 && xhr.status == 200) {
                //     console.log(xhr.response);
                // }
            };
            xhr.send(JSON.stringify(data));
        }).then().catch(err => {
            console.log(err);
        });
    }
}