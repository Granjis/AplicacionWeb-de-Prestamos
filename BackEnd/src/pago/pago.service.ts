import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';
import { Repository } from 'typeorm';
import { PagoEntity } from './pago.entity';

@Injectable()
export class PagoService {

    constructor(
        @InjectRepository(PagoEntity)
        private readonly pagoRepository: Repository<PagoEntity>
    ){}
    
    async findAll(): Promise<PagoEntity[]> {
        return await this.pagoRepository.find();
    }

    async findOne(id: string): Promise<PagoEntity> {
        const pago: PagoEntity = await this.pagoRepository.findOne({where: {id}} );
        if (!pago)
          throw new BusinessLogicException("The pago with the given id was not found", BusinessError.NOT_FOUND);
   
        return pago;
    }

    async create(pago: PagoEntity): Promise<PagoEntity> {
        return await this.pagoRepository.save(pago);
    }
    
    async update(id: string, pago: PagoEntity): Promise<PagoEntity> {
        const persistedPago: PagoEntity = await this.pagoRepository.findOne({where:{id}});
        if (!persistedPago)
          throw new BusinessLogicException("The pago with the given id was not found", BusinessError.NOT_FOUND);
       
        pago.id = id; 
       
        return await this.pagoRepository.save(pago);
    }


    async delete(id: string) {
        const pago: PagoEntity = await this.pagoRepository.findOne({where:{id}});
        if (!pago)
          throw new BusinessLogicException("The pago with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.pagoRepository.remove(pago);
    }



}
