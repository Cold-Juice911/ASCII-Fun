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
                adjustCanvasAndConvertToAscii(img);
            };
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please upload an image file!");
    }
});

function adjustCanvasAndConvertToAscii(image) {
    const targetWidth = 1920; // 1080p resolution width
    const targetHeight = 1080; // 1080p resolution height

    // Calculate scaling factors to maintain aspect ratio
    const scaleX = targetWidth / image.width;
    const scaleY = targetHeight / image.height;
    const scale = Math.min(scaleX, scaleY); // Scale to fit within the 1080p resolution

    // Calculate new dimensions
    const newWidth = image.width * scale;
    const newHeight = image.height * scale;

    // Set canvas dimensions to 1080p resolution
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Clear the canvas and set a dark background color
    ctx.fillStyle = '#000000'; // Dark background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the image onto the canvas, scaled to fit within 1080p resolution
    ctx.drawImage(image, 0, 0, image.width, image.height, 
        (targetWidth - newWidth) / 2, 
        (targetHeight - newHeight) / 2, 
        newWidth, newHeight);

    // Get image data from canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Clear the canvas again
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set font size and style
    const fontSize = 12; // Adjust font size for better visibility
    ctx.font = `${fontSize}px Courier New`;
    ctx.textBaseline = 'top';

    // Iterate over the image data to create colored ASCII art
    for (let y = 0; y < canvas.height; y += fontSize) {
        for (let x = 0; x < canvas.width; x += fontSize) {
            const offset = (y * canvas.width + x) * 4;
            const red = imageData.data[offset];
            const green = imageData.data[offset + 1];
            const blue = imageData.data[offset + 2];

            // Calculate brightness and map to ASCII character
            const brightness = (red + green + blue) / 3;
            const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1));
            const asciiChar = asciiChars[charIndex];

            // Set the fill style to the pixel's original RGB color
            ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;

            // Draw the colored ASCII character with an outline
            ctx.strokeStyle = '#000'; // Black outline for contrast
            ctx.lineWidth = 1; // Outline thickness
            ctx.strokeText(asciiChar, x, y);
            ctx.fillText(asciiChar, x, y);
        }
    }

    downloadButton.hidden = false;
}

// Function to download the colored ASCII image as a JPEG
downloadButton.addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL('image/jpeg', 0.9); // Adjust quality (0.0 to 1.0)
    link.download = 'colored-ascii-art.jpg';
    link.click();
});
