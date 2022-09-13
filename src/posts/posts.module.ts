import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { FilesModule } from "src/files/files.module";
import { User } from "src/users/users.model";
import { PostsController } from "./posts.controller";
import { Post } from "./posts.model";
import { PostsService } from "./posts.service";

@Module({
    controllers: [PostsController],
    providers: [PostsService],
    imports: [SequelizeModule.forFeature([User, Post]), FilesModule],
})
export class PostsModule {}
