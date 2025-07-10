import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrestamoEntity } from '../prestamo/prestamo.entity';
import { PrestamistaEntity } from '../prestamista/prestamista.entity';
import { In, Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { DeudorEntity } from 'src/deudor/deudor.entity';

@Injectable()
export class PrestamistaPrestamoService {
    constructor(
        @InjectRepository(PrestamistaEntity)
        private readonly prestamistaRepository: Repository<PrestamistaEntity>,
     
        @InjectRepository(PrestamoEntity)
        private readonly prestamoRepository: Repository<PrestamoEntity>,

        @InjectRepository(DeudorEntity)
        private readonly deudorRepository: Repository<DeudorEntity>
    ) {}

    async addPrestamoPrestamista(prestamistaId: string, prestamoId: string): Promise<PrestamistaEntity> {
        const prestamo: PrestamoEntity = await this.prestamoRepository.findOne({where: {id: prestamoId}});
        if (!prestamo)
          throw new BusinessLogicException("El préstamo con el id proporcionado no fue encontrado", BusinessError.NOT_FOUND);
       
        const prestamista: PrestamistaEntity = await this.prestamistaRepository.findOne({where: {id: prestamistaId}, relations: ["prestamos"]});
        if (!prestamista)
          throw new BusinessLogicException("El prestamista con el id proporcionado no fue encontrado", BusinessError.NOT_FOUND);
     
        prestamista.prestamos = [...prestamista.prestamos, prestamo];
        return await this.prestamistaRepository.save(prestamista);
      }
     
    async findPrestamoByPrestamistaIdPrestamoId(prestamistaId: string, prestamoId: string): Promise<PrestamoEntity> {
        const prestamo: PrestamoEntity = await this.prestamoRepository.findOne({where: {id: prestamoId}});
        if (!prestamo)
          throw new BusinessLogicException("El préstamo con el id proporcionado no fue encontrado", BusinessError.NOT_FOUND);
        
        const prestamista: PrestamistaEntity = await this.prestamistaRepository.findOne({where: {id: prestamistaId}, relations: ["prestamos"]}); 
        if (!prestamista)
          throw new BusinessLogicException("El prestamista con el id proporcionado no fue encontrado", BusinessError.NOT_FOUND);
    
        const prestamistaPrestamo: PrestamoEntity = prestamista.prestamos.find(e => e.id === prestamo.id);
    
        if (!prestamistaPrestamo)
          throw new BusinessLogicException("El préstamo con el id proporcionado no está asociado al prestamista", BusinessError.PRECONDITION_FAILED);
    
        return prestamistaPrestamo;
    }
     
    async findPrestamosByPrestamistaId(prestamistaId: string): Promise<PrestamoEntity[]> {
        const prestamista: PrestamistaEntity = await this.prestamistaRepository.findOne({where: {id: prestamistaId}, relations: ["prestamos", "prestamos.historialpagos"]});
        if (!prestamista)
          throw new BusinessLogicException("El prestamista con el id proporcionado no fue encontrado", BusinessError.NOT_FOUND);
        return prestamista.prestamos;
    }

    async findDeudoresByPrestamistaId(prestamistaId: string): Promise<{ deudores: DeudorEntity[], interesesGanados: number }> {
      const prestamos: PrestamoEntity[] = await this.findPrestamosByPrestamistaId(prestamistaId);
    
      // Extraer los IDs de los préstamos
      const prestamoIds = prestamos.map(prestamo => prestamo.id);
    
      // Consultar deudores que tienen préstamos con los IDs encontrados
      const deudores: DeudorEntity[] = await this.deudorRepository.find({
        where: {
          prestamos: {
            id: In(prestamoIds)
          }
        },
        relations: ['prestamos'],
      });
    
      let interesesGanados = 0;
    
      prestamos.forEach(prestamo => {
        if (prestamo.historialpagos) {
          prestamo.historialpagos.forEach(pago => {
            const fechaHaceUnMes = new Date();
            fechaHaceUnMes.setMonth(fechaHaceUnMes.getMonth() - 1);
      
            if (new Date(pago.fecha) >= fechaHaceUnMes) {
              interesesGanados += pago.interes;
            }
          });
        }
      });
    
      return { deudores, interesesGanados };
    }
    
    
     
    async associatePrestamosPrestamista(prestamistaId: string, prestamos: PrestamoEntity[]): Promise<PrestamistaEntity> {
        const prestamista: PrestamistaEntity = await this.prestamistaRepository.findOne({where: {id: prestamistaId}, relations: ["prestamos"]});
     
        if (!prestamista)
          throw new BusinessLogicException("El prestamista con el id proporcionado no fue encontrado", BusinessError.NOT_FOUND);
     
        for (let i = 0; i < prestamos.length; i++) {
          const prestamo: PrestamoEntity = await this.prestamoRepository.findOne({where: {id: prestamos[i].id}});
          if (!prestamo)
            throw new BusinessLogicException("El préstamo con el id proporcionado no fue encontrado", BusinessError.NOT_FOUND);
        }
     
        prestamista.prestamos = prestamos;
        return await this.prestamistaRepository.save(prestamista);
      }
     
    async deletePrestamoPrestamista(prestamistaId: string, prestamoId: string){
        const prestamo: PrestamoEntity = await this.prestamoRepository.findOne({where: {id: prestamoId}});
        if (!prestamo)
          throw new BusinessLogicException("El préstamo con el id proporcionado no fue encontrado", BusinessError.NOT_FOUND);
     
        const prestamista: PrestamistaEntity = await this.prestamistaRepository.findOne({where: {id: prestamistaId}, relations: ["prestamos"]});
        if (!prestamista)
          throw new BusinessLogicException("El prestamista con el id proporcionado no fue encontrado", BusinessError.NOT_FOUND);
     
        const prestamistaPrestamo: PrestamoEntity = prestamista.prestamos.find(e => e.id === prestamo.id);
     
        if (!prestamistaPrestamo)
            throw new BusinessLogicException("El préstamo con el id proporcionado no está asociado al prestamista", BusinessError.PRECONDITION_FAILED);

        prestamista.prestamos = prestamista.prestamos.filter(e => e.id !== prestamoId);
        await this.prestamistaRepository.save(prestamista);
    }   
}
