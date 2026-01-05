/**
 * Lesson Page - AI Chat Learning
 */

import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Loader2, Bot, User, BookOpen, CheckCircle, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { contentApi, learningApi } from '../services/api';
import toast from 'react-hot-toast';
import './Lesson.css';

interface Message {
  id: string;
  senderType: 'student' | 'ai' | 'system';
  content: string;
  createdAt: string;
}

export function Lesson() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { student } = useAuthStore();
  
  const [topic, setTopic] = useState<any>(null);
  const [content, setContent] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (topicId && student?.id) {
      loadTopicAndStartSession();
    }
  }, [topicId, student?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamedContent]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadTopicAndStartSession = async () => {
    if (!topicId || !student?.id) return;

    setLoading(true);
    try {
      // Load topic
      const topicRes = await contentApi.topics.getById(topicId);
      if (topicRes.success) {
        setTopic(topicRes.data);
      }

      // Load content
      const contentRes = await contentApi.topics.getContent(topicId);
      if (contentRes.success) {
        setContent(contentRes.data || []);
      }

      // Start session
      const sessionRes = await learningApi.startSession(student.id, topicId, 'learning');
      if (sessionRes.success) {
        setSession(sessionRes.data);
        
        // Load existing messages
        const messagesRes = await learningApi.getMessages(sessionRes.data.id);
        if (messagesRes.success && messagesRes.data.length > 0) {
          setMessages(messagesRes.data);
        } else {
          // Add welcome message
          addWelcomeMessage(topicRes.data, contentRes.data || []);
        }
      }
    } catch (error) {
      console.error('Failed to load lesson:', error);
      toast.error('Failed to load lesson');
    } finally {
      setLoading(false);
    }
  };

  const addWelcomeMessage = (topicData: any, contentData: any[]) => {
    const welcomeMsg: Message = {
      id: 'welcome',
      senderType: 'ai',
      content: `Hello! 👋 I'm your AI tutor. Today we'll learn about "${topicData?.topicTitle || 'this topic'}". Feel free to ask me any questions!\n\nLet me start by explaining the key concepts...`,
      createdAt: new Date().toISOString(),
    };
    setMessages([welcomeMsg]);
    
    // Stream the teaching content
    if (topicData && student) {
      streamTeachingContent(topicData, contentData);
    }
  };

  const streamTeachingContent = async (topicData: any, contentData: any[]) => {
    if (!topicData || !student) return;

    setStreaming(true);
    setStreamedContent('');

    try {
      const contentText = contentData.map(c => c.content).join('\n\n');
      
      const generator = learningApi.streamTeaching(
        student.studentName,
        student.class?.displayName || 'Student',
        topicData.chapter?.book?.subject?.displayName || 'Subject',
        topicData.topicTitle,
        contentText || topicData.description || 'Teach this topic',
        (text) => {
          setStreamedContent(prev => prev + text);
        }
      );

      let fullContent = '';
      for await (const chunk of generator) {
        fullContent += chunk;
      }

      // Add the streamed content as a message
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        senderType: 'ai',
        content: fullContent,
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev.filter(m => m.id !== 'welcome'), aiMsg]);
      setStreamedContent('');
    } catch (error) {
      console.error('Streaming error:', error);
      // Fallback to regular content
      const fallbackMsg: Message = {
        id: `ai-${Date.now()}`,
        senderType: 'ai',
        content: contentData.map(c => c.content).join('\n\n') || topicData.description || 'Let me explain this topic to you.',
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev.filter(m => m.id !== 'welcome'), fallbackMsg]);
    } finally {
      setStreaming(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !session?.id || sending) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      senderType: 'student',
      content: inputMessage,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setSending(true);

    try {
      const response = await learningApi.sendMessage(session.id, inputMessage, 'text');
      if (response.success) {
        const aiMessage: Message = {
          id: response.data.aiMessage.id,
          senderType: 'ai',
          content: response.data.aiMessage.content,
          createdAt: response.data.aiMessage.createdAt,
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error: any) {
      toast.error('Failed to send message');
      console.error('Send message error:', error);
    } finally {
      setSending(false);
    }
  };

  const handleEndSession = async () => {
    if (!session?.id) {
      navigate(-1);
      return;
    }

    try {
      await learningApi.endSession(session.id, 10);
      await learningApi.updateProgress(student!.id, topicId!, 100, 'mastered');
      toast.success('Lesson completed! +10 XP');
      navigate(-1);
    } catch (error) {
      console.error('End session error:', error);
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div className="lesson-loading">
        <div className="loading-spinner"></div>
        <p>Preparing your lesson...</p>
      </div>
    );
  }

  return (
    <div className="lesson-page">
      {/* Header */}
      <header className="lesson-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div className="lesson-title">
          <h1>{topic?.topicTitle || 'Lesson'}</h1>
          <p>{topic?.chapter?.chapterTitle}</p>
        </div>
        <button className="complete-btn" onClick={handleEndSession}>
          <CheckCircle size={20} />
          Complete
        </button>
      </header>

      {/* Chat Container */}
      <div className="chat-container" ref={chatContainerRef}>
        <div className="messages-list">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.senderType === 'student' ? 'user' : 'ai'}`}
            >
              <div className="message-avatar">
                {message.senderType === 'student' ? (
                  <User size={18} />
                ) : (
                  <Bot size={18} />
                )}
              </div>
              <div className="message-content">
                <div className="message-text">{message.content}</div>
              </div>
            </div>
          ))}

          {/* Streaming content */}
          {streaming && streamedContent && (
            <div className="message ai">
              <div className="message-avatar">
                <Bot size={18} />
              </div>
              <div className="message-content">
                <div className="message-text">{streamedContent}</div>
              </div>
            </div>
          )}

          {/* Typing indicator */}
          {(sending || (streaming && !streamedContent)) && (
            <div className="message ai">
              <div className="message-avatar">
                <Bot size={18} />
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Ask a question..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={sending || streaming}
        />
        <button type="submit" disabled={!inputMessage.trim() || sending || streaming}>
          {sending ? <Loader2 size={20} className="spinner" /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
}

export default Lesson;
