import React from 'react';
import { X, MapPin, Sparkles, BookOpen } from 'lucide-react';

interface DialectComparisonModalProps {
  onClose: () => void;
}

export const DialectComparisonModal: React.FC<DialectComparisonModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Comprendre les Dialectes Albanais</h2>
            <p className="text-xs text-slate-400">Gheg (Gegërisht) vs Tosk (Toskërisht)</p>
          </div>
        </div>

        {/* Geography */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 mb-5">
          <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider mb-2">
            <MapPin className="w-4 h-4" />
            <span>La Ligne de Démarcation : La Rivière Shkumbin</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            L'albanais est scindé en deux grands ensembles dialectaux séparés géographiquement par la rivière <strong>Shkumbin</strong> qui traverse le centre de l'Albanie.
          </p>
        </div>

        {/* Gheg vs Tosk Cards */}
        <div className="space-y-4 mb-6">
          {/* Gheg */}
          <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-800/40">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
              Dialecte Gheg (Gegërisht)
            </span>
            <p className="text-xs text-slate-300 font-medium mb-2.5">
              Nord de l'Albanie, Kosovo, Macédoine du Nord, Monténégro.
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>
                <strong className="text-slate-200">Infinitif en « me » :</strong> Exprime l'action avec « me » (ex. <em>me mësu</em>, <em>me punu</em>, <em>me fol</em>).
              </li>
              <li>
                <strong className="text-slate-200">Vocabulaire du quotidien :</strong> <em>Qysh</em> (comment), <em>Çka</em> (quoi), <em>Hala</em> (encore/toujours), <em>Boll</em> (assez).
              </li>
              <li>
                <strong className="text-slate-200">Formes verbales abrégées :</strong> <em>Kom</em> (j'ai), <em>Jom</em> (je suis).
              </li>
            </ul>
          </div>

          {/* Tosk */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/40">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              Dialecte Tosk (Toskërisht) & Albanais Standard
            </span>
            <p className="text-xs text-slate-300 font-medium mb-2.5">
              Sud de l'Albanie, communautés en Grèce (Arvanites) et Italie (Arbëresh).
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>
                <strong className="text-slate-200">Base de la langue standard :</strong> Adopté comme norme littéraire officielle (<em>gjuha letrare</em>) en 1972.
              </li>
              <li>
                <strong className="text-slate-200">Subjonctif en « të » :</strong> Remplace l'infinitif gheg par « të » (ex. <em>të mësoj</em>, <em>të punoj</em>).
              </li>
              <li>
                <strong className="text-slate-200">Rhotacisme :</strong> Le son historique « n » est souvent devenu « r » en tosk (ex. <em>syni</em> en gheg → <em>syri</em> en tosk pour "l'œil").
              </li>
            </ul>
          </div>
        </div>

        {/* Pronunciation Guide */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Guide Rapide des Lettres Spécifiques</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <strong className="text-red-400 text-sm">ë</strong> : comme le « e » français de <em>le</em> ou <em>je</em>.
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <strong className="text-red-400 text-sm">ç</strong> : comme « tch » (ex. <em>tchèque</em>).
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <strong className="text-red-400 text-sm">c</strong> : comme « ts » (ex. <em>tsunami</em>).
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <strong className="text-red-400 text-sm">gj</strong> : comme un « d » très doux suivi de « y ».
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <strong className="text-red-400 text-sm">q</strong> : comme un « t » très doux suivi de « y ».
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <strong className="text-red-400 text-sm">xh</strong> : comme « dj » (ex. <em>jeans</em>).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
