document.addEventListener('DOMContentLoaded', () => {

    document.querySelector("#newpostsubmit").onclick = newpost;
    showpost();

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

    function showpost() {
        fetch('/post/all').then(response => response.json()).then(posts => {
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.innerHTML = `<div class="post">
                                            <div id="user"><strong>${post.user}</strong></div> <br>
                                            <div id="content">${post.postContent}</div> <br>
                                            <div id="time">${post.time}</div> <br>
                                        </div>
                `;
                document.querySelector("#page-content").appendChild(postElement);
            });
        })
    }
})