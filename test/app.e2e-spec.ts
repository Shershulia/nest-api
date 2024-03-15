import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";


describe('App e2e', () => {
  //before tests take module
  let app : INestApplication;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.useGlobalPipes(new ValidationPipe({
      //only defined properties in the DTO will be allowed
      whitelist: true,
    }));
    await app.init()
  });

  afterAll(async () => {
    await app.close();

  });

  it.todo('should display welcome message');
  it.todo('should display welcome message');

});
