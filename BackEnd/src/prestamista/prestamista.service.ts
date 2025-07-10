import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrestamistaEntity } from './prestamista.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class PrestamistaService {

    constructor(
        @InjectRepository(PrestamistaEntity)
        private readonly prestamistaRepository: Repository<PrestamistaEntity>
    ){}

    async findAll(): Promise<PrestamistaEntity[]> {
        return await this.prestamistaRepository.find({ relations: ["recursos", "prestamos"] });
    }

    async findOne(id: string): Promise<PrestamistaEntity> {
        const prestamista: PrestamistaEntity = await this.prestamistaRepository.findOne({where: {id}, relations: ["recursos", "prestamos"] } );
        if (!prestamista)
          throw new BusinessLogicException("The prestamista with the given id was not found", BusinessError.NOT_FOUND);
   
        return prestamista;
    }

    async create(prestamista: PrestamistaEntity): Promise<PrestamistaEntity> {
        return await this.prestamistaRepository.save(prestamista);
    }

    async update(id: string, prestamista: PrestamistaEntity): Promise<PrestamistaEntity> {
        const persistedPrestamista: PrestamistaEntity = await this.prestamistaRepository.findOne({where:{id}});
        if (!persistedPrestamista)
          throw new BusinessLogicException("The prestamista with the given id was not found", BusinessError.NOT_FOUND);
        
        return await this.prestamistaRepository.save({...persistedPrestamista, ...prestamista});
    }

    async delete(id: string) {
        const prestamista: PrestamistaEntity = await this.prestamistaRepository.findOne({where:{id}});
        if (!prestamista)
          throw new BusinessLogicException("The prestamista with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.prestamistaRepository.remove(prestamista);
    }




}
