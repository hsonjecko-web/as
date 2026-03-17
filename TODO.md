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

### 4. chat.html ⏳ جاري
- [ ] إضافة notifications عند انضمام للمجموعات (createGroup / join requests)

### 4. chat.html
- [ ] إضافة notifications عند انضمام للمجموعات (createGroup / join requests)

### 5. admin.html
- [ ] إصلاح sendNotification() بـ Firebase compat + senderName="المشرف"

### 6. الاختبار النهائي
- [ ] اختبار جميع الـ triggers
- [ ] التحقق من العداد/لوحة/أنواع الأيقونات
- [ ] attempt_completion

**التعليمات:** سأقوم بكل خطوة واحدة تلو الأخرى وتحديث هذا الملف بعد كل إكمال.

