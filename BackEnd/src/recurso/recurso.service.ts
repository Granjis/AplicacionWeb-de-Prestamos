import {  Injectable } from '@nestjs/common';
import { RecursoEntity } from './recurso.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';

@Injectable()
export class RecursoService 
{
    constructor
    (
        @InjectRepository(RecursoEntity)
        private readonly recursoRepository: Repository<RecursoEntity>
    ){}
    
    
    async findAll(): Promise<RecursoEntity[]> 
    {
        //Se carga el recurso con sus prestamos actuales.
        return await this.recursoRepository.find({ relations: ['prestamos'] });
    }

    async findOne(id: string): Promise<RecursoEntity> 
    {
        const recurso: RecursoEntity = await this.recursoRepository.findOne({where: {id}, relations: ['prestamos'] } );
        // Se verifica que el recurso exista.
        if (!recurso)
          throw new BusinessLogicException("No se encontro el recurso con el Id dado", BusinessError.NOT_FOUND);
        
        return recurso;
    }

    async create(recurso: RecursoEntity): Promise<RecursoEntity> 
    {
        //Se verifica que el valor del recurso no sea negativo.
        if(recurso.valor <= 0)
            throw new BusinessLogicException("El valor del recurso no es valido", BusinessError.BAD_REQUEST);
        
        //Se verifica que el recurso tenga un nombre y tipo
        else if(recurso.tipo === ""  || recurso.nombre === '')
            throw new BusinessLogicException("Falta información para el recurso", BusinessError.BAD_REQUEST);
        
        return await this.recursoRepository.save(recurso);
    }

    async update(id: string, recurso: RecursoEntity): Promise<RecursoEntity> 
    {
        const persistedrecurso: RecursoEntity = await this.recursoRepository.findOne({where:{id}});
        // Se verifica que el recurso exista.
        if (!persistedrecurso)
          throw new BusinessLogicException("No se encontro el recurso con el Id dado", BusinessError.NOT_FOUND);
        //Se verifica que el valor del recurso no sea negativo.
        else if(recurso.valor <= 0)
            throw new BusinessLogicException("El valor del recurso no es valido", BusinessError.BAD_REQUEST);
        //Se verifica que el recurso tenga un nombre y tipo.
        else if(recurso.tipo === "" || recurso.tipo === '' || recurso.nombre === '' || recurso.descripcion === '')
            throw new BusinessLogicException("Falta información para crear el recurso", BusinessError.BAD_REQUEST);
            
        return await this.recursoRepository.save({...persistedrecurso, ...recurso});
    }

    async delete(id: string) 
    {
        const recurso: RecursoEntity = await this.recursoRepository.findOne({where:{id}, relations: ['prestamos']});
        // Se verifica que el recurso exista.
        if (!recurso)
          throw new BusinessLogicException("No se encontro el recurso con el Id dado", BusinessError.NOT_FOUND);
        
        await this.recursoRepository.remove(recurso);
    }
}
