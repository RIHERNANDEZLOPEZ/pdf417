/** @format */

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const photo = document.getElementById("photo");
const snap = document.getElementById("snap");

const brightness = document.getElementById("brightness");
const contrast = document.getElementById("contrast");
const grayscale = document.getElementById("grayscale");
const quality = document.getElementById("quality");

// Escala de grises activada por defecto
grayscale.checked = true;

// Encender la cámara con la máxima calidad posible permitida por el hardware
navigator.mediaDevices
  .getUserMedia({
    video: {
      width: { max: 9999 },
      height: { max: 9999 },
      frameRate: { max: 60 },
    },
  })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => {
    alert("No se pudo acceder a la cámara: " + err);
  });

// Actualiza el filtro del video en vivo
function updateVideoFilter() {
  let filters = [];
  filters.push(`brightness(${brightness.value})`);
  filters.push(`contrast(${contrast.value})`);
  if (grayscale.checked) filters.push("grayscale(1)");
  video.style.filter = filters.join(" ");
}

// Listeners para los controles
[brightness, contrast, grayscale].forEach((ctrl) => {
  ctrl.addEventListener("input", updateVideoFilter);
});
updateVideoFilter();

// Tomar foto y aplicar filtros a la imagen capturada
snap.addEventListener("click", () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");

  // Aplica los mismos filtros al canvas
  let filters = [];
  filters.push(`brightness(${brightness.value})`);
  filters.push(`contrast(${contrast.value})`);
  if (grayscale.checked) filters.push("grayscale(1)");
  ctx.filter = filters.join(" ");

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Calidad de la imagen (JPEG)
  const imgQuality = parseFloat(quality.value);
  photo.src = canvas.toDataURL("image/jpeg", imgQuality);
});
