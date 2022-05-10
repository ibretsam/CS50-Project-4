
document.addEventListener('DOMContentLoaded', () => {

    
    if (window.location.pathname == '/following') {
        document.querySelector("#newpostsubmit").onclick = newpost;
        showpost("following");
    }
    else if (window.location.pathname == '/') {
        document.querySelector("#newpostsubmit").onclick = newpost;
        showpost("all");
    }
    else {
        let username = document.querySelector("#user");
        showpost(username.innerHTML);
    }

    function newpost() {
        let postContent = document.querySelector("#newpost").value;
        let profile = document.querySelector("#username").innerHTML;
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
})

function showpost(target) {
    fetch(`/post/${target}`).then(response => response.json()).then(posts => {
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.innerHTML = `<div class="post">
                                        <div id="user">
                                            <a href="http://127.0.0.1:8000/profile/${post.profile_id}">
                                                <strong>${post.profile}</strong>
                                            </a>
                                        </div> <br>
                                        <div id="content">${post.postContent}</div> <br>
                                        <div id="time">${post.time}</div> <br>
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
            
        });
    })
}