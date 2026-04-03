import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Paper,
  Avatar,
  Chip,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Stethoscope,
  Minimize2,
  AlertCircle,
} from 'lucide-react';

// ─── Gemini API Config ────────────────────────────────────────────
const GEMINI_API_KEY = 'AIzaSyC6MAWPFSGo78Bmf0z_CLlgTNxW3u3XuwA';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Quick suggestion chips
const quickSuggestions = [
  { label: '🚨 Emergency', text: 'emergency numbers' },
  { label: '🏥 Find Hospital', text: 'how to find hospitals near me' },
  { label: '🤒 Symptom Check', text: 'I have some health symptoms' },
  { label: '💰 Hospital Costs', text: 'how can I compare costs' },
  { label: '📱 About App', text: 'what does this app do' },
];

const HealthChatbot = () => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '👋 **Namaste! I\'m your Smart Hospital AI Assistant!**\n\nI can help you with health guidance, finding hospitals, and understanding app features.\n\n*Note: I am an AI, not a doctor. Always consult a professional for serious issues.*',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // ─── AI Response Logic ──────────────────────────────────────────
  const getAIResponse = async (userMessage) => {
    try {
      const systemPrompt = `You are "SmartCare", the primary AI medical assistant for the Smart Hospital Discovery app. 
      Your goals:
      1. Help users identify which medical specialist to visit based on symptoms.
      2. Explain how to use the app (Dashboard for maps, Search for filtering, Compare costs in hospital details).
      3. For emergencies (chest pain, severe bleeding, etc.), ALWAYS tell them to call 108 immediately.
      4. Use a helpful, professional, and empathetic tone. 
      5. Keep responses concise and use markdown bolding/bullets where appropriate.
      6. If they speak in Hindi/Hinglish, reply in a mix of Hindi and English.
      7. Mention that the app helps find the "Best Rated" and "Most Affordable" hospitals.`;

      const history = messages.slice(-6).map(m => ({
        role: m.sender === 'bot' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            ...history,
            { role: 'user', parts: [{ text: userMessage + "\n\n(System Context: " + systemPrompt + ")" }] }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
          }
        })
      });

      const data = await response.json();
      console.log("Gemini API Response:", data);

      if (data.error) {
        return `⚠️ **API Error:** ${data.error.message || 'Unknown error'}. Please check if your API key is valid and has Gemini API enabled in Google Cloud Console.`;
      }

      if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
        return data.candidates[0].content.parts[0].text;
      }
      return "I'm having trouble connecting to my brain right now. Please try again later.";
    } catch (error) {
      console.error("Gemini API Error details:", error);
      return "Oops! Connection failed. Please check your internet or API key settings.";
    }
  };

  const handleSend = async (text) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { sender: 'user', text: messageText, time: now }]);
    setInputValue('');
    setIsTyping(true);

    const aiResponse = await getAIResponse(messageText);

    setMessages((prev) => [
      ...prev,
      {
        sender: 'bot',
        text: aiResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
    ]);
    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ─── Rendering Helpers ──────────────────────────────────────────
  const renderMessageContent = (text) => {
    return text.split('\n').map((line, i) => {
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');

      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <Typography key={i} variant="body2" sx={{ pl: 1, py: 0.2, fontSize: '0.88rem' }} dangerouslySetInnerHTML={{ __html: formattedLine }} />
        );
      }
      return (
        <Typography key={i} variant="body2" sx={{ mb: line.trim() ? 0.5 : 1, fontSize: '0.88rem' }} dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    });
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <Paper
          elevation={24}
          sx={{
            position: 'fixed',
            bottom: { xs: 80, md: 100 },
            left: { xs: 16, md: 30 },
            width: { xs: 'calc(100% - 32px)', sm: 400 },
            height: { xs: '70vh', md: 550 },
            borderRadius: '24px',
            overflow: 'hidden',
            zIndex: 1100,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
            animation: 'chatSlideIn 0.3s ease-out',
            '@keyframes chatSlideIn': {
              from: { opacity: 0, transform: 'translateY(30px) scale(0.9)' },
              to: { opacity: 1, transform: 'translateY(0) scale(1)' }
            }
          }}
        >
          {/* Header */}
          <Box sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 45, height: 45 }}>
              <Stethoscope size={24} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', lineHeight: 1.2 }}>SmartCare AI</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
                <Typography variant="caption" sx={{ opacity: 0.9 }}>AI Assistant Online</Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
              <Minimize2 size={20} />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <Box sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2.5,
            bgcolor: '#f1f5f9',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
            {messages.map((msg, i) => (
              <Box key={i} sx={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                gap: 1.5,
              }}>
                {msg.sender === 'bot' && <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}><Bot size={18} /></Avatar>}
                <Paper sx={{
                  p: 1.8,
                  maxWidth: '85%',
                  borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  bgcolor: msg.sender === 'user' ? theme.palette.primary.main : 'white',
                  color: msg.sender === 'user' ? 'white' : 'text.primary',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}>
                  {renderMessageContent(msg.text)}
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontSize: '0.65rem', opacity: 0.7, textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                    {msg.time}
                  </Typography>
                </Paper>
                {msg.sender === 'user' && <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.secondary.main }}><User size={18} /></Avatar>}
              </Box>
            ))}

            {isTyping && (
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}><Bot size={18} /></Avatar>
                <Paper sx={{ p: 2, borderRadius: '20px 20px 20px 4px', bgcolor: 'white', display: 'flex', gap: 0.5 }}>
                  <CircularProgress size={16} sx={{ color: theme.palette.primary.main }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1 }}>AI is thinking...</Typography>
                </Paper>
              </Box>
            )}

            {messages.length <= 1 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1.5, display: 'block', fontWeight: 600 }}>Suggested Questions:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {quickSuggestions.map((s, i) => (
                    <Chip key={i} label={s.label} onClick={() => handleSend(s.text)} sx={{ bgcolor: 'white', border: '1px solid #e2e8f0', '&:hover': { bgcolor: theme.palette.primary.lighter, borderColor: theme.palette.primary.main } }} />
                  ))}
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 1.5 }}>
            <TextField
              inputRef={inputRef}
              fullWidth
              placeholder="Ask about symptoms, hospitals, costs..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isTyping}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '15px', bgcolor: '#f8fafc' } }}
            />
            <IconButton
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isTyping}
              sx={{ bgcolor: theme.palette.primary.main, color: 'white', '&:hover': { bgcolor: theme.palette.primary.dark }, '&.Mui-disabled': { bgcolor: '#cbd5e1' } }}
            >
              <Send size={20} />
            </IconButton>
          </Box>
        </Paper>
      )}

      {/* Floating Toggle Button */}
      <Box sx={{ position: 'fixed', bottom: 30, left: 30, zIndex: 1101 }}>
        <Box
          onClick={() => setIsOpen(!isOpen)}
          sx={{
            width: 65, height: 65, borderRadius: '50%',
            background: isOpen ? '#ef4444' : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', boxShadow: '0 8px 30px rgba(0,0,0,0.2)', cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': { transform: 'scale(1.1) rotate(5deg)' }
          }}
        >
          {isOpen ? <X size={28} /> : <MessageCircle size={28} fill="white" />}
        </Box>
      </Box>
    </>
  );
};

export default HealthChatbot;
