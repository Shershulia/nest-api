import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";
import * as pactum from 'pactum';
import { AuthDto } from "../src/auth/dto";

describe('App e2e', () => {
  //before tests take module
  let app : INestApplication;
  let prismaService: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    //DTO validation pipe
    await app.useGlobalPipes(new ValidationPipe({
      //only defined properties in the DTO will be allowed
      whitelist: true,
    }));
    await app.init()
    await app.listen(3333);
    prismaService= app.get(PrismaService);

    await prismaService.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333')
  });

  afterAll(async () => {
    await app.close();

  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'ivan@mail.com',
      password: 'password',
    }
    describe('Signup', () => {
      it('should throw if email empty', async () => {
        await pactum.spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          }).expectStatus(400)
      });
      it('should throw if password empty', async () => {
        await pactum.spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          }).expectStatus(400)
      });
      it('should throw if no body', async () => {
        await pactum.spec()
          .post('/auth/signup')
          .expectStatus(400)
      });
      it('should signup', async () => {
        await pactum.spec()
          .post('/auth/signup')
          .withBody(dto).expectStatus(201)
      });
    });
    describe('Signin', () => {

      it('should throw if email empty', async () => {
        await pactum.spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          }).expectStatus(400)
      });
      it('should throw if password empty', async () => {
        await pactum.spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          }).expectStatus(400)
      });
      it('should throw if no body', async () => {
        await pactum.spec()
          .post('/auth/signin')
          .expectStatus(400)
      });
      it('should sigin', async () => {
        await pactum.spec()
          .post('/auth/signin')
          .withBody(dto).expectStatus(200)
          .stores("userAt","access_token")
      });

    });

  });

  describe('User', () => {
    describe('Get me', () => {
      it("should get current user", async () => {
          return pactum
            .spec()
            .get("/users/me")
            .withHeaders({"Authorization": `Bearer $S{userAt}`})
            .expectStatus(200)
        }
      );
    });
      describe('Edit user', () => {
      });

    });

    describe('Bookmarks', () => {
      describe('Create bookmark', () => {
      });

      describe('Get bookmark', () => {
      });
      describe('Get bookmark by id', () => {
      });
      describe('Edit bookmark by id', () => {
      });
      describe('Delete bookmark by id', () => {
      });
    });

});
