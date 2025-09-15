import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotes } from '../../contexts/NotesContext';
import './SubscriptionInfo.css';

function SubscriptionInfo() {
  const { user, loading, error, success, upgradeToPro } = useAuth();
  const { notes } = useNotes();

  const handleUpgrade = async () => {
    const result = await upgradeToPro();
    if (result.success) {
      // Success message is handled in the context
    }
  };

  return (
    <div className="subscription-info card">
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="subscription-content">
        <div className="plan-details">
          <div className={`plan-badge ${user.tenant.subscription_plan}`}>
            {user.tenant.subscription_plan.toUpperCase()}
          </div>
          <div className="plan-stats">
            <span className="plan-name">{user.tenant.name}</span>
            {user.tenant.subscription_plan === 'free' && (
              <span className="notes-count">
                {notes.length} of 3 notes used
              </span>
            )}
            {user.tenant.subscription_plan === 'pro' && (
              <span className="notes-count pro">
                Unlimited notes available
              </span>
            )}
          </div>
        </div>
        
        {user.tenant.subscription_plan === 'free' && user.role === 'admin' && (
          <button 
            onClick={handleUpgrade} 
            className="btn btn-upgrade"
            disabled={loading}
          >
            {loading ? 'Upgrading...' : 'Upgrade to Pro'}
          </button>
        )}
        
        {user.tenant.subscription_plan === 'pro' && (
          <div className="pro-badge">
            <span>✓ Pro Plan Active</span>
          </div>
        )}
      </div>
      
      {user.tenant.subscription_plan === 'free' && notes.length >= 3 && (
        <div className="limit-warning">
          <p>You've reached the limit of your Free plan.</p>
          {user.role === 'admin' ? (
            <button 
              onClick={handleUpgrade} 
              className="btn btn-upgrade"
              disabled={loading}
            >
              {loading ? 'Upgrading...' : 'Upgrade to Pro for Unlimited Notes'}
            </button>
          ) : (
            <p>Contact your administrator to upgrade to the Pro plan.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SubscriptionInfo;