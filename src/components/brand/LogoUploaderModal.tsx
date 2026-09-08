import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2, AlertCircle, X, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { useOfficialLogo } from '../../lib/logoStore';

interface LogoUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoUploaderModal: React.FC<LogoUploaderModalProps> = ({ isOpen, onClose }) => {
  const { logoUrl, saveLogo, resetLogo } = useOfficialLogo();
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(logoUrl);
  const [fileName, setFileName] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecione um arquivo de imagem (.jpg, .png, .jpeg ou .webp).');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewUrl(dataUrl);
      saveLogo(dataUrl);
      setSuccessMessage(`Imagem "${file.name}" aplicada com sucesso em 100% da plataforma!`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleReset = () => {
    resetLogo();
    setPreviewUrl(null);
    setFileName(null);
    setSuccessMessage('Logo redefinida para a versão padrão.');
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-[#FDF6F4] text-[#96382B] border border-[#F5D8D0]">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 font-display">
              Carregar Imagem Original da Logo
            </h3>
            <p className="text-xs text-zinc-500">
              Exibe exatamente o seu arquivo original sem qualquer alteração de traço ou cor.
            </p>
          </div>
        </div>

        {/* Success toast */}
        {successMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Current Active Image Preview */}
        {previewUrl && (
          <div className="mb-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-2">
            <div className="text-xs font-semibold text-zinc-600">Imagem Oficial Ativa no App:</div>
            <div className="flex justify-center py-2">
              <img
                src={previewUrl}
                alt="Logo Ativa"
                className="max-h-40 max-w-full object-contain rounded-xl shadow-xs"
                referrerPolicy="no-referrer"
              />
            </div>
            {fileName && (
              <div className="text-[11px] text-zinc-400 font-mono truncate">
                Arquivo: {fileName}
              </div>
            )}
          </div>
        )}

        {/* Drag & Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-[#96382B] bg-[#FDF6F4]'
              : 'border-zinc-300 hover:border-[#96382B] hover:bg-zinc-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-2xl bg-[#FDF6F4] text-[#96382B] flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Upload className="w-6 h-6" />
          </div>

          <p className="text-sm font-bold text-zinc-800">
            Clique para selecionar ou arraste o arquivo aqui
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            Selecione seu arquivo <strong>Gemini_Generated_Image_...jpg</strong> ou qualquer formato de imagem.
          </p>
          <span className="inline-block mt-3 px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-[11px] font-medium">
            Formatos suportados: JPG, PNG, WEBP
          </span>
        </div>

        {/* Explanatory Note */}
        <div className="mt-4 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed space-y-1">
          <div className="font-semibold flex items-center gap-1.5 text-amber-950">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-700" />
            <span>Por que isso é necessário?</span>
          </div>
          <p>
            No AI Studio, anexar uma imagem na janela do chat não transfere o arquivo para a pasta estática do servidor web. Carregando aqui, seu arquivo original é salvo localmente no seu navegador e exibido em 100% das páginas com fidelidade absoluta.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-between gap-3 pt-3 border-t border-zinc-100">
          {previewUrl ? (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-zinc-500 hover:text-red-600 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Remover Imagem e Usar Vetor</span>
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#96382B] hover:bg-[#7D2E23] transition-colors cursor-pointer min-h-[40px]"
          >
            Concluir & Voltar ao App
          </button>
        </div>
      </div>
    </div>
  );
};
