const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const captureButton = document.getElementById('capture');
const openCameraButton = document.getElementById('openCamera');
const switchCameraButton = document.getElementById('switch-camera');
const cameraSection = document.getElementById('cameraSection');

let currentStream;
let currentCameraIndex = 0;
const cameras = [];

// Khi nhấn nút "Bật camera", hiển thị camera và video
openCameraButton.addEventListener('click', () => {
    cameraSection.style.display = 'block';
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            // Lọc các thiết bị video
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            if (videoDevices.length > 0) {
                cameras.length = 0; // Xóa mảng camera trước khi thêm mới
                cameras.push(...videoDevices); // Lưu các camera vào mảng
                if (cameras.length > 0) {
                    startCamera(cameras[currentCameraIndex].deviceId);
                }
            } else {
                console.error('No video devices found.');
            }
        })
        .catch(error => {
            console.error('Error accessing devices:', error);
        });
});

// Khởi động camera với deviceId cụ thể
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
            alert('Unable to access the selected camera. Please try again.');
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
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
});
