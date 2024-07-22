import { CourseGetCourse, PaymentCheck, PaymentGenerateLink, PaymentStatus } from '@school/contracts';
import { PurchaseStatus } from '@school/interfaces';
import { UserEntity } from '../entities/user.entity';
import { BuyCourseSagaState } from './buy-course.state';

export class BuyCourseSagaStateStarted extends BuyCourseSagaState {
  public async pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    const { course } = await this.saga.rmqService.send<
      CourseGetCourse.Request,
      CourseGetCourse.Response
    >(CourseGetCourse.topic, {
      id: this.saga.courseId,
    });
    if (!course) {
      throw new Error('The course is not exist');
    }
    if (course.price === 0) {
      this.saga.setState(PurchaseStatus.Paid, course._id);
      return { paymentLink: null, user: this.saga.user };
    }
    const { paymentLink } = await this.saga.rmqService.send<
      PaymentGenerateLink.Request,
      PaymentGenerateLink.Response
    >(PaymentGenerateLink.topic, {
      courseId: course._id,
      userId: this.saga.user._id,
      sum: course.price,
    });
    this.saga.setState(PurchaseStatus.WaitingForPayment, course._id);
    return { paymentLink, user: this.saga.user };
  }
  public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
    throw new Error('Payment is not created yet');
  }
  public async cancel(): Promise<{ user: UserEntity }> {
    this.saga.setState(PurchaseStatus.Cancelled, this.saga.courseId);
    return { user: this.saga.user };
  }
}

export class BuyCourseSagaStateWaitingForPayment extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    throw new Error('Forbidden to pay for course in progress');
  }
  public async checkPayment(): Promise<{
    user: UserEntity;
    status: PaymentStatus;
  }> {
    const { status } = await this.saga.rmqService.send<
      PaymentCheck.Request,
      PaymentCheck.Response
    >(PaymentCheck.topic, {
      userId: this.saga.user._id,
      courseId: this.saga.courseId,
    });
    if (status === 'canceled') {
      this.saga.setState(PurchaseStatus.Cancelled, this.saga.courseId);
      return { user: this.saga.user, status: 'canceled' };
    }
    if (status === 'success') {
      return { user: this.saga.user, status: 'success' };
    }
    this.saga.setState(PurchaseStatus.Paid, this.saga.courseId);
    return { user: this.saga.user, status: 'progress' };
  }
  public cancel(): Promise<{ user: UserEntity }> {
    throw new Error('Payment in progress');
  }
}

export class BuyCourseSagaStatePurchased extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    throw new Error('Course is already bought');
  }
  public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
    throw new Error('Forbidden to check payment for bought course');
  }
  public cancel(): Promise<{ user: UserEntity }> {
    throw new Error('Forbidden to cancel bought course');
  }
}

export class BuyCourseSagaStateCanceled extends BuyCourseSagaState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    this.saga.setState(PurchaseStatus.Started, this.saga.courseId);
    return this.saga.getState().pay();
  }
  public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
    throw new Error('Course is canceled, no payment');
  }
  public cancel(): Promise<{ user: UserEntity }> {
    throw new Error('Course is already canceled');
  }
}
