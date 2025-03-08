import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MastersModule } from 'src/api/masters/masters.module';
import { AddressesModule } from 'src/api/masters/addresses/addresses.module';
import { CustomerModule } from 'src/api/masters/customers/customers.module';
import { DatabaseConnection } from 'test/database/database.testing.connection';
import { DatabaseModule } from 'test/database/database.testing.module';
import { ApiModule } from 'src/api/api.module';
import { AuthModule } from '@/api/auth/auth.module';
import { AppModule } from 'src/app.module';
import {
  FormattedResponseI,
  SearchCriteriaI,
} from 'src/api/entities/interfaces/api.entity';
import { isFormattedResponse } from 'test/utils.test';
import * as fs from 'fs';
import * as path from 'path';
import { CustomerI } from '@/api/entities/interfaces/masters.entity';

jest.setTimeout(30000);

describe('CustomerController (e2e)', () => {
  let app: INestApplication;
  let maestrosConnection: DatabaseConnection;
  const runMutationTests = process.env.RUN_MUTATION_TESTS === 'true';
  const apiKey = process.env.GLOBAL_API_KEY;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        AuthModule,
        ApiModule,
        DatabaseModule,
        MastersModule,
        AddressesModule,
        CustomerModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    maestrosConnection = app.get('MAESTROS_CONNECTION');
    await maestrosConnection.connect();
  });

  afterAll(async () => {
    await maestrosConnection.close();
    await app.close();
  });

  it('/masters/customers/v2/status (GET)', async () => {
    return await request(app.getHttpServer())
      .get('/masters/customers/v2/status')
      .set('X-api-key', apiKey)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('statusCode', 200);
        expect(res.body).toHaveProperty(
          'message',
          'Client endpoint is working',
        );
      });
  });

  it('/masters/customers/v2/id/:id (GET)', async () => {
    const customerId = '60';
    return await request(app.getHttpServer())
      .get(`/masters/customers/v2/id/${customerId}`)
      .set('X-api-key', apiKey)
      .expect(200)
      .expect((res) => {
        isFormattedResponse(res.body);
        const formattedResponse = res.body as FormattedResponseI;
        expect(formattedResponse).toHaveProperty('statusCode', 200);
        expect(formattedResponse).toHaveProperty('id', customerId);
        expect(formattedResponse).toHaveProperty('data');
        expect(formattedResponse.data).toMatchObject<CustomerI>({
          customerID: customerId,
          customerName: 'POC Customer',
          customerNIF: '123456789',
          customerDefCurrency: '',
          customerDefCurrencyISO: '',
          customerDescription: '',
          customerIndustry: '',
          customerPhone: '',
          customerEmail: '',
          customerCreatedAt: '',
          customerUpdatedAt: '',
        });
      });
  });

  it('/masters/customers/v2/id/tms/:tmsID (GET)', async () => {
    const tmsID = '42665';
    return await request(app.getHttpServer())
      .get(`/masters/customers/v2/id/tms/${tmsID}`)
      .set('X-api-key', apiKey)
      .expect(200)
      .expect((res) => {
        isFormattedResponse(res.body);
        const formattedResponse = res.body as FormattedResponseI;
        expect(formattedResponse).toHaveProperty('statusCode', 200);
        expect(formattedResponse).toHaveProperty('data');
        expect(formattedResponse.data).toHaveProperty(
          'id',
          parseInt(tmsID, 10),
        );
      });
  });

  it('/masters/customers/v2/id/sga/:sgaId (GET)', async () => {
    const sgaId = '1242';
    return await request(app.getHttpServer())
      .get(`/masters/customers/v2/id/sga/${sgaId}`)
      .set('X-api-key', apiKey)
      .expect(200)
      .expect((res) => {
        isFormattedResponse(res.body);
        const formattedResponse = res.body as FormattedResponseI;
        expect(formattedResponse).toHaveProperty('statusCode', 200);
        expect(formattedResponse).toHaveProperty('data');
        expect(formattedResponse.data).toBeInstanceOf(Array);
        expect(formattedResponse.data).toHaveProperty(
          'id',
          parseInt(sgaId, 10),
        );
      });
  });

  it('/masters/customers/v2 (GET)', async () => {
    return await request(app.getHttpServer())
      .get('/masters/customers/v2')
      .query({ page: 0, limit: 50 })
      .set('X-api-key', apiKey)
      .expect(200)
      .expect((res) => {
        isFormattedResponse(res.body);
        const formattedResponse = res.body as FormattedResponseI;
        expect(formattedResponse).toHaveProperty('statusCode', 200);
        expect(formattedResponse).toHaveProperty('data');
        expect(formattedResponse.data).toBeInstanceOf(Array);
      });
  });

  it('/masters/customers/v2 (GET)', async () => {
    const searchCriteriaJSON: SearchCriteriaI = {
      filters: [
        {
          field: 'customerName',
          operator: 'like',
          value: 'PO',
        },
      ],
      search: '',
      sort: [],
    };
    const searchCriteriaURI = JSON.stringify(searchCriteriaJSON);
    const queryParam = encodeURIComponent(searchCriteriaURI);
    return await request(app.getHttpServer())
      .get('/masters/customers/v2')
      .query({ page: 0, limit: 50, searchCriteria: queryParam })
      .set('X-api-key', apiKey)
      .expect(200)
      .expect((res) => {
        isFormattedResponse(res.body);
        const formattedResponse = res.body as FormattedResponseI;
        expect(formattedResponse).toHaveProperty('statusCode', 200);
        expect(formattedResponse).toHaveProperty('data');
        expect(formattedResponse.data).toBeInstanceOf(Array);
      });
  });

  if (runMutationTests) {
    it('/masters/customers/v2 (POST)', async () => {
      const newCustomer = JSON.parse(
        fs.readFileSync(path.join(__dirname, 'customer-insert.json'), 'utf8'),
      );
      return await request(app.getHttpServer())
        .post('/masters/customers/v2')
        .send(newCustomer)
        .set('X-api-key', apiKey)
        .expect(200)
        .expect((res) => {
          isFormattedResponse(res.body);
          const formattedResponse = res.body as FormattedResponseI;
          expect(formattedResponse).toHaveProperty('statusCode', 200);
          expect(formattedResponse).toHaveProperty('data');
          expect(formattedResponse.data).toHaveProperty('id');
        });
    });

    it('/masters/customers/v2/:id (PUT)', async () => {
      const customerId = 'some-id';
      const updatedCustomer = JSON.parse(
        fs.readFileSync(path.join(__dirname, 'customer-update.json'), 'utf8'),
      );
      return await request(app.getHttpServer())
        .put(`/masters/customers/v2/${customerId}`)
        .send(updatedCustomer)
        .set('X-api-key', apiKey)
        .expect(200)
        .expect((res) => {
          isFormattedResponse(res.body);
          const formattedResponse = res.body as FormattedResponseI;
          expect(formattedResponse).toHaveProperty('statusCode', 200);
          expect(formattedResponse).toHaveProperty('data');
          expect(formattedResponse.data).toHaveProperty('id', customerId);
        });
    });

    it('/masters/customers/v2/:id (DELETE)', async () => {
      const customerId = 'some-id';
      return await request(app.getHttpServer())
        .delete(`/masters/customers/v2/${customerId}`)
        .set('X-api-key', apiKey)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 200);
          expect(res.body).toHaveProperty('data', null);
        });
    });
  }
});
