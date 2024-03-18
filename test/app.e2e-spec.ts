import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";
import * as pactum from 'pactum';
import { AuthDto } from "../src/auth/dto";
import { EditUserDto } from "../src/user/dto";
import { CreateBookmarkDto, EditBookmarkDto } from "../src/bookmark/dto";

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
        it("should edit user", async () => {
          const dto: EditUserDto = {
            email: "email@gmail.com",
            name: "Ivan Ivanov"
          }
            return pactum
              .spec()
              .patch("/users")
              .withHeaders({"Authorization": `Bearer $S{userAt}`})
              .withBody(dto)
              .expectStatus(200)
              .expectBodyContains(dto.name)
              .expectBodyContains(dto.email)
          }
        );
      });

    });

    describe('Bookmarks', () => {
      describe('Get empty bookmarks', () => {
        it("should get empty bookmarks", async () => {
            return pactum
              .spec()
              .get("/bookmarks")
              .withHeaders({"Authorization": `Bearer $S{userAt}`})
              .expectStatus(200)
              .expectBody([])
          }
        );
      });
      describe('Create bookmark', () => {
        const dto: CreateBookmarkDto = {
          title:"First bookmark",
          link: "https://www.google.com"
        }
        it("it should create a bookmark", async () => {
            return pactum
              .spec()
              .post("/bookmarks")
              .withBody(dto)
              .withHeaders({"Authorization": `Bearer $S{userAt}`})
              .expectStatus(201)
              .stores("bookmarkId","id")
          }
        );
      });

      describe('Get bookmark', () => {
        it("should get bookmarks", async () => {
            return pactum
              .spec()
              .get("/bookmarks")
              .withHeaders({"Authorization": `Bearer $S{userAt}`})
              .expectStatus(200)
              .expectJsonLength(1)
          }
        );
      });
      describe('Get bookmark by id', () => {
        it("should get bookmark by id", async () => {
            return pactum
              .spec()
              .get("/bookmarks/{id}")
              .withPathParams({
                id: "$S{bookmarkId}"
              })
              .withHeaders({"Authorization": `Bearer $S{userAt}`})
              .expectStatus(200).expectBodyContains("First bookmark")
          }
        );
      });
      describe('Edit bookmark by id', () => {
        const dto: EditBookmarkDto = {
          title:"First edited bookmark",
        }
        it("should edit bookmark by id ", async () => {
            return pactum
              .spec()
              .patch("/bookmarks/{id}")
              .withPathParams({
                id: "$S{bookmarkId}"
              })
              .withBody(dto)
              .withHeaders({"Authorization": `Bearer $S{userAt}`})
              .expectStatus(200)
              .expectBodyContains("First edited bookmark")

          }
        );
      });
      describe('Delete bookmark by id', () => {
        it("should delete bookmark by id ", async () => {
            return pactum
              .spec()
              .delete("/bookmarks/{id}")
              .withPathParams({
                id: "$S{bookmarkId}"
              })
              .withHeaders({"Authorization": `Bearer $S{userAt}`})
              .expectStatus(204)

          }
        );
      });

      describe('Get empty bookmarks', () => {
        it("should get empty bookmarks", async () => {
            return pactum
              .spec()
              .get("/bookmarks")
              .withHeaders({"Authorization": `Bearer $S{userAt}`})
              .expectStatus(200)
              .expectBody([])
          }
        );
      });

    });

});
