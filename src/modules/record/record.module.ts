import { Module } from '@nestjs/common';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RecordSchema } from './schemas/record.schema';
import { UserModule } from '../user/user.module';
import { PetModule } from '../pet/pet.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Record', schema: RecordSchema }]),
    UserModule,
    PetModule,
  ],
  controllers: [RecordController],
  providers: [RecordService],
  exports: [RecordService],
})
export class RecordModule {}
