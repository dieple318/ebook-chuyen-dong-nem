import{getStore}from'@netlify/blobs';import{createHandler}from'../../server/netlify-api.js';
export default async(request,context)=>createHandler({store:getStore({name:process.env.EBOOK_STORE_NAME||'ebook-projectile-v2',consistency:'strong'}),secret:process.env.SESSION_SECRET,password:process.env.ADMIN_PASSWORD})(request,context);
