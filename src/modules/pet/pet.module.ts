import { Module } from '@nestjs/common';
import { PetService } from './pet.service';
import { PetController } from './pet.controller';
import { PetSchema } from './schemas/pet.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Pet', schema: PetSchema }]),
    UserModule,
  ],
  controllers: [PetController],
  providers: [PetService],
  exports: [PetService],
})
export class PetModule {}
