import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./Styles_Console.css";

const MAX_MESSAGES = 200;

const PageConsole = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = io("http://153.19.55.87:5000"); // URL do serwera Flask

    // Fetch initial messages from the backend
    fetch("http://153.19.55.87:5000/get_console_messages")
      .then((response) => response.json())
      .then((data) => setMessages(data));

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("console_message", (message) => {
      setMessages((prevMessages) => {
        const updatedMessages = [message.message, ...prevMessages];
        if (updatedMessages.length > MAX_MESSAGES) {
          updatedMessages.pop();
        }
        return updatedMessages;
      });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Messages</h1>
      <table className="table">
        <thead>
          <tr>
            <th className="th">Message</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg, index) => (
            <tr key={index}>
              <td className="td">{msg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PageConsole;
