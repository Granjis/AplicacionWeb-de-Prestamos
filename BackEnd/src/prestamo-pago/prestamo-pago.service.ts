import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PagoEntity } from '../pago/pago.entity';
import { PrestamoEntity } from 'src/prestamo/prestamo.entity';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class PrestamoPagoService {

  constructor(
    @InjectRepository(PrestamoEntity)
    private readonly prestamoRepository: Repository<PrestamoEntity>,

    @InjectRepository(PagoEntity)
    private readonly pagoRepository: Repository<PagoEntity>

  ) { }

  async addPagoPrestamo(prestamoId: string, pagoId: string): Promise<PrestamoEntity> {
    const pago: PagoEntity = await this.pagoRepository.findOne({ where: { id: pagoId } });
    if (!pago)
      throw new BusinessLogicException("The pago with the given id was not found", BusinessError.NOT_FOUND);

    const prestamo: PrestamoEntity = await this.prestamoRepository.findOne({ where: { id: prestamoId }, relations: ["historialpagos"] })
    if (!prestamo)
      throw new BusinessLogicException("The prestamo with the given id was not found", BusinessError.NOT_FOUND);
    var totalPagosCapital = pago.capital;

    for(let i = 0; i < prestamo.historialpagos.length; i++) {
      totalPagosCapital=prestamo.historialpagos[i].capital+totalPagosCapital;
    }
    if (prestamo.monto < totalPagosCapital) {
      throw new BusinessLogicException("The pago.capital can't be higher than prestamo.monto", BusinessError.NOT_FOUND);
    }
    if (prestamo.monto < pago.capital) {
      throw new BusinessLogicException("The pago.capital can't be higher than prestamo.monto", BusinessError.NOT_FOUND);
    }
    prestamo.historialpagos = [...prestamo.historialpagos, pago];
    return await this.prestamoRepository.save(prestamo);
  }

  async findPagoByPrestamoIdPagoId(prestamoId: string, pagoId: string): Promise<PagoEntity> {
    const pago: PagoEntity = await this.pagoRepository.findOne({ where: { id: pagoId } });
    if (!pago)
      throw new BusinessLogicException("The pago with the given id was not found", BusinessError.NOT_FOUND)

    const prestamo: PrestamoEntity = await this.prestamoRepository.findOne({ where: { id: prestamoId }, relations: ["historialpagos"] });
    if (!prestamo)
      throw new BusinessLogicException("The prestamo with the given id was not found", BusinessError.NOT_FOUND)

    const prestamoPago: PagoEntity = prestamo.historialpagos.find(e => e.id === pago.id);

    if (!prestamoPago)
      throw new BusinessLogicException("The pago with the given id is not associated to the prestamo", BusinessError.PRECONDITION_FAILED)

    return prestamoPago;
  }

  async findPagosByPrestamoId(prestamoId: string): Promise<PagoEntity[]> {
    const prestamo: PrestamoEntity = await this.prestamoRepository.findOne({ where: { id: prestamoId }, relations: ["historialpagos"] });
    if (!prestamo)
      throw new BusinessLogicException("The prestamo with the given id was not found", BusinessError.NOT_FOUND)

    return prestamo.historialpagos;
  }

  async associatePagosPrestamo(prestamoId: string, pagos: PagoEntity[]): Promise<PrestamoEntity> {
    const prestamo: PrestamoEntity = await this.prestamoRepository.findOne({ where: { id: prestamoId }, relations: ["historialpagos"] });
    
    if (!prestamo)
      throw new BusinessLogicException("The prestamo with the given id was not found", BusinessError.NOT_FOUND)

    for (let i = 0; i < pagos.length; i++) {
      const pago: PagoEntity = await this.pagoRepository.findOne({ where: { id: pagos[i].id } });
      if (!pago) {
        throw new BusinessLogicException("The pago with the given id was not found", BusinessError.NOT_FOUND)
      }
      var totalPagosCapital = 0;
      for(i = 0; i < pagos.length; i++) {
        totalPagosCapital=prestamo.historialpagos[i].capital+totalPagosCapital;
      }
      if (prestamo.monto < totalPagosCapital) {
        throw new BusinessLogicException("The pago.capital can't be higher than prestamo.monto", BusinessError.NOT_FOUND);
      }
    }
    prestamo.historialpagos = pagos;
    return await this.prestamoRepository.save(prestamo);
  }

  async deletePagoPrestamo(prestamoId: string, pagoId: string) {
    const pago: PagoEntity = await this.pagoRepository.findOne({ where: { id: pagoId } });
    if (!pago)
      throw new BusinessLogicException("The pago with the given id was not found", BusinessError.NOT_FOUND)

    const prestamo: PrestamoEntity = await this.prestamoRepository.findOne({ where: { id: prestamoId }, relations: ["historialpagos"] });
    if (!prestamo)
      throw new BusinessLogicException("The prestamo with the given id was not found", BusinessError.NOT_FOUND)

    const prestamoPago: PagoEntity = prestamo.historialpagos.find(e => e.id === pago.id);

    if (!prestamoPago) {
      throw new BusinessLogicException("The pago with the given id is not associated to the prestamo", BusinessError.PRECONDITION_FAILED)
    };
    prestamo.monto += pago.capital;
    prestamo.historialpagos = prestamo.historialpagos.filter(e => Number(e.id) !== Number(pagoId))
    await this.prestamoRepository.save(prestamo);
  }
}