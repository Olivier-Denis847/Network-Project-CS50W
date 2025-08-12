function view_posts(){
    document.querySelector('#post_list').innerHTML = '';

    fetch('/list')
    .then(response => response.json())
    .then(data => {
        data.forEach(post => {
            const element = document.createElement('div');
            element.classList.add('post')

            element.innerHTML = `
            <h3>${post.creator}</h3>
            <p style="font-weight: lighter;">${post.posted}</p>
            <p>${post.content}</p>
            <p id = "likes">${post.likes}</p>`;
            document.querySelector('#post_list').append(element);
        });
    });
}

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