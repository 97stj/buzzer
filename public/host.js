//import { json } from "express"

const socket = io()
const active = document.querySelector('.js-active')
const buzzList = document.querySelector('.js-buzzes')
const clear = document.querySelector('.js-clear')

socket.on('active', (users) => {
  active.innerText = `${users} joined`
})

socket.on('buzzes', (buzzes) => {
  buzzList.innerHTML = buzzes
    .map(buzz => {
      const p = buzz.split('-')
      return { name: p[0]}
    })
    .map(user => `<li>${user.name}</br> </li>`)
    .join('')
})

clear.addEventListener('click', () => {
  socket.emit('clear')
})

