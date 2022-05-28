
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
    let username = document.querySelector("#username").innerHTML;
    fetch(`/post/${target}?page=${page}`).then(response => response.json()).then(posts => {
        posts.post.forEach(post => {
            const postElement = document.createElement('div');
            
            if (post.profile == username) {
                postElement.innerHTML = `<div class="post">
                                            <div class="post-wrapper">
                                                <div id="user">
                                                    <a href="/profile/${post.profile_id}">
                                                        <strong class="post_profile">${post.profile}</strong>
                                                    </a>
                                                </div> 
                                                <div class="edit-btn">
                                                </div>
                                            </div>
                                            <br>
                                            <div id="content">${post.postContent}</div> <br>
                                            <div id="time"><a href="/post/${post.id}">${post.time}</a></div> <br>
                                    </div>
                                    <div class="edit-post" style="display:none">
                                        <form>
                                        <textarea class="postContent">${post.postContent}</textarea>
                                        <div class="submit">
                                            <button class="btn btn-outline-primary cancel-btn" type="button">Cancel</button>
                                            <button class="btn btn-primary update-btn" type="button" data-id="${post.id}">Update</button>
                                        </div>
                                        </form>
                                    </div>
            `;
               
            }
            else {
                postElement.innerHTML = `<div class="post">
                <div id="user">
                    <a href="/profile/${post.profile_id}">
                        <strong class="post_profile">${post.profile}</strong>
                    </a>
                </div> <br>
                <div id="content">${post.postContent}</div> <br>
                <div id="time"><a href="/post/${post.id}">${post.time}</a></div> <br>
            </div>
                `
            }
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
                document.querySelector("#next").innerHTML = `<li class="page-item disabled"><button class="page-link" data-page="...">...</button></li>
                <li class="page-item">
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

        const editBtn = document.querySelectorAll(".edit-btn");
            editBtn.forEach(btn => {
                btn.addEventListener('click', () => {
                    btn.parentElement.parentElement.style.display = 'none';
                    btn.parentElement.parentElement.nextElementSibling.style.display = 'block';
                    
                    document.querySelectorAll(".update-btn").forEach(button => {
                        button.addEventListener('click', () => {
                            let postContent = button.parentElement.previousElementSibling.value;
                            editPost(postContent, button.dataset.id);
                            if (window.location.pathname === "/") {
                                document.querySelector("#homepage-content").innerHTML = '';
                                showpost("all", posts.currentpage);
                            }
                            else {
                                document.querySelector("#profile-content").innerHTML = '';
                                showpost(username, posts.currentpage)
                            }
                        })
                    })

                    document.querySelectorAll(".cancel-btn").forEach(button => {
                        button.addEventListener("click", () => {
                            btn.parentElement.parentElement.style.display = 'block';
                            btn.parentElement.parentElement.nextElementSibling.style.display = 'none';
                        })
                    })
                })

                

                btn.innerHTML = `<button class="editButton">
                <svg width="24px" height="24px">    <path d="M 19.171875 2 C 18.448125 2 17.724375 2.275625 17.171875 2.828125 L 16 4 L 20 8 L 21.171875 6.828125 C 22.275875 5.724125 22.275875 3.933125 21.171875 2.828125 C 20.619375 2.275625 19.895625 2 19.171875 2 z M 14.5 5.5 L 3 17 L 3 21 L 7 21 L 18.5 9.5 L 14.5 5.5 z"/></svg>
                </button>`;
            })
        
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
            else if(item.dataset.page === "...") {
                item.parentElement.className = "page-item disabled";
            }
            else {
                item.parentElement.className = "page-item";
            }
        })
    })
}

function editPost(postContent, postID) {
    fetch(`http://${window.location.hostname}:${window.location.port}/post/${postID}`, {
        method: 'PUT',
        body: JSON.stringify({
            postContent: postContent
        })
    })
}