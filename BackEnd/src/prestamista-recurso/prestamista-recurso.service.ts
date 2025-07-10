import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecursoEntity } from '../recurso/recurso.entity';
import { PrestamistaEntity } from '../prestamista/prestamista.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class PrestamistaRecursoService {
    constructor(
        @InjectRepository(PrestamistaEntity)
        private readonly prestamistaRepository: Repository<PrestamistaEntity>,
     
        @InjectRepository(RecursoEntity)
        private readonly recursoRepository: Repository<RecursoEntity>
    ) {}

    async addRecursoPrestamista(prestamistaId: string, recursoId: string): Promise<PrestamistaEntity> {
        const recurso: RecursoEntity = await this.recursoRepository.findOne({where: {id: recursoId}});
        if (!recurso)
          throw new BusinessLogicException("El recurso con el id proporcionado no fue encontrado", BusinessError.NOT_FOUND);
       
        const prestamista: PrestamistaEntity = await this.prestamistaRepository.findOne({where: {id: prestamistaId}, relations: ["recursos"]});
        if (!prestamista)
          throw new BusinessLogicException("El prestamista con el id proporcionado no fue encontrado", BusinessError.NOT_FOUND);
     
        prestamista.recursos = [...prestamista.recursos, recurso];
        return await this.prestamistaRepository.save(prestamista);
      }
     
    async findRecursoByPrestamistaIdRecursoId(prestamistaId: string, recursoId: string): Promise<RecursoEntity> {
        const recurso: RecursoEntity = await this.recursoRepository.findOne({where: {id: recursoId}});
        if (!recurso)
          throw new BusinessLogicException("El recurso con el id proporcionado no fue encontrado", BusinessError.NOT_FOUND);
        
        const prestamista: PrestamistaEntity = await this.prestamistaRepository.findOne({where: {id: prestamistaId}, relations: ["recursos"]}); 
        if (!prestamista)
          throw new BusinessLogicException("El prestamista con el id proporcionado no fue encontrado", BusinessError.NOT_FOUND);
    
        const prestamistaRecurso: RecursoEntity = prestamista.recursos.find(e => e.id === recurso.id);
    
        if (!prestamistaRecurso)
          throw new BusinessLogicException("El recurso con el id proporcionado no está asociado al prestamista", BusinessError.PRECONDITION_FAILED);
    
        return prestamistaRecurso;
    }
     
    async findRecursosByPrestamistaId(prestamistaId: string): Promise<RecursoEntity[]> {
        const prestamista: PrestamistaEntity = await this.prestamistaRepository.findOne({where: {id: prestamistaId}, relations: ["recursos"]});
        if (!prestamista)
          throw new BusinessLogicException("El prestamista con el id proporcionado no fue encontrado", BusinessError.NOT_FOUND);
        
        return prestamista.recursos;
    }
     
    async associateRecursosPrestamista(prestamistaId: string, recursos: RecursoEntity[]): Promise<PrestamistaEntity> {
        const prestamista: PrestamistaEntity = await this.prestamistaRepository.findOne({where: {id: prestamistaId}, relations: ["recursos"]});
     
        if (!prestamista)
          throw new BusinessLogicException("El prestamista con el id proporcionado no fue encontrado", BusinessError.NOT_FOUND);
     
        for (let i = 0; i < recursos.length; i++) {
          const recurso: RecursoEntity = await this.recursoRepository.findOne({where: {id: recursos[i].id}});
          if (!recurso)
            throw new BusinessLogicException("El recurso con el id proporcionado no fue encontrado", BusinessError.NOT_FOUND);
        }
     
        prestamista.recursos = recursos;
        return await this.prestamistaRepository.save(prestamista);
      }
     
    async deleteRecursoPrestamista(prestamistaId: string, recursoId: string){
        const recurso: RecursoEntity = await this.recursoRepository.findOne({where: {id: recursoId}});
        if (!recurso)
          throw new BusinessLogicException("El recurso con el id proporcionado no fue encontrado", BusinessError.NOT_FOUND);
     
        const prestamista: PrestamistaEntity = await this.prestamistaRepository.findOne({where: {id: prestamistaId}, relations: ["recursos"]});
        if (!prestamista)
          throw new BusinessLogicException("El prestamista con el id proporcionado no fue encontrado", BusinessError.NOT_FOUND);
     
        const prestamistaRecurso: RecursoEntity = prestamista.recursos.find(e => e.id === recurso.id);
     
        if (!prestamistaRecurso)
            throw new BusinessLogicException("El recurso con el id proporcionado no está asociado al prestamista", BusinessError.PRECONDITION_FAILED);

        prestamista.recursos = prestamista.recursos.filter(e => e.id !== recursoId);
        await this.prestamistaRepository.save(prestamista);
    }   
}
