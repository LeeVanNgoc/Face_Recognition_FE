import React, { useRef, useState, useEffect } from 'react';
import './WebcamCapture.css';

export default function WebcamCapture() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [isRecording, setIsRecording] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState(""); // 👉 Thêm input cho tên

  useEffect(() => {
    if (isRecording) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }).catch(err => {
        setErrorMessage("Không thể truy cập webcam.");
        console.error("Webcam error:", err);
      });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isRecording]);

  const toggleRecording = () => {
    setIsRecording(prev => !prev);
  };

  const captureAndEnroll = async () => {
    try {
      if (!name.trim()) {
        setErrorMessage("Bạn cần nhập tên để đăng ký.");
        return;
      }

      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise(resolve =>
        canvas.toBlob(resolve, "image/jpeg")
      );

      const formData = new FormData();
      formData.append("image", blob, "face.jpg");
      formData.append("name", name);

      const res = await fetch("http://localhost:5001/api/enroll", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Lỗi server: ${res.statusText}`);
      }

      const data = await res.json();
      console.log(data);
      setErrorMessage("");
      alert("🟢 Đã đăng ký thành công!");
    } catch (error) {
      setErrorMessage("Lỗi khi gửi dữ liệu đến server.");
      console.error("Enroll error:", error);
    }
  };

  const handleStartStop = () => {
    if (!isRecording) {
      toggleRecording();
    }

    if (isRecording) {
      captureAndEnroll();
    }
  };

  return (
    <div className="webcam-container">
      <header className="webcam-header">
        <h1>Đăng Ký Khuôn Mặt Mới</h1>
        <p className="header-description">
          Nhập tên và chụp ảnh từ webcam để thêm vào hệ thống nhận diện.
        </p>
      </header>

      <div className="webcam-frame">
        <video ref={videoRef} width="640" height="480" className="webcam-video" />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        <div className="input-group">
          <input
            type="text"
            placeholder="Nhập tên bạn"
            value={name}
            onChange={e => setName(e.target.value)}
            className="name-input"
          />
        </div>

        <div className="controls">
          <button className="start-stop-btn" onClick={handleStartStop}>
            {isRecording ? "Chụp & Đăng Ký" : "Bật Webcam"}
          </button>
        </div>

        {errorMessage && (
          <div className="error-message">
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
  