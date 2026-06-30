const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Cấu hình thư mục lưu ảnh
const IMAGE_DIR = path.join(__dirname, 'card_images');
const API_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

// Hàm tự động tạo thư mục nếu chưa có
if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

// Hàm trì hoãn (delay) để tránh bị rate limit (Block IP)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Hàm tải một ảnh và lưu vào máy
async function downloadImage(url, filename) {
    const filePath = path.join(IMAGE_DIR, filename);
    
    // Nếu ảnh đã tồn tại thì bỏ qua để tiết kiệm băng thông khi chạy lại
    if (fs.existsSync(filePath)) {
        return;
    }

    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        return new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`❌ Lỗi khi tải ảnh ${filename}:`, error.message);
    }
}

// Hàm chính điều khiển tiến trình crawl
async function startCrawl() {
    try {
        console.log('🔄 Đang lấy danh sách thẻ bài từ YGOPRODeck API...');
        const response = await axios.get(API_URL);
        const cards = response.data.data;
        console.log(`✅ Đã lấy xong danh sách. Tổng số thẻ bài: ${cards.length}`);

        let count = 0;

        for (const card of cards) {
            if (card.card_images && card.card_images.length > 0) {
                for (const imgInfo of card.card_images) {
                    // Bạn có thể đổi thành 'image_url_small' hoặc 'image_url_cropped' nếu muốn loại ảnh khác
                    const imageUrl = imgInfo.image_url; 
                    const filename = `${imgInfo.id}.jpg`;

                    await downloadImage(imageUrl, filename);
                    count++;

                    if (count % 10 === 0) {
                        console.log(`📸 Đã tải được ${count} ảnh...`);
                    }

                    // LƯU Ý QUAN TRỌNG: Nghỉ 100ms giữa mỗi tấm ảnh để không vượt quá 20 request/giây
                    await delay(100); 
                }
            }
        }

        console.log('🎉 Hoàn thành! Toàn bộ ảnh đã được lưu tại thư mục /card_images');

    } catch (error) {
        console.error('❌ Lỗi tiến trình gốc:', error.message);
    }
}

startCrawl();