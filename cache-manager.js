// ========================================
// 🗄️ مدير الذاكرة المؤقتة المتقدم
// ========================================

const CACHE_CONFIG = {
    users: { ttl: 300000, key: 'cache_users' },        // 5 دقائق
    groups: { ttl: 300000, key: 'cache_groups' },      // 5 دقائق
    notifications: { ttl: 60000, key: 'cache_notifs' }, // 1 دقيقة
    posts: { ttl: 180000, key: 'cache_posts' },        // 3 دقائق
    profile: { ttl: 600000, key: 'cache_profile' }     // 10 دقائق
};

class CacheManager {
    // حفظ البيانات مع timestamp
    static set(key, data, ttl = null) {
        const config = CACHE_CONFIG[key] || { ttl: ttl || 300000, key: `cache_${key}` };
        const cacheData = {
            data: data,
            timestamp: Date.now(),
            ttl: config.ttl
        };
        localStorage.setItem(config.key, JSON.stringify(cacheData));
        console.log(`💾 تم حفظ ${key} في الذاكرة`);
    }

    // جلب البيانات مع التحقق من الصلاحية
    static get(key) {
        const config = CACHE_CONFIG[key] || { ttl: 300000, key: `cache_${key}` };
        const cached = localStorage.getItem(config.key);
        
        if (!cached) {
            console.log(`❌ لا يوجد cache لـ ${key}`);
            return null;
        }

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
    }

    // مسح cache محدد
    static clear(key) {
        const config = CACHE_CONFIG[key] || { key: `cache_${key}` };
        localStorage.removeItem(config.key);
        console.log(`🗑️ تم مسح cache لـ ${key}`);
    }

    // مسح كل الـ cache
    static clearAll() {
        Object.values(CACHE_CONFIG).forEach(config => {
            localStorage.removeItem(config.key);
        });
        console.log('🗑️ تم مسح جميع الـ cache');
    }

    // حفظ حالة الصفحة (للتنقل بين الصفحات)
    static savePageState(pageName, state) {
        sessionStorage.setItem(`page_${pageName}`, JSON.stringify(state));
    }

    // استعادة حالة الصفحة
    static restorePageState(pageName) {
        const cached = sessionStorage.getItem(`page_${pageName}`);
        return cached ? JSON.parse(cached) : null;
    }

    // التحقق مما إذا كانت البيانات قديمة وتحتاج تحديث
    static isStale(key) {
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
}

// تصدير للاستخدام في الملفات الأخرى
window.CacheManager = CacheManager;