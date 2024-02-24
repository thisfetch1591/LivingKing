import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostController } from './post/post.controller';
import { UserController } from './user/user.controller';
import { CommentController } from './comment/comment.controller';
import { PostService } from './post/post.service';
import { UserService } from './user/user.service';
import { CommentService } from './comment/comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig)],
  controllers: [
    AppController,
    PostController,
    UserController,
    CommentController,
  ],
  providers: [AppService, PostService, UserService, CommentService],
})
export class AppModule {}
