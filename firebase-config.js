// ========================================
// 🔥 firebase-config.js - النسخة الكاملة الموحدة
// ✅ Firebase + Cache + Real-time + Back Button + Helpers
// ========================================

// === استيراد Firebase (روابط مباشرة من CDN) ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

// === إعدادات Firebase ===
const firebaseConfig = {
  apiKey: "AIzaSyBdOWisjz-qJQNwcCVNPImAseVQvfJueOo",
  authDomain: "cat11-547eb.firebaseapp.com",
  projectId: "cat11-547eb",
  storageBucket: "cat11-547eb.firebasestorage.app",
  messagingSenderId: "123943009791",
  appId: "1:123943009791:web:99e903cce24f10c7db3bca",
  measurementId: "G-YLDRJ7G2VQ"
};

// === تهيئة التطبيق ===
const app = initializeApp(firebaseConfig);

// === تصدير الخدمات الأساسية ===
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ========================================
// 🗄️ نظام الذاكرة المؤقتة (Cache Manager)
// ========================================

const CACHE_CONFIG = {
    users: { ttl: 300000, key: 'cache_users' },           // 5 دقائق
    groups: { ttl: 300000, key: 'cache_groups' },         // 5 دقائق
    notifications: { ttl: 60000, key: 'cache_notifs' },   // 1 دقيقة
    posts: { ttl: 180000, key: 'cache_posts' },           // 3 دقائق
    profile: { ttl: 600000, key: 'cache_profile' },       // 10 دقائق
    home: { ttl: 300000, key: 'cache_home' },             // 5 دقائق
    feed: { ttl: 180000, key: 'cache_feed' }              // 3 دقائق
};

export const CacheManager = {
    // حفظ البيانات مع وقت الصلاحية
    set(key, data, customTtl = null) {
        const config = CACHE_CONFIG[key] || { ttl: customTtl || 300000, key: `cache_${key}` };
        const cacheData = {
            data,
            timestamp: Date.now(),
            ttl: config.ttl
        };
        try {
            localStorage.setItem(config.key, JSON.stringify(cacheData));
            console.log(`💾 تم حفظ ${key} في الذاكرة`);
        } catch (e) {
            console.warn('⚠️ فشل حفظ الذاكرة:', e);
        }
    },

    // جلب البيانات مع التحقق من الصلاحية
    get(key) {
        const config = CACHE_CONFIG[key] || { ttl: 300000, key: `cache_${key}` };
        const cached = localStorage.getItem(config.key);
        
        if (!cached) return null;

        try {
            const { data, timestamp, ttl } = JSON.parse(cached);
            const age = Date.now() - timestamp;

            if (age > ttl) {
                console.log(`⏰ cache لـ ${key} منتهي الصلاحية`);
                localStorage.removeItem(config.key);
                return null;
            }

            console.log(`✅ تم جلب ${key} من cache (عمره: ${Math.floor(age/1000)} ثانية)`);
            return data;
        } catch (error) {
            console.error('❌ خطأ في قراءة cache:', error);
            return null;
        }
    },

    // مسح cache محدد
    clear(key) {
        const config = CACHE_CONFIG[key] || { key: `cache_${key}` };
        localStorage.removeItem(config.key);
        console.log(`🗑️ تم مسح cache لـ ${key}`);
    },

    // مسح كل الـ cache
    clearAll() {
        Object.values(CACHE_CONFIG).forEach(config => {
            localStorage.removeItem(config.key);
        });
        console.log('🗑️ تم مسح جميع الـ cache');
    },

    // حفظ حالة الصفحة (للتنقل بين الصفحات)
    savePageState(pageName, state) {
        try {
            sessionStorage.setItem(`page_${pageName}`, JSON.stringify(state));
        } catch (e) {
            console.warn('⚠️ فشل حفظ حالة الصفحة:', e);
        }
    },

    // استعادة حالة الصفحة
    restorePageState(pageName) {
        const cached = sessionStorage.getItem(`page_${pageName}`);
        return cached ? JSON.parse(cached) : null;
    },

    // التحقق مما إذا كانت البيانات قديمة وتحتاج تحديث
    isStale(key) {
        const config = CACHE_CONFIG[key] || { ttl: 300000, key: `cache_${key}` };
        const cached = localStorage.getItem(config.key);
        
        if (!cached) return true;
        
        try {
            const { timestamp, ttl } = JSON.parse(cached);
            return (Date.now() - timestamp) > ttl;
        } catch {
            return true;
        }
    }
};

// ========================================
// 🔄 دوال الاستماع للتغييرات الحية (Real-time)
// ========================================

// استماع لمجموعة كاملة مع تحديث تلقائي
export function subscribeToCollection(collectionName, callback, constraints = []) {
    import("https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js")
    .then(({ collection, query, onSnapshot }) => {
        const colRef = collection(db, collectionName);
        const q = constraints.length > 0 ? query(colRef, ...constraints) : colRef;
        
        return onSnapshot(q, (snapshot) => {
            const data = [];
            snapshot.forEach(doc => {
                data.push({ id: doc.id, ...doc.data() });
            });
            callback(data, 'updated');
        }, (error) => {
            console.error('❌ خطأ في الاستماع:', error);
            callback(null, 'error', error);
        });
    });
}

// استماع لمستند محدد للتغييرات
export function subscribeToDocument(collectionName, docId, callback) {
    import("https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js")
    .then(({ doc, onSnapshot }) => {
        const docRef = doc(db, collectionName, docId);
        
        return onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                callback({ id: docSnap.id, ...docSnap.data() }, 'updated');
            } else {
                callback(null, 'deleted');
            }
        }, (error) => {
            console.error('❌ خطأ في استماع المستند:', error);
            callback(null, 'error', error);
        });
    });
}

// دالة مساعدة: جلب بيانات مع Cache ذكي
export async function fetchWithCache(key, fetchFunction, forceRefresh = false) {
    // إذا لم نطلب التحديث القسري والـ cache صالح، نرجع منه
    if (!forceRefresh && !CacheManager.isStale(key)) {
        const cached = CacheManager.get(key);
        if (cached) return cached;
    }
    
    // جلب بيانات جديدة من السيرفر
    try {
        const freshData = await fetchFunction();
        CacheManager.set(key, freshData);
        return freshData;
    } catch (error) {
        console.error(`❌ فشل جلب ${key}:`, error);
        // في حال الفشل، نرجع الـ cache القديم إذا وجد (حتى لو منتهي)
        return CacheManager.get(key);
    }
}

// ========================================
// 🔙 نظام زر الرجوع المزدوج (مثل أندرويد)
// ========================================

let exitConfirmTimeout = null;
let exitConfirmShown = false;

export async function setupBackButton(isHomePage = false) {
    // التحقق من Capacitor
    if (typeof Capacitor === 'undefined') {
        console.log('🌐 Capacitor غير متاح - زر الرجوع يعمل بالمتصفح فقط');
        return;
    }

    const { App } = await import('@capacitor/app');
    
    App.addListener('backButton', async ({ canGoBack }) => {
        // إغلاق أي مودال مفتوح أولاً
        const openModals = document.querySelectorAll('.modal-overlay.show, .profile-modal-overlay.show');
        if (openModals.length > 0) {
            openModals.forEach(modal => {
                modal.classList.remove('show');
                document.body.classList.remove('scroll-locked', 'keyboard-open');
            });
            return;
        }
        
        // إغلاق لوحة الإشعارات إذا كانت مفتوحة
        const notificationPanel = document.getElementById('notification-panel');
        if (notificationPanel?.classList.contains('show')) {
            const closeFunc = window.closeNotificationPanel;
            if (closeFunc) closeFunc();
            return;
        }
        
        // في الصفحة الرئيسية: تحتاج ضغطتين للخروج
        if (isHomePage) {
            if (!exitConfirmShown) {
                exitConfirmShown = true;
                showBackButtonToast('اضغط مرة أخرى للخروج');
                
                exitConfirmTimeout = setTimeout(() => {
                    exitConfirmShown = false;
                }, 2000);
                return;
            } else {
                clearTimeout(exitConfirmTimeout);
                await exitApp();
                return;
            }
        }
        
        // في الصفحات الأخرى: ارجع للخلف
        if (canGoBack) {
            window.history.back();
        } else {
            await exitApp();
        }
    });
}

// دالة الخروج من التطبيق
export async function exitApp() {
    if (typeof Capacitor !== 'undefined') {
        const { App } = await import('@capacitor/app');
        await App.exitApp();
    } else {
        window.close();
        window.location.href = 'index.html';
    }
}

// دالة عرض رسالة زر الرجوع
function showBackButtonToast(message) {
    const existing = document.getElementById('back-toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.id = 'back-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--warning-color, #f59e0b);
        color: #000;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 0.9rem;
        font-weight: 600;
        z-index: 9999;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        animation: slideUpToast 0.3s ease;
        max-width: 80%;
        text-align: center;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideUpToast 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// إضافة أنيميشن للـ Toast
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes slideUpToast {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
`;
if (!document.getElementById('toast-style')) {
    toastStyle.id = 'toast-style';
    document.head.appendChild(toastStyle);
}

// تنظيف عند إغلاق الصفحة
window.addEventListener('beforeunload', () => {
    clearTimeout(exitConfirmTimeout);
    exitConfirmShown = false;
});

// ========================================
// 📤 تصدير جميع دوال Firestore
// ========================================

export { 
    doc, collection, query, where, orderBy, limit, startAfter, endBefore,
    onSnapshot, getDoc, getDocs, setDoc, updateDoc, deleteDoc, addDoc,
    serverTimestamp, arrayUnion, arrayRemove, increment, runTransaction 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// ========================================
// 🔐 تصدير دوال Auth
// ========================================

export { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// ========================================
// 📦 تصدير دوال Storage
// ========================================

export {
    ref, uploadBytes, getDownloadURL, deleteObject, listAll
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

// ========================================
// 🎯 دوال مساعدة إضافية
// ========================================

// توليد معرف فريد
export function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// تنسيق التاريخ
export function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// تنسيق الوقت النسبي (منذ...)
export function formatRelativeTime(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'الآن';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} دقيقة`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} ساعة`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} يوم`;
    
    return formatDate(timestamp);
}

// التحقق من صحة البريد الإلكتروني
export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// التحقق من صحة رقم الهاتف (عربي)
export function isValidPhone(phone) {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone);
}

// ضغط صورة قبل الرفع (لـ Base64)
export function compressImage(base64, maxWidth = 800, quality = 0.7) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(base64);
    });
}

// ========================================
// 📱 دوال خاصة بالتطبيق (Capacitor)
// ========================================

// التحقق من أن الكود يعمل داخل تطبيق أصلي
export function isNativeApp() {
    return typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform();
}

// الحصول على معلومات الجهاز
export async function getDeviceInfo() {
    if (!isNativeApp()) return null;
    
    try {
        const { Device } = await import('@capacitor/device');
        const info = await Device.getInfo();
        return info;
    } catch (error) {
        console.error('Error getting device info:', error);
        return null;
    }
}

// التحقق من اتصال الإنترنت
export async function checkNetworkStatus() {
    if (!isNativeApp()) {
        return { connected: navigator.onLine };
    }
    
    try {
        const { Network } = await import('@capacitor/network');
        const status = await Network.getStatus();
        return status;
    } catch (error) {
        console.error('Error checking network:', error);
        return { connected: navigator.onLine };
    }
}

// ========================================
// ✅ رسالة تأكيد التحميل
// ========================================

console.log('✅ Firebase Config Loaded - Cache & Real-time Ready 🚀');
console.log('📦 الأدوات المتاحة:');
console.log('   - CacheManager (لحفظ البيانات محلياً)');
console.log('   - subscribeToCollection (للاستماع للتغييرات)');
console.log('   - fetchWithCache (لجلب البيانات مع cache)');
console.log('   - setupBackButton (لزر الرجوع المزدوج)');
console.log('   - exitApp (للخروج من التطبيق)');
console.log('   - formatDate, formatRelativeTime (لتنسيق الوقت)');
console.log('   - generateId (لتوليد معرفات فريدة)');
console.log('   - compressImage (لضغط الصور)');
console.log('   - isNativeApp, getDeviceInfo, checkNetworkStatus (لميزات الجهاز)');