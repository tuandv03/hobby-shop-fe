const sql = require('mssql');
const axios = require('axios');

// 1. Cấu hình kết nối MSSQL (Thay đổi thông tin phù hợp với DB của bạn)
const dbConfig = {
    user: 'sa',
    password: 'Lamcha@123',
    server: 'localhost', 
    database: 'Yugioh',
    options: {
        encrypt: true, // Sử dụng nếu dùng Azure hoặc Docker MSSQL mới
        trustServerCertificate: true // Bỏ qua kiểm tra chứng chỉ nếu chạy localhost
    }
};


async function main() {
    let pool;
    try {
        console.log('🔄 Đang kết nối tới SQL Server...');
        pool = await sql.connect(dbConfig);
        
        console.log('✅ Cấu trúc Database đã sẵn sàng.');

        // Bước 2: Gọi API lấy dữ liệu (Ví dụ lấy thẻ Dark Magician)
        console.log('🌐 Đang gọi API lấy dữ liệu...');
        const apiResponse = await axios.get('https://db.ygoprodeck.com/api/v7/cardinfo.php');
        
        // API trả về mảng nằm trong thuộc tính 'data'
        const cardsList = apiResponse.data.data; 

        if (!cardsList || cardsList.length === 0) {
            console.log('❌ Không tìm thấy dữ liệu từ API.');
            return;
        }

        console.log(`📥 Đang xử lý lưu ${cardsList.length} thẻ bài vào DB...`);

        // Bước 3: Lưu dữ liệu vào DB
        for (const card of cardsList) {
            // Lấy phần tử giá đầu tiên (nếu có)
            const prices = card.card_prices ? card.card_prices[0] : {};

            // Sử dụng Transaction để đảm bảo dữ liệu lưu đồng bộ hoặc rollback nếu lỗi
            const transaction = new sql.Transaction(pool);
            await transaction.begin();

            try {
                // Kiểm tra xem card đã tồn tại chưa để tránh trùng khóa chính id
                const checkExist = await transaction.request()
                    .input('id', sql.Int, card.id)
                    .query('SELECT id FROM cards WHERE id = @id');

                if (checkExist.recordset.length > 0) {
                    console.log(`⚠️ Thẻ bài ID ${card.id} (${card.name}) đã tồn tại. Bỏ qua.`);
                    await transaction.commit();
                    continue;
                }

                // Chèn vào bảng cards chính
                await transaction.request()
                    .input('id', sql.Int, card.id)
                    .input('name', sql.NVarChar, card.name)
                    .input('type', sql.VarChar, card.type)
                    .input('frame_type', sql.VarChar, card.frameType)
                    .input('description', sql.NVarChar, card.desc)
                    .input('race', sql.VarChar, card.race)
                    .input('atk', sql.Int, card.atk)
                    .input('def', sql.Int, card.def)
                    .input('level', sql.Int, card.level)
                    .input('attribute', sql.VarChar, card.attribute)
                    .input('archetype', sql.NVarChar, card.archetype)
                    .input('ygoprodeck_url', sql.VarChar, card.ygoprodeck_url)
                    .input('price_cardmarket', sql.Decimal(10, 2), prices.cardmarket_price)
                    .input('price_tcgplayer', sql.Decimal(10, 2), prices.tcgplayer_price)
                    .input('price_ebay', sql.Decimal(10, 2), prices.ebay_price)
                    .input('price_amazon', sql.Decimal(10, 2), prices.amazon_price)
                    .query(`
                        INSERT INTO cards (id, name, type, frame_type, description, race, atk, def, level, attribute, archetype, ygoprodeck_url, price_cardmarket, price_tcgplayer, price_ebay, price_amazon)
                        VALUES (@id, @name, @type, @frame_type, @description, @race, @atk, @def, @level, @attribute, @archetype, @ygoprodeck_url, @price_cardmarket, @price_tcgplayer, @price_ebay, @price_amazon)
                    `);

                // Chèn danh sách hình ảnh (card_images)
               if (card.card_images && card.card_images.length > 0) {
                    
                    const baseUrlToRemove = 'https://images.ygoprodeck.com/images/';
                    for (const img of card.card_images) {
                        // Thực hiện replace để loại bỏ domain tĩnh, chỉ giữ lại cụm path phía sau (e.g., "cards/46986414.jpg")
                        const cleanUrl = img.image_url ? img.image_url.replace(baseUrlToRemove, '') : '';
                        const cleanUrlSmall = img.image_url_small ? img.image_url_small.replace(baseUrlToRemove, '') : '';
                        const cleanUrlCropped = img.image_url_cropped ? img.image_url_cropped.replace(baseUrlToRemove, '') : '';

                        await transaction.request()
                            .input('card_id', sql.Int, card.id)
                            .input('image_id', sql.Int, img.id)
                            .input('image_url', sql.VarChar, cleanUrl)
                            .input('image_url_small', sql.VarChar, cleanUrlSmall)
                            .input('image_url_cropped', sql.VarChar, cleanUrlCropped)
                            .query(`
                                INSERT INTO card_images (card_id, image_id, image_url, image_url_small, image_url_cropped)
                                VALUES (@card_id, @image_id, @image_url, @image_url_small, @image_url_cropped)
                            `);
                    }
                }

                // Chèn danh sách bộ bài (card_sets)
                if (card.card_sets && card.card_sets.length > 0) {
                    for (const set of card.card_sets) {
                        await transaction.request()
                            .input('card_id', sql.Int, card.id)
                            .input('set_name', sql.NVarChar, set.set_name)
                            .input('set_code', sql.VarChar, set.set_code)
                            .input('set_rarity', sql.NVarChar, set.set_rarity)
                            .input('set_rarity_code', sql.VarChar, set.set_rarity_code)
                            .input('set_price', sql.Decimal(10, 2), set.set_price)
                            .query(`
                                INSERT INTO card_sets (card_id, set_name, set_code, set_rarity, set_rarity_code, set_price)
                                VALUES (@card_id, @set_name, @set_code, @set_rarity, @set_rarity_code, @set_price)
                            `);
                    }
                }

                // Hoàn tất transaction cho thẻ này
                await transaction.commit();
                console.log(`🎉 Đã lưu thành công thẻ bài: ${card.name}`);

            } catch (err) {
                // Nếu có lỗi ở bất kỳ bảng nào, hủy toàn bộ thay đổi của thẻ bài này để tránh rác DB
                await transaction.rollback();
                console.error(`❌ Lỗi khi lưu thẻ bài ${card.name}:`, err.message);
            }
        }

    } catch (error) {
        console.error('❌ Lỗi hệ thống:', error.message);
    } finally {
        if (pool) {
            await pool.close();
            console.log('🔌 Đã ngắt kết nối DB.');
        }
    }
}

main();