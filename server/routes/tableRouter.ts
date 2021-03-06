import { Router } from '../../deps.ts';
import tableController from '../controllers/tableController.ts';
import routerController from '../controllers/routerController.ts';

const router = new Router();

router.get('/api/tables', tableController.getAllTables, (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = {
    success: true,
    data: ctx.state.tables
  };
});

router.post('/api/tables', tableController.createTable, routerController.createRouter, (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = {
    success: true
  };
});

router.get('/api/tables/:name', tableController.getTableByName, (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = {
    success: true,
    data: {
      rows: ctx.state.rows,
      columns: ctx.state.columns
    }
  };
});

router.delete('/api/tables/:name', tableController.deleteTableByName, routerController.deleteRouter, (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = {
    success: true
  };
});

router.get('/api/tables/:name/:id', tableController.getRow);
router.post('/api/tables/:name', tableController.createRow);
router.put('/api/tables/:name/:id', tableController.updateRow);
router.delete('/api/tables/:name/:id', tableController.deleteRow);

export default router;