import Router from 'express';
import { 
    getInvoice, 
    getAllInvoices,
    createInvoice, 
    updateInvoice, 
    deleteInvoice 
} from '../controllers/invoiceController.js';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', authenticate, getAllInvoices);
router.get('/:id', authenticate, getInvoice);
router.post('/', authenticate, authorizeAdmin, createInvoice);
router.put('/:id', authenticate, authorizeAdmin, updateInvoice);
router.delete('/:id', authenticate, authorizeAdmin, deleteInvoice);

export default router;