import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  serverTimestamp,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';
import { Campaign, Asset, Feedback, CampaignStatus } from '../types';

const COLLECTION = 'campaigns';

export const campaignService = {
  async getCampaigns(clientId?: string) {
    let q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    if (clientId) {
      q = query(collection(db, COLLECTION), where('clientId', '==', clientId), orderBy('createdAt', 'desc'));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign));
  },

  async getCampaignById(id: string) {
    const docRef = doc(db, COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as Campaign;
  },

  async createCampaign(data: Partial<Campaign>) {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      status: 'draft',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  async updateCampaign(id: string, data: Partial<Campaign>) {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  },

  async submitCampaign(id: string) {
    const campaign = await this.getCampaignById(id);
    if (!campaign) throw new Error("Campaign not found");

    // Call internal API
    const response = await fetch('/api/integrations/internal/campaigns/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId: id, briefing: campaign.briefing })
    });

    if (!response.ok) throw new Error("Failed to submit campaign to internal system");

    const result = await response.json();

    // Create a job record
    await addDoc(collection(db, `campaigns/${id}/jobs`), {
      externalJobId: result.externalJobId,
      status: result.status,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Update campaign status
    await this.updateCampaign(id, { 
      status: 'submitted',
      submittedAt: new Date().toISOString()
    });
  },

  // Assets
  async getAssets(campaignId: string) {
    const q = query(collection(db, `campaigns/${campaignId}/assets`), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Asset));
  },

  // Feedbacks
  async getFeedbacks(campaignId: string) {
    const q = query(collection(db, `campaigns/${campaignId}/feedbacks`), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Feedback));
  },

  async addFeedback(campaignId: string, data: Partial<Feedback>) {
    await addDoc(collection(db, `campaigns/${campaignId}/feedbacks`), {
      ...data,
      status: 'open',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
};
