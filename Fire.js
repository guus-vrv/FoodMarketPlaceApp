import firebase from './firebaseConfig';
import { SnapshotViewIOS } from 'react-native';

class Fire {
    constructor() {
        const user = firebase.auth().currentUser;
    }
    addPost = async ({localUri}) => {
        const remoteUri = await this.uploadPhotoAsync(localUri);
        
        return new Promise((res, rej) => {
            this.firebase.collection('posts').doc(this.user.id).set({
                image: remoteUri
            }).then(ref => {
                res(ref);
                console.log(remoteUri, '=> REMOTE URI');
            }).catch(error => {
                rej(error);
            });
        });
    }
 
    uploadPhotoAsync = async uri => {
        const path = `photos/${this.user.id}/${Date.now()}.jpg`;

        return new Promise(async (res, rej) => {
            const response = await fetch(uri);
            const file = await response.blob();

            let upload = firebase.storage().ref(path).put(file);

            upload.on('state_changed', snapshot => {}, err => {
                rej(err);
            },
            async () => {
                const url = await upload.snapshot.ref.getDownloadURL();
                res(url);
            })
        })
    }

}

Fire.shared = new Fire();

export default Fire