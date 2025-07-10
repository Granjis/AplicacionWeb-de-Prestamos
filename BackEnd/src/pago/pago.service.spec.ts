/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PagoEntity } from './pago.entity';
import { PagoService } from './pago.service';

import { faker } from '@faker-js/faker';
import { PrestamoEntity } from 'src/prestamo/prestamo.entity';

describe('PagoService', () => {
  let service: PagoService;
  let repository: Repository<PagoEntity>;
  let pagosList: PagoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PagoService],
    }).compile();

    service = module.get<PagoService>(PagoService);
    repository = module.get<Repository<PagoEntity>>(getRepositoryToken(PagoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    pagosList = [];
    for(let i = 0; i < 5; i++){
        const pago: PagoEntity = await repository.save({
        fecha: faker.date.anytime(),
        capital: faker.number.int(),
        interes: faker.number.int()})
        pagosList.push(pago);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all pagos', async () => {
    const pagos: PagoEntity[] = await service.findAll();
    expect(pagos).not.toBeNull();
    expect(pagos).toHaveLength(pagosList.length);
  });

  it('findOne should return a pago by id', async () => {
    const storedPago: PagoEntity = pagosList[0];
    const pago: PagoEntity = await service.findOne(storedPago.id);
    expect(pago).not.toBeNull();
    expect(new Date(pago.fecha).toISOString().split('T')[0]).toEqual(storedPago.fecha.toISOString().split('T')[0]);
    expect(pago.capital).toEqual(storedPago.capital)
    expect(pago.interes).toEqual(storedPago.interes)
  });
 
  it('findOne should throw an exception for an invalid pago', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The pago with the given id was not found")
  });


  it('update should modify a pago', async () => {
    const pago: PagoEntity = pagosList[0];
    pago.capital = 300000;
    pago.interes = 30000;
  
    const updatedPago: PagoEntity = await service.update(pago.id, pago);
    expect(updatedPago).not.toBeNull();
  
    const storedPago: PagoEntity = await repository.findOne({ where: { id: pago.id } })
    expect(storedPago).not.toBeNull();
    expect(storedPago.capital).toEqual(pago.capital)
    expect(storedPago.interes).toEqual(pago.interes)
  });

  it('update should throw an exception for an invalid pago', async () => {
    let pago: PagoEntity = pagosList[0];
    pago = {
      ...pago, capital: 300000, interes: 30000
    }
    await expect(() => service.update("0", pago)).rejects.toHaveProperty("message", "The pago with the given id was not found")
  });
  
  it('delete should remove a pago', async () => {
    const pago: PagoEntity = pagosList[0];
    await service.delete(pago.id);
  
    const deletedPago: PagoEntity = await repository.findOne({ where: { id: pago.id } })
    expect(deletedPago).toBeNull();
  });

  it('delete should throw an exception for an invalid pago', async () => {
    const pago: PagoEntity = pagosList[0];
    await service.delete(pago.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The pago with the given id was not found")
  });

  
});