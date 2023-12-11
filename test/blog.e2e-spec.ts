import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { BlogModule, Post, PostCategory } from '../src'; // Replace with the correct package name
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { AuthModule, Group, Role, User } from '@pietro/auth';
import { Repository } from 'typeorm';

describe('MyNestPackageController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "mysql",
          database: "test",
          username: "root",
          password: "root",
          host: "localhost",
          port: 3306,
          entities: [Post, PostCategory, User, Group, Role],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Post, PostCategory, User]),
        BlogModule,
        AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const tokens = await request(app.getHttpServer()).post('/auth/local/signup').send({
      email: 'aMICIOaMIaaAaOaoasd@pluto.it',
      password: 'password'
    })
    authToken = tokens.body.accessToken;
  });

  afterAll(async () => {

    await app.close();
  });

  it('/blog (POST)', async () => {
    console.log('TOKENS PD', authToken)
    const response = await request(app.getHttpServer())
      .post('/blog')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test title',
        content: 'Test content',
      });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(Number),
      title: 'Test title',
      content: 'Test content',
      createdAt: expect.any(String),
      author: {
        id: expect.any(String),
        email: expect.any(String),
      }
    });
    expect(true).toBe(true);
  })

  // it('/blog (GET)', async () => {
  //   const response = await request(app.getHttpServer())
  //     .get('/blog?page=1&pageSize=10')

  //   console.log(response.body)

  //   const posts = response.body;
  //   expect(posts).toBeInstanceOf(Array);
  // });

});
