// App.js
import React, { useState, useEffect } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch("http://localhost:5001/api/messages")
      .then(res => res.json())
      .then(data => setMessages(data));
  }, []);

  const sendMessage = () => {
    fetch("http://localhost:5001/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }).then(() => {
      setMessages([...messages, { text }]);
      setText("");
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Tin nhắn</h2>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg.text}</li>
        ))}
      </ul>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={sendMessage}>Gửi</button>
    </div>
  );
}

export default App;
