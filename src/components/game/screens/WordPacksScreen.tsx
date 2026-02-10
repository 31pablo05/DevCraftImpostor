import { useState, useEffect } from 'react';
import { useGame } from '../GameProvider';
import {
  getAllWordPacks,
  getCustomWordPacks,
  saveCustomWordPack,
  deleteCustomWordPack,
} from '../../../lib/storage/storage';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import Toast from '../ui/Toast';
import type { WordPack } from '../../../lib/types/game.types';

export default function WordPacksScreen() {
  const { dispatch } = useGame();
  const [packs, setPacks] = useState<WordPack[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editPack, setEditPack] = useState<WordPack | null>(null);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('📝');
  const [wordsText, setWordsText] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const refresh = () => setPacks(getAllWordPacks());

  useEffect(() => { refresh(); }, []);

  const handleOpenNew = () => {
    setEditPack(null);
    setName('');
    setEmoji('📝');
    setWordsText('');
    setShowModal(true);
  };

  const handleEdit = (pack: WordPack) => {
    setEditPack(pack);
    setName(pack.name);
    setEmoji(pack.emoji);
    setWordsText(pack.words.join('\n'));
    setShowModal(true);
  };

  const handleSave = () => {
    const words = wordsText
      .split('\n')
      .map((w) => w.trim())
      .filter(Boolean);

    if (!name.trim()) {
      setToast({ msg: 'El nombre es obligatorio', type: 'error' });
      return;
    }
    if (words.length < 5) {
      setToast({ msg: 'Necesitas al menos 5 palabras', type: 'error' });
      return;
    }

    const pack: WordPack = {
      id: editPack?.id ?? `custom-${Date.now()}`,
      name: name.trim(),
      emoji,
      words,
      isCustom: true,
    };

    saveCustomWordPack(pack);
    refresh();
    setShowModal(false);
    setToast({ msg: editPack ? 'Pack actualizado' : 'Pack creado', type: 'success' });
  };

  const handleDelete = (id: string) => {
    deleteCustomWordPack(id);
    refresh();
    setToast({ msg: 'Pack eliminado', type: 'success' });
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950 p-4">
      <div className="max-w-lg mx-auto py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => dispatch({ type: 'GO_HOME' })}
            className="text-2xl text-gray-400 hover:text-white transition-colors p-2"
          >
            ←
          </button>
          <img src="/logo/impostorlogo2.svg" alt="El Impostor" className="w-8 h-8 rounded-lg" />
          <h1 className="text-2xl font-bold text-white">📦 Categorías</h1>
        </div>

        {/* Lista de packs */}
        <div className="space-y-3 mb-6">
          {packs.map((pack) => (
            <Card key={pack.id} padding="sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{pack.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{pack.name}</h3>
                    <p className="text-xs text-gray-400">
                      {pack.words.length} palabras
                      {pack.isCustom && ' · Personalizado'}
                    </p>
                  </div>
                </div>

                {pack.isCustom && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(pack)}
                      className="text-sm text-indigo-400 hover:text-indigo-300 px-2 py-1"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(pack.id)}
                      className="text-sm text-red-400 hover:text-red-300 px-2 py-1"
                    >
                      🗑
                    </button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <Button onClick={handleOpenNew} variant="secondary" size="md" fullWidth>
          ✨ Crear categoría personalizada
        </Button>

        {/* Modal de creación / edición */}
        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          title={editPack ? 'Editar categoría' : 'Nueva categoría'}
        >
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-20">
                <Input
                  label="Emoji"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  maxLength={4}
                />
              </div>
              <div className="flex-1">
                <Input
                  label="Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Mi categoría"
                  maxLength={30}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Palabras (una por línea)
              </label>
              <textarea
                value={wordsText}
                onChange={(e) => setWordsText(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder={`Palabra 1\nPalabra 2\nPalabra 3\n...`}
              />
              <p className="text-xs text-gray-500 mt-1">
                {wordsText.split('\n').filter((w) => w.trim()).length} palabras
              </p>
            </div>

            <Button onClick={handleSave} variant="primary" size="md" fullWidth>
              💾 Guardar
            </Button>
          </div>
        </Modal>
      </div>

      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
