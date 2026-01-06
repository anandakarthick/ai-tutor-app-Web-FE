/**
 * Session Terminated Modal
 * Shows when user is logged out due to login on another device
 */

import { AlertCircle, Shield, X } from 'lucide-react';
import './SessionTerminatedModal.css';

interface SessionTerminatedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SessionTerminatedModal({ isOpen, onClose }: SessionTerminatedModalProps) {
  if (!isOpen) return null;

  return (
    <div className="session-modal-overlay">
      <div className="session-modal">
        {/* Icon */}
        <div className="session-icon-container">
          <AlertCircle size={48} />
        </div>

        {/* Title */}
        <h2 className="session-title">Session Ended</h2>

        {/* Message */}
        <p className="session-message">
          You have been logged out because you signed in on another device.
        </p>
        <p className="session-sub-message">
          Only one device can be active at a time for security purposes.
        </p>

        {/* Info Box */}
        <div className="session-info-box">
          <Shield size={20} />
          <span>This keeps your account secure</span>
        </div>

        {/* Button */}
        <button className="session-button" onClick={onClose}>
          Continue to Login
        </button>
      </div>
    </div>
  );
}
