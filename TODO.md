# خطة تنفيذ نظام الإشعارات الكامل ✅ موافق عليها

## ✅ الخطوات المكتملة
- [x] إنشاء TODO.md

## ⏳ الخطوات المتبقية (سيتم تحديث عند الإكمال)

### 1. super-admin.html ✅ مكتمل
- [x] إضافة select للمستخدم المحدد + toggleUserSelect + populateUserSelect
- [x] إصلاح sendNotification(): Firebase compat + senderName + specific support
- [x] notifications في processWallet(): type="wallet" لـ add/remove/gift_all

### 2. home.html ✅ مكتمل
- [x] في addFriend(): إرسال notification type="friend_request" + title/body to targetUserId

### 3. friends.html ✅ مكتمل
- [x] في handleFriendRequest('accept'): إرسال notification type="friend" للمرسل (fromUserId)

### 4. chat.html ✅ مكتمل
- [x] إضافة notifications عند إنشاء مجموعة (createGroup → إشعار للمالك)
- [x] إضافة notifications عند قبول طلب انضمام (handleRequest accept → إشعار للمرسل)

### 5. admin.html ✅ مكتمل
- [x] إصلاح sendNotification(): استخدام addDoc + collection + serverTimestamp

### 6. الاختبار النهائي
- [ ] اختبار جميع الـ triggers
- [ ] التحقق من العداد/لوحة/أنواع الأيقونات
- [ ] attempt_completion

**التعليمات:** سأقوم بكل خطوة واحدة تلو الأخرى وتحديث هذا الملف بعد كل إكمال.

