import { Test, TestingModule } from '@nestjs/testing';
import { RecursoService } from './recurso.service';
import { Repository } from 'typeorm';
import { RecursoEntity } from './recurso.entity';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';


describe('RecursoService', () => {
  let service: RecursoService;
  let repository: Repository<RecursoEntity>;
  let recursosList: RecursoEntity[];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RecursoService],
    }).compile();

    service = module.get<RecursoService>(RecursoService);
    repository = module.get<Repository<RecursoEntity>>(getRepositoryToken(RecursoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
  
  repository.clear();
  recursosList = [];
    for (let i = 0; i < 5; i++) 
    {
      const recurso: RecursoEntity = await repository.save({
        nombre: faker.commerce.productName(),
        tipo: faker.commerce.productAdjective (),
        descripcion: faker.commerce.productDescription(),
        valor: parseFloat(faker.finance.amount({ min: 100, max: 1000, dec: 0 })),
      });
      recursosList.push(recurso);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
  it('Debería retornar una lista con todos los recursos', async () =>
     {
      const recursos: RecursoEntity[] = await service.findAll();
      expect(recursos).not.toBeNull();
      expect(recursos).toHaveLength(recursosList.length);
     });
    });
  
  describe('findOne(recursoId)', () => {
    it('Debería retornar el recurso con el Id dado', async () =>
    {
      const recurso: RecursoEntity = await service.findOne(recursosList[0].id);
      expect(recurso).not.toBeNull();
      expect(recurso.nombre).toEqual(recursosList[0].nombre);
      expect(recurso.tipo).toEqual(recursosList[0].tipo);
      expect(recurso.descripcion).toEqual(recursosList[0].descripcion);
      expect(recurso.valor).toEqual(recursosList[0].valor);
    });
    
    it('Debería lanzar una excepción si el recurso no existe', async () =>
    {
      await expect(() => service.findOne('666')).rejects.toHaveProperty('message', 'No se encontro el recurso con el Id dado');
    });
  });

  describe('create(recurso)', () => {
    it('Debería crear un nuevo recurso', async () =>
    {
      const recursoCrear: RecursoEntity = {
        id: "7",
        nombre: faker.commerce.productName(),
        tipo: faker.commerce.productAdjective (),
        descripcion: faker.commerce.productDescription(),
        valor: parseFloat(faker.finance.amount({ min: 100, max: 1000, dec: 0 })),
        prestamista: null,
        prestamos: [],
      }
      const newRecurso: RecursoEntity = await service.create(recursoCrear);
      expect(newRecurso).not.toBeNull();
      expect(newRecurso.nombre).toEqual(recursoCrear.nombre);
      expect(newRecurso.tipo).toEqual(recursoCrear.tipo);
      expect(newRecurso.descripcion).toEqual(recursoCrear.descripcion);
      expect(newRecurso.valor).toEqual(recursoCrear.valor);
    });

    it('Debería lanzar una excepción si el valor del recurso no es valido', async () =>
    {
      const recursoCrear: RecursoEntity = {
        id: "",
        nombre: faker.commerce.productName(),
        tipo: faker.commerce.productAdjective (),
        descripcion: faker.commerce.productDescription(),
        valor: -1,
        prestamista: null,
        prestamos: [],
      }
      await expect(() => service.create(recursoCrear)).rejects.toHaveProperty('message', 'El valor del recurso no es valido');
    });

    it('Debería lanzar una excepción si falta información para el recurso', async () =>
    {
      const recursoCrear: RecursoEntity = {
        id: "",
        nombre: "",
        tipo: "",
        descripcion: faker.commerce.productDescription(),
        valor: parseFloat(faker.finance.amount({ min: 100, max: 1000, dec: 0 })),
        prestamista: null,
        prestamos: [],
      }
      await expect(() => service.create(recursoCrear)).rejects.toHaveProperty('message', 'Falta información para el recurso');
    });
  });

  describe('update(recursoId, recurso)', () => {
    it('Debería modificar el recurso con el Id dado correctamente', async () =>
    {
      const recursoModificar: RecursoEntity = recursosList[0];
      recursoModificar.nombre = "Vibranium";
      recursoModificar.tipo = "Metal";
      recursoModificar.descripcion = "El recurso mas valioso de la tierra";
      recursoModificar.valor = 999;
      const recursoModificado: RecursoEntity = await service.update(recursoModificar.id, recursoModificar);
      expect(recursoModificado).not.toBeNull();
      expect(recursoModificado.nombre).toEqual(recursoModificar.nombre);
      expect(recursoModificado.tipo).toEqual(recursoModificar.tipo);
      expect(recursoModificado.descripcion).toEqual(recursoModificar.descripcion);
      expect(recursoModificado.valor).toEqual(recursoModificar.valor);
    });

    it('Debería lanzar una excepción si el recurso no existe', async () =>
    {
      const recursoModificar: RecursoEntity = {
        id: "666",
        nombre: "Vibranium",
        tipo: "Metal",
        descripcion: "El recurso mas valioso de la tierra",
        valor: 999,
        prestamista: null,
        prestamos: [],
      }
      await expect(() => service.update(recursoModificar.id, recursoModificar)).rejects.toHaveProperty('message', 'No se encontro el recurso con el Id dado');
    });

    it('Debería lanzar una excepción si el valor del recurso no es valido', async () =>
    {
      const recursoModificar: RecursoEntity = recursosList[0];
      recursoModificar.valor = -1;
      await expect(() => service.update(recursoModificar.id, recursoModificar)).rejects.toHaveProperty('message', 'El valor del recurso no es valido');
    });

    it('Debería lanzar una excepción si falta información para el recurso', async () =>
    {
      const recursoModificar: RecursoEntity = recursosList[0];
      recursoModificar.nombre = "";
      recursoModificar.tipo = "";
      await expect(() => service.update(recursoModificar.id, recursoModificar)).rejects.toHaveProperty('message', 'Falta información para crear el recurso');
    });
  });

  describe('delete(recursoId)', () => 
  {
    it('Debería eliminar el recurso con el Id dado correctamente', async () =>
    {
      const recursoEliminar: RecursoEntity = recursosList[0];
      await service.delete(recursoEliminar.id);
      const recursoEliminado: RecursoEntity = await repository.findOne({ where: { id: recursoEliminar.id } });
      expect(recursoEliminado).toBeNull();
    });

    it('Debería lanzar una excepción si el recurso no existe', async () =>
    {
      await expect(() => service.delete('666')).rejects.toHaveProperty('message', 'No se encontro el recurso con el Id dado');
    });
  });
});
