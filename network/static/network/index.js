export function view_posts(user = null, follows = false, page_num = 1){
    document.querySelector('#post_list').innerHTML = '';

    fetch(`/list?user=${user}&follows=${follows}`)
    .then(response => response.json())
    .then(data => {
        data.results.forEach(post => {
            const element = document.createElement('div');
            element.classList.add('post');
            element.id = `post_${post.post_id}`;
 
            let name_header = `<h3>${post.creator}</h3>`;
            if (src != 'profile'){
                name_header = `<a href = "/profile/${post.creator_id}">${name_header}</a>`;
            };
            let like_type = `like`;
            if (post.is_liked){
                like_type = 'dislike';
            };
            if (post.is_owner){
                name_header += '<span><button class="edit_button">Edit</button></span>';
            }
            var edit_block = `<div class="edit_block" style="display:none;">
                <textarea rows="4" cols="50"></textarea>
                <button class="save_button">Save</button>
                </div>`;
            var view_block = `<div class="view_block style="display:block;">${name_header}
                <p style="font-weight: lighter;">${post.posted}</p>
                <p class = "content">${post.content}</p>
                <div class = "like_button ${like_type}"><img src="/static/images/heart.svg">
                <span>${post.likes}</span></div>`;

            element.innerHTML = edit_block + view_block;

            element.querySelector('.like_button').addEventListener('click', () => like_button_event(element, post));
            if (post.is_owner){
                element.querySelector('.edit_button').addEventListener('click', () => edit_button_event(element, post));
            }
            document.querySelector('#post_list').append(element);
        });
    });
}

export function edit_button_event(element, post){
    element.querySelector('.view_block').style.display = 'none';
    let edit_block = element.querySelector('.edit_block');
    edit_block.style.display = 'block';
    edit_block.querySelector('textarea').value = post.content;

    edit_block.querySelector('.save_button').addEventListener('click', () => {
        const new_content = String(edit_block.querySelector('textarea').value);
        fetch(`/edit_post`, {
            method : 'PUT',
            body : JSON.stringify({post_id : post.post_id, content : new_content}),
            headers : {
                'X-CSRFToken': CSRF_TOKEN,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            response.json()
        })
        .then(result => {
            console.log(result);
            element.querySelector('.content').innerHTML = new_content;
            element.querySelector('.view_block').style.display = 'block';
            edit_block.style.display = 'none';
        });
    });
}

export function like_button_event(element, post){
    fetch(`/add_like`, {
        method : 'PUT',
        body : JSON.stringify({post_id : post.post_id, is_liked : post.is_liked}),
        headers : {
            'X-CSRFToken': CSRF_TOKEN,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);

        const button = element.querySelector('.like_button');
        const button_content = button.querySelector('span');
        if (button.classList[1] == 'dislike'){
            button.classList.remove('dislike');
            button.classList.add('like');
            button_content.innerHTML = parseInt(button_content.innerHTML) - 1;
        }
        else{
            button.classList.remove('like');
            button.classList.add('dislike');
            button_content.innerHTML = parseInt(button_content.innerHTML) + 1;
        }
        post.is_liked = !post.is_liked;
    });
}

document.addEventListener('DOMContentLoaded', () => {

    if (src == 'index')
        indexStarter();
    else if (src == 'following')
        view_posts(user_id, 'true');
    else if (src == 'profile')
        profileStarter();
   
})

function profileStarter(){
    view_posts(user_id);
    document.querySelector('#follow_button').addEventListener('click', () => {
        fetch(`/add_follow/${user_id}`, {
            method : 'PUT',
            body : JSON.stringify({follows : follows}),
            headers : {
                'X-CSRFToken': CSRF_TOKEN,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(reply => {
            console.log(reply.status);
            
            location.reload();
        });
    });
};

function indexStarter(){
    view_posts();

    document.querySelector('#create_post').addEventListener('submit', () =>{
        event.preventDefault();
        const content = document.querySelector('#content').value; 

        fetch('/create', {
            method : 'POST',
            body : JSON.stringify({content : content}),
            headers : {
                'X-CSRFToken': CSRF_TOKEN,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(reply => {
            console.log(reply.status);
            document.querySelector('#content').value = '';

            view_posts();
        });
    });
}
