import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  Clock,
  X,
} from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'payment' | 'shift' | 'info';
  read: boolean;
}

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'Custódia Escrow Bloqueada',
      message: 'O pagamento do seu plantão de 4h (R$ 57,60) foi retido com sucesso e será liberado após o check-out.',
      time: 'Há 10 min',
      type: 'payment',
      read: false,
    },
    {
      id: 'n2',
      title: 'Check-in Realizado',
      message: 'Dra. Camila Ribeiro chegou ao endereço e registrou presença no local.',
      time: 'Há 35 min',
      type: 'shift',
      read: false,
    },
    {
      id: 'n3',
      title: 'Selo Nível 3 Renovado',
      message: 'Sua certidão judicial e antecedentes criminais foram auditados com sucesso.',
      time: 'Hoje, 09:00',
      type: 'info',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      {/* Botão do Sininho */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
        title="Central de Notificações"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown de Notificações */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-zinc-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3.5 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-zinc-900 font-display">Notificações</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#96382B]/10 text-[#96382B]">
                  {unreadCount} novas
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-[#96382B] hover:underline cursor-pointer"
              >
                Marcar lidas
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 flex items-start gap-3 transition-colors ${
                  item.read ? 'bg-white' : 'bg-amber-50/40'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {item.type === 'payment' && (
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  )}
                  {item.type === 'shift' && (
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                  )}
                  {item.type === 'info' && (
                    <div className="w-7 h-7 rounded-full bg-[#96382B]/10 text-[#96382B] flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-zinc-900">{item.title}</h4>
                    <span className="text-[10px] text-zinc-400">{item.time}</span>
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-snug">{item.message}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2 border-t border-zinc-100 text-center bg-zinc-50">
            <span className="text-[10px] text-zinc-400 font-medium">
              Notificações de plantões ativos e custódia em tempo real
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
