

//export default - serve per consentire l'import su unaltro file js
export default class RequestJson {
    
    constructor(domain, urlMongoDB, data) {
        this.domain = domain;
        this.urlMongoDB = urlMongoDB;
        this.data = data;
    }

    //request online
    async TwitchGetUser(user) {
        let url = "https://api.twitch.tv/kraken/user/";
        if (user) {
            url += user;
        }
        return await RequestJson.RequestJsonAsync("GET", url, this.data);
    }

    async GetOldPosts(lastPostId, isAdultContent) {
        let url = `${this.domain}/Post/Under?lastolder=${lastPostId}`;
        if (isAdultContent) {
            url = `${url}&isAdultContent=TRUE`;
        }
        return await RequestJson.RequestJsonAsync("GET", url, this.data);
    }

    //richiesta per la ricerca
    async GetPostsSearch(postID) {
        let url = `${this.domain}/Post`;
        url = `${url}/Detail?id=${postID}`;
        return await RequestJson.RequestJsonAsync("GET", url, this.data);
    }

    //VISUALIZZAZIONE SOLO POST ADULTI
    async GetNewPostsAdult() {
        let url = `${this.domain}/Post/Adult`;
        return await RequestJson.RequestJsonAsync("GET", url, this.data);
    }

    async GetOldPostsAdult(lastPostId) {
        let url = `${this.domain}/Post/Adult/Under?lastolder=${lastPostId}`;
        return await RequestJson.RequestJsonAsync("GET", url, this.data);
    }

    async AddPost(postAdd) {
        let url = `${this.domain}/Post/Add`;
        return await RequestJson.RequestJsonAsync("Post", url, postAdd);   
    }

    async AddComment(commentAdd) {
        let url = `${this.domain}/Comment/Add`;
        return await RequestJson.RequestJsonAsync("Post", url, commentAdd);
    }

    static async RequestJsonAsync(method, url, data) {
        //data e un json che contiene delle informazioni tipo credenziali email, pass
        // nel nostro caso non ci serve.
        return await new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.responseType = "json"
            if (data) {
                xhr.setRequestHeader("Content-Type", "application/json");
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
    // Octokit.js
    // https://github.com/octokit/core.js#readme
    // const octokit = new Octokit({
    //     auth: 'YOUR-TOKEN'
    // })
    // static async fetchGitUserInfo(user) {
    //     return await octokit.request('GET /search/users', {
    //         headers: {
    //         'X-GitHub-Api-Version': '2022-11-28'
    //         }
    //     })
    // }

    static async fetchGitHubRepoInfo(repoName) {
        const apiUrl = `https://api.github.com/repos/${repoName}`;
      
        return fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            const repoInfo = {
              name: data.name,
              description: data.description,
              language: data.language,
              stars: data.stargazers_count,
              forks: data.forks_count,
              updatedAt: data.updated_at
            };
            return repoInfo;
          })
          .catch(error => {
            console.error('Errore durante il recupero dei dati del repository:', error);
            return null; // Restituisci null in caso di errore
          });
    }

}