
import { articleMetadata } from './articleMetadata';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Export HTTP Cloud Functions
export { articleMetadata };
