
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
<path d="M512,304.021c0-12.821-5.099-24.768-13.867-33.6c9.963-10.901,15.019-25.536,13.632-40.725
c-2.475-27.115-26.923-48.363-55.616-48.363H324.395c6.485-19.819,16.939-56.149,16.939-85.333c0-46.272-39.317-85.333-64-85.333
c-22.165,0-38.016,12.459-38.677,12.992c-2.539,2.048-3.989,5.099-3.989,8.341v72.32l-61.44,133.141l-2.56,1.28v-4.075
c0-5.888-4.779-10.667-10.667-10.667H53.333C23.936,224,0,247.936,0,277.333V448c0,29.397,23.936,53.333,53.333,53.333h64
c23.083,0,42.773-14.72,50.219-35.243c17.749,9.131,41.643,13.931,56.469,13.931H419.84c23.232,0,43.541-15.68,48.32-37.269
c2.453-11.115,1.024-22.315-3.84-32.043c15.744-7.936,26.347-24.171,26.347-42.688c0-7.552-1.728-14.784-5.013-21.333
C501.397,338.752,512,322.517,512,304.021z M149.333,448c0,17.643-14.379,32-32,32h-64c-17.664,0-32-14.357-32-32V277.333
c0-17.643,14.357-32,32-32v0.107h95.957v10.667c0,0.064,0.043,0.107,0.043,0.171V448z M466.987,330.368
c-4.117,0.469-7.595,3.264-8.896,7.211c-1.301,3.925-0.235,8.277,2.795,11.115c5.44,5.141,8.427,12.011,8.427,19.349
c0,13.44-10.155,24.768-23.637,26.304c-4.117,0.469-7.595,3.264-8.896,7.211c-1.301,3.925-0.235,8.277,2.795,11.115
c7.04,6.635,9.856,15.936,7.744,25.472c-2.624,11.883-14.187,20.523-27.499,20.523H224c-15.851,0-41.365-6.848-53.333-15.744
V262.656l15.381-7.68c2.155-1.088,3.883-2.88,4.907-5.077l64-138.667c0.64-1.387,0.981-2.923,0.981-4.459V37.909
c4.437-2.453,12.139-5.803,21.333-5.803c11.691,0,42.667,29.077,42.667,64c0,37.525-20.416,91.669-20.629,92.203
c-1.237,3.264-0.811,6.955,1.195,9.835c2.005,2.88,5.269,4.608,8.789,4.608h146.795c17.792,0,32.896,12.715,34.389,28.971
c1.131,12.16-4.672,23.723-15.168,30.187c-3.285,2.005-5.205,5.653-5.056,9.493c0.128,3.84,2.347,7.296,5.781,9.067
c9.003,4.608,14.592,13.653,14.592,23.595C490.603,317.504,480.448,328.832,466.987,330.368z"/>
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
                </div> <br>
                <div id="content">${post.postContent}</div> <br>
                <div id="time"><a href="/post/${post.id}">${post.time}</a></div> <br>
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
    fetch(`http://${window.location.hostname}:${window.location.port}/post/${postID}`, {
        method: 'PUT',
        body: JSON.stringify({
            postContent: postContent
        })
    })
}

function likePost(postID, condition) {
    fetch(`http://${window.location.hostname}:${window.location.port}/post/${postID}/like`, {
        method: 'PUT',
        body: JSON.stringify({
            liked: condition
        })
    }).then(response => response.json()).then(result => {
        console.log(result)
        
    })
}