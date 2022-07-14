
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
        const username = document.querySelector("#user");
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

const likesvg = `<svg width="24px" height="24px" viewBox="0 0 512 512">
<path id="XMLID_1929_" d="M109.4,459.991H13c-2.1,0-3.9-1.8-3.9-3.9v-248.4c0-2.1,1.8-3.9,3.9-3.9h96.4
			c2.1,0,3.9,1.8,3.9,3.9v248.4C113.3,458.191,111.6,459.991,109.4,459.991z"/>
		<path d="M284.6,20.391c-28.2-20.7-67.2-8.8-68.8-8.3c-3.8,1.2-6.3,4.7-6.3,8.6v85.8c0,29.1-13.8,53.7-41.1,73.2
			c-21.1,15.1-42.7,21.3-42.9,21.4c-0.2,0-0.3,0.1-0.5,0.2l-5.1,1.7c-3-4.9-8.3-8.2-14.5-8.2H16.9c-9.3,0-16.9,7.6-16.9,16.9v240.5
			c0,9.3,7.6,16.9,16.9,16.9h88.6c8,0,14.7-5.6,16.4-13c11.9,12.7,28.8,20.7,47.6,20.7h209.8c44.6,0,73.1-23.3,78.1-64l26.8-170.2
			c3.9-24.7-6.2-49.7-25.8-63.7c-11.1-8-24.2-12.2-37.9-12.2H311.4v-79.6C311.4,55.891,302.4,33.491,284.6,20.391z M104.2,450.891
			H18.1v-238h86.1V450.891z M420.5,184.791c9.9,0,19.3,3,27.3,8.8c14,10.1,21.3,28.2,18.4,46.2l-26.7,170.3c0,0.1,0,0.2,0,0.3
			c-4.9,39.8-35.4,48.2-60.2,48.2H169.5c-26,0-47.1-21.1-47.1-47.1v-190.2l8.3-2.8c2.9-0.8,25.2-7.6,47.8-23.7
			c32.1-22.8,49.1-53.3,49.1-88.2v-78.6c10.4-2,31.3-4,46.4,7.1c12.8,9.4,19.3,26.9,19.3,52v88.7c0,5,4.1,9.1,9.1,9.1h118.1V184.791
			z"/>
</svg>`;

const editBtnImage = `<svg width="24px" height="24px">
                    <path d="M 19.171875 2 C 18.448125 2 17.724375 2.275625 17.171875 2.828125 L 16 4 L 20 8 L 21.171875 6.828125 C 22.275875 5.724125 22.275875 3.933125 21.171875 2.828125 C 20.619375 2.275625 19.895625 2 19.171875 2 z M 14.5 5.5 L 3 17 L 3 21 L 7 21 L 18.5 9.5 L 14.5 5.5 z"/>
                </svg>`

function showpost(target, page) {
    const username = document.querySelector("#username").innerHTML;
    fetch(`/post/${target}?page=${page}`).then(response => response.json()).then(posts => {
        posts.post.forEach(post => {
            const postElement = document.createElement('div');
            
            if (post.profile == username) {
                postElement.innerHTML = `<div class="post" data-id="${post.id}">
                                            <div class="post-wrapper">
                                                <div id="user">
                                                    <div class="wrapper">
                                                    <a href="/profile/${post.profile_id}">
                                                    <strong class="post_profile">${post.profile}</strong>
                                                </a>
                                                <div class="time"><a href="/post/${post.id}">${post.time}</a></div> <br>
                                                    </div>
                                                    
                                                </div> 
                                                <div class="edit-btn">
                                                </div>
                                            </div>
                                            
                                            
                                            <div class="content">${post.postContent}</div> <br>
                                            <div class="like-count" data-id="${post.id}"></div>
                                            <hr class="like-split">
                                            <div class="like-btn">
                                                <div class="like-img">
                                                    <button class="like-icon">
                                                        ${likesvg}
                                                    </button>
                                                </div>
                                                <div class="like-text">
                                                <span>Like</span></div>
                                            </div>
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
                postElement.innerHTML = `<div class="post" data-id="${post.id}">
                <div id="user">
                    <a href="/profile/${post.profile_id}">
                        <strong class="post_profile">${post.profile}</strong>
                    </a>
                </div>
                <div class="time"><a href="/post/${post.id}">${post.time}</a></div> <br>
                <div class="content">${post.postContent}</div> <br>
                <div class="like-count" data-id="${post.id}"></div>
                <hr class="like-split">
                                            <div class="like-btn">
                                                <div class="like-img">
                                                    <button>
                                                        ${likesvg}
                                                    </button>
                                                </div>
                                                <div class="like-text">
                                                <span>Like</span></div>
                                            </div>
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

            getLikeData(post.id);
        });

        const likeBtn = document.querySelectorAll(".like-btn");
            likeBtn.forEach(btn => {
                btn.addEventListener('click', () => {
                    likePost(btn.parentElement.dataset.id, true)
                })
            })

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
                ${editBtnImage}
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
    fetch(`http://${window.location.hostname}/post/${postID}`, {
        method: 'PUT',
        body: JSON.stringify({
            postContent: postContent
        })
    })
}

function likePost(postID, condition) {
    fetch(`http://${window.location.hostname}/post/${postID}/like`, {
        method: 'PUT',
        body: JSON.stringify({
            liked: condition
        })
    }).then(response => response.json()).then(result => {
        console.log(result)
        getLikeData(postID)
        likeCountEl = document.querySelectorAll(".like-count");
        likeCountEl.forEach(el => {
            if (el.dataset.id == postID) {
                if (condition == true) {
                    el.nextElementSibling.nextElementSibling.style.fill = "blue";
                    el.nextElementSibling.nextElementSibling.style.color = "blue";
                }
                else {
                    el.nextElementSibling.nextElementSibling.style.fill = "";
                    el.nextElementSibling.nextElementSibling.style.color = "";
                }
            }
        })
        
    })
}

function getLikeData(postID) {
    fetch(`http://${window.location.hostname}/post/${postID}/like`).then(response => response.json()).then(result => {
        console.log(result)
        likeCount = document.querySelectorAll(".like-count");
        likeCount.forEach(element => {

            if (element.dataset.id == postID) {
                if (result.likeCount == 0) {
                    element.innerHTML = '';
                }
                else if (result.likeCount == 1){
                    element.innerHTML = `${result.likeCount} like`;
                }
                else {
                    element.innerHTML = `${result.likeCount} likes`
                }
                if (result.likeObj != null) {
                    if (result.likeObj.liked === true) {
                        element.nextElementSibling.nextElementSibling.style.fill = "blue";
                        element.nextElementSibling.nextElementSibling.style.color = "blue";
                        element.nextElementSibling.nextElementSibling.addEventListener('click', () => {
                            likePost(postID, false);
                        })
                    }
                    else {
                        element.nextElementSibling.nextElementSibling.style.fill = "";
                        element.nextElementSibling.nextElementSibling.style.color = "";
                        element.nextElementSibling.nextElementSibling.addEventListener('click', () =>{
                            likePost(postID, true);
                        })
                    }
                }
            }
            
        })
    })
}