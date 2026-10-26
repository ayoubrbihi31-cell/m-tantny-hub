-- 3) بيانات أولية قابلة للتعديل من لوحة المدير لاحقاً.
insert into public.categories (name, slug) values
  ('توليد الصور', 'image-generation'),
  ('توليد الفيديو', 'video-generation'),
  ('الكتابة', 'writing'),
  ('التصميم', 'design'),
  ('الصوت', 'audio'),
  ('البرمجة', 'coding'),
  ('الإنتاجية', 'productivity'),
  ('التعليم', 'education'),
  ('التسويق', 'marketing'),
  ('صناعة المحتوى', 'content-creation');

-- أدوات أولية. الأسعار غير محددة عمداً حتى لا تُعرض معلومة غير مؤكدة.
insert into public.tools (category_id, name, slug, description, website_url, pricing, is_published, is_featured) values
  ((select id from public.categories where slug = 'writing'), 'ChatGPT', 'chatgpt',
   'مساعد محادثة يمكن استخدامه في الكتابة وتلخيص النصوص وتوليد الأفكار.', 'https://chatgpt.com', 'unknown', true, true),
  ((select id from public.categories where slug = 'design'), 'Canva', 'canva',
   'منصة تصميم تساعد على إنشاء منشورات وعروض وتصاميم متنوعة.', 'https://www.canva.com', 'unknown', true, true),
  ((select id from public.categories where slug = 'content-creation'), 'CapCut', 'capcut',
   'تطبيق لتحرير مقاطع الفيديو القصيرة.', 'https://www.capcut.com', 'unknown', true, true);
