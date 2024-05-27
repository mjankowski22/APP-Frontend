import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import styles from './WebSocketComponent.module.css';

const MAX_MESSAGES = 200;

const WebSocketComponent = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:5000'); // URL do serwera Flask

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('console_message', (message) => {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, message.message];
        if (updatedMessages.length > MAX_MESSAGES) {
          updatedMessages.shift(); // Usuwa najstarszy element
        }
        return updatedMessages;
      });
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Messages</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Message</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg, index) => (
            <tr key={index}>
              <td className={styles.td}>{msg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WebSocketComponent;