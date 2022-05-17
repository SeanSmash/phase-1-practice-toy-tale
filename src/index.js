let addToy = false;
const createToy = document.querySelector('input.submit')

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const form = document.querySelector(".add-toy-form")

  form.addEventListener('submit', createNewToy)

  document.addEventListener('click', (e) =>{
    if(e.target.matches('.like-btn')){
      updateLikes(e)
    }
  })

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  getToys()
})

function getToys(){
  fetch('http://localhost:3000/toys')
  .then(resp => resp.json())
  .then(data => {
    data.forEach(toy => makeToy(toy))
  })
}

function makeToy(toy){
  const toyCollection = document.querySelector('#toy-collection')
  const d = document.createElement('div')
  d.className = 'card'
  toyCollection.append(d)
  const name = document.createElement('h2')
  name.textContent = toy.name
  const toyImage = document.createElement('img')
  toyImage.src = toy.image
  toyImage.className = 'toy-avatar'
  const p = document.createElement('p')
  p.textContent = `${toy.likes} likes`
  p.id = toy.id
  const likeBtn = document.createElement('button')
  likeBtn.className = 'like-btn'
  likeBtn.id = toy.id
  likeBtn.innerHTML = `Like &#9829`
  d.append(name, toyImage, p, likeBtn)
}

function createNewToy(e){
  e.preventDefault()
  const [toyName, toyImage] = e.target
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      'name': toyName.value,
      'image': toyImage.value,
      'likes': 0
    })
    })
  .then(resp => resp.json())
  .then(data => makeToy(data))
  e.target.reset()
}

function updateLikes(e){
  e.preventDefault()
  fetch(`http://localhost:3000/toys/${e.target.id}`, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      'likes': parseInt(e.target.parentElement.children[2].textContent.split(" ")[0], 10) +1
    })
})
  .then(resp => resp.json())
  .then(data =>{
    const p = document.getElementById(data.id)
    p.textContent = `${data.likes} likes`
  })
}