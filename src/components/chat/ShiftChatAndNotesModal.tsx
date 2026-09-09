import React, { useState } from 'react';
import {
  Send,
  ShieldAlert,
  Clock,
  CheckCircle2,
  X,
  MessageCircle,
  FileText,
  User,
  AlertTriangle,
} from 'lucide-react';
import { CaregiverWithDetails } from '../../types/database';

interface ShiftChatAndNotesModalProps {
  caregiver: CaregiverWithDetails;
  familyName?: string;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'family' | 'caregiver' | 'system';
  text: string;
  timestamp: string;
  isRoutineNote?: boolean;
}

export const ShiftChatAndNotesModal: React.FC<ShiftChatAndNotesModalProps> = ({
  caregiver,
  familyName = 'Família Oliveira',
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'chat' | 'routine'>('chat');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'system',
      text: '🛡️ Plantão protegido pelo Seguro TuttiZelo. Mensagens monitoradas para segurança de ambas as partes.',
      timestamp: '14:00',
    },
    {
      id: 'm2',
      sender: 'family',
      text: `Olá ${caregiver.full_name}! Já deixamos a rotina descrita na aba de cuidados. Qualquer dúvida estamos à disposição!`,
      timestamp: '14:02',
    },
    {
      id: 'm3',
      sender: 'caregiver',
      text: 'Boa tarde! Cheguei pontualmente e já realizei o check-in no aplicativo. Podem ficar tranquilos!',
      timestamp: '14:05',
    },
  ]);

  const [routineNotes, setRoutineNotes] = useState([
    { id: 'r1', time: '14:15', note: 'Chegada e higienização das mãos. Apresentação amigável.', status: 'completed' },
    { id: 'r2', time: '15:30', note: 'Lanche da tarde servido e hidratação realizada.', status: 'completed' },
    { id: 'r3', time: '16:30', note: 'Atividades recreativas / leitura de livro.', status: 'pending' },
  ]);

  const [newRoutineNote, setNewRoutineNote] = useState('');

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'family',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  const handleAddRoutineNote = () => {
    if (!newRoutineNote.trim()) return;

    setRoutineNotes((prev) => [
      ...prev,
      {
        id: `r-${Date.now()}`,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        note: newRoutineNote.trim(),
        status: 'completed',
      },
    ]);
    setNewRoutineNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-zinc-200 shadow-2xl relative flex flex-col h-[600px] max-h-[90vh]">
        {/* Header do Chat */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={caregiver.avatar_url}
              alt={caregiver.full_name}
              className="w-10 h-10 rounded-full object-cover border border-zinc-200"
            />
            <div>
              <h3 className="text-sm font-bold text-zinc-900">{caregiver.full_name}</h3>
              <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Em plantão ativo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas */}
        <div className="flex border-b border-zinc-100 px-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`py-2.5 px-3 border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'border-[#96382B] text-[#96382B]'
                : 'border-transparent text-zinc-400 hover:text-zinc-600'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat Seguro</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('routine')}
            className={`py-2.5 px-3 border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'routine'
                ? 'border-[#96382B] text-[#96382B]'
                : 'border-transparent text-zinc-400 hover:text-zinc-600'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Diário de Bordo & Rotina</span>
            <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full text-[9px]">Novo</span>
          </button>
        </div>

        {/* CONTEÚDO: CHAT */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Aviso de Proteção */}
            <div className="p-2.5 bg-amber-50 border-b border-amber-100 flex items-center gap-2 text-[11px] text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Nunca realize pagamentos por fora. A custódia protege sua família e o profissional.</span>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.sender === 'family'
                      ? 'justify-end'
                      : m.sender === 'caregiver'
                      ? 'justify-start'
                      : 'justify-center'
                  }`}
                >
                  {m.sender === 'system' ? (
                    <div className="text-[11px] text-zinc-500 bg-zinc-100 px-3 py-1.5 rounded-full text-center max-w-xs">
                      {m.text}
                    </div>
                  ) : (
                    <div
                      className={`max-w-[75%] rounded-2xl p-3 text-xs shadow-2xs space-y-1 ${
                        m.sender === 'family'
                          ? 'bg-[#96382B] text-white rounded-br-xs'
                          : 'bg-zinc-100 text-zinc-800 rounded-bl-xs'
                      }`}
                    >
                      <p>{m.text}</p>
                      <span
                        className={`text-[9px] block text-right ${
                          m.sender === 'family' ? 'text-white/70' : 'text-zinc-400'
                        }`}
                      >
                        {m.timestamp}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input de Mensagem */}
            <div className="p-3 border-t border-zinc-100 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Digite sua mensagem segura..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:border-[#96382B]"
              />
              <button
                type="button"
                onClick={handleSendMessage}
                className="p-2 rounded-xl bg-[#96382B] text-white hover:bg-[#7D2E23] transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* CONTEÚDO: DIÁRIO DE BORDO & ROTINA */}
        {activeTab === 'routine' && (
          <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-zinc-900">Acompanhamento em Tempo Real do Plantão</h4>
              <p className="text-[11px] text-zinc-500">
                Registros de alimentação, remédios e bem-estar durante a estadia.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5">
              {routineNotes.map((r) => (
                <div
                  key={r.id}
                  className="p-3 rounded-xl border border-zinc-200 bg-zinc-50/70 flex items-start gap-3"
                >
                  <Clock className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        {r.time}
                      </span>
                      {r.status === 'completed' && (
                        <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Registrado
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-800 mt-1 font-medium">{r.note}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Adicionar Nota de Rotina */}
            <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-2">
              <span className="text-[11px] font-bold text-zinc-700">Adicionar registro ao diário:</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newRoutineNote}
                  onChange={(e) => setNewRoutineNote(e.target.value)}
                  placeholder="Ex: Medicação administrada, dormindo..."
                  className="flex-1 px-3 py-1.5 rounded-xl border border-zinc-200 text-xs bg-white focus:outline-none focus:border-[#96382B]"
                />
                <button
                  type="button"
                  onClick={handleAddRoutineNote}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors cursor-pointer"
                >
                  Registrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
