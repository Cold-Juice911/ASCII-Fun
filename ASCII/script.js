const imageInput = document.getElementById("imageInput");
const generateButton = document.getElementById("generateButton");
const downloadButton = document.getElementById("downloadButton");
const canvas = document.getElementById("asciiCanvas");
const ctx = canvas.getContext("2d");

// Extended ASCII characters for more sharpness/detail
const asciiChars = ['@', '%', '#', '*', '+', '=', '-', ':', '.', ' ']; 

generateButton.addEventListener("click", () => {
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                convertToAscii(img);
            };
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please upload an image file!");
    }
});

function convertToAscii(image) {
    const canvasWidth = 1280;
    const canvasHeight = 720;

    // Clear the canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Resize and draw the image on the canvas
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);

    // Get image data from canvas
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

    // Clear the canvas again
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Set font size smaller for more details (increase sharpness)
    const fontSize = 6; // Smaller size for sharper output
    ctx.font = `${fontSize}px Courier New`;
    ctx.textBaseline = 'top';

    // Iterate over the image data to create colored ASCII art
    for (let y = 0; y < canvasHeight; y += fontSize) {
        for (let x = 0; x < canvasWidth; x += fontSize) {
            const offset = (y * canvasWidth + x) * 4;
            const red = imageData.data[offset];
            const green = imageData.data[offset + 1];
            const blue = imageData.data[offset + 2];

            // Calculate brightness and map to ASCII character
            const brightness = (red + green + blue) / 3;
            const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1));
            const asciiChar = asciiChars[charIndex];

            // Set the fill style to the pixel's original RGB color
            ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;

            // Draw the colored ASCII character on the canvas
            ctx.fillText(asciiChar, x, y);
        }
    }

    downloadButton.hidden = false;
}

// Function to download the colored ASCII image as a PNG
downloadButton.addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL('image/png');
    link.download = 'colored-ascii-art.png';
    link.click();
});
