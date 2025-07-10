import { Test, TestingModule } from '@nestjs/testing';
import { PrestamoController } from './prestamo.controller';
import { PrestamoService } from './prestamo.service';
import { PrestamoEntity } from './prestamo.entity';
import { DeudorEntity } from '../deudor/deudor.entity';

describe('PrestamoController', () => {
    let controller: PrestamoController;
    let service: PrestamoService;

    const mockDeudor: DeudorEntity = {
        id: '1',
        nombrecompleto: 'Armando Laverde',
        email: 'alaverde@uniandes.edu.cm',
        situacionLaboral: 'empleado',
        cedula: '1000707468',
        fecha: new Date(),
        foto: 'foto_armando.jpg',
        ocupacion: 'Constructor',
        direccion: 'Avenida Sur 123',
        telefono: '3001234567',
        prestamos: [],
    };

    const mockPrestamo: PrestamoEntity = {
        id: '1',
        nombre: 'Préstamo Personal',
        monto: 5000,
        interes: 5,
        fechainicio: new Date('2024-01-01'),
        fechafin: new Date('2024-12-31'),
        pagado: false,
        deudor: mockDeudor,
        prestamista: null,
        historialpagos: [],
        recurso: null,
    };

    const mockPrestamos: PrestamoEntity[] = [
        mockPrestamo,
        {
            ...mockPrestamo,
            id: '2',
            nombre: 'Préstamo Vehículo',
            monto: 20000,
        },
    ];

    const mockService = {
        findAll: jest.fn(() => Promise.resolve(mockPrestamos)),
        findOne: jest.fn((id: string) =>
            Promise.resolve(mockPrestamos.find((p) => p.id === id) || null)
        ),
        create: jest.fn((prestamo: PrestamoEntity) =>
            Promise.resolve({ ...prestamo, id: '3' })
        ),
        update: jest.fn((id: string, prestamo: Partial<PrestamoEntity>) => {
            const existingPrestamo = mockPrestamos.find((p) => p.id === id);
            if (!existingPrestamo) return Promise.resolve(null);
            const updatedPrestamo = { ...existingPrestamo, ...prestamo };
            return Promise.resolve(updatedPrestamo);
        }),
        delete: jest.fn(() => Promise.resolve()),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PrestamoController],
            providers: [
                {
                    provide: PrestamoService,
                    useValue: mockService,
                },
            ],
        }).compile();

        controller = module.get<PrestamoController>(PrestamoController);
        service = module.get<PrestamoService>(PrestamoService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of prestamos', async () => {
            const result = await controller.findAll();
            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockPrestamos);
        });
    });

    describe('findOne', () => {
        it('should return a single prestamo', async () => {
            const result = await controller.findOne('1');
            expect(service.findOne).toHaveBeenCalledWith('1');
            expect(result).toEqual(mockPrestamo);
        });

        it('should return null if prestamo is not found', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);
            const result = await controller.findOne('nonexistent');
            expect(service.findOne).toHaveBeenCalledWith('nonexistent');
            expect(result).toBeNull();
        });
    });

    describe('create', () => {
        it('should create a new prestamo', async () => {
            const prestamoDto: Partial<PrestamoEntity> = {
                nombre: 'Nuevo Préstamo',
                monto: 10000,
                interes: 3,
                fechainicio: new Date('2024-02-01'),
                fechafin: new Date('2025-01-31'),
                pagado: false,
                deudor: mockDeudor,
            };
            const result = await controller.create(prestamoDto as PrestamoEntity);
            expect(service.create).toHaveBeenCalledWith(expect.objectContaining(prestamoDto));
            expect(result).toEqual({ ...prestamoDto, id: '3' });
        });
    });

    describe('update', () => {
        it('should update an existing prestamo', async () => {
            const prestamoDto: Partial<PrestamoEntity> = {
                nombre: 'Préstamo Actualizado',
                monto: 8000,
            };
            const result = await controller.update('1', prestamoDto as PrestamoEntity);
            expect(service.update).toHaveBeenCalledWith(
                '1',
                expect.objectContaining(prestamoDto)
            );
            expect(result).toEqual({ ...mockPrestamo, ...prestamoDto });
        });
    });

    describe('delete', () => {
        it('should delete an existing prestamo', async () => {
            const result = await controller.delete('1');
            expect(service.delete).toHaveBeenCalledWith('1');
            expect(result).toBeUndefined();
        });
    });
});
