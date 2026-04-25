import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import axios from 'axios';

const Support = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/support/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post('http://localhost:5000/api/support/messages', {
        message: newMessage
      });
      
      setNewMessage('');
      await fetchMessages();
      
      // Simulate bot response
      setTimeout(async () => {
        const botResponses = [
          "Thank you for your message. Our team will assist you shortly.",
          "I understand your concern. Let me check that for you.",
          "Your request has been noted. Is there anything else I can help with?"
        ];
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
        
        // In a real app, this would come from the backend
        setMessages(prev => [...prev, {
          id: Date.now(),
          message: randomResponse,
          sender: 'bot',
          created_at: new Date().toISOString()
        }]);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="bg-white py-3 px-4 d-flex justify-content-between align-items-center shadow-sm">
        <button 
          className="btn btn-light rounded-circle"
          onClick={() => navigate('/home')}
        >
          <ArrowLeft size={20} />
        </button>
        <h5 className="mb-0 fw-bold">Customer Support</h5>
        <button className="btn btn-light rounded-circle">
          ⋮
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow-1 p-3" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 180px)' }}>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : ''}`}
            >
              {msg.sender !== 'user' && (
                <div 
                  className="rounded-circle bg-secondary me-2 d-flex align-items-center justify-content-center"
                  style={{ width: '35px', height: '35px', flexShrink: 0, color: 'white' }}
                >
                  AI
                </div>
              )}
              <div 
                className="p-3 rounded-3"
                style={{
                  maxWidth: '70%',
                  backgroundColor: msg.sender === 'user' ? '#ff6b6b' : 'white',
                  color: msg.sender === 'user' ? 'white' : 'black',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}
              >
                {msg.message}
                <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.7 }}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {msg.sender === 'user' && (
                <div 
                  className="rounded-circle ms-2 d-flex align-items-center justify-content-center"
                  style={{ 
                    width: '35px', 
                    height: '35px', 
                    flexShrink: 0,
                    backgroundColor: '#ff6b6b',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  U
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white p-3 border-top">
        <form onSubmit={handleSendMessage} className="d-flex gap-2">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{ borderRadius: '25px' }}
          />
          <button 
            type="submit"
            className="btn btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: '45px', height: '45px' }}
            disabled={!newMessage.trim()}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Support;