// populate-firestore.js - Run in browser console on Firebase Console or save as HTML
// 1. Go to https://console.firebase.google.com/project/cat11-547eb/firestore/data
// 2. Open F12 > Console > Paste & Run

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, doc, setDoc, addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdOWisjz-qJQNwcCVNPImAseVQvfJueOo",
  authDomain: "cat11-547eb.firebaseapp.com",
  projectId: "cat11-547eb",
  storageBucket: "cat11-547eb.firebasestorage.app",
  messagingSenderId: "123943009791",
  appId: "1:123943009791:web:99e903cce24f10c7db3bca"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function populateData() {
  console.log('🚀 Starting QUOTA-FREE data population...');
  
  // Batch writes to avoid quota
  const batch = writeBatch(db);
  
  // 1. Users (3 only to avoid quota)
  const users = [
    { id: 'test1', fullName: 'اختبار 1', username: 'test1', country: 'SA' },
    { id: 'test2', fullName: 'اختبار 2', username: 'test2', country: 'SA' },
    { id: 'test3', fullName: 'اختبار 3', username: 'test3', country: 'SA' }
  ];
  
  users.forEach(user => {
    batch.set(doc(db, 'users', user.id), {
      fullName: user.fullName,
      username: user.username,
      country: user.country,
      profileImage: `https://i.pravatar.cc/150?u=${user.username}`,
      createdAt: serverTimestamp()
    });
  });
  
  // 2. 2 Posts
  batch.set(doc(db, 'posts', 'post1'), {
    userId: 'test1',
    content: 'مرحباً من التطبيق! 🎉',
    likesCount: 5,
    timestamp: serverTimestamp()
  });
  
  batch.set(doc(db, 'posts', 'post2'), {
    userId: 'test2',
    content: 'اختبار المنشور الثاني ✅',
    likesCount: 3,
    timestamp: serverTimestamp()
  });
  
  // 3. 1 Chat
  batch.set(doc(db, 'chats', 'chat1'), {
    type: 'private',
    participants: ['test1', 'test2'],
    lastMessage: { text: 'مرحباً!', timestamp: serverTimestamp() }
  });
  
  // 4. 1 Group
  batch.set(doc(db, 'groups', 'group1'), {
    name: 'غرفة الاختبار',
    creatorId: 'test1',
    members: [{userId: 'test1', userName: 'اختبار 1'}],
    memberCount: 1
  });
  
  await batch.commit();
  
  console.log('🎉 QUOTA-FREE DATA ADDED (3 users + 2 posts + 1 chat + 1 group)!');
  console.log('🔄 Refresh app pages NOW!');
  console.log('👤 Login: admin/123456');
}


// RUN:
populateData().catch(console.error);

