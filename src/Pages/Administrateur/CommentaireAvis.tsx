import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { commentairesMock, clientsMock, freelancersMock } from '../../constants';
import type { Commentaires, Clients, Freelancers } from '../../Type';

export default function CommentaireAvis() {
  // État local des commentaires
  const [commentaires, setCommentaires] = useState<Commentaires[]>(commentairesMock);

  // Helper pour obtenir le nom du client à partir de son id
  const getClientName = (clientId: number): string => {
    const client = clientsMock.find((c: Clients) => c.id_client === clientId);
    return client ? `${client.prenom} ${client.nom}` : 'Client inconnu';
  };

  // Helper pour obtenir le nom du freelance
  const getFreelancerName = (freelancerId: number): string => {
    const freelancer = freelancersMock.find((f: Freelancers) => f.id_freelancer === freelancerId);
    return freelancer ? `${freelancer.prenom} ${freelancer.nom}` : 'Freelance inconnu';
  };

  // Fonction de suppression
  const handleDelete = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      setCommentaires(prev => prev.filter(comment => comment.id_commentaire !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6">
      <div className="">
        <h1 className="text-2xl font-bold mb-6 ml-9">Gestion des commentaires et avis</h1>

        {commentaires.length === 0 ? (
          <div className="bg-[#1B1B1D] rounded-lg p-8 text-center text-gray-400">
            Aucun commentaire disponible.
          </div>
        ) : (
          <div className="space-y-4">
            {commentaires.map(comment => (
              <div
                key={comment.id_commentaire}
                className="bg-[#1B1B1D] rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="font-medium text-gray-300">
                      Client : <span className="text-white">{getClientName(comment.id_client)}</span>
                    </span>
                    <span className="font-medium text-gray-300">
                      Prestataire : <span className="text-white">{getFreelancerName(comment.id_freelancer)}</span>
                    </span>
                    <span className="text-gray-400">
                      Date : {comment.date}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-200 italic">« {comment.commentaire} »</p>
                </div>
                <button
                  onClick={() => handleDelete(comment.id_commentaire)}
                  className="bg-red-500/60 hover:bg-red-700 text-white px-3 py-2 rounded-md flex items-center gap-2 transition-colors"
                >
                  <Trash2 size={16} />
                
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}