export function view_posts(user = null, follows = false){
    document.querySelector('#post_list').innerHTML = '';

    fetch(`/list?user=${user}&follows=${follows}`)
    .then(response => response.json())
    .then(data => {
        data.forEach(post => {
            const element = document.createElement('div');
            element.classList.add('post')
 
            let name_header = `<h3>${post.creator}</h3>`;
            if (src == 'index'){name_header = `<a href = "/profile/${post.id}">${name_header}</a>`;}
            element.innerHTML = `
            ${name_header}
            <p style="font-weight: lighter;">${post.posted}</p>
            <p>${post.content}</p>
            <p id = "likes">${post.likes}</p>`;
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
