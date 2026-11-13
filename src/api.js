export async function api(path,body){let response;try{response=await fetch(path,{credentials:'same-origin',...(body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{})})}catch{throw Error('Chưa kết nối được. Bài đang soạn vẫn được giữ trên thiết bị này.')}
let data;try{data=await response.json()}catch{throw Error('Chưa tải được dữ liệu. Vui lòng thử lại sau.')}
if(!response.ok)throw Error(data.error||'Chưa thực hiện được yêu cầu.');return data}
export const when=stamp=>new Date(stamp).toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'});
