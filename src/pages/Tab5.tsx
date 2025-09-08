import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonInput
} from '@ionic/react';
import {
  settingsOutline,
  funnelOutline,
  chevronDownOutline,
  chevronUpOutline
} from 'ionicons/icons';
import './Tab5.css';

const Tab5: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Help</IonTitle>
          <IonIcon icon={settingsOutline} slot="end" className="help-settings-icon" />
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="help-container">
          <h2 className="help-heading">How Can We Help You?</h2>
          <hr className="help-divider" />

          {/* Filter Buttons */}
          <div className="help-filters">
            <button className="filter-btn active">FAQ</button>
            <button className="filter-btn">Contact Us</button>
            <button className="filter-btn active">General</button>
            <button className="filter-btn">Account</button>
            <button className="filter-btn">Services</button>
          </div>

          {/* Editable Search Bar */}
          <div className="help-search">
            <IonInput placeholder="Search" className="search-input" />
            <div className="search-btn">
              <IonIcon icon={funnelOutline} />
            </div>
          </div>

          {/* FAQ Section */}
          <div className="faq-section">
            {/* Q1 */}
            <div className="faq-item" onClick={() => toggleFAQ(0)}>
              <p className="faq-question">What is this app about?</p>
              <IonIcon
                icon={openIndex === 0 ? chevronUpOutline : chevronDownOutline}
                className="faq-chevron"
              />
            </div>
            {openIndex === 0 && (
              <p className="faq-answer">
                This app allows donors, schools, and partner organizations to trace donated
                educational resources through a blockchain-based system.
              </p>
            )}

            {/* Q2 */}
            <div className="faq-item" onClick={() => toggleFAQ(1)}>
              <p className="faq-question">How do I make a donation?</p>
              <IonIcon
                icon={openIndex === 1 ? chevronUpOutline : chevronDownOutline}
                className="faq-chevron"
              />
            </div>
            {openIndex === 1 && (
              <p className="faq-answer">
                To make a donation, go to the Donations tab, fill out the required details,
                and submit your item. A QR code will be generated for tracking.
              </p>
            )}

            {/* Q3 */}
            <div className="faq-item" onClick={() => toggleFAQ(2)}>
              <p className="faq-question">How can I track the status of my donation?</p>
              <IonIcon
                icon={openIndex === 2 ? chevronUpOutline : chevronDownOutline}
                className="faq-chevron"
              />
            </div>
            {openIndex === 2 && (
              <p className="faq-answer">
                You can track your donation by scanning the QR code or checking the Trace
                tab in the app for real-time status updates.
              </p>
            )}

            {/* Q4 */}
            <div className="faq-item" onClick={() => toggleFAQ(3)}>
              <p className="faq-question">What if the QR code is not working?</p>
              <IonIcon
                icon={openIndex === 3 ? chevronUpOutline : chevronDownOutline}
                className="faq-chevron"
              />
            </div>
            {openIndex === 3 && (
              <p className="faq-answer">
                If your QR code is not working, please contact our support team through
                the Help tab or use the item ID to search in the Trace section.
              </p>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab5;
