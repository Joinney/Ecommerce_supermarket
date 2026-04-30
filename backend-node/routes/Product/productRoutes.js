import express from 'express';
import { getAllProducts, getProductById } from '../../controllers/Product/productController.js';

const router = express.Router();

// 1. Lấy tất cả sản phẩm cho trang Home
router.get('/all-products', getAllProducts);

// 2. Lấy chi tiết một sản phẩm theo ID cho trang ProductDetail 🚀
// Lưu ý: Đường dẫn này phải khớp với fetch ở Frontend: /api/products/1
router.get('/:id', getProductById); 

export default router;