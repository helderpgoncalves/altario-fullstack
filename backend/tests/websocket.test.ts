import Fastify, { FastifyInstance } from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import WebSocket from 'ws';
import { gridRoutes } from '../src/routes/grid';
import paymentRoutes from '../src/routes/payments';
import { websocketHandlers } from '../src/websocket/handlers';

describe('WebSocket Tests', () => {
  let app: FastifyInstance;
  let ws: WebSocket;

  beforeAll(async () => {
    app = Fastify();
    await app.register(fastifyWebsocket);
    await app.register(gridRoutes);
    await app.register(paymentRoutes);
    app.register(async (fastify) => {
      fastify.get('/ws', { websocket: true }, (connection) => {
        websocketHandlers.handleConnection(connection);
      });
    });
    await app.listen({ port: 0 });
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach((done) => {
    ws = new WebSocket(`ws://localhost:${(app.server.address() as any).port}/ws`);
    ws.on('open', done);
  });

  afterEach((done) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
    done();
  });

  it('should receive grid update when START_GENERATOR message is sent', (done) => {
    ws.send(JSON.stringify({ type: 'START_GENERATOR', payload: { biasChar: null } }));

    ws.once('message', (data) => {
      const message = JSON.parse(data.toString());
      expect(message.type).toBe('GRID_UPDATE');
      expect(message.payload).toHaveProperty('grid');
      expect(message.payload).toHaveProperty('code');
      expect(message.payload).toHaveProperty('seconds');
      done();
    });
  });

  it('should receive payment added update when ADD_PAYMENT message is sent', (done) => {
    const paymentData = {
      name: 'Test Payment',
      amount: 100,
      code: '12',
      grid: [['a', 'b'], ['c', 'd']],
    };

    ws.send(JSON.stringify({ type: 'ADD_PAYMENT', payload: paymentData }));

    ws.once('message', (data: any) => {
      const message = JSON.parse(data.toString());
      expect(message.type).toBe('PAYMENT_ADDED');
      expect(message.payload).toMatchObject(paymentData);
      expect(message.payload).toHaveProperty('id');
      expect(message.payload).toHaveProperty('createdAt');
      done();
    });
  });
});
