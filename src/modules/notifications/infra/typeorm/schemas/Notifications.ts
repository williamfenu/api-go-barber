import {
    Entity,
    Column,
    ObjectID,
    CreateDateColumn,
    UpdateDateColumn,
    ObjectIdColumn,
} from 'typeorm';

@Entity('notifications')
export default class Notification {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    content: string;

    @Column({ default: false })
    read: boolean;

    @Column('uuid', { name: 'recipient_id' })
    recipientId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;
}
