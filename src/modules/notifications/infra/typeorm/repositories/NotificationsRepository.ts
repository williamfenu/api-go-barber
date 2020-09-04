import { getMongoRepository, MongoRepository } from 'typeorm';

import INotificationRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '../schemas/Notifications';

export default class NotificationRepository implements INotificationRepository {
    private ormRepository: MongoRepository<Notification>;

    constructor() {
        this.ormRepository = getMongoRepository(Notification, 'mongo');
    }

    public async create({
        content,
        recipientId,
    }: ICreateNotificationDTO): Promise<Notification> {
        const notification = this.ormRepository.create({
            content,
            recipientId,
        });

        const savedNotification = await this.ormRepository.save(notification);

        return savedNotification;
    }
}
