import { Test, TestingModule } from '@nestjs/testing';
import { RecursoPrestamoService } from './recurso-prestamo.service';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { RecursoEntity } from 'src/recurso/recurso.entity';
import { PrestamoEntity } from 'src/prestamo/prestamo.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
describe('RecursoPrestamoService', () => {
  let service: RecursoPrestamoService;
  let recursoRepository: Repository<RecursoEntity>;
  let prestamoRepository: Repository<PrestamoEntity>;
  let recurso: RecursoEntity;
  let prestamoList: PrestamoEntity[];
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RecursoPrestamoService],
    }).compile();

    service = module.get<RecursoPrestamoService>(RecursoPrestamoService);
    recursoRepository = module.get<Repository<RecursoEntity>>(getRepositoryToken(RecursoEntity));
    prestamoRepository = module.get<Repository<PrestamoEntity>>(getRepositoryToken(PrestamoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
  prestamoRepository.clear();
  recursoRepository.clear();
  prestamoList = [];
  for (let i = 0; i < 5; i++) {
    const prestamo: PrestamoEntity = await prestamoRepository.save({
      nombre: faker.commerce.productName(),
      monto: parseFloat(faker.finance.amount({ min: 10, max: 100, dec: 0 })),
      interes: parseFloat(faker.finance.amount({ min: 1, max: 10, dec: 0 })),
      fechainicio: faker.date.past(),
      fechafin: faker.date.future(),
      pagado: faker.datatype.boolean(),
    });
    prestamoList.push(prestamo);
  }
  recurso = await recursoRepository.save({
    nombre: faker.commerce.productName(),
    tipo: faker.commerce.productAdjective (),
    descripcion: faker.commerce.productDescription(),
    valor: parseFloat(faker.finance.amount({ min: 100, max: 1000, dec: 0 })),
    prestamos: prestamoList,
  });
  
}
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addPrestamoRecurso(recursoId, prestamoId)', () => {

      it('Debería asociar el prestamo al recurso dado', async () => 
        {
          const prestamoAuxiliar: PrestamoEntity = await prestamoRepository.save({
            nombre: faker.commerce.productName(),
            monto: parseFloat(faker.finance.amount({ min: 10, max: 100, dec: 0 })),
            interes: parseFloat(faker.finance.amount({ min: 1, max: 10, dec: 0 })),
            fechainicio: faker.date.past(),
            fechafin: faker.date.future(),
            pagado: faker.datatype.boolean(),
          });
          const recursoAuxiliar: RecursoEntity = await recursoRepository.save({
            nombre: faker.commerce.productName(),
            tipo: faker.commerce.productAdjective (),
            descripcion: faker.commerce.productDescription(),
            valor: parseFloat(faker.finance.amount({ min: 100, max: 1000, dec: 0 })),
          });

          const recursoAsociado = await service.addPrestamoRecurso(recursoAuxiliar.id, prestamoAuxiliar.id);
          expect(recursoAsociado.prestamos).toHaveLength(1);
          expect(recursoAsociado).not.toBeNull();
          expect(recursoAsociado.prestamos[0]).toEqual(prestamoAuxiliar);
        });
      
      it('Debería lanzar una excepción si el recurso no existe', async () =>
      {
        await expect(() => service.addPrestamoRecurso('666', prestamoList[0].id)).rejects.toHaveProperty('message', 'No se encontro el recurso con el Id dado');
      });

      it('Debería lanzar una excepción si el prestamo no existe', async () =>
      {
        await expect(() => service.addPrestamoRecurso(recurso.id, '666')).rejects.toHaveProperty('message', 'No se encontro el prestamo con el Id dado');
      });

      it('Debería lanzar una excepción si el monto del prestamo supera el valor del recurso disponible', async () =>
      {
        const prestamoAuxiliar: PrestamoEntity = await prestamoRepository.save({ 
          nombre: faker.commerce.productName(),
          monto: recurso.valor + 1,
          interes: parseFloat(faker.finance.amount({ min: 1, max: 10, dec: 0 })),
          fechainicio: faker.date.past(),
          fechafin: faker.date.future(),
          pagado: faker.datatype.boolean(),
        });
        await expect(() => service.addPrestamoRecurso(recurso.id, prestamoAuxiliar.id)).rejects.toHaveProperty('message', 'El monto del prestamo supera el valor del recurso disponible');
      });
  });

  describe('findPrestamoByRecursoIdPrestamoId(recursoId, prestamoId)', () => 
  {
    it('Debería retornar el prestamo asociado al recurso', async () =>
    {
      const prestamo: PrestamoEntity = await service.findPrestamoByRecursoIdPrestamoId(recurso.id, prestamoList[0].id);
      expect(prestamo).not.toBeNull();
      expect(prestamo.monto).toEqual(prestamoList[0].monto);
      expect(prestamo.interes).toEqual(prestamoList[0].interes);
      expect(prestamo.fechainicio).toEqual(prestamoList[0].fechainicio);
      expect(prestamo.fechafin).toEqual(prestamoList[0].fechafin);
      expect(prestamo.pagado).toEqual(prestamoList[0].pagado);
    });

    it('Debería lanzar una excepción si el recurso no existe', async () =>
    {
      await expect(() => service.findPrestamoByRecursoIdPrestamoId('666', prestamoList[0].id)).rejects.toHaveProperty('message', 'No se encontro el recurso con el Id dado');
    });

    it('Debería lanzar una excepción si el prestamo no existe', async () =>
    {
      await expect(() => service.findPrestamoByRecursoIdPrestamoId(recurso.id, '666')).rejects.toHaveProperty('message', 'No se encontro el prestamo con el Id dado');
    });

    it('Debería lanzar una excepción si el prestamo no esta asociado al recurso', async () =>
    {
      const prestamoAuxiliar: PrestamoEntity = await prestamoRepository.save({
        nombre: faker.commerce.productName(),
        monto: parseFloat(faker.finance.amount({ min: 10, max: 100, dec: 0 })),
        interes: parseFloat(faker.finance.amount({ min: 1, max: 10, dec: 0 })),
        fechainicio: faker.date.past(),
        fechafin: faker.date.future(),
        pagado: faker.datatype.boolean(),
      });
      await expect(() => service.findPrestamoByRecursoIdPrestamoId(recurso.id, prestamoAuxiliar.id)).rejects.toHaveProperty('message', 'El prestamo con el Id dado no esta asociado al recurso');
    });
  });

  describe('findPrestamosByRecursoId(recursoId)', () =>
    {
      it('Debería retornar los prestamos asociados al recurso', async () =>
      {
        const prestamos: PrestamoEntity[] = await service.findPrestamosByRecursoId(recurso.id);
        expect(prestamos).not.toBeNull();
        expect(prestamos.length).toEqual(prestamoList.length);
        expect(prestamos).toEqual(prestamoList);
      });

      it('Debería lanzar una excepción si el recurso no existe', async () =>
      { 
        await expect(() => service.findPrestamosByRecursoId('666')).rejects.toHaveProperty('message', 'No se encontro el recurso con el Id dado');
      });
    });
  
  describe('associatePrestamosRecurso(recursoId, prestamos)', () =>
  { 
    it('Debería asociar los prestamos al recurso dado', async () =>
    {
      let prestamoListAuxiliar : PrestamoEntity[] = [];
      for (let i = 0; i < 2; i++) {
        const prestamo: PrestamoEntity = await prestamoRepository.save({
          nombre: faker.commerce.productName(),
          monto: 10,
          interes: parseFloat(faker.finance.amount({ min: 1, max: 10, dec: 0 })),
          fechainicio: faker.date.past(),
          fechafin: faker.date.future(),
          pagado: faker.datatype.boolean(),
        });
        prestamoListAuxiliar.push(prestamo);
      const recursoActualizado : RecursoEntity = await service.associatePrestamosRecurso(recurso.id, prestamoListAuxiliar);
      expect(recursoActualizado.prestamos).not.toBeNull();
      expect(recursoActualizado.prestamos.length).toEqual(prestamoListAuxiliar.length);
      expect(recursoActualizado.prestamos).toEqual(prestamoListAuxiliar);
      }
    });

    it('Debería lanzar una excepción si el recurso no existe', async () =>
    {
      await expect(() => service.associatePrestamosRecurso('666', prestamoList)).rejects.toHaveProperty('message', 'No se encontro el recurso con el Id dado');
    });

    it('Debería lanzar una excepción si alguno de los prestamos no existe', async () =>
    {
      let prestamoListAuxiliar : PrestamoEntity[] = [];
      for (let i = 0; i < 2; i++) {
        const prestamo: PrestamoEntity ={
          id: "666" + i,
          nombre: faker.commerce.productName(),
          monto: parseFloat(faker.finance.amount({ min: 10, max: 100, dec: 0 })),
          interes: parseFloat(faker.finance.amount({ min: 1, max: 10, dec: 0 })),
          fechainicio: faker.date.past(),
          fechafin: faker.date.future(),
          pagado: faker.datatype.boolean(),
          prestamista: null,
          deudor: null,
          historialpagos: [],
          recurso: null
        };
        prestamoListAuxiliar.push(prestamo);
      }
      await expect(() => service.associatePrestamosRecurso(recurso.id, prestamoListAuxiliar)).rejects.toHaveProperty('message', 'No se encontro alguno de los prestamos con los Id dados');
    });
    
    it('Debería lanzar una excepción si los nuevos montos prestados superan el valor del recurso', async () =>
    { 
      let prestamoListAuxiliar : PrestamoEntity[] = [];
      for (let i = 0; i < 2; i++) {
        const prestamo: PrestamoEntity = await prestamoRepository.save({
          nombre: faker.commerce.productName(),
          monto: recurso.valor + 1,
          interes: parseFloat(faker.finance.amount({ min: 1, max: 10, dec: 0 })),
          fechainicio: faker.date.past(),
          fechafin: faker.date.future(),
          pagado: false,
        });
        prestamoListAuxiliar.push(prestamo);
      }
      await expect(() => service.associatePrestamosRecurso(recurso.id, prestamoListAuxiliar)).rejects.toHaveProperty('message', 'Los montos prestados superan el valor del recurso disponible');
    });
  });
  describe('deletePrestamoRecurso(recursoId, prestamoId)', () =>
  {
    it('Debería desasociar el prestamo del recurso', async () =>
    {
      const prestamoAuxiliar: PrestamoEntity = await prestamoRepository.save({
        nombre: faker.commerce.productName(),
        monto:10,
        interes: parseFloat(faker.finance.amount({ min: 1, max: 10, dec: 0 })),
        fechainicio: faker.date.past(),
        fechafin: faker.date.future(),
        pagado: true,
      });
      const recursoAuxiliar: RecursoEntity = await recursoRepository.save({
        nombre: faker.commerce.productName(),
        tipo: faker.commerce.productAdjective (),
        descripcion: faker.commerce.productDescription(),
        valor: 100,
      });
      await service.addPrestamoRecurso(recursoAuxiliar.id, prestamoAuxiliar.id);
      await service.deletePrestamoRecurso(recursoAuxiliar.id, prestamoAuxiliar.id);
    });

    it('Debería lanzar una excepción si el recurso no existe', async () =>
    {
      await expect(() => service.deletePrestamoRecurso('666', prestamoList[0].id)).rejects.toHaveProperty('message', 'No se encontro el recurso con el Id dado');
    });

    it('Debería lanzar una excepción si el prestamo no existe', async () =>
    {
      await expect(() => service.deletePrestamoRecurso(recurso.id, '666')).rejects.toHaveProperty('message', 'No se encontro el prestamo con el Id dado');
    });

    it('Debería lanzar una excepción si el prestamo no esta asociado al recurso', async () =>
    {
      const prestamoAuxiliar: PrestamoEntity = await prestamoRepository.save({
        nombre: faker.commerce.productName(),
        monto:10,
        interes: parseFloat(faker.finance.amount({ min: 1, max: 10, dec: 0 })),
        fechainicio: faker.date.past(),
        fechafin: faker.date.future(),
        pagado: true,
      });
      const recursoAuxiliar: RecursoEntity = await recursoRepository.save({
        nombre: faker.commerce.productName(),
        tipo: faker.commerce.productAdjective (),
        descripcion: faker.commerce.productDescription(),
        valor: 100,
      });
      await expect(() => service.deletePrestamoRecurso(recursoAuxiliar.id, prestamoAuxiliar.id)).rejects.toHaveProperty('message', 'El prestamo con el Id dado no esta asociado al recurso'); 
    });
    it('Debería lanzar una excepción si el prestamo no esta pagado', async () =>
    {
      const prestamoAuxiliar: PrestamoEntity = await prestamoRepository.save({
        nombre: faker.commerce.productName(),
        monto:10,
        interes: parseFloat(faker.finance.amount({ min: 1, max: 10, dec: 0 })),
        fechainicio: faker.date.past(),
        fechafin: faker.date.future(),
        pagado: false,
      });
      const recursoAuxiliar: RecursoEntity = await recursoRepository.save({
        nombre: faker.commerce.productName(),
        tipo: faker.commerce.productAdjective (),
        descripcion: faker.commerce.productDescription(),
        valor: 100,
      });
      await service.addPrestamoRecurso(recursoAuxiliar.id, prestamoAuxiliar.id); 
      await expect(() => service.deletePrestamoRecurso(recursoAuxiliar.id, prestamoAuxiliar.id)).rejects.toHaveProperty('message', 'El prestamo con el Id dado no esta pagado');
    });
  });

  describe('deleteRecurso(recursoId)', () =>
  {
    it('Debería eliminar el recurso', async () =>
    {
      const recursoAuxiliar: RecursoEntity = await recursoRepository.save({
        nombre: faker.commerce.productName(),
        tipo: faker.commerce.productAdjective (),
        descripcion: faker.commerce.productDescription(),
        valor: 100,
      });
      await service.deleteRecurso(recursoAuxiliar.id);
    });

    it('Debería lanzar una excepción si el recurso no existe', async () =>
    {
      await expect(() => service.deleteRecurso('666')).rejects.toHaveProperty('message', 'No se encontro el recurso con el Id dado');
    });

    it('Debería lanzar una excepción si el recurso tiene prestamos asociados', async () =>
    {
      const prestamoAuxiliar: PrestamoEntity = await prestamoRepository.save({
        nombre: faker.commerce.productName(),
        monto:10,
        interes: parseFloat(faker.finance.amount({ min: 1, max: 10, dec: 0 })),
        fechainicio: faker.date.past(),
        fechafin: faker.date.future(),
        pagado: false,
      });
      const recursoAuxiliar: RecursoEntity = await recursoRepository.save({
        nombre: faker.commerce.productName(),
        tipo: faker.commerce.productAdjective (),
        descripcion: faker.commerce.productDescription(),
        valor: 100,
      });
      await service.addPrestamoRecurso(recursoAuxiliar.id, prestamoAuxiliar.id); 
      await expect(() => service.deleteRecurso(recursoAuxiliar.id)).rejects.toHaveProperty('message', 'No se puede borrar el recurso porque tiene prestamos asociados');
    });
  });
});
