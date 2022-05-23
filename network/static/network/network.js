
document.addEventListener('DOMContentLoaded', () => {
    
    if (window.location.pathname === '/following' || window.location.pathname == '/') {
        document.querySelector("#newpostsubmit").addEventListener('click', () => {
            let postContent = document.querySelector("#newpost").value;
            let profile = document.querySelector("#username").innerHTML;

            newpost(postContent, profile);
        });
        
        if (window.location.pathname === '/following') {
            showpost("following", 1);
            document.querySelectorAll(".page-link").forEach(item => {
                item.addEventListener('click', () => {
                    let page = item.innerHTML;
                    document.querySelector("#page-content").innerHTML = '';
                    showpost("following", page);
                })
            })
        }
        
        if(window.location.pathname === '/') {
            showpost("all", 1);
            let navBtn = document.querySelectorAll(".page-link");
            navBtn.forEach(item => {
                item.onclick = console.log("This button has been clicked");
            })
        }
    }
    else {
        let username = document.querySelector("#user");
        showpost(username.innerHTML);
    }

    

    
})


function newpost(postContent, profile) {

    fetch('/post', {
        method: 'POST',
        body: JSON.stringify({
            profile: profile,
            postContent: postContent
        })
      })
      .then(response => response.json())
      .then(result => {
          // Print result
          console.log(result);
      });
      window.location.reload();
      
}

function showpost(target, page) {
    fetch(`/post/${target}?page=${page}`).then(response => response.json()).then(posts => {
        posts.post.forEach(post => {
            const postElement = document.createElement('div');
            postElement.innerHTML = `<div class="post">
                                        <div id="user">
                                            <a href="http://127.0.0.1:8000/profile/${post.profile_id}">
                                                <strong>${post.profile}</strong>
                                            </a>
                                        </div> <br>
                                        <div id="content">${post.postContent}</div> <br>
                                        <div id="time"><a href="http://127.0.0.1:8000/post/${post.id}">${post.time}</a></div> <br>
                                    </div>
            `;
            if (target == "all") {
                document.querySelector("#homepage-content").appendChild(postElement);
            }
            else if (target == "following") {
                document.querySelector("#page-content").appendChild(postElement);
            }
            else {
                document.querySelector("#profile-content").appendChild(postElement);
            }
            
            if (posts.numberOfPage > 1) {
                document.querySelector("#page").innerHTML = '';
                for (let i = 0; i < posts.numberOfPage; i++) {
                    document.querySelector("#page").innerHTML += `<li class="page-item"><button class="page-link" data-page="${i + 1}">${i + 1}</button></li>`
                }
            }
        });
    })
    
}