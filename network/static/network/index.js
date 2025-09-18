export function view_posts(user = null, follows = false){
    document.querySelector('#post_list').innerHTML = '';

    fetch(`/list?user=${user}&follows=${follows}`)
    .then(response => response.json())
    .then(data => {
        data.forEach(post => {
            const element = document.createElement('div');
            element.classList.add('post');
            element.id = `post_${post.post_id}`;
 
            let name_header = `<h3>${post.creator}</h3>`;
            if (src == 'index'){
                name_header = `<a href = "/profile/${post.creator_id}">${name_header}</a>`;
            };
            let like_type = `like`;
            if (post.is_liked){
                like_type = 'dislike';
            };

            element.innerHTML = `${name_header}
            <p style="font-weight: lighter;">${post.posted}</p>
            <p>${post.content}</p>
            <div class = "like_button ${like_type}"><img src="static/images/heart.svg">
            <span>${post.likes}</span></div>`;

            element.querySelector('.like_button').addEventListener('click', () => like_button(element, post));
            document.querySelector('#post_list').append(element);
        });
    });
}

export function like_button(element, post){
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

if (src == 'index'){

    document.addEventListener('DOMContentLoaded', () => {
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
        })

    })
}
