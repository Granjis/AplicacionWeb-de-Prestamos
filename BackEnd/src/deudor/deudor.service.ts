import { Injectable } from '@nestjs/common';
import { DeudorEntity } from './deudor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { PrestamoEntity } from '../prestamo/prestamo.entity';



@Injectable()
export class DeudorService {
  constructor(
    @InjectRepository(DeudorEntity)
    private readonly deudorRepository: Repository<DeudorEntity>,
    @InjectRepository(PrestamoEntity)
    private readonly prestamoRepository: Repository<PrestamoEntity>
  ) { }
  async findAll(): Promise<DeudorEntity[]> {
    return await this.deudorRepository.find({ relations: ["prestamos"] });
  }
  async calcularDeudaTotal(deudorID: string): Promise<number> {
    const deudor: DeudorEntity = await this.deudorRepository.findOne({ where: { id: deudorID }, relations: ["prestamos", "prestamos.historialpagos"] });
    if (!deudor)
      throw new BusinessLogicException("The deudor with the given id was not found", BusinessError.NOT_FOUND);

    let deudaTotal: number = 0;
    for (let i = 0; i < deudor.prestamos.length; i++) {
      deudaTotal += deudor.prestamos[i].monto;
    }
    return deudaTotal;
  }
  async findOne(id: string): Promise<DeudorEntity> {
    const deudor: DeudorEntity = await this.deudorRepository.findOne({ where: { id }, relations: ["prestamos.historialpagos"] });
    if (!deudor) {
      throw new BusinessLogicException("The deudor with the given id was not found", BusinessError.NOT_FOUND);
    }
    return deudor;
  }
  async create(deudor: DeudorEntity): Promise<DeudorEntity> {
    return await this.deudorRepository.save(deudor);
  }
  async update(id: string, deudor: DeudorEntity): Promise<DeudorEntity> {
    const persistedDeudor: DeudorEntity = await this.deudorRepository.findOne({ where: { id } });
    if (!persistedDeudor)
      throw new BusinessLogicException("The deudor with the given id was not found", BusinessError.NOT_FOUND);

    return await this.deudorRepository.save({ ...persistedDeudor, ...deudor });
  }
  async delete(id: string) {
    const deudor: DeudorEntity = await this.deudorRepository.findOne({ where: { id }, relations: ["prestamos"] });
    if (!deudor)
      throw new BusinessLogicException("The deudor with the given id was not found", BusinessError.NOT_FOUND);

    await this.prestamoRepository.remove(deudor.prestamos);

    await this.deudorRepository.remove(deudor);
  }

}
