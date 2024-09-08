const video = document.getElementById('video');
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
const captureButton = document.getElementById('capture');
const switchCameraButton = document.getElementById('switch-camera');
const photoSection = document.getElementById('photoSection');
const capturedPhoto = document.getElementById('capturedPhoto');
const retakeButton = document.getElementById('retake');
const cameraSection = document.getElementById('cameraSection');

let currentStream;
let currentCameraIndex = 0;
const cameras = [];

// Khởi tạo camera
function initializeCamera() {
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            if (videoDevices.length > 0) {
                cameras.push(...videoDevices);
                startCamera(cameras[currentCameraIndex].deviceId);
            } else {
                console.error('No video devices found.');
            }
        })
        .catch(error => {
            console.error('Error accessing devices:', error);
        });
}

function startCamera(deviceId) {
    navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: deviceId } } })
        .then(stream => {
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
            }
            video.srcObject = stream;
            currentStream = stream;
        })
        .catch(error => {
            console.error('Error accessing camera:', error);
        });
}

// Chuyển đổi camera
switchCameraButton.addEventListener('click', () => {
    if (cameras.length > 1) {
        currentCameraIndex = (currentCameraIndex + 1) % cameras.length;
        startCamera(cameras[currentCameraIndex].deviceId);
    }
});

// Chụp ảnh từ camera
captureButton.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoDataUrl = canvas.toDataURL('image/png');
    capturedPhoto.src = photoDataUrl;
    photoSection.style.display = 'block';
    cameraSection.style.display = 'none';
});

// Chụp lại ảnh
retakeButton.addEventListener('click', () => {
    photoSection.style.display = 'none';
    cameraSection.style.display = 'block';
});

// Khởi tạo camera khi trang web được tải
initializeCamera();
