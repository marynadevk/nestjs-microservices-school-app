import { PurchaseStatus } from '@school/interfaces';
import { RMQService } from 'nestjs-rmq';
import { UserEntity } from '../entities/user.entity';
import { BuyCourseSagaState } from './buy-course.state';
import { BuyCourseSagaStateCanceled, BuyCourseSagaStatePurchased, BuyCourseSagaStateWaitingForPayment, BuyCourseSagaStateStarted } from './buy-course.steps';

export class BuyCourseSaga {
	private state: BuyCourseSagaState;

	constructor(public user: UserEntity, public courseId: string, public rmqService: RMQService) {
		this.setState(user.getCourseStatus(courseId), courseId);
	}

	setState(state: PurchaseStatus, courseId: string) {
		switch (state) {
			case PurchaseStatus.Started:
				this.state = new BuyCourseSagaStateStarted();
				break;
			case PurchaseStatus.WaitingForPayment:
				this.state = new BuyCourseSagaStateWaitingForPayment();
				break;
			case PurchaseStatus.Paid:
				this.state = new BuyCourseSagaStatePurchased();
				break;
			case PurchaseStatus.Cancelled:
				this.state = new BuyCourseSagaStateCanceled();
				break;
		}
		this.state.setContext(this);
		this.user.setCourseStatus(courseId, state);
	}

	getState() {
		return this.state;
	}
}
