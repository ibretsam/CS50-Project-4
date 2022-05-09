document.addEventListener('DOMContentLoaded', () => {

    document.querySelector("#newpostsubmit").onclick = newpost;
    if (window.location.pathname == '/following') {
        showpost("following");
    }
    else {
        showpost("all");
    }

    function newpost() {
        let postContent = document.querySelector("#newpost").value;
        let user = document.querySelector("#username").innerHTML;
        fetch('/post', {
            method: 'POST',
            body: JSON.stringify({
                user: user,
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

    function showpost(target) {
        fetch(`/post/${target}`).then(response => response.json()).then(posts => {
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.innerHTML = `<div class="post">
                                            <div id="user">
                                                <a href="http://127.0.0.1:8000/profile/${post.user_id}">
                                                    <strong>${post.user}</strong>
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
                
            });
        })
    }
})