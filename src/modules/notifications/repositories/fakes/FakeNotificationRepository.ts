import { ObjectID } from 'mongodb';

import INotificationRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '../../infra/typeorm/schemas/Notifications';

export default class NotificationRepository implements INotificationRepository {
    private notifications: Notification[] = [];

    public async create({
        content,
        recipientId,
    }: ICreateNotificationDTO): Promise<Notification> {
        const notification = new Notification();

        Object.assign(notification, {
            id: new ObjectID(),
            content,
            recipientId,
        });

        this.notifications.push(notification);
        return notification;
    }
}
