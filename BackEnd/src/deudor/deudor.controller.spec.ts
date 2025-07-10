import { Test, TestingModule } from '@nestjs/testing';
import { DeudorController } from './deudor.controller';
import { DeudorService } from './deudor.service';
import { DeudorEntity } from './deudor.entity';
import { DeudorDto } from './deudor.dto';

describe('DeudorController', () => {
    let controller: DeudorController;
    let service: DeudorService;

    const mockDeudor: DeudorEntity = {
        id: '1',
        nombrecompleto: 'Juan Perez',
        email: 'jorgebtm26@gmail.com',
        situacionLaboral: 'estudiante',
        cedula: '123456789',
        fecha: new Date(),
        foto: 'foto.png',
        ocupacion: 'estudiante',
        direccion: 'Calle Falsa 123',
        telefono: '123456789',
        prestamos: [],
    };

    const mockDeudores: DeudorEntity[] = [
        mockDeudor,
        {
            id: '2',
            nombrecompleto: 'Maria Lopez',
            direccion: 'Calle Verdadera 456',
            cedula: '987654321',
            email: 'jorgebtm26@gmail.com',
            fecha: new Date(),
            foto: 'foto.png',
            situacionLaboral: 'estudiante',
            ocupacion: 'estudiante',
            telefono: '987654321',
            prestamos: [],
        },
    ];

    const mockService = {
        findAll: jest.fn(() => Promise.resolve(mockDeudores)),
        findOne: jest.fn((id: string) => {const deudor = mockDeudores.find((d) => d.id === id)
            const deudaTotal = 1000;
            return Promise.resolve(deudor ? {...deudor, deudaTotal} : undefined);
        }),
        create: jest.fn((deudor: DeudorEntity) => Promise.resolve({ ...deudor, id: '3' })),
        update: jest.fn((id: string, deudor: DeudorEntity) =>
            Promise.resolve({ ...deudor, id })
        ),
        delete: jest.fn(() => Promise.resolve()),
        calcularDeudaTotal: jest.fn((id: string) => {
            const deudor = mockDeudores.find((d) => d.id === id);
            return Promise.resolve(deudor ? 1000 : undefined);
        })
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DeudorController],
            providers: [
                {
                    provide: DeudorService,
                    useValue: mockService,
                },
            ],
        }).compile();

        controller = module.get<DeudorController>(DeudorController);
        service = module.get<DeudorService>(DeudorService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of deudores', async () => {
            const result = await controller.findAll();
            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockDeudores);
        });
    });

    describe('findOne', () => {
        it('should return a single deudor', async () => {
            const result = await controller.findOne('1');
            expect(service.findOne).toHaveBeenCalledWith('1');
            expect(result).toEqual({ ...mockDeudor, deudaTotal: 1000 });
        });

        it('should return undefined if deudor is not found', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(undefined);
            const result = await controller.findOne('nonexistent');
            expect(service.findOne).toHaveBeenCalledWith('nonexistent');
            expect(result).toStrictEqual({"deudaTotal": undefined});
        });
    });

    describe('create', () => {
        it('should create a new deudor', async () => {
            const deudorDto: DeudorDto = {
                nombrecompleto: 'Carlos Ruiz',
                email:'jorgebtm26@gmail.com',
                cedula: '123123123',
                fecha: new Date(),
                foto:'foto.png',
                ocupacion:'estudiante',
                direccion: 'Nueva Calle 789',
                telefono: '123123123',
            };
            const result = await controller.create(deudorDto);

            expect(service.create).toHaveBeenCalledWith(expect.objectContaining(deudorDto));
            expect(result).toEqual({ ...deudorDto, id: '3' });
        });
    });

    describe('update', () => {
        it('should update an existing deudor', async () => {
            const deudorDto: DeudorDto = {
                nombrecompleto: 'Juan Perez Actualizado',
                email:'jorgebtm26@gmail.com',
                cedula: '111111111',
                foto:'foto.png',
                ocupacion:'estudiante',
                fecha: new Date(),
                direccion: 'Calle Falsa 999',
                telefono: '111111111',
            };
            const result = await controller.update('1', deudorDto);

            expect(service.update).toHaveBeenCalledWith(
                '1',
                expect.objectContaining(deudorDto)
            );
            expect(result).toEqual({ ...deudorDto, id: '1' });
        });
    });

    describe('delete', () => {
        it('should delete an existing deudor', async () => {
            const result = await controller.delete('1');
            expect(service.delete).toHaveBeenCalledWith('1');
            expect(result).toBeUndefined();
        });
    });
});
