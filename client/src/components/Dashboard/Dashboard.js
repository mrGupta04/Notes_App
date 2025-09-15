import React from 'react';
import Header from '../Header/Header';
import SubscriptionInfo from '../SubscriptionInfo/SubscriptionInfo';
import NoteForm from '../NoteForm/NoteForm';
import NotesList from '../NotesList/NotesList';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-content main-content">
        <div className="container">
          <SubscriptionInfo />
          <NoteForm />
          <NotesList />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;