import { Injectable } from '@nestjs/common';
import { PrestamoEntity } from './prestamo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';



@Injectable()
export class PrestamoService {
    constructor(
        @InjectRepository(PrestamoEntity)
        private readonly prestamoRepository: Repository<PrestamoEntity>
    ){}
    async findAll(): Promise<PrestamoEntity[]> {
        return await this.prestamoRepository.find({ relations: ["deudor", "historialpagos"] });
    }
    async findOne(id: string): Promise<PrestamoEntity> {
        const prestamo: PrestamoEntity = await this.prestamoRepository.findOne({where: {id}, relations: ["deudor", "historialpagos"] } );
        if (!prestamo)
          throw new BusinessLogicException("The prestamo with the given id was not found", BusinessError.NOT_FOUND);
   
        return prestamo;
    }
    async create(prestamo: PrestamoEntity): Promise<PrestamoEntity> {
        return await this.prestamoRepository.save(prestamo);
    }
    async update(id: string, prestamo: PrestamoEntity): Promise<PrestamoEntity> {
        const persistedprestamo: PrestamoEntity = await this.prestamoRepository.findOne({where:{id}, relations: ["deudor", "historialpagos"]});
        if (!persistedprestamo)
          throw new BusinessLogicException("The prestamo with the given id was not found", BusinessError.NOT_FOUND);
        
        return await this.prestamoRepository.save({...persistedprestamo, ...prestamo});
    }
    async delete(id: string) {
        const prestamo: PrestamoEntity = await this.prestamoRepository.findOne({where:{id}});
        if (!prestamo)
          throw new BusinessLogicException("The prestamo with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.prestamoRepository.remove(prestamo);
    }
 
}
