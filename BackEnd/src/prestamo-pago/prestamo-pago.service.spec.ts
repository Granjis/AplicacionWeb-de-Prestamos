/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PagoEntity } from '../pago/pago.entity';
import { Repository } from 'typeorm';
import { PrestamoEntity } from '../prestamo/prestamo.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PrestamoPagoService } from './prestamo-pago.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('PrestamoPagoService', () => {
  let service: PrestamoPagoService;
  let prestamoRepository: Repository<PrestamoEntity>;
  let pagoRepository: Repository<PagoEntity>;
  let prestamo: PrestamoEntity;
  let pagosList : PagoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PrestamoPagoService],
    }).compile();

    service = module.get<PrestamoPagoService>(PrestamoPagoService);
    prestamoRepository = module.get<Repository<PrestamoEntity>>(getRepositoryToken(PrestamoEntity));
    pagoRepository = module.get<Repository<PagoEntity>>(getRepositoryToken(PagoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    pagoRepository.clear();
    prestamoRepository.clear();

    pagosList = [];
    for(let i = 0; i < 5; i++){
        const pago: PagoEntity = await pagoRepository.save({
        fecha: faker.date.anytime(),
        capital: parseFloat(faker.finance.amount({ min: 0, max: 10, dec: 0 })),
        interes: faker.number.int()
        })
        pagosList.push(pago);
    }

    prestamo = await prestamoRepository.save({
      nombre: faker.commerce.productName(),
      monto: parseFloat(faker.finance.amount({ min: 10, max: 100, dec: 0 })),
      interes: parseFloat(faker.finance.amount({ min: 1, max: 10, dec: 0 })),
      fechainicio: faker.date.past(),
      fechafin: faker.date.future(),
      pagado: faker.datatype.boolean(),
    });

    // Manually associate pagos with prestamo
    for (const pago of pagosList) {
      pago.prestamo = prestamo;
      await pagoRepository.save(pago); // Update the foreign key
  }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPagoPrestamo should add an pago to a prestamo', async () => {
    const newPago: PagoEntity = await pagoRepository.save({
      fecha: faker.date.anytime(),
      capital: parseFloat(faker.finance.amount({ min: 0, max: 10, dec: 0 })),
      interes: faker.number.int()
    });

    const newPrestamo: PrestamoEntity = await prestamoRepository.save({
      nombre: faker.commerce.productName(),
      monto: parseFloat(faker.finance.amount({ min: 10, max: 100, dec: 0 })),
      interes: parseFloat(faker.finance.amount({ min: 1, max: 10, dec: 0 })),
      fechainicio: faker.date.past(),
      fechafin: faker.date.future(),
      pagado: faker.datatype.boolean(),
    })

    const result: PrestamoEntity = await service.addPagoPrestamo(newPrestamo.id, newPago.id);
    
    expect(result.historialpagos.length).toBe(1);
    expect(result.historialpagos[0]).not.toBeNull();
    expect(new Date(result.historialpagos[0].fecha).toISOString().split('T')[0]).toBe(newPago.fecha.toISOString().split('T')[0]);
    expect(result.historialpagos[0].capital).toBe(newPago.capital)
    expect(result.historialpagos[0].interes).toBe(newPago.interes)



  });


  it('addPagoPrestamo should thrown exception for an invalid pago', async () => {
    const newPrestamo: PrestamoEntity = await prestamoRepository.save({
      nombre: faker.commerce.product(),
      monto: parseFloat(faker.finance.amount({ min: 10, max: 100, dec: 0 })),
      interes: parseFloat(faker.finance.amount({ min: 1, max: 10, dec: 0 })),
      fechainicio: faker.date.past(),
      fechafin: faker.date.future(),
      pagado: faker.datatype.boolean(),
    })

    await expect(() => service.addPagoPrestamo(newPrestamo.id, "0")).rejects.toHaveProperty("message", "The pago with the given id was not found");
  });

  it('addPagoPrestamo should throw an exception for an invalid prestamo', async () => {
    const newPago: PagoEntity = await pagoRepository.save({
      fecha: faker.date.anytime(),
      capital: parseFloat(faker.finance.amount({ min: 0, max: 10, dec: 0 })),
      interes: faker.number.int()
    });

    await expect(() => service.addPagoPrestamo("0", newPago.id)).rejects.toHaveProperty("message", "The prestamo with the given id was not found");
  });

  it('findPagoByPrestamoIdPagoId should return pago by prestamo', async () => {
    const pago: PagoEntity = pagosList[0];
    const storedPago: PagoEntity = await service.findPagoByPrestamoIdPagoId(prestamo.id, pago.id)
    expect(storedPago).not.toBeNull();
    
    expect(new Date(storedPago.fecha).toISOString().split('T')[0]).toBe(pago.fecha.toISOString().split('T')[0]); 
    expect(storedPago.capital).toBe(pago.capital);
    expect(storedPago.interes).toBe(pago.interes);
  });

  it('findPagoByPrestamoIdPagoId should throw an exception for an invalid pago', async () => {
    await expect(()=> service.findPagoByPrestamoIdPagoId(prestamo.id, "0")).rejects.toHaveProperty("message", "The pago with the given id was not found"); 
  });

  it('findPagoByPrestamoIdPagoId should throw an exception for an invalid prestamo', async () => {
    const pago: PagoEntity = pagosList[0]; 
    await expect(()=> service.findPagoByPrestamoIdPagoId("0", pago.id)).rejects.toHaveProperty("message", "The prestamo with the given id was not found"); 
  });

  it('findPagoByPrestamoIdPagoId should throw an exception for an pago not associated to the prestamo', async () => {
    const newPago: PagoEntity = await pagoRepository.save({
      fecha: faker.date.anytime(),
      capital: parseFloat(faker.finance.amount({ min: 0, max: 10, dec: 0 })),
      interes: faker.number.int()
    });

    await expect(()=> service.findPagoByPrestamoIdPagoId(prestamo.id, newPago.id)).rejects.toHaveProperty("message", "The pago with the given id is not associated to the prestamo"); 
  });

  it('findPagosByPrestamoId should return pagos by prestamo', async ()=>{
    const pagos: PagoEntity[] = await service.findPagosByPrestamoId(prestamo.id);
    expect(pagos.length).toBe(5)
  });


  it('findPagosByPrestamoId should throw an exception for an invalid prestamo', async () => {
    await expect(()=> service.findPagosByPrestamoId("0")).rejects.toHaveProperty("message", "The prestamo with the given id was not found"); 
  });

  it('associatePagosPrestamo should update pagos list for a prestamo', async () => {
    const newPago: PagoEntity = await pagoRepository.save({
      fecha: faker.date.anytime(),
      capital: parseFloat(faker.finance.amount({ min: 0, max: 10, dec: 0 })),
      interes: faker.number.int()
    });

    const updatedPrestamo: PrestamoEntity = await service.associatePagosPrestamo(prestamo.id, [newPago]);
    expect(updatedPrestamo.historialpagos.length).toBe(1);

    expect(new Date(updatedPrestamo.historialpagos[0].fecha).toISOString().split('T')[0]).toBe(newPago.fecha.toISOString().split('T')[0]); 
    expect(updatedPrestamo.historialpagos[0].capital).toBe(newPago.capital);
    expect(updatedPrestamo.historialpagos[0].interes).toBe(newPago.interes);


  });

  it('associatePagosPrestamo should throw an exception for an invalid prestamo', async () => {
    const newPago: PagoEntity = await pagoRepository.save({
      fecha: faker.date.anytime(),
      capital: parseFloat(faker.finance.amount({ min: 0, max: 10, dec: 0 })),
      interes: faker.number.int()
    });

    await expect(()=> service.associatePagosPrestamo("0", [newPago])).rejects.toHaveProperty("message", "The prestamo with the given id was not found"); 
  });


  it('deletePagoToPrestamo should remove an pago from a prestamo', async () => {
    const pago: PagoEntity = pagosList[0];
    
    await service.deletePagoPrestamo(prestamo.id, pago.id);

    const storedPrestamo: PrestamoEntity = await prestamoRepository.findOne({where: {id: prestamo.id}, relations: ["historialpagos"]});
    const deletedPago: PagoEntity = storedPrestamo.historialpagos.find(a => a.id === pago.id);

    expect(deletedPago).toBeUndefined();

  });

  it('deletePagoToPrestamo should thrown an exception for an invalid pago', async () => {
    await expect(()=> service.deletePagoPrestamo(prestamo.id, "0")).rejects.toHaveProperty("message", "The pago with the given id was not found"); 
  });

  it('deletePagoToPrestamo should thrown an exception for an invalid prestamo', async () => {
    const pago: PagoEntity = pagosList[0];
    await expect(()=> service.deletePagoPrestamo("0", pago.id)).rejects.toHaveProperty("message", "The prestamo with the given id was not found"); 
  });

  it('deletePagoToPrestamo should thrown an exception for an non asocciated pago', async () => {
    const newPago: PagoEntity = await pagoRepository.save({
      fecha: faker.date.anytime(),
      capital: parseFloat(faker.finance.amount({ min: 0, max: 10, dec: 0 })),
      interes: faker.number.int()
    });

    await expect(()=> service.deletePagoPrestamo(prestamo.id, newPago.id)).rejects.toHaveProperty("message", "The pago with the given id is not associated to the prestamo"); 
  }); 
  
  it('addPagoPrestamo should thrown an exception for a pago higher than the amount',async ()=>{
    const newPago: PagoEntity = await pagoRepository.save({
      fecha: faker.date.anytime(),
      capital: prestamo.monto+1,
      interes: faker.number.int()
    });
    await expect(()=>service.addPagoPrestamo(prestamo.id,newPago.id)).rejects.toHaveProperty("message","The pago.capital can't be higher than prestamo.monto")
  })

});

