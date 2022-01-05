const socket = io()     //Send events


const $messageForm = document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector("input")
const $messageFormButton = $messageForm.querySelector("button")
const $messages = document.querySelector("#messages")

// Template
const messageTemplate = document.querySelector("#message-template").innerHTML
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML

socket.on("message",(message) =>{
    console.log(message);
    const html = Mustache.render(messageTemplate,{
        message : message.text,
        createdAt: moment(message.createdAt).format("h:mm a")
    })
    $messages.insertAdjacentHTML("beforeend", html)
})

socket.on("locationMessage", (url)=>{
    console.log(url);
    const html = Mustache.render(locationMessageTemplate,{
        url
    })
    $messages.insertAdjacentHTML("beforeend", html)
})

$messageForm.addEventListener("submit",(e)=>{

    e.preventDefault()

    $messageFormButton.setAttribute("disabled","disabled")

    // const message = document.querySelector("input").value  // another select method below (html input tag)
    const message = e.target.elements.message.value

    socket.emit("sendMessage", message,(error)=>{
        $messageFormButton.removeAttribute("disabled")
        $messageFormInput.value = ""
        $messageForm.focus()

        if(error){
            return console.log(error);
        }
        console.log("Message delivered");
    })
})

document.querySelector("#send-location").addEventListener("click",()=>{
    if(!navigator.geolocation){
        return alert("Geolocatin not supported by your Browser")
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit("sendLocation",{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },() => {
            console.log("Location shared!");
        })
    })
})

console.log();
console.log();








// socket.on("countUpdated",(count) => {
//     console.log("The count has been updated!", count);
// })   //Recive events

// document.querySelector("#increment").addEventListener("click", ()=>{
//     console.log("clicked!");
//     socket.emit("increment")
// })