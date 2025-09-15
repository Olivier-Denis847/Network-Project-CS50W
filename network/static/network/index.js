export function view_posts(user = null, follows = false){
    document.querySelector('#post_list').innerHTML = '';

    fetch(`/list?user=${user}&follows=${follows}`)
    .then(response => response.json())
    .then(data => {
        data.forEach(post => {
            const element = document.createElement('div');
            element.classList.add('post')
 
            let name_header = `<h3>${post.creator}</h3>`;
            if (src == 'index'){
                name_header = `<a href = "/profile/${post.creator_id}">${name_header}</a>`;
            };
            let like_id = `like${post.post_id}`;
            if (post.is_liked){
                like_id = 'dis' + like_id;
            };

            element.innerHTML = `${name_header}
            <p style="font-weight: lighter;">${post.posted}</p>
            <p>${post.content}</p>
            <div class = "like_button"><p id="${like_id}">${post.likes}</p></div>`;

            element.querySelector('.like_button').addEventListener('click', () => {
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
                    const button_content = element.querySelector('.like_button').querySelector('p');
                    const button_state = button_content.id.substring(0,3);
                    if (button_state == 'dis'){
                        button_content.id = 'like' + post.post_id;
                        button_content.innerHTML = parseInt(button_content.innerHTML) - 1;
                    }
                    else{
                        button_content.id = 'dislike' + post.post_id;
                        button_content.innerHTML = parseInt(button_content.innerHTML) + 1;
                    }
                    post.is_liked = !post.is_liked;
                });
            });
            document.querySelector('#post_list').append(element);
        });
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
