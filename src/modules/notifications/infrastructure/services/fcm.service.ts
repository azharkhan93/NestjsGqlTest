import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FcmService {
  private readonly logger = new Logger(FcmService.name);
  private isFirebaseInitialized = false;

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      this.logger.warn(
        'FCM configuration keys (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) are missing in environment. Using MOCK mode for push notifications.',
      );
      return;
    }

    try {
      // Check if already initialized to prevent duplicate app errors in development HMR
      if (admin.apps.length === 0) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, '\n'),
          }),
        });
      }
      this.isFirebaseInitialized = true;
      this.logger.log('Firebase Admin SDK initialized successfully.');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to initialize Firebase Admin SDK: ${msg}`);
    }
  }

  async sendPushNotification(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<boolean> {
    if (!this.isFirebaseInitialized) {
      this.logger.log(
        `[MOCK FCM PUSH] Token: "${token}" | Title: "${title}" | Body: "${body}" | Data: ${JSON.stringify(
          data ?? {},
        )}`,
      );
      return true;
    }

    try {
      const response = await admin.messaging().send({
        token,
        notification: { title, body },
        data: data ?? {},
      });
      this.logger.log(`FCM Push notification sent successfully: ${response}`);
      return true;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`FCM Push notification send failed: ${msg}`);
      return false;
    }
  }
}
