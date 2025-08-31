import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

const AddDonation: React.FC = () => {
  const history = useHistory();

  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    console.log({ itemName, category, condition, quantity, description });
    history.push('/tabs/tab2');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {/* Back button */}
          <IonButtons slot="start">
            <IonButton onClick={() => history.push('/tabs/tab2')}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>Add Donation</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen style={{ padding: '16px' }}>
        <IonItem>
          <IonLabel position="stacked">Item Name</IonLabel>
          <IonInput value={itemName} placeholder="e.g., Old Laptop" onIonChange={e => setItemName(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Category</IonLabel>
          <IonSelect value={category} placeholder="Select Category" onIonChange={e => setCategory(e.detail.value)}>
            <IonSelectOption value="electronics">Electronics</IonSelectOption>
            <IonSelectOption value="school">School Essentials</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Condition</IonLabel>
          <IonSelect value={condition} placeholder="Select Condition" onIonChange={e => setCondition(e.detail.value)}>
            <IonSelectOption value="new">New</IonSelectOption>
            <IonSelectOption value="working">Working</IonSelectOption>
            <IonSelectOption value="repairable">Repairable</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Quantity</IonLabel>
          <IonInput type="number" value={quantity} onIonChange={e => setQuantity(parseInt(e.detail.value!, 10))} />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Description</IonLabel>
          <IonTextarea value={description} placeholder="Optional notes..." onIonChange={e => setDescription(e.detail.value!)} />
        </IonItem>

        <IonButton expand="block" style={{ marginTop: '20px' }} onClick={handleSubmit}>
          Submit Donation
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AddDonation;
