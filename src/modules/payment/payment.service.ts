import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Payment } from './schemas/payment.schema';
import { UserService } from '../user/user.service';
import { PetService } from '../pet/pet.service';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { ERROR_MESSAGES } from 'src/shared/constants/messages';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel('Payment') private paymentModel: Model<Payment>,
    private readonly userService: UserService,
    private readonly petService: PetService,
  ) {}

  async validatePayment(userId: string, paymentId: string) {
    const payment = await this.paymentModel.findOne({
      _id: new Types.ObjectId(paymentId),
    });
    if (!payment) {
      throw new NotFoundException(ERROR_MESSAGES.PAYMENT_NOT_FOUND);
    }
    if (payment.userId.toString() !== userId) {
      throw new ForbiddenException(ERROR_MESSAGES.NO_PERMISSION_PAYMENT);
    }
  }

  async getPaymentByUserId(userId: string) {
    await this.userService.validateUserExists(userId);
    return this.paymentModel.find({ userId: new Types.ObjectId(userId) });
  }

  async createPayment(userId: string, createPaymentDto: CreatePaymentDto) {
    await this.userService.validateUserExists(userId);
    const newPayment = new this.paymentModel({
      ...createPaymentDto,
      userId: new Types.ObjectId(userId),
    });
    return newPayment.save();
  }

  async deletePayment(userId: string, paymentId: string) {
    await this.userService.validateUserExists(userId);
    await this.validatePayment(userId, paymentId);
    return this.paymentModel.deleteOne({
      _id: new Types.ObjectId(paymentId),
    });
  }
}
