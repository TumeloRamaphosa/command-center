#!/usr/bin/env node
/**
 * Command Center - Naledi Nexus
 * Desktop + Mobile friendly with TTS/STT
 * Freedom Day Theme - Orange & Black
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, MicOff, Send, Terminal, Cpu, Zap,
  Users, BarChart3, MessageSquare, Settings,
  ChevronRight, Play, Pause, Volume2, VolumeX,
  SouthAfricaFlag, Sparkles, Rocket, Code2
} from 'lucide-react';

// TTS using Web Speech API (free, built-in)
function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  
  useEffect(() => {
    setSupported('speechSynthesis' in window);
  }, []);
  
  const speak = (text: string) => {
    if (!supported) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };
  
  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };
  
  return { speak, stop, speaking, supported };
}

// STT using Web Speech API (free, built-in)
function useSTT() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSupported(!!SpeechRecognition);
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-ZA'; // South African English
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
        }
      };
      
      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);
      
      recognitionRef.current = recognition;
    }
  }, []);
  
  const start = () => {
    if (recognitionRef.current) {
      setTranscript('');
      recognitionRef.current.start();
      setListening(true);
    }
  };
  
  const stop = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };
  
  return { start, stop, listening, transcript, supported };
}

// 9 Chiefs data
const CHIEFS = [
  { id: 'researcher', name: 'Researcher Chief', icon: BarChart3, status: 'active', task: 'Market analysis', color: 'bg-blue-500' },
  { id: 'coder', name: 'Coder Chief', icon: Code2, status: 'coding', task: 'Dark Factory deploy', color: 'bg-green-500' },
  { id: 'heartbeat', name: 'Heartbeat Chief', icon: Cpu, status: 'monitoring', task: 'System health', color: 'bg-yellow-500' },
  { id: 'content', name: 'Content Chief', icon: Sparkles, status: 'generating', task: '740 posts ready', color: 'bg-purple-500' },
  { id: 'strategy', name: 'Strategy Chief', icon: Rocket, status: 'planning', task: 'Q3 roadmap', color: 'bg-red-500' },
  { id: 'operations', name: 'Operations Chief', icon: Terminal, status: 'active', task: 'Orchestrating', color: 'bg-orange-500' },
  { id: 'data', name: 'Data Chief', icon: BarChart3, status: 'analyzing', task: 'Studex metrics', color: 'bg-cyan-500' },
  { id: 'security', name: 'Security Chief', icon: Settings, status: 'guarding', task: 'Threat detection', color: 'bg-zinc-500' },
  { id: 'integrations', name: 'Integrations Chief', icon: Zap, status: 'connecting', task: 'Stitch Money API', color: 'bg-indigo-500' },
];

export default function CommandCenter() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: 'Sharp, Agent Lord. 9 Chiefs standing by. Freedom Day campaign loaded. What are we building today?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const { speak, stop, speaking, supported: ttsSupported } = useTTS();
  const { start: startListening, stop: stopListening, listening, transcript, supported: sttSupported } = useSTT();
  
  // Auto-add STT transcript to input
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);
  
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI response
    await new Promise(r => setTimeout(r, 1500));
    
    const responses = [
      "Chief Operations executing. Dark Factory deployed to Vercel. Stitch Money content queued. Freedom Day campaign ready.",
      "On it, Agent Lord. Generating 740 content pieces. ComfyUI + LTX installing for unlimited local generation.",
      "9 Chiefs synchronized. Discord bot starting. Slack token acquisition queued. BMAD protocol active.",
      "Roger. Command Center mobile-responsive. TTS/STT enabled. Desktop and mobile operations ready.",
      "Lekker. Birthday content generated: 10 posts, 4 images. 500 more batching via Pollinations."
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    const aiMsg = { role: 'assistant', content: response, timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
    
    // Auto-speak response
    if (ttsSupported) {
      speak(response);
    }
  };
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Terminal },
    { id: 'chiefs', label: '9 Chiefs', icon: Users },
    { id: 'content', label: 'Content', icon: Sparkles },
    { id: 'builds', label: 'Builds', icon: Rocket },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Freedom Day Theme - Orange Accents */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          className="w-20 lg:w-64 bg-black/50 border-r border-orange-500/20 backdrop-blur-xl flex flex-col"
        >
          <div className="p-4 border-b border-orange-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Terminal className="w-5 h-5" />
              </div>
              <div className="hidden lg:block">
                <h1 className="font-bold text-lg">Command Center</h1>
                <p className="text-xs text-orange-400">Naledi Nexus</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'text-zinc-400 hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden lg:block font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
          
          <div className="p-4 border-t border-orange-500/20">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="hidden lg:block">System Online</span>
            </div>
          </div>
        </motion.aside>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-16 border-b border-orange-500/20 bg-black/30 backdrop-blur-xl flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <span className="text-orange-400 font-mono text-sm">27 APRIL 2026</span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-400 text-sm">Freedom Day + Birthday</span>
            </div>
            
            <div className="flex items-center gap-3">
              {ttsSupported && (
                <button
                  onClick={() => speaking ? stop() : null}
                  className={`p-2 rounded-lg transition-colors ${speaking ? 'bg-orange-500/20 text-orange-400' : 'text-zinc-400'}`}
                >
                  {speaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              )}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-sm font-bold">
                TR
              </div>
            </div>
          </header>
          
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-orange-500 text-white'
                      : 'bg-zinc-800 border border-zinc-700'
                  }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <div className={`text-xs mt-2 ${
                      msg.role === 'user' ? 'text-orange-200' : 'text-zinc-500'
                    }`}>
                      {msg.timestamp.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-2xl">
                    <div className="flex gap-1">
                      {[1, 2, 3].map(i => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                          className="w-2 h-2 bg-orange-400 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Input Area */}
          <div className="p-4 border-t border-orange-500/20 bg-black/30">
            <div className="flex gap-3">
              {sttSupported && (
                <button
                  onClick={listening ? stopListening : startListening}
                  className={`p-3 rounded-xl transition-all ${
                    listening
                      ? 'bg-red-500/20 text-red-400 animate-pulse'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {listening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
              )}
              
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={listening ? 'Listening...' : 'Command the 9 Chiefs...'}
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500/50"
              />
              
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-400 hover:to-orange-500 transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex gap-2 mt-3 text-xs text-zinc-500">
              <span className="px-2 py-1 bg-zinc-800 rounded">TTS: {ttsSupported ? '✓' : '✗'}</span>
              <span className="px-2 py-1 bg-zinc-800 rounded">STT: {sttSupported ? '✓' : '✗'}</span>
              <span className="px-2 py-1 bg-zinc-800 rounded">9 Chiefs: Online</span>
              <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded">Freedom Day</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
