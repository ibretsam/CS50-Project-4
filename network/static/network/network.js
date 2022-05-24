
document.addEventListener('DOMContentLoaded', () => {
    
    if (window.location.pathname === '/following' || window.location.pathname == '/') {
        document.querySelector("#newpostsubmit").addEventListener('click', () => {
            let postContent = document.querySelector("#newpost").value;
            let profile = document.querySelector("#username").innerHTML;

            newpost(postContent, profile);
        });
        
        if (window.location.pathname === '/following') {
            showpost("following", 1);
        }
        
        if(window.location.pathname === '/') {
            showpost("all", 1);
            
        }
    }
    else {
        let username = document.querySelector("#user");
        showpost(username.innerHTML, 1);
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

            if (posts.currentpage == 1) {
                document.querySelector("#previous").innerHTML = ``;
                document.querySelector("#page").innerHTML = ``;
                if (posts.numberOfPage < 3) {
                    for (let i = 0; i < posts.numberOfPage; i++) {
                        document.querySelector("#page").innerHTML += `<li class="page-item"><button class="page-link" data-page="${i + 1}">${i + 1}</button></li>`
                    }
                }
                else {
                    for (let i = 0; i < 3; i++) {
                        document.querySelector("#page").innerHTML += `<li class="page-item"><button class="page-link" data-page="${i + 1}">${i + 1}</button></li>`
                    }
                }
                document.querySelector("#next").innerHTML = `<li class="page-item">
                <a class="page-link" href="#" data-page="${posts.currentpage + 1}">Next</a>
              </li>`
            }
            else if (posts.currentpage == posts.numberOfPage) {
                document.querySelector("#previous").innerHTML = `<li class="page-item">
                <a class="page-link" href="#" data-page="${posts.numberOfPage - 1}">Previous</a>
              </li>`
                document.querySelector("#page").innerHTML = ``;
                if (posts.numberOfPage < 3) {
                    for (let i = posts.numberOfPage - posts.currentpage; i < posts.numberOfPage; i++) {
                        document.querySelector("#page").innerHTML += `<li class="page-item"><button class="page-link" data-page="${i + 1}">${i + 1}</button></li>`
                    }
                }
                else {
                    for (let i = posts.numberOfPage - 3; i < posts.numberOfPage; i++) {
                        document.querySelector("#page").innerHTML += `<li class="page-item"><button class="page-link" data-page="${i + 1}">${i + 1}</button></li>`
                    }
                }
                document.querySelector("#next").innerHTML = '';
            }
            else {
                document.querySelector("#previous").innerHTML = `<li class="page-item">
                <a class="page-link" href="#" data-page="${posts.currentpage - 1}">Previous</a>
              </li>`
                document.querySelector("#page").innerHTML = ``;
                for (let i = posts.currentpage; i < posts.currentpage + 3; i++) {
                    document.querySelector("#page").innerHTML += `<li class="page-item"><button class="page-link" data-page="${i - 1}">${i - 1}</button></li>`
                }
                document.querySelector("#next").innerHTML = `<li class="page-item">
                <a class="page-link" href="#" data-page="${posts.currentpage + 1}">Next</a>
              </li>`
            }
        });
        
        let navBtn = document.querySelectorAll(".page-link");
        navBtn.forEach(item => {
            item.addEventListener('click', () => {
                let pageindex =  parseInt(item.dataset.page);
                if (window.location.pathname === '/') {
                    document.querySelector("#homepage-content").innerHTML = '';
                    showpost("all", pageindex);
                }
                else if (window.location.pathname === '/following') {
                    document.querySelector("#page-content").innerHTML = '';
                    showpost("following", pageindex);
                }
                else {
                    document.querySelector("#profile-content").innerHTML = '';
                    let username = document.querySelector("#user");
                    showpost(username.innerHTML, pageindex);

                }
            })
            if (item.dataset.page == posts.currentpage) {
                item.parentElement.className = "page-item active";
            }
            else {
                item.parentElement.className = "page-item";
            }
        })
    })
    
}