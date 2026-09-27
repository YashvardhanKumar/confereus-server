import { User } from '../models/user_profile/user.model';
import { Conference } from '../models/conference.model';
import { Event } from '../models/events.model';
import { Abstract } from '../models/abstract.model';
import { Notification } from '../models/notification.model';

describe('Model Schemas & Definitions', () => {
  it('User model should have expected schema fields', () => {
    expect(User.schema.path('email')).toBeDefined();
    expect(User.schema.path('name')).toBeDefined();
    expect(User.schema.path('provider')).toBeDefined();
  });

  it('Conference model should have expected schema fields', () => {
    expect(Conference.schema.path('subject')).toBeDefined();
    expect(Conference.schema.path('location')).toBeDefined();
    expect(Conference.schema.path('startTime')).toBeDefined();
    expect(Conference.schema.path('endTime')).toBeDefined();
    expect(Conference.schema.path('eventsId')).toBeDefined();
  });

  it('Event model should have expected schema fields', () => {
    expect(Event.schema.path('subject')).toBeDefined();
    expect(Event.schema.path('conferenceId')).toBeDefined();
    expect(Event.schema.path('startTime')).toBeDefined();
    expect(Event.schema.path('endTime')).toBeDefined();
  });

  it('Abstract model should have expected schema fields', () => {
    expect(Abstract.schema.path('paperName')).toBeDefined();
    expect(Abstract.schema.path('conferenceId')).toBeDefined();
    expect(Abstract.schema.path('eventId')).toBeDefined();
    expect(Abstract.schema.path('isApproved')).toBeDefined();
  });

  it('Notification model should have expected schema fields', () => {
    expect(Notification.schema.path('userId')).toBeDefined();
    expect(Notification.schema.path('title')).toBeDefined();
    expect(Notification.schema.path('body')).toBeDefined();
    expect(Notification.schema.path('channel')).toBeDefined();
    expect(Notification.schema.path('status')).toBeDefined();
  });
});
