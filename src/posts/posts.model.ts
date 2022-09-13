import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/roles/roles.model";
import { UserRoles } from "src/roles/user-roles.model";
import { User } from "src/users/users.model";

interface PostCreationAttrs {
    title: string;
    content: string;
    userId: string;
    image: string;
}

@Table({ tableName: "posts" })
export class Post extends Model<Post, PostCreationAttrs> {
    @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ example: "Hello World!", description: "Название статьи" })
    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @ApiProperty({
        example: "Первая строка, которую выводят начинающие программисты",
        description: "Контентная часть статьи",
    })
    @Column({ type: DataType.STRING, allowNull: false })
    content: string;

    @ApiProperty({ example: "cat.png", description: "Картинка" })
    @Column({ type: DataType.STRING, allowNull: false })
    image: string;

    @ApiProperty({ example: "cat.png", description: "Картинка" })
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    user_id: number;

    @BelongsTo(() => User)
    author: User;
}
