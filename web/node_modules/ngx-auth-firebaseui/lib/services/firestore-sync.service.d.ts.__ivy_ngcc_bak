import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserInfo } from 'firebase';
export declare const collections: {
    users: string;
};
export declare class FirestoreSyncService {
    afs: AngularFirestore;
    constructor(afs: AngularFirestore);
    getUserDocRefByUID(uid: string): AngularFirestoreDocument<UserInfo>;
    deleteUserData(uid: string): Promise<any>;
    updateUserData(user: UserInfo): Promise<any>;
}
