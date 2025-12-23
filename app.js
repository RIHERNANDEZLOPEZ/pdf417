/** @format */

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const snapButton = document.getElementById("snap");
const photo = document.getElementById("photo");
const constraints = { video: { width: 800, height: 600 } }; // Define resolución (opcional)

// 1. Solicitar acceso a la cámara
navigator.mediaDevices
  .getUserMedia(constraints)
  .then(function (stream) {
    video.srcObject = stream; // Muestra la transmisión en el elemento <video>
    video.play();
  })
  .catch(function (err) {
    console.error("Error al acceder a la cámara: ", err);
    document.querySelector("span#errorMsg").innerHTML = `Error: ${err.name}`;
  });

// 2. Evento para tomar la foto
snapButton.addEventListener("click", function () {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  // Dibuja el fotograma actual del video en el canvas
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convierte el contenido del canvas a una URL de imagen
  photo.src = canvas.toDataURL("image/png");
  photo.style.display = "block"; // Muestra la imagen
});
