import { useState } from 'react';
import { useRouter } from 'next/router';
import Modal from '../components/Modal';

export default function Home() {
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="page-container">
      {/* Fixed-width card container in the middle */}
      <div className="card-container">
        <h1 className="card-title">Welcome to CarePortal</h1>
        <p className="card-description">
          This application helps match patients with the right care facility.
        </p>
        
        {/* Button container with fixed width and centered */}
        <div className="button-container">
          <div className="button-group">
            <button
              onClick={() => setModalOpen(true)}
              className="button-primary"
            >
              About
            </button>
            <button
              onClick={() => router.push('/patient-name')}
              className="button-primary"
            >
              Start
            </button>
            <button
              onClick={() => router.push('/facilities')}
              className="button-primary"
            >
              Facilities
            </button>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="modal-title">About CarePortal</h2>
        <p>
          This is an interview project built with Next.js and Supabase.
        </p>
        <button
          onClick={() => setModalOpen(false)}
          className="modal-button"
        >
          Back
        </button>
      </Modal>
    </div>
  );
}