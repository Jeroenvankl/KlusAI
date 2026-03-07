'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { chatHelp } from '@/lib/api-client';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const WELCOME_MESSAGE: Message = {
  role: 'ai',
  text: 'Hallo! Ik ben je AI klus-assistent. Stel me een vraag over je verbouwing, gereedschap, materialen of technieken. Ik help je graag op weg!',
};

const QUICK_SUGGESTIONS = [
  'Hoe verf ik een muur?',
  'Welk gereedschap heb ik nodig?',
  'Veiligheidstips',
  'Hoe leg ik laminaat?',
  'Hoe hang ik planken op?',
];

export default function LiveHulpPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { response } = await chatHelp(trimmed);
      const aiMessage: Message = { role: 'ai', text: response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const errorMessage: Message = {
        role: 'ai',
        text: 'Sorry, er ging iets mis bij het verwerken van je vraag. Probeer het opnieuw.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-dvh bg-[#F5F6FA]">
      <PageHeader
        title="Live Hulp"
        subtitle="Stel een vraag over je klus"
        icon={MessageSquare}
        gradient={['#E67E22', '#F39C12'] as const}
      />

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-[#E67E22] to-[#F39C12] text-white rounded-br-md'
                  : 'bg-white text-[#1A1A2E] border border-[#E5E7EB] rounded-bl-md shadow-sm'
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white text-[#6B7280] border border-[#E5E7EB] rounded-2xl rounded-bl-md px-4 py-3 shadow-sm flex items-center gap-2 text-sm">
              <Loader2 size={16} className="animate-spin text-[#E67E22]" />
              Aan het nadenken...
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions - only show when few messages */}
      {messages.length <= 1 && !isLoading && (
        <div className="px-4 pb-3">
          <p className="text-xs text-[#6B7280] mb-2">Snelle suggesties</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => sendMessage(suggestion)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-[#E5E7EB] text-[#1A1A2E] hover:border-[#E67E22] hover:text-[#E67E22] transition-colors shadow-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="px-4 py-3 bg-white border-t border-[#E5E7EB]">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Stel een vraag over je klus..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-[#F5F6FA] rounded-xl text-sm text-[#1A1A2E] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#E67E22]/40 border border-[#E5E7EB] disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl text-white transition-opacity disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #E67E22, #F39C12)' }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
